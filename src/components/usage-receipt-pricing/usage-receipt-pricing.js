import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight, rotateCcw } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { billingToggle, formatMoney, paintBilling, paintPrice, priceMarkup, pricingStyles, wireBilling } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import '../range/index.js';
import styles from './usage-receipt-pricing.scss?inline';

const DEMO_METERS = [
  { id: 'members', label: 'Team members', min: 1, max: 50, step: 1, value: 8, rate: 5, per: 1, note: '$5 per member' },
  { id: 'requests', label: 'API requests', min: 50000, max: 2000000, step: 50000, value: 400000, rate: 4, per: 100000, included: 100000, note: '$4 per 100K, first 100K included' },
  { id: 'storage', label: 'Storage', min: 10, max: 500, step: 10, value: 80, unit: ' GB', rate: 0.25, per: 1, included: 20, note: '$0.25 per GB, first 20 GB included' },
  { id: 'credits', label: 'AI credits', min: 5000, max: 100000, step: 5000, value: 20000, rate: 1, per: 1000, note: '$1 per 1K credits' },
];

// Wait this long after the last change before reading the total out.
const ANNOUNCE_MS = 600;

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const today = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

/** `400K`, `1.5M`, or the number whole below ten thousand, with its unit. */
const amount = (value, unit = '') => `${value >= 10000 ? compact.format(value) : value.toLocaleString('en-US')}${unit}`;

/** What a meter costs a month at `value`. */
const meterCost = (meter, value) => (Math.max(0, value - (meter.included ?? 0)) / (meter.per || 1)) * meter.rate;

// Cents only when the figure has them.
const money = (value) => formatMoney(Math.round(value * 100) / 100);

// The bars of the barcode at the foot of the receipt, as widths, bar and
// gap in turn.
const BARS = [2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 3, 1, 1, 2, 2, 1, 1, 3, 1, 2, 1, 2, 1, 1, 3, 1, 2, 2, 1, 1, 2, 1];
const barcode = () => {
  let x = 0;
  const rects = BARS.map((width, i) => {
    const rect = i % 2 ? '' : `<rect x="${x}" width="${width}" height="28"/>`;
    x += width;
    return rect;
  });
  return `<svg class="barcode" viewBox="0 0 ${x} 28" preserveAspectRatio="none" fill="currentColor" aria-hidden="true">${rects.join('')}</svg>`;
};

/**
 * Usage pricing as a till receipt. The meters sit in one panel with the
 * billing switch and a reset; each says what it costs a month as you drag
 * it. Beside them a dated receipt prints the base plan and a line per
 * meter, joined to its cost by a dotted leader, and the line of the meter
 * under your pointer or focus lights up. Usage inside an allowance reads
 * "Included". Annual billing takes its discount off, adds the yearly charge
 * and says what the year saves. Every meter is the library's range, a
 * native slider underneath; the total is read out once you stop dragging.
 *
 * Meters are `{ id, label, min, max, step, value, rate, per, included?,
 * unit?, note? }`: each `per` units past `included` cost `rate` dollars a
 * month.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {'monthly'|'yearly'} billing
 * @attr {number} base - The base plan's monthly price
 * @attr {number} discount - Percent off on annual billing
 * @attr {string} action - The estimate's button
 * @attr {string} secondary - The second button
 * @attr {string} fine - The small print at the foot of the receipt
 * @attr {Array<object>} meters (JSON)
 * @fires lw-change - Billing changed; `detail: { billing }`
 * @fires lw-input - A meter moved, or all were reset; `detail: { id, value, values, total }`, `id` null after a reset
 * @fires lw-choose - A button was pressed; `detail: { action: 'estimate'|'sales', billing, total, values }`
 * @csspart meters - The panel of meters
 * @csspart receipt
 */
export class LwUsageReceiptPricing extends LwElement {
  static styles = [rollingStyles, pricingStyles, styles];
  static props = {
    heading: { default: 'Drag the meters. Read the bill.' },
    description: { default: 'One base plan, then only what you use. Set the meters to your month and the receipt does the sums.' },
    billing: { default: 'monthly', reflect: true },
    base: { type: Number, default: 29 },
    discount: { type: Number, default: 20 },
    action: { default: 'Start with this estimate' },
    secondary: { default: 'Talk to sales' },
    fine: { default: 'USD, before tax · Billed on actual use' },
    meters: { type: Object, default: DEMO_METERS },
  };

  // The value of each meter, by id.
  #values = new Map();
  #timer = 0;
  // The meter under the pointer, and the one with focus.
  #hovered = null;
  #focused = null;

  render() {
    return `<section class="section" aria-labelledby="heading"><div class="controls"><h2 class="title" id="heading"></h2><p class="description"></p>
<div class="panel" part="meters"><div class="panel-head">${billingToggle({ monthly: 'Monthly', yearly: 'Annual <span class="save"></span>' })}
<lw-button class="reset" variant="ghost" size="sm">${strokeIcon(rotateCcw, 14).replace('<svg', '<svg slot="start"')}Reset</lw-button></div><div class="meters"></div></div></div>
<aside class="receipt" part="receipt" aria-labelledby="receipt-title"><header class="receipt-head"><span class="receipt-title" id="receipt-title">Estimate</span><span class="receipt-no">No. 0418</span></header>
<p class="receipt-meta"><span>${today.format(new Date())}</span><span class="cycle"></span></p>
<ul class="lines"></ul><div class="rule" role="presentation"></div><ul class="sums"></ul>
<div class="total"><span class="total-label">Total / month</span>${priceMarkup()}</div><p class="billed"></p><p class="saved"></p>
<div class="actions"><lw-button class="estimate" data-action="estimate"><span class="estimate-label"></span><span class="arrow" slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button><lw-button class="sales" data-action="sales" variant="outline"></lw-button></div>
<footer class="receipt-foot">${barcode()}<span class="fine"></span></footer>
<p class="visually-hidden announce" aria-live="polite"></p></aside></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    wireBilling(this);
    const meters = this.query('.meters');
    meters.addEventListener('input', (event) => {
      const range = event.target.closest('lw-range');
      if (!range) return;
      const value = Number(range.value);
      this.#values.set(range.dataset.id, value);
      this.#paint();
      this.emit('input', { id: range.dataset.id, value, values: Object.fromEntries(this.#values), total: this.#total() });
    }, options);
    // The meter you are on lights its line on the receipt.
    const meterOf = (target) => target?.closest?.('.meter')?.dataset.id ?? null;
    meters.addEventListener('pointerover', (event) => this.#light({ hovered: meterOf(event.target) }), options);
    meters.addEventListener('pointerleave', () => this.#light({ hovered: null }), options);
    meters.addEventListener('focusin', (event) => this.#light({ focused: meterOf(event.target) }), options);
    meters.addEventListener('focusout', (event) => meterOf(event.relatedTarget) !== this.#focused && this.#light({ focused: null }), options);
    this.query('.reset').addEventListener('click', () => {
      this.#values = this.#defaults();
      for (const range of meters.querySelectorAll('lw-range')) range.value = String(this.#values.get(range.dataset.id));
      this.#paint();
      this.emit('input', { id: null, value: null, values: Object.fromEntries(this.#values), total: this.#total() });
    }, options);
    this.query('.actions').addEventListener('click', (event) => {
      const button = event.target.closest('lw-button');
      if (button) this.emit('choose', { action: button.dataset.action, billing: this.billing, total: this.#total(), values: Object.fromEntries(this.#values) });
    }, options);
    this.signal.addEventListener('abort', () => clearTimeout(this.#timer));
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    const description = this.query('.description');
    description.textContent = this.description ?? '';
    description.hidden = !this.description;
    // The Annual option says what it saves.
    const save = this.query('.save');
    save.textContent = this.discount ? `−${this.discount}%` : '';
    save.hidden = !this.discount;
    this.query('.estimate-label').textContent = this.action ?? '';
    this.query('.estimate').hidden = !this.action;
    this.query('.sales').textContent = this.secondary ?? '';
    this.query('.sales').hidden = !this.secondary;
    this.query('.fine').textContent = this.fine ?? '';
    if (changed.has('meters')) this.#build();
    paintBilling(this);
    this.#paint();
  }

  get #meters() {
    return Array.isArray(this.meters) ? this.meters : [];
  }

  #defaults() {
    return new Map(this.#meters.map((meter) => [meter.id, meter.value ?? meter.min]));
  }

  #build() {
    this.#values = this.#defaults();
    this.#hovered = this.#focused = null;
    // Built as elements so each range has its formatter before it first
    // shows a value.
    this.query('.meters').replaceChildren(
      ...this.#meters.map((meter) => {
        const range = document.createElement('lw-range');
        range.dataset.id = meter.id;
        range.formatValue = (value) => amount(value, meter.unit);
        Object.assign(range, { label: meter.label, min: meter.min, max: meter.max, step: meter.step ?? 1, value: String(meter.value ?? meter.min), hint: meter.note ?? '' });
        const cost = Object.assign(document.createElement('span'), { className: 'meter-cost' });
        const row = Object.assign(document.createElement('div'), { className: 'meter' });
        row.dataset.id = meter.id;
        row.append(range, cost);
        return row;
      }),
    );
    const line = (id, label) =>
      `<li class="line" data-line="${escapeHtml(id)}"><span class="item">${escapeHtml(label)}<span class="detail"></span></span><span class="leader" aria-hidden="true"></span>${priceMarkup('cost')}</li>`;
    this.query('.lines').innerHTML = line('base', 'Base plan') + this.#meters.map((meter) => line(meter.id, meter.label)).join('');
  }

  #light({ hovered = this.#hovered, focused = this.#focused }) {
    this.#hovered = hovered;
    this.#focused = focused;
    const active = hovered ?? focused;
    for (const line of this.shadowRoot.querySelectorAll('.line')) line.toggleAttribute('data-active', line.dataset.line === active);
  }

  // The usage before any discount, a month.
  #subtotal() {
    return (this.base ?? 0) + this.#meters.reduce((sum, meter) => sum + meterCost(meter, this.#values.get(meter.id) ?? meter.min), 0);
  }

  // What is paid a month on the billing chosen.
  #total() {
    const subtotal = this.#subtotal();
    return Math.round((this.billing === 'yearly' ? subtotal * (1 - (this.discount ?? 0) / 100) : subtotal) * 100) / 100;
  }

  #paint() {
    const root = this.shadowRoot;
    const lineOf = (id) => root.querySelector(`.line[data-line="${CSS.escape(id)}"]`);
    if (!lineOf('base')) return;
    paintPrice(lineOf('base').querySelector('.cost'), money(this.base ?? 0));
    const defaults = this.#defaults();
    let changed = false;
    for (const meter of this.#meters) {
      const value = this.#values.get(meter.id) ?? meter.min;
      const included = meter.included ?? 0;
      const cost = meterCost(meter, value);
      // Inside its allowance, a meter costs nothing and says so.
      const shown = !cost && included ? 'Included' : money(cost);
      const line = lineOf(meter.id);
      paintPrice(line.querySelector('.cost'), shown);
      line.toggleAttribute('data-free', !cost);
      line.querySelector('.detail').textContent = included
        ? `${amount(value, meter.unit)} · ${amount(Math.min(value, included), meter.unit)} included`
        : `${amount(value, meter.unit)} × ${money(meter.rate)}${meter.per > 1 ? ` / ${compact.format(meter.per)}` : ''}`;
      const row = root.querySelector(`.meter[data-id="${CSS.escape(meter.id)}"] .meter-cost`);
      row.textContent = shown === 'Included' ? shown : `${shown} / mo`;
      row.toggleAttribute('data-free', !cost);
      if (value !== defaults.get(meter.id)) changed = true;
    }
    this.query('.reset').disabled = !changed;
    const yearly = this.billing === 'yearly';
    const subtotal = this.#subtotal();
    const total = this.#total();
    const saving = Math.round((subtotal - total) * 100) / 100;
    this.query('.cycle').textContent = yearly ? 'Annual plan' : 'Monthly plan';
    this.query('.sums').innerHTML = yearly && this.discount
      ? `<li class="line"><span class="item">Subtotal</span><span class="leader" aria-hidden="true"></span><span class="cost">${money(subtotal)}</span></li><li class="line off"><span class="item">Annual discount ${this.discount}%</span><span class="leader" aria-hidden="true"></span><span class="cost">−${money(saving)}</span></li>`
      : '';
    paintPrice(this.query('.total .amount'), total, !Number.isInteger(total));
    const billed = yearly ? `${money(total * 12)} billed yearly` : 'Billed monthly · cancel anytime';
    this.query('.billed').textContent = billed;
    const saved = this.query('.saved');
    saved.textContent = yearly && saving ? `You save ${money(saving * 12)} a year` : '';
    saved.hidden = !saved.textContent;
    // Read out once, after the dragging stops.
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => {
      this.query('.announce').textContent = `Estimated total ${money(total)} a month, ${billed.toLowerCase()}.`;
    }, ANNOUNCE_MS);
  }
}
