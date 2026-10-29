import { fitCanvas } from '../../core/canvas.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { createNoise } from '../../core/noise.js';
import { watchTheme } from '../../core/theme.js';
import { watchVisibility } from '../../core/visibility.js';
import { addGust, createAir, drawStill, Particles, stepDisc, stepParticles, stepWake, stirred, windFor } from './wind.js';
import styles from './flow-field.scss?inline';

// Particles at density 1; narrow screens get fewer.
const BASE_COUNT = 700;
const NARROW = 520;
// Streamlines in the still picture, at density 1.
const STILL_LINES = 340;
const SEED = 7;
// Trails fade with this time constant (seconds).
const TRAIL_TAU = 0.22;
// The drift alone is slow; half the frame rate looks the same and costs
// half as much. Anything following the hand gets every frame.
const IDLE_FRAME_MS = 33;
// Destination-out can't fade the last few alpha levels in small steps, so
// while frames are short a stronger pass clears that residue once a second.
const CLEANUP_MS = 1000;
const CLEANUP_ALPHA = 0.24;
// Clicks on the content are not gusts.
const CONTROLS = "a, button, input, textarea, select, label, [role='button']";

/**
 * Wind: streamlines that part around the cursor, swirl in its wake and
 * scatter on click. The cursor is a disc the air flows around; moving it
 * fast sheds a trail of vortices. Put any content inside; without it, the
 * wind shows `heading` and `description`.
 *
 * The trails take the element's text colour. With reduced motion, or a
 * `speed` of 0, it draws a still picture of the wind.
 *
 * @attr {string} heading - The default title
 * @attr {string} description - The default line under it
 * @attr {number} density - Multiplies the number of particles (about 700 at 1)
 * @attr {number} speed - How fast the wind blows; 0 holds a still frame
 * @attr {boolean} still - Ignore the cursor
 * @slot - Content shown over the wind
 */
export class LwFlowField extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Go with the flow' },
    description: { default: 'Streamlines of wind that part around the cursor, swirl in its wake and scatter on click.' },
    density: { type: Number, default: 1 },
    speed: { type: Number, default: 1 },
    still: { type: Boolean },
  };

  #context = null;
  #air = createAir(createNoise(SEED), 1);
  #particles = new Particles();
  #width = 0;
  #height = 0;
  #color = '';
  #frame = 0;
  #lastStep = 0;
  #lastCleanup = 0;
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
      this.#stop();
    });
    watchVisibility(this, (visible) => {
      this.#visible = visible;
      this.#start();
    }, this.signal);
    // The trails follow the text colour, which changes with the theme.
    watchTheme(() => {
      this.#color = getComputedStyle(canvas).color;
      if (this.#frozen) this.#paintStill();
    }, this.signal);
    this.addEventListener('pointermove', (event) => this.#move(event), options);
    this.addEventListener('pointerleave', () => (this.#air.disc.on = false), options);
    this.addEventListener('pointerup', (event) => event.pointerType === 'touch' && (this.#air.disc.on = false), options);
    this.addEventListener('pointercancel', () => (this.#air.disc.on = false), options);
    this.addEventListener('pointerdown', (event) => this.#down(event), options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    if (changed.has('speed')) this.#air.wind = windFor(this.speed);
    if (changed.has('speed') || changed.has('density')) {
      this.#stop();
      this.#resize();
      this.#start();
    }
  }

  // A still picture under reduced motion or at speed 0.
  get #frozen() {
    return this.speed <= 0 || reducedMotion.matches;
  }

  get #count() {
    return Math.round(BASE_COUNT * Math.max(this.density, 0) * (this.#width < NARROW ? 0.6 : 1));
  }

  #resize() {
    if (!this.#context) return;
    const canvas = this.query('canvas');
    ({ width: this.#width, height: this.#height } = fitCanvas(canvas, this.#context));
    this.#context.lineCap = 'butt';
    this.#context.lineWidth = 1.2;
    this.#color = getComputedStyle(canvas).color;
    this.#particles.resize(this.#count, this.#width, this.#height);
    if (this.#frozen) this.#paintStill();
  }

  #paintStill() {
    const context = this.#context;
    context.clearRect(0, 0, this.#width, this.#height);
    context.strokeStyle = this.#color;
    drawStill(context, this.#air, this.#width, this.#height, Math.round((this.#count * STILL_LINES) / BASE_COUNT));
  }

  #start() {
    if (this.#frame || !this.#visible || this.#frozen) return;
    this.#lastStep = 0;
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  #stop() {
    cancelAnimationFrame(this.#frame);
    this.#frame = 0;
  }

  #tick(now) {
    this.#frame = 0;
    if (!this.#visible) return;
    this.#frame = requestAnimationFrame((time) => this.#tick(time));
    const air = this.#air;
    if (!stirred(air) && now - this.#lastStep < IDLE_FRAME_MS - 4) return;
    const dt = this.#lastStep ? Math.min((now - this.#lastStep) / 1000, 0.05) : 1 / 60;
    this.#lastStep = now;
    air.now = now;
    air.time += dt * this.speed;
    stepDisc(air, dt, now);
    stepWake(air, dt);
    this.#fade(dt, now);
    this.#context.strokeStyle = this.#color;
    stepParticles(this.#context, air, this.#particles, dt);
  }

  // Trails fade by erasing a little alpha each frame, so the canvas stays
  // transparent over whatever sits behind it.
  #fade(dt, now) {
    const context = this.#context;
    context.globalCompositeOperation = 'destination-out';
    context.fillStyle = '#000';
    context.globalAlpha = 1 - Math.exp(-dt / TRAIL_TAU);
    context.fillRect(0, 0, this.#width, this.#height);
    if (dt < 0.025 && now - this.#lastCleanup > CLEANUP_MS) {
      this.#lastCleanup = now;
      context.globalAlpha = CLEANUP_ALPHA;
      context.fillRect(0, 0, this.#width, this.#height);
    }
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
  }

  #local(event) {
    const rect = this.query('canvas').getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  #move(event) {
    // A finger only stirs the air while it's down.
    if (this.still || this.#frozen || (event.pointerType === 'touch' && event.buttons === 0)) return;
    const [x, y] = this.#local(event);
    const disc = this.#air.disc;
    if (disc.amount < 0.05) {
      // Appear where the cursor came in rather than sliding over from the
      // last place it left.
      Object.assign(disc, { x, y, vx: 0, vy: 0 });
    }
    Object.assign(disc, { targetX: x, targetY: y, on: true });
    this.#start();
  }

  #down(event) {
    if (this.still || this.#frozen || event.button !== 0 || event.target.closest?.(CONTROLS)) return;
    const [x, y] = this.#local(event);
    addGust(this.#air, x, y, performance.now());
    this.#move(event);
  }
}
