import { reducedMotion, springFeel, springTo, vibrate } from '../../core/motion.js';

export const ITEM_HEIGHT = 36;
// Each row sits this many degrees further round the drum.
const ITEM_ANGLE = 20;
// The drum radius that makes neighbouring rows touch exactly.
const RADIUS = ITEM_HEIGHT / 2 / Math.tan(((ITEM_ANGLE / 2) * Math.PI) / 180);
// Rows past ±90° face away; draw a few either side of that and no more.
const WINDOW = Math.ceil(90 / ITEM_ANGLE);
export const VIEW_HEIGHT = Math.round(RADIUS * 2) + ITEM_HEIGHT / 2;
// A wheel that does not loop drags this many rows past either end.
const MAX_OVERSCROLL = 1.2;
const VELOCITY_WINDOW_MS = 80;
const TAP_SLOP = 4;
// Seconds of travel a flick is worth: release speed × COAST = rows coasted.
const COAST = 0.32;
const SETTLE = springFeel(0.4, 0.15);
const FLICK = { stiffness: 140, damping: 24 };
const WHEEL_SETTLE_MS = 120;

const mod = (n, m) => ((n % m) + m) % m;
const damp = (distance, max) => max * (1 - Math.exp(-distance / max));

const ROWS = Array.from({ length: WINDOW * 2 + 1 }, () => '<span class="row"></span>').join('');
const COLUMN = document.createElement('template');
COLUMN.innerHTML = `<div class="column" part="column" role="spinbutton" tabindex="0"><div class="fade"><div class="view"><div class="drum">${ROWS}</div></div><div class="view selected"><div class="drum">${ROWS}</div></div></div></div>`;

/**
 * One column: a real 3D cylinder. Rows sit round it with `rotateX()
 * translateZ()` and the whole drum turns with one transform. It is drawn
 * twice: a muted copy, and a full-color copy clipped to the selection band,
 * so text turns dark exactly as it crosses the band's edge.
 *
 * `position` counts rows; a looping wheel lets it run unbounded and shows
 * option `position mod count`.
 */
export class Wheel {
  element = COLUMN.content.firstElementChild.cloneNode(true);
  #drums = [...this.element.querySelectorAll('.drum')];
  #options = [];
  #loop = false;
  #position = 0;
  #center = null;
  #stop = null;
  #drag = null;
  #pointerType = 'mouse';
  #wheelTimer = 0;
  #onSettle;

  constructor(onSettle, signal) {
    this.#onSettle = onSettle;
    const el = this.element;
    const options = { signal };
    el.addEventListener('pointerdown', (event) => this.#down(event), options);
    el.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(type, (event) => this.#up(event), options);
    el.addEventListener('keydown', (event) => this.#key(event), options);
    el.addEventListener('wheel', (event) => this.#wheel(event), { ...options, passive: false });
    signal.addEventListener('abort', () => {
      this.#stop?.();
      clearTimeout(this.#wheelTimer);
    });
  }

  /** Sets the options, `[{ value, label }]`, the label, whether it loops and its width. */
  configure({ options, label, loop, width }) {
    this.#options = options;
    this.#loop = loop;
    this.element.ariaLabel = label;
    this.element.style.width = width ?? '';
    this.element.ariaValueMin = '0';
    this.element.ariaValueMax = String(Math.max(options.length - 1, 0));
    this.#center = null;
    this.#render();
  }

  get #count() {
    return this.#options.length;
  }

  get index() {
    return this.#count ? mod(Math.round(this.#position), this.#count) : -1;
  }

  /** Turns to option `index` at once, the short way round a loop. */
  show(index) {
    if (this.#drag || this.#stop || index < 0 || index === this.index) return;
    let delta = index - this.index;
    if (this.#loop && Math.abs(delta) > this.#count / 2) delta -= Math.sign(delta) * this.#count;
    this.#set(Math.round(this.#position) + delta);
  }

  #set(position) {
    this.#position = position;
    this.#render();
  }

  #render() {
    const count = this.#count;
    const el = this.element;
    for (const drum of this.#drums) drum.style.transform = `translateZ(${-RADIUS}px) rotateX(${(this.#position * ITEM_ANGLE).toFixed(3)}deg)`;
    const index = this.index;
    el.ariaValueNow = String(index);
    el.ariaValueText = this.#options[index]?.label ?? '';
    const center = Math.round(this.#position);
    if (center === this.#center) return;
    if (this.#center !== null && this.#pointerType === 'touch') vibrate(1);
    this.#center = center;
    // Only the rows near the front exist; they move round as the drum turns.
    for (const drum of this.#drums) {
      [...drum.children].forEach((row, i) => {
        const at = center - WINDOW + i;
        const hidden = count === 0 || (!this.#loop && (at < 0 || at >= count));
        row.hidden = hidden;
        if (hidden) return;
        row.textContent = this.#options[mod(at, count)].label;
        row.style.transform = `rotateX(${-at * ITEM_ANGLE}deg) translateZ(${RADIUS}px)`;
      });
    }
  }

  #clamp(index) {
    return this.#loop ? index : Math.min(Math.max(index, 0), this.#count - 1);
  }

  #settle() {
    this.#stop = null;
    this.#onSettle(this.index);
  }

  #cancel() {
    this.#stop?.();
    this.#stop = null;
  }

  #goTo(target, spring = SETTLE, velocity = 0) {
    this.#cancel();
    if (reducedMotion.matches) {
      this.#set(target);
      this.#settle();
      return;
    }
    this.#stop = springTo(this.#position, target, {
      ...spring,
      velocity,
      restDelta: 0.001,
      restSpeed: 0.01,
      update: (position) => this.#set(position),
      done: () => this.#settle(),
    });
  }

  // Past the ends of a wheel that does not loop the drum keeps following the
  // finger, less and less, then springs back on release.
  #overscroll(raw) {
    if (this.#loop) return raw;
    const last = this.#count - 1;
    if (raw < 0) return -damp(-raw, MAX_OVERSCROLL);
    if (raw > last) return last + damp(raw - last, MAX_OVERSCROLL);
    return raw;
  }

  #down(event) {
    if (this.#drag || (event.pointerType === 'mouse' && event.button !== 0) || !this.#count) return;
    this.#cancel();
    this.#pointerType = event.pointerType;
    this.element.setPointerCapture(event.pointerId);
    this.#drag = { id: event.pointerId, startY: event.clientY, start: this.#position, moved: false, samples: [{ t: event.timeStamp, v: this.#position }] };
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.abs(dy) < TAP_SLOP) return;
    drag.moved = true;
    const raw = drag.start - dy / ITEM_HEIGHT;
    this.#set(this.#overscroll(raw));
    drag.samples.push({ t: event.timeStamp, v: raw });
    while (drag.samples.length > 2 && event.timeStamp - drag.samples[0].t > VELOCITY_WINDOW_MS) drag.samples.shift();
  }

  #up(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    if (!drag.moved) {
      // A tap turns to the row under it; asin undoes the drum's
      // foreshortening, so rows near the edges are hit accurately too.
      const box = this.element.getBoundingClientRect();
      const ratio = Math.max(-1, Math.min(1, (event.clientY - (box.top + box.height / 2)) / RADIUS));
      const rows = Math.round((Math.asin(ratio) * 180) / Math.PI / ITEM_ANGLE);
      this.#goTo(this.#clamp(Math.round(this.#position) + rows));
      return;
    }
    const first = drag.samples[0];
    const last = drag.samples.at(-1);
    const elapsed = (last.t - first.t) / 1000;
    // Holding still before letting go is a placement, not a flick.
    const paused = event.timeStamp - last.t > VELOCITY_WINDOW_MS;
    const velocity = elapsed > 0 && !paused ? (last.v - first.v) / elapsed : 0;
    const position = this.#position;
    const outside = !this.#loop && (position < 0 || position > this.#count - 1);
    if (outside || Math.abs(velocity) < 2) {
      this.#goTo(this.#clamp(Math.round(position)));
      return;
    }
    // A flick coasts to where it would land, on a whole row, carrying the
    // release speed; past an end it overshoots a little and settles back.
    this.#goTo(this.#clamp(Math.round(position + velocity * COAST)), FLICK, velocity);
  }

  // Keyboard steps are instant: they repeat quickly, and a spin per press
  // would always be a step behind.
  #key(event) {
    const center = Math.round(this.#position);
    const start = center - mod(center, this.#count);
    const moves = { ArrowUp: 1, ArrowDown: -1, PageUp: 5, PageDown: -5 };
    let target;
    if (event.key === 'Home') target = start;
    else if (event.key === 'End') target = start + this.#count - 1;
    else if (event.key in moves) target = this.#clamp(center + moves[event.key]);
    else return;
    event.preventDefault();
    this.#cancel();
    this.#pointerType = 'keyboard';
    this.#set(target);
    this.#settle();
  }

  // Wheel and trackpad scrolling turn the drum, then it settles on the
  // nearest row once the scrolling stops.
  #wheel(event) {
    if (!this.#count) return;
    event.preventDefault();
    this.#cancel();
    this.#pointerType = 'mouse';
    const raw = this.#position + (event.deltaY / ITEM_HEIGHT) * 0.4;
    this.#set(this.#loop ? raw : Math.min(Math.max(raw, -0.4), this.#count - 1 + 0.4));
    clearTimeout(this.#wheelTimer);
    this.#wheelTimer = setTimeout(() => this.#goTo(this.#clamp(Math.round(this.#position))), WHEEL_SETTLE_MS);
  }
}
