import { fieldStyles } from '../../core/field.js';
import { FormControl, INTERNALS } from '../../core/form.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { chevronDown } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { Menu, menuMarkup, menuStyles } from '../../core/menu.js';
import { swapStyles, swapText } from '../../core/swap.js';
import styles from './select.scss?inline';

/**
 * One value from a list: a field-like button that opens a menu of the
 * options, each with a line of detail if it has one. It is the select the
 * library's forms use.
 *
 * ```html
 * <lw-select label="Build region" name="region" value="fra1"
 *   options='[{ "value": "fra1", "label": "Frankfurt", "description": "FRA1 · ~18 ms" }, …]'>
 * </lw-select>
 * ```
 *
 * Options are `{ value, label, description, disabled, hint }`; all but
 * `value` and `label` can be left out, and a disabled option says why in
 * `hint`, shown on hover or focus.
 *
 * The menu follows the WAI-ARIA menu button pattern: the arrow keys open it
 * and move through the options, wrapping, Home and End jump, Enter or Space
 * picks and Escape closes back to the button. It opens in the top layer, so
 * no ancestor clips it, and is at least as wide as the field.
 *
 * It takes part in forms like a native select: `value` is submitted,
 * `required` means an option must be picked, and the error shows once the
 * field has been left or the form submitted. `error` sets a message from
 * outside, such as the server.
 *
 * @attr {string} value - The picked option's value
 * @attr {Array<object>} options (JSON) - `{ value, label, description, disabled, hint }`
 * @attr {string} label
 * @attr {string} placeholder - Shown while no option is picked
 * @attr {string} hint - Help under the field
 * @attr {string} error - A message that marks the field invalid, e.g. from the server
 * @attr {string} name
 * @attr {boolean} required
 * @attr {boolean} disabled
 * @attr {'sm'|'md'|'lg'} size
 * @fires input - When the user picks an option
 * @fires change - When the user picks an option
 * @csspart label
 * @csspart field - The button that opens the menu
 * @csspart menu
 */
export class LwSelect extends FormControl(LwElement) {
  static shadowOptions = { mode: 'open', delegatesFocus: true };
  static styles = [fieldStyles, iconStyles, menuStyles, swapStyles, styles];
  static props = {
    value: { default: '' },
    options: { type: Object, default: [] },
    label: {},
    placeholder: { default: 'Select…' },
    hint: {},
    error: {},
    name: {},
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    size: { default: 'md', reflect: true },
  };

  #menu = null;
  #initial = null;
  #formDisabled = false;
  // The error shows once the field has been left or the form submitted.
  #touched = false;

  render() {
    return `<span class="label" id="label" part="label"></span><button class="field" id="field" part="field" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="menu" aria-labelledby="label value" aria-describedby="hint error"><span class="value swap" id="value"></span>${strokeIcon(chevronDown, 16)}</button>${menuMarkup('menu')}<div class="below"><p class="hint" id="hint"></p><p class="error" id="error" aria-live="polite"></p></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    // Built once, as it adds to the menu; its listeners follow each connection.
    this.#menu ??= new Menu({ trigger: this.#field, menu: this.query('.menu'), onPick: (value) => this.#pick(value) });
    this.#menu.connect(this.signal);
    // Focus moving between the field and its menu stays inside; this hears it leave.
    this.addEventListener('focusout', () => this.#touch(), options);
    this.addEventListener('invalid', () => this.#touch(), options);
  }

  updated(changed) {
    this.#initial ??= this.value;
    if (changed.has('label')) {
      this.query('.label').textContent = this.label ?? '';
      this.query('.label').hidden = !this.label;
    }
    if (changed.has('hint')) this.query('.hint').textContent = this.hint ?? '';
    if (changed.has('options')) this.#menu.setItems(this.#options);
    this.#menu.setChecked(this.value);
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

  /** Focuses the field. */
  focus(options) {
    this.#field.focus(options);
  }

  get #field() {
    return this.query('.field');
  }

  get #options() {
    return (Array.isArray(this.options) ? this.options : []).map((option) => ({ ...option, value: String(option.value), label: String(option.label ?? option.value) }));
  }

  #pick(value) {
    if (value === this.value) return;
    this.value = value;
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #touch() {
    this.#touched = true;
    this.#sync();
  }

  // Shows the picked label, or the placeholder, and tells the form.
  #sync() {
    const field = this.#field;
    const disabled = Boolean(this.disabled || this.#formDisabled);
    field.disabled = disabled;
    this.toggleAttribute('data-disabled', disabled);
    const picked = this.#options.find((option) => option.value === this.value);
    this.toggleAttribute('data-placeholder', !picked);
    swapText(this.query('.value'), picked?.label ?? this.placeholder ?? '');
    this[INTERNALS].setFormValue(picked ? picked.value : null);
    if (this.error) this[INTERNALS].setValidity({ customError: true }, this.error, field);
    else if (this.required && !picked) this[INTERNALS].setValidity({ valueMissing: true }, 'Please select an item in the list.', field);
    else this[INTERNALS].setValidity({});
    const invalid = Boolean(this.error) || (this.#touched && !this.validity.valid);
    this.toggleAttribute('data-invalid', invalid);
    field.ariaInvalid = invalid ? 'true' : null;
    this.query('.error').textContent = invalid ? this.validationMessage : '';
  }
}
