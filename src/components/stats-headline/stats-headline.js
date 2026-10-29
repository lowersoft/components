import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import { drawFace } from '../../core/testimonial.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './stats-headline.scss?inline';

// Each figure counts up from zero over this long once in view.
const COUNT_MS = 1200;

const DEMO_STATS = [
  { value: 10, suffix: 'k+', label: 'Active developers' },
  { value: 150, suffix: '+', label: 'Countries' },
  { value: 99.9, suffix: '%', decimals: 1, label: 'Build success rate' },
];

const DEMO_FACES = ['Maya Okafor', 'Theo Laurent', 'Iris Novak', 'Ravi Shah'];

/**
 * A centred headline with the numbers that back it: a strip of figures
 * that count up when it comes into view, people who already use it, and
 * where the numbers come from.
 *
 * Stats are `{ value, label, prefix?, suffix?, decimals? }`.
 *
 * @attr {string} heading - A line break starts a second line
 * @attr {string} description
 * @attr {string} proof - Beside the faces
 * @attr {string} source - Where the numbers come from
 * @attr {Array<object>} stats (JSON)
 * @attr {Array<string>} faces (JSON)
 */
export class LwStatsHeadline extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    heading: { default: 'Write it close to the metal.\nShip it everywhere.' },
    description: { default: 'Components, blocks and runtimes that drop into your app and load before anyone notices.' },
    proof: { default: 'Join 100,000+ developers worldwide' },
    source: { default: 'Last 30 days, from product analytics. Updated monthly.' },
    stats: { type: Object, default: DEMO_STATS },
    faces: { type: Object, default: DEMO_FACES },
  };

  #counted = false;

  render() {
    return `<header class="intro"><h2 class="title"></h2><p class="description"></p></header>
<section class="panel"><p class="proof"><span class="faces"></span><span class="proof-text"></span></p><dl class="stats"></dl><p class="source"></p></section>`;
  }

  connected() {
    watchVisibility(this, (visible) => visible && this.#count(), this.signal);
  }

  updated(changed) {
    const lines = (this.heading ?? '').split('\n');
    this.query('.title').innerHTML = lines.map((line) => `<span class="line">${escapeHtml(line)}</span>`).join('');
    this.query('.description').textContent = this.description ?? '';
    this.query('.proof-text').textContent = this.proof ?? '';
    this.query('.source').textContent = this.source ?? '';
    if (changed.has('faces')) {
      const faces = this.query('.faces');
      faces.replaceChildren();
      for (const name of this.faces ?? []) {
        const face = Object.assign(document.createElement('span'), { className: 'face' });
        drawFace(face, name);
        faces.append(face);
      }
    }
    if (changed.has('stats')) {
      this.query('.stats').innerHTML = (this.stats ?? [])
        .map((stat) => `<div class="stat"><dt class="label">${escapeHtml(stat.label)}</dt><dd class="figure"><span class="visually-hidden">${escapeHtml(this.#format(stat, stat.value))}</span><span class="rolling" aria-hidden="true"></span></dd></div>`)
        .join('');
      this.#paint(this.#counted || reducedMotion.matches ? 1 : 0);
    }
  }

  #format(stat, value) {
    return `${stat.prefix ?? ''}${value.toFixed(stat.decimals ?? 0)}${stat.suffix ?? ''}`;
  }

  // Every figure at `progress` of its way up.
  #paint(progress) {
    this.shadowRoot.querySelectorAll('.stat').forEach((element, i) => {
      const stat = this.stats[i];
      roll(element.querySelector('.rolling'), this.#format(stat, stat.value * progress));
    });
  }

  // Counts up once, easing out, the first time the strip is seen.
  #count() {
    if (this.#counted) return;
    this.#counted = true;
    if (reducedMotion.matches) return this.#paint(1);
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      this.#paint(1 - (1 - t) ** 3);
      if (t < 1 && !this.signal.aborted) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
