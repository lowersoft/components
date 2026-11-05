import { cellMarkup, comparisonStyles } from '../../core/comparison.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { billingToggle, paintBilling, paintPrice, priceMarkup, pricingStyles, wireBilling } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import '../underline-animation/index.js';
import styles from './pricing-matrix.scss?inline';

const DEMO_PLANS = [
  { id: 'basic', name: 'Basic', tagline: 'For small teams getting organised', monthly: 12, annual: 10, action: 'Start trial' },
  { id: 'plus', name: 'Plus', tagline: 'For growing teams that ship weekly', monthly: 24, annual: 20, action: 'Start trial', wash: 'sky' },
  { id: 'pro', name: 'Pro', tagline: 'For companies that need control', monthly: 48, annual: 40, action: 'Talk to sales', wash: 'sand', flagged: true },
];

const DEMO_GROUPS = [
  { id: 'usage', label: 'Usage', rows: [
    { id: 'seats', label: 'Team members', values: { basic: 'Up to 10', plus: 'Up to 50', pro: 'Unlimited' } },
    { id: 'storage', label: 'Storage', values: { basic: '50 GB', plus: '1 TB', pro: '5 TB' } },
    { id: 'projects', label: 'Projects', values: { basic: '10', plus: 'Unlimited', pro: 'Unlimited' } },
    { id: 'api', label: 'API calls a month', values: { basic: '100k', plus: '1M', pro: '10M' } },
  ] },
  { id: 'essentials', label: 'Essentials', rows: [
    { id: 'domains', label: 'Custom domains', values: { basic: false, plus: true, pro: true } },
    { id: 'history', label: 'Version history', values: { basic: '30 days', plus: '1 year', pro: 'Forever' } },
    { id: 'comments', label: 'Comments and mentions', values: { basic: true, plus: true, pro: true } },
    { id: 'integrations', label: 'Integrations', values: { basic: '5', plus: 'All', pro: 'All' } },
  ] },
  { id: 'advanced', label: 'Advanced', rows: [
    { id: 'sso', label: 'Single sign-on', values: { basic: false, plus: false, pro: true } },
    { id: 'audit', label: 'Audit log', values: { basic: false, plus: true, pro: true } },
    { id: 'roles', label: 'Custom roles', values: { basic: false, plus: false, pro: true } },
    { id: 'sla', label: 'Uptime SLA', values: { basic: false, plus: '99.9%', pro: '99.99%' } },
  ] },
];

/**
 * Your plans side by side on one long sheet: prices and a call to action
 * across the top, then every feature in labelled groups. A plan can carry a
 * full-height wash of color, sky or sand, and a small corner flag for the
 * one to point people at. An Annual / Monthly switch sits under the heading,
 * and switching rolls each price to its new amount. Cells hold a check, a
 * short value, or a crossed circle read as "Not included". On narrow
 * screens the sheet scrolls sideways with the features pinned.
 *
 * Plans are `{ id, name, tagline?, monthly, annual, action, href?, wash?,
 * flagged? }`, prices per user per month. Groups are `{ id, label, rows:
 * [{ id, label, values }] }`, `values` keyed by plan id: text, `true` or
 * `false`.
 *
 * @attr {string} heading
 * @attr {'yearly'|'monthly'} billing
 * @attr {Array<object>} plans (JSON)
 * @attr {Array<object>} groups (JSON)
 * @fires lw-change - Billing changed; `detail: { billing }`
 * @fires lw-choose - A plan's action was chosen; `detail: { plan, billing }`
 * @csspart sheet - The grid
 */
export class LwPricingMatrix extends LwElement {
  static styles = [rollingStyles, pricingStyles, comparisonStyles, styles];
  static props = {
    heading: { default: 'Simple pricing' },
    billing: { default: 'yearly', reflect: true },
    plans: { type: Object, default: DEMO_PLANS },
    groups: { type: Object, default: DEMO_GROUPS },
  };

  render() {
    return `<section class="section"><div class="scroller" tabindex="0" role="region" aria-labelledby="heading"><div class="sheet" part="sheet"><div class="corner"><h2 class="heading" id="heading"></h2>${billingToggle({ yearly: 'Annual', monthly: 'Monthly' })}</div></div></div></section>`;
  }

  connected() {
    wireBilling(this);
    this.query('.sheet').addEventListener('click', (event) => {
      const action = event.target.closest('.action');
      if (action) this.emit('choose', { plan: action.dataset.plan, billing: this.billing });
    }, { signal: this.signal });
  }

  updated(changed) {
    this.query('.heading').textContent = this.heading ?? '';
    if (changed.has('plans') || changed.has('groups')) this.#build();
    paintBilling(this);
    this.#paintPrices();
  }

  get #plans() {
    return Array.isArray(this.plans) ? this.plans : [];
  }

  #build() {
    const plans = this.#plans;
    const groups = Array.isArray(this.groups) ? this.groups : [];
    const sheet = this.query('.sheet');
    sheet.style.setProperty('--_count', String(plans.length));
    const corner = this.query('.corner');
    const wash = (plan) => (plan.wash === 'sky' || plan.wash === 'sand' ? ` wash ${plan.wash}` : '');
    const heads = plans
      .map(
        (plan) => `<div class="cell plan${wash(plan)}${plan.flagged ? ' flagged' : ''}" data-plan="${escapeHtml(plan.id)}"><h3 class="plan-name">${escapeHtml(plan.name)}${plan.flagged ? '<span class="visually-hidden"> (recommended)</span>' : ''}</h3>${plan.tagline ? `<p class="tagline">${escapeHtml(plan.tagline)}</p>` : ''}<p class="price">${priceMarkup()}<span class="per">/ user / month</span></p><p class="billed">billed annually</p><lw-underline-animation class="action" data-plan="${escapeHtml(plan.id)}" ${plan.href ? `href="${escapeHtml(plan.href)}"` : 'as="button"'} variant="slide">${escapeHtml(plan.action ?? 'Choose')} <span class="action-arrow" aria-hidden="true">${strokeIcon(arrowRight, 14)}</span></lw-underline-animation></div>`,
      )
      .join('');
    const lastGroup = groups.length - 1;
    const body = groups
      .map((group, g) => {
        const label = `<div class="cell group-label">${escapeHtml(group.label)}</div>${plans.map((plan) => `<div class="cell group-gap${wash(plan)}"></div>`).join('')}`;
        const rows = group.rows
          .map((row, r) => {
            const last = g === lastGroup && r === group.rows.length - 1 ? ' last' : '';
            return `<div class="cell label${last}">${escapeHtml(row.label)}</div>${plans.map((plan) => `<div class="cell value${wash(plan)}${last}">${cellMarkup(row.values?.[plan.id] ?? false)}</div>`).join('')}`;
          })
          .join('');
        return label + rows;
      })
      .join('');
    sheet.replaceChildren(corner);
    sheet.insertAdjacentHTML('beforeend', heads + body);
  }

  #paintPrices() {
    const annual = this.billing !== 'monthly';
    for (const plan of this.#plans) {
      const cell = this.query(`.plan[data-plan="${CSS.escape(String(plan.id))}"]`);
      if (!cell) continue;
      paintPrice(cell.querySelector('.amount'), Number(annual ? plan.annual ?? plan.monthly : plan.monthly) || 0);
      cell.querySelector('.billed').classList.toggle('shown', annual);
    }
  }
}
