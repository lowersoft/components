import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// A forum sidebar's column. Its links lead to threads and members, which
// here stay put instead of leaving Storybook.
const demo = (markup) => {
  const template = document.createElement('template');
  template.innerHTML = `<div style="width: min(20rem, calc(100vw - 2rem))">${markup}</div>`;
  const root = template.content.firstElementChild;
  root.addEventListener('click', (event) => {
    const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
    if (link && new URL(link.href).origin === location.origin) event.preventDefault();
  });
  return root;
};

export default {
  title: 'Forum/Widgets/Trending Threads',
  component: 'lw-trending-threads',
  render: (args) => demo(`<lw-trending-threads ${attributes(args)}></lw-trending-threads>`),
  args: { heading: 'Trending', period: 'This week' },
};

// The threads drawing the most replies this week. The whole row leads to
// the thread; rest the pointer on a name for that member's card.
export const Default = {};

// Given as text: a time shown as it is, and an author by name alone.
export const Plain = {
  args: {
    threads: JSON.stringify([
      { title: 'Where do I find my API keys?', href: '/t/api-keys', author: 'Jun', time: 'Earlier today', replies: 4 },
      { title: 'Welcome to the forum: read this first', href: '/t/welcome', author: 'The team', replies: 1 },
    ]),
  },
};
