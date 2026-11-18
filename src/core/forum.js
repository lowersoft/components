import { escapeHtml } from './dom.js';
import { strokeIcon } from './icons.js';
import { chevronLeft, chevronRight } from './lucide.js';
import { hueOf, initialsOf } from './people.js';

// What the forum's components share: counts and times the way a forum
// writes them, members by their avatars and their names, each name with
// the member's card over it (the component imports `<lw-user-hover-card>`),
// and pages to pick from.

export const MINUTE = 60_000;
const DAY = 86_400_000;

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat('en-US');
const relative = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto', style: 'narrow' });
const dayMonth = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const dayMonthYear = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fullDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' });

/** A finite number, or null. */
export const countOf = (value) => (Number.isFinite(value) ? value : null);

/** A whole number with its thousands marked: "9,317". */
export const formatWhole = (value) => whole.format(value);

/** A count as a forum shows it, "57.2K", with the whole number to hover. */
export const countMarkup = (value) => `<data value="${value}" title="${whole.format(value)}">${compact.format(value)}</data>`;

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * How long ago a time was, the way a forum says it: "Just now", "12m ago",
 * "3h ago", "Yesterday", "4d ago", then the day itself.
 */
export const timeAgo = (date, now = new Date()) => {
  const minutes = Math.floor((now - date) / MINUTE);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return relative.format(-minutes, 'minute');
  if (minutes < 24 * 60) return relative.format(-Math.floor(minutes / 60), 'hour');
  const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY);
  if (days < 7) return capitalize(relative.format(-days, 'day'));
  return (date.getFullYear() === now.getFullYear() ? dayMonth : dayMonthYear).format(date);
};

/**
 * A date and time as a `<time class="time">` saying how long ago it was,
 * the full date to hover, or text to show as it is. With `href` it links
 * there, as a post's time leads to the post.
 */
export const timeMarkup = (value, href = '') => {
  const date = new Date(value);
  const valid = value != null && value !== '' && !Number.isNaN(date.getTime());
  const time = valid ? `<time class="time" datetime="${date.toISOString()}" title="${escapeHtml(fullDate.format(date))}">${timeAgo(date)}</time>` : value ? `<span class="time">${escapeHtml(value)}</span>` : '';
  return time && href ? `<a class="time-link" href="${escapeHtml(href)}">${time}</a>` : time;
};

/** Counts the times in `root` on, a minute at a time, until `signal` aborts. */
export const tickTimes = (root, signal) => {
  const clock = setInterval(() => {
    const now = new Date();
    for (const time of root.querySelectorAll('time.time')) time.textContent = timeAgo(new Date(time.dateTime), now);
  }, MINUTE);
  signal.addEventListener('abort', () => clearInterval(clock));
};

/** A member as `<lw-user-hover-card>` takes one, from that or a name alone; null without a name. */
export const memberOf = (member) => {
  const value = typeof member === 'string' ? { name: member } : member && typeof member === 'object' ? { ...member, name: String(member.name ?? '') } : null;
  return value?.name ? value : null;
};

/** Their photo, or their initials on their tint, in `.avatar`. */
export const avatarMarkup = (member) => {
  const photo = member.avatar ? `<img class="photo" src="${escapeHtml(member.avatar)}" alt="" decoding="async" loading="lazy">` : escapeHtml(initialsOf(member.name));
  return `<span class="avatar" style="--_hue: ${hueOf(member.name)}" aria-hidden="true">${photo}</span>`;
};

/**
 * Their name in `.member`, linked to their profile, with their card over
 * it; a name given alone stays plain text.
 */
export const memberMarkup = (member, given = member) => {
  if (typeof given === 'string') return `<span class="member">${escapeHtml(member.name)}</span>`;
  const role = member.role ? ` data-role="${escapeHtml(member.role)}"` : '';
  const name = member.href ? `<a class="member" href="${escapeHtml(member.href)}"${role}>${escapeHtml(member.name)}</a>` : `<span class="member" tabindex="0"${role}>${escapeHtml(member.name)}</span>`;
  return `<lw-user-hover-card user="${escapeHtml(JSON.stringify(member))}">${name}</lw-user-hover-card>`;
};

/**
 * The pages a pager offers: the first and the last, the page you are on
 * and those either side of it, with `'gap'` where pages are left out.
 */
export const pageList = (page, pages) => {
  const shown = [...new Set([1, page - 1, page, page + 1, pages])].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  return shown.flatMap((n, i) => (i && n - shown[i - 1] > 1 ? ['gap', n] : [n]));
};

/**
 * Pages to pick from, as `.pages` (the `forum-pager` mixin styles it):
 * Previous, the pages with gaps where some are left out, the page you are
 * on marked, Next, and "Page 2 of 4". Each leads to `href` with `{page}`
 * for its number, or is a button without one; each carries `data-page`.
 * `label` names them, as "Pages of posts".
 */
export const pagerMarkup = (page, pages, { href = '', label = 'Pages' } = {}) => {
  const control = (n, text, className, current = false) => {
    const attributes = `class="${className}" data-page="${n}"${current ? ' aria-current="page"' : ''}`;
    return href ? `<a ${attributes} href="${escapeHtml(href.replace('{page}', String(n)))}">${text}</a>` : `<button type="button" ${attributes}>${text}</button>`;
  };
  const items = pageList(page, pages).map((n) => (n === 'gap' ? '<li class="page-gap" aria-hidden="true">…</li>' : `<li>${control(n, n, 'page-link', n === page)}</li>`));
  const prev = page > 1 ? control(page - 1, `${strokeIcon(chevronLeft, 14)}<span class="step-label">Previous</span>`, 'page-step') : '';
  const next = page < pages ? control(page + 1, `<span class="step-label">Next</span>${strokeIcon(chevronRight, 14)}`, 'page-step') : '';
  return `<nav class="pages" aria-label="${escapeHtml(label)}">${prev}<ol class="page-list" role="list">${items.join('')}</ol>${next}<span class="page-of">Page ${page} of ${pages}</span></nav>`;
};

/** A time so many minutes before the page opened, for the demos. */
export const minutesAgo = (minutes) => new Date(Date.now() - minutes * MINUTE).toISOString();

/** The members the forum's demos name, as the forum navbar's threads have them. */
export const DEMO_MEMBERS = {
  p0unter: { name: 'p0unter', handle: 'p0unter', href: '/u/p0unter', avatar: 'https://avatars.githubusercontent.com/u/138019503?v=4', banner: 'https://raw.githubusercontent.com/lowersoft/.github/refs/heads/main/bg_1.jpg', role: 'Admin', status: 'online', bio: 'Building LowerSoft and the lw components. Bug reports welcome, a repro even more so.', posts: 3412, reactions: 21800, solutions: 412, joined: '2021-06-02' },
  maya: { name: 'Maya Chen', handle: 'mayachen', href: '/u/mayachen', role: 'Moderator', status: 'online', bio: 'Keeps LowerSync honest offline. Ask me about conflict resolution, CRDTs and the iOS background task budget.', posts: 1208, reactions: 8420, solutions: 96, joined: '2022-03-14', location: 'Lisbon' },
  leo: { name: 'Leo Martins', handle: 'leom', href: '/u/leom', role: 'Contributor', status: 'away', bio: 'Design tokens, theming and the odd query planner rabbit hole.', posts: 486, reactions: 2130, solutions: 31, joined: '2023-01-09', location: 'Porto' },
  priya: { name: 'Priya Raman', handle: 'priya', href: '/u/priya', seen: '3h ago', bio: 'Security engineer. Passkeys everywhere, please.', posts: 152, reactions: 940, solutions: 12, joined: '2024-05-21' },
  sam: { name: 'Sam Okafor', handle: 'samokafor', href: '/u/samokafor', role: 'Staff', status: 'busy', bio: 'Releases, changelogs and LowerDB migrations. If a version shipped, I probably wrote its notes.', posts: 2210, reactions: 12400, solutions: 188, joined: '2021-11-30' },
  ana: { name: 'Ana Ruiz', handle: 'anaruiz', href: '/u/anaruiz', seen: '2d ago', bio: 'Shipping small apps on the lw components and writing up how.', posts: 64, reactions: 512, joined: '2025-02-17', location: 'Valencia' },
  theo: { name: 'Theo Park', handle: 'theopark', href: '/u/theopark', seen: '1h ago', bio: 'LowerCloud regions and the occasional provisioning mystery.', posts: 318, reactions: 1460, solutions: 22, joined: '2023-08-02', location: 'Seoul' },
};

// The forum's media for the demos: photos from Unsplash, cropped square for
// the thumbnails, and Blender Studio's Sprite Fight (CC BY 4.0).
const unsplash = (id) => ({ src: `https://images.unsplash.com/photo-${id}?w=480&h=480&fit=crop&auto=format&q=75`, full: `https://images.unsplash.com/photo-${id}?w=1920&auto=format&q=80` });
const SPRITE_FIGHT = 'https://files.vidstack.io/sprite-fight';
const inCategory = (title, slug) => ({ title, href: `/media/categories/${slug}` });
const inAlbum = (title, slug) => ({ title, href: `/media/albums/${slug}` });
const DAYS = 24 * 60;

/** Media as the forum's media components take it, newest first. */
export const DEMO_MEDIA = [
  { title: 'Battlestation, 2026 edition', href: '/media/battlestation-2026', ...unsplash('1534972195531-d756b9bfa9f2'), category: inCategory('Desk setups', 'desk-setups'), author: DEMO_MEMBERS.leo, time: minutesAgo(14), reactions: 18, comments: 6, views: 240, new: true, description: 'Three screens, one keyboard and a cable tray I am irrationally proud of.' },
  { title: 'Sprite Fight', href: '/media/sprite-fight', type: 'video', src: `${SPRITE_FIGHT}/poster.webp`, video: `${SPRITE_FIGHT}/720p.mp4`, duration: 629, category: inCategory('Made with lw', 'made-with-lw'), author: DEMO_MEMBERS.ana, time: minutesAgo(64), reactions: 42, comments: 11, views: 1830, new: true, description: 'Blender Studio’s short film, playing in the lw video player. CC BY 4.0.' },
  { title: 'Moraine Lake wallpaper', href: '/media/moraine-lake', ...unsplash('1493246507139-91e8fad9978e'), category: inCategory('Wallpapers', 'wallpapers'), author: DEMO_MEMBERS.maya, time: minutesAgo(190), reactions: 64, comments: 9, views: 2210, new: true },
  { title: 'Sketching the media gallery', href: '/media/sketching-the-gallery', ...unsplash('1558655146-9f40138edfeb'), category: inCategory('Made with lw', 'made-with-lw'), author: DEMO_MEMBERS.p0unter, time: minutesAgo(310), reactions: 27, comments: 14, views: 640, new: true, description: 'The first pass at the forum’s media page, before it became a component.' },
  { title: 'Edge regions at night', href: '/media/edge-regions-at-night', ...unsplash('1451187580459-43490279c0fa'), album: inAlbum('LowerCloud launch', 'lowercloud-launch'), author: DEMO_MEMBERS.theo, time: minutesAgo(480), reactions: 33, comments: 4, views: 905, new: true },
  { title: 'Rainy-day focus mix', href: '/media/rainy-day-focus-mix', type: 'audio', ...unsplash('1545239351-1141bd82e8a6'), duration: 214, album: inAlbum('Focus sounds', 'focus-sounds'), author: DEMO_MEMBERS.priya, time: minutesAgo(DAYS + 120), reactions: 12, comments: 2, views: 310 },
  { title: 'Hack day at the office', href: '/media/hack-day', ...unsplash('1522071820081-009f0129c71c'), album: inAlbum('Hack day 2026', 'hack-day-2026'), author: DEMO_MEMBERS.p0unter, time: minutesAgo(DAYS + 400), reactions: 51, comments: 17, views: 1204 },
  { title: 'Milky Way over the ridge', href: '/media/milky-way', ...unsplash('1519681393784-d120267933ba'), category: inCategory('Wallpapers', 'wallpapers'), author: DEMO_MEMBERS.leo, time: minutesAgo(2 * DAYS + 60), reactions: 88, comments: 12, views: 3400 },
  { title: 'A syntax theme I am working on', href: '/media/syntax-theme', ...unsplash('1461749280684-dccba630e2f6'), category: inCategory('Screenshots', 'screenshots'), author: DEMO_MEMBERS.leo, time: minutesAgo(2 * DAYS + 300), reactions: 23, comments: 19, views: 870 },
  { title: 'Two monitors, one bug', href: '/media/two-monitors-one-bug', ...unsplash('1504639725590-34d0984388bd'), category: inCategory('Screenshots', 'screenshots'), author: DEMO_MEMBERS.sam, time: minutesAgo(3 * DAYS), reactions: 15, comments: 8, views: 520 },
  { title: 'Valley at first light', href: '/media/valley-first-light', ...unsplash('1506744038136-46273834b3fb'), category: inCategory('Wallpapers', 'wallpapers'), author: DEMO_MEMBERS.priya, time: minutesAgo(4 * DAYS), reactions: 40, comments: 3, views: 1650 },
  { title: 'The new office', href: '/media/the-new-office', ...unsplash('1497366216548-37526070297c'), album: inAlbum('Office life', 'office-life'), author: DEMO_MEMBERS.sam, time: minutesAgo(5 * DAYS), reactions: 22, comments: 7, views: 760 },
  { title: 'Home server board', href: '/media/home-server-board', ...unsplash('1518770660439-4636190af475'), category: inCategory('Desk setups', 'desk-setups'), author: DEMO_MEMBERS.theo, time: minutesAgo(6 * DAYS), reactions: 19, comments: 10, views: 480 },
  { title: 'Stone spiral at sunset', href: '/media/stone-spiral', ...unsplash('1472214103451-9374bd1c798e'), category: inCategory('Wallpapers', 'wallpapers'), author: DEMO_MEMBERS.ana, time: minutesAgo(8 * DAYS), reactions: 31, comments: 2, views: 990 },
  { title: 'Sprite Fight on Blender Studio', href: '/media/sprite-fight-blender-studio', type: 'embed', src: `${SPRITE_FIGHT}/poster.webp`, embed: 'https://studio.blender.org/films/sprite-fight/', category: inCategory('Made with lw', 'made-with-lw'), author: DEMO_MEMBERS.ana, time: minutesAgo(9 * DAYS), reactions: 9, comments: 1, views: 410, description: 'The film’s page, with its making-of and production files.' },
  { title: 'Morning setup', href: '/media/morning-setup', ...unsplash('1517694712202-14dd9538aa97'), category: inCategory('Desk setups', 'desk-setups'), author: DEMO_MEMBERS.maya, time: minutesAgo(10 * DAYS), reactions: 26, comments: 5, views: 700 },
  { title: 'Terminal screensaver', href: '/media/terminal-screensaver', ...unsplash('1526374965328-7f61d4dc18c5'), category: inCategory('Screenshots', 'screenshots'), author: DEMO_MEMBERS.p0unter, time: minutesAgo(12 * DAYS), reactions: 44, comments: 13, views: 1520 },
  { title: 'Footbridge into the forest', href: '/media/footbridge', ...unsplash('1447752875215-b2761acb3c5d'), category: inCategory('Wallpapers', 'wallpapers'), author: DEMO_MEMBERS.theo, time: minutesAgo(14 * DAYS), reactions: 17, comments: 0, views: 380 },
  { title: 'Late-night refactor', href: '/media/late-night-refactor', ...unsplash('1488590528505-98d2b5aba04b'), category: inCategory('Screenshots', 'screenshots'), author: DEMO_MEMBERS.sam, time: minutesAgo(16 * DAYS), reactions: 12, comments: 6, views: 330 },
  { title: 'Fog over the pines', href: '/media/fog-over-the-pines', ...unsplash('1418065460487-3e41a6c84dc5'), category: inCategory('Wallpapers', 'wallpapers'), author: DEMO_MEMBERS.priya, time: minutesAgo(19 * DAYS), reactions: 29, comments: 1, views: 870 },
  { title: 'Circuit macro', href: '/media/circuit-macro', ...unsplash('1550751827-4bd374c3f58b'), category: inCategory('Made with lw', 'made-with-lw'), author: DEMO_MEMBERS.leo, time: minutesAgo(23 * DAYS), reactions: 35, comments: 4, views: 1100 },
  { title: 'Desert road, Valley of Fire', href: '/media/desert-road', ...unsplash('1500530855697-b586d89ba3ee'), album: inAlbum('Road trip', 'road-trip'), author: DEMO_MEMBERS.ana, time: minutesAgo(27 * DAYS), reactions: 21, comments: 3, views: 640 },
  { title: 'Bubble Nebula wallpaper', href: '/media/bubble-nebula', ...unsplash('1462331940025-496dfbfc7564'), category: inCategory('Wallpapers', 'wallpapers'), author: DEMO_MEMBERS.maya, time: minutesAgo(31 * DAYS), reactions: 57, comments: 8, views: 2900 },
  { title: 'Streaming room', href: '/media/streaming-room', ...unsplash('1511512578047-dfb367046420'), category: inCategory('Desk setups', 'desk-setups'), author: DEMO_MEMBERS.sam, time: minutesAgo(36 * DAYS), reactions: 38, comments: 9, views: 1340 },
];
