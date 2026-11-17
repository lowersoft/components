import { escapeHtml } from './dom.js';
import { hueOf, initialsOf } from './people.js';

// What the forum's components share: counts and times the way a forum
// writes them, and members by their avatars and their names, each name with
// the member's card over it (the component imports `<lw-user-hover-card>`).

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
