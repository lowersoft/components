import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import * as lucide from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, springFeel } from '../../core/motion.js';
import styles from './gooey-search.scss?inline';

let uid = 0;

const DEMO_ITEMS = [
  { id: 'components', title: 'Components', detail: 'Buttons, menus, motion and more', icon: 'layers' },
  { id: 'docs', title: 'Docs', detail: 'Install, theme and extend', icon: 'bookOpen' },
  { id: 'themes', title: 'Themes', detail: 'Tokens, dark mode, colors', icon: 'palette' },
  { id: 'changelog', title: 'Changelog', detail: 'What shipped and when', icon: 'history' },
  { id: 'support', title: 'Support', detail: 'Help, contact, questions', icon: 'messageCircle' },
];
const DEMO_ENGINES = [
  { id: 'ai', label: 'Ask AI', tagline: 'Think it through together', icon: 'wandSparkles', href: 'https://claude.ai/new?q={q}' },
  { id: 'web', label: 'Search the web', tagline: 'Everything out there', icon: 'globe', href: 'https://duckduckgo.com/?q={q}' },
];
const DEMO_RECENT = ['Gooey toolbar', 'Spring easing curves', 'Dark pricing table'];

const SIZE = 52;
const STEP = 1 / 240;
const SHAPE = springFeel(0.42, 0.12);
// The panel follows the field a moment later, and leaves a moment earlier.
const PANEL_DELAY = 110;
const isMac = /Mac|iPhone|iPad/.test(globalThis.navigator?.platform ?? '');

const iconMarkup = (icon, size = 18) => {
  if (!icon) return '';
  if (String(icon).trim().startsWith('<svg')) return icon;
  return strokeIcon(lucide[icon] ?? lucide.search, size, 1.75);
};

/**
 * A round search button that stretches into a field, with results that
 * drip out of it into a panel below, run together by an SVG goo filter.
 * Empty, the panel offers assistants to ask and recent searches; typed
 * into, it filters the places to jump to by title and detail (put synonyms
 * in the detail), lists matching recent searches and offers to ask each
 * assistant about the words.
 *
 * It is an ARIA combobox: the arrow keys move through the rows, Enter
 * picks one, Escape clears the field and then closes, and ⌘K or Ctrl+K
 * opens it from anywhere unless `no-shortcut` is set. Picking a place fires
 * `lw-select` and follows its `href` unless the event is canceled; asking
 * opens the assistant in a new tab; a recent search fills the field. With
 * reduced motion the shapes change without pouring.
 *
 * Items are `{ id, title, detail?, icon?, href? }`; engines are
 * `{ id, label, tagline?, icon?, href }` where `{q}` in the href is the
 * query. Icons are Lucide names from `core/lucide.js` or `<svg>` markup.
 *
 * @attr {string} placeholder
 * @attr {Array<object>} items (JSON) - Places to jump to
 * @attr {Array<object>} engines (JSON) - Assistants to ask; [] hides them
 * @attr {Array<string>} recent (JSON) - Shown while the field is empty
 * @attr {number} width - Field and panel width in pixels; narrower containers shrink it
 * @attr {number} gap - Space between the field and the open panel, in pixels
 * @attr {number} viscosity - How far the blend spreads; 0 keeps hard edges
 * @attr {boolean} open
 * @attr {boolean} no-shortcut - Turns off ⌘K / Ctrl+K
 * @attr {string} fill - Field and panel color; the theme's foreground by default
 * @attr {string} ink - Text color on them; the theme's background by default
 * @fires lw-select - A place was picked; `detail: { item }`; cancel it to stay put
 * @fires lw-ask - An assistant was asked; `detail: { engine, query }`
 * @fires lw-toggle - It opened or closed; `detail: { open }`
 * @csspart field - The search field
 * @csspart panel - The results panel
 * @cssprop --lw-gooey-search-fill - Same as `fill`
 * @cssprop --lw-gooey-search-ink - Same as `ink`
 */
export class LwGooeySearch extends LwElement {
  static styles = styles;
  static props = {
    placeholder: { default: 'Ask or search anything' },
    items: { type: Object, default: DEMO_ITEMS },
    engines: { type: Object, default: DEMO_ENGINES },
    recent: { type: Object, default: DEMO_RECENT },
    width: { type: Number, default: 400 },
    gap: { type: Number, default: 14 },
    viscosity: { type: Number, default: 7 },
    open: { type: Boolean, reflect: true },
    noShortcut: { type: Boolean },
    fill: {},
    ink: {},
  };

  #id = `lw-gooey-search-${++uid}`;
  #rows = [];
  #active = 0;
  // Shapes now and where they are heading: the field's left and width, and
  // the panel's left, top, width and height.
  #now = { fx: 0, fw: SIZE, px: 0, py: 0, pw: 40, ph: 0 };
  #to = { ...this.#now };
  #speed = { fx: 0, fw: 0, px: 0, py: 0, pw: 0, ph: 0 };
  #timer = 0;
  #ready = false;
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#draw() });

  render() {
    const id = this.#id;
    const key = isMac ? '⌘K' : 'Ctrl K';
    return `<div class="root"><svg class="goo" aria-hidden="true" focusable="false"><defs><filter id="${id}-goo" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop" result="body"/><feDropShadow in="body" dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.2"/></filter></defs><g class="blobs" filter="url(#${id}-goo)"><rect class="field-blob"/><rect class="panel-blob"/></g></svg>
<button class="trigger" type="button" aria-label="Search" aria-keyshortcuts="Meta+K Control+K"></button><span class="glass" aria-hidden="true">${strokeIcon(lucide.search, 19, 2)}</span>
<div class="field" part="field"><input class="input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-list" autocomplete="off" spellcheck="false" tabindex="-1"><kbd class="hint">${key}</kbd><button class="clear" type="button" aria-label="Clear" tabindex="-1">${strokeIcon(lucide.x, 16, 2)}</button></div>
<div class="panel" part="panel" inert><div class="list" id="${id}-list" role="listbox" aria-label="Results"></div><footer class="foot" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> <span class="enter-word">Open</span></span><span class="close-hint"><kbd>esc</kbd> Close</span></footer></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const input = this.query('.input');
    this.query('.trigger').addEventListener('click', () => this.#setOpen(true), options);
    this.query('.clear').addEventListener('click', () => {
      input.value = '';
      this.#filter();
      input.focus();
    }, options);
    input.addEventListener('input', () => this.#filter(), options);
    input.addEventListener('keydown', (event) => this.#key(event), options);
    const list = this.query('.list');
    list.addEventListener('pointerdown', (event) => event.preventDefault(), options);
    list.addEventListener('click', (event) => {
      const row = event.target.closest('.row');
      if (row) this.#pick(Number(row.dataset.index));
    }, options);
    list.addEventListener('pointermove', (event) => {
      const row = event.target.closest('.row');
      if (row && Number(row.dataset.index) !== this.#active) this.#activate(Number(row.dataset.index));
    }, options);
    document.addEventListener('pointerdown', (event) => {
      if (this.open && !event.composedPath().includes(this)) this.#setOpen(false);
    }, options);
    document.addEventListener('keydown', (event) => {
      if (this.noShortcut || event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      this.#setOpen(!this.open);
    }, options);
    const sized = new ResizeObserver(() => this.#aim());
    sized.observe(this);
    sized.observe(this.query('.panel'));
    this.signal.addEventListener('abort', () => {
      sized.disconnect();
      clearTimeout(this.#timer);
      this.#loop.stop();
    });
  }

  updated(changed) {
    const input = this.query('.input');
    input.placeholder = this.placeholder ?? '';
    this.style.setProperty('--_width', `${Math.max(SIZE * 2, this.width || 400)}px`);
    if (this.fill) this.style.setProperty('--_fill', this.fill);
    else this.style.removeProperty('--_fill');
    if (this.ink) this.style.setProperty('--_ink', this.ink);
    else this.style.removeProperty('--_ink');
    const blur = Math.max(0, this.viscosity ?? 7);
    this.query('feGaussianBlur').setAttribute('stdDeviation', String(blur));
    this.query('.blobs').setAttribute('filter', blur ? `url(#${this.#id}-goo)` : '');
    this.query('.blobs').toggleAttribute('data-plain', !blur);
    if (['items', 'engines', 'recent'].some((prop) => changed.has(prop))) this.#filter();
    // The first paint places the shapes; later changes pour them.
    if (changed.has('open')) this.#toggled(this.#ready);
    this.#ready = true;
  }

  get #fullWidth() {
    return Math.min(Math.max(SIZE * 2, this.width || 400), this.clientWidth || this.width || 400);
  }

  #setOpen(open) {
    if (open === this.open) return;
    this.open = open;
    this.emit('toggle', { open });
  }

  #toggled(animate) {
    const open = this.open;
    const input = this.query('.input');
    const panel = this.query('.panel');
    input.ariaExpanded = String(open);
    input.tabIndex = open ? 0 : -1;
    this.query('.clear').tabIndex = open ? 0 : -1;
    this.query('.trigger').tabIndex = open ? -1 : 0;
    panel.inert = !open;
    if (open) {
      this.#filter();
      requestAnimationFrame(() => input.focus({ preventScroll: true }));
    } else {
      input.value = '';
      if (this.shadowRoot.activeElement) this.query('.trigger').focus({ preventScroll: true });
    }
    this.#aim(!animate);
  }

  // Sets where the shapes head: the field opens before the panel pours,
  // and the panel drains before the field closes.
  #aim(instant = false) {
    const width = this.#fullWidth;
    const open = this.open;
    const gap = Math.max(0, this.gap ?? 14);
    const height = this.query('.panel').scrollHeight;
    const field = open ? { fx: 0, fw: width } : { fx: (width - SIZE) / 2, fw: SIZE };
    const shut = { px: width / 2 - 20, py: 6, pw: 40, ph: 40 };
    const panel = open ? { px: 0, py: SIZE + gap, pw: width, ph: height } : shut;
    clearTimeout(this.#timer);
    if (instant || reducedMotion.matches) {
      Object.assign(this.#to, field, panel);
      Object.assign(this.#now, this.#to);
      this.#draw();
      return;
    }
    const later = (fn) => (this.#timer = setTimeout(() => {
      fn();
      this.#loop.wake();
    }, PANEL_DELAY));
    if (open) {
      Object.assign(this.#to, field);
      // Already out, the panel just resizes.
      if (this.#now.ph > 60) Object.assign(this.#to, panel);
      else later(() => Object.assign(this.#to, panel));
    } else {
      Object.assign(this.#to, panel);
      later(() => Object.assign(this.#to, field));
    }
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
    const width = this.#fullWidth;
    const svg = this.query('.goo');
    const tall = SIZE + (this.gap ?? 14) + Math.max(n.ph, this.#to.ph) + 40;
    svg.setAttribute('width', width);
    svg.setAttribute('height', tall);
    const pad = 40 + (this.viscosity ?? 7) * 3;
    Object.entries({ x: -pad, y: -pad, width: width + pad * 2, height: tall + pad * 2 }).forEach(([k, v]) => this.query('filter').setAttribute(k, v));
    const set = (el, attrs) => Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, (Math.round(v * 100) / 100).toString()));
    set(this.query('.field-blob'), { x: n.fx, y: 0, width: Math.max(0, n.fw), height: SIZE, rx: SIZE / 2 });
    const ph = Math.max(0, n.ph);
    const pw = Math.max(0, n.pw);
    set(this.query('.panel-blob'), { x: n.px, y: n.py, width: pw, height: ph, rx: Math.min(24, pw / 2, ph / 2) });

    // The search glass rides the field's left end; the field's contents show
    // once it is wide, the panel's once it is near its full size.
    this.query('.glass').style.transform = `translateX(${n.fx}px)`;
    this.query('.trigger').style.left = `${n.fx}px`;
    const opened = Math.min(1, Math.max(0, (n.fw - SIZE) / Math.max(1, width - SIZE)));
    const field = this.query('.field');
    field.style.opacity = String(Math.max(0, (opened - 0.55) / 0.45));
    field.style.pointerEvents = this.open ? 'auto' : 'none';
    // The field's contents never show past the stretching pill.
    const left = Math.max(0, n.fx - 46);
    const right = Math.max(0, width - (n.fx + n.fw));
    field.style.clipPath = `inset(0 ${right.toFixed(1)}px 0 ${left.toFixed(1)}px)`;
    const panel = this.query('.panel');
    const target = panel.scrollHeight || 1;
    const shown = this.open ? Math.max(0, Math.min(1, (ph / target - 0.6) / 0.4)) : Math.max(0, Math.min(1, (ph / target - 0.75) / 0.25));
    panel.style.opacity = String(shown);
    panel.style.top = `${SIZE + (this.gap ?? 14)}px`;
    // Never shows past the blob.
    const inset = [n.py - (SIZE + (this.gap ?? 14)), width - (n.px + pw), target - (n.py - (SIZE + (this.gap ?? 14)) + ph), n.px].map((v) => `${Math.max(0, v).toFixed(1)}px`);
    panel.style.clipPath = `inset(${inset.join(' ')} round ${Math.min(24, pw / 2, ph / 2)}px)`;
    const moving = Object.keys(n).some((key) => Math.abs(this.#to[key] - n[key]) > 0.1 || Math.abs(this.#speed[key]) > 1);
    if (!moving) Object.assign(n, this.#to);
    return moving;
  }

  // Builds the rows for the current query.
  #filter() {
    const input = this.query('.input');
    const query = input.value.trim();
    const words = query.toLowerCase();
    const items = Array.isArray(this.items) ? this.items : [];
    const engines = Array.isArray(this.engines) ? this.engines : [];
    const recent = Array.isArray(this.recent) ? this.recent : [];
    const groups = [];
    if (!query) {
      if (engines.length) groups.push(['Ask', engines.map((engine) => ({ kind: 'ask', engine, title: engine.label, detail: engine.tagline, icon: engine.icon || 'wandSparkles' }))]);
      if (recent.length) groups.push(['Recent', recent.map((text) => ({ kind: 'recent', title: text, icon: 'history' }))]);
      if (!engines.length && !recent.length) groups.push(['Jump to', items.map((item) => ({ kind: 'item', item, title: item.title, detail: item.detail, icon: item.icon }))]);
    } else {
      const found = recent.filter((text) => text.toLowerCase().includes(words));
      if (found.length) groups.push(['Recent', found.map((text) => ({ kind: 'recent', title: text, icon: 'history' }))]);
      const places = items.filter((item) => `${item.title} ${item.detail ?? ''}`.toLowerCase().includes(words));
      if (places.length) groups.push(['Jump to', places.map((item) => ({ kind: 'item', item, title: item.title, detail: item.detail, icon: item.icon }))]);
      if (engines.length) groups.push(['Ask', engines.map((engine) => ({ kind: 'ask', engine, title: engine.label, detail: `“${query}”`, icon: engine.icon || 'wandSparkles' }))]);
    }
    this.#rows = groups.flatMap(([, rows]) => rows);
    const id = this.#id;
    const mark = (text) => {
      const safe = escapeHtml(text ?? '');
      if (!words) return safe;
      const at = String(text).toLowerCase().indexOf(words);
      return at < 0 ? safe : `${escapeHtml(text.slice(0, at))}<mark>${escapeHtml(text.slice(at, at + words.length))}</mark>${escapeHtml(text.slice(at + words.length))}`;
    };
    let index = 0;
    const list = this.query('.list');
    list.innerHTML = groups.length
      ? groups
          .map(([title, rows], g) => `<div class="group" role="group" aria-labelledby="${id}-g${g}"><p class="group-title" id="${id}-g${g}">${title}</p>${rows
            .map((row) => {
              const i = index++;
              const end = row.kind === 'ask' ? strokeIcon(lucide.arrowUpRight, 14, 2) : '↵';
              return `<div class="row" role="option" id="${id}-o${i}" data-index="${i}" aria-selected="false"><span class="row-icon">${iconMarkup(row.icon)}</span><span class="row-text"><span class="row-title">${row.kind === 'ask' ? escapeHtml(row.title) : mark(row.title)}</span>${row.detail ? `<span class="row-detail">${row.kind === 'item' ? mark(row.detail) : escapeHtml(row.detail)}</span>` : ''}</span><span class="row-end" aria-hidden="true">${end}</span></div>`;
            })
            .join('')}</div>`)
          .join('')
      : '<p class="empty">Nothing found</p>';
    this.query('.clear').hidden = !query;
    this.query('.hint').hidden = Boolean(query);
    this.#activate(0);
    this.#aim();
  }

  #activate(index) {
    const rows = [...this.shadowRoot.querySelectorAll('.row')];
    this.#active = rows.length ? Math.max(0, Math.min(rows.length - 1, index)) : -1;
    rows.forEach((row, i) => row.setAttribute('aria-selected', String(i === this.#active)));
    const input = this.query('.input');
    const current = rows[this.#active];
    if (current) {
      input.setAttribute('aria-activedescendant', current.id);
      current.scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
    const row = this.#rows[this.#active];
    this.query('.enter-word').textContent = row?.kind === 'recent' ? 'Use' : row?.kind === 'ask' ? 'Ask' : 'Open';
  }

  #key(event) {
    const count = this.#rows.length;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (count) this.#activate((this.#active + (event.key === 'ArrowDown' ? 1 : -1) + count) % count);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.#active >= 0) this.#pick(this.#active);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      const input = this.query('.input');
      if (input.value) {
        input.value = '';
        this.#filter();
      } else this.#setOpen(false);
    }
  }

  #pick(index) {
    const row = this.#rows[index];
    if (!row) return;
    const input = this.query('.input');
    if (row.kind === 'recent') {
      input.value = row.title;
      this.#filter();
      input.focus();
      return;
    }
    if (row.kind === 'ask') {
      const query = input.value.trim();
      this.emit('ask', { engine: row.engine, query });
      const href = typeof row.engine.href === 'function' ? row.engine.href(query) : String(row.engine.href ?? '').replace('{q}', encodeURIComponent(query));
      if (href) window.open(href, '_blank', 'noopener');
      return;
    }
    const proceed = this.emit('select', { item: row.item });
    if (proceed !== false && row.item.href) location.assign(row.item.href);
    this.#setOpen(false);
  }
}
