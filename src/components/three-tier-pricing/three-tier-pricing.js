import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { check, minus, plus } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { billingToggle, DEMO_PLANS, formatMoney, monthlyPrice, paintBilling, paintPrice, priceMarkup, pricingStyles, wireBilling } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import styles from './three-tier-pricing.scss?inline';

const [hobby, pro, team] = DEMO_PLANS;
const DEMO_TIERS = [
  { ...hobby, action: 'Start for free', features: ['Up to 3 projects', '1,000 events a month', '7-day history', 'Community support'] },
  { ...pro, action: 'Start 14-day trial', featured: true, includes: 'Everything in Hobby, plus:', features: ['Unlimited projects', '50,000 events a month', '90-day history', 'Custom domains', 'Email support'] },
  { ...team, monthly: 18, perSeat: true, seats: 5, action: 'Choose Team', includes: 'Everything in Pro, plus:', features: ['500,000 events a month', 'Roles and permissions', 'Audit log', 'Priority support'] },
];

const MAX_SEATS = 100;

/**
 * Three plans side by side, the featured one raised and in the opposite
 * scheme. Monthly or yearly rolls every price to its new value; a per-seat
 * plan has a seat stepper and prices the seats chosen.
 *
 * Tiers are `{ id, name, blurb, monthly, action, features, includes?,
 * featured?, perSeat?, seats? }`, with `monthly` per seat for a per-seat
 * plan.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {'monthly'|'yearly'} billing
 * @attr {string} note - Beside the switch
 * @attr {string} badge - On the featured plan
 * @attr {Array<object>} tiers (JSON)
 * @fires lw-change - Billing changed; `detail: { billing }`
 * @fires lw-choose - A plan's action was chosen; `detail: { plan, billing, seats, total }`
 */
export class LwThreeTierPricing extends LwElement {
  static styles = [rollingStyles, pricingStyles, styles];
  static props = {
    heading: { default: 'Start free. Pay as your team grows.' },
    description: { default: 'Every plan includes unlimited viewers and a 14-day trial of Pro.' },
    billing: { default: 'monthly', reflect: true },
    note: { default: '2 months free on yearly' },
    badge: { default: 'Most picked' },
    tiers: { type: Object, default: DEMO_TIERS },
  };

  // Seats chosen on each per-seat plan, by id.
  #seats = new Map();

  render() {
    return `<header class="head"><div><h2 class="title"></h2><p class="description"></p></div><div class="switch">${billingToggle()}<span class="note"></span></div></header><div class="tiers"></div>`;
  }

  connected() {
    wireBilling(this);
    const tiers = this.query('.tiers');
    tiers.addEventListener('click', (event) => {
      const tier = event.target.closest('.tier');
      if (!tier) return;
      const plan = this.tiers.find((each) => each.id === tier.dataset.id);
      const step = event.target.closest('.step');
      if (step) return this.#setSeats(plan, this.#seatsOf(plan) + Number(step.dataset.step));
      if (event.target.closest('.action')) this.emit('choose', { plan: plan.id, billing: this.billing, seats: plan.perSeat ? this.#seatsOf(plan) : undefined, total: this.#total(plan) });
    }, { signal: this.signal });
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.note').textContent = this.note ?? '';
    if (changed.has('tiers') || changed.has('badge')) this.#build();
    paintBilling(this);
    this.#paintPrices();
  }

  #build() {
    this.query('.tiers').innerHTML = (this.tiers ?? [])
      .map((plan) => {
        const seats = plan.perSeat ? `<div class="seats" role="group" aria-label="Seats"><button class="step" type="button" data-step="-1" aria-label="Remove a seat">${strokeIcon(minus, 16)}</button><output class="seat-count" aria-live="polite"></output><button class="step" type="button" data-step="1" aria-label="Add a seat">${strokeIcon(plus, 16)}</button></div>` : '';
        const badge = plan.featured && this.badge ? `<span class="badge">${escapeHtml(this.badge)}</span>` : '';
        return `<article class="tier"${plan.featured ? ' data-featured' : ''} data-id="${escapeHtml(plan.id)}" aria-labelledby="tier-${escapeHtml(plan.id)}">
<div class="tier-head"><h3 class="name" id="tier-${escapeHtml(plan.id)}">${escapeHtml(plan.name)}</h3>${badge}</div><p class="blurb">${escapeHtml(plan.blurb)}</p>
<p class="price">${priceMarkup()}<span class="per">/ month</span></p><div class="terms"><span class="billed"></span>${seats}</div>
<lw-button class="action" variant="${plan.featured ? 'primary' : 'outline'}">${escapeHtml(plan.action)}</lw-button>
<div class="features">${plan.includes ? `<p class="includes">${escapeHtml(plan.includes)}</p>` : ''}<ul>${plan.features.map((feature) => `<li>${strokeIcon(check, 16)}<span>${escapeHtml(feature)}</span></li>`).join('')}</ul></div></article>`;
      })
      .join('');
  }

  #seatsOf(plan) {
    return this.#seats.get(plan.id) ?? plan.seats ?? 1;
  }

  #setSeats(plan, seats) {
    this.#seats.set(plan.id, Math.min(MAX_SEATS, Math.max(1, seats)));
    this.#paintPrices();
  }

  // The price per month, for every seat on a per-seat plan.
  #total(plan) {
    return monthlyPrice(plan.monthly, this.billing) * (plan.perSeat ? this.#seatsOf(plan) : 1);
  }

  #paintPrices() {
    const yearly = this.billing === 'yearly';
    for (const tier of this.shadowRoot.querySelectorAll('.tier')) {
      const plan = this.tiers.find((each) => each.id === tier.dataset.id);
      paintPrice(tier.querySelector('.amount'), this.#total(plan));
      const cadence = yearly ? 'billed yearly' : 'billed monthly';
      let billed = plan.monthly ? `${cadence[0].toUpperCase()}${cadence.slice(1)}${yearly ? ` · ${formatMoney(this.#total(plan) * 12)} a year` : ''}` : 'Free forever';
      if (plan.perSeat) {
        const seats = this.#seatsOf(plan);
        billed = `${formatMoney(monthlyPrice(plan.monthly, this.billing))} / seat · ${cadence}`;
        tier.querySelector('.seat-count').value = String(seats);
        tier.querySelector('[data-step="-1"]').disabled = seats <= 1;
        tier.querySelector('[data-step="1"]').disabled = seats >= MAX_SEATS;
      }
      tier.querySelector('.billed').textContent = billed;
    }
  }
}
