import { LOWERSOFT } from '../../core/brand.js';
import { brandMarkup, linkColumns, socialLinks } from '../../core/footer.js';
import { GITHUB } from '../../core/login.js';
import { LwElement } from '../../core/lw-element.js';
import { followPointer } from '../../core/spotlight.js';
import styles from './four-column-footer.scss?inline';

const DEMO_COLUMNS = [
  { title: 'Product', links: [{ label: 'lower' }, { label: 'Benchmarks' }, { label: 'Changelog' }, { label: 'Roadmap' }] },
  { title: 'Solutions', links: [{ label: 'For C and C++' }, { label: 'For Rust' }, { label: 'For monorepos' }] },
  { title: 'Developers', links: [{ label: 'Documentation' }, { label: 'Build files' }, { label: 'CLI reference' }, { label: 'GitHub', href: 'https://github.com/lowersoft', external: true }] },
  { title: 'Company', links: [{ label: 'About' }, { label: 'Journal' }, { label: 'Brand' }, { label: 'Privacy' }, { label: 'Terms' }] },
];

const DEMO_SOCIALS = [
  { label: 'GitHub', icon: GITHUB, href: 'https://github.com/lowersoft' },
  { label: 'Website', icon: 'globe', href: 'https://lowersoft.com' },
];

/**
 * A footer in three bands divided by hairlines that run edge to edge. The
 * first holds the brand, a short description, the email address and the
 * social links; the second, four columns of links beside a small stamp and
 * the copyright; the last, the brand's name in heavy lowercase with a
 * square full stop, as wide as the band allows, standing on the footer's
 * foot.
 *
 * Lowersoft's logo colours carry the scheme: the name fades into the
 * badge's navy, its full stop is the wordmark's red square, and a link
 * under the mouse, like the stamp, is marked with its orange one. Under
 * the mouse a light follows across the name in orange.
 *
 * Columns are `[{ title, links: [{ label, href?, badge?, external? }] }]`
 * and social links `{ label, href?, icon }`, with a Lucide name from
 * `core/lucide.js` or `<svg>` markup.
 *
 * @attr {string} brand - The name in the copyright, and the name across the foot by default
 * @attr {string} href - Where the brand links
 * @attr {string} logo - The brand's logo, for a light theme and for a dark one without `logo-dark`; Lowersoft's one-line wordmark by default, and the brand's initial and name when empty
 * @attr {string} logo-dark - The logo for a dark theme
 * @attr {string} description - A sentence or two under the brand
 * @attr {string} email - The address beside the social links; hidden when empty
 * @attr {Array<object>} columns (JSON)
 * @attr {Array<object>} socials (JSON)
 * @attr {string} note - The stamp over the copyright; "Crafted in" and the year by default
 * @attr {string} copyright - Replaces the default line
 * @attr {string} wordmark - The name across the foot; the brand, in lowercase, by default
 * @csspart wordmark - The name across the foot
 * @cssprop --lw-four-column-footer-accent - The squares that mark links and the stamp, and the light on the name; Lowersoft orange by default
 * @cssprop --lw-four-column-footer-dot - The square full stop after the name; Lowersoft red by default
 * @cssprop --lw-four-column-footer-word - The colour the name fades into; Lowersoft navy by default
 */
export class LwFourColumnFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lowersoft' },
    href: { default: '/' },
    logo: { default: LOWERSOFT.wordmark.light },
    logoDark: { default: LOWERSOFT.wordmark.dark },
    description: { default: 'Lowersoft makes lower, a native build tool for C, C++ and Rust, for teams who would rather ship than wait on a build.' },
    email: { default: 'info@lowersoft.com' },
    columns: { type: Object, default: DEMO_COLUMNS },
    socials: { type: Object, default: DEMO_SOCIALS },
    note: {},
    copyright: {},
    wordmark: {},
  };

  render() {
    return `<footer class="footer"><div class="band intro"><div class="container"><span class="brand-slot"></span><p class="description"></p>
<div class="reach"><a class="email"></a><ul class="socials" aria-label="Social"></ul></div></div></div>
<div class="band middle"><div class="container"><div class="columns"></div><div class="stamp"><p class="note"></p><p class="copyright"></p></div></div></div>
<div class="band mark" part="wordmark" aria-hidden="true"><div class="container"><span class="word"><span class="letters"></span><span class="dot"></span></span></div></div></footer>`;
  }

  connected() {
    followPointer(this.query('.word'), this.signal);
    // The face may arrive after the first measure; measure again once it has.
    document.fonts?.ready.then(() => this.isConnected && this.#setWord());
  }

  updated(changed) {
    if (['brand', 'href', 'logo', 'logoDark'].some((name) => changed.has(name))) this.query('.brand-slot').innerHTML = brandMarkup(this.brand, this.href || '/', this);
    const description = this.query('.description');
    description.textContent = this.description ?? '';
    description.hidden = !this.description;
    const email = this.query('.email');
    email.textContent = this.email ?? '';
    email.href = `mailto:${this.email ?? ''}`;
    email.hidden = !this.email;
    if (changed.has('columns')) this.query('.columns').innerHTML = linkColumns(Array.isArray(this.columns) ? this.columns : []);
    if (changed.has('socials')) this.query('.socials').innerHTML = socialLinks(this.socials);
    const year = new Date().getFullYear();
    this.query('.note').textContent = this.note ?? `Crafted in ${year}`;
    this.query('.note').hidden = !this.query('.note').textContent;
    this.query('.copyright').textContent = this.copyright ?? `© ${year} ${this.brand ?? ''}. All rights reserved.`;
    if (changed.has('wordmark') || changed.has('brand')) this.#setWord();
  }

  // Sizes the name to span its band, in container units so it follows the
  // width without measuring again, and trims the line to the letters so
  // they stand on the footer's foot.
  #setWord() {
    const text = this.wordmark || (this.brand ?? '').toLowerCase();
    const word = this.query('.word');
    this.query('.letters').textContent = text;
    this.query('.mark').hidden = !text;
    if (!text) return;
    word.style.fontSize = '100px';
    const width = word.getBoundingClientRect().width;
    const style = getComputedStyle(word);
    const context = document.createElement('canvas').getContext('2d');
    context.font = `${style.fontWeight} 100px ${style.fontFamily}`;
    const metrics = context.measureText(text);
    // With a line height of 1, the baseline sits half the leading below the face's ascent.
    const baseline = (100 - metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2 + metrics.fontBoundingBoxAscent;
    // The first letter's side bearing: drawn ink starts this far into the box.
    const lead = Math.max(0, -metrics.actualBoundingBoxLeft);
    word.style.removeProperty('font-size');
    if (width <= lead) return;
    word.style.setProperty('--_size', (10000 / (width - lead)).toFixed(3));
    word.style.setProperty('--_lead', (lead / 100).toFixed(3));
    word.style.setProperty('--_top', ((baseline - metrics.actualBoundingBoxAscent) / 100).toFixed(3));
    word.style.setProperty('--_bottom', ((100 - baseline - Math.max(0, metrics.actualBoundingBoxDescent)) / 100).toFixed(3));
  }
}
