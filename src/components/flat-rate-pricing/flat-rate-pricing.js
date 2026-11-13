import { cellMarkup, comparisonStyles, watchScrollEdge } from '../../core/comparison.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight, check, pause } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import styles from './flat-rate-pricing.scss?inline';

const DEMO_COLUMNS = [
  { id: 'studio', label: 'Studio plan' },
  { id: 'hire', label: 'Full-time hire' },
  { id: 'freelance', label: 'Freelancers' },
];

const DEMO_ROWS = [
  { label: 'A senior designer on every request', values: { studio: true, hire: true, freelance: false } },
  { label: 'Unlimited requests and revisions', values: { studio: true, hire: true, freelance: false } },
  { label: 'Most requests back in two working days', values: { studio: true, hire: false, freelance: false } },
  { label: 'No recruiting, onboarding or notice period', values: { studio: true, hire: false, freelance: true } },
  { label: 'Pause or cancel any month', values: { studio: true, hire: false, freelance: true } },
  { label: 'Cost', values: { studio: '$4,800 / month', hire: '$9,500+ / month', freelance: '$80–150 / hour' } },
];

/**
 * One flat price with everything included: the price on a grainy card in
 * the opposite scheme, with what is billed at cost, what you get and the
 * button, then the promise to pause any month, then a table setting your
 * offer against the alternatives a buyer would otherwise weigh. Your column
 * comes first, tinted and checked in solid circles; on a narrow screen the
 * features stay put as the table scrolls, and its edge fades while there
 * is more.
 *
 * Give the card a colour of its own with `--lw-flat-rate-pricing-tone` and
 * the text on it with `--lw-flat-rate-pricing-on-tone`.
 *
 * Columns are `{ id, label }`, your offer first; rows are `{ label, values }`,
 * `values` keyed by column id: `true`, `false` or text.
 *
 * @attr {string} heading - Short, set in capitals
 * @attr {string} label - The plan's name on the card
 * @attr {string} price
 * @attr {string} period
 * @attr {string} note - What is billed outside the price
 * @attr {string} body - What the price buys
 * @attr {string} action
 * @attr {string} guarantee-title
 * @attr {string} guarantee
 * @attr {string} pill - Beside the guarantee
 * @attr {Array<object>} columns (JSON)
 * @attr {Array<object>} rows (JSON)
 * @fires lw-choose - The action was pressed
 * @csspart card
 * @cssprop --lw-flat-rate-pricing-tone - The card's colour; the foreground by default
 * @cssprop --lw-flat-rate-pricing-on-tone - Text on the card; the background by default
 */
export class LwFlatRatePricing extends LwElement {
  static styles = [comparisonStyles, styles];
  static props = {
    heading: { default: 'One price. Design included.' },
    label: { default: 'Studio plan' },
    price: { default: '$4,800' },
    period: { default: '/ month' },
    note: { default: 'Fonts and stock images billed at cost.' },
    body: { default: 'Unlimited design requests, handled one at a time by a senior designer and delivered in two working days. Brand, product, web and campaigns, all for one monthly fee.' },
    action: { default: 'Book an intro call' },
    guaranteeTitle: { default: 'Pause any month' },
    guarantee: { default: 'Queue empty for a while? Hold your subscription and pick up where you left off, with the days you paid for still waiting.' },
    pill: { default: 'Cancel anytime' },
    columns: { type: Object, default: DEMO_COLUMNS },
    rows: { type: Object, default: DEMO_ROWS },
  };

  render() {
    return `<section class="wrap" aria-labelledby="heading"><h2 class="title" id="heading"></h2>
<div class="card" part="card"><div class="price-side"><span class="label"></span><p class="price"><span class="amount"></span><span class="period"></span></p><p class="note"></p></div>
<div class="pitch"><p class="body"></p><lw-button class="action"><span class="action-text"></span><span class="well" slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button></div></div>
<div class="promise"><span class="promise-icon">${strokeIcon(pause, 16)}</span><div class="promise-text"><h3 class="promise-title"></h3><p class="promise-body"></p></div><span class="pill">${strokeIcon(check, 14, 2.5)}<span class="pill-text"></span></span></div>
<div class="scroller" tabindex="0" role="region" aria-label="How the plan compares"><table class="table"><thead></thead><tbody></tbody></table></div></section>`;
  }

  connected() {
    this.query('.action').addEventListener('click', () => this.emit('choose'), { signal: this.signal });
    watchScrollEdge(this.query('.scroller'), this.signal);
  }

  updated(changed) {
    const text = (selector, value) => {
      const element = this.query(selector);
      element.textContent = value ?? '';
      element.hidden = !value;
    };
    text('.title', this.heading);
    text('.label', this.label);
    this.query('.amount').textContent = this.price ?? '';
    this.query('.period').textContent = this.period ?? '';
    text('.note', this.note);
    text('.body', this.body);
    this.query('.action-text').textContent = this.action ?? '';
    text('.promise-title', this.guaranteeTitle);
    text('.promise-body', this.guarantee);
    this.query('.pill-text').textContent = this.pill ?? '';
    this.query('.pill').hidden = !this.pill;
    this.query('.promise').hidden = !this.guaranteeTitle && !this.guarantee;
    if (changed.has('columns') || changed.has('rows')) this.#buildTable();
  }

  #buildTable() {
    const columns = Array.isArray(this.columns) ? this.columns : [];
    const rows = Array.isArray(this.rows) ? this.rows : [];
    this.query('.scroller').hidden = !columns.length || !rows.length;
    this.query('.table').style.setProperty('--_count', String(columns.length || 1));
    this.query('thead').innerHTML = `<tr><td class="corner"></td>${columns.map((column, i) => `<th scope="col"${i === 0 ? ' class="ours"' : ''}>${escapeHtml(column.label)}</th>`).join('')}</tr>`;
    this.query('tbody').innerHTML = rows
      .map((row) => `<tr><th scope="row">${escapeHtml(row.label)}</th>${columns.map((column, i) => `<td${i === 0 ? ' class="ours"' : ''}>${cellMarkup(row.values?.[column.id] ?? false)}</td>`).join('')}</tr>`)
      .join('');
  }
}
