import { moveHighlight } from '../../core/highlight.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion } from '../../core/motion.js';
import { watchTheme } from '../../core/theme.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './activity-terrain.scss?inline';

const DAYS = 7;
const DAY_MS = 86_400_000;
// The gap between cells, as a share of a cell.
const GAP = 0.2;
// The busiest day's column, in cells; a quiet day keeps a thin plate.
const MAX_HEIGHT = 2.6;
const MIN_HEIGHT = 0.12;
const PLATE = 0.04;
const DEG = Math.PI / 180;
// The terrain's tilt, its resting turn and how far it turns either way.
const PITCH = 52 * DEG;
const YAW = 24 * DEG;
const YAW_LIMIT = 40 * DEG;
// Radians per pixel dragged, and how quickly a flick's spin dies away.
const DRAG = 0.35 * DEG;
const FRICTION = 0.004;
// The view change: a critically damped spring, so it never overshoots.
const VIEW_STIFFNESS = 90;
const VIEW_DAMPING = 2 * Math.sqrt(VIEW_STIFFNESS);
// Columns rise in a wave from the oldest week; the newest lags this much.
const WAVE = 0.35;
// The column being read lifts by this much, easing at this rate.
const BUMP = 0.35;
const BUMP_RATE = 18;
const STEP = 1 / 120;
const REST = 0.0005;
// Room around the board, and for the day and month labels of the flat view.
const PAD = 20;
const LABEL_LEFT = 30;
const LABEL_TOP = 18;
const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - (1 - t) ** 3;

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

// A YYYY-MM-DD day at UTC midnight, or today when it does not parse.
const parseDay = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  const date = match ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))) : null;
  if (date && !Number.isNaN(date.getTime())) return date;
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

const formatDay = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
const formatMonth = (date) => date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
const plural = (count, word) => `${count.toLocaleString('en-US')} ${word}${count === 1 ? '' : 's'}`;

// One cell per day, in weeks of Monday to Sunday.
const buildCells = (data, end) => {
  const counts = (Array.isArray(data) ? data : []).map((value) => (Number.isFinite(Number(value)) ? Math.max(0, Math.round(Number(value))) : 0));
  const start = new Date(end.getTime() - (counts.length - 1) * DAY_MS);
  const offset = (start.getUTCDay() + 6) % DAYS;
  const max = Math.max(1, ...counts);
  return counts.map((count, index) => {
    const slot = index + offset;
    const norm = count / max;
    return {
      index,
      col: Math.floor(slot / DAYS),
      row: slot % DAYS,
      count,
      level: count === 0 ? 0 : Math.max(1, Math.ceil(norm * 4)),
      height: count === 0 ? PLATE : MIN_HEIGHT + norm * (MAX_HEIGHT - MIN_HEIGHT),
      date: new Date(start.getTime() + index * DAY_MS),
    };
  });
};

// Month labels over the first week that holds a month's first Monday-row
// day, never crowding the label before.
const buildMonths = (cells) => {
  const months = [];
  for (const cell of cells) {
    if (cell.row !== 0 && cell.index !== 0) continue;
    const month = cell.date.getUTCMonth();
    if (months.length && months.at(-1).month === month) continue;
    if (months.length && cell.col - months.at(-1).col < 3) {
      // Too close to the first label, which then gives way.
      if (months.length === 1) months[0] = { col: cell.col, month, date: cell.date };
      continue;
    }
    months.push({ col: cell.col, month, date: cell.date });
  }
  return months;
};

const parseRgb = (value) => (value.match(/[\d.]+/g) ?? ['136', '136', '136']).slice(0, 3).map(Number);
const shade = ([r, g, b], amount) => `rgb(${Math.round(r * (1 - amount))} ${Math.round(g * (1 - amount))} ${Math.round(b * (1 - amount))})`;

// Point in polygon, by ray casting.
const inside = (points, x, y) => {
  let hit = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

/**
 * A contribution heatmap that rises into terrain: each day a column as tall
 * as its count. Switch between the flat heatmap and the terrain; in the
 * terrain, drag sideways to turn it, and a flick spins on until it settles.
 * Hover, tap or use the arrow keys to read a day; its column lifts and turns
 * the accent colour.
 *
 * @attr {Array<number>} data - Count per day, oldest first (JSON)
 * @attr {string} end-date - The day of the last count, as YYYY-MM-DD; today if it does not parse
 * @attr {string} heading
 * @attr {boolean} flat - Shows the flat heatmap
 * @fires lw-change - The view was switched; `detail: { flat }`
 * @cssprop --lw-activity-terrain-accent - Colour of the day being read
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
  #months = [];
  #weeks = 1;
  #total = 0;
  // The view: 0 is the flat heatmap, 1 the terrain, and its target.
  #t = 0;
  #tSpeed = 0;
  #target = 0;
  #yaw = YAW;
  #yawSpeed = 0;
  #bumps = new Float32Array(0);
  #active = -1;
  #drag = null;
  #size = { width: 0, height: 0, dpr: 1 };
  #palette = null;
  #faces = [];
  #reach = 2;
  #visible = false;
  #introduced = false;
  #loop = fixedStepLoop(STEP, {
    step: () => this.#step(),
    render: () => {
      this.#draw();
      return this.#busy;
    },
  });

  render() {
    const swatches = [0, 1, 2, 3, 4].map((level) => `<span class="swatch level-${level}"></span>`).join('');
    return `<header class="top"><div class="titles"><h2 class="heading"></h2><p class="readout" aria-live="polite"></p></div>
<div class="views" role="radiogroup" aria-label="View"><span class="pill" aria-hidden="true"></span><button type="button" role="radio" data-flat="true">Flat</button><button type="button" role="radio" data-flat="false">Terrain</button></div></header>
<canvas role="img" tabindex="0"></canvas>
<footer class="legend" aria-hidden="true"><span class="hint"></span><span class="scale"><span>Less</span>${swatches}<span>More</span></span><span class="accent"></span></footer>`;
  }

  connected() {
    const options = { signal: this.signal };
    const canvas = this.query('canvas');
    canvas.addEventListener('pointerdown', (event) => this.#down(event), options);
    canvas.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel']) canvas.addEventListener(type, (event) => this.#up(event), options);
    canvas.addEventListener('pointerleave', (event) => !this.#drag && event.pointerType === 'mouse' && this.#setActive(-1), options);
    canvas.addEventListener('keydown', (event) => this.#key(event), options);
    canvas.addEventListener('blur', () => !this.#drag && this.#setActive(-1), options);
    const views = this.query('.views');
    views.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (button) this.#choose(button.dataset.flat === 'true');
    }, options);
    views.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      this.#choose(!this.flat);
      views.querySelector('[aria-checked="true"]')?.focus();
    }, options);
    const resize = new ResizeObserver(() => this.#measure());
    resize.observe(canvas);
    resize.observe(views);
    watchVisibility(canvas, (visible) => {
      this.#visible = visible;
      if (visible) this.#introduce();
      this.#wake();
    }, this.signal);
    // The canvas reads its colours from CSS, so it repaints when the theme changes.
    watchTheme(() => {
      this.#palette = null;
      this.#draw();
    }, this.signal);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      this.#loop.stop();
      this.#drag = null;
    });
  }

  updated(changed) {
    if (changed.has('data') || changed.has('endDate')) {
      this.#cells = buildCells(this.data, parseDay(this.endDate));
      this.#months = buildMonths(this.#cells);
      this.#weeks = (this.#cells.at(-1)?.col ?? 0) + 1;
      this.#total = this.#cells.reduce((sum, cell) => sum + cell.count, 0);
      this.#bumps = new Float32Array(this.#cells.length);
      this.#active = -1;
    }
    // Until it has been on screen, the terrain waits flat for its intro.
    if (changed.has('flat') && (this.#introduced || this.flat)) this.#aim(this.flat ? 0 : 1);
    for (const button of this.shadowRoot.querySelectorAll('.views button')) {
      const checked = (button.dataset.flat === 'true') === Boolean(this.flat);
      button.ariaChecked = String(checked);
      button.tabIndex = checked ? 0 : -1;
    }
    this.query('.heading').textContent = this.heading ?? '';
    this.query('.hint').textContent = this.flat ? '' : 'Drag to turn';
    this.query('canvas').ariaLabel = `${this.heading ?? ''}: ${plural(this.#total, 'contribution')} over ${plural(this.#weeks, 'week')}. Use the arrow keys to read each day.`;
    this.#paintPill();
    this.#readout();
    this.#measure();
    this.#wake();
  }

  // ---- View ----

  // Heads for the flat heatmap (0) or the terrain (1); reduced motion lands at once.
  #aim(target) {
    this.#target = target;
    if (reducedMotion.matches) {
      this.#t = target;
      this.#tSpeed = 0;
    }
  }

  // The terrain rises the first time it comes into view.
  #introduce() {
    if (this.#introduced) return;
    this.#introduced = true;
    this.#aim(this.flat ? 0 : 1);
  }

  #choose(flat) {
    if (flat === Boolean(this.flat)) return;
    this.flat = flat;
    this.emit('change', { flat });
  }

  #paintPill() {
    const checked = this.query('.views [aria-checked="true"]');
    if (checked?.offsetWidth) moveHighlight(this.query('.pill'), checked);
  }

  // ---- Simulation ----

  get #busy() {
    if (this.#drag?.moved) return true;
    if (Math.abs(this.#target - this.#t) > REST || Math.abs(this.#tSpeed) > REST) return true;
    if (this.#yawSpeed) return true;
    for (let i = 0; i < this.#bumps.length; i++) if (this.#bumps[i] !== (i === this.#active ? BUMP : 0)) return true;
    return false;
  }

  #wake() {
    if (this.#visible && !document.hidden && this.#busy) this.#loop.wake();
    else this.#draw();
  }

  #step() {
    // The view springs to its target without overshooting.
    this.#tSpeed += ((this.#target - this.#t) * VIEW_STIFFNESS - this.#tSpeed * VIEW_DAMPING) * STEP;
    this.#t = clamp(this.#t + this.#tSpeed * STEP, 0, 1);
    if (Math.abs(this.#target - this.#t) <= REST && Math.abs(this.#tSpeed) <= REST * 10) {
      this.#t = this.#target;
      this.#tSpeed = 0;
    }
    // A flick spins on and dies away; the limits stop it dead.
    if (!this.#drag && this.#yawSpeed) {
      this.#yawSpeed *= FRICTION ** STEP;
      const yaw = this.#yaw + this.#yawSpeed * STEP;
      this.#yaw = clamp(yaw, -YAW_LIMIT, YAW_LIMIT);
      if (yaw !== this.#yaw || Math.abs(this.#yawSpeed) < REST * 10) this.#yawSpeed = 0;
    }
    const rate = 1 - Math.exp(-BUMP_RATE * STEP);
    for (let i = 0; i < this.#bumps.length; i++) {
      const target = i === this.#active ? BUMP : 0;
      if (this.#bumps[i] === target) continue;
      this.#bumps[i] += (target - this.#bumps[i]) * rate;
      if (Math.abs(target - this.#bumps[i]) <= REST) this.#bumps[i] = target;
    }
  }

  // ---- Drawing ----

  #measure() {
    const canvas = this.query('canvas');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.#size = { width, height, dpr };
    if (canvas.width !== Math.round(width * dpr)) canvas.width = Math.round(width * dpr);
    if (canvas.height !== Math.round(height * dpr)) canvas.height = Math.round(height * dpr);
    this.#paintPill();
    this.#draw();
  }

  // Colours come from CSS through the legend, read once per theme.
  get #colors() {
    if (this.#palette) return this.#palette;
    const read = (selector) => getComputedStyle(this.query(selector)).backgroundColor;
    this.#palette = {
      levels: [0, 1, 2, 3, 4].map((level) => parseRgb(read(`.level-${level}`))),
      accent: parseRgb(read('.accent')),
      text: getComputedStyle(this.query('.legend')).color,
      font: getComputedStyle(this).fontFamily,
    };
    return this.#palette;
  }

  // The scale that fits the board flat, and the one that fits the terrain at
  // any turn, so turning it never zooms.
  #scales() {
    const { width, height } = this.#size;
    const weeks = this.#weeks;
    const flat = Math.min((width - PAD * 2 - LABEL_LEFT) / weeks, (height - PAD * 2 - LABEL_TOP) / DAYS);
    let terrain = Number.POSITIVE_INFINITY;
    for (const yaw of [0, YAW_LIMIT]) {
      const cos = Math.cos(yaw);
      const sin = Math.sin(yaw);
      const spanX = weeks * cos + DAYS * sin;
      const spanY = (weeks * sin + DAYS * cos) * Math.cos(PITCH) + MAX_HEIGHT * Math.sin(PITCH);
      terrain = Math.min(terrain, (width - PAD * 2) / spanX, (height - PAD * 2) / spanY);
    }
    return { flat: Math.max(flat, 1), terrain: Math.max(terrain, 1) };
  }

  // The camera at the current view: turned and tilted with the terrain,
  // square and flat with the heatmap, centred either way.
  #pose() {
    const t = this.#t;
    const { flat, terrain } = this.#scales();
    const pitch = PITCH * t;
    const scale = lerp(flat, terrain, t);
    const { width, height } = this.#size;
    return {
      t,
      cos: Math.cos(this.#yaw * t),
      sin: Math.sin(this.#yaw * t),
      cosP: Math.cos(pitch),
      sinP: Math.sin(pitch),
      scale,
      // Flat, the labels take room on the left and top; raised, the columns
      // take room above, so the board drops by half their height.
      cx: width / 2 + (LABEL_LEFT / 2) * (1 - t),
      cy: height / 2 + (LABEL_TOP / 2) * (1 - t) + (MAX_HEIGHT * Math.sin(pitch) * scale) / 2,
    };
  }

  // A point on the board: x across the weeks, z down the days, y up.
  #project(pose, x, y, z) {
    const wx = x - this.#weeks / 2;
    const wz = z - DAYS / 2;
    const xr = wx * pose.cos - wz * pose.sin;
    const zr = wx * pose.sin + wz * pose.cos;
    return [pose.cx + xr * pose.scale, pose.cy + (zr * pose.cosP - y * pose.sinP) * pose.scale];
  }

  // How tall a column stands: risen in a wave across the weeks, lifted when read.
  #heightOf(cell, t) {
    const lag = this.#weeks > 1 ? (cell.col / (this.#weeks - 1)) * WAVE : 0;
    const rise = easeOut(clamp((t - lag) / (1 - WAVE), 0, 1));
    return cell.height * rise + this.#bumps[cell.index] * t;
  }

  // The faces of one column that face the camera, the top last.
  #facesOf(pose, cell) {
    const x0 = cell.col + GAP / 2;
    const x1 = cell.col + 1 - GAP / 2;
    const z0 = cell.row + GAP / 2;
    const z1 = cell.row + 1 - GAP / 2;
    const h = this.#heightOf(cell, pose.t);
    const p = (x, y, z) => this.#project(pose, x, y, z);
    const faces = [];
    if (pose.sinP > 0.001 && h > 0.001) {
      // The near wall always shows; of the side walls, the one whose outward
      // side turns towards us: the +x wall when the yaw is positive.
      faces.push({ points: [p(x0, 0, z1), p(x1, 0, z1), p(x1, h, z1), p(x0, h, z1)], tone: 0.16 });
      if (Math.abs(pose.sin) > 0.001) {
        const x = pose.sin > 0 ? x1 : x0;
        faces.push({ points: [p(x, 0, z0), p(x, 0, z1), p(x, h, z1), p(x, h, z0)], tone: 0.3 });
      }
    }
    faces.push({ points: [p(x0, h, z0), p(x1, h, z0), p(x1, h, z1), p(x0, h, z1)], tone: 0 });
    return faces;
  }

  #draw() {
    const { width, height, dpr } = this.#size;
    const ctx = this.query('canvas').getContext('2d');
    if (!ctx || !width || !height) return;
    const palette = this.#colors;
    const pose = this.#pose();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    this.#drawLabels(ctx, pose, palette);
    // Back to front: the nearer a column's centre, the later it is drawn.
    const depth = (cell) => (cell.col + 0.5 - this.#weeks / 2) * pose.sin + (cell.row + 0.5 - DAYS / 2) * pose.cos;
    const ordered = pose.t > 0 ? [...this.#cells].sort((a, b) => depth(a) - depth(b)) : this.#cells;
    this.#faces = [];
    // The gap between cells, on screen: a point in it reads the cell beside it.
    this.#reach = Math.max(2, GAP * pose.scale * 0.6);
    ctx.lineJoin = 'round';
    ctx.lineWidth = 0.75;
    for (const cell of ordered) {
      const color = cell.index === this.#active ? palette.accent : palette.levels[cell.level];
      for (const face of this.#facesOf(pose, cell)) {
        const fill = shade(color, face.tone);
        ctx.beginPath();
        face.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        // A hairline in the same colour closes the seams between faces.
        ctx.strokeStyle = fill;
        ctx.stroke();
        this.#faces.push({ points: face.points, index: cell.index });
      }
    }
  }

  // The day and month labels lie beside the flat heatmap and fade as it rises.
  #drawLabels(ctx, pose, palette) {
    const alpha = clamp(1 - pose.t * 2.5, 0, 1);
    if (!alpha) return;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = palette.text;
    ctx.font = `11px ${palette.font}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    for (const month of this.#months) {
      const [x, y] = this.#project(pose, month.col + GAP / 2, 0, -0.6);
      ctx.fillText(formatMonth(month.date), x, y);
    }
    ctx.textAlign = 'right';
    DAY_LABELS.forEach((label, row) => {
      if (!label) return;
      const [x, y] = this.#project(pose, -0.3, 0, row + 0.5);
      ctx.fillText(label, x, y);
    });
    ctx.globalAlpha = 1;
  }

  // The day under a point: the frontmost face drawn there. A point in the
  // gap between cells reads the nearest one, so moving across the board
  // never flickers back to the summary.
  #hitTest(x, y) {
    const r = this.#reach;
    for (const [dx, dy] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]]) {
      for (let i = this.#faces.length - 1; i >= 0; i--) {
        if (inside(this.#faces[i].points, x + dx, y + dy)) return this.#faces[i].index;
      }
    }
    return -1;
  }

  // ---- Reading a day ----

  #setActive(index) {
    if (index === this.#active) return;
    this.#active = index;
    this.#readout();
    this.#wake();
  }

  #readout() {
    const cell = this.#cells[this.#active];
    let text = 'No activity yet';
    if (cell) text = `${plural(cell.count, 'contribution')} on ${formatDay(cell.date)}`;
    else if (this.#cells.length) text = `${plural(this.#total, 'contribution')} in the last ${plural(this.#weeks, 'week')}`;
    this.query('.readout').textContent = text;
  }

  #local(event) {
    const rect = this.query('canvas').getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  #down(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.#yawSpeed = 0;
    this.#drag = { id: event.pointerId, x: event.clientX, yaw: this.#yaw, moved: false, last: event.clientX, at: event.timeStamp, speed: 0 };
    if (this.#target === 1) event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) {
      if (event.pointerType !== 'touch') this.#setActive(this.#hitTest(...this.#local(event)));
      return;
    }
    const dx = event.clientX - drag.x;
    drag.moved ||= Math.abs(dx) > 4;
    // Only the terrain turns; the flat heatmap stays square.
    if (!drag.moved || this.#target !== 1) return;
    this.query('canvas').toggleAttribute('data-dragging', true);
    this.#yaw = clamp(drag.yaw + dx * DRAG, -YAW_LIMIT, YAW_LIMIT);
    // The spin a release hands on, from the latest movement.
    const dt = Math.max((event.timeStamp - drag.at) / 1000, 0.001);
    drag.speed = lerp(drag.speed, ((event.clientX - drag.last) * DRAG) / dt, 0.5);
    drag.last = event.clientX;
    drag.at = event.timeStamp;
    this.#wake();
  }

  #up(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    this.query('canvas').removeAttribute('data-dragging');
    if (!drag.moved || this.#target !== 1) {
      // A tap reads the day under it.
      if (event.type === 'pointerup') this.#setActive(this.#hitTest(...this.#local(event)));
      return;
    }
    const recent = event.timeStamp - drag.at < 80;
    this.#yawSpeed = recent && !reducedMotion.matches ? drag.speed : 0;
    this.#wake();
  }

  // The arrow keys step through the days: up and down a week, across the weeks.
  #key(event) {
    const move = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!move && !['Home', 'End', 'Escape'].includes(event.key)) return;
    if (!this.#cells.length) return;
    event.preventDefault();
    if (event.key === 'Escape') return this.#setActive(-1);
    if (event.key === 'Home') return this.#setActive(0);
    if (event.key === 'End') return this.#setActive(this.#cells.length - 1);
    const current = this.#cells[this.#active];
    if (!current) return this.#setActive(this.#cells.length - 1);
    const next = this.#cells.find((cell) => cell.col === current.col + move[0] && cell.row === current.row + move[1]);
    if (next) this.#setActive(next.index);
  }
}
