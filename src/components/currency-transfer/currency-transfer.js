import { writeClipboard } from '../../core/clipboard.js';
import { strokeIcon } from '../../core/icons.js';
import { check, copy, rotateCcw, x } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import styles from './currency-transfer.scss?inline';

const DEMO_FROM = { amount: 500, currency: 'USD', symbol: '$', bank: 'Chase', last4: '4589' };
const DEMO_TO = { amount: 460, currency: 'EUR', symbol: '€', bank: 'Deutsche Bank', last4: '7823', name: 'Lena Fischer' };

// Each step takes this long, in the demo and while processing.
const STEP_MS = 1100;
// Steps done at first: the payment has already been taken.
const FIRST_DONE = 1;
// While processing, the run waits on the last step (arrival).
const WAIT_AT = 3;
const COPIED_MS = 1500;
const NOT_LETTER = /[^\p{L}]+/u;
const PILL = { processing: 'In progress', completed: 'Arrived', failed: 'Failed' };

const formatNumber = (value, locale, digits) => new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

const symbolOf = (account, locale) => {
  if (account.symbol) return account.symbol;
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: account.currency, currencyDisplay: 'narrowSymbol' }).formatToParts(0).find(({ type }) => type === 'currency')?.value ?? account.currency.charAt(0);
  } catch {
    // Not an ISO 4217 code.
    return account.currency.charAt(0);
  }
};

const initialsOf = (name) =>
  name
    .split(NOT_LETTER)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

const masked = (account) => `${account.bank}${account.last4 ? ` ••${account.last4}` : ''}`;

/**
 * A money transfer between currencies as it happens: the steps tick off one
 * by one down a rail, and the amount converts in place, its digits rolling
 * to the new currency, once the conversion step is done.
 *
 * Accounts are `{ amount, currency, symbol?, bank, last4?, name? }`. Leave
 * `status` unset for a demo that completes on its own; set it to
 * `processing` to run the steps up to the last one and wait there, then to
 * `completed` or `failed`.
 *
 * @attr {object} from - The sending account (JSON)
 * @attr {object} to - The receiving account (JSON)
 * @attr {number} rate - Units of `to.currency` per one of `from.currency`
 * @attr {string} txn - The transaction reference, copyable
 * @attr {string} timestamp - When the rate was locked
 * @attr {'processing'|'completed'|'failed'} status
 * @attr {string} locale - BCP 47 locale for amounts and the rate
 * @attr {boolean} retry - Show Retry when the transfer has failed
 * @fires lw-retry - Retry was pressed
 */
export class LwCurrencyTransfer extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    from: { type: Object, default: DEMO_FROM },
    to: { type: Object, default: DEMO_TO },
    rate: { type: Number, default: 0.92 },
    txn: { default: 'TXN-DAB3UL494' },
    timestamp: { default: '10:45 AM' },
    status: { default: null },
    locale: { default: 'en-US' },
    retry: { type: Boolean },
  };

  #done = FIRST_DONE;
  #demo = 'processing';
  #runFor = null;
  #timer = 0;
  #copiedTimer = 0;

  render() {
    const steps = Array.from({ length: 4 }, (_, i) => `<li data-state="pending"><div class="track"><span class="node"></span>${i < 3 ? '<span class="rail"><span></span></span>' : ''}</div><div class="step"><p class="title"></p><p class="detail"></p></div></li>`).join('');
    return `<output class="announce" aria-live="polite"></output>
<div class="who"><span class="initials" aria-hidden="true"></span><div class="names"><p class="recipient"></p><p class="account"></p></div><span class="pill">${Object.entries(PILL).map(([key, label]) => `<span data-key="${key}">${label}</span>`).join('')}</span></div>
<div class="amount"><p class="big"><span class="visually-hidden spoken"></span><span class="symbol" aria-hidden="true"><span class="from"></span><span class="to"></span></span><span class="rolling" aria-hidden="true"></span></p><p class="sums"></p></div>
<ol class="steps">${steps}</ol>
<div class="footer"><button class="copy" type="button"><span class="ref"></span><span class="icons" aria-hidden="true">${strokeIcon(copy, 12)}${strokeIcon(check, 12, 3)}</span></button><span class="locked"></span></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.copy').addEventListener('click', () => this.#copy(), options);
    this.query('.steps').addEventListener('click', (event) => event.target.closest('.retry') && this.emit('retry'), options);
    this.signal.addEventListener('abort', () => {
      clearTimeout(this.#timer);
      clearTimeout(this.#copiedTimer);
    });
  }

  updated() {
    this.#paint();
  }

  get #status() {
    return this.status ?? this.#demo;
  }

  // Steps done so far: a step at a time while processing, waiting on the
  // last one; a fresh "processing" (a retry) starts over.
  #schedule() {
    clearTimeout(this.#timer);
    const status = this.#status;
    if (this.#runFor !== status) {
      this.#runFor = status;
      if (status === 'processing') this.#done = FIRST_DONE;
    }
    if (status !== 'processing') return;
    if (this.#done < WAIT_AT) {
      this.#timer = setTimeout(() => {
        this.#done += 1;
        this.#paint();
      }, STEP_MS);
    } else if (this.status === null) {
      // Demo only: once the run reaches the last step, the money arrives.
      this.#timer = setTimeout(() => {
        this.#demo = 'completed';
        this.#paint();
      }, STEP_MS);
    }
  }

  #paint() {
    this.#schedule();
    const { from, to, locale } = this;
    const status = this.#status;
    const done = status === 'completed' ? 4 : this.#done;
    const arrived = status === 'completed';
    const recipient = to.name ?? to.bank;
    const rateText = `1 ${from.currency} = ${formatNumber(this.rate, locale, 4)} ${to.currency}`;
    const steps = [
      [`Payment received`, `From ${masked(from)}`],
      [`Converted to ${to.currency}`, rateText],
      [`Sent to ${to.bank}`, masked(to)],
      arrived ? ['Arrived', `${recipient} can use it now`] : ['Arriving', 'Usually within a minute'],
    ];

    this.query('.initials').textContent = initialsOf(recipient);
    this.query('.recipient').textContent = recipient;
    this.query('.account').textContent = masked(to);
    // Every label sits in one cell, so the pill keeps its width and the words
    // crossfade instead of snapping.
    const pill = this.query('.pill');
    pill.dataset.status = status;
    for (const label of pill.children) label.ariaHidden = String(label.dataset.key !== status);

    // The amount converts in place once the conversion step is done.
    const converted = done >= 2;
    const shown = converted ? to : from;
    const symbol = this.query('.symbol');
    symbol.querySelector('.from').textContent = symbolOf(from, locale);
    symbol.querySelector('.to').textContent = symbolOf(to, locale);
    symbol.toggleAttribute('data-to', converted);
    this.query('.spoken').textContent = `${formatNumber(shown.amount, locale, 2)} ${shown.currency}`;
    const digits = this.query('.amount .rolling');
    roll(digits, formatNumber(shown.amount, locale, 2));
    // The right-most digit moves first.
    [...digits.children].reverse().forEach((digit, i) => digit.style.setProperty('--_order', i));
    this.query('.sums').textContent = `${formatNumber(from.amount, locale, 2)} ${from.currency} sent · ${formatNumber(to.amount, locale, 2)} ${to.currency} received`;

    this.shadowRoot.querySelectorAll('.steps li').forEach((li, i) => {
      const state = i < done ? 'done' : i === done ? (status === 'failed' ? 'failed' : 'active') : 'pending';
      const failed = state === 'failed';
      this.#paintStep(li, state, failed ? "Couldn't complete" : steps[i][0], failed ? `Refunded to ${masked(from)}` : steps[i][1], failed && this.retry);
    });

    let announcement = steps[Math.min(done, 3)][0];
    if (arrived) announcement = `Transfer arrived. ${formatNumber(to.amount, locale, 2)} ${to.currency} to ${recipient}.`;
    if (status === 'failed') announcement = `Transfer failed. Refunded to ${masked(from)}.`;
    this.query('.announce').textContent = announcement;
    this.query('.ref').textContent = this.txn;
    if (!this.query('.copy').hasAttribute('data-copied')) this.query('.copy').ariaLabel = `Copy reference ${this.txn}`;
    this.query('.locked').textContent = `Rate locked ${this.timestamp}`;
  }

  // One step: its node, and words that blur in when they change.
  #paintStep(li, state, title, detail, retry) {
    if (li.dataset.state !== state) {
      li.dataset.state = state;
      const node = li.querySelector('.node');
      if (state === 'done') node.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.25 5 8.5l4.5-5" pathLength="1"/></svg>';
      else if (state === 'failed') node.innerHTML = strokeIcon(x, 12, 3);
      else if (state === 'active') node.innerHTML = '<span class="spinner"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.25A8.75 8.75 0 0 1 18.75 10"/></svg></span>';
      else node.innerHTML = '';
    }
    for (const [el, text] of [
      [li.querySelector('.title'), title],
      [li.querySelector('.detail'), detail],
    ]) {
      if (el.textContent === text) continue;
      el.textContent = text;
      if (!reducedMotion.matches && li.parentElement.dataset.painted) el.animate([{ opacity: 0, filter: 'blur(2px)' }, { opacity: 1, filter: 'blur(0px)' }], { duration: 200, easing: 'ease-out' });
    }
    li.parentElement.dataset.painted = '';
    const button = li.querySelector('.retry');
    if (retry && !button) li.querySelector('.step').insertAdjacentHTML('beforeend', `<button class="retry" type="button">${strokeIcon(rotateCcw, 12)}Retry</button>`);
    if (!retry) button?.remove();
  }

  // The reference copies with a tick that confirms in place.
  async #copy() {
    const button = this.query('.copy');
    try {
      await writeClipboard(this.txn);
    } catch {
      // Clipboard blocked (permissions, insecure origin): no tick.
      return;
    }
    button.toggleAttribute('data-copied', true);
    button.ariaLabel = 'Reference copied';
    clearTimeout(this.#copiedTimer);
    this.#copiedTimer = setTimeout(() => {
      button.removeAttribute('data-copied');
      button.ariaLabel = `Copy reference ${this.txn}`;
    }, COPIED_MS);
  }
}
