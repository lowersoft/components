import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, springFeel } from '../../core/motion.js';
import styles from './follow-cursor-label.scss?inline';

// How fast the chip closes on the pointer, per second: it trails a little.
const FOLLOW = 15;
// Leaning into the motion: degrees per pixel per second, and the most.
const LEAN = 0.012;
const MAX_LEAN = 14;
// The chip's tail sits just off the pointer, above and to the right.
const OFFSET = { x: 14, y: 6 };
const POP = springFeel(0.45, 0.42);
const SETTLE = springFeel(0.35, 0);
const STEP = 1 / 240;

// Only where there is a real pointer to follow.
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

/**
 * A label chip that trails the pointer over the targets inside it. Mark a
 * target with `data-cursor-label="view"`; while it is hovered the chip pops
 * in with an elastic scale, follows with a soft lag, leans into its motion
 * and settles. `data-cursor-color` and `data-cursor-ink` set its colors for
 * that target; moving to another target swaps its words in place.
 *
 * The chip is shown in the top layer, so no parent's overflow or transform
 * clips it. It is decoration: the targets keep their own names, and
 * assistive technology never sees the chip. It stays away on touch screens
 * and for reduced motion.
 *
 * ```html
 * <lw-follow-cursor-label>
 *   <a href="/work" data-cursor-label="view" data-cursor-color="#16a34a">Case study</a>
 * </lw-follow-cursor-label>
 * ```
 *
 * @attr {string} label - Words for a target whose `data-cursor-label` is empty
 * @attr {string} color - The chip's color; the theme's foreground by default
 * @attr {string} ink - The chip's text color; the theme's background by default
 * @slot - Content with targets marked by `data-cursor-label`
 * @csspart chip - The label chip
 * @cssprop --lw-follow-cursor-label-color - Same as `color`
 * @cssprop --lw-follow-cursor-label-ink - Same as `ink`
 */
export class LwFollowCursorLabel extends LwElement {
  static styles = styles;
  static props = {
    label: { default: 'click' },
    color: {},
    ink: {},
  };

  #target = null;
  #pointer = { x: 0, y: 0 };
  // Where the chip is, how far it leans and how large it shows, with speeds.
  #now = { x: 0, y: 0, lean: 0, scale: 0 };
  #speed = { lean: 0, scale: 0 };
  #goal = { lean: 0, scale: 0 };
  #last = { x: 0, y: 0 };
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#draw() });

  render() {
    return '<slot></slot><span class="chip" part="chip" aria-hidden="true" popover="manual"><span class="words"></span></span>';
  }

  connected() {
    const options = { signal: this.signal };
    this.addEventListener('pointerover', (event) => this.#over(event), options);
    this.addEventListener('pointerleave', () => this.#hide(), options);
    this.addEventListener('pointermove', (event) => this.#move(event), options);
    // A scroll moves the targets under a still pointer.
    addEventListener('scroll', () => this.#hide(), { ...options, capture: true, passive: true });
    this.signal.addEventListener('abort', () => {
      this.#loop.stop();
      this.#close();
    });
  }

  updated() {
    if (this.color) this.style.setProperty('--_color', this.color);
    else this.style.removeProperty('--_color');
    if (this.ink) this.style.setProperty('--_ink', this.ink);
    else this.style.removeProperty('--_ink');
  }

  get #allowed() {
    return finePointer.matches && !reducedMotion.matches;
  }

  // The target under the pointer, if it is one of ours.
  #find(event) {
    for (const node of event.composedPath()) {
      if (node === this) return null;
      if (node instanceof Element && node.hasAttribute('data-cursor-label')) return node;
    }
    return null;
  }

  #over(event) {
    if (event.pointerType === 'touch' || !this.#allowed) return;
    const target = this.#find(event);
    if (target === this.#target) return;
    if (!target) {
      this.#hide();
      return;
    }
    const chip = this.query('.chip');
    const words = target.getAttribute('data-cursor-label') || this.label || 'click';
    const color = target.getAttribute('data-cursor-color');
    const ink = target.getAttribute('data-cursor-ink');
    chip.style.setProperty('--_chip', color || 'var(--_color)');
    chip.style.setProperty('--_chip-ink', ink || 'var(--_ink)');
    const showing = this.#target !== null && this.#now.scale > 0.2;
    this.#target = target;
    this.#pointer = { x: event.clientX, y: event.clientY };
    this.query('.words').textContent = words;
    if (showing) {
      // Already out: the words change in place with a little bounce.
      this.#speed.scale -= 4;
    } else {
      Object.assign(this.#now, { x: event.clientX, y: event.clientY, lean: 0, scale: 0 });
      this.#last = { x: event.clientX, y: event.clientY };
      this.#open();
    }
    this.#goal.scale = 1;
    this.#loop.wake();
  }

  #move(event) {
    if (!this.#target) return;
    this.#pointer = { x: event.clientX, y: event.clientY };
    this.#loop.wake();
  }

  #hide() {
    if (!this.#target) return;
    this.#target = null;
    this.#goal.scale = 0;
    this.#loop.wake();
  }

  #open() {
    const chip = this.query('.chip');
    if (chip.matches?.(':popover-open')) return;
    try {
      chip.showPopover();
    } catch {
      // Without the top layer it still shows, fixed to the viewport.
      chip.toggleAttribute('data-open', true);
    }
  }

  #close() {
    const chip = this.query('.chip');
    try {
      if (chip.matches(':popover-open')) chip.hidePopover();
    } catch {
      // Not shown in the top layer.
    }
    chip.removeAttribute('data-open');
  }

  #step() {
    const now = this.#now;
    const follow = 1 - Math.exp(-FOLLOW * STEP);
    now.x += (this.#pointer.x - now.x) * follow;
    now.y += (this.#pointer.y - now.y) * follow;
    // Lean with the sideways speed, on a spring so it settles softly.
    const velocity = (now.x - this.#last.x) / STEP;
    this.#last = { x: now.x, y: now.y };
    this.#goal.lean = Math.max(-MAX_LEAN, Math.min(MAX_LEAN, velocity * LEAN));
    this.#speed.lean += ((this.#goal.lean - now.lean) * SETTLE.stiffness - this.#speed.lean * SETTLE.damping) * STEP;
    now.lean += this.#speed.lean * STEP;
    const pop = this.#goal.scale ? POP : SETTLE;
    this.#speed.scale += ((this.#goal.scale - now.scale) * pop.stiffness - this.#speed.scale * pop.damping) * STEP;
    now.scale += this.#speed.scale * STEP;
  }

  #draw() {
    const now = this.#now;
    const chip = this.query('.chip');
    const scale = Math.max(0, now.scale);
    chip.style.transform = `translate3d(${now.x + OFFSET.x}px, ${now.y - OFFSET.y}px, 0) translateY(-100%) rotate(${now.lean.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    chip.style.opacity = String(Math.min(1, scale * 1.4));
    const resting =
      Math.abs(this.#pointer.x - now.x) < 0.2 &&
      Math.abs(this.#pointer.y - now.y) < 0.2 &&
      Math.abs(now.lean) < 0.05 &&
      Math.abs(this.#speed.lean) < 0.05 &&
      Math.abs(this.#goal.scale - now.scale) < 0.001 &&
      Math.abs(this.#speed.scale) < 0.01;
    if (!this.#target && now.scale < 0.02) {
      this.#close();
      return false;
    }
    return !resting;
  }
}
