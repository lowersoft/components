import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import * as lucide from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, springFeel } from '../../core/motion.js';
import styles from './gooey-dropdown.scss?inline';

let uid = 0;

const DEMO_ACTIONS = [
  { id: 'rename', label: 'Rename', icon: 'pencil', shortcut: 'R' },
  { id: 'duplicate', label: 'Duplicate', icon: 'copy', shortcut: 'D' },
  { id: 'move', label: 'Move to folder', icon: 'folderInput', shortcut: 'M' },
  { id: 'archive', label: 'Archive', icon: 'archive', shortcut: 'A' },
  { id: 'delete', label: 'Delete', icon: 'trash2', shortcut: '⌫', divider: true, destructive: true },
];

const STEP = 1 / 240;
const SHAPE = springFeel(0.4, 0.14);
// The menu pours a moment after the press and drains before the pill settles.
const DELAY = 70;

const iconMarkup = (icon) => {
  if (!icon) return '';
  if (String(icon).trim().startsWith('<svg')) return icon;
  return strokeIcon(lucide[icon] ?? lucide.circle, 17, 1.75);
};

/**
 * A capsule that pours a menu out of its underside, run together with it
 * by an SVG goo filter while they touch. Rows can carry an icon, a detail
 * line, a shortcut hint and a divider above, and destructive rows read in
 * red.
 *
 * It behaves as an ARIA menu: the arrow keys, Home and End move through
 * the rows, Enter or Space picks one, Escape or a press outside closes it
 * and focus returns to the capsule. While it is open a row's single-letter
 * shortcut picks it, and a row hinted ⌫ answers Backspace. Picking fires
 * `lw-select`. With reduced motion the menu appears without pouring. It
 * floats over the page, so keep it out of parents with `overflow: hidden`.
 *
 * Actions are `{ id, label, detail?, icon?, shortcut?, divider?,
 * destructive? }`; icons are Lucide names from `core/lucide.js` or `<svg>`.
 *
 * @attr {string} label - Text on the capsule
 * @attr {Array<object>} actions (JSON)
 * @attr {number} menu-width - In pixels
 * @attr {'start'|'center'|'end'} anchor - Which edge of the capsule the menu lines up with
 * @attr {number} gap - Space between the capsule and the menu, in pixels
 * @attr {number} viscosity - How far the blend spreads; 0 keeps hard edges
 * @attr {boolean} open
 * @attr {string} fill - The capsule and menu color; the theme's foreground by default
 * @attr {string} ink - Text color on them; the theme's background by default
 * @attr {string} danger - Text color of destructive rows
 * @fires lw-select - A row was picked; `detail: { action }`
 * @fires lw-toggle - The menu opened or closed; `detail: { open }`
 * @csspart trigger - The capsule
 * @csspart menu - The menu
 * @cssprop --lw-gooey-dropdown-fill - Same as `fill`
 * @cssprop --lw-gooey-dropdown-ink - Same as `ink`
 * @cssprop --lw-gooey-dropdown-danger - Same as `danger`
 */
export class LwGooeyDropdown extends LwElement {
  static styles = styles;
  static props = {
    label: { default: 'Actions' },
    actions: { type: Object, default: DEMO_ACTIONS },
    menuWidth: { type: Number, default: 240 },
    anchor: { default: 'start' },
    gap: { type: Number, default: 14 },
    viscosity: { type: Number, default: 7 },
    open: { type: Boolean, reflect: true },
    fill: {},
    ink: {},
    danger: {},
  };

  #id = `lw-gooey-dropdown-${++uid}`;
  // The menu blob now and where it heads: left, top, width, height.
  #now = { x: 0, y: 0, w: 30, h: 30 };
  #to = { ...this.#now };
  #speed = { x: 0, y: 0, w: 0, h: 0 };
  #timer = 0;
  #ready = false;
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#draw() });

  render() {
    const id = this.#id;
    return `<div class="root"><svg class="goo" aria-hidden="true" focusable="false"><defs><filter id="${id}-goo" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop" result="body"/><feDropShadow in="body" dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.2"/></filter></defs><g class="blobs" filter="url(#${id}-goo)"><rect class="pill"/><rect class="menu-blob"/></g></svg>
<button class="trigger" part="trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="${id}-menu"><span class="label"></span>${strokeIcon(lucide.chevronDown, 15, 2)}</button>
<div class="menu" part="menu" id="${id}-menu" role="menu" inert></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const trigger = this.query('.trigger');
    trigger.addEventListener('click', () => this.#setOpen(!this.open), options);
    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      this.#setOpen(true);
      requestAnimationFrame(() => this.#focus(event.key === 'ArrowUp' ? -1 : 0));
    }, options);
    const menu = this.query('.menu');
    menu.addEventListener('click', (event) => {
      const row = event.target.closest('.row');
      if (row) this.#pick(Number(row.dataset.index));
    }, options);
    menu.addEventListener('pointermove', (event) => {
      const row = event.target.closest('.row');
      if (row && this.shadowRoot.activeElement !== row) row.focus({ preventScroll: true });
    }, options);
    this.addEventListener('keydown', (event) => this.#key(event), options);
    document.addEventListener('pointerdown', (event) => {
      if (this.open && !event.composedPath().includes(this)) this.#setOpen(false, false);
    }, options);
    const sized = new ResizeObserver(() => this.#aim());
    sized.observe(trigger);
    sized.observe(menu);
    this.signal.addEventListener('abort', () => {
      sized.disconnect();
      clearTimeout(this.#timer);
      this.#loop.stop();
    });
  }

  updated(changed) {
    this.query('.label').textContent = this.label ?? '';
    this.style.setProperty('--_menu-width', `${Math.max(140, this.menuWidth || 240)}px`);
    for (const [prop, name] of [['fill', '--_fill'], ['ink', '--_ink'], ['danger', '--_danger']]) {
      if (this[prop]) this.style.setProperty(name, this[prop]);
      else this.style.removeProperty(name);
    }
    const blur = Math.max(0, this.viscosity ?? 7);
    this.query('feGaussianBlur').setAttribute('stdDeviation', String(blur));
    this.query('.blobs').setAttribute('filter', blur ? `url(#${this.#id}-goo)` : '');
    this.query('.blobs').toggleAttribute('data-plain', !blur);
    if (changed.has('actions')) this.#build();
    if (changed.has('open')) this.#toggled(this.#ready);
    if (changed.has('anchor') || changed.has('gap') || changed.has('menuWidth')) this.#aim();
    this.#ready = true;
  }

  get #rows() {
    return [...this.shadowRoot.querySelectorAll('.row')];
  }

  #build() {
    const actions = Array.isArray(this.actions) ? this.actions : [];
    this.query('.menu').innerHTML = actions
      .map((action, i) => `${action.divider && i ? '<hr class="divider" role="separator">' : ''}<div class="row" role="menuitem" tabindex="-1" data-index="${i}"${action.destructive ? ' data-destructive' : ''}${action.shortcut ? ` aria-keyshortcuts="${action.shortcut === '⌫' ? 'Backspace' : escapeHtml(action.shortcut)}"` : ''}><span class="row-icon">${iconMarkup(action.icon)}</span><span class="row-text"><span class="row-label">${escapeHtml(action.label ?? '')}</span>${action.detail ? `<span class="row-detail">${escapeHtml(action.detail)}</span>` : ''}</span>${action.shortcut ? `<kbd class="key" aria-hidden="true">${escapeHtml(action.shortcut)}</kbd>` : ''}</div>`)
      .join('');
    this.#aim();
  }

  #setOpen(open, returnFocus = true) {
    if (open === this.open) return;
    this.open = open;
    this.emit('toggle', { open });
    if (!open && returnFocus) this.query('.trigger').focus({ preventScroll: true });
  }

  #toggled(animate) {
    const open = this.open;
    this.query('.trigger').ariaExpanded = String(open);
    this.query('.menu').inert = !open;
    this.#aim(!animate);
  }

  #focus(index) {
    const rows = this.#rows;
    if (!rows.length) return;
    rows[(index + rows.length) % rows.length].focus({ preventScroll: true });
  }

  #key(event) {
    if (!this.open) return;
    const rows = this.#rows;
    const current = rows.indexOf(this.shadowRoot.activeElement);
    const moves = { ArrowDown: current + 1, ArrowUp: current < 0 ? -1 : current - 1, Home: 0, End: rows.length - 1 };
    if (event.key in moves) {
      event.preventDefault();
      this.#focus(moves[event.key]);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.#setOpen(false);
      return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && current >= 0) {
      event.preventDefault();
      this.#pick(Number(rows[current].dataset.index));
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    // A row's own key picks it while the menu is open.
    const actions = Array.isArray(this.actions) ? this.actions : [];
    const hit = actions.findIndex((action) => {
      const key = String(action.shortcut ?? '');
      return key === '⌫' ? event.key === 'Backspace' : key.length === 1 && key.toLowerCase() === event.key.toLowerCase();
    });
    if (hit >= 0) {
      event.preventDefault();
      this.#pick(hit);
    }
  }

  #pick(index) {
    const action = (Array.isArray(this.actions) ? this.actions : [])[index];
    if (!action) return;
    this.emit('select', { action });
    this.#setOpen(false);
  }

  // Where the menu heads: under the capsule on the anchored side, or
  // folded up into the capsule's middle.
  #aim(instant = false) {
    const trigger = this.query('.trigger');
    const tw = trigger.offsetWidth;
    const th = trigger.offsetHeight;
    const mw = Math.max(140, this.menuWidth || 240);
    const menu = this.query('.menu');
    const mh = menu.scrollHeight;
    const x = this.anchor === 'end' ? tw - mw : this.anchor === 'center' ? (tw - mw) / 2 : 0;
    menu.style.left = `${x}px`;
    menu.style.top = `${th + Math.max(0, this.gap ?? 14)}px`;
    const open = { x, y: th + Math.max(0, this.gap ?? 14), w: mw, h: mh };
    const shut = { x: tw / 2 - 18, y: th / 2 - 10, w: 36, h: 30 };
    clearTimeout(this.#timer);
    if (instant || reducedMotion.matches) {
      Object.assign(this.#to, this.open ? open : shut);
      Object.assign(this.#now, this.#to);
      this.#draw();
      return;
    }
    if (this.open && this.#now.h < 40) {
      this.#timer = setTimeout(() => {
        Object.assign(this.#to, open);
        this.#loop.wake();
      }, DELAY);
    } else Object.assign(this.#to, this.open ? open : shut);
    this.#loop.wake();
  }

  #step() {
    for (const key of Object.keys(this.#now)) {
      this.#speed[key] += ((this.#to[key] - this.#now[key]) * SHAPE.stiffness - this.#speed[key] * SHAPE.damping) * STEP;
      this.#now[key] += this.#speed[key] * STEP;
    }
  }

  #draw() {
    const n = this.#now;
    const trigger = this.query('.trigger');
    const tw = trigger.offsetWidth;
    const th = trigger.offsetHeight;
    if (!tw) return false;
    const mw = Math.max(140, this.menuWidth || 240);
    const menu = this.query('.menu');
    const mh = menu.scrollHeight || 1;
    const set = (el, attrs) => Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, (Math.round(v * 100) / 100).toString()));
    // The SVG spans from the capsule to wherever the menu can reach.
    const left = Math.min(0, tw - mw, (tw - mw) / 2) - 20;
    const right = Math.max(tw, mw) + 20;
    const bottom = th + (this.gap ?? 14) + mh + 40;
    const svg = this.query('.goo');
    svg.style.left = `${left}px`;
    svg.setAttribute('width', right - left);
    svg.setAttribute('height', bottom);
    svg.setAttribute('viewBox', `${left} 0 ${right - left} ${bottom}`);
    const pad = 40 + (this.viscosity ?? 7) * 3;
    set(this.query('filter'), { x: left - pad, y: -pad, width: right - left + pad * 2, height: bottom + pad * 2 });
    set(this.query('.pill'), { x: 0, y: 0, width: tw, height: th, rx: th / 2 });
    const w = Math.max(0, n.w);
    const h = Math.max(0, n.h);
    const r = Math.min(22, w / 2, h / 2);
    set(this.query('.menu-blob'), { x: n.x, y: n.y, width: w, height: h, rx: r });

    // Rows show once the menu is nearly poured, clipped to the blob.
    const top = th + (this.gap ?? 14);
    const mx = parseFloat(menu.style.left) || 0;
    const inset = [n.y - top, mx + mw - (n.x + w), top + mh - (n.y + h), n.x - mx].map((v) => `${Math.max(0, v).toFixed(1)}px`);
    menu.style.clipPath = `inset(${inset.join(' ')} round ${r}px)`;
    menu.style.opacity = String(Math.max(0, Math.min(1, (h / mh - (this.open ? 0.55 : 0.8)) / (this.open ? 0.45 : 0.2))));
    const moving = Object.keys(n).some((key) => Math.abs(this.#to[key] - n[key]) > 0.1 || Math.abs(this.#speed[key]) > 1);
    if (!moving) Object.assign(n, this.#to);
    return moving;
  }
}
