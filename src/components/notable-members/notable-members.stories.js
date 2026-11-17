import { attributes } from '../../../.storybook/attributes.js';
import '../forum-navbar/index.js';
import '../forum-sidebar/index.js';
import './index.js';

const STYLE = `<style>
  .members-demo { box-sizing: border-box; width: min(76rem, 100%); margin: 0 auto; padding: 2.5rem 1.5rem 4rem; font-family: system-ui, sans-serif; color: var(--lw-color-foreground); }
  .members-demo .eyebrow { margin: 0; font-size: 0.875rem; color: var(--lw-color-muted-foreground); }
  .members-demo h1 { margin: 0.5rem 0 2rem; font-size: clamp(1.75rem, 5vw, 2.5rem); line-height: 1.1; letter-spacing: -0.03em; }
  .forum-demo { display: grid; grid-template-columns: minmax(0, 1fr); min-height: 100dvh; }
  .forum-demo .forum-page { min-width: 0; }
  @media (width >= 64rem) {
    .forum-demo { grid-template-columns: auto minmax(0, 1fr); }
    .forum-demo .members-demo { padding-inline: 2.5rem; }
  }
</style>`;

// The forum's page of notable members. Its links lead to members, which
// here stay put instead of leaving Storybook; in the forum, a link on the
// sidebar or the navbar marks its page as current.
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

const page = (args) => `<main class="members-demo"><p class="eyebrow">Lowersoft Forum</p><h1>Notable members</h1><lw-notable-members ${attributes(args)}></lw-notable-members></main>`;

export default {
  title: 'Forum/Members/Notable Members',
  component: 'lw-notable-members',
  parameters: { layout: 'fullscreen' },
  render: (args) => demo(page(args)),
  args: { view: 'overview', limit: 5, heading: 'Members', level: 2 },
  argTypes: { view: { control: 'select', options: ['overview', 'messages', 'reactions', 'solutions', 'points', 'birthdays', 'staff'] } },
};

// The first five on each list; See all or the menu shows a list in full.
// Type in Find member, "ma" or "@sql", for the matches.
export const Default = {};

// One list in full: every member ranked, with their title.
export const FullList = {
  args: { view: 'messages' },
};

// In the forum, beside the forum sidebar and under the navbar.
export const InTheForum = {
  render: (args) =>
    demo(`<lw-forum-navbar ${attributes({ sidebar: true, current: '/members' })}></lw-forum-navbar><div class="forum-demo"><lw-forum-sidebar ${attributes({ navbar: true, current: '/members' })}></lw-forum-sidebar><div class="forum-page">${page(args)}</div></div>`),
};

// On a phone the menu runs along the top, over Find member and the lists.
export const Narrow = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
