import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion } from '../../core/motion.js';
import styles from './spending-ring.scss?inline';

const SIZE = 240;
const C = SIZE / 2;
const R = 90;
const STROKE = 22;
// Degrees left empty between categories.
const GAP = 2.4;
// The ring's spring: rate in rad/s and damping ratio, a touch under critical
// so a flick settles onto its category with a small give.
const RATE = 11;
const DAMPING = 0.78;
// How far ahead a flick is projected when choosing where it lands, in s.
const PROJECT = 0.2;
// Movement under this many px is a tap, not a spin.
const TAP_SLOP = 5;
const STEP = 1 / 240;

const DEMO_CATEGORIES = [
  { name: 'Build farm', amount: 1250, change: 0, color: 'light-dark(#0ea5e9, #38bdf8)' },
  { name: 'Storage', amount: 486.2, change: -6.1, color: 'light-dark(#10b981, #34d399)' },
  { name: 'Bandwidth', amount: 398.1, change: 22.4, color: 'light-dark(#f43f5e, #fb7185)' },
  { name: 'Symbol server', amount: 312.75, change: 12.8, color: 'light-dark(#fbbf24, #fcd34d)' },
  { name: 'CI runners', amount: 214.4, change: -3.5, color: 'light-dark(#8b5cf6, #a78bfa)' },
  { name: 'Licenses', amount: 86.97, change: 0, color: 'light-dark(#a1a1aa, #71717a)' },
];

// Wraps an angle into -180 to 180.
const wrap = (deg) => ((((deg + 180) % 360) + 360) % 360) - 180;

// A point on the ring, 0° at the top, angles running clockwise.
const polar = (deg) => {
  const rad = (deg * Math.PI) / 180;
  return [C + R * Math.sin(rad), C - R * Math.cos(rad)];
};

const arc = (from, to) => {
  const [x0, y0] = polar(from);
  const [x1, y1] = polar(to);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 ${to - from > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

// The category whose slice covers an angle on the ring.
const sliceAt = (spans, deg) => {
  const a = ((deg % 360) + 360) % 360;
  return Math.max(0, spans.findIndex((s) => a >= s.from && a < s.to));
};

/**
 * Spending by category as a ring that turns: drag it round (a flick spins
 * on and settles on a category), tap a slice, pick one from the list, or
 * use the arrow keys. The category under the marker at the top is read out
 * in the middle, with its share and its change from last month.
 *
 * Categories are `{ name, amount, change?, color }`; `color` is any CSS
 * colour, `light-dark()` included.
 *
 * @attr {string} heading
 * @attr {Array<object>} categories - The categories (JSON)
 * @attr {string} currency - ISO code
 * @fires lw-change - Another category came to the marker; `detail: { index, category }`
 */
export class LwSpendingRing extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'October infrastructure' },
    categories: { type: Object, default: DEMO_CATEGORIES },
    currency: { default: 'USD' },
  };

  #selected = 0;
  #spans = [];
  // The ring's angle and speed, and where it is heading.
  #a = 0;
  #v = 0;
  #target = 0;
  // While a flick coasts, the readout follows whatever passes the marker.
  #coast = false;
  #drag = null;
  #loop = fixedStepLoop(STEP, {
    step: () => {
      this.#v += (-RATE * RATE * (this.#a - this.#target) - 2 * DAMPING * RATE * this.#v) * STEP;
      this.#a += this.#v * STEP;
    },
    render: () => this.#frame(),
  });

  render() {
    return `<div class="top"><p class="heading"></p><p class="total"></p></div>
<div class="dial" role="slider" tabindex="0" aria-valuemin="1" aria-label="Spending by category. Use the arrow keys to turn the ring.">
  <svg viewBox="0 0 ${SIZE} ${SIZE}" aria-hidden="true"><g class="ring"></g><path class="marker" d="M${C - 5} 2 L${C + 5} 2 L${C} 8 Z"/></svg>
  <div class="readout"><div class="read"></div></div>
</div>
<ul class="legend"></ul>`;
  }

  connected() {
    const options = { signal: this.signal };
    const dial = this.query('.dial');
    dial.addEventListener('pointerdown', (event) => this.#down(event), options);
    dial.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) dial.addEventListener(type, (event) => this.#release(event), options);
    dial.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.legend').addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (button) this.#turnTo(Number(button.dataset.index));
    }, options);
    this.signal.addEventListener('abort', () => this.#loop.stop());
  }

  updated(changed) {
    if (changed.has('categories')) this.#build();
    this.query('.heading').textContent = this.heading ?? '';
    this.query('.total').textContent = this.#money.format(this.#total);
    this.#paintLegend();
    this.#paintRead();
  }

  get #money() {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: this.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  get #total() {
    return this.categories.reduce((sum, { amount }) => sum + amount, 0);
  }

  // New data keeps the same slice under the marker.
  #build() {
    const total = this.#total;
    let at = 0;
    this.#spans = this.categories.map(({ amount }) => {
      const sweep = total ? (amount / total) * 360 : 360 / this.categories.length;
      const span = { from: at, to: at + sweep, mid: at + sweep / 2 };
      at += sweep;
      return span;
    });
    this.query('.ring').innerHTML = this.#spans.map((span, i) => `<path d="${arc(span.from + GAP / 2, span.to - GAP / 2)}" style="stroke: ${escapeHtml(this.categories[i].color ?? 'currentColor')}"/>`).join('');
    this.query('.legend').innerHTML = this.categories
      .map((category, i) => `<li><button type="button" data-index="${i}"><span class="dot" style="background: ${escapeHtml(category.color ?? 'currentColor')}"></span><span class="name">${escapeHtml(category.name)}</span><span class="amount"></span></button></li>`)
      .join('');
    this.#selected = Math.min(this.#selected, this.#spans.length - 1);
    this.#loop.stop();
    this.#a = this.#target = -(this.#spans[this.#selected]?.mid ?? 0);
    this.#v = 0;
    this.#paintRing();
  }

  #paintRing() {
    this.query('.ring').setAttribute('transform', `rotate(${this.#a.toFixed(3)} ${C} ${C})`);
  }

  #paintLegend() {
    const money = this.#money;
    this.shadowRoot.querySelectorAll('.legend button').forEach((button, i) => {
      button.ariaPressed = String(i === this.#selected);
      button.querySelector('.amount').textContent = money.format(Math.round(this.categories[i].amount)).replace('.00', '');
    });
    this.shadowRoot.querySelectorAll('.ring path').forEach((path, i) => path.toggleAttribute('data-on', i === this.#selected));
  }

  // The middle reads the category under the marker; a new one slides in.
  #paintRead() {
    const category = this.categories[this.#selected];
    if (!category) return;
    const money = this.#money;
    const share = this.#total ? (category.amount / this.#total) * 100 : 0;
    const change = category.change ?? 0;
    const read = this.query('.read');
    const text = change === 0 ? 'Same as last month' : `${change > 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}% vs last month`;
    const markup = `<p class="what"><span class="dot" style="background: ${escapeHtml(category.color ?? 'currentColor')}"></span>${escapeHtml(category.name)}</p><p class="spent">${money.format(category.amount)}</p><p class="share">${share.toFixed(0)}% of total</p><p class="change" data-trend="${Math.sign(change)}">${text}</p>`;
    if (read.innerHTML !== markup) {
      const fresh = read.dataset.name !== category.name;
      read.innerHTML = markup;
      read.dataset.name = category.name;
      if (fresh && !reducedMotion.matches) read.animate([{ opacity: 0, translate: '0 4px' }, { opacity: 1, translate: '0 0' }], { duration: 200, easing: 'ease-out' });
    }
    const dial = this.query('.dial');
    dial.ariaValueMax = String(this.categories.length);
    dial.ariaValueNow = String(this.#selected + 1);
    dial.ariaValueText = `${category.name}, ${money.format(category.amount)}`;
  }

  #select(index) {
    if (index === this.#selected) return;
    this.#selected = index;
    this.#paintLegend();
    this.#paintRead();
    this.emit('change', { index, category: this.categories[index] });
  }

  // Shows whichever slice is under the marker right now.
  #track() {
    this.#select(sliceAt(this.#spans, -this.#a));
  }

  #frame() {
    const settled = Math.abs(this.#a - this.#target) < 0.05 && Math.abs(this.#v) < 2;
    if (settled) {
      this.#a = this.#target;
      this.#v = 0;
    }
    this.#paintRing();
    if (this.#coast) this.#track();
    if (!settled) return true;
    this.#coast = false;
    this.query('.dial').removeAttribute('data-spinning');
    return false;
  }

  // Turns the ring to a slice, the short way round from where it would come
  // to rest on its own (a flick keeps going the way it was thrown).
  #turnTo(index, rest = this.#a, coast = false) {
    this.#target = rest + wrap(-(this.#spans[index]?.mid ?? 0) - rest);
    this.#coast = coast;
    if (!coast) this.#select(index);
    if (reducedMotion.matches) {
      this.#a = this.#target;
      this.#v = 0;
      this.#coast = false;
      this.#paintRing();
      this.#track();
      return;
    }
    this.query('.dial').toggleAttribute('data-spinning', true);
    this.#loop.wake();
  }

  #pointerAngle(event) {
    const rect = this.query('.dial').getBoundingClientRect();
    return (Math.atan2(event.clientX - rect.left - rect.width / 2, -(event.clientY - rect.top - rect.height / 2)) * 180) / Math.PI;
  }

  #down(event) {
    if (this.#drag || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    this.#loop.stop();
    this.#v = 0;
    this.#drag = { id: event.pointerId, angle: this.#pointerAngle(event), time: event.timeStamp, moved: 0, x: event.clientX, y: event.clientY };
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    drag.moved = Math.max(drag.moved, Math.hypot(event.clientX - drag.x, event.clientY - drag.y));
    if (drag.moved < TAP_SLOP) return;
    const angle = this.#pointerAngle(event);
    const delta = wrap(angle - drag.angle);
    const dt = Math.max((event.timeStamp - drag.time) / 1000, STEP);
    this.#a += delta;
    // Smoothed angular speed, for the flick on release.
    this.#v = this.#v * 0.6 + (delta / dt) * 0.4;
    Object.assign(drag, { angle, time: event.timeStamp });
    this.query('.dial').toggleAttribute('data-spinning', true);
    this.#paintRing();
    this.#track();
  }

  #release(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    if (drag.moved < TAP_SLOP) {
      // A tap on the ring picks the slice under the finger; the middle is
      // only a readout.
      const rect = this.query('.dial').getBoundingClientRect();
      const r = Math.hypot(event.clientX - rect.left - rect.width / 2, event.clientY - rect.top - rect.height / 2);
      if (r > ((R - STROKE) / SIZE) * rect.width) this.#turnTo(sliceAt(this.#spans, this.#pointerAngle(event) - this.#a));
      return;
    }
    // A drag held still before letting go has no flick left in it.
    if (event.timeStamp - drag.time > 80) this.#v = 0;
    this.#v = Math.max(-1440, Math.min(1440, this.#v));
    const rest = this.#a + this.#v * PROJECT;
    this.#turnTo(sliceAt(this.#spans, -rest), rest, true);
  }

  #key(event) {
    const count = this.categories.length;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    let next = null;
    if (step) next = (this.#selected + step + count) % count;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count - 1;
    if (next === null) return;
    event.preventDefault();
    this.#turnTo(next);
  }
}
