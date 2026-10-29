import { fitCanvas } from '../../core/canvas.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { watchTheme } from '../../core/theme.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './background-paths.scss?inline';

const SAMPLES = 64;
// Lines reach this far past each side, so their ends never show.
const OVERSCAN = 0.06;
const DRAW_MS = 1400;
const DRAW_STAGGER_MS = 40;
const PART_RADIUS = 150;
const PART_PUSH = 56;
// Start mid-flow, so the first frame isn't the same every visit.
const START_TIME = 40;

// Three depth layers: the front one is widest, strongest, fastest and parts
// most around the cursor. `phase` keeps them off each other.
const LAYERS = [
  { width: 1, opacity: 0.16, phase: 0.6, pace: 0.7, part: 0.45 },
  { width: 1.25, opacity: 0.26, phase: 0.3, pace: 0.85, part: 0.75 },
  { width: 1.5, opacity: 0.4, phase: 0, pace: 1, part: 1 },
];

const easeOut = (t) => 1 - (1 - t) ** 3;

/**
 * A ribbon of lines that keeps flowing in one colour, at any size. It draws
 * itself in on load, and the lines part around the cursor. Put any content
 * inside; without it, the ribbon shows `heading` and `description`.
 *
 * The lines take the element's text colour.
 *
 * @attr {string} heading - The default title
 * @attr {string} description - The default line under it
 * @attr {number} count - Number of lines, shared across the three depth layers
 * @attr {number} spread - How far the ribbon fans out, as a share of the height
 * @attr {number} angle - Tilt of the ribbon, in degrees
 * @attr {number} speed - How fast the ribbon flows; 0 holds it still
 * @attr {boolean} still - Ignore the cursor
 * @slot - Content shown over the lines
 */
export class LwBackgroundPaths extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Calm by default' },
    description: { default: 'A ribbon of lines that keeps flowing in one colour, at any size. Move the cursor through it and the lines part around you.' },
    count: { type: Number, default: 42 },
    spread: { type: Number, default: 1 },
    angle: { type: Number, default: -8 },
    speed: { type: Number, default: 1 },
    still: { type: Boolean },
  };

  #context = null;
  #width = 0;
  #height = 0;
  #color = '';
  #time = START_TIME;
  // How far each line has drawn in, 0 to 1.
  #drawn = [];
  // `amount` eases to 1 while the cursor is over the ribbon, back to 0 after.
  #pointer = { x: 0, y: 0, amount: 0, on: false };
  #start = 0;
  #last = 0;
  #frame = 0;
  #visible = false;

  render() {
    return `<div class="layer" aria-hidden="true"><canvas></canvas></div><slot><div class="copy"><h1 class="title"></h1><p class="description"></p></div></slot>`;
  }

  connected() {
    const options = { signal: this.signal };
    const canvas = this.query('canvas');
    this.#context = canvas.getContext('2d');
    this.#color = getComputedStyle(canvas).color;
    const resize = new ResizeObserver(() => {
      ({ width: this.#width, height: this.#height } = fitCanvas(canvas, this.#context));
      this.#paint();
    });
    resize.observe(canvas);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
    watchVisibility(this, (visible) => {
      this.#visible = visible;
      this.#play();
    }, this.signal);
    // The lines follow the text colour, which changes with the theme.
    watchTheme(() => {
      this.#color = getComputedStyle(canvas).color;
      this.#paint();
    }, this.signal);
    this.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' || !this.#interactive) return;
      const rect = canvas.getBoundingClientRect();
      Object.assign(this.#pointer, { x: event.clientX - rect.left, y: event.clientY - rect.top, on: true });
      this.#play();
    }, options);
    this.addEventListener('pointerleave', () => {
      this.#pointer.on = false;
      this.#play();
    }, options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    // A new set of lines draws itself in again.
    if (changed.has('count')) {
      this.#drawn = new Array(this.#perLayer * LAYERS.length).fill(reducedMotion.matches ? 1 : 0);
      this.#start = 0;
    }
    this.#paint();
    this.#play();
  }

  get #perLayer() {
    return Math.max(1, Math.round(this.count / LAYERS.length));
  }

  get #interactive() {
    return !this.still && !reducedMotion.matches;
  }

  #play() {
    if (this.#frame || !this.#visible || reducedMotion.matches) return;
    this.#last = performance.now();
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  #tick(now) {
    this.#frame = 0;
    this.#start ||= now;
    this.#time += Math.min((now - this.#last) / 1000, 0.05) * this.speed;
    this.#last = now;
    // The entrance draws each line on once, left to right, staggered.
    const elapsed = now - this.#start;
    const perLayer = this.#perLayer;
    let drawing = false;
    this.#drawn.forEach((drawn, i) => {
      if (drawn >= 1) return;
      this.#drawn[i] = easeOut(Math.min(Math.max((elapsed - (i % perLayer) * DRAW_STAGGER_MS) / DRAW_MS, 0), 1));
      drawing = true;
    });
    const pointer = this.#pointer;
    pointer.amount += ((pointer.on ? 1 : 0) - pointer.amount) * 0.08;
    this.#paint();
    if (this.#visible && (this.speed > 0 || drawing || pointer.on || pointer.amount > 0.001)) this.#frame = requestAnimationFrame((time) => this.#tick(time));
  }

  /**
   * Height of line `s` (-0.5 to 0.5 across the ribbon) at `u` (0 to 1 along
   * it). The ribbon turns over where `twist` crosses zero; that point and
   * the ribbon's curve both slide slowly with time, so the lines keep flowing.
   */
  #lineY(s, u, layer, band, slope) {
    const t = this.#time * layer.pace;
    const center = this.#height * 0.5 + slope * (u * this.#width - this.#width / 2) + band * 0.1 * Math.sin(Math.PI * 2 * (0.75 * u + 0.1) + layer.phase + t * 0.35);
    const turn = 0.22 + 0.09 * Math.sin(t * 0.21 + layer.phase);
    const breathe = 0.3 * Math.sin(t * 0.5 + s * 4 + layer.phase);
    const twist = Math.cos(Math.PI * (u - turn) + s * (0.6 + breathe) + layer.phase);
    return center + s * this.spread * band * twist;
  }

  // Pushes a point away from the cursor, vertically, with a soft falloff.
  #part(x, y, strength) {
    const { x: px, y: py, amount } = this.#pointer;
    if (amount < 0.001) return y;
    const dx = x - px;
    const dy = y - py;
    const falloff = Math.exp(-(dx * dx + dy * dy) / (PART_RADIUS * PART_RADIUS));
    // A soft sign, so lines right under the cursor split smoothly, not snap.
    const side = dy / (Math.abs(dy) + 24);
    return y + side * falloff * PART_PUSH * strength * amount;
  }

  #paint() {
    const context = this.#context;
    if (!context || !this.#drawn.length) return;
    const width = this.#width;
    context.clearRect(0, 0, width, this.#height);
    context.strokeStyle = this.#color;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    // On tall, narrow screens a full-height ribbon turns too steeply to read.
    const band = Math.min(this.#height, width * 1.1);
    const slope = Math.tan((this.angle * Math.PI) / 180);
    const perLayer = this.#perLayer;
    const parting = this.#interactive;
    const xs = new Float32Array(SAMPLES + 1);
    const ys = new Float32Array(SAMPLES + 1);
    LAYERS.forEach((layer, layerIndex) => {
      context.lineWidth = layer.width;
      for (let i = 0; i < perLayer; i++) {
        const drawn = this.#drawn[layerIndex * perLayer + i] ?? 1;
        if (drawn <= 0) continue;
        const s = perLayer === 1 ? 0 : i / (perLayer - 1) - 0.5;
        const last = Math.max(1, Math.ceil(SAMPLES * drawn));
        for (let k = 0; k <= last; k++) {
          const u = -OVERSCAN + (k / SAMPLES) * (1 + OVERSCAN * 2);
          const y = this.#lineY(s, u, layer, band, slope);
          xs[k] = u * width;
          ys[k] = parting ? this.#part(xs[k], y, layer.part) : y;
        }
        // The ribbon's edges fade; its middle carries the weight.
        context.globalAlpha = layer.opacity * (0.45 + 0.55 * (1 - Math.abs(s) * 2));
        context.beginPath();
        context.moveTo(xs[0], ys[0]);
        // Curves through the midpoints keep the line smooth at any sampling.
        for (let k = 1; k < last; k++) context.quadraticCurveTo(xs[k], ys[k], (xs[k] + xs[k + 1]) / 2, (ys[k] + ys[k + 1]) / 2);
        context.lineTo(xs[last], ys[last]);
        context.stroke();
      }
    });
    context.globalAlpha = 1;
  }
}
