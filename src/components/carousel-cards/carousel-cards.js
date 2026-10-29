import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronLeft, chevronRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion } from '../../core/motion.js';
import styles from './carousel-cards.scss?inline';
import { DEMO_ITEMS, sceneMarkup } from './scenes.js';

// Critically damped, so the rail lands on the card without a bounce.
const STIFFNESS = 170;
const DAMPING = 26;
// UIScrollView's normal deceleration rate, per ms.
const DECELERATION = 0.997;
const DRAG_THRESHOLD = 4;
const STEP = 1 / 240;
const HEART = 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z';
const STAR = '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
// Past an end, the rail gives less the further it is pulled.
const rubber = (overshoot, size) => Math.sign(overshoot) * (1 - 1 / ((Math.abs(overshoot) * 0.55) / size + 1)) * size;
const nearestIndex = (points, pos) => points.reduce((best, point, i) => (Math.abs(point - pos) < Math.abs(points[best] - pos) ? i : best), 0);
const pad = (n) => String(n).padStart(2, '0');

// Release velocity in px/ms from the last 100 ms; a pause before letting go
// means no flick.
const releaseVelocity = (samples, now) => {
  const first = samples[0];
  const last = samples.at(-1);
  const dt = last.t - first.t;
  if (dt <= 0 || now - last.t > 60) return 0;
  return -(last.x - first.x) / dt;
};

/**
 * A rail of cards you can flick with the mouse: the release velocity
 * projects an end point, a spring lands on the nearest card and the ends
 * rubber-band. Scrolling drives a cover-flow depth, parallax in each card's
 * picture, and the details of the card in the middle. Touch and wheel scroll
 * natively, the arrow keys step a card, and each card's heart saves it.
 *
 * Items are `{ id, title, location, image?, imageAlt?, scene?, badge?,
 * dates?, price, currency?, priceLabel?, rating?, reviewCount?, href? }`;
 * without an `image`, a drawn `scene` (city, mountains, dunes, lake,
 * islands, skyline, terraces or coast) fills the picture.
 *
 * @attr {Array<object>} items - The cards (JSON)
 * @attr {string} heading - The rail's title
 * @attr {string} eyebrow - A line above the title
 * @attr {Array<string>} favorites - Ids saved (JSON); kept up to date
 * @fires lw-favorite - A heart was toggled; `detail: { id, favorite }`
 * @fires lw-select - A card without an `href` was chosen; `detail: { item }`
 */
export class LwCarouselCards extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    heading: { default: 'Workshops this season' },
    eyebrow: { default: 'Hands-on systems programming' },
    favorites: { type: Object, default: [] },
  };

  #mode = 'idle';
  #pointerId = -1;
  #startX = 0;
  #startPos = 0;
  #pos = 0;
  #velocity = 0;
  #target = 0;
  #samples = [];
  #suppressClick = false;
  #active = 0;
  #scrollFrame = 0;
  #loop = fixedStepLoop(STEP, {
    step: () => {
      this.#velocity += (-STIFFNESS * (this.#pos - this.#target) - DAMPING * this.#velocity) * STEP;
      this.#pos += this.#velocity * STEP;
    },
    render: () => this.#springFrame(),
  });

  render() {
    return `<section aria-roledescription="carousel">
  <div class="top"><div class="titles"><p class="eyebrow"></p><h2></h2></div><div class="controls"><span class="count" aria-live="polite"></span><button class="prev" type="button" aria-label="Previous">${strokeIcon(chevronLeft)}</button><button class="next" type="button" aria-label="Next">${strokeIcon(chevronRight)}</button></div></div>
  <div class="scroller" tabindex="0"><ul class="track"></ul></div>
</section>`;
  }

  connected() {
    const options = { signal: this.signal };
    const scroller = this.query('.scroller');
    scroller.addEventListener('keydown', (event) => this.#key(event), options);
    scroller.addEventListener('scroll', () => this.#scrolled(), { ...options, passive: true });
    scroller.addEventListener('pointerdown', (event) => this.#down(event), options);
    scroller.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) scroller.addEventListener(type, (event) => this.#release(event), options);
    scroller.addEventListener('click', (event) => this.#swallow(event), { ...options, capture: true });
    scroller.addEventListener('click', (event) => this.#click(event), options);
    // Wheel or touch takes over from a running spring.
    for (const type of ['wheel', 'touchstart']) scroller.addEventListener(type, () => this.#native(), { ...options, passive: true });
    this.query('.prev').addEventListener('click', () => this.#goTo(this.#currentIndex - 1), options);
    this.query('.next').addEventListener('click', () => this.#goTo(this.#currentIndex + 1), options);
    this.signal.addEventListener('abort', () => {
      this.#loop.stop();
      cancelAnimationFrame(this.#scrollFrame);
      this.#scrollFrame = 0;
    });
  }

  updated(changed) {
    if (changed.has('heading')) {
      this.query('h2').textContent = this.heading ?? '';
      this.query('section').ariaLabel = this.heading ?? '';
      this.query('.scroller').ariaLabel = `${this.heading}, use arrow keys to move`;
    }
    if (changed.has('eyebrow')) this.query('.eyebrow').textContent = this.eyebrow ?? '';
    if (changed.has('items')) this.#build();
    if (changed.has('favorites') || changed.has('items')) this.#paintFavorites();
    this.#paintCount();
  }

  #build() {
    this.query('.track').innerHTML = this.items
      .map((item) => {
        const picture = item.image
          ? `<div class="layer" style="--_depth: 8%"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt ?? '')}" width="520" height="500" loading="lazy" decoding="async" draggable="false"></div>`
          : sceneMarkup(item.scene);
        // The link is stretched over the card; the heart sits above it.
        // Without an href it is a button: a bare "#" link would navigate.
        const title = escapeHtml(item.title);
        const link = item.href ? `<a class="link" href="${escapeHtml(item.href)}" draggable="false">${title}</a>` : `<button class="link" type="button">${title}</button>`;
        const rating = item.rating === undefined ? '' : `<span class="rating">${STAR}${item.rating.toFixed(2)}${item.reviewCount === undefined ? '' : `<span class="muted">(${item.reviewCount})</span>`}</span>`;
        const dates = item.dates ? `<span class="muted dates">· ${escapeHtml(item.dates)}</span>` : '';
        const price = `<span class="price">${escapeHtml(item.currency ?? '€')}${item.price}<span class="muted"> ${escapeHtml(item.priceLabel ?? 'total')}</span></span>`;
        return `<li class="card" data-id="${escapeHtml(item.id)}"><div class="tilt"><div class="picture">${picture}${item.badge ? `<span class="badge">${escapeHtml(item.badge)}</span>` : ''}<button class="heart" type="button" aria-label="Save ${title}" aria-pressed="false"><span class="glyph"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${HEART}"/></svg><span class="fill"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${HEART}"/></svg></span></span></button></div><div class="text"><h3>${link}</h3><p class="muted location">${escapeHtml(item.location)}</p><div class="details">${rating}${dates}${price}</div></div></div></li>`;
      })
      .join('');
  }

  #paintFavorites() {
    const saved = new Set(this.favorites ?? []);
    for (const card of this.shadowRoot.querySelectorAll('.card')) card.querySelector('.heart').ariaPressed = String(saved.has(card.dataset.id));
  }

  #paintCount() {
    const count = this.items.length;
    this.query('.count').innerHTML = `<span class="visually-hidden">Card </span>${pad(this.#active + 1)}<span aria-hidden="true"> / </span><span class="visually-hidden"> of </span>${pad(count)}`;
    // aria-disabled rather than disabled at the ends, so focus stays put.
    this.query('.prev').ariaDisabled = String(this.#active === 0);
    this.query('.next').ariaDisabled = String(this.#active >= count - 1);
  }

  // ---- The rail ----

  get #scroller() {
    return this.query('.scroller');
  }

  get #maxScroll() {
    return this.#scroller.scrollWidth - this.#scroller.clientWidth;
  }

  get #snapPoints() {
    const scroller = this.#scroller;
    const track = this.query('.track');
    return [...track.children].map((card) => clamp(track.offsetLeft + card.offsetLeft + card.offsetWidth / 2 - scroller.clientWidth / 2, 0, this.#maxScroll));
  }

  get #currentIndex() {
    return nearestIndex(this.#snapPoints, this.#mode === 'spring' ? this.#target : this.#scroller.scrollLeft);
  }

  // A virtual position: the part in range scrolls natively, the rest is a
  // damped translate of the track (the rubber band).
  #apply(pos) {
    const scroller = this.#scroller;
    const inRange = clamp(pos, 0, this.#maxScroll);
    scroller.scrollLeft = inRange;
    const over = pos - inRange;
    this.query('.track').style.transform = Math.abs(over) > 0.1 ? `translate3d(${(-rubber(over, scroller.clientWidth)).toFixed(2)}px,0,0)` : '';
  }

  // Native scroll snapping is off while the rail owns the position.
  #free(free) {
    this.#scroller.toggleAttribute('data-free', free);
  }

  #springFrame() {
    if (Math.abs(this.#pos - this.#target) < 0.5 && Math.abs(this.#velocity) < 8) {
      this.#pos = this.#target;
      this.#velocity = 0;
      this.#mode = 'idle';
      this.#apply(this.#target);
      this.#free(false);
      return false;
    }
    this.#apply(this.#pos);
    return true;
  }

  #springTo(target, velocity) {
    this.#loop.stop();
    if (this.#mode !== 'spring' && this.#mode !== 'dragging') this.#pos = this.#scroller.scrollLeft;
    this.#target = target;
    this.#velocity = velocity;
    if (reducedMotion.matches) {
      this.#mode = 'idle';
      this.#pos = target;
      this.#apply(target);
      this.#free(false);
      return;
    }
    this.#mode = 'spring';
    this.#free(true);
    this.#loop.wake();
  }

  #goTo(index) {
    const points = this.#snapPoints;
    this.#springTo(points[clamp(index, 0, points.length - 1)], this.#mode === 'spring' ? this.#velocity : 0);
  }

  #scrolled() {
    cancelAnimationFrame(this.#scrollFrame);
    this.#scrollFrame = requestAnimationFrame(() => {
      this.#scrollFrame = 0;
      const index = nearestIndex(this.#snapPoints, this.#scroller.scrollLeft);
      if (index === this.#active) return;
      this.#active = index;
      this.#paintCount();
    });
  }

  #down(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button:not(.link)')) return;
    this.#loop.stop();
    // Catching a moving rail keeps its virtual position, overshoot included.
    if (this.#mode !== 'spring') this.#pos = this.#scroller.scrollLeft;
    this.#mode = 'pressing';
    this.#pointerId = event.pointerId;
    this.#startX = event.clientX;
    this.#startPos = this.#pos;
    this.#samples = [{ t: event.timeStamp, x: event.clientX }];
  }

  #move(event) {
    if (event.pointerId !== this.#pointerId) return;
    const dx = event.clientX - this.#startX;
    if (this.#mode === 'pressing' && Math.abs(dx) > DRAG_THRESHOLD) {
      this.#mode = 'dragging';
      this.#scroller.setPointerCapture?.(event.pointerId);
      this.#scroller.toggleAttribute('data-dragging', true);
      this.#free(true);
    }
    if (this.#mode !== 'dragging') return;
    this.#pos = this.#startPos - dx;
    this.#apply(this.#pos);
    this.#samples.push({ t: event.timeStamp, x: event.clientX });
    while (this.#samples.length > 2 && event.timeStamp - this.#samples[0].t > 100) this.#samples.shift();
  }

  #release(event) {
    if (event.pointerId !== this.#pointerId) return;
    this.#pointerId = -1;
    if (this.#mode !== 'dragging') {
      // A press that never became a drag hands back to native snapping.
      this.#mode = 'idle';
      this.#free(false);
      return;
    }
    this.#scroller.removeAttribute('data-dragging');
    this.#suppressClick = true;
    setTimeout(() => (this.#suppressClick = false));
    const velocity = releaseVelocity(this.#samples, event.timeStamp);
    const projected = this.#pos + (velocity * DECELERATION) / (1 - DECELERATION);
    const points = this.#snapPoints;
    this.#springTo(points[nearestIndex(points, projected)], velocity * 1000);
  }

  // A drag that ends over a card must not follow its link.
  #swallow(event) {
    if (!this.#suppressClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this.#suppressClick = false;
  }

  #native() {
    if (this.#mode !== 'spring') return;
    this.#loop.stop();
    this.#mode = 'idle';
    this.#apply(clamp(this.#pos, 0, this.#maxScroll));
    this.#free(false);
  }

  // The arrow keys step one card; Home and End jump to the ends.
  #key(event) {
    if (event.target !== this.#scroller) return;
    const index = this.#currentIndex;
    const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: this.items.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    this.#goTo(next);
  }

  #click(event) {
    const card = event.target.closest('.card');
    if (!card) return;
    const item = this.items.find(({ id }) => id === card.dataset.id);
    if (event.target.closest('.heart')) {
      const favorite = !(this.favorites ?? []).includes(item.id);
      this.favorites = favorite ? [...(this.favorites ?? []), item.id] : this.favorites.filter((id) => id !== item.id);
      this.emit('favorite', { id: item.id, favorite });
    } else if (event.target.closest('button.link')) {
      this.emit('select', { item });
    }
  }
}
