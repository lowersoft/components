import { fixedStepLoop } from '../../core/motion.js';
import { graphemes } from '../../core/text.js';

// Letters are physical objects: shared letters travel to their new place on a
// spring arc, leaving letters tip and fall off the baseline, entering letters
// drop in and land with a squash, and digits roll like a counter.

const STEP = 1 / 120;
const damping = (k, zeta) => 2 * zeta * Math.sqrt(k);
const TRAVEL = { k: 140, c: damping(140, 0.8) };
const LIFT = { k: 300, c: damping(300, 0.9) };
const ROLL_SPRING = { k: 200, c: damping(200, 0.86) };
const SQUASH = { k: 1400, c: damping(1400, 0.6) };
const TILT = { k: 140, c: damping(140, 0.7) };
const WIDTH = { k: 220, c: damping(220, 1) };
// Distances below are in em, so the motion scales with the font.
const GRAVITY = 32;
const DROP = 0.7;
const FALL_FADE = 0.9;
const ROLL = 0.75;
const LAND_SQUASH = -0.16;
const ENTER_STAGGER = 0.035;
// Long strings share this much stagger, so the last letter is not late.
const MAX_ENTER_SPREAD = 0.45;
const FADE_RATE = 7;

export const isDigit = (char) => char >= '0' && char <= '9';
export const isBlank = (char) => char.trim() === '';
const clamp01 = (n) => Math.min(1, Math.max(0, n));

function paint(g) {
  const sy = 1 + g.sq;
  const sx = 1 - g.sq * 0.6;
  g.el.style.transform = `translate3d(${g.x.toFixed(2)}px, ${g.y.toFixed(2)}px, 0) rotate(${g.r.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
  g.el.style.opacity = g.o.toFixed(3);
}

function stepSquash(g, h) {
  if (g.sq === 0 && g.vsq === 0) return;
  g.vsq += (-SQUASH.k * g.sq - SQUASH.c * g.vsq) * h;
  g.sq += g.vsq * h;
  if (Math.abs(g.sq) < 0.001 && Math.abs(g.vsq) < 0.01) g.sq = g.vsq = 0;
}

function stepGlyph(g, h, em) {
  switch (g.phase) {
    case 'travel': {
      // Lift along a shallow arc that peaks halfway, so crossing letters pass
      // over and under each other instead of through.
      const span = Math.abs(g.tx - g.x0);
      const p = span < 0.5 ? 1 : clamp01(1 - Math.abs(g.tx - g.x) / span);
      g.ty = g.arc * 4 * p * (1 - p);
      g.vx += (-TRAVEL.k * (g.x - g.tx) - TRAVEL.c * g.vx) * h;
      g.x += g.vx * h;
      g.vy += (-LIFT.k * (g.y - g.ty) - LIFT.c * g.vy) * h;
      g.y += g.vy * h;
      g.o = Math.min(1, g.o + FADE_RATE * h);
      break;
    }
    case 'drop':
      g.vy += GRAVITY * em * h;
      g.y += g.vy * h;
      if (g.y >= 0) {
        // Landing: one squash, then the spring takes it back.
        g.y = g.vy = 0;
        g.sq = LAND_SQUASH;
        g.phase = 'rest';
      }
      g.o = clamp01(1 + g.y / (DROP * em));
      break;
    case 'fall':
      g.vy += GRAVITY * em * h;
      g.y += g.vy * h;
      g.x += g.vx * h;
      g.vr += (-TILT.k * (g.r - g.tr) - TILT.c * g.vr) * h;
      g.r += g.vr * h;
      g.o = Math.min(g.o, clamp01(1 - g.y / (FALL_FADE * em)));
      break;
    case 'roll':
      g.vy += (-ROLL_SPRING.k * (g.y - g.ty) - ROLL_SPRING.c * g.vy) * h;
      g.y += g.vy * h;
      g.o = clamp01(1 - Math.abs(g.y) / (ROLL * em));
      break;
    case 'fade':
      g.o = clamp01(g.o + (g.leaving ? -FADE_RATE : FADE_RATE) * h);
      break;
    default:
  }
  stepSquash(g, h);
}

const isGone = (g) => g.leaving && g.o <= 0.002;

/** Moves a glyph into rest once it has arrived. Returns true while moving. */
function settle(g) {
  if (g.leaving) return !isGone(g);
  const arrived = Math.abs(g.x - g.tx) < 0.05 && Math.abs(g.vx) < 0.5 && Math.abs(g.y) < 0.05 && Math.abs(g.vy) < 0.5;
  if (((g.phase === 'travel' || g.phase === 'roll') && arrived) || (g.phase === 'fade' && g.o >= 1)) {
    Object.assign(g, { x: g.tx, y: 0, vx: 0, vy: 0, o: 1, phase: 'rest' });
  }
  return g.phase !== 'rest' || g.sq !== 0;
}

const digitsOf = (items) => Number(items.filter((item) => item.digit).map((item) => item.char).join(''));

export class MorphEngine {
  glyphs = [];
  // The glyphs that spell the current text, in order.
  order = [];
  reduced = false;
  #root;
  #measure;
  #started = false;
  #em = 16;
  #w = 0;
  #vw = 0;
  #tw = 0;
  #nextId = 0;
  #moving = false;
  #loop = fixedStepLoop(STEP, { step: () => this.#step(), render: () => this.#render() });

  /**
   * @param {HTMLElement} root - Positioned box the glyphs are drawn in; its width animates
   * @param {HTMLElement} measure - Hidden row that lays the text out to read positions from
   */
  constructor(root, measure) {
    this.#root = root;
    this.#measure = measure;
  }

  /** Morphs to `text`. The first call places it without motion. */
  update(text) {
    this.#em = parseFloat(getComputedStyle(this.#root).fontSize) || 16;
    const { tokens, width } = this.#tokens(text, true);
    if (!this.#started) {
      this.#started = true;
      this.order = tokens.map((token) => this.#create(token));
      this.#w = this.#tw = width;
      this.#paintWidth();
      return;
    }

    const instant = this.reduced;
    const letters = new Map();
    const slots = new Map();
    for (const g of this.order) {
      if (g.digit) slots.set(g.slot, g);
      else letters.set(g.char, [...(letters.get(g.char) ?? []), g]);
    }
    // Digits roll up when the number grows, down when it shrinks.
    const direction = digitsOf(tokens) < digitsOf(this.order) ? -1 : 1;
    const next = [];
    let entering = 0;
    for (const token of tokens) {
      let old;
      if (token.digit) {
        old = slots.get(token.slot);
        slots.delete(token.slot);
      } else {
        old = letters.get(token.char)?.shift();
      }
      if (old && old.char === token.char) {
        this.#move(old, token, instant);
        next.push(old);
        continue;
      }
      if (old) this.#leave(old, direction, instant);
      const g = this.#create(token);
      this.#enter(g, direction, instant, entering++);
      next.push(g);
    }
    // Squeeze the entering stagger so a long string does not trickle in.
    const spread = entering * ENTER_STAGGER;
    if (spread > MAX_ENTER_SPREAD) next.forEach((g) => (g.delay *= MAX_ENTER_SPREAD / spread));
    for (const list of letters.values()) list.forEach((g) => this.#leave(g, direction, instant));
    for (const g of slots.values()) this.#leave(g, direction, instant);

    this.order = next;
    this.#tw = width;
    if (instant) {
      this.#w = width;
      this.#vw = 0;
      this.#paintWidth();
    }
    this.#loop.wake();
  }

  /** Re-places the current text after a resize or a font load. */
  place(text) {
    this.#em = parseFloat(getComputedStyle(this.#root).fontSize) || 16;
    const { tokens, width } = this.#tokens(text, false);
    if (tokens.length !== this.order.length) return;
    tokens.forEach((token, i) => {
      const g = this.order[i];
      g.tx = token.x;
      if (g.phase === 'rest') {
        g.x = token.x;
        paint(g);
      }
    });
    this.#tw = width;
    if (!this.#moving) {
      this.#w = width;
      this.#paintWidth();
    }
  }

  stop() {
    this.#loop.stop();
  }

  // Where each character sits, from the hidden measure row. Digits get a slot
  // counted from the right, so prices roll like counters.
  #tokens(text, rebuild) {
    const chars = graphemes(text);
    if (rebuild) {
      this.#measure.replaceChildren(...chars.map((char) => Object.assign(document.createElement('span'), { textContent: char })));
    }
    const cells = this.#measure.children;
    const tokens = [];
    chars.forEach((char, i) => {
      if (cells[i] && !isBlank(char)) tokens.push({ char, x: cells[i].offsetLeft, digit: isDigit(char), slot: 0 });
    });
    let slot = 0;
    for (let i = tokens.length - 1; i >= 0; i--) if (tokens[i].digit) tokens[i].slot = slot++;
    return { tokens, width: this.#measure.offsetWidth };
  }

  #create(token) {
    const el = Object.assign(document.createElement('span'), { className: 'glyph', textContent: token.char });
    const g = {
      id: this.#nextId++,
      char: token.char,
      digit: token.digit,
      slot: token.slot,
      el,
      phase: 'rest',
      leaving: false,
      delay: 0,
      x: token.x,
      vx: 0,
      tx: token.x,
      x0: token.x,
      arc: 0,
      y: 0,
      vy: 0,
      ty: 0,
      r: 0,
      vr: 0,
      tr: 0,
      sq: 0,
      vsq: 0,
      o: 1,
    };
    this.glyphs.push(g);
    this.#root.append(el);
    paint(g);
    return g;
  }

  #move(g, token, instant) {
    g.slot = token.slot;
    g.tx = token.x;
    if (instant) {
      Object.assign(g, { x: token.x, y: 0, vx: 0, vy: 0, phase: g.o < 1 ? 'fade' : 'rest' });
      return;
    }
    if (g.phase === 'rest' && Math.abs(token.x - g.x) < 0.5) {
      g.x = token.x;
      return;
    }
    // Redirects keep the current position and velocity: no restart.
    const distance = token.x - g.x;
    Object.assign(g, {
      x0: g.x,
      delay: 0,
      arc: -Math.sign(distance) * Math.min(0.22 * this.#em, Math.abs(distance) * 0.14),
      phase: 'travel',
    });
  }

  #enter(g, direction, instant, index) {
    g.o = 0;
    if (instant) {
      g.phase = 'fade';
    } else if (g.digit) {
      Object.assign(g, { y: direction * ROLL * this.#em, ty: 0, phase: 'roll' });
    } else {
      Object.assign(g, { y: -DROP * this.#em, phase: 'drop', delay: index * ENTER_STAGGER });
    }
    paint(g);
  }

  #leave(g, direction, instant) {
    g.leaving = true;
    g.delay = 0;
    if (instant) {
      g.phase = 'fade';
    } else if (g.digit) {
      Object.assign(g, { phase: 'roll', ty: -direction * ROLL * 1.2 * this.#em });
    } else {
      // Tip toward the side it sits on, 5-15°, and drift that way a little.
      const side = g.x + this.#em * 0.3 < this.#tw / 2 ? -1 : 1;
      Object.assign(g, { tr: side * (5 + ((g.id * 7) % 11)), vx: side * 0.4 * this.#em, vy: Math.max(g.vy, 0), phase: 'fall' });
    }
  }

  #step() {
    let moving = false;
    for (const g of this.glyphs) {
      if (g.delay > 0) {
        g.delay -= STEP;
        moving = true;
        continue;
      }
      stepGlyph(g, STEP, this.#em);
      if (settle(g)) moving = true;
    }
    if (Math.abs(this.#w - this.#tw) >= 0.1 || Math.abs(this.#vw) >= 0.1) {
      this.#vw += (-WIDTH.k * (this.#w - this.#tw) - WIDTH.c * this.#vw) * STEP;
      this.#w += this.#vw * STEP;
      moving = true;
    } else {
      this.#w = this.#tw;
      this.#vw = 0;
    }
    this.#moving = moving;
  }

  // Draws the frame and drops the glyphs that have left; false once all is still.
  #render() {
    for (const g of this.glyphs) paint(g);
    this.#paintWidth();
    if (this.glyphs.some(isGone)) {
      for (const g of this.glyphs) if (isGone(g)) g.el.remove();
      this.glyphs = this.glyphs.filter((g) => !isGone(g));
    }
    return this.#moving;
  }

  #paintWidth() {
    this.#root.style.width = `${this.#w.toFixed(2)}px`;
  }
}
