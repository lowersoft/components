import { strokeIcon } from '../../core/icons.js';
import { pause, play } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import styles from './clip-trimmer.scss?inline';

const FRAMES = 10;
// Handles pull to whole seconds within this many px.
const SNAP_PX = 5;
// A longer, labelled tick every this many seconds, like a tape ruler.
const LABEL_EVERY = 5;
const DRAG_PX = 3;

const PANORAMA = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2400&h=800&fit=crop&auto=format&q=80';

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

const clock = (seconds) => {
  const tenths = Math.round(seconds * 10);
  const whole = Math.floor(tenths / 10);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}.${tenths % 10}`;
};

/**
 * A video clip trimmer. Drag either handle to cut the start or the end
 * (handles pull onto whole seconds, and the ruler lights the one they
 * snapped to), drag the kept range to slide it, and tap the strip to move
 * the playhead. Playback loops inside the kept range. Each handle is a
 * slider: arrows step 0.1 s, Shift+arrows 1 s.
 *
 * The demo pans a wide image to stand in for footage.
 *
 * @attr {string} src - A wide image the preview and filmstrip pan across
 * @attr {string} alt - Describes the image
 * @attr {number} duration - Clip length in seconds
 * @attr {number} start - Where the kept range starts, in seconds
 * @attr {number} end - Where the kept range ends, in seconds
 * @attr {number} min-length - The shortest clip you can trim to, in seconds
 * @fires lw-change - The kept range changed; `detail: { start, end }`
 */
export class LwClipTrimmer extends LwElement {
  static styles = styles;
  static props = {
    src: { default: PANORAMA },
    alt: { default: 'A valley road at dusk' },
    duration: { type: Number, default: 12 },
    start: { type: Number, default: 2.4 },
    end: { type: Number, default: 9 },
    minLength: { type: Number, default: 1 },
  };

  #time = 2.4;
  #playing = false;
  #frame = 0;
  #last = 0;
  #drag = null;

  render() {
    return `<div class="preview"><img class="shot" alt="" draggable="false"><span class="clock"></span><button class="play" type="button" aria-label="Play">${strokeIcon(play, 14)}</button></div>
<div class="track"><div class="strip">
<div class="frames">${'<span></span>'.repeat(FRAMES)}</div>
<div class="cut" aria-hidden="true"><span class="before"></span><span class="after"></span></div>
<div class="playhead" aria-hidden="true"></div>
<div class="range" data-part="range">${['start', 'end'].map((part) => `<div class="handle ${part}" data-part="${part}" role="slider" tabindex="0" aria-label="Trim ${part}" aria-valuemin="0"><span class="grip"></span><span class="tip"></span></div>`).join('')}</div>
</div><div class="ruler" aria-hidden="true"></div></div>
<div class="foot"><p class="length"><b></b> of <span class="total"></span></p><lw-button class="reset" variant="ghost" size="sm">Reset</lw-button></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const strip = this.query('.strip');
    strip.addEventListener('pointerdown', (event) => this.#down(event), options);
    strip.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) strip.addEventListener(type, (event) => this.#up(event), options);
    for (const handle of this.shadowRoot.querySelectorAll('.handle')) handle.addEventListener('keydown', (event) => this.#key(event, handle.dataset.part), options);
    this.query('.play').addEventListener('click', () => this.#toggle(), options);
    this.query('.reset').addEventListener('click', () => this.#setRange(0, this.duration), options);
    this.signal.addEventListener('abort', () => this.#stop());
  }

  updated(changed) {
    if (changed.has('src')) {
      this.query('.shot').src = this.src;
      this.style.setProperty('--_src', `url(${JSON.stringify(this.src)})`);
    }
    if (changed.has('alt')) this.query('.shot').alt = this.alt ?? '';
    if (changed.has('duration')) this.#buildRuler();
    // Keep the range valid for the duration and the shortest length.
    const end = clamp(this.end, Math.min(this.minLength, this.duration), this.duration);
    const start = clamp(this.start, 0, end - Math.min(this.minLength, end));
    if (start !== this.start || end !== this.end) {
      this.start = start;
      this.end = end;
      return;
    }
    this.#time = clamp(this.#time, this.start, this.end);
    this.#paint();
  }

  #buildRuler() {
    const seconds = Array.from({ length: Math.floor(this.duration) + 1 }, (_, s) => s);
    this.query('.ruler').innerHTML = seconds
      .map((s) => `<span data-second="${s}"${s % LABEL_EVERY ? '' : ' data-label'} style="--_at: ${s / this.duration}">${s % LABEL_EVERY ? '' : `<i>${s}s</i>`}</span>`)
      .join('');
  }

  #paint() {
    const { duration, start, end } = this;
    this.style.setProperty('--_start', String(start / duration));
    this.style.setProperty('--_end', String(end / duration));
    for (const part of ['start', 'end']) {
      const handle = this.query(`.handle.${part}`);
      handle.ariaValueMax = String(duration);
      handle.ariaValueNow = String(Math.round(this[part] * 10) / 10);
      handle.ariaValueText = `${this[part].toFixed(1)} seconds`;
      handle.querySelector('.tip').textContent = clock(this[part]);
    }
    this.query('.length b').textContent = `${(end - start).toFixed(1)}s`;
    this.query('.total').textContent = `${duration.toFixed(1)}s`;
    this.query('.reset').disabled = start === 0 && end === duration;
    this.#paintTime();
  }

  // The preview pans to the frame at the playhead.
  #paintTime() {
    const at = this.#time / this.duration;
    this.style.setProperty('--_time', String(at));
    this.query('.shot').style.objectPosition = `${at * 100}% 50%`;
    this.query('.clock').textContent = clock(this.#time);
  }

  #setRange(start, end) {
    if (start === this.start && end === this.end) return;
    this.start = start;
    this.end = end;
    this.emit('change', { start, end });
  }

  #seek(time) {
    this.#time = clamp(time, this.start, this.end);
    this.#paintTime();
  }

  // ---- Playback: loops inside the kept range ----

  #toggle() {
    if (this.#playing) return this.#stop();
    if (this.#time >= this.end - 0.05) this.#seek(this.start);
    this.#playing = true;
    this.#last = performance.now();
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
    this.#paintButton();
  }

  #tick(now) {
    let next = this.#time + (now - this.#last) / 1000;
    this.#last = now;
    if (next >= this.end || next < this.start) next = this.start;
    this.#seek(next);
    this.#frame = requestAnimationFrame((time) => this.#tick(time));
  }

  #stop() {
    if (!this.#playing) return;
    this.#playing = false;
    cancelAnimationFrame(this.#frame);
    this.#paintButton();
  }

  #paintButton() {
    const button = this.query('.play');
    button.ariaLabel = this.#playing ? 'Pause' : 'Play';
    button.innerHTML = strokeIcon(this.#playing ? pause : play, 14);
  }

  // ---- Dragging ----

  get #pxPerSecond() {
    return this.query('.strip').getBoundingClientRect().width / this.duration;
  }

  #secondsAt(clientX) {
    const rect = this.query('.strip').getBoundingClientRect();
    return clamp(((clientX - rect.left) / rect.width) * this.duration, 0, this.duration);
  }

  // A handle near a whole second pulls onto it, like a magnet.
  #snap(time) {
    const whole = Math.round(time);
    const snapped = Math.abs(whole - time) * this.#pxPerSecond < SNAP_PX;
    this.#markSnap(snapped ? whole : null);
    return snapped ? whole : time;
  }

  // The ruler lights the second a handle snapped to.
  #markSnap(second) {
    for (const tick of this.shadowRoot.querySelectorAll('.ruler span')) tick.toggleAttribute('data-snapped', Number(tick.dataset.second) === second);
  }

  #trim(part, time) {
    const { start, end, minLength, duration } = this;
    const next = part === 'start' ? [clamp(time, 0, end - minLength), end] : [start, clamp(time, start + minLength, duration)];
    this.#setRange(...next);
    // The preview shows the frame you're cutting at.
    this.#time = part === 'start' ? next[0] : next[1];
    this.#paintTime();
  }

  #down(event) {
    if (!event.isPrimary || event.button !== 0 || this.#drag) return;
    const part = event.target.closest('[data-part]')?.dataset.part ?? 'seek';
    event.currentTarget.setPointerCapture(event.pointerId);
    this.#drag = { part, x: event.clientX, start: this.start, end: this.end, moved: false };
    this.dataset.active = part;
    if (part === 'start' || part === 'end') {
      this.#stop();
      event.target.closest('.handle').focus();
    } else if (part === 'seek') this.#seek(this.#secondsAt(event.clientX));
  }

  #move(event) {
    const drag = this.#drag;
    if (!drag) return;
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > DRAG_PX) drag.moved = true;
    if (drag.part === 'start' || drag.part === 'end') this.#trim(drag.part, this.#snap(drag[drag.part] + dx / this.#pxPerSecond));
    else if (drag.part === 'range' && drag.moved) {
      const length = drag.end - drag.start;
      const start = clamp(drag.start + dx / this.#pxPerSecond, 0, this.duration - length);
      this.#setRange(start, start + length);
      this.#time = clamp(this.#time, start, start + length);
      this.#paintTime();
    } else if (drag.part === 'seek') this.#seek(this.#secondsAt(event.clientX));
  }

  #up(event) {
    const drag = this.#drag;
    if (!drag) return;
    this.#drag = null;
    // A tap inside the kept range moves the playhead.
    if (drag.part === 'range' && !drag.moved) this.#seek(this.#secondsAt(event.clientX));
    if (drag.part === 'start' || drag.part === 'end') this.#seek(this.start);
    delete this.dataset.active;
    this.#markSnap(null);
  }

  #key(event, part) {
    const step = event.shiftKey ? 1 : 0.1;
    const move = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step, Home: -this.duration, End: this.duration }[event.key];
    if (move === undefined) return;
    event.preventDefault();
    this.#trim(part, Math.round((this[part] + move) * 10) / 10);
  }
}
