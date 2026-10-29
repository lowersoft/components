import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { minus, plus } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import '../pay-button/index.js';
import '../switch/index.js';
import styles from './order-summary-card.scss?inline';

// Drawn product tiles, so the demo needs no images.
const ART = {
  mug: '<rect x="14" y="16" width="22" height="22" rx="4"/><path d="M36 21h3a5 5 0 0 1 0 10h-3" fill="none" stroke-width="3"/>',
  notebook: '<rect x="15" y="10" width="22" height="30" rx="2"/><path d="M19 10v30" stroke-width="2"/><rect x="23" y="16" width="10" height="3" rx="1" class="soft"/>',
  candle: '<rect x="17" y="20" width="18" height="20" rx="3"/><path d="M26 19c-3-4 0-7 0-10 2 3 4 5 0 10z" class="soft"/>',
};

const DEMO_ITEMS = [
  { id: 'mug', name: 'LowerSoft mug', detail: 'Segfault · 350 ml', price: 28, quantity: 2, art: 'mug', tint: '#d6c3a5' },
  { id: 'notebook', name: 'Field notebook', detail: 'Memory map grid · A5', price: 18, quantity: 1, art: 'notebook', tint: '#9fb4a6' },
  { id: 'candle', name: 'Release candle', detail: 'Clean build · 200 g', price: 32, quantity: 1, art: 'candle', tint: '#c9a49a' },
];

const PROMOS = { WELCOME10: { label: '10% off', percent: 10 }, SAVE5: { label: '$5 off', amount: 5 } };
const EXPRESS = 9;
const TAX = 0.08;

/**
 * A calm checkout summary: drawn product tiles with quiet quantity
 * controls, an Express delivery switch and an inline promo code. The totals
 * roll only the digits that change, and Pay eases from a spinner to Paid.
 *
 * Items are `{ id, name, detail?, price, quantity, art?, tint? }`, where
 * `art` is `mug`, `notebook` or `candle` and `tint` colours its tile.
 *
 * @attr {Array<object>} items - The items (JSON); quantities are kept up to date
 * @attr {string} currency - ISO 4217 code
 * @attr {boolean} express - Express delivery
 * @attr {string} promo - An applied promo code
 * @fires lw-change - The order changed; `detail: { items, express, promo, total }`
 */
export class LwOrderSummaryCard extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    currency: { default: 'USD' },
    express: { type: Boolean },
    promo: { default: '' },
  };

  render() {
    return `<p class="heading">Order summary</p>
<ul class="items"></ul>
<div class="delivery"><lw-switch class="express" size="sm">Express delivery</lw-switch><span class="arrives"></span></div>
<div class="promo"><button class="add-promo" type="button">Add promo code</button><form class="promo-form" hidden><input class="code" type="text" placeholder="Promo code" aria-label="Promo code" autocomplete="off" spellcheck="false"><button class="apply" type="submit">Apply</button></form><p class="promo-note" aria-live="polite"></p></div>
<dl class="totals"><div><dt>Subtotal</dt><dd class="subtotal"></dd></div><div><dt>Shipping</dt><dd class="shipping"></dd></div><div class="discount-row" hidden><dt class="discount-label"></dt><dd class="discount"></dd></div><div><dt>Tax</dt><dd class="tax"></dd></div><div class="total-row"><dt>Total</dt><dd class="total"></dd></div></dl>
<lw-pay-button class="pay"></lw-pay-button>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.items').addEventListener('click', (event) => this.#quantity(event), options);
    this.query('.express').addEventListener('change', (event) => {
      this.express = event.target.checked;
      this.#changed();
    }, options);
    this.query('.add-promo').addEventListener('click', () => this.#openPromo(), options);
    this.query('.promo-form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#apply();
    }, options);
  }

  updated(changed) {
    if (changed.has('items')) this.#build();
    this.query('.express').checked = Boolean(this.express);
    this.#paint();
  }

  get #money() {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: this.currency });
  }

  get #totals() {
    const subtotal = this.items.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
    const promo = PROMOS[this.promo];
    const discount = promo ? (promo.percent ? (subtotal * promo.percent) / 100 : Math.min(promo.amount, subtotal)) : 0;
    const shipping = this.express ? EXPRESS : 0;
    const tax = Math.round((subtotal - discount) * TAX * 100) / 100;
    return { subtotal, discount, shipping, tax, total: subtotal - discount + shipping + tax };
  }

  #build() {
    this.query('.items').innerHTML = this.items
      .map(
        (item) =>
          `<li data-id="${escapeHtml(item.id)}"><span class="tile" style="--_tint: ${escapeHtml(item.tint ?? '#d4d4d8')}" aria-hidden="true"><svg viewBox="0 0 52 52">${ART[item.art] ?? ART.mug}</svg></span><span class="what"><span class="name">${escapeHtml(item.name)}</span><span class="detail">${escapeHtml(item.detail ?? '')}</span></span><span class="stepper"><button class="less" type="button" aria-label="One less ${escapeHtml(item.name)}">${strokeIcon(minus, 14)}</button><span class="qty" aria-live="polite"></span><button class="more" type="button" aria-label="One more ${escapeHtml(item.name)}">${strokeIcon(plus, 14)}</button></span><span class="line rolling"></span></li>`,
      )
      .join('');
  }

  #paint() {
    const money = this.#money;
    const totals = this.#totals;
    for (const li of this.shadowRoot.querySelectorAll('.items li')) {
      const item = this.items.find(({ id }) => id === li.dataset.id);
      li.querySelector('.qty').textContent = String(item.quantity);
      li.querySelector('.less').disabled = item.quantity <= 1;
      roll(li.querySelector('.line'), money.format(item.price * item.quantity));
    }
    this.query('.arrives').textContent = this.express ? 'Arrives tomorrow' : 'Free · arrives Thu';
    // Each total rolls only the digits that change.
    for (const key of ['subtotal', 'tax', 'total']) this.#roll(this.query(`.${key}`), money.format(totals[key]));
    this.#roll(this.query('.shipping'), totals.shipping ? money.format(totals.shipping) : 'Free');
    const promo = PROMOS[this.promo];
    this.query('.discount-row').hidden = !promo;
    if (promo) {
      this.query('.discount-label').textContent = `${this.promo} · ${promo.label}`;
      this.#roll(this.query('.discount'), `−${money.format(totals.discount)}`);
    }
    const pay = this.query('.pay');
    pay.amount = Math.round(totals.total * 100) / 100;
    pay.currency = this.currency;
    pay.locale = 'en-US';
  }

  #roll(el, text) {
    el.classList.add('rolling');
    roll(el, text);
  }

  #changed() {
    this.emit('change', { items: this.items, express: Boolean(this.express), promo: this.promo, total: this.#totals.total });
  }

  #quantity(event) {
    const button = event.target.closest('.less, .more');
    if (!button) return;
    const id = button.closest('li').dataset.id;
    const step = button.classList.contains('more') ? 1 : -1;
    this.items = this.items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + step) } : item));
    this.#changed();
  }

  // ---- Promo code ----

  #openPromo() {
    this.query('.add-promo').hidden = true;
    const form = this.query('.promo-form');
    form.hidden = false;
    if (!reducedMotion.matches) form.animate([{ opacity: 0, translate: '0 -4px' }, { opacity: 1, translate: '0 0' }], { duration: 200, easing: 'ease-out' });
    this.query('.code').focus();
  }

  #apply() {
    const input = this.query('.code');
    const code = input.value.trim().toUpperCase();
    const note = this.query('.promo-note');
    if (!PROMOS[code]) {
      note.textContent = code ? "That code isn't valid." : 'Enter a code first.';
      note.dataset.tone = 'error';
      if (!reducedMotion.matches) input.animate([{ translate: '0' }, { translate: '-4px' }, { translate: '4px' }, { translate: '0' }], { duration: 240 });
      return;
    }
    this.promo = code;
    note.textContent = `${code} applied: ${PROMOS[code].label}.`;
    note.dataset.tone = 'ok';
    this.query('.promo-form').hidden = true;
    this.#changed();
  }
}
