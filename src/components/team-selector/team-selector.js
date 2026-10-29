import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springTo } from '../../core/motion.js';
import { hueOf, initialsOf } from '../../core/people.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import styles from './team-selector.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

// Horizontal pixels of drag per step when scrubbing the number.
const SCRUB_STEP_PX = 24;
// Furthest the number stretches past a bound, however far it is pulled.
const RUBBER_BAND_PX = 14;
// Avatars shown before the stack collapses into a "+N" chip.
const VISIBLE_AVATARS = 5;
const PAGE = 5;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const SNAP_BACK = { stiffness: 600, damping: 32 };

const DEFAULT_MEMBERS = [
  { id: 'member-1', name: 'Alex Rivera' },
  { id: 'member-2', name: 'Blair Kim' },
  { id: 'member-3', name: 'Casey Lin' },
  { id: 'member-4', name: 'Devon Marsh' },
];

const icon = (paths) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">${paths}</svg>`;
const MINUS_ICON = icon('<path d="M5 12h14"/>');
const PLUS_ICON = icon('<path d="M5 12h14"/><path d="M12 5v14"/>');

/**
 * A seat counter for a team plan. Step with the buttons or the arrow keys,
 * or drag sideways on the number like a design tool's number field; past a
 * bound it stretches like a rubber band and the stepper shakes. The members
 * fill the first seats as an avatar stack, the rest show as open seats, and
 * with `price-per-seat` the monthly total rolls along.
 *
 * @attr {number} value - The seat count
 * @attr {number} min
 * @attr {number} max
 * @attr {string} label
 * @attr {number} price-per-seat - Shows the price per seat and the monthly total
 * @attr {string} currency - ISO 4217 code for the price
 * @attr {string} name - Submits the seat count with the form under this name
 * @attr {object} members - JSON array of `{ id, name, avatarUrl? }`; seats past it are open
 * @fires lw-change - The seat count changed; `detail: { value }`
 * @csspart base
 * @csspart value - The number and its unit
 */
export class LwTeamSelector extends FormControl(LwElement) {
  static styles = [rollingStyles, styles];
  static props = {
    value: { type: Number, default: 3 },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 12 },
    label: { default: 'Team size' },
    pricePerSeat: { type: Number },
    currency: { default: 'USD' },
    name: {},
    members: { type: Object, default: DEFAULT_MEMBERS },
  };

  #shown = null;
  #shaking = null;
  #scrub = null;
  #stretch = 0;
  #stopStretch = null;

  render() {
    return `<div class="card" part="base"><span class="label" id="label"></span><div class="seats" aria-hidden="true"></div><div class="stepper"><button class="step" type="button" data-delta="-1" aria-label="Remove a seat">${MINUS_ICON}</button><div class="spin" part="value" role="spinbutton" tabindex="0" aria-labelledby="label"><span class="number rolling"></span><span class="unit"></span></div><button class="step" type="button" data-delta="1" aria-label="Add a seat">${PLUS_ICON}</button></div><p class="price" hidden><span class="per"></span><span class="dot" aria-hidden="true">·</span><span><span class="total rolling"></span> / month</span></p><output class="announce" aria-live="polite"></output></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const spin = this.query('.spin');
    // aria-disabled rather than disabled at a bound: focus stays on the
    // button and a press still reaches the shake.
    this.shadowRoot.querySelectorAll('.step').forEach((button) => button.addEventListener('click', () => this.#step(Number(button.dataset.delta)), options));
    spin.addEventListener('keydown', (event) => this.#key(event), options);
    spin.addEventListener('pointerdown', (event) => this.#scrubStart(event), options);
    spin.addEventListener('pointermove', (event) => this.#scrubMove(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) spin.addEventListener(type, () => this.#scrubEnd(), options);
    this.signal.addEventListener('abort', () => {
      this.#stopStretch?.();
      this.#scrub = null;
      this.#setStretch(0);
    });
  }

  updated(changed) {
    if (changed.has('label')) this.query('.label').textContent = this.label;
    this.#render(this.#shown !== null);
  }

  formResetCallback() {
    const initial = this.getAttribute('value');
    this.#change(initial === null ? LwTeamSelector.props.value.default : Number(initial));
  }

  get #upper() {
    return Math.max(this.min, this.max);
  }

  get #count() {
    return Math.min(Math.max(Math.round(this.value) || 0, this.min), this.#upper);
  }

  #change(next) {
    const clamped = Math.min(Math.max(next, this.min), this.#upper);
    if (clamped === this.#count) return;
    this.value = clamped;
    this.emit('change', { value: clamped });
  }

  // Steps by `delta`, or shakes when the step would cross a bound.
  #step(delta) {
    const next = this.#count + delta;
    if (next < this.min || next > this.#upper) this.#shake();
    else this.#change(next);
  }

  #shake() {
    if (reducedMotion.matches || this.#shaking) return;
    this.#shaking = this.query('.stepper').animate({ translate: ['-3px', '3px', '-2px', '2px', '0'] }, { duration: 280, easing: EASE_OUT });
    this.#shaking.onfinish = this.#shaking.oncancel = () => (this.#shaking = null);
  }

  #key(event) {
    const count = this.#count;
    const moves = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 };
    if (event.key in moves) this.#step(moves[event.key]);
    else if (event.key === 'PageUp') this.#change(count + PAGE);
    else if (event.key === 'PageDown') this.#change(count - PAGE);
    else if (event.key === 'Home') this.#change(this.min);
    else if (event.key === 'End') this.#change(this.#upper);
    else return;
    event.preventDefault();
  }

  // Scrubbing: no preventDefault on press, so the spinbutton takes focus
  // (without a ring) and the arrow keys work after a drag.
  #scrubStart(event) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    this.#stopStretch?.();
    this.#scrub = { startX: event.clientX, startCount: this.#count };
    this.query('.spin').toggleAttribute('data-scrubbing', true);
  }

  #scrubMove(event) {
    const scrub = this.#scrub;
    if (!scrub) return;
    const raw = scrub.startCount + (event.clientX - scrub.startX) / SCRUB_STEP_PX;
    this.#change(Math.round(raw));
    // Past a bound the number keeps following the pointer with growing
    // resistance, never travelling more than RUBBER_BAND_PX.
    let overshoot = 0;
    if (raw < this.min) overshoot = (raw - this.min) * SCRUB_STEP_PX;
    else if (raw > this.#upper) overshoot = (raw - this.#upper) * SCRUB_STEP_PX;
    this.#setStretch(Math.sign(overshoot) * RUBBER_BAND_PX * (1 - Math.exp(-Math.abs(overshoot) / (RUBBER_BAND_PX * 4))));
  }

  #scrubEnd() {
    if (!this.#scrub) return;
    this.#scrub = null;
    this.query('.spin').removeAttribute('data-scrubbing');
    if (reducedMotion.matches) {
      this.#setStretch(0);
      return;
    }
    this.#stopStretch = springTo(this.#stretch, 0, { ...SNAP_BACK, restDelta: 0.05, update: (x) => this.#setStretch(x) });
  }

  #setStretch(x) {
    this.#stretch = x;
    this.query('.spin').style.translate = x ? `${x.toFixed(2)}px 0` : '';
  }

  #formatPrice(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
      maximumFractionDigits: Number.isInteger(this.pricePerSeat) ? 0 : 2,
    }).format(amount);
  }

  #render(animate) {
    const count = this.#count;
    const unit = count === 1 ? 'seat' : 'seats';
    const spin = this.query('.spin');
    roll(this.query('.number'), String(count));
    this.query('.unit').textContent = unit;
    Object.assign(spin, { ariaValueNow: String(count), ariaValueMin: String(this.min), ariaValueMax: String(this.#upper), ariaValueText: `${count} ${unit}` });
    this.shadowRoot.querySelectorAll('.step').forEach((button) => {
      const atBound = Number(button.dataset.delta) < 0 ? count <= this.min : count >= this.#upper;
      button.ariaDisabled = String(atBound);
    });

    const priced = this.pricePerSeat != null;
    this.query('.price').hidden = !priced;
    let announcement = `${count} ${unit}`;
    if (priced) {
      const total = this.#formatPrice(this.pricePerSeat * count);
      this.query('.per').textContent = `${this.#formatPrice(this.pricePerSeat)} / seat`;
      // The currency sign stays put; only the digits after it roll.
      roll(this.query('.total'), total);
      announcement += `, ${total} per month`;
    }
    // The spinbutton speaks only while focused; this announces the rest.
    if (this.#shown !== null && this.#shown !== count) this.query('.announce').textContent = announcement;
    this.#shown = count;
    this[INTERNALS].setFormValue(this.name ? String(count) : null);
    this.#renderSeats(animate && !reducedMotion.matches);
  }

  // Only the selected seats render, so the stack stays centred: a seat
  // entering or leaving slides the others over.
  #renderSeats(animate) {
    const container = this.query('.seats');
    const count = this.#count;
    const members = Array.isArray(this.members) ? this.members : [];
    const overflow = count > VISIBLE_AVATARS ? count - (VISIBLE_AVATARS - 1) : 0;
    const seats = Array.from({ length: overflow ? VISIBLE_AVATARS - 1 : count }, (_, index) => {
      const member = members[index];
      return member ? { ...member, key: `member:${member.id ?? index}` } : { key: `open:${index}`, name: `Seat ${index + 1}`, open: true, index };
    });
    if (overflow) seats.push({ key: 'overflow' });

    const current = new Map([...container.children].filter((el) => !el.hasAttribute('data-leaving')).map((el) => [el.dataset.key, el]));
    const before = new Map([...current].map(([key, el]) => [key, el.getBoundingClientRect().left]));
    const wanted = new Set(seats.map(({ key }) => key));

    for (const [key, el] of current) {
      if (wanted.has(key)) continue;
      if (!animate) {
        el.remove();
        continue;
      }
      // Leaving seats drop out of the row at once and fade where they were.
      el.dataset.leaving = '';
      Object.assign(el.style, { position: 'absolute', left: `${el.offsetLeft}px`, top: `${el.offsetTop}px`, margin: '0' });
      el.animate({ opacity: [1, 0], scale: [1, 0.85] }, { duration: 160, easing: EASE_OUT, fill: 'forwards' }).onfinish = () => el.remove();
    }

    const entering = [];
    seats.forEach((seat, index) => {
      let el = current.get(seat.key);
      if (!el) {
        el = this.#createSeat(seat);
        entering.push(el);
      }
      el.style.zIndex = seat.key === 'overflow' ? '0' : String(VISIBLE_AVATARS - index);
      el.classList.toggle('first', index === 0);
      if (seat.key === 'overflow') roll(el.querySelector('.rolling'), String(overflow));
      container.append(el);
    });
    // Keep the leaving ones on top of the row while they fade.
    container.querySelectorAll('[data-leaving]').forEach((el) => container.append(el));

    if (!animate) return;
    for (const [key, left] of before) {
      const el = current.get(key);
      if (!wanted.has(key)) continue;
      const dx = left - el.getBoundingClientRect().left;
      if (Math.abs(dx) > 0.5) el.animate({ transform: [`translateX(${dx}px)`, 'none'] }, { duration: 200, easing: EASE_OUT });
    }
    for (const el of entering) {
      el.animate({ opacity: [0, 1], scale: [0.85, 1] }, { duration: 260, easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)' });
    }
  }

  #createSeat(seat) {
    const el = document.createElement('span');
    el.dataset.key = seat.key;
    if (seat.key === 'overflow') {
      el.className = 'seat chip';
      el.innerHTML = '+<span class="rolling"></span>';
      return el;
    }
    el.title = seat.name;
    if (seat.avatarUrl) {
      el.className = 'seat photo';
      el.append(Object.assign(document.createElement('img'), { src: seat.avatarUrl, alt: '', width: 40, height: 40, draggable: false }));
    } else if (seat.open) {
      el.className = 'seat open';
      el.textContent = seat.index + 1;
    } else {
      el.className = 'seat person';
      el.style.setProperty('--_hue', hueOf(seat.name));
      el.textContent = initialsOf(seat.name);
    }
    return el;
  }
}
