import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { setHeadingLevel, watchContent } from '../../core/text.js';
import styles from './text-chroma-reveal.scss?inline';

const SPECTRUM = ['#ff3d77', '#ff8a1f', '#ffd60a', '#38d996', '#33a1ff', '#8b5cf6'];
// The ribbon's width, in text widths.
const BAND = 0.6;
const SWEEP_EASING = 'cubic-bezier(0.45, 0, 0.25, 1)';

/**
 * A headline painted into view by a ribbon of spectrum colors. The ribbon
 * sweeps across the hidden text and leaves it behind in its final color.
 * It is one gradient clipped to the letters, so the text stays a single run
 * that wraps and selects as usual.
 *
 * It plays once when it scrolls into view, or straight away with
 * `on-mount`, again on every entry with `replay-on-view`, and on demand with
 * `replay()`. Given several phrases with `repeat`, it holds each one, fades
 * it out and sweeps in the next; `fixed-width` keeps the box as wide as the
 * longest phrase so nothing around it moves. Screen readers hear each new
 * phrase politely. With reduced motion the text shows at once.
 *
 * @attr {string} text - The phrase; when set, the content is ignored
 * @attr {Array<string>} texts (JSON) - Several phrases to cycle through; takes the place of `text`
 * @attr {Array<string>} colors (JSON) - The ribbon's colors, in order across it
 * @attr {string} text-color - The final color; the element's own color by default
 * @attr {'ltr'|'rtl'} direction - Which way the ribbon sweeps
 * @attr {number} duration - Seconds per sweep
 * @attr {number} delay - Seconds before the first sweep
 * @attr {boolean} repeat - Cycles the phrases, or replays a single one, after each hold and fade
 * @attr {number} hold-duration - Seconds a phrase stays fully shown before it fades
 * @attr {number} fade-duration - Seconds the fade between phrases takes
 * @attr {number} repeat-delay - Seconds of pause after the fade before the next sweep
 * @attr {boolean} fixed-width - Keeps the width of the longest phrase
 * @attr {boolean} on-mount - Plays as soon as it is on the page instead of waiting to be seen
 * @attr {boolean} replay-on-view - Plays again every time it scrolls into view
 * @attr {number} level - Makes it a heading of this level, 1 to 6
 * @csspart text - The revealed phrase
 * @cssprop --lw-text-chroma-reveal-color - Same as `text-color`
 */
export class LwTextChromaReveal extends LwElement {
  static styles = styles;
  static props = {
    text: {},
    texts: { type: Object },
    colors: { type: Object, default: SPECTRUM },
    textColor: {},
    direction: { default: 'ltr' },
    duration: { type: Number, default: 1.5 },
    delay: { type: Number, default: 0 },
    repeat: { type: Boolean },
    holdDuration: { type: Number, default: 1 },
    fadeDuration: { type: Number, default: 0.6 },
    repeatDelay: { type: Number, default: 0.5 },
    fixedWidth: { type: Boolean, reflect: true },
    onMount: { type: Boolean },
    replayOnView: { type: Boolean },
    level: { type: Number },
  };

  // Bumped to cancel whatever sequence is running.
  #run = 0;
  #index = 0;
  #played = false;
  #visible = false;
  #animations = [];
  #timer = 0;

  render() {
    return '<span class="sr" aria-live="polite"></span><span class="stage" aria-hidden="true"><span class="sizers"></span><span class="text" part="text"></span></span>';
  }

  connected() {
    const options = { signal: this.signal };
    watchContent(this, () => this.#reset(), this.signal);
    const seen = new IntersectionObserver(([entry]) => this.#seen(entry.isIntersecting), { threshold: 0.35 });
    seen.observe(this);
    reducedMotion.addEventListener('change', () => this.#reset(), options);
    this.signal.addEventListener('abort', () => {
      seen.disconnect();
      this.#stop();
      this.#played = false;
    });
  }

  updated(changed) {
    if (changed.has('level')) setHeadingLevel(this, this.level);
    if (this.textColor) this.style.setProperty('--_ink', this.textColor);
    else this.style.removeProperty('--_ink');
    this.#paintRibbon();
    if (['text', 'texts', 'fixedWidth'].some((prop) => changed.has(prop))) this.#reset();
    else if (changed.has('repeat') && this.repeat && this.#played) this.replay();
  }

  /** Plays the reveal again from the first phrase. */
  replay() {
    this.#index = 0;
    this.#start();
  }

  get #phrases() {
    const many = (Array.isArray(this.texts) ? this.texts : []).map(String).filter(Boolean);
    if (many.length) return many;
    const one = this.text ?? this.textContent.trim();
    return one ? [one] : [];
  }

  // The gradient is three parts side by side: the final color, the ribbon,
  // then nothing. Sliding it across the letters sweeps the ribbon over them.
  #paintRibbon() {
    const colors = (Array.isArray(this.colors) && this.colors.length ? this.colors : SPECTRUM).map(String);
    const width = 2 + BAND;
    const at = (x) => `${((x / width) * 100).toFixed(3)}%`;
    const rtl = this.direction === 'rtl';
    const stops = [`var(--_ink) ${at(1)}`];
    colors.forEach((color, i) => stops.push(`${color} ${at(1 + BAND * 0.08 + ((BAND * 0.78) * i) / Math.max(1, colors.length - 1))}`));
    stops.push(`transparent ${at(1 + BAND)}`);
    const text = this.query('.text');
    text.style.backgroundImage = `linear-gradient(${rtl ? '270deg' : '90deg'}, ${stops.join(', ')})`;
    text.style.backgroundSize = `${width * 100}% 100%`;
    this.toggleAttribute('data-rtl', rtl);
  }

  // Hidden, waiting, or shown at once for reduced motion.
  #reset() {
    if (!this.isConnected) return;
    this.#stop();
    const phrases = this.#phrases;
    this.#index = 0;
    this.query('.sizers').replaceChildren(
      ...(this.fixedWidth ? phrases : []).map((phrase) => Object.assign(document.createElement('span'), { className: 'sizer', textContent: phrase })),
    );
    this.#show(phrases[0] ?? '');
    if (reducedMotion.matches) {
      this.setAttribute('data-shown', '');
      return;
    }
    this.removeAttribute('data-shown');
    if (this.onMount || (this.#visible && (!this.#played || this.replayOnView))) this.#start();
  }

  #seen(visible) {
    this.#visible = visible;
    if (!visible || reducedMotion.matches || this.onMount) return;
    if (!this.#played || this.replayOnView) this.replay();
  }

  #show(phrase) {
    this.query('.text').textContent = phrase;
    this.query('.sr').textContent = phrase;
  }

  #stop() {
    this.#run += 1;
    clearTimeout(this.#timer);
    for (const animation of this.#animations) animation.cancel();
    this.#animations = [];
  }

  #wait(seconds, run) {
    return new Promise((resolve) => {
      this.#timer = setTimeout(() => resolve(run === this.#run), Math.max(0, seconds) * 1000);
    });
  }

  async #start() {
    if (reducedMotion.matches) return this.#reset();
    this.#stop();
    const run = this.#run;
    const phrases = this.#phrases;
    if (!phrases.length) return;
    this.#played = true;
    this.removeAttribute('data-shown');
    const text = this.query('.text');
    let first = true;
    for (;;) {
      this.#show(phrases[this.#index % phrases.length]);
      // From the empty end of the gradient to the painted end.
      const [from, to] = this.direction === 'rtl' ? ['0%', '100%'] : ['100%', '0%'];
      const sweep = text.animate([{ backgroundPosition: `${from} 0`, opacity: 1 }, { backgroundPosition: `${to} 0`, opacity: 1 }], {
        duration: Math.max(0.1, this.duration ?? 1.5) * 1000,
        delay: first ? Math.max(0, this.delay ?? 0) * 1000 : 0,
        easing: SWEEP_EASING,
        fill: 'both',
      });
      this.#animations = [sweep];
      first = false;
      try {
        await sweep.finished;
      } catch {
        return;
      }
      if (run !== this.#run) return;
      if (!this.repeat) {
        this.setAttribute('data-shown', '');
        sweep.cancel();
        this.#animations = [];
        return;
      }
      if (!(await this.#wait(this.holdDuration ?? 1, run))) return;
      const fade = text.animate([{ opacity: 1 }, { opacity: 0 }], { duration: Math.max(0, this.fadeDuration ?? 0.6) * 1000, easing: 'ease-in', fill: 'forwards' });
      this.#animations.push(fade);
      try {
        await fade.finished;
      } catch {
        return;
      }
      if (run !== this.#run) return;
      // Hidden again before the next phrase goes in.
      sweep.cancel();
      fade.cancel();
      this.#animations = [];
      if (!(await this.#wait(this.repeatDelay ?? 0.5, run))) return;
      this.#index = (this.#index + 1) % phrases.length;
    }
  }
}
