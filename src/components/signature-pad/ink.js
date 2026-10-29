// Strokes are lists of points `{ x, y, w }`: position and line width in px.

// Strokes start and end thin, over this many points.
const TAPER = 7;
// The exported signature is in ballpoint blue, whatever the theme.
const EXPORT_INK = '#1e3a8a';

/** Width at point `i` of a stroke, thinned at both ends; `open` while still being drawn. */
const taperedWidth = (stroke, i, open) => {
  const start = Math.min(1, (i + 1) / TAPER);
  const end = open ? 1 : Math.min(1, (stroke.length - i) / TAPER);
  return stroke[i].w * (0.35 + 0.65 * Math.min(start, end));
};

/** Adds a quad to the path wound the same way as `arc`, so one fill unions them. */
const quad = (context, points) => {
  let area = 0;
  for (let k = 0; k < 8; k += 2) {
    const j = (k + 2) % 8;
    area += points[k] * points[j + 1] - points[j] * points[k + 1];
  }
  const order = area >= 0 ? [0, 2, 4, 6] : [6, 4, 2, 0];
  context.moveTo(points[order[0]], points[order[0] + 1]);
  for (let k = 1; k < 4; k++) context.lineTo(points[order[k]], points[order[k] + 1]);
  context.closePath();
};

/** Draws points [from, to) of a stroke as rounded segments filled as one shape, so the joins show no seams. */
export const paintStroke = (context, stroke, from, to, open) => {
  context.beginPath();
  for (let i = Math.max(from, 0); i < to; i++) {
    const p = stroke[i];
    // A lone dot gets a little more ink than a taper would give it.
    const w = stroke.length === 1 && !open ? p.w * 0.8 : taperedWidth(stroke, i, open);
    if (i > 0) {
      const q = stroke[i - 1];
      const qw = taperedWidth(stroke, i - 1, open);
      const length = Math.hypot(p.x - q.x, p.y - q.y) || 1;
      const nx = -(p.y - q.y) / length;
      const ny = (p.x - q.x) / length;
      quad(context, [
        q.x + (nx * qw) / 2,
        q.y + (ny * qw) / 2,
        p.x + (nx * w) / 2,
        p.y + (ny * w) / 2,
        p.x - (nx * w) / 2,
        p.y - (ny * w) / 2,
        q.x - (nx * qw) / 2,
        q.y - (ny * qw) / 2,
      ]);
    }
    context.moveTo(p.x + w / 2, p.y);
    context.arc(p.x, p.y, w / 2, 0, Math.PI * 2);
  }
  context.fill();
};

/** The signature as standalone SVG, one filled outline per stroke. */
export const toSvg = (strokes, width, height) => {
  const shapes = strokes
    .map((stroke) => {
      if (stroke.length === 1) {
        const [p] = stroke;
        return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(p.w * 0.4).toFixed(2)}"/>`;
      }
      const left = [];
      const right = [];
      stroke.forEach((p, i) => {
        const q = stroke[Math.max(i - 1, 0)];
        const r = stroke[Math.min(i + 1, stroke.length - 1)];
        const dx = r.x - q.x;
        const dy = r.y - q.y;
        const length = Math.hypot(dx, dy) || 1;
        const w = taperedWidth(stroke, i, false) / 2;
        left.push(`${(p.x - (dy / length) * w).toFixed(1)} ${(p.y + (dx / length) * w).toFixed(1)}`);
        right.push(`${(p.x + (dy / length) * w).toFixed(1)} ${(p.y - (dx / length) * w).toFixed(1)}`);
      });
      return `<path d="M${left.join('L')}L${right.reverse().join('L')}Z"/>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.round(width)} ${Math.round(height)}" fill="${EXPORT_INK}">${shapes}</svg>`;
};
