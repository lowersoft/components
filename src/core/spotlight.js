/**
 * Lets `element`'s styles follow the mouse: while it is over the element,
 * `--spot-x` and `--spot-y` hold its place in px from the element's top
 * left, at most once a frame, and `data-lit` is set. Touch and pen leave it
 * alone, so effects built on it stay a mouse-only flourish. Stops when
 * `signal` aborts.
 */
export const followPointer = (element, signal) => {
  let frame = 0;
  let x = 0;
  let y = 0;
  element.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const box = element.getBoundingClientRect();
    x = event.clientX - box.left;
    y = event.clientY - box.top;
    frame ||= requestAnimationFrame(() => {
      frame = 0;
      element.style.setProperty('--spot-x', `${x}px`);
      element.style.setProperty('--spot-y', `${y}px`);
      element.toggleAttribute('data-lit', true);
    });
  }, { signal });
  element.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    element.toggleAttribute('data-lit', false);
  }, { signal });
  signal.addEventListener('abort', () => cancelAnimationFrame(frame));
};
