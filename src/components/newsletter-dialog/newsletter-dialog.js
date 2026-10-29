import { escapeHtml } from '../../core/dom.js';
import { CHECK_ICON, iconStyles } from '../../core/icons.js';
import { LwModal, modalStyles } from '../../core/modal.js';
import '../button/index.js';
import '../text-input/index.js';
import styles from './newsletter-dialog.scss?inline';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEMO_LATEST = {
  number: 42,
  date: 'Oct 9',
  title: 'Designing for the second run',
  excerpt: 'Most tools are tuned for the first launch. This week: caches that survive restarts, builds that pick up where they stopped, and why incremental beats fast.',
  minutes: 6,
};

const DEMO_FREQUENCIES = [
  { id: 'every', label: 'Every issue', detail: '2 emails a month' },
  { id: 'monthly', label: 'Monthly digest', detail: '1 email a month' },
];

/**
 * A newsletter sign-up that shows what you would get: the latest issue,
 * then how often, then your address. Subscribing checks the address,
 * waits on `subscribe` if set, and confirms in place.
 *
 * Set the `subscribe` property to an async function taking `{ email,
 * frequency }`; a rejection shows its message on the field.
 *
 * @attr {string} name
 * @attr {string} description
 * @attr {object} latest - `{ number, date, title, excerpt, minutes }` (JSON)
 * @attr {Array<object>} frequencies - `{ id, label, detail }` (JSON)
 * @attr {string} frequency
 * @fires lw-subscribe - Subscribed; `detail: { email, frequency }`
 */
export class LwNewsletterDialog extends LwModal {
  static styles = [modalStyles, iconStyles, styles];
  static props = {
    ...LwModal.props,
    name: { default: 'The Lower Dispatch' },
    description: { default: 'One short read on building software that starts fast and stays fast. Every other Thursday.' },
    latest: { type: Object, default: DEMO_LATEST },
    frequencies: { type: Object, default: DEMO_FREQUENCIES },
    frequency: { default: 'every', reflect: true },
  };

  renderBody() {
    return `<div class="body"><h2 class="title" id="modal-title"></h2><p class="lead description"></p>
<article class="latest"><p class="latest-meta"></p><h3 class="latest-title"></h3><p class="latest-excerpt"></p><p class="latest-time"></p></article>
<form class="form" novalidate><p class="label" id="often-label">How often</p><div class="often" role="radiogroup" aria-labelledby="often-label"></div>
<div class="row"><lw-text-input class="email" type="email" label="Email" placeholder="you@company.com" autocomplete="email"></lw-text-input><lw-button class="subscribe" type="submit">Subscribe</lw-button></div></form>
<div class="done" role="status" hidden><span class="done-mark">${CHECK_ICON}</span><p class="done-text"></p></div></div>`;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    const often = this.query('.often');
    often.addEventListener('click', (event) => {
      const option = event.target.closest('.option');
      if (option) this.frequency = option.dataset.id;
    }, options);
    often.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const index = this.frequencies.findIndex((each) => each.id === this.frequency);
      this.frequency = this.frequencies[(index + step + this.frequencies.length) % this.frequencies.length].id;
      often.querySelector(`[data-id="${CSS.escape(this.frequency)}"]`).focus();
    }, options);
    this.query('.form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#subscribe();
    }, options);
    this.query('.email').addEventListener('keydown', (event) => event.key === 'Enter' && (event.preventDefault(), this.#subscribe()), options);
  }

  updated(changed) {
    super.updated(changed);
    this.query('#modal-title').textContent = this.name ?? '';
    this.query('.description').textContent = this.description ?? '';
    const latest = this.latest ?? {};
    this.query('.latest-meta').textContent = `Latest · No. ${latest.number} · ${latest.date}`;
    this.query('.latest-title').textContent = latest.title ?? '';
    this.query('.latest-excerpt').textContent = latest.excerpt ?? '';
    this.query('.latest-time').textContent = `${latest.minutes} min read`;
    if (changed.has('frequencies')) {
      this.query('.often').innerHTML = this.frequencies.map((each) => `<button class="option" type="button" role="radio" data-id="${escapeHtml(each.id)}"><span class="option-label">${escapeHtml(each.label)}</span><span class="option-detail">${escapeHtml(each.detail)}</span></button>`).join('');
    }
    for (const option of this.shadowRoot.querySelectorAll('.option')) {
      const checked = option.dataset.id === this.frequency;
      option.ariaChecked = String(checked);
      option.tabIndex = checked ? 0 : -1;
    }
  }

  async #subscribe() {
    const input = this.query('.email');
    const email = (input.value ?? '').trim();
    if (!EMAIL.test(email)) {
      input.error = email ? 'That address looks incomplete.' : 'Enter your email to subscribe.';
      input.focus();
      return;
    }
    input.error = '';
    const button = this.query('.subscribe');
    button.loading = true;
    try {
      await this.subscribe?.({ email, frequency: this.frequency });
    } catch (error) {
      input.error = error?.message || 'That did not go through. Try again.';
      return;
    } finally {
      button.loading = false;
    }
    const frequency = this.frequencies.find((each) => each.id === this.frequency);
    this.query('.form').hidden = true;
    this.query('.done').hidden = false;
    this.query('.done-text').textContent = `You're in. ${frequency?.label ?? 'The next issue'} goes to ${email}.`;
    this.emit('subscribe', { email, frequency: this.frequency });
  }
}
