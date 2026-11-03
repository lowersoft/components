import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import * as lucide from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, springFeel } from '../../core/motion.js';
import styles from './gooey-navigation-menu.scss?inline';

let uid = 0;

const DEMO_ITEMS = [
  { id: 'share', label: 'Share', icon: 'share2' },
  { id: 'like', label: 'Like', icon: 'heart' },
  { id: 'save', label: 'Save', icon: 'bookmark' },
  { id: 'reply', label: 'Reply', icon: 'messageCircle' },
  { id: 'send', label: 'Send', icon: 'send' },
];

// Which way the fan opens, as the angle at its middle (screen y points down).
const DIRECTIONS = { up: -90, down: 90, left: 180, right: 0 };
// Petals leave one after another and overshoot a little; they come home together.
const STAGGER = 0.045;
const OUT = springFeel(0.42, 0.32);
const HOME = springFeel(0.26, 0);
const STEP = 1 / 240;

const iconMarkup = (icon, size) => {
  if (!icon) return '';
  if (icon.trim().startsWith('<svg')) return icon;
  return strokeIcon(lucide[icon] ?? icon, size, 2);
};

/**
 * A round button that fans its items out along an arc. Each petal stretches
 * out of the button like molten metal, one after another, overshoots and
 * settles; closing drains them back in. An SVG goo filter runs the button
 * and petals together while they touch.
 *
 * Choosing a petal fires `lw-select` and closes the fan. Escape or a press
 * outside closes it too; while it is open the arrow keys move between the
 * petals. With reduced motion the petals appear in place. The host
 * reserves the square the open fan needs.
 *
 * Items are `{ id, label, icon }`; `icon` is the name of a Lucide icon in
 * `core/lucide.js` or `<svg>` markup.
 *
 * @attr {Array<object>} items (JSON) - Three to six suit it best
 * @attr {boolean} open
 * @attr {number} radius - Distance from the button's center to each petal's, in pixels
 * @attr {number} arc - The fan's spread, in degrees
 * @attr {'up'|'down'|'left'|'right'} direction - Which way the fan opens
 * @attr {number} size - The button's diameter, in pixels
 * @attr {number} child-size - Each petal's diameter, in pixels
 * @attr {string} fill - Color of the button and petals; the theme's foreground by default
 * @attr {string} ink - Color of the icons; the theme's background by default
 * @attr {string} label - Accessible name of the button
 * @fires lw-select - A petal was chosen; `detail: { id, item }`
 * @fires lw-toggle - The fan opened or closed; `detail: { open }`
 * @csspart trigger - The round button
 * @csspart item - Each petal
 * @cssprop --lw-gooey-navigation-menu-fill - Same as `fill`
 * @cssprop --lw-gooey-navigation-menu-ink - Same as `ink`
 */
export class LwGooeyNavigationMenu extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    open: { type: Boolean, reflect: true },
    radius: { type: Number, default: 96 },
    arc: { type: Number, default: 180 },
    direction: { default: 'up' },
    size: { type: Number, default: 60 },
    childSize: { type: Number, default: 44 },
    fill: {},
    ink: {},
    label: { default: 'Open menu' },
  };

  #id = `lw-gooey-menu-${++uid}`;
  // Each petal's progress out (0 home, 1 out) and its speed.
  #petals = [];
  #clock = 0;
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#draw() });

  render() {
    const id = this.#id;
    return `<div class="stage"><svg class="goo" aria-hidden="true" focusable="false"><defs><filter id="${id}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop"/></filter></defs><g class="blobs" filter="url(#${id})"><circle class="core"/></g></svg>
<button class="trigger" part="trigger" type="button" aria-haspopup="menu" aria-expanded="false">${strokeIcon(lucide.plus, 25, 2.4)}</button><div class="petals" role="menu" inert></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.trigger').addEventListener('click', (event) => {
      this.#toggle(!this.open);
      // Opened from the keyboard (a click with no pointer), focus goes to the first petal.
      if (this.open && event.detail === 0) requestAnimationFrame(() => this.shadowRoot.querySelector('.petal')?.focus());
    }, options);
    this.query('.petals').addEventListener('click', (event) => {
      const petal = event.target.closest('.petal');
      if (!petal) return;
      const index = Number(petal.dataset.index);
      this.emit('select', { id: this.items[index]?.id, item: this.items[index] });
      this.#toggle(false);
      this.query('.trigger').focus();
    }, options);
    this.addEventListener('keydown', (event) => this.#key(event), options);
    document.addEventListener('pointerdown', (event) => {
      if (this.open && !event.composedPath().includes(this)) this.#toggle(false);
    }, options);
    this.signal.addEventListener('abort', () => this.#loop.stop());
  }

  updated(changed) {
    const trigger = this.query('.trigger');
    trigger.ariaLabel = this.label || 'Open menu';
    trigger.ariaExpanded = String(this.open);
    const vars = { '--_size': `${Math.max(24, this.size)}px`, '--_child': `${Math.max(20, this.childSize)}px`, '--_stage': `${this.#extent * 2}px` };
    for (const [name, value] of Object.entries(vars)) this.style.setProperty(name, value);
    if (this.fill) this.style.setProperty('--_fill', this.fill);
    else this.style.removeProperty('--_fill');
    if (this.ink) this.style.setProperty('--_ink', this.ink);
    else this.style.removeProperty('--_ink');
    if (changed.has('items') || changed.has('childSize')) this.#build();
    const petals = this.query('.petals');
    petals.inert = !this.open;
    // Open, the petals are in the tab order after the button.
    petals.querySelectorAll('.petal').forEach((petal) => (petal.tabIndex = this.open ? 0 : -1));
    if (changed.has('open') || changed.has('items')) this.#aim(changed.has('items'));
    this.#draw();
  }

  // Half the square the open fan needs.
  get #extent() {
    return Math.ceil(Math.max(this.size / 2, this.radius + this.childSize / 2) + 14);
  }

  #build() {
    const items = this.items ?? [];
    const iconSize = Math.round(Math.max(20, this.childSize) * 0.44);
    this.query('.petals').innerHTML = items
      .map((item, i) => `<button class="petal" part="item" type="button" role="menuitem" tabindex="-1" data-index="${i}" aria-label="${escapeHtml(item.label ?? item.id)}" title="${escapeHtml(item.label ?? item.id)}">${iconMarkup(item.icon, iconSize)}</button>`)
      .join('');
    const blobs = this.query('.blobs');
    blobs.querySelectorAll('.petal-blob').forEach((blob) => blob.remove());
    blobs.insertAdjacentHTML('afterbegin', items.map(() => '<circle class="petal-blob"/>').join(''));
    this.#petals = items.map((_, i) => this.#petals[i] ?? { at: 0, speed: 0, delay: 0 });
  }

  // Where each petal heads, as an offset from the button's center.
  #spot(index) {
    const count = this.#petals.length;
    const arc = Math.min(360, Math.max(0, this.arc ?? 180));
    const middle = DIRECTIONS[this.direction] ?? DIRECTIONS.up;
    const slots = arc >= 360 ? count : Math.max(1, count - 1);
    const angle = count === 1 ? middle : middle - arc / 2 + (arc / slots) * index;
    const rad = (angle * Math.PI) / 180;
    return { x: Math.cos(rad) * this.radius, y: Math.sin(rad) * this.radius };
  }

  // Sets each petal off: out one after another, or home all at once.
  #aim(instant) {
    this.#clock = 0;
    this.#petals.forEach((petal, i) => {
      petal.delay = this.open ? i * STAGGER : 0;
      if (instant || reducedMotion.matches) {
        petal.at = this.open ? 1 : 0;
        petal.speed = 0;
      }
    });
    this.#loop.wake();
  }

  #toggle(open) {
    if (open === this.open) return;
    this.open = open;
    this.emit('toggle', { open });
  }

  #key(event) {
    if (event.key === 'Escape' && this.open) {
      event.stopPropagation();
      this.#toggle(false);
      this.query('.trigger').focus();
      return;
    }
    if (!this.open) return;
    const petals = [...this.shadowRoot.querySelectorAll('.petal')];
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const current = petals.indexOf(this.shadowRoot.activeElement);
    let next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = petals.length - 1;
    else next = current === -1 ? (step > 0 ? 0 : petals.length - 1) : (current + step + petals.length) % petals.length;
    petals[next]?.focus();
  }

  #step() {
    this.#clock += STEP;
    const goal = this.open ? 1 : 0;
    const feel = this.open ? OUT : HOME;
    for (const petal of this.#petals) {
      if (this.#clock < petal.delay) continue;
      petal.speed += ((goal - petal.at) * feel.stiffness - petal.speed * feel.damping) * STEP;
      petal.at += petal.speed * STEP;
    }
  }

  #draw() {
    const extent = this.#extent;
    const svg = this.query('.goo');
    svg.setAttribute('viewBox', `${-extent} ${-extent} ${extent * 2} ${extent * 2}`);
    svg.setAttribute('width', extent * 2);
    svg.setAttribute('height', extent * 2);
    const core = this.query('.core');
    core.setAttribute('r', String(Math.max(12, this.size) / 2));
    const child = Math.max(20, this.childSize) / 2;
    const blobs = this.shadowRoot.querySelectorAll('.petal-blob');
    const buttons = this.shadowRoot.querySelectorAll('.petal');
    let moving = false;
    this.#petals.forEach((petal, i) => {
      const { x, y } = this.#spot(i);
      const at = petal.at;
      // A petal swells as it leaves the button and is full size once clear;
      // going home it shrinks all the way, so the petals do not pool.
      const grow = this.open ? Math.min(1, Math.max(0, at) * 1.6) : Math.max(0, Math.min(1, at));
      const px = x * at;
      const py = y * at;
      blobs[i]?.setAttribute('cx', px.toFixed(2));
      blobs[i]?.setAttribute('cy', py.toFixed(2));
      blobs[i]?.setAttribute('r', (child * (0.35 + 0.65 * grow)).toFixed(2));
      const button = buttons[i];
      if (button) {
        button.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px) scale(${(0.4 + 0.6 * grow).toFixed(3)})`;
        button.style.opacity = String(Math.min(1, Math.max(0, (at - 0.35) / 0.4)));
      }
      const goal = this.open ? 1 : 0;
      if (Math.abs(goal - at) > 0.001 || Math.abs(petal.speed) > 0.01) moving = true;
      else {
        petal.at = goal;
        petal.speed = 0;
      }
    });
    return moving;
  }
}
