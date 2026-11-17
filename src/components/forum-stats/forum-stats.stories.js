import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// A forum sidebar's column. The member's link leads to their profile, which
// here stays put instead of leaving Storybook.
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
  title: 'Forum/Widgets/Forum Stats',
  component: 'lw-forum-stats',
  render: (args) => demo(`<lw-forum-stats ${attributes(args)}></lw-forum-stats>`),
  args: { threads: 186548, messages: 339436, members: 347035, heading: 'Forum statistics' },
};

// Every count in full; rest the pointer on the newest member's name for
// their card.
export const Default = {};

// A new forum, its newest member given by name alone.
export const NewForum = {
  args: { threads: 12, messages: 31, members: 9, 'latest-member': JSON.stringify('Jun') },
};
