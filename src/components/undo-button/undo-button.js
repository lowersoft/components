import { isTyping } from '../../core/dom.js';
import { CHECK_ICON } from '../../core/icons.js';
import { reducedMotion } from '../../core/motion.js';
import { IS_APPLE } from '../../core/platform.js';
import { LwStatusButton } from '../button/status-button.js';
import styles from './undo-button.scss?inline';

const STROKE = 1.5;
const DIGIT_DURATION = 200;
const DIGIT_EASING = 'cubic-bezier(0.23, 1, 0.32, 1)';

const UNDO_ICON =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11"/></svg>';

/**
 * Rounded-rectangle outline that starts at the top center and runs
 * clockwise, so the countdown drains back toward where it began.
 */
const outline = (width, height, radius) => {
  const s = STROKE / 2;
  const r = Math.min(radius, height / 2) - s;
  const [left, right, top, bottom] = [s, width - s, s, height - s];
  return [
    `M ${width / 2} ${top}`,
    `H ${right - r}`,
    `A ${r} ${r} 0 0 1 ${right} ${top + r}`,
    `V ${bottom - r}`,
    `A ${r} ${r} 0 0 1 ${right - r} ${bottom}`,
    `H ${left + r}`,
    `A ${r} ${r} 0 0 1 ${left} ${bottom - r}`,
    `V ${top + r}`,
    `A ${r} ${r} 0 0 1 ${left + r} ${top}`,
    'Z',
  ].join(' ');
};

/**
 * Action with a grace period. Clicking runs the action and opens an undo
 * window; a ring around the button counts it down. Clicking again, or
 * pressing ⌘Z / Ctrl+Z anywhere outside a text field, undoes it. The clock
 * holds while the pointer is over the button or the tab is hidden, so nobody
 * loses their chance to undo while reading it.
 *
 * @attr {string} done-label - The action in the past tense, e.g. "Archived"
 * @attr {string} undo-label
 * @attr {number} duration - Milliseconds the action can be undone
 * @attr {number} reset-after - Milliseconds the committed state shows; 0 keeps it
 * @attr {'idle'|'pending'|'done'} status - Current status (read only)
 * @slot - Idle label, e.g. "Archive"
 * @slot start - Idle icon
 * @fires lw-action - On click, when the undo window opens. Cancelable.
 * @fires lw-undo - When the action is undone
 * @fires lw-commit - When the window closes without an undo: do the real work here
 */
export class LwUndoButton extends LwStatusButton {
  static styles = [...LwStatusButton.styles, styles];
  static statuses = {
    pending: {
      icon: `<span class="past"></span><span class="divider"></span>${UNDO_ICON}`,
      label: 'undoLabel',
      after: `<span class="seconds"></span><kbd>${IS_APPLE ? '⌘Z' : 'Ctrl Z'}</kbd>`,
      silent: true,
    },
    done: { icon: CHECK_ICON, label: 'doneLabel', locked: true },
  };
  static props = {
    ...LwStatusButton.props,
    doneLabel: { default: 'Archived' },
    undoLabel: { default: 'Undo' },
    duration: { type: Number, default: 5000 },
    resetAfter: { type: Number, default: 2400 },
  };

  #path = null;
  #remaining = 1;
  #seconds = 0;
  #hovered = false;
  #frame = 0;
  #timer = 0;

  render() {
    return super.render('<svg class="ring" aria-hidden="true"><path/></svg>');
  }

  connected() {
    super.connected();
    const button = this.query('.button');
    const options = { signal: this.signal };
    this.#path = this.query('.ring path');

    const hover = (value) => (event) => event.pointerType === 'mouse' && (this.#hovered = value);
    button.addEventListener('pointerenter', hover(true), options);
    button.addEventListener('pointerleave', hover(false), options);
    addEventListener('keydown', this.#onKeyDown, options);

    // Keeps the ring glued to the button while its width animates.
    const observer = new ResizeObserver(() => this.#trace());
    observer.observe(button);
    this.signal.addEventListener('abort', () => {
      observer.disconnect();
      this.#stop();
      clearTimeout(this.#timer);
    });
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('doneLabel')) this.query('.past').textContent = this.doneLabel;
  }

  handleClick() {
    if (this.status === 'idle') {
      if (this.emit('action')) this.status = 'pending';
    } else if (this.status === 'pending') {
      this.#undo();
    }
  }

  statusChanged(status) {
    const button = this.query('.button');
    if (status === 'pending') {
      button.setAttribute('aria-keyshortcuts', IS_APPLE ? 'Meta+Z' : 'Control+Z');
      this.query('.live').textContent = this.doneLabel;
      this.#start();
    } else {
      button.removeAttribute('aria-keyshortcuts');
      this.#stop();
    }
    if (status === 'done' && this.resetAfter > 0) {
      this.#timer = setTimeout(() => (this.status = 'idle'), this.resetAfter);
    }
  }

  #onKeyDown = (event) => {
    const isUndo = (event.metaKey || event.ctrlKey) && !event.shiftKey && event.key.toLowerCase() === 'z';
    if (this.status !== 'pending' || !isUndo || isTyping(event)) return;
    event.preventDefault();
    this.#undo();
  };

  #start() {
    let elapsed = 0;
    let last = performance.now();
    // Start full, without waiting a frame or animating from the last run's digit.
    this.#remaining = 1;
    this.#trace();
    this.#seconds = 0;
    this.query('.seconds').replaceChildren();
    this.#showSeconds(Math.ceil(this.duration / 1000));

    const tick = (now) => {
      if (!this.#hovered && !document.hidden) elapsed += now - last;
      last = now;
      const left = Math.max(0, this.duration - elapsed);
      this.#remaining = left / this.duration;
      this.#paint();
      this.#showSeconds(Math.ceil(left / 1000));
      if (left === 0) {
        this.#frame = 0;
        this.#commit();
        return;
      }
      this.#frame = requestAnimationFrame(tick);
    };
    this.#frame = requestAnimationFrame(tick);
  }

  #stop() {
    cancelAnimationFrame(this.#frame);
    this.#frame = 0;
  }

  #undo() {
    this.#stop();
    this.status = 'idle';
    this.emit('undo');
  }

  #commit() {
    this.status = 'done';
    this.emit('commit');
  }

  #trace() {
    const button = this.query('.button');
    const radius = parseFloat(getComputedStyle(button).borderTopLeftRadius) || 0;
    this.#path.setAttribute('d', outline(button.offsetWidth, button.offsetHeight, radius));
    this.#paint();
  }

  // Dashes in real lengths rather than pathLength, which browsers scale
  // inconsistently once the path changes size.
  #paint() {
    const length = this.#path.getTotalLength();
    this.#path.style.strokeDasharray = `${length * this.#remaining} ${length}`;
  }

  // The new number slides up into place as the old one leaves.
  #showSeconds(seconds) {
    if (seconds === this.#seconds) return;
    const container = this.query('.seconds');
    const previous = container.lastElementChild;
    const next = Object.assign(document.createElement('span'), { textContent: seconds });
    container.append(next);
    const animate = previous && this.#seconds !== 0 && !reducedMotion.matches;
    this.#seconds = seconds;

    if (!animate) {
      previous?.remove();
      return;
    }
    const timing = { duration: DIGIT_DURATION, easing: DIGIT_EASING };
    next.animate({ translate: ['0 10px', '0 0'], opacity: [0, 1] }, timing);
    previous.animate({ translate: ['0 0', '0 -10px'], opacity: [1, 0] }, timing).finished.then(
      () => previous.remove(),
      () => previous.remove(),
    );
  }
}
