import { fixedStepLoop, reducedMotion, vibrate } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import { LwButton } from '../button/button.js';
import buttonStyles from '../button/button.scss?inline';
import styles from './bell-button.scss?inline';

// The bell and its clapper are two pendulums on the same pivot. Nothing couples
// them but collisions: the swinging bell catches the clapper with its lip,
// flings it across, and it strikes the other side. Angles in deg, time in s.
const STEP = 1 / 240;
const BELL = { stiffness: 380, damping: 5 };
const CLAPPER = { stiffness: 150, damping: 4 };
// How far the clapper can swing inside the bell before it hits the lip.
const LIP = 13;
const RESTITUTION = 0.45;
// Share of a hit that goes into the bell, which is much heavier.
const RECOIL = 0.18;
// Impacts harder than this ring out (deg/s, relative).
const STRIKE_SPEED = 260;
const RING_KICK = 600;
const NUDGE_KICK = 160;
const MUTE_KICK = 300;
const NUDGE_INTERVAL = 700; // ms between hover nudges
const REST = 0.05;
const PIVOT = '12 2.5';

const WAVE_DURATION = 420;
const WAVE_EASING = 'cubic-bezier(0.23, 1, 0.32, 1)';

const ICON = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="wave" data-side="1" d="M21.5 4.5c1.2 1.6 1.8 3.4 1.8 5.5"/><path class="wave" data-side="-1" d="M2.5 4.5C1.3 6.1.7 7.9.7 10"/><path class="clapper" d="M10.27 21a2 2 0 0 0 3.46 0"/><g class="bell"><path class="shell" d="M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33"/><path class="slash" d="M3 3l18 18"/></g></svg>`;

const numberFormat = new Intl.NumberFormat(undefined, { numberingSystem: 'latn' });

/**
 * Subscribe toggle with a bell that rings. The bell and clapper swing as two
 * pendulums; subscribing swings the bell so the clapper strikes and rings out,
 * unsubscribing gives a muffled shake. An optional count rolls its digits.
 *
 * @attr {boolean} subscribed - Toggled on click
 * @attr {number} count - Subscribers not counting this one; shows the count chip when set
 * @attr {string} label - Label while unsubscribed, and the accessible name
 * @attr {string} subscribed-label - Label while subscribed
 * @attr {string} count-label - Read after the count by screen readers, e.g. "subscribers"
 * @fires lw-change - Before toggling. `detail.subscribed` is the new state. Cancelable.
 */
export class LwBellButton extends LwButton {
  static styles = [buttonStyles, rollingStyles, styles];
  static props = {
    ...LwButton.props,
    subscribed: { type: Boolean, reflect: true },
    count: { type: Number, reflect: true },
    label: { default: 'Notify me' },
    subscribedLabel: { default: 'Subscribed' },
    countLabel: { default: 'subscribers' },
  };

  #sim = { bell: 0, bellSpeed: 0, clapper: 0, clapperSpeed: 0 };
  #lastNudge = -Infinity;
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#render() });

  render() {
    return `<button class="button" part="button">${ICON}<span class="labels" aria-hidden="true"><span class="label label-off"></span><span class="label label-on"></span></span><span class="count rolling" aria-hidden="true" hidden></span></button>`;
  }

  connected() {
    super.connected();
    this.query('.button').addEventListener('pointerenter', this.#onPointerEnter, { signal: this.signal });
    this.signal.addEventListener('abort', () => {
      this.#loop.stop();
      this.#rest();
    });
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('label')) this.query('.label-off').textContent = this.label;
    if (changed.has('subscribedLabel')) this.query('.label-on').textContent = this.subscribedLabel;
    if (changed.has('subscribed')) this.query('.button').ariaPressed = String(this.subscribed);
    if (['label', 'count', 'countLabel', 'subscribed'].some((prop) => changed.has(prop))) this.#renderCount();
  }

  handleClick(event) {
    super.handleClick(event);
    const subscribed = !this.subscribed;
    if (!this.emit('change', { subscribed })) return;
    this.subscribed = subscribed;

    const sim = this.#sim;
    if (subscribed) {
      // Swing the bell away from the clapper so the first hit rings.
      this.#kick(sim.bellSpeed >= 0 ? RING_KICK : -RING_KICK);
      if (reducedMotion.matches) {
        this.#flare(1, 0.6);
        this.#flare(-1, 0.6);
      }
      vibrate(10);
    } else {
      // A dull shake, the clapper held still against the bell.
      this.#kick(-MUTE_KICK);
    }
  }

  // A brush past the bell sets it swaying a little. Mouse only: on touch,
  // enter fires right before the tap.
  #onPointerEnter = (event) => {
    if (event.pointerType !== 'mouse' || !this.subscribed) return;
    if (event.timeStamp - this.#lastNudge < NUDGE_INTERVAL) return;
    this.#lastNudge = event.timeStamp;
    this.#kick(this.#sim.bellSpeed >= 0 ? NUDGE_KICK : -NUDGE_KICK);
  };

  #kick(speed) {
    if (reducedMotion.matches) return;
    this.#sim.bellSpeed += speed;
    this.#loop.wake();
  }

  // Advances both pendulums one step and resolves a clapper hit.
  #step() {
    const sim = this.#sim;
    sim.bellSpeed += (-sim.bell * BELL.stiffness - sim.bellSpeed * BELL.damping) * STEP;
    sim.bell += sim.bellSpeed * STEP;

    // Muffled: the clapper is held against the bell and cannot strike.
    if (!this.subscribed) {
      sim.clapper = sim.bell;
      sim.clapperSpeed = sim.bellSpeed;
      return;
    }

    sim.clapperSpeed += (-sim.clapper * CLAPPER.stiffness - sim.clapperSpeed * CLAPPER.damping) * STEP;
    sim.clapper += sim.clapperSpeed * STEP;
    const relative = sim.clapper - sim.bell;
    if (Math.abs(relative) <= LIP) return;

    const side = Math.sign(relative);
    const impact = (sim.clapperSpeed - sim.bellSpeed) * side;
    sim.clapper = sim.bell + side * LIP;
    if (impact <= 0) return;

    sim.clapperSpeed -= side * impact * (1 + RESTITUTION);
    sim.bellSpeed += side * impact * RECOIL;
    if (impact > STRIKE_SPEED) {
      this.#flare(side, impact / 1600);
      vibrate(6);
    }
  }

  #render() {
    const sim = this.#sim;
    const energy =
      Math.abs(sim.bell) + Math.abs(sim.bellSpeed) * 0.02 + Math.abs(sim.clapper) + Math.abs(sim.clapperSpeed) * 0.02;
    if (energy < REST) {
      this.#rest();
      return false;
    }
    this.#draw();
    return true;
  }

  #rest() {
    Object.assign(this.#sim, { bell: 0, bellSpeed: 0, clapper: 0, clapperSpeed: 0 });
    this.#draw();
  }

  #draw() {
    const { bell, clapper } = this.#sim;
    this.query('.bell').setAttribute('transform', `rotate(${bell.toFixed(2)} ${PIVOT})`);
    this.query('.clapper').setAttribute('transform', `rotate(${clapper.toFixed(2)} ${PIVOT})`);
  }

  // Two short arcs flare out on the side that was struck.
  #flare(side, strength) {
    this.query(`.wave[data-side="${side}"]`).animate(
      { opacity: [Math.min(1, 0.45 + strength * 0.55), 0], translate: ['0', `${side * 3}px`] },
      { duration: WAVE_DURATION, easing: WAVE_EASING },
    );
  }

  // The name stays the same while `aria-pressed` carries the state; the count is appended.
  #renderCount() {
    const chip = this.query('.count');
    const button = this.query('.button');
    chip.hidden = this.count == null;
    if (chip.hidden) {
      button.ariaLabel = this.label;
      return;
    }

    const text = numberFormat.format(this.count + (this.subscribed ? 1 : 0));
    button.ariaLabel = `${this.label}, ${text} ${this.countLabel}`;
    roll(chip, text);
  }
}
