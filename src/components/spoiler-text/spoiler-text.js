import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { watchVisibility } from '../../core/visibility.js';
import { farthestCorner, fitCanvas, makeSpecks, paintSpecks } from './specks.js';
import styles from './spoiler-text.scss?inline';

// The reveal wave crosses the whole spoiler in this long, whatever its size.
const WAVE_MS = 520;

const easeOut = (t) => 1 - (1 - t) ** 3;

/**
 * Inline text hidden under a field of drifting specks, like a spoiler in a
 * chat app. Click it, or focus it and press Enter or Space, and the specks
 * are blown away from where it was touched while the words come into focus.
 * It wraps across lines like the text around it. Remove `revealed` to hide
 * it again. With reduced motion the specks hold still.
 *
 * @attr {boolean} revealed
 * @attr {string} label - What screen readers hear while the text is hidden
 * @fires lw-reveal - Before the text is revealed by the user; cancel it to keep it hidden
 * @slot - The hidden text
 * @csspart text - The text under the specks
 * @csspart specks - The canvas the specks are drawn on
 */
export class LwSpoilerText extends LwElement {
  static styles = styles;
  static props = {
    revealed: { type: Boolean, reflect: true },
    label: { default: 'Hidden text. Activate to reveal.' },
  };

  #internals = this.attachInternals();
  #context = null;
  #specks = [];
  #boxes = [];
  #size = { width: 0, height: 0 };
  #color = 'currentColor';
  #wave = null;
  #frame = 0;
  #last = 0;
  #visible = false;

  render() {
    return '<span class="anchor"><canvas class="specks" part="specks" aria-hidden="true"></canvas></span><span class="text" part="text"><slot></slot></span>';
  }

  connected() {
    const options = { signal: this.signal };
    this.#context ??= this.query('.specks').getContext('2d');
    this.addEventListener('click', (event) => (event.detail === 0 ? this.#reveal() : this.#reveal(event.clientX, event.clientY)), options);
    this.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        this.#reveal();
      },
      options,
    );
    this.query('slot').addEventListener('slotchange', () => this.#layout(), options);
    // The text rewraps when its container changes width: lay the specks out again.
    const resize = new ResizeObserver(() => this.#layout());
    resize.observe(this.parentElement ?? this);
    watchVisibility(
      this,
      (visible) => {
        this.#visible = visible;
        this.#restart();
      },
      this.signal,
    );
    reducedMotion.addEventListener('change', () => this.#restart(), options);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
      this.#wave = null;
    });
  }

  updated(changed) {
    if (changed.has('revealed')) {
      const hidden = !this.revealed;
      this.#internals.role = hidden ? 'button' : null;
      this.#internals.ariaLabel = hidden ? this.label : null;
      this.query('.text').ariaHidden = hidden ? 'true' : null;
      if (hidden) this.tabIndex = 0;
      else this.removeAttribute('tabindex');
      // Hidden again, by the page: forget any wave and cover the text.
      if (hidden) this.#wave = null;
      this.#layout();
    } else if (changed.has('label') && !this.revealed) {
      this.#internals.ariaLabel = this.label;
    }
  }

  get #showSpecks() {
    return !this.revealed || this.#wave !== null;
  }

  #reveal(clientX, clientY) {
    if (this.revealed || !this.emit('reveal')) return;
    const box = this.query('.specks').getBoundingClientRect();
    // A keyboard reveal starts from the start of the first line.
    const first = this.query('.text').getClientRects()[0];
    const x = clientX ?? (first ? first.left + 4 : box.left);
    const y = clientY ?? (first ? first.top + first.height / 2 : box.top);
    if (this.#visible) this.#wave = { x: x - box.left, y: y - box.top, start: performance.now() };
    this.revealed = true;
  }

  #layout() {
    const canvas = this.query('.specks');
    canvas.hidden = !this.#showSpecks;
    // A running wave keeps its specks; they are on their way out.
    if (!this.isConnected || canvas.hidden || this.#wave) return;
    const fitted = fitCanvas(canvas, this.#context, this.query('.text'), this.query('.anchor'));
    if (!fitted) return;
    this.#size = { width: fitted.width, height: fitted.height };
    this.#boxes = fitted.boxes;
    this.#specks = makeSpecks(fitted.boxes);
    this.#color = getComputedStyle(this).color;
    this.#restart();
  }

  #restart() {
    cancelAnimationFrame(this.#frame);
    this.#frame = 0;
    this.#last = 0;
    if (this.#visible && this.#showSpecks) this.#frame = requestAnimationFrame(this.#draw);
  }

  #draw = (now) => {
    this.#frame = 0;
    const context = this.#context;
    const { width, height } = this.#size;
    const dt = this.#last ? Math.min(0.05, (now - this.#last) / 1000) : 0;
    this.#last = now;
    context.clearRect(0, 0, width, height);
    context.fillStyle = this.#color;
    const wave = this.#wave;
    const radius = wave ? farthestCorner(wave, width, height) * easeOut(Math.min(1, (now - wave.start) / WAVE_MS)) : -1;
    const still = reducedMotion.matches;
    const alive = paintSpecks(context, this.#specks, { now, dt, wave, radius, boxes: this.#boxes, still });
    if (wave && alive === 0) {
      this.#wave = null;
      this.query('.specks').hidden = true;
      return;
    }
    // With reduced motion the specks are drawn once and hold still.
    if ((!still || wave) && this.#visible) this.#frame = requestAnimationFrame(this.#draw);
  };
}
