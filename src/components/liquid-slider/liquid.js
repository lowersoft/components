// The glass is a cylinder seen from a little above: its rim and floor are
// ellipses RY tall, its walls run from LEFT to RIGHT. Units are the
// drawing's, WIDTH × HEIGHT.
export const WIDTH = 280;
export const HEIGHT = 360;
export const LEFT = 84;
export const RIGHT = 196;
export const CX = (LEFT + RIGHT) / 2;
export const RADIUS = (RIGHT - LEFT) / 2;
export const RY = 9;
export const RIM_Y = 104;
export const FLOOR_Y = 312;
// Where the surface sits when the glass is empty and when it is full.
export const EMPTY_Y = FLOOR_Y;
export const FULL_Y = RIM_Y + 16;
export const MAX_BUBBLES = 14;
export const STEP = 1 / 120;

// The surface is a row of columns that each bob up and down and pull on
// their neighbours: a 1D wave. Heights in px, time in seconds.
const COLUMNS = 34;
const SPREAD = 2600;
const TENSION = 30;
const DAMPING = 2.4;
// Neighbouring columns drag on each other's speed, which smooths out short
// jagged ripples and leaves the long sloshes.
const VISCOSITY = 22;
const MAX_WAVE = 16;
// While held, the surface under the pointer is pulled towards it this hard,
// and the pointer's sideways speed piles the liquid up ahead of it.
const GRAB = 900;
const GRAB_REACH = 2.6;
const GRAB_MAX = 14;
const STIR = 0.55;
// The level chases its target on a spring: fast but not instant, so a quick
// drag leaves the liquid behind the pointer for a moment.
const LEVEL_STIFFNESS = 220;
const LEVEL_DAMPING = 26;
const REST_ENERGY = 0.02;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const f = (n) => n.toFixed(2);

// Each column's x, and how far in front of and behind the centre line the
// surface ellipse reaches there.
const COLUMN_X = Array.from({ length: COLUMNS }, (_, i) => LEFT + (i / (COLUMNS - 1)) * (RIGHT - LEFT));
const DEPTH = COLUMN_X.map((x) => {
  const u = (x - CX) / RADIUS;
  return RY * Math.sqrt(Math.max(0, 1 - u * u));
});

export const levelToY = (level) => EMPTY_Y - level * (EMPTY_Y - FULL_Y);

const front = (levelY, heights, i) => Math.min(levelY + heights[i] + DEPTH[i], FLOOR_Y + DEPTH[i]);

/** Drawing paths for a level and the surface heights. */
export const paths = (levelY, heights) => {
  let back = '';
  let edge = '';
  let lip = '';
  for (let i = 0; i < COLUMNS; i++) {
    back += `${i === 0 ? 'M' : 'L'}${f(COLUMN_X[i])} ${f(Math.min(levelY + heights[i] - DEPTH[i], FLOOR_Y))}`;
    const point = `${f(COLUMN_X[i])} ${f(front(levelY, heights, i))}`;
    edge += `${i === 0 ? 'M' : 'L'}${point}`;
    // A thin line along the front lip, where light catches the surface.
    if (i > 0 && i < COLUMNS - 1) lip += `${i === 1 ? 'M' : 'L'}${point}`;
  }
  let backFront = '';
  for (let i = COLUMNS - 1; i >= 0; i--) backFront += `L${f(COLUMN_X[i])} ${f(front(levelY, heights, i))}`;
  return {
    // The top of the liquid: the back edge across, then the front back.
    surface: `${back}${backFront}Z`,
    // The body: the front edge, down the wall and along the floor.
    body: `${edge}L${RIGHT} ${FLOOR_Y} A${RADIUS} ${RY} 0 0 1 ${LEFT} ${FLOOR_Y}Z`,
    lip,
  };
};

/** The liquid: a level on a spring, a wavy surface and rising bubbles. */
export class Liquid {
  heights = new Float64Array(COLUMNS);
  speeds = new Float64Array(COLUMNS);
  #accels = new Float64Array(COLUMNS);
  level = 0;
  levelSpeed = 0;
  target = 0;
  bubbles = [];
  energy = 0;
  // The pointer while held: where it is, in drawing units, and its sideways speed.
  held = false;
  px = 0;
  py = 0;
  pvx = 0;
  #seed = 1;

  // Deterministic, so the same pour always bubbles the same way.
  #random() {
    this.#seed = (this.#seed * 16_807) % 2_147_483_647;
    return this.#seed / 2_147_483_647;
  }

  get settled() {
    return !this.held && this.energy < REST_ENERGY && Math.abs(this.target - this.level) < 0.0005 && Math.abs(this.levelSpeed) < 0.001 && this.bubbles.length === 0;
  }

  /** Puts everything at rest on the target. */
  rest() {
    this.level = this.target;
    this.levelSpeed = 0;
    this.heights.fill(0);
    this.speeds.fill(0);
    this.bubbles.length = 0;
    this.energy = 0;
  }

  /** A drop in the middle, so a key press gets a ripple too. */
  drop(up) {
    this.speeds[Math.floor(COLUMNS / 2)] += up ? -90 : 90;
  }

  step() {
    this.#stepLevel();
    this.#stepWaves();
    this.#stepBubbles();
  }

  // When the level rises fast, the pour drags bubbles in from the floor.
  #stepLevel() {
    this.levelSpeed += ((this.target - this.level) * LEVEL_STIFFNESS - this.levelSpeed * LEVEL_DAMPING) * STEP;
    this.level += this.levelSpeed * STEP;
    if (this.levelSpeed > 0.5 && this.bubbles.length < MAX_BUBBLES && this.#random() < this.levelSpeed * 0.05) {
      this.bubbles.push({
        x: LEFT + 10 + this.#random() * (RIGHT - LEFT - 20),
        y: FLOOR_Y + 2,
        r: 1.2 + this.#random() * 2,
        speed: 40 + this.#random() * 50,
        phase: this.#random() * Math.PI * 2,
      });
    }
  }

  // Each column accelerates towards its neighbours' average and back to
  // rest, then the volume is re-levelled so waves only move liquid around.
  #stepWaves() {
    const { heights: h, speeds: v } = this;
    const a = this.#accels;
    const levelY = levelToY(this.level);
    for (let i = 0; i < COLUMNS; i++) {
      const l = i === 0 ? 0 : i - 1;
      const r = i === COLUMNS - 1 ? i : i + 1;
      let accel = SPREAD * (h[l] + h[r] - 2 * h[i]) + VISCOSITY * (v[l] + v[r] - 2 * v[i]) - TENSION * h[i] - DAMPING * v[i];
      if (this.held) {
        const reach = (COLUMN_X[i] - this.px) / ((RIGHT - LEFT) / COLUMNS);
        const weight = Math.exp(-(reach * reach) / (GRAB_REACH * GRAB_REACH));
        accel += GRAB * clamp(this.py - (levelY + h[i]), -GRAB_MAX, GRAB_MAX) * weight * 0.05;
        accel -= STIR * this.pvx * ((i - (COLUMNS - 1) / 2) / COLUMNS) * 60;
      }
      a[i] = accel;
    }
    let mean = 0;
    for (let i = 0; i < COLUMNS; i++) {
      v[i] += a[i] * STEP;
      h[i] = clamp(h[i] + v[i] * STEP, -MAX_WAVE, MAX_WAVE);
      mean += h[i];
    }
    mean /= COLUMNS;
    let energy = 0;
    for (let i = 0; i < COLUMNS; i++) {
      h[i] -= mean;
      energy += Math.abs(h[i]) + Math.abs(v[i]) * STEP;
    }
    this.energy = energy / COLUMNS;
  }

  // Bubbles rise with a wobble and pop at the surface, leaving a ripple.
  #stepBubbles() {
    const levelY = levelToY(this.level);
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.y -= b.speed * STEP;
      b.phase += STEP * 9;
      if (b.y > levelY + this.#heightAt(b.x) + 1) continue;
      const column = Math.round(((b.x - LEFT) / (RIGHT - LEFT)) * (COLUMNS - 1));
      this.speeds[clamp(column, 0, COLUMNS - 1)] -= 30 * b.r;
      this.bubbles.splice(i, 1);
    }
  }

  // Surface height (px from the level) at an x, between two columns.
  #heightAt(x) {
    const t = clamp((x - LEFT) / (RIGHT - LEFT), 0, 1) * (COLUMNS - 1);
    const i = Math.floor(t);
    const j = Math.min(i + 1, COLUMNS - 1);
    return this.heights[i] + (this.heights[j] - this.heights[i]) * (t - i);
  }
}
