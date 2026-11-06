import '../button/index.js';
import '../infinite-marquee/index.js';
import { escapeHtml } from '../../core/dom.js';
import { heroPillActions, paintPillActions } from '../../core/hero.js';
import { logoMarkup } from '../../core/logos.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './radial-glow-hero.scss?inline';

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
<div class="actions rise">${heroPillActions()}</div>
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
    paintPillActions(this);
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
    this.query('.strip').innerHTML = logos.map((item) => `<span class="logo">${logoMarkup(item)}</span>`).join('');
    this.query('.still').innerHTML = logos.slice(0, STILL).map((item) => `<li class="logo">${logoMarkup(item)}</li>`).join('');
    this.query('.trust').hidden = !logos.length;
  }
}
