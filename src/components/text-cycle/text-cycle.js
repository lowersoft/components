import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { graphemes, setHeadingLevel } from '../../core/text.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './text-cycle.scss?inline';

const DEFAULT_WORDS = ['engineer', 'developer', 'designer'];
// Each character's part in a swap, in milliseconds.
const LEAVE = 320;
const ENTER = 460;
const STAGGER = 28;
const SOFT = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * A word in a sentence that swaps for the next on a timer. The outgoing
 * word drifts up and blurs away a character at a time while the next one
 * rises in sharp behind it, and the space it takes eases to the new width,
 * so the text around it slides along instead of jumping.
 *
 * Only the current word is in the page, so put the words you need found in
 * static text around it. Screen readers hear each new word politely. The
 * cycle rests off screen, in a hidden tab and while `paused`; with reduced
 * motion it holds the first word. Text is split into user-perceived
 * characters, so emoji stay whole.
 *
 * @attr {Array<string>} words (JSON) - The words, in order
 * @attr {number} interval - Seconds each word holds
 * @attr {boolean} paused - Holds the current word
 * @attr {number} level - Makes it a heading of this level, 1 to 6
 * @csspart word - The current word
 * @csspart char - Each character
 */
export class LwTextCycle extends LwElement {
  static styles = styles;
  static props = {
    words: { type: Object, default: DEFAULT_WORDS },
    interval: { type: Number, default: 2.5 },
    paused: { type: Boolean, reflect: true },
    level: { type: Number },
  };

  #index = 0;
  #timer = 0;
  #visible = false;

  render() {
    return '<span class="sr" aria-live="polite"></span><span class="stage" aria-hidden="true"></span>';
  }

  connected() {
    watchVisibility(
      this,
      (visible) => {
        this.#visible = visible;
        this.#run();
      },
      this.signal,
    );
    reducedMotion.addEventListener('change', () => this.#run(), { signal: this.signal });
    this.signal.addEventListener('abort', () => {
      clearTimeout(this.#timer);
      this.#timer = 0;
    });
  }

  updated(changed) {
    if (changed.has('level')) setHeadingLevel(this, this.level);
    if (changed.has('words')) {
      this.#index = 0;
      this.#show(false);
    }
    if (changed.has('interval')) {
      clearTimeout(this.#timer);
      this.#timer = 0;
    }
    this.#run();
  }

  get #words() {
    return (Array.isArray(this.words) ? this.words : []).map(String).filter(Boolean);
  }

  #run() {
    const still = reducedMotion.matches;
    if (still && this.#index) {
      this.#index = 0;
      this.#show(false);
    }
    const live = !still && !this.paused && this.#visible && this.#words.length > 1;
    if (live && !this.#timer) {
      this.#timer = setTimeout(() => {
        this.#timer = 0;
        this.#index = (this.#index + 1) % this.#words.length;
        this.#show(true);
        this.#run();
      }, Math.max(0.3, this.interval ?? 2.5) * 1000);
    } else if (!live && this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = 0;
    }
  }

  // Puts the current word in, swapping it in character by character when
  // `animate`, or straight away.
  #show(animate) {
    const words = this.#words;
    const text = words[this.#index % (words.length || 1)] ?? '';
    this.query('.sr').textContent = text;
    const stage = this.query('.stage');
    const word = document.createElement('span');
    word.className = 'word';
    word.part = 'word';
    word.replaceChildren(...graphemes(text).map((char) => Object.assign(document.createElement('span'), { className: 'char', part: 'char', textContent: char })));
    const old = [...stage.querySelectorAll('.word:not(.leaving)')];
    if (!animate || !old.length) {
      stage.replaceChildren(word);
      return;
    }
    const from = stage.getBoundingClientRect().width;
    for (const each of old) {
      each.classList.add('leaving');
      [...each.children].forEach((char, i) =>
        char.animate([{ opacity: 1, filter: 'blur(0)', transform: 'none' }, { opacity: 0, filter: 'blur(6px)', transform: 'translateY(-0.35em)' }], {
          duration: LEAVE,
          delay: i * STAGGER,
          easing: 'cubic-bezier(0.4, 0, 1, 1)',
          fill: 'forwards',
        }),
      );
      const gone = (each.children.length - 1) * STAGGER + LEAVE;
      setTimeout(() => each.remove(), Math.max(0, gone));
    }
    stage.append(word);
    [...word.children].forEach((char, i) =>
      char.animate([{ opacity: 0, filter: 'blur(6px)', transform: 'translateY(0.4em)' }, { opacity: 1, filter: 'blur(0)', transform: 'none' }], {
        duration: ENTER,
        delay: 90 + i * STAGGER,
        easing: SOFT,
        fill: 'backwards',
      }),
    );
    // The space the word takes eases from the old width to the new.
    const to = word.getBoundingClientRect().width;
    stage.animate([{ width: `${from}px` }, { width: `${to}px` }], { duration: ENTER + 120, easing: SOFT });
  }
}
