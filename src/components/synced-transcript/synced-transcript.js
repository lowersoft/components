import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowDown, arrowUp, pause, play } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './synced-transcript.scss?inline';

const SPEEDS = [1, 1.5, 2];
const KEY_STEP = 5;
const WHITESPACE = /\s+/;
const SLIDE = '140ms cubic-bezier(0.23, 1, 0.32, 1)';

// Times each segment from its word count, with a breath between speakers.
const timed = (lines) => {
  let time = 0.6;
  return lines.map(([speaker, text]) => {
    const start = time;
    const end = start + text.split(WHITESPACE).length / 2.7;
    time = end + 0.7;
    return { speaker, start, end, text };
  });
};

const DEMO_SEGMENTS = timed([
  ['Maya', "Welcome back. Today we're talking about the small details in interfaces, the ones nobody notices until they're missing."],
  ['Theo', 'Right. Like a menu that opens in a hundred and fifty milliseconds instead of four hundred. You never think about it, but the slow one feels broken.'],
  ['Maya', 'So where do you start when something feels off?'],
  ['Theo', 'I slow it down. I record the screen and step through it frame by frame. Most of the time the easing is wrong, or two things move that should move as one.'],
  ['Maya', 'And when it finally feels right?'],
  ['Theo', "Then I stop touching it. The best motion is the kind you only miss when it's gone."],
]);

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

const clock = (seconds) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// Spreads a segment's time over its words by length, so long words last longer.
const splitWords = (segments) => {
  const words = [];
  for (const segment of segments) {
    const parts = segment.text.split(WHITESPACE).filter(Boolean);
    const total = parts.reduce((sum, word) => sum + word.length + 1, 0);
    let time = segment.start;
    for (const text of parts) {
      words.push({ text, start: time });
      time += ((text.length + 1) / total) * (segment.end - segment.start);
    }
  }
  return words;
};

/**
 * A transcript that follows the audio word by word. One highlight slides
 * along the spoken line and the transcript scrolls to keep it a third of
 * the way down, like lyrics. Scroll away to read freely, and Back to now
 * returns; click any word or timestamp to play from there.
 *
 * Segments are `{ speaker, start, end, text }`, in seconds. Playback is
 * simulated; drive your own audio from `lw-time`.
 *
 * @attr {string} heading - The episode's title
 * @attr {Array<object>} segments - The transcript (JSON)
 * @attr {number} duration - Length in seconds; defaults to the end of the last segment
 * @fires lw-time - The time moved; `detail: { time }`
 */
export class LwSyncedTranscript extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Frame Rate · Episode 48' },
    segments: { type: Object, default: DEMO_SEGMENTS },
    duration: { type: Number, default: 0 },
  };

  #words = [];
  #time = 0;
  #active = -1;
  #speed = 0;
  #playing = false;
  #frame = 0;
  #last = 0;
  #following = true;
  #lastTop = null;

  render() {
    return `<div class="head"><div class="titles"><p class="kicker">Transcript</p><p class="heading"></p></div><button class="speed" type="button"></button></div>
<div class="body"><section class="scroll" aria-label="Transcript" tabindex="0"><div class="content"><div class="mark" aria-hidden="true"></div><div class="segments"></div></div></section>
<button class="back-to-now" type="button" tabindex="-1"><span class="arrow"></span>Back to now</button></div>
<div class="bar"><button class="play" type="button" aria-label="Play">${strokeIcon(play, 16)}</button><span class="now"></span>
<div class="seek" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0"><span class="fill"></span></div><span class="total"></span></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const scroll = this.query('.scroll');
    // Wheel or touch hands the scroll to the reader.
    for (const type of ['wheel', 'touchmove']) scroll.addEventListener(type, () => (this.#following = false), { ...options, passive: true });
    scroll.addEventListener('scroll', () => this.#checkAway(), options);
    this.query('.segments').addEventListener('click', (event) => this.#jump(event), options);
    this.query('.back-to-now').addEventListener('click', () => this.#follow(), options);
    this.query('.play').addEventListener('click', () => this.#toggle(), options);
    this.query('.speed').addEventListener('click', () => {
      this.#speed = (this.#speed + 1) % SPEEDS.length;
      this.#paintSpeed();
    }, options);
    const seek = this.query('.seek');
    seek.addEventListener('pointerdown', (event) => {
      seek.setPointerCapture(event.pointerId);
      this.#seekAt(event);
    }, options);
    seek.addEventListener('pointermove', (event) => seek.hasPointerCapture(event.pointerId) && this.#seekAt(event), options);
    seek.addEventListener('keydown', (event) => this.#key(event), options);
    this.signal.addEventListener('abort', () => this.#stop());
  }

  updated(changed) {
    this.query('.heading').textContent = this.heading ?? '';
    if (changed.has('segments')) this.#build();
    this.query('.total').textContent = clock(this.#duration);
    this.query('.seek').ariaValueMax = String(Math.round(this.#duration));
    this.#paintSpeed();
    this.#paintTime();
  }

  get #duration() {
    return this.duration || Math.ceil((this.segments.at(-1)?.end ?? 0) + 0.6);
  }

  #build() {
    this.#words = splitWords(this.segments);
    let index = 0;
    this.query('.segments').innerHTML = this.segments
      .map((segment) => {
        const words = segment.text.split(WHITESPACE).filter(Boolean).map((word) => `<span data-index="${index++}">${escapeHtml(word)} </span>`);
        return `<div class="segment"><div class="who"><span class="initial" aria-hidden="true">${escapeHtml(segment.speaker.charAt(0))}</span><span class="speaker">${escapeHtml(segment.speaker)}</span><button class="stamp" type="button" data-time="${segment.start}" aria-label="Play from ${clock(segment.start)}">${clock(segment.start)}</button></div><p class="text" data-time="${segment.start}">${words.join('')}</p></div>`;
      })
      .join('');
    this.#active = -1;
    this.#lastTop = null;
  }

  #paintSpeed() {
    const rate = SPEEDS[this.#speed];
    const chip = this.query('.speed');
    chip.textContent = `${rate}×`;
    chip.ariaLabel = `Playback speed ${rate}x`;
  }

  #paintTime() {
    const duration = this.#duration;
    this.query('.now').textContent = clock(this.#time);
    this.query('.fill').style.scale = `${this.#time / duration} 1`;
    const seek = this.query('.seek');
    seek.ariaValueNow = String(Math.round(this.#time));
    seek.ariaValueText = `${clock(this.#time)} of ${clock(duration)}`;
    // The last word that has started, or -1 before the first.
    let active = this.#words.findIndex((word) => word.start > this.#time);
    active = (active === -1 ? this.#words.length : active) - 1;
    if (active === this.#active) return;
    // Only the words between the old and new spoken word change.
    const words = this.shadowRoot.querySelectorAll('.text span');
    for (let i = Math.max(0, Math.min(active, this.#active) + 1); i <= Math.max(active, this.#active); i++) words[i]?.toggleAttribute('data-spoken', i <= active);
    this.#active = active;
    this.#paintMark();
    this.#checkAway();
  }

  // One highlight slides from word to word; it jumps, unanimated, to a new line.
  #paintMark() {
    const mark = this.query('.mark');
    const word = this.#activeWord;
    if (!word) {
      mark.style.opacity = '0';
      this.#lastTop = null;
      return;
    }
    const sameLine = this.#lastTop === word.offsetTop;
    mark.style.transition = sameLine && !reducedMotion.matches ? `translate ${SLIDE}, width ${SLIDE}, opacity 150ms ease-out` : 'opacity 150ms ease-out';
    // The trailing space is part of the span; leave it out of the mark.
    const space = Number.parseFloat(getComputedStyle(word).fontSize) * 0.28;
    mark.style.translate = `${word.offsetLeft - 3}px ${word.offsetTop}px`;
    mark.style.width = `${word.offsetWidth - space + 6}px`;
    mark.style.height = `${word.offsetHeight}px`;
    mark.style.opacity = '1';
    if (!sameLine && this.#following) this.#scrollTo(word, this.#lastTop !== null);
    this.#lastTop = word.offsetTop;
  }

  get #activeWord() {
    return this.#active < 0 ? null : this.query(`.text [data-index="${this.#active}"]`);
  }

  // Keeps the spoken line a third of the way down.
  #scrollTo(word, smooth) {
    const box = this.query('.scroll');
    const top = box.scrollTop + word.getBoundingClientRect().top - box.getBoundingClientRect().top - box.clientHeight / 3;
    box.scrollTo({ top, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto' });
  }

  // When the reader scrolls away, Back to now points to the spoken word.
  #checkAway() {
    const word = this.#activeWord;
    let away = null;
    if (word && !this.#following) {
      const at = word.getBoundingClientRect();
      const view = this.query('.scroll').getBoundingClientRect();
      away = at.bottom < view.top ? 'up' : at.top > view.bottom ? 'down' : null;
    }
    const button = this.query('.back-to-now');
    if (away) button.querySelector('.arrow').innerHTML = strokeIcon(away === 'up' ? arrowUp : arrowDown, 14);
    button.toggleAttribute('data-shown', Boolean(away));
    button.tabIndex = away ? 0 : -1;
  }

  #follow() {
    this.#following = true;
    this.#checkAway();
    const word = this.#activeWord;
    if (word) this.#scrollTo(word, true);
  }

  #seek(time) {
    this.#time = clamp(time, 0, this.#duration);
    this.#following = true;
    this.#paintTime();
    this.emit('time', { time: this.#time });
  }

  // A word plays from that word; a timestamp or a key press, from the paragraph.
  #jump(event) {
    const word = event.target.closest('[data-index]');
    const target = event.target.closest('[data-time]');
    if (word) this.#seek(this.#words[Number(word.dataset.index)].start);
    else if (target) this.#seek(Number(target.dataset.time));
  }

  #seekAt(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    this.#seek(((event.clientX - rect.left) / rect.width) * this.#duration);
  }

  #key(event) {
    if (event.key === ' ') {
      event.preventDefault();
      this.#toggle();
      return;
    }
    const move = { ArrowLeft: -KEY_STEP, ArrowDown: -KEY_STEP, ArrowRight: KEY_STEP, ArrowUp: KEY_STEP, Home: -Infinity, End: Infinity }[event.key];
    if (move === undefined) return;
    event.preventDefault();
    this.#seek(this.#time + move);
  }

  // ---- Playback ----

  #toggle() {
    if (this.#playing) return this.#stop();
    if (this.#time >= this.#duration) this.#seek(0);
    this.#playing = true;
    this.#last = performance.now();
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
    this.#paintPlay();
  }

  #tick(now) {
    const time = Math.min(this.#duration, this.#time + ((now - this.#last) / 1000) * SPEEDS[this.#speed]);
    this.#last = now;
    this.#time = time;
    this.#paintTime();
    this.emit('time', { time });
    if (time >= this.#duration) this.#stop();
    else this.#frame = requestAnimationFrame((next) => this.#tick(next));
  }

  #stop() {
    if (!this.#playing) return;
    this.#playing = false;
    cancelAnimationFrame(this.#frame);
    this.#paintPlay();
  }

  #paintPlay() {
    const button = this.query('.play');
    button.ariaLabel = this.#playing ? 'Pause' : 'Play';
    button.innerHTML = strokeIcon(this.#playing ? pause : play, 16);
  }
}
