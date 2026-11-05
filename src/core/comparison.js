import comparisonStyles from '../styles/comparison.scss?inline';
import { escapeHtml } from './dom.js';
import { strokeIcon } from './icons.js';
import { check, x } from './lucide.js';

// Shared pieces of the comparison sections: the cell marks and the made-up
// product marks. Add `comparisonStyles` to the component's `static styles`.
export { comparisonStyles };

/**
 * A cell's content: a check for `true`, a crossed circle that says "Not
 * included" for `false`, anything else as text.
 */
export const cellMarkup = (value) => {
  if (value === true) return `<span class="yes">${strokeIcon(check, 16, 2.25)}<span class="visually-hidden">Included</span></span>`;
  if (value === false || value == null) return `<span class="no">${strokeIcon(x, 10, 2.5)}<span class="visually-hidden">Not included</span></span>`;
  return `<span class="text">${escapeHtml(value)}</span>`;
};

// Geometric marks for the demo products, drawn in the current color. They
// stand in for real logos, which you supply as `<svg>` markup.
const MARKS = {
  lumen: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18" stroke="var(--lw-color-background)" stroke-width="3"/>',
  arcadia: '<path d="M2 20 12 4l10 16z"/>',
  halcyon: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="12" cy="12" r="2.5"/>',
  vertex: '<rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)"/>',
  quill: '<path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z"/>',
  orbita: '<circle cx="9" cy="12" r="6"/><circle cx="17" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/>',
  kestrel: '<rect x="3" y="4" width="18" height="4" rx="2"/><rect x="3" y="10" width="12" height="4" rx="2"/><rect x="3" y="16" width="7" height="4" rx="2"/>',
  sable: '<path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>',
};

/** A product's mark: one of the built-in ids, or `<svg>` markup. */
export const markMarkup = (mark, size = 20) => {
  if (!mark) return '';
  if (String(mark).trim().startsWith('<svg')) return mark;
  const inner = MARKS[mark] ?? MARKS.vertex;
  return `<svg class="mark" viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" aria-hidden="true">${inner}</svg>`;
};
