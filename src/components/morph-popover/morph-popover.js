import { CHECK_ICON, iconStyles, SPINNER_ICON } from '../../core/icons.js';
import { LwElement } from '../../core/lw-element.js';
import { morph, morphStyles } from '../../core/morph.js';
import { IS_APPLE } from '../../core/platform.js';
import '../button/index.js';
import styles from './morph-popover.scss?inline';

const FADE_DURATION = 200;
const BODY_DELAY = 80;
const SENT_FOR = 1600;

const ENTER = { opacity: [0, 1], filter: ['blur(4px)', 'blur(0)'] };
const BODY_ENTER = { ...ENTER, translate: ['0 4px', '0 0'] };

// Which parts each status shows.
const VIEWS = {
  idle: ['trigger'],
  open: ['trigger', 'panel'],
  sending: ['trigger', 'panel'],
  sent: ['sent'],
};

const CHAT_ICON =
  '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><path d="M2.75 4.25a1.5 1.5 0 0 1 1.5-1.5h7.5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H7l-2.75 2.5v-2.5a1.5 1.5 0 0 1-1.5-1.5v-5Z"/></svg>';

/**
 * A button that grows into the small form it opens and shrinks into a
 * confirmation once sent. The button stays in place as the panel's title.
 *
 * Call `event.detail.waitUntil(promise)` synchronously inside an `lw-submit`
 * listener to keep the panel sending until the promise settles; a rejection
 * reopens the form. Cancel the event to keep the form open.
 *
 * @attr {string} label - Button label and panel title
 * @attr {string} placeholder - Field placeholder and accessible name
 * @attr {string} send-label
 * @attr {string} sending-label
 * @attr {string} hint - Text after the shortcut keys, e.g. "to send"
 * @attr {string} sent-label - Shown in the confirmation
 * @attr {'start'|'end'} align - Edge the panel grows from
 * @attr {number} width - Panel width in px
 * @attr {'idle'|'open'|'sending'|'sent'} status - Current status; settable to open or close
 * @slot icon - Icon before the label; a chat bubble by default
 * @csspart shell - The morphing surface
 * @csspart trigger - The button
 * @fires lw-submit - On send. `detail.value` holds the text; `detail.waitUntil(promise)` waits for it. Cancelable.
 */
export class LwMorphPopover extends LwElement {
  static styles = [iconStyles, morphStyles, styles];
  static props = {
    status: { default: 'idle', reflect: true },
    label: { default: 'Feedback' },
    placeholder: { default: 'What would make this better?' },
    sendLabel: { default: 'Send' },
    sendingLabel: { default: 'Sending' },
    hint: { default: 'to send' },
    sentLabel: { default: 'Thanks!' },
    align: { default: 'start', reflect: true },
    width: { type: Number, default: 340 },
  };

  #parts = null;
  #shown = null;
  #restoreFocus = false;
  #timer = 0;

  render() {
    return `<div class="shell" part="shell"><button class="trigger" part="trigger" type="button" aria-controls="panel" aria-expanded="false"><span class="glyph"><slot name="icon">${CHAT_ICON}</slot></span><span class="label"></span></button><form class="panel" id="panel" hidden><textarea class="field" aria-keyshortcuts="${IS_APPLE ? 'Meta' : 'Control'}+Enter"></textarea><div class="footer"><span class="hint" aria-hidden="true"><kbd>${IS_APPLE ? '⌘' : 'Ctrl'}</kbd><kbd>↵</kbd><span class="hint-text"></span></span><lw-button class="send" type="submit" size="sm" disabled><span class="sending" slot="start">${SPINNER_ICON}</span><span class="send-text"></span></lw-button></div></form><div class="sent" hidden>${CHECK_ICON}<span class="sent-text"></span></div></div><span class="live" aria-live="polite"></span>`;
  }

  connected() {
    this.#parts ??= {
      shell: this.query('.shell'),
      trigger: this.query('.trigger'),
      panel: this.query('.panel'),
      field: this.query('.field'),
      send: this.query('.send'),
      sent: this.query('.sent'),
    };
    const { shell, trigger, panel, field } = this.#parts;
    const options = { signal: this.signal };

    trigger.addEventListener('click', () => this.#toggle(), options);
    panel.addEventListener('submit', this.#submit, options);
    field.addEventListener('input', () => this.#syncSend(), options);
    shell.addEventListener('keydown', this.#onKeyDown, options);
    document.addEventListener('pointerdown', this.#onOutside, options);
    this.signal.addEventListener('abort', () => clearTimeout(this.#timer));
  }

  updated(changed) {
    const { trigger, panel, field } = this.#parts;
    const text = { label: '.label', hint: '.hint-text', sentLabel: '.sent-text' };
    for (const [prop, selector] of Object.entries(text)) {
      if (changed.has(prop)) this.query(selector).textContent = this[prop];
    }
    if (changed.has('placeholder')) {
      field.placeholder = this.placeholder;
      field.ariaLabel = this.placeholder;
    }
    if (changed.has('width')) panel.style.width = `${this.width - 2}px`;
    if (changed.has('status')) this.#show();
    if (['status', 'sendLabel', 'sendingLabel'].some((prop) => changed.has(prop))) {
      this.query('.send-text').textContent = this.status === 'sending' ? this.sendingLabel : this.sendLabel;
    }
    trigger.ariaExpanded = String(VIEWS[this.status]?.includes('panel') ?? false);
  }

  #toggle() {
    if (this.status === 'idle') this.status = 'open';
    else if (this.status === 'open') this.status = 'idle';
  }

  #onKeyDown = (event) => {
    if (event.key === 'Escape' && this.status === 'open') {
      event.stopPropagation();
      this.status = 'idle';
    }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      this.#submit();
    }
  };

  #onOutside = (event) => {
    if (this.status === 'open' && !event.composedPath().includes(this)) this.status = 'idle';
  };

  #submit = (event) => {
    event?.preventDefault();
    const { field } = this.#parts;
    const value = field.value.trim();
    if (!value || this.status !== 'open') return;

    let action = null;
    if (!this.emit('submit', { value, waitUntil: (promise) => (action = promise) })) return;
    this.status = 'sending';
    Promise.resolve(action).then(
      () => {
        field.value = '';
        this.status = 'sent';
      },
      () => (this.status = 'open'),
    );
  };

  #syncSend() {
    const { field, send } = this.#parts;
    const sending = this.status === 'sending';
    field.disabled = sending;
    send.disabled = sending || !field.value.trim();
  }

  // Swaps the visible parts and morphs the shell from its old size to its new one.
  #show() {
    const status = VIEWS[this.status] ? this.status : 'idle';
    const previous = this.#shown;
    if (status === previous) return;
    this.#shown = status;

    const { shell, trigger, field, panel } = this.#parts;
    morph({
      host: this,
      shell,
      parts: { trigger, panel, sent: this.#parts.sent },
      visible: VIEWS[status],
      opening: previous === 'idle',
      closing: status === 'idle' && previous !== null,
      animate: previous !== null,
      isClosed: () => this.#shown === 'idle',
      enter: (part) => [
        part === panel ? BODY_ENTER : ENTER,
        { duration: FADE_DURATION, delay: part === panel ? BODY_DELAY : 100, easing: 'ease-out', fill: 'backwards' },
      ],
    });

    this.#syncSend();
    this.query('.live').textContent = status === 'sent' ? this.sentLabel : '';
    clearTimeout(this.#timer);
    if (status === 'sent') this.#timer = setTimeout(() => (this.status = 'idle'), SENT_FOR);

    // Focus follows the shape: into the field on open, back to the button after.
    if (status === 'open' && previous === 'idle') {
      field.focus({ preventScroll: true });
      this.#restoreFocus = true;
    } else if (status === 'idle' && this.#restoreFocus) {
      this.#restoreFocus = false;
      if (this.matches(':focus-within') || document.activeElement === document.body) trigger.focus({ preventScroll: true });
    }
  }
}
