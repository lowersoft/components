import toggleStyles from '../styles/toggle.scss?inline';
import { FormControl, INTERNALS } from './form.js';
import { LwElement } from './lw-element.js';

/** Styles for `LwToggle`; put them before the component's own in `static styles`. */
export { toggleStyles };

/**
 * Base for on/off controls: a native checkbox inside a label, with the label
 * text from the content and an optional description. It takes part in forms
 * like a native checkbox: `value` is submitted while checked, `required`
 * means it must be checked, and reset puts back the initial state.
 *
 * A subclass draws the control in `renderVisual()` and may give the native
 * checkbox a `role`, such as `switch`.
 */
export class LwToggle extends FormControl(LwElement) {
  static shadowOptions = { mode: 'open', delegatesFocus: true };
  static role = null;
  static props = {
    checked: { type: Boolean, reflect: true },
    value: { default: 'on' },
    name: {},
    description: {},
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  #initial = null;
  #formDisabled = false;

  render() {
    const role = this.constructor.role ? ` role="${this.constructor.role}"` : '';
    return `<label class="toggle" part="base"><input class="control" type="checkbox"${role} aria-describedby="description"><span class="visual" part="control" aria-hidden="true">${this.renderVisual()}</span><span class="text"><span class="label" part="label"><slot></slot></span><span class="description" id="description" part="description"></span></span></label>`;
  }

  /** The drawn control, over the hidden native checkbox. */
  renderVisual() {
    return '';
  }

  get control() {
    return this.query('.control');
  }

  connected() {
    const control = this.control;
    control.addEventListener(
      'change',
      () => {
        this.checked = control.checked;
        this.changed();
        // The form sees the change at once, before the batched update.
        this.sync();
        // A native `change` stays inside the shadow root; the control repeats it.
        this.dispatchEvent(new Event('change', { bubbles: true }));
      },
      { signal: this.signal },
    );
  }

  updated(changed) {
    // Boolean: an unset `checked` is null, which `??=` would take for "not yet".
    this.#initial ??= Boolean(this.checked);
    const control = this.control;
    if (changed.has('description')) {
      const description = this.query('.description');
      description.textContent = this.description ?? '';
      description.hidden = !this.description;
    }
    control.checked = this.checked;
    control.required = this.required;
    control.disabled = this.disabled || this.#formDisabled;
    this.toggleAttribute('data-disabled', control.disabled);
    this.sync();
  }

  /** Called when the user changes it; subclasses add to it. */
  changed() {}

  formResetCallback() {
    this.checked = this.#initial ?? false;
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.control.disabled = this.disabled || disabled;
    this.toggleAttribute('data-disabled', this.control.disabled);
  }

  formStateRestoreCallback(state) {
    this.checked = state !== null;
  }

  focus(options) {
    this.control.focus(options);
  }

  /** Updates the form value and validity from the native checkbox. */
  sync() {
    const control = this.control;
    this[INTERNALS].setFormValue(this.checked ? (this.value ?? 'on') : null);
    this[INTERNALS].setValidity(control.validity, control.validationMessage, control);
  }
}
