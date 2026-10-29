import { fieldStyles } from '../../core/field.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './radio-group.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

/**
 * A single choice from a few options, each an `<lw-radio>`:
 *
 * ```html
 * <lw-radio-group label="Plan" name="plan" value="pro">
 *   <lw-radio value="free">Free</lw-radio>
 *   <lw-radio value="pro">Pro</lw-radio>
 * </lw-radio-group>
 * ```
 *
 * It follows the WAI-ARIA radio group pattern: one Tab stop, the arrow keys
 * move to and pick the next option, wrapping and skipping disabled ones, and
 * Space picks the focused one. It takes part in forms: `value` is submitted,
 * and `required` means an option must be picked.
 *
 * @attr {string} value - The picked option's value
 * @attr {string} label
 * @attr {string} hint - Help under the options
 * @attr {string} name
 * @attr {boolean} required
 * @attr {boolean} disabled
 * @attr {'vertical'|'horizontal'} orientation
 * @slot - The `<lw-radio>` options
 * @fires change - When the user picks an option
 * @csspart options
 */
export class LwRadioGroup extends FormControl(LwElement) {
  static styles = [fieldStyles, styles];
  static props = {
    value: { default: '' },
    label: {},
    hint: {},
    name: {},
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    orientation: { default: 'vertical', reflect: true },
  };

  #initial = null;
  #formDisabled = false;
  // The error shows once the group has been left or the form submitted.
  #touched = false;

  render() {
    return '<span class="label" id="label" part="label"></span><div class="options" part="options"><slot></slot></div><div class="below"><p class="hint"></p><p class="error" aria-live="polite"></p></div>';
  }

  connected() {
    const options = { signal: this.signal };
    this[INTERNALS].role = 'radiogroup';
    this.addEventListener('click', (event) => this.#pick(event.target.closest('lw-radio'), true), options);
    this.addEventListener('keydown', (event) => this.#key(event), options);
    this.addEventListener('focusout', (event) => !this.contains(event.relatedTarget) && this.#touch(), options);
    this.addEventListener('invalid', () => this.#touch(), options);
    this.query('slot').addEventListener('slotchange', () => this.#sync(), options);
  }

  updated(changed) {
    this.#initial ??= this.value;
    if (changed.has('label')) {
      this.query('.label').textContent = this.label ?? '';
      this.query('.label').hidden = !this.label;
      this[INTERNALS].ariaLabel = this.label ?? null;
    }
    if (changed.has('hint')) this.query('.hint').textContent = this.hint ?? '';
    this[INTERNALS].ariaRequired = this.required ? 'true' : null;
    this[INTERNALS].ariaOrientation = this.orientation === 'horizontal' ? 'horizontal' : 'vertical';
    this.#sync();
  }

  formResetCallback() {
    this.value = this.#initial ?? '';
    this.#touched = false;
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#sync();
  }

  formStateRestoreCallback(state) {
    this.value = state ?? '';
  }

  /** Focuses the picked option, or the first that can be picked. */
  focus(options) {
    this.#tabStop?.focus(options);
  }

  get #radios() {
    return [...this.querySelectorAll(':scope > lw-radio')];
  }

  #isOff(radio) {
    return this.disabled || this.#formDisabled || radio.disabled;
  }

  get #enabled() {
    return this.#radios.filter((radio) => !this.#isOff(radio));
  }

  // The one option in the Tab order: the picked one, or the first enabled.
  get #tabStop() {
    return this.#enabled.find((radio) => radio.value === this.value) ?? this.#enabled[0];
  }

  #pick(radio, byUser = false) {
    if (!radio || this.#isOff(radio)) return;
    radio.focus();
    if (radio.value === this.value) return;
    this.value = radio.value;
    this.#sync();
    if (byUser) {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  #key(event) {
    const radios = this.#enabled;
    const index = radios.indexOf(event.target.closest('lw-radio'));
    if (index < 0) return;
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (step) {
      event.preventDefault();
      this.#pick(radios[(index + step + radios.length) % radios.length], true);
    } else if (event.key === ' ') {
      event.preventDefault();
      this.#pick(radios[index], true);
    }
  }

  #touch() {
    this.#touched = true;
    this.#sync();
  }

  // Checks the picked option, sets the Tab stop and tells the form.
  #sync() {
    const tabStop = this.#tabStop;
    for (const radio of this.#radios) {
      radio.checked = radio.value === this.value;
      radio.tabIndex = radio === tabStop ? 0 : -1;
      radio.toggleAttribute('data-group-disabled', this.disabled || this.#formDisabled);
    }
    this.toggleAttribute('data-disabled', this.disabled || this.#formDisabled);
    const picked = this.#radios.some((radio) => radio.value === this.value && radio.checked) ? this.value : '';
    this[INTERNALS].setFormValue(picked || null);
    const missing = this.required && !picked;
    if (missing) this[INTERNALS].setValidity({ valueMissing: true }, 'Please choose one of these options.', tabStop ?? undefined);
    else this[INTERNALS].setValidity({});
    const invalid = missing && this.#touched;
    this.toggleAttribute('data-invalid', invalid);
    this.query('.error').textContent = invalid ? this.validationMessage : '';
  }
}
