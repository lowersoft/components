import { LOWERSOFT, themedImage } from '../../core/brand.js';
import { linkColumns, socialLinks } from '../../core/footer.js';
import { GITHUB } from '../../core/login.js';
import { LwElement } from '../../core/lw-element.js';
import { followPointer } from '../../core/spotlight.js';
import styles from './editorial-footer.scss?inline';

const DEMO_COLUMNS = [
  { title: 'Product', links: [{ label: 'lower' }, { label: 'Docs' }, { label: 'Changelog' }] },
  { title: 'Company', links: [{ label: 'About' }, { label: 'Journal' }, { label: 'Brand' }] },
  { title: 'Contact', links: [{ label: 'Email', href: 'mailto:info@lowersoft.com' }, { label: 'GitHub', href: 'https://github.com/lowersoft', external: true }, { label: 'Website', href: 'https://lowersoft.com', external: true }] },
];

const DEMO_SOCIALS = [
  { label: 'GitHub', icon: GITHUB, href: 'https://github.com/lowersoft' },
  { label: 'Website', icon: 'globe', href: 'https://lowersoft.com' },
  { label: 'Email', icon: 'mail', href: 'mailto:info@lowersoft.com' },
];

// The wordmark's box is WIDTH wide; the word spans SPAN of it. Its letters
// are set at their natural size to fill FILL of that span, and the spacing
// between them takes up the rest, so the letters are never stretched.
const WIDTH = 1000;
const SPAN = 0.98;
const FILL = 0.84;
const MAX_SIZE = 260;

/**
 * A footer that reads like the last page of a magazine. A running head
 * with the brand sits over the tagline, one sentence set large and light,
 * beside three short columns of links with growing underlines. A hairline
 * follows with the copyright and the social links, and the brand's name
 * closes the page in thin outlined capitals spaced across the full width.
 * Under the mouse the name fills in, inside a soft circle of light that
 * follows it; nothing moves on its own.
 *
 * The name's letters keep their shape at any width: their size is measured
 * to fit, and only the spacing between them stretches.
 *
 * Columns are `[{ title, links: [{ label, href?, badge?, external? }] }]`
 * and social links `{ label, href?, icon }`, with a Lucide name from
 * `core/lucide.js` or `<svg>` markup.
 *
 * @attr {string} brand - The name in the copyright, and the wordmark's by default
 * @attr {string} logo - The brand's name as an image in the running head, for a light theme and for a dark one without `logo-dark`; Lowersoft's wordmark by default, and the name in spaced capitals when empty
 * @attr {string} logo-dark - The running head's image for a dark theme
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
    tagline: { default: 'A small systems company writing compilers, runtimes and the build tools between them, for teams who count every cycle.' },
    wordmark: {},
    columns: { type: Object, default: DEMO_COLUMNS },
    socials: { type: Object, default: DEMO_SOCIALS },
    copyright: {},
  };

  render() {
    const word = (kind) => `<svg class="${kind}" viewBox="0 0 ${WIDTH} 200" preserveAspectRatio="xMidYMax meet"><text class="word" x="${(WIDTH * (1 - SPAN)) / 2}"></text></svg>`;
    return `<footer class="container"><div class="top"><div class="statement"><p class="label"></p><p class="tagline"></p></div><div class="columns"></div></div>
<div class="strip"><p class="copyright"></p><ul class="socials" aria-label="Social"></ul></div>
<div class="wordmark" part="wordmark" aria-hidden="true">${word('outline')}<div class="lit">${word('fill')}</div><svg class="ruler" aria-hidden="true"><text class="word"></text></svg></div></footer>`;
  }

  connected() {
    followPointer(this.query('.wordmark'), this.signal);
    // The face may arrive after the first measure; measure again once it has.
    document.fonts?.ready.then(() => this.isConnected && this.#setWord());
  }

  updated(changed) {
    const label = this.query('.label');
    if (this.logo) label.innerHTML = themedImage({ light: this.logo, dark: this.logoDark }, this.brand ?? '', 'label-logo');
    else label.textContent = this.brand ?? '';
    this.query('.tagline').textContent = this.tagline ?? '';
    if (changed.has('columns')) this.query('.columns').innerHTML = linkColumns(Array.isArray(this.columns) ? this.columns : []);
    if (changed.has('socials')) this.query('.socials').innerHTML = socialLinks(this.socials);
    this.query('.copyright').textContent = this.copyright ?? `© ${new Date().getFullYear()} ${this.brand ?? ''}`;
    if (changed.has('wordmark') || changed.has('brand')) this.#setWord();
  }

  // Sets the word at the size that fills its share of the width, and fits
  // the boxes to its capitals, so it sits flush with the footer's foot.
  #setWord() {
    const text = (this.wordmark || this.brand || '').toUpperCase();
    const ruler = this.query('.ruler .word');
    ruler.textContent = text;
    ruler.setAttribute('font-size', '100');
    const natural = ruler.getComputedTextLength() || 1;
    const size = Math.min(MAX_SIZE, (100 * WIDTH * SPAN * FILL) / natural);
    // Capitals stand about 0.72 of the size; a little room keeps the stroke whole.
    const height = Math.ceil(size * 0.76);
    for (const svg of this.shadowRoot.querySelectorAll('.outline, .fill')) {
      svg.setAttribute('viewBox', `0 0 ${WIDTH} ${height}`);
      const word = svg.querySelector('.word');
      word.textContent = text;
      word.setAttribute('font-size', size.toFixed(2));
      word.setAttribute('y', (size * 0.73).toFixed(2));
      word.setAttribute('textLength', String(WIDTH * SPAN));
      word.setAttribute('lengthAdjust', 'spacing');
    }
    this.query('.wordmark').hidden = !text;
  }
}
