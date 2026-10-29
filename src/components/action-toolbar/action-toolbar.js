import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { mail, tag, x } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { menuStyles } from '../../core/menu.js';
import { reducedMotion } from '../../core/motion.js';
import { hueOf, initialsOf } from '../../core/people.js';
import { createPicker, pickerMarkup } from '../../core/picker.js';
import { swapStyles } from '../../core/swap.js';
import styles from './action-toolbar.scss?inline';

const ARCHIVE = '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/>';
const TRASH = '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>';

const LABELS = { Billing: '#30a46c', Product: '#3b82f6', Build: '#f76b15', Support: '#8e4ec6' };

const DEMO_CONVERSATIONS = [
  { id: 1, from: 'LowerSoft Billing', mark: '#635bff', label: 'Billing', subject: 'Your invoice for October is ready', time: '9:41 AM', unread: true },
  { id: 2, from: 'Maya Chen', label: 'Product', subject: 'Re: Profiler v2 copy, last pass before launch', time: '9:12 AM', unread: true },
  { id: 3, from: 'CI', mark: '#09090b', subject: 'Build failed on main: type error in alloc.c', time: '8:55 AM' },
  { id: 4, from: 'Issue tracker', mark: '#8e8cf0', subject: '3 issues were assigned to you this week', time: 'Yesterday' },
  { id: 5, from: 'Jonas Weber', label: 'Billing', subject: 'Contract for the Q4 retainer, signed', time: 'Yesterday' },
  { id: 6, from: 'Code review', mark: '#30a46c', subject: '[lowersoft/runtime] Pull request #48 was merged', time: 'Oct 14' },
];

/**
 * A list with a toolbar for what is selected. Tick rows, Shift-click to
 * take a run of them, or tick all from the header; the toolbar rises with
 * the count and the actions: archive, mark read or unread, label, delete,
 * and an undo for the last one. With a keyboard, X ticks the focused row
 * and J and K move.
 *
 * Conversations are `{ id, from, subject, time, label?, unread?, mark? }`.
 *
 * @attr {Array<object>} conversations (JSON)
 * @fires lw-action - An action ran on the selection; `detail: { action, ids, label }`
 */
export class LwActionToolbar extends LwElement {
  static styles = [iconStyles, menuStyles, swapStyles, styles];
  static props = {
    conversations: { type: Object, default: DEMO_CONVERSATIONS },
  };

  #items = [];
  #selected = new Set();
  #anchor = null;
  #undo = null;

  render() {
    return `<header class="head"><input class="all check" type="checkbox" aria-label="Select all"><h2 class="title">Inbox <span class="total"></span></h2></header><ul class="list" aria-label="Conversations"></ul>
<div class="toolbar" role="toolbar" aria-label="Selected conversations" hidden><span class="count" aria-live="polite"></span><span class="sep"></span>
<button class="act" type="button" data-action="archive">${strokeIcon(ARCHIVE, 16)}<span>Archive</span></button><button class="act" type="button" data-action="read">${strokeIcon(mail, 16)}<span class="read-label">Mark read</span></button>
<span class="label-picker">${pickerMarkup('label-menu', { icon: strokeIcon(tag, 16), label: 'Label' })}</span><button class="act danger" type="button" data-action="delete">${strokeIcon(TRASH, 16)}<span>Delete</span></button><span class="sep"></span><button class="act clear" type="button" aria-label="Clear selection">${strokeIcon(x, 16)}</button></div>
<div class="undo-bar" role="status" hidden><span class="undo-text"></span><button class="undo" type="button">Undo</button></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const picker = createPicker(this.query('.label-picker'), this.signal, (label) => this.#act('label', label));
    picker.set(Object.keys(LABELS).map((label) => ({ value: label, label })), '');
    this.query('.label-picker .picker-value').remove();
    this.query('.all').addEventListener('change', (event) => {
      this.#selected = event.target.checked ? new Set(this.#items.map((item) => item.id)) : new Set();
      this.#paint();
    }, options);
    const list = this.query('.list');
    list.addEventListener('click', (event) => {
      const box = event.target.closest('.check');
      if (!box) return;
      this.#toggle(Number(box.closest('.row').dataset.id), event.shiftKey);
    }, options);
    list.addEventListener('keydown', (event) => {
      const row = event.target.closest('.row');
      if (!row) return;
      const key = event.key.toLowerCase();
      if (key === 'x') this.#toggle(Number(row.dataset.id), event.shiftKey);
      else if (key === 'j' || event.key === 'ArrowDown') row.nextElementSibling?.focus();
      else if (key === 'k' || event.key === 'ArrowUp') row.previousElementSibling?.focus();
      else return;
      event.preventDefault();
    }, options);
    this.query('.toolbar').addEventListener('click', (event) => {
      const act = event.target.closest('.act');
      if (!act) return;
      if (act.classList.contains('clear')) {
        this.#selected.clear();
        this.#paint();
      } else this.#act(act.dataset.action);
    }, options);
    this.query('.undo').addEventListener('click', () => this.#restore(), options);
    this.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.#selected.size) {
        this.#selected.clear();
        this.#paint();
      }
    }, options);
  }

  updated(changed) {
    if (changed.has('conversations')) {
      this.#items = this.conversations.map((item) => ({ ...item }));
      this.#selected.clear();
      this.#build();
    }
  }

  #build() {
    this.query('.list').innerHTML = this.#items
      .map((item) => {
        const avatar = item.mark
          ? `<span class="avatar tile" style="--_mark: ${escapeHtml(item.mark)}">${escapeHtml(item.from.charAt(0))}</span>`
          : `<span class="avatar" style="--_hue: ${hueOf(item.from)}">${escapeHtml(initialsOf(item.from))}</span>`;
        return `<li class="row" tabindex="0" data-id="${item.id}"><input class="check" type="checkbox" tabindex="-1" aria-label="Select ${escapeHtml(item.from)}: ${escapeHtml(item.subject)}">${avatar}<span class="from">${escapeHtml(item.from)}</span>
<span class="subject-cell"><span class="label"></span><span class="subject">${escapeHtml(item.subject)}</span></span><time class="time">${escapeHtml(item.time)}</time></li>`;
      })
      .join('');
    this.#paint();
  }

  #toggle(id, range) {
    const ids = this.#items.map((item) => item.id);
    if (range && this.#anchor !== null && ids.includes(this.#anchor)) {
      // Shift takes the run from the last row ticked to this one.
      const [a, b] = [ids.indexOf(this.#anchor), ids.indexOf(id)].sort((m, n) => m - n);
      const on = !this.#selected.has(id);
      for (const each of ids.slice(a, b + 1)) on ? this.#selected.add(each) : this.#selected.delete(each);
    } else if (this.#selected.has(id)) this.#selected.delete(id);
    else this.#selected.add(id);
    this.#anchor = id;
    this.#paint();
  }

  #paint() {
    const count = this.#selected.size;
    const total = this.#items.length;
    this.query('.total').textContent = `${total} conversations`;
    const all = this.query('.all');
    all.checked = count > 0 && count === total;
    all.indeterminate = count > 0 && count < total;
    for (const row of this.shadowRoot.querySelectorAll('.row')) {
      const item = this.#items.find((each) => each.id === Number(row.dataset.id));
      const selected = this.#selected.has(item.id);
      row.toggleAttribute('data-selected', selected);
      row.toggleAttribute('data-unread', Boolean(item.unread));
      row.querySelector('.check').checked = selected;
      row.querySelector('.label').innerHTML = item.label ? `<span class="label-chip" style="--_label: ${LABELS[item.label] ?? '#71717a'}">${escapeHtml(item.label)}</span>` : '';
    }
    const toolbar = this.query('.toolbar');
    toolbar.hidden = count === 0;
    this.query('.count').textContent = `${count} selected`;
    const allRead = [...this.#selected].every((id) => !this.#items.find((item) => item.id === id)?.unread);
    this.query('.read-label').textContent = allRead ? 'Mark unread' : 'Mark read';
  }

  async #act(action, label) {
    const ids = [...this.#selected];
    if (!ids.length) return;
    if (action === 'read') {
      const unread = ids.every((id) => !this.#items.find((item) => item.id === id).unread);
      for (const id of ids) this.#items.find((item) => item.id === id).unread = unread;
    } else if (action === 'label') {
      for (const id of ids) this.#items.find((item) => item.id === id).label = label;
    } else {
      // Archive and delete take the rows away, with an undo.
      const before = this.#items.map((item) => ({ ...item }));
      const rows = ids.map((id) => this.query(`.row[data-id="${id}"]`));
      if (!reducedMotion.matches) await Promise.all(rows.map((row) => row.animate({ opacity: [1, 0], height: [`${row.offsetHeight}px`, '0px'] }, { duration: 220, easing: 'ease-out' }).finished));
      this.#items = this.#items.filter((item) => !this.#selected.has(item.id));
      this.#selected.clear();
      this.#build();
      this.#offerUndo(`${ids.length} ${ids.length === 1 ? 'conversation' : 'conversations'} ${action === 'archive' ? 'archived' : 'deleted'}`, before);
      this.emit('action', { action, ids });
      return;
    }
    this.#paint();
    this.emit('action', { action, ids, label });
  }

  #offerUndo(text, before) {
    clearTimeout(this.#undo?.timer);
    const bar = this.query('.undo-bar');
    bar.hidden = false;
    this.query('.undo-text').textContent = text;
    this.#undo = { before, timer: setTimeout(() => (bar.hidden = true), 5000) };
  }

  #restore() {
    if (!this.#undo) return;
    clearTimeout(this.#undo.timer);
    this.#items = this.#undo.before;
    this.#undo = null;
    this.query('.undo-bar').hidden = true;
    this.#build();
  }
}
