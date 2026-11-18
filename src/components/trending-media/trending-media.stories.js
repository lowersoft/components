import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// A forum sidebar's column. Its links lead to media, albums and members,
// which here stay put instead of leaving Storybook.
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
  title: 'Forum/Widgets/Trending Media',
  component: 'lw-trending-media',
  render: (args) => demo(`<lw-trending-media ${attributes(args)}></lw-trending-media>`),
  args: { heading: 'Trending media', period: 'This week' },
};

// The media drawing the most reactions this week; the video carries a play
// mark. The whole row leads to the media, the album or category to its
// page; rest the pointer on a name for that member's card.
export const Default = {};

// Given as text: a time shown as it is, an author by name alone, and a
// thumbnail that will not load.
export const Plain = {
  args: {
    items: JSON.stringify([
      { title: 'Our booth at the meetup', href: '/media/booth', src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=160&h=160&fit=crop&auto=format&q=75', author: 'Jun', time: 'Earlier today', album: { title: 'Meetups' }, comments: 3 },
      { title: 'A picture that moved', href: '/media/moved', src: 'data:image/png;base64,bm90IGFuIGltYWdl', author: 'The team', comments: 0 },
    ]),
  },
};

// Nothing trending yet.
export const Empty = {
  args: { items: '[]' },
};
