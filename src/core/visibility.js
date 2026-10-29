/**
 * Call `callback(visible)` whenever `element` comes on or goes off screen, or
 * the tab is hidden or shown, until `signal` aborts. Endless animations use it
 * to rest when nobody can see them.
 */
export const watchVisibility = (element, callback, signal) => {
  let inView = false;
  const sync = () => callback(inView && document.visibilityState === 'visible');
  const observer = new IntersectionObserver((entries) => {
    inView = entries.some((entry) => entry.isIntersecting);
    sync();
  });
  observer.observe(element);
  document.addEventListener('visibilitychange', sync, { signal });
  signal.addEventListener('abort', () => observer.disconnect());
};
