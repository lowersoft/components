import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { digitsBefore, indexAfterDigits } from '../../core/text.js';
import { BRANDS, brandOf, formatNumber, luhn, maxLength, specOf } from './card.js';
import styles from './card-input.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

const svg = (body) => `<svg viewBox="0 0 32 22" aria-hidden="true">${body}</svg>`;
// Simplified brand marks, drawn so they read at 32 × 22.
const MARKS = {
  generic: svg(
    '<rect x="1" y="1" width="30" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="6" width="30" height="3.5" fill="currentColor" opacity=".35"/><rect x="5" y="14" width="8" height="2.5" rx="1" fill="currentColor" opacity=".5"/>',
  ),
  visa: svg('<rect width="32" height="22" rx="3" fill="#1a1f71"/><text x="16" y="15" fill="#fff" font-size="9" font-weight="800" font-style="italic" text-anchor="middle" font-family="Arial, sans-serif">VISA</text>'),
  mastercard: svg('<rect width="32" height="22" rx="3" fill="#252525"/><circle cx="12.5" cy="11" r="6" fill="#eb001b"/><circle cx="19.5" cy="11" r="6" fill="#f79e1b" fill-opacity=".9"/>'),
  amex: svg('<rect width="32" height="22" rx="3" fill="#2e77bc"/><text x="16" y="14.5" fill="#fff" font-size="7" font-weight="800" text-anchor="middle" font-family="Arial, sans-serif">AMEX</text>'),
  discover: svg(
    '<rect width="32" height="22" rx="3" fill="#fff" stroke="#d4d4d8"/><text x="13" y="14" fill="#111" font-size="6" font-weight="700" text-anchor="middle" font-family="Arial, sans-serif">DISC</text><circle cx="25" cy="11" r="3.5" fill="#f58220"/>',
  ),
};
// The brand reel: the generic card first, then the brands in order.
const REEL = ['generic', ...Object.keys(BRANDS)];

const MESSAGES = {
  number: 'Your card number is invalid.',
  expInvalid: 'Your card’s expiration date is invalid.',
  expPast: 'Your card’s expiration date is in the past.',
};

const onlyDigits = (text) => text.replace(/\D/g, '');

/**
 * A Stripe-style card field on one line. The number groups itself as it is
 * typed and the brand mark rolls to Visa, Mastercard, American Express or
 * Discover. A complete, valid number slides down to its last four digits to
 * make room for the expiry and security code; press the last four to
 * edit the number again. Focus moves on as each part is filled, and
 * Backspace in an empty part goes back. An invalid number shakes the field.
 *
 * `value` holds the parts; the field reports `lw-change` as it becomes
 * complete or stops being so. With a `name`, the form submits `name-number`,
 * `name-exp` and `name-cvc`, and only a complete card.
 *
 * @attr {string} label
 * @attr {string} name - Prefix for the submitted fields
 * @attr {boolean} required
 * @attr {boolean} disabled
 * @fires lw-change - The card became complete or stopped being so; `detail: { complete, brand, last4 }`
 * @csspart field
 */
export class LwCardInput extends FormControl(LwElement) {
  static styles = styles;
  static shadowOptions = { mode: 'open', delegatesFocus: true };
  static props = {
    label: { default: 'Card' },
    name: {},
    required: { type: Boolean },
    disabled: { type: Boolean, reflect: true },
  };

  #digits = '';
  #brand = null;
  #compact = false;
  #complete = false;
  #formDisabled = false;

  render() {
    const reel = REEL.map((key) => `<span class="mark" data-brand="${key}">${MARKS[key]}</span>`).join('');
    return `<label class="label" for="number"></label><div class="field" part="field"><span class="brand" aria-hidden="true"><span class="reel">${reel}</span></span><span class="number-wrap"><input id="number" class="number" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234" aria-describedby="message brand-name"><button class="edit" type="button" tabindex="-1" aria-label="Edit card number"><span class="digits"></span><span class="mask" aria-hidden="true">••••</span></button></span><span class="rest" inert><input class="exp" type="text" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY" aria-label="Expiration date" aria-describedby="message"><input class="cvc" type="text" inputmode="numeric" autocomplete="cc-csc" placeholder="CVC" aria-label="Security code" aria-describedby="message"></span></div><p class="message" id="message" aria-live="polite"></p><span class="brand-name" id="brand-name"></span>`;
  }

  connected() {
    const options = { signal: this.signal };
    const [number, exp, cvc] = ['.number', '.exp', '.cvc'].map((selector) => this.query(selector));
    number.addEventListener('input', () => this.#numberTyped(), options);
    number.addEventListener('blur', () => this.#validate(), options);
    exp.addEventListener('input', () => this.#expTyped(), options);
    exp.addEventListener('blur', () => this.#validate(), options);
    cvc.addEventListener('input', () => this.#cvcTyped(), options);
    // Backspace in an empty part goes back to the one before.
    exp.addEventListener('keydown', (event) => this.#backTo(event, () => this.#expand()), options);
    cvc.addEventListener('keydown', (event) => this.#backTo(event, () => this.#focusEnd(exp)), options);
    this.query('.edit').addEventListener('click', () => this.#expand(), options);
  }

  updated(changed) {
    if (changed.has('label')) this.query('.label').textContent = this.label;
    if (changed.has('disabled')) this.#syncDisabled();
    this.#sync();
  }

  formResetCallback() {
    for (const selector of ['.number', '.exp', '.cvc']) this.query(selector).value = '';
    this.#digits = '';
    this.#setBrand(null);
    this.#setCompact(false);
    this.#message('');
    this.#sync();
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncDisabled();
  }

  /** The card as entered: `{ brand, number, expMonth, expYear, cvc, complete }`. */
  get value() {
    const exp = onlyDigits(this.query('.exp').value);
    return {
      brand: this.#brand,
      number: this.#digits,
      expMonth: exp.length === 4 ? Number(exp.slice(0, 2)) : null,
      expYear: exp.length === 4 ? 2000 + Number(exp.slice(2)) : null,
      cvc: this.query('.cvc').value,
      complete: this.#complete,
    };
  }

  #syncDisabled() {
    const disabled = this.disabled || this.#formDisabled;
    this.shadowRoot.querySelectorAll('input').forEach((input) => (input.disabled = disabled));
  }

  // Most cards stop at 16 digits (Amex at 15); longer Visa and Discover
  // numbers count once typed in full.
  get #numberSettled() {
    const length = this.#digits.length;
    return length === (this.#brand === 'amex' ? 15 : 16) || length === maxLength(this.#brand);
  }

  get #numberComplete() {
    return this.#numberSettled && specOf(this.#brand).lengths.includes(this.#digits.length) && luhn(this.#digits);
  }

  // The expiry's problem, if any: invalid, past, or null.
  get #expProblem() {
    const exp = onlyDigits(this.query('.exp').value);
    if (exp.length < 4) return null;
    const month = Number(exp.slice(0, 2));
    if (month < 1 || month > 12) return 'expInvalid';
    const now = new Date();
    const year = 2000 + Number(exp.slice(2));
    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) return 'expPast';
    return null;
  }

  #numberTyped() {
    const input = this.query('.number');
    const caretDigits = digitsBefore(input.value, input.selectionStart ?? input.value.length);
    let digits = onlyDigits(input.value);
    const brand = brandOf(digits);
    digits = digits.slice(0, maxLength(brand));
    this.#digits = digits;
    this.#setBrand(brand);
    const formatted = formatNumber(digits, brand);
    if (input.value !== formatted) {
      input.value = formatted;
      const caret = indexAfterDigits(formatted, Math.min(caretDigits, digits.length));
      input.setSelectionRange(caret, caret);
    }
    // A wrong number at full length says so at once, with a shake.
    if (this.#numberComplete) {
      this.#message('');
      this.#setCompact(true);
      this.query('.exp').focus();
    } else if (this.#numberSettled) {
      this.#fail(MESSAGES.number);
    } else {
      this.#message('');
    }
    this.#sync();
  }

  #expTyped() {
    const input = this.query('.exp');
    let digits = onlyDigits(input.value).slice(0, 4);
    // "4" can only be April: it becomes "04".
    if (digits.length === 1 && Number(digits) > 1) digits = `0${digits}`;
    input.value = digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
    const problem = this.#expProblem;
    if (problem) this.#fail(MESSAGES[problem]);
    else this.#message('');
    if (digits.length === 4 && !problem) this.query('.cvc').focus();
    this.#sync();
  }

  #cvcTyped() {
    const input = this.query('.cvc');
    input.value = onlyDigits(input.value).slice(0, specOf(this.#brand).cvc);
    this.#sync();
  }

  #validate() {
    if (this.#digits && !this.#numberComplete && this.shadowRoot.activeElement !== this.query('.number')) this.#message(MESSAGES.number);
  }

  #backTo(event, back) {
    if (event.key !== 'Backspace' || event.target.value !== '') return;
    event.preventDefault();
    back();
  }

  #focusEnd(input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  #expand() {
    this.#setCompact(false);
    this.#focusEnd(this.query('.number'));
  }

  #setBrand(brand) {
    if (brand === this.#brand && this.query('.reel').style.translate) return;
    this.#brand = brand;
    // The brand mark rolls to the brand's slot on the reel; a percentage of
    // the reel's own height, which holds every mark.
    this.query('.reel').style.translate = `0 ${(-REEL.indexOf(brand ?? 'generic') * 100) / REEL.length}%`;
    this.query('.brand-name').textContent = brand ? BRANDS[brand].label : '';
    this.query('.cvc').placeholder = brand === 'amex' ? 'CID' : 'CVC';
  }

  // Compact: the number slides down to its last four, the rest slides in.
  #setCompact(compact) {
    if (compact === this.#compact) return;
    this.#compact = compact;
    const field = this.query('.field');
    const digits = this.query('.digits');
    const wrap = this.query('.number-wrap');
    if (compact) {
      digits.textContent = this.query('.number').value;
      // The last four, measured in the same font, behind the dots that mask
      // the rest: the digits slide under the dots as the box narrows.
      const probe = Object.assign(document.createElement('span'), { className: 'digits probe', textContent: this.#digits.slice(-4) });
      wrap.append(probe);
      const shown = this.query('.mask').offsetWidth + probe.offsetWidth;
      probe.remove();
      field.style.setProperty('--_last4', `${shown}px`);
      digits.style.translate = `${shown - digits.offsetWidth}px 0`;
    } else {
      digits.style.translate = '0 0';
    }
    field.toggleAttribute('data-compact', compact);
    this.query('.rest').inert = !compact;
    this.query('.edit').tabIndex = compact ? 0 : -1;
    this.query('.edit').ariaLabel = compact ? `Edit card number ending in ${this.#digits.slice(-4)}` : 'Edit card number';
  }

  #fail(text) {
    this.#message(text);
    if (reducedMotion.matches) return;
    this.query('.field').animate({ translate: ['0', '-4px', '4px', '-3px', '3px', '0'] }, { duration: 300, easing: 'ease-out' });
  }

  #message(text) {
    const message = this.query('.message');
    message.textContent = text;
    this.query('.field').toggleAttribute('data-invalid', Boolean(text));
  }

  // Works out whether the card is complete, and tells the form.
  #sync() {
    const { cvc } = this.value;
    const exp = onlyDigits(this.query('.exp').value);
    const complete = this.#numberComplete && exp.length === 4 && !this.#expProblem && cvc.length === specOf(this.#brand).cvc;
    if (complete !== this.#complete) {
      this.#complete = complete;
      this.emit('change', { complete, brand: this.#brand, last4: complete ? this.#digits.slice(-4) : null });
    }
    if (this.name && complete) {
      const data = new FormData();
      const value = this.value;
      data.append(`${this.name}-number`, value.number);
      data.append(`${this.name}-exp`, `${String(value.expMonth).padStart(2, '0')}/${value.expYear}`);
      data.append(`${this.name}-cvc`, value.cvc);
      this[INTERNALS].setFormValue(data);
    } else {
      this[INTERNALS].setFormValue(null);
    }
    const empty = !this.#digits && !exp && !cvc;
    const anchor = this.query('.number');
    if (complete || (empty && !this.required)) this[INTERNALS].setValidity({});
    else if (empty) this[INTERNALS].setValidity({ valueMissing: true }, 'Enter your card details.', anchor);
    else this[INTERNALS].setValidity({ customError: true }, this.query('.message').textContent || 'Your card details are incomplete.', anchor);
  }
}
