import { FormControl, INTERNALS } from '../../core/form.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion } from '../../core/motion.js';
import styles from './gooey-slider.scss?inline';

let uid = 0;

const STEP = 1 / 240;
const HEIGHT = 56;
const MID = HEIGHT / 2;
const RADIUS = 18;
const BAR = 10;
// The thumb chases its value firmly; a drop trailing behind it lags on a
// softer spring, so a quick drag pulls a tail that catches up on its own.
const THUMB = { k: 900, c: 58 };
const TAIL = { k: 260, c: 24 };
// The drop never falls so far behind that the goo lets go of it.
const MAX_LAG = RADIUS * 1.5;
const GROW = { k: 520, c: 30 };

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * A range slider whose fill and thumb are one liquid shape: the bar runs
 * into the thumb through a soft neck, the thumb stretches along the way it
 * moves, and a quick drag pulls a drop behind it that catches up, all
 * blended by an SVG goo filter. The thumb swells while held and contracts
 * back to a circle on release. The value sits on the thumb.
 *
 * It is an ARIA slider and a form control: the arrow keys step it, Page Up
 * and Page Down move a tenth, Home and End go to the ends, and `lw-change`
 * reports every new value, while dragging too. With reduced motion it
 * moves without stretching.
 *
 * @attr {number} value
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {string} label - Accessible name of the slider
 * @attr {string} name - Submits the value with the form under this name
 * @attr {boolean} disabled
 * @attr {number} width - Track width in pixels; it shrinks to fit a narrower space
 * @attr {number} viscosity - How far the blend spreads between bar and thumb; 0 keeps hard edges
 * @attr {string} fill - Color of the bar and thumb; the theme's foreground by default
 * @attr {string} ink - Color of the number on the thumb; the theme's background by default
 * @fires lw-change - The value changed; `detail: { value }`
 * @csspart base - The slider
 * @csspart value - The number on the thumb
 * @cssprop --lw-gooey-slider-fill - Same as `fill`
 * @cssprop --lw-gooey-slider-ink - Same as `ink`
 */
export class LwGooeySlider extends FormControl(LwElement) {
  static styles = styles;
  static props = {
    value: { type: Number, default: 64 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    label: { default: 'Value' },
    name: {},
    disabled: { type: Boolean, reflect: true },
    width: { type: Number, default: 300 },
    viscosity: { type: Number, default: 7 },
    fill: {},
    ink: {},
  };

  #id = `lw-gooey-slider-${++uid}`;
  #track = 0;
  #initial = null;
  #placed = false;
  #held = null;
  #formDisabled = false;
  // Thumb, tail and swell: where each is, where it heads and how fast.
  #thumb = { x: 0, v: 0, to: 0 };
  #tail = { x: 0, v: 0 };
  #grow = { x: 1, v: 0 };
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#draw() });

  render() {
    const id = this.#id;
    return `<div class="slider" part="base" role="slider" tabindex="0"><span class="lane"></span><svg class="goo" height="${HEIGHT}" aria-hidden="true" focusable="false"><defs><filter id="${id}-goo" x="-20%" y="-60%" width="140%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo"/><feMerge><feMergeNode in="goo"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g class="blobs" filter="url(#${id}-goo)"><rect class="bar" y="${MID - BAR / 2}" height="${BAR}" rx="${BAR / 2}"/><circle class="tail" cy="${MID}"/><ellipse class="thumb" cy="${MID}"/></g></svg><span class="value" part="value" aria-hidden="true"></span></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const slider = this.query('.slider');
    slider.addEventListener('pointerdown', (event) => this.#down(event), options);
    slider.addEventListener('pointermove', (event) => this.#held === event.pointerId && this.#seek(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) slider.addEventListener(type, () => this.#up(), options);
    slider.addEventListener('keydown', (event) => this.#key(event), options);
    const sized = new ResizeObserver(() => this.#measure());
    sized.observe(slider);
    this.signal.addEventListener('abort', () => {
      sized.disconnect();
      this.#loop.stop();
      this.#held = null;
    });
  }

  updated(changed) {
    this.#initial ??= this.value;
    const slider = this.query('.slider');
    slider.ariaLabel = this.label || 'Value';
    if (changed.has('disabled')) this.#syncDisabled();
    this.style.setProperty('--_width', `${Math.max(RADIUS * 4, this.width ?? 300)}px`);
    for (const [prop, name] of [['fill', '--_fill'], ['ink', '--_ink']]) {
      if (this[prop]) this.style.setProperty(name, this[prop]);
      else this.style.removeProperty(name);
    }
    const blur = Math.max(0, this.viscosity ?? 7);
    this.query('feGaussianBlur').setAttribute('stdDeviation', String(blur));
    this.query('.blobs').setAttribute('filter', blur ? `url(#${this.#id}-goo)` : '');
    const value = this.#clamp(this.value);
    this.#readout(value);
    this.#aim(value);
  }

  formResetCallback() {
    this.value = this.#clamp(this.#initial);
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncDisabled();
  }

  get #active() {
    return !this.disabled && !this.#formDisabled;
  }

  #syncDisabled() {
    const slider = this.query('.slider');
    slider.tabIndex = this.#active ? 0 : -1;
    slider.ariaDisabled = this.#active ? null : 'true';
    if (!this.#active) this.#up();
  }

  #clamp(value) {
    const { min, max } = this;
    const step = this.step > 0 ? this.step : 1;
    const snapped = Number((Math.round((Number(value) - min) / step) * step + min).toFixed(10));
    return clamp(Number.isFinite(snapped) ? snapped : min, Math.min(min, max), Math.max(min, max));
  }

  #fraction(value) {
    return this.max - this.min > 0 ? (value - this.min) / (this.max - this.min) : 0;
  }

  #readout(value) {
    this.query('.value').textContent = value.toLocaleString('en-US');
    Object.assign(this.query('.slider'), {
      ariaValueNow: String(value),
      ariaValueMin: String(this.min),
      ariaValueMax: String(this.max),
    });
    this[INTERNALS].setFormValue(this.name ? String(value) : null);
  }

  #commit(next) {
    const value = this.#clamp(next);
    if (value === this.value) return;
    this.value = value;
    this.emit('change', { value });
  }

  // The thumb's center runs between one radius in from either end.
  #xOf(value) {
    return RADIUS + this.#fraction(value) * Math.max(0, this.#track - RADIUS * 2);
  }

  #aim(value) {
    if (!this.#track) return;
    this.#thumb.to = this.#xOf(value);
    if (!this.#placed || reducedMotion.matches) {
      this.#thumb.x = this.#tail.x = this.#thumb.to;
      this.#thumb.v = this.#tail.v = 0;
      this.#grow = { x: this.#held === null ? 1 : 1.08, v: 0 };
      this.#placed = true;
      this.#draw();
      return;
    }
    this.#loop.wake();
  }

  #measure() {
    const width = this.query('.slider').offsetWidth;
    if (!width || width === this.#track) return;
    this.#track = width;
    this.query('.goo').setAttribute('width', String(width));
    this.#placed = false;
    this.#aim(this.#clamp(this.value));
  }

  #down(event) {
    if (!this.#active || event.button > 0) return;
    event.preventDefault();
    const slider = this.query('.slider');
    slider.focus({ focusVisible: false });
    slider.setPointerCapture(event.pointerId);
    this.#held = event.pointerId;
    this.toggleAttribute('data-held', true);
    this.#seek(event);
    this.#loop.wake();
  }

  #up() {
    if (this.#held === null) return;
    this.#held = null;
    this.toggleAttribute('data-held', false);
    if (reducedMotion.matches) this.#aim(this.#clamp(this.value));
    else this.#loop.wake();
  }

  #seek(event) {
    const box = this.query('.slider').getBoundingClientRect();
    const span = Math.max(1, box.width - RADIUS * 2);
    const fraction = clamp((event.clientX - box.left - RADIUS) / span, 0, 1);
    this.#commit(this.min + fraction * (this.max - this.min));
  }

  #key(event) {
    if (!this.#active) return;
    const step = this.step > 0 ? this.step : 1;
    const page = Math.max(step, (this.max - this.min) / 10);
    const value = this.#clamp(this.value);
    const next = {
      ArrowRight: value + step,
      ArrowUp: value + step,
      ArrowLeft: value - step,
      ArrowDown: value - step,
      PageUp: value + page,
      PageDown: value - page,
      Home: this.min,
      End: this.max,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    this.#commit(next);
  }

  #step() {
    const spring = (body, to, { k, c }) => {
      body.v += ((to - body.x) * k - body.v * c) * STEP;
      body.x += body.v * STEP;
    };
    spring(this.#thumb, this.#thumb.to, THUMB);
    spring(this.#tail, this.#thumb.x, TAIL);
    const tail = this.#tail;
    const lag = tail.x - this.#thumb.x;
    if (Math.abs(lag) > MAX_LAG) {
      tail.x = this.#thumb.x + Math.sign(lag) * MAX_LAG;
      tail.v = this.#thumb.v;
    }
    spring(this.#grow, this.#held === null ? 1 : 1.08, GROW);
  }

  #draw() {
    if (!this.#track) return false;
    const still = reducedMotion.matches;
    const { x, v } = this.#thumb;
    const grow = this.#grow.x;
    // Fast, the thumb stretches along its way and thins across it.
    const stretch = still ? 0 : Math.min(0.42, Math.abs(v) / 2400);
    const set = (element, attrs) => Object.entries(attrs).forEach(([k, n]) => element.setAttribute(k, (Math.round(n * 100) / 100).toString()));
    set(this.query('.thumb'), { cx: x, rx: RADIUS * grow * (1 + stretch), ry: RADIUS * grow * (1 - stretch * 0.4) });
    // The drop thins the farther it falls behind.
    const lag = Math.abs(this.#tail.x - x);
    set(this.query('.tail'), { cx: still ? x : this.#tail.x, r: RADIUS * grow * (0.62 - 0.17 * (lag / MAX_LAG)) });
    set(this.query('.bar'), { x: 0, width: Math.max(BAR, x) });
    this.query('.value').style.translate = `${(x - RADIUS).toFixed(2)}px 0`;
    this.query('.value').style.scale = grow.toFixed(3);
    const moving =
      Math.abs(this.#thumb.to - x) > 0.05 || Math.abs(v) > 1 || lag > 0.05 || Math.abs(this.#tail.v) > 1 || Math.abs(this.#grow.x - (this.#held === null ? 1 : 1.08)) > 0.001 || Math.abs(this.#grow.v) > 0.01;
    return moving;
  }
}
