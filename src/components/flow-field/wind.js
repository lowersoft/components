// The flow field's air: a drifting wind, a disc the cursor pushes through it
// (potential flow), the vortices the disc sheds and the gusts clicks send.

// Wind speed in px/s at speed 1, and the size of its bends (px).
const WIND = 64;
const NOISE_SCALE = 340;
// How far the wind may turn from left-to-right, in radians.
const TURN = 1.15;
// How quickly a particle takes up the local wind (per second); lower values
// give them more momentum.
const RESPONSE = 9;
// The cursor is a disc of this radius (px) that the air flows around.
const DISC_RADIUS = 64;
const DISC_FOLLOW = 18;
const DISC_RISE = 7;
// Moving faster than this (px/s) sheds vortices behind the disc.
const SHED_SPEED = 150;
const SHED_MS = 42;
const MAX_VORTICES = 30;
// Each shed vortex: core radius (px), strength per px/s of cursor speed,
// how fast it weakens (s) and how fast its core spreads (s).
const VORTEX_CORE = 30;
const VORTEX_GAIN = 0.62 * Math.PI * VORTEX_CORE;
const VORTEX_TAU = 1.1;
const VORTEX_SPREAD = 0.5;
const MAX_CURSOR_SPEED = 1600;
// A click sends a ring of wind outwards.
const GUST_MS = 1300;
const GUST_SPEED = 0.62; // px per ms
const GUST_WIDTH = 64;
const GUST_STRENGTH = 560; // px/s at the crest
const MAX_GUSTS = 4;
// Four alpha levels: each is one stroked path, so a frame is four draw calls.
const BUCKETS = [0.18, 0.34, 0.54, 0.8];
// Segments longer than this are a wrap or a push, not motion.
const MAX_SEGMENT = 40;
// The still picture used for reduced motion and speed 0.
const STILL_STEPS = 18;
const STILL_DT = 0.05;

// Scratch vector the field functions write into, so a frame allocates
// nothing per particle.
const out = { x: 0, y: 0 };

/** Wind speed in px/s; a still frame (speed 0) is traced with the default wind. */
export const windFor = (speed) => WIND * (speed > 0 ? speed : 1);

export const createAir = (noise, speed) => ({
  noise,
  time: 0,
  wind: windFor(speed),
  disc: { x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0, amount: 0, on: false, lastShed: 0, side: 1 },
  vortices: [],
  gusts: [],
  now: 0,
});

/** Whether anything but the drift is moving the air. */
export const stirred = ({ disc, vortices, gusts }) => disc.on || disc.amount > 0 || vortices.length > 0 || gusts.length > 0;

/** The undisturbed wind: left to right, turned by slowly drifting noise. */
const baseWind = (air, x, y) => {
  const t = air.time;
  const angle = air.noise((x - t * WIND * 0.6) / NOISE_SCALE, y / NOISE_SCALE, t * 0.06) * TURN;
  out.x = Math.cos(angle) * air.wind;
  out.y = Math.sin(angle) * air.wind;
};

/**
 * Potential flow around a disc: the local wind (relative to the moving disc)
 * plus a doublet, so streams split ahead of it, speed up round its sides and
 * close up behind. In complex form, u - iv = conj(w) - (w - V) R² / z².
 */
const addDisc = (disc, x, y) => {
  const radius = DISC_RADIUS * disc.amount;
  const dx = x - disc.x;
  const dy = y - disc.y;
  const r2 = Math.max(dx * dx + dy * dy, radius * radius);
  const k = (radius * radius) / (r2 * r2);
  const rx = out.x - disc.vx;
  const ry = out.y - disc.vy;
  const p = dx * dx - dy * dy;
  const q = -2 * dx * dy;
  out.x -= k * (rx * p - ry * q);
  out.y += k * (rx * q + ry * p);
};

// Lamb-Oseen vortices: a swirl that weakens and spreads with age.
const addVortices = (vortices, x, y) => {
  for (const v of vortices) {
    const dx = x - v.x;
    const dy = y - v.y;
    const r2 = dx * dx + dy * dy + 1;
    const core = VORTEX_CORE * VORTEX_CORE * (1 + v.age / VORTEX_SPREAD);
    const swirl = ((v.gamma * Math.exp(-v.age / VORTEX_TAU)) / (2 * Math.PI * r2)) * (1 - Math.exp(-r2 / core));
    out.x -= swirl * dy;
    out.y += swirl * dx;
  }
};

const addGusts = (gusts, now, x, y) => {
  for (const g of gusts) {
    const age = now - g.start;
    const dx = x - g.x;
    const dy = y - g.y;
    const r = Math.hypot(dx, dy) + 0.001;
    const d = r - age * GUST_SPEED;
    const fade = 1 - age / GUST_MS;
    const push = GUST_STRENGTH * fade * fade * Math.exp(-(d * d) / (2 * GUST_WIDTH * GUST_WIDTH));
    out.x += (push * dx) / r;
    out.y += (push * dy) / r;
  }
};

/** The air's velocity at one point, written into `out`. */
const velocityAt = (air, x, y) => {
  baseWind(air, x, y);
  if (air.disc.amount > 0.002) addDisc(air.disc, x, y);
  if (air.vortices.length) addVortices(air.vortices, x, y);
  if (air.gusts.length) addGusts(air.gusts, air.now, x, y);
};

/** Glides the disc after the cursor and sheds vortices off its sides. */
export const stepDisc = (air, dt, now) => {
  const { disc, vortices } = air;
  const px = disc.x;
  const py = disc.y;
  const follow = 1 - Math.exp(-DISC_FOLLOW * dt);
  disc.x += (disc.targetX - disc.x) * follow;
  disc.y += (disc.targetY - disc.y) * follow;
  disc.amount += ((disc.on ? 1 : 0) - disc.amount) * (1 - Math.exp(-DISC_RISE * dt));
  if (disc.amount < 0.002 && !disc.on) disc.amount = 0;
  const smooth = 1 - Math.exp(-14 * dt);
  disc.vx += ((disc.x - px) / dt - disc.vx) * smooth;
  disc.vy += ((disc.y - py) / dt - disc.vy) * smooth;

  const speed = Math.hypot(disc.vx, disc.vy);
  if (speed < SHED_SPEED || disc.amount < 0.5 || now - disc.lastShed < SHED_MS) return;
  disc.lastShed = now;
  disc.side = -disc.side;
  const ux = disc.vx / speed;
  const uy = disc.vy / speed;
  const radius = DISC_RADIUS * disc.amount;
  // Alternate sides, like the vortex street behind a cylinder. The air
  // dragged along the disc's flank sets which way each one spins.
  vortices.push({
    x: disc.x - ux * radius * 0.9 - uy * disc.side * radius * 0.55,
    y: disc.y - uy * radius * 0.9 + ux * disc.side * radius * 0.55,
    gamma: disc.side * VORTEX_GAIN * Math.min(speed, MAX_CURSOR_SPEED),
    age: 0,
  });
  if (vortices.length > MAX_VORTICES) vortices.shift();
};

/** Ages the wake: vortices drift downwind and weaken until they're gone. */
export const stepWake = (air, dt) => {
  for (const v of air.vortices) {
    baseWind(air, v.x, v.y);
    v.x += out.x * 0.85 * dt;
    v.y += out.y * 0.85 * dt;
    v.age += dt;
  }
  while (air.vortices[0]?.age > VORTEX_TAU * 3.5) air.vortices.shift();
  while (air.gusts.length && air.now - air.gusts[0].start > GUST_MS) air.gusts.shift();
};

export const addGust = (air, x, y, now) => {
  air.gusts.push({ x, y, start: now });
  if (air.gusts.length > MAX_GUSTS) air.gusts.shift();
};

/** Particle state as flat arrays: cheap to walk 700 times a frame. */
export class Particles {
  count = 0;
  width = 0;
  height = 0;

  resize(count, width, height) {
    if (count === this.count) {
      // Same count, new size: stretch the particles over the new area so a
      // wider canvas doesn't start with an empty strip.
      const sx = this.width > 0 ? width / this.width : 1;
      const sy = this.height > 0 ? height / this.height : 1;
      for (let i = 0; i < count; i++) {
        this.x[i] *= sx;
        this.y[i] *= sy;
      }
      this.width = width;
      this.height = height;
      return;
    }
    Object.assign(this, { width, height, count });
    for (const key of ['x', 'y', 'vx', 'vy', 'life', 'maxLife', 'pace']) this[key] = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      this.spawn(i);
      // Start part way through their lives so they don't all fade together.
      this.life[i] = Math.random() * this.maxLife[i];
    }
  }

  spawn(i) {
    this.x[i] = Math.random() * this.width;
    this.y[i] = Math.random() * this.height;
    this.vx[i] = 0;
    this.vy[i] = 0;
    this.life[i] = 0;
    this.maxLife[i] = 3 + Math.random() * 5;
    this.pace[i] = 0.75 + Math.random() * 0.5;
  }
}

// Fades in at birth and out before respawning, so nothing pops.
const envelope = (life, maxLife) => Math.min(1, life / 0.6, (maxLife - life) / 0.6);

const bucketOf = (intensity) => Math.max(0, Math.min(BUCKETS.length - 1, Math.floor(intensity * 4)));

// A particle that blew off one edge comes back in on the opposite one.
const wrap = (v, size) => (v < -8 ? v + size + 16 : v > size + 8 ? v - size - 16 : v);

// Pushes a particle the disc swept over back out to its surface.
const keepOutOfDisc = (p, i, disc) => {
  if (disc.amount === 0) return;
  const radius = DISC_RADIUS * disc.amount;
  const dx = p.x[i] - disc.x;
  const dy = p.y[i] - disc.y;
  const r2 = dx * dx + dy * dy;
  if (r2 >= radius * radius || r2 < 0.0001) return;
  const r = Math.sqrt(r2);
  p.x[i] = disc.x + (dx / r) * radius;
  p.y[i] = disc.y + (dy / r) * radius;
};

const strokeBuckets = (context, paths) => {
  paths.forEach((path, b) => {
    context.globalAlpha = BUCKETS[b];
    context.stroke(path);
  });
  context.globalAlpha = 1;
};

/** Moves every particle one step and strokes the trail each leaves. */
export const stepParticles = (context, air, p, dt) => {
  const paths = BUCKETS.map(() => new Path2D());
  const take = 1 - Math.exp(-RESPONSE * dt);
  for (let i = 0; i < p.count; i++) {
    p.life[i] += dt;
    if (p.life[i] > p.maxLife[i]) {
      p.spawn(i);
      continue;
    }
    const x0 = p.x[i];
    const y0 = p.y[i];
    velocityAt(air, x0, y0);
    p.vx[i] += (out.x * p.pace[i] - p.vx[i]) * take;
    p.vy[i] += (out.y * p.pace[i] - p.vy[i]) * take;
    p.x[i] = wrap(x0 + p.vx[i] * dt, p.width);
    p.y[i] = wrap(y0 + p.vy[i] * dt, p.height);
    keepOutOfDisc(p, i, air.disc);
    const sx = p.x[i] - x0;
    const sy = p.y[i] - y0;
    if (sx * sx + sy * sy > MAX_SEGMENT * MAX_SEGMENT) continue;
    // Faster air draws darker, so the wake and the disc's flanks stand out.
    const pace = Math.hypot(p.vx[i], p.vy[i]) / (air.wind * 2.4 + 1);
    const path = paths[bucketOf(envelope(p.life[i], p.maxLife[i]) * Math.min(1, 0.4 + pace))];
    path.moveTo(x0, y0);
    path.lineTo(p.x[i], p.y[i]);
  }
  strokeBuckets(context, paths);
};

/** Streamlines traced from random seeds: a still picture of the wind. */
export const drawStill = (context, air, width, height, lines) => {
  const paths = BUCKETS.map(() => new Path2D());
  for (let n = 0; n < lines; n++) {
    let x = Math.random() * width;
    let y = Math.random() * height;
    for (let s = 0; s < STILL_STEPS; s++) {
      baseWind(air, x, y);
      const nx = x + out.x * STILL_DT;
      const ny = y + out.y * STILL_DT;
      // Each line darkens towards its head, like a trail.
      const path = paths[bucketOf((s / STILL_STEPS) * 0.75)];
      path.moveTo(x, y);
      path.lineTo(nx, ny);
      x = nx;
      y = ny;
    }
  }
  strokeBuckets(context, paths);
};
