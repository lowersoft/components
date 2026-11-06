import { escapeHtml } from './dom.js';

// Customer logos for the heroes' trust rows: a mark drawn in the current
// colour beside the name, or an image. The marks' cut-outs are holes, so
// the page shows through them on any background.
const MARKS = {
  disc: '<path fill-rule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-1.25 2h2.5v14h-2.5z"/>',
  peak: '<path fill-rule="evenodd" d="M2 20 12 4l10 16H2Zm6 0 4-7 4 7H8Z"/>',
  ring: '<path fill-rule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"/><circle cx="12" cy="12" r="2.5"/>',
  diamond: '<rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)"/>',
  leaf: '<path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Z"/>',
  orbit: '<circle cx="8.5" cy="12" r="5.5"/><circle cx="16.5" cy="12" r="4.75" fill="none" stroke="currentColor" stroke-width="2.25"/>',
  bars: '<rect x="3" y="4" width="18" height="4" rx="2"/><rect x="3" y="10" width="12" height="4" rx="2"/><rect x="3" y="16" width="7" height="4" rx="2"/>',
  pillar: '<rect x="4" y="3" width="5" height="18" rx="1.5"/><rect x="11" y="8" width="5" height="13" rx="1.5"/><rect x="18" y="13" width="3" height="8" rx="1.5"/>',
  wave: '<path d="M2 15c3-4 6-4 10 0s7 4 10 0v5H2Z"/><path d="M2 8c3-4 6-4 10 0s7 4 10 0" fill="none" stroke="currentColor" stroke-width="2.5"/>',
  spark: '<path d="M12 2c.6 4.8 2.2 6.4 7 7-4.8.6-6.4 2.2-7 7-.6-4.8-2.2-6.4-7-7 4.8-.6 6.4-2.2 7-7Z"/><circle cx="18.5" cy="18.5" r="2.5"/>',
};

/** The names of the drawn marks a logo's `mark` can take. */
export const LOGO_MARKS = Object.keys(MARKS);

/** A logo `{ name, mark?, src? }`: the image at `src`, named by `name`, or else the drawn `mark` beside the name. */
export const logoMarkup = ({ name = '', mark, src }) => {
  if (src) return `<img class="logo-image" src="${escapeHtml(src)}" alt="${escapeHtml(name)}" loading="lazy" decoding="async">`;
  const drawn = MARKS[mark] ? `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${MARKS[mark]}</svg>` : '';
  return `${drawn}<span>${escapeHtml(name)}</span>`;
};
