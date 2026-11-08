import { reducedMotion } from './motion.js';
import { watchVisibility } from './visibility.js';

// Slots that take turns showing one of a few faces, for logo clouds whose
// names change in place. Each slot holds all its faces stacked in one spot;
// the one showing has `data-active`, the rest are `aria-hidden`.

/**
 * Turns the slots over in waves: every `interval` ms each slot in the next
 * wave gets `turn(slot, order)`, `order` its place in the wave, unless
 * `held(slot)` says it is held, such as while pointed at. Rests while `host`
 * is off screen or the tab is hidden, never starts with reduced motion, and
 * stops when `signal` aborts.
 */
export const cycleWaves = (host, { waves, interval, turn, held = () => false }, signal) => {
  let timer = 0;
  let next = 0;
  const tick = () => {
    waves[next].filter((slot) => !held(slot)).forEach((slot, order) => turn(slot, order));
    next = (next + 1) % waves.length;
    timer = setTimeout(tick, interval);
  };
  watchVisibility(host, (visible) => {
    clearTimeout(timer);
    timer = visible && !reducedMotion.matches && waves.length ? setTimeout(tick, interval) : 0;
  }, signal);
  signal.addEventListener('abort', () => clearTimeout(timer));
};

/**
 * Shows the next face of `slot` (an element whose children are its faces):
 * the one showing leaves with the `exit` keyframes as the next arrives with
 * `enter`, after `delay` ms. A slot with one face stays as it is.
 */
export const turnFace = (slot, { exit, enter, duration = 500, delay = 0, easing = 'cubic-bezier(0.22, 0.7, 0.2, 1)' }) => {
  const faces = [...slot.children];
  if (faces.length < 2) return;
  const from = faces.find((face) => face.hasAttribute('data-active')) ?? faces[0];
  const to = faces[(faces.indexOf(from) + 1) % faces.length];
  from.removeAttribute('data-active');
  from.ariaHidden = 'true';
  to.setAttribute('data-active', '');
  to.ariaHidden = null;
  const timing = { duration, delay, easing, fill: 'backwards' };
  from.animate(exit, timing);
  to.animate(enter, timing);
};
