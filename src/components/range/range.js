import { fieldStyles, LwField } from '../../core/field.js';
import styles from './range.scss?inline';

/**
 * A slider over a range of numbers, with the value shown beside the label
 * and the track filled up to it. It is a native range input underneath, so
 * it works with the keyboard (arrows, Page Up/Down, Home, End) and is
 * submitted like one.
 *
 * @attr {string} value
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {string} unit - Shown after the value, e.g. "%"
 * @attr {string} label
 * @attr {string} hint - Help under the slider
 * @attr {string} name
 * @attr {boolean} disabled
 * @fires input - As the value changes
 * @fires change - When the value is let go
 * @csspart field
 * @csspart range - The native range input
 * @csspart value - The shown value
 */
export class LwRange extends LwField {
  static styles = [fieldStyles, styles];
  static props = {
    ...LwField.props,
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number },
    unit: { default: '' },
  };

  static nativeAttributes = ['min', 'max', 'step'];

  // `formatValue` is set as a property: formats the shown value.
  // Not declared as a field, which would overwrite a value set before upgrade.

  renderControl() {
    return '<input id="control" class="control" type="range" part="range"><output class="value" for="control" part="value"></output>';
  }

  updated(changed) {
    // The native attributes first, so the value fits the range.
    super.updated(changed);
    // Without a value, the slider starts where the native one does: midway.
    if (!this.value) this.value = this.control.value;
  }

  sync() {
    super.sync();
    const control = this.control;
    const min = Number(control.min || 0);
    const max = Number(control.max || 100);
    const value = Number(control.value);
    control.style.setProperty('--_fill', `${max > min ? ((value - min) / (max - min)) * 100 : 0}%`);
    const text = this.formatValue ? this.formatValue(value) : `${value.toLocaleString()}${this.unit ?? ''}`;
    this.query('.value').textContent = text;
    control.ariaValueText = text;
  }
}
