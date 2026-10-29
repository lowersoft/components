import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight, check } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf, initialsOf } from '../../core/people.js';
import { billingToggle, formatMoney, paintBilling, paintPrice, priceMarkup, pricingStyles, wireBilling } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import styles from './single-plan-pricing.scss?inline';

const DEMO_PRICES = { monthly: 12, yearly: 96, lifetime: 199 };

const DEMO_FEATURES = [
  { title: 'Unlimited profiling sessions' },
  { title: 'Full trace toolkit', detail: 'Flame graphs, allocations, locks and syscalls' },
  { title: 'Shareable trace links', detail: 'Set links to expire after a day, a week or never' },
  { title: 'Remote symbol server' },
  { title: 'Turn a hot path into a benchmark' },
  { title: 'Custom shortcuts and presets' },
  { title: 'Use on up to 3 machines', detail: 'Add more seats any time' },
  { title: 'Priority email support', detail: 'Replies within one business day' },
];

const DEMO_TEAM = ['Mia Tanaka', 'Tom Green', 'Rosa Silva', 'Leo Vance'];

/**
 * One product, one plan, three ways to pay: monthly, yearly with what it
 * saves, or once for life. The price rolls between them and the line under
 * it says how it is billed; everything included sits beside it.
 *
 * Prices are `{ monthly, yearly, lifetime }`, `yearly` for the whole year;
 * leave one out to drop that option. Features are `{ title, detail? }`.
 *
 * @attr {string} product
 * @attr {string} description
 * @attr {'monthly'|'yearly'|'lifetime'} billing
 * @attr {object} prices (JSON)
 * @attr {Array<object>} features (JSON)
 * @attr {Array<string>} team - Faces by the social proof (JSON)
 * @attr {string} proof - "Used by …"
 * @attr {string} action
 * @attr {string} guarantee
 * @fires lw-change - Billing changed; `detail: { billing }`
 * @fires lw-choose - The action was chosen; `detail: { billing, price }`
 */
export class LwSinglePlanPricing extends LwElement {
  static styles = [rollingStyles, pricingStyles, styles];
  static props = {
    product: { default: 'Lower Pro' },
    description: { default: 'Profile, trace and fix native code without leaving your editor.' },
    billing: { default: 'yearly', reflect: true },
    prices: { type: Object, default: DEMO_PRICES },
    features: { type: Object, default: DEMO_FEATURES },
    team: { type: Object, default: DEMO_TEAM },
    proof: { default: 'Used by 2,400 teams' },
    action: { default: 'Start 14-day trial' },
    guarantee: { default: '30-day money-back guarantee' },
  };

  render() {
    const { monthly, yearly, lifetime } = this.prices ?? {};
    const labels = {};
    if (monthly != null) labels.monthly = 'Monthly';
    if (yearly != null) labels.yearly = monthly ? `Yearly <span class="save">−${Math.round((1 - yearly / (monthly * 12)) * 100)}%</span>` : 'Yearly';
    if (lifetime != null) labels.lifetime = 'Lifetime';
    return `<header class="head"><h2 class="product"></h2><p class="proof"><span class="faces"></span><span class="proof-text"></span></p></header>
<div class="card"><div class="buy">${billingToggle(labels)}<p class="price">${priceMarkup()}</p><p class="billed"></p><p class="description"></p>
<button class="action" type="button"><span class="action-text"></span><span class="arrow">${strokeIcon(arrowRight, 16)}</span></button><p class="guarantee"></p></div>
<section class="included" aria-labelledby="included-title"><h3 class="included-title" id="included-title">Everything included</h3><ul class="features"></ul></section></div>`;
  }

  connected() {
    wireBilling(this);
    this.query('.action').addEventListener('click', () => this.emit('choose', { billing: this.billing, price: this.prices[this.billing] }), { signal: this.signal });
  }

  updated(changed) {
    this.query('.product').textContent = this.product ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.proof-text').textContent = this.proof ?? '';
    this.query('.guarantee').textContent = this.guarantee ?? '';
    if (changed.has('team')) {
      this.query('.faces').innerHTML = (this.team ?? []).map((name) => `<span class="face" style="--_hue: ${hueOf(name)}" title="${escapeHtml(name)}">${escapeHtml(initialsOf(name))}</span>`).join('');
    }
    if (changed.has('features')) {
      this.query('.features').innerHTML = (this.features ?? [])
        .map((feature) => `<li>${strokeIcon(check, 16)}<span><span class="feature">${escapeHtml(feature.title)}</span>${feature.detail ? `<span class="detail">${escapeHtml(feature.detail)}</span>` : ''}</span></li>`)
        .join('');
    }
    paintBilling(this);
    this.#paintPrice();
  }

  // Yearly shows as a month of the year; lifetime as the one payment.
  #paintPrice() {
    const prices = this.prices ?? {};
    const billing = this.billing in prices ? this.billing : Object.keys(prices)[0];
    const price = prices[billing];
    const shown = billing === 'yearly' ? Math.round(price / 12) : price;
    paintPrice(this.query('.amount'), shown);
    this.query('.billed').textContent = {
      monthly: 'per month, billed monthly',
      yearly: `per month, billed ${formatMoney(price)} yearly`,
      lifetime: 'once, yours for good',
    }[billing];
    this.query('.action-text').textContent = billing === 'lifetime' ? `Buy once for ${formatMoney(price)}` : this.action ?? '';
  }
}
