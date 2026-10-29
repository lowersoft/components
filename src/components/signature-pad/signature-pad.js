import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion } from '../../core/motion.js';
import { watchTheme } from '../../core/theme.js';
import { paintStroke, toSvg } from './ink.js';
import styles from './signature-pad.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

// The pen tip trails the pointer on a spring, which irons out the jitter of a
// hand on a trackpad and gives strokes the swing of real ink. Units are px and
// seconds; the simulation runs at a fixed step.
const STEP = 1 / 240;
const TIP_STIFFNESS = 2600;
const TIP_DAMPING = 78;
// Line width follows speed, like a nib: slow is heavy, fast is light.
const MAX_WIDTH = 3.6;
const MIN_WIDTH = 1.1;
const SPEED_FOR_MIN = 1800;
const WIDTH_EASE = 0.08;
// A new point is laid down once the tip has moved this far.
const MIN_GAP = 0.6;
const CLEAR_MS = 420;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * A pad to sign on with a pointer, finger or pen. The tip trails the pointer
 * on a spring and the line thins with speed (and follows a pen's pressure),
 * so strokes swing like real ink. Undo takes back the last stroke; clear lifts
 * the ink off in reverse. Ctrl/⌘+Z and Backspace do the same while the pad
 * has focus. With reduced motion the ink goes exactly where the pointer is.
 *
 * The signature comes out as standalone SVG in `value`. With a `name`, the
 * form submits it; `required` keeps an empty pad from submitting.
 *
 * @attr {string} label - Accessible name of the drawing area
 * @attr {string} name - Submits the signature SVG with the form under this name
 * @attr {boolean} required
 * @attr {boolean} disabled
 * @fires lw-change - After each stroke, undo or clear; `detail: { value }`, the SVG or null once empty
 * @cssprop --lw-signature-pad-ink - The ink on screen
 * @csspart base
 * @csspart pad - The drawing area
 */
export class LwSignaturePad extends FormControl(LwElement) {
  static styles = styles;
  static props = {
    label: { default: 'Signature' },
    name: {},
    required: { type: Boolean },
    disabled: { type: Boolean, reflect: true },
  };

  #strokes = [];
  // Points of the current stroke already on the canvas.
  #painted = 0;
  #pen = { held: false, pressure: 0.5, usesPressure: false, targetX: 0, targetY: 0, x: 0, y: 0, vx: 0, vy: 0, width: MAX_WIDTH, speed: 0 };
  #loop = fixedStepLoop(STEP, { step: () => this.#stepPen(), render: () => this.#frame() });
  #size = { width: 0, height: 0 };
  #clearing = 0;
  // A lifted stroke whose tip is still catching up with the pointer.
  #settling = false;
  #formDisabled = false;

  render() {
    return '<div class="card" part="base"><div class="pad" part="pad"><div class="line" aria-hidden="true"><span class="cross">×</span><span class="hint">Sign here</span></div><canvas role="img" tabindex="0"></canvas></div><div class="footer"><p class="status" aria-live="polite"></p><div class="actions"><button class="undo" type="button">Undo</button><button class="clear" type="button">Clear</button></div></div></div>';
  }

  connected() {
    const options = { signal: this.signal };
    const canvas = this.query('canvas');
    canvas.addEventListener('pointerdown', (event) => this.#down(event), options);
    canvas.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(type, () => this.#up(), options);
    canvas.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.undo').addEventListener('click', () => this.undo(), options);
    this.query('.clear').addEventListener('click', () => this.clear(), options);
    // Size the canvas to its box at the screen's pixel density.
    const resize = new ResizeObserver(() => this.#fit());
    resize.observe(this.query('.pad'));
    watchTheme(() => this.#redraw(), this.signal);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      this.#loop.stop();
      cancelAnimationFrame(this.#clearing);
      if (this.#clearing) this.#finishClear();
      this.#pen.held = false;
      this.#settling = false;
    });
    this.#fit();
  }

  updated(changed) {
    if (changed.has('disabled')) this.#syncDisabled();
    this.#sync();
  }

  formResetCallback() {
    this.#strokes = [];
    this.#redraw();
    this.#sync();
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncDisabled();
  }

  /** The signature as standalone SVG, or null while the pad is empty. */
  get value() {
    return this.#strokes.length ? toSvg(this.#strokes, this.#size.width, this.#size.height) : null;
  }

  /** Takes back the last stroke. */
  undo() {
    if (this.#pen.held || this.#clearing || this.#strokes.length === 0) return;
    this.#strokes.pop();
    this.#redraw();
    this.#changed();
  }

  /** Lifts all the ink off, in the reverse of the order it went down. */
  clear() {
    if (this.#pen.held || this.#clearing || this.#strokes.length === 0) return;
    if (reducedMotion.matches) {
      this.#finishClear();
      return;
    }
    const start = performance.now();
    const frame = (now) => {
      const t = clamp((now - start) / CLEAR_MS, 0, 1);
      this.#redraw(1 - easeInOut(t));
      if (t < 1) this.#clearing = requestAnimationFrame(frame);
      else this.#finishClear();
    };
    this.#clearing = requestAnimationFrame(frame);
    this.#sync();
  }

  get #active() {
    return !this.disabled && !this.#formDisabled;
  }

  #finishClear() {
    this.#clearing = 0;
    this.#strokes = [];
    this.#redraw();
    this.#changed();
  }

  #syncDisabled() {
    this.query('canvas').tabIndex = this.#active ? 0 : -1;
    this.#sync();
  }

  // Updates the label, status, buttons and the form value.
  #sync() {
    const count = this.#strokes.length;
    const canvas = this.query('canvas');
    canvas.ariaLabel = `${this.label}${count ? `, ${count} stroke${count === 1 ? '' : 's'}` : ', empty'}`;
    this.query('.status').textContent = count ? 'Signed' : 'Draw your signature';
    this.query('.pad').toggleAttribute('data-empty', count === 0 && !this.#pen.held);
    const locked = count === 0 || Boolean(this.#clearing) || !this.#active;
    this.query('.undo').disabled = locked;
    this.query('.clear').disabled = locked;
    const value = this.value;
    this[INTERNALS].setFormValue(this.name ? value : null);
    if (this.required && !value) this[INTERNALS].setValidity({ valueMissing: true }, 'Please sign.', canvas);
    else this[INTERNALS].setValidity({});
  }

  #changed() {
    this.#sync();
    this.emit('change', { value: this.value });
  }

  #context() {
    const context = this.query('canvas').getContext('2d');
    context.fillStyle = getComputedStyle(this.query('canvas')).color;
    return context;
  }

  #fit() {
    const box = this.query('.pad').getBoundingClientRect();
    const canvas = this.query('canvas');
    const dpr = Math.min(devicePixelRatio || 1, 3);
    this.#size = { width: box.width, height: box.height };
    canvas.width = Math.round(box.width * dpr);
    canvas.height = Math.round(box.height * dpr);
    canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    this.#redraw();
  }

  /** Repaints every stroke, or only the first `fraction` of all the ink. */
  #redraw(fraction = 1) {
    const context = this.#context();
    context.clearRect(0, 0, this.#size.width, this.#size.height);
    let budget = Math.round(this.#strokes.reduce((sum, stroke) => sum + stroke.length, 0) * fraction);
    this.#strokes.forEach((stroke, k) => {
      if (budget <= 0) return;
      const open = this.#pen.held && k === this.#strokes.length - 1;
      paintStroke(context, stroke, 0, Math.min(stroke.length, budget), open);
      budget -= stroke.length;
    });
  }

  // One step of the pen: the tip springs towards the pointer and lays down a
  // point when it has travelled far enough, sized by its speed.
  #stepPen() {
    const pen = this.#pen;
    pen.vx += ((pen.targetX - pen.x) * TIP_STIFFNESS - pen.vx * TIP_DAMPING) * STEP;
    pen.vy += ((pen.targetY - pen.y) * TIP_STIFFNESS - pen.vy * TIP_DAMPING) * STEP;
    pen.x += pen.vx * STEP;
    pen.y += pen.vy * STEP;
    pen.speed = Math.hypot(pen.vx, pen.vy);
    const pressure = pen.usesPressure ? 0.45 + pen.pressure * 0.9 : 1;
    const goal = (MAX_WIDTH - (MAX_WIDTH - MIN_WIDTH) * clamp(pen.speed / SPEED_FOR_MIN, 0, 1)) * pressure;
    pen.width += (goal - pen.width) * WIDTH_EASE;
    const stroke = this.#strokes.at(-1);
    const last = stroke?.at(-1);
    if (last && Math.hypot(pen.x - last.x, pen.y - last.y) >= MIN_GAP) stroke.push({ x: pen.x, y: pen.y, w: pen.width });
  }

  #frame() {
    const pen = this.#pen;
    const stroke = this.#strokes.at(-1);
    if (stroke) {
      // Only the new ink; the point before it is repainted to join up.
      paintStroke(this.#context(), stroke, this.#painted - 1, stroke.length, true);
      this.#painted = stroke.length;
    }
    const caughtUp = Math.hypot(pen.targetX - pen.x, pen.targetY - pen.y) < 0.3 && pen.speed < 5;
    if (pen.held || !caughtUp) return true;
    // The pen has lifted and caught up: close the stroke with its tail taper.
    this.#settling = false;
    this.#redraw();
    this.#changed();
    return false;
  }

  #local(event) {
    const box = this.query('.pad').getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  }

  #down(event) {
    const pen = this.#pen;
    if (!this.#active || this.#clearing || pen.held || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    // Still settling the last stroke: finish it at once.
    this.#loop.stop();
    if (this.#settling) {
      this.#settling = false;
      this.#changed();
    }
    const { x, y } = this.#local(event);
    Object.assign(pen, { held: true, usesPressure: event.pointerType === 'pen', pressure: event.pressure || 0.5, x, y, targetX: x, targetY: y, vx: 0, vy: 0, width: MAX_WIDTH, speed: 0 });
    this.#strokes.push([{ x, y, w: MAX_WIDTH }]);
    this.#painted = 0;
    this.#redraw();
    this.#sync();
    this.#loop.wake();
  }

  #move(event) {
    const pen = this.#pen;
    if (!pen.held) return;
    const { x, y } = this.#local(event);
    pen.targetX = x;
    pen.targetY = y;
    if (pen.usesPressure) pen.pressure = event.pressure;
    // No trailing tip with reduced motion: the ink goes where the pointer is.
    if (reducedMotion.matches) Object.assign(pen, { x, y, vx: 0, vy: 0 });
  }

  #up() {
    if (!this.#pen.held) return;
    this.#pen.held = false;
    this.#settling = true;
    this.#loop.wake();
  }

  #key(event) {
    if (!this.#active) return;
    if (event.key.toLowerCase() === 'z' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      this.undo();
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      this.clear();
    }
  }
}
