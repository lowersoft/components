import { cellMarkup, comparisonStyles, markMarkup } from '../../core/comparison.js';
import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './features-matrix.scss?inline';

const DEMO_PRODUCTS = [
  { id: 'lumen', name: 'Lumen', mark: 'lumen' },
  { id: 'arcadia', name: 'Arcadia', mark: 'arcadia' },
  { id: 'halcyon', name: 'Halcyon', mark: 'halcyon' },
];

const DEMO_ROWS = [
  { id: 'price', title: 'Price', description: 'Per user, per month, billed yearly', values: { lumen: '$12', arcadia: '$15', halcyon: '$10' } },
  { id: 'storage', title: 'Storage', description: 'Included per workspace', values: { lumen: '1 TB', arcadia: '500 GB', halcyon: '2 TB' } },
  { id: 'upload', title: 'Largest upload', description: 'One file, before it is split', values: { lumen: '5 GB', arcadia: '250 MB', halcyon: '2 GB' } },
  { id: 'history', title: 'Version history', description: 'How long old versions are kept', values: { lumen: '1 year', arcadia: '30 days', halcyon: '90 days' } },
  { id: 'api', title: 'API rate limit', description: 'Requests per minute, per key', values: { lumen: '1,200', arcadia: '600', halcyon: '300' } },
  { id: 'uptime', title: 'Uptime commitment', description: 'Credited when missed', values: { lumen: '99.95%', arcadia: '99.9%', halcyon: false } },
  { id: 'sso', title: 'Single sign-on', description: 'SAML and OIDC login', values: { lumen: true, arcadia: false, halcyon: true } },
  { id: 'support', title: 'Support', description: 'Fastest channel on this plan', values: { lumen: 'Live chat', arcadia: 'Email', halcyon: 'Email' } },
];

const SIZES = { b: 1, kb: 1e3, mb: 1e6, gb: 1e9, tb: 1e12, pb: 1e15 };
const SPANS = { hour: 1 / 24, hours: 1 / 24, day: 1, days: 1, week: 7, weeks: 7, month: 30, months: 30, year: 365, years: 365 };

// What a value means for comparing: a price (lower wins), or a size, span,
// percentage or count (higher wins). Anything else is not compared.
const measure = (value) => {
  if (typeof value !== 'string') return null;
  const text = value.trim().toLowerCase().replace(/,/g, '');
  let match = text.match(/^[$€£¥]\s?(\d+(?:\.\d+)?)/);
  if (match) return { kind: 'price', amount: Number(match[1]) };
  match = text.match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb|tb|pb)$/);
  if (match) return { kind: 'size', amount: Number(match[1]) * SIZES[match[2]] };
  match = text.match(/^(\d+(?:\.\d+)?)\s*(hours?|days?|weeks?|months?|years?)$/);
  if (match) return { kind: 'span', amount: Number(match[1]) * SPANS[match[2]] };
  match = text.match(/^(\d+(?:\.\d+)?)\s*%$/);
  if (match) return { kind: 'percent', amount: Number(match[1]) };
  match = text.match(/^(\d+(?:\.\d+)?)\s*([km])?$/);
  if (match) return { kind: 'count', amount: Number(match[1]) * ({ k: 1e3, m: 1e6 }[match[2]] ?? 1) };
  return null;
};

/**
 * Which products have the best value in a row: the lowest price, or the
 * most of anything else; `row.better` can say `lower` or `higher` instead.
 * Rows mixing kinds of value, or where every value is the same, have none.
 */
export const winners = (row, ids) => {
  const measured = ids.map((id) => [id, measure(row.values?.[id])]).filter(([, m]) => m);
  if (measured.length < 2 || new Set(measured.map(([, m]) => m.kind)).size > 1) return new Set();
  if (measured.length < ids.filter((id) => row.values?.[id] !== false).length) return new Set();
  const lower = row.better ? row.better === 'lower' : measured[0][1].kind === 'price';
  const amounts = measured.map(([, m]) => m.amount);
  const best = lower ? Math.min(...amounts) : Math.max(...amounts);
  if (amounts.every((amount) => amount === best)) return new Set();
  return new Set(measured.filter(([, m]) => m.amount === best).map(([id]) => id));
};

/**
 * A comparison of products feature by feature, on a hairline grid with the
 * products' marks across the top. In each row the best value stands out
 * and the rest step back: the lowest price, or the most storage, time,
 * headroom or uptime, with sizes and spans converted before comparing. A
 * missing feature shows a crossed circle read as "Not included". Hovering
 * a row lights it; on narrow screens the grid scrolls with the features
 * pinned.
 *
 * Products are `{ id, name, mark?, href? }`, `mark` one of the built-in
 * demo marks or `<svg>` markup. Rows are `{ id, title, description?,
 * better?, values }`, `values` keyed by product id: text, `true` for
 * included or `false` for not. Keep one kind of value to a row.
 *
 * @attr {string} heading
 * @attr {string} lede - A line under the heading; say where the figures come from
 * @attr {Array<object>} products (JSON)
 * @attr {Array<object>} rows (JSON)
 * @csspart table - The grid
 */
export class LwFeaturesMatrix extends LwElement {
  static styles = [comparisonStyles, styles];
  static props = {
    heading: { default: 'How the tools compare' },
    lede: { default: 'Figures from each product’s public pricing page for its mid-tier plan. Best in each row is highlighted.' },
    products: { type: Object, default: DEMO_PRODUCTS },
    rows: { type: Object, default: DEMO_ROWS },
  };

  render() {
    return '<section class="section" aria-labelledby="heading"><h2 class="heading" id="heading"></h2><p class="lede"></p><div class="scroller" tabindex="0" role="region" aria-labelledby="heading"><div class="table" part="table" role="table"></div></div></section>';
  }

  updated() {
    this.query('.heading').textContent = this.heading ?? '';
    const lede = this.query('.lede');
    lede.textContent = this.lede ?? '';
    lede.hidden = !this.lede;
    const products = Array.isArray(this.products) ? this.products : [];
    const rows = Array.isArray(this.rows) ? this.rows : [];
    const ids = products.map((product) => product.id);
    const table = this.query('.table');
    table.style.setProperty('--_count', String(products.length));
    const name = (product) => `${markMarkup(product.mark, 22)}<span class="product-name">${escapeHtml(product.name)}</span>`;
    const head = `<div class="row head" role="row"><div class="cell corner" role="columnheader"><span class="visually-hidden">Feature</span></div>${products
      .map((product) => `<div class="cell product" role="columnheader">${product.href ? `<a class="product-link" href="${escapeHtml(product.href)}" aria-label="${escapeHtml(product.name)}">${name(product)}</a>` : name(product)}</div>`)
      .join('')}</div>`;
    const body = rows
      .map((row) => {
        const best = winners(row, ids);
        const hasWinner = best.size > 0;
        return `<div class="row" role="row"><div class="cell feature" role="rowheader"><span class="title">${escapeHtml(row.title)}</span>${row.description ? `<span class="description">${escapeHtml(row.description)}</span>` : ''}</div>${ids
          .map((id) => {
            const state = !hasWinner ? '' : best.has(id) ? ' best' : ' behind';
            return `<div class="cell value${state}" role="cell">${cellMarkup(row.values?.[id] ?? false)}${best.has(id) ? '<span class="visually-hidden"> (best)</span>' : ''}</div>`;
          })
          .join('')}</div>`;
      })
      .join('');
    table.innerHTML = head + body;
  }
}
