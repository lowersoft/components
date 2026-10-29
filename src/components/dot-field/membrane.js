// The dot field's physics: a halftone of dots on a springy membrane. Every
// dot is pulled home, towards its four neighbours (so a push travels as a
// wave) and slowed by damping. State lives in flat typed arrays.

// Width of a light or dark patch in the idle halftone, in px.
const NOISE_SCALE = 240;
// How fast the halftone drifts through time.
const NOISE_SPEED = 0.07;
// The noise is sampled on every third dot and blended in between.
const TONE_STEP = 3;
// The membrane, per second squared.
const ANCHOR = 26;
const COUPLING = 340;
const DAMPING = 2.4;
// The pointer: the radius it reaches (px), how much of its velocity it hands
// to the dots it passes (per second), and the fastest swipe it counts (px/s).
const POINTER_RADIUS = 72;
const POINTER_GAIN = 14;
const POINTER_MAX_SPEED = 2600;
// Share of the swipe speed that also pushes dots sideways, out of its path,
// so the wake opens into a V like water behind a boat.
const POINTER_PART = 0.45;
// A click: how fast the ring travels (px/s), how thick it is (px), how hard
// it shoves (px/s²) and how long it lives (s).
const SHOCK_SPEED = 620;
const SHOCK_WIDTH = 34;
const SHOCK_FORCE = 5200;
export const SHOCK_LIFE = 1.3;
// Squeezed dots grow and stretched ones shrink, so the wake reads as a band
// of darker and lighter tone, like ink in a halftone print.
const COMPRESSION_GAIN = 3;
// Dot sizes snap to this many steps; each step is one path.
const BUCKETS = 10;
// Below these the field counts as settled.
const REST_SPEED = 2;
const REST_OFFSET = 0.15;

const coarseSize = (count) => Math.ceil((count - 1) / TONE_STEP) + 1;

/** The grid of dots and every spring's state. */
export const createField = (width, height, spacing) => {
  // One extra dot past each edge, so the membrane has no visible border.
  const cols = Math.ceil(width / spacing) + 3;
  const rows = Math.ceil(height / spacing) + 3;
  const size = cols * rows;
  return {
    cols,
    rows,
    spacing,
    originX: (width - (cols - 1) * spacing) / 2,
    originY: (height - (rows - 1) * spacing) / 2,
    // Idle size of each dot from the noise, 0 to 1.
    tone: new Float32Array(size),
    coarse: new Float32Array(coarseSize(cols) * coarseSize(rows)),
    ox: new Float32Array(size),
    oy: new Float32Array(size),
    vx: new Float32Array(size),
    vy: new Float32Array(size),
    ax: new Float32Array(size),
    ay: new Float32Array(size),
  };
};

/**
 * The idle halftone. The noise is smooth over a few hundred px, so it is
 * sampled on every TONE_STEP-th dot and blended in between: a ninth of the
 * cost of sampling every dot.
 */
export const sampleTone = (field, noise, time) => {
  const { cols, rows, spacing, originX, originY, tone, coarse } = field;
  const z = time * NOISE_SPEED;
  const step = spacing * TONE_STEP;
  const coarseCols = coarseSize(cols);
  const coarseRows = coarseSize(rows);
  for (let j = 0; j < coarseRows; j++) {
    const ny = (originY + j * step) / NOISE_SCALE;
    for (let i = 0; i < coarseCols; i++) {
      const nx = (originX + i * step) / NOISE_SCALE;
      const n = noise(nx, ny, z) * 0.75 + noise(nx * 2.1 + 9.3, ny * 2.1 + 3.7, z * 1.3) * 0.25;
      coarse[j * coarseCols + i] = Math.min(1, Math.max(0, 0.5 + n * 1.1));
    }
  }
  for (let j = 0; j < rows; j++) {
    const cj = Math.min(Math.floor(j / TONE_STEP), coarseRows - 2);
    const fy = j / TONE_STEP - cj;
    for (let i = 0; i < cols; i++) {
      const ci = Math.min(Math.floor(i / TONE_STEP), coarseCols - 2);
      const fx = i / TONE_STEP - ci;
      const a = cj * coarseCols + ci;
      const top = coarse[a] + (coarse[a + 1] - coarse[a]) * fx;
      const bottom = coarse[a + coarseCols] + (coarse[a + coarseCols + 1] - coarse[a + coarseCols]) * fx;
      tone[j * cols + i] = top + (bottom - top) * fy;
    }
  }
};

/** Sum of the four neighbours; past the border counts as a still dot. */
const neighbours = (values, { cols, rows }, i, j) => {
  const k = j * cols + i;
  return (i > 0 ? values[k - 1] : 0) + (i < cols - 1 ? values[k + 1] : 0) + (j > 0 ? values[k - cols] : 0) + (j < rows - 1 ? values[k + cols] : 0);
};

/** The range of columns and rows a box from (x0, y0) to (x1, y1) touches. */
const cellsIn = ({ cols, rows, spacing, originX, originY }, x0, y0, x1, y1) => ({
  i0: Math.max(0, Math.floor((x0 - originX) / spacing)),
  i1: Math.min(cols - 1, Math.ceil((x1 - originX) / spacing)),
  j0: Math.max(0, Math.floor((y0 - originY) / spacing)),
  j1: Math.min(rows - 1, Math.ceil((y1 - originY) / spacing)),
});

/** A ring travelling out from each click, shoving the dots it crosses. */
const applyShocks = (field, shocks) => {
  const { cols, spacing, originX, originY, ax, ay } = field;
  for (const shock of shocks) {
    const reach = shock.age * SHOCK_SPEED;
    const fade = 1 - shock.age / SHOCK_LIFE;
    const force = SHOCK_FORCE * fade * fade;
    const outer = reach + SHOCK_WIDTH;
    const inner = Math.max(0, reach - SHOCK_WIDTH);
    const { i0, i1, j0, j1 } = cellsIn(field, shock.x - outer, shock.y - outer, shock.x + outer, shock.y + outer);
    for (let j = j0; j <= j1; j++) {
      const dy = originY + j * spacing - shock.y;
      for (let i = i0; i <= i1; i++) {
        const dx = originX + i * spacing - shock.x;
        const dist = Math.hypot(dx, dy);
        if (dist < inner || dist > outer || dist === 0) continue;
        const band = 1 - Math.abs(dist - reach) / SHOCK_WIDTH;
        const k = j * cols + i;
        ax[k] += (dx / dist) * force * band;
        ay[k] += (dy / dist) * force * band;
      }
    }
  }
};

/**
 * The pointer hands part of its velocity to the dots near the path it took
 * since the last frame: a slow drift barely stirs them, a fast swipe drags a
 * strip of the membrane along and the springs turn it into a wake.
 */
export const applyPointer = (field, pointer, dt) => {
  const segX = pointer.x - pointer.lastX;
  const segY = pointer.y - pointer.lastY;
  pointer.lastX = pointer.x;
  pointer.lastY = pointer.y;
  const length = Math.hypot(segX, segY);
  if (!pointer.inside || length < 0.5 || dt <= 0) return false;
  const speed = Math.min(length / dt, POINTER_MAX_SPEED);
  const pvx = (segX / length) * speed;
  const pvy = (segY / length) * speed;
  const { cols, spacing, originX, originY, vx, vy } = field;
  const startX = pointer.x - segX;
  const startY = pointer.y - segY;
  const { i0, i1, j0, j1 } = cellsIn(
    field,
    Math.min(startX, pointer.x) - POINTER_RADIUS,
    Math.min(startY, pointer.y) - POINTER_RADIUS,
    Math.max(startX, pointer.x) + POINTER_RADIUS,
    Math.max(startY, pointer.y) + POINTER_RADIUS,
  );
  const lengthSq = length * length;
  const gain = Math.min(1, POINTER_GAIN * dt);
  for (let j = j0; j <= j1; j++) {
    const py = originY + j * spacing;
    for (let i = i0; i <= i1; i++) {
      const px = originX + i * spacing;
      // Distance from the dot to the swipe.
      const t = Math.min(1, Math.max(0, ((px - startX) * segX + (py - startY) * segY) / lengthSq));
      const awayX = px - startX - segX * t;
      const awayY = py - startY - segY * t;
      const dist = Math.hypot(awayX, awayY);
      if (dist >= POINTER_RADIUS) continue;
      const falloff = 1 - dist / POINTER_RADIUS;
      const k = j * cols + i;
      const amount = gain * falloff * falloff;
      const side = dist > 0 ? (speed * POINTER_PART) / dist : 0;
      vx[k] += (pvx + awayX * side - vx[k]) * amount;
      vy[k] += (pvy + awayY * side - vy[k]) * amount;
    }
  }
  return true;
};

/** One fixed physics step of `h` seconds. Returns whether anything still moves. */
export const integrate = (field, shocks, h) => {
  const { cols, rows, ox, oy, vx, vy, ax, ay } = field;
  ax.fill(0);
  ay.fill(0);
  applyShocks(field, shocks);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const k = j * cols + i;
      ax[k] += -ANCHOR * ox[k] + COUPLING * (neighbours(ox, field, i, j) - 4 * ox[k]) - DAMPING * vx[k];
      ay[k] += -ANCHOR * oy[k] + COUPLING * (neighbours(oy, field, i, j) - 4 * oy[k]) - DAMPING * vy[k];
    }
  }
  let moving = false;
  for (let k = 0; k < ox.length; k++) {
    vx[k] += ax[k] * h;
    vy[k] += ay[k] * h;
    ox[k] += vx[k] * h;
    oy[k] += vy[k] * h;
    moving ||= Math.abs(vx[k]) > REST_SPEED || Math.abs(vy[k]) > REST_SPEED || Math.abs(ox[k]) > REST_OFFSET || Math.abs(oy[k]) > REST_OFFSET;
  }
  return moving;
};

/** Puts every dot exactly home, at rest. */
export const settle = ({ ox, oy, vx, vy }) => {
  for (const values of [ox, oy, vx, vy]) values.fill(0);
};

/** How much the membrane is squeezed (+) or stretched (-) at one dot. */
const compression = ({ cols, rows, spacing, ox, oy }, i, j) => {
  const k = j * cols + i;
  const left = i > 0 ? ox[k - 1] : 0;
  const right = i < cols - 1 ? ox[k + 1] : 0;
  const up = j > 0 ? oy[k - cols] : 0;
  const down = j < rows - 1 ? oy[k + cols] : 0;
  return -(right - left + down - up) / (2 * spacing);
};

/**
 * Draws every dot. Sizes snap to a few steps and each step is one path, so
 * the field is a handful of fills instead of thousands.
 */
export const drawField = (context, field, { width, height, color }, moving) => {
  const { cols, rows, spacing, originX, originY, tone, ox, oy } = field;
  const maxRadius = spacing * 0.42;
  const paths = Array.from({ length: BUCKETS }, () => new Path2D());
  const filled = new Uint8Array(BUCKETS);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const k = j * cols + i;
      let amount = 0.12 + 0.6 * tone[k];
      if (moving) amount *= 1 + COMPRESSION_GAIN * compression(field, i, j);
      const bucket = Math.round(Math.min(1, Math.max(0, amount)) * (BUCKETS - 1));
      if (bucket === 0) continue;
      const radius = (maxRadius * bucket) / (BUCKETS - 1);
      const x = originX + i * spacing + ox[k];
      const y = originY + j * spacing + oy[k];
      paths[bucket].moveTo(x + radius, y);
      paths[bucket].arc(x, y, radius, 0, Math.PI * 2);
      filled[bucket] = 1;
    }
  }
  context.clearRect(0, 0, width, height);
  context.fillStyle = color;
  for (let b = 1; b < BUCKETS; b++) {
    if (!filled[b]) continue;
    // Larger dots are a touch more opaque, which deepens the tone range.
    context.globalAlpha = 0.2 + (0.32 * b) / (BUCKETS - 1);
    context.fill(paths[b]);
  }
  context.globalAlpha = 1;
};
