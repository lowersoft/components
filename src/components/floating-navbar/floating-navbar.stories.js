import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// A page under the bar, long enough to scroll it, so the frosted frame has
// something to blur.
const PAGE = `
  <main style="max-width: 52rem; margin: 0 auto; padding: 5rem 1.5rem 40rem; font-family: system-ui, sans-serif; color: var(--lw-color-foreground)">
    <p style="margin: 0; font-size: 0.875rem; color: var(--lw-color-muted-foreground)">Lowersoft</p>
    <h1 style="margin: 0.5rem 0 1rem; font-size: clamp(2rem, 6vw, 3.25rem); line-height: 1.05; letter-spacing: -0.03em">Build lower, ship sooner.</h1>
    <p style="max-width: 34rem; margin: 0; line-height: 1.6; color: var(--lw-color-muted-foreground)">Components, sync and storage for teams who would rather ship than wire things together.</p>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); gap: 1rem; margin-top: 3rem">
      ${'<div style="height: 9rem; border-radius: 0.75rem; background: var(--lw-color-muted)"></div>'.repeat(6)}
    </div>
  </main>`;

// Its links lead to pages of their own; here a click marks the page it
// leads to as current instead of leaving Storybook.
const demo = (markup, style = '') => {
  const template = document.createElement('template');
  template.innerHTML = `<div style="${style}">${markup}${PAGE}</div>`;
  const root = template.content.firstElementChild;
  root.addEventListener('click', (event) => {
    const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
    const navbar = event.composedPath().find((node) => node.localName === 'lw-floating-navbar');
    if (!link || !navbar || link.target === '_blank') return;
    event.preventDefault();
    navbar.current = new URL(link.href).pathname;
  });
  return root;
};

export default {
  title: 'Navigation/Bars & Tabs/Floating Navbar',
  component: 'lw-floating-navbar',
  parameters: { layout: 'fullscreen' },
  render: (args) => demo(`<lw-floating-navbar ${attributes(args)}></lw-floating-navbar>`),
  args: { action: 'Get started' },
};

// Hover Products or Support, then move between them: the panel resizes
// while the menus slide past each other. Scroll to see the frame lift.
export const Default = {};

// On a documentation page: Support carries the pill and Documentation is
// marked as the page you are on.
export const CurrentPage = {
  args: { current: '/docs' },
};

// Your own actions in the `actions` slot replace the theme switch and the
// button, here a sign-in link beside the main action.
export const OwnActions = {
  render: (args) =>
    demo(`<lw-floating-navbar ${attributes(args)}>
      <a slot="actions" href="/login" style="padding: 0 0.75rem; font: 500 0.875rem system-ui, sans-serif; color: var(--lw-color-muted-foreground); text-decoration: none">Sign in</a>
      <lw-button slot="actions">Get started</lw-button>
    </lw-floating-navbar>`),
};

// On a phone the links fold into the menu button, each menu a list that
// opens in place, with the main action at the foot.
export const Narrow = {
  render: (args) => demo(`<lw-floating-navbar ${attributes(args)}></lw-floating-navbar>`, 'max-width: 24rem; margin-inline: auto'),
};
