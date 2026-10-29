import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './kinetic-type-hero.scss?inline';

// How far the cursor reaches into the type (px), and how far a letter
// leans away at most (px of shift, degrees of skew).
const REACH = 260;
const SHIFT = 18;
const SKEW = 10;
// Letters ease towards their lean at this rate (per second).
const FOLLOW = 10;
const SET_IN_MS = 900;
const STAGGER_MS = 28;

/**
 * A hero that is all type: an edge-to-edge headline sets itself in, letter
 * by letter, then leans away from the cursor as it passes, with a short
 * description tucked into its top right.
 *
 * The headline fills the width, its last line widest; end it with a `.`
 * and the full stop is drawn as the accent square.
 *
 * @attr {string} heading - The headline; a line break starts a new line
 * @attr {string} description
 */
export class LwKineticTypeHero extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Make it\nunmistakable.' },
    description: { default: 'lower is written close to the metal: hand-tuned C with SIMD where it counts, no runtime and no garbage collector. One 1.4 MB binary that starts in under 10 ms and never asks the machine for more than it needs.' },
  };

  #letters = [];
  // Each letter's lean now: [shift, skew].
  #lean = [];
  #pointer = null;
  #frame = 0;
  #last = 0;
  #visible = false;
  #setIn = false;

  render() {
    return `<div class="container"><div class="stack"><p class="description"></p><h1 class="title"></h1></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const fit = new ResizeObserver(() => this.#fit());
    fit.observe(this.query('.stack'));
    this.signal.addEventListener('abort', () => {
      fit.disconnect();
      cancelAnimationFrame(this.#frame);
    });
    watchVisibility(this, (visible) => {
      this.#visible = visible;
      if (visible) this.#setInOnce();
    }, this.signal);
    this.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' || reducedMotion.matches) return;
      this.#pointer = { x: event.clientX, y: event.clientY };
      this.#start();
    }, options);
    this.addEventListener('pointerleave', () => {
      this.#pointer = null;
      this.#start();
    }, options);
  }

  updated(changed) {
    this.query('.description').textContent = this.description ?? '';
    if (changed.has('heading')) this.#buildHeading();
  }

  // Each letter is its own span so it can lean; the heading reads whole.
  #buildHeading() {
    const title = this.query('.title');
    const text = this.heading ?? '';
    title.ariaLabel = text.replace(/\n/g, ' ');
    title.innerHTML = text
      .split('\n')
      .map((line) => {
        const stop = line.endsWith('.');
        const letters = [...(stop ? line.slice(0, -1) : line)].map((char) => (char === ' ' ? '<span class="space"> </span>' : `<span class="letter">${escapeHtml(char)}</span>`)).join('');
        return `<span class="line" aria-hidden="true"><span class="set">${letters}${stop ? '<span class="letter stop"></span>' : ''}</span></span>`;
      })
      .join('');
    this.#letters = [...title.querySelectorAll('.letter')];
    this.#lean = this.#letters.map(() => [0, 0]);
    this.#setIn = false;
    this.#fit();
    if (this.#visible) this.#setInOnce();
  }

  // The widest line fills the width: the font size scales to fit it.
  #fit() {
    const title = this.query('.title');
    const width = this.query('.stack').clientWidth;
    if (!width) return;
    title.style.fontSize = '100px';
    const widest = Math.max(...[...title.querySelectorAll('.set')].map((set) => set.scrollWidth));
    if (widest) title.style.fontSize = `${(100 * width) / widest}px`;
  }

  // The letters rise into place, one after another, the first time it shows.
  #setInOnce() {
    if (this.#setIn) return;
    this.#setIn = true;
    if (reducedMotion.matches) return;
    this.#letters.forEach((letter, i) => {
      letter.animate([{ translate: '0 105%' }, { translate: '0 0' }], { duration: SET_IN_MS, delay: i * STAGGER_MS, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' });
    });
  }

  #start() {
    if (this.#frame || !this.#visible) return;
    this.#last = performance.now();
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  // Letters near the cursor lean away from it, nearer ones more; once it
  // leaves, they settle upright.
  #tick(now) {
    this.#frame = 0;
    const dt = Math.min((now - this.#last) / 1000, 0.05);
    this.#last = now;
    const ease = 1 - Math.exp(-FOLLOW * dt);
    let moving = false;
    // Letters are placed by their offsets, which their lean doesn't move.
    const origin = this.query('.title').getBoundingClientRect();
    this.#letters.forEach((letter, i) => {
      let goal = [0, 0];
      if (this.#pointer) {
        const dx = origin.left + letter.offsetLeft + letter.offsetWidth / 2 - this.#pointer.x;
        const dy = origin.top + letter.offsetTop + letter.offsetHeight / 2 - this.#pointer.y;
        const distance = Math.hypot(dx, dy);
        const pull = Math.max(0, 1 - distance / REACH) ** 2;
        const side = Math.sign(dx) || 1;
        goal = [side * pull * SHIFT, -side * pull * SKEW];
      }
      const lean = this.#lean[i];
      lean[0] += (goal[0] - lean[0]) * ease;
      lean[1] += (goal[1] - lean[1]) * ease;
      if (Math.abs(goal[0] - lean[0]) > 0.05 || Math.abs(goal[1] - lean[1]) > 0.05) moving = true;
      letter.style.transform = `translateX(${lean[0].toFixed(2)}px) skewX(${lean[1].toFixed(2)}deg)`;
    });
    if (moving || this.#pointer) this.#frame = requestAnimationFrame((time) => this.#tick(time));
  }
}
