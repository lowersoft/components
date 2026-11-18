import { attributes } from '../../../.storybook/attributes.js';
import { forumFrame } from '../../../.storybook/forum-frame.js';
import '../forum-stats/index.js';
import '../members-online/index.js';
import '../profile-posts/index.js';
import '../trending-threads/index.js';
import './index.js';

const STYLE = `<style>
  .categories-demo { box-sizing: border-box; width: min(60rem, 100%); margin: 0 auto; padding: 2.5rem 1.5rem 4rem; font-family: system-ui, sans-serif; color: var(--lw-color-foreground); }
  .categories-demo .eyebrow { margin: 0; font-size: 0.875rem; color: var(--lw-color-muted-foreground); }
  .categories-demo h1 { margin: 0.5rem 0 2rem; font-size: clamp(1.75rem, 5vw, 2.5rem); line-height: 1.1; letter-spacing: -0.03em; }
  .categories-demo.with-widgets { width: min(84rem, 100%); }
  .with-widgets .columns { display: grid; gap: 1rem; }
  .with-widgets aside { display: grid; gap: 1rem; align-content: start; }
  @media (width >= 72rem) {
    .with-widgets .columns { grid-template-columns: minmax(0, 1fr) 20rem; gap: 1.5rem; }
  }
  @media (72rem <= width < 84rem) {
    lw-forum-nav-sidebar .with-widgets .columns { grid-template-columns: minmax(0, 1fr); }
  }
  @media (width >= 64rem) {
    lw-forum-nav-sidebar .categories-demo { padding-inline: 2.5rem; }
  }
</style>`;

// A forum's page of categories. Its links lead to categories, threads and
// members, which here stay put instead of leaving Storybook; in the forum,
// a link on the sidebar or the navbar marks its page as current.
const demo = (markup) => {
  const template = document.createElement('template');
  template.innerHTML = `<div>${STYLE}${markup}</div>`;
  const root = template.content.firstElementChild;
  root.addEventListener('click', (event) => {
    const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
    if (!link || link.target === '_blank' || new URL(link.href).origin !== location.origin) return;
    event.preventDefault();
    if (!event.composedPath().some((node) => /^lw-forum-(sidebar|navbar)$/.test(node.localName))) return;
    for (const element of root.querySelectorAll('lw-forum-sidebar, lw-forum-navbar')) element.current = new URL(link.href).pathname;
  });
  return root;
};

// The member the forum navbar's Signed In story shows.
const MEMBER = JSON.stringify({ name: 'p0unter', handle: 'p0unter', href: '/u/p0unter', avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4', role: 'Admin', status: 'online' });

// The categories with the forum's widgets beside them, under the page's
// title unless `heading` is false.
const widgetsPage = (args, { heading = true } = {}) =>
  `<main class="categories-demo with-widgets">${heading ? '<p class="eyebrow">Lowersoft Forum</p><h1>Categories</h1>' : ''}<div class="columns"><lw-forum-categories ${attributes(args)}></lw-forum-categories><aside aria-label="Around the forum"><lw-members-online></lw-members-online><lw-trending-threads></lw-trending-threads><lw-profile-posts user="${MEMBER.replaceAll('"', '&quot;')}"></lw-profile-posts><lw-forum-stats></lw-forum-stats></aside></div></main>`;

const page = (categories) => `<main class="categories-demo"><p class="eyebrow">Lowersoft Forum</p><h1>Categories</h1>${categories}</main>`;

export default {
  title: 'Forum/Lists/Forum Categories',
  component: 'lw-forum-categories',
  parameters: { layout: 'fullscreen' },
  render: (args) => demo(page(`<lw-forum-categories ${attributes(args)}></lw-forum-categories>`)),
  args: { level: 2 },
};

// The forum's categories in their groups. Rest the pointer on a name under
// a latest thread for that member's card, fold a group away from its
// heading, and show the rest of LowerSync's sub-forums. Narrow the window and
// the latest thread, then the counts, stack under the names.
export const Default = {};

// The forum's page of categories in Forum Nav & Sidebar, open on All
// categories: the forum navbar over it and the forum sidebar beside it,
// joined into one frame once the page scrolls.
export const InTheForum = {
  render: (args) => demo(forumFrame(page(`<lw-forum-categories ${attributes(args)}></lw-forum-categories>`), { current: '/categories' })),
};

// The front page of the forum: the categories, and beside them the
// forum's widgets: who is online, what is trending, the latest profile
// posts, signed in, and the forum's statistics. Narrower than 72rem the widgets go under the categories.
export const WithWidgets = {
  name: 'With Widgets',
  render: (args) => demo(widgetsPage(args)),
};

// The same front page in the forum, without the page's title: in Forum
// Nav & Sidebar, signed in as p0unter and open on All categories. Beside
// the sidebar the widgets keep their column from 84rem.
export const WithWidgetsInTheForum = {
  name: 'With Widgets & In Forum',
  render: (args) => demo(forumFrame(widgetsPage(args, { heading: false }), { current: '/categories', user: MEMBER })),
};

// On a phone: under each name its counts, then its latest thread.
export const Narrow = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

// The least a category needs: a name and a link. Without an icon it takes
// the forum's speech bubbles, and a colour from its name unless `color`
// sets one; a time given as text and a member given by name alone show as
// they are; a group with no categories says so.
export const Plain = {
  args: {
    groups: JSON.stringify([
      {
        title: 'Help',
        categories: [
          { title: 'Questions', href: '/c/questions', threads: 12, messages: 48, latest: { title: 'Where do I find my API keys?', href: '/t/api-keys', time: 'Earlier today', author: 'Jun' } },
          { title: 'Tutorials', href: '/c/tutorials', color: '#0ea5e9', threads: 3, messages: 3 },
          { title: 'Meta', href: '/c/meta' },
        ],
      },
      { title: 'Archive', description: 'Older categories, kept for reading.', categories: [] },
    ]),
  },
};

// A group folded from the start with `collapsed`; its heading opens it.
export const Folded = {
  args: {
    groups: JSON.stringify([
      {
        id: 'staff',
        title: 'Staff',
        description: 'Only the team can read these.',
        collapsed: true,
        categories: [
          { title: 'Moderators', href: '/c/moderators', private: true, description: 'Reports, appeals and the guidelines.' },
          { title: 'Release Planning', href: '/c/release-planning', private: true },
        ],
      },
    ]),
  },
};
