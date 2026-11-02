import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo } from '../../core/motion.js';
import styles from './orbital-image-carousel.scss?inline';

const unsplash = (id) => `https://images.unsplash.com/photo-${id}?w=700&h=860&fit=crop&auto=format&q=75`;

const DEMO_ITEMS = [
  ['1501785888041-af3ef285b470', 'A rowing boat on a turquoise mountain lake', 'Braies Lake'],
  ['1500530855697-b586d89ba3ee', 'A road winding through red canyon rock', 'Canyon Road'],
  ['1470071459604-3b5ec3a7fe05', 'Fog rolling over green hills', 'Misty Hills'],
  ['1464822759023-fed622ff2c3b', 'Snowy peaks under a clear sky', 'High Peaks'],
  ['1469474968028-56623f02e42e', 'Sun setting over a valley of rock spires', 'Valley Light'],
  ['1441974231531-c6227db76b6e', 'Sunlight falling through a dense forest', 'Forest Light'],
  ['1433086966358-54859d0ed716', 'A waterfall under a stone bridge', 'Falls'],
  ['1447752875215-b2761acb3c5d', 'A path between tall trees', 'Woodland Path'],
].map(([id, alt, label]) => ({ src: unsplash(id), alt, label }));

// Degrees the ring turns per pixel dragged, and how far a release carries.
const DRAG = 0.22;
const THROW = 0.18;
const SETTLE = springFeel(0.6, 0.08);
// How far the photo drifts inside its card as the card swings by.
const PARALLAX = 9;

/**
 * Photos on the inside of a turning cylinder: the one ahead sits far off,
 * the ones beside it swing in close, and each photo drifts inside its card
 * with its depth. Drag to spin it; a release carries on and settles on the
 * nearest card. The arrow keys step one card at a time. Hovering a card
 * dims the rest.
 *
 * With reduced motion, dragging and the staggered entrance are off and the
 * keys turn it without easing.
 *
 * Items are `{ src, alt, label?, position? }`; `position` is a CSS
 * `object-position`. The cards share the ring evenly, so for gaps between
 * them keep `radius` above about `items × (card-width + 40) / 6.28`.
 *
 * @attr {Array<object>} items (JSON)
 * @attr {number} index - The card ahead
 * @attr {number} card-width - In pixels
 * @attr {number} card-height - In pixels
 * @attr {number} radius - The cylinder's radius, in pixels
 * @attr {number} perspective - The CSS perspective distance, in pixels
 * @attr {boolean} no-drag
 * @attr {boolean} no-snap - Lets a throw come to rest between cards
 * @attr {number} inactive-opacity - How far the other cards dim while one is hovered
 * @attr {string} label - Accessible name of the carousel
 * @fires lw-change - Another card came ahead; `detail: { index, item }`
 * @csspart stage - The focusable frame
 * @csspart card - Each card
 */
export class LwOrbitalImageCarousel extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    index: { type: Number, default: 0, reflect: true },
    cardWidth: { type: Number, default: 320 },
    cardHeight: { type: Number, default: 392 },
    radius: { type: Number, default: 470 },
    perspective: { type: Number, default: 1700 },
    noDrag: { type: Boolean },
    noSnap: { type: Boolean },
    inactiveOpacity: { type: Number, default: 0.42 },
    label: { default: 'Photo carousel' },
  };

  // The ring's turn in degrees; the card ahead is at -rotation.
  #rotation = 0;
  #drag = null;
  #stop = null;
  #entered = false;

  render() {
    return '<div class="stage" part="stage" tabindex="0" role="group" aria-roledescription="carousel"><div class="ring"></div></div><p class="live visually-hidden" aria-live="polite"></p>';
  }

  connected() {
    const options = { signal: this.signal };
    const stage = this.query('.stage');
    stage.addEventListener('pointerdown', (event) => this.#press(event), options);
    stage.addEventListener('pointermove', (event) => this.#move(event), options);
    stage.addEventListener('pointerup', (event) => this.#release(event), options);
    stage.addEventListener('pointercancel', (event) => this.#release(event), options);
    stage.addEventListener('keydown', (event) => this.#key(event), options);
    // Hovering a card dims the others.
    stage.addEventListener('pointerover', (event) => this.#hover(event.target.closest('.card')), options);
    stage.addEventListener('pointerleave', () => this.#hover(null), options);
    const seen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      seen.disconnect();
      this.#enter();
    }, { threshold: 0.3 });
    seen.observe(this);
    this.signal.addEventListener('abort', () => {
      seen.disconnect();
      this.#stop?.();
    });
  }

  updated(changed) {
    this.query('.stage').ariaLabel = this.label || 'Photo carousel';
    this.style.setProperty('--_w', `${Math.max(40, this.cardWidth)}px`);
    this.style.setProperty('--_h', `${Math.max(40, this.cardHeight)}px`);
    this.style.setProperty('--_radius', `${Math.max(0, this.radius)}px`);
    this.style.setProperty('--_perspective', `${Math.max(100, this.perspective)}px`);
    this.style.setProperty('--_dim', String(Math.min(1, Math.max(0, this.inactiveOpacity ?? 0.42))));
    if (changed.has('items')) this.#build();
    if (changed.has('index') && this.#clamp(this.index) !== this.#ahead) this.#turnTo(this.#clamp(this.index), !changed.has('items'));
    this.#paint();
  }

  get #count() {
    return (this.items ?? []).length;
  }

  get #step() {
    return 360 / Math.max(1, this.#count);
  }

  get #ahead() {
    const count = this.#count;
    return count ? ((Math.round(-this.#rotation / this.#step) % count) + count) % count : 0;
  }

  #clamp(index) {
    const count = this.#count;
    return count ? ((Math.round(index) % count) + count) % count : 0;
  }

  #build() {
    const items = this.items ?? [];
    this.query('.ring').innerHTML = items
      .map(
        (item, i) =>
          `<figure class="card" part="card" data-index="${i}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${items.length}${item.label ? `: ${escapeHtml(item.label)}` : ''}" style="--_i: ${i}"><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt ?? '')}" draggable="false" decoding="async"${item.position ? ` style="object-position: ${escapeHtml(item.position)}"` : ''}>${item.label ? `<figcaption class="caption">${escapeHtml(item.label)}</figcaption>` : ''}</figure>`,
      )
      .join('');
    this.#rotation = -this.#clamp(this.index) * this.#step;
  }

  // Lays the ring out at the current turn: each card's angle, how far it
  // faces away, and its photo's drift.
  #paint() {
    const step = this.#step;
    this.query('.ring').style.transform = `rotateY(${this.#rotation}deg)`;
    const ahead = this.#ahead;
    this.shadowRoot.querySelectorAll('.card').forEach((card, i) => {
      const angle = i * step;
      // Where the card is relative to straight ahead, from -180 to 180.
      const relative = ((((angle + this.#rotation) % 360) + 540) % 360) - 180;
      card.style.transform = `rotateY(${angle}deg) translateZ(calc(var(--_radius) * -1))`;
      card.style.setProperty('--_drift', `${(-relative / 90) * PARALLAX}%`);
      card.ariaHidden = i === ahead ? null : 'true';
      card.toggleAttribute('data-ahead', i === ahead);
    });
  }

  #turnTo(index, animate = true) {
    const step = this.#step;
    // The shortest way round to the card.
    const current = -this.#rotation / step;
    const delta = ((((index - current) % this.#count) + this.#count * 1.5) % this.#count) - this.#count / 2;
    this.#spin(this.#rotation - delta * step, animate);
  }

  // Springs the ring to `target` degrees, or jumps there.
  #spin(target, animate = true, velocity = 0) {
    this.#stop?.();
    this.#stop = null;
    if (!animate || reducedMotion.matches) {
      this.#rotation = target;
      this.#paint();
      this.#announce();
      return;
    }
    this.#stop = springTo(this.#rotation, target, {
      ...SETTLE,
      velocity,
      restDelta: 0.02,
      restSpeed: 0.5,
      update: (value) => {
        this.#rotation = value;
        this.#paint();
        this.#announce();
      },
      done: () => (this.#stop = null),
    });
  }

  // The card ahead changed: reflect it and tell.
  #announce() {
    const ahead = this.#ahead;
    if (ahead === this.index) return;
    this.index = ahead;
    this.emit('change', { index: ahead, item: this.items[ahead] });
  }

  #press(event) {
    if (event.button !== 0 || this.noDrag || reducedMotion.matches || this.#count < 2) return;
    this.#stop?.();
    this.#stop = null;
    this.#drag = { x: event.clientX, rotation: this.#rotation, last: event.clientX, time: performance.now(), velocity: 0, moved: false };
    this.query('.stage').setPointerCapture(event.pointerId);
    this.toggleAttribute('data-dragging', true);
  }

  #move(event) {
    const drag = this.#drag;
    if (!drag) return;
    const now = performance.now();
    const dt = Math.max(1, now - drag.time);
    // Degrees per second, smoothed so one jittery frame does not decide the throw.
    drag.velocity = drag.velocity * 0.6 + (((event.clientX - drag.last) * DRAG) / dt) * 1000 * 0.4;
    drag.last = event.clientX;
    drag.time = now;
    if (Math.abs(event.clientX - drag.x) > 3) drag.moved = true;
    this.#rotation = drag.rotation + (event.clientX - drag.x) * DRAG;
    this.#paint();
    this.#announce();
  }

  #release(event) {
    const drag = this.#drag;
    if (!drag) return;
    this.#drag = null;
    this.removeAttribute('data-dragging');
    this.query('.stage').releasePointerCapture?.(event.pointerId);
    // A pause before letting go drops the throw.
    const velocity = performance.now() - drag.time > 80 ? 0 : drag.velocity;
    let target = this.#rotation + velocity * THROW;
    if (!this.noSnap) target = Math.round(target / this.#step) * this.#step;
    this.#spin(target, true, velocity);
  }

  #key(event) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    let index;
    if (step) index = this.#ahead + step;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = this.#count - 1;
    else return;
    event.preventDefault();
    if (!this.#count) return;
    // Stepping from between cards lands on the nearest one first.
    const snapped = Math.round(this.#rotation / this.#step) * this.#step;
    const target = step ? snapped - step * this.#step : this.#rotation;
    if (step) this.#spin(target);
    else this.#turnTo(this.#clamp(index));
    const item = this.items[this.#clamp(index)];
    this.query('.live').textContent = `${this.#clamp(index) + 1} of ${this.#count}${item?.label ? `: ${item.label}` : ''}`;
  }

  #hover(card) {
    for (const each of this.shadowRoot.querySelectorAll('.card')) each.toggleAttribute('data-hovered', each === card);
    this.toggleAttribute('data-hovering', Boolean(card) && !this.#drag);
  }

  // Cards rise into place one after another, the first time it is seen.
  #enter() {
    if (this.#entered || reducedMotion.matches) return;
    this.#entered = true;
    this.shadowRoot.querySelectorAll('.card img, .card .caption').forEach((element) => {
      const card = element.closest('.card');
      const order = Math.abs(((Number(card.dataset.index) - this.#ahead + this.#count * 1.5) % this.#count) - this.#count / 2);
      // `translate` composes with the photo's own drift transform.
      element.animate({ opacity: [0, 1], translate: ['0 24px', '0 0'] }, { duration: 700, delay: order * 70, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' });
    });
  }
}
