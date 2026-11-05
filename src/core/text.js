const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

/** User-perceived characters, so emoji and Hangul stay whole. */
export const graphemes = (value) => Array.from(segmenter.segment(value), ({ segment }) => segment);

/** Number of digits in `text` before `index`, to keep the caret on the same digit. */
export const digitsBefore = (text, index) => text.slice(0, index).replace(/\D/g, '').length;

/** Where the caret goes in formatted text to sit after `count` digits. */
export const indexAfterDigits = (text, count) => {
  if (count === 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (/\d/.test(text[i])) seen += 1;
    if (seen === count) return i + 1;
  }
  return text.length;
};

/**
 * Calls `callback()` whenever `element`'s own content changes, until `signal`
 * aborts. Text components that take their words as content or as a `text`
 * attribute read it again then.
 */
export const watchContent = (element, callback, signal) => {
  const observer = new MutationObserver(callback);
  observer.observe(element, { childList: true, subtree: true, characterData: true });
  signal.addEventListener('abort', () => observer.disconnect());
};

/**
 * Makes `element` a heading of `level`, 1 to 6. Any other level takes the
 * heading role away again, leaving a role set for another reason alone.
 */
export const setHeadingLevel = (element, level) => {
  const value = Math.round(level ?? 0);
  if (value >= 1 && value <= 6) {
    element.setAttribute('role', 'heading');
    element.setAttribute('aria-level', String(value));
  } else if (element.getAttribute('role') === 'heading') {
    element.removeAttribute('role');
    element.removeAttribute('aria-level');
  }
};
