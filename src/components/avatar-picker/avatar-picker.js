import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, springTo } from '../../core/motion.js';
import { watchVisibility } from '../../core/visibility.js';
import '../button/index.js';
import styles from './avatar-picker.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';
import { avatarSeed, createFace, FaceView } from '../../core/face.js';

const SLOT_COUNT = 5;
const COIN = 128;
const BEZEL = 176;
const TICKS = 60;
// One face per half turn. Dragging the coin its own width turns it half a turn.
const DEG_PER_PX = 180 / COIN;
const MAX_FLICK_STEPS = 10;
const TAP_SLOP = 4;
const DRAG_SPRING = { stiffness: 140, damping: 22 };
const SHUFFLE_SPRING = { stiffness: 50, damping: 11 };
const LOOK_SPRING = { stiffness: 180, damping: 18 };
const LOOK_STEP = 1 / 120;
const FLY = { duration: 450, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' };
const MIN_NAME = 2;

const icon = (paths) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const DICE_ICON = icon(
  '<rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/><path d="M6 18h.01"/><path d="M10 14h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/>',
);
const ARROW_ICON = icon('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>');

// The bezel's tick marks, a long one every five.
const BEZEL_MARKUP = `<svg class="bezel" viewBox="0 0 ${BEZEL} ${BEZEL}" aria-hidden="true">${Array.from({ length: TICKS }, (_, i) => {
  const a = (i / TICKS) * Math.PI * 2;
  const long = i % 5 === 0;
  const r1 = BEZEL / 2 - 3;
  const r0 = r1 - (long ? 7 : 4);
  const c = BEZEL / 2;
  const at = (r) => [(c + Math.sin(a) * r).toFixed(2), (c - Math.cos(a) * r).toFixed(2)];
  const [x1, y1] = at(r0);
  const [x2, y2] = at(r1);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${long ? ' class="long"' : ''}/>`;
}).join('')}</svg>`;

// The preview is a coin with real thickness: a stack of discs in 3D.
const COIN_MARKUP = `<div class="coin" part="coin"><div class="coin-body" role="img">${[6, 5, 4, 3, 2, 1]
  .map((z) => `<span class="disc" style="transform: translateZ(-${z}px)"></span>`)
  .join('')}<div class="coin-face"><span class="shade"></span></div></div></div>`;

const pad3 = (value) => String(((value % 1000) + 1000) % 1000).padStart(3, '0');

/**
 * An onboarding avatar picker. Faces are generated from the display name and
 * morph live as it is typed. The preview is a coin: drag or flick it sideways
 * to spin through faces, tap it for the next one, or press shuffle. Five
 * slots keep options to compare; picking one flies it into the coin and
 * sends the previous face back to its slot. The eyes follow the pointer and
 * blink while it is on screen.
 *
 * The faces are pure functions of `avatarSeed(displayName, variant)`, so
 * store the seed and draw the same face anywhere with `createFace`.
 *
 * @attr {string} display-name - The name the faces are made from
 * @attr {number} variant - Which face for that name; each integer is a new face
 * @attr {string} name - Submits the avatar seed with the form under this name
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} submit-label
 * @fires lw-change - The name changed or a face landed; `detail: { displayName, variant, seed, description }`
 * @fires lw-complete - The submit button was pressed; cancel it to keep the form from submitting
 * @csspart base
 * @csspart coin
 */
export class LwAvatarPicker extends FormControl(LwElement) {
  static styles = styles;
  static props = {
    displayName: { default: 'Robin Vale' },
    variant: { type: Number, default: 0 },
    name: {},
    heading: { default: 'Pick your avatar' },
    description: { default: 'Made from your name. Spin it or pick one.' },
    submitLabel: { default: 'Continue' },
  };

  #coin = new FaceView();
  #slotFaces = Array.from({ length: SLOT_COUNT }, () => new FaceView());
  #slots = null;
  #selected = 0;
  #focusIndex = 0;
  // The coin's running angle; each half turn is the next face.
  #angle = 0;
  #step = 0;
  #spinning = false;
  #stopSpin = null;
  #drag = null;
  #look = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
  #lookLoop = fixedStepLoop(LOOK_STEP, {
    step: () => this.#stepLook(),
    render: () => this.#renderLook(),
  });
  #alive = null;

  render() {
    const slots = Array.from(
      { length: SLOT_COUNT },
      () => '<button class="slot" type="button" tabindex="-1"><span class="socket" aria-hidden="true"></span><span class="slot-face"></span></button>',
    ).join('');
    return `<div class="card" part="base"><div class="header"><h2 class="heading"></h2><p class="description"></p></div><div class="stage"><div class="dial">${BEZEL_MARKUP}<span class="index" aria-hidden="true"></span>${COIN_MARKUP}</div><div class="caption"><span class="caption-name"></span><span class="number"></span></div></div><div class="controls"><div class="slots" role="toolbar" aria-label="Avatar options">${slots}</div><button class="shuffle" type="button" aria-label="Shuffle avatar" title="Shuffle"><span class="dice">${DICE_ICON}</span></button></div><div class="field"><label for="display-name">Display name</label><input id="display-name" type="text" autocomplete="name" maxlength="32" placeholder="Your name" spellcheck="false"></div><lw-button class="submit"><span class="submit-label"></span><span class="arrow" slot="end">${ARROW_ICON}</span></lw-button><p class="announce" aria-live="polite"></p></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    if (!this.#slots) {
      this.query('.coin-face').prepend(this.#coin.svg);
      this.shadowRoot.querySelectorAll('.slot-face').forEach((el, i) => el.append(this.#slotFaces[i].svg));
      this.#slots = Array.from({ length: SLOT_COUNT }, (_, i) => this.variant + i * 7);
      this.query('input').value = this.displayName;
    }
    const coin = this.query('.coin');
    coin.addEventListener('pointerdown', (event) => this.#dragStart(event), options);
    coin.addEventListener('pointermove', (event) => this.#dragMove(event), options);
    coin.addEventListener('pointerup', (event) => this.#dragEnd(event), options);
    coin.addEventListener('pointercancel', (event) => this.#dragEnd(event), options);
    const slots = this.query('.slots');
    slots.addEventListener('click', (event) => this.#choose(this.#slotIndex(event.target)), options);
    slots.addEventListener('keydown', (event) => this.#slotKey(event), options);
    slots.addEventListener('focusin', (event) => this.#setFocusIndex(this.#slotIndex(event.target)), options);
    this.query('.shuffle').addEventListener('click', () => this.#shuffle(), options);
    this.query('input').addEventListener('input', (event) => this.#rename(event.target.value), options);
    const submit = this.query('.submit');
    submit.addEventListener('click', () => !submit.disabled && this.#submit(), options);
    watchVisibility(this, (visible) => this.#setAlive(visible), this.signal);
    this.signal.addEventListener('abort', () => {
      this.#setAlive(false);
      this.#stopSpin?.();
      if (this.#spinning) this.#land();
      this.#coin.stop();
      this.#slotFaces.forEach((face) => face.stop());
    });
  }

  updated(changed) {
    for (const [prop, selector] of [
      ['heading', '.heading'],
      ['description', '.description'],
      ['submitLabel', '.submit-label'],
    ]) {
      if (changed.has(prop)) this.query(selector).textContent = this[prop];
    }
    if (changed.has('variant') && this.#slots[this.#selected] !== this.variant) this.#slots[this.#selected] = this.variant;
    if (changed.has('displayName')) {
      const input = this.query('input');
      if (input.value !== this.displayName) input.value = this.displayName;
    }
    const first = !this.#coin.face;
    this.#renderFaces(!first);
  }

  /** The avatar as chosen: `{ displayName, variant, seed, description }`. */
  get value() {
    const variant = this.#slots[this.#selected];
    const seed = avatarSeed(this.displayName, variant);
    return { displayName: this.displayName.trim(), variant, seed, description: createFace(seed).description };
  }

  get #shownSeed() {
    return avatarSeed(this.displayName, this.#slots[this.#selected] + this.#step);
  }

  #slotIndex(target) {
    const slot = target.closest?.('.slot');
    return slot ? [...this.shadowRoot.querySelectorAll('.slot')].indexOf(slot) : -1;
  }

  // Draws every face, the slots, the caption and the form value.
  #renderFaces(morph) {
    const name = this.displayName;
    this.#coin.show(this.#shownSeed, { morph: morph && !this.#spinning });
    this.shadowRoot.querySelectorAll('.slot').forEach((slot, i) => {
      const seed = avatarSeed(name, this.#slots[i]);
      this.#slotFaces[i].show(seed, { morph });
      slot.ariaPressed = String(i === this.#selected);
      slot.ariaLabel = `Option ${i + 1}: ${createFace(seed).description}`;
      slot.tabIndex = i === this.#focusIndex ? 0 : -1;
    });
    this.#renderCaption();
    this.query('.submit').disabled = name.trim().length < MIN_NAME;
    this[INTERNALS].setFormValue(this.name ? this.value.seed : null);
  }

  #renderCaption() {
    this.query('.caption-name').textContent = this.displayName.trim() || 'Anonymous';
    this.query('.number').textContent = `No. ${pad3(this.#slots[this.#selected] + this.#step)}`;
    this.query('.coin-body').ariaLabel = `Selected avatar: ${this.#coin.face.description}`;
  }

  #change(announce) {
    const value = this.value;
    this.emit('change', value);
    if (announce) this.query('.announce').textContent = `Avatar: ${value.description}`;
  }

  #rename(name) {
    this.displayName = name;
    this.#change(false);
  }

  #submit() {
    if (this.emit('complete', this.value)) this[INTERNALS].form?.requestSubmit();
  }

  // Spinning

  #setAngle(angle) {
    this.#angle = angle;
    // Fold the running angle into -90..90 so the front always faces us.
    const tilt = angle - 180 * Math.round(angle / 180);
    this.query('.coin-body').style.transform = `rotateY(${tilt.toFixed(2)}deg)`;
    this.query('.shade').style.opacity = ((Math.abs(tilt) / 90) * 0.35).toFixed(3);
    this.query('.bezel').style.transform = `rotate(${(angle / 15).toFixed(2)}deg)`;
    this.query('.dice').style.transform = `rotate(${(angle / 4).toFixed(2)}deg)`;
    // It swaps faces as it passes edge-on, so a spin reads like a slot reel.
    const step = Math.round(angle / 180);
    if (step === this.#step) return;
    this.#step = step;
    this.#coin.show(this.#shownSeed, { morph: false });
    this.#renderCaption();
  }

  #spinTo(steps, spring) {
    this.#stopSpin?.();
    this.#spinning = true;
    if (reducedMotion.matches) {
      this.#stopSpin = null;
      this.#setAngle(steps * 180);
      this.#land();
      return;
    }
    this.#stopSpin = springTo(this.#angle, steps * 180, {
      ...spring,
      restDelta: 0.5,
      restSpeed: 4,
      update: (angle) => this.#setAngle(angle),
      done: () => this.#land(),
    });
  }

  // The coin comes to rest: the selected slot takes the face it landed on.
  #land() {
    this.#stopSpin = null;
    this.#spinning = false;
    const steps = Math.round(this.#angle / 180);
    this.#slots[this.#selected] += steps;
    this.#step = 0;
    this.#setAngle(0);
    this.variant = this.#slots[this.#selected];
    this.#renderFaces(false);
    if (steps !== 0) this.#change(true);
  }

  #shuffle() {
    const current = Math.round(this.#angle / 180);
    const steps = 5 + Math.floor(Math.random() * 4);
    this.#spinTo(current + steps, { ...SHUFFLE_SPRING, velocity: steps * 180 * 1.6 });
  }

  #dragStart(event) {
    if (event.button !== 0 || this.#drag) return;
    this.#stopSpin?.();
    this.#stopSpin = null;
    this.#spinning = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    this.#drag = { id: event.pointerId, x: event.clientX, start: this.#angle, moved: false, samples: [{ x: event.clientX, t: event.timeStamp }] };
  }

  #dragMove(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > TAP_SLOP) drag.moved = true;
    this.#setAngle(drag.start + dx * DEG_PER_PX);
    drag.samples.push({ x: event.clientX, t: event.timeStamp });
    if (drag.samples.length > 6) drag.samples.shift();
  }

  // A tap turns to the next face; a drag coasts on its release speed.
  #dragEnd(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    if (!drag.moved) {
      this.#spinTo(Math.round(this.#angle / 180) + 1, { ...DRAG_SPRING, velocity: 900 });
      return;
    }
    const first = drag.samples[0];
    const dt = Math.max(16, event.timeStamp - first.t) / 1000;
    const velocity = ((event.clientX - first.x) / dt) * DEG_PER_PX;
    const start = Math.round(drag.start / 180);
    const projected = Math.round((this.#angle + velocity * 0.28) / 180);
    const target = Math.max(start - MAX_FLICK_STEPS, Math.min(start + MAX_FLICK_STEPS, projected));
    this.#spinTo(target, { ...DRAG_SPRING, velocity });
  }

  // Slots

  #choose(index) {
    if (index < 0 || index === this.#selected) return;
    if (this.#spinning) {
      this.#stopSpin?.();
      this.#land();
    }
    const previous = this.#selected;
    const coin = this.query('.coin');
    const slotFaces = this.shadowRoot.querySelectorAll('.slot-face');
    const from = { coin: coin.getBoundingClientRect(), slot: slotFaces[index].getBoundingClientRect() };
    this.#selected = index;
    this.#focusIndex = index;
    this.variant = this.#slots[index];
    this.#renderFaces(false);
    this.#change(true);
    // The picked face flies into the coin and the old one back to its slot.
    if (reducedMotion.matches) return;
    this.#fly(coin, from.slot);
    this.#fly(slotFaces[previous], from.coin);
  }

  #fly(element, fromRect) {
    const to = element.getBoundingClientRect();
    const dx = fromRect.left + fromRect.width / 2 - (to.left + to.width / 2);
    const dy = fromRect.top + fromRect.height / 2 - (to.top + to.height / 2);
    const scale = fromRect.width / to.width;
    element.animate({ transform: [`translate(${dx}px, ${dy}px) scale(${scale})`, 'none'] }, FLY);
  }

  #setFocusIndex(index) {
    if (index < 0) return;
    this.#focusIndex = index;
    this.shadowRoot.querySelectorAll('.slot').forEach((slot, i) => (slot.tabIndex = i === index ? 0 : -1));
  }

  #slotKey(event) {
    const moves = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let target;
    if (event.key in moves) target = this.#focusIndex + moves[event.key];
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = SLOT_COUNT - 1;
    else return;
    event.preventDefault();
    const next = (target + SLOT_COUNT) % SLOT_COUNT;
    this.#setFocusIndex(next);
    this.shadowRoot.querySelectorAll('.slot')[next].focus();
  }

  // Living eyes: they drift toward the pointer and blink now and then, only
  // while the picker is on screen.

  #setAlive(alive) {
    if (alive === Boolean(this.#alive)) return;
    if (!alive) {
      this.#alive?.abort();
      this.#alive = null;
      this.#lookLoop.stop();
      Object.assign(this.#look, { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 });
      this.#renderLook();
      this.#coin.svg.querySelector('.blink').style.transform = '';
      return;
    }
    if (reducedMotion.matches) return;
    const controller = new AbortController();
    this.#alive = controller;
    window.addEventListener('pointermove', (event) => this.#lookAt(event), { passive: true, signal: controller.signal });
    const blink = this.#coin.svg.querySelector('.blink');
    let timer = 0;
    const schedule = (delay) => {
      timer = setTimeout(() => {
        blink.style.transform = 'scaleY(0.1)';
        timer = setTimeout(() => {
          blink.style.transform = '';
          schedule(2600 + Math.random() * 3400);
        }, 120);
      }, delay);
    };
    schedule(1800);
    controller.signal.addEventListener('abort', () => clearTimeout(timer));
  }

  #lookAt(event) {
    const box = this.query('.coin').getBoundingClientRect();
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    const distance = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1, distance / 220);
    this.#look.tx = (dx / distance) * reach * 1.8;
    this.#look.ty = (dy / distance) * reach * 1.3;
    this.#lookLoop.wake();
  }

  #stepLook() {
    const look = this.#look;
    const { stiffness, damping } = LOOK_SPRING;
    look.vx += ((look.tx - look.x) * stiffness - look.vx * damping) * LOOK_STEP;
    look.vy += ((look.ty - look.y) * stiffness - look.vy * damping) * LOOK_STEP;
    look.x += look.vx * LOOK_STEP;
    look.y += look.vy * LOOK_STEP;
  }

  #renderLook() {
    const { x, y, tx, ty, vx, vy } = this.#look;
    this.#coin.svg.querySelector('.look').style.transform = `translate(${x.toFixed(3)}px, ${y.toFixed(3)}px)`;
    return Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(vx) + Math.abs(vy) > 0.001;
  }
}
