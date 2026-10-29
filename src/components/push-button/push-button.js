import { vibrate } from '../../core/motion.js';
import { LwButton } from '../button/button.js';
import styles from './push-button.scss?inline';

const PRESS_KEYS = new Set(['Enter', ' ']);

/**
 * Keycap button that sinks into its base when pressed, for playful flows
 * like games, onboarding and quizzes. It sinks for the pointer and for Enter
 * or Space alike.
 *
 * @see LwButton for variants, sizes, loading, shortcut and form behavior
 */
export class LwPushButton extends LwButton {
  static styles = [...LwButton.styles, styles];

  connected() {
    super.connected();
    const button = this.query('.button');
    const options = { signal: this.signal };
    const release = () => button.removeAttribute('data-pressed');

    button.addEventListener('pointerdown', () => vibrate(8), options);
    // Space presses natively; Enter has no pressed state, so both are shown here.
    button.addEventListener(
      'keydown',
      (event) => {
        if (!PRESS_KEYS.has(event.key) || event.repeat) return;
        button.setAttribute('data-pressed', '');
        vibrate(8);
      },
      options,
    );
    button.addEventListener('keyup', (event) => PRESS_KEYS.has(event.key) && release(), options);
    button.addEventListener('blur', release, options);
  }
}
