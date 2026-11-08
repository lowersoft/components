import '../button/index.js';
import { escapeHtml } from '../../core/dom.js';
import { heroPillActions, paintPillActions } from '../../core/hero.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronRight, play } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './eclipse-hero.scss?inline';

const PLAY = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">${play}</svg>`;

// Where the moon sits on the sun, as fractions of the sun's diameter. The
// moon is drawn a little larger, so it hides the sun whole until it is more
// than EDGE off centre; past that a crescent shows, brightest at its middle.
const EDGE = 0.006;
// At rest a sliver of sun shows at the upper right: the diamond ring.
const REST = { x: -0.0078, y: 0.0078 };
// The first view starts earlier in the eclipse, on a thick crescent.
const START = { x: -0.05, y: 0.05 };
// How far the pointer draws the light towards itself.
const REACH = 0.01;
// How much crescent makes the bead shine at full strength.
const FULL = 0.006;
// How long the moon takes to slide into place on the first view.
const ARRIVAL_MS = 3200;

const clamp = (value) => Math.min(Math.max(value, -1), 1);

/**
 * A hero framed by a total eclipse. The copy sits on the moon, and the sun's
 * corona glows around it, its streamers turning slowly. On the first view the
 * moon slides into place until only a sliver of sun shows at the upper right,
 * a bright bead on the rim: the diamond ring. Move the pointer over the hero
 * and the light follows it round the rim.
 *
 * It follows the theme: on a dark page the sun is white light in a starry
 * sky; on a light one the eclipse is printed in ink on paper. On narrow
 * screens the eclipse sits above the copy instead of behind it. With reduced
 * motion the eclipse is still and the pointer leaves it be.
 *
 * Above the headline sits a pill with a short tag and an announcement, a
 * link when given one; a sentence, two actions, the second with a play icon
 * for a tour, and a short note follow.
 *
 * @attr {string} tag - The announcement's short tag, such as "New"
 * @attr {string} announcement - The line in the pill; no pill when empty
 * @attr {string} announcement-href - Where the pill links, such as the changelog; plain text without it
 * @attr {string} heading - The headline; a line break starts a new line
 * @attr {string} description
 * @attr {string} primary - The main action's label
 * @attr {string} secondary - The tour's label; none when empty
 * @attr {string} note - A short line under the actions; none when empty
 * @slot actions - Your own actions, such as links, instead of the two buttons
 * @csspart eclipse - The sun, its corona and the moon
 * @cssprop --lw-eclipse-hero-glow - The colour of the corona; grey by default, lighter on a dark page
 * @cssprop --lw-eclipse-hero-min-height - How tall the section is at least on wide screens; 52rem by default
 */
export class LwEclipseHero extends LwElement {
  static styles = styles;
  static props = {
    tag: { default: 'New' },
    announcement: { default: 'Incremental linking for C++ modules' },
    announcementHref: {},
    heading: { default: 'Builds that finish\nbefore you look up.' },
    description: { default: 'lower shares every object file across your team, links only what changed and runs the tests on every core, so a full rebuild takes seconds instead of a coffee break.' },
    primary: { default: 'Start building' },
    secondary: { default: 'Watch the tour' },
    note: { default: 'Free for open source · macOS, Linux and Windows' },
  };

  // Whether the moon has made its first entrance.
  #arrived = false;
  #frame = 0;

  render() {
    return `<section class="hero" aria-labelledby="heading"><div class="sky" aria-hidden="true"></div>
<div class="stage" part="eclipse" aria-hidden="true"><div class="corona"><div class="streamers"></div><div class="streamers counter"></div><div class="rays"></div></div><div class="halo"></div><div class="sun"></div><div class="moon"></div><div class="bead"></div></div>
<div class="content"><a class="badge"><span class="tag"></span><span class="announcement"></span>${strokeIcon(chevronRight, 14)}</a><h1 class="title" id="heading"></h1><p class="description"></p>
<div class="actions">${heroPillActions(PLAY)}</div><p class="note"></p></div></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    if (!this.#arrived) this.#place(reducedMotion.matches ? REST : START);
    watchVisibility(this, (visible) => {
      this.toggleAttribute('data-paused', !visible);
      if (visible) this.#arrive();
    }, this.signal);
    this.addEventListener('pointermove', (event) => this.#follow(event), options);
    this.addEventListener('pointerleave', () => this.#arrived && this.#place(REST), options);
    this.signal.addEventListener('abort', () => cancelAnimationFrame(this.#frame));
  }

  updated(changed) {
    this.query('.tag').textContent = this.tag ?? '';
    this.query('.tag').hidden = !this.tag;
    this.query('.announcement').textContent = this.announcement ?? '';
    const badge = this.query('.badge');
    badge.hidden = !this.announcement;
    if (this.announcementHref) badge.setAttribute('href', this.announcementHref);
    else badge.removeAttribute('href');
    if (changed.has('heading')) {
      const lines = String(this.heading ?? '').split('\n').filter((line) => line.trim());
      this.query('.title').innerHTML = lines.map((line) => `<span class="line">${escapeHtml(line)}</span>`).join(' ');
    }
    this.query('.description').textContent = this.description ?? '';
    paintPillActions(this);
    this.query('.note').textContent = this.note ?? '';
    this.query('.note').hidden = !this.note;
  }

  // The first time the hero is seen, the moon slides into place, slowly.
  #arrive() {
    if (this.#arrived) return;
    this.#arrived = true;
    if (reducedMotion.matches) {
      this.#place(REST);
      return;
    }
    this.toggleAttribute('data-arriving', true);
    // Two frames, so the start is drawn before the slide begins.
    requestAnimationFrame(() => requestAnimationFrame(() => this.#place(REST)));
    setTimeout(() => this.removeAttribute('data-arriving'), ARRIVAL_MS);
  }

  // The moon moves away from the pointer, so the light shows on its side.
  #follow(event) {
    if (event.pointerType !== 'mouse' || !this.#arrived || reducedMotion.matches || this.hasAttribute('data-arriving')) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(this.#frame);
    this.#frame = requestAnimationFrame(() => {
      const box = this.query('.stage').getBoundingClientRect();
      const x = clamp((clientX - box.left - box.width / 2) / (box.width / 2));
      const y = clamp((clientY - box.top - box.height / 2) / (box.height / 2));
      this.#place({ x: REST.x - x * REACH, y: REST.y - y * REACH });
    });
  }

  // Sets the moon's offset, and puts the bead where the crescent is widest,
  // as bright as the crescent is wide.
  #place({ x, y }) {
    const off = Math.hypot(x, y);
    const style = this.query('.stage').style;
    style.setProperty('--_moon-x', x.toFixed(4));
    style.setProperty('--_moon-y', y.toFixed(4));
    style.setProperty('--_bead-angle', `${((Math.atan2(-x, y) * 180) / Math.PI).toFixed(1)}deg`);
    style.setProperty('--_bead', Math.min(Math.max((off - EDGE) / FULL, 0), 1).toFixed(3));
  }
}
