import pricingStyles from '../styles/pricing.scss?inline';
import { moveHighlight } from './highlight.js';
import { roll } from './rolling.js';

// Shared pieces of the pricing components: the Monthly / Yearly switch, the
// yearly price, and prices that roll to their new value. Add
// `rollingStyles` and `pricingStyles` to the component's `static styles`.
export { pricingStyles };

/** A yearly plan is ten months for twelve. */
export const YEARLY_MONTHS = 10;

/** The demo plans, cheapest first. */
export const DEMO_PLANS = [
  { id: 'hobby', name: 'Hobby', blurb: 'For side projects and trying things out.', monthly: 0 },
  { id: 'pro', name: 'Pro', blurb: 'For makers shipping something every week.', monthly: 36 },
  { id: 'team', name: 'Team', blurb: 'For teams that need roles, audit and scale.', monthly: 96 },
];

const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** `$1,234`, or `$12.50` with cents when asked or when there are any. */
export const formatMoney = (value, withCents = !Number.isInteger(value)) => `${value < 0 ? '−' : ''}$${(withCents ? cents : whole).format(Math.abs(value))}`;

/** The price per month on `billing`: yearly is the year's price over twelve. */
export const monthlyPrice = (monthly, billing) => (billing === 'yearly' ? Math.round((monthly * YEARLY_MONTHS) / 12) : monthly);

/**
 * The billing switch: one option per entry of `labels`, by billing id, in
 * order. Monthly and yearly by default.
 */
export const billingToggle = (labels = { monthly: 'Monthly', yearly: 'Yearly' }) =>
  `<div class="billing" role="radiogroup" aria-label="Billing"><span class="billing-pill"></span>${Object.entries(labels)
    .map(([id, label]) => `<button class="billing-option" type="button" role="radio" data-billing="${id}">${label}</button>`)
    .join('')}</div>`;

/**
 * Wires the switch in `host` to its `billing` property: a click or the arrow
 * keys choose, and `lw-change` reports it.
 */
export const wireBilling = (host) => {
  const group = host.query('.billing');
  const choose = (billing) => {
    if (billing === host.billing) return;
    host.billing = billing;
    host.emit('change', { billing });
  };
  group.addEventListener('click', (event) => {
    const option = event.target.closest('.billing-option');
    if (option) choose(option.dataset.billing);
  }, { signal: host.signal });
  group.addEventListener('keydown', (event) => {
    const step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const ids = [...group.querySelectorAll('.billing-option')].map((option) => option.dataset.billing);
    choose(ids[(ids.indexOf(host.billing) + step + ids.length) % ids.length]);
    group.querySelector('[aria-checked="true"]').focus();
  }, { signal: host.signal });
  // The pill follows its option when the text first lays out or reflows.
  const observer = new ResizeObserver(() => paintBilling(host));
  observer.observe(group);
  host.signal.addEventListener('abort', () => observer.disconnect());
};

/** Marks the chosen option and slides the pill under it. */
export const paintBilling = (host) => {
  const options = [...host.shadowRoot.querySelectorAll('.billing-option')];
  for (const option of options) {
    const checked = option.dataset.billing === host.billing;
    option.ariaChecked = String(checked);
    option.tabIndex = checked ? 0 : -1;
  }
  // Laid out only once rendered; until then the pill waits.
  const chosen = options.find((option) => option.ariaChecked === 'true');
  if (chosen?.offsetWidth) moveHighlight(host.query('.billing-pill'), chosen);
};

/** A price that rolls to its new value; screen readers hear it whole. */
export const priceMarkup = (className = 'amount') =>
  `<span class="${className}"><span class="visually-hidden"></span><span class="rolling" aria-hidden="true"></span></span>`;

/** Shows `value` in markup from `priceMarkup()`. */
export const paintPrice = (element, value, withCents) => {
  const text = typeof value === 'number' ? formatMoney(value, withCents) : value;
  element.querySelector('.visually-hidden').textContent = text;
  roll(element.querySelector('.rolling'), text);
};
