import { escapeHtml } from './dom.js';
import { avatarSeed, FaceView } from './face.js';

// Shared pieces of the testimonial components; style them with the
// `testimonial-base` mixin.

/** A company's mark: its initial on a tile in its colour, then its name. */
export const companyMarkup = (company) =>
  `<span class="company"><span class="company-mark" style="--_mark: ${escapeHtml(company?.color ?? '#3b6ef5')}" aria-hidden="true">${escapeHtml((company?.name ?? '').charAt(0))}</span><span class="company-name">${escapeHtml(company?.name ?? '')}</span></span>`;

/**
 * A quote as markup: `==words==` marks a phrase, and `==2:words==` marks
 * it as note 2, for quotes whose phrases point at something.
 */
export const quoteMarkup = (text) =>
  escapeHtml(text).replace(/==(?:(\d+):)?(.+?)==/g, (_, note, words) => (note ? `<mark data-note="${note}">${words}<sup class="note">${note}</sup></mark>` : `<mark>${words}</mark>`));

/** Draws `name`'s face into `container`, the same face for the same name. */
export const drawFace = (container, name) => {
  const face = new FaceView();
  face.show(avatarSeed(name || ' ', 0), { morph: false });
  container.replaceChildren(face.svg);
  return face;
};

/** A pair of solid opening quote marks, drawn in the current colour. */
export const QUOTE_ICON =
  '<svg class="quote-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 19v-7.2C3 7.6 5.5 4.7 9.4 3.8l.7 2C8 6.6 6.9 8.2 6.8 10.6H10.5V19H3Zm10.5 0v-7.2c0-4.2 2.5-7.1 6.4-8l.7 2c-2.1.8-3.2 2.4-3.3 4.8H21V19h-7.5Z"/></svg>';
