import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './dimensional-book-cover.scss?inline';

const DEMO_PAGES = [
  ['Chapter 01', 'Start with tokens', 'Name colors, type and space before any screen exists. A system that is decided once stops being argued on every page.'],
  ['Chapter 02', 'Surfaces and states', 'Every surface needs a resting, hovered, pressed and disabled look. Write them down together so none is left to chance.'],
  ['Chapter 03', 'Motion with a reason', 'Move things to explain where they came from and where they went. If an animation explains nothing, it is decoration.'],
];

// A leaf at rest on the left of the spread is lifted a little off the page.
const TURNED = -172;
const TURN = { duration: 820, easing: 'cubic-bezier(0.62, 0.02, 0.26, 1)' };

// Dark text on a light cover, light text on a dark one.
const inkFor = (hex) => {
  const value = /^#?([\da-f]{6})$/i.exec(hex ?? '')?.[1];
  if (!value) return '#fbf7f1';
  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(value.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6 ? '#1a1612' : '#fbf7f1';
};

/**
 * A book on the page, with real depth: a matte cover, a spine and a block
 * of page edges that shows when it tilts toward the pointer. A click
 * swings the cover open on its hinge; each click after that turns a page
 * over on a weighted flip that shades as it lifts and casts onto the page
 * beneath. After the last page it closes again.
 *
 * Pages are the element's children, one per page; without any, three demo
 * pages show. `slot="artwork"` fills the band on a banded cover and
 * `slot="mark"` sits at its foot. Enter or Space turns forward, the right
 * and left arrows (and Page Down, Page Up) turn either way and Escape
 * closes it. With reduced motion it changes pose without the swing.
 *
 * @attr {string} title - The cover's title
 * @attr {string} subtitle
 * @attr {'banded'|'solid'} variant - A colored band with artwork over a paper label, or one color all over
 * @attr {string} accent - The cover color; flat matte colors suit it best
 * @attr {string} text-color - The cover text color; dark or light to suit the cover by default
 * @attr {number} width - In pixels; the height follows the cover's shape
 * @attr {number} page - How many pages are turned; -1 is closed
 * @fires lw-change - The book opened, turned or closed; `detail: { page, open }`
 * @slot - Interior pages, one element each
 * @slot artwork - Art for the band on a banded cover
 * @slot mark - A logo or mark at the foot of the cover
 * @csspart book - The book
 * @csspart cover - The front of the cover
 * @csspart page - Each interior page
 * @cssprop --lw-dimensional-book-cover-paper - The paper color
 */
export class LwDimensionalBookCover extends LwElement {
  static styles = styles;
  static shadowOptions = { mode: 'open', slotAssignment: 'manual' };
  static props = {
    title: { default: 'Interface Field Guide' },
    subtitle: { default: 'Tokens, surfaces and the motion between them' },
    variant: { default: 'banded', reflect: true },
    accent: { default: '#c45a45' },
    textColor: {},
    width: { type: Number, default: 208 },
    page: { type: Number, default: -1, reflect: true },
  };

  #pages = [];
  #shown = -1;

  render() {
    return `<div class="stage"><div class="book" part="book" tabindex="0" role="group" aria-roledescription="book">
<div class="back-cover" aria-hidden="true"></div><div class="edge" aria-hidden="true"></div><div class="spine" aria-hidden="true"></div>
<div class="leaves"></div>
<div class="leaf cover-leaf"><div class="face front cover" part="cover"><div class="band"><div class="art"><slot name="artwork">${this.#artwork()}</slot></div></div><div class="label"><h3 class="title"></h3><p class="subtitle"></p></div><div class="mark"><slot name="mark"></slot></div><span class="grain" aria-hidden="true"></span><span class="hinge" aria-hidden="true"></span><span class="shade" aria-hidden="true"></span></div>
<div class="face back paper inside"><span class="inside-title"></span><span class="inside-subtitle"></span><span class="gutter" aria-hidden="true"></span><span class="shade" aria-hidden="true"></span></div></div>
</div></div><p class="live visually-hidden" aria-live="polite"></p>`;
  }

  // The default art: arcs rising from a corner, pressed into the band.
  #artwork() {
    const arcs = [0.34, 0.5, 0.66, 0.82, 0.98].map((r) => `<circle cx="0" cy="100" r="${r * 100}"/>`).join('');
    return `<svg class="default-art" viewBox="0 0 100 100" preserveAspectRatio="xMinYMax slice" aria-hidden="true">${arcs}<circle class="sun" cx="72" cy="28" r="9"/></svg>`;
  }

  connected() {
    const options = { signal: this.signal };
    const book = this.query('.book');
    book.addEventListener('click', () => this.#turn(1), options);
    book.addEventListener('keydown', (event) => this.#key(event), options);
    const children = new MutationObserver(() => this.#assign());
    children.observe(this, { childList: true, attributes: true, attributeFilter: ['slot'] });
    this.#assign();
    this.signal.addEventListener('abort', () => children.disconnect());
  }

  updated(changed) {
    this.query('.title').textContent = this.title ?? '';
    this.query('.subtitle').textContent = this.subtitle ?? '';
    this.query('.subtitle').hidden = !this.subtitle;
    this.query('.inside-title').textContent = this.title ?? '';
    this.query('.inside-subtitle').textContent = this.subtitle ?? '';
    const width = Math.max(120, this.width || 208);
    this.style.setProperty('--_w', `${width}px`);
    this.style.setProperty('--_accent', this.accent || '#c45a45');
    this.style.setProperty('--_ink', this.textColor || (this.variant === 'solid' ? inkFor(this.accent) : '#1a1612'));
    this.style.setProperty('--_band-ink', this.textColor || inkFor(this.accent));
    if (changed.has('page') && this.#clamp(this.page) !== this.#shown) this.#pose(this.#clamp(this.page), true);
  }

  get #count() {
    return this.#pages.length || DEMO_PAGES.length;
  }

  #clamp(page) {
    return Math.max(-1, Math.min(this.#count - 1, Math.round(page ?? -1)));
  }

  // Hands each child to its slot, and builds a leaf for every page.
  #assign() {
    const children = [...this.children];
    const named = (name) => children.filter((child) => child.getAttribute('slot') === name);
    this.shadowRoot.querySelector('slot[name="artwork"]').assign(...named('artwork'));
    this.shadowRoot.querySelector('slot[name="mark"]').assign(...named('mark'));
    this.#pages = children.filter((child) => !['artwork', 'mark'].includes(child.getAttribute('slot')));
    const count = this.#count;
    const leaves = this.query('.leaves');
    leaves.innerHTML = Array.from({ length: count }, (_, i) => {
      const demo = DEMO_PAGES[i];
      const body = this.#pages.length ? '<slot></slot>' : `<p class="kicker">${escapeHtml(demo[0])}</p><h4 class="heading">${escapeHtml(demo[1])}</h4><p class="text">${escapeHtml(demo[2])}</p>`;
      return `<div class="leaf page-leaf" data-index="${i}"><div class="face front paper" part="page"><div class="page-body">${body}</div><p class="folio">${i + 1} / ${count}</p><span class="gutter" aria-hidden="true"></span><span class="cast" aria-hidden="true"></span><span class="shade" aria-hidden="true"></span></div><div class="face back paper verso"><p class="folio">${i + 1}</p><span class="gutter" aria-hidden="true"></span><span class="shade" aria-hidden="true"></span></div></div>`;
    }).join('');
    leaves.querySelectorAll('slot').forEach((slot, i) => slot.assign(this.#pages[i]));
    this.#pose(this.#clamp(this.page), true);
  }

  #key(event) {
    const step = { Enter: 1, ' ': 1, ArrowRight: 1, PageDown: 1, ArrowLeft: -1, PageUp: -1 }[event.key];
    if (event.key === 'Escape' && this.#shown >= 0) {
      event.preventDefault();
      this.#go(-1);
      return;
    }
    if (!step) return;
    event.preventDefault();
    this.#turn(step);
  }

  // Forward from the last page closes the book; back from the first does too.
  #turn(step) {
    const last = this.#count - 1;
    const next = step > 0 ? (this.#shown >= last ? -1 : this.#shown + 1) : Math.max(-1, this.#shown - 1);
    this.#go(next);
  }

  #go(page) {
    if (page === this.#shown) return;
    this.#pose(page, false);
    this.page = page;
    const count = this.#count;
    this.query('.live').textContent = page < 0 ? `${this.title}, closed.` : `Page ${page + 1} of ${count}.`;
    this.emit('change', { page, open: page >= 0 });
  }

  // Sets every leaf for `page`: the cover open once the book is, and the
  // pages before `page` turned onto the left, the latest on top.
  #pose(page, instant) {
    const before = this.#shown;
    this.#shown = page;
    const open = page >= 0;
    this.toggleAttribute('data-open', open);
    const book = this.query('.book');
    const title = this.title || 'Book';
    book.ariaLabel = open ? `${title}, page ${page + 1} of ${this.#count}` : `${title}. Closed. Click to open.`;
    const still = instant || reducedMotion.matches;
    this.toggleAttribute('data-still', still);

    const cover = this.query('.cover-leaf');
    this.#place(cover, open ? TURNED : 0, open ? 0.4 : 3, still);
    cover.querySelector('.front').inert = open;
    cover.querySelector('.back').ariaHidden = String(!open);

    const leaves = [...this.shadowRoot.querySelectorAll('.page-leaf')];
    leaves.forEach((leaf, i) => {
      const turned = i < page;
      // Turned pages stack up on the left; the rest wait under the cover.
      const z = turned ? 0.8 + i * 0.4 : -(i + 1) * 0.4;
      this.#place(leaf, turned ? TURNED : 0, z, still);
      const showing = open && i === page;
      leaf.querySelector('.front').inert = !showing;
      leaf.querySelector('.front').ariaHidden = String(!showing);
    });
    if (still) return;

    // The leaf that swings shades as it lifts and casts onto the page it uncovers.
    const forward = page > before;
    const moving = forward ? (before < 0 ? cover : leaves[before]) : page < 0 ? cover : leaves[page];
    if (!moving) return;
    const lift = [{ opacity: 0 }, { opacity: 0.32, offset: 0.5 }, { opacity: 0 }];
    moving.querySelectorAll('.shade').forEach((shade) => shade.animate(lift, TURN));
    const beneath = forward ? leaves[page] : leaves[Math.max(0, page + 1)];
    beneath?.querySelector('.cast')?.animate([{ opacity: forward ? 0.3 : 0 }, { opacity: 0.18, offset: 0.5 }, { opacity: 0 }], TURN);
  }

  #place(leaf, angle, z, still) {
    leaf.style.transition = still ? 'none' : '';
    leaf.style.transform = `translateZ(${z}px) rotateY(${angle}deg)`;
    leaf.toggleAttribute('data-turned', angle !== 0);
  }
}
