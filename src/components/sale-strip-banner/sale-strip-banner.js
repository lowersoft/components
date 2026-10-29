import { closeButton, dismissBanner } from '../../core/banner.js';
import { writeClipboard } from '../../core/clipboard.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight, check, copy } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import styles from './sale-strip-banner.scss?inline';

const COPIED_MS = 1600;
// The default sale ends this long from when the banner first shows.
const DEMO_LENGTH_MS = (2 * 24 + 14) * 3_600_000 + 9 * 60_000 + 29_000;

const pad = (n) => String(n).padStart(2, '0');

// "2d 14:09:29", or the clock alone on the last day.
const remaining = (ms) => {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(seconds / 86_400);
  const clock = `${pad(Math.floor((seconds % 86_400) / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
  return days ? `${days}d ${clock}` : clock;
};

/**
 * A sale across the top of the page: the offer, a coupon cut like a ticket
 * that copies itself when pressed, a countdown whose digits roll, the way
 * to the plans, and dismiss. It follows the light or dark scheme; when the
 * countdown ends, the strip folds away.
 *
 * @attr {string} offer - Bold, before the rest of the line
 * @attr {string} text
 * @attr {string} code
 * @attr {string} ends - When the sale ends, as a date and time
 * @attr {string} action
 * @attr {string} href
 * @fires lw-copy - The code was copied; `detail: { code }`
 * @fires lw-dismiss - The banner was dismissed, or the sale ended
 */
export class LwSaleStripBanner extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    offer: { default: '30% off' },
    text: { default: 'annual plans this week' },
    code: { default: 'LOWER30' },
    ends: {},
    action: { default: 'See plans' },
    href: { default: '#' },
  };

  #end = 0;
  #timer = 0;
  #copiedTimer = 0;

  render() {
    return `<div class="bar"><p class="offer"><b class="offer-bold"></b> <span class="offer-text"></span></p>
<button class="coupon" type="button"><span class="code"></span><span class="coupon-icon">${strokeIcon(copy, 15)}</span></button><span class="visually-hidden copied" aria-live="polite"></span>
<p class="countdown"><span class="countdown-label">Ends in</span> <span class="visually-hidden time-text"></span><span class="rolling time" aria-hidden="true"></span></p>
<a class="action"><span class="action-text"></span>${strokeIcon(arrowRight, 16)}</a>${closeButton()}</div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.coupon').addEventListener('click', () => this.#copy(), options);
    this.query('.close').addEventListener('click', () => dismissBanner(this), options);
    this.#timer = setInterval(() => this.#tick(), 1000);
    this.signal.addEventListener('abort', () => {
      clearInterval(this.#timer);
      clearTimeout(this.#copiedTimer);
    });
  }

  updated(changed) {
    if (changed.has('ends')) this.#end = this.ends ? new Date(this.ends).getTime() : Date.now() + DEMO_LENGTH_MS;
    this.query('.offer-bold').textContent = this.offer ?? '';
    this.query('.offer-text').textContent = this.text ?? '';
    this.query('.code').textContent = this.code ?? '';
    this.query('.coupon').ariaLabel = `Copy the code ${this.code}`;
    const action = this.query('.action');
    action.href = this.href ?? '#';
    this.query('.action-text').textContent = this.action ?? '';
    this.#tick();
  }

  #tick() {
    const left = this.#end - Date.now();
    const text = remaining(left);
    roll(this.query('.time'), text);
    // Read out by the minute, not every second.
    const spoken = text.replace(/:\d\d$/, '');
    if (this.query('.time-text').textContent !== spoken) this.query('.time-text').textContent = spoken;
    if (left <= 0 && this.isConnected && !this.hidden) {
      clearInterval(this.#timer);
      dismissBanner(this);
    }
  }

  async #copy() {
    try {
      await writeClipboard(this.code ?? '');
    } catch {
      return;
    }
    const icon = this.query('.coupon-icon');
    icon.innerHTML = strokeIcon(check, 15);
    this.query('.coupon').toggleAttribute('data-copied', true);
    this.query('.copied').textContent = 'Code copied';
    clearTimeout(this.#copiedTimer);
    this.#copiedTimer = setTimeout(() => {
      icon.innerHTML = strokeIcon(copy, 15);
      this.query('.coupon').removeAttribute('data-copied');
      this.query('.copied').textContent = '';
    }, COPIED_MS);
    this.emit('copy', { code: this.code });
  }
}
