import fieldStyles from '../styles/field.scss?inline';
import { FormControl, INTERNALS } from './form.js';
import { LwElement } from './lw-element.js';

/** Styles for `LwField`; put them before the component's own in `static styles`. */
export { fieldStyles };

/**
 * Base for text fields: a native control with a label, a hint, an error and
 * a length counter, taking part in forms like the native control. Its value
 * is submitted, the native checks run (`required`, the length limits, the
 * subclass's own), and the error shows once the field has been left or the
 * form submitted, not while it is first being filled in. `error` sets a
 * message from outside, such as the server.
 *
 * A subclass returns its control from `renderControl()`, an element with
 * `id="control"` and `class="control"`, and lists any further attributes it
 * passes to it in `static nativeAttributes`.
 */
export class LwField extends FormControl(LwElement) {
  static shadowOptions = { mode: 'open', delegatesFocus: true };
  static props = {
    value: { default: '' },
    label: {},
    hint: {},
    error: {},
    placeholder: {},
    name: {},
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    minlength: { type: Number },
    maxlength: { type: Number },
    autocomplete: {},
    counter: { type: Boolean },
  };

  // Named as the native attributes, so `maxlength` works as on the control.
  static nativeAttributes = ['placeholder', 'autocomplete', 'minlength', 'maxlength'];

  #initial = null;
  #formDisabled = false;
  // The error shows once the field has been left or the form submitted.
  #touched = false;

  render() {
    return `<label class="label" for="control" part="label"></label><div class="field" part="field">${this.renderControl()}</div><div class="below"><p class="hint" id="hint"></p><p class="error" id="error" aria-live="polite"></p><span class="count" aria-hidden="true"></span></div>`;
  }

  /** The native control's markup. */
  renderControl() {
    return '';
  }

  /** The native control. */
  get control() {
    return this.query('.control');
  }

  connected() {
    const options = { signal: this.signal };
    const control = this.control;
    control.setAttribute('aria-describedby', 'hint error');
    control.addEventListener('input', () => this.typed(), options);
    // A native `change` stays inside the shadow root; the field repeats it.
    control.addEventListener('change', () => this.dispatchEvent(new Event('change', { bubbles: true })), options);
    control.addEventListener('blur', () => this.#touch(), options);
    // A press on the padding or an icon still lands in the control.
    this.query('.field').addEventListener('pointerdown', (event) => event.target !== control && !this.isDisabled && (event.preventDefault(), control.focus()), options);
    // The form's submit checks every field; this one shows its error then.
    this.addEventListener('invalid', () => this.#touch(), options);
  }

  updated(changed) {
    this.#initial ??= this.value;
    const control = this.control;
    if (changed.has('label')) {
      this.query('.label').textContent = this.label ?? '';
      this.query('.label').hidden = !this.label;
    }
    if (changed.has('hint')) this.query('.hint').textContent = this.hint ?? '';
    for (const name of this.constructor.nativeAttributes) {
      if (!changed.has(name)) continue;
      const value = this[name];
      if (value === undefined || value === null || Number.isNaN(value)) control.removeAttribute(name);
      else control.setAttribute(name, value);
    }
    control.required = this.required;
    control.readOnly = this.readonly;
    this.#syncDisabled();
    if (changed.has('value') && control.value !== this.value) control.value = this.value ?? '';
    this.sync();
  }

  formResetCallback() {
    this.value = this.#initial ?? '';
    this.#touched = false;
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncDisabled();
  }

  formStateRestoreCallback(state) {
    this.value = state;
  }

  /** Focuses the native control. */
  focus(options) {
    this.control.focus(options);
  }

  /** Selects the text in the native control. */
  select() {
    this.control.select();
  }

  get isDisabled() {
    return Boolean(this.disabled || this.#formDisabled);
  }

  #syncDisabled() {
    this.control.disabled = this.isDisabled;
    this.toggleAttribute('data-disabled', this.isDisabled);
  }

  /** Called as the user types; subclasses add to it. */
  typed() {
    this.value = this.control.value;
    this.sync();
  }

  #touch() {
    this.#touched = true;
    this.sync();
  }

  /** A subclass's own rule: a message when the value breaks it, or ''. */
  customValidity() {
    return '';
  }

  /** Updates the form value, the validity and what shows under the field. */
  sync() {
    const control = this.control;
    this[INTERNALS].setFormValue(this.value ?? '');
    // The native checks first, then the field's own rule; `error` overrides both.
    const custom = control.validity.valid ? this.customValidity() : '';
    const message = this.error || custom;
    if (message) this[INTERNALS].setValidity({ customError: true }, message, control);
    else this[INTERNALS].setValidity(control.validity, control.validationMessage, control);
    const invalid = Boolean(this.error) || (this.#touched && !this[INTERNALS].validity.valid);
    this.toggleAttribute('data-invalid', invalid);
    control.ariaInvalid = invalid ? 'true' : null;
    this.query('.error').textContent = invalid ? message || control.validationMessage : '';
    const count = this.query('.count');
    count.hidden = !(this.counter && this.maxlength > 0);
    if (!count.hidden) count.textContent = `${(this.value ?? '').length} / ${this.maxlength}`;
  }
}
