import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion } from '../../core/motion.js';
import styles from './card-flip.scss?inline';

// Degrees of turn per px of drag.
const DEG_PER_PX = 0.6;
// The spring that lands the card on a face, in degrees and seconds.
const STIFFNESS = 170;
const DAMPING = 20;
// How far ahead (in seconds of release velocity) the landing face is picked.
const PROJECTION = 0.22;
// A release faster than this (deg/s) always turns at least one face.
const FLICK_SPEED = 450;
// Never spin more than this many half turns from one flick.
const MAX_HALF_TURNS = 6;
// Movement below this (px) is a click, not a drag.
const DRAG_SLOP = 4;
// How far the card lifts toward the viewer at 90°, in px.
const LIFT = 36;
// Hover pre-tilt toward the pointer, in degrees.
const TILT = 6;
// Card thickness: stacked slices between the two faces.
const THICKNESS = 6;
const SLICES = 7;
const STEP = 1 / 240;
// Release velocity is read from the last this-many ms of the drag.
const VELOCITY_WINDOW = 80;
const INTERACTIVE = 'button, a, input, select, textarea, [data-no-flip]';

const mod2 = (n) => ((n % 2) + 2) % 2;
const sideOf = (angle) => mod2(Math.round(angle / 180)) === 1;
const nearestFace = (angle) => Math.round(angle / 180) * 180;

const releaseVelocity = (samples, now) => {
  const last = samples.at(-1);
  if (!last || now - last.t > VELOCITY_WINDOW) return 0;
  const first = samples.find((sample) => last.t - sample.t <= VELOCITY_WINDOW);
  if (!first || last.t <= first.t) return 0;
  return ((last.a - first.a) / (last.t - first.t)) * 1000;
};

/**
 * A card with two faces that turns over like a real one: drag it and it
 * follows the finger, flick it and it spins on, click a half to push that
 * half away, or press Enter or Space. It has a visible edge, lifts toward
 * you as it turns, and a band of light sweeps across the face.
 *
 * @attr {boolean} flipped - The back is showing
 * @attr {'y'|'x'} axis - `y` spins left and right like a coin, `x` tumbles top over bottom
 * @attr {string} label - Accessible name of the card
 * @slot front - The front face
 * @slot back - The back face
 * @fires lw-change - The card was turned to the other side; `detail: { flipped }`
 * @csspart face - Both faces, for background, border and radius
 */
export class LwCardFlip extends LwElement {
  static styles = styles;
  static props = {
    flipped: { type: Boolean, reflect: true },
    axis: { default: 'y', reflect: true },
    label: { default: 'Card' },
  };

  #angle = 0;
  #velocity = 0;
  #target = 0;
  #drag = null;
  #backShown = null;
  #placed = false;
  #loop = fixedStepLoop(STEP, {
    step: () => this.#step(),
    render: (done) => this.#settled(done),
  });

  render() {
    const slices = Array.from({ length: SLICES }, (_, i) => `<div class="slice" style="transform: translateZ(${(-THICKNESS / 2 + (THICKNESS * (i + 0.5)) / SLICES).toFixed(3)}px)"></div>`).join('');
    const light = '<div class="light" aria-hidden="true"><div class="shade"></div><div class="band"></div></div>';
    return `<div class="floor" aria-hidden="true"></div>
<div class="tilt"><div class="card">${slices}
  <div class="face front" part="face"><slot name="front"></slot>${light}</div>
  <div class="face back" part="face"><slot name="back"></slot>${light}</div>
</div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.tabIndex = 0;
    this.role = 'group';
    this.ariaRoleDescription = 'flip card';
    this.addEventListener('pointerdown', (event) => this.#down(event), options);
    this.addEventListener('pointermove', (event) => this.#move(event), options);
    this.addEventListener('pointerup', (event) => this.#release(event, false), options);
    this.addEventListener('pointercancel', (event) => this.#release(event, true), options);
    this.addEventListener('lostpointercapture', (event) => this.#release(event, true), options);
    this.addEventListener('pointerleave', () => !this.#drag && this.#tilt(0, 0), options);
    this.addEventListener('keydown', (event) => this.#key(event), options);
    this.signal.addEventListener('abort', () => this.#loop.stop());
  }

  updated(changed) {
    if (changed.has('label')) this.ariaLabel = this.label;
    if (changed.has('flipped')) this.#follow();
    this.query('.back').style.transform = `${this.axis === 'x' ? 'rotateX' : 'rotateY'}(180deg) translateZ(${THICKNESS / 2}px)`;
    this.#paint();
  }

  // The prop asks for a side: land the nearest face on that side, so a
  // refused turn swings back the way it came. The first one lands at once.
  #follow() {
    const flipped = Boolean(this.flipped);
    this.ariaDescription = `Showing the ${flipped ? 'back' : 'front'}. Press Enter or Space, or drag, to turn it over.`;
    if (!this.#placed) {
      this.#placed = true;
      this.#angle = this.#target = flipped ? 180 : 0;
      return;
    }
    if (this.#drag?.dragging || sideOf(this.#target) === flipped) return;
    const face = nearestFace(this.#angle);
    this.#target = sideOf(face) === flipped ? face : face + (this.#angle < face ? -180 : 180);
    this.#settle();
  }

  // ---- The spring ----

  #step() {
    const force = -STIFFNESS * (this.#angle - this.#target) - DAMPING * this.#velocity;
    this.#velocity += force * STEP;
    this.#angle += this.#velocity * STEP;
  }

  #settled() {
    if (Math.abs(this.#angle - this.#target) < 0.05 && Math.abs(this.#velocity) < 0.5) {
      // Settled: park on 0 or 180 so the numbers never grow, then sleep.
      this.#target = sideOf(this.#target) ? 180 : 0;
      this.#angle = this.#target;
      this.#velocity = 0;
      this.#paint();
      return false;
    }
    this.#paint();
    return true;
  }

  #settle() {
    if (reducedMotion.matches) {
      // Reduced motion: no spin, land on the face at once.
      this.#loop.stop();
      this.#angle = this.#target = sideOf(this.#target) ? 180 : 0;
      this.#velocity = 0;
      this.#paint();
      return;
    }
    this.#loop.wake();
  }

  // Points the spring at a face and reports a side change.
  #aim(target) {
    this.#target = target;
    const next = sideOf(target);
    if (next !== Boolean(this.flipped)) {
      this.flipped = next;
      this.emit('change', { flipped: next });
    }
    this.#settle();
  }

  #flipBy(direction) {
    this.#aim(nearestFace(this.#target) + 180 * direction);
  }

  // ---- Painting ----

  #paint() {
    const axis = this.axis === 'x' ? 'x' : 'y';
    const rad = (this.#angle * Math.PI) / 180;
    const sin = Math.sin(rad);
    const turn = Math.abs(sin);
    const facing = Math.abs(Math.cos(rad));
    this.query('.card').style.transform = `translateZ(${(turn * LIFT).toFixed(2)}px) ${axis === 'y' ? 'rotateY' : 'rotateX'}(${this.#angle.toFixed(2)}deg)`;
    // The floor shadow narrows and fades as the card turns edge-on.
    const floor = this.query('.floor');
    const narrow = (0.16 + 0.84 * facing).toFixed(3);
    const soft = (1 - turn * 0.12).toFixed(3);
    floor.style.transform = axis === 'y' ? `scale(${narrow}, ${soft})` : `scale(${soft}, ${narrow})`;
    floor.style.opacity = (1 - turn * 0.45).toFixed(3);
    // A flat band of light sweeps across the face that shows, and the face
    // dims as it turns away from the light.
    const shift = `${(sin * 140).toFixed(1)}%`;
    const band = axis === 'y' ? `translateX(${shift}) rotate(18deg)` : `translateY(${shift}) rotate(72deg)`;
    for (const el of this.shadowRoot.querySelectorAll('.band')) {
      el.style.opacity = (turn * 0.12).toFixed(3);
      el.style.transform = band;
    }
    for (const el of this.shadowRoot.querySelectorAll('.shade')) el.style.opacity = (turn * 0.14).toFixed(3);
    const back = sideOf(this.#angle);
    if (back !== this.#backShown) {
      this.#backShown = back;
      for (const [face, hidden] of [
        [this.query('.front'), back],
        [this.query('.back'), !back],
      ]) {
        face.inert = hidden;
        face.toggleAttribute('aria-hidden', hidden);
      }
    }
  }

  #tilt(x, y) {
    this.query('.tilt').style.transform = `rotateX(${(-y * TILT).toFixed(2)}deg) rotateY(${(x * TILT).toFixed(2)}deg)`;
  }

  // ---- Pointer and keys ----

  #down(event) {
    // One pointer at a time: a second finger does not steal the drag.
    if (this.#drag || event.button !== 0 || event.composedPath()[0].closest?.(INTERACTIVE)) return;
    this.#drag = { id: event.pointerId, x: event.clientX, y: event.clientY, angle: this.#angle, dragging: false, samples: [{ t: event.timeStamp, a: this.#angle }] };
    this.setPointerCapture?.(event.pointerId);
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) {
      // Hover leans the card toward the pointer.
      if (event.pointerType !== 'mouse') return;
      const rect = this.getBoundingClientRect();
      this.#tilt(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);
      return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.dragging) {
      if (Math.hypot(dx, dy) < DRAG_SLOP) return;
      drag.dragging = true;
      this.#loop.stop();
      this.#velocity = 0;
      this.#tilt(0, 0);
    }
    // One to one: the card stays under the finger.
    this.#angle = drag.angle + (this.axis === 'x' ? -dy : dx) * DEG_PER_PX;
    drag.samples.push({ t: event.timeStamp, a: this.#angle });
    if (drag.samples.length > 8) drag.samples.shift();
    this.#paint();
  }

  #release(event, cancelled) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    if (!drag.dragging) {
      if (cancelled) return;
      // A click pushes the half you pressed away from you.
      const rect = this.getBoundingClientRect();
      const pushed = this.axis === 'x' ? event.clientY < rect.top + rect.height / 2 : event.clientX > rect.left + rect.width / 2;
      this.#flipBy(pushed ? 1 : -1);
      return;
    }
    const velocity = cancelled ? 0 : releaseVelocity(drag.samples, event.timeStamp);
    const from = nearestFace(drag.angle);
    let target = nearestFace(this.#angle + velocity * PROJECTION);
    if (Math.abs(velocity) > FLICK_SPEED && target === from) target = from + 180 * Math.sign(velocity);
    const limit = MAX_HALF_TURNS * 180;
    this.#velocity = velocity;
    this.#aim(Math.max(from - limit, Math.min(from + limit, target)));
  }

  #key(event) {
    if (event.target !== this || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    this.#flipBy(1);
  }
}
