import '../button/index.js';
import { LOWERSOFT } from '../../core/brand.js';
import { escapeHtml } from '../../core/dom.js';
import { heroPillActions, paintPillActions } from '../../core/hero.js';
import { logoMarkup } from '../../core/logos.js';
import { play } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './eclipse-hero.scss?inline';

const DEMO_LOGOS = [
  { name: 'Cacheline', mark: 'bars' },
  { name: 'Branchless', mark: 'peak' },
  { name: 'Kernelspace', mark: 'ring' },
  { name: 'Hotpath', mark: 'spark' },
  { name: 'Zerocopy', mark: 'disc' },
  { name: 'Lockfree', mark: 'orbit' },
];

const SPARK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.6 4.8 2.2 6.4 7 7-4.8.6-6.4 2.2-7 7-.6-4.8-2.2-6.4-7-7 4.8-.6 6.4-2.2 7-7Z"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';

const PLAY = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">${play}</svg>`;

/**
 * A dark hero framed by an eclipse: the limb of a dark planet arcs from the
 * top left down to the right, its rim lit and its light spilling into the
 * sky beyond, so the eye lands in the middle, where the copy is. A scrim
 * deepens the dark behind the words. Above them sit the brand and a pill
 * with a short tag and an announcement; an uppercase two line headline, a
 * sentence and two actions follow, the second with a play icon for a tour,
 * and a row of customer logos closes the section.
 *
 * Drawn for a dark surface in either theme, all in CSS, with nothing
 * moving but the colours on hover. The light is silver by default; give it
 * a colour with `--lw-eclipse-hero-glow`.
 *
 * Logos are `{ name, mark?, src? }`: `src` an image's URL, named by `name`,
 * or else `mark`, one of disc, peak, ring, diamond, leaf, orbit, bars,
 * pillar, wave or spark, drawn beside the name. An empty list hides the row.
 *
 * @attr {string} brand - The name above the announcement; none when empty
 * @attr {string} logo - The brand's logo, drawn for a dark surface; Lowersoft's in white by default, and a spark beside the name when empty
 * @attr {string} tag - The announcement's short tag, such as "New"
 * @attr {string} announcement - The line in the pill; no pill when empty
 * @attr {string} heading - The headline, set in capitals; a line break starts a new line
 * @attr {string} description
 * @attr {string} primary - The main action's label
 * @attr {string} secondary - The tour's label; none when empty
 * @attr {string} trusted - The line over the logos
 * @attr {Array<object>} logos (JSON)
 * @slot actions - Your own actions, such as links, instead of the two buttons
 * @csspart eclipse - The planet, its lit rim and the glow around it
 * @csspart logos - The row of logos
 * @cssprop --lw-eclipse-hero-glow - The colour of the light around the planet; silver by default
 * @cssprop --lw-eclipse-hero-min-height - How tall the section is at least; 48rem by default
 */
export class LwEclipseHero extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lowersoft' },
    logo: { default: LOWERSOFT.lockup.dark },
    tag: { default: 'New' },
    announcement: { default: 'Incremental linking for C++ modules' },
    heading: { default: 'Builds that finish\nbefore you look up.' },
    description: { default: 'lower shares every object file across your team, links only what changed and runs the tests on every core, so a full rebuild of a million-line codebase takes seconds instead of a coffee break.' },
    primary: { default: 'Start building' },
    secondary: { default: 'Watch the tour' },
    trusted: { default: 'Compiling the hot path at teams inside' },
    logos: { type: Object, default: DEMO_LOGOS },
  };

  render() {
    return `<section class="hero" aria-labelledby="heading"><div class="eclipse" part="eclipse" aria-hidden="true"><div class="planet"></div></div><div class="scrim" aria-hidden="true"></div>
<div class="content"><p class="brand"></p>
<p class="badge"><span class="tag"></span><span class="announcement"></span></p><h1 class="title" id="heading"></h1><p class="description"></p>
<div class="actions">${heroPillActions(PLAY)}</div></div>
<div class="trust" part="logos"><p class="trusted" id="trusted"></p><ul class="logos" aria-labelledby="trusted"></ul></div></section>`;
  }

  updated(changed) {
    const brand = this.query('.brand');
    brand.innerHTML = this.logo ? `<img class="brand-logo" src="${escapeHtml(this.logo)}" alt="${escapeHtml(this.brand ?? '')}" decoding="async">` : `${SPARK}<span>${escapeHtml(this.brand ?? '')}</span>`;
    brand.hidden = !this.brand && !this.logo;
    this.query('.tag').textContent = this.tag ?? '';
    this.query('.tag').hidden = !this.tag;
    this.query('.announcement').textContent = this.announcement ?? '';
    this.query('.badge').hidden = !this.announcement;
    if (changed.has('heading')) {
      const lines = String(this.heading ?? '').split('\n').filter((line) => line.trim());
      this.query('.title').innerHTML = lines.map((line) => `<span class="line">${escapeHtml(line)}</span>`).join(' ');
    }
    this.query('.description').textContent = this.description ?? '';
    paintPillActions(this);
    this.query('.trusted').textContent = this.trusted ?? '';
    if (changed.has('logos')) {
      const logos = Array.isArray(this.logos) ? this.logos : [];
      this.query('.logos').innerHTML = logos.map((item) => `<li class="logo">${logoMarkup(item)}</li>`).join('');
      this.query('.trust').hidden = !logos.length;
    }
  }
}
