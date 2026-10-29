import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { assigneeFace, labelChip, priorityIcon, statusIcon } from '../../core/issues.js';
import { calendarDays, messageCircle } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './kanban-board.scss?inline';

// A press that moves this far becomes a drag.
const DRAG_START = 4;

const DEMO_COLUMNS = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'progress', label: 'In progress' },
  { id: 'done', label: 'Done' },
];

const DEMO_CARDS = [
  { id: 'LOW-153', title: 'Rate-limit the public symbol endpoint', column: 'backlog', priority: 'high', labels: ['Build'], due: 'Oct 21', comments: 2, assignee: 'Dana Ortiz' },
  { id: 'LOW-148', title: 'Audit allocator stats for the dashboard', column: 'backlog', priority: 'medium', labels: ['Perf', 'Docs'], due: 'Oct 24', comments: 3, assignee: 'Maya Chen' },
  { id: 'LOW-151', title: 'Add CSV export to the crash list', column: 'backlog', priority: 'low', labels: ['Feature'], comments: 1, assignee: 'Jon Reyes' },
  { id: 'LOW-150', title: 'Flaky linker test on macOS ARM', column: 'backlog', priority: 'medium', labels: ['Bug'], comments: 0, assignee: '' },
  { id: 'LOW-139', title: 'Fix the deadlock in nested signal handlers', column: 'progress', priority: 'urgent', labels: ['Bug'], due: 'Oct 17', comments: 6, assignee: 'Sara Kim' },
  { id: 'LOW-146', title: 'Stream profiler samples over a pipe', column: 'progress', priority: 'high', labels: ['Feature'], due: 'Oct 19', comments: 0, assignee: 'Alex Lee' },
  { id: 'LOW-142', title: 'Empty states for the trace viewer', column: 'progress', priority: 'low', labels: ['Feature'], comments: 2, assignee: 'Maya Chen' },
  { id: 'LOW-131', title: 'Ship the symbol server redirect', column: 'done', priority: 'medium', labels: ['Build'], comments: 4, assignee: 'Jon Reyes' },
  { id: 'LOW-134', title: 'Replace the date parser with our own', column: 'done', priority: 'low', labels: ['Perf'], comments: 0, assignee: 'Dana Ortiz' },
];

/**
 * A sprint board: cards in columns to drag between, a progress bar that
 * fills as cards reach the last column, and a count on every column. The
 * card is lifted while it moves and a gap opens where it will land. With a
 * keyboard, Space picks a card up, the arrow keys move it across columns
 * and up and down, Space puts it down and Escape takes it back.
 *
 * Columns are `{ id, label }`, the last one counting as done; cards are
 * `{ id, title, column, priority, labels, due?, comments, assignee }`.
 *
 * @attr {string} heading
 * @attr {string} subtitle
 * @attr {Array<object>} columns (JSON)
 * @attr {Array<object>} cards (JSON)
 * @fires lw-move - A card moved; `detail: { id, column, index }`
 */
export class LwKanbanBoard extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    heading: { default: 'Sprint 24' },
    subtitle: { default: 'Runtime · Oct 14 – Oct 28' },
    columns: { type: Object, default: DEMO_COLUMNS },
    cards: { type: Object, default: DEMO_CARDS },
  };

  #cards = [];
  #press = null;
  #drag = null;
  #held = null;

  render() {
    return `<header class="head"><div><p class="subtitle"></p><h2 class="title"></h2></div><p class="keys"><kbd>Space</kbd> to move with keys</p><p class="progress"><span class="done-text"></span><span class="bar"><span class="fill"></span></span></p></header>
<div class="board"></div><p id="move-help" hidden>Space to pick up, arrow keys to move, Space to drop, Escape to cancel.</p><p class="live visually-hidden" aria-live="assertive"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const board = this.query('.board');
    board.addEventListener('pointerdown', (event) => {
      const card = event.target.closest('.card');
      if (!card || event.button !== 0) return;
      this.#press = { card, x: event.clientX, y: event.clientY, id: event.pointerId };
    }, options);
    board.addEventListener('pointermove', (event) => this.#pointerMove(event), options);
    board.addEventListener('pointerup', () => this.#pointerUp(), options);
    board.addEventListener('pointercancel', () => this.#pointerUp(), options);
    board.addEventListener('keydown', (event) => this.#key(event), options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.subtitle').textContent = this.subtitle ?? '';
    if (changed.has('cards') || changed.has('columns')) {
      this.#cards = this.cards.map((card) => ({ ...card }));
      this.#build();
    }
  }

  #build(focusId) {
    const lastColumn = this.columns.at(-1)?.id;
    this.query('.board').innerHTML = this.columns
      .map((column) => {
        const cards = this.#cards.filter((card) => card.column === column.id);
        return `<section class="column" data-column="${escapeHtml(column.id)}" aria-labelledby="col-${escapeHtml(column.id)}"><h3 class="column-head" id="col-${escapeHtml(column.id)}">${statusIcon(column.id === lastColumn ? 'done' : column.id === 'progress' ? 'progress' : 'backlog')}<span>${escapeHtml(column.label)}</span><span class="column-count">${cards.length}</span></h3>
<ol class="cards" role="list">${cards.map((card) => this.#card(card, column.id === lastColumn)).join('')}</ol></section>`;
      })
      .join('');
    this.#paintProgress();
    if (focusId) this.query(`.card[data-id="${CSS.escape(focusId)}"]`)?.focus();
  }

  #card(card, done) {
    const labels = card.labels.map(labelChip).join('');
    return `<li class="card"${done ? ' data-done' : ''} tabindex="0" data-id="${escapeHtml(card.id)}" aria-roledescription="card" aria-describedby="move-help"><p class="card-top"><code>${escapeHtml(card.id)}</code>${priorityIcon(card.priority)}</p><p class="card-title">${escapeHtml(card.title)}</p>
<p class="card-foot"><span class="labels">${labels}</span>${card.due ? `<span class="due">${strokeIcon(calendarDays, 14)}${escapeHtml(card.due)}</span>` : ''}${card.comments ? `<span class="comments">${strokeIcon(messageCircle, 14)}${card.comments}</span>` : ''}${assigneeFace(card.assignee)}</p></li>`;
  }

  #paintProgress() {
    const lastColumn = this.columns.at(-1)?.id;
    const done = this.#cards.filter((card) => card.column === lastColumn).length;
    this.query('.done-text').textContent = `${done} of ${this.#cards.length} done`;
    this.query('.fill').style.width = `${(done / Math.max(1, this.#cards.length)) * 100}%`;
  }

  // Moves the card in the model and on the board.
  #moveCard(id, column, index) {
    const card = this.#cards.find((each) => each.id === id);
    this.#cards = this.#cards.filter((each) => each !== card);
    card.column = column;
    const inColumn = this.#cards.filter((each) => each.column === column);
    const before = inColumn[index];
    this.#cards.splice(before ? this.#cards.indexOf(before) : this.#cards.length, 0, card);
    this.emit('move', { id, column, index: Math.min(index, inColumn.length) });
  }

  // Where the pointer would drop: the column under it, and the place in it.
  #target(event) {
    const element = this.shadowRoot.elementFromPoint(event.clientX, event.clientY);
    const column = element?.closest('.column');
    if (!column) return null;
    const cards = [...column.querySelectorAll('.card:not([data-lifted])')];
    const index = cards.findIndex((card) => event.clientY < card.getBoundingClientRect().top + card.offsetHeight / 2);
    return { column, index: index < 0 ? cards.length : index, cards };
  }

  #pointerMove(event) {
    const press = this.#press;
    if (!press) return;
    if (!this.#drag) {
      if (Math.hypot(event.clientX - press.x, event.clientY - press.y) < DRAG_START) return;
      press.card.setPointerCapture(press.id);
      press.card.toggleAttribute('data-lifted', true);
      const gap = Object.assign(document.createElement('li'), { className: 'gap' });
      gap.style.height = `${press.card.offsetHeight}px`;
      press.card.after(gap);
      this.#drag = { ...press, gap };
      this.toggleAttribute('data-dragging', true);
    }
    const drag = this.#drag;
    drag.card.style.translate = `${event.clientX - drag.x}px ${event.clientY - drag.y}px`;
    const target = this.#target(event);
    if (!target) return;
    const list = target.column.querySelector('.cards');
    const before = target.cards[target.index];
    if (before) list.insertBefore(drag.gap, before);
    else list.append(drag.gap);
    for (const column of this.shadowRoot.querySelectorAll('.column')) column.toggleAttribute('data-over', column === target.column);
  }

  #pointerUp() {
    const drag = this.#drag;
    this.#press = null;
    if (!drag) return;
    this.#drag = null;
    this.removeAttribute('data-dragging');
    const column = drag.gap.closest('.column').dataset.column;
    const index = [...drag.gap.parentElement.querySelectorAll('.card:not([data-lifted]), .gap')].indexOf(drag.gap);
    this.#moveCard(drag.card.dataset.id, column, index);
    this.#build(drag.card.dataset.id);
  }

  #say(text) {
    this.query('.live').textContent = text;
  }

  #position(id) {
    const card = this.#cards.find((each) => each.id === id);
    const inColumn = this.#cards.filter((each) => each.column === card.column);
    return { card, column: card.column, index: inColumn.indexOf(card), count: inColumn.length };
  }

  #key(event) {
    const element = event.target.closest('.card');
    if (!element) return;
    const id = element.dataset.id;
    const columns = this.columns.map((column) => column.id);
    const { card, column, index, count } = this.#position(id);
    const columnLabel = (columnId) => this.columns.find((each) => each.id === columnId)?.label;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (this.#held) {
        this.#held = null;
        this.#build(id);
        this.#say(`${card.title} dropped in ${columnLabel(column)}, position ${index + 1}.`);
      } else {
        this.#held = { id, column, index };
        element.toggleAttribute('data-held', true);
        this.#say(`${card.title} picked up from ${columnLabel(column)}.`);
      }
      return;
    }
    if (event.key === 'Escape' && this.#held) {
      event.preventDefault();
      const held = this.#held;
      this.#held = null;
      this.#moveCard(id, held.column, held.index);
      this.#build(id);
      this.#say('Move cancelled.');
      return;
    }
    const across = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    const along = { ArrowUp: -1, ArrowDown: 1 }[event.key];
    if (!across && !along) return;
    event.preventDefault();
    if (!this.#held) {
      // Without a card in hand, the arrows move focus.
      const cards = [...this.shadowRoot.querySelectorAll(`.column[data-column="${CSS.escape(column)}"] .card`)];
      if (along) cards[index + along]?.focus();
      else this.shadowRoot.querySelector(`.column[data-column="${CSS.escape(columns[columns.indexOf(column) + across] ?? '')}"] .card`)?.focus();
      return;
    }
    const nextColumn = across ? columns[Math.max(0, Math.min(columns.length - 1, columns.indexOf(column) + across))] : column;
    const nextIndex = across ? Math.min(index, this.#cards.filter((each) => each.column === nextColumn && each.id !== id).length) : Math.max(0, Math.min(count - 1, index + along));
    this.#moveCard(id, nextColumn, nextIndex);
    this.#build(id);
    this.query(`.card[data-id="${CSS.escape(id)}"]`)?.toggleAttribute('data-held', true);
    this.#say(`${columnLabel(nextColumn)}, position ${nextIndex + 1}.`);
  }
}
