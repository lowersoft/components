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
