import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { graphemes, setHeadingLevel, watchContent } from '../../core/text.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './text-ripple.scss?inline';

/**
 * A headline with a crest of depth running through it: each letter in turn
 * rises toward the viewer, turns a little and brightens as the crest
 * passes, then settles back into the muted resting color. Every letter
 * shares one timeline and starts a little after the one before, so the
 * crest seems to travel. Only transform and color move.
 *
 * Each letter is its own element, so keep it to a headline. The wave rests
 * off screen, in a hidden tab and while `paused`; with reduced motion the
 * text holds still. Screen readers hear the whole text once.
 *
 * @attr {string} text - The words; when set, the content is ignored
 * @attr {number} duration - Seconds each letter takes to rise and settle
 * @attr {number} spread - How many letters the crest lifts at once, 0.4 to 3; more travels faster
 * @attr {number} z-distance - How far the crest comes forward, in pixels
 * @attr {number} x-distance - Sideways nudge at the crest, in pixels
 * @attr {number} y-distance - Vertical nudge at the crest, in pixels; negative lifts
 * @attr {number} scale-distance - Scale at the crest
 * @attr {number} rotate-y-distance - Turn at the crest, in degrees
 * @attr {string} base-color - The resting color; the theme's muted foreground by default
 * @attr {string} ripple-color - The crest's color; the theme's foreground by default
 * @attr {boolean} paused - Holds the wave where it is
 * @attr {number} level - Makes it a heading of this level, 1 to 6
 * @csspart char - Each letter
 * @cssprop --lw-text-ripple-base - Same as `base-color`
 * @cssprop --lw-text-ripple-color - Same as `ripple-color`
 */
export class LwTextRipple extends LwElement {
  static styles = styles;
  static props = {
    text: {},
    duration: { type: Number, default: 1 },
    spread: { type: Number, default: 1 },
    zDistance: { type: Number, default: 10 },
    xDistance: { type: Number, default: 2 },
    yDistance: { type: Number, default: -2 },
    scaleDistance: { type: Number, default: 1.1 },
    rotateYDistance: { type: Number, default: 10 },
    baseColor: {},
    rippleColor: {},
    paused: { type: Boolean, reflect: true },
    level: { type: Number },
  };

  #waves = [];
  #visible = false;

  render() {
    return '<span class="sr"></span><span class="stage" aria-hidden="true"></span>';
  }

  connected() {
    watchContent(this, () => this.#read(), this.signal);
    watchVisibility(
      this,
      (visible) => {
        this.#visible = visible;
        this.#run();
      },
      this.signal,
    );
    reducedMotion.addEventListener('change', () => this.#start(), { signal: this.signal });
    this.signal.addEventListener('abort', () => this.#stop());
    this.#read();
  }

  updated(changed) {
    if (changed.has('level')) setHeadingLevel(this, this.level);
    for (const [prop, name] of [['baseColor', '--_base'], ['rippleColor', '--_crest']]) {
      if (this[prop]) this.style.setProperty(name, this[prop]);
      else this.style.removeProperty(name);
    }
    if (changed.has('text')) this.#read();
    else if ([...changed].some((prop) => !['level', 'baseColor', 'rippleColor', 'paused'].includes(prop))) this.#start();
    else this.#run();
  }

  #read() {
    if (!this.isConnected) return;
    const text = this.text ?? this.textContent.trim();
    this.query('.sr').textContent = text;
    const chars = graphemes(text).map((char) =>
      Object.assign(document.createElement('span'), { className: char.trim() ? 'char' : 'char space', textContent: char, part: 'char' }),
    );
    this.query('.stage').replaceChildren(...chars);
    this.#start();
  }

  #stop() {
    for (const wave of this.#waves) wave.cancel();
    this.#waves = [];
  }

  // One animation per letter, all the same length and started together,
  // each delayed a step more than the last, so the crest travels.
  #start() {
    this.#stop();
    const still = reducedMotion.matches;
    this.toggleAttribute('data-still', still);
    const chars = [...this.query('.stage').children];
    if (still || !chars.length) return;
    const rise = Math.max(0.1, this.duration ?? 1) * 1000;
    const stagger = (rise * 0.25) / Math.min(Math.max(this.spread ?? 1, 0.4), 3);
    // The crest runs off the end, rests a moment and comes round again.
    const cycle = (chars.length - 1) * stagger + rise + rise * 0.6;
    const peak = rise / cycle;
    const crest = `translate3d(${this.xDistance ?? 2}px, ${this.yDistance ?? -2}px, ${this.zDistance ?? 10}px) scale(${this.scaleDistance ?? 1.1}) rotateY(${this.rotateYDistance ?? 10}deg)`;
    const rest = 'translate3d(0, 0, 0) scale(1) rotateY(0deg)';
    const frames = [
      { transform: rest, color: 'var(--_base)', easing: 'cubic-bezier(0.33, 0, 0.2, 1)' },
      { transform: crest, color: 'var(--_crest)', offset: peak * 0.42, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
      { transform: rest, color: 'var(--_base)', offset: peak },
      { transform: rest, color: 'var(--_base)' },
    ];
    this.#waves = chars.map((char, i) => char.animate(frames, { duration: cycle, delay: i * stagger, iterations: Infinity }));
    this.#run();
  }

  #run() {
    const live = this.#visible && !this.paused;
    for (const wave of this.#waves) {
      if (live && wave.playState !== 'running') wave.play();
      else if (!live && wave.playState === 'running') wave.pause();
    }
  }
}
