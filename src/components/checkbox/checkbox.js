import { CHECK_ICON, iconStyles } from '../../core/icons.js';
import { LwToggle, toggleStyles } from '../../core/toggle.js';
import styles from './checkbox.scss?inline';

/**
 * A checkbox with its label as content: `<lw-checkbox>Remember me</lw-checkbox>`.
 * The tick draws itself in when checked. `indeterminate` shows a dash for a
 * group that is partly checked, until the box is clicked. It takes part in
 * forms like a native checkbox: `value` is submitted while checked.
 *
 * @attr {boolean} checked
 * @attr {boolean} indeterminate - Partly checked, as for a group; cleared by a click
 * @attr {string} value - Submitted while checked; "on" by default
 * @attr {string} name
 * @attr {string} description - A line under the label
 * @attr {boolean} required - It must be checked
 * @attr {boolean} disabled
 * @slot - The label
 * @fires change - When the user checks or unchecks it
 * @csspart control - The drawn box
 * @csspart label
 * @csspart description
 */
export class LwCheckbox extends LwToggle {
  static styles = [iconStyles, toggleStyles, styles];
  static props = {
    ...LwToggle.props,
    indeterminate: { type: Boolean, reflect: true },
  };

  renderVisual() {
    return `${CHECK_ICON}<span class="dash"></span>`;
  }

  updated(changed) {
    super.updated(changed);
    this.control.indeterminate = this.indeterminate;
  }

  // A click settles a partly checked box, as on a native checkbox.
  changed() {
    this.indeterminate = false;
  }
}
