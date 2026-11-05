import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowUpRight, check, chevronDown } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { formatMoney, paintPrice, priceMarkup, pricingStyles } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import '../switch/index.js';
import styles from './credit-plan-pricing.scss?inline';

const DEMO_PLANS = [
  { id: 'free', name: 'Free', tagline: 'Try it on a few recordings.', price: 0, credits: '60 minutes a month', creditLabel: 'Monthly minutes', action: 'Start free', features: ['English only', 'Exports to text', '7-day history'] },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For regular interviews and calls.',
    creditLabel: 'Monthly minutes',
    credits: [
      { label: '600 minutes', monthly: 15, yearly: 12 },
      { label: '1,500 minutes', monthly: 30, yearly: 24 },
      { label: '4,000 minutes', monthly: 60, yearly: 48 },
    ],
    action: 'Go Pro',
    featured: true,
    features: ['40 languages', 'Speaker labels', 'Exports to subtitles', 'Unlimited history'],
  },
  { id: 'team', name: 'Team', tagline: 'One pool of minutes, shared.', price: 'custom', credits: 'Pooled minutes', creditLabel: 'Monthly minutes', action: 'Contact us', features: ['Everything in Pro', 'Admin roles', 'Shared vocabulary', 'SSO'] },
  { id: 'api', name: 'API', tagline: 'Build transcription into your app.', price: 'custom', credits: 'Pay as you go', creditLabel: 'Usage', action: 'Get a key', features: ['REST and streaming', 'Webhooks', '99.9% uptime SLA'] },
];

/**
 * Credit plans in four columns on one frame. A plan with a credit ladder
 * has a menu: choosing an amount reprints that plan's price. The yearly
 * switch moves every column to its yearly price per month at once, and
 * prices roll to their new value. Only the featured plan's button takes
 * the accent. Four columns become two, then one, as the room runs out.
 *
 * Plans are `{ id, name, tagline, credits, creditLabel?, action, features,
 * price?, featured? }`. `credits` is either text, with `price` a number or
 * `"custom"`, or a ladder of `{ label, monthly, yearly }`, `yearly` being
 * the price per month on yearly billing.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {boolean} yearly - Yearly billing
 * @attr {string} save - Beside the switch
 * @attr {string} footnote - Under the frame
 * @attr {string} footnote-link - The footnote's link text
 * @attr {string} footnote-href - Where it goes
 * @attr {string} accent - The featured plan's color; blue by default
 * @attr {Array<object>} plans (JSON)
 * @fires lw-change - Billing changed; `detail: { yearly }`
 * @fires lw-select - A credit amount was chosen; `detail: { plan, credits, price }`
 * @fires lw-choose - A plan's button was pressed; `detail: { plan, credits, price, yearly }`
 * @csspart frame
 * @cssprop --lw-credit-plan-pricing-accent - Same as `accent`
 */
export class LwCreditPlanPricing extends LwElement {
  static styles = [rollingStyles, pricingStyles, styles];
  static props = {
    heading: { default: 'Pay for the minutes you transcribe' },
    description: { default: 'Pick a plan, then the minutes you need. Change either whenever you like.' },
    yearly: { type: Boolean, reflect: true },
    save: { default: 'Save 20%' },
    footnote: { default: 'Unused minutes roll over for one month.' },
    'footnote-link': { default: 'Learn more' },
    'footnote-href': { default: '#' },
    accent: {},
    plans: { type: Object, default: DEMO_PLANS },
  };

  // The credit amount chosen on each ladder, by plan id.
  #chosen = new Map();

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><div><h2 class="title" id="heading"></h2><p class="description"></p></div>
<div class="billing-row"><lw-switch class="yearly" size="sm">Yearly billing</lw-switch><span class="save"></span></div></header>
<div class="frame" part="frame"></div><p class="footnote"><span class="footnote-text"></span> <a class="footnote-link"></a></p></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    const toggle = this.query('.yearly');
    toggle.addEventListener('change', () => {
      this.yearly = toggle.checked;
      this.emit('change', { yearly: this.yearly });
    }, options);
    const frame = this.query('.frame');
    frame.addEventListener('change', (event) => {
      const select = event.target.closest('.credits-select');
      if (!select) return;
      const plan = this.#plan(select.dataset.id);
      this.#chosen.set(plan.id, Number(select.value));
      this.#paint(plan);
      this.emit('select', { plan: plan.id, credits: this.#credit(plan).label, price: this.#price(plan) });
    }, options);
    frame.addEventListener('click', (event) => {
      const action = event.target.closest('.action');
      if (!action) return;
      const plan = this.#plan(action.dataset.id);
      this.emit('choose', { plan: plan.id, credits: this.#credit(plan)?.label ?? plan.credits, price: this.#price(plan), yearly: this.yearly });
    }, options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    const description = this.query('.description');
    description.textContent = this.description ?? '';
    description.hidden = !this.description;
    this.query('.yearly').checked = this.yearly;
    this.query('.save').textContent = this.save ?? '';
    const footnote = this.query('.footnote');
    footnote.hidden = !this.footnote;
    this.query('.footnote-text').textContent = this.footnote ?? '';
    const link = this.query('.footnote-link');
    link.hidden = !this['footnote-link'];
    link.innerHTML = `${escapeHtml(this['footnote-link'] ?? '')}${strokeIcon(arrowUpRight, 14)}`;
    link.href = this['footnote-href'] || '#';
    if (this.accent) this.style.setProperty('--_accent', this.accent);
    else this.style.removeProperty('--_accent');
    if (changed.has('plans')) this.#build();
    for (const plan of this.#plans) this.#paint(plan);
  }

  get #plans() {
    return Array.isArray(this.plans) ? this.plans : [];
  }

  #plan(id) {
    return this.#plans.find((each) => each.id === id);
  }

  // The chosen rung of a plan's ladder, or nothing for a fixed plan.
  #credit(plan) {
    return Array.isArray(plan.credits) ? plan.credits[this.#chosen.get(plan.id) ?? 0] : null;
  }

  // The price a month, a number or "custom".
  #price(plan) {
    const credit = this.#credit(plan);
    if (!credit) return plan.price ?? 'custom';
    return this.yearly ? credit.yearly ?? credit.monthly : credit.monthly;
  }

  #build() {
    this.#chosen = new Map();
    this.query('.frame').innerHTML = this.#plans
      .map((plan) => {
        const id = escapeHtml(plan.id);
        const label = escapeHtml(plan.creditLabel ?? 'Credits');
        const credits = Array.isArray(plan.credits)
          ? `<label class="credits-label" for="credits-${id}">${label}</label><div class="credits select"><select class="credits-select" id="credits-${id}" data-id="${id}">${plan.credits
              .map((credit, i) => `<option value="${i}">${escapeHtml(credit.label)}</option>`)
              .join('')}</select>${strokeIcon(chevronDown, 16)}</div>`
          : `<span class="credits-label">${label}</span><p class="credits">${escapeHtml(plan.credits ?? '')}</p>`;
        return `<article class="plan"${plan.featured ? ' data-featured' : ''} data-id="${id}" aria-labelledby="plan-${id}">
<h3 class="name" id="plan-${id}">${escapeHtml(plan.name)}</h3><p class="tagline">${escapeHtml(plan.tagline ?? '')}</p>
<p class="price">${priceMarkup()}<span class="per"></span></p><p class="billed"></p>${credits}
<ul class="features">${(plan.features ?? []).map((feature) => `<li>${strokeIcon(check, 15)}<span>${escapeHtml(feature)}</span></li>`).join('')}</ul>
<lw-button class="action" data-id="${id}" variant="${plan.featured ? 'primary' : 'outline'}">${escapeHtml(plan.action ?? 'Choose')}</lw-button></article>`;
      })
      .join('');
  }

  #paint(plan) {
    const card = this.shadowRoot.querySelector(`.plan[data-id="${CSS.escape(plan.id)}"]`);
    if (!card) return;
    const price = this.#price(plan);
    const custom = typeof price !== 'number';
    paintPrice(card.querySelector('.amount'), custom ? 'Custom' : formatMoney(price));
    card.querySelector('.per').textContent = custom ? '' : '/ month';
    card.querySelector('.billed').textContent = custom ? 'Talk to us about volume' : !price ? 'Free forever' : this.yearly ? `${formatMoney(price * 12)} billed yearly` : 'Billed monthly';
  }
}
