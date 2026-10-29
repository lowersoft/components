// The caret inside a shadow root. Browsers disagree on how a selection in a
// shadow tree is read: Chromium has `shadowRoot.getSelection()`, the others
// `getComposedRanges()`, and the plain range is a last resort.

/** The collapsed caret range in `root`, or null. */
export const caretIn = (root) => {
  const selection = root.getSelection?.() ?? document.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  let range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) && selection.getComposedRanges) {
    const [composed] = selection.getComposedRanges({ shadowRoots: [root] });
    if (!composed) return null;
    range = document.createRange();
    range.setStart(composed.startContainer, composed.startOffset);
    range.setEnd(composed.endContainer, composed.endOffset);
  }
  return root.contains(range.startContainer) && range.collapsed ? range : null;
};

/** Puts the caret right after `node`. */
export const caretAfter = (root, node) => {
  const selection = root.getSelection?.() ?? document.getSelection();
  const range = document.createRange();
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

/** Puts the caret at the end of `element`. */
export const caretAtEnd = (root, element) => {
  const selection = root.getSelection?.() ?? document.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};
