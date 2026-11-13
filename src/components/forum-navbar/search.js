import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowDown, arrowUp, cornerDownLeft, messageCircle, search, x } from '../../core/lucide.js';
import { hueOf, initialsOf } from '../../core/people.js';

// The forum search: a query of words, `@member` and `#category`, matched
// against the threads, with the markup of the panel under the search field.

/** Demo threads: `{ title, href, author, category, replies?, time? }`. */
export const DEMO_THREADS = [
  { title: 'LowerSync drops changes made offline on iOS 18', href: '/t/lowersync-offline-ios', author: 'Maya Chen', category: 'LowerSync', replies: 14, time: '2h' },
  { title: 'Theming lw components with your own design tokens', href: '/t/theming-with-tokens', author: 'Leo Martins', category: 'Components', replies: 9, time: '5h' },
  { title: 'Passkeys alongside two-factor in LowerAuth?', href: '/t/passkeys-and-2fa', author: 'Priya Raman', category: 'LowerAuth', replies: 21, time: '1d' },
  { title: 'Migrating from Postgres to LowerDB: a write-up', href: '/t/postgres-to-lowerdb', author: 'Sam Okafor', category: 'LowerDB', replies: 32, time: '1d' },
  { title: 'Show us what you built with the video player', href: '/t/video-player-showcase', author: 'Ana Ruiz', category: 'Showcase', replies: 47, time: '2d' },
  { title: 'LowerCloud deploys stuck at "Provisioning" in eu-west', href: '/t/eu-west-provisioning', author: 'Theo Park', category: 'LowerCloud', replies: 6, time: '2d' },
  { title: 'Keeping the floating navbar menus open on touch', href: '/t/navbar-menus-on-touch', author: 'Maya Chen', category: 'Components', replies: 4, time: '3d' },
  { title: 'The query planner picks a full scan on LowerDB 2.3', href: '/t/planner-full-scan', author: 'Leo Martins', category: 'LowerDB', replies: 18, time: '4d' },
  { title: 'Sync conflicts: last write wins, or merge?', href: '/t/sync-conflicts', author: 'Priya Raman', category: 'LowerSync', replies: 27, time: '5d' },
  { title: 'lw 0.3.0 is out: the forum navbar and steadier reconnects', href: '/t/lw-0-3-0', author: 'Sam Okafor', category: 'Announcements', replies: 12, time: '6d' },
  { title: 'Session timeouts after a LowerAuth key rotation', href: '/t/key-rotation-timeouts', author: 'Theo Park', category: 'LowerAuth', replies: 8, time: '1w' },
  { title: 'A kanban board on LowerSync, end to end', href: '/t/kanban-on-lowersync', author: 'Ana Ruiz', category: 'Showcase', replies: 15, time: '1w' },
];

// Lowercase without accents, so "turk" finds "Türkiye".
const fold = (text) => String(text).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();

/** A member's or category's handle: "Maya Chen" is `maya.chen`, "LowerDB" `lowerdb`. */
const handleOf = (name, joiner) => fold(name).trim().replace(/\s+/g, joiner);
export const memberHandle = (name) => handleOf(name, '.');
export const categoryHandle = (name) => handleOf(name, '-');

/** The members and categories the threads mention, each with its thread count, busiest first. */
export const facetsOf = (threads) => {
  const count = (key) => {
    const counts = new Map();
    for (const thread of threads) if (thread[key]) counts.set(thread[key], (counts.get(thread[key]) ?? 0) + 1);
    return [...counts].map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  };
  return { members: count('author'), categories: count('category') };
};

/**
 * Splits a query into its words and its filters: `@maya` for a member,
 * `#lowerdb` for a category. Of each kind of filter the last one counts.
 */
export const parseQuery = (query) => {
  const parsed = { words: [], member: '', category: '' };
  for (const part of String(query).trim().split(/\s+/).filter(Boolean)) {
    if (part.startsWith('@')) parsed.member = fold(part.slice(1));
    else if (part.startsWith('#')) parsed.category = fold(part.slice(1));
    else parsed.words.push(fold(part));
  }
  return parsed;
};

// A filter's text matches a name by its handle or by a word of it.
const matchesName = (name, text, handle) => !text || handle(name).startsWith(text) || fold(name).split(/\s+/).some((word) => word.startsWith(text));

/** The threads a parsed query finds: every word in the title, by the member, in the category. */
export const findThreads = (threads, { words, member, category }) =>
  threads.filter(
    (thread) =>
      matchesName(thread.author ?? '', member, memberHandle) &&
      matchesName(thread.category ?? '', category, categoryHandle) &&
      words.every((word) => fold(thread.title).includes(word)),
  );

/** The `@` or `#` word the caret is in, with where it starts, or null. */
export const tokenAt = (value, caret) => {
  const match = value.slice(0, caret).match(/(?:^|\s)([@#])(\S*)$/);
  if (!match) return null;
  const start = caret - match[1].length - match[2].length;
  const end = start + (value.slice(start).match(/^\S*/)?.[0].length ?? 0);
  return { kind: match[1], text: fold(match[2]), start, end };
};

// The title with the query's words marked, matched without case or accents.
const markWords = (title, words) => {
  const chars = [...title];
  // Each folded character points back at the character it came from.
  const owners = [];
  let folded = '';
  chars.forEach((char, i) => {
    const part = fold(char);
    folded += part;
    for (let k = 0; k < part.length; k++) owners.push(i);
  });
  const marked = new Array(chars.length).fill(false);
  for (const word of words.filter(Boolean)) {
    for (let at = folded.indexOf(word); at !== -1; at = folded.indexOf(word, at + word.length)) {
      for (let k = at; k < at + word.length; k++) marked[owners[k]] = true;
    }
  }
  let html = '';
  let open = false;
  chars.forEach((char, i) => {
    if (marked[i] !== open) {
      html += marked[i] ? '<mark>' : '</mark>';
      open = marked[i];
    }
    html += escapeHtml(char);
  });
  return open ? `${html}</mark>` : html;
};

const avatar = (name) => `<span class="avatar" style="--_hue: ${hueOf(name)}" aria-hidden="true">${escapeHtml(initialsOf(name))}</span>`;
const tag = (name) => `<span class="tag" style="--_hue: ${hueOf(name)}">${escapeHtml(name)}</span>`;
// A titled group of options; a hidden title still names it for screen readers.
const group = (id, title, options, { hideTitle = false } = {}) =>
  `<div class="group" role="group" aria-labelledby="${id}"><div class="group-title${hideTitle ? ' visually-hidden' : ''}" id="${id}" role="presentation">${title}</div>${options}</div>`;

/** The guide shown before anything is typed: how to search, and the categories to search in. */
export const guideMarkup = (threads) => {
  const { members, categories } = facetsOf(threads);
  const member = members[0] ? memberHandle(members[0].name) : 'name';
  const category = categories[0] ? categoryHandle(categories[0].name) : 'category';
  const tip = (insert, sign, example, text) =>
    `<div class="option tip" role="option" data-insert="${escapeHtml(insert)}"><span class="tip-sign" aria-hidden="true">${sign}</span><span class="tip-text"><span class="tip-example">${escapeHtml(example)}</span><span class="tip-note">${text}</span></span></div>`;
  const tips = [
    tip('@', '@', `@${member}`, 'Threads a member started'),
    tip('#', '#', `#${category}`, 'Threads in a category'),
    tip('', 'Aa', 'full scan', 'Words in the title, in any order'),
    tip(`@${member} #${category} `, strokeIcon(search, 14), `@${member} #${category}`, 'Put them together to narrow it down'),
  ].join('');
  const chips = categories
    .map(({ name }) => `<div class="option chip" role="option" data-insert="#${escapeHtml(categoryHandle(name))} "><span class="dot" style="--_hue: ${hueOf(name)}" aria-hidden="true"></span>${escapeHtml(name)}</div>`)
    .join('');
  return group('g-tips', 'Search tips', tips) + group('g-categories', 'Categories', `<div class="chips">${chips}</div>`);
};

/** The members or categories a `@` or `#` word could finish as. */
export const suggestionsMarkup = (threads, token) => {
  const { members, categories } = facetsOf(threads);
  if (token.kind === '@') {
    const found = members.filter(({ name }) => matchesName(name, token.text, memberHandle));
    return {
      count: found.length,
      html: group('g-members', 'Members', found.map(({ name, total }) => `<div class="option suggestion" role="option" data-insert="@${escapeHtml(memberHandle(name))} ">${avatar(name)}<span class="suggestion-name">${escapeHtml(name)}</span><span class="suggestion-handle">@${escapeHtml(memberHandle(name))}</span><span class="suggestion-count">${total} ${total === 1 ? 'thread' : 'threads'}</span></div>`).join('')),
    };
  }
  const found = categories.filter(({ name }) => matchesName(name, token.text, categoryHandle));
  return {
    count: found.length,
    html: group('g-categories', 'Categories', found.map(({ name, total }) => `<div class="option suggestion" role="option" data-insert="#${escapeHtml(categoryHandle(name))} "><span class="dot large" style="--_hue: ${hueOf(name)}" aria-hidden="true"></span><span class="suggestion-name">${escapeHtml(name)}</span><span class="suggestion-handle">#${escapeHtml(categoryHandle(name))}</span><span class="suggestion-count">${total} ${total === 1 ? 'thread' : 'threads'}</span></div>`).join('')),
  };
};

/**
 * The threads found, and above them their count with the filters in use,
 * each a button that takes its filter out of the query.
 */
export const resultsMarkup = (threads, parsed) => {
  const found = findThreads(threads, parsed);
  const { members, categories } = facetsOf(threads);
  const member = parsed.member && members.find(({ name }) => matchesName(name, parsed.member, memberHandle));
  const category = parsed.category && categories.find(({ name }) => matchesName(name, parsed.category, categoryHandle));
  const filter = (kind, label, name) => `<button class="filter" type="button" tabindex="-1" data-remove="${kind}">${label} <strong>${escapeHtml(name)}</strong>${strokeIcon(x, 12)}<span class="visually-hidden">, remove this filter</span></button>`;
  const filters = [
    parsed.member ? filter('@', 'by', member?.name ?? `@${parsed.member}`) : '',
    parsed.category ? filter('#', 'in', category?.name ?? `#${parsed.category}`) : '',
  ].join('');
  // The count heads the threads; with none found and no filter to take
  // out, the empty state says it alone.
  const head = found.length || filters ? `<span class="head-count">${found.length} ${found.length === 1 ? 'thread' : 'threads'}</span>${filters}` : '';
  const rows = found
    .map(
      (thread, i) =>
        `<a class="option hit" role="option" id="hit-${i}" href="${escapeHtml(thread.href ?? '#')}">${avatar(thread.author ?? '')}<span class="hit-text"><span class="hit-title">${markWords(thread.title, parsed.words)}</span><span class="hit-meta">${tag(thread.category ?? '')}<span>${escapeHtml(thread.author ?? '')}</span>${thread.replies == null ? '' : `<span class="hit-replies">${strokeIcon(messageCircle, 12)}${escapeHtml(thread.replies)}</span>`}${thread.time ? `<span>${escapeHtml(thread.time)}</span>` : ''}</span></span><span class="enter" aria-hidden="true">${strokeIcon(cornerDownLeft, 14)}</span></a>`,
    )
    .join('');
  return { count: found.length, head, html: found.length ? group('g-threads', 'Threads', rows, { hideTitle: true }) : '' };
};

/** What shows when nothing matches. */
export const noneMarkup = (title, text) =>
  `<span class="none-icon" aria-hidden="true">${strokeIcon(search, 18)}</span><p class="none-title">${escapeHtml(title)}</p><p class="none-text">${escapeHtml(text)}</p>`;

/** The keys, along the foot of the panel. */
export const FOOT_MARKUP = `<span class="hint"><kbd>${strokeIcon(arrowUp, 12)}</kbd><kbd>${strokeIcon(arrowDown, 12)}</kbd> to move</span><span class="hint"><kbd>${strokeIcon(cornerDownLeft, 12)}</kbd> to choose</span><span class="hint"><kbd>esc</kbd> to close</span>`;
