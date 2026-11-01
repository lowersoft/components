import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const CATEGORIES = [
  { id: 'runtime', label: 'Runtime' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'performance', label: 'Performance' },
  { id: 'company', label: 'Company' },
];

const POSTS = [
  { category: 'runtime', title: 'A scheduler that never blocks the main thread', date: 'Oct 14', read: 8 },
  { category: 'performance', title: 'Cutting cold starts from 420 ms to 90 ms', date: 'Oct 9', read: 11 },
  { category: 'engineering', title: 'How we review a change in under an hour', date: 'Oct 2', read: 6 },
  { category: 'runtime', title: 'Moving the allocator to size classes', date: 'Sep 27', read: 12 },
  { category: 'company', title: 'Why we went remote-first, three years on', date: 'Sep 19', read: 5 },
  { category: 'performance', title: 'Profiling SIMD paths without guessing', date: 'Sep 12', read: 9 },
  { category: 'engineering', title: 'Our release train, and when we pull the brake', date: 'Sep 5', read: 7 },
  { category: 'runtime', title: 'Garbage collection pauses you can plan around', date: 'Aug 29', read: 10 },
  { category: 'company', title: 'What we look for in a first-year engineer', date: 'Aug 21', read: 4 },
  { category: 'performance', title: 'The cache miss that cost us 30% throughput', date: 'Aug 14', read: 8 },
  { category: 'engineering', title: 'Writing design docs people actually read', date: 'Aug 6', read: 6 },
  { category: 'runtime', title: 'Threads, fibers and the cost of a switch', date: 'Jul 30', read: 9 },
];

// The filters carry the real counts of the posts below.
const FILTERS = CATEGORIES.map((category) => ({ ...category, count: POSTS.filter((post) => post.category === category.id).length }));
const labelOf = (id) => CATEGORIES.find((category) => category.id === id)?.label ?? id;

const card = (post) => `<li data-category="${post.category}" style="display: grid; gap: 0.5rem; align-content: start; padding: 1.25rem; border: 1px solid var(--lw-color-border); border-radius: 1rem; background: var(--lw-color-background)">
<span style="font-size: var(--lw-text-xs); color: var(--lw-color-muted-foreground)">${labelOf(post.category)} · ${post.date}</span>
<a href="#" style="font-size: var(--lw-text-md); font-weight: 500; line-height: 1.4; color: inherit; text-decoration: none">${post.title}</a>
<span style="font-size: var(--lw-text-xs); color: var(--lw-color-muted-foreground)">${post.read} min read</span></li>`;

export default {
  title: 'Headline/Filter Headline',
  component: 'lw-filter-headline',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 72rem; margin: 4rem auto"><lw-filter-headline ${attributes(args)}></lw-filter-headline></div>`,
  args: { filter: '' },
};

// Over the posts it filters: choose a filter and the count rolls to it while
// the list below narrows to match.
export const Default = {
  args: { filters: JSON.stringify(FILTERS) },
  render: (args) => {
    const section = document.createElement('section');
    section.style.cssText = 'max-width: 72rem; margin: 4rem auto';
    section.innerHTML = `<style>li[hidden] { display: none !important; }</style><lw-filter-headline ${attributes(args)}></lw-filter-headline>
<ul style="display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: 1rem; margin: 2.5rem 0 0; padding: 0; list-style: none">${POSTS.map(card).join('')}</ul>`;
    const show = (filter) => {
      for (const item of section.querySelectorAll('li')) item.hidden = Boolean(filter) && item.dataset.category !== filter;
    };
    section.addEventListener('lw-change', (event) => show(event.detail.filter));
    show(args.filter);
    return section;
  },
};

// The headline alone, with its own demo filters.
export const HeadlineOnly = {};
