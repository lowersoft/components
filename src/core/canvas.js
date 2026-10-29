/**
 * Sizes a 2D canvas's backing store to its box at the device pixel ratio
 * (capped at 2) and scales the context, so drawing uses CSS pixels.
 * Returns the box's size.
 */
export const fitCanvas = (canvas, context) => {
  const { width, height } = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
};
