import { iconStyles } from '../../core/icons.js';
import { LwButton } from '../button/button.js';
import buttonStyles from '../button/button.scss?inline';
import styles from './download-button.scss?inline';

const ICON = (name, path) =>
  `<svg class="icon ${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;

const ICONS = [
  ICON('download', 'M12 3v12m-5-5 5 5 5-5M5 21h14'),
  ICON('stop', 'M18 6 6 18M6 6l12 12'),
  ICON('open', 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'),
  ICON('retry', 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5'),
].join('');

const FACE = `<span class="face"><span class="glyph">${ICONS}</span><span class="lines"><span class="name"></span><span class="cancel"></span><span class="meta"></span></span></span>`;

// Starts at kilobytes: "0 kB" reads better than "0 byte" as a download begins.
const UNITS = ['kilobyte', 'megabyte', 'gigabyte'];
const RATE_SMOOTHING = 0.2;

/** Human-readable size in the page's locale, e.g. "2.4 MB". */
const formatBytes = (bytes) => {
  const kilobytes = bytes / 1000;
  const exponent = Math.min(Math.max(Math.floor(Math.log10(Math.max(kilobytes, 1)) / 3), 0), UNITS.length - 1);
  const value = kilobytes / 1000 ** exponent;
  return new Intl.NumberFormat(undefined, {
    style: 'unit',
    unit: UNITS[exponent],
    unitDisplay: 'short',
    maximumFractionDigits: value >= 100 ? 0 : 1,
  }).format(value);
};

const formatSeconds = new Intl.NumberFormat(undefined, { style: 'unit', unit: 'second', unitDisplay: 'narrow' });

/**
 * A download that says what you are getting: name, size and type. Ink fills
 * the button as the file arrives and the text inverts right at its edge, with
 * bytes and time left underneath. Hover or focus to cancel; once done, the
 * file is saved and pressing again opens it.
 *
 * The file is fetched from `href` and streamed for progress. To supply it
 * another way, call `event.detail.respondWith(response)` in `lw-start`
 * with a `Response` or a promise of one; abort it with `event.detail.signal`.
 *
 * @attr {string} href - URL of the file
 * @attr {string} filename - Name shown and used when saving; the last part of `href` by default
 * @attr {string} type - Kind of file shown under the name, e.g. "PDF"
 * @attr {number} size - Size in bytes, shown before the download starts
 * @attr {string} cancel-label
 * @attr {string} open-label
 * @attr {string} failed-label
 * @attr {string} retry-label
 * @attr {string} left-label - After the time estimate, e.g. "left"
 * @attr {'idle'|'downloading'|'done'|'error'} status - Current status (read only)
 * @fires lw-start - Before downloading. `detail.respondWith(response)` supplies the file. Cancelable.
 * @fires lw-complete - When the file has arrived. `detail.blob` holds it. Cancel to skip saving it.
 * @fires lw-cancel - When the download is cancelled
 * @fires lw-error - When the download fails. `detail.error` holds the reason.
 */
export class LwDownloadButton extends LwButton {
  static styles = [buttonStyles, iconStyles, styles];
  static props = {
    ...LwButton.props,
    status: { default: 'idle', reflect: true },
    href: {},
    filename: {},
    type: {},
    size: { type: Number },
    cancelLabel: { default: 'Cancel' },
    openLabel: { default: 'Open' },
    failedLabel: { default: 'Download failed' },
    retryLabel: { default: 'Retry' },
    leftLabel: { default: 'left' },
  };

  #controller = null;
  #url = null;

  render() {
    return `<button class="button" part="button" type="button">${FACE}<span class="ink" aria-hidden="true">${FACE}</span></button><span class="live" aria-live="polite"></span>`;
  }

  connected() {
    super.connected();
    this.signal.addEventListener('abort', () => {
      this.#controller?.abort();
      this.#revoke();
      this.#reset();
    });
  }

  updated(changed) {
    super.updated(changed);
    this.#setText('.cancel', this.cancelLabel);
    this.#setText('.name', this.#filename);
    if (this.status !== 'downloading') this.#describe();
  }

  get #filename() {
    return this.filename ?? decodeURIComponent(this.href?.split(/[?#]/)[0].split('/').pop() ?? '');
  }

  handleClick() {
    if (this.status === 'downloading') this.#controller.abort();
    else if (this.status === 'done') open(this.#url, '_blank', 'noopener');
    else this.#download();
  }

  async #download() {
    const controller = new AbortController();
    const { signal } = controller;
    let response = null;
    if (!this.emit('start', { signal, respondWith: (value) => (response = value) })) return;

    this.#controller = controller;
    this.#revoke();
    this.status = 'downloading';
    this.query('.button').ariaLabel = `${this.cancelLabel}, ${this.#filename}`;
    this.#progress(0, this.size);

    try {
      const blob = await this.#stream(await (response ?? fetch(this.href, { signal })), signal);
      this.#url = URL.createObjectURL(blob);
      this.status = 'done';
      this.#announce(`${this.#filename}, ${this.openLabel}`);
      if (this.emit('complete', { blob })) {
        Object.assign(document.createElement('a'), { href: this.#url, download: this.#filename }).click();
      }
    } catch (error) {
      if (signal.aborted) {
        this.#reset();
        this.emit('cancel');
        return;
      }
      this.status = 'error';
      this.#announce(this.failedLabel);
      this.emit('error', { error });
    } finally {
      this.#controller = null;
    }
  }

  // Reads the body chunk by chunk to report progress and the time left.
  async #stream(response, signal) {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const total = Number(response.headers.get('content-length')) || this.size || 0;
    const reader = response.body.getReader();
    signal.addEventListener('abort', () => reader.cancel(), { once: true });

    const chunks = [];
    const start = performance.now();
    let loaded = 0;
    let rate = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (signal.aborted) throw signal.reason;
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      const elapsed = (performance.now() - start) / 1000;
      rate = rate ? rate + (loaded / elapsed - rate) * RATE_SMOOTHING : loaded / elapsed;
      this.#progress(loaded, total, rate);
    }
    return new Blob(chunks, { type: response.headers.get('content-type') ?? '' });
  }

  #progress(loaded, total, rate = 0) {
    const share = total ? Math.min(loaded / total, 1) : 0;
    this.query('.button').style.setProperty('--_progress', share);

    const amount = total ? `${formatBytes(loaded)} / ${formatBytes(total)}` : formatBytes(loaded);
    const left = rate && total ? ` · ${formatSeconds.format(Math.ceil((total - loaded) / rate))} ${this.leftLabel}` : '';
    this.#setText('.meta', amount + left);
  }

  // What the second line says, and what the button is called, outside of a download.
  #describe() {
    const details = [this.type, this.size ? formatBytes(this.size) : null].filter(Boolean).join(' · ');
    const meta = {
      done: [this.openLabel, details].filter(Boolean).join(' · '),
      error: `${this.failedLabel} · ${this.retryLabel}`,
    }[this.status] ?? details;
    this.#setText('.meta', meta);
    this.query('.button').style.setProperty('--_progress', this.status === 'done' ? 1 : 0);
    this.query('.button').ariaLabel = [this.#filename, meta].filter(Boolean).join(', ');
  }

  #reset() {
    this.status = 'idle';
    this.#announce('');
  }

  #revoke() {
    if (this.#url) URL.revokeObjectURL(this.#url);
    this.#url = null;
  }

  #announce(text) {
    this.query('.live').textContent = text;
  }

  // Both faces carry the same text.
  #setText(selector, text) {
    for (const node of this.shadowRoot.querySelectorAll(selector)) node.textContent = text ?? '';
  }
}
