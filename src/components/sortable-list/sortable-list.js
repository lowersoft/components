import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { priorityIcon } from '../../core/issues.js';
import { gripVertical } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { hueOf, initialsOf } from '../../core/people.js';
import styles from './sortable-list.scss?inline';

const SETTLE = { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };

const DEMO_ITEMS = [
  { id: 'LOW-412', title: 'Fix the symbol cache on a full disk', area: 'runtime', priority: 'high', owner: 'Maya Lin', estimate: '2d' },
  { id: 'LOW-397', title: 'Search across crash reports', area: 'profiler', priority: 'medium', owner: 'Theo Park', estimate: '5d' },
  { id: 'LOW-405', title: 'Company details on invoices', area: 'billing', priority: 'low', owner: 'Ana Ruiz', estimate: '1d' },
  { id: 'LOW-418', title: 'ARM linker drops debug info', area: 'toolchain', priority: 'high', owner: 'Sam Okafor', estimate: '½d' },
  { id: 'LOW-421', title: 'Man page for lower trace', area: 'docs', priority: 'low', owner: 'Priya Raman', estimate: '1d' },
];

/**
 * A list to put in order by dragging its handles: the row lifts and the
 * others make room as it passes, and the ranks renumber when it lands.
 * With a keyboard, Space on a handle picks the row up, the arrow keys move
 * it, Space drops it and Escape puts it back; each step is read out.
 *
 * Items are `{ id, title, area, priority, owner, estimate }`.
 *
 * @attr {Array<object>} items (JSON)
 * @fires lw-reorder - The order changed; `detail: { ids }`
 */
export class LwSortableList extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
  };

  #order = [];
  #drag = null;
  #grabbed = null;

  render() {
    return `<header class="head"><h2 class="title">Next up</h2><p class="hint">Drag to prioritize</p></header><ol class="list"></ol><p id="handle-help" hidden>Space to pick up, arrow keys to move, Space to drop, Escape to cancel.</p><p class="live visually-hidden" aria-live="assertive"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const list = this.query('.list');
    list.addEventListener('pointerdown', (event) => this.#start(event), options);
    list.addEventListener('pointermove', (event) => this.#move(event), options);
    list.addEventListener('pointerup', () => this.#drop(), options);
    list.addEventListener('pointercancel', () => this.#drop(), options);
    list.addEventListener('keydown', (event) => this.#key(event), options);
    list.addEventListener('focusout', (event) => {
      if (this.#grabbed && !list.contains(event.relatedTarget)) this.#cancelGrab();
    }, options);
  }

  updated(changed) {
    if (changed.has('items')) {
      this.#order = this.items.map((item) => item.id);
      this.#build();
    }
  }

  get #rows() {
    return [...this.shadowRoot.querySelectorAll('.row')];
  }

  #build() {
    const byId = new Map(this.items.map((item) => [item.id, item]));
    this.query('.list').innerHTML = this.#order
      .map((id) => byId.get(id))
      .map((item) => `<li class="row" data-id="${escapeHtml(item.id)}"><button class="handle" type="button" aria-label="Move ${escapeHtml(item.title)}" aria-describedby="handle-help">${strokeIcon(gripVertical, 18)}</button><span class="rank"></span>
<div class="text"><p class="item-title">${escapeHtml(item.title)}</p><p class="meta">${priorityIcon(item.priority)}<code>${escapeHtml(item.id)}</code><span>${escapeHtml(item.area)}</span></p></div><span class="owner" style="--_hue: ${hueOf(item.owner)}" title="${escapeHtml(item.owner)}">${escapeHtml(initialsOf(item.owner))}</span><span class="estimate">${escapeHtml(item.estimate)}</span></li>`)
      .join('');
    this.#paintRanks();
  }

  #paintRanks() {
    this.#rows.forEach((row, i) => (row.querySelector('.rank').textContent = String(i + 1)));
  }

  // Moves rows from where they were to where they are now, smoothly.
  #animateFrom(before) {
    if (reducedMotion.matches) return;
    for (const row of this.#rows) {
      const from = before.get(row);
      const to = row.getBoundingClientRect().top;
      if (from !== undefined && from !== to) row.animate({ translate: [`0 ${from - to}px`, '0 0'] }, SETTLE);
    }
  }

  #positions() {
    return new Map(this.#rows.map((row) => [row, row.getBoundingClientRect().top]));
  }

  #start(event) {
    const handle = event.target.closest('.handle');
    if (!handle || event.button !== 0) return;
    event.preventDefault();
    const row = handle.closest('.row');
    handle.focus();
    handle.setPointerCapture(event.pointerId);
    const rows = this.#rows;
    this.#drag = { row, y: event.clientY, from: rows.indexOf(row), index: rows.indexOf(row), height: row.offsetHeight + 4 };
    row.toggleAttribute('data-lifted', true);
    this.toggleAttribute('data-dragging', true);
  }

  // The lifted row follows the pointer; the rows it passes step aside.
  #move(event) {
    const drag = this.#drag;
    if (!drag) return;
    const dy = event.clientY - drag.y;
    const rows = this.#rows;
    drag.index = Math.max(0, Math.min(rows.length - 1, drag.from + Math.round(dy / drag.height)));
    drag.row.style.translate = `0 ${dy}px`;
    rows.forEach((row, i) => {
      if (row === drag.row) return;
      const shift = i > drag.from && i <= drag.index ? -drag.height : i < drag.from && i >= drag.index ? drag.height : 0;
      row.style.translate = shift ? `0 ${shift}px` : '';
    });
  }

  #drop() {
    const drag = this.#drag;
    if (!drag) return;
    this.#drag = null;
    this.removeAttribute('data-dragging');
    const before = this.#positions();
    for (const row of this.#rows) row.style.translate = '';
    drag.row.removeAttribute('data-lifted');
    this.#place(drag.row, drag.index, before);
  }

  // Puts the row at `index`, renumbers and tells.
  #place(row, index, before = this.#positions()) {
    const list = this.query('.list');
    const rows = this.#rows.filter((each) => each !== row);
    list.insertBefore(row, rows[index] ?? null);
    this.#animateFrom(before);
    this.#paintRanks();
    const ids = this.#rows.map((each) => each.dataset.id);
    if (ids.join() !== this.#order.join()) {
      this.#order = ids;
      this.emit('reorder', { ids });
    }
  }

  #say(text) {
    this.query('.live').textContent = text;
  }

  #key(event) {
    const handle = event.target.closest('.handle');
    if (!handle) return;
    const row = handle.closest('.row');
    const title = row.querySelector('.item-title').textContent;
    const rows = this.#rows;
    const index = rows.indexOf(row);
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (this.#grabbed) {
        this.#grabbed = null;
        row.removeAttribute('data-lifted');
        this.#say(`${title} dropped at position ${index + 1}.`);
      } else {
        this.#grabbed = { row, from: index };
        row.toggleAttribute('data-lifted', true);
        this.#say(`${title} picked up, position ${index + 1} of ${rows.length}.`);
      }
      return;
    }
    if (event.key === 'Escape' && this.#grabbed) {
      event.preventDefault();
      this.#cancelGrab();
      handle.focus();
      return;
    }
    const step = { ArrowUp: -1, ArrowDown: 1 }[event.key];
    if (!step) return;
    event.preventDefault();
    if (!this.#grabbed) {
      rows[index + step]?.querySelector('.handle').focus();
      return;
    }
    const to = Math.max(0, Math.min(rows.length - 1, index + step));
    if (to === index) return;
    this.#place(row, to);
    handle.focus();
    this.#say(`${title}, position ${to + 1} of ${rows.length}.`);
  }

  #cancelGrab() {
    const { row, from } = this.#grabbed;
    this.#grabbed = null;
    row.removeAttribute('data-lifted');
    this.#place(row, from);
    this.#say(`Move cancelled. ${row.querySelector('.item-title').textContent} is back at position ${from + 1}.`);
  }
}
