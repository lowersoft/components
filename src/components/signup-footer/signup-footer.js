import { brandMarkup, footerLink, linkColumns } from '../../core/footer.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import * as lucide from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './signup-footer.scss?inline';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS = {
  normal: 'All systems normal',
  degraded: 'Some systems degraded',
  outage: 'Major outage',
};

const DEMO_COLUMNS = [
  { title: 'Product', links: [{ label: 'Features' }, { label: 'Integrations' }, { label: 'Pricing' }, { label: 'Changelog', badge: 'New' }, { label: 'Roadmap' }] },
  { title: 'Company', links: [{ label: 'About' }, { label: 'Customers' }, { label: 'Careers', badge: '3 open' }, { label: 'Press kit' }, { label: 'Contact' }] },
  { title: 'Resources', links: [{ label: 'Documentation' }, { label: 'Guides' }, { label: 'Blog' }, { label: 'Community', external: true }, { label: 'Templates' }] },
  { title: 'Legal', links: [{ label: 'Privacy policy' }, { label: 'Terms of service' }, { label: 'Data processing' }, { label: 'Subprocessors' }] },
];

const DEMO_SOCIALS = [
  { label: 'Website', icon: 'globe' },
  { label: 'Community', icon: 'messageCircle' },
  { label: 'Source code', icon: 'codeXml' },
  { label: 'Videos', icon: 'video' },
];

const DEMO_LEGAL = ['Privacy', 'Terms', 'Security', 'Cookie settings'].map((label) => ({ label }));

// Faces for the reader count: initials on soft tints.
const READERS = [
  ['AD', 18],
  ['MK', 210],
  ['SR', 145],
  ['JW', 280],
];

const whole = new Intl.NumberFormat('en-US');

const iconMarkup = (icon) => {
  if (!icon) return '';
  if (String(icon).trim().startsWith('<svg')) return icon;
  return strokeIcon(lucide[icon] ?? lucide.link2, 16, 1.75);
};

/**
 * A full site footer led by a newsletter. The sign-up sits in its own panel
 * across the top, with what readers get, how many already do, and the form;
 * below it the brand, a line about the product and social links stand
 * beside four columns of links, and a bar at the bottom carries the
 * copyright, the legal links and a live status line. An oversized wordmark
 * can close the page.
 *
 * The address is checked when sent, with the reason under the field. Set
 * the `subscribe` property to an async function taking the address to send
 * it somewhere: the button waits on it and ignores a second press, a
 * rejection shows its message, and success thanks the reader in place of
 * the form and counts them in.
 *
 * Columns are `[{ title, links: [{ label, href?, badge?, external? }] }]`,
 * social links `{ label, href?, icon }` with a Lucide name from
 * `core/lucide.js` or `<svg>` markup, and legal links `{ label, href? }`.
 *
 * @attr {string} brand
 * @attr {string} href - Where the brand links
 * @attr {string} tagline - One line under the brand
 * @attr {string} eyebrow - The small label over the sign-up's heading
 * @attr {string} heading - What readers get
 * @attr {string} description - How often, and what is in it
 * @attr {number} readers - How many read it already; hides the count when 0
 * @attr {string} placeholder - The empty field's example address
 * @attr {string} button-label
 * @attr {string} note - The reassurance under the field
 * @attr {string} privacy-href - The privacy policy, linked after the note
 * @attr {Array<object>} columns (JSON)
 * @attr {Array<object>} socials (JSON)
 * @attr {Array<object>} legal - Links in the bottom bar (JSON)
 * @attr {string} copyright - Replaces the copyright line
 * @attr {'normal'|'degraded'|'outage'|''} status - The status line; empty hides it
 * @attr {string} status-href - The status page
 * @attr {boolean} wordmark - Closes with the brand name, oversized
 * @attr {string} accent - The sign-up panel's glow, the focus ring and the success mark; violet by default
 * @fires lw-subscribe - Someone subscribed; `detail: { email }`
 * @csspart newsletter - The sign-up panel
 * @csspart wordmark - The oversized brand name
 * @cssprop --lw-signup-footer-accent - Same as `accent`
 */
export class LwSignupFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lower' },
    href: { default: '/' },
    tagline: { default: 'Interface parts that feel finished, for teams who would rather ship than polish.' },
    eyebrow: { default: 'The Lower Letter' },
    heading: { default: 'Stay ahead of what ships next' },
    description: { default: 'Release notes, design write-ups and one deep dive, on the first Tuesday of every month.' },
    readers: { type: Number, default: 12480 },
    placeholder: { default: 'you@company.com' },
    buttonLabel: { default: 'Subscribe' },
    note: { default: 'One email a month. Unsubscribe in one click.' },
    privacyHref: { default: '#' },
    columns: { type: Object, default: DEMO_COLUMNS },
    socials: { type: Object, default: DEMO_SOCIALS },
    legal: { type: Object, default: DEMO_LEGAL },
    copyright: {},
    status: { default: 'normal', reflect: true },
    statusHref: { default: '#' },
    wordmark: { type: Boolean, reflect: true },
    accent: {},
  };

  #busy = false;
  #done = false;
  #error = '';

  render() {
    return `<footer class="container">
<section class="newsletter" part="newsletter" aria-labelledby="newsletter-heading">
  <div class="pitch">
    <p class="eyebrow"><span class="eyebrow-icon" aria-hidden="true">${strokeIcon(lucide.mail, 13, 2)}</span><span class="eyebrow-text"></span></p>
    <h2 class="heading" id="newsletter-heading"></h2>
    <p class="description"></p>
  </div>
  <div class="signup">
    <form class="form" novalidate>
      <label class="visually-hidden" for="email">Email address</label>
      <div class="field">
        <span class="field-icon" aria-hidden="true">${strokeIcon(lucide.mail, 16, 1.75)}</span>
        <input class="input" id="email" name="email" type="email" autocomplete="email" inputmode="email" spellcheck="false" required aria-describedby="note">
        <button class="submit" type="submit"><span class="submit-label"></span><span class="arrow" aria-hidden="true">${strokeIcon(lucide.arrowRight, 15, 2)}</span><span class="spinner" aria-hidden="true"></span></button>
      </div>
      <p class="note" id="note" aria-live="polite"><span class="note-text"></span> <a class="privacy" href="#">Privacy policy</a></p>
    </form>
    <p class="readers"><span class="faces" aria-hidden="true">${READERS.map(([initials, hue]) => `<span class="face" style="--_hue: ${hue}">${initials}</span>`).join('')}</span><span class="readers-text"></span></p>
  </div>
</section>
<div class="main">
  <div class="about"><span class="brand-slot"></span><p class="tagline"></p><ul class="socials" aria-label="Social"></ul></div>
  <div class="columns"></div>
</div>
<div class="bar">
  <p class="copyright"></p>
  <nav class="legal" aria-label="Legal"></nav>
  <a class="status" href="#"><span class="dot" aria-hidden="true"></span><span class="status-text"></span></a>
</div>
<p class="wordmark" part="wordmark" aria-hidden="true"></p>
</footer>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#submit();
    }, options);
    // Typing clears a complaint about the address.
    this.query('.input').addEventListener('input', () => this.#error && this.#hint(''), options);
  }

  updated(changed) {
    if (this.accent) this.style.setProperty('--_accent', this.accent);
    else this.style.removeProperty('--_accent');
    if (changed.has('brand') || changed.has('href')) this.query('.brand-slot').innerHTML = brandMarkup(this.brand, this.href || '/');
    this.#text('.tagline', this.tagline);
    this.#text('.eyebrow-text', this.eyebrow, '.eyebrow');
    this.query('.heading').textContent = this.heading ?? '';
    this.#text('.description', this.description);
    this.query('.input').placeholder = this.placeholder ?? '';
    this.query('.submit-label').textContent = this.buttonLabel || 'Subscribe';
    const privacy = this.query('.privacy');
    privacy.hidden = !this.privacyHref;
    privacy.href = this.privacyHref || '#';
    this.#hint(this.#error);
    this.#paintReaders();
    if (changed.has('socials')) {
      this.query('.socials').innerHTML = (Array.isArray(this.socials) ? this.socials : [])
        .map((social) => `<li><a class="social" href="${escapeHtml(social.href ?? '#')}" aria-label="${escapeHtml(social.label)}" title="${escapeHtml(social.label)}">${iconMarkup(social.icon)}</a></li>`)
        .join('');
    }
    if (changed.has('columns')) this.query('.columns').innerHTML = linkColumns(Array.isArray(this.columns) ? this.columns : []);
    if (changed.has('legal')) this.query('.legal').innerHTML = (Array.isArray(this.legal) ? this.legal : []).map(footerLink).join('');
    this.query('.copyright').textContent = this.copyright ?? `© ${new Date().getFullYear()} ${this.brand ?? ''} Inc. All rights reserved.`;
    const status = this.query('.status');
    status.hidden = !STATUS[this.status];
    status.href = this.statusHref || '#';
    this.query('.status-text').textContent = STATUS[this.status] ?? '';
    this.query('.wordmark').textContent = this.brand ?? '';
  }

  // Sets an element's text and hides it, or `hide`, when there is none.
  #text(selector, value, hide = selector) {
    this.query(selector).textContent = value ?? '';
    this.query(hide).hidden = !value;
  }

  #paintReaders() {
    const count = Math.max(0, Math.round(this.readers ?? 0)) + (this.#done ? 1 : 0);
    const readers = this.query('.readers');
    readers.hidden = !count;
    this.query('.readers-text').textContent = this.#done ? `You and ${whole.format(count - 1)} others read it` : `Join ${whole.format(count)} readers`;
  }

  // Shows why the address was not sent, or the reassurance when `error` is empty.
  #hint(error) {
    if (this.#done) return;
    this.#error = error;
    this.toggleAttribute('data-invalid', Boolean(error));
    this.query('.input').ariaInvalid = error ? 'true' : null;
    this.query('.note-text').textContent = error || this.note || '';
    this.query('.privacy').style.display = error ? 'none' : '';
  }

  async #submit() {
    if (this.#busy || this.#done) return;
    const input = this.query('.input');
    const email = input.value.trim();
    if (!EMAIL.test(email)) {
      this.#hint(email ? 'That address looks incomplete. Check it and try again.' : 'Enter your email address to subscribe.');
      input.focus();
      return;
    }
    this.#hint('');
    this.#busy = true;
    this.toggleAttribute('data-busy', true);
    input.readOnly = true;
    const submit = this.query('.submit');
    submit.ariaDisabled = 'true';
    try {
      await this.subscribe?.(email);
    } catch (error) {
      this.#hint(error?.message || 'That did not go through. Try again in a moment.');
      input.focus();
      return;
    } finally {
      this.#busy = false;
      this.toggleAttribute('data-busy', false);
      input.readOnly = false;
      submit.ariaDisabled = null;
    }
    this.#done = true;
    this.toggleAttribute('data-done', true);
    const thanks = document.createElement('div');
    thanks.className = 'thanks';
    thanks.tabIndex = -1;
    thanks.setAttribute('role', 'status');
    thanks.innerHTML = `<span class="thanks-icon" aria-hidden="true">${strokeIcon(lucide.check, 14, 2.5)}</span><span class="thanks-text"><strong>You're subscribed.</strong><span>The next issue goes to <b></b>.</span></span>`;
    thanks.querySelector('b').textContent = email;
    this.query('.form').replaceWith(thanks);
    thanks.focus({ preventScroll: true });
    this.#paintReaders();
    this.emit('subscribe', { email });
  }
}
