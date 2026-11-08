import { cycleWaves, turnFace } from '../../core/cycle.js';
import { logoMarkup } from '../../core/logos.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './morphing-wordmarks.scss?inline';

const DEMO_WORDMARKS = [
  { name: 'cacheline', style: 'geometric' },
  { name: 'Kernelspace', style: 'serif' },
  { name: 'HOTPATH', style: 'mono' },
  { name: 'Zerocopy', style: 'heavy', mark: 'disc' },
  { name: 'Lockfree', style: 'wide' },
  { name: 'Branchless', style: 'light', mark: 'peak' },
  { name: 'tandem', style: 'heavy' },
  { name: 'Fieldnote', style: 'serif', mark: 'leaf' },
  { name: 'PARCEL', style: 'wide' },
  { name: 'halcyon', style: 'geometric', mark: 'wave' },
];

const STYLES = new Set(['geometric', 'serif', 'mono', 'heavy', 'wide', 'light']);

// The odd places change together, then the even ones, a wave every
// INTERVAL; the places of a wave start a little apart.
const INTERVAL = 2800;
const STAGGER = 90;

const EXIT = { opacity: [1, 0], filter: ['blur(0)', 'blur(8px)'], scale: [1, 0.96] };
const ENTER = { opacity: [0, 1], filter: ['blur(8px)', 'blur(0)'], scale: [1.04, 1] };

/**
 * An open row of company wordmarks that change in place. The first, third
 * and fifth places soften into another name together, then the second and
 * fourth, so twice as many names pass through the row while it stays calm.
 * Each wordmark is set in a type of its own, with or without a drawn mark.
 * The row rests while it is off screen, and with reduced motion every place
 * keeps its first name. On narrow screens the row wraps instead of shrinking.
 *
 * Wordmarks are `{ name, style?, mark? }`: `style` one of geometric, serif,
 * mono, heavy, wide or light, and `mark` one of disc, peak, ring, diamond,
 * leaf, orbit, bars, pillar, wave or spark, drawn before the name. They are
 * dealt round the places, so with 10 wordmarks and 5 places each place takes
 * turns between two and no name shows twice.
 *
 * @attr {string} heading
 * @attr {string} description - A line under the heading; none when empty
 * @attr {Array<object>} wordmarks (JSON)
 * @attr {number} places - How many wordmarks show at once
 * @csspart row - The row of wordmarks
 */
export class LwMorphingWordmarks extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'In use at the studios that ship fastest' },
    description: { default: 'Game, audio and embedded teams who compile, profile and release with lower.' },
    wordmarks: { type: Object, default: DEMO_WORDMARKS },
    places: { type: Number, default: 5 },
  };

  render() {
    return '<section class="section" aria-labelledby="heading"><header class="head"><h2 class="title" id="heading"></h2><p class="description"></p></header><ul class="row" part="row" aria-labelledby="heading"></ul></section>';
  }

  connected() {
    cycleWaves(this, {
      waves: this.#waves,
      interval: INTERVAL,
      turn: (index, order) => {
        const place = this.shadowRoot.querySelectorAll('.place')[index];
        if (place) turnFace(place, { exit: EXIT, enter: ENTER, duration: 600, delay: order * STAGGER });
      },
    }, this.signal);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.description').hidden = !this.description;
    if (changed.has('wordmarks') || changed.has('places')) this.#build();
  }

  get #count() {
    return Math.max(1, Math.round(this.places) || 5);
  }

  // The first, third and fifth places, then the second and fourth.
  get #waves() {
    const all = Array.from({ length: this.#count }, (_, index) => index);
    return [all.filter((index) => index % 2 === 0), all.filter((index) => index % 2 === 1)];
  }

  // Deals the wordmarks round the places; each place stacks its own.
  #build() {
    const wordmarks = Array.isArray(this.wordmarks) ? this.wordmarks : [];
    const count = this.#count;
    this.query('.row').innerHTML = Array.from({ length: count }, (_, index) => {
      const pool = wordmarks.filter((_, at) => at % count === index);
      const faces = pool.map((wordmark, at) => {
        const style = STYLES.has(wordmark.style) ? wordmark.style : 'geometric';
        return `<span class="wordmark" data-style="${style}"${at ? ' aria-hidden="true"' : ' data-active'}>${logoMarkup({ name: wordmark.name, mark: wordmark.mark })}</span>`;
      }).join('');
      return `<li class="place">${faces}</li>`;
    }).join('');
  }
}
