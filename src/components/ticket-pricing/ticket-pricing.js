import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { billingToggle, DEMO_PLANS, monthlyPrice, paintBilling, paintPrice, priceMarkup, pricingStyles, wireBilling } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import styles from './ticket-pricing.scss?inline';

const [hobby, pro, team] = DEMO_PLANS;
const DEMO_PASSES = [
  { ...hobby, code: 'LW-01', terms: 'no card needed', specs: [['Projects', '3'], ['Events / mo', '1,000'], ['History', '7 days'], ['Custom domains', ''], ['Roles & audit log', ''], ['Support', 'Community']] },
  { ...pro, code: 'LW-02', terms: 'cancel any time', specs: [['Projects', 'Unlimited'], ['Events / mo', '50,000'], ['History', '90 days'], ['Custom domains', 'Included'], ['Roles & audit log', ''], ['Support', 'Email']] },
  { ...team, code: 'LW-03', terms: 'cancel any time', specs: [['Projects', 'Unlimited'], ['Events / mo', '500,000'], ['History', '1 year'], ['Custom domains', 'Included'], ['Roles & audit log', 'Included'], ['Support', 'Priority']] },
];

const BARCODE_WIDTH = 160;

// A barcode that reads as the pass and its billing: the same text always
// draws the same bars.
const barcode = (text) => {
  let seed = [...text].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619), 2166136261);
  const next = () => {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822507);
    seed = Math.imul(seed ^ (seed >>> 13), 3266489909);
    return ((seed ^= seed >>> 16) >>> 0) / 4294967296;
  };
  let x = 0;
  let bars = '';
  while (x < BARCODE_WIDTH) {
    const width = 1 + Math.floor(next() * 3);
    bars += `<rect x="${x}" width="${Math.min(width, BARCODE_WIDTH - x)}" height="24"/>`;
    x += width + 1 + Math.floor(next() * 2);
  }
  return `<svg class="barcode" viewBox="0 0 ${BARCODE_WIDTH} 24" preserveAspectRatio="none" aria-hidden="true">${bars}</svg>`;
};

/**
 * Plans as passes: a stub with the price over a perforated tear line, the
 * specs below with dotted leaders, and a barcode. Pick a pass to hold it
 * in the opposite scheme; the arrow keys move between them. Monthly or
 * yearly rolls every price and reprints the barcodes.
 *
 * Passes are `{ id, code, name, blurb, monthly, terms, specs }`, with
 * `specs` as `[label, value]` pairs; an empty value prints a dash.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {'monthly'|'yearly'} billing
 * @attr {string} note - Under the switch
 * @attr {string} badge - Stamped on the featured pass
 * @attr {string} featured - The id of the pass most people pick
 * @attr {string} value - The id of the pass held
 * @attr {Array<object>} passes (JSON)
 * @fires lw-change - Billing changed; `detail: { billing }`
 * @fires lw-select - A pass was picked; `detail: { plan, billing, price }`
 */
export class LwTicketPricing extends LwElement {
  static styles = [rollingStyles, pricingStyles, styles];
  static props = {
    heading: { default: 'Pick your pass' },
    description: { default: 'Every pass includes unlimited viewers. Switch or cancel any time.' },
    billing: { default: 'monthly', reflect: true },
    note: { default: 'Yearly passes get 2 months free' },
    badge: { default: 'Most picked' },
    featured: { default: 'pro' },
    value: { default: 'pro', reflect: true },
    passes: { type: Object, default: DEMO_PASSES },
  };

  render() {
    return `<header class="head"><h2 class="title"></h2><p class="description"></p>${billingToggle()}<p class="note"></p></header><div class="passes" role="radiogroup" aria-label="Passes"></div>`;
  }

  connected() {
    wireBilling(this);
    const passes = this.query('.passes');
    const options = { signal: this.signal };
    passes.addEventListener('click', (event) => {
      const pass = event.target.closest('.pass');
      if (pass) this.#select(pass.dataset.id);
    }, options);
    passes.addEventListener('keydown', (event) => {
      const all = [...passes.querySelectorAll('.pass')];
      const index = all.indexOf(event.target.closest('.pass'));
      if (index < 0) return;
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        return this.#select(all[index].dataset.id);
      }
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const next = all[(index + step + all.length) % all.length];
      this.#select(next.dataset.id);
      next.focus();
    }, options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.note').textContent = this.note ?? '';
    if (['passes', 'badge', 'featured'].some((name) => changed.has(name))) this.#build();
    paintBilling(this);
    this.#paint();
  }

  #build() {
    this.query('.passes').innerHTML = (this.passes ?? [])
      .map((pass) => {
        const id = escapeHtml(pass.id);
        const stamp = pass.id === this.featured && this.badge ? `<span class="stamp">${escapeHtml(this.badge)}</span>` : '';
        const specs = pass.specs.map(([label, value]) => `<li><span>${escapeHtml(label)}</span><span class="leader"></span><span class="value">${value ? escapeHtml(value) : '<span aria-label="Not included">—</span>'}</span></li>`).join('');
        return `<article class="pass" role="radio" tabindex="-1" data-id="${id}" aria-labelledby="pass-${id}">
<div class="stub"><div class="stub-head"><span class="code">${escapeHtml(pass.code)} · ${escapeHtml(pass.name)}</span>${stamp}</div><h3 class="name" id="pass-${id}">${escapeHtml(pass.name)}</h3><p class="blurb">${escapeHtml(pass.blurb)}</p>
<p class="price">${priceMarkup()}<span class="per">/ month</span></p><p class="terms"></p></div>
<div class="body"><ul class="specs">${specs}</ul><div class="code-strip"></div></div></article>`;
      })
      .join('');
  }

  #paint() {
    const passes = [...this.shadowRoot.querySelectorAll('.pass')];
    const held = passes.find((each) => each.dataset.id === this.value) ?? passes[0];
    for (const element of passes) {
      const pass = this.passes.find((each) => each.id === element.dataset.id);
      const chosen = element === held;
      element.ariaChecked = String(chosen);
      element.tabIndex = chosen ? 0 : -1;
      paintPrice(element.querySelector('.amount'), monthlyPrice(pass.monthly, this.billing));
      element.querySelector('.terms').textContent = pass.monthly ? `Billed ${this.billing} · ${pass.terms}` : `Free forever · ${pass.terms}`;
      element.querySelector('.code-strip').innerHTML = barcode(`${pass.code}:${this.billing}`);
    }
  }

  #select(id) {
    if (id === this.value) return;
    this.value = id;
    const pass = this.passes.find((each) => each.id === id);
    this.emit('select', { plan: id, billing: this.billing, price: monthlyPrice(pass.monthly, this.billing) });
  }
}
