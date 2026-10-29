import { CHECK_ICON, iconStyles } from '../../core/icons.js';
import { LwElement } from '../../core/lw-element.js';
import { MENU_MARKUP, Menu, menuStyles } from '../../core/menu.js';
import { digitsBefore, indexAfterDigits } from '../../core/text.js';
import '../button/index.js';
import { COUNTRIES, dialLabel, fillMask, flagOf, parseInternational, slotsOf } from './countries.js';
import styles from './phone-input.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

const CHEVRON_ICON =
  '<svg class="icon chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5"/></svg>';

const demoSend = () => new Promise((resolve) => setTimeout(resolve, 900));

/**
 * A phone field for sign-up or two-factor codes. The number formats as it is
 * typed, over a faint mask of the digits still to come. Typing or pasting an
 * international number ("+44 7700 900123") switches the country; the country
 * menu does too. Once the number is complete it is checked for a mobile, and
 * only a mobile can be sent a code.
 *
 * Set `sendCode` to `async (phone) => {}`, given the number in E.164 form,
 * "+447700900123"; without it, sending is simulated. With a `name`, the form
 * submits the number in E.164 form, and only a mobile.
 *
 * @attr {string} value - The number in E.164 form
 * @attr {string} country - ISO code of the country, e.g. "TR"
 * @attr {string} label
 * @attr {string} unavailable - Comma-separated ISO codes of countries not served; they show disabled
 * @attr {string} unavailable-message - Their tooltip
 * @attr {string} name - Submits the number with the form under this name
 * @attr {boolean} required
 * @attr {boolean} disabled
 * @fires lw-change - The number changed; `detail: { value, country, mobile }`
 * @fires lw-send - Before a code is sent; `detail: { value }`. Cancel it to send the code yourself
 * @csspart field
 */
export class LwPhoneInput extends FormControl(LwElement) {
  static styles = [iconStyles, menuStyles, styles];
  static shadowOptions = { mode: 'open', delegatesFocus: true };
  static props = {
    value: { default: '' },
    country: { default: 'US', reflect: true },
    label: { default: 'Phone number' },
    unavailable: { default: '' },
    unavailableMessage: { default: 'We don’t offer service in this country yet.' },
    name: {},
    required: { type: Boolean },
    disabled: { type: Boolean, reflect: true },
  };

  // `sendCode` is set as a property: sends a code: `async (phone) => {}`, given the number in E.164 form.
  // Not declared as a field, which would overwrite a value set before upgrade.

  #menu = null;
  // National digits, without the country code or trunk 0.
  #digits = '';
  // idle, partial, mobile, landline, unsupported, sending, sent or error.
  #state = 'idle';
  // A country typed in an international number that is not served.
  #refused = null;
  #initial = null;
  #formDisabled = false;

  render() {
    return `<label class="label" for="input"></label><div class="field" part="field"><span class="picker"><button class="country" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="menu"><span class="flag" aria-hidden="true"></span><span class="dial"></span>${CHEVRON_ICON}</button>${MENU_MARKUP}</span><span class="control"><span class="ghost" aria-hidden="true"><span class="ghost-typed"></span><span class="ghost-rest"></span></span><input id="input" class="number" type="tel" inputmode="tel" autocomplete="tel" aria-describedby="status"></span><span class="ok" aria-hidden="true">${CHECK_ICON}</span></div><p class="status" id="status" aria-live="polite"></p><lw-button class="send" disabled>Send code</lw-button>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.#menu ??= new Menu({
      trigger: this.query('.country'),
      menu: this.query('.menu'),
      onPick: (code) => this.#pickCountry(code),
      search: 'Search countries',
    });
    this.#menu.connect(this.signal);
    this.query('.number').addEventListener('input', () => this.#typed(), options);
    const send = this.query('.send');
    send.addEventListener('click', () => !send.disabled && this.#send(), options);
  }

  updated(changed) {
    this.#initial ??= { value: this.value, country: this.country };
    if (changed.has('label')) this.query('.label').textContent = this.label;
    if (changed.has('disabled')) this.#syncDisabled();
    if (!COUNTRIES[this.country]) this.country = 'US';
    if (changed.has('unavailable') || changed.has('unavailableMessage')) this.#listCountries();
    if (changed.has('country')) this.#showCountry();
    // A number set from outside is read like a pasted one.
    if (changed.has('value') && this.value !== this.#e164) {
      const parsed = parseInternational(this.value ?? '', this.country);
      if (parsed) this.country = parsed.code;
      this.#setDigits(parsed?.digits ?? '');
    } else {
      this.#render();
    }
  }

  formResetCallback() {
    this.country = this.#initial?.country ?? 'US';
    this.value = this.#initial?.value ?? '';
    if (!this.value) this.#setDigits('');
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncDisabled();
  }

  get #spec() {
    return COUNTRIES[this.country] ?? COUNTRIES.US;
  }

  get #e164() {
    return this.#digits ? `+${this.#spec.dial}${this.#digits}` : '';
  }

  /** The number as people read it: "+90 532 123 45 67". */
  get #display() {
    return `${dialLabel(this.#spec.dial)} ${fillMask(this.#spec.mask, this.#digits).typed}`;
  }

  #syncDisabled() {
    const disabled = this.disabled || this.#formDisabled;
    this.query('.number').disabled = disabled;
    this.query('.country').disabled = disabled;
  }

  get #unavailable() {
    return new Set(
      (this.unavailable ?? '')
        .split(',')
        .map((code) => code.trim().toUpperCase())
        .filter(Boolean),
    );
  }

  #listCountries() {
    const unavailable = this.#unavailable;
    const items = Object.entries(COUNTRIES)
      .sort(([, a], [, b]) => a.name.localeCompare(b.name, 'en'))
      .map(([code, { name, dial }]) => ({
        value: code,
        label: `${flagOf(code)}  ${name}`,
        description: dialLabel(dial),
        disabled: unavailable.has(code),
        hint: this.unavailableMessage,
      }));
    this.#menu.setItems(items);
    this.#menu.setChecked(this.country);
  }

  #showCountry() {
    const { name, dial } = this.#spec;
    this.query('.flag').textContent = flagOf(this.country);
    this.query('.dial').textContent = dialLabel(dial);
    this.query('.country').ariaLabel = `Country: ${name} (${dialLabel(dial)})`;
    this.#menu?.setChecked(this.country);
  }

  #pickCountry(code) {
    this.country = code;
    this.#showCountry();
    this.#setDigits(this.#digits);
    this.query('.number').focus();
  }

  #typed() {
    const input = this.query('.number');
    const raw = input.value;
    // An international number switches the country.
    if (/^\s*(\+|00)/.test(raw)) {
      const parsed = parseInternational(raw, this.country);
      this.#refused = null;
      if (!parsed) {
        // "+4" could still become "+44": wait for more of the code.
        if (raw.replace(/\D/g, '').length < 4) return;
      } else if (this.#unavailable.has(parsed.code)) {
        // A country that is not served: say so and leave the number as typed.
        this.#refused = parsed.code;
        this.#state = 'unsupported';
        this.#render();
        return;
      } else {
        this.country = parsed.code;
        this.#showCountry();
        this.#setDigits(parsed.digits, true);
        return;
      }
    }
    const caretDigits = digitsBefore(raw, input.selectionStart ?? raw.length);
    let digits = raw.replace(/\D/g, '');
    // A trunk 0 ("0532…") is dropped; the format leaves it out.
    const trunk = digits.startsWith('0') && this.country !== 'IT' ? 1 : 0;
    digits = digits.slice(trunk);
    this.#setDigits(digits, true, Math.max(0, caretDigits - trunk));
  }

  #setDigits(digits, byUser = false, caretDigits = null) {
    const before = this.#e164;
    this.#digits = digits.slice(0, slotsOf(this.#spec.mask));
    const input = this.query('.number');
    const { typed } = fillMask(this.#spec.mask, this.#digits);
    if (input.value !== typed) {
      input.value = typed;
      if (byUser && this.shadowRoot.activeElement === input) {
        const caret = caretDigits === null ? typed.length : indexAfterDigits(typed, Math.min(caretDigits, this.#digits.length));
        input.setSelectionRange(caret, caret);
      }
    }
    const complete = this.#digits.length === slotsOf(this.#spec.mask);
    if (!this.#digits) this.#state = 'idle';
    else if (!complete) this.#state = 'partial';
    // Where mobile numbers are not known apart, any complete number will do.
    else this.#state = (this.#spec.mobile?.test(this.#digits) ?? true) ? 'mobile' : 'landline';
    this.value = this.#e164;
    this.#render();
    if (byUser && this.#e164 !== before) this.emit('change', { value: this.#e164, country: this.country, mobile: this.#state === 'mobile' });
  }

  async #send() {
    const phone = this.#e164;
    if (!this.emit('send', { value: phone })) return;
    this.#state = 'sending';
    this.#render();
    try {
      await (this.sendCode ?? demoSend)(phone);
      if (this.#e164 === phone) this.#state = 'sent';
    } catch {
      if (this.#e164 === phone) this.#state = 'error';
    }
    this.#render();
  }

  #render() {
    const { typed, rest } = fillMask(this.#spec.mask, this.#digits);
    this.query('.ghost-typed').textContent = typed;
    this.query('.ghost-rest').textContent = rest;
    const state = this.#state;
    this.dataset.state = state;
    const messages = {
      idle: 'We’ll text you a code to confirm it’s you.',
      partial: 'We’ll text you a code to confirm it’s you.',
      mobile: this.#spec.mobile ? `Mobile number. We’ll text a code to ${this.#display}.` : `We’ll text a code to ${this.#display}.`,
      landline: 'That doesn’t look like a mobile number. Codes go by text.',
      unsupported: `${this.#refused ? COUNTRIES[this.#refused].name : 'That country'}: ${this.unavailableMessage}`,
      sending: `Sending a code to ${this.#display}…`,
      sent: `Code sent to ${this.#display}.`,
      error: 'Couldn’t send the code. Try again in a moment.',
    };
    this.query('.status').textContent = messages[state];
    const send = this.query('.send');
    send.disabled = !['mobile', 'error'].includes(state);
    send.loading = state === 'sending';
    send.textContent = state === 'sent' ? 'Code sent' : state === 'error' ? 'Try again' : 'Send code';
    const valid = ['mobile', 'sending', 'sent', 'error'].includes(state);
    this[INTERNALS].setFormValue(this.name && valid ? this.#e164 : null);
    const input = this.query('.number');
    if (valid || (state === 'idle' && !this.required)) this[INTERNALS].setValidity({});
    else if (state === 'idle') this[INTERNALS].setValidity({ valueMissing: true }, 'Enter your phone number.', input);
    else if (state === 'landline') this[INTERNALS].setValidity({ typeMismatch: true }, 'Enter a mobile number.', input);
    else this[INTERNALS].setValidity({ tooShort: true }, 'The number is incomplete.', input);
  }
}
