import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { pause, play, rotateCcw, rotateCw } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { initialsOf } from '../../core/people.js';
import styles from './audio-player-card.scss?inline';

const BARS = 64;
const SPEEDS = [1, 1.25, 1.5, 2, 0.75];
const BACK = 15;
const FORWARD = 30;
const KEY_STEP = 5;

const DEMO_CHAPTERS = [
  { time: 0, title: 'Intro' },
  { time: 142, title: 'Why motion matters' },
  { time: 528, title: 'Springs, not curves' },
  { time: 1015, title: 'Interruptible by default' },
  { time: 1460, title: 'Questions from listeners' },
];

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

const clock = (seconds) => {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rest = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${rest}` : `${m}:${rest}`;
};

// A waveform that looks like speech: bursts and pauses, the same every time
// for the same title.
const waveform = (seed) => {
  let state = [...seed].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 2_147_483_647, 7) || 7;
  const random = () => {
    state = (state * 16_807) % 2_147_483_647;
    return state / 2_147_483_647;
  };
  return Array.from({ length: BARS }, (_, i) => {
    const phrase = 0.55 + 0.45 * Math.sin(i / 3.1 + random());
    return Math.max(0.12, Math.min(1, phrase * (0.45 + random() * 0.6)));
  });
};

/**
 * A podcast or voice note player. Scrub the waveform to seek, with a tooltip
 * naming the chapter under the pointer; chapters are marked above it. Skip
 * back 15 s or ahead 30 s, and tap the speed chip to cycle the playback
 * rate. The waveform is a slider for the keyboard.
 *
 * With `src` it plays that audio; without, playback is simulated over
 * `duration`, for demos. Chapters are `{ time, title }`, in seconds.
 *
 * @attr {string} heading - The episode or note's title
 * @attr {string} show - Who it is from
 * @attr {string} src - Audio to play
 * @attr {number} duration - Length in seconds, without `src`
 * @attr {Array<object>} chapters - The chapters (JSON)
 * @fires lw-play - Playback started
 * @fires lw-pause - Playback paused
 */
export class LwAudioPlayerCard extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Designing for motion' },
    show: { default: 'Lowersoft Radio · Episode 42' },
    src: { default: '' },
    duration: { type: Number, default: 1860 },
    chapters: { type: Object, default: DEMO_CHAPTERS },
  };

  #audio = null;
  #time = 0;
  #playing = false;
  #speed = 0;
  #last = 0;
  #frame = 0;
  #scrubbing = null;

  render() {
    return `<div class="top"><span class="cover" aria-hidden="true"></span><div class="titles"><p class="heading"></p><p class="show"></p></div></div>
<div class="wave" role="slider" tabindex="0" aria-valuemin="0"><div class="marks"></div><div class="bars"></div><span class="tip" hidden></span></div>
<div class="times"><span class="elapsed"></span><span class="chapter"></span><span class="remaining"></span></div>
<div class="controls"><button class="speed" type="button"></button><button class="back" type="button" aria-label="Back ${BACK} seconds">${strokeIcon(rotateCcw, 20)}<span>${BACK}</span></button><button class="play" type="button" aria-label="Play"><span class="icon play-icon">${strokeIcon(play, 20)}</span><span class="icon pause-icon">${strokeIcon(pause, 20)}</span></button><button class="forward" type="button" aria-label="Forward ${FORWARD} seconds">${strokeIcon(rotateCw, 20)}<span>${FORWARD}</span></button><span class="spacer"></span></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.play').addEventListener('click', () => this.#toggle(), options);
    this.query('.back').addEventListener('click', () => this.#seek(this.#time - BACK), options);
    this.query('.forward').addEventListener('click', () => this.#seek(this.#time + FORWARD), options);
    this.query('.speed').addEventListener('click', () => this.#cycleSpeed(), options);
    const wave = this.query('.wave');
    wave.addEventListener('pointerdown', (event) => this.#down(event), options);
    wave.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) wave.addEventListener(type, () => (this.#scrubbing = null), options);
    wave.addEventListener('pointerleave', () => (this.query('.tip').hidden = true), options);
    wave.addEventListener('keydown', (event) => this.#key(event), options);
    this.signal.addEventListener('abort', () => {
      this.#pause();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
  }

  updated(changed) {
    if (changed.has('src')) this.#useAudio();
    if (changed.has('heading')) {
      this.query('.bars').innerHTML = waveform(this.heading ?? '').map((h) => `<span style="height: ${(h * 100).toFixed(1)}%"></span>`).join('');
      this.query('.cover').textContent = initialsOf(this.heading ?? '');
    }
    this.query('.heading').textContent = this.heading ?? '';
    this.query('.show').textContent = this.show ?? '';
    this.#paint();
  }

  get #duration() {
    return this.#audio && Number.isFinite(this.#audio.duration) ? this.#audio.duration : this.duration;
  }

  get #chapters() {
    return [...(this.chapters ?? [])].sort((a, b) => a.time - b.time);
  }

  #chapterAt(time) {
    return this.#chapters.findLast((chapter) => chapter.time <= time);
  }

  #useAudio() {
    this.#pause();
    this.#audio = this.src ? new Audio(this.src) : null;
    if (!this.#audio) return;
    this.#audio.preload = 'metadata';
    this.#audio.playbackRate = SPEEDS[this.#speed];
    const sync = () => {
      this.#time = this.#audio.currentTime;
      this.#paint();
    };
    for (const type of ['timeupdate', 'loadedmetadata', 'seeked']) this.#audio.addEventListener(type, sync, { signal: this.signal });
    this.#audio.addEventListener('ended', () => this.#pause(), { signal: this.signal });
  }

  // ---- Playback ----

  #toggle() {
    if (this.#playing) this.#pause();
    else this.#play();
  }

  #play() {
    if (this.#time >= this.#duration) this.#time = 0;
    this.#playing = true;
    if (this.#audio) {
      this.#audio.currentTime = this.#time;
      this.#audio.play().catch(() => this.#pause());
    }
    this.#last = performance.now();
    this.#frame ||= requestAnimationFrame((now) => this.#tick(now));
    this.#paint();
    this.emit('play');
  }

  #pause() {
    if (!this.#playing) return;
    this.#playing = false;
    this.#audio?.pause();
    this.#paint();
    this.emit('pause');
  }

  // Simulated playback advances with the clock; real audio reports itself.
  #tick(now) {
    this.#frame = 0;
    if (!this.#playing) return;
    if (!this.#audio) {
      this.#time = Math.min(this.#duration, this.#time + ((now - this.#last) / 1000) * SPEEDS[this.#speed]);
      if (this.#time >= this.#duration) this.#pause();
    }
    this.#last = now;
    this.#paint();
    if (this.#playing) this.#frame = requestAnimationFrame((next) => this.#tick(next));
  }

  #seek(time) {
    this.#time = clamp(time, 0, this.#duration);
    if (this.#audio) this.#audio.currentTime = this.#time;
    this.#paint();
  }

  #cycleSpeed() {
    this.#speed = (this.#speed + 1) % SPEEDS.length;
    if (this.#audio) this.#audio.playbackRate = SPEEDS[this.#speed];
    const chip = this.query('.speed');
    if (!reducedMotion.matches) chip.animate([{ scale: 0.88 }, { scale: 1 }], { duration: 220, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
    this.#paint();
  }

  // ---- Painting ----

  #paint() {
    const duration = this.#duration;
    const progress = duration ? this.#time / duration : 0;
    const played = Math.round(progress * BARS);
    [...this.query('.bars').children].forEach((bar, i) => bar.toggleAttribute('data-played', i < played));
    this.query('.marks').innerHTML = this.#chapters
      .filter(({ time }) => time > 0)
      .map(({ time }) => `<span style="left: ${((time / duration) * 100).toFixed(2)}%"></span>`)
      .join('');
    this.query('.elapsed').textContent = clock(this.#time);
    this.query('.remaining').textContent = `-${clock(duration - this.#time)}`;
    const chapter = this.#chapterAt(this.#time);
    this.query('.chapter').textContent = chapter?.title ?? '';
    const button = this.query('.play');
    button.toggleAttribute('data-playing', this.#playing);
    button.ariaLabel = this.#playing ? 'Pause' : 'Play';
    const speed = SPEEDS[this.#speed];
    this.query('.speed').textContent = `${speed}×`;
    this.query('.speed').ariaLabel = `Playback speed ${speed}×. Change`;
    const wave = this.query('.wave');
    wave.ariaLabel = `${this.heading}, seek`;
    wave.ariaValueMax = String(Math.round(duration));
    wave.ariaValueNow = String(Math.round(this.#time));
    wave.ariaValueText = `${clock(this.#time)} of ${clock(duration)}${chapter ? `, ${chapter.title}` : ''}`;
  }

  // ---- Scrubbing ----

  #timeAt(clientX) {
    const rect = this.query('.bars').getBoundingClientRect();
    return clamp((clientX - rect.left) / rect.width, 0, 1) * this.#duration;
  }

  // The tooltip names the chapter and time under the pointer.
  #showTip(clientX) {
    const rect = this.query('.bars').getBoundingClientRect();
    const time = this.#timeAt(clientX);
    const chapter = this.#chapterAt(time);
    const tip = this.query('.tip');
    tip.innerHTML = `${chapter ? `<b>${escapeHtml(chapter.title)}</b>` : ''}<span>${clock(time)}</span>`;
    tip.style.left = `${clamp(clientX - rect.left, 0, rect.width)}px`;
    tip.hidden = false;
  }

  #down(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    this.#scrubbing = event.pointerId;
    this.#seek(this.#timeAt(event.clientX));
    this.#showTip(event.clientX);
  }

  #move(event) {
    if (event.pointerType === 'mouse' || this.#scrubbing === event.pointerId) this.#showTip(event.clientX);
    if (this.#scrubbing === event.pointerId) this.#seek(this.#timeAt(event.clientX));
  }

  #key(event) {
    const step = event.shiftKey ? KEY_STEP * 3 : KEY_STEP;
    const moves = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step };
    if (event.key in moves) this.#seek(this.#time + moves[event.key]);
    else if (event.key === 'Home') this.#seek(0);
    else if (event.key === 'End') this.#seek(this.#duration);
    else if (event.key === ' ' || event.key === 'k') this.#toggle();
    else return;
    event.preventDefault();
  }
}
