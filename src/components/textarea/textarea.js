import { fieldStyles, LwField } from '../../core/field.js';
import styles from './textarea.scss?inline';

/**
 * A multi-line text field: a native `<textarea>` with a label, a hint, an
 * error and a length counter, taking part in forms like the native one. With
 * `autosize` it grows with its text from `rows` up to `max-rows`, then
 * scrolls. Ctrl+Enter (⌘+Enter on a Mac) submits its form.
 *
 * @attr {string} value
 * @attr {string} label
 * @attr {string} hint - Help under the field
 * @attr {string} error - A message that marks the field invalid, e.g. from the server
 * @attr {string} placeholder
 * @attr {string} name
 * @attr {boolean} required
 * @attr {boolean} disabled
 * @attr {boolean} readonly
 * @attr {number} minlength
 * @attr {number} maxlength
 * @attr {string} autocomplete
 * @attr {number} rows - Visible lines, and where `autosize` starts
 * @attr {boolean} autosize - Grows with the text
 * @attr {number} max-rows - Where `autosize` stops growing and starts scrolling
 * @attr {'vertical'|'none'} resize - Whether the corner handle resizes it; off with `autosize`
 * @attr {boolean} counter - Shows the length against `maxlength`
 * @fires input - As the value changes, from the native textarea
 * @fires change - When a changed value is committed
 * @csspart field
 * @csspart textarea - The native textarea
 */
export class LwTextarea extends LwField {
  static styles = [fieldStyles, styles];
  static props = {
    ...LwField.props,
    rows: { type: Number, default: 3 },
    autosize: { type: Boolean, reflect: true },
    maxRows: { type: Number, default: 8 },
    resize: { default: 'vertical', reflect: true },
  };

  renderControl() {
    return '<textarea id="control" class="control" part="textarea"></textarea>';
  }

  connected() {
    super.connected();
    // Ctrl/⌘+Enter sends the form, as in most message boxes.
    this.control.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Enter' || !(event.ctrlKey || event.metaKey) || !this.form) return;
        event.preventDefault();
        this.form.requestSubmit();
      },
      { signal: this.signal },
    );
  }

  updated(changed) {
    super.updated(changed);
    this.control.rows = Math.max(1, this.rows || 1);
    this.#fit();
  }

  typed() {
    super.typed();
    this.#fit();
  }

  // Autosize: as tall as the text, between `rows` and `max-rows` lines.
  #fit() {
    const control = this.control;
    if (!this.autosize) {
      control.style.height = '';
      return;
    }
    const style = getComputedStyle(control);
    const line = Number.parseFloat(style.lineHeight);
    const padding = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom);
    const min = line * Math.max(1, this.rows || 1) + padding;
    const max = line * Math.max(this.rows || 1, this.maxRows || 1) + padding;
    control.style.height = 'auto';
    const height = Math.min(Math.max(control.scrollHeight, min), max);
    control.style.height = `${height}px`;
    control.style.overflowY = control.scrollHeight > max ? 'auto' : 'hidden';
  }
}
