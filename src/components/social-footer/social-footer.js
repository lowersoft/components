import { brandMarkup, footerLink, linkColumns, logoProps, socialLinks } from '../../core/footer.js';
import { LwElement } from '../../core/lw-element.js';
import '../theme-toggle-button/index.js';
import styles from './social-footer.scss?inline';

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

/**
 * A site footer with the brand and a line about it beside four columns of
 * links; below a hairline, the copyright and legal links on one side and
 * social links with a theme switch on the other.
 *
 * Columns are `[{ title, links: [{ label, href?, badge?, external? }] }]`,
 * social links `{ label, href?, icon }` with a Lucide name from
 * `core/lucide.js` or `<svg>` markup, and legal links `{ label, href? }`.
 *
 * @attr {string} brand
 * @attr {string} href - Where the brand links
 * @attr {string} logo - The logo, for a light theme and for a dark one without `logo-dark`; Lowersoft's by default, and the brand's initial and name when empty
 * @attr {string} logo-dark - The logo for a dark theme
 * @attr {string} tagline - One line under the brand
 * @attr {Array<object>} columns (JSON)
 * @attr {Array<object>} socials (JSON)
 * @attr {Array<object>} legal - Small links by the copyright (JSON)
 * @attr {string} copyright - Replaces the copyright line
 * @attr {boolean} no-theme-toggle - Leaves out the theme switch
 */
export class LwSocialFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lowersoft' },
    href: { default: '/' },
    ...logoProps,
    tagline: { default: 'Interface parts that feel finished, for teams who would rather ship than polish.' },
    columns: { type: Object, default: DEMO_COLUMNS },
    socials: { type: Object, default: DEMO_SOCIALS },
    legal: { type: Object, default: DEMO_LEGAL },
    copyright: {},
    noThemeToggle: { type: Boolean, reflect: true },
  };

  render() {
    return `<footer class="container"><div class="top">
<div class="about"><span class="brand-slot"></span><p class="tagline"></p></div>
<div class="columns"></div></div>
<div class="bottom"><div class="legal"><span class="copyright"></span><span class="legal-links"></span></div>
<div class="tools"><ul class="socials" aria-label="Social"></ul><lw-theme-toggle-button class="theme" size="sm"></lw-theme-toggle-button></div></div></footer>`;
  }

  updated(changed) {
    if (['brand', 'href', 'logo', 'logoDark'].some((name) => changed.has(name))) this.query('.brand-slot').innerHTML = brandMarkup(this.brand, this.href || '/', this);
    const tagline = this.query('.tagline');
    tagline.textContent = this.tagline ?? '';
    tagline.hidden = !this.tagline;
    if (changed.has('columns')) this.query('.columns').innerHTML = linkColumns(Array.isArray(this.columns) ? this.columns : []);
    if (changed.has('legal')) this.query('.legal-links').innerHTML = (Array.isArray(this.legal) ? this.legal : []).map(footerLink).join('');
    if (changed.has('socials')) {
      this.query('.socials').innerHTML = socialLinks(this.socials);
    }
    this.query('.copyright').textContent = this.copyright ?? `© ${new Date().getFullYear()} ${this.brand ?? ''} Inc.`;
  }
}
