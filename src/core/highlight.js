/**
 * Moves one shared highlight box onto `item`, so a list shows a single box
 * sliding between items instead of each item lighting up on its own. The box
 * is absolutely positioned in the items' offset parent and should transition
 * `translate`, `width` and `height`; the `visible` class shows it. Appearing,
 * it lands on the item without sliding from wherever it last was, and so it
 * does with `instant`, for an item the layout moved rather than the user.
 */
export const moveHighlight = (highlight, item, { instant = false } = {}) => {
  if (!item) return;
  const appearing = instant || !highlight.classList.contains('visible');
  if (appearing) highlight.style.transition = 'none';
  highlight.style.translate = `${item.offsetLeft}px ${item.offsetTop}px`;
  highlight.style.width = `${item.offsetWidth}px`;
  highlight.style.height = `${item.offsetHeight}px`;
  if (appearing) {
    highlight.getBoundingClientRect();
    highlight.style.transition = '';
  }
  highlight.classList.add('visible');
};

export const hideHighlight = (highlight) => highlight.classList.remove('visible');
