import { escapeHtml } from '../../core/dom.js';
import { moveHighlight } from '../../core/highlight.js';
import { CHECK_ICON, iconStyles, strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { billingToggle, formatMoney, paintBilling, paintPrice, priceMarkup, pricingStyles, wireBilling, YEARLY_MONTHS } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import { swapStyles, swapText } from '../../core/swap.js';
import '../pay-button/index.js';
import styles from './upgrade-summary.scss?inline';

const DAY_MS = 86_400_000;
// Use past this share of the current limit shows as close to it.
const NEAR_LIMIT = 0.8;
// How long the pay button shows its check before the summary settles.
const SETTLE_MS = 900;

const DEMO_PLANS = [
  { id: 'starter', name: 'Starter', monthly: 19, limits: { minutes: 10_000, seats: 5, storage: 10 } },
  { id: 'pro', name: 'Pro', monthly: 49, limits: { minutes: 50_000, seats: 10, storage: 100 } },
  { id: 'team', name: 'Team', monthly: 99, limits: { minutes: 250_000, seats: 25, storage: 1000 } },
];

const DEMO_METERS = [
  { key: 'minutes', label: 'Build minutes' },
  { key: 'seats', label: 'Seats' },
  { key: 'storage', label: 'Storage', unit: 'GB' },
];

const DEMO_USAGE = { minutes: 8420, seats: 3, storage: 4.2 };

const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
const short = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const longDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const cents = (value) => Math.round(value * 100) / 100;
const percent = (part, all) => `${((Math.min(part, all) / all) * 100).toFixed(2)}%`;

// "4.2 GB", "1 TB", "8.4K", or a plain count.
const amountOf = (value, unit) => {
  if (unit === 'GB') return value >= 1000 ? `${whole.format(value / 1000)} TB` : `${whole.format(value)} GB`;
  return value >= 10_000 ? short.format(value) : whole.format(value);
};

/**
 * The last step of an upgrade: what changes before you pay. Pick the plan
 * and the billing; each meter shows this cycle's use against the current
 * limit and the room the new plan adds; the bill for today is prorated and
 * credited for the unused days of the current plan, and its total rolls
 * into the pay button. Paying waits on `confirm` if set, then the summary
 * settles on the new plan.
 *
 * Plans are `{ id, name, monthly, limits }`, cheapest first; meters are
 * `{ key, label, unit? }` naming a key of `limits` and `usage`.
 *
 * Set the `confirm` property to an async function taking
 * `{ plan, billing, total }`; a rejection leaves the summary as it was.
 *
 * @attr {string} current - The plan now
 * @attr {string} value - The plan to move to
 * @attr {'monthly'|'yearly'} billing
 * @attr {number} days-left - Days left in the current cycle
 * @attr {number} cycle-days - Days in a cycle
 * @attr {number} tax - Percent
 * @attr {Array<object>} plans (JSON)
 * @attr {Array<object>} meters (JSON)
 * @attr {object} usage - Use this cycle, by meter key (JSON)
 * @fires lw-change - Billing changed; `detail: { billing }`
 * @fires lw-select - A plan was picked; `detail: { plan }`
 * @fires lw-confirm - The upgrade went through; `detail: { plan, billing, total }`
 */
export class LwUpgradeSummary extends LwElement {
  static styles = [iconStyles, rollingStyles, swapStyles, pricingStyles, styles];
  static props = {
    current: { default: 'starter' },
    value: { default: 'pro', reflect: true },
    billing: { default: 'monthly', reflect: true },
    daysLeft: { type: Number, default: 12 },
    cycleDays: { type: Number, default: 30 },
    tax: { type: Number, default: 8 },
    plans: { type: Object, default: DEMO_PLANS },
    meters: { type: Object, default: DEMO_METERS },
    usage: { type: Object, default: DEMO_USAGE },
  };

  #done = false;
  #settle = 0;

  render() {
    return `<header class="head"><p class="route"><span class="chip from"></span>${strokeIcon(arrowRight, 14)}<span class="chip to"><span class="swap to-name"></span></span></p><h2 class="title">Review your upgrade</h2><p class="lead">New limits apply the moment you confirm. Today you only pay the difference for the rest of this cycle.</p></header>
<section class="section" aria-labelledby="plan-title"><div class="section-head"><h3 class="section-title" id="plan-title">Plan</h3>${billingToggle({ monthly: 'Monthly', yearly: `Yearly <span class="save">−${Math.round((1 - YEARLY_MONTHS / 12) * 100)}%</span>` })}</div><div class="plans" role="radiogroup" aria-labelledby="plan-title"><span class="plan-ring" aria-hidden="true"></span></div></section>
<section class="section" aria-labelledby="usage-title"><div class="section-head"><h3 class="section-title" id="usage-title">Usage this cycle</h3><p class="legend" aria-hidden="true"><span class="key used-key">Used</span><span class="key now-key">Current limit</span><span class="key added-key"></span></p></div><div class="meters"></div></section>
<section class="section bill" aria-labelledby="bill-title"><h3 class="section-title" id="bill-title">Today's bill</h3><dl class="lines"></dl><div class="total"><span>Due today</span>${priceMarkup('total-amount')}</div></section>
<footer class="foot"><lw-pay-button class="go" label="Upgrade and pay" locale="en-US" currency="USD" pending-label="Upgrading" success-label="Upgraded" error-label="Payment failed"></lw-pay-button><p class="done" role="status" hidden>${CHECK_ICON}<span class="done-text"></span></p><p class="then"></p></footer>`;
  }

  connected() {
    wireBilling(this);
    const options = { signal: this.signal };
    const plans = this.query('.plans');
    plans.addEventListener('click', (event) => {
      const plan = event.target.closest('.plan');
      if (plan) this.#select(plan.dataset.id);
    }, options);
    plans.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const all = [...plans.querySelectorAll('.plan')];
      const next = all[(all.findIndex((each) => each.ariaChecked === 'true') + step + all.length) % all.length];
      this.#select(next.dataset.id);
      next.focus();
    }, options);
    const go = this.query('.go');
    // The pay button shows the wait, the check or the error; `confirm` decides.
    go.addEventListener('lw-action', (event) => {
      if (this.#done) return event.preventDefault();
      const detail = this.#detail;
      event.detail.waitUntil(Promise.resolve(this.confirm?.(detail)).then(() => detail));
    }, options);
    go.addEventListener('lw-success', () => this.#finish(), options);
    // The ring follows its plan when the text first lays out or reflows.
    const observer = new ResizeObserver(() => this.#paintPlans());
    observer.observe(plans);
    this.signal.addEventListener('abort', () => {
      observer.disconnect();
      clearTimeout(this.#settle);
    });
  }

  updated(changed) {
    if (['plans', 'current', 'meters'].some((name) => changed.has(name))) this.#buildPlans();
    if (['meters', 'plans'].some((name) => changed.has(name))) this.#buildMeters();
    paintBilling(this);
    this.#paint();
  }

  get #from() {
    return this.plans.find((plan) => plan.id === this.current) ?? this.plans[0];
  }

  get #to() {
    return this.#upgrades.find((plan) => plan.id === this.value) ?? this.#upgrades[0] ?? this.#from;
  }

  // The plans above the current one.
  get #upgrades() {
    return this.plans.slice(this.plans.indexOf(this.#from) + 1);
  }

  get #detail() {
    return { plan: this.#to.id, billing: this.billing, total: this.#bill.total };
  }

  // What a plan adds on the first meter, e.g. "5× build minutes".
  #gain(plan) {
    const meter = this.meters?.[0];
    const now = meter && this.#from.limits[meter.key];
    if (!now) return '';
    return `${whole.format(plan.limits[meter.key] / now)}× ${meter.label.toLowerCase()}`;
  }

  #buildPlans() {
    const plans = this.query('.plans');
    plans.querySelectorAll('.plan').forEach((each) => each.remove());
    plans.insertAdjacentHTML('beforeend', this.#upgrades
      .map((plan) => `<button class="plan" type="button" role="radio" data-id="${escapeHtml(plan.id)}"><span class="plan-top"><span class="plan-name">${escapeHtml(plan.name)}</span><span class="dot" aria-hidden="true"></span></span><span class="plan-price">${priceMarkup('price')}<span class="per"></span></span><span class="gain">${escapeHtml(this.#gain(plan))}</span></button>`)
      .join(''));
  }

  #buildMeters() {
    this.query('.meters').innerHTML = (this.meters ?? [])
      .map((meter) => `<div class="meter" data-key="${escapeHtml(meter.key)}"><div class="meter-head"><span class="meter-label">${escapeHtml(meter.label)}</span><span class="figures"><span class="used"></span>${strokeIcon(arrowRight, 12)}<b class="next"></b></span></div><div class="bar" aria-hidden="true"><span class="room"></span><span class="fill"></span><span class="limit"></span></div></div>`)
      .join('');
  }

  #paintPlans() {
    let chosen = null;
    for (const element of this.shadowRoot.querySelectorAll('.plan')) {
      const plan = this.plans.find((each) => each.id === element.dataset.id);
      const checked = plan === this.#to;
      element.ariaChecked = String(checked);
      element.ariaDisabled = this.#done && !checked ? 'true' : null;
      element.tabIndex = checked ? 0 : -1;
      const yearly = this.billing === 'yearly';
      paintPrice(element.querySelector('.price'), yearly ? plan.monthly * YEARLY_MONTHS : plan.monthly);
      element.querySelector('.per').textContent = yearly ? '/ year' : '/ month';
      if (checked) chosen = element;
    }
    if (chosen?.offsetWidth) moveHighlight(this.query('.plan-ring'), chosen);
  }

  // Each meter on the larger scale of the two limits: what is used, the
  // current limit with a mark at its end, and past it the room the new plan
  // adds. Widths ease from one plan to the next.
  #paintMeters() {
    for (const meter of this.meters ?? []) {
      const element = this.query(`.meter[data-key="${CSS.escape(meter.key)}"]`);
      if (!element) continue;
      const used = this.usage?.[meter.key] ?? 0;
      const now = this.#from.limits[meter.key];
      const next = this.#to.limits[meter.key];
      const scale = Math.max(next, now, used);
      element.toggleAttribute('data-near', used / now >= NEAR_LIMIT);
      element.style.setProperty('--_used', percent(used, scale));
      element.style.setProperty('--_now', percent(now, scale));
      element.querySelector('.used').textContent = `${amountOf(used, meter.unit)} of ${amountOf(now, meter.unit)}`;
      element.querySelector('.next').textContent = amountOf(next, meter.unit);
      element.ariaLabel = `${meter.label}: ${amountOf(used, meter.unit)} used of ${amountOf(now, meter.unit)}, ${amountOf(next, meter.unit)} on ${this.#to.name}`;
    }
  }

  // Today's bill: the new plan for the rest of the cycle, or a year of it,
  // less the unused days of the current one, plus tax.
  get #bill() {
    const from = this.#from;
    const to = this.#to;
    const yearly = this.billing === 'yearly';
    const today = new Date();
    const renews = new Date(today.getTime() + this.daysLeft * DAY_MS);
    const share = this.daysLeft / this.cycleDays;
    const charge = cents(yearly ? to.monthly * YEARLY_MONTHS : to.monthly * share);
    const credit = cents(from.monthly * share);
    const tax = cents((Math.max(0, charge - credit) * this.tax) / 100);
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    const period = yearly ? `${longDate.format(today)} – ${longDate.format(nextYear)}` : `${shortDate.format(today)} – ${shortDate.format(renews)}, prorated`;
    return {
      lines: [
        { label: `${to.name}, ${this.billing}`, detail: period, amount: charge },
        { label: `Unused time on ${from.name}`, detail: `${this.daysLeft} of ${this.cycleDays} days`, amount: -credit },
        { label: `Tax`, detail: `${this.tax}%`, amount: tax },
      ],
      total: cents(Math.max(0, charge - credit) + tax),
      then: yearly ? `Then ${formatMoney(to.monthly * YEARLY_MONTHS)} a year from ${longDate.format(nextYear)}. Cancel any time.` : `Then ${formatMoney(to.monthly)} a month from ${shortDate.format(renews)}. Cancel any time.`,
    };
  }

  #paint() {
    const to = this.#to;
    this.query('.from').textContent = this.#from.name;
    swapText(this.query('.to-name'), to.name);
    this.query('.added-key').textContent = `Added with ${to.name}`;
    this.#paintPlans();
    this.#paintMeters();
    const bill = this.#bill;
    const lines = this.query('.lines');
    if (lines.children.length !== bill.lines.length) {
      lines.innerHTML = bill.lines.map(() => `<div class="line"><dt><span class="line-label"></span><span class="line-detail"></span></dt><dd>${priceMarkup()}</dd></div>`).join('');
    }
    bill.lines.forEach((line, i) => {
      const element = lines.children[i];
      element.querySelector('.line-label').textContent = line.label;
      element.querySelector('.line-detail').textContent = line.detail ?? '';
      paintPrice(element.querySelector('.amount'), line.amount, true);
    });
    paintPrice(this.query('.total-amount'), bill.total, true);
    this.query('.then').textContent = bill.then;
    this.query('.go').amount = bill.total;
    this.query('.done-text').textContent = `You're on ${to.name}. Your new limits are live.`;
  }

  #select(id) {
    if (id === this.value || this.#done) return;
    this.value = id;
    this.emit('select', { plan: id });
  }

  // Paid: the check shows on the button, then the summary settles on the new plan.
  #finish() {
    const detail = this.#detail;
    this.#done = true;
    this.toggleAttribute('data-done', true);
    this.#paintPlans();
    this.emit('confirm', detail);
    this.#settle = setTimeout(() => {
      const go = this.query('.go');
      const done = this.query('.done');
      go.hidden = true;
      done.hidden = false;
      if (!reducedMotion.matches) done.animate({ opacity: [0, 1], translate: ['0 0.25rem', '0 0'] }, { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    }, reducedMotion.matches ? 0 : SETTLE_MS);
  }
}
