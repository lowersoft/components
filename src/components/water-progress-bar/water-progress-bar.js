import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, springFeel } from '../../core/motion.js';
import styles from './water-progress-bar.scss?inline';

let uid = 0;

const HEIGHTS = { sm: 10, md: 18, lg: 28 };
const TICKS = 20;
const SCALE_GAP = 6;
const STEP = 1 / 120;
// The level rises on a critically damped spring: no overshoot.
const LEVEL = springFeel(0.9, 0);
// Indeterminate, the water rolls between these shares of the track.
const ROLL = [0.08, 0.42];
const ROLL_PERIOD = 2.6;
const EDGE_POINTS = 24;

/**
 * A progress bar that fills with water from the start. The level moves on a
 * spring that never overshoots; while it moves, the leading edge leans
 * forward and ripples harder, then settles into a gentle swell. Bubbles
 * drift through the water towards the front. An optional scale of ticks
 * beneath takes the water's color as the level passes each one.
 *
 * Without a `value` the bar is indeterminate: the water rolls back and
 * forth and the percentage hides. The ripples pause while the bar is off
 * screen or the tab is hidden, and with reduced motion the water stands
 * still at its level.
 *
 * Set `formatValue` (a function from a whole percentage to text) to change
 * how the percentage reads.
 *
 * @attr {number} value - Progress from 0 to 100; leave it out for an indeterminate bar
 * @attr {string} caption - Text above the bar, on the start
 * @attr {string} label - Accessible name; the caption by default
 * @attr {string} color - The water's color
 * @attr {'sm'|'md'|'lg'} size - Bar thickness: 10, 18 or 28 pixels
 * @attr {number} wave - Ripple height on the leading edge, from 0 (flat) to 1
 * @attr {number} speed - Playback rate of the ripples, bubbles and roll
 * @attr {boolean} no-bubbles
 * @attr {boolean} no-scale - Hides the tick scale
 * @attr {boolean} no-value - Hides the percentage
 * @csspart header - The caption and percentage row
 * @csspart track - The bar
 * @cssprop --lw-water-progress-bar-color - Same as `color`
 */
export class LwWaterProgressBar extends LwElement {
  static styles = styles;
  static props = {
    value: { type: Number },
    caption: {},
    label: {},
    color: {},
    size: { default: 'md', reflect: true },
    wave: { type: Number, default: 0.5 },
    speed: { type: Number, default: 1 },
    noBubbles: { type: Boolean },
    noScale: { type: Boolean },
    noValue: { type: Boolean },
  };

  #id = `lw-water-${++uid}`;
  #format = null;
  #width = 0;
  // The level as a share of the track, and its speed per second.
  #level = 0;
  #velocity = 0;
  #time = 0;
  #bubbles = [];
  #visible = false;
  #started = false;
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#draw() });

  /** Formats the percentage, given as a whole number from 0 to 100. */
  get formatValue() {
    return this.#format;
  }

  set formatValue(format) {
    this.#format = typeof format === 'function' ? format : null;
    if (this.shadowRoot.firstChild) this.#paintText();
  }

  render() {
    const id = this.#id;
    return `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><div class="header" part="header"><span class="caption"></span><span class="percent"></span></div>
<div class="track" part="track"><svg class="water" aria-hidden="true" focusable="false"><defs><clipPath id="${id}-track"><rect class="track-shape"/></clipPath><clipPath id="${id}-body"><path class="body-shape"/></clipPath>
<linearGradient id="${id}-groove" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.16"/><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="0.05"/></linearGradient>
<linearGradient id="${id}-depth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.16"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.24"/></linearGradient>
<linearGradient id="${id}-run" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0.14"/><stop offset="0.65" stop-color="#000" stop-opacity="0"/></linearGradient></defs>
<rect class="channel"/><rect class="groove" fill="url(#${id}-groove)"/><rect class="rim"/>
<g clip-path="url(#${id}-track)"><path class="swell"/><path class="swell-sheen"/><path class="body"/><g clip-path="url(#${id}-body)"><rect class="depth" fill="url(#${id}-depth)"/><rect class="run" fill="url(#${id}-run)"/><rect class="glint"/><g class="bubbles"></g><path class="edge"/></g></g><g class="ticks"></g></svg></div></div>`;
  }

  connected() {
    const sized = new ResizeObserver(() => this.#measure());
    sized.observe(this.query('.track'));
    const seen = new IntersectionObserver(([entry]) => {
      this.#visible = entry.isIntersecting;
      this.#run();
    });
    seen.observe(this);
    document.addEventListener('visibilitychange', () => this.#run(), { signal: this.signal });
    reducedMotion.addEventListener('change', () => this.#run(), { signal: this.signal });
    this.signal.addEventListener('abort', () => {
      sized.disconnect();
      seen.disconnect();
      this.#loop.stop();
    });
  }

  updated(changed) {
    if (this.color) this.style.setProperty('--_water', this.color);
    else this.style.removeProperty('--_water');
    this.query('.caption').textContent = this.caption ?? '';
    this.query('.caption').hidden = !this.caption;
    if (changed.has('size') || changed.has('noScale')) this.#measure();
    if (changed.has('noBubbles')) this.query('.bubbles').hidden = this.noBubbles;
    this.#paintText();
    this.#run();
  }

  get #indeterminate() {
    return this.value == null || Number.isNaN(this.value);
  }

  get #target() {
    return Math.min(1, Math.max(0, (this.value ?? 0) / 100));
  }

  get #height() {
    return HEIGHTS[this.size] ?? HEIGHTS.md;
  }

  #paintText() {
    const bar = this.query('.bar');
    const name = this.label || this.caption;
    if (name) bar.ariaLabel = name;
    else bar.removeAttribute('aria-label');
    const indeterminate = this.#indeterminate;
    const percent = Math.round(this.#target * 100);
    const text = this.#text(percent);
    if (indeterminate) {
      bar.removeAttribute('aria-valuenow');
      bar.removeAttribute('aria-valuetext');
    } else {
      bar.ariaValueNow = String(percent);
      bar.ariaValueText = text;
    }
    bar.ariaBusy = String(indeterminate || percent < 100);
    const label = this.query('.percent');
    label.hidden = indeterminate || this.noValue;
    this.query('.header').hidden = !this.caption && label.hidden;
    this.#paintPercent();
  }

  #text(percent) {
    return this.#format ? String(this.#format(percent)) : `${percent}%`;
  }

  // The percentage on show counts along with the water; screen readers get
  // the value itself.
  #paintPercent() {
    const shown = this.#text(Math.round(Math.min(1, Math.max(0, this.#level)) * 100));
    const label = this.query('.percent');
    if (label.textContent !== shown) label.textContent = shown;
  }

  // Lays the bar out at its real width, so the ripples never stretch.
  #measure() {
    const width = this.query('.track').clientWidth;
    if (!width) return;
    this.#width = width;
    const h = this.#height;
    const total = h + (this.noScale ? 0 : SCALE_GAP + 7);
    const svg = this.query('.water');
    svg.setAttribute('viewBox', `0 0 ${width} ${total}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', total);
    for (const selector of ['.track-shape', '.channel', '.groove']) Object.entries({ x: 0, y: 0, width, height: h, rx: h / 2 }).forEach(([k, v]) => this.query(selector).setAttribute(k, v));
    Object.entries({ x: 0.5, y: 0.5, width: width - 1, height: h - 1, rx: (h - 1) / 2 }).forEach(([k, v]) => this.query('.rim').setAttribute(k, v));
    for (const selector of ['.depth', '.run']) Object.entries({ x: 0, y: 0, width, height: h }).forEach(([k, v]) => this.query(selector).setAttribute(k, v));
    Object.entries({ x: h * 0.3, y: h * 0.17, width: Math.max(0, width - h * 0.6), height: h * 0.13, rx: h * 0.065 }).forEach(([k, v]) => this.query('.glint').setAttribute(k, v));

    const ticks = this.query('.ticks');
    ticks.hidden = this.noScale;
    ticks.innerHTML = this.noScale
      ? ''
      : Array.from({ length: TICKS + 1 }, (_, i) => {
          const major = i % (TICKS / 2) === 0;
          return `<rect class="tick" data-share="${i / TICKS}" x="${0.5 + (i / TICKS) * (width - 2)}" y="${h + SCALE_GAP}" width="1" height="${major ? 7 : 4}" rx="0.5"/>`;
        }).join('');

    // Roughly one bubble per 40 pixels of track.
    const count = this.noBubbles ? 0 : Math.max(3, Math.round(width / 40));
    this.query('.bubbles').innerHTML = Array.from({ length: count }, () => '<circle class="bubble"/>').join('');
    this.#bubbles = Array.from({ length: count }, () => this.#bubble(Math.random()));
    if (!this.#started) {
      this.#level = this.#indeterminate ? ROLL[0] : this.#target;
      this.#started = true;
    }
    this.#draw();
  }

  // A bubble at `x`, a share of the water's length.
  #bubble(x = 0) {
    const h = this.#height;
    return { x, y: 0.25 + Math.random() * 0.55, r: Math.max(0.8, h * (0.06 + Math.random() * 0.07)), drift: 0.05 + Math.random() * 0.08, wobble: Math.random() * Math.PI * 2 };
  }

  // Ripples run only while they can be seen and are wanted.
  #run() {
    const live = this.#visible && !document.hidden && !reducedMotion.matches && this.#width > 0;
    if (reducedMotion.matches) {
      this.#level = this.#indeterminate ? (ROLL[0] + ROLL[1]) / 2 : this.#target;
      this.#velocity = 0;
      this.#draw();
    }
    if (live) this.#loop.wake();
    else this.#loop.stop();
  }

  #step() {
    const speed = Math.max(0, this.speed ?? 1);
    this.#time += STEP * speed;
    const goal = this.#indeterminate ? ROLL[0] + (ROLL[1] - ROLL[0]) * (0.5 - 0.5 * Math.cos((this.#time * 2 * Math.PI) / ROLL_PERIOD)) : this.#target;
    if (this.#indeterminate) {
      // The roll is a timed swing, not a spring chasing it.
      const before = this.#level;
      this.#level = goal;
      this.#velocity = (goal - before) / STEP;
    } else {
      this.#velocity += ((goal - this.#level) * LEVEL.stiffness - this.#velocity * LEVEL.damping) * STEP;
      this.#level += this.#velocity * STEP;
    }
    for (const bubble of this.#bubbles) {
      bubble.x += bubble.drift * STEP * speed;
      if (bubble.x > 1) Object.assign(bubble, this.#bubble(0));
    }
  }

  // The leading edge: a column of points whose x swells with two waves,
  // leaning forward and rippling harder while the level moves.
  #edge(front, phase, amplitude, lean) {
    const h = this.#height;
    const t = this.#time;
    const points = [];
    for (let i = 0; i <= EDGE_POINTS; i++) {
      const y = -2 + ((h + 4) * i) / EDGE_POINTS;
      const s = y / h;
      const ripple = 0.6 * Math.sin(s * 5.2 + t * 3.1 + phase) + 0.4 * Math.sin(s * 9.4 - t * 4.3 + phase * 1.7);
      points.push([front + amplitude * ripple + lean * (0.5 - s) * h, y]);
    }
    return points;
  }

  #draw() {
    const width = this.#width;
    if (!width) return false;
    const h = this.#height;
    const motion = Math.min(1, Math.abs(this.#velocity) * 1.6);
    const amplitude = Math.max(0, Math.min(1, this.wave ?? 0.5)) * h * 0.24 * (1 + motion * 1.4);
    const reach = amplitude * 2 + h * 0.6;
    // From hidden behind the start to fully past the end.
    const front = -reach + this.#level * (width + reach * 2);
    const lean = Math.max(-0.5, Math.min(0.5, this.#velocity * 0.9));

    const toPath = (points, close) => {
      const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join('');
      return close ? `${d}L-40 ${h + 2}L-40 -2Z` : d;
    };
    const edge = this.#edge(front, 0, amplitude, lean);
    const swell = this.#edge(front + amplitude * 0.9 + 1, 1.9, amplitude * 1.1, lean * 1.2);
    const body = toPath(edge, true);
    this.query('.body').setAttribute('d', body);
    this.query('.body-shape').setAttribute('d', body);
    const ahead = toPath(swell, true);
    this.query('.swell').setAttribute('d', ahead);
    this.query('.swell-sheen').setAttribute('d', ahead);
    this.query('.edge').setAttribute('d', toPath(edge, false));
    this.query('.run').setAttribute('width', Math.max(1, front));

    const water = Math.max(0, front);
    this.shadowRoot.querySelectorAll('.bubble').forEach((circle, i) => {
      const bubble = this.#bubbles[i];
      if (!bubble) return;
      const x = bubble.x * water;
      const y = (bubble.y + 0.06 * Math.sin(this.#time * 2.2 + bubble.wobble)) * h;
      // Bubbles fade in at the start and out as they reach the front.
      const fade = Math.min(1, bubble.x * 6, (water - x) / (h * 0.9));
      circle.setAttribute('cx', x.toFixed(2));
      circle.setAttribute('cy', y.toFixed(2));
      circle.setAttribute('r', bubble.r.toFixed(2));
      circle.style.opacity = String(Math.max(0, fade));
    });

    if (!this.#indeterminate) this.#paintPercent();
    for (const tick of this.shadowRoot.querySelectorAll('.tick')) {
      tick.toggleAttribute('data-wet', Number(tick.dataset.share) * (width - 2) + 0.5 <= front);
    }
    return true;
  }
}
