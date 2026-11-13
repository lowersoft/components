import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// A forum's front page under the bar, long enough to scroll it, so the bar
// can shrink and the frosted frame has something to blur.
const thread = '<div style="display: flex; align-items: center; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--lw-color-border)"><span style="flex: none; width: 2.25rem; height: 2.25rem; border-radius: 50%; background: var(--lw-color-muted)"></span><span style="flex: 1; display: grid; gap: 0.5rem"><span style="width: 55%; height: 0.75rem; border-radius: 1rem; background: var(--lw-color-muted)"></span><span style="width: 30%; height: 0.5rem; border-radius: 1rem; background: var(--lw-color-muted)"></span></span></div>';
const PAGE = `
  <main style="max-width: 52rem; margin: 0 auto; padding: 4rem 1.5rem 40rem; font-family: system-ui, sans-serif; color: var(--lw-color-foreground)">
    <p style="margin: 0; font-size: 0.875rem; color: var(--lw-color-muted-foreground)">Lowersoft Forum</p>
    <h1 style="margin: 0.5rem 0 2rem; font-size: clamp(1.75rem, 5vw, 2.5rem); line-height: 1.1; letter-spacing: -0.03em">Latest threads</h1>
    ${thread.repeat(12)}
  </main>`;

// Its links lead to pages of their own; here a click marks the page it
// leads to as current instead of leaving Storybook.
const demo = (markup, style = '') => {
  const template = document.createElement('template');
  template.innerHTML = `<div style="${style}">${markup}${PAGE}</div>`;
  const root = template.content.firstElementChild;
  root.addEventListener('click', (event) => {
    const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
    const navbar = event.composedPath().find((node) => node.localName === 'lw-forum-navbar');
    if (!link || !navbar || link.target === '_blank') return;
    event.preventDefault();
    navbar.current = new URL(link.href).pathname;
  });
  return root;
};

export default {
  title: 'Navigation/Bars & Tabs/Forum Navbar',
  component: 'lw-forum-navbar',
  parameters: { layout: 'fullscreen' },
  render: (args) => demo(`<lw-forum-navbar ${attributes(args)}></lw-forum-navbar>`),
  args: { action: 'Sign In' },
};

// Across the full width at the top; scroll and it shrinks into the floating
// frame, the brand to its mark and Sign In to its account icon.
export const Default = {};

// The search open, as the button or ⌘K / Ctrl+K opens it: the bar shrinks
// to the field and grows down to show how to search. Type @ or # to filter by
// member or category.
export const Searching = {
  render: (args) => {
    const root = demo(`<lw-forum-navbar ${attributes(args)}></lw-forum-navbar>`);
    requestAnimationFrame(() => root.querySelector('lw-forum-navbar').openSearch());
    return root;
  },
};

// Signed in: the member's profile menu stands where Sign In was, their
// avatar and name on an outlined button and their role at the menu's head;
// scroll, and it folds to the avatar.
export const SignedIn = {
  args: { user: JSON.stringify({ name: 'p0unter', avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4', role: 'Admin' }) },
};

// On the Latest page: its link carries the pill across from the menus.
export const CurrentPage = {
  args: { current: '/latest' },
};

// On a phone the menus and the forum's sections fold into the menu button,
// the sections as a group of their own, and Sign In stays as its icon. The
// brand stays whole as the page scrolls.
export const Narrow = {
  render: (args) => demo(`<lw-forum-navbar ${attributes(args)}></lw-forum-navbar>`, 'max-width: 24rem; margin-inline: auto'),
};
