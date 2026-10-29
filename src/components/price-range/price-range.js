import { LwElement } from '../../core/lw-element.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import styles from './price-range.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

const BINS = 28;

// A stand-in catalogue: many mid-priced items and a long tail, the way prices fall.
const DEMO_PRICES = Array.from({ length: 320 }, (_, i) => {
  const t = ((i * 0.618_034) % 1) * 0.98 + 0.01;
  return Math.round(Math.exp(Math.log(40) + Math.log(25) * (t ** 1.6)) / 5) * 5;
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * A price filter: two thumbs over a histogram of the prices. Bars inside
 * the range go dark, the count of results rolls as it changes, and dragging
 * the stretch between the thumbs slides the whole window. Each thumb is a
 * slider for the keyboard: arrows step, Page Up/Down take bigger steps, Home
 * and End go to the ends.
 *
 * Set `prices` to the prices of the items, as a property or JSON. With a
 * `name`, the form submits `name-min` and `name-max`.
 *
 * @attr {object} prices - The prices the histogram and count are made of
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {number} from - The lower end of the range
 * @attr {number} to - The upper end of the range
 * @attr {string} currency - ISO 4217 code
 * @attr {string} label
 * @attr {string} name - Prefix for the submitted fields
 * @attr {boolean} disabled
 * @fires input - As the range changes while dragging
 * @fires lw-change - When the range is let go; `detail: { from, to, count }`
 * @csspart histogram
 * @csspart track
 */
export class LwPriceRange extends FormControl(LwElement) {
  static styles = [rollingStyles, styles];
  static props = {
    prices: { type: Object, default: DEMO_PRICES },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 1000 },
    step: { type: Number, default: 10 },
    from: { type: Number },
    to: { type: Number },
    currency: { default: 'USD' },
    label: { default: 'Price' },
    name: {},
    disabled: { type: Boolean, reflect: true },
  };

  #drag = null;
  #initial = null;
  #formDisabled = false;

  render() {
    const bars = '<span class="bar"></span>'.repeat(BINS);
    return `<div class="head"><span class="label" id="label"></span><span class="values"><span class="value low"></span><span class="dash" aria-hidden="true">–</span><span class="value high"></span></span></div><div class="histogram" part="histogram" aria-hidden="true">${bars}</div><div class="track" part="track"><span class="fill"></span><span class="thumb" data-end="from" role="slider" tabindex="0" aria-labelledby="label"></span><span class="thumb" data-end="to" role="slider" tabindex="0" aria-labelledby="label"></span></div><p class="count" aria-live="polite"><span class="rolling"></span> <span class="unit"></span></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const track = this.query('.track');
    track.addEventListener('pointerdown', (event) => this.#down(event), options);
    track.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) track.addEventListener(type, () => this.#up(), options);
    for (const thumb of this.shadowRoot.querySelectorAll('.thumb')) thumb.addEventListener('keydown', (event) => this.#key(event, thumb.dataset.end), options);
  }

  updated(changed) {
    if (changed.has('label')) this.query('.label').textContent = this.label ?? '';
    this.#initial ??= { from: this.from, to: this.to };
    if (changed.has('prices') || changed.has('min') || changed.has('max')) this.#renderHistogram();
    this.#render();
  }

  formResetCallback() {
    this.from = this.#initial?.from;
    this.to = this.#initial?.to;
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#render();
  }

  get #prices() {
    return Array.isArray(this.prices) ? this.prices.filter(Number.isFinite) : [];
  }

  get #span() {
    return Math.max(this.max - this.min, 1);
  }

  /** The range as set, kept in order and within the ends. */
  get #range() {
    const low = clamp(this.from ?? this.min, this.min, this.max);
    const high = clamp(this.to ?? this.max, this.min, this.max);
    return [Math.min(low, high), Math.max(low, high)];
  }

  #snap(value) {
    const step = this.step > 0 ? this.step : 1;
    return clamp(Math.round((value - this.min) / step) * step + this.min, this.min, this.max);
  }

  #format(value) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: this.currency, maximumFractionDigits: 0 }).format(value);
  }

  // Bars as tall as their share of the prices, the tallest full height.
  #renderHistogram() {
    const counts = new Array(BINS).fill(0);
    for (const price of this.#prices) {
      if (price < this.min || price > this.max) continue;
      counts[Math.min(BINS - 1, Math.floor(((price - this.min) / this.#span) * BINS))] += 1;
    }
    const top = Math.max(...counts, 1);
    [...this.query('.histogram').children].forEach((bar, i) => {
      bar.style.height = `${Math.max(counts[i] ? 6 : 2, (counts[i] / top) * 100)}%`;
    });
  }

  #render() {
    const [low, high] = this.#range;
    const at = (value) => ((value - this.min) / this.#span) * 100;
    const track = this.query('.track');
    track.style.setProperty('--_from', `${at(low)}%`);
    track.style.setProperty('--_to', `${at(high)}%`);
    // Bars inside the range go dark.
    [...this.query('.histogram').children].forEach((bar, i) => {
      const start = this.min + (this.#span * i) / BINS;
      const end = this.min + (this.#span * (i + 1)) / BINS;
      bar.toggleAttribute('data-in', end > low && start < high);
    });
    this.query('.low').textContent = this.#format(low);
    this.query('.high').textContent = high >= this.max ? `${this.#format(high)}+` : this.#format(high);
    const disabled = Boolean(this.disabled || this.#formDisabled);
    for (const thumb of this.shadowRoot.querySelectorAll('.thumb')) {
      const value = thumb.dataset.end === 'from' ? low : high;
      Object.assign(thumb, {
        ariaValueNow: String(value),
        ariaValueMin: String(thumb.dataset.end === 'from' ? this.min : low),
        ariaValueMax: String(thumb.dataset.end === 'from' ? high : this.max),
        ariaValueText: `${thumb.dataset.end === 'from' ? 'Minimum' : 'Maximum'} ${this.#format(value)}`,
        tabIndex: disabled ? -1 : 0,
      });
      thumb.ariaDisabled = disabled ? 'true' : null;
    }
    const count = this.#count(low, high);
    roll(this.query('.count .rolling'), count.toLocaleString());
    this.query('.count .unit').textContent = count === 1 ? 'result' : 'results';
    const data = new FormData();
    if (this.name) {
      data.append(`${this.name}-min`, String(low));
      data.append(`${this.name}-max`, String(high));
    }
    this[INTERNALS].setFormValue(this.name ? data : null);
  }

  #count(low, high) {
    return this.#prices.filter((price) => price >= low && price <= high).length;
  }

  #set(from, to, final) {
    const [low, high] = [this.#snap(from), this.#snap(to)];
    const [oldLow, oldHigh] = this.#range;
    if (low === oldLow && high === oldHigh) return;
    this.from = low;
    this.to = high;
    // Drawn at once: the batched update would trail the pointer and the form.
    this.#render();
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    if (final) this.#changed();
  }

  #changed() {
    const [from, to] = this.#range;
    this.emit('change', { from, to, count: this.#count(from, to) });
  }

  #valueAt(event) {
    const box = this.query('.track').getBoundingClientRect();
    return this.min + clamp((event.clientX - box.left) / box.width, 0, 1) * this.#span;
  }

  // A press on a thumb drags it; between the thumbs it drags the window;
  // anywhere else on the track the nearer thumb jumps there.
  #down(event) {
    if (this.disabled || this.#formDisabled || event.button !== 0) return;
    const [low, high] = this.#range;
    const value = this.#valueAt(event);
    const thumb = event.target.closest('.thumb');
    let mode;
    if (thumb) mode = thumb.dataset.end;
    else if (value > low && value < high) mode = 'window';
    else {
      mode = Math.abs(value - low) <= Math.abs(value - high) ? 'from' : 'to';
      this.#set(mode === 'from' ? value : low, mode === 'to' ? value : high, false);
    }
    event.preventDefault();
    this.query('.track').setPointerCapture(event.pointerId);
    this.shadowRoot.querySelector(`.thumb[data-end="${mode === 'window' ? 'from' : mode}"]`).focus({ preventScroll: true });
    this.#drag = { mode, start: value, low: this.#range[0], high: this.#range[1] };
    this.toggleAttribute('data-dragging', true);
    this.dataset.drag = mode;
  }

  #move(event) {
    const drag = this.#drag;
    if (!drag) return;
    const value = this.#valueAt(event);
    if (drag.mode === 'window') {
      // The window keeps its width and stops at the ends.
      const width = drag.high - drag.low;
      const shift = clamp(value - drag.start, this.min - drag.low, this.max - drag.high);
      this.#set(drag.low + shift, drag.low + shift + width, false);
    } else if (drag.mode === 'from') {
      this.#set(Math.min(value, this.#range[1]), this.#range[1], false);
    } else {
      this.#set(this.#range[0], Math.max(value, this.#range[0]), false);
    }
  }

  #up() {
    if (!this.#drag) return;
    this.#drag = null;
    this.removeAttribute('data-dragging');
    delete this.dataset.drag;
    this.#changed();
  }

  #key(event, end) {
    if (this.disabled || this.#formDisabled) return;
    const [low, high] = this.#range;
    const step = this.step > 0 ? this.step : 1;
    const big = Math.max(step, this.#snap(this.min + this.#span / 10) - this.min);
    const value = end === 'from' ? low : high;
    const moves = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step, PageDown: -big, PageUp: big };
    let next;
    if (event.key in moves) next = value + moves[event.key];
    else if (event.key === 'Home') next = end === 'from' ? this.min : low;
    else if (event.key === 'End') next = end === 'from' ? high : this.max;
    else return;
    event.preventDefault();
    if (end === 'from') this.#set(Math.min(next, high), high, true);
    else this.#set(low, Math.max(next, low), true);
  }
}
