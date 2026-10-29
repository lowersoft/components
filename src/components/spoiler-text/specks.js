// Specks per square pixel of hidden text: about one every 6 px², like the
// grain on a scratch card, so even one short word reads as a solid patch.
const DENSITY = 1 / 6;
const MAX_SPECKS = 2400;
// How far a speck wanders, in px per second, while it shimmers in place.
const DRIFT = 7;
// Once the reveal wave passes a speck, it is thrown out and fades this long.
const FADE_MS = 360;
const THROW = 70;

/** How far a wave from `at` travels to clear a `width` × `height` box. */
export const farthestCorner = ({ x, y }, width, height) =>
  Math.max(Math.hypot(x, y), Math.hypot(width - x, y), Math.hypot(x, height - y), Math.hypot(width - x, height - y));

/**
 * Puts the canvas over the text and returns each line's box inside it. An
 * inline element split over lines makes an unreliable containing block, so
 * the canvas hangs from `anchor`, an empty inline-block, and is moved by the
 * difference.
 */
export const fitCanvas = (canvas, context, text, anchor) => {
  const lines = [...text.getClientRects()];
  if (lines.length === 0) return null;
  const left = Math.min(...lines.map((r) => r.left));
  const top = Math.min(...lines.map((r) => r.top));
  const width = Math.max(...lines.map((r) => r.right)) - left;
  const height = Math.max(...lines.map((r) => r.bottom)) - top;
  const origin = anchor.getBoundingClientRect();
  Object.assign(canvas.style, {
    left: `${left - origin.left}px`,
    top: `${top - origin.top}px`,
    width: `${width}px`,
    height: `${height}px`,
  });
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  const boxes = lines.map((r) => ({ left: r.left - left, top: r.top - top, right: r.right - left, bottom: r.bottom - top }));
  return { width, height, boxes };
};

/** Scatters specks over the line boxes. */
export const makeSpecks = (boxes) => {
  const area = boxes.reduce((sum, box) => sum + (box.right - box.left) * (box.bottom - box.top), 0);
  const scale = Math.min(1, MAX_SPECKS / Math.max(1, area * DENSITY));
  return boxes.flatMap((box, index) => {
    const width = box.right - box.left;
    const height = box.bottom - box.top;
    return Array.from({ length: Math.round(width * height * DENSITY * scale) }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = DRIFT * (0.3 + Math.random() * 0.7);
      return {
        x: box.left + Math.random() * width,
        y: box.top + Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        // Where in its twinkle the speck is, 0 to 1, and twinkles per second.
        phase: Math.random(),
        rate: 0.35 + Math.random() * 0.9,
        size: Math.random() < 0.18 ? 1.5 : 1,
        // The line it is kept inside, and when the reveal wave reached it.
        box: index,
        hit: 0,
      };
    });
  });
};

/** Moves one speck a frame on; returns its opacity, 0 once it has faded. */
const stepSpeck = (speck, { now, dt, wave, radius, boxes, still }) => {
  const s = speck;
  if (wave && !s.hit && Math.hypot(s.x - wave.x, s.y - wave.y) <= radius) {
    s.hit = now;
    const dx = s.x - wave.x;
    const dy = s.y - wave.y;
    const length = Math.hypot(dx, dy) || 1;
    const push = THROW * (0.5 + Math.random());
    s.vx += (dx / length) * push;
    s.vy += (dy / length) * push;
  }
  const fade = s.hit ? 1 - (now - s.hit) / FADE_MS : 1;
  if (fade <= 0) return 0;
  if (!still || s.hit) {
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.phase = (s.phase + s.rate * dt) % 1;
  }
  // Until it is hit, a speck bounces around inside its own line.
  const box = s.hit ? null : boxes[s.box];
  if (box) {
    if (s.x < box.left || s.x > box.right) {
      s.vx = -s.vx;
      s.x = Math.min(box.right, Math.max(box.left, s.x));
    }
    if (s.y < box.top || s.y > box.bottom) {
      s.vy = -s.vy;
      s.y = Math.min(box.bottom, Math.max(box.top, s.y));
    }
  }
  // Each speck twinkles between faint and full out of step with the others,
  // so the patch shimmers instead of flashing.
  return (0.35 + 0.65 * Math.abs(Math.sin(s.phase * Math.PI))) * fade * 0.9;
};

/** Draws every speck still showing; returns how many there were. */
export const paintSpecks = (context, specks, frame) => {
  let alive = 0;
  for (const speck of specks) {
    const alpha = stepSpeck(speck, frame);
    if (alpha <= 0) continue;
    alive += 1;
    context.globalAlpha = alpha;
    context.fillRect(speck.x, speck.y, speck.size, speck.size);
  }
  context.globalAlpha = 1;
  return alive;
};
