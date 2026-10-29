import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { companyMarkup, drawFace, quoteMarkup } from '../../core/testimonial.js';
import styles from './testimonial-grid.scss?inline';

const MOVE = { duration: 450, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };

const DEMO_ITEMS = [
  { tag: 'Engineering', wide: true, company: { name: 'Northwind', color: '#3b6ef5' }, source: 'G2 · Sep 2026', quote: 'We deleted four thousand lines of homegrown glue in a week. What replaced it is ==code our team actually reads, profiles and owns==.', person: { name: 'Maya Okafor', role: 'Staff Engineer, Northwind' } },
  { tag: 'Founders', company: { name: 'Lumen', color: '#e5484d' }, stat: '4 days', label: 'from first commit to running in production', bars: [9, 9, 8, 7, 5, 3, 2], highlight: 2, from: 'First build', to: 'Latest', person: { name: 'Theo Laurent', role: 'Founder, Lumen' } },
  { tag: 'Engineering', company: { name: 'Halcyon', color: '#12a594' }, source: 'Product Hunt · Oct 2026', quote: 'Startup time, memory and tail latency finally match the budget, so ==review is about the product again== instead of the allocator.', person: { name: 'Iris Novak', role: 'Engineering Lead, Halcyon' } },
  { tag: 'Engineering', company: { name: 'Parcel', color: '#f76b15' }, source: 'G2 · Aug 2026', quote: 'Our sanitizer run came back with ==two findings==. The year before it was forty.', person: { name: 'Sam Whitfield', role: 'Systems Engineer, Parcel' } },
  { tag: 'Performance', company: { name: 'Fieldnote', color: '#8e4ec6' }, stat: '−38%', label: 'peak memory on the ingest service', bars: [8, 8.4, 7.8, 7.8, 5.2, 5, 4.9], highlight: 3, from: 'Mar', to: 'Sep', person: { name: 'Priya Raman', role: 'Performance Engineer, Fieldnote' } },
  { tag: 'Founders', company: { name: 'Arcadia', color: '#30a46c' }, source: 'Capterra · Sep 2026', quote: 'It paid for itself ==in the first sprint==. We now run on half the machines we had.', person: { name: 'Jonas Berg', role: 'CEO, Arcadia' } },
  { tag: 'Performance', company: { name: 'Mosaic', color: '#d6409f' }, source: 'G2 · Oct 2026', quote: 'Every hot path has a benchmark in CI, which ==used to be the last week of every release==.', person: { name: 'Lea Fontaine', role: 'Performance Lead, Mosaic' } },
  { tag: 'Engineering', company: { name: 'Tandem', color: '#0090ff' }, source: 'Product Hunt · Sep 2026', quote: 'The source is plain C with no runtime. When we needed a variant, ==we just wrote it==.', person: { name: 'Ravi Shah', role: 'Engineer, Tandem' } },
];

const DEMO_RATING = { score: 4.9, reviews: 1284, faces: ['Maya Okafor', 'Theo Laurent', 'Iris Novak', 'Ravi Shah'] };

const whole = new Intl.NumberFormat('en-US');

/**
 * What customers say, in a bento grid: quotes with the phrase that matters
 * marked in the company's colour, and numbers with the bars behind them.
 * The filter keeps one kind of story; the cards that stay glide to their
 * new places.
 *
 * Items are `{ tag, company: { name, color }, person: { name, role } }`
 * plus either `{ quote, source?, wide? }`, with `==phrase==` marked, or
 * `{ stat, label, bars, highlight, from, to }`, the last `highlight` bars
 * in colour.
 *
 * @attr {string} heading
 * @attr {object} rating - `{ score, reviews, faces }` (JSON)
 * @attr {string} filter - The tag shown; empty for all
 * @attr {Array<object>} items (JSON)
 * @fires lw-change - The filter changed; `detail: { filter }`
 */
export class LwTestimonialGrid extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Teams that switched, in their own words' },
    rating: { type: Object, default: DEMO_RATING },
    filter: { default: '', reflect: true },
    items: { type: Object, default: DEMO_ITEMS },
  };

  render() {
    return `<header class="head"><div><h2 class="title"></h2><p class="rating"><span class="faces"></span><span class="stars" aria-hidden="true">★★★★★</span><span class="score"></span><span class="reviews"></span></p></div>
<div class="filters" role="radiogroup" aria-label="Show"><span class="filter-pill"></span></div></header><div class="grid"></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const filters = this.query('.filters');
    filters.addEventListener('click', (event) => {
      const filter = event.target.closest('.filter');
      if (filter) this.#choose(filter.dataset.tag);
    }, options);
    filters.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const all = [...filters.querySelectorAll('.filter')];
      const next = all[(all.findIndex((each) => each.ariaChecked === 'true') + step + all.length) % all.length];
      this.#choose(next.dataset.tag);
      next.focus();
    }, options);
    const observer = new ResizeObserver(() => this.#paintFilters());
    observer.observe(filters);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    if (changed.has('rating')) this.#paintRating();
    if (changed.has('items')) this.#build();
    this.#paintFilters();
    this.#applyFilter(!changed.has('items'));
  }

  #paintRating() {
    const rating = this.rating ?? {};
    const faces = this.query('.faces');
    faces.replaceChildren();
    for (const name of rating.faces ?? []) {
      const face = Object.assign(document.createElement('span'), { className: 'face' });
      drawFace(face, name);
      faces.append(face);
    }
    this.query('.score').textContent = String(rating.score ?? '');
    this.query('.reviews').textContent = rating.reviews ? `from ${whole.format(rating.reviews)} reviews` : '';
    this.query('.rating').ariaLabel = `Rated ${rating.score} out of 5 from ${whole.format(rating.reviews ?? 0)} reviews`;
  }

  #build() {
    const items = this.items ?? [];
    const counts = new Map();
    for (const item of items) counts.set(item.tag, (counts.get(item.tag) ?? 0) + 1);
    const filters = this.query('.filters');
    filters.querySelectorAll('.filter').forEach((each) => each.remove());
    filters.insertAdjacentHTML('beforeend', [['', 'All', items.length], ...[...counts].map(([tag, count]) => [tag, tag, count])]
      .map(([tag, label, count]) => `<button class="filter" type="button" role="radio" data-tag="${escapeHtml(tag)}">${escapeHtml(label)}<span class="filter-count">${count}</span></button>`)
      .join(''));

    const grid = this.query('.grid');
    grid.innerHTML = items.map((item, i) => this.#card(item, i)).join('');
    grid.querySelectorAll('.card').forEach((card, i) => drawFace(card.querySelector('.face'), items[i].person?.name));
  }

  #card(item, i) {
    const person = `<footer class="person"><span class="face"></span><span><span class="person-name">${escapeHtml(item.person?.name ?? '')}</span><span class="person-role">${escapeHtml(item.person?.role ?? '')}</span></span></footer>`;
    const head = `<header class="card-head">${companyMarkup(item.company)}${item.source ? `<span class="source">${escapeHtml(item.source)}</span>` : ''}</header>`;
    const tint = `--_tint: ${escapeHtml(item.company?.color ?? 'currentColor')}`;
    if (item.stat) {
      const max = Math.max(...item.bars);
      const bars = item.bars.map((value, b) => `<span class="bar"${b >= item.bars.length - item.highlight ? ' data-on' : ''} style="height: ${(value / max) * 100}%"></span>`).join('');
      return `<figure class="card stat" data-index="${i}" style="${tint}">${head}<p class="figure">${escapeHtml(item.stat)}</p><p class="label">${escapeHtml(item.label)}</p>
<div class="bars" aria-hidden="true">${bars}</div><p class="ends" aria-hidden="true"><span>${escapeHtml(item.from)}</span><span>${escapeHtml(item.to)}</span></p>${person}</figure>`;
    }
    return `<figure class="card quote${item.wide ? ' wide' : ''}" data-index="${i}" style="${tint}">${head}<blockquote class="text">${quoteMarkup(item.quote)}</blockquote>${person}</figure>`;
  }

  #paintFilters() {
    let chosen = null;
    for (const filter of this.shadowRoot.querySelectorAll('.filter')) {
      const checked = filter.dataset.tag === (this.filter ?? '');
      filter.ariaChecked = String(checked);
      filter.tabIndex = checked ? 0 : -1;
      if (checked) chosen = filter;
    }
    const pill = this.query('.filter-pill');
    if (chosen?.offsetWidth) moveHighlight(pill, chosen);
    else hideHighlight(pill);
  }

  // Hides the cards of other tags; the rest glide from where they were.
  #applyFilter(animate) {
    const cards = [...this.shadowRoot.querySelectorAll('.card')];
    const before = new Map(cards.filter((card) => !card.hidden).map((card) => [card, card.getBoundingClientRect()]));
    for (const card of cards) card.hidden = Boolean(this.filter) && this.items[Number(card.dataset.index)].tag !== this.filter;
    if (!animate || reducedMotion.matches) return;
    for (const card of cards) {
      if (card.hidden) continue;
      const from = before.get(card);
      if (!from) {
        card.animate({ opacity: [0, 1], scale: [0.97, 1] }, MOVE);
        continue;
      }
      const to = card.getBoundingClientRect();
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      if (dx || dy) card.animate({ translate: [`${dx}px ${dy}px`, '0 0'] }, MOVE);
    }
  }

  #choose(tag) {
    if (tag === (this.filter ?? '')) return;
    this.filter = tag;
    this.emit('change', { filter: tag });
  }
}
