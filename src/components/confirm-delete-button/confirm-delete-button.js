import { CHECK_ICON, iconStyles } from '../../core/icons.js';
import { LwElement } from '../../core/lw-element.js';
import { morph, morphStyles } from '../../core/morph.js';
import '../button/index.js';
import styles from './confirm-delete-button.scss?inline';

const FADE_DURATION = 200;
const CARD_DELAY = 80;
const ENTER = { opacity: [0, 1], filter: ['blur(4px)', 'blur(0)'] };
const CARD_ENTER = { ...ENTER, translate: ['0 4px', '0 0'] };
const DRAIN = { scale: ['1 1', '0 1'] };

// Which parts each status shows.
const VIEWS = {
  idle: ['trigger'],
  confirming: ['card'],
  deleting: ['card'],
  done: ['done'],
};

const TRASH_ICON =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';

/**
 * Asks once, in place: the button grows into a small card that names what
 * goes with it. `confirm-text` adds a type-the-name step. A hairline drains
 * while the pointer and focus are elsewhere and folds the card back when it
 * runs out; it pauses while you are on it.
 *
 * Put what goes with the deletion in the default slot. Call
 * `event.detail.waitUntil(promise)` synchronously inside `lw-confirm` to keep
 * the card deleting until the promise settles; a rejection keeps it open.
 *
 * @attr {string} label - Button label
 * @attr {string} heading - Card title
 * @attr {string} confirm-text - Text to type before deleting
 * @attr {string} confirm-hint - Instruction for the typing step; `{text}` marks where the text goes
 * @attr {string} cancel-label
 * @attr {string} delete-label
 * @attr {string} done-label - Shown after deleting
 * @attr {number} timeout - Milliseconds the hairline takes to drain
 * @attr {number} reset-after - Milliseconds the done state shows; 0 keeps it
 * @attr {number} width - Card width in px
 * @attr {'start'|'end'} align - Edge the card grows from
 * @attr {'idle'|'confirming'|'deleting'|'done'} status - Current status; settable to open or close
 * @slot - What goes with the deletion
 * @slot icon - Button icon; a trash can by default
 * @csspart shell - The morphing surface
 * @fires lw-confirm - On delete. `detail.waitUntil(promise)` waits for it. Cancelable.
 * @fires lw-cancel - When the card folds back without deleting
 */
export class LwConfirmDeleteButton extends LwElement {
  static styles = [iconStyles, morphStyles, styles];
  static props = {
    status: { default: 'idle', reflect: true },
    label: { default: 'Delete' },
    heading: { default: 'Delete this?' },
    confirmText: {},
    confirmHint: { default: 'Type {text} to confirm' },
    cancelLabel: { default: 'Cancel' },
    deleteLabel: { default: 'Delete' },
    doneLabel: { default: 'Deleted' },
    timeout: { type: Number, default: 8000 },
    resetAfter: { type: Number, default: 0 },
    width: { type: Number, default: 320 },
    align: { default: 'start', reflect: true },
  };

  #parts = null;
  #shown = null;
  #drain = null;
  #hovered = false;
  #usingKeyboard = false;
  #restoreFocus = false;
  #timer = 0;

  render() {
    return `<div class="shell" part="shell"><button class="trigger" type="button" aria-haspopup="dialog" aria-controls="card" aria-expanded="false"><slot name="icon">${TRASH_ICON}</slot><span class="label"></span></button><div class="card" id="card" role="alertdialog" aria-labelledby="heading" aria-describedby="details" hidden><p class="heading" id="heading"></p><div class="details" id="details"><slot></slot></div><label class="confirm" hidden><span class="hint"></span><input class="field" autocomplete="off" spellcheck="false"></label><div class="actions"><lw-button class="cancel" variant="ghost" size="sm"></lw-button><lw-button class="delete" variant="destructive" size="sm"></lw-button></div><span class="hairline"></span></div><div class="done" hidden>${CHECK_ICON}<span class="done-text"></span></div></div><span class="live" aria-live="polite"></span>`;
  }

  connected() {
    this.#parts ??= {
      shell: this.query('.shell'),
      trigger: this.query('.trigger'),
      card: this.query('.card'),
      done: this.query('.done'),
      field: this.query('.field'),
      cancel: this.query('.cancel'),
      remove: this.query('.delete'),
    };
    const { trigger, card, field, cancel, remove } = this.#parts;
    const options = { signal: this.signal };
    const hover = (value) => () => {
      this.#hovered = value;
      this.#syncDrain();
    };

    trigger.addEventListener(
      'click',
      (event) => {
        // Opened from the keyboard, the user is on the card from the start.
        this.#usingKeyboard = event.detail === 0;
        this.status = 'confirming';
      },
      options,
    );
    cancel.addEventListener('click', () => this.#close(), options);
    remove.addEventListener('click', () => this.#confirm(), options);
    field.addEventListener('input', () => this.#syncDelete(), options);
    card.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') return this.#close();
        this.#usingKeyboard = true;
        this.#syncDrain();
      },
      options,
    );
    card.addEventListener('pointerenter', hover(true), options);
    card.addEventListener('pointerleave', hover(false), options);
    card.addEventListener(
      'focusout',
      () =>
        queueMicrotask(() => {
          if (!this.matches(':focus-within')) this.#usingKeyboard = false;
          this.#syncDrain();
        }),
      options,
    );
    this.signal.addEventListener('abort', () => {
      this.#drain?.cancel();
      clearTimeout(this.#timer);
    });
  }

  updated(changed) {
    const { card, field, cancel, remove } = this.#parts;
    const text = { label: '.label', heading: '.heading', doneLabel: '.done-text' };
    for (const [prop, selector] of Object.entries(text)) {
      if (changed.has(prop)) this.query(selector).textContent = this[prop];
    }
    if (changed.has('cancelLabel')) cancel.textContent = this.cancelLabel;
    if (changed.has('deleteLabel')) remove.textContent = this.deleteLabel;
    if (changed.has('width')) card.style.width = `${this.width - 2}px`;
    if (changed.has('confirmText') || changed.has('confirmHint')) {
      this.query('.confirm').hidden = !this.confirmText;
      this.#renderHint();
      field.value = '';
    }
    if (changed.has('status')) this.#show();
    this.#syncDelete();
  }

  // Builds the hint as text nodes around a <code> with the text to type.
  #renderHint() {
    const [before, after = ''] = this.confirmHint.split('{text}');
    const code = Object.assign(document.createElement('code'), { textContent: this.confirmText ?? '' });
    this.query('.hint').replaceChildren(before, code, after);
    this.#parts.field.ariaLabel = `${before}${this.confirmText ?? ''}${after}`;
  }

  #syncDelete() {
    const { field, cancel, remove } = this.#parts;
    const deleting = this.status === 'deleting';
    const typed = !this.confirmText || field.value.trim() === this.confirmText;
    remove.disabled = !typed && !deleting;
    remove.loading = deleting;
    cancel.disabled = deleting;
    field.disabled = deleting;
  }

  #close() {
    if (this.status !== 'confirming') return;
    this.status = 'idle';
    this.emit('cancel');
  }

  #confirm() {
    let action = null;
    if (!this.emit('confirm', { waitUntil: (promise) => (action = promise) })) return;
    this.status = 'deleting';
    Promise.resolve(action).then(
      () => (this.status = 'done'),
      () => (this.status = 'confirming'),
    );
  }

  // The hairline drains only while nobody is on the card: the pointer is
  // elsewhere and the keyboard is not being used in it. The focus placed on
  // the card when it opens does not count as being on it.
  #syncDrain() {
    if (!this.#drain) return;
    const engaged =
      this.#hovered || (this.#usingKeyboard && this.matches(':focus-within')) || this.status === 'deleting';
    if (engaged) this.#drain.pause();
    else this.#drain.play();
  }

  #startDrain() {
    this.#drain?.cancel();
    this.#drain = this.query('.hairline').animate(DRAIN, { duration: this.timeout, fill: 'forwards' });
    this.#drain.finished.then(() => this.#close(), () => {});
    this.#syncDrain();
  }

  // Swaps the visible parts and morphs the shell from its old size to its new one.
  #show() {
    const status = VIEWS[this.status] ? this.status : 'idle';
    const previous = this.#shown;
    if (status === previous) return;
    this.#shown = status;

    const { shell, trigger, card, done, field, cancel } = this.#parts;
    morph({
      host: this,
      shell,
      parts: { trigger, card, done },
      visible: VIEWS[status],
      opening: previous === 'idle',
      closing: status === 'idle' && previous !== null,
      animate: previous !== null,
      isClosed: () => this.#shown === 'idle',
      enter: (part) => [
        part === card ? CARD_ENTER : ENTER,
        { duration: FADE_DURATION, delay: part === card ? CARD_DELAY : 100, easing: 'ease-out', fill: 'backwards' },
      ],
    });

    trigger.ariaExpanded = String(VIEWS[status].includes('card'));
    this.query('.live').textContent = status === 'done' ? this.doneLabel : '';
    clearTimeout(this.#timer);
    if (status === 'done' && this.resetAfter > 0) this.#timer = setTimeout(() => (this.status = 'idle'), this.resetAfter);

    if (status === 'confirming' && previous === 'idle') {
      field.value = '';
      // Focus the typing step, or the least destructive choice.
      (this.confirmText ? field : cancel).focus({ preventScroll: true });
      this.#restoreFocus = true;
      this.#startDrain();
    } else if (status !== 'confirming' && status !== 'deleting') {
      this.#drain?.cancel();
      this.#drain = null;
    } else {
      this.#syncDrain();
    }

    if (status === 'idle' && this.#restoreFocus) {
      this.#restoreFocus = false;
      if (this.matches(':focus-within') || document.activeElement === document.body) trigger.focus({ preventScroll: true });
    }
  }
}
