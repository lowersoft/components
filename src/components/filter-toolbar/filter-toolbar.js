import { escapeHtml, isTyping } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { assigneeFace, DEMO_ISSUES, LABELS, labelChip, PRIORITIES, priorityIcon, STATUSES, statusIcon } from '../../core/issues.js';
import { plus, search, x } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { menuStyles } from '../../core/menu.js';
import { createPicker, pickerMarkup } from '../../core/picker.js';
import { swapStyles } from '../../core/swap.js';
import styles from './filter-toolbar.scss?inline';

const FILTER_ICON = '<path d="M3 6h18M7 12h10M10 18h4"/>';

// What can be filtered on, the values each takes, and how to read an issue's.
const FIELDS = {
  status: { label: 'Status', values: () => STATUSES.map((each) => ({ value: each.id, label: each.label })) },
  priority: { label: 'Priority', values: () => PRIORITIES.map((each) => ({ value: each.id, label: each.label })) },
  label: { label: 'Label', values: () => Object.keys(LABELS).map((each) => ({ value: each, label: each })) },
  assignee: { label: 'Assignee', values: (issues) => [...new Set(issues.map((issue) => issue.assignee))].map((each) => ({ value: each, label: each || 'Nobody' })) },
};

/**
 * A toolbar that narrows a list of issues: a search over titles and ids,
 * opened with `/`, and filter chips. Each chip reads like a sentence,
 * "Status is In progress": press the verb to flip it to "is not", the value
 * to pick another, the cross to drop it. Add filters from the menu; the
 * count says how many issues are left.
 *
 * Issues are `{ id, title, status, priority, label, assignee }`; filters
 * are `{ field, op, value }`, `op` either "is" or "is not".
 *
 * @attr {Array<object>} issues (JSON)
 * @attr {Array<object>} filters (JSON)
 * @fires lw-change - The filters or search changed; `detail: { filters, query, count }`
 */
export class LwFilterToolbar extends LwElement {
  static styles = [iconStyles, menuStyles, swapStyles, styles];
  static props = {
    issues: { type: Object, default: DEMO_ISSUES },
    filters: { type: Object, default: [{ field: 'status', op: 'is', value: 'progress' }] },
  };

  #chips = null;

  render() {
    return `<div class="bar"><label class="search">${strokeIcon(search, 16)}<input class="query" type="search" placeholder="Search issues" aria-label="Search issues" autocomplete="off"><kbd aria-hidden="true">/</kbd></label>
<span class="add-filter">${pickerMarkup('field-menu', { icon: strokeIcon(FILTER_ICON, 16), label: 'Filter' })}</span><span class="count" aria-live="polite"></span></div>
<div class="chips"><div class="chip-list"></div><span class="add-more">${pickerMarkup('add-menu', { icon: strokeIcon(plus, 14), label: 'Add' })}</span><button class="clear" type="button">Clear</button></div><ul class="issues"></ul><p class="empty" hidden>No issues match. Loosen a filter.</p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const fieldItems = Object.entries(FIELDS).map(([value, field]) => ({ value, label: field.label }));
    for (const holder of [this.query('.add-filter'), this.query('.add-more')]) {
      const picker = createPicker(holder, this.signal, (field) => this.#add(field));
      picker.set(fieldItems, '');
      holder.querySelector('.picker-value').remove();
    }
    this.query('.query').addEventListener('input', () => this.#apply(), options);
    this.query('.clear').addEventListener('click', () => {
      this.query('.query').value = '';
      this.#setFilters([]);
    }, options);
    this.query('.chip-list').addEventListener('click', (event) => {
      const index = Number(event.target.closest('.chip')?.dataset.index);
      if (event.target.closest('.op')) this.#setFilters(this.filters.map((each, i) => (i === index ? { ...each, op: each.op === 'is' ? 'is not' : 'is' } : each)));
      else if (event.target.closest('.remove')) this.#setFilters(this.filters.filter((_, i) => i !== index));
    }, options);
    document.addEventListener('keydown', (event) => {
      if (event.key !== '/' || isTyping(event) || event.defaultPrevented) return;
      event.preventDefault();
      this.query('.query').focus();
    }, options);
  }

  updated(changed) {
    if (changed.has('filters') || changed.has('issues')) this.#buildChips();
    this.#apply();
  }

  #add(field) {
    const first = FIELDS[field].values(this.issues)[0]?.value ?? '';
    this.#setFilters([...this.filters, { field, op: 'is', value: first }]);
    // The new chip's value is the one to choose next.
    requestAnimationFrame(() => this.query('.chip:last-child .picker-trigger')?.focus());
  }

  #setFilters(filters) {
    this.filters = filters;
  }

  // Chips are rebuilt with their own menus, which go with them.
  #buildChips() {
    this.#chips?.abort();
    this.#chips = new AbortController();
    const signal = AbortSignal.any([this.signal, this.#chips.signal]);
    const list = this.query('.chip-list');
    list.innerHTML = this.filters
      .map((filter, i) => `<span class="chip" data-index="${i}"><span class="field">${escapeHtml(FIELDS[filter.field]?.label ?? filter.field)}</span><button class="op" type="button" aria-label="${escapeHtml(filter.op)}, change">${escapeHtml(filter.op)}</button>${pickerMarkup(`value-menu-${i}`)}<button class="remove" type="button" aria-label="Remove filter">${strokeIcon(x, 13)}</button></span>`)
      .join('');
    this.filters.forEach((filter, i) => {
      const chip = list.children[i];
      const values = FIELDS[filter.field]?.values(this.issues) ?? [];
      const picker = createPicker(chip, signal, (value) => this.#setFilters(this.filters.map((each, j) => (j === i ? { ...each, value } : each))));
      picker.set(values, filter.value);
      if (filter.field === 'status') chip.querySelector('.picker-trigger').insertAdjacentHTML('afterbegin', statusIcon(filter.value));
    });
    this.query('.chips').toggleAttribute('data-empty', !this.filters.length);
  }

  #apply() {
    const query = this.query('.query').value.trim().toLowerCase();
    const matches = this.issues.filter((issue) =>
      this.filters.every((filter) => (issue[filter.field] === filter.value) === (filter.op === 'is')) &&
      (!query || issue.title.toLowerCase().includes(query) || issue.id.toLowerCase().includes(query)));
    this.query('.count').innerHTML = `<b>${matches.length}</b> of ${this.issues.length} issues`;
    this.query('.issues').innerHTML = matches
      .map((issue) => `<li class="issue">${priorityIcon(issue.priority)}<span class="id">${escapeHtml(issue.id)}</span>${statusIcon(issue.status)}<span class="title">${escapeHtml(issue.title)}</span>${labelChip(issue.label)}${assigneeFace(issue.assignee)}</li>`)
      .join('');
    this.query('.empty').hidden = matches.length > 0;
    this.emit('change', { filters: this.filters, query, count: matches.length });
  }
}
