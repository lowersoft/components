import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo, vibrate } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import styles from './detent-dial.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

// The dial sweeps 270°, from 7:30 to 4:30 on a clock face.
const SWEEP = 270;
const START_ANGLE = -135;
// How far (deg) the knob winds past either end; the pull flattens out as it
// nears this, so it slows down instead of hitting a wall.
const MAX_OVERSHOOT = 16;
// While dragging, the knob is pulled this much toward the nearest notch,
// which is what makes it click from one step to the next.
const DETENT_PULL = 0.65;
const MAX_TICKS = 56;
// The swell that follows the indicator round the ring: extra length (px) at
// its peak, and how many degrees it spreads either side.
const WAVE_HEIGHT = 9;
const WAVE_WIDTH = 12;
// Pointer movement this close to the centre gives wild angle jumps.
const DEAD_ZONE = 14;
// Below this speed (a fraction of the range per second) a release settles
// into the nearest notch instead of coasting.
const FLICK_THRESHOLD = 0.4;
const VELOCITY_WINDOW_MS = 80;
// Seconds of travel a flick is worth: release speed × COAST = distance coasted.
const COAST = 0.3;
const SETTLE = springFeel(0.35, 0.2);
const FLICK = { stiffness: 140, damping: 24 };
// Trackpads send many tiny deltas: one notch per this many pixels of scroll.
const WHEEL_NOTCH = 40;

const damp = (distance, max) => max * (1 - Math.exp(-distance / max));
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const snap = (value, min, step) => Number((Math.round((value - min) / step) * step + min).toFixed(10));
const decimalsOf = (step) => (String(step).split('.')[1] ?? '').length;

const polar = (center, radius, angle) => {
  const rad = (angle * Math.PI) / 180;
  return { x: (center + radius * Math.sin(rad)).toFixed(2), y: (center - radius * Math.cos(rad)).toFixed(2) };
};

/**
 * A rotary knob with detents. Drag it round and it clicks from notch to
 * notch; flick it and it coasts, bouncing off the ends; wind it past an end
 * and it resists. A swell travels round the tick ring with the indicator,
 * and the readout rolls digit by digit. Arrow keys, Page Up/Down, Home and
 * End step it, as does the scroll wheel once it has focus. Double-click
 * returns to the initial value.
 *
 * @attr {number} value
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {string} label - Accessible name, also shown inside the knob
 * @attr {string} suffix - Appended to the readout, e.g. "°" or "%"
 * @attr {number} size - Diameter in px
 * @attr {string} name - Submits the value with the form under this name
 * @attr {boolean} disabled
 * @fires lw-change - The dial clicked into a new notch; `detail: { value }`
 * @cssprop --lw-detent-dial-accent - The tick at the current value
 * @csspart knob
 */
export class LwDetentDial extends FormControl(LwElement) {
  static styles = [rollingStyles, styles];
  static props = {
    value: { type: Number, default: 21 },
    min: { type: Number, default: 16 },
    max: { type: Number, default: 30 },
    step: { type: Number, default: 0.5 },
    label: { default: 'Temperature' },
    suffix: { default: '°' },
    size: { type: Number, default: 240 },
    name: {},
    disabled: { type: Boolean, reflect: true },
  };

  // `formatValue` is set as a property: formats the readout, the end labels and the spoken value.
  // Not declared as a field, which would overwrite a value set before upgrade.

  // The raw, unsnapped position in value units. It runs past min and max
  // while winding; everything visual follows from it.
  #raw = null;
  #committed = null;
  #initial = null;
  #ticks = [];
  #tickLengths = [];
  #stop = null;
  #drag = null;
  #pointerType = 'mouse';
  #wheel = 0;
  #formDisabled = false;

  render() {
    return '<div class="dial"><svg class="ticks" aria-hidden="true"></svg><span class="end start" aria-hidden="true"></span><span class="end finish" aria-hidden="true"></span><div class="knob" part="knob" role="slider" aria-labelledby="label"><div class="turn" aria-hidden="true"><span class="indicator"></span></div><div class="readout"><span class="label" id="label"></span><span class="value rolling" aria-hidden="true"></span></div></div></div>';
  }

  connected() {
    const options = { signal: this.signal };
    const knob = this.query('.knob');
    knob.addEventListener('pointerdown', (event) => this.#down(event), options);
    knob.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) knob.addEventListener(type, (event) => this.#up(event), options);
    knob.addEventListener('keydown', (event) => this.#key(event), options);
    knob.addEventListener('dblclick', () => this.#active && this.#settleTo(this.#clamp(this.#initial)), options);
    knob.addEventListener('wheel', (event) => this.#scroll(event), { ...options, passive: false });
    this.signal.addEventListener('abort', () => {
      this.#stop?.();
      this.#stop = null;
      this.#drag = null;
    });
  }

  updated(changed) {
    this.#initial ??= this.value;
    if (['min', 'max', 'step', 'size', 'suffix'].some((prop) => changed.has(prop))) this.#build();
    if (changed.has('label')) this.query('.label').textContent = this.label;
    if (changed.has('disabled')) this.#syncDisabled();
    // A value set from outside jumps there, unless a hand is on the knob.
    const value = this.#clamp(this.value);
    if (this.#raw === null || (value !== this.#committed && !this.#drag)) {
      this.#stop?.();
      this.#stop = null;
      this.#set(value, false);
    }
  }

  formResetCallback() {
    this.#stop?.();
    this.#stop = null;
    this.#set(this.#clamp(this.#initial), false);
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncDisabled();
  }

  get #active() {
    return !this.disabled && !this.#formDisabled;
  }

  get #range() {
    return this.max - this.min;
  }

  get #tickCount() {
    return Math.max(1, Math.min(Math.round(this.#range / this.step), MAX_TICKS));
  }

  #clamp(value) {
    return clamp(snap(value, this.min, this.step), this.min, this.max);
  }

  #format(value) {
    return this.formatValue ? this.formatValue(value) : `${value.toFixed(decimalsOf(this.step))}${this.suffix ?? ''}`;
  }

  #syncDisabled() {
    const knob = this.query('.knob');
    knob.tabIndex = this.#active ? 0 : -1;
    knob.ariaDisabled = this.#active ? null : 'true';
  }

  // Lays out the ring for the current size and range.
  #build() {
    const size = this.size;
    const center = size / 2;
    const outer = center - 6;
    const dial = this.query('.dial');
    dial.style.setProperty('--_size', `${size}px`);
    const svg = this.query('.ticks');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    const count = this.#tickCount;
    svg.innerHTML = Array.from({ length: count + 1 }, () => '<line stroke-linecap="round"/>').join('');
    this.#ticks = [...svg.children];
    this.#tickLengths = [];
    this.#ticks.forEach((line, i) => {
      const { x, y } = polar(center, outer, START_ANGLE + (i / count) * SWEEP);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
    });
    for (const [selector, angle, value] of [
      ['.start', START_ANGLE - 12, this.min],
      ['.finish', START_ANGLE + SWEEP + 12, this.max],
    ]) {
      const end = this.query(selector);
      const { x, y } = polar(center, outer + 2, angle);
      Object.assign(end.style, { left: `${x}px`, top: `${y}px` });
      end.textContent = this.#format(value);
    }
    this.#committed = null;
    if (this.#raw !== null) this.#set(this.#raw, false);
  }

  #rotation(raw) {
    const degPerUnit = this.#range === 0 ? 0 : SWEEP / this.#range;
    if (raw < this.min) return START_ANGLE - damp((this.min - raw) * degPerUnit, MAX_OVERSHOOT);
    if (raw > this.max) return START_ANGLE + SWEEP + damp((raw - this.max) * degPerUnit, MAX_OVERSHOOT);
    const notch = snap(raw, this.min, this.step);
    return START_ANGLE + (notch + (raw - notch) * (1 - DETENT_PULL) - this.min) * degPerUnit;
  }

  // Moves the knob to a raw position: turns the indicator, swells the ticks
  // and, on crossing into a new notch, commits that value. Only a hand on
  // the dial reports the change.
  #set(raw, byUser = true) {
    this.#raw = raw;
    const angle = this.#rotation(raw);
    this.query('.turn').style.rotate = `${angle.toFixed(2)}deg`;
    this.#swell(angle);
    const value = this.#clamp(raw);
    if (value === this.#committed) return;
    const previous = this.#committed;
    this.#committed = value;
    this.#commit(value, byUser && previous !== null);
  }

  // Ticks swell as the indicator passes, following its exact angle rather
  // than the snapped value, so a wave travels round the ring as it turns.
  #swell(indicator) {
    const count = this.#tickCount;
    const center = this.size / 2;
    const outer = center - 6;
    this.#ticks.forEach((line, i) => {
      const angle = START_ANGLE + (i / count) * SWEEP;
      // Min, mid and max read as the scale's anchors, like a ruler's inch marks.
      let base = 6;
      if (i === 0 || i === count || i * 2 === count) base = 14;
      else if (i % 5 === 0) base = 10;
      const distance = (angle - indicator) / WAVE_WIDTH;
      // A tenth of a pixel is the finest change worth writing.
      const length = Math.round((base + WAVE_HEIGHT * Math.exp(-distance * distance)) * 10) / 10;
      if (this.#tickLengths[i] === length) return;
      this.#tickLengths[i] = length;
      const { x, y } = polar(center, outer - length, angle);
      line.setAttribute('x1', x);
      line.setAttribute('y1', y);
    });
  }

  #commit(value, report) {
    const text = this.#format(value);
    roll(this.query('.value'), text);
    const knob = this.query('.knob');
    Object.assign(knob, { ariaValueNow: String(value), ariaValueMin: String(this.min), ariaValueMax: String(this.max), ariaValueText: text });
    const active = Math.round(((value - this.min) / (this.#range || 1)) * this.#tickCount);
    this.#ticks.forEach((line, i) => line.setAttribute('class', i === active ? 'current' : i < active ? 'lit' : ''));
    this[INTERNALS].setFormValue(this.name ? String(value) : null);
    this.value = value;
    if (!report) return;
    this.emit('change', { value });
    if (this.#pointerType === 'touch') vibrate(1);
  }

  #settleTo(target, spring = SETTLE, velocity = 0) {
    this.#stop?.();
    this.#stop = null;
    if (reducedMotion.matches) {
      this.#set(target);
      return;
    }
    this.#stop = springTo(this.#raw, target, { ...spring, velocity, restDelta: 0.005, restSpeed: 0.01, update: (raw) => this.#set(raw), done: () => (this.#stop = null) });
  }

  // Keyboard and wheel steps jump straight to the value: they repeat fast,
  // and an animation on each would trail behind.
  #stepBy(delta) {
    this.#stop?.();
    this.#stop = null;
    this.#pointerType = 'keyboard';
    this.#set(this.#clamp(this.#committed + delta));
  }

  #pointerAngle(event, box) {
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    return { angle: (Math.atan2(dx, -dy) * 180) / Math.PI, distance: Math.hypot(dx, dy) };
  }

  #down(event) {
    if (!this.#active || this.#drag || (event.pointerType === 'mouse' && event.button !== 0)) return;
    // Measured once on grab: reading layout on every move would force it
    // to be recalculated after each frame's writes.
    const box = event.currentTarget.getBoundingClientRect();
    this.#stop?.();
    this.#stop = null;
    this.#pointerType = event.pointerType;
    event.currentTarget.setPointerCapture(event.pointerId);
    this.#drag = { id: event.pointerId, box, lastAngle: this.#pointerAngle(event, box).angle, samples: [{ t: event.timeStamp, v: this.#raw }] };
    this.toggleAttribute('data-grabbing', true);
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    const { angle, distance } = this.#pointerAngle(event, drag.box);
    let delta = angle - drag.lastAngle;
    drag.lastAngle = angle;
    if (distance < DEAD_ZONE) return;
    // Unwrap, so crossing 6 o'clock does not read as a 360° jump.
    if (delta > 180) delta -= 360;
    else if (delta < -180) delta += 360;
    const next = this.#raw + (delta / SWEEP) * this.#range;
    this.#set(next);
    drag.samples.push({ t: event.timeStamp, v: next });
    while (drag.samples.length > 2 && event.timeStamp - drag.samples[0].t > VELOCITY_WINDOW_MS) drag.samples.shift();
  }

  #up(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    this.removeAttribute('data-grabbing');
    const first = drag.samples[0];
    const last = drag.samples.at(-1);
    const elapsed = (last.t - first.t) / 1000;
    // Holding still before letting go is a placement, not a flick.
    const paused = event.timeStamp - last.t > VELOCITY_WINDOW_MS;
    const velocity = elapsed > 0 && !paused ? (last.v - first.v) / elapsed : 0;
    const raw = this.#raw;
    const inBounds = raw >= this.min && raw <= this.max;
    if (!inBounds || Math.abs(velocity) < this.#range * FLICK_THRESHOLD) {
      this.#settleTo(this.#clamp(raw));
      return;
    }
    // A flick coasts to where it would land, on a notch, carrying the release
    // speed; past an end it overshoots a little and settles back.
    this.#settleTo(this.#clamp(raw + velocity * COAST), FLICK, velocity);
  }

  #key(event) {
    if (!this.#active) return;
    const { step, min, max } = this;
    const big = Math.max(step, snap(this.#range / 10, 0, step));
    const steps = { ArrowUp: step, ArrowRight: step, ArrowDown: -step, ArrowLeft: -step, PageUp: big, PageDown: -big, Home: min - this.#committed, End: max - this.#committed };
    if (!(event.key in steps)) return;
    event.preventDefault();
    this.#stepBy(steps[event.key]);
  }

  // The wheel turns the dial only once it has focus, so scrolling the page
  // past it never changes the value by accident.
  #scroll(event) {
    if (!this.#active || this.shadowRoot.activeElement !== event.currentTarget) return;
    event.preventDefault();
    this.#wheel += event.deltaY;
    while (Math.abs(this.#wheel) >= WHEEL_NOTCH) {
      const sign = Math.sign(this.#wheel);
      this.#wheel -= sign * WHEEL_NOTCH;
      this.#stepBy(-sign * this.step);
    }
  }
}
