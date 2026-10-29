import morphStyles from '../styles/morph.scss?inline';
import { reducedMotion } from './motion.js';

/** Shell structure for `morph()`; add to a component's `static styles`. */
export { morphStyles };

const DURATION = 420;
const EASING = 'cubic-bezier(0.32, 1.18, 0.5, 1)'; // a light spring
const EXIT_DURATION = 100;

/**
 * Morph a surface that grows out of an in-flow button into a floating view
 * and back. Shows only the `visible` parts, then animates `shell` from the
 * size it had on screen to its new one. Leaving parts fade out over it;
 * entering parts animate with what `enter(part)` returns.
 *
 * The host keeps the closed footprint in the page through `--_idle-width`
 * while the shell floats (style `.floating` and the open views as
 * `position: absolute`). On closing, the shell keeps floating until the morph
 * settles, so its starting size is the one actually on screen.
 *
 * @param {object} options
 * @param {HTMLElement} options.host
 * @param {HTMLElement} options.shell
 * @param {Record<string, HTMLElement>} options.parts
 * @param {string[]} options.visible - Names of the parts to show
 * @param {boolean} options.opening - Leaving the closed view
 * @param {boolean} options.closing - Returning to the closed view
 * @param {boolean} options.animate - False for the first render
 * @param {() => boolean} options.isClosed - Whether the host is still closed when the morph ends
 * @param {(part: HTMLElement) => [Keyframe[] | PropertyIndexedKeyframes, KeyframeAnimationOptions]} options.enter
 */
export const morph = ({ host, shell, parts, visible, opening, closing, animate, isClosed, enter }) => {
  if (closing) shell.classList.add('floating');
  const from = shell.getBoundingClientRect();
  // An interrupted morph continues from where it is; CSS transitions keep running.
  for (const animation of shell.getAnimations()) if (!(animation instanceof CSSTransition)) animation.cancel();
  if (opening) host.style.setProperty('--_idle-width', `${from.width}px`);

  const entering = [];
  const leaving = [];
  for (const [name, part] of Object.entries(parts)) {
    const show = visible.includes(name);
    if (show && part.hidden) entering.push(part);
    if (!show && !part.hidden) leaving.push(part);
    part.getAnimations().forEach((animation) => animation.cancel());
    part.classList.remove('leaving');
    part.hidden = !show;
  }
  const to = shell.getBoundingClientRect();

  // Back in the page flow once closed and done morphing.
  const settle = () => {
    if (!isClosed()) return;
    shell.classList.remove('floating');
    host.style.removeProperty('--_idle-width');
  };
  if (!animate || reducedMotion.matches) return settle();

  shell
    .animate(
      { width: [`${from.width}px`, `${to.width}px`], height: [`${from.height}px`, `${to.height}px`] },
      { duration: DURATION, easing: EASING },
    )
    .finished.then(settle, () => {});
  for (const part of leaving) {
    part.hidden = false;
    part.classList.add('leaving');
    part.animate({ opacity: [1, 0] }, { duration: EXIT_DURATION }).finished.then(() => {
      part.hidden = true;
      part.classList.remove('leaving');
    }, () => {});
  }
  for (const part of entering) part.animate(...enter(part));
};
