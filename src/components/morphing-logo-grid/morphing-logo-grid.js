import { cycleWaves, turnFace } from '../../core/cycle.js';
import { logoMarkup } from '../../core/logos.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './morphing-logo-grid.scss?inline';

const DEMO_LOGOS = [
  { name: 'Cacheline', mark: 'bars' },
  { name: 'Branchless', mark: 'peak' },
  { name: 'Kernelspace', mark: 'ring' },
  { name: 'Hotpath', mark: 'spark' },
  { name: 'Zerocopy', mark: 'disc' },
  { name: 'Lockfree', mark: 'orbit' },
  { name: 'Fieldnote', mark: 'leaf' },
  { name: 'Halcyon', mark: 'wave' },
  { name: 'Parcel', mark: 'diamond' },
  { name: 'Tandem', mark: 'pillar' },
  { name: 'Arcadia', mark: 'ring' },
  { name: 'Mosaic', mark: 'bars' },
  { name: 'Lumen', mark: 'spark' },
  { name: 'Stackline', mark: 'leaf' },
  { name: 'Bitforge', mark: 'diamond' },
  { name: 'Northwind', mark: 'wave' },
];

// Half the grid turns at a time, in a checkerboard of four columns, a wave
// every INTERVAL; the cells of a wave start a little apart.
const INTERVAL = 2600;
const STAGGER = 80;
const COLUMNS = 4;

const EXIT = { opacity: [1, 0], translate: ['0 0', '0 -40%'], filter: ['blur(0)', 'blur(6px)'] };
const ENTER = { opacity: [0, 1], translate: ['0 40%', '0 0'], filter: ['blur(6px)', 'blur(0)'] };

/**
 * A grid of customer logos where every cell takes turns between a few. Half
 * the grid changes at a time, in a checkerboard: the logo showing lifts away
 * and blurs as the next rises into its place, sharpening. Pointing at a cell
 * holds it. The grid rests while it is off screen, and with reduced motion
 * every cell keeps its first logo.
 *
 * Logos are `{ name, mark?, src? }`: `src` an image's URL, named by `name`,
 * or else `mark`, one of disc, peak, ring, diamond, leaf, orbit, bars,
 * pillar, wave or spark, drawn beside the name. They are dealt round the
 * cells, so with 16 logos and 8 cells each cell takes turns between two and
 * no logo shows twice.
 *
 * @attr {string} heading
 * @attr {string} description - A line under the heading; none when empty
 * @attr {Array<object>} logos (JSON)
 * @attr {number} cells - How many cells; four columns on wide screens, two on narrow ones
 * @csspart grid - The grid of cells
 * @csspart cell - Each cell
 */
export class LwMorphingLogoGrid extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Trusted by teams that ship close to the metal' },
    description: { default: 'From two-person studios to platform teams of hundreds, they build, test and release with lower.' },
    logos: { type: Object, default: DEMO_LOGOS },
    cells: { type: Number, default: 8 },
  };

  render() {
    return '<section class="section" aria-labelledby="heading"><header class="head"><h2 class="title" id="heading"></h2><p class="description"></p></header><ul class="grid" part="grid" aria-labelledby="heading"></ul></section>';
  }

  connected() {
    cycleWaves(this, {
      waves: this.#waves,
      interval: INTERVAL,
      turn: (index, order) => {
        const slot = this.shadowRoot.querySelectorAll('.slot')[index];
        if (slot) turnFace(slot, { exit: EXIT, enter: ENTER, duration: 550, delay: order * STAGGER });
      },
      held: (index) => Boolean(this.shadowRoot.querySelectorAll('.cell')[index]?.matches(':hover')),
    }, this.signal);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.description').hidden = !this.description;
    if (changed.has('logos') || changed.has('cells')) this.#build();
  }

  get #count() {
    return Math.max(1, Math.round(this.cells) || 8);
  }

  // The two halves of a checkerboard over the cells.
  get #waves() {
    const all = Array.from({ length: this.#count }, (_, index) => index);
    const square = (index) => (Math.floor(index / COLUMNS) + index) % 2;
    return [all.filter((index) => square(index) === 0), all.filter((index) => square(index) === 1)];
  }

  // Deals the logos round the cells; each cell stacks its own.
  #build() {
    const logos = Array.isArray(this.logos) ? this.logos : [];
    const count = this.#count;
    this.query('.grid').innerHTML = Array.from({ length: count }, (_, index) => {
      const pool = logos.filter((_, at) => at % count === index);
      const faces = pool.map((logo, at) => `<span class="logo"${at ? ' aria-hidden="true"' : ' data-active'}>${logoMarkup(logo)}</span>`).join('');
      return `<li class="cell" part="cell"><span class="slot">${faces}</span></li>`;
    }).join('');
  }
}
