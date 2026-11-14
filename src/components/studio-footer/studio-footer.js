import { LOWERSOFT, themedImage } from '../../core/brand.js';
import { escapeHtml } from '../../core/dom.js';
import { footerLink, linkColumns, socialLinks } from '../../core/footer.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { GITHUB, X_LOGO } from '../../core/login.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './studio-footer.scss?inline';

const DEMO_COLUMNS = [
  {
    title: 'Products',
    links: [
      { label: 'lw components', href: '/products/components' },
      { label: 'LowerAuth', href: '/products/auth' },
      { label: 'LowerSync', href: '/products/sync' },
      { label: 'LowerCloud', href: '/products/cloud' },
      { label: 'LowerDB', href: '/lowerdb' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
      { label: 'Forum', href: 'https://forum.lowersoft.com', external: true },
      { label: 'Email', href: 'mailto:info@lowersoft.com' },
    ],
  },
  {
    title: 'lw components',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'GitHub', href: 'https://github.com/lowersoft/components', external: true },
      { label: 'npm', href: 'https://www.npmjs.com/package/@lowersoft/lw', external: true },
      { label: 'Report Issue', href: 'https://github.com/lowersoft/components/issues/new', external: true },
    ],
  },
];

const DEMO_CREDITS = [
  { name: 'Pounter', href: 'https://github.com/p0unter' },
  { name: 'Mal1kore1ss', href: 'https://github.com/mal1kore1ss' },
];

const DEMO_SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/lowersoft', icon: GITHUB, external: true },
  { label: 'X', href: 'https://x.com/lowersoftinc', icon: X_LOGO, external: true },
];

const DEMO_LEGAL = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

// The square after the word: its side and the gap before it, in ems of the word.
const SQUARE = 0.2 + 0.07;
// A short word stops growing at this size (px), short of filling the row.
const MAX_SIZE = 160;

const list = (value) => (Array.isArray(value) ? value : []);

// "A", "A & B", "A, B & C".
const joined = (parts) => (parts.length < 2 ? parts.join('') : `${parts.slice(0, -1).join(', ')} &amp; ${parts.at(-1)}`);

/**
 * A studio's footer under an arch: the top edge is the curve of a double
 * frame of fine lines, lit in the middle and fading out to the sides, over
 * a soft light from above. Below it the brand, a short line, who it is
 * powered by, an address to write to and social links, with columns of
 * links across from them. Across the foot the brand's name is set huge,
 * lit from the top and fading out below, ending in a square of colour,
 * with the year, the copyright and the legal links beside it. A soft
 * highlight slides between the links under the pointer.
 *
 * Columns are `[{ title, links: [{ label, href?, badge?, external? }] }]`,
 * credits `[{ name, href? }]`, social links `{ label, href?, icon,
 * external? }` with a Lucide name from `core/lucide.js` or `<svg>` markup,
 * and legal links `{ label, href?, external? }`.
 *
 * @attr {string} brand - The brand's name, read out for its logo
 * @attr {string} href - Where the brand links
 * @attr {string} mark - The brand's mark, before the wordmark; none when empty
 * @attr {string} logo - The brand's wordmark, beside the mark; the name as text without one
 * @attr {string} logo-dark - The wordmark for a dark theme
 * @attr {string} tagline - The line under the brand
 * @attr {Array<object>} credits - Who it is powered by, each a link with `href` (JSON)
 * @attr {string} email - An address to write to; none when empty
 * @attr {Array<object>} socials (JSON)
 * @attr {Array<object>} columns (JSON)
 * @attr {string} wordmark - The word across the foot; the brand, in lower case, by default
 * @attr {string} company - The legal name in the copyright line
 * @attr {string} copyright - Replaces the copyright line
 * @attr {Array<object>} legal - The links under the copyright (JSON)
 * @csspart wordmark - The word across the foot, with its square
 * @cssprop --lw-studio-footer-square - The square that ends the word; Lowersoft red by default
 * @cssprop --lw-studio-footer-underline - The underline of the links in the copy; Lowersoft orange by default
 * @cssprop --lw-studio-footer-glow - The light from above in a dark theme; Lowersoft navy by default
 */
export class LwStudioFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: LOWERSOFT.name },
    href: { default: '/' },
    mark: { default: LOWERSOFT.mark },
    logo: { default: LOWERSOFT.wordmark.light },
    logoDark: { default: LOWERSOFT.wordmark.dark },
    tagline: { default: 'Components, sync and storage for teams who would rather ship than wire things together.' },
    credits: { type: Object, default: DEMO_CREDITS },
    email: { default: 'info@lowersoft.com' },
    socials: { type: Object, default: DEMO_SOCIALS },
    columns: { type: Object, default: DEMO_COLUMNS },
    wordmark: {},
    company: { default: 'Lowersoft Inc.' },
    copyright: {},
    legal: { type: Object, default: DEMO_LEGAL },
  };

  render() {
    return `<div class="arch" aria-hidden="true"><div class="arch-frame"><div class="arch-inner"></div></div><div class="arch-glow"></div></div>
<footer class="container">
<div class="top"><div class="intro"><a class="brand"></a><p class="tagline"></p><div class="lines"><p class="credits"></p><p class="contact">Direct contact at <a class="inline-link email"></a></p></div><ul class="socials" aria-label="Social"></ul></div>
<div class="columns"><span class="pill" aria-hidden="true"></span><div class="column-grid"></div></div></div>
<div class="foot"><div class="wordmark" part="wordmark" aria-hidden="true"><span class="word"></span><span class="square"></span></div>
<div class="signoff"><p class="crafted"></p><p class="copyright"></p><nav class="legal" aria-label="Legal"><span class="pill" aria-hidden="true"></span><ul class="legal-links"></ul></nav></div></div>
</footer>`;
  }

  connected() {
    for (const area of this.shadowRoot.querySelectorAll('.columns, .legal')) this.#glide(area);
    const sized = new ResizeObserver(() => {
      this.#fit();
      // The links moved with the layout; the pointer brings the highlight back.
      for (const pill of this.shadowRoot.querySelectorAll('.pill')) hideHighlight(pill);
    });
    sized.observe(this.query('.wordmark'));
    this.signal.addEventListener('abort', () => sized.disconnect());
  }

  updated(changed) {
    if (['brand', 'href', 'mark', 'logo', 'logoDark'].some((name) => changed.has(name))) this.#paintBrand();
    if (changed.has('tagline')) {
      const tagline = this.query('.tagline');
      tagline.textContent = this.tagline ?? '';
      tagline.hidden = !this.tagline;
    }
    if (changed.has('credits')) {
      const credits = list(this.credits).filter((credit) => credit?.name);
      const names = credits.map((credit) => (credit.href ? `<a class="inline-link" href="${escapeHtml(credit.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(credit.name)}<span class="visually-hidden"> (opens in a new tab)</span></a>` : `<span class="name">${escapeHtml(credit.name)}</span>`));
      const line = this.query('.credits');
      line.innerHTML = names.length ? `Powered by ${joined(names)}` : '';
      line.hidden = !names.length;
    }
    if (changed.has('email')) {
      const email = this.query('.email');
      email.textContent = this.email ?? '';
      email.href = `mailto:${this.email ?? ''}`;
      this.query('.contact').hidden = !this.email;
    }
    if (changed.has('socials')) {
      const socials = this.query('.socials');
      socials.innerHTML = socialLinks(this.socials);
      socials.hidden = !socials.children.length;
    }
    if (changed.has('columns')) this.query('.column-grid').innerHTML = linkColumns(list(this.columns));
    if (changed.has('legal')) {
      this.query('.legal-links').innerHTML = list(this.legal).map((link) => `<li>${footerLink(link)}</li>`).join('');
      this.query('.legal').hidden = !list(this.legal).length;
    }
    const year = new Date().getFullYear();
    this.query('.crafted').textContent = `Crafted in ${year}`;
    if (changed.has('copyright') || changed.has('company') || changed.has('brand')) {
      const owner = (this.company || this.brand || '').replace(/\.$/, '');
      this.query('.copyright').textContent = this.copyright ?? `© ${year} ${owner}. All rights reserved.`;
    }
    if (changed.has('wordmark') || changed.has('brand')) {
      this.query('.word').textContent = this.wordmark || (this.brand ?? '').toLowerCase();
      this.#fit();
    }
  }

  #paintBrand() {
    const name = this.brand ?? '';
    const mark = this.mark ? `<img class="brand-mark" src="${escapeHtml(this.mark)}" alt="${this.logo ? '' : escapeHtml(name)}" decoding="async">` : '';
    const words = this.logo
      ? themedImage({ light: this.logo, dark: this.logoDark }, name, 'brand-logo')
      : `<span class="brand-name"${this.mark ? ' aria-hidden="true"' : ''}>${escapeHtml(name)}</span>`;
    const brand = this.query('.brand');
    brand.href = this.href || '/';
    brand.innerHTML = mark + words;
  }

  // One highlight per area slides to the link under the pointer, across
  // columns too, and fades once the pointer leaves the area.
  #glide(area) {
    const pill = area.querySelector(':scope > .pill');
    const options = { signal: this.signal };
    area.addEventListener('pointerover', (event) => {
      if (event.pointerType === 'touch') return;
      const link = event.target.closest('.link');
      if (link) moveHighlight(pill, link);
    }, options);
    area.addEventListener('pointerleave', () => hideHighlight(pill), options);
  }

  // As big as the row allows: the word and its square fill the width it
  // leaves beside the sign-off, or the whole width on a phone, up to
  // MAX_SIZE.
  #fit() {
    const wordmark = this.query('.wordmark');
    const word = this.query('.word');
    const width = wordmark.clientWidth;
    if (!width || !word.textContent) return;
    // Measured at 100px, as wide as its letters rather than its line.
    wordmark.style.setProperty('--_size', '100px');
    const natural = word.getBoundingClientRect().width || 1;
    wordmark.style.setProperty('--_size', `${Math.min(MAX_SIZE, (width / (natural / 100 + SQUARE)) * 0.99)}px`);
  }
}
