import { escapeHtml } from '../../core/dom.js';
import { CHECK_ICON, iconStyles, strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwModal, modalStyles } from '../../core/modal.js';
import { billingToggle, formatMoney, paintBilling, paintPrice, priceMarkup, pricingStyles, wireBilling } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import { drawFace } from '../../core/testimonial.js';
import '../button/index.js';
import styles from './upgrade-dialog.scss?inline';

const DEMO_PLANS = [
  { id: 'pro', name: 'Pro', monthly: 19, yearly: 190, blurb: 'For one person shipping real work', limits: { Projects: 'Unlimited', Seats: '1', 'Build history': '90 days', Support: 'Email, 1 day' } },
  { id: 'team', name: 'Team', monthly: 49, yearly: 490, blurb: 'Shared projects, roles and review', limits: { Projects: 'Unlimited', Seats: '10', 'Build history': '1 year', Support: 'Priority, 4 hours' } },
];

const DEMO_CURRENT = { name: 'Free', limits: { Projects: '3', Seats: '1', 'Build history': '7 days', Support: 'Community' } };

/**
 * The upgrade asked for at the moment a limit is hit: what ran out, the
 * plans with monthly or yearly billing, and exactly what changes on the
 * one picked, row by row. The total for today and the saving follow the
 * billing.
 *
 * Plans are `{ id, name, monthly, yearly, blurb, limits }`, `yearly` the
 * whole year's price and `limits` label to value; `current` is the plan now,
 * `{ name, limits }`.
 *
 * @attr {string} workspace
 * @attr {number} used - How much of the limit is used
 * @attr {number} limit
 * @attr {string} noun - What the limit counts, plural
 * @attr {'monthly'|'yearly'} billing
 * @attr {string} value - The plan picked
 * @attr {Array<object>} plans (JSON)
 * @attr {object} current (JSON)
 * @attr {Array<string>} team - Faces in the header (JSON)
 * @fires lw-upgrade - The upgrade was chosen; `detail: { plan, billing, total }`
 */
export class LwUpgradeDialog extends LwModal {
  static styles = [modalStyles, iconStyles, rollingStyles, pricingStyles, styles];
  static props = {
    ...LwModal.props,
    workspace: { default: 'Northwind' },
    used: { type: Number, default: 3 },
    limit: { type: Number, default: 3 },
    noun: { default: 'projects' },
    billing: { default: 'yearly', reflect: true },
    value: { default: 'pro', reflect: true },
    plans: { type: Object, default: DEMO_PLANS },
    current: { type: Object, default: DEMO_CURRENT },
    team: { type: Object, default: ['Maya Chen', 'Theo Okafor', 'Ines Alves'] },
  };

  renderBody() {
    return `<header class="top"><span class="faces"></span><p class="where"><b id="modal-title"></b> · <span class="current"></span></p></header>
<div class="body"><p class="usage"><span class="ticks" aria-hidden="true"></span><span class="usage-text"></span></p><p class="reached"><b>You've reached the <span class="current-name"></span> limit.</b> Pick a plan to add more <span class="noun"></span>; everything you've made stays as it is.</p>
<div class="plan-head"><h3 class="label" id="plan-label">Plan</h3>${billingToggle()}</div><div class="plans" role="radiogroup" aria-labelledby="plan-label"></div>
<h3 class="label gets"></h3><dl class="changes"></dl></div>
<footer class="foot"><lw-button class="later" variant="ghost">Not now</lw-button><button class="go" type="button"><span class="go-text"></span><span class="go-arrow">${strokeIcon(arrowRight, 16)}</span></button></footer><p class="billed-today"></p>`;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    wireBilling(this);
    const plans = this.query('.plans');
    plans.addEventListener('click', (event) => {
      const plan = event.target.closest('.plan');
      if (plan) this.value = plan.dataset.id;
    }, options);
    plans.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const index = this.plans.indexOf(this.#plan);
      this.value = this.plans[(index + step + this.plans.length) % this.plans.length].id;
      plans.querySelector(`[data-id="${CSS.escape(this.value)}"]`).focus();
    }, options);
    this.query('.later').addEventListener('click', () => this.hide('later'), options);
    this.query('.go').addEventListener('click', () => {
      this.emit('upgrade', { plan: this.#plan.id, billing: this.billing, total: this.#total });
      this.hide('upgrade');
    }, options);
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('team')) {
      const faces = this.query('.faces');
      faces.replaceChildren();
      for (const name of this.team ?? []) {
        const face = Object.assign(document.createElement('span'), { className: 'face' });
        drawFace(face, name);
        faces.append(face);
      }
    }
    this.query('#modal-title').textContent = `Upgrade ${this.workspace}`;
    this.query('.current').textContent = `${this.current.name} plan`;
    this.query('.current-name').textContent = this.current.name;
    this.query('.noun').textContent = this.noun;
    this.query('.ticks').innerHTML = Array.from({ length: this.limit }, (_, i) => `<span${i < this.used ? ' data-used' : ''}></span>`).join('');
    this.query('.usage-text').textContent = `${this.used} of ${this.limit} ${this.noun} used`;
    if (changed.has('plans')) {
      this.query('.plans').innerHTML = this.plans
        .map((plan) => `<button class="plan" type="button" role="radio" data-id="${escapeHtml(plan.id)}"><span class="plan-top"><span class="plan-name">${escapeHtml(plan.name)}</span><span class="tick">${CHECK_ICON}</span></span><span class="price">${priceMarkup()}<small>/mo</small></span><span class="billed"></span><span class="blurb">${escapeHtml(plan.blurb)}</span></button>`)
        .join('');
    }
    paintBilling(this);
    this.#paint();
  }

  get #plan() {
    return this.plans.find((plan) => plan.id === this.value) ?? this.plans[0];
  }

  get #total() {
    return this.billing === 'yearly' ? this.#plan.yearly : this.#plan.monthly;
  }

  #paint() {
    const yearly = this.billing === 'yearly';
    const save = Math.round(Math.max(...this.plans.map((plan) => 1 - plan.yearly / (plan.monthly * 12))) * 100);
    this.query('.billing-option[data-billing="yearly"]').innerHTML = `Yearly <span class="save">−${save}%</span>`;
    for (const element of this.shadowRoot.querySelectorAll('.plan')) {
      const plan = this.plans.find((each) => each.id === element.dataset.id);
      const checked = plan === this.#plan;
      element.ariaChecked = String(checked);
      element.tabIndex = checked ? 0 : -1;
      paintPrice(element.querySelector('.amount'), yearly ? Math.round((plan.yearly / 12) * 100) / 100 : plan.monthly, yearly);
      element.querySelector('.billed').textContent = yearly ? `${formatMoney(plan.yearly)} billed yearly` : `${formatMoney(plan.monthly)} billed monthly`;
    }
    const plan = this.#plan;
    this.query('.gets').textContent = `What you get on ${plan.name}`;
    this.query('.changes').innerHTML = Object.entries(plan.limits)
      .map(([label, next]) => {
        const now = this.current.limits?.[label];
        const value = now && now !== next ? `<span class="was">${escapeHtml(now)}</span>${strokeIcon(arrowRight, 13)}<b>${escapeHtml(next)}</b>` : `<span class="same">${escapeHtml(next)}</span>`;
        return `<div class="change"><dt>${escapeHtml(label)}</dt><dd>${value}</dd></div>`;
      })
      .join('');
    this.query('.go-text').textContent = `Upgrade to ${plan.name}`;
    const saving = plan.monthly * 12 - plan.yearly;
    this.query('.billed-today').innerHTML = `<b>${formatMoney(this.#total, true)}</b> billed today · ${yearly ? `renews yearly, saving ${formatMoney(saving)}` : 'renews monthly'}`;
  }
}
