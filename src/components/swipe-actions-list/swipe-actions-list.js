import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { mail, paperclip } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { hueOf, initialsOf } from '../../core/people.js';
import styles from './swipe-actions-list.scss?inline';

const ARCHIVE = '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/>';
// A swipe past this share of the row's width commits.
const COMMIT = 0.3;
const UNDO_MS = 4000;

const DEMO_MESSAGES = [
  { id: 1, from: 'LowerSoft Billing', mark: '#635bff', subject: 'Your October invoice is ready', preview: '$480.00 was charged to the card ending 4421 on Oct 1. The PDF is attached.', time: '9:41', unread: true, attachment: 'invoice-oct-2026.pdf' },
  { id: 2, from: 'Lena Hoffmann', subject: 'Re: Profiler v2 copy', preview: 'Left two notes on the second screen, the rest reads well. Ship it when you are happy.', time: '9:12', unread: true, count: 3 },
  { id: 3, from: 'CI', mark: '#30a46c', subject: 'Nightly build passed on 6 targets', preview: 'x86_64, aarch64 and riscv64 on Linux and macOS. Binary 1.4 MB, cold start 9 ms.', time: 'Tue' },
  { id: 4, from: 'Marco Bellini', subject: 'Crash in the symbol cache', preview: 'Repro attached: fill the disk to the last few MB, then open any trace.', time: 'Mon', count: 5 },
];

/**
 * An inbox you can swipe: right to mark read or unread, left to archive.
 * The action shows under the row as it moves and commits past a third of
 * the way; an archived row folds away with an undo. With a keyboard,
 * focus a row and press E to archive or U to flip read; the same actions
 * sit on the row on hover.
 *
 * Messages are `{ id, from, subject, preview, time, unread?, count?,
 * attachment?, mark? }`, `mark` a colour for a sender drawn as a tile.
 *
 * @attr {Array<object>} messages (JSON)
 * @fires lw-archive - A message was archived; `detail: { id }`
 * @fires lw-read - A message was marked read or unread; `detail: { id, unread }`
 */
export class LwSwipeActionsList extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    messages: { type: Object, default: DEMO_MESSAGES },
  };

  #items = [];
  #drag = null;
  #undo = null;

  render() {
    return `<header class="head"><h2 class="title">Inbox</h2><span class="unread"></span></header><ul class="list" aria-label="Messages"></ul>
<div class="toast" role="status" hidden><span class="toast-text"></span><button class="undo" type="button">Undo</button></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const list = this.query('.list');
    list.addEventListener('click', (event) => {
      const action = event.target.closest('[data-action]');
      if (!action) return;
      const id = Number(action.closest('.row').dataset.id);
      if (action.dataset.action === 'archive') this.#archive(id);
      else this.#toggleRead(id);
    }, options);
    list.addEventListener('keydown', (event) => {
      const row = event.target.closest('.row');
      if (!row || event.target !== row) return;
      const key = event.key.toLowerCase();
      if (key === 'e') this.#archive(Number(row.dataset.id));
      else if (key === 'u') this.#toggleRead(Number(row.dataset.id));
      else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        (event.key === 'ArrowDown' ? row.nextElementSibling : row.previousElementSibling)?.focus();
      }
    }, options);
    this.#wireSwipe(list, options);
    this.query('.undo').addEventListener('click', () => this.#restore(), options);
    this.signal.addEventListener('abort', () => clearTimeout(this.#undo?.timer));
  }

  updated(changed) {
    if (changed.has('messages')) {
      this.#items = this.messages.map((message) => ({ ...message }));
      this.#build();
    }
  }

  #build() {
    this.query('.list').innerHTML = this.#items.map((message) => this.#row(message)).join('');
    this.#paintCount();
  }

  #row(message) {
    const avatar = message.mark
      ? `<span class="avatar tile" style="--_mark: ${escapeHtml(message.mark)}">${escapeHtml(message.from.charAt(0))}</span>`
      : `<span class="avatar" style="--_hue: ${hueOf(message.from)}">${escapeHtml(initialsOf(message.from))}</span>`;
    return `<li class="row" tabindex="0" data-id="${message.id}"${message.unread ? ' data-unread' : ''} aria-label="${escapeHtml(`${message.unread ? 'Unread, ' : ''}${message.from}: ${message.subject}`)}">
<span class="under left" aria-hidden="true">${strokeIcon(mail, 18)}<span class="under-text"></span></span><span class="under right" aria-hidden="true"><span>Archive</span>${strokeIcon(ARCHIVE, 18)}</span>
<div class="face-of-row"><span class="dot" aria-hidden="true"></span>${avatar}<div class="content"><p class="top"><b class="from">${escapeHtml(message.from)}</b>${message.count ? `<span class="count">${message.count}</span>` : ''}<time class="time">${escapeHtml(message.time)}</time></p><p class="subject">${escapeHtml(message.subject)}</p><p class="preview">${escapeHtml(message.preview)}</p>${message.attachment ? `<span class="attachment">${strokeIcon(paperclip, 14)}${escapeHtml(message.attachment)}</span>` : ''}</div>
<span class="actions"><button type="button" data-action="read" aria-label="${message.unread ? 'Mark read' : 'Mark unread'}" tabindex="-1">${strokeIcon(mail, 16)}</button><button type="button" data-action="archive" aria-label="Archive" tabindex="-1">${strokeIcon(ARCHIVE, 16)}</button></span></div></li>`;
  }

  #paintCount() {
    const unread = this.#items.filter((message) => message.unread).length;
    this.query('.unread').textContent = unread ? `${unread} unread` : 'All read';
  }

  #wireSwipe(list, options) {
    list.addEventListener('pointerdown', (event) => {
      const row = event.target.closest('.row');
      if (!row || event.button !== 0 || event.target.closest('button')) return;
      this.#drag = { row, x: event.clientX, y: event.clientY, dx: 0, axis: null, id: event.pointerId };
    }, options);
    list.addEventListener('pointermove', (event) => {
      const drag = this.#drag;
      if (!drag) return;
      const dx = event.clientX - drag.x;
      // Decide once: a sideways drag swipes, an upright one scrolls.
      if (!drag.axis && Math.hypot(dx, event.clientY - drag.y) > 6) {
        drag.axis = Math.abs(dx) > Math.abs(event.clientY - drag.y) ? 'x' : 'y';
        if (drag.axis === 'x') drag.row.setPointerCapture(drag.id);
      }
      if (drag.axis !== 'x') return;
      drag.dx = dx;
      const width = drag.row.offsetWidth;
      const unread = drag.row.hasAttribute('data-unread');
      drag.row.querySelector('.face-of-row').style.translate = `${dx}px 0`;
      drag.row.dataset.side = dx > 0 ? 'left' : 'right';
      drag.row.toggleAttribute('data-ready', Math.abs(dx) > width * COMMIT);
      drag.row.querySelector('.under-text').textContent = unread ? 'Read' : 'Unread';
    }, options);
    const end = () => {
      const drag = this.#drag;
      this.#drag = null;
      if (!drag || drag.axis !== 'x') return;
      const { row, dx } = drag;
      const id = Number(row.dataset.id);
      const committed = Math.abs(dx) > row.offsetWidth * COMMIT;
      const face = row.querySelector('.face-of-row');
      if (committed && dx < 0) return this.#archive(id, dx);
      face.style.translate = '';
      delete row.dataset.side;
      row.removeAttribute('data-ready');
      if (committed) this.#toggleRead(id);
    };
    list.addEventListener('pointerup', end, options);
    list.addEventListener('pointercancel', end, options);
  }

  #toggleRead(id) {
    const message = this.#items.find((each) => each.id === id);
    if (!message) return;
    message.unread = !message.unread;
    const row = this.query(`.row[data-id="${id}"]`);
    row.outerHTML = this.#row(message);
    this.query(`.row[data-id="${id}"]`).focus();
    this.#paintCount();
    this.emit('read', { id, unread: message.unread });
  }

  // Slides the row out, folds its space away, and offers an undo.
  async #archive(id, from = 0) {
    const index = this.#items.findIndex((each) => each.id === id);
    if (index < 0) return;
    const row = this.query(`.row[data-id="${id}"]`);
    const next = row.nextElementSibling ?? row.previousElementSibling;
    if (!reducedMotion.matches) {
      const face = row.querySelector('.face-of-row');
      await face.animate({ translate: [`${from}px 0`, `${-row.offsetWidth}px 0`] }, { duration: 200, easing: 'ease-in', fill: 'forwards' }).finished;
      await row.animate({ height: [`${row.offsetHeight}px`, '0px'], opacity: [1, 0] }, { duration: 200, easing: 'ease-out' }).finished;
    }
    clearTimeout(this.#undo?.timer);
    const [message] = this.#items.splice(index, 1);
    row.remove();
    next?.focus();
    this.#paintCount();
    const toast = this.query('.toast');
    toast.hidden = false;
    this.query('.toast-text').textContent = `Archived “${message.subject}”`;
    this.#undo = { message, index, timer: setTimeout(() => (toast.hidden = true), UNDO_MS) };
    this.emit('archive', { id });
  }

  #restore() {
    if (!this.#undo) return;
    clearTimeout(this.#undo.timer);
    this.#items.splice(this.#undo.index, 0, this.#undo.message);
    this.#build();
    this.query(`.row[data-id="${this.#undo.message.id}"]`)?.focus();
    this.query('.toast').hidden = true;
    this.#undo = null;
  }
}
