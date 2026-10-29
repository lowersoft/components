import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion } from '../../core/motion.js';
import { watchTheme } from '../../core/theme.js';
import styles from './activity-terrain.scss?inline';

const DAYS = 7;
const GAP = 0.18;
// Tallest column, in cells.
const MAX_HEIGHT = 4.2;
const DEG = Math.PI / 180;
// Tilt of the terrain view; flat is looking straight down.
const PITCH_TERRAIN = 56 * DEG;
const YAW_TERRAIN = 18 * DEG;
// How far it turns before the edges start pulling back.
const YAW_LIMIT = 38 * DEG;
const PITCH_LIMIT = 66 * DEG;
// Drag, in radians per px.
const DRAG_YAW = 0.32 * DEG;
const DRAG_PITCH = 0.36 * DEG;
// Spin keeps going after a flick and slows on this half-life, in seconds.
const SPIN_HALF_LIFE = 0.16;
// The speed that coasts from straight on to the terrain's resting turn.
const SPIN_IN = (YAW_TERRAIN * Math.LN2) / SPIN_HALF_LIFE;
const PITCH_STIFFNESS = 140;
const PITCH_DAMPING = 2 * Math.sqrt(PITCH_STIFFNESS);
const EDGE_STIFFNESS = 180;
const BUMP_STIFFNESS = 400;
const BUMP_DAMPING = 2 * Math.sqrt(BUMP_STIFFNESS) * 0.7;
const BUMP = 0.45;
// Columns rise in a wave from where you grabbed; the far end lags by this
// share of the whole rise.
const WAVE = 0.7;
const PADDING = 28;
const REST_EPSILON = 0.0005;
const STEP = 1 / 120;
const LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// A gentle overshoot, so each column pops as it lands.
const easeOutBack = (t) => {
  const u = t - 1;
  return 1 + 2.4 * u * u * u + 1.4 * u * u;
};

// Resistance past an edge: the further out, the less it moves.
const rubber = (value, min, max) => {
  if (value < min) return min - 0.18 * (1 - Math.exp((value - min) / 0.18));
  if (value > max) return max + 0.18 * (1 - Math.exp((max - value) / 0.18));
  return value;
};

// Deterministic demo data: busy weekdays, quiet weekends, a few streaks.
const demoData = (weeks) => {
  let seed = 7;
  const random = () => {
    seed = (seed * 16_807) % 2_147_483_647;
    return seed / 2_147_483_647;
  };
  return Array.from({ length: weeks * DAYS }, (_, i) => {
    const weekend = i % DAYS >= 5;
    const season = 0.55 + 0.45 * Math.sin(i / 23);
    const streak = random() > 0.82 ? 2.2 : 1;
    const quiet = random() < (weekend ? 0.55 : 0.12);
    return quiet ? 0 : Math.round((weekend ? 3 : 9) * season * streak * random());
  });
};

const parseDay = (value) => {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

const buildCells = (data, endDate) => {
  const end = parseDay(endDate);
  const start = new Date(end.getTime() - (data.length - 1) * 86_400_000);
  // Rows run Monday to Sunday.
  const offset = (start.getUTCDay() + 6) % 7;
  const max = Math.max(1, ...data);
  return data.map((count, index) => {
    const slot = index + offset;
    const norm = count / max;
    return { index, col: Math.floor(slot / DAYS), row: slot % DAYS, count, level: count === 0 ? 0 : Math.ceil(norm * 4), height: 0.06 + norm ** 0.85 * MAX_HEIGHT, date: new Date(start.getTime() + index * 86_400_000) };
  });
};

const parseRgb = (value) => (value.match(/[\d.]+/g) ?? ['136', '136', '136']).slice(0, 3).map(Number);
const shade = ([r, g, b], amount) => `rgb(${Math.round(r * (1 - amount))},${Math.round(g * (1 - amount))},${Math.round(b * (1 - amount))})`;

const project = (pose, x, y, z) => {
  const cos = Math.cos(pose.yaw);
  const sin = Math.sin(pose.yaw);
  const xr = x * cos - z * sin;
  const zr = x * sin + z * cos;
  return [pose.cx + xr * pose.scale, pose.cy + (zr * Math.cos(pose.pitch) - y * Math.sin(pose.pitch)) * pose.scale];
};

// The faces of one column that face the camera, the top last.
const visibleFaces = (pose, x0, z0, h) => {
  const x1 = x0 + 1 - GAP;
  const z1 = z0 + 1 - GAP;
  const p = (x, y, z) => project(pose, x, y, z);
  const faces = [];
  const sin = Math.sin(pose.yaw);
  if (h > 0.02 && pose.pitch > 0.01) {
    // Of the four walls, the ones whose outward side points at the camera.
    const z = Math.cos(pose.yaw) > 0 ? z1 : z0;
    faces.push({ points: [p(x0, 0, z), p(x1, 0, z), p(x1, h, z), p(x0, h, z)], tone: 0.22 });
    if (Math.abs(sin) > 0.001) {
      const x = sin > 0 ? x1 : x0;
      faces.push({ points: [p(x, 0, z0), p(x, 0, z1), p(x, h, z1), p(x, h, z0)], tone: 0.38 });
    }
  }
  faces.push({ points: [p(x0, h, z0), p(x1, h, z0), p(x1, h, z1), p(x0, h, z1)], tone: 0 });
  return faces;
};

const inside = (points, x, y) => {
  let hit = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

const formatDay = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
const formatMonth = (date) => date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });

/**
 * A contribution heatmap that rises into terrain: each day is a column as
 * tall as its count. Drag to turn and tilt it (a flick spins on), switch
 * between the flat heatmap and the terrain, and hover or use the arrow keys
 * to read each day; the hovered column bumps up.
 *
 * @attr {Array<number>} data - Count per day, oldest first (JSON)
 * @attr {string} end-date - The day of the last count, as YYYY-MM-DD
 * @attr {string} heading
 * @attr {boolean} flat - Shows the flat heatmap
 * @fires lw-change - The view changed; `detail: { flat }`
 * @cssprop --lw-activity-terrain-accent - Colour of the hovered day
 */
export class LwActivityTerrain extends LwElement {
  static styles = styles;
  static props = {
    data: { type: Object, default: demoData(26) },
    endDate: { default: '2026-10-11' },
    heading: { default: 'Activity' },
    flat: { type: Boolean, reflect: true },
  };

  #cells = [];
  #weeks = 1;
  #yaw = 0;
  #yawSpeed = 0;
  // The intro tilts it up from flat once it is on screen.
  #pitch = 0;
  #pitchSpeed = 0;
  #pitchTarget = PITCH_TERRAIN;
  #bumps = new Float64Array(0);
  #bumpSpeeds = new Float64Array(0);
  #hovered = -1;
  #origin = { col: 0, row: 3 };
  #size = { width: 0, height: 0, dpr: 1 };
  #drag = null;
  #onScreen = false;
  #started = false;
  #palette = null;
  #energy = 0;
  #loop = fixedStepLoop(STEP, {
    step: () => this.#step(),
    render: () => {
      this.#draw();
      const busy = Boolean(this.#drag) || this.#energy > REST_EPSILON;
      this.#energy = 0;
      return busy;
    },
  });

  render() {
    const levels = [0, 1, 2, 3, 4].map((level) => `<span class="swatch level-${level}"></span>`).join('');
    return `<div class="top"><div class="titles"><p class="heading"></p><p class="readout" aria-live="polite"></p></div><div class="views"><button type="button" data-flat="true">Flat</button><button type="button" data-flat="false">Terrain</button></div></div>
<canvas role="img" tabindex="0"></canvas>
<div class="legend"><span>Less</span>${levels}<span>More</span><span class="accent" hidden></span><span class="ground" hidden></span></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const canvas = this.query('canvas');
    canvas.addEventListener('pointerdown', (event) => this.#down(event), options);
    canvas.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(type, (event) => this.#up(event), options);
    canvas.addEventListener('pointerleave', (event) => !this.#drag && event.pointerType === 'mouse' && this.#hover(null), options);
    canvas.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.views').addEventListener('click', (event) => this.#viewClick(event), options);
    const resize = new ResizeObserver(() => this.#measure());
    resize.observe(canvas);
    const visible = new IntersectionObserver(([entry]) => {
      this.#onScreen = entry.isIntersecting;
      this.#visibility();
    });
    visible.observe(canvas);
    document.addEventListener('visibilitychange', () => this.#visibility(), options);
    // The canvas reads its colours, so it repaints when the theme flips.
    watchTheme(() => {
      this.#palette = null;
      this.#draw();
    }, this.signal);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      visible.disconnect();
      this.#loop.stop();
    });
  }

  updated(changed) {
    if (changed.has('data') || changed.has('endDate')) {
      this.#cells = buildCells(this.data, this.endDate);
      this.#weeks = (this.#cells.at(-1)?.col ?? 0) + 1;
      this.#bumps = new Float64Array(this.#cells.length);
      this.#bumpSpeeds = new Float64Array(this.#cells.length);
      this.#hovered = -1;
    }
    if (changed.has('flat')) this.#pitchTarget = this.flat ? 0 : PITCH_TERRAIN;
    for (const button of this.shadowRoot.querySelectorAll('.views button')) button.ariaPressed = String((button.dataset.flat === 'true') === Boolean(this.flat));
    this.query('.heading').textContent = this.heading ?? '';
    this.query('canvas').ariaLabel = `${this.heading}: ${this.#total} contributions over ${this.#weeks} weeks. Use the arrow keys to read each day.`;
    this.#readout();
    this.#measure();
    this.#wake();
  }

  get #total() {
    return this.data.reduce((sum, n) => sum + n, 0);
  }

  #readout() {
    const cell = this.#cells[this.#hovered];
    this.query('.readout').textContent = cell ? `${cell.count} ${cell.count === 1 ? 'contribution' : 'contributions'} on ${formatDay(cell.date)}` : `${this.#total.toLocaleString('en-US')} contributions in the last ${this.#weeks} weeks`;
  }

  #measure() {
    const canvas = this.query('canvas');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.#size = { width: canvas.clientWidth, height: canvas.clientHeight, dpr };
    canvas.width = Math.round(this.#size.width * dpr);
    canvas.height = Math.round(this.#size.height * dpr);
    this.#draw();
  }

  #visibility() {
    if (this.#onScreen && !document.hidden) {
      if (!this.#started) {
        this.#started = true;
        if (this.#pitchTarget > 0) this.#turnIn();
      }
      this.#wake();
    } else {
      this.#loop.stop();
    }
  }

  #wake() {
    if (reducedMotion.matches) {
      // No travel: everything lands where it is going.
      this.#pitch = this.#pitchTarget;
      if (this.#pitchTarget === 0) this.#yaw = 0;
      this.#yaw = clamp(this.#yaw, -YAW_LIMIT, YAW_LIMIT);
      this.#pitchSpeed = this.#yawSpeed = 0;
      this.#bumps.fill(0);
      this.#draw();
      return;
    }
    if (this.#onScreen && !document.hidden) this.#loop.wake();
  }

  // Swings round from straight on as it tilts up, coasting to a stop at the
  // resting turn.
  #turnIn() {
    if (Math.abs(this.#yaw) > 2 * DEG) return;
    if (reducedMotion.matches) this.#yaw = YAW_TERRAIN;
    else this.#yawSpeed = SPIN_IN;
  }

  // ---- Simulation ----

  #step() {
    let energy = 0;
    if (!this.#drag) {
      // Spin coasts, then the edge pulls it back in range.
      this.#yawSpeed *= 0.5 ** (STEP / SPIN_HALF_LIFE);
      // Flat is always square on.
      const target = this.#pitchTarget === 0 ? 0 : clamp(this.#yaw, -YAW_LIMIT, YAW_LIMIT);
      if (target !== this.#yaw) this.#yawSpeed += ((target - this.#yaw) * EDGE_STIFFNESS - this.#yawSpeed * 2 * Math.sqrt(EDGE_STIFFNESS)) * STEP;
      this.#yaw += this.#yawSpeed * STEP;
      this.#pitchSpeed += ((this.#pitchTarget - this.#pitch) * PITCH_STIFFNESS - this.#pitchSpeed * PITCH_DAMPING) * STEP;
      this.#pitch += this.#pitchSpeed * STEP;
      energy = Math.max(Math.abs(this.#yawSpeed), Math.abs(target - this.#yaw), Math.abs(this.#pitchSpeed), Math.abs(this.#pitchTarget - this.#pitch));
    }
    for (let i = 0; i < this.#bumps.length; i++) {
      const target = i === this.#hovered && this.#pitch > 0.1 ? BUMP : 0;
      this.#bumpSpeeds[i] += ((target - this.#bumps[i]) * BUMP_STIFFNESS - this.#bumpSpeeds[i] * BUMP_DAMPING) * STEP;
      this.#bumps[i] += this.#bumpSpeeds[i] * STEP;
      energy = Math.max(energy, Math.abs(this.#bumpSpeeds[i]) * 0.1, Math.abs(target - this.#bumps[i]));
    }
    this.#energy = Math.max(this.#energy, energy);
  }

  // How tall a column stands now: the rise travels as a wave out from the
  // origin, and each column overshoots a touch as it lands.
  #columnHeight(cell, lift) {
    const span = Math.hypot(this.#weeks, DAYS) || 1;
    const d = Math.hypot(cell.col - this.#origin.col, cell.row - this.#origin.row) / span;
    return cell.height * easeOutBack(clamp(lift * (1 + WAVE) - d * WAVE, 0, 1)) + this.#bumps[cell.index];
  }

  // Fits the whole board, at its current turn and tilt, into the canvas.
  #pose() {
    const lift = clamp(this.#pitch / PITCH_TERRAIN, 0, 1.2);
    const w = this.#weeks;
    const probe = { yaw: this.#yaw, pitch: this.#pitch, scale: 1, cx: 0, cy: 0 };
    let [minX, maxX, minY, maxY] = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
    for (const [x, z] of [
      [0, 0],
      [w, 0],
      [0, DAYS],
      [w, DAYS],
    ]) {
      for (const y of [0, MAX_HEIGHT * Math.min(lift, 1)]) {
        const [px, py] = project(probe, x - w / 2, y, z - DAYS / 2);
        [minX, maxX, minY, maxY] = [Math.min(minX, px), Math.max(maxX, px), Math.min(minY, py), Math.max(maxY, py)];
      }
    }
    const { width, height } = this.#size;
    const scale = Math.min((width - PADDING * 2) / (maxX - minX), (height - PADDING * 2) / (maxY - minY));
    return { yaw: this.#yaw, pitch: this.#pitch, scale, cx: width / 2 - ((minX + maxX) / 2) * scale, cy: height / 2 - ((minY + maxY) / 2) * scale + 6, lift };
  }

  // Back to front: the further a column's base, the earlier it is drawn.
  #ordered(pose) {
    const sin = Math.sin(pose.yaw);
    const cos = Math.cos(pose.yaw);
    const depth = (c) => (c.col + 0.5 - this.#weeks / 2) * sin + (c.row + 0.5 - DAYS / 2) * cos;
    return [...this.#cells].sort((a, b) => depth(a) - depth(b));
  }

  // Colours come from CSS, read once per theme rather than every frame.
  get #colors() {
    if (this.#palette) return this.#palette;
    const read = (selector) => getComputedStyle(this.query(selector)).backgroundColor;
    this.#palette = {
      levels: [0, 1, 2, 3, 4].map((level) => parseRgb(read(`.level-${level}`))),
      accent: parseRgb(read('.accent')),
      text: read('.ground'),
      font: getComputedStyle(this).fontFamily,
    };
    return this.#palette;
  }

  #draw() {
    const { width, height, dpr } = this.#size;
    const ctx = this.query('canvas').getContext('2d');
    if (!ctx || !width) return;
    const palette = this.#colors;
    const pose = this.#pose();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    this.#drawLabels(ctx, pose, palette);
    ctx.lineJoin = 'round';
    for (const cell of this.#ordered(pose)) {
      const color = cell.index === this.#hovered ? palette.accent : palette.levels[cell.level];
      for (const face of visibleFaces(pose, cell.col - this.#weeks / 2, cell.row - DAYS / 2, this.#columnHeight(cell, pose.lift))) {
        ctx.beginPath();
        face.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();
        const fill = shade(color, face.tone);
        ctx.fillStyle = fill;
        ctx.fill();
        // A hairline in the same colour closes the seams between faces.
        ctx.strokeStyle = fill;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  // Labels lie on the ground, so they would hide behind the columns: they
  // fade out as the terrain rises, and the readout names each day.
  #drawLabels(ctx, pose, palette) {
    const alpha = clamp(1 - pose.lift * 1.6, 0, 1);
    if (!alpha) return;
    const weeks = this.#weeks;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = palette.text;
    ctx.font = `11px ${palette.font}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    let month = -1;
    for (const cell of this.#cells) {
      if (cell.row !== 0 && cell.index !== 0) continue;
      const m = cell.date.getUTCMonth();
      if (m === month || cell.col >= weeks - 1) continue;
      month = m;
      const [x, y] = project(pose, cell.col - weeks / 2, 0, -0.75 - DAYS / 2);
      ctx.fillText(formatMonth(cell.date), x, y);
    }
    ctx.textAlign = 'right';
    LABELS.forEach((label, row) => {
      if (!label) return;
      const [x, y] = project(pose, -0.35 - weeks / 2, 0, row + 0.4 - DAYS / 2);
      ctx.fillText(label, x, y);
    });
    ctx.globalAlpha = 1;
  }

  #hitTest(x, y) {
    const pose = this.#pose();
    const list = this.#ordered(pose);
    for (let i = list.length - 1; i >= 0; i--) {
      const cell = list[i];
      for (const face of visibleFaces(pose, cell.col - this.#weeks / 2, cell.row - DAYS / 2, this.#columnHeight(cell, pose.lift))) if (inside(face.points, x, y)) return cell;
    }
    return null;
  }

  // ---- Views and input ----

  #setView(flat, origin) {
    this.#origin = origin ?? { col: flat ? this.#weeks : 0, row: 3 };
    this.#yawSpeed = 0;
    if (flat !== Boolean(this.flat)) {
      this.flat = flat;
      this.emit('change', { flat });
    }
    this.#pitchTarget = flat ? 0 : PITCH_TERRAIN;
    if (!flat) this.#turnIn();
    this.#wake();
  }

  #viewClick(event) {
    const button = event.target.closest('button');
    if (button) this.#setView(button.dataset.flat === 'true');
  }

  #hover(cell) {
    const index = cell ? cell.index : -1;
    if (index === this.#hovered) return;
    this.#hovered = index;
    this.#readout();
    if (reducedMotion.matches) this.#draw();
    else this.#wake();
  }

  #local(event) {
    const rect = this.query('canvas').getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  #down(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const { x, y } = this.#local(event);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const cell = this.#hitTest(x, y);
    if (cell) this.#origin = { col: cell.col, row: cell.row };
    this.#drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: this.#yaw, pitch: this.#pitch, moved: false, samples: [{ t: event.timeStamp, x: event.clientX, y: event.clientY }] };
    this.#yawSpeed = this.#pitchSpeed = 0;
    this.query('canvas').toggleAttribute('data-dragging', true);
    this.#hover(cell);
    this.#wake();
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) {
      if (event.pointerType === 'mouse') {
        const { x, y } = this.#local(event);
        this.#hover(this.#hitTest(x, y));
      }
      return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    drag.moved ||= Math.hypot(dx, dy) > 4;
    if (!drag.moved) return;
    this.#yaw = rubber(drag.yaw + dx * DRAG_YAW, -YAW_LIMIT, YAW_LIMIT);
    this.#pitch = rubber(drag.pitch + dy * DRAG_PITCH, 0, PITCH_LIMIT);
    drag.samples.push({ t: event.timeStamp, x: event.clientX, y: event.clientY });
    if (drag.samples.length > 5) drag.samples.shift();
    if (reducedMotion.matches) this.#draw();
    else this.#wake();
  }

  #up(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    this.query('canvas').removeAttribute('data-dragging');
    if (!drag.moved) {
      this.#wake();
      return;
    }
    // Velocity from the last few samples, in px per second.
    const first = drag.samples[0];
    const last = drag.samples.at(-1);
    const dt = Math.max((last.t - first.t) / 1000, 0.016);
    const recent = event.timeStamp - last.t < 80;
    this.#yawSpeed = recent ? ((last.x - first.x) / dt) * DRAG_YAW : 0;
    this.#pitchSpeed = recent ? ((last.y - first.y) / dt) * DRAG_PITCH : 0;
    // Land on whichever view the throw is heading for.
    const flat = this.#pitch + this.#pitchSpeed * 0.15 < PITCH_TERRAIN / 2;
    if (flat !== Boolean(this.flat)) {
      this.flat = flat;
      this.emit('change', { flat });
    }
    this.#pitchTarget = flat ? 0 : PITCH_TERRAIN;
    this.#wake();
  }

  #key(event) {
    const move = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!move) return;
    event.preventDefault();
    const current = this.#cells[this.#hovered] ?? this.#cells.at(-1);
    if (!current) return;
    this.#hover(this.#cells.find((c) => c.col === current.col + move[0] && c.row === current.row + move[1]) ?? current);
  }
}
