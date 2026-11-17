import { attributes } from '../../../.storybook/attributes.js';
import '../forum-navbar/index.js';
import '../forum-sidebar/index.js';
import './index.js';

const STYLE = `<style>
  .profile-demo { box-sizing: border-box; width: min(60rem, 100%); margin: 0 auto; padding: 2rem 1.5rem 4rem; font-family: system-ui, sans-serif; color: var(--lw-color-foreground); }
  .forum-demo { display: grid; grid-template-columns: minmax(0, 1fr); min-height: 100dvh; }
  .forum-demo .forum-page { min-width: 0; }
  @media (width >= 64rem) {
    .forum-demo { grid-template-columns: auto minmax(0, 1fr); }
    .forum-demo .profile-demo { padding-inline: 2.5rem; }
  }
</style>`;

// A member's page. Its links lead to members, threads and posts, which here
// stay put instead of leaving Storybook; in the forum, a link on the sidebar
// or the navbar marks its page as current.
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

const page = (args) => `<main class="profile-demo"><lw-member-profile ${attributes(args)}></lw-member-profile></main>`;

const ago = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

// The member the forum navbar's Signed In story shows.
const P0UNTER = {
  name: 'p0unter',
  handle: 'p0unter',
  href: '/u/p0unter',
  avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4',
  banner: 'https://raw.githubusercontent.com/lowersoft/.github/refs/heads/main/bg_1.jpg',
  role: 'Admin',
  title: 'Founder',
  status: 'online',
  now: { text: 'Viewing their own profile' },
  bio: 'Building LowerSoft and the lw components. Bug reports welcome, a repro even more so.',
  posts: 3412,
  reactions: 21800,
  solutions: 412,
  points: 9120,
  joined: '2021-06-02',
  location: 'Istanbul',
  website: 'https://github.com/p0unter',
  followers: 4810,
  following: 64,
};
const USER = JSON.stringify(P0UNTER);

export default {
  title: 'Forum/Members/Member Profile',
  component: 'lw-member-profile',
  parameters: { layout: 'fullscreen' },
  render: (args) => demo(page(args)),
  args: { user: USER, tab: 'posts', level: 1 },
  argTypes: { tab: { control: 'inline-radio', options: ['posts', 'activity', 'postings', 'about'] } },
};

// Maya's page, seen by p0unter: Follow, Message and Report, and a field to
// leave her a post. Try the tabs with the arrow keys, and rest the pointer
// on a name for that member's card.
export const Default = {
  args: { 'postings-href': '/u/mayachen/postings' },
};

// p0unter's own page: Edit profile, Edit banner, and a field for their
// status.
export const OwnProfile = {
  args: {
    member: USER,
    posts: JSON.stringify([
      { author: { name: 'Maya Chen', handle: 'mayachen', href: '/u/mayachen', role: 'Moderator', status: 'online' }, text: 'The categories page looks great on my phone. Shipping it?', time: ago(40), href: '/p/2230' },
    ]),
  },
};

// A guest sees the page without the field to post in.
export const Guest = {
  render: (args) => demo(page({ ...args, user: null })),
};

// A member who has just joined, on their own page: every tab says what will
// go there.
export const NewMember = {
  args: {
    member: JSON.stringify({ name: 'SevenAndAHalf', handle: 'sevenandahalf', href: '/u/sevenandahalf', title: 'New member', seen: ago(4), now: { text: 'Viewing their own profile' }, posts: 1, reactions: 0, points: 1, joined: '2026-10-24' }),
    user: JSON.stringify({ name: 'SevenAndAHalf', handle: 'sevenandahalf', href: '/u/sevenandahalf' }),
    posts: '[]',
    activity: '[]',
    postings: '[]',
  },
};

// Maya's page in the forum, beside the forum sidebar and under the navbar.
export const InTheForum = {
  render: (args) =>
    demo(`<lw-forum-navbar ${attributes({ sidebar: true, current: '/members', user: USER })}></lw-forum-navbar><div class="forum-demo"><lw-forum-sidebar ${attributes({ navbar: true, current: '/members' })}></lw-forum-sidebar><div class="forum-page">${page(args)}</div></div>`),
};

// On a phone the avatar rises into the banner with the buttons across from
// it, and the counts go two by two.
export const Narrow = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
