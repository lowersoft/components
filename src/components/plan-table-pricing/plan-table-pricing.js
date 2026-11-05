import { cellMarkup, comparisonStyles } from '../../core/comparison.js';
import { escapeHtml } from '../../core/dom.js';
import { hintStyles, termMarkup, wireHints } from '../../core/hint.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { formatMoney, paintPrice, priceMarkup } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import styles from './plan-table-pricing.scss?inline';

const DEMO_PLANS = [
  { id: 'free', name: 'Free', eyebrow: 'Try it', monthly: 0 },
  { id: 'solo', name: 'Solo', eyebrow: 'Freelancers', monthly: 12, save: 25 },
  { id: 'team', name: 'Team', eyebrow: 'Small teams', monthly: 30, save: 20, popular: true },
  { id: 'org', name: 'Organization', eyebrow: 'Companies', monthly: 70, save: 15 },
];

const DEMO_FEATURES = [
  { id: 'seats', label: 'Seats', values: { free: '1', solo: '1', team: 'Up to 10', org: 'Unlimited' } },
  { id: 'projects', label: 'Projects', values: { free: '3', solo: 'Unlimited', team: 'Unlimited', org: 'Unlimited' } },
  { id: 'storage', label: 'File storage', values: { free: '1 GB', solo: '50 GB', team: '500 GB', org: '5 TB' } },
  { id: 'guests', label: 'Guest access', hint: 'Invite clients to view and comment without taking a seat.', values: { free: false, solo: true, team: true, org: true } },
  { id: 'api', label: 'API access', hint: 'Read and write everything in your workspace from your own tools.', values: { free: false, solo: true, team: true, org: true } },
  { id: 'sso', label: 'Single sign-on', hint: 'Sign in through your identity provider over SAML, with users added and removed for you.', values: { free: false, solo: false, team: false, org: true } },
  { id: 'audit', label: 'Audit log', values: { free: false, solo: false, team: true, org: true } },
  { id: 'support', label: 'Support', values: { free: 'Community', solo: 'Email', team: 'Priority', org: 'Dedicated' } },
];

/** The price a month: the monthly price, or with the plan's saving off for annual billing. */
const priceOf = (plan, billing) => (billing === 'yearly' ? Math.round(plan.monthly * (1 - (plan.save ?? 0) / 100) * 100) / 100 : plan.monthly);

/**
 * Plans across the top and features down the side in one semantic table,
 * the popular plan's column tinted from its band to the last row. Pay
 * annually or monthly with two real radio buttons: every price rolls, and
 * each plan says what annual saves. Features can explain themselves on
 * hover or focus. On narrow screens the table scrolls sideways with the
 * features pinned, and a fade shows there is more.
 *
 * Plans are `{ id, name, eyebrow?, monthly, save?, popular? }`, `save` the
 * percent off on annual billing. Features are `{ id, label, hint?, values }`,
 * `values` keyed by plan id: text, `true` or `false`.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {'monthly'|'yearly'} billing
 * @attr {string} action - The button beside the heading
 * @attr {string} group - The heading over the features
 * @attr {string} badge - On the popular plan
 * @attr {Array<object>} plans (JSON)
 * @attr {Array<object>} features (JSON)
 * @fires lw-change - Billing changed; `detail: { billing }`
 * @fires lw-choose - The action was pressed; `detail: { billing }`
 * @csspart table
 */
export class LwPlanTablePricing extends LwElement {
  static styles = [comparisonStyles, hintStyles, rollingStyles, styles];
  static props = {
    heading: { default: 'Plans for every size of team' },
    description: { default: 'Every plan includes unlimited viewers. Pay annually and keep up to a quarter.' },
    billing: { default: 'yearly', reflect: true },
    action: { default: 'Start a free trial' },
    group: { default: 'Included' },
    badge: { default: 'Most popular' },
    plans: { type: Object, default: DEMO_PLANS },
    features: { type: Object, default: DEMO_FEATURES },
  };

  render() {
    return `<section class="wrap" aria-labelledby="heading"><header class="head"><div><h2 class="title" id="heading"></h2><p class="description"></p></div>
<lw-button class="action"><span class="action-text"></span><span slot="end" class="arrow">${strokeIcon(arrowRight, 16)}</span></lw-button></header>
<fieldset class="radios"><legend class="visually-hidden">Billing</legend><label class="radio"><input type="radio" name="billing" value="yearly"><span class="dot"></span>Pay annually</label><label class="radio"><input type="radio" name="billing" value="monthly"><span class="dot"></span>Pay monthly</label></fieldset>
<div class="scroller" tabindex="0" role="region" aria-labelledby="heading"><table class="table" part="table"><colgroup></colgroup><thead></thead><tbody></tbody></table></div></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.radios').addEventListener('change', (event) => {
      this.billing = event.target.value;
      this.emit('change', { billing: this.billing });
    }, options);
    this.query('.action').addEventListener('click', () => this.emit('choose', { billing: this.billing }), options);
    const scroller = this.query('.scroller');
    wireHints(this, scroller);
    // A fade at the edge while there is more to scroll to.
    const edges = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scroller;
      scroller.toggleAttribute('data-more', scrollLeft + clientWidth < scrollWidth - 1);
    };
    scroller.addEventListener('scroll', edges, { ...options, passive: true });
    const observer = new ResizeObserver(edges);
    observer.observe(scroller);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    const description = this.query('.description');
    description.textContent = this.description ?? '';
    description.hidden = !this.description;
    this.query('.action-text').textContent = this.action ?? '';
    this.query('.action').hidden = !this.action;
    for (const radio of this.shadowRoot.querySelectorAll('.radios input')) radio.checked = radio.value === this.billing;
    if (changed.has('plans') || changed.has('features') || changed.has('group') || changed.has('badge')) this.#build();
    this.#paintPrices();
  }

  get #plans() {
    return Array.isArray(this.plans) ? this.plans : [];
  }

  #build() {
    const plans = this.#plans;
    const features = Array.isArray(this.features) ? this.features : [];
    const popular = (plan) => (plan.popular ? ' popular' : '');
    this.query('.table').style.setProperty('--_count', String(plans.length));
    this.query('colgroup').innerHTML = `<col class="feature-col">${plans.map((plan) => `<col class="plan-col${popular(plan)}">`).join('')}`;
    this.query('thead').innerHTML = `<tr><td class="corner"></td>${plans
      .map((plan) => {
        const band = plan.popular && this.badge ? `<span class="band">${escapeHtml(this.badge)}</span>` : '';
        return `<th scope="col" class="plan${popular(plan)}" data-id="${escapeHtml(plan.id)}">${band}<span class="eyebrow">${escapeHtml(plan.eyebrow ?? '')}</span><span class="name">${escapeHtml(plan.name)}</span><span class="price">${priceMarkup()}<span class="per">/ mo</span></span><span class="note"></span></th>`;
      })
      .join('')}</tr>`;
    const group = this.group ? `<tr class="group-row"><th scope="colgroup" colspan="${plans.length + 1}">${escapeHtml(this.group)}</th></tr>` : '';
    this.query('tbody').innerHTML =
      group +
      features
        .map((feature, i) => `<tr><th scope="row" class="feature">${termMarkup(feature.label, feature.hint, `hint-${i}`)}</th>${plans
          .map((plan) => `<td class="value${popular(plan)}">${cellMarkup(feature.values?.[plan.id] ?? false)}</td>`)
          .join('')}</tr>`)
        .join('');
  }

  #paintPrices() {
    const yearly = this.billing === 'yearly';
    for (const head of this.shadowRoot.querySelectorAll('th.plan')) {
      const plan = this.#plans.find((each) => each.id === head.dataset.id);
      const price = priceOf(plan, this.billing);
      paintPrice(head.querySelector('.amount'), formatMoney(price));
      const note = head.querySelector('.note');
      note.textContent = !plan.monthly ? 'Free forever' : yearly ? (plan.save ? `Billed annually · save ${plan.save}%` : 'Billed annually') : 'Billed monthly';
      note.toggleAttribute('data-save', yearly && Boolean(plan.save) && Boolean(plan.monthly));
    }
  }
}
