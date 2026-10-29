import { LwToggle, toggleStyles } from '../../core/toggle.js';
import styles from './switch.scss?inline';

/**
 * An on/off switch with its label as content: `<lw-switch>Notifications</lw-switch>`.
 * Use it for a setting that takes effect at once; a checkbox suits a choice
 * submitted later. It is a native checkbox with the `switch` role, so it
 * takes part in forms the same way: `value` is submitted while on.
 *
 * @attr {boolean} checked - On
 * @attr {string} value - Submitted while on; "on" by default
 * @attr {string} name
 * @attr {string} description - A line under the label
 * @attr {boolean} required - It must be on
 * @attr {boolean} disabled
 * @attr {'sm'|'md'} size
 * @slot - The label
 * @fires change - When the user switches it
 * @csspart control - The drawn track and thumb
 * @csspart label
 * @csspart description
 */
export class LwSwitch extends LwToggle {
  static styles = [toggleStyles, styles];
  static role = 'switch';
  static props = {
    ...LwToggle.props,
    size: { default: 'md', reflect: true },
  };

  renderVisual() {
    return '<span class="thumb"></span>';
  }
}
