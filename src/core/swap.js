import swapStyles from '../styles/swap.scss?inline';
import { reducedMotion } from './motion.js';

/** Styles for `swapText()`; add to a component's `static styles`. */
export { swapStyles };

const DURATION = 250;
const EXIT = { translate: ['0 0', '0 -100%'], opacity: [1, 0], filter: ['blur(0)', 'blur(2px)'] };
const ENTER = { translate: ['0 100%', '0 0'], opacity: [0, 1], filter: ['blur(2px)', 'blur(0)'] };

/**
 * Show `text` in a `.swap` container: the old text leaves upward as the new
 * one rises from below. When `resize` is given, its width animates from the
 * old size to the new one. The first text, and any text with reduced motion,
 * just appears.
 */
export const swapText = (container, text, resize) => {
  const previous = container.lastElementChild;
  if (previous?.textContent === text) return;

  const from = resize?.offsetWidth;
  const next = Object.assign(document.createElement('span'), { textContent: text });
  container.append(next);
  if (!previous || reducedMotion.matches) {
    previous?.remove();
    return;
  }

  container.querySelectorAll('.leaving').forEach((node) => node.remove());
  previous.classList.add('leaving');
  const to = resize?.offsetWidth;
  const easing = getComputedStyle(container).getPropertyValue('--lw-ease-out').trim() || 'ease-out';
  const timing = { duration: DURATION, easing };
  next.animate(ENTER, timing);
  previous.animate(EXIT, timing).finished.then(() => previous.remove(), () => previous.remove());
  if (resize && to !== from) resize.animate({ width: [`${from}px`, `${to}px`] }, timing);
};
