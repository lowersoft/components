import { strokeIcon } from './icons.js';
import { x } from './lucide.js';
import { reducedMotion } from './motion.js';

// Shared pieces of the banner components; style them with the `banner-base` mixin.

/** The close button at the end of a banner. */
export const closeButton = (label = 'Dismiss') => `<button class="close" type="button" aria-label="${label}">${strokeIcon(x, 18)}</button>`;

/**
 * Folds `host` away, then hides it and fires `lw-dismiss`. The space it
 * took closes smoothly instead of the page jumping.
 */
export const dismissBanner = async (host) => {
  if (!reducedMotion.matches) {
    const height = host.offsetHeight;
    await host.animate({ height: [`${height}px`, '0px'], opacity: [1, 0] }, { duration: 250, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }).finished.catch(() => {});
  }
  host.hidden = true;
  host.emit('dismiss');
};
