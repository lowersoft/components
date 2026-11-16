import { attributes } from '../../../.storybook/attributes.js';
import '../forum-navbar/index.js';
import '../studio-footer/index.js';
import './index.js';

// A forum's front page beside the sidebar, long enough to scroll it, so the
// sidebar takes its frame. The grid puts the sidebar in its own column on a
// wide window and stacks it over the page below 64rem. A footer goes in the
// page's column, under its content, so the sidebar stays beside it.
const LAYOUT = `<style>
  .forum-demo { display: grid; grid-template-columns: minmax(0, 1fr); min-height: 100dvh; font-family: system-ui, sans-serif; color: var(--lw-color-foreground); }
  .forum-demo main { width: 100%; max-width: 52rem; box-sizing: border-box; margin: 0 auto; padding: 2.5rem 1.5rem 40rem; }
  .forum-demo .forum-page { min-width: 0; }
  .forum-demo .forum-page main { padding-bottom: 6rem; }
  @media (width >= 64rem) {
    .forum-demo { grid-template-columns: auto minmax(0, 1fr); }
    .forum-demo main { padding-inline: 2.5rem; }
  }
</style>`;
const thread = '<div style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--lw-color-border)"><span style="flex: none; width: 2.25rem; height: 2.25rem; border-radius: 50%; background: var(--lw-color-muted)"></span><span style="flex: 1; display: grid; gap: 0.5rem"><span style="width: 55%; height: 0.75rem; border-radius: 1rem; background: var(--lw-color-muted)"></span><span style="width: 30%; height: 0.5rem; border-radius: 1rem; background: var(--lw-color-muted)"></span></span></div>';
const PAGE = `<main>
    <p style="margin: 0; font-size: 0.875rem; color: var(--lw-color-muted-foreground)">Lowersoft Forum</p>
    <h1 style="margin: 0.5rem 0 2rem; font-size: clamp(1.75rem, 5vw, 2.5rem); line-height: 1.1; letter-spacing: -0.03em">Latest threads</h1>
    ${thread.repeat(12)}
  </main>`;

// Its links lead to pages of their own; here a click marks the page it
// leads to as current, on the sidebar and the navbar alike, instead of
// leaving Storybook.
const demo = (markup) => {
  const template = document.createElement('template');
  template.innerHTML = `<div>${LAYOUT}${markup}</div>`;
  const root = template.content.firstElementChild;
  root.addEventListener('click', (event) => {
    const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
    if (!link || link.target === '_blank' || !event.composedPath().some((node) => /^lw-forum-(sidebar|navbar)$/.test(node.localName))) return;
    event.preventDefault();
    for (const element of root.querySelectorAll('lw-forum-sidebar, lw-forum-navbar')) element.current = new URL(link.href).pathname;
  });
  return root;
};

// Beside the forum navbar, signed in with `user`, if any, and under it with
// a footer, if any, in the page's column.
const withNavbar = (args, { footer = '', user } = {}) => demo(`<lw-forum-navbar ${attributes({ sidebar: true, current: args.current, user })}></lw-forum-navbar><div class="forum-demo"><lw-forum-sidebar ${attributes({ ...args, navbar: true })}></lw-forum-sidebar><div class="forum-page">${PAGE}${footer}</div></div>`);
const FOOTER = '<lw-studio-footer></lw-studio-footer>';
// The member the forum navbar's Signed In story shows.
const MEMBER = JSON.stringify({ name: 'p0unter', avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4', role: 'Admin' });

export default {
  title: 'Navigation/Bars & Tabs/Forum Sidebar',
  component: 'lw-forum-sidebar',
  parameters: { layout: 'fullscreen' },
  render: (args) => demo(`<div class="forum-demo"><lw-forum-sidebar ${attributes(args)}></lw-forum-sidebar>${PAGE}</div>`),
  args: { current: '/' },
};

// Beside the page, bare; scroll and it takes the navbar's double frame,
// clear of the window's edges. Fold Categories or Tags away from their
// headings, and More open.
export const Default = {};

// With the forum navbar: at the top the bar spans the window and the
// sidebar stands under it at the left. Scroll, and the bar shrinks from the
// sidebar to the right edge while the sidebar rises into the room it leaves.
// On a phone the button at the start of the bar opens it from the left.
export const WithNavbar = {
  render: (args) => withNavbar(args),
};

// With the studio footer as well: at the end of the page it comes up beside
// the sidebar, and over it, closed, the button that brings it back.
export const WithNavbarAndFooter = {
  name: 'With Navbar & Footer',
  render: (args) => withNavbar(args, { footer: FOOTER }),
};

// Signed in, with the footer too: the member's profile menu stands on the
// bar where Sign In was, and the sidebar beside the page as before.
export const SignedInWithNavbarAndFooter = {
  name: 'Signed In / With Navbar & Footer',
  render: (args) => withNavbar(args, { footer: FOOTER, user: MEMBER }),
};

// On a category's page: its square keeps the background.
export const CurrentCategory = {
  args: { current: '/c/lowersync' },
};

// On a phone an outlined button at the top of the page opens the sidebar
// as a drawer from the left, as the navbar's does in With Navbar.
export const Narrow = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

// Closed from the button at its foot: the page takes its column, and the
// button left in the lower left corner brings the sidebar back.
export const Closed = {
  args: { closed: true },
};
