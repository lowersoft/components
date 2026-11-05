import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { check } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { formatMoney, paintPrice, priceMarkup, pricingStyles } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import styles from './soft-gradient-pricing.scss?inline';

const DEMO_PLANS = [
  { id: 'starter', name: 'Starter', blurb: 'Open your shop and take your first orders.', monthly: 10, action: 'Start selling', features: ['Up to 50 products', 'Card and wallet payments', 'Your own domain', 'Email support'] },
  { id: 'growth', name: 'Growth', blurb: 'Everything a busy shop needs to keep growing.', monthly: 30, action: 'Choose Growth', featured: true, features: ['Unlimited products', 'Discount codes', 'Abandoned cart emails', 'Sales reports', 'Chat support'] },
  { id: 'scale', name: 'Scale', blurb: 'Several shops, one team, tailored terms.', monthly: 'custom', action: 'Talk to us', contact: true, features: ['Multiple stores', 'Staff accounts and roles', 'Priority support', 'A dedicated manager'] },
];

/**
 * Three plans on white cards over a soft pastel wash, the featured one
 * taller and badged with the accent button, a contact plan with a dark one.
 * The yearly switch takes the discount off every price, which rolls to its
 * new value, and a handwritten note points at it with the saving.
 *
 * Plans are `{ id, name, blurb, monthly, action, features, featured?,
 * contact? }`; `monthly` is a number, `0` for free, or `"custom"`.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {'monthly'|'yearly'} billing
 * @attr {number} discount - Percent off on yearly billing
 * @attr {string} save - The handwritten note; "Save {discount}%" by default
 * @attr {string} badge - On the featured plan
 * @attr {string} accent - The featured plan's color; violet by default
 * @attr {Array<object>} plans (JSON)
 * @fires lw-change - Billing changed; `detail: { billing }`
 * @fires lw-choose - A plan's action was chosen; `detail: { plan, billing, price }`
 * @csspart plan - Each plan's card
 * @cssprop --lw-soft-gradient-pricing-accent - Same as `accent`
 */
export class LwSoftGradientPricing extends LwElement {
  static styles = [rollingStyles, pricingStyles, styles];
  static props = {
    heading: { default: 'Plans that grow with your shop' },
    description: { default: 'Start small and move up whenever you outgrow a plan. No setup fees, no transaction fees.' },
    billing: { default: 'monthly', reflect: true },
    discount: { type: Number, default: 20 },
    save: {},
    badge: { default: 'Most popular' },
    accent: {},
    plans: { type: Object, default: DEMO_PLANS },
  };

  render() {
    return `<section class="section" aria-labelledby="heading"><div class="content"><header class="head"><h2 class="title" id="heading"></h2><p class="description"></p>
<div class="switch"><span class="side" data-billing="monthly">Bill monthly</span><button class="toggle" type="button" role="switch" aria-label="Bill yearly" aria-describedby="save"><span class="knob"></span></button><span class="side" data-billing="yearly">Bill yearly</span>
<span class="note" id="save"><svg class="scribble" viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M60 6C44 4 26 10 16 26"/><path d="M10 20l5 8 8-3"/></svg><span class="save"></span></span></div></header>
<div class="plans"></div></div></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    const choose = (billing) => {
      if (billing === this.billing) return;
      this.billing = billing;
      this.emit('change', { billing });
    };
    this.query('.toggle').addEventListener('click', () => choose(this.billing === 'yearly' ? 'monthly' : 'yearly'), options);
    // The words either side choose their side.
    this.query('.switch').addEventListener('click', (event) => {
      const side = event.target.closest('.side');
      if (side) choose(side.dataset.billing);
    }, options);
    this.query('.plans').addEventListener('click', (event) => {
      const action = event.target.closest('.action');
      if (!action) return;
      const plan = this.#plans.find((each) => each.id === action.dataset.id);
      this.emit('choose', { plan: plan.id, billing: this.billing, price: this.#price(plan) });
    }, options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    const description = this.query('.description');
    description.textContent = this.description ?? '';
    description.hidden = !this.description;
    const save = this.save ?? (this.discount ? `Save ${this.discount}%` : '');
    this.query('.save').textContent = save;
    this.query('.note').hidden = !save;
    if (this.accent) this.style.setProperty('--_accent', this.accent);
    else this.style.removeProperty('--_accent');
    const yearly = this.billing === 'yearly';
    this.query('.toggle').ariaChecked = String(yearly);
    for (const side of this.shadowRoot.querySelectorAll('.side')) side.toggleAttribute('data-on', side.dataset.billing === this.billing);
    if (changed.has('plans') || changed.has('badge')) this.#build();
    this.#paintPrices();
  }

  get #plans() {
    return Array.isArray(this.plans) ? this.plans : [];
  }

  // The price a month on the billing chosen, or "custom".
  #price(plan) {
    if (typeof plan.monthly !== 'number') return plan.monthly;
    return this.billing === 'yearly' ? Math.round(plan.monthly * (1 - (this.discount ?? 0) / 100) * 100) / 100 : plan.monthly;
  }

  #build() {
    this.query('.plans').innerHTML = this.#plans
      .map((plan, i) => {
        const id = escapeHtml(plan.id);
        const variant = plan.featured ? 'primary' : plan.contact ? 'primary' : 'outline';
        return `<article class="plan"${plan.featured ? ' data-featured' : ''}${plan.contact ? ' data-contact' : ''} part="plan" data-id="${id}" style="--i: ${i}" aria-labelledby="plan-${id}">
<div class="plan-head"><h3 class="name" id="plan-${id}">${escapeHtml(plan.name)}</h3>${plan.featured && this.badge ? `<span class="badge">${escapeHtml(this.badge)}</span>` : ''}</div>
<p class="blurb">${escapeHtml(plan.blurb ?? '')}</p><p class="price">${priceMarkup()}<span class="per"></span></p><p class="billed"></p>
<lw-button class="action" data-id="${id}" variant="${variant}" size="lg">${escapeHtml(plan.action ?? 'Choose')}</lw-button>
<ul class="features">${(plan.features ?? []).map((feature) => `<li><span class="tick">${strokeIcon(check, 12, 3)}</span>${escapeHtml(feature)}</li>`).join('')}</ul></article>`;
      })
      .join('');
  }

  #paintPrices() {
    const yearly = this.billing === 'yearly';
    for (const card of this.shadowRoot.querySelectorAll('.plan')) {
      const plan = this.#plans.find((each) => each.id === card.dataset.id);
      const price = this.#price(plan);
      const custom = typeof price !== 'number';
      paintPrice(card.querySelector('.amount'), custom ? 'Custom' : price === 0 ? 'Free' : formatMoney(price));
      card.querySelector('.per').textContent = custom || price === 0 ? '' : '/ month';
      card.querySelector('.billed').textContent = custom ? 'Priced for your stores' : price === 0 ? 'Free forever' : yearly ? `${formatMoney(price * 12)} billed yearly` : 'Billed monthly';
    }
  }
}
