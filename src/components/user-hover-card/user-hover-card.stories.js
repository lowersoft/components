import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// Members of the forum, as the forum navbar's demo threads name them.
const MEMBERS = {
  p0unter: {
    name: 'p0unter',
    handle: 'p0unter',
    href: '/u/p0unter',
    avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4',
    banner: 'https://raw.githubusercontent.com/lowersoft/.github/refs/heads/main/bg_1.jpg',
    role: 'Admin',
    status: 'online',
    bio: 'Building LowerSoft and the lw components. Bug reports welcome, a repro even more so.',
    posts: 3412,
    reactions: 21800,
    solutions: 412,
    joined: '2021-06-02',
  },
  maya: {
    name: 'Maya Chen',
    handle: 'mayachen',
    href: '/u/mayachen',
    role: 'Moderator',
    status: 'online',
    bio: 'Keeps LowerSync honest offline. Ask me about conflict resolution, CRDTs and the iOS background task budget.',
    posts: 1208,
    reactions: 8420,
    solutions: 96,
    joined: '2022-03-14',
    location: 'Lisbon',
  },
  leo: {
    name: 'Leo Martins',
    handle: 'leom',
    href: '/u/leom',
    role: 'Contributor',
    status: 'away',
    bio: 'Design tokens, theming and the odd query planner rabbit hole.',
    posts: 486,
    reactions: 2130,
    solutions: 31,
    joined: '2023-01-09',
    location: 'Porto',
  },
  priya: {
    name: 'Priya Raman',
    handle: 'priya',
    href: '/u/priya',
    seen: '3h ago',
    bio: 'Security engineer. Passkeys everywhere, please.',
    posts: 152,
    reactions: 940,
    solutions: 12,
    joined: '2024-05-21',
  },
  sam: {
    name: 'Sam Okafor',
    handle: 'samokafor',
    href: '/u/samokafor',
    role: 'Staff',
    status: 'busy',
    bio: 'Releases, changelogs and LowerDB migrations. If a version shipped, I probably wrote its notes.',
    posts: 2210,
    reactions: 12400,
    solutions: 188,
    joined: '2021-11-30',
  },
  ana: {
    name: 'Ana Ruiz',
    handle: 'anaruiz',
    href: '/u/anaruiz',
    seen: '2d ago',
    bio: 'Shipping small apps on the lw components and writing up how.',
    posts: 64,
    reactions: 512,
    joined: '2025-02-17',
    location: 'Valencia',
  },
};

// A member's name with their card; the links lead to profiles, which here
// stay put instead of leaving Storybook.
const member = (user, label = user.name) => `<lw-user-hover-card ${attributes({ user: JSON.stringify(user) })}><a class="member" href="${user.href}">${label}</a></lw-user-hover-card>`;

const STYLE = `<style>
  .hover-demo { box-sizing: border-box; width: min(36rem, calc(100vw - 2rem)); font: 0.875rem/1.6 system-ui, sans-serif; color: var(--lw-color-foreground); }
  .hover-demo p { margin: 0; }
  .hover-demo .member { font-weight: 600; color: inherit; text-decoration: none; text-underline-offset: 0.2em; }
  .hover-demo .member:hover { text-decoration: underline; }
  .hover-demo .muted { color: var(--lw-color-muted-foreground); }
  .hover-demo .post { display: grid; gap: 0.75rem; padding: 1.25rem; border: 1px solid var(--lw-color-border); border-radius: 1rem; }
  .hover-demo .rows { display: grid; border: 1px solid var(--lw-color-border); border-radius: 1rem; }
  .hover-demo .row { display: grid; gap: 0.25rem; padding: 0.875rem 1.125rem; }
  .hover-demo .row + .row { border-top: 1px solid var(--lw-color-border); }
  .hover-demo .title { font-weight: 500; }
</style>`;

const demo = (markup, top = '22rem') => {
  const template = document.createElement('template');
  template.innerHTML = `<div class="hover-demo" style="padding-top: ${top}">${STYLE}${markup}</div>`;
  const root = template.content.firstElementChild;
  root.addEventListener('click', (event) => {
    const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
    if (link?.getAttribute('href')?.startsWith('/u/')) event.preventDefault();
  });
  return root;
};

export default {
  title: 'Forum/Members/User Hover Card',
  component: 'lw-user-hover-card',
  render: (args) => demo(`<p class="muted">Started by <lw-user-hover-card ${attributes(args)}><a class="member" href="/u/mayachen">Maya Chen</a></lw-user-hover-card> in LowerSync · 2h ago</p>`),
  args: { user: JSON.stringify(MEMBERS.maya), followed: false, open: false },
};

// Rest the pointer on the name: the card opens over it, and the pointer can
// cross to it to follow or message them. Tab to the name opens it too.
export const Default = {};

// Names in a post, its author's with their banner and photo: the card opens
// over the line you point at, and from one name to the next at once.
export const InAPost = {
  render: () =>
    demo(`<article class="post"><p class="muted">${member(MEMBERS.p0unter)} · Admin · 2h ago</p>
<p>Offline edits on iOS 18 come back after a reconnect now. Thanks to ${member(MEMBERS.maya, '@mayachen')} for the repro, to ${member(MEMBERS.leo)} for testing the fix on a train's flaky Wi-Fi, and to ${member(MEMBERS.priya)} and ${member(MEMBERS.sam)} for reviewing the patch over the weekend.</p></article>`),
};

// Down a list of threads: once a card is open, the next name opens its own.
export const ThreadList = {
  render: () =>
    demo(`<div class="rows">${[
      ['LowerSync drops changes made offline on iOS 18', MEMBERS.maya, '2h'],
      ['Theming lw components with your own design tokens', MEMBERS.leo, '5h'],
      ['Passkeys alongside two-factor in LowerAuth?', MEMBERS.priya, '1d'],
      ['lw 0.3.0 is out: the forum navbar and steadier reconnects', MEMBERS.sam, '6d'],
      ['A kanban board on LowerSync, end to end', MEMBERS.ana, '1w'],
    ]
      .map(([title, user, time]) => `<div class="row"><p class="title">${title}</p><p class="muted">by ${member(user)} · ${time}</p></div>`)
      .join('')}</div>`),
};

// At the top of the window there is no room above the name, so the card
// opens under it.
export const NearTheTop = {
  parameters: { layout: 'padded' },
  render: () => demo(`<p class="muted">Started by ${member(MEMBERS.p0unter)} in Announcements · 6d ago</p>`, '0'),
};

// Open from the start, as `open` sets it.
export const Open = {
  args: { open: true },
};
