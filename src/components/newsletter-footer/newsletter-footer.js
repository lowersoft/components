import { escapeHtml } from '../../core/dom.js';
import { footerLink } from '../../core/footer.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowUpRight, check } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import '../text-input/index.js';
import styles from './newsletter-footer.scss?inline';

const DAY_MS = 86_400_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEMO_ISSUES = [
  { number: 48, title: 'Shaving 40 ms off a cold start', date: '2026-10-09', minutes: 7 },
  { number: 47, title: 'What we learned writing our own allocator', date: '2026-09-25', minutes: 5 },
  { number: 46, title: 'A quieter build: three flags we deleted', date: '2026-09-11', minutes: 6 },
  { number: 45, title: 'Shipping on Fridays, safely', date: '2026-08-28', minutes: 4 },
];

const DEMO_LINKS = ['Product', 'Pricing', 'Changelog', 'Docs', 'About', 'Careers'].map((label) => ({ label }));
const DEMO_LEGAL = ['Privacy', 'Terms'].map((label) => ({ label }));

const whole = new Intl.NumberFormat('en-US');
const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const dateOf = (iso) => new Date(`${iso}T00:00:00Z`);

/**
 * A footer that is mostly a newsletter: the pitch and a sign-up on one side,
 * the latest issues on the other, and the site's links below. When the next
 * issue lands follows from the latest one and the cadence. Subscribing
 * checks the address, waits on `subscribe` if set, then thanks the reader
 * and counts them in.
 *
 * Issues are `{ number, title, date, minutes, href? }`, newest first, with
 * `date` as `YYYY-MM-DD`; links are `{ label, href? }`.
 *
 * Set the `subscribe` property to an async function taking the address to
 * send it somewhere; a rejection shows its message on the field.
 *
 * @attr {string} brand
 * @attr {string} name - The newsletter's name
 * @attr {string} heading
 * @attr {number} readers
 * @attr {number} cadence - Days between issues
 * @attr {number} total - Issues so far; by default the latest number
 * @attr {Array<object>} issues (JSON)
 * @attr {Array<object>} links (JSON)
 * @attr {Array<object>} legal - Small links by the copyright (JSON)
 * @fires lw-subscribe - Someone subscribed; `detail: { email }`
 */
export class LwNewsletterFooter extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    brand: { default: 'Lower' },
    name: { default: 'The Lower Dispatch' },
    heading: { default: 'Notes on building faster software, every other Thursday.' },
    readers: { type: Number, default: 4182 },
    cadence: { type: Number, default: 14 },
    total: { type: Number },
    issues: { type: Object, default: DEMO_ISSUES },
    links: { type: Object, default: DEMO_LINKS },
    legal: { type: Object, default: DEMO_LEGAL },
  };

  #subscribed = false;

  render() {
    return `<footer class="container"><div class="top">
<section class="signup"><p class="eyebrow"></p><h2 class="title"></h2><p class="lead">Read by <span class="readers"><span class="visually-hidden"></span><span class="rolling" aria-hidden="true"></span></span> people who make things. No tracking pixels, one click to leave.</p>
<form class="form" novalidate><lw-text-input class="email" type="email" name="email" autocomplete="email" placeholder="you@company.com" label="Email" required></lw-text-input><lw-button class="subscribe" type="submit">Subscribe</lw-button></form>
<p class="next" aria-live="polite"></p></section>
<section class="issues" aria-labelledby="issues-title"><header class="issues-head"><h2 class="issues-title" id="issues-title">Recent issues</h2><a class="all" href="#"></a></header><ol class="list"></ol></section></div>
<div class="bottom"><nav class="nav" aria-label="Site"></nav><div class="legal"><span class="legal-links"></span><span class="copyright"></span></div></div></footer>`;
  }

  connected() {
    this.query('.form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#submit();
    }, { signal: this.signal });
    // The field's input lives in its own shadow root, out of the form's reach for Enter.
    this.query('.email').addEventListener('keydown', (event) => event.key === 'Enter' && (event.preventDefault(), this.#submit()), { signal: this.signal });
  }

  updated(changed) {
    this.query('.eyebrow').textContent = this.name ?? '';
    this.query('.title').textContent = this.heading ?? '';
    this.#paintReaders();
    const issues = this.issues ?? [];
    const total = this.total ?? issues[0]?.number ?? 0;
    this.query('.all').textContent = `All ${whole.format(total)} issues`;
    if (changed.has('issues')) {
      this.query('.list').innerHTML = issues
        .map((issue, i) => `<li><a class="issue" href="${escapeHtml(issue.href ?? '#')}"><span class="number">No. ${escapeHtml(issue.number)}</span><span class="issue-title"><span>${escapeHtml(issue.title)}</span>${i === 0 ? '<span class="latest">Latest</span>' : ''}</span><span class="meta">${shortDate.format(dateOf(issue.date))} · ${escapeHtml(issue.minutes)} min</span>${strokeIcon(arrowUpRight, 14)}</a></li>`)
        .join('');
    }
    if (changed.has('links')) this.query('.nav').innerHTML = (this.links ?? []).map(footerLink).join('');
    if (changed.has('legal')) this.query('.legal-links').innerHTML = (this.legal ?? []).map(footerLink).join('');
    this.query('.copyright').textContent = `© ${new Date().getFullYear()} ${this.brand ?? ''}`;
    if (!this.#subscribed) this.query('.next').textContent = this.#nextIssue;
  }

  // "Issue 49 lands Oct 23.", from the latest issue and the cadence.
  get #nextIssue() {
    const latest = this.issues?.[0];
    if (!latest) return '';
    return `Issue ${latest.number + 1} lands ${shortDate.format(new Date(dateOf(latest.date).getTime() + this.cadence * DAY_MS))}.`;
  }

  #paintReaders() {
    const text = whole.format(this.readers + (this.#subscribed ? 1 : 0));
    this.query('.readers .visually-hidden').textContent = text;
    roll(this.query('.readers .rolling'), text);
  }

  async #submit() {
    if (this.#subscribed) return;
    const input = this.query('.email');
    const button = this.query('.subscribe');
    const email = (input.value ?? '').trim();
    if (!EMAIL.test(email)) {
      input.error = email ? 'That address looks incomplete.' : 'Enter your email to subscribe.';
      input.focus();
      return;
    }
    input.error = '';
    button.loading = true;
    try {
      await this.subscribe?.(email);
    } catch (error) {
      input.error = error?.message || 'That did not go through. Try again.';
      return;
    } finally {
      button.loading = false;
    }
    this.#subscribed = true;
    this.query('.form').replaceWith(Object.assign(document.createElement('p'), {
      className: 'done',
      innerHTML: `${strokeIcon(check, 16)}<span>You're in. Watch <b></b> for the next one.</span>`,
    }));
    this.query('.done b').textContent = email;
    this.query('.next').textContent = this.#nextIssue;
    this.#paintReaders();
    this.emit('subscribe', { email });
  }
}
