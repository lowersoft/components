import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronLeft, chevronRight, pause, play } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, springFeel } from '../../core/motion.js';
import styles from './stack-reveal.scss?inline';

const unsplash = (id) => `https://images.unsplash.com/photo-${id}?w=1040&h=660&fit=crop&auto=format&q=80`;

const DEMO_ITEMS = [
  { src: unsplash('1501785888041-af3ef285b470'), alt: 'A still lake below forested mountains', label: 'Lake below the peaks' },
  { src: unsplash('1470071459604-3b5ec3a7fe05'), alt: 'Fog settling between green hills', label: 'Misty hills' },
  { src: unsplash('1469474968028-56623f02e42e'), alt: 'The sun setting over a wide valley', label: 'Valley at sundown' },
  { src: unsplash('1506905925346-21bda4d32df4'), alt: 'Mountain peaks rising above the clouds', label: 'Above the clouds' },
  { src: unsplash('1441974231531-c6227db76b6e'), alt: 'Sunlight falling through a dense forest', label: 'Forest light' },
];

// Resting pose of each slot behind the top print, as shares of `spread`
// (sideways), `peek` (upwards) and `tilt` (degrees). The pile alternates
// sides so every print shows an edge; deeper prints sit smaller.
const SLOTS = [
  { x: 0, y: 0, r: 0 },
  { x: 0.45, y: 1 / 3, r: 0.75 },
  { x: -0.55, y: 2 / 3, r: -0.95 },
  { x: 0.65, y: 1, r: 1.15 },
];
const MAX_DEPTH = SLOTS.length - 1;
const SLOT_SCALE = 0.045;
// A print counts as clear of the pile once its top edge passes the bottom
// of the top print by this much. It aims a little further and turns back
// as it gets there, so the drop slows into the rise instead of stopping.
const CLEAR_MARGIN = 6;
// Share of the print's height.
const DROP_OVERSHOOT = 0.25;
const STEP = 1 / 240;
const critical = (rate) => ({ stiffness: rate * rate, damping: 2 * rate });
// The pile's motion, and the quicker fall of a print leaving or coming back.
const FEELS = {
  spring: { pile: springFeel(0.4, 0), drop: critical(10) },
  // Heavier damping: an eased glide with no spring in it.
  glide: { pile: (({ stiffness, damping }) => ({ stiffness, damping: damping * 1.3 }))(springFeel(0.45, 0)), drop: critical(8.5) },
};
const AXES = ['x', 'y', 'r', 's'];

const pad = (n) => String(n).padStart(2, '0');

/**
 * A pile of photo prints that steps through one at a time. Next drops the
 * top print out below the pile; once it is clear it slips behind and rises
 * into the back slot while the others move up. Previous runs the same path
 * backwards. The motion is a spring, so quick presses blend into one
 * another instead of queueing.
 *
 * Beside the pile sit a heading, a description, previous and next buttons,
 * a counter and the top print's label. Autoplay steps on a timer and stops
 * while the pile is off screen, the tab is hidden, keyboard focus is inside
 * it, or paused; with `pause-on-hover` also while hovered. The arrow keys
 * step once the pile has focus. With reduced motion the prints swap in
 * place.
 *
 * Items are `{ src, alt, label, position? }`; `position` is a CSS
 * `object-position` for the photo.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {Array<object>} items (JSON)
 * @attr {number} index - The top print
 * @attr {number} width - Print width in pixels; the pile scales down to fit
 * @attr {number} height - Print height in pixels
 * @attr {number} spread - How far the prints behind reach sideways, in pixels
 * @attr {number} peek - How far the prints behind show above the top one, in pixels
 * @attr {number} tilt - How far the prints behind lean, in degrees
 * @attr {number} drop - How far the top print falls before it slips behind; by default just past its own height
 * @attr {'spring'|'glide'} easing
 * @attr {number} interval - Seconds between automatic steps
 * @attr {boolean} no-autoplay
 * @attr {boolean} paused - Autoplay is paused
 * @attr {boolean} pause-on-hover
 * @attr {boolean} no-controls - Hides the buttons, counter and label
 * @fires lw-change - The top print changed; `detail: { index, item }`
 * @fires lw-select - A print was clicked; `detail: { index, item }`
 * @csspart stage - The pile's focusable frame
 * @csspart card - Each print
 * @csspart image - Each photo
 * @csspart controls - The buttons, counter and label
 * @cssprop --lw-stack-reveal-frame - The print border color
 */
export class LwStackReveal extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Places worth the drive' },
    description: { default: 'Five stops from one long road trip. Step through them and each print slides back under the pile.' },
    items: { type: Object, default: DEMO_ITEMS },
    index: { type: Number, default: 0, reflect: true },
    width: { type: Number, default: 520 },
    height: { type: Number, default: 330 },
    spread: { type: Number, default: 56 },
    peek: { type: Number, default: 62 },
    tilt: { type: Number, default: 6 },
    drop: { type: Number },
    easing: { default: 'spring' },
    interval: { type: Number, default: 5 },
    noAutoplay: { type: Boolean },
    paused: { type: Boolean, reflect: true },
    pauseOnHover: { type: Boolean },
    noControls: { type: Boolean },
  };

  // Item indices from the top print down.
  #order = [];
  // One body per item: its pose, velocity, and where it is in a drop.
  #bodies = [];
  #layerCount = 0;
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#render() });
  #timer = 0;
  #visible = false;
  #hovered = false;
  #focused = false;

  render() {
    return `<div class="layout"><div class="text"><h2 class="title"></h2><p class="description"></p>
<div class="controls" part="controls"><button class="nav prev" type="button" aria-label="Previous print">${strokeIcon(chevronLeft, 18)}</button><button class="nav next" type="button" aria-label="Next print">${strokeIcon(chevronRight, 18)}</button><p class="counter"><span class="current"></span><span class="of"> / </span><span class="total"></span></p><p class="caption"></p><button class="toggle" type="button"></button></div></div>
<div class="stage" part="stage" tabindex="0" role="group" aria-roledescription="carousel"><div class="pile"></div></div></div><p class="live visually-hidden" aria-live="polite"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const stage = this.query('.stage');
    this.query('.prev').addEventListener('click', () => this.#move(-1, true), options);
    this.query('.next').addEventListener('click', () => this.#move(1, true), options);
    this.query('.toggle').addEventListener('click', () => (this.paused = !this.paused), options);
    stage.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      this.#move(step, true);
    }, options);
    stage.addEventListener('click', (event) => {
      const card = event.target.closest('.card');
      if (!card) return;
      const index = Number(card.dataset.index);
      this.emit('select', { index, item: this.items[index] });
    }, options);

    // Autoplay waits while hovered (when asked), while keyboard focus is
    // inside, off screen and in a hidden tab.
    this.addEventListener('pointerenter', () => this.#hover(true), options);
    this.addEventListener('pointerleave', () => this.#hover(false), options);
    // On the shadow root: moves between its own controls never reach the host.
    this.shadowRoot.addEventListener('focusin', (event) => this.#focus(event.target.matches(':focus-visible')), options);
    this.shadowRoot.addEventListener('focusout', (event) => {
      if (!this.shadowRoot.contains(event.relatedTarget)) this.#focus(false);
    }, options);
    document.addEventListener('visibilitychange', () => this.#schedule(), options);
    const seen = new IntersectionObserver(([entry]) => {
      this.#visible = entry.isIntersecting;
      this.#schedule();
    });
    seen.observe(this);
    const sized = new ResizeObserver(() => this.#fit());
    sized.observe(stage);
    this.signal.addEventListener('abort', () => {
      seen.disconnect();
      sized.disconnect();
      this.#loop.stop();
      clearTimeout(this.#timer);
    });
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.description').hidden = !this.description;
    this.query('.stage').ariaLabel = this.heading || 'Photos';
    this.query('.controls').hidden = this.noControls;
    this.style.setProperty('--_width', `${this.width}px`);
    this.style.setProperty('--_height', `${this.height}px`);

    if (changed.has('items')) this.#build();
    else if (changed.has('index') && this.#clamp(this.index) !== this.#order[0]) this.#jump(this.#clamp(this.index));
    if (['items', 'width', 'height', 'spread', 'peek', 'tilt'].some((prop) => changed.has(prop))) {
      this.#fit();
      this.#settle();
    }
    this.#paintText();
    this.#schedule();
  }

  /** Brings the next print to the top. */
  next() {
    this.#move(1, false);
  }

  /** Brings the previous print back to the top. */
  previous() {
    this.#move(-1, false);
  }

  #clamp(index) {
    const count = this.items.length;
    return count ? ((Math.round(index) % count) + count) % count : 0;
  }

  #build() {
    const items = this.items ?? [];
    const front = this.#clamp(this.index);
    this.#order = items.map((_, i) => (front + i) % items.length);
    if (items.length && this.index !== front) this.index = front;
    this.query('.pile').innerHTML = items
      .map(
        (item, i) =>
          `<figure class="card" part="card" data-index="${i}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}"><img class="image" part="image" src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt ?? '')}" draggable="false" decoding="async"${i > MAX_DEPTH ? ' loading="lazy"' : ''}${item.position ? ` style="object-position: ${escapeHtml(item.position)}"` : ''}></figure>`,
      )
      .join('');
    this.#bodies = items.map(() => ({ x: 0, y: 0, r: 0, s: 1, vx: 0, vy: 0, vr: 0, vs: 0, phase: null, layer: null, z: 0 }));
  }

  // Puts every print at rest in its slot, with no motion.
  #settle() {
    this.#order.forEach((item, depth) => {
      const body = this.#bodies[item];
      Object.assign(body, this.#pose(depth), { vx: 0, vy: 0, vr: 0, vs: 0, phase: null, layer: null });
    });
    this.#render();
  }

  #pose(depth) {
    const slot = SLOTS[Math.min(depth, MAX_DEPTH, this.#order.length - 1)];
    return { x: slot.x * this.spread, y: -slot.y * this.peek, r: slot.r * this.tilt, s: 1 - Math.min(depth, MAX_DEPTH) * SLOT_SCALE };
  }

  // Where a print aims while it drops: straight down, past the top print.
  get #dropPose() {
    return { x: 0, y: this.#clearAt + this.height * DROP_OVERSHOOT, r: 0, s: 1 };
  }

  get #clearAt() {
    return this.drop ?? this.height + CLEAR_MARGIN;
  }

  #target(item) {
    const body = this.#bodies[item];
    return body.phase ? this.#dropPose : this.#pose(this.#order.indexOf(item));
  }

  // Scales the pile down to the stage's width and reserves room above it
  // for the prints that peek out.
  #fit() {
    const stage = this.query('.stage');
    if (!stage.clientWidth || !this.#order.length) return;
    const w = this.width / 2;
    const h = this.height / 2;
    let left = -w;
    let right = w;
    let top = -h;
    for (let depth = 1; depth < Math.min(this.#order.length, SLOTS.length); depth++) {
      const { x, y, r, s } = this.#pose(depth);
      const rad = (Math.abs(r) * Math.PI) / 180;
      const hx = s * (w * Math.cos(rad) + h * Math.sin(rad));
      const hy = s * (w * Math.sin(rad) + h * Math.cos(rad));
      left = Math.min(left, x - hx);
      right = Math.max(right, x + hx);
      top = Math.min(top, y - hy);
    }
    const scale = Math.min(1, stage.clientWidth / (right - left));
    this.style.setProperty('--_scale', scale);
    this.style.setProperty('--_room', `${(-h - top) * scale}px`);
    this.style.setProperty('--_shift', `${(-(left + right) / 2) * scale}px`);
  }

  // A step from a button, a key or autoplay. Each print that changes place
  // springs from wherever it is now, so a quick second press blends in.
  #move(direction, byUser) {
    const count = this.#order.length;
    if (count < 2) return;
    let moving;
    if (direction > 0) {
      moving = this.#order.shift();
      this.#order.push(moving);
    } else {
      moving = this.#order.pop();
      this.#order.unshift(moving);
    }
    const body = this.#bodies[moving];
    if (reducedMotion.matches) {
      this.#settle();
    } else {
      // Down past the pile; in front of it when leaving the top, behind it
      // when coming back from the bottom, unless already on that side.
      body.phase = direction > 0 ? 'drop' : 'sink';
      body.layer = direction > 0 ? (body.layer === 'bottom' ? 'bottom' : 'top') : body.layer === 'top' ? 'top' : 'bottom';
      body.z = ++this.#layerCount;
      this.#loop.wake();
    }
    this.index = this.#order[0];
    const index = this.#order[0];
    this.#paintText();
    if (byUser) this.query('.live').textContent = `${index + 1} of ${count}: ${this.items[index].label ?? this.items[index].alt ?? ''}`;
    this.emit('change', { index, item: this.items[index] });
    this.#schedule();
  }

  // Set from outside: every print springs straight to its new slot.
  #jump(front) {
    const count = this.#order.length;
    this.#order = this.#order.map((_, i) => (front + i) % count);
    for (const body of this.#bodies) {
      body.phase = null;
      body.layer = null;
    }
    if (reducedMotion.matches) this.#settle();
    else this.#loop.wake();
    this.#paintText();
  }

  #step() {
    const feel = FEELS[this.easing] ?? FEELS.spring;
    const clearAt = this.#clearAt;
    this.#order.forEach((item) => {
      const body = this.#bodies[item];
      const target = this.#target(item);
      const { stiffness, damping } = body.phase ? feel.drop : feel.pile;
      for (const axis of AXES) {
        const v = `v${axis}`;
        body[v] += ((target[axis] - body[axis]) * stiffness - body[v] * damping) * STEP;
        body[axis] += body[v] * STEP;
      }
      // Clear of the pile: it slips to the other side and heads for its slot.
      if (body.phase && body.y >= clearAt) {
        body.layer = body.phase === 'drop' ? 'bottom' : 'top';
        body.z = ++this.#layerCount;
        body.phase = null;
      }
    });
  }

  #render() {
    let moving = false;
    this.#order.forEach((item, depth) => {
      const body = this.#bodies[item];
      const target = this.#target(item);
      const rest = !body.phase && AXES.every((axis) => Math.abs(body[axis] - target[axis]) < (axis === 's' ? 0.0005 : 0.05) && Math.abs(body[`v${axis}`]) < (axis === 's' ? 0.005 : 0.5));
      if (rest) {
        Object.assign(body, target, { vx: 0, vy: 0, vr: 0, vs: 0, layer: null });
      } else {
        moving = true;
      }
      const card = this.shadowRoot.querySelector(`.card[data-index="${item}"]`);
      if (!card) return;
      // In front of the pile, behind it, or in its slot's place.
      const z = body.layer === 'top' ? 3000 + (body.z % 1000) : body.layer === 'bottom' ? 1000 - depth : 2000 - depth;
      card.style.zIndex = String(z);
      card.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.r}deg) scale(${body.s})`;
      // A print still dropping stays seen until it is behind the pile.
      card.classList.toggle('deep', depth > MAX_DEPTH && !body.phase && body.y <= 0);
      card.toggleAttribute('data-top', depth === 0);
      card.ariaHidden = depth === 0 ? null : 'true';
    });
    return moving;
  }

  #paintText() {
    const count = this.#order.length;
    const index = this.#order[0] ?? 0;
    const item = this.items[index];
    this.query('.current').textContent = pad(count ? index + 1 : 0);
    this.query('.total').textContent = pad(count);
    const caption = this.query('.caption');
    const label = item?.label ?? '';
    if (caption.textContent !== label) {
      const changing = Boolean(caption.textContent);
      caption.textContent = label;
      if (changing && !reducedMotion.matches) caption.animate({ opacity: [0, 1], translate: ['0 0.25rem', '0 0'] }, { duration: 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    }
    const toggle = this.query('.toggle');
    toggle.hidden = this.noAutoplay || count < 2;
    toggle.innerHTML = strokeIcon(this.paused ? play : pause, 16);
    toggle.ariaLabel = this.paused ? 'Play' : 'Pause';
    this.query('.prev').disabled = this.query('.next').disabled = count < 2;
  }

  #hover(on) {
    this.#hovered = on;
    this.#schedule();
  }

  #focus(on) {
    this.#focused = on;
    this.#schedule();
  }

  // Starts the next automatic step's countdown, or holds it.
  #schedule() {
    clearTimeout(this.#timer);
    const held = this.noAutoplay || this.paused || this.#focused || (this.pauseOnHover && this.#hovered) || !this.#visible || document.hidden || this.#order.length < 2;
    if (held) return;
    this.#timer = setTimeout(() => this.#move(1, false), Math.max(1, this.interval) * 1000);
  }
}
