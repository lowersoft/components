import { strokeIcon } from '../../core/icons.js';
import { rotateCcw, wandSparkles } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo } from '../../core/motion.js';
import '../button/index.js';
import styles from './photo-straighten.scss?inline';

const MAX = 45;
// Ruler spacing: px per degree.
const PX = 9;
// A throw keeps going for this long, in seconds of its release speed.
const THROW = 0.18;
// Releases this close to level land on 0.
const SNAP = 0.6;
const SETTLE = springFeel(0.45, 0.1);
const SAMPLES = 5;
// Lines at each sixth, both ways.
const GRID = ['x', 'y'].map((axis) => [1, 2, 3, 4, 5].map((i) => `<span data-axis="${axis}"${i % 2 ? '' : ' data-third'} style="--_at: ${i / 6}"></span>`).join('')).join('');
const PHOTO = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&h=1200&fit=crop&auto=format&q=80';

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
const tenth = (value) => Math.round(value * 10) / 10;

// Past the end of the ruler it still moves, with growing resistance.
const rubber = (angle) => {
  if (Math.abs(angle) <= MAX) return angle;
  return Math.sign(angle) * (MAX + 3 * (1 - Math.exp(-(Math.abs(angle) - MAX) / 6)));
};

const formatAngle = (angle) => {
  const value = tenth(angle);
  return value === 0 ? '0°' : `${value > 0 ? '+' : '−'}${Math.abs(value).toFixed(1)}°`;
};

/**
 * Straightens a crooked photo with a dial ruler. Drag or throw the ruler
 * and the photo turns, growing just enough that the crop never shows a
 * corner; a grid appears to line the horizon up against. Auto corrects the
 * tilt, double-click or Home resets, and arrows step 0.1°, Shift+arrows 1°.
 *
 * @attr {string} src
 * @attr {string} alt - Describes the image
 * @attr {number} aspect-ratio - Width over height of the crop
 * @attr {number} tilt - How crooked the photo is, in degrees; what Auto corrects
 * @attr {number} angle - The correction, in degrees
 * @fires lw-change - The correction changed; `detail: { angle }`
 */
export class LwPhotoStraighten extends LwElement {
  static styles = styles;
  static props = {
    src: { default: PHOTO },
    alt: { default: 'A lake below mountains' },
    aspectRatio: { type: Number, default: 4 / 3 },
    tilt: { type: Number, default: 4.2 },
    angle: { type: Number, default: 0 },
  };

  // The live angle; `angle` holds it to a tenth of a degree.
  #angle = 0;
  #settle = null;
  #drag = null;

  render() {
    return `<div class="frame"><img class="photo" draggable="false"><div class="grid" aria-hidden="true">${GRID}</div><span class="badge"></span></div>
<div class="tools"><lw-button class="auto" variant="ghost" size="sm"><span slot="start">${strokeIcon(wandSparkles, 14)}</span>Auto</lw-button><span class="value"></span><lw-button class="reset" variant="ghost" size="sm"><span slot="start">${strokeIcon(rotateCcw, 14)}</span>Reset</lw-button></div>
<div class="dial" role="slider" tabindex="0" aria-label="Straighten" aria-valuemin="${-MAX}" aria-valuemax="${MAX}"><div class="ruler">${this.#ticks()}</div><span class="needle" aria-hidden="true"></span></div>`;
  }

  #ticks() {
    return Array.from({ length: MAX * 2 + 1 }, (_, i) => {
      const deg = i - MAX;
      const kind = deg === 0 ? ' data-zero' : deg % 5 === 0 ? ' data-major' : '';
      return `<span style="left: ${i * PX}px"${kind}>${deg % 15 === 0 ? `<i>${deg}</i>` : ''}</span>`;
    }).join('');
  }

  connected() {
    const options = { signal: this.signal };
    const dial = this.query('.dial');
    dial.addEventListener('pointerdown', (event) => this.#down(event), options);
    dial.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) dial.addEventListener(type, (event) => this.#up(event), options);
    dial.addEventListener('dblclick', () => this.#settleTo(0), options);
    dial.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.auto').addEventListener('click', () => this.#settleTo(-this.tilt), options);
    this.query('.reset').addEventListener('click', () => this.#settleTo(0), options);
    this.signal.addEventListener('abort', () => this.#settle?.());
  }

  updated(changed) {
    const photo = this.query('.photo');
    if (changed.has('src')) photo.src = this.src;
    photo.alt = this.alt ?? '';
    this.query('.frame').style.aspectRatio = String(this.aspectRatio);
    // Set from outside: jump there.
    if (this.angle !== this.#value) {
      this.#settle?.();
      this.#angle = this.angle;
    }
    this.#paint();
  }

  get #value() {
    return tenth(clamp(this.#angle, -MAX, MAX));
  }

  #set(angle) {
    this.#angle = angle;
    const value = this.#value;
    if (value !== this.angle) {
      this.angle = value;
      this.emit('change', { angle: value });
    }
    this.#paint();
  }

  // The photo turns by its own tilt plus the correction, and grows just
  // enough that no corner of the crop ever shows a gap.
  #paint() {
    const turn = this.tilt + this.#angle;
    const rad = (Math.abs(turn) * Math.PI) / 180;
    const ratio = Math.max(this.aspectRatio, 1 / this.aspectRatio);
    this.query('.photo').style.transform = `rotate(${turn}deg) scale(${Math.cos(rad) + ratio * Math.sin(rad)})`;
    this.query('.ruler').style.translate = `${-(this.#angle + MAX) * PX}px 0`;
    const value = this.#value;
    const level = Math.abs(this.tilt + value) < 0.05;
    this.toggleAttribute('data-level', level);
    this.query('.badge').textContent = level ? 'Level' : 'Crooked';
    this.query('.value').textContent = formatAngle(value);
    const dial = this.query('.dial');
    dial.ariaValueNow = String(value);
    dial.ariaValueText = formatAngle(value);
    this.query('.reset').disabled = value === 0;
  }

  #settleTo(to) {
    this.#settle?.();
    if (reducedMotion.matches) {
      this.#set(to);
      this.toggleAttribute('data-adjusting', false);
      return;
    }
    this.toggleAttribute('data-adjusting', true);
    this.#settle = springTo(this.#angle, to, {
      ...SETTLE,
      update: (angle) => this.#set(angle),
      done: () => {
        this.#settle = null;
        if (!this.#drag) this.toggleAttribute('data-adjusting', false);
      },
    });
  }

  #down(event) {
    if (!event.isPrimary || event.button !== 0 || this.#drag) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    this.#settle?.();
    this.#drag = { x: event.clientX, from: this.#angle, samples: [{ x: event.clientX, t: event.timeStamp }] };
    this.toggleAttribute('data-adjusting', true);
  }

  #move(event) {
    const drag = this.#drag;
    if (!drag) return;
    // Dragging the ruler left turns the photo clockwise, like a dial.
    this.#set(rubber(drag.from - (event.clientX - drag.x) / PX));
    drag.samples.push({ x: event.clientX, t: event.timeStamp });
    if (drag.samples.length > SAMPLES) drag.samples.shift();
  }

  #up(event) {
    const drag = this.#drag;
    if (!drag) return;
    this.#drag = null;
    const [first] = drag.samples;
    const dt = (event.timeStamp - first.t) / 1000;
    // Degrees per second at release, from the last few moves.
    const velocity = dt > 0 && dt < 0.15 ? -(event.clientX - first.x) / PX / dt : 0;
    const to = clamp(this.#angle + velocity * THROW, -MAX, MAX);
    this.#settleTo(Math.abs(to) < SNAP ? 0 : tenth(to));
  }

  #key(event) {
    if (event.key === 'Home' || event.key === '0') {
      event.preventDefault();
      this.#settleTo(0);
      return;
    }
    const step = event.shiftKey ? 1 : 0.1;
    const move = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step }[event.key];
    if (move === undefined) return;
    event.preventDefault();
    this.#settle?.();
    this.#set(clamp(tenth(this.#angle + move), -MAX, MAX));
  }
}
