import { fitCanvas } from '../../core/canvas.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { createNoise } from '../../core/noise.js';
import { watchTheme } from '../../core/theme.js';
import { watchVisibility } from '../../core/visibility.js';
import { CELL, drawLabels, traceContours } from './contours.js';
import styles from './topo-background.scss?inline';

// Width of a hill in the terrain, in px, and how fast the map drifts (px/s).
const TERRAIN_SCALE = 360;
const DRIFT = 6;
// The hill that follows the cursor: height in field units, and spread (px).
const HILL_HEIGHT = 0.5;
const HILL_SPREAD = 120;
// How quickly the hill catches up with the cursor (per second) and how
// quickly it rises or sinks when the cursor arrives or leaves.
const HILL_FOLLOW = 9;
const HILL_RISE = 5;
// A click sends a short wave train outwards through the terrain.
const RIPPLE_MS = 1800;
const RIPPLE_SPEED = 0.24; // px per ms
const RIPPLE_WIDTH = 42;
const RIPPLE_HEIGHT = 0.2;
const RIPPLE_WAVELENGTH = 96;
const MAX_RIPPLES = 4;
// When nothing is moving but the drift, a frame every 33 ms is plenty.
const IDLE_FRAME_MS = 33;
// Labels keep this far from the content (px).
const CLEAR_X = 16;
const CLEAR_Y = 12;
// Clicks on the content are not meant for the map.
const CONTROLS = 'a, button, input, textarea';

/**
 * A living contour map. The terrain drifts slowly; move the cursor to raise
 * a hill under it, click to send a ripple across it. Index contours carry
 * elevations, as on a survey map, kept clear of the content. Put any
 * content inside; without it, the map shows `heading` and `description`.
 *
 * The lines take the element's text colour.
 *
 * @attr {string} heading - The default title
 * @attr {string} description - The default line under it
 * @attr {number} interval - Height between two contour lines; lower draws more lines
 * @attr {number} speed - How fast the terrain drifts; 0 holds it still
 * @attr {number} seed - Seed for the terrain, so a page always opens on the same map
 * @attr {boolean} plain - Leave out the elevation labels
 * @attr {boolean} still - Ignore the cursor
 * @slot - Content shown over the map
 */
export class LwTopoBackground extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Find your footing' },
    description: { default: 'A living contour map. Move the cursor to raise a hill, click to send a ripple across it.' },
    interval: { type: Number, default: 0.07 },
    speed: { type: Number, default: 1 },
    seed: { type: Number, default: 26 },
    plain: { type: Boolean },
    still: { type: Boolean },
  };

  #context = null;
  #noise = null;
  #width = 0;
  #height = 0;
  #cols = 0;
  #rows = 0;
  #field = new Float32Array(0);
  #color = '';
  // The cursor hill, eased towards the pointer so it glides, not jumps.
  #hill = { x: 0, y: 0, targetX: 0, targetY: 0, amount: 0, on: false };
  #ripples = [];
  #slots = { drift: 0, width: 0, height: 0, best: new Map(), avoid: [] };
  #time = 0;
  #last = 0;
  #lastPaint = 0;
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
    // The lines follow the text colour, which changes with the theme.
    watchTheme(() => {
      this.#color = getComputedStyle(canvas).color;
      this.#paint(performance.now());
    }, this.signal);
    this.query('slot').addEventListener('slotchange', () => this.#measureContent(), options);
    this.addEventListener('pointermove', (event) => this.#move(event), options);
    this.addEventListener('pointerleave', () => {
      this.#hill.on = false;
      this.#start();
    }, options);
    this.addEventListener('pointerdown', (event) => this.#down(event), options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    if (changed.has('seed')) this.#noise = createNoise(this.seed);
    this.#measureContent();
    this.#paint(performance.now());
    this.#start();
  }

  get #interactive() {
    return !this.still && !reducedMotion.matches;
  }

  #resize() {
    const canvas = this.query('canvas');
    ({ width: this.#width, height: this.#height } = fitCanvas(canvas, this.#context));
    this.#cols = Math.ceil(this.#width / CELL) + 1;
    this.#rows = Math.ceil(this.#height / CELL) + 1;
    this.#field = new Float32Array(this.#cols * this.#rows);
    this.#color = getComputedStyle(canvas).color;
    this.#measureContent();
    this.#paint(performance.now());
  }

  // Keeps labels out from under the content laid over the map.
  #measureContent() {
    const origin = this.query('canvas').getBoundingClientRect();
    this.#slots.avoid = this.query('slot')
      .assignedElements({ flatten: true })
      .map((element) => element.getBoundingClientRect())
      .map((r) => ({ x0: r.left - origin.left - CLEAR_X, y0: r.top - origin.top - CLEAR_Y, x1: r.right - origin.left + CLEAR_X, y1: r.bottom - origin.top + CLEAR_Y }));
  }

  #sample(now) {
    const cols = this.#cols;
    const z = this.#time * 0.05;
    const drift = this.#time * DRIFT;
    const hill = this.#hill;
    const hillOn = hill.amount > 0.001;
    const spread = 2 * HILL_SPREAD * HILL_SPREAD;
    const ringWidth = 2 * RIPPLE_WIDTH * RIPPLE_WIDTH;
    for (let j = 0; j < this.#rows; j++) {
      const y = j * CELL;
      for (let i = 0; i < cols; i++) {
        const x = i * CELL;
        const nx = (x + drift) / TERRAIN_SCALE;
        const ny = y / TERRAIN_SCALE;
        let v = this.#noise(nx, ny, z) * 0.78 + this.#noise(nx * 2.3 + 17.1, ny * 2.3 + 4.7, z * 1.4) * 0.22;
        if (hillOn) {
          const dx = x - hill.x;
          const dy = y - hill.y;
          v += HILL_HEIGHT * hill.amount * Math.exp(-(dx * dx + dy * dy) / spread);
        }
        for (const ripple of this.#ripples) {
          const age = now - ripple.start;
          const d = Math.hypot(x - ripple.x, y - ripple.y) - age * RIPPLE_SPEED;
          const fade = 1 - age / RIPPLE_MS;
          // A short train of crests and troughs, like a stone dropped in
          // water, so the contours bunch into rings as it passes.
          v += RIPPLE_HEIGHT * fade * fade * Math.exp(-(d * d) / ringWidth) * Math.cos((d / RIPPLE_WAVELENGTH) * Math.PI * 2);
        }
        this.#field[j * cols + i] = v;
      }
    }
  }

  #paint(now) {
    const context = this.#context;
    if (!context || !this.#noise || !this.#cols) return;
    this.#sample(now);
    const minor = new Path2D();
    const major = new Path2D();
    const slots = this.#slots;
    slots.best.clear();
    Object.assign(slots, { drift: this.#time * DRIFT, width: this.#width, height: this.#height });
    traceContours(this.#field, this.#cols, this.#rows, this.interval, minor, major, this.plain ? null : slots);
    context.clearRect(0, 0, this.#width, this.#height);
    context.strokeStyle = this.#color;
    context.fillStyle = this.#color;
    context.lineCap = 'round';
    context.globalAlpha = 0.16;
    context.lineWidth = 0.75;
    context.stroke(minor);
    context.globalAlpha = 0.34;
    context.lineWidth = 1.1;
    context.stroke(major);
    if (!this.plain) drawLabels(context, slots.best.values());
    context.globalAlpha = 1;
  }

  #start() {
    if (this.#frame || !this.#visible || reducedMotion.matches) return;
    this.#last = 0;
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  // Eases the hill towards the cursor and up or down. True while it moves.
  #stepHill(dt) {
    const hill = this.#hill;
    const follow = 1 - Math.exp(-HILL_FOLLOW * dt);
    hill.x += (hill.targetX - hill.x) * follow;
    hill.y += (hill.targetY - hill.y) * follow;
    const goal = hill.on ? 1 : 0;
    hill.amount += (goal - hill.amount) * (1 - Math.exp(-HILL_RISE * dt));
    return Math.abs(hill.targetX - hill.x) > 0.5 || Math.abs(hill.targetY - hill.y) > 0.5 || Math.abs(goal - hill.amount) > 0.002;
  }

  #tick(now) {
    this.#frame = 0;
    if (!this.#visible) return;
    const dt = this.#last ? Math.min((now - this.#last) / 1000, 0.05) : 0;
    this.#last = now;
    const hillMoving = this.#stepHill(dt);
    while (this.#ripples.length && now - this.#ripples[0].start > RIPPLE_MS) this.#ripples.shift();
    const settling = hillMoving || this.#ripples.length > 0;
    this.#time += dt * this.speed;
    // The drift alone gets about 30 frames a second; the hand gets every one.
    if (settling || now - this.#lastPaint >= IDLE_FRAME_MS) {
      this.#paint(now);
      this.#lastPaint = now;
    }
    if (this.speed > 0 || settling) this.#frame = requestAnimationFrame((time) => this.#tick(time));
  }

  #local(event) {
    const rect = this.query('canvas').getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  #move(event) {
    // Touch has no hover; a hill stuck where a finger lifted looks wrong.
    if (!this.#interactive || event.pointerType !== 'mouse') return;
    const { x, y } = this.#local(event);
    const hill = this.#hill;
    // Rise where the cursor came in rather than sliding over from the last place it left.
    if (!hill.on) Object.assign(hill, { x, y });
    Object.assign(hill, { targetX: x, targetY: y, on: true });
    this.#start();
  }

  #down(event) {
    if (!this.#interactive || event.target.closest?.(CONTROLS)) return;
    this.#ripples.push({ ...this.#local(event), start: performance.now() });
    if (this.#ripples.length > MAX_RIPPLES) this.#ripples.shift();
    this.#start();
  }
}
