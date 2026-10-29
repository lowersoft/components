import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { graphemes } from '../../core/text.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './plucked-text.scss?inline';
import { createModes, displacement, energy, modeBasis, pullModes, slopeBasis, soften, stepMode } from './string.js';

// Sample spacing along the drawn string, in px.
const STEP = 6;
// Displacement flattens out past this fraction of the font size, so a hard
// pull bends the line without throwing letters off it.
const MAX_SWING = 0.6;
// How much of a sweep's vertical speed reaches the string.
const STRUM_GAIN = 0.55;
const MAX_STRUM_SPEED = 2400;
// Below this energy the string is at rest and the loop stops.
const REST_ENERGY = 0.02;
// Letters tilt with the string, a little less than its full slope.
const TILT = 0.85;
// With reduced motion a released string eases back flat in this long.
const EASE_BACK = 260;

/**
 * A line of text sitting on a string pinned at both ends. Drag it to pull
 * the string and let go to pluck it; sweep the mouse across it to strum. It
 * rings with real string physics, high overtones dying first, and the letters
 * ride and tilt with it. It strums once softly the first time it shows.
 * With reduced motion it does not ring: a released string eases back flat.
 *
 * Set the text as content or with `text`; keep it to one line.
 *
 * @attr {string} text - The string to show; when set, the content is ignored
 * @attr {number} tension - How taut the string is; higher rings faster and settles sooner
 * @attr {boolean} no-strum - Only a drag moves the string, not a sweep of the mouse
 * @csspart base - The box the string spans
 * @csspart string
 */
export class LwPluckedText extends LwElement {
  static styles = styles;
  static props = {
    text: {},
    tension: { type: Number, default: 1 },
    noStrum: { type: Boolean },
  };

  #letters = [];
  #modes = [];
  #length = 0;
  #swing = 0;
  // Precomputed mode shapes at every path sample and letter.
  #pathBasis = [];
  #letterBasis = [];
  #lastPath = '';
  #frame = 0;
  #last = 0;
  #visible = false;
  #greeted = false;
  // A grab holds the string in a V; a release eases it back with reduced
  // motion; the last pointer position notices a sweep across the line.
  #grab = null;
  #release = null;
  #prev = null;

  render() {
    return `<span class="live"></span><span class="stage" part="base"><span class="letters" aria-hidden="true"></span><svg class="string" part="string" aria-hidden="true"><path class="ghost"></path><path class="line"></path></svg><span class="peg"></span><span class="peg end"></span></span>`;
  }

  connected() {
    const options = { signal: this.signal };
    const stage = this.query('.stage');
    const content = new MutationObserver(() => this.#readText());
    content.observe(this, { childList: true, subtree: true, characterData: true });
    const resize = new ResizeObserver(() => this.#measure());
    resize.observe(stage);
    // Letter widths change when a web font arrives.
    document.fonts?.ready.then(() => this.isConnected && this.#measure());
    watchVisibility(
      this,
      (visible) => {
        this.#visible = visible;
        if (!visible) return;
        // One soft strum the first time it shows, so it shows it can move.
        if (!this.#greeted && !reducedMotion.matches && this.#length) {
          pullModes(this.#modes, this.#length, this.#length * 0.3, -this.#swing * 0.5);
        }
        this.#greeted = true;
        this.#start();
      },
      this.signal,
    );
    stage.addEventListener('pointerdown', (event) => this.#down(event), options);
    stage.addEventListener('pointermove', (event) => this.#move(event), options);
    stage.addEventListener('pointerup', (event) => this.#up(event), options);
    stage.addEventListener('pointercancel', (event) => this.#up(event), options);
    stage.addEventListener('pointerleave', () => (this.#prev = null), options);
    this.signal.addEventListener('abort', () => {
      content.disconnect();
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
      this.#grab = null;
      this.#release = null;
    });
    this.#readText();
  }

  updated(changed) {
    if (changed.has('text')) this.#readText();
    else if (changed.has('tension')) this.#measure();
  }

  #readText() {
    if (!this.isConnected) return;
    const text = this.text ?? this.textContent.trim();
    this.query('.live').textContent = text;
    const letters = graphemes(text).map((char) => Object.assign(document.createElement('span'), { className: 'letter', textContent: char }));
    // An empty inline-block rests its bottom edge on the baseline.
    const probe = Object.assign(document.createElement('span'), { className: 'probe' });
    this.query('.letters').replaceChildren(...letters, probe);
    this.#letters = letters;
    this.#measure();
  }

  #measure() {
    const stage = this.query('.stage');
    const lettersBox = this.query('.letters');
    const probe = lettersBox.lastElementChild;
    stage.style.setProperty('--_baseline', `${lettersBox.offsetTop + probe.offsetTop + probe.offsetHeight}px`);
    const svgBox = this.query('.string').getBoundingClientRect();
    const length = svgBox.width;
    this.#length = length;
    if (length < 2) {
      this.#pathBasis = [];
      this.#letterBasis = [];
      return;
    }
    this.#swing = Number.parseFloat(getComputedStyle(stage).fontSize) * MAX_SWING;
    const modes = createModes(length, this.tension > 0 ? this.tension : 1, this.#modes);
    this.#modes = modes;
    const samples = Math.ceil(length / STEP) + 1;
    this.#pathBasis = Array.from({ length: samples }, (_, i) => modeBasis(modes, length, Math.min(i * STEP, length)));
    const lettersLeft = lettersBox.getBoundingClientRect().left - svgBox.left;
    // Offsets ignore the transforms the loop applies.
    this.#letterBasis = this.#letters.map((letter) => {
      const x = lettersLeft + letter.offsetLeft + letter.offsetWidth / 2;
      return { shape: modeBasis(modes, length, x), slope: slopeBasis(modes, length, x) };
    });
    this.#draw();
  }

  #lineAt(x) {
    return soften(displacement(this.#modes, modeBasis(this.#modes, this.#length, x)), this.#swing);
  }

  #draw() {
    const modes = this.#modes;
    const swing = this.#swing;
    let d = '';
    this.#pathBasis.forEach((basis, i) => {
      const x = Math.min(i * STEP, this.#length);
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${soften(displacement(modes, basis), swing).toFixed(2)}`;
    });
    // The previous frame stays behind faintly: a vibrating string blurs.
    this.query('.ghost').setAttribute('d', this.#lastPath || d);
    this.query('.line').setAttribute('d', d);
    this.#lastPath = d;
    this.#letterBasis.forEach(({ shape, slope }, i) => {
      const raw = displacement(modes, shape);
      // The slope of the softened curve, so the tilt eases off with the swing.
      const t = Math.tanh(raw / swing);
      const angle = Math.atan(displacement(modes, slope) * (1 - t * t)) * TILT;
      this.#letters[i].style.transform = `translate3d(0, ${soften(raw, swing).toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad)`;
    });
  }

  #settle() {
    this.#modes.forEach((mode) => {
      mode.q = 0;
      mode.v = 0;
    });
  }

  #start() {
    if (this.#frame || !this.#visible || !this.isConnected) return;
    this.#last = 0;
    this.#frame = requestAnimationFrame(this.#tick);
  }

  #tick = (now) => {
    this.#frame = 0;
    if (!this.#visible) return;
    const dt = this.#last ? Math.min((now - this.#last) / 1000, 1 / 30) : 1 / 60;
    this.#last = now;
    if (this.#release) this.#easeBack(now);
    else if (!this.#grab) this.#modes.forEach((mode) => stepMode(mode, dt));
    this.#draw();
    if (this.#grab || this.#release || energy(this.#modes) > REST_ENERGY) {
      this.#frame = requestAnimationFrame(this.#tick);
      return;
    }
    this.#settle();
    this.#draw();
    this.query('.ghost').setAttribute('d', this.query('.line').getAttribute('d'));
  };

  #easeBack(now) {
    const { from, start } = this.#release;
    const t = Math.min((now - start) / EASE_BACK, 1);
    const left = (1 - t) ** 3;
    this.#modes.forEach((mode, index) => (mode.q = from[index] * left));
    if (t < 1) return;
    this.#release = null;
    this.#settle();
  }

  #local(event) {
    const box = this.query('.string').getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  }

  #down(event) {
    if (this.#grab || event.button !== 0 || this.#length < 2) return;
    const point = this.#local(event);
    if (point.x < 0 || point.x > this.#length) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    this.#release = null;
    this.#grab = { id: event.pointerId };
    this.toggleAttribute('data-grabbing', true);
    pullModes(this.#modes, this.#length, point.x, this.#lineAt(point.x));
    this.#start();
  }

  #move(event) {
    const point = this.#local(event);
    if (this.#grab?.id === event.pointerId) {
      // Follow the hand along the string, and up or down with a pull that
      // stiffens the further it goes.
      const x = Math.min(Math.max(point.x, 0), this.#length);
      pullModes(this.#modes, this.#length, x, soften(point.y, this.#swing * 1.6));
      this.#start();
      return;
    }
    if (this.noStrum || event.pointerType !== 'mouse' || reducedMotion.matches || this.#length < 2) {
      this.#prev = null;
      return;
    }
    const now = event.timeStamp;
    const prev = this.#prev;
    this.#prev = { ...point, t: now };
    if (!prev || point.x < 0 || point.x > this.#length) return;
    // Crossing the line since the last move strums it there, as hard as the
    // cursor was moving.
    const before = prev.y - this.#lineAt(prev.x);
    const after = point.y - this.#lineAt(point.x);
    if (before * after >= 0) return;
    const dt = Math.max(now - prev.t, 8) / 1000;
    const speed = Math.max(-MAX_STRUM_SPEED, Math.min(MAX_STRUM_SPEED, (point.y - prev.y) / dt));
    const where = prev.x + (point.x - prev.x) * (before / (before - after));
    this.#modes.forEach((mode, index) => {
      const n = index + 1;
      mode.v += ((STRUM_GAIN * speed * 80) / this.#length) * Math.sin((n * Math.PI * where) / this.#length) * Math.exp(-((n / 14) ** 2));
    });
    this.#start();
  }

  #up(event) {
    if (this.#grab?.id !== event.pointerId) return;
    this.#grab = null;
    this.removeAttribute('data-grabbing');
    if (reducedMotion.matches) this.#release = { from: Float64Array.from(this.#modes, ({ q }) => q), start: performance.now() };
    this.#start();
  }
}
