import { escapeHtml } from '../../core/dom.js';
import { avatarMarkup, countMarkup, countOf, DEMO_MEMBERS as MEMBERS, memberMarkup, memberOf, minutesAgo as ago, tickTimes, timeMarkup } from '../../core/forum.js';
import { strokeIcon } from '../../core/icons.js';
import {
  award,
  bookOpen,
  bug,
  chevronDown,
  circleHelp,
  codeXml,
  database,
  fileText,
  globe,
  history,
  inbox,
  keyRound,
  layers,
  lightbulb,
  lock,
  megaphone,
  messageCircle,
  messagesSquare,
  palette,
  repeat,
  rocket,
  settings,
  squareKanban,
  tag,
  trendingUp,
  users,
} from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf } from '../../core/people.js';
import '../user-hover-card/index.js';
import styles from './forum-categories.scss?inline';

// The icons a category can name, by their Lucide names.
const ICONS = {
  award,
  'book-open': bookOpen,
  bug,
  'circle-help': circleHelp,
  'code-xml': codeXml,
  database,
  'file-text': fileText,
  globe,
  history,
  inbox,
  'key-round': keyRound,
  layers,
  lightbulb,
  lock,
  megaphone,
  'message-circle': messageCircle,
  'messages-square': messagesSquare,
  palette,
  repeat,
  rocket,
  settings,
  'square-kanban': squareKanban,
  tag,
  'trending-up': trendingUp,
  users,
};

// A category with more sub-forums than this shows the first few and a
// button for the rest.
const SUBFORUMS = 4;

// The forum navbar's demo threads, filed under the forum sidebar's
// categories; the products take the sidebar's squares in their colours.
const DEMO_GROUPS = [
  {
    id: 'lowersoft',
    title: 'Lowersoft',
    description: 'News from the team, and where to start.',
    categories: [
      {
        title: 'Announcements',
        href: '/c/announcements',
        icon: 'megaphone',
        description: 'Releases, events and changes to the forum.',
        unread: true,
        threads: 48,
        messages: 1312,
        latest: { title: 'lw 0.3.0 is out: the forum navbar and steadier reconnects', href: '/t/lw-0-3-0', time: ago(38), author: MEMBERS.sam },
      },
      {
        title: 'Changelog',
        href: '/c/changelog',
        icon: 'history',
        description: 'Every release of every product, as it ships.',
        threads: 214,
        messages: 860,
        latest: { title: 'LowerDB 2.3.1', href: '/t/lowerdb-2-3-1', time: ago(60 * 26), author: MEMBERS.p0unter },
      },
      {
        title: 'Getting Started',
        href: '/c/getting-started',
        icon: 'book-open',
        description: 'New here? Introduce yourself and find your way around.',
        threads: 1290,
        messages: 6480,
        latest: { title: 'Hello from Valencia, building small apps on lw', href: '/t/hello-from-valencia', time: ago(60 * 24 * 3 + 200), author: MEMBERS.ana },
      },
    ],
  },
  {
    id: 'products',
    title: 'Products',
    description: 'Questions, answers and know-how, product by product.',
    categories: [
      {
        title: 'LowerSync',
        href: '/c/lowersync',
        description: 'Offline-first sync: conflicts, background tasks and reconnects.',
        unread: true,
        threads: 57214,
        messages: 142700,
        subforums: [
          { title: 'iOS', href: '/c/lowersync/ios', unread: true },
          { title: 'Android', href: '/c/lowersync/android' },
          { title: 'Web', href: '/c/lowersync/web' },
          { title: 'React Native', href: '/c/lowersync/react-native' },
          { title: 'Flutter', href: '/c/lowersync/flutter' },
          { title: 'Self-hosting', href: '/c/lowersync/self-hosting' },
        ],
        latest: { title: 'LowerSync drops changes made offline on iOS 18', href: '/t/lowersync-offline-ios', time: ago(12), author: MEMBERS.maya },
      },
      {
        title: 'LowerDB',
        href: '/c/lowerdb',
        description: 'Schemas, migrations and the query planner.',
        unread: true,
        threads: 18420,
        messages: 96300,
        subforums: [
          { title: 'Migrations', href: '/c/lowerdb/migrations', unread: true },
          { title: 'Performance', href: '/c/lowerdb/performance' },
        ],
        latest: { title: 'The query planner picks a full scan on LowerDB 2.3', href: '/t/planner-full-scan', time: ago(60 * 4 + 10), author: MEMBERS.leo },
      },
      {
        title: 'LowerCloud',
        href: '/c/lowercloud',
        description: 'Deploys, regions, domains and billing.',
        threads: 9310,
        messages: 41800,
        latest: { title: 'LowerCloud deploys stuck at "Provisioning" in eu-west', href: '/t/eu-west-provisioning', time: ago(60 * 24 * 2 + 30), author: MEMBERS.theo },
      },
      {
        title: 'LowerAuth',
        href: '/c/lowerauth',
        description: 'Sign-in, passkeys, sessions and keys.',
        threads: 4402,
        messages: 13300,
        latest: { title: 'Passkeys alongside two-factor in LowerAuth?', href: '/t/passkeys-and-2fa', time: ago(60 * 20), author: MEMBERS.priya },
      },
      {
        title: 'Components',
        href: '/c/components',
        description: 'The lw components: theming, accessibility and requests.',
        threads: 7012,
        messages: 21900,
        latest: { title: 'Theming lw components with your own design tokens', href: '/t/theming-with-tokens', time: ago(60 * 5), author: MEMBERS.leo },
      },
    ],
  },
  {
    id: 'community',
    title: 'Community',
    categories: [
      {
        title: 'Showcase',
        href: '/c/showcase',
        icon: 'rocket',
        description: 'Show us what you built.',
        unread: true,
        threads: 1204,
        messages: 4410,
        latest: { title: 'A kanban board on LowerSync, end to end', href: '/t/kanban-on-lowersync', time: ago(60 * 9), author: MEMBERS.ana },
      },
      {
        title: 'Feedback',
        href: '/c/feedback',
        icon: 'lightbulb',
        description: 'Ideas for the products and for this forum.',
        threads: 633,
        messages: 2014,
        latest: { title: 'Dark mode for the forum emails', href: '/t/dark-mode-emails', time: ago(60 * 24 * 12), author: MEMBERS.priya },
      },
      {
        title: 'Bug Reports',
        href: '/c/bug-reports',
        icon: 'bug',
        description: 'Something broken? Tell us how to make it happen again.',
        threads: 0,
        messages: 0,
      },
    ],
  },
  {
    id: 'staff',
    title: 'Staff',
    description: 'Only the team can read these.',
    categories: [
      { title: 'Moderators', href: '/c/moderators', private: true, description: 'Reports, appeals and the guidelines.' },
      { title: 'Release Planning', href: '/c/release-planning', private: true },
    ],
  },
];

const statMarkup = (value, label) => `<div class="stat"><dt>${label}</dt><dd>${countMarkup(value)}</dd></div>`;

// The thread posted in last, or why there is none to show.
const latestMarkup = (category) => {
  if (category.private) return `<div class="latest" data-none><span class="none">${strokeIcon(lock, 14)}Private</span></div>`;
  const latest = category.latest;
  // Without one, an empty category says so; one with threads leaves it blank.
  if (!latest?.title) return countOf(category.threads) > 0 ? '' : '<div class="latest" data-none><span class="none">No threads yet</span></div>';
  const author = memberOf(latest.author);
  const title = latest.href ? `<a class="latest-title" href="${escapeHtml(latest.href)}">${escapeHtml(latest.title)}</a>` : `<span class="latest-title">${escapeHtml(latest.title)}</span>`;
  const meta = [timeMarkup(latest.time), author ? memberMarkup(author, latest.author) : ''].filter(Boolean).join('<span class="sep" aria-hidden="true">·</span>');
  return `<div class="latest"><span class="visually-hidden">Latest:</span>${author ? avatarMarkup(author) : ''}<div class="latest-text">${title}${meta ? `<p class="latest-meta">${meta}</p>` : ''}</div></div>`;
};

const subforumMarkup = (sub, index, hidden) =>
  `<li${hidden ? ' hidden' : ''}><a class="sub" href="${escapeHtml(sub.href ?? '#')}" style="--_hue: ${hueOf(String(sub.title ?? ''))}"${sub.unread ? ' data-unread' : ''}>${escapeHtml(sub.title ?? '')}${sub.unread ? '<span class="visually-hidden"> (unread)</span>' : ''}</a></li>`;

const subforumsMarkup = (subforums, id) => {
  if (!subforums.length) return '';
  const shown = subforums.length > SUBFORUMS ? SUBFORUMS - 1 : subforums.length;
  const more = subforums.length - shown;
  const button = more ? `<li class="more-item"><button class="more" type="button" aria-controls="${id}">+${more} more<span class="visually-hidden"> sub-forums</span></button></li>` : '';
  return `<ul class="subs" id="${id}" role="list" aria-label="Sub-forums">${subforums.map((sub, index) => subforumMarkup(sub, index, index >= shown)).join('')}${button}</ul>`;
};

/**
 * A forum's categories, in titled groups such as the forum's own news, its
 * products and its community, each in a frame with its title, how many
 * categories it holds and what they are for over a card of rows. Each
 * category stands on a row: its icon, or a square in its colour, its name
 * and what it is for, the sub-forums under it, how many threads and
 * messages it holds, and the thread posted in last, with when and by whom.
 * Rest the pointer on that member's name and their card opens over it. A
 * category with threads you have not read has its icon inverted and a
 * bolder name; a private one shows a lock where its latest thread would
 * be, and an empty one says it has no threads yet.
 *
 * The whole row leads to the category, its other links to their own pages.
 * A group's heading folds its categories away and back, and a category with
 * more sub-forums than fit shows the first few and a button for the rest.
 * The rows fit the room they have, not the window: the counts and the
 * latest thread get columns of their own, labelled once in the group's
 * head, where there is space, and stack under the name where there is not. The times count on as the page stays
 * open.
 *
 * Groups are `{ id?, title, description?, collapsed?, categories }`, and
 * categories `{ title, href, description?, icon?, color?, unread?,
 * private?, threads?, messages?, subforums?, latest? }`. Sub-forums are
 * `{ title, href, unread? }`, and `latest` is `{ title, href, time, author }`:
 * `time` an ISO date and time, or text to show as it is, and `author` a
 * member as `<lw-user-hover-card>` takes one, or a name alone, which stays
 * plain text. An `icon` is a Lucide icon's name: award, book-open, bug,
 * circle-help, code-xml, database, file-text, globe, history, inbox,
 * key-round, layers, lightbulb, lock, megaphone, message-circle,
 * messages-square, palette, repeat, rocket, settings, square-kanban, tag,
 * trending-up or users. Without one a category gets a square in its own
 * colour, as on the forum sidebar: `color`, or the one the forum sidebar and
 * search give a category of that name; a private one gets a lock. Sub-forums
 * take a dot in their colours.
 *
 * @attr {Array<object>} groups - The groups of categories, in order (JSON)
 * @attr {number} level - Heading level of the groups' titles, 1 to 5; the categories' names are a level below
 * @fires lw-toggle - A group was folded away or back; `detail: { id, open }`, `id` the group's own or its index
 * @csspart group - A group's frame
 * @csspart head - A group's heading row
 * @csspart row - A category's row
 */
export class LwForumCategories extends LwElement {
  static styles = styles;
  static props = {
    groups: { type: Object, default: DEMO_GROUPS },
    level: { type: Number, default: 2 },
  };

  // Groups folded or opened from their headings, by id, kept as `groups`
  // changes.
  #folded = new Map();

  render() {
    return '<div class="groups"></div>';
  }

  connected() {
    const groups = this.query('.groups');
    groups.addEventListener('click', (event) => {
      const toggle = event.target.closest('.toggle');
      if (toggle) this.#fold(toggle);
      const more = event.target.closest('.more');
      if (more) this.#showSubforums(more);
    }, { signal: this.signal });

    tickTimes(this.shadowRoot, this.signal);
  }

  updated(changed) {
    if (changed.has('groups') || changed.has('level')) this.#build();
  }

  get #groups() {
    return Array.isArray(this.groups) ? this.groups.filter((group) => group && typeof group === 'object') : [];
  }

  get #level() {
    const level = Math.round(Number(this.level));
    return level >= 1 && level <= 5 ? level : 2;
  }

  #build() {
    const level = this.#level;
    this.query('.groups').innerHTML = this.#groups.map((group, index) => this.#groupMarkup(group, index, level)).join('');
  }

  #groupMarkup(group, index, level) {
    const key = String(group.id ?? index);
    const open = this.#folded.has(key) ? this.#folded.get(key) : !group.collapsed;
    const id = `group-${index}`;
    const categories = Array.isArray(group.categories) ? group.categories.filter((category) => category && typeof category === 'object') : [];
    const description = group.description ? `<p class="group-description" id="${id}-description">${escapeHtml(group.description)}</p>` : '';
    const rows = categories.length
      ? `<ul class="rows" role="list">${categories.map((category, at) => this.#rowMarkup(category, `${id}-${at}`, level + 1)).join('')}</ul>`
      : '<p class="empty">No categories here yet.</p>';
    const total = `<span class="count">${categories.length}<span class="visually-hidden"> ${categories.length === 1 ? 'category' : 'categories'}</span></span>`;
    return `<section class="group" part="group" aria-labelledby="${id}"${open ? '' : ' data-folded'}${categories.length ? '' : ' data-empty'} data-key="${escapeHtml(key)}">
<div class="head" part="head"><span class="chevron" aria-hidden="true">${strokeIcon(chevronDown, 16)}</span><h${level} class="group-heading"><button class="toggle" id="${id}" type="button" aria-expanded="${open}" aria-controls="${id}-rows"${description ? ` aria-describedby="${id}-description"` : ''}>${escapeHtml(group.title ?? '')}</button>${total}</h${level}>${description}<span class="columns" aria-hidden="true"><span>Threads</span><span>Messages</span></span><span class="column-latest" aria-hidden="true">Latest</span></div>
<div class="fold" id="${id}-rows"${open ? ' data-open' : ' inert'}><div class="fold-clip"><div class="card">${rows}</div></div></div>
</section>`;
  }

  #rowMarkup(category, id, level) {
    const icon = ICONS[category.icon] ?? (category.private ? lock : null);
    const tint = category.color ? `background: ${category.color}` : `--_hue: ${hueOf(String(category.title ?? ''))}`;
    const mark = icon ? strokeIcon(icon, 18) : `<span class="swatch" style="${escapeHtml(tint)}"></span>`;
    const threads = countOf(category.threads);
    const messages = countOf(category.messages);
    const stats = !category.private && (threads !== null || messages !== null)
      ? `<dl class="stats">${threads !== null ? statMarkup(threads, 'Threads') : ''}${messages !== null ? statMarkup(messages, 'Messages') : ''}</dl>`
      : '';
    const unread = category.unread ? '<span class="visually-hidden"> (unread)</span>' : '';
    return `<li class="row" part="row"${category.unread ? ' data-unread' : ''}${category.private ? ' data-private' : ''}>
<span class="tile" aria-hidden="true">${mark}</span>
<div class="main"><h${level} class="name"><a class="link" href="${escapeHtml(category.href ?? '#')}">${escapeHtml(category.title ?? '')}${unread}</a></h${level}>${category.description ? `<p class="description">${escapeHtml(category.description)}</p>` : ''}${subforumsMarkup(Array.isArray(category.subforums) ? category.subforums : [], `${id}-subs`)}</div>
${stats}${latestMarkup(category)}
</li>`;
  }

  #fold(toggle) {
    const open = toggle.ariaExpanded !== 'true';
    const group = toggle.closest('.group');
    const fold = this.query(`#${toggle.getAttribute('aria-controls')}`);
    toggle.ariaExpanded = String(open);
    group.toggleAttribute('data-folded', !open);
    fold.toggleAttribute('data-open', open);
    fold.inert = !open;
    this.#folded.set(group.dataset.key, open);
    const index = [...this.query('.groups').children].indexOf(group);
    this.emit('toggle', { id: this.#groups[index]?.id ?? index, open });
  }

  // The rest of a category's sub-forums, in place of the button, which hands
  // the focus to the first of them.
  #showSubforums(button) {
    const list = this.query(`#${button.getAttribute('aria-controls')}`);
    const first = list.querySelector('li[hidden]');
    for (const item of list.querySelectorAll('li[hidden]')) item.hidden = false;
    button.closest('li').remove();
    first?.querySelector('a')?.focus();
  }
}
