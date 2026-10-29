import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { graphemes } from '../../core/text.js';
import { watchVisibility } from '../../core/visibility.js';
import { clamp, Cradle, W0 } from './cradle.js';
import styles from './cradle-text.scss?inline';

// Furthest a letter can be pulled out, in radians.
const MAX_ANGLE = 1.15;
// A cursor sweeping through a letter knocks it, per px/s of its speed.
const SWEEP_PUSH = 0.22;
const MAX_SWEEP = 900;
// A tap sends a letter out to about this angle.
const TAP_ANGLE = 0.38;
// The intro pulls the first letter out this far, holds it, then lets go.
const INTRO_ANGLE = 0.62;
const INTRO_PULL = 520;
const INTRO_HOLD = 1.25;
const INTRO_DELAY = 400;
// Below this energy the cradle is at rest and the loop stops.
const REST = 0.0004;

const easeOut = (t) => 1 - (1 - t) ** 4;

/**
 * A line of letters hung from a rail like a Newton's cradle. Knock a letter
 * and the clack passes through the word until the one at the far end flies
 * out. Tap a letter, drag it out and let go, or brush the mouse through the
 * row. The first time it shows, the first letter is pulled out and dropped.
 * With reduced motion the letters hang still.
 *
 * Set the text as content or with `text`; keep it to one line.
 *
 * @attr {string} text - The string to show; when set, the content is ignored
 * @attr {number} bounce - How much speed a collision keeps, 0 to 1; steel is about 0.95
 * @attr {boolean} no-intro - Skips the first pull and drop
 * @csspart base - The box the rail spans
 * @csspart rail
 */
export class LwCradleText extends LwElement {
  static styles = styles;
  static props = {
    text: {},
    bounce: { type: Number, default: 0.97 },
    noIntro: { type: Boolean },
  };

  #cradle = new Cradle();
  #ink = document.createElement('canvas').getContext('2d');
  #railY = 0;
  #width = -1;
  #frame = 0;
  #last = 0;
  #visible = false;
  #greeted = false;
  #greetTimer = 0;
  // The intro's scripted pull, a hand holding a letter, and the mouse
  // brushing through the row.
  #pull = null;
  #hand = null;
  #sweep = null;

  render() {
    return '<span class="live"></span><span class="stage" part="base"><span class="rail" part="rail" aria-hidden="true"></span><span class="letters" aria-hidden="true"></span></span>';
  }

  connected() {
    const options = { signal: this.signal };
    const stage = this.query('.stage');
    const content = new MutationObserver(() => this.#readText());
    content.observe(this, { childList: true, subtree: true, characterData: true });
    // Only a new width moves the letters; the swing itself never resizes.
    const resize = new ResizeObserver(() => stage.clientWidth !== this.#width && this.#measure());
    resize.observe(stage);
    document.fonts?.ready.then(() => this.isConnected && this.#measure());
    watchVisibility(
      this,
      (visible) => {
        this.#visible = visible;
        if (!visible) return;
        if (!this.#greeted) this.#greet();
        this.#start();
      },
      this.signal,
    );
    stage.addEventListener('pointerdown', (event) => this.#down(event), options);
    stage.addEventListener('pointermove', (event) => this.#move(event), options);
    stage.addEventListener('pointerup', (event) => this.#up(event), options);
    stage.addEventListener('pointercancel', (event) => this.#up(event), options);
    stage.addEventListener('pointerleave', () => (this.#sweep = null), options);
    this.signal.addEventListener('abort', () => {
      content.disconnect();
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
      clearTimeout(this.#greetTimer);
      this.#frame = 0;
      this.#hand = null;
      this.#pull = null;
      this.removeAttribute('data-grabbing');
      this.#cradle.rest();
      this.#draw();
    });
    this.#readText();
  }

  updated(changed) {
    if (changed.has('text')) this.#readText();
    if (changed.has('bounce')) this.#cradle.restitution = clamp(this.bounce, 0, 1);
  }

  #greet() {
    this.#greeted = true;
    if (this.noIntro || reducedMotion.matches) return;
    this.#greetTimer = setTimeout(() => {
      const first = this.#cradle.bobs[0];
      if (!first || this.#hand) return;
      this.#pull = { bob: first, start: performance.now(), to: -INTRO_ANGLE };
      this.#start();
    }, INTRO_DELAY);
  }

  #readText() {
    if (!this.isConnected) return;
    const text = this.text ?? this.textContent.trim();
    this.query('.live').textContent = text;
    const letters = graphemes(text).map((char) => {
      if (char.trim() === '') return Object.assign(document.createElement('span'), { className: 'space' });
      const letter = Object.assign(document.createElement('span'), { className: 'letter' });
      letter.dataset.letter = char;
      letter.append(Object.assign(document.createElement('span'), { className: 'thread' }), char);
      return letter;
    });
    // An empty inline-block rests its bottom edge on the baseline.
    const probe = Object.assign(document.createElement('span'), { className: 'probe' });
    this.query('.letters').replaceChildren(...letters, probe);
    this.#measure();
  }

  // Finds each letter's ink and hangs a thread from the rail to its top.
  #measure() {
    const stage = this.query('.stage');
    const lettersBox = this.query('.letters');
    const cradle = this.#cradle;
    this.#width = stage.clientWidth;
    this.#pull = null;
    this.#hand = null;
    this.removeAttribute('data-grabbing');

    const stageBox = stage.getBoundingClientRect();
    const baseline = lettersBox.lastElementChild.getBoundingClientRect().bottom - stageBox.top;
    const style = getComputedStyle(lettersBox);
    const em = Number.parseFloat(style.fontSize);
    this.#ink.font = style.font;
    this.#railY = this.query('.rail').getBoundingClientRect().top - stageBox.top + 0.5;
    // The swing radius runs to the letters' middle.
    cradle.radius = Math.max(baseline - em * 0.35 - this.#railY, 1);
    cradle.bobs = [...lettersBox.querySelectorAll('.letter')].map((el) => {
      el.style.transform = '';
      const box = el.getBoundingClientRect();
      const ink = this.#ink.measureText(el.dataset.letter);
      const boxLeft = box.left - stageBox.left;
      const boxTop = box.top - stageBox.top;
      const left = boxLeft - ink.actualBoundingBoxLeft;
      const right = boxLeft + ink.actualBoundingBoxRight;
      const top = baseline - ink.actualBoundingBoxAscent;
      const center = (left + right) / 2;
      Object.assign(el.firstElementChild.style, {
        left: `${center - boxLeft - 0.5}px`,
        top: `${this.#railY - boxTop}px`,
        height: `${Math.max(top - this.#railY, 0)}px`,
      });
      return { el, left, right, center, top, bottom: baseline + ink.actualBoundingBoxDescent, boxLeft, boxTop, gap: 0, phi: 0, omega: 0, held: false };
    });
    cradle.bobs.forEach((bob, i, bobs) => (bob.gap = bobs[i + 1] ? Math.max(bobs[i + 1].left - bob.right, 0) : 0));
  }

  #draw() {
    for (const bob of this.#cradle.bobs) {
      if (bob.phi === 0) {
        bob.el.style.transform = '';
        continue;
      }
      // Rotate about the rail; swinging right turns the letter counter-clockwise.
      const px = bob.center - bob.boxLeft;
      const py = this.#railY - bob.boxTop;
      bob.el.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0) rotate(${(-bob.phi).toFixed(4)}rad) translate3d(${(-px).toFixed(2)}px, ${(-py).toFixed(2)}px, 0)`;
    }
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
    this.#runPull(now);
    this.#cradle.step(dt);
    this.#draw();
    if (this.#hand || this.#pull || this.#cradle.energy() > REST) {
      this.#frame = requestAnimationFrame(this.#tick);
      return;
    }
    this.#cradle.rest();
    this.#draw();
  };

  #runPull(now) {
    const pull = this.#pull;
    if (!pull) return;
    const t = (now - pull.start) / INTRO_PULL;
    pull.bob.omega = 0;
    if (t >= INTRO_HOLD) {
      pull.bob.held = false;
      this.#pull = null;
      return;
    }
    pull.bob.held = true;
    pull.bob.phi = pull.to * easeOut(Math.min(t, 1));
  }

  // Cancels the intro, letting its letter go where it is.
  #stopPull() {
    if (this.#pull) this.#pull.bob.held = false;
    this.#pull = null;
  }

  #local(event) {
    const box = this.query('.stage').getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  }

  /** The letter under the pointer, where it hangs right now. */
  #bobAt({ x, y }, slack) {
    const cradle = this.#cradle;
    return cradle.bobs.find((bob) => {
      const shift = cradle.shift(bob);
      return x > bob.left + shift - slack && x < bob.right + shift + slack && y > bob.top - slack && y < bob.bottom + slack;
    });
  }

  #down(event) {
    if (this.#hand || event.button !== 0 || reducedMotion.matches) return;
    const point = this.#local(event);
    const bob = this.#bobAt(point, Number.parseFloat(getComputedStyle(this).fontSize) * 0.1);
    if (!bob) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    this.#stopPull();
    bob.held = true;
    bob.omega = 0;
    this.#hand = {
      id: event.pointerId,
      bob,
      startX: point.x - this.#cradle.shift(bob),
      moved: false,
      prev: bob.phi,
      prevTime: event.timeStamp,
      spin: 0,
    };
    this.toggleAttribute('data-grabbing', true);
    this.#start();
  }

  #move(event) {
    const point = this.#local(event);
    const hand = this.#hand;
    if (hand?.id === event.pointerId) {
      const dx = point.x - hand.startX;
      if (Math.abs(dx) > 3) hand.moved = true;
      // The letter follows the finger sideways along its arc.
      const reach = Math.sin(MAX_ANGLE);
      const phi = Math.asin(clamp(dx / this.#cradle.radius, -reach, reach));
      const dt = Math.max(event.timeStamp - hand.prevTime, 8) / 1000;
      hand.spin = hand.spin * 0.4 + ((phi - hand.prev) / dt) * 0.6;
      hand.prev = phi;
      hand.prevTime = event.timeStamp;
      hand.bob.phi = phi;
      // Carried into its neighbours, the hand pushes them along.
      hand.bob.omega = hand.spin;
      this.#start();
      return;
    }
    if (event.pointerType !== 'mouse' || reducedMotion.matches) {
      this.#sweep = null;
      return;
    }
    const over = this.#bobAt(point, 0) ?? null;
    const sweep = this.#sweep;
    if (sweep && over && over !== sweep.over && !over.held) {
      // Brushing through a letter knocks it the way the cursor moved.
      const dt = Math.max(event.timeStamp - sweep.t, 8) / 1000;
      const vx = clamp((point.x - sweep.x) / dt, -MAX_SWEEP, MAX_SWEEP);
      over.omega += (SWEEP_PUSH * vx) / this.#cradle.radius;
      this.#stopPull();
      this.#start();
    }
    this.#sweep = { x: point.x, t: event.timeStamp, over };
  }

  #up(event) {
    const hand = this.#hand;
    if (hand?.id !== event.pointerId) return;
    const { bob } = hand;
    bob.held = false;
    this.removeAttribute('data-grabbing');
    if (hand.moved) {
      // Let go from still if the hand stopped before releasing.
      const idle = event.timeStamp - hand.prevTime > 60;
      bob.omega = idle ? 0 : clamp(hand.spin, -W0 * 1.5, W0 * 1.5);
    } else {
      // A tap knocks the letter away from the side it was tapped on.
      const side = this.#local(event).x < bob.center + this.#cradle.shift(bob) ? 1 : -1;
      bob.omega += side * W0 * TAP_ANGLE;
    }
    this.#hand = null;
    this.#start();
  }
}
