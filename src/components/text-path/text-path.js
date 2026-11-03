import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './text-path.scss?inline';

let uid = 0;

const SVG = 'http://www.w3.org/2000/svg';
const CURVES = {
  arc: { d: 'M 20 122 C 170 6, 390 6, 540 122', viewBox: '0 0 560 140' },
  wave: { d: 'M 0 84 C 90 14, 190 14, 280 84 S 470 154, 560 84', viewBox: '0 0 560 168' },
};

/**
 * Text riding a curve: an arc, a wave, a circle or a path of your own. The
 * string is tiled along it and slides on a seamless loop like a curved
 * marquee; on a circle the ring is sized to fit the copies exactly and
 * spins, so proportional fonts keep even spacing all the way round.
 *
 * The loop runs on the SVG's own animation clock, with no script per
 * frame. It pauses off screen, in a hidden tab and when `paused`, and
 * holds still for reduced motion. Assistive technology reads the text
 * once. The text takes the element's color and font unless `fill` says
 * otherwise; a custom `path` needs the `view-box` it was drawn in.
 *
 * @attr {string} text - The string tiled along the curve
 * @attr {'arc'|'wave'|'circle'} curve - A built-in curve; ignored when `path` is set
 * @attr {string} path - A custom SVG path `d`
 * @attr {string} view-box - The viewBox of the custom path
 * @attr {number} duration - Seconds per loop; lower is faster
 * @attr {'forward'|'reverse'} direction - Which way it travels, or spins on a circle
 * @attr {string} separator - Between the copies
 * @attr {number} repeats - Copies along the curve; on a circle, round the ring
 * @attr {number} font-size - In the curve's units, which are CSS pixels at its natural size
 * @attr {string} font-weight
 * @attr {number} letter-spacing - In em
 * @attr {string} fill - The text color; the element's color by default
 * @attr {boolean} show-path - Draws the curve under the text
 * @attr {string} path-color - The curve's stroke color
 * @attr {number} path-width - The curve's stroke width, in CSS pixels
 * @attr {boolean} paused - Holds the loop still
 */
export class LwTextPath extends LwElement {
  static styles = styles;
  static props = {
    text: { default: 'Every component ships with its own motion' },
    curve: { default: 'arc' },
    path: {},
    viewBox: {},
    duration: { type: Number, default: 14 },
    direction: { default: 'forward' },
    separator: { default: ' · ' },
    repeats: { type: Number, default: 3 },
    fontSize: { type: Number, default: 28 },
    fontWeight: { default: '500' },
    letterSpacing: { type: Number, default: 0.05 },
    fill: {},
    showPath: { type: Boolean },
    pathColor: {},
    pathWidth: { type: Number, default: 1 },
    paused: { type: Boolean, reflect: true },
  };

  #id = `lw-text-path-${++uid}`;
  #visible = false;

  render() {
    const id = this.#id;
    return `<svg class="curve" role="img"><path class="track" id="${id}" fill="none" vector-effect="non-scaling-stroke"/><g class="spin"><text class="words" aria-hidden="true"><textPath class="run" href="#${id}"></textPath></text></g><text class="measure" aria-hidden="true"></text></svg>`;
  }

  connected() {
    const options = { signal: this.signal };
    const seen = new IntersectionObserver(([entry]) => {
      this.#visible = entry.isIntersecting;
      this.#run();
    });
    seen.observe(this);
    document.addEventListener('visibilitychange', () => this.#run(), options);
    reducedMotion.addEventListener('change', () => this.#run(), options);
    // Measurements change once a web font arrives.
    document.fonts?.ready.then(() => this.isConnected && this.#layout());
    document.fonts?.addEventListener('loadingdone', () => this.#layout(), options);
    this.signal.addEventListener('abort', () => seen.disconnect());
  }

  updated() {
    this.#layout();
  }

  #layout() {
    const svg = this.query('.curve');
    const words = this.query('.words');
    const measure = this.query('.measure');
    const text = String(this.text ?? '');
    svg.ariaLabel = text;
    const size = Math.max(4, this.fontSize || 28);
    for (const element of [words, measure]) {
      element.style.fontSize = `${size}px`;
      element.style.fontWeight = String(this.fontWeight ?? 500);
      element.style.letterSpacing = `${this.letterSpacing ?? 0.05}em`;
    }
    words.style.fill = this.fill || '';
    const track = this.query('.track');
    track.style.stroke = this.showPath ? this.pathColor || '' : 'none';
    track.style.strokeWidth = `${Math.max(0, this.pathWidth ?? 1)}px`;
    track.toggleAttribute('data-shown', this.showPath);

    // One copy and its separator: the length the loop slides by.
    const unitText = `${text}${this.separator ?? ''}`;
    measure.textContent = unitText;
    const unit = Math.max(1, measure.getComputedTextLength());
    const repeats = Math.max(1, Math.round(this.repeats || 3));
    const reverse = this.direction === 'reverse';
    const duration = `${Math.max(0.5, this.duration || 14)}s`;
    const run = this.query('.run');
    run.querySelectorAll('animate').forEach((a) => a.remove());
    this.query('.spin').querySelectorAll('animateTransform').forEach((a) => a.remove());
    run.removeAttribute('textLength');
    run.removeAttribute('startOffset');

    if (!this.path && this.curve === 'circle') {
      // The ring is as long as the copies, so they meet exactly.
      const circumference = unit * repeats;
      const r = circumference / (2 * Math.PI);
      const pad = size * 1.2;
      const c = r + pad;
      svg.setAttribute('viewBox', `0 0 ${c * 2} ${c * 2}`);
      track.setAttribute('d', `M ${c} ${c - r} a ${r} ${r} 0 1 1 0 ${r * 2} a ${r} ${r} 0 1 1 0 ${-r * 2}`);
      run.textContent = unitText.repeat(repeats);
      run.setAttribute('textLength', String(circumference));
      run.setAttribute('lengthAdjust', 'spacing');
      this.setAttribute('data-shape', 'circle');
      const spin = document.createElementNS(SVG, 'animateTransform');
      Object.entries({ attributeName: 'transform', type: 'rotate', from: `${reverse ? 360 : 0} ${c} ${c}`, to: `${reverse ? 0 : 360} ${c} ${c}`, dur: duration, repeatCount: 'indefinite' }).forEach(([k, v]) => spin.setAttribute(k, v));
      this.query('.spin').append(spin);
    } else {
      const custom = this.path ? { d: this.path, viewBox: this.viewBox || '0 0 560 140' } : CURVES[this.curve] ?? CURVES.arc;
      svg.setAttribute('viewBox', custom.viewBox);
      track.setAttribute('d', custom.d);
      this.setAttribute('data-shape', 'line');
      // Enough copies that the curve is never bare as the run slides by one.
      const length = track.getTotalLength?.() || 560;
      const copies = Math.max(repeats, Math.ceil(length / unit) + 1);
      run.textContent = unitText.repeat(copies);
      const slide = document.createElementNS(SVG, 'animate');
      Object.entries({ attributeName: 'startOffset', from: String(reverse ? 0 : -unit), to: String(reverse ? -unit : 0), dur: duration, repeatCount: 'indefinite' }).forEach(([k, v]) => slide.setAttribute(k, v));
      run.append(slide);
    }
    // A fresh animation starts from the top of the SVG's clock.
    svg.setCurrentTime?.(0);
    this.#run();
  }

  // The loop runs only while it can be seen and motion is welcome.
  #run() {
    const svg = this.query('.curve');
    if (this.#visible && !document.hidden && !this.paused && !reducedMotion.matches) svg.unpauseAnimations?.();
    else svg.pauseAnimations?.();
    if (reducedMotion.matches) svg.setCurrentTime?.(0);
  }
}
