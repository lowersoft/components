import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// A forum sidebar's column. Its links lead to members and the page of
// everyone online, which here stay put instead of leaving Storybook.
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
  title: 'Forum/Widgets/Members Online',
  component: 'lw-members-online',
  render: (args) => demo(`<lw-members-online ${attributes(args)}></lw-members-online>`),
  args: { heading: 'Members online', 'member-count': 106, guests: 9211, href: '/online' },
};

// Rest the pointer on a name for that member's card; staff and others with
// a role stand in bold. The rest are counted after them.
export const Default = {};

// A quiet hour: everyone online is named, with no one left to count.
export const Few = {
  args: {
    members: JSON.stringify([
      { name: 'Maya Chen', handle: 'mayachen', href: '/u/mayachen', role: 'Moderator', status: 'online' },
      { name: 'Jun Watanabe', handle: 'jun', href: '/u/jun', status: 'online' },
      { name: 'Ines Alves', handle: 'ines', href: '/u/ines', status: 'away' },
    ]),
    'member-count': 3,
    guests: 2,
  },
};

// No one about.
export const Empty = {
  args: { members: '[]', 'member-count': 0, guests: 14 },
};
