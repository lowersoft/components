// Draws the demo's "generated" images: a valley at dusk in muted film
// tones, layered hills and a low sun, laid out by a seed.

const random = (seed) => {
  let state = seed % 2_147_483_647 || 1;
  return () => {
    state = (state * 16_807) % 2_147_483_647;
    return state / 2_147_483_647;
  };
};

// Film tones, light to dark, nudged warmer or cooler by the seed.
const TONES = [
  [236, 224, 210],
  [224, 200, 178],
  [205, 172, 148],
  [176, 140, 118],
  [138, 104, 88],
  [104, 78, 68],
];
const SUN = [214, 122, 92];

const tone = ([r, g, b], shift) => `rgb(${r + shift}, ${g + shift * 0.4}, ${b - shift * 0.6})`;

/**
 * Paints scene `seed` across `ctx`'s canvas. Odd variations mirror the hills
 * in still water.
 */
export const drawScene = (ctx, seed, variation = 0) => {
  const { width: w, height: h } = ctx.canvas;
  const next = random(seed * 7919 + variation * 104_729);
  const shift = Math.round((next() - 0.5) * 18);
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, tone(TONES[0], shift));
  sky.addColorStop(1, tone(TONES[1], shift));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  const water = variation % 2 === 1;
  const horizon = h * (water ? 0.58 : 0.72);
  // The sun sits low, somewhere off centre.
  ctx.fillStyle = tone(SUN, shift / 2);
  ctx.beginPath();
  ctx.arc(w * (0.25 + next() * 0.5), horizon - h * (0.12 + next() * 0.14), Math.min(w, h) * (0.05 + next() * 0.03), 0, Math.PI * 2);
  ctx.fill();
  // Hills, far to near: each a soft sine ridge, darker and lower.
  const layers = 4;
  for (let layer = 0; layer < layers; layer++) {
    const base = horizon - h * 0.16 + layer * h * (water ? 0.05 : 0.08);
    const amp = h * (0.03 + next() * 0.05);
    const freq = 1.5 + next() * 2.5;
    const phase = next() * Math.PI * 2;
    ctx.fillStyle = tone(TONES[layer + 2], shift);
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += w / 48) {
      const t = x / w;
      ctx.lineTo(x, base - Math.sin(t * freq * Math.PI + phase) * amp - Math.sin(t * freq * 2.7 + phase) * amp * 0.4);
    }
    ctx.lineTo(w, water ? horizon : h);
    ctx.lineTo(0, water ? horizon : h);
    ctx.closePath();
    ctx.fill();
  }
  if (water) {
    // The water mirrors what is above the horizon, fainter.
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.translate(0, horizon * 2);
    ctx.scale(1, -1);
    ctx.drawImage(ctx.canvas, 0, 0, w, horizon, 0, 0, w, horizon);
    ctx.restore();
    ctx.fillStyle = 'rgb(255 255 255 / 0.12)';
    ctx.fillRect(0, horizon, w, h - horizon);
  }
};
