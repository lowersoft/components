import { CHECK_ICON } from '../../core/icons.js';
import { reducedMotion } from '../../core/motion.js';
import { LwStatusButton } from '../button/status-button.js';
import styles from './hold-button.scss?inline';

const HOLD_KEYS = new Set([' ', 'Enter']);
const FILL = { clipPath: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'] };
const DRAIN_DURATION = 300; // ms a full fill takes to drain after an early release
const LABEL_DELAY = 150; // ms before the holding label shows, so a quick tap does not flicker it

/**
 * Press and hold to confirm. The fill tracks the hold and drains back after
 * an early release at a speed that matches how far it got. On completion the
 * label rolls to a drawn check and the button runs its form action.
 *
 * Works with pointer, touch and keyboard (Space or Enter held down).
 *
 * @attr {number} duration - Milliseconds the button has to be held
 * @attr {string} holding-label - Label while holding
 * @attr {string} complete-label - Label once the hold completes
 * @attr {number} reset-after - Milliseconds the complete state shows; 0 keeps it
 * @attr {'idle'|'holding'|'complete'} status - Current status (read only)
 * @fires lw-complete - When the button has been held for the full duration
 */
export class LwHoldButton extends LwStatusButton {
  static styles = [...LwStatusButton.styles, styles];
  static statuses = {
    holding: { icon: '', label: 'holdingLabel', silent: true },
    complete: { icon: CHECK_ICON, label: 'completeLabel', locked: true },
  };
  static props = {
    ...LwStatusButton.props,
    duration: { type: Number, default: 1200 },
    holdingLabel: { default: 'Keep holding' },
    completeLabel: { default: 'Done' },
    resetAfter: { type: Number, default: 1800 },
  };

  #fill = null;
  #holding = false;
  #labelTimer = 0;
  #resetTimer = 0;

  render() {
    return super.render('<span class="fill" part="fill" aria-hidden="true"></span>');
  }

  connected() {
    super.connected();
    const button = this.query('button');
    const options = { signal: this.signal };
    const end = () => this.#end();

    button.addEventListener('pointerdown', this.#onPointerDown, options);
    button.addEventListener('keydown', this.#onKeyDown, options);
    button.addEventListener('keyup', (event) => HOLD_KEYS.has(event.key) && this.#end(), options);
    for (const type of ['pointerup', 'pointerleave', 'pointercancel', 'blur']) button.addEventListener(type, end, options);

    this.signal.addEventListener('abort', () => {
      clearTimeout(this.#labelTimer);
      clearTimeout(this.#resetTimer);
      this.#holding = false;
    });
  }

  // Clicks never confirm; only a completed hold does.
  handleClick() {}

  #onPointerDown = (event) => {
    if (event.button !== 0) return;
    // Touch pointers are captured implicitly, which would keep the hold going
    // after the finger slides off. Release so pointerleave cancels it.
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    this.#start();
  };

  #onKeyDown = (event) => {
    if (!HOLD_KEYS.has(event.key)) return;
    // Stops Enter from clicking and Space from scrolling.
    event.preventDefault();
    if (!event.repeat) this.#start();
  };

  #start() {
    if (this.#holding || this.disabled || this.status === 'complete') return;
    this.#holding = true;
    this.#labelTimer = setTimeout(() => (this.status = 'holding'), LABEL_DELAY);

    // Resumes from wherever a previous drain left the fill.
    this.#fill ??= this.#createFill();
    this.#fill.updatePlaybackRate(1);
    this.#fill.play();
  }

  #end() {
    if (!this.#holding) return;
    this.#holding = false;
    clearTimeout(this.#labelTimer);
    this.status = 'idle';

    // A near miss visibly unwinds; a short tap barely moves. Playing in reverse
    // from time zero would auto-rewind to the end, so an untouched fill resets.
    if (reducedMotion.matches || !this.#fill.currentTime) {
      this.#resetFill();
      return;
    }
    this.#fill.updatePlaybackRate(-this.duration / DRAIN_DURATION);
    this.#fill.play();
  }

  #complete() {
    this.#holding = false;
    clearTimeout(this.#labelTimer);
    this.status = 'complete';
    this.emit('complete');
    this.formAction();

    if (this.resetAfter > 0) {
      this.#resetTimer = setTimeout(() => {
        this.#resetFill();
        this.status = 'idle';
      }, this.resetAfter);
    }
  }

  #createFill() {
    const fill = this.query('.fill').animate(FILL, { duration: this.duration, fill: 'both' });
    fill.pause();
    fill.onfinish = () => {
      if (this.#holding && fill.playbackRate > 0) this.#complete();
    };
    return fill;
  }

  #resetFill() {
    this.#fill?.cancel();
    this.#fill = null;
  }
}
