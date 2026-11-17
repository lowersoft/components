import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// The member the forum navbar's Signed In story shows, and the members a
// mention offers.
const USER = { name: 'p0unter', handle: 'p0unter', href: '/u/p0unter', avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4', role: 'Admin', status: 'online' };
const MEMBERS = [
  USER,
  { name: 'Maya Chen', handle: 'mayachen', href: '/u/mayachen', role: 'Moderator' },
  { name: 'Sam Okafor', handle: 'samokafor', href: '/u/samokafor', role: 'Staff' },
  { name: 'Leo Martins', handle: 'leom', href: '/u/leom' },
  { name: 'Priya Raman', handle: 'priya', href: '/u/priya' },
  { name: 'Ana Ruiz', handle: 'anaruiz', href: '/u/anaruiz' },
  { name: 'sqlsorcerer', handle: 'sqlsorcerer', href: '/u/sqlsorcerer' },
];

const demo = (markup) => {
  const template = document.createElement('template');
  template.innerHTML = `<div style="width: min(44rem, calc(100vw - 2rem))">${markup}</div>`;
  return template.content.firstElementChild;
};

export default {
  title: 'Forum/Threads/Post Composer',
  component: 'lw-post-composer',
  render: (args) => demo(`<lw-post-composer ${attributes(args)}></lw-post-composer>`),
  args: {
    user: JSON.stringify(USER),
    members: JSON.stringify(MEMBERS),
    placeholder: 'Write your reply…',
    'submit-label': 'Post reply',
    'max-length': 10000,
    'max-files': 6,
    disabled: false,
  },
};

// Write in markdown: the tools and their shortcuts set it, Enter carries a
// list on, @ offers members, and Preview shows the post. Drop, paste or
// attach files; Post or ⌘/Ctrl and Enter sends it.
export const Default = {};

// Markdown already written: switch to Preview to read it.
export const Written = {
  args: {
    value: "Raising the batch fixed it here, thanks @samokafor!\n\n**What I ran**\n\n```shell\nlowersync recover scan --queue ./offline.db --batch 150\n```\n\n- [x] Backed up the queue first\n- [x] Replayed 312 changes\n- [ ] Try it on Android\n\n> The scan only reads; nothing is sent until you approve the replay.\n\nMore in the [recovery guide](https://lowersoft.com/docs/recovery).",
  },
};

// Near the longest post: the count shows how much is left, and past it the
// field turns red and Post waits.
export const NearTheLimit = {
  args: { 'max-length': 120, value: 'Worked here with --batch 150 on an iPhone 12. 312 changes replayed in under a minute, and the queue file is empty now.' },
};

// Kept in this browser as you write, under `draft-key`, until it is posted.
export const Draft = {
  args: { 'draft-key': 'storybook-thread-42' },
};
