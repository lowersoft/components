import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { minus, plus } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { initialsOf } from '../../core/people.js';
import { IS_APPLE } from '../../core/platform.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './canvas-toolbar.scss?inline';

const UNDO = '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>';
const REDO = '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>';
const ZOOMS = [0.5, 0.67, 0.75, 0.86, 1, 1.25, 1.5, 2];
const NUDGE = 8;

const DEMO_NOTES = [
  { id: 'a', text: 'Rewrite the profiler page for v2', x: 40, y: 150, color: '#8e4ec6' },
  { id: 'b', text: 'Crash emails: link each report to its trace', x: 330, y: 250, color: '#e5484d' },
  { id: 'c', text: 'Migration guide for teams on the old profiler', x: 620, y: 120, color: '#0090ff' },
  { id: 'd', text: 'Ship Nov 4', x: 330, y: 430, color: '', outline: true },
];
const DEMO_LINKS = [['a', 'b'], ['b', 'c'], ['b', 'd']];
const DEMO_PEOPLE = [
  { name: 'Maya Chen', color: '#8e4ec6' },
  { name: 'Jonas Becker', color: '#0090ff' },
  { name: 'Priya Nair', color: '#e5484d' },
];

/**
 * A whiteboard's toolbar and the board under it: notes to drag, arrows that
 * follow them, zoom in and out, and undo and redo for every move. A note
 * moves with the arrow keys too, further with Shift; Ctrl+Z and
 * Ctrl+Shift+Z (⌘ on Apple) undo and redo, and Ctrl with the wheel zooms.
 * A teammate's cursor drifts across the board.
 *
 * Notes are `{ id, text, x, y, color, outline? }` in board pixels; links
 * are `[fromId, toId]` pairs.
 *
 * @attr {string} heading
 * @attr {number} zoom
 * @attr {Array<object>} notes (JSON)
 * @attr {Array<Array<string>>} links (JSON)
 * @attr {Array<object>} people - `{ name, color }` (JSON)
 * @fires lw-change - A note moved, or a move was undone or redone; `detail: { notes }`
 */
export class LwCanvasToolbar extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    heading: { default: 'Launch board' },
    zoom: { type: Number, default: 0.86 },
    notes: { type: Object, default: DEMO_NOTES },
    links: { type: Object, default: DEMO_LINKS },
    people: { type: Object, default: DEMO_PEOPLE },
  };

  #positions = new Map();
  #undo = [];
  #redo = [];
  #drag = null;
  #cursor = 0;

  render() {
    return `<header class="bar"><h2 class="title"><span class="heading"></span> <span class="count"></span></h2><span class="people"></span>
<div class="tools" role="toolbar" aria-label="Board"><button class="tool" type="button" data-action="undo" aria-label="Undo">${strokeIcon(UNDO, 18)}</button><button class="tool" type="button" data-action="redo" aria-label="Redo">${strokeIcon(REDO, 18)}</button><span class="sep"></span>
<button class="tool" type="button" data-action="out" aria-label="Zoom out">${strokeIcon(minus, 18)}</button><button class="zoom" type="button" data-action="reset" aria-label="Reset zoom"></button><button class="tool" type="button" data-action="in" aria-label="Zoom in">${strokeIcon(plus, 18)}</button></div></header>
<div class="board"><div class="world"><svg class="links" aria-hidden="true"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1 9 5 1 9" fill="none" stroke="currentColor" stroke-width="1.5"/></marker></defs></svg><p class="section-title">Q4 launch</p><div class="notes"></div></div>
<span class="cursor" aria-hidden="true"><svg viewBox="0 0 16 16" width="18" height="18"><path d="M2 2 14 7 8.5 8.5 7 14Z"/></svg><span class="cursor-name"></span></span></div><p class="live visually-hidden" aria-live="polite"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.tools').addEventListener('click', (event) => {
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (action === 'undo') this.#history(this.#undo, this.#redo);
      else if (action === 'redo') this.#history(this.#redo, this.#undo);
      else if (action) this.#zoomTo(action === 'reset' ? 1 : this.#step(action === 'in' ? 1 : -1));
    }, options);
    const board = this.query('.board');
    board.addEventListener('wheel', (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      this.#zoomTo(this.#step(event.deltaY < 0 ? 1 : -1));
    }, { ...options, passive: false });
    this.#wireDrag(board, options);
    this.addEventListener('keydown', (event) => this.#key(event), options);
    watchVisibility(this, (visible) => this.#wander(visible), this.signal);
    this.signal.addEventListener('abort', () => cancelAnimationFrame(this.#cursor));
  }

  updated(changed) {
    this.query('.heading').textContent = this.heading ?? '';
    if (changed.has('people')) {
      this.query('.people').innerHTML = this.people.map((person) => `<span class="person" style="--_ring: ${escapeHtml(person.color)}" title="${escapeHtml(person.name)}">${escapeHtml(initialsOf(person.name))}</span>`).join('');
      this.query('.cursor').style.setProperty('--_color', this.people[0]?.color ?? '#8e4ec6');
      this.query('.cursor-name').textContent = (this.people[0]?.name ?? '').split(' ')[0];
    }
    if (changed.has('notes')) {
      this.#positions = new Map(this.notes.map((note) => [note.id, { x: note.x, y: note.y }]));
      this.query('.notes').innerHTML = this.notes
        .map((note) => `<div class="note${note.outline ? ' outline' : ''}" data-id="${escapeHtml(note.id)}" tabindex="0" role="group" aria-roledescription="note" style="--_note: ${escapeHtml(note.color || 'transparent')}">${escapeHtml(note.text)}</div>`)
        .join('');
      this.#undo = [];
      this.#redo = [];
    }
    this.query('.count').textContent = `${this.notes.length + this.links.length + 1} items`;
    this.#paint();
  }

  #step(direction) {
    const index = ZOOMS.findIndex((zoom) => zoom >= this.zoom - 0.001);
    return ZOOMS[Math.min(ZOOMS.length - 1, Math.max(0, (index < 0 ? ZOOMS.length - 1 : index) + direction))];
  }

  #zoomTo(zoom) {
    this.zoom = zoom;
    this.query('.live').textContent = `Zoom ${Math.round(zoom * 100)}%`;
  }

  // Notes in place, arrows between them, the zoom and what can be undone.
  #paint() {
    this.query('.world').style.scale = String(this.zoom);
    this.query('.zoom').textContent = `${Math.round(this.zoom * 100)}%`;
    for (const note of this.shadowRoot.querySelectorAll('.note')) {
      const position = this.#positions.get(note.dataset.id);
      note.style.translate = `${position.x}px ${position.y}px`;
    }
    this.#paintLinks();
    this.query('[data-action="undo"]').disabled = !this.#undo.length;
    this.query('[data-action="redo"]').disabled = !this.#redo.length;
    this.query('[data-action="out"]').disabled = this.zoom <= ZOOMS[0];
    this.query('[data-action="in"]').disabled = this.zoom >= ZOOMS.at(-1);
  }

  // Each arrow runs between the facing edges of its two notes.
  #paintLinks() {
    const box = (id) => {
      const note = this.query(`.note[data-id="${CSS.escape(id)}"]`);
      const position = this.#positions.get(id);
      return note && position ? { x: position.x, y: position.y, w: note.offsetWidth, h: note.offsetHeight } : null;
    };
    const edge = (from, to) => {
      const cx = from.x + from.w / 2;
      const cy = from.y + from.h / 2;
      const dx = to.x + to.w / 2 - cx;
      const dy = to.y + to.h / 2 - cy;
      const scale = 1 / Math.max(Math.abs(dx) / (from.w / 2 + 12), Math.abs(dy) / (from.h / 2 + 12), 1e-6);
      return [cx + dx * scale, cy + dy * scale];
    };
    const svg = this.query('.links');
    svg.querySelectorAll('path.link').forEach((path) => path.remove());
    for (const [fromId, toId] of this.links) {
      const from = box(fromId);
      const to = box(toId);
      if (!from || !to) continue;
      const [x1, y1] = edge(from, to);
      const [x2, y2] = edge(to, from);
      svg.insertAdjacentHTML('beforeend', `<path class="link" d="M${x1} ${y1}L${x2} ${y2}" marker-end="url(#arrow)"/>`);
    }
  }

  #move(id, to, record = true) {
    const from = this.#positions.get(id);
    if (from.x === to.x && from.y === to.y) return;
    if (record) {
      this.#undo.push({ id, from: { ...from }, to: { ...to } });
      this.#redo = [];
    }
    this.#positions.set(id, { ...to });
    this.#paint();
    this.emit('change', { notes: this.notes.map((note) => ({ ...note, ...this.#positions.get(note.id) })) });
  }

  // Takes the last move off one stack, reverses it, and puts it on the other.
  #history(from, to) {
    const move = from.pop();
    if (!move) return;
    this.#positions.set(move.id, from === this.#undo ? { ...move.from } : { ...move.to });
    to.push(move);
    this.#paint();
    this.query('.live').textContent = from === this.#undo ? 'Undone' : 'Redone';
  }

  #wireDrag(board, options) {
    board.addEventListener('pointerdown', (event) => {
      const note = event.target.closest('.note');
      if (!note || event.button !== 0) return;
      event.preventDefault();
      note.focus();
      note.setPointerCapture(event.pointerId);
      const start = this.#positions.get(note.dataset.id);
      this.#drag = { note, id: note.dataset.id, start: { ...start }, x: event.clientX, y: event.clientY };
      note.toggleAttribute('data-dragging', true);
    }, options);
    board.addEventListener('pointermove', (event) => {
      const drag = this.#drag;
      if (!drag) return;
      this.#positions.set(drag.id, { x: drag.start.x + (event.clientX - drag.x) / this.zoom, y: drag.start.y + (event.clientY - drag.y) / this.zoom });
      this.#paint();
    }, options);
    for (const type of ['pointerup', 'pointercancel']) {
      board.addEventListener(type, () => {
        const drag = this.#drag;
        if (!drag) return;
        this.#drag = null;
        drag.note.removeAttribute('data-dragging');
        const to = { ...this.#positions.get(drag.id) };
        this.#positions.set(drag.id, drag.start);
        this.#move(drag.id, to);
      }, options);
    }
  }

  #key(event) {
    const mod = IS_APPLE ? event.metaKey : event.ctrlKey;
    if (mod && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) this.#history(this.#redo, this.#undo);
      else this.#history(this.#undo, this.#redo);
      return;
    }
    const note = event.composedPath().find((node) => node.classList?.contains('note'));
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!note || !step) return;
    event.preventDefault();
    const by = event.shiftKey ? NUDGE * 4 : NUDGE;
    const from = this.#positions.get(note.dataset.id);
    this.#move(note.dataset.id, { x: from.x + step[0] * by, y: from.y + step[1] * by });
  }

  // A teammate's cursor drifting over the board, while it is in view.
  #wander(visible) {
    cancelAnimationFrame(this.#cursor);
    const cursor = this.query('.cursor');
    if (!visible || reducedMotion.matches) return;
    const start = performance.now();
    const frame = (now) => {
      const t = (now - start) / 1000;
      cursor.style.left = `${62 + Math.sin(t * 0.4) * 18}%`;
      cursor.style.top = `${55 + Math.sin(t * 0.7) * 20}%`;
      this.#cursor = requestAnimationFrame(frame);
    };
    this.#cursor = requestAnimationFrame(frame);
  }
}
