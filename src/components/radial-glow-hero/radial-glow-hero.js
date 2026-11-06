import '../button/index.js';
import '../infinite-marquee/index.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './radial-glow-hero.scss?inline';

// Marks for the demo's made-up companies, drawn in the current colour; the
// cut-outs are holes, so the page shows through them on any background.
const MARKS = {
  disc: '<path fill-rule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-1.25 2h2.5v14h-2.5z"/>',
  peak: '<path fill-rule="evenodd" d="M2 20 12 4l10 16H2Zm6 0 4-7 4 7H8Z"/>',
  ring: '<path fill-rule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"/><circle cx="12" cy="12" r="2.5"/>',
  diamond: '<rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)"/>',
  leaf: '<path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Z"/>',
  orbit: '<circle cx="8.5" cy="12" r="5.5"/><circle cx="16.5" cy="12" r="4.75" fill="none" stroke="currentColor" stroke-width="2.25"/>',
  bars: '<rect x="3" y="4" width="18" height="4" rx="2"/><rect x="3" y="10" width="12" height="4" rx="2"/><rect x="3" y="16" width="7" height="4" rx="2"/>',
  pillar: '<rect x="4" y="3" width="5" height="18" rx="1.5"/><rect x="11" y="8" width="5" height="13" rx="1.5"/><rect x="18" y="13" width="3" height="8" rx="1.5"/>',
  wave: '<path d="M2 15c3-4 6-4 10 0s7 4 10 0v5H2Z"/><path d="M2 8c3-4 6-4 10 0s7 4 10 0" fill="none" stroke="currentColor" stroke-width="2.5"/>',
  spark: '<path d="M12 2c.6 4.8 2.2 6.4 7 7-4.8.6-6.4 2.2-7 7-.6-4.8-2.2-6.4-7-7 4.8-.6 6.4-2.2 7-7Z"/><circle cx="18.5" cy="18.5" r="2.5"/>',
};

const DEMO_LOGOS = [
  { name: 'Stackframe', mark: 'bars' },
  { name: 'Pagefault', mark: 'disc' },
  { name: 'Opcode Labs', mark: 'diamond' },
  { name: 'Heapwise', mark: 'pillar' },
  { name: 'Microcode', mark: 'ring' },
  { name: 'Bitforge', mark: 'peak' },
  { name: 'Interrupt', mark: 'spark' },
  { name: 'Syscall', mark: 'orbit' },
  { name: 'Bytewise', mark: 'wave' },
  { name: 'Registerline', mark: 'leaf' },
];

// Phones show this many logos in a still, wrapped row instead of the strip.
const STILL = 5;

/**
 * A centred landing hero over a radial glow: an ellipse hung from the top
 * centre stays clear behind the copy and brightens towards the foot and
 * sides of the section, under a faint dot grid. A two line headline, its
 * last line set apart, one sentence, two actions and a row of customer
 * logos that slides by beneath them and coasts to a stop under the pointer;
 * on a phone the first five logos sit still in a wrapped row. Everything
 * rises in, one after another, the first time it comes into view.
 *
 * The glow is CSS gradients only, neutral by default so it follows the
 * theme; give it a brand colour with `--lw-radial-glow-hero-glow`, and the
 * headline's last line with `--lw-radial-glow-hero-accent`, and the logo row,
 * which sits on the glow's brightest part, with `--lw-radial-glow-hero-on-glow`.
 *
 * Logos are `{ name, mark?, src? }`: `src` an image's URL, named by `name`,
 * or else `mark`, one of disc, peak, ring, diamond, leaf, orbit, bars,
 * pillar, wave or spark, drawn beside the name. An empty list hides the row.
 *
 * @attr {string} heading - The headline; a line break starts its last line
 * @attr {string} description
 * @attr {string} primary - The main action's label
 * @attr {string} secondary - The second action's label; none when empty
 * @attr {string} trusted - The line over the logos
 * @attr {Array<object>} logos (JSON)
 * @slot actions - Your own actions, such as links, instead of the two buttons
 * @csspart glow - The glow and the dot grid behind everything
 * @csspart logos - The row of logos
 * @cssprop --lw-radial-glow-hero-glow - The glow's colour; a tint of the text colour by default
 * @cssprop --lw-radial-glow-hero-accent - The headline's last line, any colour or gradient
 * @cssprop --lw-radial-glow-hero-on-glow - The logo row's ink, such as white on a strong glow; the text colour by default
 * @cssprop --lw-radial-glow-hero-min-height - How tall the section is at least; 48rem by default
 */
export class LwRadialGlowHero extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Write it in C.\nShip it everywhere.' },
    description: { default: 'lower cross-compiles C, C++ and Rust for every target from one machine, shares each object file across the team and links in milliseconds. No toolchains to install and no build scripts to babysit.' },
    primary: { default: 'Start building free' },
    secondary: { default: 'See how it works' },
    trusted: { default: 'Trusted by systems teams at' },
    logos: { type: Object, default: DEMO_LOGOS },
  };

  render() {
    return `<section class="hero" aria-labelledby="heading"><div class="glow" part="glow" aria-hidden="true"></div>
<div class="content"><h1 class="title rise" id="heading"></h1><p class="description rise"></p>
<div class="actions rise"><slot name="actions"><lw-button class="primary" size="lg"><span class="primary-label"></span><span class="arrow" slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button><lw-button class="secondary" size="lg" variant="outline"></lw-button></slot></div>
<div class="trust rise" part="logos"><p class="trusted" id="trusted"></p><lw-infinite-marquee class="strip" speed="36" pause-on-hover gap="3rem" fade-size="6rem"></lw-infinite-marquee><ul class="still" aria-labelledby="trusted"></ul></div></div></section>`;
  }

  connected() {
    // Rises in the first time it is seen, not while it waits off screen.
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      this.toggleAttribute('data-shown', true);
      observer.disconnect();
    });
    observer.observe(this);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    if (changed.has('heading')) this.#paintHeading();
    this.query('.description').textContent = this.description ?? '';
    this.query('.primary-label').textContent = this.primary ?? '';
    const secondary = this.query('.secondary');
    secondary.textContent = this.secondary ?? '';
    secondary.hidden = !this.secondary;
    this.query('.trusted').textContent = this.trusted ?? '';
    this.query('.strip').label = this.trusted || 'Customers';
    if (changed.has('logos')) this.#paintLogos();
  }

  // Each line its own block, the last set apart; a space between them so
  // the heading still reads as one sentence.
  #paintHeading() {
    const lines = String(this.heading ?? '').split('\n').filter((line) => line.trim());
    this.query('.title').innerHTML = lines
      .map((line, i) => `<span class="line${i === lines.length - 1 && lines.length > 1 ? ' accent' : ''}">${escapeHtml(line)}</span>`)
      .join(' ');
  }

  #paintLogos() {
    const logos = Array.isArray(this.logos) ? this.logos : [];
    const logo = ({ name = '', mark, src }) => {
      if (src) return `<img class="logo-image" src="${escapeHtml(src)}" alt="${escapeHtml(name)}" loading="lazy" decoding="async">`;
      const drawn = MARKS[mark] ? `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${MARKS[mark]}</svg>` : '';
      return `${drawn}<span>${escapeHtml(name)}</span>`;
    };
    this.query('.strip').innerHTML = logos.map((item) => `<span class="logo">${logo(item)}</span>`).join('');
    this.query('.still').innerHTML = logos.slice(0, STILL).map((item) => `<li class="logo">${logo(item)}</li>`).join('');
    this.query('.trust').hidden = !logos.length;
  }
}
