import { attributes } from '../../../.storybook/attributes.js';
import '../forum-navbar/index.js';
import '../forum-sidebar/index.js';
import '../forum-stats/index.js';
import '../members-online/index.js';
import '../profile-posts/index.js';
import '../trending-threads/index.js';
import './index.js';

const STYLE = `<style>
  .thread-demo { box-sizing: border-box; width: min(64rem, 100%); margin: 0 auto; padding: 2rem 1.5rem 4rem; font-family: system-ui, sans-serif; color: var(--lw-color-foreground); }
  .thread-demo.with-widgets { width: min(84rem, 100%); }
  .with-widgets .columns { display: grid; gap: 1rem; align-items: start; }
  .with-widgets aside { display: grid; gap: 1rem; }
  .forum-demo { display: grid; grid-template-columns: minmax(0, 1fr); min-height: 100dvh; }
  .forum-demo .forum-page { min-width: 0; }
  @media (width >= 64rem) {
    .forum-demo { grid-template-columns: auto minmax(0, 1fr); }
    .forum-demo .thread-demo { padding-inline: 2.5rem; }
  }
  @media (width >= 72rem) {
    .with-widgets .columns { grid-template-columns: minmax(0, 1fr) 20rem; gap: 1.5rem; }
  }
  @media (72rem <= width < 84rem) {
    .forum-demo .with-widgets .columns { grid-template-columns: minmax(0, 1fr); }
  }
</style>`;

// A thread's page. Its links lead to the forum, members and posts, and its
// main action to a download, which here stay put instead of leaving
// Storybook; in the forum, a link on the sidebar or the navbar marks its page
// as current.
const demo = (markup) => {
  const template = document.createElement('template');
  template.innerHTML = `<div>${STYLE}${markup}</div>`;
  const root = template.content.firstElementChild;
  root.addEventListener('click', (event) => {
    const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
    if (!link || link.target === '_blank' || new URL(link.href).origin !== location.origin || (link.hash && new URL(link.href).pathname === location.pathname)) return;
    event.preventDefault();
    if (!event.composedPath().some((node) => /^lw-forum-(sidebar|navbar)$/.test(node.localName))) return;
    for (const element of root.querySelectorAll('lw-forum-sidebar, lw-forum-navbar')) element.current = new URL(link.href).pathname;
  });
  root.addEventListener('lw-action', (event) => event.preventDefault());
  return root;
};

const page = (args, style = '') => `<main class="thread-demo"><lw-forum-thread ${attributes(args)}${style ? ` style="${style}"` : ''}></lw-forum-thread></main>`;

// The member the forum navbar's Signed In story shows.
const USER = JSON.stringify({ name: 'p0unter', handle: 'p0unter', href: '/u/p0unter', avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4', role: 'Admin', status: 'online' });

// The posts with the forum's widgets beside them: who is online, what is
// trending, the latest profile posts and the forum's statistics.
const withWidgets = (args, style = '') =>
  `<main class="thread-demo with-widgets"><div class="columns"><lw-forum-thread ${attributes(args)}${style ? ` style="${style}"` : ''}></lw-forum-thread><aside aria-label="Around the forum"><lw-members-online></lw-members-online><lw-trending-threads></lw-trending-threads><lw-profile-posts user="${USER.replaceAll('"', '&quot;')}"></lw-profile-posts><lw-forum-stats></lw-forum-stats></aside></div></main>`;

// Under the forum navbar, signed in, and beside the forum sidebar.
const inTheForum = (content) =>
  demo(`<lw-forum-navbar ${attributes({ sidebar: true, current: '/c/lowersync', user: USER })}></lw-forum-navbar><div class="forum-demo"><lw-forum-sidebar ${attributes({ navbar: true, current: '/c/lowersync' })}></lw-forum-sidebar><div class="forum-page">${content}</div></div>`);

// Beside the posts the authors stop under the navbar.
const UNDER_NAVBAR = '--lw-forum-thread-sticky-top: 5rem';

export default {
  title: 'Forum/Threads/Forum Thread',
  component: 'lw-forum-thread',
  parameters: { layout: 'fullscreen' },
  render: (args) => demo(page(args)),
  args: { user: USER, headless: true, tab: 'discussion', page: 1, pages: 1, watching: false, level: 1 },
};

// The posts alone, signed in: Reply at the top right opens the composer at
// the end, a post's Reply mentions its author there. Point at a post for its
// link and number; open the folded quote, copy the code, react to the
// author's posts.
export const Default = {};

// With the thread's head: the way to it, its title, Watch and Download, and
// its tabs with Reply across from them.
export const WithHead = {
  args: { headless: false },
};

// A guest, with the head: Download says why it cannot be used, and there is
// no Reply and no composer.
export const Guest = {
  render: (args) =>
    demo(
      page({
        ...args,
        headless: false,
        user: null,
        thread: JSON.stringify({
          title: 'LowerSync Recovery Kit',
          label: 'Beta 4',
          breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Forums', href: '/forums' }, { label: 'LowerSync', href: '/c/lowersync' }, { label: 'Resources', href: '/c/lowersync/resources' }],
          author: { name: 'p0unter', handle: 'p0unter', href: '/u/p0unter', avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4', role: 'Admin', status: 'online' },
          time: new Date(Date.now() - 5 * 3_600_000).toISOString(),
          replies: 3,
          views: 1284,
          action: { label: 'Download', icon: 'download', disabled: true, reason: 'Sign in to download this resource' },
        }),
      }),
    ),
};

// A long thread on its second page of four, with pages above and below.
export const Paged = {
  args: { page: 2, pages: 4, 'page-href': '/r/lowersync-recovery-kit/discussion/page-{page}' },
};

// With its head, in the forum, beside the forum sidebar and under the navbar.
export const InTheForum = {
  args: { headless: false },
  render: (args) => inTheForum(page(args, UNDER_NAVBAR)),
};

// The posts with the forum's widgets beside them; narrower than 72rem the
// widgets go under the posts.
export const PostsOnlyWithWidgets = {
  name: 'Posts Only / With Widgets',
  render: (args) => demo(withWidgets(args)),
};

// The same in the forum: under the navbar, beside the sidebar, the widgets
// keeping their column from 84rem.
export const PostsOnlyWithWidgetsInTheForum = {
  name: 'Posts Only / With Widgets & In Forum',
  render: (args) => inTheForum(withWidgets(args, UNDER_NAVBAR)),
};

// On a phone each post's author stands over it.
export const Narrow = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
