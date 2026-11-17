import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// A forum sidebar's column. Its links lead to members and posts, which here
// stay put instead of leaving Storybook.
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

// The member the forum navbar's Signed In story shows.
const MEMBER = JSON.stringify({ name: 'p0unter', handle: 'p0unter', href: '/u/p0unter', avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4', role: 'Admin', status: 'online' });

export default {
  title: 'Forum/Widgets/Profile Posts',
  component: 'lw-profile-posts',
  render: (args) => demo(`<lw-profile-posts ${attributes(args)}></lw-profile-posts>`),
  args: { user: MEMBER, heading: 'Latest profile posts', placeholder: 'Update your status…' },
};

// Signed in: write a status and Post, or press ⌘ or Ctrl and Enter, and it
// goes to the top. Ana's post folds under Show more.
export const Default = {};

// A guest reads the posts, with no field to post in.
export const Guest = {
  render: (args) => demo(`<lw-profile-posts ${attributes({ ...args, user: null })}></lw-profile-posts>`),
};

// No posts yet.
export const Empty = {
  args: { posts: '[]' },
};
