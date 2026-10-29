import { reducedMotion } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import { LwActionButton } from '../button/action-button.js';
import styles from './pay-button.scss?inline';

const RESIZE_DURATION = 300;

const CARD_ICON =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>';

/**
 * The last button of a checkout, carrying the amount and the card it charges.
 * The digits roll when the total changes; pressing shows Processing, then
 * Paid, or says the card was declined.
 *
 * @attr {number} amount - Total to charge, in major units (e.g. 49.99)
 * @attr {string} currency - ISO 4217 code, e.g. `USD`
 * @attr {string} locale - BCP 47 locale for formatting; the page's by default
 * @attr {string} label - Text before the amount
 * @attr {string} card - Last four digits of the card charged
 * @see LwActionButton for the action flow, status labels and events
 */
export class LwPayButton extends LwActionButton {
  static styles = [...LwActionButton.styles, rollingStyles, styles];
  static props = {
    ...LwActionButton.props,
    amount: { type: Number, default: 0 },
    currency: { default: 'USD' },
    locale: {},
    label: { default: 'Pay' },
    card: {},
    pendingLabel: { default: 'Processing' },
    successLabel: { default: 'Paid' },
    errorLabel: { default: 'Card declined' },
  };

  #format = null;
  #shownAmount = false;

  renderIdle() {
    return `<span class="pay-label"></span><span class="amount rolling" aria-hidden="true"></span><span class="amount-text visually-hidden"></span><span class="card" hidden>${CARD_ICON}<span aria-hidden="true">••••</span><span class="last4"></span></span>`;
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('label')) this.query('.pay-label').textContent = this.label;
    if (changed.has('card')) {
      this.query('.card').hidden = !this.card;
      this.query('.last4').textContent = this.card ?? '';
    }
    if (changed.has('locale') || changed.has('currency')) {
      this.#format = new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.currency, numberingSystem: 'latn' });
    }
    if (['amount', 'locale', 'currency'].some((prop) => changed.has(prop))) this.#showAmount();
  }

  // Rolls the digits; when the number gets longer or shorter, the width follows.
  #showAmount() {
    const text = this.#format.format(this.amount);
    const button = this.query('.button');
    const from = button.offsetWidth;
    roll(this.query('.amount'), text);
    this.query('.amount-text').textContent = text;

    const to = button.offsetWidth;
    const animate = this.#shownAmount && to !== from && !reducedMotion.matches;
    this.#shownAmount = true;
    if (animate) {
      const easing = getComputedStyle(this).getPropertyValue('--lw-ease-out').trim() || 'ease-out';
      button.animate({ width: [`${from}px`, `${to}px`] }, { duration: RESIZE_DURATION, easing });
    }
  }
}
