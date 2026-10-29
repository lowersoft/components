import { LwButton } from '../button/button.js';
import styles from './command-button.scss?inline';

/**
 * Button led by its keyboard shortcut, drawn as physical keycaps. The
 * shortcut works anywhere on the page: each cap sinks as its key goes down
 * and the button clicks when the combination matches.
 *
 * @attr {string} shortcut - Defaults to `mod+k`
 * @see LwButton for the shortcut syntax and `passive`
 */
export class LwCommandButton extends LwButton {
  static styles = [...LwButton.styles, styles];
  static props = {
    ...LwButton.props,
    shortcut: { default: 'mod+k' },
  };
}
