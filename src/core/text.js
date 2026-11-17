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

/**
 * Wraps each word of `root`'s text in a `.word` span, inside any marks or
 * links, so the words can be animated one after another. Returns the spans.
 */
export const splitWords = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  for (const node of texts) {
    const words = document.createDocumentFragment();
    for (const part of node.data.split(/(\s+)/)) {
      if (!part) continue;
      words.append(/^\s+$/.test(part) ? part : Object.assign(document.createElement('span'), { className: 'word', textContent: part }));
    }
    node.replaceWith(words);
  }
  return [...root.querySelectorAll('.word')];
};

/** Lowercase without accents, so "turk" finds "Türkiye" and "yil" "Yılmaz". */
export const foldText = (text) => String(text ?? '').normalize('NFKD').replace(/\p{M}/gu, '').replace(/ı/g, 'i').toLowerCase();

// The textarea's styles that decide where its text falls.
const MIRRORED = ['boxSizing', 'width', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontFamily', 'lineHeight', 'letterSpacing', 'wordSpacing', 'textTransform', 'textIndent', 'tabSize'];

/**
 * Where the caret, or `index`, stands in a textarea, as a rect on the
 * screen: a copy of its text up to there, laid out the same off screen,
 * says where the next character falls.
 */
export const caretRectIn = (textarea, index = textarea.selectionStart) => {
  const style = getComputedStyle(textarea);
  const mirror = document.createElement('div');
  for (const name of MIRRORED) mirror.style[name] = style[name];
  Object.assign(mirror.style, { position: 'absolute', top: '0', left: '-9999px', visibility: 'hidden', whiteSpace: 'pre-wrap', overflowWrap: 'break-word', overflow: 'hidden', height: 'auto' });
  mirror.textContent = textarea.value.slice(0, index);
  const marker = Object.assign(document.createElement('span'), { textContent: textarea.value.slice(index, index + 1) || '.' });
  mirror.append(marker);
  textarea.parentNode.append(mirror);
  const box = textarea.getBoundingClientRect();
  const lineHeight = Number.parseFloat(style.lineHeight) || marker.offsetHeight;
  const top = box.top + Number.parseFloat(style.borderTopWidth) + marker.offsetTop - textarea.scrollTop;
  const left = box.left + Number.parseFloat(style.borderLeftWidth) + marker.offsetLeft - textarea.scrollLeft;
  mirror.remove();
  return { left, right: left, top, bottom: top + lineHeight, width: 0, height: lineHeight };
};
