// The page theme lives in `data-theme` on <html>, which the lw theme reads.
// Without it, the theme follows the device.

const root = document.documentElement;

/** The device's color scheme, live. */
export const darkScheme = matchMedia('(prefers-color-scheme: dark)');

/** The chosen theme: `light`, `dark`, or `system` when the device decides. */
export const themeChoice = () => (['light', 'dark'].includes(root.dataset.theme) ? root.dataset.theme : 'system');

/** The theme in effect: `light` or `dark`. */
export const appliedTheme = () => {
  const choice = themeChoice();
  if (choice !== 'system') return choice;
  return darkScheme.matches ? 'dark' : 'light';
};

/** Apply `light`, `dark` or `system`. */
export const setTheme = (choice) => {
  if (choice === 'system') delete root.dataset.theme;
  else root.dataset.theme = choice;
};

/** Call `callback` whenever the chosen theme or the device's scheme changes, until `signal` aborts. */
export const watchTheme = (callback, signal) => {
  const observer = new MutationObserver(callback);
  observer.observe(root, { attributeFilter: ['data-theme'] });
  darkScheme.addEventListener('change', callback, { signal });
  signal.addEventListener('abort', () => observer.disconnect());
};
