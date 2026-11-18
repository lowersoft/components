import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// A forum sidebar's column. Its links lead to the media's pages; here a
// click marks the page it leads to as current instead of leaving Storybook.
const demo = (markup) => {
  const template = document.createElement('template');
  template.innerHTML = `<div style="width: min(18rem, calc(100vw - 2rem))">${markup}</div>`;
  const root = template.content.firstElementChild;
  root.addEventListener('click', (event) => {
    const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
    if (!link || new URL(link.href).origin !== location.origin) return;
    event.preventDefault();
    root.querySelector('lw-media-navigation').current = new URL(link.href).pathname;
  });
  return root;
};

export default {
  title: 'Forum/Media/Media Navigation',
  component: 'lw-media-navigation',
  render: (args) => demo(`<lw-media-navigation ${attributes(args)}></lw-media-navigation>`),
  args: { current: '/media', heading: 'Media' },
};

// On the media's front page: All media keeps the background. Each category
// has its square and how much it holds; the albums and the member's own
// media follow.
export const Default = {};

// On a category's page.
export const CurrentCategory = {
  args: { current: '/media/categories/wallpapers' },
};

// On an album, under Browse albums: its link keeps the background.
export const InAnAlbum = {
  args: { current: '/media/albums/hack-day-2026' },
};
