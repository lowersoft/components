// Contour lines through a sampled height field (marching squares), with
// survey-map elevation labels on the index contours.

// Distance between field samples, in CSS px. Contours are traced through
// this grid, so it trades smoothness for work per frame.
export const CELL = 12;
// Every fifth line is an index contour, drawn heavier, as on a real map.
const INDEX_EVERY = 5;
// One label per slot of this size at most (px), riding with the terrain.
// Level n is BASE + n * STEP metres, so index contours read as round hundreds.
const LABEL_SPACING = 210;
const LABEL_BASE = 500;
const LABEL_STEP = 20;
// Labels keep clear of the faded top and bottom edges.
const LABEL_MARGIN = 0.16;
const MAX_LABEL_ANGLE = Math.PI / 3;
const LABEL_FONT = '500 10px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

/**
 * The segment a contour draws through one cell, given which corners are
 * above the level (bits: top-left 8, top-right 4, bottom-right 2,
 * bottom-left 1) and where it crosses each edge.
 */
const cellSegments = (path, index, { x0, y0, x1, y1 }, { top, right, bottom, left }) => {
  const line = (ax, ay, bx, by) => {
    path.moveTo(ax, ay);
    path.lineTo(bx, by);
  };
  switch (index) {
    case 1:
    case 14:
      line(x0, left, bottom, y1);
      break;
    case 2:
    case 13:
      line(bottom, y1, x1, right);
      break;
    case 3:
    case 12:
      line(x0, left, x1, right);
      break;
    case 4:
    case 11:
      line(top, y0, x1, right);
      break;
    case 6:
    case 9:
      line(top, y0, bottom, y1);
      break;
    case 7:
    case 8:
      line(x0, left, top, y0);
      break;
    // The two saddles: opposite corners are high, so the level crosses twice.
    case 5:
      line(x0, left, top, y0);
      line(bottom, y1, x1, right);
      break;
    case 10:
      line(top, y0, x1, right);
      line(x0, left, bottom, y1);
      break;
    default:
  }
};

/**
 * Offers a point on an index contour as a label spot. Slots are laid out in
 * terrain space (they drift with the map) and every other row is offset by
 * half a slot, so labels scatter instead of lining up in a grid.
 */
const offerLabel = (slots, label) => {
  const { x, y } = label;
  if (y < slots.height * LABEL_MARGIN || y > slots.height * (1 - LABEL_MARGIN) || x < 24 || x > slots.width - 24) return;
  if (slots.avoid.some((r) => x > r.x0 && x < r.x1 && y > r.y0 && y < r.y1)) return;
  const row = Math.floor(y / LABEL_SPACING);
  const shifted = x + slots.drift + (row % 2) * (LABEL_SPACING / 2);
  const col = Math.floor(shifted / LABEL_SPACING);
  const score = (shifted - (col + 0.5) * LABEL_SPACING) ** 2 + (y - (row + 0.5) * LABEL_SPACING) ** 2;
  // Too far from the slot's centre: a neighbouring label could sit right by it.
  if (score > (LABEL_SPACING * 0.32) ** 2) return;
  const key = row * 100_000 + col;
  const current = slots.best.get(key);
  if (!current || score < current.score) slots.best.set(key, { ...label, score });
};

/** Offers the middle of a cell an index contour passes through. */
const offerCellLabel = (slots, [a, b, c, d], x0, y0, level, t) => {
  // The contour runs across the slope; the cell's gradient gives a steadier
  // direction than the short segment itself.
  const gx = b - a + c - d;
  const gy = d - a + c - b;
  // Slide from the cell's centre along the slope onto the line itself.
  const px = gx / (2 * CELL);
  const py = gy / (2 * CELL);
  const g2 = px * px + py * py;
  const lift = g2 > 0 ? (t - (a + b + c + d) / 4) / g2 : 0;
  const half = CELL / 2;
  const ox = Math.max(-half, Math.min(half, lift * px));
  const oy = Math.max(-half, Math.min(half, lift * py));
  // Keep text upright, and skip steep stretches: a number on its side is
  // hard to read.
  let angle = Math.atan2(gx, -gy);
  if (angle > Math.PI / 2) angle -= Math.PI;
  else if (angle < -Math.PI / 2) angle += Math.PI;
  if (Math.abs(angle) > MAX_LABEL_ANGLE) return;
  offerLabel(slots, { x: x0 + half + ox, y: y0 + half + oy, angle, level });
};

/**
 * Marching squares: for each cell, finds where each contour level crosses
 * its edges and joins those points. Index contours go into `major` so each
 * group is stroked once. With `slots`, it also gathers label spots.
 */
export const traceContours = (field, cols, rows, interval, minor, major, slots) => {
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = field[j * cols + i];
      const b = field[j * cols + i + 1];
      const c = field[(j + 1) * cols + i + 1];
      const d = field[(j + 1) * cols + i];
      const first = Math.ceil(Math.min(a, b, c, d) / interval);
      const last = Math.floor(Math.max(a, b, c, d) / interval);
      if (first > last) continue;
      const x0 = i * CELL;
      const y0 = j * CELL;
      const box = { x0, y0, x1: x0 + CELL, y1: y0 + CELL };
      for (let level = first; level <= last; level++) {
        const t = level * interval;
        const index = (a > t ? 8 : 0) | (b > t ? 4 : 0) | (c > t ? 2 : 0) | (d > t ? 1 : 0);
        if (index === 0 || index === 15) continue;
        const isIndex = level % INDEX_EVERY === 0;
        cellSegments(isIndex ? major : minor, index, box, {
          top: x0 + CELL * ((t - a) / (b - a)),
          right: y0 + CELL * ((t - b) / (c - b)),
          bottom: x0 + CELL * ((t - d) / (c - d)),
          left: y0 + CELL * ((t - a) / (d - a)),
        });
        // Saddles are poor label spots: the line turns sharply there.
        if (isIndex && slots && index !== 5 && index !== 10) offerCellLabel(slots, [a, b, c, d], x0, y0, level, t);
      }
    }
  }
};

/**
 * Knocks the lines out under each label, then prints the elevation, so the
 * contour is broken where the number sits, as on a survey map.
 */
export const drawLabels = (context, labels) => {
  context.font = LABEL_FONT;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (const label of labels) {
    const text = String(LABEL_BASE + label.level * LABEL_STEP);
    const width = context.measureText(text).width + 8;
    context.save();
    context.translate(Math.round(label.x), Math.round(label.y));
    context.rotate(label.angle);
    context.globalCompositeOperation = 'destination-out';
    context.globalAlpha = 1;
    context.fillRect(-width / 2, -6, width, 12);
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 0.5;
    context.fillText(text, 0, 0.5);
    context.restore();
  }
};
