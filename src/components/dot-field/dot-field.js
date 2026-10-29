import { fitCanvas } from '../../core/canvas.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { createNoise } from '../../core/noise.js';
import { watchTheme } from '../../core/theme.js';
import { watchVisibility } from '../../core/visibility.js';
import { applyPointer, createField, drawField, integrate, settle, SHOCK_LIFE, sampleTone } from './membrane.js';
import styles from './dot-field.scss?inline';

// Physics runs in fixed steps so the springs behave the same at any refresh rate.
const STEP = 1 / 120;
// The idle drift is slow; a frame every 33 ms is plenty for it.
const IDLE_FRAME_MS = 33;
const MAX_SHOCKS = 3;
// Clicks on the content are not meant for the field.
const CONTROLS = "a, button, input, textarea, select, label, [role='button']";

/**
 * A halftone field of dots that drifts like print under a loupe. It is a
 * membrane: swipe fast to leave a wake, click to send a shockwave through
 * it. Put any content inside; without it, the field shows `heading` and
 * `description`.
 *
 * The dots take the element's text colour.
 *
 * @attr {string} heading - The default title
 * @attr {string} description - The default line under it
 * @attr {number} spacing - Distance between dots, in px
 * @attr {number} seed - Seed for the halftone, so a page always opens on the same one
 * @attr {boolean} still - Ignore the pointer; the field only drifts
 * @slot - Content shown over the field
 */
export class LwDotField extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Leave a mark' },
    description: { default: 'A halftone membrane. Swipe fast to leave a wake, click to send a shockwave through it.' },
    spacing: { type: Number, default: 16 },
    seed: { type: Number, default: 7 },
    still: { type: Boolean },
  };

  #context = null;
  #noise = null;
  #field = createField(0, 0, 16);
  #size = { width: 0, height: 0, color: '' };
  #pointer = { x: 0, y: 0, lastX: 0, lastY: 0, inside: false };
  #shocks = [];
  #time = 0;
  #last = 0;
  #lastTone = 0;
  #carry = 0;
  // What the last physics step found; frames shorter than a step go by it.
  #stirring = false;
  #awake = false;
  #frame = 0;
  #visible = false;

  render() {
    return `<div class="layer" aria-hidden="true"><canvas></canvas></div><slot><div class="copy"><h1 class="title"></h1><p class="description"></p></div></slot>`;
  }

  connected() {
    const options = { signal: this.signal };
    const canvas = this.query('canvas');
    this.#context = canvas.getContext('2d');
    const resize = new ResizeObserver(() => this.#resize());
    resize.observe(canvas);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
    watchVisibility(this, (visible) => {
      this.#visible = visible;
      this.#start();
    }, this.signal);
    // The dots follow the text colour, which changes with the theme.
    watchTheme(() => {
      this.#size.color = getComputedStyle(canvas).color;
      this.#draw(false);
    }, this.signal);
    this.addEventListener('pointermove', (event) => this.#move(event), options);
    this.addEventListener('pointerleave', () => (this.#pointer.inside = false), options);
    this.addEventListener('pointerdown', (event) => this.#down(event), options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    if (changed.has('seed')) this.#noise = createNoise(this.seed);
    if (changed.has('seed') || changed.has('spacing')) this.#resize();
  }

  get #interactive() {
    return !this.still && !reducedMotion.matches;
  }

  #resize() {
    if (!this.#context) return;
    const { width, height } = fitCanvas(this.query('canvas'), this.#context);
    Object.assign(this.#size, { width, height, color: getComputedStyle(this.query('canvas')).color });
    this.#field = createField(width, height, Math.max(6, this.spacing));
    sampleTone(this.#field, this.#noise, this.#time);
    this.#awake = false;
    this.#draw(false);
  }

  #draw(moving) {
    if (this.#context) drawField(this.#context, this.#field, this.#size, moving);
  }

  #start() {
    if (this.#frame || !this.#visible || reducedMotion.matches) return;
    this.#last = 0;
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  #wake() {
    if (!this.#awake) {
      this.#awake = true;
      this.#carry = 0;
      this.#stirring = true;
    }
    this.#start();
  }

  #tick(now) {
    this.#frame = 0;
    if (!this.#visible) return;
    const dt = this.#last ? Math.min((now - this.#last) / 1000, 0.05) : 0;
    this.#last = now;
    this.#time += dt;
    const wasAwake = this.#awake;
    if (wasAwake) this.#physics(dt);
    const toneDue = now - this.#lastTone >= IDLE_FRAME_MS;
    if (toneDue) {
      sampleTone(this.#field, this.#noise, this.#time);
      this.#lastTone = now;
    }
    // The drift alone gets about 30 frames a second; a wake gets every one.
    if (wasAwake || toneDue) this.#draw(wasAwake);
    this.#frame = requestAnimationFrame((time) => this.#tick(time));
  }

  #physics(dt) {
    const pushed = applyPointer(this.#field, this.#pointer, dt);
    this.#carry = Math.min(this.#carry + dt, STEP * 6);
    while (this.#carry >= STEP) {
      this.#carry -= STEP;
      for (const shock of this.#shocks) shock.age += STEP;
      while (this.#shocks[0]?.age > SHOCK_LIFE) this.#shocks.shift();
      this.#stirring = integrate(this.#field, this.#shocks, STEP);
    }
    if (pushed || this.#stirring || this.#shocks.length) return;
    // Settled: every dot goes home and the physics sleeps.
    settle(this.#field);
    this.#awake = false;
  }

  #local(event) {
    const rect = this.query('canvas').getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  #move(event) {
    if (!this.#interactive) return;
    const pointer = this.#pointer;
    const { x, y } = this.#local(event);
    if (!pointer.inside) {
      // Start from where the pointer came in, not where it last left.
      Object.assign(pointer, { lastX: x, lastY: y, inside: true });
    }
    Object.assign(pointer, { x, y });
    if (Math.abs(x - pointer.lastX) > 0.5 || Math.abs(y - pointer.lastY) > 0.5) this.#wake();
  }

  #down(event) {
    if (!this.#interactive || event.button !== 0 || event.target.closest?.(CONTROLS)) return;
    const { x, y } = this.#local(event);
    Object.assign(this.#pointer, { x, y, lastX: x, lastY: y, inside: true });
    this.#shocks.push({ x, y, age: 0 });
    if (this.#shocks.length > MAX_SHOCKS) this.#shocks.shift();
    this.#wake();
  }
}
