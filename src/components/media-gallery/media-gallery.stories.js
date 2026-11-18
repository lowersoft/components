import { attributes } from '../../../.storybook/attributes.js';
import { forumFrame } from '../../../.storybook/forum-frame.js';
import '../media-navigation/index.js';
import '../trending-media/index.js';
import './index.js';

const STYLE = `<style>
  .media-demo { box-sizing: border-box; width: min(72rem, 100%); margin: 0 auto; padding: 2.5rem 1.5rem 4rem; font-family: system-ui, sans-serif; color: var(--lw-color-foreground); container-type: inline-size; }
  .media-demo.with-widgets { width: min(84rem, 100%); }
  .media-demo .eyebrow { margin: 0; font-size: 0.875rem; color: var(--lw-color-muted-foreground); }
  .media-demo h1 { margin: 0.5rem 0 2rem; font-size: clamp(1.75rem, 5vw, 2.5rem); line-height: 1.1; letter-spacing: -0.03em; }
  .media-demo .columns { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
  .media-demo aside { display: grid; gap: 1rem; align-content: start; }
  @container (width >= 52rem) {
    .media-demo .columns { grid-template-columns: 18rem minmax(0, 1fr); gap: 1.5rem; align-items: start; }
    .media-demo aside { grid-column: 1; grid-row: 1; }
    .media-demo lw-media-gallery { grid-column: 2; grid-row: 1; }
  }
  @media (width >= 64rem) {
    lw-forum-nav-sidebar .media-demo { padding-inline: 2.5rem; }
  }
</style>`;

// The forum's media page. Its links lead to the media, albums and members,
// which here stay put instead of leaving Storybook; a link on the sidebar
// or the navbar marks its page as current, and one on the media's
// navigation its own.
const demo = (markup) => {
  const template = document.createElement('template');
  template.innerHTML = `<div>${STYLE}${markup}</div>`;
  const root = template.content.firstElementChild;
  root.addEventListener('click', (event) => {
    const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
    if (!link || link.target === '_blank' || new URL(link.href).origin !== location.origin) return;
    event.preventDefault();
    const owner = event.composedPath().find((node) => /^lw-(forum-sidebar|forum-navbar|media-navigation)$/.test(node.localName ?? ''));
    if (!owner) return;
    const path = new URL(link.href).pathname;
    const targets = owner.localName === 'lw-media-navigation' ? [owner] : root.querySelectorAll('lw-forum-sidebar, lw-forum-navbar');
    for (const element of targets) element.current = path;
  });
  return root;
};

// The member the forum navbar's Signed In story shows.
const USER = JSON.stringify({ name: 'p0unter', handle: 'p0unter', href: '/u/p0unter', avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4', role: 'Admin', status: 'online' });

const gallery = (args) => `<lw-media-gallery ${attributes(args)}></lw-media-gallery>`;
// The gallery under the page's title, alone or beside the media's
// navigation and what is trending.
const page = (args) => `<main class="media-demo"><p class="eyebrow">Lowersoft Forum</p><h1>Media</h1>${gallery(args)}</main>`;
const widgetsPage = (args) =>
  `<main class="media-demo with-widgets"><p class="eyebrow">Lowersoft Forum</p><h1>Media</h1><div class="columns">${gallery(args)}<aside aria-label="Around the media"><lw-media-navigation current="/media"></lw-media-navigation><lw-trending-media></lw-trending-media></aside></div></main>`;

export default {
  title: 'Forum/Media/Media Gallery',
  component: 'lw-media-gallery',
  parameters: { layout: 'fullscreen' },
  render: (args) => demo(page(args)),
  args: { user: USER, page: 1, pages: 21 },
};

// The first of 21 pages, signed in. Rest the pointer on a thumbnail for its
// title, who added it, when and its counts; open one for the viewer, and
// step through with the arrow keys. The newest carry a New mark until seen
// or marked viewed. Filters folds open the type, the order and the member.
export const Default = {};

// A guest: no Mark viewed and no Add media, and nothing marked new.
export const Guest = {
  args: { user: '' },
};

// Leo's media, the most reacted to first: each filter in use stands in the
// head, removable on its own.
export const Filtered = {
  args: { filters: JSON.stringify({ type: 'all', sort: 'reactions', member: 'leo' }) },
};

// A member's media before they add any.
export const Empty = {
  args: { items: '[]', pages: 1 },
};

// The media's page as the forum shows it: the media's navigation and what
// is trending beside the gallery, or under it on a narrow page.
export const WithWidgets = {
  name: 'With Widgets',
  render: (args) => demo(widgetsPage(args)),
};

// The same in the forum: in Forum Nav & Sidebar, on Media.
export const WithWidgetsInTheForum = {
  name: 'With Widgets & In Forum',
  render: (args) => demo(forumFrame(widgetsPage(args), { current: '/media', user: USER })),
};

// On a phone: two thumbnails across, their titles and counts always
// showing, and a swipe steps through the viewer.
export const Narrow = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
