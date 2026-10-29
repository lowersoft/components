import { escapeHtml } from '../../core/dom.js';
import { moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { billingToggle, formatMoney, paintBilling, paintPrice, priceMarkup, pricingStyles, wireBilling, YEARLY_MONTHS } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import styles from './upgrade-summary.scss?inline';

const DAY_MS = 86_400_000;
const SEGMENTS = 32;
// Use past this share of the current limit shows as close to it.
const NEAR_LIMIT = 0.8;

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
const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const longDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const cents = (value) => Math.round(value * 100) / 100;

// "4.2 GB", "1 TB", or a plain count.
const amountOf = (value, unit) => {
  if (unit !== 'GB') return whole.format(value);
  return value >= 1000 ? `${whole.format(value / 1000)} TB` : `${whole.format(value)} GB`;
};

/**
 * The last step of an upgrade: what changes before you confirm. Pick the
 * plan and the billing, see this cycle's use against the current limits
 * and the new ones, and the bill for today, prorated and credited for the
 * unused days of the current plan. Confirming waits on `confirm` if set.
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
  static styles = [rollingStyles, pricingStyles, styles];
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

  render() {
    return `<header class="head"><h2 class="route"><span class="from"></span>${strokeIcon(arrowRight, 18)}<span class="to"></span></h2><p class="lead">Review what changes before you confirm.</p></header>
<section class="choose"><div class="targets" role="radiogroup" aria-label="Plan"><span class="target-bar"></span></div>${billingToggle({ monthly: 'Monthly', yearly: `Yearly · ${12 - YEARLY_MONTHS} months free` })}</section>
<section class="usage" aria-labelledby="usage-title"><h3 class="section-title" id="usage-title">Usage this cycle</h3><div class="meters"></div></section>
<section class="bill" aria-label="Due today"><dl class="lines"></dl><div class="confirm"><p class="then"></p><lw-button class="go"></lw-button></div></section>`;
  }

  connected() {
    wireBilling(this);
    const options = { signal: this.signal };
    const targets = this.query('.targets');
    targets.addEventListener('click', (event) => {
      const target = event.target.closest('.target');
      if (target) this.#select(target.dataset.id);
    }, options);
    targets.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const all = [...targets.querySelectorAll('.target')];
      const next = all[(all.findIndex((each) => each.ariaChecked === 'true') + step + all.length) % all.length];
      this.#select(next.dataset.id);
      next.focus();
    }, options);
    this.query('.go').addEventListener('click', () => this.#confirm(), options);
    // The bar follows its tab when the text first lays out or reflows.
    const observer = new ResizeObserver(() => this.#paintTargets());
    observer.observe(targets);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    if (['plans', 'current'].some((name) => changed.has(name))) this.#buildTargets();
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

  #buildTargets() {
    this.query('.targets').querySelectorAll('.target').forEach((each) => each.remove());
    this.query('.targets').insertAdjacentHTML('beforeend', this.#upgrades
      .map((plan) => `<button class="target" type="button" role="radio" data-id="${escapeHtml(plan.id)}"><span class="target-name">${escapeHtml(plan.name)}</span><span class="target-price"></span></button>`)
      .join(''));
  }

  #buildMeters() {
    const segments = '<span class="segment"></span>'.repeat(SEGMENTS);
    this.query('.meters').innerHTML = (this.meters ?? [])
      .map((meter) => `<div class="meter" data-key="${escapeHtml(meter.key)}"><div class="meter-head"><span>${escapeHtml(meter.label)}</span><span class="meter-value"><span class="used"></span>${strokeIcon(arrowRight, 14)}<span class="next"></span></span></div><div class="track" aria-hidden="true">${segments}<span class="mark"></span></div></div>`)
      .join('');
  }

  #paintTargets() {
    let chosen = null;
    for (const target of this.shadowRoot.querySelectorAll('.target')) {
      const checked = target.dataset.id === this.#to.id;
      const plan = this.plans.find((each) => each.id === target.dataset.id);
      target.ariaChecked = String(checked);
      target.tabIndex = checked ? 0 : -1;
      target.querySelector('.target-price').textContent = this.billing === 'yearly' ? `${formatMoney(plan.monthly * YEARLY_MONTHS)} / year` : `${formatMoney(plan.monthly)} / month`;
      if (checked) chosen = target;
    }
    if (chosen?.offsetWidth) moveHighlight(this.query('.target-bar'), chosen);
  }

  // Each meter on the new limit's scale: what is used, up to the current
  // limit, and the room the new plan adds, with a mark at the current limit.
  #paintMeters() {
    for (const meter of this.meters ?? []) {
      const element = this.query(`.meter[data-key="${CSS.escape(meter.key)}"]`);
      if (!element) continue;
      const used = this.usage?.[meter.key] ?? 0;
      const now = this.#from.limits[meter.key];
      const next = this.#to.limits[meter.key];
      const scale = SEGMENTS / Math.max(next, now, used);
      const usedTo = used > 0 ? Math.max(1, Math.round(used * scale)) : 0;
      const nowTo = Math.round(now * scale);
      element.toggleAttribute('data-near', used / now >= NEAR_LIMIT);
      element.querySelectorAll('.segment').forEach((segment, i) => {
        segment.dataset.state = i < usedTo ? 'used' : i < nowTo ? 'now' : 'next';
      });
      element.querySelector('.mark').style.left = `${(nowTo / SEGMENTS) * 100}%`;
      element.querySelector('.used').textContent = `${amountOf(used, meter.unit)} of ${amountOf(now, meter.unit)}`;
      element.querySelector('.next').textContent = amountOf(next, meter.unit);
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
    const period = yearly
      ? `${longDate.format(today)} – ${longDate.format(nextYear)}`
      : `${shortDate.format(today)} – ${shortDate.format(renews)}, prorated`;
    return {
      lines: [
        { label: `${to.name}, ${this.billing}`, detail: period, amount: charge },
        { label: `Credit for ${this.daysLeft} unused days on ${from.name}`, amount: -credit },
        { label: `Tax (${this.tax}%)`, amount: tax },
      ],
      total: cents(Math.max(0, charge - credit) + tax),
      then: yearly ? `Then ${formatMoney(to.monthly * YEARLY_MONTHS)} a year from ${longDate.format(nextYear)}.` : `Then ${formatMoney(to.monthly)} a month from ${shortDate.format(renews)}.`,
    };
  }

  #paint() {
    this.query('.from').textContent = this.#from.name;
    this.query('.to').textContent = this.#to.name;
    this.#paintTargets();
    this.#paintMeters();
    const bill = this.#bill;
    const lines = this.query('.lines');
    if (lines.children.length !== bill.lines.length + 1) {
      lines.innerHTML = [...bill.lines, null].map((_, i, all) => `<div class="line${i === all.length - 1 ? ' total' : ''}"><dt><span class="line-label"></span><span class="line-detail"></span></dt><dd>${priceMarkup()}</dd></div>`).join('');
    }
    [...bill.lines, { label: 'Due today', amount: bill.total }].forEach((line, i) => {
      const element = lines.children[i];
      element.querySelector('.line-label').textContent = line.label;
      element.querySelector('.line-detail').textContent = line.detail ?? '';
      paintPrice(element.querySelector('.amount'), line.amount, true);
    });
    this.query('.then').textContent = bill.then;
    const go = this.query('.go');
    go.textContent = this.#done ? `You're on ${this.#to.name}` : `Upgrade to ${this.#to.name}`;
    go.disabled = this.#done;
  }

  #select(id) {
    if (id === this.value || this.#done) return;
    this.value = id;
    this.emit('select', { plan: id });
  }

  async #confirm() {
    if (this.#done) return;
    const go = this.query('.go');
    const detail = { plan: this.#to.id, billing: this.billing, total: this.#bill.total };
    go.loading = true;
    try {
      await this.confirm?.(detail);
    } catch {
      return;
    } finally {
      go.loading = false;
    }
    this.#done = true;
    this.#paint();
    this.emit('confirm', detail);
  }
}
