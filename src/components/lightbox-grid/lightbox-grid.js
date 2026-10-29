import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronLeft, chevronRight, x as close } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo } from '../../core/motion.js';
import styles from './lightbox-grid.scss?inline';

const unsplash = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

const DEMO_IMAGES = [
  { src: unsplash('1501785888041-af3ef285b470', 1600, 1067), alt: 'A lake below mountains', width: 1600, height: 1067, caption: 'Lake shore, early morning' },
  { src: unsplash('1506905925346-21bda4d32df4', 1200, 1600), alt: 'Peaks above the clouds', width: 1200, height: 1600, caption: 'Above the cloud line' },
  { src: unsplash('1470071459604-3b5ec3a7fe05', 1600, 1067), alt: 'Misty hills', width: 1600, height: 1067, caption: 'Fog over the hills' },
  { src: unsplash('1441974231531-c6227db76b6e', 1200, 1600), alt: 'Light through a forest', width: 1200, height: 1600, caption: 'Forest, late afternoon' },
  { src: unsplash('1469474968028-56623f02e42e', 1600, 1067), alt: 'Sun setting over a valley', width: 1600, height: 1067, caption: 'Valley at sunset' },
  { src: unsplash('1433086966358-54859d0ed716', 1200, 1600), alt: 'A waterfall', width: 1200, height: 1600, caption: 'Waterfall after rain' },
];

const OPEN = springFeel(0.5, 0.12);
const CLOSE = springFeel(0.42, 0.08);
const SETTLE = springFeel(0.35, 0.2);
// The open image keeps this much room around it, and below for the caption.
const MARGIN = 48;
const MARGIN_SMALL = 12;
const CAPTION_ROOM = 56;
const OPEN_RADIUS = 10;
// Drag thresholds: distance in px, speed in px/ms.
const DISMISS_DISTANCE = 110;
const DISMISS_SPEED = 0.55;
const SWIPE_SPEED = 0.45;
const AXIS_LOCK = 6;
const REST = { x: 0, y: 0, scale: 1, ix: 0, iy: 0, radius: OPEN_RADIUS };

// Where an image of this size sits when open, fitted to the window.
const fitRect = (image) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = vw < 640 ? MARGIN_SMALL : MARGIN;
  const scale = Math.min((vw - margin * 2) / image.width, (vh - margin * 2 - CAPTION_ROOM) / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  return { left: (vw - width) / 2, top: (vh - CAPTION_ROOM - height) / 2, width, height };
};

// The transform and crop that make the open image look exactly like its
// thumbnail: scaled to the thumbnail's cover size, moved onto it and
// cropped to its box. Animating from here to rest is the whole trick.
const thumbFrame = (open, thumb, image, radius) => {
  const imageRatio = image.width / image.height;
  const coverWidth = imageRatio > thumb.width / thumb.height ? thumb.height * imageRatio : thumb.width;
  const scale = coverWidth / open.width;
  return {
    x: thumb.left + thumb.width / 2 - (open.left + open.width / 2),
    y: thumb.top + thumb.height / 2 - (open.top + open.height / 2),
    scale,
    ix: (open.width - thumb.width / scale) / 2,
    iy: (open.height - thumb.height / scale) / 2,
    radius: radius / scale,
  };
};

const onScreen = (rect) => rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;

/**
 * A photo grid whose thumbnails grow into a full view. The open photo is
 * the same element at every moment: a transform and a crop take it from its
 * slot to the middle of the screen and back, wherever it was dragged to.
 * Swipe sideways (or use the arrows) for the next photo, and pull it away
 * or press Escape to close.
 *
 * Images are `{ src, alt, width, height, caption? }`, with their natural
 * size so the open view fits before they load.
 *
 * @attr {Array<object>} images - The photos (JSON)
 * @fires lw-open - A photo opened; `detail: { index }`
 * @fires lw-close - The viewer closed
 */
export class LwLightboxGrid extends LwElement {
  static styles = styles;
  static props = {
    images: { type: Object, default: DEMO_IMAGES },
  };

  #active = null;
  #rect = null;
  #settled = false;
  #closing = false;
  #frame = { ...REST, alpha: 1, fade: 0 };
  #stop = null;
  #drag = null;
  #overflow = '';

  render() {
    return `<ul class="grid"></ul>
<div class="viewer" role="dialog" aria-modal="true" hidden>
  <div class="backdrop"></div>
  <div class="photo"><img alt="" draggable="false"></div>
  <div class="chrome"><div class="corner"><span class="count"></span><button class="close" type="button" aria-label="Close">${strokeIcon(close)}</button></div><button class="prev" type="button" aria-label="Previous photo">${strokeIcon(chevronLeft)}</button><button class="next" type="button" aria-label="Next photo">${strokeIcon(chevronRight)}</button><p class="caption"></p></div>
</div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.grid').addEventListener('click', (event) => {
      const thumb = event.target.closest('.thumb');
      if (thumb) this.#open(Number(thumb.dataset.index));
    }, options);
    const viewer = this.query('.viewer');
    viewer.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.backdrop').addEventListener('click', () => this.#close(), options);
    this.query('.close').addEventListener('click', () => this.#close(), options);
    this.query('.prev').addEventListener('click', () => this.#step(-1), options);
    this.query('.next').addEventListener('click', () => this.#step(1), options);
    const photo = this.query('.photo');
    photo.addEventListener('pointerdown', (event) => this.#down(event), options);
    photo.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) photo.addEventListener(type, (event) => this.#up(event), options);
    window.addEventListener('resize', () => this.#active !== null && this.#fit(), options);
    this.signal.addEventListener('abort', () => {
      this.#stop?.();
      if (this.#active !== null) document.documentElement.style.overflow = this.#overflow;
    });
  }

  updated(changed) {
    if (changed.has('images')) {
      this.query('.grid').innerHTML = this.images
        .map((image, i) => `<li><button class="thumb" type="button" data-index="${i}" aria-label="Open ${escapeHtml(image.alt)}"><img src="${escapeHtml(image.src)}" alt="" loading="lazy" draggable="false"></button></li>`)
        .join('');
    }
  }

  get #thumbs() {
    return [...this.shadowRoot.querySelectorAll('.thumb')];
  }

  // ---- Drawing ----

  #draw() {
    const f = this.#frame;
    const photo = this.query('.photo');
    photo.style.transform = `translate(${f.x}px, ${f.y}px) scale(${f.scale})`;
    photo.style.clipPath = `inset(${f.iy}px ${f.ix}px ${f.iy}px ${f.ix}px round ${f.radius}px)`;
    photo.style.opacity = String(f.alpha);
    this.query('.backdrop').style.opacity = String(f.fade * 0.92);
    this.query('.chrome').style.opacity = String(f.fade);
  }

  // Springs every value of the frame to `to` together.
  #animate(to, feel) {
    this.#stop?.();
    const from = { ...this.#frame };
    return new Promise((resolve) => {
      this.#stop = springTo(0, 1, {
        ...feel,
        restDelta: 0.001,
        update: (t) => {
          for (const key of Object.keys(to)) this.#frame[key] = from[key] + (to[key] - from[key]) * t;
          this.#draw();
        },
        done: () => {
          this.#stop = null;
          resolve();
        },
      });
    });
  }

  #fade(to, ms) {
    const from = { ...this.#frame };
    const start = performance.now();
    return new Promise((resolve) => {
      const frame = (now) => {
        const t = Math.min(1, (now - start) / ms);
        const eased = 1 - (1 - t) ** 3;
        for (const key of Object.keys(to)) this.#frame[key] = from[key] + (to[key] - from[key]) * eased;
        this.#draw();
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  #fit() {
    const image = this.images[this.#active];
    this.#rect = fitRect(image);
    const photo = this.query('.photo');
    Object.assign(photo.style, { left: `${this.#rect.left}px`, top: `${this.#rect.top}px`, width: `${this.#rect.width}px`, height: `${this.#rect.height}px` });
    const caption = this.query('.caption');
    caption.textContent = image.caption ?? '';
    caption.style.top = `${this.#rect.top + this.#rect.height + 18}px`;
  }

  // The frame that puts the open photo over its thumbnail, if it is on screen.
  #frameFor(index) {
    const thumb = this.#thumbs[index];
    const box = thumb?.getBoundingClientRect();
    if (!box || !onScreen(box)) return null;
    return thumbFrame(this.#rect, box, this.images[index], Number.parseFloat(getComputedStyle(thumb).borderTopLeftRadius) || 0);
  }

  #show(index) {
    const image = this.images[index];
    this.#active = index;
    this.#fit();
    const img = this.query('.photo img');
    img.src = image.src;
    img.alt = image.alt;
    const viewer = this.query('.viewer');
    viewer.ariaLabel = image.caption ?? image.alt;
    this.query('.count').textContent = `${index + 1} / ${this.images.length}`;
    this.query('.prev').disabled = index === 0;
    this.query('.next').disabled = index === this.images.length - 1;
    // The open photo has left its slot; the slot stays empty until it returns.
    this.#thumbs.forEach((thumb, i) => thumb.classList.toggle('away', i === index));
  }

  // ---- Opening and closing ----

  async #open(index) {
    this.#overflow = document.documentElement.style.overflow;
    // The page behind the viewer stays put.
    document.documentElement.style.overflow = 'hidden';
    this.#closing = false;
    this.#settled = false;
    this.query('.viewer').hidden = false;
    this.#show(index);
    this.query('.close').focus({ preventScroll: true });
    this.emit('open', { index });
    const from = this.#frameFor(index);
    if (!from || reducedMotion.matches) {
      this.#frame = { ...REST, alpha: 0, fade: 0 };
      await this.#fade({ alpha: 1, fade: 1 }, 180);
    } else {
      this.#frame = { ...from, alpha: 1, fade: 0 };
      this.#draw();
      this.#fade({ fade: 1 }, 300);
      await this.#animate(REST, OPEN);
    }
    this.#settled = true;
  }

  async #close() {
    if (this.#active === null || this.#closing) return;
    this.#closing = true;
    const index = this.#active;
    // At once, so the slot is measured where it will be.
    this.#thumbs[index]?.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
    const to = this.#frameFor(index);
    if (!to || reducedMotion.matches) {
      await this.#fade({ alpha: 0, fade: 0 }, 160);
    } else {
      this.#fade({ fade: 0 }, 280);
      await this.#animate(to, CLOSE);
    }
    this.query('.viewer').hidden = true;
    this.#thumbs[index]?.classList.remove('away');
    this.#active = null;
    this.#closing = false;
    document.documentElement.style.overflow = this.#overflow;
    this.#thumbs[index]?.focus({ preventScroll: true });
    this.emit('close');
  }

  // The next photo slides in from the side it was swiped from.
  #step(direction) {
    const next = (this.#active ?? 0) + direction;
    if (this.#active === null || next < 0 || next >= this.images.length) return;
    this.#show(next);
    this.#stop?.();
    if (reducedMotion.matches) {
      this.#frame = { ...REST, alpha: 1, fade: 1 };
      this.#draw();
      return;
    }
    this.#frame = { ...REST, x: direction * 72, alpha: 0, fade: 1 };
    this.#fade({ x: 0, alpha: 1 }, 300);
  }

  // ---- Dragging the open photo ----

  #down(event) {
    if (!this.#settled || this.#closing || event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    this.#stop?.();
    this.#drag = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: null, samples: [{ x: event.clientX, y: event.clientY, t: event.timeStamp }] };
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.axis) {
      if (Math.hypot(dx, dy) < AXIS_LOCK) return;
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    drag.samples.push({ x: event.clientX, y: event.clientY, t: event.timeStamp });
    if (drag.samples.length > 5) drag.samples.shift();
    if (drag.axis === 'y') {
      // Pulling away shrinks the photo and lets the page show through.
      const pull = Math.min(Math.abs(dy) / window.innerHeight, 1);
      Object.assign(this.#frame, { x: dx, y: dy, scale: 1 - pull * 0.45, fade: 1 - Math.min(Math.abs(dy) / 360, 1) * 0.85 });
    } else {
      // Past the first or last photo the drag only gives a little.
      const blocked = (dx > 0 && this.#active === 0) || (dx < 0 && this.#active === this.images.length - 1);
      this.#frame.x = blocked ? dx * 0.25 : dx;
    }
    this.#draw();
  }

  #up(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    const first = drag.samples[0];
    const last = drag.samples.at(-1);
    const dt = Math.max(1, last.t - first.t);
    const vx = (last.x - first.x) / dt;
    const vy = (last.y - first.y) / dt;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (drag.axis === 'y') {
      if (Math.abs(dy) > DISMISS_DISTANCE || Math.abs(vy) > DISMISS_SPEED) this.#close();
      else this.#animate({ x: 0, y: 0, scale: 1, fade: 1 }, SETTLE);
    } else if (drag.axis === 'x') {
      const far = Math.abs(dx) > this.#rect.width * 0.22 || Math.abs(vx) > SWIPE_SPEED;
      if (far && dx < 0 && this.#active < this.images.length - 1) this.#step(1);
      else if (far && dx > 0 && this.#active > 0) this.#step(-1);
      else this.#animate({ x: 0 }, SETTLE);
    }
  }

  #key(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#close();
    } else if (event.key === 'ArrowRight') {
      this.#step(1);
    } else if (event.key === 'ArrowLeft') {
      this.#step(-1);
    } else if (event.key === 'Tab') {
      // Focus stays inside the viewer.
      const focusable = [...this.query('.viewer').querySelectorAll('button:not(:disabled)')];
      const active = this.shadowRoot.activeElement;
      if (event.shiftKey && active === focusable[0]) {
        event.preventDefault();
        focusable.at(-1).focus();
      } else if (!event.shiftKey && active === focusable.at(-1)) {
        event.preventDefault();
        focusable[0].focus();
      }
    }
  }
}
