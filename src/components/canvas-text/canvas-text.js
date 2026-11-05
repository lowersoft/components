import { fitCanvas } from '../../core/canvas.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion } from '../../core/motion.js';
import { setHeadingLevel, watchContent } from '../../core/text.js';
import { watchTheme } from '../../core/theme.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './canvas-text.scss?inline';

const STEP = 1 / 120;
// Radians a second the loading ring turns.
const SPIN = 2.4;
// The spring home after the morph: a little under critical damping, so a
// particle pulled away comes back with the faintest overshoot.
const K = 170;
const C = 2 * Math.sqrt(K) * 0.7;
const MAX_PARTICLES = 9000;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * A word drawn as a cloud of dots on a canvas. The dots first chase each
 * other round a loading ring, then stream off it, each in its own moment,
 * and settle into the letters. Once settled they hold a crisp lattice, or
 * drift a little with `drift`, and lean toward the pointer within
 * `magnetic-radius`.
 *
 * The letters are sampled from the element's own font and sampled again
 * once web fonts arrive or the box resizes, the dots flowing to their new
 * places. The intro waits until the word is on screen, the loop rests off
 * screen, in a hidden tab, while `paused` and whenever nothing moves, and
 * with reduced motion the finished word shows at once. Screen readers read
 * the text itself. Give the element a height; the word is scaled down to
 * fit its width.
 *
 * @attr {string} text - The words; when set, the content is ignored
 * @attr {string} color - The dots; the element's text color by default
 * @attr {number} font-size - Size the letters are sampled at, in pixels
 * @attr {number} particle-size - Each dot's diameter, in pixels
 * @attr {number} density - Pixels between samples, as a multiple; 1 is densest
 * @attr {number} drift - How far settled dots wander, in pixels; 0 holds them still
 * @attr {number} scatter - The loading ring's radius, in pixels
 * @attr {number} load-duration - Seconds on the ring before the morph
 * @attr {number} morph-duration - Seconds the morph into letters takes
 * @attr {number} magnetic - How strongly the pointer pulls; 0 turns it off
 * @attr {number} magnetic-radius - How far the pointer reaches, in pixels
 * @attr {boolean} paused - Holds the dots where they are
 * @attr {string} replay-key - Changing it plays the intro again
 * @attr {number} level - Makes it a heading of this level, 1 to 6
 * @csspart canvas
 */
export class LwCanvasText extends LwElement {
  static styles = styles;
  static props = {
    text: {},
    color: {},
    fontSize: { type: Number, default: 64 },
    particleSize: { type: Number, default: 1.6 },
    density: { type: Number, default: 2 },
    drift: { type: Number, default: 0 },
    scatter: { type: Number, default: 48 },
    loadDuration: { type: Number, default: 1 },
    morphDuration: { type: Number, default: 1.4 },
    magnetic: { type: Number, default: 0.35 },
    magneticRadius: { type: Number, default: 100 },
    paused: { type: Boolean, reflect: true },
    replayKey: {},
    level: { type: Number },
  };

  #context = null;
  #size = { width: 0, height: 0 };
  #color = '';
  #particles = [];
  #time = 0;
  #visible = false;
  #pointer = null;
  #replayKey;
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#draw() });

  render() {
    return '<span class="sr"></span><canvas part="canvas" aria-hidden="true"></canvas>';
  }

  connected() {
    const options = { signal: this.signal };
    const canvas = this.query('canvas');
    this.#context = canvas.getContext('2d');
    watchContent(this, () => this.#sample(true), this.signal);
    const sized = new ResizeObserver(() => this.#sample(false));
    sized.observe(this);
    // Letters change shape when a web font arrives.
    document.fonts?.ready.then(() => this.isConnected && this.#sample(false));
    watchVisibility(
      this,
      (visible) => {
        this.#visible = visible;
        this.#wake();
      },
      this.signal,
    );
    watchTheme(() => {
      this.#readColor();
      this.#draw();
    }, this.signal);
    reducedMotion.addEventListener('change', () => this.#sample(true), options);
    this.addEventListener('pointermove', (event) => this.#point(event), options);
    this.addEventListener('pointerleave', () => {
      this.#pointer = null;
      this.#wake();
    }, options);
    this.signal.addEventListener('abort', () => {
      sized.disconnect();
      this.#loop.stop();
    });
  }

  updated(changed) {
    if (changed.has('level')) setHeadingLevel(this, this.level);
    this.#readColor();
    if (changed.has('replayKey')) {
      // The first value only records where it starts.
      if (this.#replayKey !== undefined) this.replay();
      this.#replayKey = this.replayKey ?? null;
    }
    const shape = ['text', 'fontSize', 'density', 'scatter'];
    if (shape.some((prop) => changed.has(prop))) this.#sample(changed.has('text'));
    else this.#wake();
  }

  /** Plays the intro again: back onto the ring, then into the letters. */
  replay() {
    this.#time = 0;
    this.#sample(true);
  }

  get #phrase() {
    return this.text ?? this.textContent.trim();
  }

  #readColor() {
    this.#color = this.color || getComputedStyle(this).color;
  }

  // Samples the letters into home positions. A fresh start puts every dot
  // back on the ring; otherwise each dot keeps where it is and heads for a
  // new home.
  #sample(fresh) {
    if (!this.isConnected || !this.#context) return;
    const text = this.#phrase;
    this.query('.sr').textContent = text;
    const { width, height } = fitCanvas(this.query('canvas'), this.#context);
    this.#size = { width, height };
    if (!width || !height) return;
    const homes = this.#letters(text, width, height);
    const cx = width / 2;
    const cy = height / 2;
    // Matching ring places to homes by angle keeps the streams from crossing.
    const angle = ([x, y]) => Math.atan2(y - cy, x - cx);
    homes.sort((a, b) => angle(a) - angle(b));
    const old = this.#particles;
    const still = reducedMotion.matches;
    if (fresh || old.length === 0) this.#time = 0;
    const scatter = Math.max(0, this.scatter ?? 48);
    this.#particles = homes.map(([hx, hy], i) => {
      const reuse = !fresh && old.length ? old[Math.floor((i / homes.length) * old.length)] : null;
      // Spread evenly round the ring, in the same order as their homes.
      const a = -Math.PI + (i / homes.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.05;
      return {
        hx,
        hy,
        x: reuse ? reuse.x : hx,
        y: reuse ? reuse.y : hy,
        vx: reuse ? reuse.vx : 0,
        vy: reuse ? reuse.vy : 0,
        a,
        r: scatter * (0.82 + Math.random() * 0.36),
        delay: Math.random(),
        seed: Math.random() * Math.PI * 2,
        // A dot that already lives in the word skips the intro.
        settled: still || Boolean(reuse && old.every((p) => p.settled)),
      };
    });
    if (still) for (const p of this.#particles) Object.assign(p, { x: p.hx, y: p.hy, vx: 0, vy: 0, settled: true });
    this.#draw();
    this.#wake();
  }

  // Where the letters' pixels are, on a grid `density` pixels apart.
  #letters(text, width, height) {
    if (!text) return [];
    const style = getComputedStyle(this);
    const probe = document.createElement('canvas');
    probe.width = Math.ceil(width);
    probe.height = Math.ceil(height);
    const context = probe.getContext('2d', { willReadFrequently: true });
    let size = Math.max(8, this.fontSize ?? 64);
    const font = (px) => `${style.fontStyle} ${style.fontWeight} ${px}px ${style.fontFamily}`;
    context.font = font(size);
    // Scaled down to fit the box.
    const measured = context.measureText(text).width;
    if (measured > width * 0.94) size *= (width * 0.94) / measured;
    size = Math.min(size, height * 0.9);
    context.font = font(size);
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#000';
    context.fillText(text, width / 2, height / 2);
    const { data } = context.getImageData(0, 0, probe.width, probe.height);
    let stride = Math.max(1, (this.density ?? 2) * 1.4);
    const collect = () => {
      const points = [];
      for (let y = stride / 2; y < probe.height; y += stride) {
        for (let x = stride / 2; x < probe.width; x += stride) {
          if (data[(Math.floor(y) * probe.width + Math.floor(x)) * 4 + 3] > 128) points.push([x, y]);
        }
      }
      return points;
    };
    let points = collect();
    while (points.length > MAX_PARTICLES) {
      stride *= 1.25;
      points = collect();
    }
    return points;
  }

  #point(event) {
    if (!(this.magnetic > 0) || reducedMotion.matches) return;
    const box = this.query('canvas').getBoundingClientRect();
    this.#pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    this.#wake();
  }

  #wake() {
    if (this.#visible && !this.paused && !reducedMotion.matches && this.#particles.length) this.#loop.wake();
    else this.#loop.stop();
  }

  #step() {
    this.#time += STEP;
    const time = this.#time;
    const { width, height } = this.#size;
    const cx = width / 2;
    const cy = height / 2;
    const load = Math.max(0, this.loadDuration ?? 1);
    const morph = Math.max(0.1, this.morphDuration ?? 1.4);
    const drift = Math.max(0, this.drift ?? 0);
    const pointer = this.#pointer;
    const reach = Math.max(1, this.magneticRadius ?? 100);
    const pull = Math.max(0, this.magnetic ?? 0) * K * reach * 0.5;
    for (const p of this.#particles) {
      if (!p.settled) {
        // On the ring until its moment, then along an eased path into place,
        // the ring still turning under it as it leaves.
        const start = load + p.delay * morph * 0.4;
        const u = clamp((time - start) / (morph * 0.6), 0, 1);
        const spin = p.a + time * SPIN;
        const breathe = 1 + Math.sin(time * 3 + p.seed) * 0.06;
        const rx = cx + Math.cos(spin) * p.r * breathe;
        const ry = cy + Math.sin(spin) * p.r * breathe;
        const e = ease(u);
        p.x = rx + (p.hx - rx) * e;
        p.y = ry + (p.hy - ry) * e;
        if (u >= 1) Object.assign(p, { settled: true, vx: 0, vy: 0 });
        continue;
      }
      let tx = p.hx;
      let ty = p.hy;
      if (drift) {
        tx += Math.sin(time * 0.9 + p.seed) * drift;
        ty += Math.cos(time * 0.7 + p.seed * 1.3) * drift;
      }
      let ax = (tx - p.x) * K - p.vx * C;
      let ay = (ty - p.y) * K - p.vy * C;
      if (pointer) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < reach && d > 0.001) {
          // Strongest a little way out from the pointer, so the dots lean in
          // without piling onto it.
          const f = pull * (1 - d / reach) ** 2 * Math.min(1, d / (reach * 0.2));
          ax += (dx / d) * f;
          ay += (dy / d) * f;
        }
      }
      p.vx += ax * STEP;
      p.vy += ay * STEP;
      p.x += p.vx * STEP;
      p.y += p.vy * STEP;
    }
  }

  #draw() {
    const context = this.#context;
    const { width, height } = this.#size;
    if (!context || !width) return false;
    context.clearRect(0, 0, width, height);
    context.fillStyle = this.#color;
    const size = Math.max(0.5, this.particleSize ?? 1.6);
    const half = size / 2;
    context.beginPath();
    let moving = Boolean(this.#pointer) || (this.drift ?? 0) > 0;
    for (const p of this.#particles) {
      if (size <= 2) context.rect(p.x - half, p.y - half, size, size);
      else {
        context.moveTo(p.x + half, p.y);
        context.arc(p.x, p.y, half, 0, Math.PI * 2);
      }
      if (!moving && (!p.settled || Math.abs(p.vx) > 0.5 || Math.abs(p.vy) > 0.5 || Math.abs(p.x - p.hx) > 0.05 || Math.abs(p.y - p.hy) > 0.05)) moving = true;
    }
    context.fill();
    if (!moving) {
      for (const p of this.#particles) Object.assign(p, { x: p.hx, y: p.hy, vx: 0, vy: 0 });
    }
    return moving;
  }
}
