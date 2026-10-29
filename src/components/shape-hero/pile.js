// A small rigid-body solver for pills (capsules): a segment with a radius.
// Fixed 120 Hz steps, sequential impulses with friction, and the whole pile
// sleeps once it settles, so a resting hero costs nothing.

export const STEP = 1 / 120;
const GRAVITY = 2600;
const ITERATIONS = 16;
const FRICTION = 0.5;
const RESTITUTION = 0.22;
const BOUNCE_THRESHOLD = 140;
const SLOP = 0.4;
const CORRECTION = 0.3;
const MAX_SPEED = 3200;
const MAX_SPIN = 18;
const SLEEP_SPEED = 9;
const SLEEP_STEPS = 40;
// Below this speed a body is nearly at rest: damp it so a pile can't creep.
const REST_SPEED = 30;
const DRAG_REACH = 0.28;

/** The ends of a body's spine; a circle has one. */
const ends = (body) => {
  if (body.half === 0) return [[body.x, body.y]];
  const c = Math.cos(body.a) * body.half;
  const s = Math.sin(body.a) * body.half;
  return [
    [body.x - c, body.y - s],
    [body.x + c, body.y + s],
  ];
};

/** The point on a segment closest to `p`. */
const closest = (p, [a, b = a]) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = dx * dx + dy * dy;
  const t = length === 0 ? 0 : Math.min(Math.max(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length, 0), 1);
  return [a[0] + dx * t, a[1] + dy * t];
};

/** A contact on `a` (and `b`, or a wall when null); the normal points from `b` to `a`. */
const contact = (a, b, nx, ny, px, py, depth) => ({
  a,
  b,
  nx,
  ny,
  rax: px - a.x,
  ray: py - a.y,
  rbx: b ? px - b.x : 0,
  rby: b ? py - b.y : 0,
  depth,
  correct: true,
  target: 0,
  kn: 0,
  kt: 0,
  jn: 0,
  jt: 0,
});

// Only the deepest of a set of contacts pushes apart, so they don't overshoot.
const keepDeepest = (found, out) => {
  let deepest = null;
  for (const c of found) {
    c.correct = false;
    if (!deepest || c.depth > deepest.depth) deepest = c;
    out.push(c);
  }
  if (deepest) deepest.correct = true;
};

/** Contacts between two pills: each end of one against the other's spine. */
const collidePair = (a, b, out) => {
  const reach = a.r + b.r;
  const spineA = ends(a);
  const spineB = ends(b);
  const found = [];
  const test = (p, q, fromB) => {
    const dx = fromB ? q[0] - p[0] : p[0] - q[0];
    const dy = fromB ? q[1] - p[1] : p[1] - q[1];
    const distance = Math.hypot(dx, dy);
    if (distance >= reach + 0.5) return;
    const nx = distance > 1e-6 ? dx / distance : 0;
    const ny = distance > 1e-6 ? dy / distance : -1;
    // The contact point sits halfway between the two surfaces.
    const [ax, ay] = fromB ? q : p;
    const inset = a.r - (reach - distance) / 2;
    found.push(contact(a, b, nx, ny, ax - nx * inset, ay - ny * inset, reach - distance));
  };
  for (const p of spineA) test(p, closest(p, spineB), false);
  for (const p of spineB) test(p, closest(p, spineA), true);
  if (!found.length) {
    // Spines that cross in the middle: compare their centres' closest points.
    const p = closest([b.x, b.y], spineA);
    test(p, closest(p, spineB), false);
  }
  keepDeepest(found, out);
};

/** Contacts with the floor and the side walls; the top is open. */
const collideWalls = (body, width, height, out) => {
  const found = [];
  for (const [x, y] of ends(body)) {
    if (y + body.r - height > -0.5) found.push(contact(body, null, 0, -1, x, height, y + body.r - height));
    if (body.r - x > -0.5) found.push(contact(body, null, 1, 0, 0, y, body.r - x));
    if (x + body.r - width > -0.5) found.push(contact(body, null, -1, 0, width, y, x + body.r - width));
  }
  keepDeepest(found, out);
};

const relativeVelocity = ({ a, b, rax, ray, rbx, rby }) => {
  let vx = a.vx - a.w * ray;
  let vy = a.vy + a.w * rax;
  if (b) {
    vx -= b.vx - b.w * rby;
    vy -= b.vy + b.w * rbx;
  }
  return [vx, vy];
};

const applyImpulse = (c, jx, jy) => {
  const { a, b } = c;
  a.vx += jx * a.invMass;
  a.vy += jy * a.invMass;
  a.w += a.invInertia * (c.rax * jy - c.ray * jx);
  if (b) {
    b.vx -= jx * b.invMass;
    b.vy -= jy * b.invMass;
    b.w -= b.invInertia * (c.rbx * jy - c.rby * jx);
  }
};

const effectiveMass = (c, nx, ny) => {
  const { a, b } = c;
  const ra = c.rax * ny - c.ray * nx;
  let k = a.invMass + a.invInertia * ra * ra;
  if (b) {
    const rb = c.rbx * ny - c.rby * nx;
    k += b.invMass + b.invInertia * rb * rb;
  }
  return k;
};

const prepare = (c) => {
  c.kn = effectiveMass(c, c.nx, c.ny);
  c.kt = effectiveMass(c, -c.ny, c.nx);
  const [vx, vy] = relativeVelocity(c);
  const vn = vx * c.nx + vy * c.ny;
  // Not touching yet: it may close the gap this step, no more.
  if (c.depth < 0) c.target = c.depth / STEP;
  else c.target = vn < -BOUNCE_THRESHOLD ? -RESTITUTION * vn : 0;
};

const solve = (c) => {
  let [vx, vy] = relativeVelocity(c);
  const vn = vx * c.nx + vy * c.ny;
  const jn = Math.max(c.jn + (c.target - vn) / c.kn, 0);
  const dn = jn - c.jn;
  c.jn = jn;
  applyImpulse(c, c.nx * dn, c.ny * dn);

  [vx, vy] = relativeVelocity(c);
  const tx = -c.ny;
  const ty = c.nx;
  const limit = FRICTION * c.jn;
  const jt = Math.min(Math.max(c.jt - (vx * tx + vy * ty) / c.kt, -limit), limit);
  const dt = jt - c.jt;
  c.jt = jt;
  applyImpulse(c, tx * dt, ty * dt);
};

const correct = (c) => {
  if (!c.correct || c.depth <= SLOP) return;
  const { a, b } = c;
  const push = ((c.depth - SLOP) * CORRECTION) / (a.invMass + (b ? b.invMass : 0));
  a.x += c.nx * push * a.invMass;
  a.y += c.ny * push * a.invMass;
  if (b) {
    b.x -= c.nx * push * b.invMass;
    b.y -= c.ny * push * b.invMass;
  }
};

/** Pulls the grabbed point towards the pointer, through the body's mass. */
const applyDrag = (drag) => {
  const { body } = drag;
  const cos = Math.cos(body.a);
  const sin = Math.sin(body.a);
  const rx = drag.lx * cos - drag.ly * sin;
  const ry = drag.lx * sin + drag.ly * cos;
  const handle = contact(body, null, 0, 0, body.x + rx, body.y + ry, 0);
  const [vx] = relativeVelocity(handle);
  applyImpulse(handle, (((drag.tx - body.x - rx) / STEP) * DRAG_REACH - vx) / effectiveMass(handle, 1, 0), 0);
  const [, vy] = relativeVelocity(handle);
  applyImpulse(handle, 0, (((drag.ty - body.y - ry) / STEP) * DRAG_REACH - vy) / effectiveMass(handle, 0, 1));
  // Hang calmly from the grab point rather than spin.
  body.w *= 0.96;
};

const clampSpeed = (body) => {
  const speed = Math.hypot(body.vx, body.vy);
  if (speed > MAX_SPEED) {
    body.vx *= MAX_SPEED / speed;
    body.vy *= MAX_SPEED / speed;
  }
  body.w = Math.min(Math.max(body.w, -MAX_SPIN), MAX_SPIN);
};

/** Advances the world `{ bodies, width, height, drag, still }` one step. Returns true once all rest. */
export const step = (world) => {
  const { bodies, width, height, drag } = world;
  for (const body of bodies) {
    body.vy += GRAVITY * STEP;
    body.vx *= 0.999;
    body.w *= 0.995;
  }
  if (drag) applyDrag(drag);
  const contacts = [];
  for (let i = 0; i < bodies.length; i++) {
    const a = bodies[i];
    collideWalls(a, width, height, contacts);
    for (let j = i + 1; j < bodies.length; j++) {
      const b = bodies[j];
      const near = a.half + a.r + b.half + b.r;
      if (Math.abs(a.x - b.x) < near && Math.abs(a.y - b.y) < near) collidePair(a, b, contacts);
    }
  }
  for (const c of contacts) prepare(c);
  for (let k = 0; k < ITERATIONS; k++) for (const c of contacts) solve(c);
  let fastest = 0;
  for (const body of bodies) {
    clampSpeed(body);
    if (body !== drag?.body && Math.hypot(body.vx, body.vy) + Math.abs(body.w) * body.r < REST_SPEED) {
      body.vx *= 0.8;
      body.vy *= 0.8;
      body.w *= 0.8;
    }
    body.x += body.vx * STEP;
    body.y += body.vy * STEP;
    body.a += body.w * STEP;
    fastest = Math.max(fastest, Math.hypot(body.vx, body.vy) + Math.abs(body.w) * (body.half + body.r));
  }
  for (const c of contacts) correct(c);
  world.still = fastest < SLEEP_SPEED && !drag ? world.still + 1 : 0;
  return world.still > SLEEP_STEPS;
};

// Deterministic scatter, so the drop looks the same on every visit.
const scatter = (n) => (Math.sin(n * 12.9898) * 43_758.5453) % 1;

/**
 * A body for each element, dropped in from above one after another, until
 * they would cover `fill` of the area; the rest are hidden.
 */
export const createBodies = (elements, width, height, fill) => {
  const bodies = [];
  let area = 0;
  elements.forEach((el, index) => {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const fits = area + w * h <= width * height * fill;
    el.style.visibility = fits ? 'visible' : 'hidden';
    if (!fits) return;
    area += w * h;
    const mass = (w * h) / 1000;
    bodies.push({
      x: width * (0.2 + 0.6 * Math.abs(scatter(index + 1))),
      y: -h - index * 64,
      a: scatter(index + 7) * 0.9,
      vx: scatter(index + 3) * 120,
      vy: 0,
      w: scatter(index + 5) * 2,
      half: Math.max(w - h, 0) / 2,
      r: Math.min(w, h) / 2,
      invMass: 1 / mass,
      invInertia: 12 / (mass * (w * w + h * h)),
      width: w,
      height: h,
      el,
    });
  });
  return bodies;
};

/** The topmost body under a point, or null. */
export const hitTest = (bodies, x, y) => {
  for (let i = bodies.length - 1; i >= 0; i--) {
    const body = bodies[i];
    const [qx, qy] = closest([x, y], ends(body));
    if (Math.hypot(x - qx, y - qy) <= body.r) return body;
  }
  return null;
};

/** Places each body's element. */
export const place = (bodies) => {
  for (const body of bodies) body.el.style.transform = `translate3d(${(body.x - body.width / 2).toFixed(2)}px, ${(body.y - body.height / 2).toFixed(2)}px, 0) rotate(${body.a.toFixed(4)}rad)`;
};
