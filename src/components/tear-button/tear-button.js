import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, vibrate } from '../../core/motion.js';
import styles from './tear-button.scss?inline';

// How far (deg) the stub swings about the foot of the perforation before the last fibre gives.
const TEAR_ANGLE = 34;
// The perforation tears hole by hole: each holds for a moment, then gives.
// That stick-slip is what makes it feel like paper.
const HOLES = 7;
const HOLD = 0.55;
const HOLD_SHARE = 0.3;
// The swing chases the hand on a stiff spring, so the slips snap.
const SWING = { stiffness: 900, damping: 42 };
const RETURN = { stiffness: 520, damping: 22 };
// Once free: px and seconds.
const GRAVITY = 2600;
const FALL_DISTANCE = 220;
const STEP = 1 / 120;
const FADE_DURATION = 180; // ms the stub takes to fade where it tore, with reduced motion
// Ragged edge of the tear, as px offsets along the perforation.
const FIBRES = [1.6, 0.4, 2.2, 0.9, 1.8, 0.2, 2.4, 1.1, 0.5, 2, 1.4, 0.3, 2.3, 0.8, 1.7, 0.1, 2.1, 1.2, 0.6, 1.9];

const ICON_ATTRIBUTES =
  'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const TRASH_ICON = `<svg class="icon" ${ICON_ATTRIBUTES}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>`;
const CHECK_ICON = `<svg class="icon check" ${ICON_ATTRIBUTES}><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const TEAR_ICON = `<svg class="icon" ${ICON_ATTRIBUTES}><path d="M6 6c6 0 12 3 12 11M14 14l4 4 4-4"/></svg>`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const degrees = (radians) => (radians * 180) / Math.PI;

/** Raw pull (0..1) to how far the tear has run, holding at each hole. */
const stickSlip = (pull) => {
  const scaled = clamp(pull, 0, 1) * HOLES;
  const hole = Math.min(Math.floor(scaled), HOLES - 1);
  const f = scaled - hole;
  const given = f < HOLD ? (f / HOLD) * HOLD_SHARE : HOLD_SHARE + ((f - HOLD) / (1 - HOLD)) * (1 - HOLD_SHARE);
  return (hole + given) / HOLES;
};

/**
 * One side of the tear as a clip-path: ragged down to `tip` px from the top,
 * straight below. `side` is 1 for the body's right edge, -1 for the stub's left edge.
 */
const tornEdge = (tip, width, height, side) => {
  const edge = side === 1 ? width : 0;
  const far = side === 1 ? 0 : width;
  const rows = Math.ceil((tip / height) * FIBRES.length);
  const points = [`${far}px 0`];
  for (let k = 0; k <= rows; k++) {
    const y = Math.min((k / FIBRES.length) * height, tip);
    points.push(`${(edge - side * FIBRES[k % FIBRES.length]).toFixed(1)}px ${y.toFixed(1)}px`);
  }
  points.push(`${edge}px ${tip.toFixed(1)}px`, `${edge}px ${height}px`, `${far}px ${height}px`);
  return `polygon(${points.join(',')})`;
};

/**
 * Confirmation as a ticket: tear off the stub to confirm. The perforation
 * gives hole by hole as the stub is pulled; let go early and it swings back.
 * Once torn, the stub flies off with the throw of the hand. From the
 * keyboard (Enter or Space) the stub tears itself.
 *
 * @attr {'primary'|'secondary'|'outline'|'ghost'|'destructive'} variant - Paper color
 * @attr {string} label
 * @attr {string} description
 * @attr {string} stub-label
 * @attr {string} confirmed-label
 * @attr {string} confirmed-description
 * @attr {number} reset-after - Milliseconds before a fresh stub appears; 0 keeps it torn
 * @attr {'idle'|'tearing'|'flying'|'torn'} status - Current status (read only)
 * @slot icon - Icon in the round chip until the stub is torn; a trash can by default
 * @csspart body - Ticket body
 * @csspart stub - The stub button
 * @fires lw-confirm - When the stub comes away
 */
export class LwTearButton extends LwElement {
  static styles = styles;
  static props = {
    variant: { default: 'primary', reflect: true },
    status: { default: 'idle', reflect: true },
    label: { default: 'Delete workspace' },
    description: { default: 'Tear off the stub to confirm' },
    stubLabel: { default: 'Tear' },
    confirmedLabel: { default: 'Workspace deleted' },
    confirmedDescription: { default: 'Kept in trash for 30 days' },
    resetAfter: { type: Number, default: 2400 },
  };

  #body = null;
  #stub = null;
  #size = null;
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: (finished) => this.#render(finished) });
  #resetTimer = 0;
  #fadeTimer = 0;
  #sim = null;

  render() {
    return `<div class="body" part="body"><span class="chip" aria-hidden="true"><slot name="icon">${TRASH_ICON}</slot>${CHECK_ICON}</span><span class="lines"><span class="line ask"><span class="title"></span><span class="sub"></span></span><span class="line done" aria-hidden="true"><span class="title"></span><span class="sub"></span></span></span></div><button class="stub" part="stub" type="button"><span class="perforation"></span>${TEAR_ICON}<span class="stub-label"></span></button><span class="live" aria-live="polite"></span>`;
  }

  connected() {
    this.#body = this.query('.body');
    this.#stub = this.query('.stub');
    this.#resetSim();

    const options = { signal: this.signal };
    const release = () => this.#release();
    this.#stub.addEventListener('pointerdown', this.#onPointerDown, options);
    this.#stub.addEventListener('pointermove', this.#onPointerMove, options);
    this.#stub.addEventListener('keydown', this.#onKeyDown, options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) this.#stub.addEventListener(type, release, options);

    this.signal.addEventListener('abort', () => {
      this.#loop.stop();
      clearTimeout(this.#resetTimer);
      clearTimeout(this.#fadeTimer);
      if (this.status !== 'idle') this.#reset();
    });
  }

  updated(changed) {
    const lines = this.shadowRoot.querySelectorAll('.line');
    const text = { label: [0, '.title'], description: [0, '.sub'], confirmedLabel: [1, '.title'], confirmedDescription: [1, '.sub'] };
    for (const [prop, [line, selector]] of Object.entries(text)) {
      if (changed.has(prop)) lines[line].querySelector(selector).textContent = this[prop];
    }
    if (changed.has('stubLabel')) this.query('.stub-label').textContent = this.stubLabel;
    if (changed.has('label') || changed.has('description')) {
      this.#stub.ariaLabel = `${this.label}: ${this.description}`;
    }
  }

  #resetSim() {
    this.#sim = { angle: 0, speed: 0, target: 0, held: false, auto: false, flying: false, grab: 0, hole: 0 };
    this.#sim.hand = { x: 0, y: 0, t: 0, vx: 0, vy: 0 };
  }

  // Foot of the perforation: the point the stub swings about.
  #hinge() {
    const { left, top } = this.getBoundingClientRect();
    return { x: left + this.#size.body, y: top + this.#size.height };
  }

  #pointerAngle(event) {
    const hinge = this.#hinge();
    return degrees(Math.atan2(event.clientY - hinge.y, event.clientX - hinge.x));
  }

  #measure() {
    this.#size = { body: this.#body.offsetWidth, stub: this.#stub.offsetWidth, height: this.offsetHeight };
  }

  #onPointerDown = (event) => {
    if (this.status === 'flying' || this.status === 'torn') return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    this.#stub.focus();
    this.#stub.setPointerCapture(event.pointerId);
    this.#measure();

    const sim = this.#sim;
    sim.grab = this.#pointerAngle(event) - sim.angle;
    sim.held = true;
    sim.hand = { x: event.clientX, y: event.clientY, t: event.timeStamp, vx: 0, vy: 0 };
    this.status = 'tearing';
    this.#loop.wake();
  };

  #onPointerMove = (event) => {
    const sim = this.#sim;
    if (!sim.held) return;

    // The hand's recent velocity, for the throw.
    const { hand } = sim;
    const dt = event.timeStamp - hand.t;
    if (dt > 0) {
      hand.vx = hand.vx * 0.5 + ((event.clientX - hand.x) / dt) * 500;
      hand.vy = hand.vy * 0.5 + ((event.clientY - hand.y) / dt) * 500;
    }
    Object.assign(hand, { x: event.clientX, y: event.clientY, t: event.timeStamp });

    const raw = this.#pointerAngle(event) - sim.grab;
    // Pushing the stub back into the body only gives a little.
    const pull = raw < 0 ? raw * 0.15 : raw;
    sim.target =
      pull >= TEAR_ANGLE ? TEAR_ANGLE * 1.05 : stickSlip(Math.max(pull, 0) / TEAR_ANGLE) * TEAR_ANGLE + Math.min(pull, 0);
    this.#loop.wake();
  };

  #onKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (this.status !== 'idle' || event.repeat) return;
    this.#measure();
    this.#sim.auto = true;
    this.#sim.target = 0;
    this.status = 'tearing';
    this.#loop.wake();
  };

  // Not torn through: the stub swings back and the perforation holds.
  #release() {
    if (!this.#sim.held) return;
    this.#sim.held = false;
    this.#sim.target = 0;
    this.#loop.wake();
  }

  // One fixed step; true once the phase is over.
  #step() {
    const sim = this.#sim;
    if (sim.flying) return this.#stepFlight();
    if (sim.auto) {
      sim.target = Math.min(sim.target + STEP * 60, TEAR_ANGLE * 1.05);
      return this.#stepSwing();
    }
    return this.#stepSwing() && sim.held;
  }

  // Draws the frame; false stops the loop.
  #render(finished) {
    const sim = this.#sim;
    if (sim.flying) {
      this.#drawFlight();
      if (!finished) return true;
      this.#torn();
      return false;
    }

    this.#drawTear();
    if (finished) {
      sim.auto = false;
      return this.#detach();
    }
    if (sim.held || sim.auto || Math.abs(sim.angle) >= 0.02 || Math.abs(sim.speed) >= 0.05) return true;

    // At rest again.
    this.#resetSim();
    this.#drawTear();
    this.status = 'idle';
    return false;
  }

  // While attached, the swing chases its target, held or springing home.
  #stepSwing() {
    const sim = this.#sim;
    const { stiffness, damping } = sim.held || sim.auto ? SWING : RETURN;
    sim.speed += ((sim.target - sim.angle) * stiffness - sim.speed * damping) * STEP;
    sim.angle += sim.speed * STEP;

    // A tick for each hole that gives.
    const hole = Math.floor(clamp(sim.angle / TEAR_ANGLE, 0, 1) * HOLES);
    if (hole > sim.hole) vibrate(3);
    sim.hole = hole;
    return sim.angle >= TEAR_ANGLE * 0.995;
  }

  #stepFlight() {
    const sim = this.#sim;
    sim.vy += GRAVITY * STEP;
    sim.x += sim.vx * STEP;
    sim.y += sim.vy * STEP;
    sim.angle += sim.spin * STEP;
    return sim.y > FALL_DISTANCE;
  }

  #drawTear() {
    const { body, stub, height } = this.#size;
    const tip = clamp(this.#sim.angle / TEAR_ANGLE, 0, 1) * height;
    this.#body.style.clipPath = tip > 0.5 ? tornEdge(tip, body, height, 1) : '';
    this.#stub.style.clipPath = tip > 0.5 ? tornEdge(tip, stub, height, -1) : '';
    this.#stub.style.transform = `rotate(${this.#sim.angle.toFixed(2)}deg)`;
  }

  #drawFlight() {
    const { x, y, angle } = this.#sim;
    const fade = clamp(1 - (y - FALL_DISTANCE * 0.5) / (FALL_DISTANCE * 0.5), 0, 1);
    this.#stub.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${angle.toFixed(1)}deg)`;
    this.#stub.style.opacity = fade.toFixed(3);
  }

  /** Frees the stub; returns whether it should keep animating. */
  #detach() {
    const sim = this.#sim;
    sim.held = false;
    vibrate(14);

    // The stub leaves with the swing it had, plus the hand's throw.
    const radians = (sim.angle * Math.PI) / 180;
    const tangential = ((sim.speed * Math.PI) / 180) * this.#size.height;
    Object.assign(sim, {
      flying: true,
      x: 0,
      y: 0,
      vx: Math.cos(radians) * tangential + clamp(sim.hand.vx, -900, 900) * 0.6 + 90,
      vy: Math.sin(radians) * tangential + clamp(sim.hand.vy, -900, 900) * 0.6 - 120,
      spin: sim.speed * 0.6 + 140,
    });
    this.#stub.style.transition = 'none';
    this.status = 'flying';
    this.query('.live').textContent = this.confirmedLabel;
    this.emit('confirm');

    // With reduced motion the stub does not fall: it fades where it tore.
    if (!reducedMotion.matches) return true;
    this.#stub.style.transition = `opacity ${FADE_DURATION}ms ease-out`;
    this.#stub.style.opacity = '0';
    this.#fadeTimer = setTimeout(() => this.#torn(), FADE_DURATION);
    return false;
  }

  #torn() {
    this.status = 'torn';
    if (this.resetAfter > 0) this.#resetTimer = setTimeout(() => this.#reset(), this.resetAfter);
  }

  // A fresh stub; it slides in through @starting-style as it is displayed again.
  #reset() {
    this.#resetSim();
    this.#body.style.clipPath = '';
    this.#stub.removeAttribute('style');
    this.query('.live').textContent = '';
    this.status = 'idle';
  }
}
