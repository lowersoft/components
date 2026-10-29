import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { billingToggle, DEMO_PLANS, formatMoney, monthlyPrice, paintBilling, paintPrice, priceMarkup, pricingStyles, wireBilling } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import { swapStyles, swapText } from '../../core/swap.js';
import '../button/index.js';
import styles from './layer-stack-pricing.scss?inline';

const [hobby, pro, team] = DEMO_PLANS;
const DEMO_LAYERS = [
  { ...hobby, stats: { Projects: '3', 'Events / mo': '1,000', History: '7 days', Seats: '1' }, adds: ['Unlimited viewers', 'Shareable dashboards', 'Community support'] },
  { ...pro, stats: { Projects: 'Unlimited', 'Events / mo': '50,000', History: '90 days', Seats: '3' }, adds: ['Custom domains', 'API access', 'Email support'] },
  { ...team, stats: { Projects: 'Unlimited', 'Events / mo': '500,000', History: '1 year', Seats: '10' }, adds: ['Roles and permissions', 'Audit log', 'Priority support'] },
];

// The isometric slab: half its width and depth on screen, its thickness,
// and the rise from one layer to the next.
const HALF_WIDTH = 130;
const HALF_DEPTH = 75;
const THICKNESS = 20;
const RISE = 58;
const VIEW = { width: 300, height: 420 };

const pad = (n) => String(n).padStart(2, '0');

// One slab's three faces and the label along its left edge, centred on (cx, cy).
const slab = (layer, i, cx, cy) => {
  const [w, h, t] = [HALF_WIDTH, HALF_DEPTH, THICKNESS];
  const points = (list) => list.map(([x, y]) => `${x},${y}`).join(' ');
  return `<g class="layer" data-index="${i}"><g class="lift">
<polygon class="side left" points="${points([[cx - w, cy], [cx, cy + h], [cx, cy + h + t], [cx - w, cy + t]])}"/>
<polygon class="side right" points="${points([[cx, cy + h], [cx + w, cy], [cx + w, cy + t], [cx, cy + h + t]])}"/>
<polygon class="top" points="${points([[cx, cy - h], [cx + w, cy], [cx, cy + h], [cx - w, cy]])}"/>
<text class="label" transform="translate(${cx - w + 12} ${cy + 15}) skewY(30)">${pad(i + 1)} ${escapeHtml(layer.name)}</text></g></g>`;
};

/**
 * Plans as layers, each built on the one below. Choosing a plan stacks its
 * layer and those under it, while the layers above lift away; the summary
 * shows its price, its limits, and what each layer adds, those above it
 * stepping back. Monthly or yearly rolls the price.
 *
 * Layers are `{ id, name, blurb, monthly, stats, adds }`, cheapest first,
 * with `stats` as label to value and `adds` as what the layer brings.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {'monthly'|'yearly'} billing
 * @attr {string} note - Beside the switch
 * @attr {string} value - The chosen layer's id
 * @attr {Array<object>} layers (JSON)
 * @fires lw-change - Billing changed; `detail: { billing }`
 * @fires lw-select - A layer was chosen; `detail: { plan }`
 * @fires lw-choose - The action was chosen; `detail: { plan, billing, price }`
 */
export class LwLayerStackPricing extends LwElement {
  static styles = [rollingStyles, swapStyles, pricingStyles, styles];
  static props = {
    heading: { default: 'Build up to the plan you need.' },
    description: { default: 'Each plan is a layer on the one below. Stop where it fits.' },
    billing: { default: 'monthly', reflect: true },
    note: { default: '2 months free on yearly' },
    value: { default: 'team', reflect: true },
    layers: { type: Object, default: DEMO_LAYERS },
  };

  render() {
    return `<header class="head"><div><h2 class="title"></h2><p class="description"></p></div><div class="switch">${billingToggle()}<span class="note"></span></div></header>
<div class="frame"><figure class="stage"><svg class="stack" viewBox="0 0 ${VIEW.width} ${VIEW.height}" aria-hidden="true"></svg><figcaption class="caption"><span class="position"></span><span class="swap current"></span></figcaption></figure>
<div class="panel"><div class="plans" role="radiogroup" aria-label="Plan"></div>
<div class="summary"><div class="cost"><div><p class="price">${priceMarkup()}<span class="per">/ month</span></p><p class="billed"></p></div><lw-button class="action"></lw-button></div>
<dl class="stats"></dl><ol class="adds"></ol></div></div></div>`;
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
      const step = { ArrowDown: -1, ArrowRight: -1, ArrowUp: 1, ArrowLeft: 1 }[event.key];
      if (!step) return;
      event.preventDefault();
      // The list runs top layer first, so down is a layer lower.
      const next = this.layers[Math.min(this.layers.length - 1, Math.max(0, this.#index + step))];
      this.#select(next.id);
      this.query(`.plan[data-id="${CSS.escape(next.id)}"]`).focus();
    }, options);
    this.query('.stack').addEventListener('click', (event) => {
      const layer = event.target.closest('.layer');
      if (layer) this.#select(this.layers[Number(layer.dataset.index)].id);
    }, options);
    this.query('.action').addEventListener('click', () => {
      const layer = this.layers[this.#index];
      this.emit('choose', { plan: layer.id, billing: this.billing, price: monthlyPrice(layer.monthly, this.billing) });
    }, options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.note').textContent = this.note ?? '';
    if (changed.has('layers')) this.#build();
    paintBilling(this);
    this.#paint();
  }

  get #index() {
    return Math.max(0, (this.layers ?? []).findIndex((layer) => layer.id === this.value));
  }

  #build() {
    const layers = this.layers ?? [];
    const cx = VIEW.width / 2;
    const bottom = VIEW.height / 2 + ((layers.length - 1) * RISE) / 2 + 10;
    this.query('.stack').innerHTML = layers.map((layer, i) => slab(layer, i, cx, bottom - i * RISE)).join('');
    this.query('.plans').innerHTML = layers
      .map((layer, i) => `<button class="plan" type="button" role="radio" data-id="${escapeHtml(layer.id)}"><span class="radio" aria-hidden="true"></span><span class="plan-text"><span class="plan-name"><span class="index">${pad(i + 1)}</span>${escapeHtml(layer.name)}</span><span class="blurb">${escapeHtml(layer.blurb)}</span></span><span class="plan-price"></span></button>`)
      .reverse()
      .join('');
    this.query('.stats').innerHTML = Object.keys(layers[0]?.stats ?? {})
      .map((label) => `<div class="stat"><dt>${escapeHtml(label)}</dt><dd class="swap" data-stat="${escapeHtml(label)}"></dd></div>`)
      .join('');
    this.query('.adds').innerHTML = layers
      .map((layer, i) => `<li class="add" data-index="${i}"><span class="index">${pad(i + 1)}</span><span class="add-title">${i ? `Added in ${escapeHtml(layer.name)}` : `From ${escapeHtml(layer.name)}`}</span><span class="add-items">${layer.adds.map((each) => `<span>${escapeHtml(each)}</span>`).join('')}</span></li>`)
      .join('');
  }

  #paint() {
    const layers = this.layers ?? [];
    const index = this.#index;
    const layer = layers[index];
    if (!layer) return;
    for (const element of this.shadowRoot.querySelectorAll('.layer')) {
      const i = Number(element.dataset.index);
      element.toggleAttribute('data-above', i > index);
      element.toggleAttribute('data-current', i === index);
    }
    for (const plan of this.shadowRoot.querySelectorAll('.plan')) {
      const each = layers.find((item) => item.id === plan.dataset.id);
      const checked = each === layer;
      plan.ariaChecked = String(checked);
      plan.tabIndex = checked ? 0 : -1;
      plan.querySelector('.plan-price').innerHTML = `<b>${formatMoney(monthlyPrice(each.monthly, this.billing))}</b>/mo`;
    }
    for (const add of this.shadowRoot.querySelectorAll('.add')) add.toggleAttribute('data-above', Number(add.dataset.index) > index);
    this.query('.position').textContent = `Layer ${pad(index + 1)} of ${pad(layers.length)}`;
    swapText(this.query('.current'), layer.name);

    const price = monthlyPrice(layer.monthly, this.billing);
    paintPrice(this.query('.amount'), price);
    const yearly = this.billing === 'yearly';
    this.query('.billed').textContent = !layer.monthly
      ? 'Free forever'
      : yearly ? `Billed yearly · ${formatMoney(price * 12)} a year` : `Billed monthly · ${formatMoney(monthlyPrice(layer.monthly, 'yearly'))}/mo on yearly`;
    this.query('.action').textContent = `Choose ${layer.name}`;
    for (const value of this.shadowRoot.querySelectorAll('[data-stat]')) swapText(value, layer.stats[value.dataset.stat] ?? '—');
  }

  #select(id) {
    if (id === this.value) return;
    this.value = id;
    this.emit('select', { plan: id });
  }
}
