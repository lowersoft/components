import { cellMarkup, comparisonStyles } from '../../core/comparison.js';
import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import styles from './compare-plans.scss?inline';

const DEMO_PLANS = [
  { id: 'starter', name: 'Starter', price: '$0', cadence: 'forever', action: 'Start free' },
  { id: 'professional', name: 'Professional', price: '$16', cadence: 'per user / month', action: 'Go Professional', featured: true },
  { id: 'enterprise', name: 'Enterprise', price: '$40', cadence: 'per user / month', action: 'Contact sales' },
];

const DEMO_ROWS = [
  { id: 'projects', label: 'Projects', values: { starter: '3', professional: 'Unlimited', enterprise: 'Unlimited' } },
  { id: 'members', label: 'Team members', values: { starter: '1', professional: 'Up to 20', enterprise: 'Unlimited' } },
  { id: 'storage', label: 'Storage', values: { starter: '2 GB', professional: '100 GB', enterprise: '1 TB' } },
  { id: 'history', label: 'Version history', values: { starter: false, professional: '30 days', enterprise: '1 year' } },
  { id: 'domains', label: 'Custom domains', values: { starter: false, professional: true, enterprise: true } },
  { id: 'roles', label: 'Admin roles', values: { starter: false, professional: false, enterprise: true } },
  { id: 'sso', label: 'Single sign-on', values: { starter: false, professional: false, enterprise: true } },
  { id: 'support', label: 'Priority support', values: { starter: false, professional: true, enterprise: true } },
];

/**
 * Your plans in one compact sheet: name, price and a button atop each
 * column, then a row per feature with a check, a limit, or a crossed circle
 * read as "Not included". The featured plan's name and price take the
 * accent color and its button is solid; the others are outlined. Hovering
 * a row lights it, and on narrow screens the sheet scrolls sideways with
 * the features pinned.
 *
 * Plans are `{ id, name, price, cadence, action, href?, featured? }`; rows
 * are `{ id, label, values }`, `values` keyed by plan id: text, `true` or
 * `false`.
 *
 * @attr {string} heading
 * @attr {string} lede - A line under the heading
 * @attr {Array<object>} plans (JSON)
 * @attr {Array<object>} rows (JSON)
 * @attr {string} accent - The featured plan's color; violet by default
 * @fires lw-choose - A plan's button was pressed; `detail: { plan }`
 * @csspart sheet
 * @cssprop --lw-compare-plans-accent - Same as `accent`
 */
export class LwComparePlans extends LwElement {
  static styles = [comparisonStyles, styles];
  static props = {
    heading: { default: 'Compare plans' },
    lede: { default: 'Start free and upgrade when your team grows. Every plan includes unlimited viewers.' },
    plans: { type: Object, default: DEMO_PLANS },
    rows: { type: Object, default: DEMO_ROWS },
    accent: {},
  };

  render() {
    return '<section class="section" aria-labelledby="heading"><h2 class="heading" id="heading"></h2><p class="lede"></p><div class="scroller" tabindex="0" role="region" aria-labelledby="heading"><div class="sheet" part="sheet" role="table"></div></div></section>';
  }

  connected() {
    this.query('.sheet').addEventListener('click', (event) => {
      const button = event.target.closest('.choose');
      if (button) this.emit('choose', { plan: button.dataset.plan });
    }, { signal: this.signal });
  }

  updated() {
    this.query('.heading').textContent = this.heading ?? '';
    const lede = this.query('.lede');
    lede.textContent = this.lede ?? '';
    lede.hidden = !this.lede;
    if (this.accent) this.style.setProperty('--_accent', this.accent);
    else this.style.removeProperty('--_accent');
    const plans = Array.isArray(this.plans) ? this.plans : [];
    const rows = Array.isArray(this.rows) ? this.rows : [];
    const sheet = this.query('.sheet');
    sheet.style.setProperty('--_count', String(plans.length));
    const button = (plan) => {
      const label = escapeHtml(plan.action ?? 'Choose');
      const variant = plan.featured ? 'primary' : 'outline';
      // A link styled as the button when the plan has somewhere to go.
      return plan.href
        ? `<a class="choose link-button${plan.featured ? ' featured' : ''}" data-plan="${escapeHtml(plan.id)}" href="${escapeHtml(plan.href)}">${label}</a>`
        : `<lw-button class="choose" data-plan="${escapeHtml(plan.id)}" variant="${variant}" size="sm">${label}</lw-button>`;
    };
    const head = `<div class="row head" role="row"><div class="cell corner" role="columnheader"><span class="visually-hidden">Feature</span></div>${plans
      .map(
        (plan) => `<div class="cell plan${plan.featured ? ' featured' : ''}" role="columnheader"><h3 class="plan-name">${escapeHtml(plan.name)}${plan.featured ? '<span class="visually-hidden"> (recommended)</span>' : ''}</h3><p class="price"><span class="amount">${escapeHtml(plan.price)}</span><span class="cadence">${escapeHtml(plan.cadence ?? '')}</span></p>${button(plan)}</div>`,
      )
      .join('')}</div>`;
    const body = rows
      .map(
        (row) => `<div class="row" role="row"><div class="cell label" role="rowheader">${escapeHtml(row.label)}</div>${plans
          .map((plan) => `<div class="cell value${plan.featured ? ' featured' : ''}" role="cell">${cellMarkup(row.values?.[plan.id] ?? false)}</div>`)
          .join('')}</div>`,
      )
      .join('');
    sheet.innerHTML = head + body;
  }
}
