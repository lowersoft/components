import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronLeft, chevronRight, x as close } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion } from '../../core/motion.js';
import { DEMO_CARDS } from './cards.js';
import styles from './card-stack.scss?inline';

// Resting pose of each slot. The top card sits straight; the ones beneath
// keep a fixed tilt, like a pile squared up by hand.
const TILTS = [0, -2, 1.5, -1];
const SLOT_Y = 9;
const SLOT_SCALE = 0.035;
const MAX_SLOT = TILTS.length - 1;
// Dragging rotates the card up to this many degrees across its own width.
const MAX_DRAG_ROTATION = 18;
// A release throws the card when it is this fast (px/ms) or this far (share
// of the card's width). Anything less springs home.
const THROW_VELOCITY = 0.5;
const THROW_DISTANCE = 0.35;
// Taps that move less than this open the card instead of dragging it.
const TAP_SLOP = 5;
const VELOCITY_WINDOW = 90;
// Springs as stiffness / damping. Home is slightly underdamped so a hard
// release visibly carries through; the flight is looser so a faster flick
// travels further before it turns around.
const HOME = { k: 420, c: 30 };
const FLIGHT = { k: 150, c: 15 };
const RETURN = { k: 240, c: 26 };
const STEP = 1 / 240;
const TOP_Z = 1000;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const AXES = [
  ['x', 'vx'],
  ['y', 'vy'],
  ['r', 'vr'],
  ['s', 'vs'],
];

const slotPose = (depth) => {
  const d = Math.min(depth, MAX_SLOT);
  return { x: 0, y: d * SLOT_Y, r: TILTS[d], s: 1 - d * SLOT_SCALE };
};

const lerpPose = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, r: a.r + (b.r - a.r) * t, s: a.s + (b.s - a.s) * t });

const makeBody = (depth) => ({ ...slotPose(depth), vx: 0, vy: 0, vr: 0, vs: 0, phase: 'rest', out: null, dx: 1, dy: 0, z: null, apexZ: null });

const isSettled = (body, target) =>
  Math.abs(body.x - target.x) < 0.1 &&
  Math.abs(body.y - target.y) < 0.1 &&
  Math.abs(body.r - target.r) < 0.02 &&
  Math.abs(body.s - target.s) < 0.0005 &&
  Math.abs(body.vx) + Math.abs(body.vy) < 2 &&
  Math.abs(body.vr) < 1 &&
  Math.abs(body.vs) < 0.01;

// Distance along (ux, uy) at which a w × h card no longer covers the deck.
const clearance = (w, h, ux, uy) => Math.min(ux ? w / Math.abs(ux) : Number.POSITIVE_INFINITY, uy ? h / Math.abs(uy) : Number.POSITIVE_INFINITY) + 24;

const releaseVelocity = (samples) => {
  const last = samples.at(-1);
  const first = samples.find((sample) => last && last.t - sample.t <= VELOCITY_WINDOW);
  if (!first || !last || last.t - first.t < 8) return { vx: 0, vy: 0 };
  const dt = last.t - first.t;
  return { vx: (last.x - first.x) / dt, vy: (last.y - first.y) / dt };
};

const pad = (n) => String(n).padStart(2, '0');

/**
 * A deck of cards to throw: drag the top card away (or flick it) and it
 * sails out, turns, and lands back under the pile; the card beneath rises
 * to meet it as you drag. The arrows bring cards back from the bottom.
 * A tap opens the card into its details.
 *
 * Cards are `{ id, title, subtitle, art, description, specs, price? }`,
 * where `art` is SVG markup shown edge to edge and `specs` is a list of
 * `{ label, value }`.
 *
 * @attr {Array<object>} cards - The deck (JSON)
 * @attr {string} accent - The one accent colour, for the art and the action
 * @attr {string} action-label - Label of the action in the details
 * @fires lw-change - The deck cycled; `detail: { card }` is the new top card
 * @fires lw-action - The details' action was pressed; `detail: { card }`
 */
export class LwCardStack extends LwElement {
  static styles = styles;
  static props = {
    cards: { type: Object, default: DEMO_CARDS },
    accent: { default: '#f97316' },
    actionLabel: { default: 'Add to cart' },
  };

  #order = [];
  #bodies = [];
  #drag = null;
  // 0 to 1: how close the current drag is to a throw.
  #progress = 0;
  #suppressClick = false;
  #openIndex = null;
  #loop = fixedStepLoop(STEP, {
    step: () => this.#step(),
    render: () => this.#render(),
  });

  render() {
    return `<div class="wrap">
  <section class="deck" aria-label="Card deck. Drag a card away or use the arrow keys to cycle."></section>
  <div class="nav"><button class="prev" type="button" aria-label="Previous card">${strokeIcon(chevronLeft)}</button><p class="count" aria-live="polite"></p><button class="next" type="button" aria-label="Next card">${strokeIcon(chevronRight)}</button></div>
  <div class="details" hidden><div class="dialog" role="dialog" aria-modal="true"><div class="art"></div><div class="info"></div><button class="close" type="button" aria-label="Close details">${strokeIcon(close, 14)}</button></div></div>
</div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const deck = this.query('.deck');
    deck.addEventListener('pointerdown', (event) => this.#down(event), options);
    deck.addEventListener('pointermove', (event) => this.#move(event), options);
    deck.addEventListener('pointerup', (event) => this.#up(event, false), options);
    deck.addEventListener('pointercancel', (event) => this.#up(event, true), options);
    deck.addEventListener('lostpointercapture', (event) => this.#up(event, true), options);
    deck.addEventListener('click', (event) => this.#click(event), options);
    deck.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.prev').addEventListener('click', () => this.#cycle(-1), options);
    this.query('.next').addEventListener('click', () => this.#cycle(1), options);
    const details = this.query('.details');
    details.addEventListener('click', (event) => this.#detailsClick(event), options);
    details.addEventListener('keydown', (event) => event.key === 'Escape' && (event.preventDefault(), this.#closeDetails()), options);
    this.signal.addEventListener('abort', () => this.#loop.stop());
  }

  updated(changed) {
    if (changed.has('accent')) this.style.setProperty('--_accent', this.accent);
    if (changed.has('cards')) this.#build();
    if (changed.has('actionLabel') && this.#openIndex !== null) this.#renderInfo(this.cards[this.#openIndex]);
  }

  #build() {
    this.#order = this.cards.map((_, i) => i);
    this.#bodies = this.cards.map((_, i) => makeBody(i));
    this.query('.deck').innerHTML = this.cards
      .map(
        (card, i) =>
          `<button class="card" type="button" data-index="${i}" data-state="rest" aria-label="${escapeHtml(`${card.title}, ${card.subtitle}. Open details`)}"><span class="face"><span class="art">${card.art ?? ''}</span><span class="caption"><span class="names"><span class="title">${escapeHtml(card.title)}</span><span class="subtitle">${escapeHtml(card.subtitle)}</span></span>${card.price ? `<span class="price">${escapeHtml(card.price)}</span>` : ''}</span></span></button>`,
      )
      .join('');
    this.#order.forEach((index, depth) => this.#write(index, depth));
    this.#paintOrder();
  }

  get #nodes() {
    return [...this.shadowRoot.querySelectorAll('.card')];
  }

  #write(index, depth) {
    const node = this.#nodes[index];
    const body = this.#bodies[index];
    node.style.transform = `translate3d(${body.x.toFixed(2)}px, ${body.y.toFixed(2)}px, 0) rotate(${body.r.toFixed(3)}deg) scale(${body.s.toFixed(4)})`;
    node.style.zIndex = String(body.z ?? this.#order.length - depth);
    const state = body.phase === 'drag' ? 'drag' : body.phase === 'rest' ? 'rest' : 'fly';
    if (node.dataset.state !== state) node.dataset.state = state;
  }

  // Only the top card is in the Tab order; the count names it.
  #paintOrder() {
    const top = this.#order[0] ?? 0;
    this.#nodes.forEach((node, i) => {
      node.inert = i !== top;
      node.tabIndex = i === top ? 0 : -1;
    });
    this.query('.count').innerHTML = `<b>${pad(top + 1)}</b> / ${pad(this.cards.length)}<span class="visually-hidden">: ${escapeHtml(this.cards[top]?.title ?? '')}</span>`;
  }

  // ---- Physics ----

  #targetFor(body, depth) {
    if (body.phase === 'out') return body.out;
    const pose = slotPose(depth);
    // The card beneath rises to meet a drag.
    if (depth > 0 && this.#progress > 0) return lerpPose(pose, slotPose(depth - 1), this.#progress * 0.6);
    return pose;
  }

  #step() {
    this.#order.forEach((index, depth) => {
      const body = this.#bodies[index];
      if (body.phase === 'drag') return;
      const spring = body.phase === 'out' ? FLIGHT : body.phase === 'return' ? RETURN : HOME;
      const target = this.#targetFor(body, depth);
      for (const [key, speed] of AXES) {
        body[speed] += (-spring.k * (body[key] - target[key]) - spring.c * body[speed]) * STEP;
        body[key] += body[speed] * STEP;
      }
      // Top of the arc: the card stops travelling outward, swaps to its new
      // layer while it is clear of the deck, and heads home.
      if (body.phase === 'out' && body.vx * body.dx + body.vy * body.dy <= 0) {
        body.phase = 'return';
        body.z = body.apexZ;
      }
    });
  }

  // Draws every card; the loop sleeps once all have settled.
  #render() {
    let active = false;
    this.#order.forEach((index, depth) => {
      const body = this.#bodies[index];
      if (body.phase === 'drag') {
        active = true;
      } else {
        const target = this.#targetFor(body, depth);
        if (reducedMotion.matches) Object.assign(body, target, { vx: 0, vy: 0, vr: 0, vs: 0, phase: 'rest', z: null });
        if (isSettled(body, target) && body.phase !== 'out') {
          body.phase = 'rest';
          body.z = null;
        } else {
          active = true;
        }
      }
      this.#write(index, depth);
    });
    return active;
  }

  #commit(order) {
    this.#order = order;
    this.#paintOrder();
    this.emit('change', { card: this.cards[order[0]] });
    this.#loop.wake();
  }

  // Sends the top card flying along (vx, vy) px/ms; it comes back under the
  // pile. (fx, fy) is the direction when there is no real velocity.
  #throwTop(vx, vy, fx, fy) {
    const index = this.#order[0];
    if (index === undefined || this.#order.length < 2) return;
    const body = this.#bodies[index];
    const node = this.#nodes[index];
    const speed = Math.hypot(vx, vy);
    const rawX = speed > 0.05 ? vx : fx;
    const rawY = speed > 0.05 ? vy : fy;
    const norm = Math.hypot(rawX, rawY) || 1;
    const ux = rawX / norm;
    const uy = rawY / norm;
    const distance = clearance(node.offsetWidth, node.offsetHeight, ux, uy) + Math.min(speed * 50, 90);
    // Keep some speed, so a slow but far drag still leaves with intent.
    const launch = Math.max(speed, 0.9) * 1000;
    Object.assign(body, {
      phase: 'out',
      dx: ux,
      dy: uy,
      out: { x: ux * distance, y: uy * distance, r: Math.max(-40, Math.min(40, body.r + ux * 26)), s: 1 },
      vx: ux * launch,
      vy: uy * launch,
      vr: body.vr + ux * launch * 0.05,
      z: TOP_Z,
      apexZ: null,
    });
    this.#commit([...this.#order.slice(1), index]);
  }

  // The bottom card slips out to the left, swaps on top at its apex and lands
  // as the new top card.
  #bringBack() {
    const index = this.#order.at(-1);
    if (index === undefined || this.#order.length < 2) return;
    const node = this.#nodes[index];
    const [ux, uy] = [-0.97, -0.24];
    const distance = clearance(node.offsetWidth, node.offsetHeight, ux, uy) + 20;
    Object.assign(this.#bodies[index], { phase: 'out', dx: ux, dy: uy, out: { x: ux * distance, y: uy * distance, r: -16, s: 1 }, vx: ux * 1100, vy: uy * 1100, z: 0, apexZ: TOP_Z - 1 });
    this.#commit([index, ...this.#order.slice(0, -1)]);
  }

  #cycle(direction, focus = false) {
    if (direction === 1) this.#throwTop(1.3, -0.35, 1, 0);
    else this.#bringBack();
    if (focus) this.#nodes[this.#order[0]]?.focus({ preventScroll: true });
  }

  // ---- Dragging ----

  #down(event) {
    this.#suppressClick = false;
    const node = event.target.closest('.card');
    const index = Number(node?.dataset.index);
    if (!node || this.#drag || this.#order[0] !== index || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const body = this.#bodies[index];
    const rect = node.getBoundingClientRect();
    node.setPointerCapture?.(event.pointerId);
    this.#drag = {
      id: event.pointerId,
      node,
      index,
      x: event.clientX,
      y: event.clientY,
      baseX: body.x,
      baseY: body.y,
      width: node.offsetWidth,
      // Grabbed in the top half the top swings out; in the bottom half the
      // other way.
      lever: event.clientY - rect.top < rect.height / 2 ? 1 : -1,
      moved: false,
      samples: [{ t: event.timeStamp, x: event.clientX, y: event.clientY }],
    };
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < TAP_SLOP) return;
      // Axis lock for touch: a mostly vertical swipe is a page scroll.
      if (event.pointerType !== 'mouse' && Math.abs(dy) > Math.abs(dx)) {
        this.#drag = null;
        if (drag.node.hasPointerCapture?.(event.pointerId)) drag.node.releasePointerCapture(event.pointerId);
        return;
      }
    }
    drag.moved = true;
    drag.samples.push({ t: event.timeStamp, x: event.clientX, y: event.clientY });
    if (drag.samples.length > 24) drag.samples.shift();
    const body = this.#bodies[drag.index];
    Object.assign(body, { phase: 'drag', x: drag.baseX + dx, y: drag.baseY + dy, s: 1, vx: 0, vy: 0, vr: 0, vs: 0 });
    body.r = Math.max(-1, Math.min(1, body.x / drag.width)) * MAX_DRAG_ROTATION * drag.lever;
    this.#progress = Math.min(Math.hypot(body.x, body.y) / (drag.width * THROW_DISTANCE), 1);
    this.#loop.wake();
  }

  #up(event, cancelled) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    this.#progress = 0;
    const body = this.#bodies[drag.index];
    if (!drag.moved || cancelled) {
      // The browser took the gesture, or it was a tap: spring home.
      if (body.phase === 'drag') body.phase = 'rest';
      this.#loop.wake();
      return;
    }
    this.#suppressClick = true;
    const { vx, vy } = releaseVelocity(drag.samples);
    const speed = Math.hypot(vx, vy);
    const distance = Math.hypot(body.x, body.y);
    // A flick back toward the deck is a change of mind, not a throw.
    const heading = distance > 0 ? (vx * body.x + vy * body.y) / distance : 0;
    const fast = speed > THROW_VELOCITY && heading > -0.2;
    const far = distance > drag.width * THROW_DISTANCE && heading > -0.3;
    if (fast || far) {
      this.#throwTop(vx, vy, body.x / (distance || 1), body.y / (distance || 1));
      return;
    }
    // Spring home, carrying the release velocity into the spring.
    Object.assign(body, { phase: 'rest', vx: vx * 1000, vy: vy * 1000, vr: ((vx * 1000) / drag.width) * MAX_DRAG_ROTATION * drag.lever });
    this.#loop.wake();
  }

  #click(event) {
    const node = event.target.closest('.card');
    if (!node) return;
    if (this.#suppressClick) {
      this.#suppressClick = false;
      return;
    }
    if (this.#order[0] === Number(node.dataset.index)) this.#openDetails(Number(node.dataset.index));
  }

  #key(event) {
    // A drag that ended without its click must not swallow Enter or Space.
    this.#suppressClick = false;
    const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!direction) return;
    event.preventDefault();
    this.#cycle(direction, true);
  }

  // ---- Details ----

  #renderInfo(card) {
    const specs = (card.specs ?? []).map(({ label, value }) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
    this.query('.info').innerHTML = `<div class="head"><h3>${escapeHtml(card.title)}</h3>${card.price ? `<span class="price">${escapeHtml(card.price)}</span>` : ''}</div><p class="subtitle">${escapeHtml(card.subtitle)}</p><p class="description">${escapeHtml(card.description ?? '')}</p><dl>${specs}</dl><button class="action" type="button">${escapeHtml(this.actionLabel)}</button>`;
  }

  // The dialog grows out of the card it opens from, and folds back into it.
  #flip(dialog, node, opening) {
    if (reducedMotion.matches) return Promise.resolve();
    const from = node.getBoundingClientRect();
    const to = dialog.getBoundingClientRect();
    const card = `translate(${from.left + from.width / 2 - (to.left + to.width / 2)}px, ${from.top + from.height / 2 - (to.top + to.height / 2)}px) scale(${from.width / to.width}, ${from.height / to.height})`;
    const frames = [{ transform: card }, { transform: 'none' }];
    const animation = dialog.animate(opening ? frames : frames.reverse(), { duration: 450, easing: EASE_OUT });
    const fade = this.query('.details').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: EASE_OUT, direction: opening ? 'normal' : 'reverse' });
    return Promise.all([animation.finished, fade.finished]).catch(() => undefined);
  }

  #openDetails(index) {
    const card = this.cards[index];
    const node = this.#nodes[index];
    this.#openIndex = index;
    this.#renderInfo(card);
    const dialog = this.query('.dialog');
    dialog.ariaLabel = card.title;
    dialog.querySelector('.art').innerHTML = card.art ?? '';
    this.query('.details').hidden = false;
    node.classList.add('opened');
    this.#flip(dialog, node, true);
    dialog.querySelector('.info').animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 250, delay: 80, easing: EASE_OUT, fill: 'backwards' });
    this.query('.close').focus({ preventScroll: true });
  }

  async #closeDetails() {
    if (this.#openIndex === null) return;
    const node = this.#nodes[this.#openIndex];
    this.#openIndex = null;
    await this.#flip(this.query('.dialog'), node, false);
    this.query('.details').hidden = true;
    node.classList.remove('opened');
    this.#nodes[this.#order[0]]?.focus({ preventScroll: true });
  }

  #detailsClick(event) {
    if (event.target === event.currentTarget || event.target.closest('.close')) {
      this.#closeDetails();
    } else if (event.target.closest('.action') && this.#openIndex !== null) {
      this.emit('action', { card: this.cards[this.#openIndex] });
    }
  }
}
