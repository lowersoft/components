import { fieldStyles, LwField } from '../../core/field.js';
import styles from './text-input.scss?inline';

const TYPES = new Set(['text', 'email', 'url', 'search', 'tel', 'password']);

/**
 * A single-line text field: a native `<input>` with a label, a hint, an error
 * and room for icons or text at either end. It takes part in forms like a
 * native input: its value is submitted, `required`, `pattern` and the length
 * limits are checked, and the error shows once the field has been left or
 * the form submitted, not while it is first being filled in.
 *
 * @attr {string} value
 * @attr {string} label
 * @attr {string} hint - Help under the field
 * @attr {string} error - A message that marks the field invalid, e.g. from the server
 * @attr {'text'|'email'|'url'|'search'|'tel'|'password'} type
 * @attr {string} placeholder
 * @attr {string} name
 * @attr {boolean} required
 * @attr {boolean} disabled
 * @attr {boolean} readonly
 * @attr {number} minlength
 * @attr {number} maxlength
 * @attr {string} pattern
 * @attr {string} autocomplete
 * @attr {string} inputmode
 * @attr {boolean} counter - Shows the length against `maxlength`
 * @attr {'sm'|'md'|'lg'} size
 * @slot start - An icon or text before the value
 * @slot end - An icon, text or button after the value
 * @fires input - As the value changes, from the native input
 * @fires change - When a changed value is committed
 * @csspart field
 * @csspart input - The native input
 */
export class LwTextInput extends LwField {
  static styles = [fieldStyles, styles];
  static props = {
    ...LwField.props,
    type: { default: 'text' },
    pattern: {},
    inputmode: {},
    size: { default: 'md', reflect: true },
  };

  static nativeAttributes = [...LwField.nativeAttributes, 'pattern', 'inputmode'];

  renderControl() {
    return '<slot name="start"></slot><input id="control" class="control" part="input"><slot name="end"></slot>';
  }

  connected() {
    super.connected();
    for (const name of ['start', 'end']) {
      const slot = this.query(`slot[name="${name}"]`);
      slot.addEventListener('slotchange', () => slot.toggleAttribute('data-filled', slot.assignedNodes().length > 0), { signal: this.signal });
    }
  }

  updated(changed) {
    if (changed.has('type')) this.control.type = TYPES.has(this.type) ? this.type : 'text';
    super.updated(changed);
  }
}
