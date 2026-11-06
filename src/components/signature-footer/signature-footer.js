import { escapeHtml } from '../../core/dom.js';
import { brandMarkup, footerLink, linkColumns, logoProps, socialLinks } from '../../core/footer.js';
import { LwElement } from '../../core/lw-element.js';
import { followPointer } from '../../core/spotlight.js';
import styles from './signature-footer.scss?inline';

const DEMO_COLUMNS = [
  { title: 'Product', links: [{ label: 'Overview' }, { label: 'Toolchains' }, { label: 'Releases', badge: 'New' }, { label: 'Roadmap' }] },
  { title: 'Resources', links: [{ label: 'Documentation' }, { label: 'Guides' }, { label: 'Benchmarks' }, { label: 'Community', external: true }] },
  { title: 'Company', links: [{ label: 'About' }, { label: 'Blog' }, { label: 'Careers' }, { label: 'Contact' }] },
];

const DEMO_SOCIALS = [
  { label: 'Website', icon: 'globe' },
  { label: 'Community', icon: 'messageCircle' },
  { label: 'Source code', icon: 'codeXml' },
  { label: 'Videos', icon: 'video' },
];

const DEMO_LEGAL = ['Privacy', 'Terms', 'Security'].map((label) => ({ label }));

// The wordmark's box, in its own units, and the widest the word may run.
const WIDTH = 1000;
const HEIGHT = 250;
const ROOM = 960;

/**
 * A two column footer: the brand, a line about it and round social
 * buttons on the left; three groups of links on the right, like a table of
 * contents. Under a hairline sit the copyright and the legal links, and
 * across the foot the brand's name in outline, which writes itself in like
 * a signature the first time it comes into view. Under the mouse its
 * outline takes colour, inside a soft circle that follows it.
 *
 * Columns are `[{ title, links: [{ label, href?, badge?, external? }] }]`,
 * social links `{ label, href?, icon }` with a Lucide name from
 * `core/lucide.js` or `<svg>` markup, and legal links `{ label, href? }`.
 *
 * @attr {string} brand
 * @attr {string} href - Where the brand links
 * @attr {string} logo - The logo, for a light theme and for a dark one without `logo-dark`; Lowersoft's by default, and the brand's initial and name when empty
 * @attr {string} logo-dark - The logo for a dark theme
 * @attr {string} description - The line under the brand
 * @attr {string} wordmark - The outlined word across the foot; the brand by default
 * @attr {Array<object>} columns (JSON)
 * @attr {Array<object>} socials (JSON)
 * @attr {Array<object>} legal (JSON)
 * @attr {string} copyright - Replaces the default line
 * @csspart wordmark - The outlined word
 * @cssprop --lw-signature-footer-from - Where the colour under the mouse starts; the text colour by default
 * @cssprop --lw-signature-footer-to - Where it ends; the muted text colour by default
 */
export class LwSignatureFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lowersoft' },
    href: { default: '/' },
    ...logoProps,
    description: { default: 'The build system for teams who care about every millisecond. Native toolchains, shared caches, zero lock-in.' },
    wordmark: {},
    columns: { type: Object, default: DEMO_COLUMNS },
    socials: { type: Object, default: DEMO_SOCIALS },
    legal: { type: Object, default: DEMO_LEGAL },
    copyright: {},
  };

  render() {
    const word = (kind) => `<text class="word ${kind}" x="${WIDTH / 2}" y="${HEIGHT - 40}" text-anchor="middle"></text>`;
    return `<footer class="container"><div class="top"><div class="intro"><div class="brand-slot"></div><p class="description"></p><ul class="socials" aria-label="Social"></ul></div><div class="columns"></div></div>
<div class="bottom"><p class="copyright"></p><nav class="legal" aria-label="Legal"></nav></div>
<div class="wordmark" part="wordmark" aria-hidden="true"><svg class="trace" viewBox="0 0 ${WIDTH} ${HEIGHT}">${word('base')}${word('pen')}</svg>
<svg class="lit" viewBox="0 0 ${WIDTH} ${HEIGHT}"><defs><linearGradient id="ink" x1="0" y1="0" x2="1" y2="1"><stop class="from" offset="0"/><stop class="to" offset="1"/></linearGradient></defs>${word('glow')}</svg></div></footer>`;
  }

  connected() {
    const wordmark = this.query('.wordmark');
    followPointer(wordmark, this.signal);
    // Signed once, the first time it is seen.
    const seen = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      this.toggleAttribute('data-signed', true);
      seen.disconnect();
    }, { threshold: 0.4 });
    seen.observe(wordmark);
    this.signal.addEventListener('abort', () => seen.disconnect());
  }

  updated(changed) {
    if (['brand', 'href', 'logo', 'logoDark'].some((name) => changed.has(name))) this.query('.brand-slot').innerHTML = brandMarkup(this.brand, this.href || '/', this);
    const description = this.query('.description');
    description.textContent = this.description ?? '';
    description.hidden = !this.description;
    if (changed.has('columns')) this.query('.columns').innerHTML = linkColumns(Array.isArray(this.columns) ? this.columns : []);
    if (changed.has('socials')) this.query('.socials').innerHTML = socialLinks(this.socials);
    if (changed.has('legal')) this.query('.legal').innerHTML = (Array.isArray(this.legal) ? this.legal : []).map(footerLink).join('');
    this.query('.copyright').innerHTML = escapeHtml(this.copyright ?? `© ${new Date().getFullYear()} ${this.brand ?? ''} Labs. All rights reserved.`);
    if (changed.has('wordmark') || changed.has('brand')) this.#paintWord();
  }

  // A long name is squeezed to fit; a short one keeps its own width.
  #paintWord() {
    const words = [...this.shadowRoot.querySelectorAll('.word')];
    for (const word of words) {
      word.textContent = this.wordmark || this.brand || '';
      word.removeAttribute('textLength');
    }
    const natural = words[0].getComputedTextLength?.() ?? 0;
    if (natural > ROOM) {
      for (const word of words) {
        word.setAttribute('textLength', String(ROOM));
        word.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      }
    }
  }
}
