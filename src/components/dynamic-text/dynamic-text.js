import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { graphemes } from '../../core/text.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './dynamic-text.scss?inline';
import { isBlank, isDigit, MorphEngine } from './morph-engine.js';

const DEFAULT_INTERVAL = { morph: 2200, decode: 2800, cycle: 900 };

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=<>/';
const LOWER = 'abcdefghijklmnopqrstuvwxyz#%&*+=<>/';
const DIGITS = '0123456789';
const SWAP_EVERY = 0.05; // s between scrambled glyphs
const FLASH_FOR = 0.05; // s a cell shows the accent once locked

const poolFor = (char) => (isDigit(char) ? DIGITS : char.toLowerCase() === char ? LOWER : UPPER);
const randomFrom = (pool) => pool[Math.floor(Math.random() * pool.length)];

/** How long word `index` of `count` holds before the next one. */
const holdFor = (mode, index, count, interval) => {
  if (mode !== 'cycle' || index === 0) return interval;
  if (index === count - 1) return interval * 2;
  // The middle words accelerate, like someone getting into the rhythm.
  return Math.max(90, interval * 0.36 * 0.8 ** (index - 1));
};

/**
 * Morphing text where letters are physical objects. In `morph`, shared
 * letters travel to their new place on a spring arc, leaving letters fall off
 * the baseline, entering letters drop in and land, and digits roll like a
 * counter. `decode` scrambles monospace cells and locks them left to right.
 * `cycle` morphs through the words with a greeting rhythm: a long first word,
 * faster middle words and a hold on the last.
 *
 * Put each word in a child element, with `lang` when it is in another
 * language: `<span lang="ja">こんにちは</span>`. Or set `text` and change it
 * to animate. It rests while off screen or in a hidden tab.
 *
 * @attr {'morph'|'decode'|'cycle'} mode
 * @attr {string} text - The string to show; when set, the words are ignored
 * @attr {number} interval - Milliseconds each word holds; in `cycle`, the first word's hold
 * @attr {boolean} no-loop - Stops on the last word instead of starting over
 * @fires lw-complete - When the last word shows and it does not loop
 */
export class LwDynamicText extends LwElement {
  static styles = styles;
  static props = {
    mode: { default: 'morph', reflect: true },
    text: {},
    interval: { type: Number },
    noLoop: { type: Boolean },
  };

  #words = [];
  #step = 0;
  #shown = null;
  #visible = false;
  #timer = 0;
  #engine = null;
  #decode = null; // the running scramble, cancelled when the text changes
  #decoded = null; // what the cells settled on, so only changed cells scramble

  render() {
    return '<span class="live"></span><span class="morph" aria-hidden="true"><span class="measure"></span><span class="strut">​</span></span><span class="decode" aria-hidden="true" hidden></span>';
  }

  connected() {
    const morph = this.query('.morph');
    const measure = this.query('.measure');
    this.#engine ??= new MorphEngine(morph, measure);

    // The host's own attributes (its `lang` follows the word) are not words.
    const words = new MutationObserver((mutations) => {
      if (mutations.some(({ type, target }) => type !== 'attributes' || target !== this)) this.#readWords();
    });
    words.observe(this, { childList: true, subtree: true, characterData: true, attributes: true });
    // Fonts loading or the font size changing move the letters: re-place them.
    const resize = new ResizeObserver(() => this.#shown && this.mode !== 'decode' && this.#engine.place(this.#shown.text));
    resize.observe(measure);
    watchVisibility(
      this,
      (visible) => {
        this.#visible = visible;
        this.#schedule();
      },
      this.signal,
    );
    this.signal.addEventListener('abort', () => {
      words.disconnect();
      resize.disconnect();
      clearTimeout(this.#timer);
      this.#engine.stop();
      this.#stopDecode();
    });
    this.#readWords();
  }

  updated(changed) {
    if (changed.has('mode')) {
      this.query('.morph').hidden = this.mode === 'decode';
      this.query('.decode').hidden = this.mode !== 'decode';
      this.query('.live').ariaLive = this.mode === 'cycle' ? 'off' : 'polite';
    }
    if (['mode', 'text', 'interval', 'noLoop'].some((prop) => changed.has(prop))) this.#show(true);
  }

  get #interval() {
    return this.interval ?? DEFAULT_INTERVAL[this.mode] ?? DEFAULT_INTERVAL.morph;
  }

  get #index() {
    const count = Math.max(this.#words.length, 1);
    return this.noLoop ? Math.min(this.#step, count - 1) : this.#step % count;
  }

  get #controlled() {
    return this.text != null;
  }

  get #done() {
    return !this.#controlled && this.noLoop && this.#index === this.#words.length - 1;
  }

  #readWords() {
    this.#words = [...this.children]
      .map((child) => ({ text: child.textContent.trim(), lang: child.lang || undefined }))
      .filter(({ text }) => text);
    this.#show(true);
  }

  // Shows the current word, then waits its turn to move on.
  #show(force = false) {
    if (!this.isConnected) return;
    const current = this.#controlled ? { text: this.text } : (this.#words[this.#index] ?? { text: '' });
    if (force || current.text !== this.#shown?.text) {
      this.#shown = current;
      if (current.lang) this.setAttribute('lang', current.lang);
      else this.removeAttribute('lang');
      // Rapid cycling would flood a screen reader, so `cycle` stays quiet.
      this.query('.live').textContent = current.text;
      if (this.mode === 'decode') this.#runDecode(current.text);
      else {
        this.#engine.reduced = reducedMotion.matches;
        this.#engine.update(current.text);
      }
    }
    this.#schedule();
  }

  #schedule() {
    clearTimeout(this.#timer);
    if (this.#controlled || this.#done || !this.#visible || this.#words.length < 2) return;
    this.#timer = setTimeout(() => {
      this.#step += 1;
      this.#show();
      if (this.#done) this.emit('complete');
    }, holdFor(this.mode, this.#index, this.#words.length, this.#interval));
  }

  #stopDecode() {
    if (!this.#decode) return;
    cancelAnimationFrame(this.#decode.frame);
    this.#decode.cells.forEach((cell) => cell.finish());
    this.#decode = null;
  }

  // Changed cells scramble through glyphs of the same kind, then lock left to
  // right with a brief accent. One frame loop writes every cell.
  #runDecode(text) {
    this.#stopDecode();
    const host = this.query('.decode');
    const chars = graphemes(text);
    while (host.children.length < chars.length) host.append(Object.assign(document.createElement('span'), { className: 'cell' }));
    while (host.children.length > chars.length) host.lastElementChild.remove();
    const els = [...host.children];
    els.forEach((el, i) => {
      el.textContent = chars[i];
      el.removeAttribute('data-scramble');
      el.removeAttribute('data-flash');
    });

    const previous = this.#decoded;
    this.#decoded = chars;
    if (!this.#visible || !previous) return;
    const changed = chars.map((char, i) => ({ char, i })).filter(({ char, i }) => !isBlank(char) && previous[i] !== char);
    if (changed.length === 0) return;
    if (reducedMotion.matches) {
      host.animate({ opacity: [0, 1] }, { duration: 160, easing: 'ease-out' });
      return;
    }

    const stagger = Math.min(0.05, 0.75 / changed.length);
    const cells = changed.map(({ char, i }, rank) => {
      const el = els[i];
      el.setAttribute('data-scramble', '');
      let state = 'scramble';
      let swapAt = 0;
      const lockAt = 0.15 + rank * stagger;
      return {
        get done() {
          return state === 'done';
        },
        step(t) {
          if (state === 'flash') {
            if (t >= lockAt + FLASH_FOR) this.finish();
          } else if (t >= lockAt) {
            el.textContent = char;
            el.removeAttribute('data-scramble');
            el.setAttribute('data-flash', '');
            state = 'flash';
          } else if (t >= swapAt) {
            el.textContent = randomFrom(poolFor(char));
            swapAt = t + SWAP_EVERY;
          }
        },
        finish() {
          el.textContent = char;
          el.removeAttribute('data-scramble');
          el.removeAttribute('data-flash');
          state = 'done';
        },
      };
    });

    const run = { cells, frame: 0 };
    let start = 0;
    const tick = (now) => {
      start ||= now;
      const t = (now - start) / 1000;
      cells.forEach((cell) => cell.step(t));
      if (cells.every((cell) => cell.done)) this.#decode = null;
      else run.frame = requestAnimationFrame(tick);
    };
    run.frame = requestAnimationFrame(tick);
    this.#decode = run;
  }
}
