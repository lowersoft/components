import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import * as lucide from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, springFeel } from '../../core/motion.js';
import { DEMO_ITEMS, demoPanel } from './panels.js';
import styles from './gooey-toolbar.scss?inline';

let uid = 0;

// The panel floats this far above the pill once it has poured out.
const GAP = 12;
// Collapsed, the panel is a sliver this wide sunk into the pill under its icon.
const SLIVER = 18;
const RADIUS = 18;
const NECK_WIDTH = 16;
// How long the neck stays stretched across after a switch, in ms.
const NECK_HOLD = 260;
const STEP = 1 / 240;
const SHAPE = springFeel(0.42, 0.12);
// The neck follows the new icon a little quicker than the panel reshapes.
const NECK = springFeel(0.3, 0.1);
const SHAPE_KEYS = ['cx', 'w', 'h', 'bottom'];
const NECK_KEYS = ['nx', 'neck'];
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

const iconMarkup = (icon) => {
  if (!icon) return '';
  if (icon.trim().startsWith('<svg')) return icon;
  return strokeIcon(lucide[icon] ?? icon, 20, 1.75);
};

/**
 * A pill of tools that share one liquid panel. Choosing a tool pours the
 * panel out of its icon; choosing another while it is open stretches a neck
 * across to the new icon as the panel reshapes to the new content; choosing
 * the open tool again, Escape or a press outside drains it back into the
 * pill. The blend comes from an SVG goo filter over the shapes, so the
 * panel, the neck and the pill run together like one drop.
 *
 * Each tool's panel goes in the slot named after its id; tools without one
 * show the built-in demo panel. Panels size themselves, so give each its
 * own width. The arrow keys move between tools, and choose as they go
 * while the panel is open.
 *
 * Items are `{ id, label, icon, badge? }`; `icon` is the name of a Lucide
 * icon in `core/lucide.js` (e.g. `plus`) or `<svg>` markup, and `badge`
 * adds an unread dot.
 *
 * ```html
 * <lw-gooey-toolbar value="notes" open items='[{"id":"notes","label":"Notes","icon":"notebookPen"}]'>
 *   <div slot="notes" style="width: 16rem; padding: 1rem">Your notes</div>
 * </lw-gooey-toolbar>
 * ```
 *
 * @attr {Array<object>} items (JSON)
 * @attr {string} value - The chosen tool's id; the first by default
 * @attr {boolean} open - The panel is out
 * @attr {number} viscosity - How far the blend spreads; 0 keeps hard edges
 * @attr {string} fill - Color of the pill and the panel; a surface of the page's own scheme by default, white in a light theme and a step lighter than the page in a dark one
 * @attr {string} ink - Color of the icons and panel text; the theme's text colour by default
 * @attr {string} label - Accessible name of the toolbar
 * @fires lw-change - A tool was chosen; `detail: { value }`
 * @fires lw-toggle - The panel opened or closed; `detail: { open }`
 * @slot <id> - The panel of the tool with that id
 * @csspart toolbar - The pill of tools
 * @csspart tool - Each tool button
 * @csspart panel - Each panel's frame
 * @cssprop --lw-gooey-toolbar-fill - Same as `fill`
 * @cssprop --lw-gooey-toolbar-ink - Same as `ink`
 */
export class LwGooeyToolbar extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    value: { reflect: true },
    open: { type: Boolean, reflect: true },
    viscosity: { type: Number, default: 7 },
    fill: {},
    ink: {},
    label: { default: 'Tools' },
  };

  #id = `lw-goo-${++uid}`;
  // Where the shapes are and where they are heading, in the pill's
  // coordinates: the panel's center, size and bottom edge, the neck's
  // center and strength.
  #now = { cx: 0, w: SLIVER, h: 0, bottom: 0, nx: 0, neck: 0 };
  #to = { ...this.#now };
  #speed = Object.fromEntries(Object.keys(this.#now).map((key) => [key, 0]));
  #shown = null;
  #neckTimer = 0;
  #sized = null;
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#draw() });

  render() {
    const id = this.#id;
    return `<svg class="goo" aria-hidden="true" focusable="false"><defs><filter id="${id}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop" result="body"/><feDropShadow in="body" dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.18"/></filter></defs><g class="shapes" filter="url(#${id})"><rect class="pill"/><rect class="neck"/><rect class="panel-shape"/></g></svg>
<div class="toolbar" part="toolbar" role="toolbar"></div><div class="panels"></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const toolbar = this.query('.toolbar');
    toolbar.addEventListener('click', (event) => {
      const tool = event.target.closest('.tool');
      if (tool) this.#choose(tool.dataset.id, true);
    }, options);
    toolbar.addEventListener('keydown', (event) => this.#key(event), options);
    this.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !this.open) return;
      event.stopPropagation();
      this.#setOpen(false);
      this.#tool(this.#value)?.focus();
    }, options);
    // A press anywhere else drains the panel.
    document.addEventListener('pointerdown', (event) => {
      if (this.open && !event.composedPath().includes(this)) this.#setOpen(false);
    }, options);
    const sized = new ResizeObserver(() => this.#retarget());
    sized.observe(toolbar);
    this.query('.panels').querySelectorAll('.panel').forEach((panel) => sized.observe(panel));
    this.#sized = sized;
    this.signal.addEventListener('abort', () => {
      sized.disconnect();
      this.#loop.stop();
      clearTimeout(this.#neckTimer);
    });
  }

  updated(changed) {
    this.query('.toolbar').ariaLabel = this.label || 'Tools';
    if (this.fill) this.style.setProperty('--_fill', this.fill);
    else this.style.removeProperty('--_fill');
    if (this.ink) this.style.setProperty('--_ink', this.ink);
    else this.style.removeProperty('--_ink');
    const blur = Math.max(0, this.viscosity ?? 0);
    this.query('feGaussianBlur').setAttribute('stdDeviation', String(blur));
    this.query('.shapes').toggleAttribute('data-plain', blur === 0);

    if (changed.has('items')) this.#build();
    this.#paintTools();
    if (changed.has('items') || changed.has('value') || changed.has('open')) this.#show(changed.has('items'));
  }

  get #value() {
    const items = this.items ?? [];
    return items.some((item) => item.id === this.value) ? this.value : items[0]?.id;
  }

  #tool(id) {
    return this.shadowRoot.querySelector(`.tool[data-id="${CSS.escape(id ?? '')}"]`);
  }

  #panel(id) {
    return this.shadowRoot.querySelector(`.panel[data-id="${CSS.escape(id ?? '')}"]`);
  }

  #build() {
    const items = this.items ?? [];
    const id = this.#id;
    this.query('.toolbar').innerHTML = items
      .map((item, i) => {
        const key = escapeHtml(item.id);
        return `<button class="tool" part="tool" type="button" data-id="${key}" aria-label="${escapeHtml(item.label ?? item.id)}" aria-controls="${id}-panel-${i}" aria-expanded="false" title="${escapeHtml(item.label ?? item.id)}">${iconMarkup(item.icon)}${item.badge ? '<span class="badge" aria-hidden="true"></span>' : ''}</button>`;
      })
      .join('');
    this.query('.panels').innerHTML = items
      .map((item, i) => `<section class="panel" part="panel" id="${id}-panel-${i}" data-id="${escapeHtml(item.id)}" role="group" aria-label="${escapeHtml(item.label ?? item.id)}" inert><slot name="${escapeHtml(item.id)}">${demoPanel(item.id)}</slot></section>`)
      .join('');
    this.#shown = null;
    if (this.#sized) this.query('.panels').querySelectorAll('.panel').forEach((panel) => this.#sized.observe(panel));
  }

  #paintTools() {
    const value = this.#value;
    for (const tool of this.shadowRoot.querySelectorAll('.tool')) {
      const chosen = tool.dataset.id === value;
      tool.toggleAttribute('data-chosen', chosen);
      tool.ariaExpanded = String(chosen && this.open);
      tool.tabIndex = chosen ? 0 : -1;
    }
  }

  // A tool was pressed: the open one closes, any other opens on its panel.
  #choose(id, toggle) {
    if (toggle && id === this.#value && this.open) {
      this.#setOpen(false);
      return;
    }
    if (id !== this.#value) {
      this.value = id;
      this.emit('change', { value: id });
    }
    if (!this.open) this.#setOpen(true);
  }

  #setOpen(open) {
    if (open === this.open) return;
    this.open = open;
    this.emit('toggle', { open });
  }

  #key(event) {
    const tools = [...this.shadowRoot.querySelectorAll('.tool')];
    const index = tools.indexOf(event.target.closest('.tool'));
    if (index === -1) return;
    const next = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: tools.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const tool = tools[(next + tools.length) % tools.length];
    // Open, moving chooses; closed, it only moves focus.
    if (this.open) this.#choose(tool.dataset.id, false);
    else for (const each of tools) each.tabIndex = each === tool ? 0 : -1;
    tool.focus();
  }

  // Where each shape rests for the current state, in the pill's coordinates.
  #rest(id = this.#value) {
    const toolbar = this.query('.toolbar');
    const tool = this.#tool(id);
    const panel = this.#panel(id);
    const iconX = tool ? tool.offsetLeft + tool.offsetWidth / 2 : toolbar.offsetWidth / 2;
    const sunk = toolbar.offsetHeight / 2;
    if (!this.open || !panel) return { cx: iconX, w: SLIVER, h: 0, bottom: sunk, nx: iconX };
    return { cx: toolbar.offsetWidth / 2, w: panel.offsetWidth, h: panel.offsetHeight, bottom: -GAP, nx: iconX };
  }

  // The state changed: pour, switch or drain.
  #show(rebuilt) {
    const value = this.#value;
    const target = this.open ? value : null;
    const before = this.#shown;
    if (target === before && !rebuilt) return;
    this.#shown = target;

    for (const panel of this.shadowRoot.querySelectorAll('.panel')) {
      const active = panel.dataset.id === target;
      panel.inert = !active;
      panel.toggleAttribute('data-active', active);
    }

    const rest = this.#rest(value);
    if (reducedMotion.matches || rebuilt || !this.isConnected) {
      Object.assign(this.#now, rest, { neck: 0 });
      Object.assign(this.#to, rest, { neck: 0 });
      this.#fade(target, before, false);
      this.#draw();
      return;
    }

    if (target && !before) {
      // Pour: start as a sliver sunk in the pill under the icon.
      Object.assign(this.#now, { cx: rest.nx, w: SLIVER, h: 0, bottom: this.query('.toolbar').offsetHeight / 2, nx: rest.nx });
    } else if (target && before) {
      // Switch: a neck stretches from the old icon across to the new one.
      this.#to.neck = 1;
      clearTimeout(this.#neckTimer);
      this.#neckTimer = setTimeout(() => {
        this.#to.neck = 0;
        this.#loop.wake();
      }, NECK_HOLD);
    }
    Object.assign(this.#to, rest, target && before ? {} : { neck: 0 });
    this.#fade(target, before, true);
    this.#loop.wake();
  }

  // Panel content shows once the liquid is mostly out, and goes first.
  #fade(target, before, animate) {
    const incoming = this.#panel(target);
    const outgoing = before && before !== target ? this.#panel(before) : null;
    if (!animate) {
      for (const panel of this.shadowRoot.querySelectorAll('.panel')) panel.getAnimations().forEach((animation) => animation.cancel());
      return;
    }
    outgoing?.animate({ opacity: [1, 0] }, { duration: 90, easing: 'ease-out', fill: 'backwards' });
    incoming?.animate({ opacity: [0, 1], transform: ['translateY(6px)', 'none'] }, { duration: 240, delay: before ? 70 : 110, easing: EASE_OUT, fill: 'backwards' });
  }

  // The pill or a panel resized: aim for the new rest.
  #retarget() {
    Object.assign(this.#to, this.#rest(), { neck: this.#to.neck });
    if (reducedMotion.matches) Object.assign(this.#now, this.#to);
    this.#loop.wake();
    this.#draw();
  }

  #step() {
    for (const key of Object.keys(this.#now)) {
      const { stiffness, damping } = NECK_KEYS.includes(key) ? NECK : SHAPE;
      this.#speed[key] += ((this.#to[key] - this.#now[key]) * stiffness - this.#speed[key] * damping) * STEP;
      this.#now[key] += this.#speed[key] * STEP;
    }
  }

  // Lays the shapes out; returns false once everything is at rest.
  #draw() {
    const toolbar = this.query('.toolbar');
    const width = toolbar.offsetWidth;
    const height = toolbar.offsetHeight;
    if (!width) return false;
    const now = this.#now;
    const moving = Object.keys(now).some((key) => Math.abs(this.#to[key] - now[key]) > (key === 'neck' ? 0.002 : 0.1) || Math.abs(this.#speed[key]) > (key === 'neck' ? 0.01 : 1));
    if (!moving) {
      Object.assign(now, this.#to);
      for (const key of Object.keys(this.#speed)) this.#speed[key] = 0;
    }

    const svg = this.query('.goo');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    const set = (el, attrs) => Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, String(Math.round(value * 100) / 100)));
    set(this.query('.pill'), { x: 0, y: 0, width, height, rx: height / 2 });

    const w = Math.max(0, now.w);
    const h = Math.max(0, now.h);
    set(this.query('.panel-shape'), { x: now.cx - w / 2, y: now.bottom - h, width: w, height: h, rx: Math.min(RADIUS, w / 2, h / 2) });

    // The neck runs from inside the pill up into the panel's bottom edge.
    const neck = Math.max(0, Math.min(1, now.neck));
    const top = now.bottom - Math.min(h, 12);
    set(this.query('.neck'), { x: now.nx - (NECK_WIDTH * neck) / 2, y: top, width: NECK_WIDTH * neck, height: Math.max(0, height / 2 - top) * Math.min(1, neck * 4), rx: (NECK_WIDTH * neck) / 2 });

    // Panel content never shows outside the liquid: each panel is clipped
    // to where the shape is now, measured from where the panel sits.
    const x0 = now.cx - w / 2;
    const y0 = now.bottom - h;
    for (const panel of this.shadowRoot.querySelectorAll('.panel')) {
      const left = width / 2 - panel.offsetWidth / 2;
      const top = -GAP - panel.offsetHeight;
      const inset = [y0 - top, left + panel.offsetWidth - (x0 + w), top + panel.offsetHeight - (y0 + h), x0 - left].map((edge) => `${Math.max(0, Math.round(edge * 10) / 10)}px`);
      panel.style.clipPath = moving || h < panel.offsetHeight - 0.5 ? `inset(${inset.join(' ')} round ${Math.min(RADIUS, w / 2, h / 2)}px)` : '';
    }

    // The filter works on a region around everything that can show.
    const pad = 40 + (this.viscosity ?? 0) * 3;
    const panels = [...this.shadowRoot.querySelectorAll('.panel')];
    const tallest = Math.max(0, ...panels.map((panel) => panel.offsetHeight));
    const widest = Math.max(width, ...panels.map((panel) => panel.offsetWidth));
    const filter = this.query('filter');
    set(filter, { x: width / 2 - widest / 2 - pad, y: -GAP - tallest - pad, width: widest + pad * 2, height: tallest + GAP + height + pad * 2 });
    return moving;
  }
}
