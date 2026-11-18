import { forumFrame } from '../../../.storybook/forum-frame.js';
import '../auth-dialog/index.js';
import '../studio-footer/index.js';
import './index.js';

// A forum's front page, long enough to scroll it, so the navbar and the
// sidebar take their frame; with a footer under it, a shorter one.
const STYLE = `<style>
  .forum-demo-page { width: 100%; max-width: 52rem; box-sizing: border-box; margin: 0 auto; padding: 2.5rem 1.5rem 40rem; font-family: system-ui, sans-serif; color: var(--lw-color-foreground); }
  .forum-demo-page:has(~ lw-studio-footer) { padding-bottom: 6rem; }
  @media (width >= 64rem) {
    .forum-demo-page { padding-inline: 2.5rem; }
  }
</style>`;
const thread = '<div style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--lw-color-border)"><span style="flex: none; width: 2.25rem; height: 2.25rem; border-radius: 50%; background: var(--lw-color-muted)"></span><span style="flex: 1; display: grid; gap: 0.5rem"><span style="width: 55%; height: 0.75rem; border-radius: 1rem; background: var(--lw-color-muted)"></span><span style="width: 30%; height: 0.5rem; border-radius: 1rem; background: var(--lw-color-muted)"></span></span></div>';
const PAGE = `<main class="forum-demo-page">
    <p style="margin: 0; font-size: 0.875rem; color: var(--lw-color-muted-foreground)">Lowersoft Forum</p>
    <h1 style="margin: 0.5rem 0 2rem; font-size: clamp(1.75rem, 5vw, 2.5rem); line-height: 1.1; letter-spacing: -0.03em">Latest threads</h1>
    ${thread.repeat(12)}
  </main>`;
const FOOTER = '<lw-studio-footer></lw-studio-footer>';
// The member the forum navbar's Signed In story shows.
const MEMBER = JSON.stringify({ name: 'p0unter', avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4', banner: 'https://raw.githubusercontent.com/lowersoft/.github/refs/heads/main/bg_1.jpg', role: 'Admin' });

// The navbar and the sidebar round the page, signed in with `user`, if any,
// and a footer under the page, if any. Their links lead to pages of their
// own; here a click marks the page it leads to as current, on both, instead
// of leaving Storybook. A guest's Sign In opens the sign-in dialog.
const forum = ({ current, closed }, { footer = '', user, ready } = {}) => {
  const template = document.createElement('template');
  template.innerHTML = `<div>${STYLE}${forumFrame(PAGE + footer, { current, user, closed })}<lw-auth-dialog></lw-auth-dialog></div>`;
  const root = template.content.firstElementChild;
  root.addEventListener('click', (event) => {
    const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
    if (!link || link.target === '_blank' || !event.composedPath().some((node) => /^lw-forum-(sidebar|navbar)$/.test(node.localName))) return;
    event.preventDefault();
    for (const element of root.querySelectorAll('lw-forum-sidebar, lw-forum-navbar')) element.current = new URL(link.href).pathname;
  });
  root.addEventListener('lw-action', () => {
    const dialog = root.querySelector('lw-auth-dialog');
    dialog.view = 'sign-in';
    dialog.open = true;
  });
  if (ready) requestAnimationFrame(() => ready(root));
  return root;
};

export default {
  title: 'Forum/Navigation/Forum Nav & Sidebar',
  component: 'lw-forum-nav-sidebar',
  parameters: { layout: 'fullscreen' },
  render: (args) => forum(args),
  args: { current: '/' },
  argTypes: {
    current: { control: 'text', description: "Path of the page you are on, on the navbar and the sidebar (the sidebar's and navbar's `current`)" },
    closed: { control: 'boolean', description: "The sidebar slid out (the sidebar's `closed`)" },
  },
};

// At the top the bar spans the window and the sidebar stands under it at
// the left, both bare. Scroll, and they take one frame flush with the
// window's edges: the sidebar meets its left, top and bottom edges and the
// bar its top and right, one sheet of glass round their panes, a line along
// the bar's foot turning down the sidebar's edge on a round.
export const Default = {};

// With the studio footer under the page: at the end of the page it comes
// up beside the sidebar.
export const WithFooter = {
  name: 'With Footer',
  render: (args) => forum(args, { footer: FOOTER }),
};

// Signed in, with the footer too: the member's profile menu stands on the
// bar where Sign In was.
export const SignedInWithFooter = {
  name: 'Signed In / With Footer',
  render: (args) => forum(args, { footer: FOOTER, user: MEMBER }),
};

// The search open, as the button or ⌘K / Ctrl+K opens it: the bar takes
// the frame at once and grows down to hold the panel, the page's corner
// moving down with it.
export const Searching = {
  render: (args) => forum(args, { ready: (root) => root.querySelector('lw-forum-navbar').openSearch() }),
};

// On a category's page: its square keeps the background.
export const CurrentCategory = {
  args: { current: '/c/lowersync' },
};

// Closed from the button at the sidebar's foot: the page takes its column,
// and once the page scrolls the bar takes the window's width, its line too.
export const Closed = {
  args: { closed: true },
};

// On a phone the bar floats over the page once it scrolls, and the button
// at its start opens the sidebar as a drawer from the left.
export const Narrow = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
