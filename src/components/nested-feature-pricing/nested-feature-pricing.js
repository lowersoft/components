import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { activity, arrowUpRight, asterisk, database, fileText, globe, layers, lock, messageCircle, settings, trendingUp, type, users, video, wandSparkles } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { billingToggle, formatMoney, paintBilling, paintPrice, priceMarkup, pricingStyles, wireBilling } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import styles from './nested-feature-pricing.scss?inline';

// The icons a highlight can name.
const ICONS = { chat: messageCircle, page: fileText, words: type, voice: activity, analytics: trendingUp, video, layers, setup: settings, users, globe, lock, data: database, magic: wandSparkles, unlimited: asterisk };

const DEMO_PLANS = [
  {
    id: 'desk',
    name: 'Desk',
    description: 'For one person writing every day.',
    monthly: 12,
    action: 'Start with Desk',
    highlights: [{ icon: 'chat', label: '200 assistant messages' }, { icon: 'page', label: '50 drafts a month' }, { icon: 'words', label: 'Grammar and style checks' }],
    includes: 'What comes with it',
    extras: ['Browser extension', 'Export to Word and PDF', 'Email support'],
  },
  {
    id: 'studio',
    name: 'Studio',
    description: 'For freelancers with clients to write for.',
    monthly: 29,
    action: 'Start with Studio',
    highlights: [{ icon: 'chat', label: 'Unlimited messages' }, { icon: 'voice', label: 'Voice dictation' }, { icon: 'analytics', label: 'Writing insights' }],
    includes: 'Everything in Desk, plus',
    extras: ['A brand voice per client', 'Shared snippets', 'Full version history'],
  },
  {
    id: 'office',
    name: 'Office',
    description: 'For teams that write together.',
    monthly: 79,
    action: 'Start with Office',
    emphasized: true,
    highlights: [{ icon: 'users', label: 'Up to 25 seats' }, { icon: 'video', label: 'Notes from meetings' }, { icon: 'layers', label: 'Shared knowledge base' }],
    includes: 'Everything in Studio, plus',
    extras: ['Admin console', 'Usage reports', 'Priority support'],
    more: { label: 'All 60 integrations', href: '#' },
  },
  {
    id: 'campus',
    name: 'Campus',
    description: 'For organisations with rules to follow.',
    monthly: 'custom',
    action: 'Talk to us',
    highlights: [{ icon: 'setup', label: 'Guided setup' }, { icon: 'lock', label: 'SSO and audit log' }, { icon: 'unlimited', label: 'Unlimited seats' }],
    includes: 'Everything in Office, plus',
    extras: ['Private deployment', 'Custom contracts', 'A dedicated manager'],
  },
];

/**
 * Four plans in an editorial hand: serif type on warm paper, the headline's
 * second half in gold italics. Each plan leads with three highlights, then
 * a ruled list that starts from the plan below ("Everything in Desk, plus")
 * and names only what is new, so the cards stay even. Monthly or annual
 * rolls every price, and a handwritten note points at the saving. One plan
 * can be emphasized with the orange button.
 *
 * Plans are `{ id, name, description, monthly, action, highlights,
 * includes, extras, more?, emphasized? }`: `monthly` a number or
 * `"custom"`, `highlights` up to three `{ icon, label }` with `icon` one of
 * chat, page, words, voice, analytics, video, layers, setup, users, globe,
 * lock, data, magic or unlimited, and `more` an optional `{ label, href }`
 * link under the list.
 *
 * @attr {string} heading - The headline's first half
 * @attr {string} accent-heading - Its second half, in gold italics
 * @attr {string} description
 * @attr {'monthly'|'yearly'} billing
 * @attr {number} discount - Percent off on annual billing; prices are rounded to the dollar
 * @attr {string} save - The handwritten note; "Save {discount}%" by default
 * @attr {Array<object>} plans (JSON)
 * @fires lw-change - Billing changed; `detail: { billing }`
 * @fires lw-choose - A plan's action was chosen; `detail: { plan, billing, price }`
 * @csspart plan - Each plan's card
 */
export class LwNestedFeaturePricing extends LwElement {
  static styles = [rollingStyles, pricingStyles, styles];
  static props = {
    heading: { default: 'Write from one desk' },
    'accent-heading': { default: 'to the whole office.' },
    description: { default: 'Every plan builds on the one before it, so you only ever pay for what is new.' },
    billing: { default: 'monthly', reflect: true },
    discount: { type: Number, default: 20 },
    save: {},
    plans: { type: Object, default: DEMO_PLANS },
  };

  render() {
    return `<section class="section" aria-labelledby="heading"><div class="content"><header class="head"><h2 class="title" id="heading"><span class="lead"></span> <em class="accent"></em></h2><p class="description"></p>
<div class="switch">${billingToggle({ monthly: 'Monthly', yearly: 'Annual' })}<span class="note"><svg class="scribble" viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M60 6C44 4 26 10 16 26"/><path d="M10 20l5 8 8-3"/></svg><span class="save"></span></span></div></header>
<div class="plans"></div></div></section>`;
  }

  connected() {
    wireBilling(this);
    this.query('.plans').addEventListener('click', (event) => {
      const action = event.target.closest('.action');
      if (!action) return;
      const plan = this.#plans.find((each) => each.id === action.dataset.id);
      this.emit('choose', { plan: plan.id, billing: this.billing, price: this.#price(plan) });
    }, { signal: this.signal });
  }

  updated(changed) {
    this.query('.lead').textContent = this.heading ?? '';
    this.query('.accent').textContent = this['accent-heading'] ?? '';
    const description = this.query('.description');
    description.textContent = this.description ?? '';
    description.hidden = !this.description;
    const save = this.save ?? (this.discount ? `Save ${this.discount}%` : '');
    this.query('.save').textContent = save;
    this.query('.note').hidden = !save;
    if (changed.has('plans')) this.#build();
    paintBilling(this);
    this.#paintPrices();
  }

  get #plans() {
    return Array.isArray(this.plans) ? this.plans : [];
  }

  // The price a month on the billing chosen, or "custom".
  #price(plan) {
    if (typeof plan.monthly !== 'number') return plan.monthly;
    return this.billing === 'yearly' ? Math.round(plan.monthly * (1 - (this.discount ?? 0) / 100)) : plan.monthly;
  }

  #build() {
    this.query('.plans').style.setProperty('--_count', String(this.#plans.length || 1));
    this.query('.plans').innerHTML = this.#plans
      .map((plan, i) => {
        const id = escapeHtml(plan.id);
        const highlights = (plan.highlights ?? [])
          .slice(0, 3)
          .map((item) => `<li><span class="glyph">${strokeIcon(ICONS[item.icon] ?? ICONS.magic, 16, 1.75)}</span>${escapeHtml(item.label)}</li>`)
          .join('');
        const more = plan.more?.label ? `<a class="more" href="${escapeHtml(plan.more.href ?? '#')}">${escapeHtml(plan.more.label)}${strokeIcon(arrowUpRight, 14)}</a>` : '';
        return `<article class="plan"${plan.emphasized ? ' data-emphasized' : ''} part="plan" data-id="${id}" style="--i: ${i}" aria-labelledby="plan-${id}">
<h3 class="name" id="plan-${id}">${escapeHtml(plan.name)}</h3><p class="blurb">${escapeHtml(plan.description ?? '')}</p>
<p class="price">${priceMarkup()}<span class="per"></span></p><p class="billed"></p>
<ul class="highlights">${highlights}</ul>
<lw-button class="action" data-id="${id}" variant="${plan.emphasized ? 'primary' : 'outline'}">${escapeHtml(plan.action ?? 'Choose')}</lw-button>
<div class="extras"><p class="includes">${escapeHtml(plan.includes ?? '')}</p><ul>${(plan.extras ?? []).map((extra) => `<li>${escapeHtml(extra)}</li>`).join('')}</ul>${more}</div></article>`;
      })
      .join('');
  }

  #paintPrices() {
    const yearly = this.billing === 'yearly';
    for (const card of this.shadowRoot.querySelectorAll('.plan')) {
      const plan = this.#plans.find((each) => each.id === card.dataset.id);
      const price = this.#price(plan);
      const custom = typeof price !== 'number';
      paintPrice(card.querySelector('.amount'), custom ? 'Custom' : formatMoney(price));
      card.querySelector('.per').textContent = custom ? '' : 'a month';
      card.querySelector('.billed').textContent = custom ? 'Priced with you' : yearly ? `${formatMoney(price * 12)} billed annually` : 'Billed monthly';
    }
  }
}
