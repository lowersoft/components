import { escapeHtml } from '../../core/dom.js';
import { footerLink, linkColumns } from '../../core/footer.js';
import { strokeIcon } from '../../core/icons.js';
import * as lucide from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './signup-footer.scss?inline';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEMO_COLUMNS = [
  { title: 'Product', links: [{ label: 'Features' }, { label: 'Integrations' }, { label: 'Pricing' }, { label: 'Changelog', badge: 'New' }, { label: 'Roadmap' }] },
  { title: 'Company', links: [{ label: 'About' }, { label: 'Careers' }, { label: 'Customers' }, { label: 'Press' }, { label: 'Contact' }] },
  { title: 'Resources', links: [{ label: 'Documentation' }, { label: 'Guides' }, { label: 'Blog' }, { label: 'Community', external: true }, { label: 'Status', external: true }] },
  { title: 'Legal', links: [{ label: 'Privacy policy' }, { label: 'Terms of service' }, { label: 'Data processing' }, { label: 'Licenses' }] },
];

const DEMO_SOCIALS = [
  { label: 'Website', icon: 'globe' },
  { label: 'Community', icon: 'messageCircle' },
  { label: 'Source code', icon: 'codeXml' },
  { label: 'Videos', icon: 'video' },
];

const DEMO_LEGAL = ['Privacy', 'Terms', 'Security', 'Cookie settings'].map((label) => ({ label }));

const iconMarkup = (icon) => {
  if (!icon) return '';
  if (String(icon).trim().startsWith('<svg')) return icon;
  return strokeIcon(lucide[icon] ?? lucide.link2, 18, 1.75);
};

/**
 * A footer led by a newsletter sign-up: the brand, a line about it and
 * social links on one side, the sign-up on the other, then columns of
 * links and a legal bar, all under a soft glow and a bright top edge in
 * the accent color.
 *
 * The address is checked as it is sent, with the reason shown under the
 * field. Set the `subscribe` property to an async function taking the
 * address to send it somewhere: the button waits on it, a second press
 * does nothing meanwhile, and a rejection shows its message. Success
 * thanks the reader in place of the form.
 *
 * Columns are `[{ title, links: [{ label, href?, badge?, external? }] }]`,
 * social links `{ label, href?, icon }` with a Lucide name from
 * `core/lucide.js` or `<svg>` markup, and legal links `{ label, href? }`.
 *
 * @attr {string} brand
 * @attr {string} href - Where the brand links
 * @attr {string} tagline - One line under the brand
 * @attr {string} heading - The line over the sign-up; say what readers get and how often
 * @attr {string} placeholder - The empty field's example address
 * @attr {string} button-label
 * @attr {string} note - The reassurance under the field
 * @attr {Array<object>} columns (JSON)
 * @attr {Array<object>} socials (JSON)
 * @attr {Array<object>} legal - Links in the legal bar (JSON)
 * @attr {string} copyright - Replaces the copyright line
 * @attr {string} accent - The glow, edge and hover color; violet by default
 * @fires lw-subscribe - Someone subscribed; `detail: { email }`
 * @csspart signup - The sign-up block
 * @cssprop --lw-signup-footer-accent - Same as `accent`
 */
export class LwSignupFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lower' },
    href: { default: '/' },
    tagline: { default: 'Interface parts that feel finished, for teams who ship.' },
    heading: { default: 'Stay ahead of the curve: product notes, launches and one deep dive a month.' },
    placeholder: { default: 'you@company.com' },
    buttonLabel: { default: 'Subscribe' },
    note: { default: 'No spam, ever. Unsubscribe in one click.' },
    columns: { type: Object, default: DEMO_COLUMNS },
    socials: { type: Object, default: DEMO_SOCIALS },
    legal: { type: Object, default: DEMO_LEGAL },
    copyright: {},
    accent: {},
  };

  #busy = false;
  #done = false;

  render() {
    return `<footer class="container">
<div class="top">
  <div class="about"><a class="brand"></a><p class="tagline"></p><ul class="socials"></ul></div>
  <section class="signup" part="signup" aria-labelledby="signup-heading">
    <h2 class="heading" id="signup-heading"></h2>
    <form class="form" novalidate>
      <label class="visually-hidden" for="email">Email address</label>
      <div class="field"><input class="input" id="email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="note"><button class="submit" type="submit"><span class="submit-label"></span><span class="arrow" aria-hidden="true">${strokeIcon(lucide.arrowRight, 16)}</span><span class="spinner" aria-hidden="true"></span></button></div>
      <p class="note" id="note" aria-live="polite"></p>
    </form>
  </section>
</div>
<div class="columns"></div>
<div class="bar"><p class="copyright"></p><nav class="legal" aria-label="Legal"></nav></div>
</footer>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#submit();
    }, options);
    // Typing clears a complaint about the address.
    this.query('.input').addEventListener('input', () => this.#hint(false), options);
  }

  updated(changed) {
    if (this.accent) this.style.setProperty('--_accent', this.accent);
    else this.style.removeProperty('--_accent');
    const brand = this.query('.brand');
    brand.textContent = this.brand ?? '';
    brand.href = this.href || '/';
    const tagline = this.query('.tagline');
    tagline.textContent = this.tagline ?? '';
    tagline.hidden = !this.tagline;
    this.query('.heading').textContent = this.heading ?? '';
    this.query('.input').placeholder = this.placeholder ?? '';
    this.query('.submit-label').textContent = this.buttonLabel || 'Subscribe';
    if (!this.#done) this.#hint(this.hasAttribute('data-invalid'));
    if (changed.has('socials')) {
      this.query('.socials').innerHTML = (Array.isArray(this.socials) ? this.socials : [])
        .map((social) => `<li><a class="social" href="${escapeHtml(social.href ?? '#')}" aria-label="${escapeHtml(social.label)}" title="${escapeHtml(social.label)}">${iconMarkup(social.icon)}</a></li>`)
        .join('');
    }
    if (changed.has('columns')) this.query('.columns').innerHTML = linkColumns(Array.isArray(this.columns) ? this.columns : []);
    if (changed.has('legal')) this.query('.legal').innerHTML = (Array.isArray(this.legal) ? this.legal : []).map(footerLink).join('');
    this.query('.copyright').textContent = this.copyright ?? `© ${new Date().getFullYear()} ${this.brand ?? ''} Inc. All rights reserved.`;
  }

  // Shows the reassurance, or why the address was not sent.
  #hint(invalid, message) {
    if (this.#done) return;
    const input = this.query('.input');
    this.toggleAttribute('data-invalid', invalid);
    input.ariaInvalid = invalid ? 'true' : null;
    this.query('.note').textContent = invalid ? message ?? this.query('.note').textContent : this.note ?? '';
  }

  async #submit() {
    if (this.#busy || this.#done) return;
    const input = this.query('.input');
    const email = input.value.trim();
    if (!EMAIL.test(email)) {
      this.#hint(true, email ? 'That address looks incomplete. Check it and try again.' : 'Enter your email address to subscribe.');
      input.focus();
      return;
    }
    this.#hint(false);
    this.#busy = true;
    this.toggleAttribute('data-busy', true);
    input.readOnly = true;
    const submit = this.query('.submit');
    submit.ariaDisabled = 'true';
    try {
      await this.subscribe?.(email);
    } catch (error) {
      this.#hint(true, error?.message || 'That did not go through. Try again in a moment.');
      return;
    } finally {
      this.#busy = false;
      this.toggleAttribute('data-busy', false);
      input.readOnly = false;
      submit.ariaDisabled = null;
    }
    this.#done = true;
    const thanks = document.createElement('p');
    thanks.className = 'thanks';
    thanks.tabIndex = -1;
    thanks.innerHTML = `<span class="thanks-icon" aria-hidden="true">${strokeIcon(lucide.check, 14, 2.5)}</span><span>You're on the list. Look out for a note at <b></b>.</span>`;
    thanks.querySelector('b').textContent = email;
    this.query('.form').replaceWith(thanks);
    thanks.focus({ preventScroll: true });
    this.emit('subscribe', { email });
  }
}
