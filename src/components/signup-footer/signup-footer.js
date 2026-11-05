import { escapeHtml } from '../../core/dom.js';
import { brandMarkup, footerLink, linkColumns } from '../../core/footer.js';
import { strokeIcon } from '../../core/icons.js';
import * as lucide from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import '../text-input/index.js';
import '../theme-toggle-button/index.js';
import styles from './signup-footer.scss?inline';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEMO_COLUMNS = [
  { title: 'Product', links: [{ label: 'Features' }, { label: 'Integrations' }, { label: 'Pricing' }, { label: 'Changelog', badge: 'New' }] },
  { title: 'Company', links: [{ label: 'About' }, { label: 'Customers' }, { label: 'Careers', badge: '3 open' }, { label: 'Contact' }] },
  { title: 'Resources', links: [{ label: 'Documentation' }, { label: 'Guides' }, { label: 'Blog' }, { label: 'Community', external: true }] },
  { title: 'Legal', links: [{ label: 'Privacy' }, { label: 'Terms' }, { label: 'Security' }, { label: 'Cookie settings' }] },
];

const DEMO_SOCIALS = [
  { label: 'Website', icon: 'globe' },
  { label: 'Community', icon: 'messageCircle' },
  { label: 'Source code', icon: 'codeXml' },
  { label: 'Videos', icon: 'video' },
];

const DEMO_LEGAL = ['Privacy', 'Terms'].map((label) => ({ label }));

const whole = new Intl.NumberFormat('en-US');

const iconMarkup = (icon) => {
  if (!icon) return '';
  if (String(icon).trim().startsWith('<svg')) return icon;
  return strokeIcon(lucide[icon] ?? lucide.link2, 16);
};

/**
 * A site footer led by a newsletter sign-up: the brand and a line about it,
 * then the sign-up with what readers get, beside four columns of links;
 * below a hairline, the copyright and legal links on one side and social
 * links with a theme switch on the other.
 *
 * The address is checked when sent, with the reason on the field. Set the
 * `subscribe` property to an async function taking the address to send it
 * somewhere: the button spins and holds clicks while it runs, a rejection
 * shows its message on the field, and success thanks the reader in place
 * of the form and counts them in.
 *
 * Columns are `[{ title, links: [{ label, href?, badge?, external? }] }]`,
 * social links `{ label, href?, icon }` with a Lucide name from
 * `core/lucide.js` or `<svg>` markup, and legal links `{ label, href? }`.
 *
 * @attr {string} brand
 * @attr {string} href - Where the brand links
 * @attr {string} tagline - One line under the brand
 * @attr {string} heading - The sign-up's title
 * @attr {string} description - What readers get, and how often
 * @attr {number} readers - How many read it already; left out when 0
 * @attr {string} placeholder - The empty field's example address
 * @attr {string} button-label
 * @attr {string} note - The reassurance under the field
 * @attr {Array<object>} columns (JSON)
 * @attr {Array<object>} socials (JSON)
 * @attr {Array<object>} legal - Small links by the copyright (JSON)
 * @attr {string} copyright - Replaces the copyright line
 * @attr {boolean} no-theme-toggle - Leaves out the theme switch
 * @fires lw-subscribe - Someone subscribed; `detail: { email }`
 */
export class LwSignupFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lower' },
    href: { default: '/' },
    tagline: { default: 'Interface parts that feel finished, for teams who would rather ship than polish.' },
    heading: { default: 'Get the monthly letter' },
    description: { default: 'Release notes, design write-ups and one deep dive, on the first Tuesday of the month.' },
    readers: { type: Number, default: 12480 },
    placeholder: { default: 'you@company.com' },
    buttonLabel: { default: 'Subscribe' },
    note: { default: 'No spam. Unsubscribe in one click.' },
    columns: { type: Object, default: DEMO_COLUMNS },
    socials: { type: Object, default: DEMO_SOCIALS },
    legal: { type: Object, default: DEMO_LEGAL },
    copyright: {},
    noThemeToggle: { type: Boolean, reflect: true },
  };

  #done = false;

  render() {
    return `<footer class="container"><div class="top">
<div class="about"><span class="brand-slot"></span><p class="tagline"></p>
<section class="signup" aria-labelledby="signup-title"><h2 class="title" id="signup-title"></h2><p class="lead"></p>
<form class="form" novalidate><lw-text-input class="email" type="email" name="email" autocomplete="email" inputmode="email" label="Email address" required><span slot="start" class="field-icon" aria-hidden="true">${strokeIcon(lucide.mail, 16)}</span></lw-text-input><lw-button class="subscribe" type="submit"><span class="subscribe-label"></span><span slot="end" aria-hidden="true">${strokeIcon(lucide.arrowRight, 16)}</span></lw-button></form>
</section></div>
<div class="columns"></div></div>
<div class="bottom"><div class="legal"><span class="copyright"></span><span class="legal-links"></span></div>
<div class="tools"><ul class="socials" aria-label="Social"></ul><lw-theme-toggle-button class="theme" size="sm"></lw-theme-toggle-button></div></div></footer>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#submit();
    }, options);
    // The field's input lives in its own shadow root, out of the form's reach for Enter.
    this.query('.email').addEventListener('keydown', (event) => event.key === 'Enter' && (event.preventDefault(), this.#submit()), options);
  }

  updated(changed) {
    if (changed.has('brand') || changed.has('href')) this.query('.brand-slot').innerHTML = brandMarkup(this.brand, this.href || '/');
    const tagline = this.query('.tagline');
    tagline.textContent = this.tagline ?? '';
    tagline.hidden = !this.tagline;
    this.query('.title').textContent = this.heading ?? '';
    this.#paintLead();
    const email = this.query('.email');
    if (email) {
      email.placeholder = this.placeholder ?? '';
      email.hint = this.note ?? '';
      this.query('.subscribe-label').textContent = this.buttonLabel || 'Subscribe';
    }
    if (changed.has('columns')) this.query('.columns').innerHTML = linkColumns(Array.isArray(this.columns) ? this.columns : []);
    if (changed.has('legal')) this.query('.legal-links').innerHTML = (Array.isArray(this.legal) ? this.legal : []).map(footerLink).join('');
    if (changed.has('socials')) {
      this.query('.socials').innerHTML = (Array.isArray(this.socials) ? this.socials : [])
        .map((social) => `<li><a class="social" href="${escapeHtml(social.href ?? '#')}" aria-label="${escapeHtml(social.label)}" title="${escapeHtml(social.label)}">${iconMarkup(social.icon)}</a></li>`)
        .join('');
    }
    this.query('.copyright').textContent = this.copyright ?? `© ${new Date().getFullYear()} ${this.brand ?? ''} Inc.`;
  }

  // What readers get, and how many already do.
  #paintLead() {
    const count = Math.max(0, Math.round(this.readers ?? 0)) + (this.#done ? 1 : 0);
    const description = this.description ?? '';
    const joined = count ? ` Read by ${whole.format(count)} people.` : '';
    this.query('.lead').textContent = `${description}${joined}`.trim();
  }

  async #submit() {
    if (this.#done) return;
    const input = this.query('.email');
    const button = this.query('.subscribe');
    if (button.loading) return;
    const email = (input.value ?? '').trim();
    if (!EMAIL.test(email)) {
      input.error = email ? 'That address looks incomplete.' : 'Enter your email to subscribe.';
      input.focus();
      return;
    }
    input.error = '';
    button.loading = true;
    input.readonly = true;
    try {
      await this.subscribe?.(email);
    } catch (error) {
      input.error = error?.message || 'That did not go through. Try again.';
      input.focus();
      return;
    } finally {
      button.loading = false;
      input.readonly = false;
    }
    this.#done = true;
    const done = document.createElement('p');
    done.className = 'done';
    done.tabIndex = -1;
    done.setAttribute('role', 'status');
    done.innerHTML = `${strokeIcon(lucide.check, 16)}<span>You're subscribed. The next letter goes to <b></b>.</span>`;
    done.querySelector('b').textContent = email;
    this.query('.form').replaceWith(done);
    done.focus({ preventScroll: true });
    this.#paintLead();
    this.emit('subscribe', { email });
  }
}
