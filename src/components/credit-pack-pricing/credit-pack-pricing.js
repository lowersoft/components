import { escapeHtml } from '../../core/dom.js';
import { moveHighlight } from '../../core/highlight.js';
import { LwElement } from '../../core/lw-element.js';
import { formatMoney, paintPrice, priceMarkup, pricingStyles } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import '../switch/index.js';
import styles from './credit-pack-pricing.scss?inline';

const DEMO_PACKS = [
  { credits: 500, price: 12.5 },
  { credits: 2000, price: 40 },
  { credits: 10_000, price: 175 },
  { credits: 50_000, price: 750 },
];

// What a pack buys, by how many credits one of each costs.
const DEMO_UNITS = [
  { label: 'compile minutes', credits: 1 },
  { label: 'profiler runs', credits: 5 },
  { label: 'fuzzing hours', credits: 25 },
];

const whole = new Intl.NumberFormat('en-US');
const rate = (pack) => pack.price / pack.credits;
const perCredit = (pack) => `$${rate(pack).toFixed(4)}`;

/**
 * Prepaid credits in packs. The balance sits on a bar that shows how far the
 * chosen pack takes it, and says so when it runs low. Each pack shows its
 * rate per credit and what it saves on the smallest; the summary gives the
 * total, the balance after, and what the credits buy. Auto top-up refills
 * the chosen pack when the balance drops below the low mark.
 *
 * Packs are `{ credits, price }`, smallest first; units are
 * `{ label, credits }`, what one of a thing costs.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {number} balance
 * @attr {number} low - The balance that counts as running low
 * @attr {number} value - The chosen pack's credits
 * @attr {boolean} auto - Auto top-up on
 * @attr {Array<object>} packs (JSON)
 * @attr {Array<object>} units (JSON)
 * @fires lw-select - A pack was chosen; `detail: { credits, price }`
 * @fires lw-buy - The pack was bought; `detail: { credits, price, auto }`
 */
export class LwCreditPackPricing extends LwElement {
  static styles = [rollingStyles, pricingStyles, styles];
  static props = {
    heading: { default: 'Buy credits' },
    description: { default: 'Credits are shared across every build target and never expire.' },
    balance: { type: Number, default: 120 },
    low: { type: Number, default: 200 },
    value: { type: Number, default: 2000, reflect: true },
    auto: { type: Boolean, reflect: true },
    packs: { type: Object, default: DEMO_PACKS },
    units: { type: Object, default: DEMO_UNITS },
  };

  render() {
    return `<header class="head"><h2 class="title"></h2><p class="description"></p></header>
<div class="balance"><p class="balance-line"><span>Balance <b>${priceMarkup('now')}</b> credits</span><span class="low-note"></span></p><div class="meter" aria-hidden="true"><span class="after-fill"></span><span class="now-fill"></span></div></div>
<div class="packs" role="radiogroup" aria-label="Credit pack"><span class="pack-bar"></span></div>
<section class="summary" aria-label="Summary"><dl class="figures"><div class="figure total"><dt>Total</dt><dd>${priceMarkup()}</dd></div><div class="figure"><dt>Per credit</dt><dd class="per-credit"></dd></div><div class="figure"><dt>Balance after</dt><dd>${priceMarkup('after')} credits</dd></div></dl>
<p class="buys"></p><div class="actions"><lw-switch class="auto" size="sm"></lw-switch><lw-button class="buy"></lw-button></div></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    const packs = this.query('.packs');
    packs.addEventListener('click', (event) => {
      const pack = event.target.closest('.pack');
      if (pack) this.#select(Number(pack.dataset.credits));
    }, options);
    packs.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const all = this.packs;
      const next = all[(all.indexOf(this.#pack) + step + all.length) % all.length];
      this.#select(next.credits);
      this.query(`.pack[data-credits="${next.credits}"]`).focus();
    }, options);
    const auto = this.query('.auto');
    auto.addEventListener('change', () => {
      this.auto = auto.checked;
    }, options);
    this.query('.buy').addEventListener('click', () => this.emit('buy', { credits: this.#pack.credits, price: this.#pack.price, auto: this.auto }), options);
    const observer = new ResizeObserver(() => this.#paintPacks());
    observer.observe(packs);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    if (changed.has('packs')) this.#build();
    this.#paint();
  }

  get #pack() {
    return this.packs.find((pack) => pack.credits === this.value) ?? this.packs[0];
  }

  #build() {
    const base = rate(this.packs[0]);
    this.query('.packs').querySelectorAll('.pack').forEach((each) => each.remove());
    this.query('.packs').insertAdjacentHTML('beforeend', this.packs
      .map((pack) => {
        const saves = Math.round((1 - rate(pack) / base) * 100);
        return `<button class="pack" type="button" role="radio" data-credits="${pack.credits}"><span class="pack-head"><span class="credits">${whole.format(pack.credits)}</span><span class="radio" aria-hidden="true"></span></span><span class="price">${formatMoney(pack.price)}</span><span class="rate">${perCredit(pack)} / credit</span><span class="saves">${saves > 0 ? `save ${saves}%` : 'base rate'}</span></button>`;
      })
      .join(''));
  }

  #paintPacks() {
    let chosen = null;
    for (const element of this.shadowRoot.querySelectorAll('.pack')) {
      const checked = Number(element.dataset.credits) === this.#pack.credits;
      element.ariaChecked = String(checked);
      element.tabIndex = checked ? 0 : -1;
      if (checked) chosen = element;
    }
    if (chosen?.offsetWidth) moveHighlight(this.query('.pack-bar'), chosen);
  }

  #paint() {
    const pack = this.#pack;
    const after = this.balance + pack.credits;
    const low = this.balance < this.low;
    this.#paintPacks();
    this.toggleAttribute('data-low', low);
    paintPrice(this.query('.now'), whole.format(this.balance));
    this.query('.low-note').textContent = low ? 'Running low' : '';
    // The bar runs to the balance after buying: what is there, and what the pack adds.
    this.query('.now-fill').style.width = `${(this.balance / after) * 100}%`;
    this.query('.after-fill').style.width = '100%';
    paintPrice(this.query('.amount'), pack.price, true);
    this.query('.per-credit').textContent = perCredit(pack);
    paintPrice(this.query('.after'), whole.format(after));
    this.query('.buys').innerHTML = `≈ ${(this.units ?? []).map((unit) => `<b>${whole.format(Math.floor(pack.credits / unit.credits))}</b> ${escapeHtml(unit.label)}`).join('<span class="dot" aria-hidden="true">·</span>')}`;
    const auto = this.query('.auto');
    auto.checked = this.auto;
    auto.textContent = `Top up ${whole.format(pack.credits)} when below ${whole.format(this.low)}`;
    this.query('.buy').textContent = `Buy ${whole.format(pack.credits)} credits`;
  }

  #select(credits) {
    if (credits === this.value) return;
    this.value = credits;
    this.emit('select', { credits, price: this.#pack.price });
  }
}
