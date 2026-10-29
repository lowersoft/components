import rollingStyles from '../styles/rolling.scss?inline';

/** Styles for `roll()`; add to a component's `static styles`. */
export { rollingStyles };

const REEL = `<span class="reel">${[...'0123456789'].map((d) => `<span>${d}</span>`).join('')}</span>`;

/**
 * Show `text` in a `.rolling` container, rolling each digit to its new value.
 * Digits are matched from the right, so the ones stay the ones when a digit
 * is added. Nodes stay attached so their reels transition: a node taken out
 * of the document loses its style and would jump.
 */
export const roll = (container, text) => {
  const chars = [...text];
  while (container.children.length > chars.length) container.firstElementChild.remove();
  while (container.children.length < chars.length) container.prepend(document.createElement('span'));

  chars.forEach((char, i) => {
    let node = container.children[i];
    const isDigit = char >= '0' && char <= '9';
    if (isDigit !== node.classList.contains('digit')) {
      const fresh = document.createElement('span');
      if (isDigit) Object.assign(fresh, { className: 'digit', innerHTML: REEL });
      node.replaceWith(fresh);
      node = fresh;
    }
    if (isDigit) node.firstChild.style.translate = `0 ${-Number(char) * 10}%`;
    // A plain space would collapse between the reels of a flex row.
    else node.textContent = char === ' ' ? '\u00a0' : char;
  });
};
