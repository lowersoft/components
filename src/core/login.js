import { avatarSeed, FaceView } from './face.js';

// Shared pieces of the login components: the provider marks and buttons,
// workspace marks, and drawn portraits. Style them with the `login-base` mixin.

// Brand marks for the sign-in providers.
export const GOOGLE = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="#4285f4" d="M22.6 12.2c0-.8-.1-1.4-.2-2.1H12v4h6c-.1 1-.8 2.5-2.3 3.5v2.9h3.7c2.2-2 3.2-4.9 3.2-8.3"/><path fill="#34a853" d="M12 23c3 0 5.6-1 7.4-2.7l-3.7-2.9c-1 .7-2.3 1.2-3.7 1.2-2.9 0-5.3-1.9-6.2-4.5H2v3c1.9 3.7 5.7 5.9 10 5.9"/><path fill="#fbbc05" d="M5.8 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1v-3H2C1.3 8.4 1 10.2 1 12s.3 3.6 1 5.1z"/><path fill="#ea4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.6 2.1 15 1 12 1 7.7 1 3.9 3.5 2 7l3.8 3c.9-2.7 3.3-4.6 6.2-4.6"/></svg>';
export const GITHUB = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M12 1C5.9 1 1 5.9 1 12c0 4.9 3.2 9 7.5 10.5.5.1.7-.2.7-.5v-1.9c-3.1.7-3.7-1.3-3.7-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.4-.3-5-1.2-5-5.4 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1a10.4 10.4 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4.2-2.6 5.1-5 5.4.4.3.8 1 .8 2v3c0 .3.2.6.8.5C19.8 21 23 16.9 23 12c0-6.1-4.9-11-11-11"/></svg>';

/** Google and GitHub buttons side by side; they need `../button/index.js`. */
export const providerButtons = () =>
  `<div class="providers"><lw-button class="provider" data-provider="google" variant="outline"><span slot="start">${GOOGLE}</span>Google</lw-button><lw-button class="provider" data-provider="github" variant="outline"><span slot="start">${GITHUB}</span>GitHub</lw-button></div>`;

// Glyphs for workspace marks, in a 16 × 16 box.
const GLYPHS = {
  triangle: '<path d="M8 4 12.5 12h-9z" fill="currentColor"/>',
  leaf: '<path d="M4.5 11.5C4.5 7 7.5 4.5 11.5 4.5 11.5 8.5 9 11.5 4.5 11.5ZM4.5 11.5 8 8" fill="currentColor" stroke="currentColor" stroke-width="1"/>',
  lines: '<path d="M4.5 5h7M4.5 8h7M4.5 11h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  arch: '<path d="M5 12V8a3 3 0 0 1 6 0v4" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  dot: '<circle cx="8" cy="8" r="2.75" fill="currentColor"/>',
};

/** A workspace's mark: a tile in its colour with a glyph, `{ glyph, color }`. */
export const markTile = (mark) => (mark ? `<span class="mark" style="--_mark: ${mark.color ?? '#3f6f5a'}" aria-hidden="true"><svg viewBox="0 0 16 16">${GLYPHS[mark.glyph] ?? GLYPHS.dot}</svg></span>` : '');

/**
 * Draws `name`'s portrait into `container`, the same face for the same name
 * (or `seed`), with the workspace `mark` on its corner. Returns the face, so
 * a caller can `show()` a new seed and have it morph.
 */
export const drawPortrait = (container, name, { seed, mark } = {}) => {
  const face = new FaceView();
  face.show(seed ?? avatarSeed(name || ' ', 0), { morph: false });
  container.replaceChildren(face.svg);
  container.insertAdjacentHTML('beforeend', markTile(mark));
  return face;
};
