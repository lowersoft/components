import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './glitch-text.scss?inline';

const INTENSITY = {
  subtle: { bands: 3, shift: 0.05, split: 1, frames: 5, frame: 55 },
  medium: { bands: 4, shift: 0.12, split: 2, frames: 6, frame: 55 },
  strong: { bands: 5, shift: 0.18, split: 3, frames: 7, frame: 50 },
};
const MAX_BANDS = Math.max(...Object.values(INTENSITY).map(({ bands }) => bands));
// Some frames hold the text whole, so a burst stutters instead of buzzing.
const STILL_CHANCE = 0.3;
const IDLE_FIRST = 1200;
const IDLE_MIN = 4000;
const IDLE_MAX = 9000;
// Each frame is held, then cut to the next: no tweening in between.
const HOLD = 'steps(1, end)';
const WHOLE = 'inset(0 -25% 0 -25%)';

const between = (min, max) => min + Math.random() * (max - min);
const jitter = (amount) => between(-amount, amount);

/** Clip paths for `count` horizontal bands at random cuts. The outer edges overreach so ascenders and descenders stay. */
const randomBands = (count) => {
  const cuts = Array.from({ length: count - 1 }, () => between(8, 92)).sort((a, b) => a - b);
  const edges = [-50, ...cuts, 150];
  return Array.from({ length: count }, (_, i) => `inset(${edges[i]}% -25% ${100 - edges[i + 1]}% -25%)`);
};

/**
 * Text that bursts into hard-cut horizontal bands with a red and cyan channel
 * split, like a broken signal, then snaps back. It glitches now and then
 * while on screen (`idle`), when pointed at or pressed (`hover`), or only
 * when its text changes (`change`); a new text always arrives through a
 * glitch. Call `glitch()` to fire one. With reduced motion it stays still.
 *
 * Set the text as content or with `text`.
 *
 * @attr {string} text - The string to show; when set, the content is ignored
 * @attr {'idle'|'hover'|'change'} trigger
 * @attr {'subtle'|'medium'|'strong'} intensity
 * @cssprop --lw-glitch-accent - The channel shifted left
 * @cssprop --lw-glitch-echo - The channel shifted right
 * @csspart text - The visible text
 */
export class LwGlitchText extends LwElement {
  static styles = styles;
  static props = {
    text: {},
    trigger: { default: 'idle' },
    intensity: { default: 'medium' },
  };

  #shown = null;
  #visible = false;
  #idleTimer = 0;
  #burst = null;

  render() {
    const bands = '<span class="band"></span>'.repeat(MAX_BANDS);
    return `<span class="live"></span><span class="stage" part="text" aria-hidden="true"><span class="base"></span><span class="channel accent"></span><span class="channel echo"></span>${bands}</span>`;
  }

  connected() {
    const options = { signal: this.signal };
    const content = new MutationObserver(() => this.#readText());
    content.observe(this, { childList: true, subtree: true, characterData: true });
    watchVisibility(
      this,
      (visible) => {
        if (visible === this.#visible) return;
        this.#visible = visible;
        this.#schedule(IDLE_FIRST);
      },
      this.signal,
    );
    // A mouse glitches on the way in; touch and pen have no hover, so on press.
    this.addEventListener('pointerenter', (event) => event.pointerType === 'mouse' && this.#hovered(), options);
    this.addEventListener('pointerdown', (event) => event.pointerType !== 'mouse' && this.#hovered(), options);
    this.signal.addEventListener('abort', () => {
      content.disconnect();
      clearTimeout(this.#idleTimer);
      this.#stop();
    });
    this.#readText();
  }

  updated(changed) {
    if (changed.has('text')) this.#readText();
    if (changed.has('trigger')) this.#schedule(IDLE_FIRST);
  }

  /** Fires one burst, unless one is running or motion is reduced. */
  glitch() {
    if (!this.#burst && this.#shown !== null) this.#run(this.#shown, this.#shown);
  }

  #hovered() {
    if (this.trigger === 'hover') this.glitch();
  }

  #readText() {
    if (!this.isConnected) return;
    const text = this.text ?? this.textContent.trim();
    if (text === this.#shown) return;
    const from = this.#shown;
    this.#shown = text;
    this.query('.live').textContent = text;
    this.query('.base').textContent = text;
    if (from === null || !this.#visible) this.#paint(text);
    else this.#run(from, text);
  }

  #schedule(delay) {
    clearTimeout(this.#idleTimer);
    if (this.trigger !== 'idle' || !this.#visible) return;
    this.#idleTimer = setTimeout(() => {
      this.glitch();
      this.#schedule(between(IDLE_MIN, IDLE_MAX));
    }, delay);
  }

  // The layers that break apart during a burst.
  #paint(text) {
    this.shadowRoot.querySelectorAll('.channel, .band').forEach((layer) => (layer.textContent = text));
  }

  #stop() {
    if (!this.#burst) return;
    clearTimeout(this.#burst.swap);
    this.#burst.animations.forEach((animation) => animation.cancel());
    this.#burst = null;
    this.#paint(this.#shown);
  }

  // The base text hides while bands cut from it jump sideways over a split
  // channel. When the text changes, the new one cuts in halfway through.
  #run(from, to) {
    this.#stop();
    if (!this.isConnected || reducedMotion.matches) {
      this.#paint(to);
      return;
    }
    const { bands, shift, split, frames, frame } = INTENSITY[this.intensity] ?? INTENSITY.medium;
    const duration = frames * frame;
    // The first frame always breaks, so even a short burst is seen.
    const plan = Array.from({ length: frames }, (_, i) => (i > 0 && Math.random() < STILL_CHANCE ? null : randomBands(bands)));
    const timing = { duration, easing: 'linear' };
    const rest = { opacity: 0, transform: 'none', clipPath: WHOLE };

    const bandAnimations = [...this.shadowRoot.querySelectorAll('.band')].slice(0, bands).map((band, b) => {
      const keyframes = plan.map((cuts) =>
        cuts
          ? { opacity: 1, transform: `translateX(${jitter(shift)}em)`, clipPath: cuts[b], easing: HOLD }
          : { opacity: b === 0 ? 1 : 0, transform: 'none', clipPath: WHOLE, easing: HOLD },
      );
      return band.animate([...keyframes, rest], timing);
    });
    const channelAnimations = [...this.shadowRoot.querySelectorAll('.channel')].map((channel, c) => {
      const side = c === 0 ? -1 : 1;
      const keyframes = plan.map((cuts) => ({
        opacity: cuts ? 0.85 : 0,
        transform: `translateX(${side * split * between(0.5, 1.5)}px)`,
        easing: HOLD,
      }));
      return channel.animate([...keyframes, { opacity: 0, transform: 'none' }], timing);
    });
    const base = this.query('.base').animate({ opacity: [0, 0] }, timing);

    const burst = { animations: [base, ...channelAnimations, ...bandAnimations], swap: 0 };
    this.#paint(from);
    if (from !== to) burst.swap = setTimeout(() => this.#paint(to), Math.floor(frames / 2) * frame);
    base.onfinish = () => {
      if (this.#burst !== burst) return;
      this.#burst = null;
      this.#paint(this.#shown);
    };
    this.#burst = burst;
  }
}
