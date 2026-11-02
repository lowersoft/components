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
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const rate = (pack) => pack.price / pack.credits;
const perCredit = (pack) => `$${rate(pack).toFixed(4)}`;

/**
 * Prepaid credits in packs. The head shows the balance and whether it is
 * running low; a meter beneath shows what is left, what the chosen pack
 * adds, and where the low mark sits. Each pack gives its price, its rate
 * per credit and what it saves on the smallest, and the best rate is
 * marked. The order beside what the credits buy gives the total, the
 * saving, the balance after and auto top-up, which refills the chosen pack
 * when the balance drops below the low mark.
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
    return `<header class="head"><div class="intro"><h2 class="title"></h2><p class="description"></p></div>
<div class="balance"><p class="balance-label">Balance <span class="status"></span></p><p class="balance-value">${priceMarkup('now')}<span class="unit">credits</span></p></div></header>
<div class="meter-block"><div class="meter" aria-hidden="true"><span class="added"></span><span class="left"></span><span class="low-mark"><span class="low-label"></span></span></div><p class="scale"><span>0</span><span class="scale-after"></span></p></div>
<div class="packs" role="radiogroup" aria-label="Credit pack"><span class="pack-ring" aria-hidden="true"></span></div>
<section class="order" aria-label="Order summary"><div class="covers"><h3 class="section-title">What it covers</h3><ul class="units"></ul></div>
<div class="checkout"><dl class="lines"><div class="line"><dt>Pack</dt><dd class="pack-line"></dd></div><div class="line"><dt>Per credit</dt><dd class="per-credit"></dd></div><div class="line saving"><dt>You save</dt><dd class="saved"></dd></div><div class="line total"><dt>Total</dt><dd>${priceMarkup()}</dd></div><div class="line after-line"><dt>Balance after</dt><dd>${priceMarkup('after')} credits</dd></div></dl>
<div class="auto-row"><lw-switch class="auto" size="sm"></lw-switch></div><lw-button class="buy" size="lg"></lw-button><p class="fine">One payment, no subscription.</p></div></section>`;
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
    // The ring follows its pack when the grid reflows.
    const observer = new ResizeObserver(() => this.#paintPacks());
    observer.observe(packs);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.description').hidden = !this.description;
    if (changed.has('packs')) this.#build();
    this.#paint();
  }

  get #pack() {
    return this.packs.find((pack) => pack.credits === this.value) ?? this.packs[0];
  }

  // Share saved on the smallest pack's rate.
  #saves(pack) {
    return Math.max(0, Math.round((1 - rate(pack) / rate(this.packs[0])) * 100));
  }

  #build() {
    const best = this.packs.reduce((top, pack) => (rate(pack) < rate(top) ? pack : top), this.packs[0]);
    this.query('.packs').querySelectorAll('.pack').forEach((each) => each.remove());
    this.query('.packs').insertAdjacentHTML(
      'beforeend',
      this.packs
        .map((pack) => {
          const saves = this.#saves(pack);
          const flag = pack === best && this.packs.length > 1 ? '<span class="flag">Best rate</span>' : '';
          return `<button class="pack" type="button" role="radio" data-credits="${pack.credits}" aria-label="${whole.format(pack.credits)} credits, ${formatMoney(pack.price)}${saves ? `, save ${saves}%` : ''}">${flag}<span class="pack-top"><span class="credits">${compact.format(pack.credits)}</span><span class="radio" aria-hidden="true"></span></span><span class="credits-label">credits</span><span class="price">${formatMoney(pack.price)}</span><span class="rate">${perCredit(pack)} each</span><span class="saves"${saves ? '' : ' data-base'}>${saves ? `Save ${saves}%` : 'Base rate'}</span></button>`;
        })
        .join(''),
    );
  }

  #paintPacks() {
    let chosen = null;
    for (const element of this.shadowRoot.querySelectorAll('.pack')) {
      const checked = Number(element.dataset.credits) === this.#pack.credits;
      element.ariaChecked = String(checked);
      element.tabIndex = checked ? 0 : -1;
      if (checked) chosen = element;
    }
    if (chosen?.offsetWidth) moveHighlight(this.query('.pack-ring'), chosen);
  }

  #paint() {
    const pack = this.#pack;
    const after = this.balance + pack.credits;
    const low = this.balance < this.low;
    this.#paintPacks();
    this.toggleAttribute('data-low', low);

    paintPrice(this.query('.now'), whole.format(this.balance));
    this.query('.status').textContent = low ? 'Running low' : 'Healthy';

    // The meter runs to the balance after buying: what is left, what the
    // pack adds on top, and the low mark.
    this.query('.left').style.width = `${(this.balance / after) * 100}%`;
    this.query('.added').style.width = '100%';
    const mark = this.query('.low-mark');
    mark.hidden = this.low <= 0 || this.low >= after;
    const at = (this.low / after) * 100;
    mark.style.left = `${at}%`;
    // Near an end, the label leans inwards instead of hanging off the card.
    mark.dataset.side = at < 12 ? 'start' : at > 88 ? 'end' : '';
    this.query('.low-label').textContent = `Low · ${whole.format(this.low)}`;
    this.query('.scale-after').textContent = `${whole.format(after)} after this pack`;

    this.query('.units').innerHTML = (this.units ?? [])
      .map((unit) => `<li class="unit-row"><span class="unit-count">${whole.format(Math.floor(pack.credits / unit.credits))}</span><span class="unit-label">${escapeHtml(unit.label)}</span><span class="unit-cost">${unit.credits === 1 ? '1 credit' : `${whole.format(unit.credits)} credits`} each</span></li>`)
      .join('');

    const saved = rate(this.packs[0]) * pack.credits - pack.price;
    this.query('.pack-line').textContent = `${whole.format(pack.credits)} credits`;
    this.query('.per-credit').textContent = perCredit(pack);
    this.query('.saving').hidden = saved < 0.005;
    this.query('.saved').textContent = `${formatMoney(saved, true)} (${this.#saves(pack)}%)`;
    paintPrice(this.query('.amount'), pack.price, true);
    paintPrice(this.query('.after'), whole.format(after));

    const auto = this.query('.auto');
    auto.checked = this.auto;
    auto.textContent = `Auto top-up ${whole.format(pack.credits)} below ${whole.format(this.low)}`;
    this.query('.buy').textContent = `Buy ${whole.format(pack.credits)} credits · ${formatMoney(pack.price, true)}`;
  }

  #select(credits) {
    if (credits === this.value) return;
    this.value = credits;
    this.emit('select', { credits, price: this.#pack.price });
  }
}
