import { CHECK_ICON, iconStyles } from '../../core/icons.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './verification-code.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

/**
 * A one-time code field. It fills from typing, a paste or the phone's
 * autofill of a texted code: one native input sits over the boxes, so all
 * three just work. Once full it is checked: a right code folds the boxes into
 * a single "Verified" pill, a wrong one shakes and clears for another try.
 *
 * Set `verify` to `async (code) => boolean`. Without it, a full code is only
 * reported with `lw-complete`.
 *
 * @attr {string} value
 * @attr {number} length - Digits in the code
 * @attr {'numeric'|'alphanumeric'} type
 * @attr {string} label
 * @attr {string} name - Submits the code with the form, once full
 * @attr {boolean} disabled
 * @fires lw-complete - The code is full; `detail: { code }`
 * @fires lw-verified - The code was right
 * @fires lw-rejected - The code was wrong
 * @csspart cells
 */
export class LwVerificationCode extends FormControl(LwElement) {
  static styles = [iconStyles, styles];
  static shadowOptions = { mode: 'open', delegatesFocus: true };
  static props = {
    value: { default: '' },
    length: { type: Number, default: 6 },
    type: { default: 'numeric' },
    label: { default: 'Verification code' },
    name: {},
    disabled: { type: Boolean, reflect: true },
  };

  // `verify` is set as a property: checks a full code: `async (code) => boolean`.
  // Not declared as a field, which would overwrite a value set before upgrade.

  // typing, checking, verified or rejected.
  #state = 'typing';
  #formDisabled = false;

  render() {
    return `<div class="code"><div class="cells" part="cells" aria-hidden="true"></div><input class="control" autocomplete="one-time-code" spellcheck="false" autocapitalize="characters" aria-describedby="status"><p class="verified" hidden>${CHECK_ICON}Verified</p></div><p class="status" id="status" aria-live="polite"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const input = this.query('.control');
    input.addEventListener('input', () => this.#typed(), options);
    // The caret always sits after the last character, like the boxes show.
    for (const type of ['focus', 'select', 'pointerup', 'keyup']) input.addEventListener(type, () => this.#caretToEnd(), options);
    input.addEventListener('focus', () => this.#render(), options);
    input.addEventListener('blur', () => this.#render(), options);
  }

  updated(changed) {
    const input = this.query('.control');
    if (changed.has('length')) {
      this.query('.cells').replaceChildren(...Array.from({ length: this.#length }, () => Object.assign(document.createElement('span'), { className: 'cell' })));
      input.maxLength = this.#length;
    }
    if (changed.has('type')) input.inputMode = this.type === 'alphanumeric' ? 'text' : 'numeric';
    if (changed.has('label')) input.ariaLabel = this.label ?? '';
    input.disabled = Boolean(this.disabled || this.#formDisabled);
    if (changed.has('value') && input.value !== this.value) {
      input.value = this.#clean(this.value ?? '');
      this.value = input.value;
    }
    this.#render();
  }

  formResetCallback() {
    this.reset();
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.query('.control').disabled = Boolean(this.disabled || disabled);
  }

  /** Empties the code and starts over. */
  reset() {
    this.#state = 'typing';
    this.query('.control').value = '';
    this.value = '';
    this.query('.cells').hidden = false;
    this.query('.verified').hidden = true;
    this.query('.status').textContent = '';
    this.#render();
  }

  get #length() {
    return Math.max(1, Math.min(this.length || 6, 12));
  }

  // Digits only, or letters and digits uppercased, up to the length.
  #clean(text) {
    const kept = this.type === 'alphanumeric' ? text.replace(/[^a-z0-9]/gi, '').toUpperCase() : text.replace(/\D/g, '');
    return kept.slice(0, this.#length);
  }

  #caretToEnd() {
    const input = this.query('.control');
    const end = input.value.length;
    if (input.selectionStart !== end || input.selectionEnd !== end) input.setSelectionRange(end, end);
  }

  #typed() {
    if (this.#state === 'checking' || this.#state === 'verified') return;
    const input = this.query('.control');
    const code = this.#clean(input.value);
    input.value = code;
    this.value = code;
    this.#state = 'typing';
    this.query('.status').textContent = '';
    this.#render();
    if (code.length === this.#length) this.#complete(code);
  }

  async #complete(code) {
    this.emit('complete', { code });
    if (!this.verify) return;
    this.#state = 'checking';
    this.#render();
    let right = false;
    try {
      right = await this.verify(code);
    } catch {
      right = false;
    }
    if (this.value !== code) return;
    if (right) this.#verified();
    else this.#rejected();
  }

  // The boxes close in on the middle and give way to one pill.
  #verified() {
    this.#state = 'verified';
    const cells = [...this.query('.cells').children];
    const pill = this.query('.verified');
    this.query('.status').textContent = 'Code verified.';
    this.query('.control').blur();
    this.emit('verified', { code: this.value });
    this.#render();
    const show = () => {
      this.query('.cells').hidden = true;
      pill.hidden = false;
      if (!reducedMotion.matches) pill.animate({ scale: [0.6, 1], opacity: [0, 1] }, { duration: 320, easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)' });
    };
    if (reducedMotion.matches) {
      show();
      return;
    }
    const middle = (cells.length - 1) / 2;
    const box = this.query('.cells').getBoundingClientRect();
    let last;
    cells.forEach((cell, i) => {
      const rect = cell.getBoundingClientRect();
      const dx = box.left + box.width / 2 - (rect.left + rect.width / 2);
      last = cell.animate(
        { translate: ['0 0', `${dx}px 0`], scale: [1, 0.5], opacity: [1, 0] },
        { duration: 280, delay: Math.abs(i - middle) * 20, easing: EASE_OUT, fill: 'forwards' },
      );
    });
    last.finished.then(show, show);
  }

  // A wrong code shakes, clears and waits for another try.
  #rejected() {
    this.#state = 'rejected';
    this.query('.status').textContent = 'That code didn’t work. Try again.';
    this.emit('rejected', { code: this.value });
    const clear = () => {
      if (this.#state !== 'rejected') return;
      this.query('.control').value = '';
      this.value = '';
      this.#render();
      this.query('.control').focus();
    };
    this.#render();
    if (reducedMotion.matches) {
      clear();
      return;
    }
    this.query('.cells').animate({ translate: ['0', '-6px', '6px', '-4px', '4px', '0'] }, { duration: 360, easing: 'ease-out' }).finished.then(clear, clear);
  }

  #render() {
    const input = this.query('.control');
    const code = input.value;
    const focused = this.shadowRoot.activeElement === input;
    const active = Math.min(code.length, this.#length - 1);
    [...this.query('.cells').children].forEach((cell, i) => {
      cell.textContent = code[i] ?? '';
      cell.toggleAttribute('data-filled', i < code.length);
      cell.toggleAttribute('data-active', focused && this.#state === 'typing' && i === active);
    });
    this.dataset.state = this.#state;
    const full = code.length === this.#length;
    this[INTERNALS].setFormValue(this.name && full ? code : null);
  }
}
