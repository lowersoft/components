import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import * as lucide from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion } from '../../core/motion.js';
import styles from './gooey-dock.scss?inline';

let uid = 0;

const DEMO_ITEMS = [
  { id: 'home', label: 'Home', icon: 'house' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: true },
  { id: 'library', label: 'Library', icon: 'library' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

const STEP = 1 / 240;
// The capsule's two edges spring apart: the one leading the way is quick,
// the trailing one lags, so the capsule stretches like liquid and snaps
// back together when it lands.
const LEAD = { k: 520, c: 40 };
const TRAIL = { k: 150, c: 23 };

const iconMarkup = (icon) => {
  if (!icon) return '';
  if (String(icon).trim().startsWith('<svg')) return icon;
  return strokeIcon(lucide[icon] ?? lucide.circle, 22, 1.75);
};

/**
 * An app dock: a solid pill of icons with a capsule that marks the chosen
 * one. Choosing another stretches the capsule toward it like liquid, its
 * leading edge racing ahead and the trailing edge catching up, run
 * together by an SVG goo filter; the icons it covers flip to the dock's
 * color as it passes. A faint capsule previews the item under the pointer.
 * Labels sit under the icons and hide on screens under 480 pixels wide.
 *
 * It is a tab list: the arrow keys choose the next item, Home and End the
 * first and last, and `lw-change` reports every choice. With reduced
 * motion the capsule moves without stretching.
 *
 * Items are `{ id, label, icon, badge? }`; `icon` is a Lucide name from
 * `core/lucide.js` or `<svg>` markup, and `badge` adds an unread dot.
 *
 * @attr {Array<object>} items (JSON)
 * @attr {string} value - The chosen item's id; the first by default
 * @attr {number} viscosity - How far the blend spreads while it stretches; 0 keeps hard edges
 * @attr {string} fill - The dock's color; the theme's foreground by default
 * @attr {string} ink - The icons' and capsule's color; the theme's background by default
 * @attr {string} label - Accessible name of the dock
 * @fires lw-change - Another item was chosen; `detail: { value, item }`
 * @csspart dock - The pill
 * @csspart item - Each item
 * @cssprop --lw-gooey-dock-fill - Same as `fill`
 * @cssprop --lw-gooey-dock-ink - Same as `ink`
 */
export class LwGooeyDock extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    value: { reflect: true },
    viscosity: { type: Number, default: 8 },
    fill: {},
    ink: {},
    label: { default: 'Dock' },
  };

  #id = `lw-gooey-dock-${++uid}`;
  // The capsule's left and right edges, where they head and how fast.
  #edges = { l: 0, r: 0 };
  #to = { l: 0, r: 0 };
  #speed = { l: 0, r: 0 };
  #rightward = true;
  #placed = false;
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#draw() });

  render() {
    const id = this.#id;
    return `<div class="dock" part="dock"><div class="track"><svg class="goo" aria-hidden="true" focusable="false"><defs><filter id="${id}-goo" x="-10%" y="-50%" width="120%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop"/></filter></defs><g class="blobs" filter="url(#${id}-goo)"><rect class="capsule"/></g></svg><span class="hover" aria-hidden="true"></span><div class="items" role="tablist"></div><div class="items flipped" aria-hidden="true"></div></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const items = this.query('.items');
    items.addEventListener('click', (event) => {
      const item = event.target.closest('.item');
      if (item) this.#choose(item.dataset.id);
    }, options);
    items.addEventListener('keydown', (event) => this.#key(event), options);
    items.addEventListener('pointerover', (event) => this.#hover(event.target.closest('.item')), options);
    items.addEventListener('pointerleave', () => this.#hover(null), options);
    const sized = new ResizeObserver(() => this.#aim(true));
    sized.observe(items);
    this.signal.addEventListener('abort', () => {
      sized.disconnect();
      this.#loop.stop();
    });
  }

  updated(changed) {
    this.query('.items').ariaLabel = this.label || 'Dock';
    for (const [prop, name] of [['fill', '--_fill'], ['ink', '--_ink']]) {
      if (this[prop]) this.style.setProperty(name, this[prop]);
      else this.style.removeProperty(name);
    }
    const blur = Math.max(0, this.viscosity ?? 8);
    this.query('feGaussianBlur').setAttribute('stdDeviation', String(blur));
    this.query('.blobs').setAttribute('filter', blur ? `url(#${this.#id}-goo)` : '');
    if (changed.has('items')) this.#build();
    this.#paint();
    if (changed.has('value') || changed.has('items')) this.#aim(!this.#placed);
  }

  get #value() {
    const items = Array.isArray(this.items) ? this.items : [];
    return items.some((item) => item.id === this.value) ? this.value : items[0]?.id;
  }

  // The same items twice: the real ones, and a copy in the dock's color
  // that only shows inside the capsule.
  #build() {
    const items = Array.isArray(this.items) ? this.items : [];
    const markup = (real) => items
      .map((item) => `<button class="item" part="${real ? 'item' : ''}" type="button" data-id="${escapeHtml(item.id)}"${real ? ` role="tab" aria-label="${escapeHtml(item.label ?? item.id)}"` : ' tabindex="-1"'}><span class="icon">${iconMarkup(item.icon)}${item.badge ? '<span class="badge"></span>' : ''}</span><span class="name">${escapeHtml(item.label ?? '')}</span></button>`)
      .join('');
    const [real, flipped] = this.shadowRoot.querySelectorAll('.items');
    real.innerHTML = markup(true);
    flipped.innerHTML = markup(false);
  }

  #paint() {
    const value = this.#value;
    for (const item of this.query('.items').querySelectorAll('.item')) {
      const chosen = item.dataset.id === value;
      item.ariaSelected = String(chosen);
      item.tabIndex = chosen ? 0 : -1;
    }
  }

  #choose(id) {
    if (id === this.#value) return;
    this.value = id;
    // The chosen item needs no preview.
    this.#hover(null);
    const item = (Array.isArray(this.items) ? this.items : []).find((each) => each.id === id);
    this.emit('change', { value: id, item });
  }

  #key(event) {
    const items = [...this.query('.items').querySelectorAll('.item')];
    const index = items.indexOf(event.target.closest('.item'));
    if (index < 0) return;
    const next = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const target = items[(next + items.length) % items.length];
    this.#choose(target.dataset.id);
    target.focus();
  }

  #hover(item) {
    const hover = this.query('.hover');
    if (!item || item.dataset.id === this.#value) {
      hover.classList.remove('visible');
      return;
    }
    const appearing = !hover.classList.contains('visible');
    if (appearing) hover.style.transition = 'none';
    hover.style.transform = `translateX(${item.offsetLeft}px)`;
    hover.style.width = `${item.offsetWidth}px`;
    if (appearing) {
      hover.getBoundingClientRect();
      hover.style.transition = '';
    }
    hover.classList.add('visible');
  }

  // Aims the capsule at the chosen item.
  #aim(instant) {
    const item = this.query(`.items .item[data-id="${CSS.escape(this.#value ?? '')}"]`);
    if (!item || !item.offsetWidth) return;
    const to = { l: item.offsetLeft, r: item.offsetLeft + item.offsetWidth };
    this.#rightward = to.l >= this.#to.l;
    this.#to = to;
    if (instant || reducedMotion.matches || !this.#placed) {
      this.#edges = { ...to };
      this.#speed = { l: 0, r: 0 };
      this.#placed = true;
      this.#draw();
      return;
    }
    this.#loop.wake();
  }

  #step() {
    // Moving right, the right edge leads; moving left, the left edge does.
    const feel = { l: this.#rightward ? TRAIL : LEAD, r: this.#rightward ? LEAD : TRAIL };
    for (const edge of ['l', 'r']) {
      const { k, c } = feel[edge];
      this.#speed[edge] += ((this.#to[edge] - this.#edges[edge]) * k - this.#speed[edge] * c) * STEP;
      this.#edges[edge] += this.#speed[edge] * STEP;
    }
  }

  #draw() {
    const track = this.query('.track');
    const width = track.offsetWidth;
    const height = track.offsetHeight;
    if (!width) return false;
    const { l, r } = this.#edges;
    const resting = this.#to.r - this.#to.l || 1;
    // Stretched, the capsule thins a little, as liquid would.
    const stretch = Math.max(0, (r - l) / resting - 1);
    const h = height * (1 - Math.min(0.14, stretch * 0.06));
    const y = (height - h) / 2;
    const svg = this.query('.goo');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    const capsule = this.query('.capsule');
    const set = (attrs) => Object.entries(attrs).forEach(([k, v]) => capsule.setAttribute(k, (Math.round(v * 100) / 100).toString()));
    set({ x: Math.min(l, r), y, width: Math.abs(r - l), height: h, rx: h / 2 });
    // The flipped icons show exactly where the capsule is.
    this.query('.flipped').style.clipPath = `inset(${y.toFixed(1)}px ${(width - Math.max(l, r)).toFixed(1)}px ${y.toFixed(1)}px ${Math.min(l, r).toFixed(1)}px round ${(h / 2).toFixed(1)}px)`;
    const moving = ['l', 'r'].some((edge) => Math.abs(this.#to[edge] - this.#edges[edge]) > 0.1 || Math.abs(this.#speed[edge]) > 1);
    if (!moving) this.#edges = { ...this.#to };
    return moving;
  }
}
