import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight, check, mail, plus } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { paintPrice, priceMarkup, pricingStyles } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import '../checkbox/index.js';
import styles from './lifetime-pricing.scss?inline';

const DEMO_PLANS = [
  { id: 'free', name: 'Free', subtitle: 'Forever, no card', price: 0, action: 'Start free', features: ['3 projects', 'The full editor', 'Community help'] },
  { id: 'yearly', name: 'Yearly', subtitle: 'Billed every year', price: 59, period: '/ year', action: 'Subscribe', features: ['Unlimited projects', 'Updates while subscribed', 'Sync across devices'], extras: [{ id: 'support', label: 'Priority support', price: 19 }] },
  {
    id: 'lifetime',
    name: 'Lifetime',
    subtitle: 'Pay once, keep it',
    price: 129,
    period: 'once',
    action: 'Buy lifetime',
    popular: true,
    inverted: true,
    features: ['Unlimited projects', 'Every future update', 'Sync across devices'],
    extras: [{ id: 'support', label: 'Priority support', price: 29 }, { id: 'plugins', label: 'Pro plugin pack', price: 39 }],
  },
  { id: 'team', name: 'Team', subtitle: 'One time, 10 seats', price: 690, period: 'once', action: 'Buy for a team', features: ['Everything in Lifetime', 'One shared license', 'Seat management'], extras: [{ id: 'invoice', label: 'Pay by invoice' }, { id: 'onboarding', label: 'Onboarding call', price: 149 }] },
];

const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

/**
 * Four ways to pay side by side, the lifetime plan in the opposite scheme
 * and badged, placed after the yearly plan so its one price reads against
 * the yearly one. Below a plus rule each plan lists what stacks on top: an
 * add-on with a price is a checkbox, and the plan's price rolls to include
 * it; one without is simply included. One question link sits under the
 * plans.
 *
 * Plans are `{ id, name, subtitle, price, period?, action, features,
 * extras?, popular?, inverted? }`, `period` the words after the price
 * ("/ year", "once"), and extras `{ id, label, price? }`.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} currency - Before every price
 * @attr {string} badge - On the popular plan
 * @attr {string} question - The link under the plans
 * @attr {string} question-href
 * @attr {Array<object>} plans (JSON)
 * @fires lw-change - An add-on was ticked or unticked; `detail: { plan, extras, price }`
 * @fires lw-choose - A plan's action was chosen; `detail: { plan, extras, price }`
 * @csspart plan - Each plan's card
 * @cssprop --lw-lifetime-pricing-accent - The badge and the included checks; the accent color by default
 */
export class LwLifetimePricing extends LwElement {
  static styles = [rollingStyles, pricingStyles, styles];
  static props = {
    heading: { default: 'Buy once, or keep it yearly.' },
    description: { default: 'Lifetime costs about two years of the yearly plan, and every update after that is free.' },
    currency: { default: '$' },
    badge: { default: 'Best value' },
    question: { default: 'Questions? Email us' },
    questionHref: { default: 'mailto:info@lowersoft.com' },
    plans: { type: Object, default: DEMO_PLANS },
  };

  // The add-ons ticked, by plan id.
  #chosen = new Map();

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><h2 class="title" id="heading"></h2><p class="description"></p></header><div class="plans"></div>
<p class="ask"><a class="question">${strokeIcon(mail, 14)}<span class="question-text"></span></a></p></section>`;
  }

  connected() {
    const plans = this.query('.plans');
    const options = { signal: this.signal };
    plans.addEventListener('change', (event) => {
      const extra = event.target.closest('.extra');
      if (!extra) return;
      const card = extra.closest('.plan');
      const plan = this.#plan(card);
      const chosen = this.#chosenOf(plan);
      if (extra.checked) chosen.add(extra.dataset.extra);
      else chosen.delete(extra.dataset.extra);
      this.#paint(card, plan);
      this.emit('change', { plan: plan.id, extras: [...chosen], price: this.#total(plan) });
    }, options);
    plans.addEventListener('click', (event) => {
      if (!event.target.closest('.action')) return;
      const plan = this.#plan(event.target.closest('.plan'));
      this.emit('choose', { plan: plan.id, extras: [...this.#chosenOf(plan)], price: this.#total(plan) });
    }, options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    const description = this.query('.description');
    description.textContent = this.description ?? '';
    description.hidden = !this.description;
    this.query('.question-text').textContent = this.question ?? '';
    this.query('.question').href = this.questionHref || '#';
    this.query('.ask').hidden = !this.question;
    if (changed.has('plans') || changed.has('badge') || changed.has('currency')) this.#build();
  }

  get #plans() {
    return Array.isArray(this.plans) ? this.plans : [];
  }

  #plan(card) {
    return this.#plans.find((each) => each.id === card.dataset.id);
  }

  #chosenOf(plan) {
    if (!this.#chosen.has(plan.id)) this.#chosen.set(plan.id, new Set());
    return this.#chosen.get(plan.id);
  }

  // The plan's price with the add-ons ticked.
  #total(plan) {
    const chosen = this.#chosenOf(plan);
    return (plan.extras ?? []).reduce((sum, extra) => sum + (chosen.has(extra.id) ? extra.price ?? 0 : 0), plan.price ?? 0);
  }

  #build() {
    this.#chosen = new Map();
    const currency = this.currency ?? '';
    const plans = this.query('.plans');
    plans.style.setProperty('--_count', String(this.#plans.length || 1));
    plans.innerHTML = this.#plans
      .map((plan) => {
        const id = escapeHtml(plan.id);
        const extras = (plan.extras ?? [])
          .map((extra) =>
            typeof extra.price === 'number'
              ? `<li class="extra-row"><lw-checkbox class="extra" data-extra="${escapeHtml(extra.id)}" description="${escapeHtml(`+${currency}${number.format(extra.price)}`)}">${escapeHtml(extra.label)}</lw-checkbox></li>`
              : `<li class="included"><span class="tick accent">${strokeIcon(check, 12, 3)}</span>${escapeHtml(extra.label)}</li>`,
          )
          .join('');
        const stack = extras ? `<div class="plus-rule" role="presentation"><span>${strokeIcon(plus, 12, 2.5)}</span></div><ul class="extras" aria-label="Add-ons">${extras}</ul>` : '';
        return `<article class="plan"${plan.inverted ? ' data-inverted' : ''}${plan.popular ? ' data-popular' : ''} part="plan" data-id="${id}" aria-labelledby="plan-${id}">
<div class="plan-head"><h3 class="name" id="plan-${id}">${escapeHtml(plan.name)}</h3>${plan.popular && this.badge ? `<span class="badge">${escapeHtml(this.badge)}</span>` : ''}</div><p class="subtitle">${escapeHtml(plan.subtitle ?? '')}</p>
<p class="price"><span class="currency" aria-hidden="true">${escapeHtml(currency)}</span>${priceMarkup()}${plan.period ? `<span class="period">${escapeHtml(plan.period)}</span>` : ''}</p>
<lw-button class="action" data-id="${id}">${escapeHtml(plan.action ?? 'Choose')}<span class="arrow" slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button>
<ul class="features">${(plan.features ?? []).map((feature) => `<li><span class="tick">${strokeIcon(check, 12, 3)}</span>${escapeHtml(feature)}</li>`).join('')}</ul>${stack}</article>`;
      })
      .join('');
    for (const card of plans.querySelectorAll('.plan')) this.#paint(card, this.#plan(card));
  }

  #paint(card, plan) {
    const chosen = this.#chosenOf(plan);
    for (const extra of card.querySelectorAll('.extra')) extra.checked = chosen.has(extra.dataset.extra);
    const total = this.#total(plan);
    const amount = card.querySelector('.amount');
    paintPrice(amount, number.format(total));
    // Read with its currency, which is drawn apart and smaller.
    amount.querySelector('.visually-hidden').textContent = `${this.currency ?? ''}${number.format(total)}`;
  }
}
