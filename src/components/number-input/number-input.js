import { fieldStyles, LwField } from '../../core/field.js';
import styles from './number-input.scss?inline';

// Holding a step button: a pause, then a step every REPEAT_MS.
const HOLD_MS = 400;
const REPEAT_MS = 60;

/**
 * A number field with − and + buttons. Hold a button to keep stepping; the
 * arrow keys step too, and the buttons stop at `min` and `max`. It is a
 * native number input underneath, so `min`, `max` and `step` are checked and
 * the value is submitted like one.
 *
 * @attr {string} value
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {string} label
 * @attr {string} hint - Help under the field
 * @attr {string} error - A message that marks the field invalid
 * @attr {string} placeholder
 * @attr {string} name
 * @attr {boolean} required
 * @attr {boolean} disabled
 * @attr {boolean} readonly
 * @fires input - As the value changes
 * @fires change - When a changed value is committed
 * @csspart field
 * @csspart input - The native input
 */
export class LwNumberInput extends LwField {
  static styles = [fieldStyles, styles];
  static props = {
    ...LwField.props,
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
  };

  static nativeAttributes = [...LwField.nativeAttributes, 'min', 'max', 'step'];

  #repeat = 0;

  renderControl() {
    const minus = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    const plus = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9M8 3.5v9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    return `<button class="step" type="button" tabindex="-1" data-step="-1" aria-label="Decrease">${minus}</button><input id="control" class="control" type="number" inputmode="decimal" part="input"><button class="step" type="button" tabindex="-1" data-step="1" aria-label="Increase">${plus}</button>`;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    for (const button of this.shadowRoot.querySelectorAll('.step')) {
      button.addEventListener('pointerdown', (event) => event.button === 0 && this.#hold(Number(button.dataset.step)), options);
    }
    for (const type of ['pointerup', 'pointerleave', 'pointercancel']) this.shadowRoot.addEventListener(type, () => this.#release(), options);
    this.signal.addEventListener('abort', () => this.#release());
  }

  sync() {
    super.sync();
    // The buttons stop at the ends.
    const value = Number(this.value);
    const blocked = this.isDisabled || this.readonly;
    const [down, up] = this.shadowRoot.querySelectorAll('.step');
    down.disabled = blocked || (Number.isFinite(this.min) && this.value !== '' && value <= this.min);
    up.disabled = blocked || (Number.isFinite(this.max) && this.value !== '' && value >= this.max);
  }

  // One step now, then more while the button is held.
  #hold(direction) {
    this.#release();
    this.#step(direction);
    const repeat = () => {
      this.#step(direction);
      this.#repeat = setTimeout(repeat, REPEAT_MS);
    };
    this.#repeat = setTimeout(repeat, HOLD_MS);
  }

  #release() {
    if (!this.#repeat) return;
    clearTimeout(this.#repeat);
    this.#repeat = 0;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #step(direction) {
    const control = this.control;
    if (this.isDisabled || this.readonly) return;
    const before = control.value;
    if (direction > 0) control.stepUp();
    else control.stepDown();
    if (control.value === before) {
      this.#release();
      return;
    }
    this.typed();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }
}
