import { escapeHtml } from '../../core/dom.js';
import { moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import styles from './filter-headline.scss?inline';

const DEMO_FILTERS = [
  { id: 'runtime', label: 'Runtime', count: 17 },
  { id: 'engineering', label: 'Engineering', count: 14 },
  { id: 'performance', label: 'Performance', count: 11 },
  { id: 'company', label: 'Company', count: 6 },
];

/**
 * A section heading that filters what follows: the title carries the count
 * of what is shown, the filters carry their own, and the count rolls to
 * the chosen one. "View all" sits at the end of the row.
 *
 * Filters are `{ id, label, count }`; "All" adds them up.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} filter - The chosen filter's id; empty for all
 * @attr {Array<object>} filters (JSON)
 * @attr {string} all-href - Where "View all" goes
 * @fires lw-change - The filter changed; `detail: { filter, count }`
 */
export class LwFilterHeadline extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    heading: { default: 'From the journal' },
    description: { default: 'How we build the runtime, the decisions behind it and what we learned shipping it.' },
    filter: { default: '', reflect: true },
    filters: { type: Object, default: DEMO_FILTERS },
    allHref: { default: '#' },
  };

  render() {
    return `<header class="intro"><h2 class="title"><span class="title-text"></span><span class="badge"><span class="visually-hidden count-text"></span><span class="rolling" aria-hidden="true"></span></span></h2><p class="description"></p></header>
<div class="row"><div class="filters" role="radiogroup" aria-label="Filter"><span class="filter-pill"></span></div><a class="all"><span>View all</span>${strokeIcon(arrowRight, 16)}</a></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const filters = this.query('.filters');
    filters.addEventListener('click', (event) => {
      const filter = event.target.closest('.filter');
      if (filter) this.#choose(filter.dataset.id);
    }, options);
    filters.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const all = [...filters.querySelectorAll('.filter')];
      const next = all[(all.findIndex((each) => each.ariaChecked === 'true') + step + all.length) % all.length];
      this.#choose(next.dataset.id);
      next.focus();
    }, options);
    const observer = new ResizeObserver(() => this.#paint());
    observer.observe(filters);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    this.query('.title-text').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.all').href = this.allHref ?? '#';
    if (changed.has('filters')) {
      const filters = this.query('.filters');
      filters.querySelectorAll('.filter').forEach((each) => each.remove());
      filters.insertAdjacentHTML('beforeend', [{ id: '', label: 'All', count: this.#total }, ...(this.filters ?? [])]
        .map((filter) => `<button class="filter" type="button" role="radio" data-id="${escapeHtml(filter.id)}">${escapeHtml(filter.label)}<span class="filter-count">${filter.count}</span></button>`)
        .join(''));
    }
    this.#paint();
  }

  get #total() {
    return (this.filters ?? []).reduce((sum, filter) => sum + filter.count, 0);
  }

  get #count() {
    return this.filters.find((filter) => filter.id === this.filter)?.count ?? this.#total;
  }

  #paint() {
    let chosen = null;
    for (const filter of this.shadowRoot.querySelectorAll('.filter')) {
      const checked = filter.dataset.id === (this.filter ?? '');
      filter.ariaChecked = String(checked);
      filter.tabIndex = checked ? 0 : -1;
      if (checked) chosen = filter;
    }
    if (chosen?.offsetWidth) moveHighlight(this.query('.filter-pill'), chosen);
    const count = String(this.#count);
    this.query('.count-text').textContent = `, ${count}`;
    roll(this.query('.badge .rolling'), count);
  }

  #choose(id) {
    if (id === (this.filter ?? '')) return;
    this.filter = id;
    this.emit('change', { filter: id, count: this.#count });
  }
}
