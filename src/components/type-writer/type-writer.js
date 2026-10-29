import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './type-writer.scss?inline';

const NEXT_PHRASE_DELAY = 100;
// The caret stays solid while keys are being hit and only starts blinking
// once typing has stopped for this long, as in a text editor.
const CARET_IDLE = 500;
// A wrong key: noticed after this pause, then backspaced and retyped.
const TYPO_NOTICE = 250;
// Select-to-delete: the highlight sweeps the phrase in this long, holds for a
// moment, then the text is cut.
const SELECT_SWEEP = 120;
const SELECT_HOLD = 220;

const KEY_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

/** The keys around a letter on a QWERTY keyboard, in the same case. */
const neighbours = (char = '') => {
  const lower = char.toLowerCase();
  const row = KEY_ROWS.findIndex((keys) => keys.includes(lower));
  if (row === -1) return '';
  const column = KEY_ROWS[row].indexOf(lower);
  const around = [KEY_ROWS[row][column - 1], KEY_ROWS[row][column + 1], KEY_ROWS[row - 1]?.[column], KEY_ROWS[row + 1]?.[column]]
    .filter(Boolean)
    .join('');
  return char === lower ? around : around.toUpperCase();
};

/** Small seeded generator (Park–Miller), 0 to 1, so every visit types the same way. */
const createRandom = (seed) => {
  let state = (Math.abs(Math.floor(seed)) % 2_147_483_646) + 1;
  return () => {
    state = (state * 16_807) % 2_147_483_647;
    return (state - 1) / 2_147_483_646;
  };
};

class Stopped extends Error {}

/**
 * Types phrases, deletes them and moves on to the next, with a natural rhythm:
 * the odd hesitation and burst, optional typos that get corrected, and a
 * caret that only blinks once typing stops. It pauses while off screen, in a
 * hidden tab or `paused`; with reduced motion it shows the last phrase.
 *
 * Put each phrase in a child element: `<span>Hello</span>`, with an optional
 * `data-pause` (ms) for how long it stays before being erased. Screen readers
 * read every phrase once rather than the partial text on screen.
 *
 * @attr {number} typing-speed - Milliseconds per character
 * @attr {number} delete-speed - Milliseconds per erased character
 * @attr {number} start-delay
 * @attr {number} pause - Milliseconds a typed phrase stays before being erased
 * @attr {number} loop-delay - Milliseconds before starting over
 * @attr {boolean} no-loop - Stops on the last phrase instead of starting over
 * @attr {boolean} steady - Types at an even pace
 * @attr {'backspace'|'select'} delete-mode - Erase one character at a time, or select the phrase and cut it
 * @attr {number} typos - Chance of a wrong key per letter, e.g. 0.04
 * @attr {number} seed - Seed for the rhythm and typos
 * @attr {boolean} paused - Stops where it is; offer it as a control to stop the endless loop (WCAG 2.2.2)
 * @csspart text - The typed text
 * @csspart caret
 */
export class LwTypeWriter extends LwElement {
  static styles = styles;
  static props = {
    typingSpeed: { type: Number, default: 50 },
    deleteSpeed: { type: Number, default: 30 },
    startDelay: { type: Number, default: 200 },
    pause: { type: Number, default: 1000 },
    loopDelay: { type: Number, default: 1000 },
    noLoop: { type: Boolean },
    steady: { type: Boolean },
    deleteMode: { default: 'backspace' },
    typos: { type: Number, default: 0 },
    seed: { type: Number, default: 7 },
    paused: { type: Boolean, reflect: true },
  };

  #phrases = [];
  // Where typing is, kept across pauses so it resumes there.
  #position = { phrase: 0, char: 0, deleting: false };
  #random = createRandom(7);
  #run = null;
  #timers = new Set();
  #idleTimer = 0;
  #visible = false;

  render() {
    return '<span class="phrases"></span><span class="stage" part="text" aria-hidden="true"><span class="line"><span class="kept"></span><span class="caret-box"><span class="caret" part="caret" data-idle></span></span><span class="selected"></span></span></span>';
  }

  connected() {
    const options = { signal: this.signal };
    const children = new MutationObserver(() => this.#readPhrases());
    children.observe(this, { childList: true, subtree: true, characterData: true, attributes: true });
    watchVisibility(
      this,
      (visible) => {
        this.#visible = visible;
        this.#sync();
      },
      this.signal,
    );
    reducedMotion.addEventListener('change', () => this.#sync(), options);
    this.signal.addEventListener('abort', () => {
      children.disconnect();
      this.#stop();
    });
    this.#readPhrases();
  }

  updated(changed) {
    if (changed.has('seed')) this.#random = createRandom(this.seed);
    this.#sync();
  }

  #readPhrases() {
    this.#phrases = [...this.children]
      .map((child) => ({ text: child.textContent.trim(), pause: child.dataset.pause ? Number(child.dataset.pause) : undefined }))
      .filter(({ text }) => text);
    this.query('.phrases').textContent = this.#phrases.map(({ text }) => text).join(', ');
    const sizers = this.#phrases.map(({ text }) => Object.assign(document.createElement('span'), { className: 'sizer', textContent: text }));
    this.query('.stage').replaceChildren(...sizers, this.query('.line'));
    this.#sync();
  }

  // Typing runs only while on screen, not paused, and motion is welcome.
  #sync() {
    if (!this.isConnected) return;
    if (reducedMotion.matches) {
      this.#stop();
      this.#show(this.#phrases.at(-1)?.text ?? '');
      return;
    }
    const shouldRun = this.#visible && !this.paused && this.#phrases.length > 0;
    if (shouldRun && !this.#run) this.#start();
    else if (!shouldRun) this.#stop();
  }

  #stop() {
    this.#run = null;
    this.#timers.forEach(clearTimeout);
    this.#timers.clear();
    clearTimeout(this.#idleTimer);
    this.query('.caret').toggleAttribute('data-idle', true);
  }

  #show(text, selected = 0) {
    this.query('.kept').textContent = text.slice(0, text.length - selected);
    this.query('.selected').textContent = text.slice(text.length - selected);
  }

  // Every keystroke holds the caret solid; it blinks again once idle.
  #keystroke() {
    const caret = this.query('.caret');
    caret.removeAttribute('data-idle');
    clearTimeout(this.#idleTimer);
    this.#idleTimer = setTimeout(() => caret.setAttribute('data-idle', ''), CARET_IDLE);
  }

  #delay() {
    const speed = this.typingSpeed;
    if (this.steady) return speed;
    const roll = this.#random();
    // A 10% chance of a hesitation, 10% of a burst, otherwise ±40%.
    if (roll < 0.1) return speed * 2;
    if (roll > 0.9) return speed * 0.5;
    return speed * (0.6 + this.#random() * 0.8);
  }

  async #start() {
    const run = {};
    this.#run = run;
    const position = this.#position;

    const wait = (ms) =>
      new Promise((resolve, reject) => {
        if (this.#run !== run) return reject(new Stopped());
        const timer = setTimeout(() => {
          this.#timers.delete(timer);
          if (this.#run === run) resolve();
          else reject(new Stopped());
        }, ms);
        this.#timers.add(timer);
      });

    const typeChar = async (text) => {
      const wrongKeys = neighbours(text[position.char]);
      if (wrongKeys && this.#random() < this.typos) {
        const wrong = wrongKeys[Math.floor(this.#random() * wrongKeys.length)];
        this.#show(text.slice(0, position.char) + wrong);
        this.#keystroke();
        await wait(TYPO_NOTICE + this.typingSpeed);
        this.#show(text.slice(0, position.char));
        this.#keystroke();
        await wait(this.typingSpeed * 1.5);
      }
      position.char += 1;
      this.#show(text.slice(0, position.char));
      this.#keystroke();
      await wait(this.#delay());
    };

    const erase = async (text) => {
      if (this.deleteMode === 'select') {
        const length = position.char;
        for (let selected = 1; selected <= length; selected++) {
          this.#show(text.slice(0, length), selected);
          this.#keystroke();
          await wait(SELECT_SWEEP / Math.max(length, 1));
        }
        await wait(SELECT_HOLD);
        position.char = 0;
        this.#show('');
        this.#keystroke();
        return;
      }
      while (position.char > 0) {
        position.char -= 1;
        this.#show(text.slice(0, position.char));
        this.#keystroke();
        await wait(this.deleteSpeed);
      }
    };

    // Moves on to the next phrase; false when the run is over.
    const advance = async (delay) => {
      const isLast = position.phrase >= this.#phrases.length - 1;
      if (isLast && this.noLoop) return false;
      // Advance first, so pausing during the wait cannot retype this one.
      position.phrase = isLast ? 0 : position.phrase + 1;
      position.char = 0;
      position.deleting = false;
      await wait(isLast ? this.loopDelay : delay);
      this.#show('');
      return true;
    };

    const phrase = async () => {
      // The phrases may have shrunk past the current one: start over.
      if (position.phrase >= this.#phrases.length) Object.assign(position, { phrase: 0, char: 0, deleting: false });
      const current = this.#phrases[position.phrase];
      if (!current) return false;
      const { text } = current;
      position.char = Math.min(position.char, text.length);
      // Resuming after a pause: put the screen back in step.
      this.#show(text.slice(0, position.char));

      if (!position.deleting) {
        while (position.char < text.length) await typeChar(text);
        const isLast = position.phrase === this.#phrases.length - 1;
        // Without looping, the last phrase stays.
        if (isLast && this.noLoop) return false;
        await wait(current.pause ?? this.pause);
        position.deleting = true;
      }
      await erase(text);
      return advance(NEXT_PHRASE_DELAY);
    };

    try {
      await wait(this.startDelay);
      while (await phrase());
    } catch (error) {
      if (!(error instanceof Stopped)) throw error;
    } finally {
      if (this.#run === run) this.#run = null;
    }
  }
}
