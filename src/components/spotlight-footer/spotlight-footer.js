import { escapeHtml } from '../../core/dom.js';
import { brandMarkup, linkColumns, logoProps, socialLinks } from '../../core/footer.js';
import { LwElement } from '../../core/lw-element.js';
import { followPointer } from '../../core/spotlight.js';
import styles from './spotlight-footer.scss?inline';

const DEMO_COLUMNS = [
  { title: 'Product', links: [{ label: 'Features' }, { label: 'Changelog', badge: 'New' }, { label: 'Roadmap' }, { label: 'Integrations' }] },
  { title: 'Solutions', links: [{ label: 'For embedded' }, { label: 'For game engines' }, { label: 'For databases' }] },
  { title: 'Developers', links: [{ label: 'Documentation' }, { label: 'API reference' }, { label: 'SDK' }, { label: 'Status', external: true }] },
  { title: 'Company', links: [{ label: 'About' }, { label: 'Blog' }, { label: 'Careers' }, { label: 'Privacy' }, { label: 'Terms' }] },
];

const DEMO_SOCIALS = [
  { label: 'Website', icon: 'globe' },
  { label: 'Community', icon: 'messageCircle' },
  { label: 'Source code', icon: 'codeXml' },
  { label: 'Videos', icon: 'video' },
];

// The word is set at this share of the footer's width, smaller only when a
// long name would not fit.
const SIZE = 0.18;

/**
 * A sitemap footer with one memorable detail. A fine rule glows across the
 * top; below it the brand, a short line, an email address and social
 * links, then four labelled columns of links beside the copyright. Across
 * the foot the brand's name is set huge and faint, more texture than text,
 * ending in a square in the accent colour, and a light follows the mouse
 * across it, brightest where it points.
 *
 * Columns are `[{ title, links: [{ label, href?, badge?, external? }] }]`
 * and social links `{ label, href?, icon }`, with a Lucide name from
 * `core/lucide.js` or `<svg>` markup.
 *
 * @attr {string} brand
 * @attr {string} href - Where the brand links
 * @attr {string} logo - The logo, for a light theme and for a dark one without `logo-dark`; Lowersoft's by default, and the brand's initial and name when empty
 * @attr {string} logo-dark - The logo for a dark theme
 * @attr {string} tagline - The line under the brand
 * @attr {string} email - An address to write to; none when empty
 * @attr {string} wordmark - The word across the foot; the brand, in lower case, by default
 * @attr {Array<object>} columns (JSON)
 * @attr {Array<object>} socials (JSON)
 * @attr {string} copyright - Replaces the default line
 * @attr {boolean} no-rule - Leaves out the glowing rule along the top
 * @csspart wordmark - The word across the foot
 * @cssprop --lw-spotlight-footer-accent - The square that ends the word; the accent colour by default
 */
export class LwSpotlightFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lowersoft' },
    href: { default: '/' },
    ...logoProps,
    tagline: { default: 'A native build system for teams that ship C, C++ and Rust. Faster builds, smaller binaries, nothing to babysit.' },
    email: { default: 'info@lowersoft.com' },
    wordmark: {},
    columns: { type: Object, default: DEMO_COLUMNS },
    socials: { type: Object, default: DEMO_SOCIALS },
    copyright: {},
    noRule: { type: Boolean, reflect: true },
  };

  render() {
    return `<div class="rule" aria-hidden="true"></div><footer class="container"><div class="head"><div class="brand-slot"></div><p class="tagline"></p><div class="reach"><a class="email" href=""></a><ul class="socials" aria-label="Social"></ul></div></div>
<div class="body"><div class="columns"></div><div class="signoff"><p class="crafted"></p><p class="copyright"></p></div></div>
<div class="wordmark" part="wordmark" aria-hidden="true"><p class="word"><span class="letters"></span><span class="square"></span></p><p class="word lit"><span class="letters"></span><span class="square"></span></p></div></footer>`;
  }

  connected() {
    const wordmark = this.query('.wordmark');
    followPointer(wordmark, this.signal);
    const sized = new ResizeObserver(() => this.#fit());
    sized.observe(wordmark);
    this.signal.addEventListener('abort', () => sized.disconnect());
  }

  updated(changed) {
    if (['brand', 'href', 'logo', 'logoDark'].some((name) => changed.has(name))) this.query('.brand-slot').innerHTML = brandMarkup(this.brand, this.href || '/', this);
    const tagline = this.query('.tagline');
    tagline.textContent = this.tagline ?? '';
    tagline.hidden = !this.tagline;
    const email = this.query('.email');
    email.textContent = this.email ?? '';
    email.href = `mailto:${this.email ?? ''}`;
    email.hidden = !this.email;
    if (changed.has('columns')) this.query('.columns').innerHTML = linkColumns(Array.isArray(this.columns) ? this.columns : []);
    if (changed.has('socials')) this.query('.socials').innerHTML = socialLinks(this.socials);
    const year = new Date().getFullYear();
    this.query('.crafted').textContent = `Crafted in ${year}`;
    this.query('.copyright').innerHTML = escapeHtml(this.copyright ?? `© ${year} ${this.brand ?? ''}. All rights reserved.`);
    if (changed.has('wordmark') || changed.has('brand')) {
      for (const letters of this.shadowRoot.querySelectorAll('.letters')) letters.textContent = this.wordmark || (this.brand ?? '').toLowerCase();
      this.#fit();
    }
  }

  // As big as the share allows, and no wider than the footer.
  #fit() {
    const wordmark = this.query('.wordmark');
    const word = this.query('.word');
    const width = wordmark.clientWidth;
    if (!width) return;
    // Measured at 100px, as wide as its letters rather than its line.
    word.style.cssText = 'font-size: 100px; width: max-content';
    const natural = word.getBoundingClientRect().width || 1;
    word.style.cssText = '';
    wordmark.style.setProperty('--_size', `${Math.min(width * SIZE, (width / natural) * 100 * 0.98)}px`);
  }
}
