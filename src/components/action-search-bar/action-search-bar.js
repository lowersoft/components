import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import {
  activity,
  arrowUpRight,
  bookOpen,
  check,
  chevronRight,
  copy,
  filePlus,
  folderInput,
  history,
  keyboard,
  link2,
  loaderCircle,
  search,
  sunMoon,
  userPlus,
} from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo } from '../../core/motion.js';
import { IS_APPLE } from '../../core/platform.js';
import styles from './action-search-bar.scss?inline';
import { buildSections, flatten } from './matching.js';

const DEMO_ITEMS = [
  { id: 'new-document', label: 'New document', icon: filePlus, group: 'Actions', keywords: ['create', 'page', 'file'], shortcut: ['⌘', 'N'] },
  { id: 'duplicate', label: 'Duplicate page', icon: copy, group: 'Actions', keywords: ['copy', 'clone'], shortcut: ['⌘', 'D'] },
  {
    id: 'move',
    label: 'Move to…',
    icon: folderInput,
    group: 'Actions',
    keywords: ['folder', 'file'],
    placeholder: 'Move to which folder?',
    children: [
      { id: 'move-inbox', label: 'Inbox', icon: folderInput },
      { id: 'move-projects', label: 'Projects', icon: folderInput },
      { id: 'move-archive', label: 'Archive', icon: folderInput },
    ],
  },
  {
    id: 'theme',
    label: 'Change theme',
    icon: sunMoon,
    group: 'Actions',
    keywords: ['appearance', 'dark', 'light', 'mode'],
    placeholder: 'Choose a theme…',
    children: [
      { id: 'theme-light', label: 'Light', icon: sunMoon },
      { id: 'theme-dark', label: 'Dark', icon: sunMoon },
      { id: 'theme-system', label: 'Match system', icon: sunMoon },
    ],
  },
  { id: 'invite', label: 'Invite member', icon: userPlus, group: 'Actions', keywords: ['team', 'share', 'add'] },
  { id: 'copy-link', label: 'Copy link', icon: link2, group: 'Actions', keywords: ['url', 'share'], shortcut: ['⌘', 'L'] },
  { id: 'docs', label: 'Documentation', icon: bookOpen, group: 'Links', keywords: ['help', 'guide'], href: '/docs' },
  { id: 'changelog', label: 'Changelog', icon: history, group: 'Links', keywords: ['release', 'updates', 'new'], href: '/changelog' },
  { id: 'status', label: 'Status page', icon: activity, group: 'Links', keywords: ['uptime', 'incident'], href: '/status' },
  { id: 'shortcuts', label: 'Keyboard shortcuts', icon: keyboard, group: 'Links', keywords: ['keys', 'hotkeys'], href: '/shortcuts' },
];

// How long a finished row shows its check before the palette closes.
const HOLD_MS = 400;
const RECENT_LIMIT = 3;
const HEIGHT_SPRING = springFeel(0.32, 0);
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

const kbd = (key) => `<kbd>${escapeHtml(key)}</kbd>`;
const isPaletteCombo = (event) => (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k';

// The label with the matched characters in bold.
const highlighted = (text, matches) => {
  const hit = new Set(matches);
  // Indices are UTF-16 positions, as `indexOf` gives them.
  return text.split('').map((ch, i) => (hit.has(i) ? `<b>${escapeHtml(ch)}</b>` : escapeHtml(ch))).join('').replaceAll('</b><b>', '');
};

const rowEnd = (item, status) => {
  if (status === 'pending') return `<span class="spin">${strokeIcon(loaderCircle)}</span>`;
  if (status === 'done') return `<span class="done">${strokeIcon(check)}</span>`;
  if (item.children) return strokeIcon(chevronRight);
  if (item.href) return strokeIcon(arrowUpRight);
  if (item.shortcut) return `<span class="keys" aria-hidden="true">${item.shortcut.map(kbd).join('')}</span>`;
  return '';
};

/**
 * A ⌘K command palette: fuzzy search over commands, nested pages for
 * commands with children, Recent before anything is typed, and a spinner
 * then a check in the row while a command runs.
 *
 * Items are `{ id, label, icon?, group?, keywords?, shortcut?, href?,
 * children?, placeholder? }`, where `icon` is the inner markup of a 24 × 24
 * stroked SVG and `shortcut` the keys shown, like `["⌘", "N"]`.
 *
 * Set the `run` property to `(item, path) => …` to run a chosen command; a
 * returned promise shows a spinner until it settles, and a rejection leaves
 * the palette open. Every run also fires `lw-select`.
 *
 * @attr {Array<object>} items - The commands (JSON)
 * @attr {Array<string>} recent - Ids shown under Recent before anything is typed (JSON); running a command adds it
 * @attr {boolean} open - The palette is open
 * @attr {boolean} shortcut - ⌘K / Ctrl+K works page-wide while the palette is on screen, not only while it has focus or the pointer
 * @attr {string} label - Accessible name of the search field
 * @attr {string} placeholder
 * @fires lw-select - A command ran; `detail: { item, path }`
 * @fires lw-toggle - The palette opened or closed; `detail: { open }`
 * @csspart palette
 */
export class LwActionSearchBar extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    recent: { type: Object, default: ['copy-link', 'theme-dark'] },
    open: { type: Boolean, reflect: true },
    shortcut: { type: Boolean },
    label: { default: 'Search commands' },
    placeholder: { default: 'Search or jump to…' },
  };

  // `run`: `(item, path) => unknown`, set as a property; documented above.

  #query = '';
  #stack = [];
  #active = 0;
  #rows = [];
  #running = null;
  #runToken = 0;
  #holdTimer = 0;
  #hovering = false;
  #onScreen = true;
  #returnFocus = null;
  // Set by a pointer action, so the next render animates it.
  #motion = { fade: false, slide: 0, spring: false };
  #stopHeight = null;
  #height = 0;

  render() {
    const mod = IS_APPLE ? '⌘' : 'Ctrl';
    return `<div class="palette" part="palette">
  <div class="bar">${strokeIcon(search)}<span class="crumbs"></span><label class="visually-hidden" for="input"></label><input id="input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="list" autocomplete="off" spellcheck="false"><span class="hotkey" aria-hidden="true">${kbd(mod)}${kbd('K')}</span></div>
  <div class="panel" hidden>
    <div class="body"><div class="content"><div class="list" id="list" role="listbox"></div><p class="empty" hidden></p></div></div>
    <div class="footer"><span class="hints"><span class="nav-hint">${kbd('↑')}${kbd('↓')}<span>Navigate</span></span>${kbd('↵')}<span class="enter-hint">Run</span></span><span class="hints"><span class="back-hint" hidden>${kbd('⌫')}<span>Back</span></span>${kbd('esc')}<span>Close</span></span></div>
  </div>
</div>
<span class="visually-hidden" aria-live="polite"></span>`;
  }

  connected() {
    const options = { signal: this.signal };
    const input = this.query('input');
    input.addEventListener('input', () => this.#typed(), options);
    input.addEventListener('keydown', (event) => this.#key(event), options);
    input.addEventListener('pointerdown', (event) => event.button === 0 && this.#openPalette('pointer'), options);
    const panel = this.query('.panel');
    // Keep focus in the input while pressing inside the panel, so its blur
    // never closes the palette before the click lands.
    for (const el of [panel, this.query('.crumbs')]) el.addEventListener('pointerdown', (event) => event.preventDefault(), options);
    panel.addEventListener('click', (event) => this.#click(event), options);
    panel.addEventListener('pointermove', (event) => this.#hover(event), options);
    this.query('.crumbs').addEventListener('click', (event) => event.target.closest('.crumb:last-child') && !this.#running && this.#popPage('pointer'), options);
    this.addEventListener('focusout', (event) => this.open && !this.shadowRoot.contains(event.relatedTarget) && this.#close(false), options);
    this.addEventListener('pointerenter', (event) => (this.#hovering = event.pointerType === 'mouse'), options);
    this.addEventListener('pointerleave', () => (this.#hovering = false), options);
    // Capture, so the host page's ⌘K does not also fire when this one takes it.
    window.addEventListener('keydown', (event) => this.#hotkey(event), { ...options, capture: true });
    const visible = new IntersectionObserver(([entry]) => (this.#onScreen = entry?.isIntersecting ?? true));
    visible.observe(this);
    this.signal.addEventListener('abort', () => {
      visible.disconnect();
      clearTimeout(this.#holdTimer);
      this.#stopHeight?.();
    });
  }

  updated(changed) {
    if (changed.has('label')) this.query('label').textContent = this.label ?? '';
    if (changed.has('open')) this.#showOpen();
    this.#renderAll();
  }

  get #page() {
    return this.#stack.at(-1);
  }

  get #recentEntries() {
    const entries = flatten(this.items);
    return (this.recent ?? [])
      .map((id) => entries.find((entry) => entry.item.id === id))
      .filter((entry) => entry && !entry.item.children)
      .slice(0, RECENT_LIMIT);
  }

  #announce(text) {
    this.query('[aria-live]').textContent = text;
  }

  // ---- Open and close ----

  #openPalette(source) {
    if (this.open) return;
    this.#motion.fade = source === 'pointer';
    this.#active = 0;
    this.open = true;
    this.emit('toggle', { open: true });
  }

  #close(restoreFocus) {
    clearTimeout(this.#holdTimer);
    this.#runToken++;
    this.#running = null;
    this.#query = '';
    this.#stack = [];
    this.#active = 0;
    this.query('input').value = '';
    const wasOpen = this.open;
    this.open = false;
    if (wasOpen) this.emit('toggle', { open: false });
    const target = this.#returnFocus;
    this.#returnFocus = null;
    if (restoreFocus && target?.isConnected) target.focus();
  }

  #showOpen() {
    const panel = this.query('.panel');
    panel.hidden = !this.open;
    this.query('.hotkey').hidden = Boolean(this.open);
    this.query('input').ariaExpanded = String(Boolean(this.open));
    this.toggleAttribute('data-open', Boolean(this.open));
    if (!this.open) {
      this.#stopHeight?.();
      this.#height = 0;
      return;
    }
    if (this.#motion.fade && !reducedMotion.matches) panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, easing: EASE_OUT });
    this.#motion.fade = false;
  }

  // ⌘K toggles the palette while it is on screen: page-wide with `shortcut`,
  // else only while it has focus or the pointer.
  #hotkey(event) {
    if (!isPaletteCombo(event) || !this.#onScreen || event.defaultPrevented) return;
    const focused = document.activeElement;
    const inside = focused === this;
    if (!(this.shortcut || inside || this.#hovering)) return;
    // Focus sits in an open modal dialog that does not hold the palette.
    const modal = focused?.closest?.('[aria-modal="true"]');
    if (modal && !modal.contains(this)) return;
    event.preventDefault();
    event.stopPropagation();
    if (this.open) {
      this.#close(true);
      return;
    }
    if (focused instanceof HTMLElement && !inside) this.#returnFocus = focused;
    const input = this.query('input');
    input.focus();
    input.select();
    this.#openPalette('keyboard');
  }

  // ---- Rendering ----

  #renderAll() {
    const page = this.#page;
    const input = this.query('input');
    input.placeholder = page ? (page.placeholder ?? `Search ${page.label.toLowerCase()}…`) : (this.placeholder ?? '');
    input.readOnly = Boolean(this.#running);
    this.query('.crumbs').innerHTML = this.#stack
      .map((item) => `<button class="crumb" type="button" tabindex="-1" aria-label="Back from ${escapeHtml(item.label)}">${escapeHtml(item.label)}</button>`)
      .join('');
    this.query('.back-hint').hidden = !this.#stack.length;
    if (!this.open) return;

    const sections = buildSections(page, this.items, this.#query, this.#recentEntries);
    this.#rows = sections.flatMap(({ rows }) => rows);
    this.#active = Math.min(Math.max(this.#active, 0), Math.max(this.#rows.length - 1, 0));
    let index = -1;
    const list = this.query('.list');
    list.ariaLabel = page ? page.label : 'Commands';
    list.ariaBusy = String(this.#running?.phase === 'pending');
    list.innerHTML = sections
      .map(({ key, label, rows }) => {
        const heading = label ? `<div class="heading" id="group-${escapeHtml(key)}" role="presentation">${escapeHtml(label)}</div>` : '';
        const options = rows
          .map((row) => {
            index++;
            const status = this.#running?.key === row.key ? this.#running.phase : undefined;
            const path = row.path.map(({ label: parent }) => `<span class="parent">${escapeHtml(parent)}<span aria-hidden="true"> › </span></span>`).join('');
            const opens = row.item.children ? '<span class="visually-hidden">, opens a page</span>' : '';
            return `<div class="option" id="option-${index}" role="option" data-index="${index}" aria-selected="false"${this.#running && !status ? ' aria-disabled="true"' : ''}><span class="icon" aria-hidden="true">${row.item.icon ? strokeIcon(row.item.icon) : ''}</span><span class="label">${path}${highlighted(row.item.label, row.matches)}${opens}</span><span class="end">${rowEnd(row.item, status)}</span></div>`;
          })
          .join('');
        return `<div role="group"${label ? ` aria-labelledby="group-${escapeHtml(key)}"` : ''}>${heading}${options}</div>`;
      })
      .join('');
    const empty = this.query('.empty');
    empty.hidden = this.#rows.length > 0;
    empty.textContent = `No results for “${this.#query.trim()}”`;
    this.#paintActive();
    this.#fitHeight();
  }

  // Marks the highlighted row and keeps it inside the list's scroll box.
  #paintActive() {
    const list = this.query('.list');
    const row = this.#rows.length ? this.query(`#option-${this.#active}`) : null;
    for (const option of list.querySelectorAll('[aria-selected="true"]')) option.ariaSelected = 'false';
    const input = this.query('input');
    if (!row) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    row.ariaSelected = 'true';
    input.setAttribute('aria-activedescendant', row.id);
    this.query('.enter-hint').textContent = this.#rows[this.#active]?.item.children ? 'Open' : 'Run';
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < list.scrollTop + 6) list.scrollTop = top - 30;
    else if (bottom > list.scrollTop + list.clientHeight - 6) list.scrollTop = bottom - list.clientHeight + 6;
  }

  // The body follows the content's height: springing after a pointer page
  // change, at once otherwise.
  #fitHeight() {
    const body = this.query('.body');
    const target = this.query('.content').offsetHeight;
    this.#stopHeight?.();
    this.#stopHeight = null;
    const draw = (height) => {
      this.#height = height;
      body.style.height = `${height}px`;
    };
    if (!this.#motion.spring || !this.#height || reducedMotion.matches) {
      draw(target);
    } else {
      this.#stopHeight = springTo(this.#height, target, { ...HEIGHT_SPRING, restDelta: 0.5, update: draw });
    }
    this.#motion.spring = false;
    const slide = this.#motion.slide;
    this.#motion.slide = 0;
    if (slide) {
      this.query('.list').animate(
        [{ transform: reducedMotion.matches ? 'none' : `translateX(${slide * 14}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }],
        { duration: 200, easing: EASE_OUT },
      );
    }
  }

  // ---- Pages ----

  #pushPage(item, source) {
    if (source === 'pointer') this.#motion = { ...this.#motion, slide: 1, spring: true };
    this.#stack = [...this.#stack, item];
    this.#setQuery('');
    this.#active = 0;
    this.#announce(`${item.label}, ${item.children?.length ?? 0} options`);
    this.#renderAll();
  }

  #popPage(source) {
    const left = this.#page;
    if (!left) return;
    if (source === 'pointer') this.#motion = { ...this.#motion, slide: -1, spring: true };
    this.#stack = this.#stack.slice(0, -1);
    this.#setQuery('');
    // Land back on the row that opened the page.
    const rows = buildSections(this.#page, this.items, '', this.#recentEntries).flatMap(({ rows: list }) => list);
    this.#active = Math.max(0, rows.findIndex((row) => row.key === left.id));
    this.#announce(this.#page?.label ?? 'All commands');
    this.query('input').focus();
    this.#renderAll();
  }

  #setQuery(query) {
    this.#query = query;
    this.query('input').value = query;
  }

  // ---- Running ----

  #choose(row, source) {
    if (this.#running) return;
    if (row.item.children) this.#pushPage(row.item, source);
    else this.#runRow(row);
  }

  #runRow(row) {
    const token = ++this.#runToken;
    const path = [...this.#stack, ...row.path];
    this.emit('select', { item: row.item, path });
    const result = this.run?.(row.item, path);
    if (!(result instanceof Promise)) {
      this.#finishRun(row, token);
      return;
    }
    this.#running = { key: row.key, phase: 'pending' };
    this.#announce(`Running ${row.item.label}`);
    this.#renderAll();
    result.then(
      () => this.#finishRun(row, token),
      () => {
        if (token !== this.#runToken) return;
        this.#running = null;
        this.#announce(`${row.item.label} failed`);
        this.#renderAll();
      },
    );
  }

  // The row shows a check for a moment, joins Recent, and the palette closes.
  #finishRun(row, token) {
    if (token !== this.#runToken) return;
    this.#running = { key: row.key, phase: 'done' };
    this.#announce(`${row.item.label}, done`);
    this.#renderAll();
    this.#holdTimer = setTimeout(() => {
      if (token !== this.#runToken) return;
      this.recent = [row.item.id, ...(this.recent ?? []).filter((id) => id !== row.item.id)].slice(0, RECENT_LIMIT);
      this.#close(this.#returnFocus !== null);
    }, HOLD_MS);
  }

  // ---- Input ----

  #typed() {
    this.#query = this.query('input').value;
    this.#active = 0;
    if (this.open) this.#renderAll();
    else this.#openPalette('keyboard');
  }

  #move(step) {
    const count = this.#rows.length;
    if (!count) return;
    this.#active = (Math.max(this.#active, 0) + step + count) % count;
    this.#paintActive();
  }

  #key(event) {
    if (this.#running && event.key !== 'Tab') {
      event.preventDefault();
      return;
    }
    const { key } = event;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault();
      if (!this.open) this.#openPalette('keyboard');
      else if (key === 'Home' || key === 'End') {
        this.#active = key === 'Home' ? 0 : this.#rows.length - 1;
        this.#paintActive();
      } else this.#move(key === 'ArrowDown' ? 1 : -1);
    } else if (key === 'Enter') {
      event.preventDefault();
      if (!this.open) this.#openPalette('keyboard');
      else if (this.#rows[this.#active]) this.#choose(this.#rows[this.#active], 'keyboard');
    } else if (key === 'Backspace' && this.open && !this.#query && this.#stack.length) {
      event.preventDefault();
      this.#popPage('keyboard');
    } else if (key === 'Escape') {
      if (this.open) {
        event.preventDefault();
        this.#close(true);
      } else if (this.#query) {
        this.#setQuery('');
      }
    }
  }

  #click(event) {
    const option = event.target.closest('.option');
    if (option) this.#choose(this.#rows[Number(option.dataset.index)], 'pointer');
  }

  #hover(event) {
    const option = event.target.closest('.option');
    if (event.pointerType !== 'mouse' || this.#running || !option) return;
    const index = Number(option.dataset.index);
    if (index === this.#active) return;
    this.#active = index;
    this.#paintActive();
  }
}
