import lockupBlack from '../assets/brand/lowersoft-lockup-black.webp';
import lockupWhite from '../assets/brand/lowersoft-lockup-white.webp';
import mark from '../assets/brand/lowersoft-mark.webp';
import wordmarkBlack from '../assets/brand/lowersoft-wordmark-black.webp';
import wordmarkWhite from '../assets/brand/lowersoft-wordmark-white.webp';
import { escapeHtml } from './dom.js';

/**
 * Lowersoft's own artwork, the default brand in the components' demos:
 * `mark` the badger in its round badge, the same in either theme;
 * `lockup` the badge beside the stacked name, and `wordmark` the name on
 * one line, each in black for a light theme and white for a dark one.
 */
export const LOWERSOFT = {
  name: 'Lowersoft',
  mark,
  lockup: { light: lockupBlack, dark: lockupWhite },
  wordmark: { light: wordmarkBlack, dark: wordmarkWhite },
};

/**
 * An image named `alt`; with a `dark` source too, one image per theme, of
 * which the page's theme shows one (`.light-only` and `.dark-only` in
 * host.scss). Empty when there is no `light` source.
 */
export const themedImage = ({ light, dark } = {}, alt = '', className = '') => {
  if (!light) return '';
  const image = (src, only) => `<img class="${[className, only].filter(Boolean).join(' ')}" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" decoding="async">`;
  return dark && dark !== light ? image(light, 'light-only') + image(dark, 'dark-only') : image(light, '');
};

/** Fills a decorative logo tile: the image at `src` when there is one, else `letter`. */
export const paintMark = (tile, src, letter) => {
  const image = tile.querySelector('img');
  if (src) {
    if (image?.getAttribute('src') !== src) tile.innerHTML = `<img src="${escapeHtml(src)}" alt="" decoding="async">`;
  } else if (image || tile.textContent !== letter) {
    tile.textContent = letter;
  }
};
