import { LOWERSOFT, themedImage } from '../../core/brand.js';
import { escapeHtml } from '../../core/dom.js';
import { linkColumns, socialLinks } from '../../core/footer.js';
import { LwElement } from '../../core/lw-element.js';
import { followPointer } from '../../core/spotlight.js';
import styles from './editorial-footer.scss?inline';

const DEMO_COLUMNS = [
  { title: 'Studio', links: [{ label: 'Work' }, { label: 'Process' }, { label: 'Journal' }] },
  { title: 'Practice', links: [{ label: 'Compilers' }, { label: 'Runtimes' }, { label: 'Profiling' }] },
  { title: 'Contact', links: [{ label: 'Email', href: 'mailto:info@lowersoft.com' }, { label: 'Mastodon', external: true }, { label: 'Source', external: true }] },
];

const DEMO_SOCIALS = [
  { label: 'Website', icon: 'globe' },
  { label: 'Community', icon: 'messageCircle' },
  { label: 'Source code', icon: 'codeXml' },
];

// The wordmark's box, in its own units: the word runs 94% of the width.
const WIDTH = 1000;
const HEIGHT = 180;

/**
 * A footer where the tagline is the headline: one sentence set large
 * beside three short columns of links, a hairline with the copyright and
 * social links, and the brand's name in thin outlined capitals stretched
 * across the full width. Under the mouse the name fills in, inside a soft
 * circle that follows it; nothing moves on its own.
 *
 * Columns are `[{ title, links: [{ label, href?, badge?, external? }] }]`
 * and social links `{ label, href?, icon }`, with a Lucide name from
 * `core/lucide.js` or `<svg>` markup.
 *
 * @attr {string} brand - The name over the tagline, and the copyright's
 * @attr {string} logo - The brand's name as an image over the tagline, for a light theme and for a dark one without `logo-dark`; Lowersoft's wordmark by default, and the name in spaced capitals when empty
 * @attr {string} logo-dark - The name's image for a dark theme
 * @attr {string} tagline - The statement, one sentence written like a headline
 * @attr {string} wordmark - The outlined word across the foot; the brand by default
 * @attr {Array<object>} columns (JSON)
 * @attr {Array<object>} socials (JSON)
 * @attr {string} copyright - Replaces the default line
 * @csspart wordmark - The outlined word
 * @cssprop --lw-editorial-footer-fill - The colour the word fills with under the mouse; the text colour by default
 */
export class LwEditorialFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lowersoft' },
    logo: { default: LOWERSOFT.wordmark.light },
    logoDark: { default: LOWERSOFT.wordmark.dark },
    tagline: { default: 'A small systems studio writing compilers, runtimes and the tools between them, for teams who count every cycle.' },
    wordmark: {},
    columns: { type: Object, default: DEMO_COLUMNS },
    socials: { type: Object, default: DEMO_SOCIALS },
    copyright: {},
  };

  render() {
    const text = (kind) => `<text class="${kind}" x="${WIDTH * 0.03}" y="${HEIGHT - 12}" textLength="${WIDTH * 0.94}" lengthAdjust="spacingAndGlyphs"></text>`;
    return `<footer class="container"><div class="top"><div class="statement"><p class="label"></p><p class="tagline"></p></div><div class="columns"></div></div>
<div class="strip"><p class="copyright"></p><ul class="socials" aria-label="Social"></ul></div>
<div class="wordmark" part="wordmark" aria-hidden="true"><svg class="outline" viewBox="0 0 ${WIDTH} ${HEIGHT}">${text('word')}</svg>
<div class="lit"><svg class="fill" viewBox="0 0 ${WIDTH} ${HEIGHT}"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop class="from" offset="0"/><stop class="to" offset="1"/></linearGradient></defs>${text('word')}</svg></div></div></footer>`;
  }

  connected() {
    followPointer(this.query('.wordmark'), this.signal);
  }

  updated(changed) {
    const label = this.query('.label');
    if (this.logo) label.innerHTML = themedImage({ light: this.logo, dark: this.logoDark }, this.brand ?? '', 'label-logo');
    else label.textContent = this.brand ?? '';
    this.query('.tagline').textContent = this.tagline ?? '';
    for (const word of this.shadowRoot.querySelectorAll('.word')) word.textContent = (this.wordmark || this.brand || '').toUpperCase();
    if (changed.has('columns')) this.query('.columns').innerHTML = linkColumns(Array.isArray(this.columns) ? this.columns : []);
    if (changed.has('socials')) this.query('.socials').innerHTML = socialLinks(this.socials);
    this.query('.copyright').innerHTML = escapeHtml(this.copyright ?? `© ${new Date().getFullYear()} ${this.brand ?? ''} Studio`);
  }
}
