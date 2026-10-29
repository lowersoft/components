import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { assigneeFace, DEMO_ISSUES, LABELS, labelChip, PRIORITIES, priorityIcon, STATUSES, statusIcon } from '../../core/issues.js';
import { search, x } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './filter-search-bar.scss?inline';

const FIELDS = {
  status: { label: 'Status', values: STATUSES.map((each) => ({ value: each.id, label: each.label })) },
  priority: { label: 'Priority', values: PRIORITIES.map((each) => ({ value: each.id, label: each.label })) },
  label: { label: 'Label', values: Object.keys(LABELS).map((each) => ({ value: each, label: each })) },
};

const SUGGESTIONS = 6;

const valueLabel = (field, value) => FIELDS[field]?.values.find((each) => each.value === value)?.label ?? value;

/**
 * A search box that turns what you type into filters. Type a word and pick
 * a suggestion like "Status is Done", or write `status:done` (a leading
 * `-` for "is not") and press Enter; anything else searches the titles.
 * Each filter becomes a token in the box: press its verb to flip it,
 * its cross to drop it, or Backspace in an empty box to take the last one
 * back. The issues below follow.
 *
 * Issues are `{ id, title, status, priority, label, assignee }`; filters
 * are `{ field, op, value }`.
 *
 * @attr {Array<object>} issues (JSON)
 * @attr {Array<object>} filters (JSON)
 * @fires lw-change - The filters changed; `detail: { filters, query, count }`
 */
export class LwFilterSearchBar extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    issues: { type: Object, default: DEMO_ISSUES },
    filters: { type: Object, default: [{ field: 'status', op: 'is not', value: 'done' }] },
  };

  #active = 0;
  #suggestions = [];
  #armed = false;

  render() {
    return `<div class="box"><span class="icon">${strokeIcon(search, 18)}</span><div class="tokens"></div><input class="query" type="text" role="combobox" aria-controls="suggestions" aria-expanded="false" aria-autocomplete="list" placeholder="Add filter or search…" aria-label="Add a filter or search" autocomplete="off" spellcheck="false">
<div class="suggestions" id="suggestions" role="listbox" aria-label="Suggestions" hidden><span class="highlight"></span><div class="options"></div></div></div><ul class="issues"></ul><p class="empty" hidden>No issues match.</p><p class="live visually-hidden" aria-live="polite"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const query = this.query('.query');
    query.addEventListener('input', () => {
      this.#armed = false;
      this.#active = 0;
      this.#suggest();
      this.#apply();
    }, options);
    query.addEventListener('focus', () => this.#suggest(), options);
    query.addEventListener('blur', () => setTimeout(() => this.#close(), 120), options);
    query.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.tokens').addEventListener('click', (event) => {
      const index = Number(event.target.closest('.token')?.dataset.index);
      if (event.target.closest('.op')) this.filters = this.filters.map((each, i) => (i === index ? { ...each, op: each.op === 'is' ? 'is not' : 'is' } : each));
      else if (event.target.closest('.remove')) this.#removeAt(index);
    }, options);
    this.query('.options').addEventListener('pointerdown', (event) => {
      const option = event.target.closest('.option');
      if (!option) return;
      event.preventDefault();
      this.#pick(Number(option.dataset.index));
    }, options);
    this.query('.box').addEventListener('click', (event) => event.target.closest('button') || query.focus(), options);
  }

  updated(changed) {
    if (changed.has('filters')) this.#paintTokens();
    this.#apply();
  }

  #paintTokens() {
    this.query('.tokens').innerHTML = this.filters
      .map((filter, i) => `<span class="token" data-index="${i}"><span class="field">${escapeHtml(FIELDS[filter.field]?.label ?? filter.field)}</span><button class="op" type="button" aria-label="${escapeHtml(filter.op)}, change">${escapeHtml(filter.op)}</button><span class="value">${filter.field === 'status' ? statusIcon(filter.value) : ''}${escapeHtml(valueLabel(filter.field, filter.value))}</span><button class="remove" type="button" aria-label="Remove filter">${strokeIcon(x, 13)}</button></span>`)
      .join('');
  }

  // Filters whose value or field matches the typed word, then a plain search.
  #suggest() {
    const raw = this.query('.query').value.trim();
    const term = raw.replace(/^-/, '').toLowerCase();
    const suggestions = [];
    if (term) {
      for (const [field, spec] of Object.entries(FIELDS)) {
        for (const value of spec.values) {
          const used = this.filters.some((filter) => filter.field === field && filter.value === value.value);
          if (!used && (value.label.toLowerCase().includes(term) || spec.label.toLowerCase().startsWith(term))) suggestions.push({ field, value: value.value, op: raw.startsWith('-') ? 'is not' : 'is' });
        }
      }
    }
    this.#suggestions = suggestions.slice(0, SUGGESTIONS);
    const list = this.query('.suggestions');
    const options = this.#suggestions.map((each, i) => `<div class="option" role="option" id="suggestion-${i}" data-index="${i}"><span class="option-field">${escapeHtml(FIELDS[each.field].label)} ${escapeHtml(each.op)}</span>${each.field === 'status' ? statusIcon(each.value) : ''}<span>${escapeHtml(valueLabel(each.field, each.value))}</span></div>`);
    if (term) options.push(`<div class="option search-option" role="option" id="suggestion-${this.#suggestions.length}" data-index="${this.#suggestions.length}">${strokeIcon(search, 15)}<span>Titles with “${escapeHtml(raw)}”</span></div>`);
    this.query('.options').innerHTML = options.join('');
    list.hidden = !options.length;
    this.query('.query').ariaExpanded = String(!list.hidden);
    this.#paintActive();
  }

  #paintActive() {
    const options = [...this.shadowRoot.querySelectorAll('.option')];
    this.#active = Math.min(this.#active, Math.max(0, options.length - 1));
    options.forEach((option, i) => option.ariaSelected = String(i === this.#active));
    const active = options[this.#active];
    const query = this.query('.query');
    if (active) {
      moveHighlight(this.query('.highlight'), active);
      query.setAttribute('aria-activedescendant', active.id);
    } else {
      hideHighlight(this.query('.highlight'));
      query.removeAttribute('aria-activedescendant');
    }
  }

  #close() {
    this.query('.suggestions').hidden = true;
    this.query('.query').ariaExpanded = 'false';
  }

  #pick(index) {
    const suggestion = this.#suggestions[index];
    const query = this.query('.query');
    if (suggestion) {
      this.filters = [...this.filters, { field: suggestion.field, op: suggestion.op, value: suggestion.value }];
      query.value = '';
      this.query('.live').textContent = `Filter added: ${FIELDS[suggestion.field].label} ${suggestion.op} ${valueLabel(suggestion.field, suggestion.value)}`;
    }
    this.#close();
    query.focus();
  }

  // `status:done` or `-label:docs` typed out in full.
  #typedFilter(raw) {
    const match = raw.match(/^(-?)(\w+):(\w+)$/);
    if (!match || !FIELDS[match[2]]) return null;
    const value = FIELDS[match[2]].values.find((each) => each.value.toLowerCase() === match[3].toLowerCase() || each.label.toLowerCase() === match[3].toLowerCase());
    return value ? { field: match[2], op: match[1] ? 'is not' : 'is', value: value.value } : null;
  }

  #removeAt(index) {
    const [removed] = this.filters.slice(index, index + 1);
    this.filters = this.filters.filter((_, i) => i !== index);
    if (removed) this.query('.live').textContent = `Filter removed: ${FIELDS[removed.field]?.label} ${removed.op} ${valueLabel(removed.field, removed.value)}`;
    this.query('.query').focus();
  }

  #key(event) {
    const input = event.target;
    const count = this.shadowRoot.querySelectorAll('.option').length;
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (step && count) {
      event.preventDefault();
      this.#active = (this.#active + step + count) % count;
      this.#paintActive();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const typed = this.#typedFilter(input.value.trim());
      if (typed) {
        this.filters = [...this.filters, typed];
        input.value = '';
        this.#close();
      } else if (this.#active < this.#suggestions.length) this.#pick(this.#active);
      else this.#close();
      this.#apply();
    } else if (event.key === 'Escape') {
      this.#close();
    } else if (event.key === 'Backspace' && !input.value && this.filters.length) {
      // The first press marks the last token, the second takes it.
      event.preventDefault();
      const last = this.shadowRoot.querySelector('.token:last-child');
      if (this.#armed) {
        this.#armed = false;
        this.#removeAt(this.filters.length - 1);
      } else {
        this.#armed = true;
        last?.toggleAttribute('data-armed', true);
      }
    }
  }

  #apply() {
    const query = this.query('.query').value.trim().toLowerCase();
    const text = this.#typedFilter(query) ? '' : query.replace(/^-/, '');
    const matches = this.issues.filter((issue) =>
      this.filters.every((filter) => (issue[filter.field] === filter.value) === (filter.op === 'is')) &&
      (!text || issue.title.toLowerCase().includes(text) || issue.id.toLowerCase().includes(text)));
    this.query('.issues').innerHTML = matches
      .map((issue) => `<li class="issue">${priorityIcon(issue.priority)}<span class="id">${escapeHtml(issue.id)}</span>${statusIcon(issue.status)}<span class="title">${escapeHtml(issue.title)}</span>${labelChip(issue.label)}${assigneeFace(issue.assignee)}</li>`)
      .join('');
    this.query('.empty').hidden = matches.length > 0;
    this.emit('change', { filters: this.filters, query: text, count: matches.length });
  }
}
