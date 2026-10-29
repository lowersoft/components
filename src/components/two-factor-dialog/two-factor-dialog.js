import { writeClipboard } from '../../core/clipboard.js';
import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { check, copy, download } from '../../core/lucide.js';
import { LwModal, modalStyles } from '../../core/modal.js';
import '../button/index.js';
import '../checkbox/index.js';
import '../verification-code/index.js';
import styles from './two-factor-dialog.scss?inline';

const STEPS = ['Scan with your authenticator', 'Enter the code it shows', 'Save your recovery codes'];
const QR_CELLS = 25;
const COPIED_MS = 1600;

// A stand-in for the QR code until `qr-src` gives the real one: the three
// finder squares and a pattern seeded by the key, drawn as SVG.
const placeholderQr = (seedText) => {
  let seed = [...seedText].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0, 2166136261);
  const next = () => ((seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) / 4294967296);
  const finder = (x, y) => x < 8 && y < 8 || x >= QR_CELLS - 8 && y < 8 || x < 8 && y >= QR_CELLS - 8;
  let cells = '';
  for (let y = 0; y < QR_CELLS; y++) {
    for (let x = 0; x < QR_CELLS; x++) if (!finder(x, y) && next() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  const square = (x, y) => `<rect x="${x + 0.5}" y="${y + 0.5}" width="6" height="6" fill="none" stroke="currentColor"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
  return `<svg class="qr-code" viewBox="0 0 ${QR_CELLS} ${QR_CELLS}" shape-rendering="crispEdges" aria-hidden="true">${square(0, 0)}${square(QR_CELLS - 7, 0)}${square(0, QR_CELLS - 7)}${cells}</svg>`;
};

const DEMO_CODES = ['4F7K-2M9Q', 'X8D3-HB6T', 'P2RW-7NCL', 'J5VZ-Q4EM', 'T9AG-3KYF', 'C6UH-8SPD', 'M3XN-W7RB', 'Z4LQ-5GTJ'];

/**
 * Two-factor set-up in three steps: scan the code with an authenticator,
 * or type the key under it; enter the six digits the app shows, checked
 * as the last one goes in; then keep the recovery codes, copied or
 * downloaded, before Done is allowed.
 *
 * Give the real QR code as an image with `qr-src`; without it a stand-in
 * is drawn. Set the `verify` property to `async (code) => boolean` to check
 * the code; without it any six digits pass.
 *
 * @attr {string} email - The account the app adds
 * @attr {string} secret - The key, shown in groups of four
 * @attr {string} qr-src - The QR code image
 * @attr {Array<string>} codes - Recovery codes (JSON)
 * @attr {number} step - From 0
 * @fires lw-enabled - Two-factor is on
 */
export class LwTwoFactorDialog extends LwModal {
  static styles = [modalStyles, iconStyles, styles];
  static props = {
    ...LwModal.props,
    email: { default: 'mara@northwind.dev' },
    secret: { default: 'JBSWY3DPEHPK3PXPLOWR' },
    qrSrc: {},
    codes: { type: Object, default: DEMO_CODES },
    step: { type: Number, default: 0, reflect: true },
  };

  #timers = new Set();

  renderBody() {
    return `<div class="body"><div class="progress" aria-hidden="true">${STEPS.map(() => '<span></span>').join('')}</div><h2 class="title" id="modal-title"></h2><p class="lead step-of"></p>
<section class="step" data-step="0"><div class="qr"></div><div class="scan-text"><p class="instructions">Open 1Password, Authy or Google Authenticator and scan the code. It adds <b class="email"></b>.</p><p class="cant">Can't scan? Enter this key</p><div class="key"><code class="secret"></code><button class="icon copy-key" type="button" aria-label="Copy the key">${strokeIcon(copy, 16)}</button></div></div></section>
<section class="step" data-step="1"><p class="instructions">Type the six digits your authenticator shows for LowerSoft. They change every 30 seconds.</p><lw-verification-code class="otp" length="6" label="Six-digit code"></lw-verification-code></section>
<section class="step" data-step="2"><p class="instructions">Each code signs you in once if you lose your phone. Keep them somewhere other than this computer.</p><ol class="codes"></ol><div class="code-actions"><lw-button class="copy-codes" variant="outline" size="sm"><span slot="start">${strokeIcon(copy, 15)}</span>Copy</lw-button><lw-button class="download" variant="outline" size="sm"><span slot="start">${strokeIcon(download, 15)}</span>Download</lw-button></div><lw-checkbox class="saved">I've saved my recovery codes</lw-checkbox></section>
<p class="live visually-hidden" aria-live="polite"></p></div>
<footer class="foot"><lw-button class="back" variant="ghost">Back</lw-button><lw-button class="next"></lw-button></footer>`;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    this.query('.copy-key').addEventListener('click', () => this.#copy(this.secret, this.query('.copy-key')), options);
    this.query('.copy-codes').addEventListener('click', () => this.#copy(this.codes.join('\n'), null), options);
    this.query('.download').addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([`LowerSoft recovery codes for ${this.email}\n\n${this.codes.join('\n')}\n`], { type: 'text/plain' }));
      Object.assign(document.createElement('a'), { href: url, download: 'lowersoft-recovery-codes.txt' }).click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, options);
    const otp = this.query('.otp');
    otp.verify = async (code) => (this.verify ? this.verify(code) : /^\d{6}$/.test(code));
    otp.addEventListener('lw-verified', () => (this.step = 2), options);
    this.query('.saved').addEventListener('change', () => this.#paint(), options);
    this.query('.back').addEventListener('click', () => (this.step = Math.max(0, this.step - 1)), options);
    this.query('.next').addEventListener('click', () => this.#next(), options);
    this.signal.addEventListener('abort', () => this.#timers.forEach(clearTimeout));
  }

  updated(changed) {
    super.updated(changed);
    this.query('.email').textContent = this.email ?? '';
    this.query('.secret').textContent = (this.secret ?? '').match(/.{1,4}/g)?.join(' ') ?? '';
    if (changed.has('qrSrc') || changed.has('secret')) {
      this.query('.qr').innerHTML = this.qrSrc ? `<img src="${escapeHtml(this.qrSrc)}" alt="QR code for your authenticator">` : placeholderQr(this.secret ?? '');
    }
    if (changed.has('codes')) this.query('.codes').innerHTML = this.codes.map((code) => `<li>${escapeHtml(code)}</li>`).join('');
    if (changed.has('step') && this.step === 1) requestAnimationFrame(() => this.query('.otp').focus());
    this.#paint();
  }

  #paint() {
    const step = this.step;
    this.query('#modal-title').textContent = STEPS[step];
    this.query('.step-of').textContent = `Two-factor · step ${step + 1} of ${STEPS.length}`;
    this.shadowRoot.querySelectorAll('.progress span').forEach((bar, i) => bar.toggleAttribute('data-done', i <= step));
    for (const section of this.shadowRoot.querySelectorAll('.step')) section.hidden = Number(section.dataset.step) !== step;
    this.query('.back').hidden = step === 0;
    const next = this.query('.next');
    next.textContent = ['I scanned it', 'Verify', 'Done'][step];
    next.disabled = step === 2 && !this.query('.saved').checked;
    next.hidden = step === 1;
  }

  #next() {
    if (this.step < STEPS.length - 1) {
      this.step++;
      return;
    }
    this.emit('enabled');
    this.hide('enabled');
  }

  async #copy(text, button) {
    try {
      await writeClipboard(text);
    } catch {
      return;
    }
    this.query('.live').textContent = 'Copied';
    if (!button) return;
    button.innerHTML = strokeIcon(check, 16);
    const timer = setTimeout(() => {
      button.innerHTML = strokeIcon(copy, 16);
      this.#timers.delete(timer);
    }, COPIED_MS);
    this.#timers.add(timer);
  }
}
