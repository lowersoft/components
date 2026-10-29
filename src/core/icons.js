import iconStyles from '../styles/icons.scss?inline';

/** Styles for the icons below; add to a component's `static styles`. */
export { iconStyles };

/** Check mark drawn in when it is displayed. */
export const CHECK_ICON =
  '<svg class="icon check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" pathLength="1"/></svg>';

/** Spinning loading indicator. */
export const SPINNER_ICON =
  '<svg class="icon spinner" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="6" opacity="0.25"/><path d="M14 8a6 6 0 0 0-6-6"/></svg>';

/** A 24 × 24 stroked SVG around Lucide-style inner markup. */
export const strokeIcon = (inner, size = 16, strokeWidth = 2) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
