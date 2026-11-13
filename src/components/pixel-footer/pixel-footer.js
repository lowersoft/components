import '../button/index.js';
import '../text-input/index.js';
import { escapeHtml } from '../../core/dom.js';
import { brandMarkup, footerLink, linkColumns, logoProps, socialLinks, wireSignup } from '../../core/footer.js';
import { strokeIcon } from '../../core/icons.js';
import { check } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { layout } from './pixel-font.js';
import styles from './pixel-footer.scss?inline';

const DEMO_COLUMNS = [
  { title: 'Home', links: [{ label: 'About' }, { label: 'Features' }, { label: 'Changelog' }, { label: 'Roadmap' }, { label: 'Open source', external: true }] },
  { title: 'Product', links: [{ label: 'Pricing' }, { label: 'Integrations' }, { label: 'Security' }, { label: 'Enterprise' }, { label: 'Showcase' }] },
  { title: 'Developers', links: [{ label: 'Documentation' }, { label: 'API reference' }, { label: 'CLI' }, { label: 'SDKs' }, { label: 'Status', external: true }] },
  { title: 'Company', links: [{ label: 'Blog' }, { label: 'Careers', badge: '2 open' }, { label: 'Press' }, { label: 'Contact' }, { label: 'Brand' }] },
];

const DEMO_SOCIALS = [
  { label: 'Website', icon: 'globe' },
  { label: 'Community', icon: 'messageCircle' },
  { label: 'Source code', icon: 'codeXml' },
  { label: 'Videos', icon: 'video' },
];

const DEMO_LEGAL = ['Privacy', 'Terms', 'Cookie settings', 'Licences'].map((label) => ({ label }));

// How quickly the light leans after the mouse, per second.
const FOLLOW = 9;

/**
 * A footer for developer tools: the brand, a line about it and a short
 * newsletter sign-up beside four columns of links; a strip with the
 * copyright, social links and legal links; and across the foot the brand's
 * name set in a built-in pixel font, drawn cell by cell to the full width.
 * At rest only the letters' outlines show, faint; under the mouse every
 * cell fills with a light that leans towards it.
 *
 * Columns are `[{ title, links: [{ label, href?, badge?, external? }] }]`,
 * social links `{ label, href?, icon }` with a Lucide name from
 * `core/lucide.js` or `<svg>` markup, and legal links `{ label, href? }`.
 *
 * Set the `subscribe` property to an async function taking the address to
 * send it somewhere; a rejection shows its message on the field.
 *
 * @attr {string} brand
 * @attr {string} href - Where the brand links
 * @attr {string} logo - The logo, for a light theme and for a dark one without `logo-dark`; Lowersoft's by default, and the brand's initial and name when empty
 * @attr {string} logo-dark - The logo for a dark theme
 * @attr {string} description - The line under the brand
 * @attr {string} signup - The sign-up's title; no sign-up when empty
 * @attr {string} pitch - The line under the sign-up's title
 * @attr {string} note - The small print under the field
 * @attr {string} wordmark - The word across the foot, in letters, figures, spaces, `-`, `.` and `_`; the brand by default
 * @attr {Array<object>} columns (JSON)
 * @attr {Array<object>} socials (JSON)
 * @attr {Array<object>} legal (JSON)
 * @attr {string} copyright - Replaces the default line
 * @fires lw-subscribe - An address went through; `detail: { email }`
 * @csspart wordmark - The pixel word
 * @cssprop --lw-pixel-footer-light - The colour the cells fill with; the text colour by default
 */
export class LwPixelFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lowersoft' },
    href: { default: '/' },
    ...logoProps,
    description: { default: 'The build system for teams who read the disassembly. Native toolchains, shared caches and nothing between your code and the machine.' },
    signup: { default: 'Stay in the loop' },
    pitch: { default: 'Release notes, compiler deep dives and the occasional benchmark.' },
    note: { default: 'No spam. Unsubscribe anytime.' },
    wordmark: {},
    columns: { type: Object, default: DEMO_COLUMNS },
    socials: { type: Object, default: DEMO_SOCIALS },
    legal: { type: Object, default: DEMO_LEGAL },
    copyright: {},
  };

  #columns = 1;
  #rows = 7;
  #target = 0;
  #lean = 0;
  #frame = 0;
  #last = 0;

  render() {
    return `<footer class="container"><div class="top"><div class="intro"><div class="brand-slot"></div><p class="description"></p>
<section class="signup" aria-labelledby="signup-title"><h2 class="signup-title" id="signup-title"></h2><p class="pitch"></p><form class="form" novalidate><lw-text-input class="email" type="email" name="email" autocomplete="email" placeholder="you@company.com" label="Email" floating="border"></lw-text-input><lw-button class="subscribe" type="submit">Subscribe</lw-button></form><p class="note"></p></section></div>
<div class="columns"></div></div>
<div class="strip"><div class="owner"><p class="copyright"></p><ul class="socials" aria-label="Social"></ul></div><nav class="legal" aria-label="Legal"></nav></div>
<div class="wordmark" part="wordmark" aria-hidden="true"><svg class="pixels" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="light" gradientUnits="userSpaceOnUse"><stop class="bright" offset="0"/><stop class="dim" offset="1"/></linearGradient></defs><path class="outline"/><g class="cells"></g></svg></div></footer>`;
  }

  connected() {
    const options = { signal: this.signal };
    wireSignup(this.query('.form'), {
      input: this.query('.email'),
      button: this.query('.subscribe'),
      send: (email) => this.subscribe?.(email),
      done: (email) => {
        this.query('.form').replaceWith(Object.assign(document.createElement('p'), { className: 'done', innerHTML: `${strokeIcon(check, 16)}<span>Subscribed as <b></b>.</span>` }));
        this.query('.done b').textContent = email;
        this.emit('subscribe', { email });
      },
    }, this.signal);
    const wordmark = this.query('.wordmark');
    wordmark.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const box = wordmark.getBoundingClientRect();
      this.#target = ((event.clientX - box.left) / box.width) * this.#columns;
      wordmark.toggleAttribute('data-lit', true);
      this.#lean ||= this.#target;
      this.#run();
    }, options);
    wordmark.addEventListener('pointerleave', () => wordmark.toggleAttribute('data-lit', false), options);
    // Cleared too, so the loop can start again on reconnecting.
    this.signal.addEventListener('abort', () => {
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
  }

  updated(changed) {
    if (['brand', 'href', 'logo', 'logoDark'].some((name) => changed.has(name))) this.query('.brand-slot').innerHTML = brandMarkup(this.brand, this.href || '/', this);
    const description = this.query('.description');
    description.textContent = this.description ?? '';
    description.hidden = !this.description;
    this.query('.signup').hidden = !this.signup;
    this.query('.signup-title').textContent = this.signup ?? '';
    this.query('.pitch').textContent = this.pitch ?? '';
    this.query('.note').textContent = this.note ?? '';
    if (changed.has('columns')) this.query('.columns').innerHTML = linkColumns(Array.isArray(this.columns) ? this.columns : []);
    if (changed.has('socials')) this.query('.socials').innerHTML = socialLinks(this.socials);
    if (changed.has('legal')) this.query('.legal').innerHTML = (Array.isArray(this.legal) ? this.legal : []).map(footerLink).join('');
    this.query('.copyright').innerHTML = escapeHtml(this.copyright ?? `© ${new Date().getFullYear()} ${this.brand ?? ''}, Inc. All rights reserved.`);
    if (changed.has('wordmark') || changed.has('brand')) this.#paintWord();
  }

  // The word on the font's grid: an outline round the filled cells, then
  // the cells themselves, all in cell units so it scales to any width.
  #paintWord() {
    const { cells, columns, rows } = layout(this.wordmark || this.brand || '');
    this.#columns = columns;
    this.#rows = rows;
    const filled = new Set(cells.map(([x, y]) => `${x},${y}`));
    const empty = (x, y) => !filled.has(`${x},${y}`);
    const edges = [];
    for (const [x, y] of cells) {
      if (empty(x, y - 1)) edges.push(`M${x} ${y}h1`);
      if (empty(x, y + 1)) edges.push(`M${x} ${y + 1}h1`);
      if (empty(x - 1, y)) edges.push(`M${x} ${y}v1`);
      if (empty(x + 1, y)) edges.push(`M${x + 1} ${y}v1`);
    }
    const svg = this.query('.pixels');
    svg.setAttribute('viewBox', `-0.5 -0.5 ${columns + 1} ${rows + 1}`);
    this.query('.outline').setAttribute('d', edges.join(''));
    // A hair over a cell each, so neighbours meet without seams.
    this.query('.cells').innerHTML = cells.map(([x, y]) => `<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`).join('');
    this.#lean = this.#target = columns / 2;
    this.#paintLight();
  }

  #run() {
    if (reducedMotion.matches) {
      this.#lean = this.#target;
      this.#paintLight();
      return;
    }
    if (this.#frame) return;
    this.#last = performance.now();
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  #tick(now) {
    this.#frame = 0;
    const dt = Math.min(0.05, (now - this.#last) / 1000);
    this.#last = now;
    this.#lean += (this.#target - this.#lean) * (1 - Math.exp(-FOLLOW * dt));
    this.#paintLight();
    if (Math.abs(this.#target - this.#lean) > 0.01) this.#run();
  }

  // The light falls from above the mouse and fades towards the far lower
  // corner, so the cells seem lit from where it is.
  #paintLight() {
    const gradient = this.query('#light');
    const rows = this.#rows;
    gradient.setAttribute('x1', String(this.#lean));
    gradient.setAttribute('y1', String(-rows * 0.25));
    gradient.setAttribute('x2', String(this.#columns - this.#lean));
    gradient.setAttribute('y2', String(rows * 1.3));
  }
}
