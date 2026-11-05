import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { setHeadingLevel, watchContent } from '../../core/text.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './text-shimmer.scss?inline';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * A line of text with a band of light sweeping across it, over a muted
 * resting color. The shine is one gradient clipped to the letters, so the
 * text stays a single run that wraps and selects like any other, and only
 * the gradient's position moves.
 *
 * The sweep rests off screen, in a hidden tab, while `paused` and, with
 * `pause-on-hover`, under the pointer. With reduced motion the band holds
 * still in the middle. Size and weight it with `font` on the element; text
 * color does not reach the letters, so use `base-color` and `shimmer-color`.
 *
 * @attr {string} text - The words; when set, the content is ignored
 * @attr {number} duration - Seconds per sweep
 * @attr {number} delay - Seconds of rest after each sweep
 * @attr {'left'|'right'} direction - Which way the band travels
 * @attr {boolean} yoyo - Sweeps back and forth instead of always the same way
 * @attr {boolean} pause-on-hover - Holds the band while the pointer is over the text
 * @attr {number} spread - Half the band's width, as a percentage of the text's width, 8 to 60
 * @attr {number} angle - Angle of the gradient in degrees; 90 sweeps straight across
 * @attr {string} base-color - The resting color; the theme's muted foreground by default
 * @attr {string} shimmer-color - The band's color; the theme's foreground by default
 * @attr {boolean} paused - Holds the band where it is
 * @attr {number} level - Makes it a heading of this level, 1 to 6
 * @csspart text - The shining text
 * @cssprop --lw-text-shimmer-base - Same as `base-color`
 * @cssprop --lw-text-shimmer-color - Same as `shimmer-color`
 */
export class LwTextShimmer extends LwElement {
  static styles = styles;
  static props = {
    text: {},
    duration: { type: Number, default: 2 },
    delay: { type: Number, default: 0 },
    direction: { default: 'right' },
    yoyo: { type: Boolean },
    pauseOnHover: { type: Boolean },
    spread: { type: Number, default: 22 },
    angle: { type: Number, default: 90 },
    baseColor: {},
    shimmerColor: {},
    paused: { type: Boolean, reflect: true },
    level: { type: Number },
  };

  #sweep = null;
  #visible = false;
  #hovered = false;

  render() {
    return '<span class="text" part="text"></span>';
  }

  connected() {
    const options = { signal: this.signal };
    watchContent(this, () => this.#read(), this.signal);
    watchVisibility(
      this,
      (visible) => {
        this.#visible = visible;
        this.#run();
      },
      this.signal,
    );
    this.addEventListener('pointerenter', () => this.#hover(true), options);
    this.addEventListener('pointerleave', () => this.#hover(false), options);
    reducedMotion.addEventListener('change', () => this.#restart(), options);
    this.signal.addEventListener('abort', () => {
      this.#sweep?.cancel();
      this.#sweep = null;
    });
    this.#read();
  }

  updated(changed) {
    if (changed.has('text')) this.#read();
    if (changed.has('level')) setHeadingLevel(this, this.level);
    for (const [prop, name] of [['baseColor', '--_base'], ['shimmerColor', '--_shine']]) {
      if (this[prop]) this.style.setProperty(name, this[prop]);
      else this.style.removeProperty(name);
    }
    // The gradient is wide enough that the band starts and ends fully off
    // the text: twice the text's width plus the band on either side.
    const half = clamp(this.spread ?? 22, 8, 60) / 100;
    const width = 2 + 2 * half;
    const text = this.query('.text');
    text.style.setProperty('--_size', `${(width * 100).toFixed(2)}%`);
    text.style.setProperty('--_band', `${((half / width) * 100).toFixed(2)}%`);
    text.style.setProperty('--_angle', `${this.angle ?? 90}deg`);
    if (['duration', 'delay', 'direction', 'yoyo'].some((prop) => changed.has(prop))) this.#restart();
    else this.#run();
  }

  #read() {
    if (!this.isConnected) return;
    this.query('.text').textContent = this.text ?? this.textContent.trim();
  }

  #hover(hovered) {
    this.#hovered = hovered;
    this.#run();
  }

  #restart() {
    this.#sweep?.cancel();
    this.#sweep = null;
    const still = reducedMotion.matches;
    this.toggleAttribute('data-still', still);
    if (!still) {
      const sweep = Math.max(0.1, this.duration ?? 2);
      const rest = Math.max(0, this.delay ?? 0);
      // Background position 0% shows the gradient's left end, so moving
      // toward 100% carries the band leftward across the text.
      const [from, to] = this.direction === 'left' ? ['0%', '100%'] : ['100%', '0%'];
      const frames = [
        { backgroundPosition: `${from} 0`, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
        { backgroundPosition: `${to} 0`, offset: sweep / (sweep + rest) },
      ];
      if (rest) frames.push({ backgroundPosition: `${to} 0` });
      this.#sweep = this.query('.text').animate(frames, {
        duration: (sweep + rest) * 1000,
        iterations: Infinity,
        direction: this.yoyo ? 'alternate' : 'normal',
      });
    }
    this.#run();
  }

  #run() {
    const sweep = this.#sweep;
    if (!sweep) return;
    const live = this.#visible && !this.paused && !(this.pauseOnHover && this.#hovered);
    if (live && sweep.playState !== 'running') sweep.play();
    else if (!live && sweep.playState === 'running') sweep.pause();
  }
}
