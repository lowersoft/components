import { formatDate, parseDate } from '../../core/dates.js';
import { escapeHtml } from '../../core/dom.js';
import { avatarMarkup, countMarkup, countOf, DEMO_MEMBERS, formatWhole, minutesAgo, tickTimes, timeMarkup } from '../../core/forum.js';
import { moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import {
  calendarDays,
  circleCheck,
  flag,
  heart,
  image,
  link2,
  mapPin,
  messageCircle,
  messageSquareText,
  messagesSquare,
  pencil,
  reply,
} from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf } from '../../core/people.js';
import '../button/index.js';
import '../follow-button/index.js';
import '../profile-posts/index.js';
import styles from './member-profile.scss?inline';

// Each tab's label, and the shorter one it takes on a phone.
const TABS = [
  ['posts', 'Profile posts', 'Posts'],
  ['activity', 'Latest activity', 'Activity'],
  ['postings', 'Postings'],
  ['about', 'About'],
];

const STATUSES = { online: 'Online', away: 'Away', busy: 'Do not disturb' };

const STATS = [
  ['posts', 'Messages'],
  ['reactions', 'Reaction score'],
  ['solutions', 'Solutions'],
  ['points', 'Points'],
];

// What each kind of activity says, and its mark.
const ACTIVITY = {
  thread: [messagesSquare, 'Started the thread'],
  reply: [reply, 'Replied to'],
  reaction: [heart, 'Reacted to a post in'],
  solution: [circleCheck, 'Had a reply marked as the solution in'],
  status: [messageSquareText, 'Updated their status'],
};

const DEMO_MEMBER = {
  ...DEMO_MEMBERS.maya,
  title: 'Sync whisperer',
  now: { text: 'Viewing the thread', label: 'Sync conflicts: last write wins, or merge?', href: '/t/sync-conflicts' },
  website: 'https://mayachen.dev',
  followers: 1204,
  following: 87,
  points: 2960,
  about: 'Keeps LowerSync honest offline. Ask me about conflict resolution, CRDTs and the iOS background task budget.\n\nBefore LowerSoft I worked on offline maps, where every byte on the device counted twice. I moderate LowerSync and Showcase, and I read every bug report with a repro first.',
};

const DEMO_POSTS = [
  { author: DEMO_MEMBERS.leo, text: 'Thanks for the review on the token docs! The examples read much better now.', time: minutesAgo(50), href: '/p/2220' },
  { author: DEMO_MEMBERS.ana, text: 'Your write-up on background sync saved my weekend. The kanban board reconnects in a second now.', time: minutesAgo(6 * 60), href: '/p/2216' },
  { author: DEMO_MEMBERS.p0unter, text: 'Welcome to the moderators, Maya.', time: minutesAgo(9 * 24 * 60), href: '/p/1984' },
];

const DEMO_ACTIVITY = [
  { type: 'reply', title: 'LowerSync drops changes made offline on iOS 18', href: '/t/lowersync-offline-ios#post-14', excerpt: 'Reproduced on 18.1 with a full queue: the background task is killed before the flush. A fix is in review.', time: minutesAgo(12), category: 'LowerSync' },
  { type: 'solution', title: 'Sync conflicts: last write wins, or merge?', href: '/t/sync-conflicts#post-9', time: minutesAgo(3 * 60), category: 'LowerSync' },
  { type: 'reaction', title: 'Show us what you built with the video player', href: '/t/video-player-showcase#post-31', time: minutesAgo(7 * 60), category: 'Showcase' },
  { type: 'thread', title: 'Conflict resolution in LowerSync, explained with pictures', href: '/t/conflicts-explained', excerpt: 'Three replicas, one shopping list, and why the order you see edits in is not the order they happened in.', time: minutesAgo(26 * 60), category: 'LowerSync' },
  { type: 'status', excerpt: 'At the offline-first meetup in Lisbon tonight. Come say hi!', time: minutesAgo(3 * 24 * 60) },
];

const DEMO_POSTINGS = [
  { title: 'Conflict resolution in LowerSync, explained with pictures', href: '/t/conflicts-explained', excerpt: 'Three replicas, one shopping list, and why the order you see edits in is not the order they happened in.', category: 'LowerSync', replies: 48, time: minutesAgo(26 * 60) },
  { title: 'LowerSync drops changes made offline on iOS 18', href: '/t/lowersync-offline-ios', excerpt: 'Edits made in airplane mode vanish after the app is backgrounded for a few minutes.', category: 'LowerSync', replies: 14, time: minutesAgo(2 * 60) },
  { title: 'Keeping the floating navbar menus open on touch', href: '/t/navbar-menus-on-touch', category: 'Components', replies: 4, time: minutesAgo(3 * 24 * 60) },
  { title: 'Moderation notes for Showcase threads', href: '/t/showcase-moderation', category: 'Announcements', replies: 0, time: minutesAgo(40 * 24 * 60) },
];

const longDate = (iso) => formatDate(iso, 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// A count in full, and past a hundred thousand the forum's short way.
const statValue = (value) => (value >= 100_000 ? countMarkup(value) : `<data value="${value}">${formatWhole(value)}</data>`);

const hostOf = (url) => {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const chip = (name) => `<span class="chip" style="--_hue: ${hueOf(name)}">${escapeHtml(name)}</span>`;

const linkOr = (label, href, className) => (href ? `<a class="${className}" href="${escapeHtml(href)}">${escapeHtml(label)}</a>` : `<span class="${className}">${escapeHtml(label)}</span>`);

/**
 * A member's page on a forum. Its head carries their banner, a large avatar
 * with whether they are around, their name, role and title, what they are
 * doing now, when they joined, where they are and their website, a short
 * bio, and their messages, reaction score, solutions and points. Beside
 * the name a visitor finds Follow, with the member's followers, and
 * Message, and on the banner Report; on their own page the member finds
 * Edit profile, and Edit banner on the banner.
 *
 * Tabs under the head hold the profile posts left for them, with a field to
 * write one when someone is signed in; their latest activity; the threads
 * they started; and about them in full. The arrow keys move between the
 * tabs, and the times count on as the page stays open. Every name opens
 * that member's card. The head lays itself out for the room it has.
 *
 * The member is as `<lw-user-hover-card>` takes one, with `title` a line
 * under the name, `now` what they are doing, `{ text, label?, href? }`,
 * `website`, `followers`, `following`, `points` and `about`, a longer bio.
 * Profile posts are as `<lw-profile-posts>` takes them. Activity is `{ type,
 * title?, href?, excerpt?, time, category? }` with `type` thread, reply,
 * reaction, solution or status, and postings `{ title, href, excerpt?,
 * category?, replies?, time }`.
 *
 * @attr {object} member - The member whose page it is (JSON)
 * @attr {object} user - The member signed in, who can write a profile post; their own page when the handles match (JSON)
 * @attr {boolean} followed - The member signed in follows this one
 * @attr {Array<object>} posts - The profile posts left for them, latest first (JSON)
 * @attr {Array<object>} activity - Their latest activity, latest first (JSON)
 * @attr {Array<object>} postings - The threads they started, latest first (JSON)
 * @attr {string} postings-href - The page of everything they posted, at the foot of Postings
 * @attr {'posts'|'activity'|'postings'|'about'} tab - The tab open
 * @attr {number} level - Heading level of the name, 1 to 6
 * @fires lw-tab - A tab was picked; `detail: { tab }`
 * @fires lw-change - Before following or unfollowing; `detail: { followed }` is the new state. Cancelable.
 * @fires lw-message - Message was pressed
 * @fires lw-report - Report was pressed
 * @fires lw-edit - Edit profile or Edit banner was pressed; `detail: { part }`, `profile` or `banner`
 * @fires lw-post - From the profile posts' field, before a post goes up; `detail: { text }`. Cancelable.
 * @csspart header - The head
 * @csspart tabs - The tab list
 * @csspart panel - A tab's panel
 */
export class LwMemberProfile extends LwElement {
  static styles = styles;
  static props = {
    member: { type: Object, default: DEMO_MEMBER },
    user: { type: Object },
    followed: { type: Boolean, reflect: true },
    posts: { type: Object, default: DEMO_POSTS },
    activity: { type: Object, default: DEMO_ACTIVITY },
    postings: { type: Object, default: DEMO_POSTINGS },
    postingsHref: { default: '' },
    tab: { default: 'posts', reflect: true },
    level: { type: Number, default: 1 },
  };

  render() {
    const tabs = TABS.map(([id, label, short]) => `<button class="tab" type="button" role="tab" id="tab-${id}" aria-controls="panel-${id}" data-tab="${id}" aria-selected="false" tabindex="-1">${short ? `<span class="label-long">${label}</span><span class="label-short">${short}</span>` : label}</button>`).join('');
    const panels = TABS.map(([id]) => `<section class="panel" part="panel" role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}" tabindex="0" hidden>${id === 'posts' ? '<lw-profile-posts class="posts" heading=""></lw-profile-posts>' : ''}</section>`).join('');
    return `<div class="profile"><header class="header" part="header"></header>
<div class="tabs-bar"><div class="tablist" part="tabs" role="tablist" aria-label="Profile"><span class="pill" aria-hidden="true"></span>${tabs}</div></div>
<div class="panels">${panels}</div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const header = this.query('.header');
    const tablist = this.query('.tablist');

    header.addEventListener('click', (event) => {
      const button = event.target.closest('lw-button');
      if (!button) return;
      if (button.matches('.message')) this.emit('message');
      else if (button.matches('.report')) this.emit('report');
      else if (button.matches('.edit')) this.emit('edit', { part: 'profile' });
      else if (button.matches('.edit-banner')) this.emit('edit', { part: 'banner' });
    }, options);

    // The follow button's own change, as the profile's.
    header.addEventListener('lw-change', (event) => {
      if (!event.target.matches?.('.follow')) return;
      event.stopPropagation();
      const followed = Boolean(event.detail?.following);
      if (!this.emit('change', { followed })) {
        event.preventDefault();
        return;
      }
      this.followed = followed;
    }, options);

    tablist.addEventListener('click', (event) => {
      const tab = event.target.closest('.tab');
      if (tab) this.#pick(tab.dataset.tab);
    }, options);
    tablist.addEventListener('keydown', (event) => this.#key(event), options);

    // The pill keeps to its tab as the labels' room changes.
    const resize = new ResizeObserver(() => this.#paintTabs(true));
    resize.observe(tablist);
    this.signal.addEventListener('abort', () => resize.disconnect());

    tickTimes(this.shadowRoot, this.signal);
  }

  updated(changed) {
    if (['member', 'user', 'level'].some((name) => changed.has(name))) this.#paintHeader();
    if (changed.has('followed')) {
      const follow = this.query('.follow');
      if (follow) follow.following = Boolean(this.followed);
    }
    if (['member', 'user', 'posts'].some((name) => changed.has(name))) this.#paintPosts(changed.has('posts'));
    if (changed.has('activity')) this.#paintActivity();
    if (changed.has('postings') || changed.has('postingsHref')) this.#paintPostings();
    if (changed.has('member')) this.#paintAbout();
    if (changed.has('tab')) this.#paintTabs(changed.size > 1);
  }

  get #member() {
    const member = this.member && typeof this.member === 'object' ? this.member : {};
    return { ...member, name: String(member.name ?? '') };
  }

  get #user() {
    return this.user && typeof this.user === 'object' && this.user.name ? this.user : null;
  }

  // Their own page, when the member signed in is this one.
  get #own() {
    const member = this.#member;
    const user = this.#user;
    return Boolean(user && (user.handle && member.handle ? user.handle === member.handle : user.name === member.name));
  }

  get #tab() {
    return TABS.some(([id]) => id === this.tab) ? this.tab : 'posts';
  }

  #paintHeader() {
    const member = this.#member;
    const own = this.#own;
    const hue = hueOf(member.name);
    const level = Math.round(this.level) >= 1 && Math.round(this.level) <= 6 ? Math.round(this.level) : 1;
    const status = STATUSES[member.status] ? member.status : '';
    const photo = member.name ? avatarMarkup(member) : '';

    const presence = status
      ? `<span class="presence" data-status="${status}">${STATUSES[status]}</span>`
      : member.seen
        ? `<span class="presence">Last seen ${timeMarkup(member.seen)}</span>`
        : '';
    const now = member.now?.text ? `<p class="now">${escapeHtml(member.now.text)}${member.now.label ? ` ${linkOr(member.now.label, member.now.href, 'now-link')}` : ''}</p>` : '';
    const meta = [member.handle ? `<span class="handle">@${escapeHtml(member.handle)}</span>` : '', presence].filter(Boolean).join('');

    const joined = parseDate(member.joined);
    const facts = [
      joined ? `<li class="fact">${strokeIcon(calendarDays, 14)}<span>Joined <time datetime="${joined}">${longDate(joined)}</time></span></li>` : '',
      member.location ? `<li class="fact">${strokeIcon(mapPin, 14)}${escapeHtml(member.location)}</li>` : '',
      member.website ? `<li class="fact">${strokeIcon(link2, 14)}<a class="fact-link" href="${escapeHtml(member.website)}" target="_blank" rel="noopener noreferrer me">${escapeHtml(hostOf(member.website))}<span class="visually-hidden"> (opens in a new tab)</span></a></li>` : '',
    ].join('');

    const stats = STATS.map(([key, label]) => [label, countOf(member[key])])
      .filter(([, value]) => value !== null)
      .map(([label, value]) => `<div class="stat"><dt>${label}</dt><dd>${statValue(value)}</dd></div>`)
      .join('');

    const followers = countOf(member.followers);
    const actions = own
      ? `<lw-button class="edit" variant="outline"><span class="button-icon" slot="start">${strokeIcon(pencil, 14)}</span>Edit profile</lw-button>`
      : `<lw-follow-button class="follow"${followers !== null ? ` count="${followers}"` : ''} count-label="followers"${this.followed ? ' following' : ''}></lw-follow-button><lw-button class="message" variant="outline"><span class="button-icon" slot="start">${strokeIcon(messageCircle, 14)}</span>Message</lw-button>`;
    const bannerAction = own
      ? `<lw-button class="edit-banner" variant="secondary" size="sm"><span class="button-icon" slot="start">${strokeIcon(image, 14)}</span>Edit banner</lw-button>`
      : `<lw-button class="report" variant="secondary" size="sm"><span class="button-icon" slot="start">${strokeIcon(flag, 14)}</span>Report</lw-button>`;

    this.query('.header').innerHTML = `<div class="banner" style="--_hue: ${hue}">${member.banner ? `<img class="banner-photo" src="${escapeHtml(member.banner)}" alt="" decoding="async">` : ''}<div class="banner-actions">${member.name ? bannerAction : ''}</div></div>
<div class="identity"><span class="portrait">${photo}${status ? `<span class="dot" data-status="${status}"><span class="visually-hidden">${STATUSES[status]}</span></span>` : ''}</span>
<div class="who"><div class="name-row"><h${level} class="name">${escapeHtml(member.name)}</h${level}>${member.role ? `<span class="role">${escapeHtml(member.role)}</span>` : ''}</div>${member.title ? `<p class="title">${escapeHtml(member.title)}</p>` : ''}${meta ? `<p class="meta">${meta}</p>` : ''}${now}</div>
<div class="actions">${member.name ? actions : ''}</div></div>
${member.bio ? `<p class="bio">${escapeHtml(member.bio)}</p>` : ''}${facts ? `<ul class="facts" role="list">${facts}</ul>` : ''}
${stats ? `<dl class="stats">${stats}</dl>` : ''}`;
  }

  // The profile posts, with a field to write one for whoever is signed in:
  // a status on their own page, a post for the member on anyone else's.
  #paintPosts(posts) {
    const member = this.#member;
    const view = this.query('.posts');
    if (posts) view.posts = Array.isArray(this.posts) ? this.posts : [];
    view.user = this.#user;
    view.placeholder = this.#own ? 'Update your status…' : `Write something on ${member.name}’s profile…`;
    view.empty = `There are no posts on ${member.name}’s profile yet.`;
  }

  #paintActivity() {
    const entries = (Array.isArray(this.activity) ? this.activity : []).filter((entry) => entry && typeof entry === 'object');
    const items = entries.map((entry) => {
      const [icon, text] = ACTIVITY[entry.type] ?? [messageSquareText, ''];
      const title = entry.title ? linkOr(entry.title, entry.href, 'entry-link') : '';
      const meta = [timeMarkup(entry.time), entry.category ? chip(entry.category) : ''].filter(Boolean).join('');
      return `<li class="entry"><span class="entry-mark" aria-hidden="true">${strokeIcon(icon, 14)}</span><div class="entry-body"><p class="entry-text">${text ? `<span>${text}</span> ` : ''}${title}</p>${entry.excerpt ? `<p class="excerpt">${escapeHtml(entry.excerpt)}</p>` : ''}${meta ? `<p class="entry-meta">${meta}</p>` : ''}</div></li>`;
    });
    this.query('#panel-activity').innerHTML = `<div class="card">${items.length ? `<ol class="timeline" role="list">${items.join('')}</ol>` : '<p class="empty">No activity yet.</p>'}</div>`;
  }

  #paintPostings() {
    const postings = (Array.isArray(this.postings) ? this.postings : []).filter((posting) => posting && typeof posting === 'object' && posting.title);
    const rows = postings.map((posting) => {
      const replies = countOf(posting.replies);
      const meta = [posting.category ? chip(posting.category) : '', timeMarkup(posting.time)].filter(Boolean).join('');
      const count = replies !== null ? `<span class="replies"${replies === 0 ? ' data-none' : ''}>${strokeIcon(messageCircle, 13)}${countMarkup(replies)}<span class="visually-hidden"> ${replies === 1 ? 'reply' : 'replies'}</span></span>` : '';
      return `<li class="posting"><a class="posting-link" href="${escapeHtml(posting.href ?? '#')}">${escapeHtml(posting.title)}</a>${posting.excerpt ? `<p class="excerpt">${escapeHtml(posting.excerpt)}</p>` : ''}<p class="posting-meta">${meta}${count}</p></li>`;
    });
    const more = this.postingsHref && rows.length ? `<a class="more-link" href="${escapeHtml(this.postingsHref)}">See everything ${escapeHtml(this.#member.name)} posted</a>` : '';
    this.query('#panel-postings').innerHTML = `<div class="card">${rows.length ? `<ol class="postings" role="list">${rows.join('')}</ol>${more}` : '<p class="empty">No threads yet.</p>'}</div>`;
  }

  #paintAbout() {
    const member = this.#member;
    const joined = parseDate(member.joined);
    const status = STATUSES[member.status];
    const followers = countOf(member.followers);
    const following = countOf(member.following);
    const details = [
      ['Joined', joined ? `<time datetime="${joined}">${longDate(joined)}</time>` : ''],
      ['Last seen', status ? 'Now' : member.seen ? timeMarkup(member.seen) : ''],
      ['Location', member.location ? escapeHtml(member.location) : ''],
      ['Website', member.website ? `<a class="fact-link" href="${escapeHtml(member.website)}" target="_blank" rel="noopener noreferrer me">${escapeHtml(hostOf(member.website))}<span class="visually-hidden"> (opens in a new tab)</span></a>` : ''],
      ['Followers', followers !== null ? `<data value="${followers}">${formatWhole(followers)}</data>` : ''],
      ['Following', following !== null ? `<data value="${following}">${formatWhole(following)}</data>` : ''],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `<div class="detail"><dt>${label}</dt><dd>${value}</dd></div>`)
      .join('');
    const about = member.about || member.bio;
    this.query('#panel-about').innerHTML = `<div class="card about">${about ? `<p class="about-text">${escapeHtml(about)}</p>` : `<p class="empty">${escapeHtml(member.name)} has not written about themselves yet.</p>`}${details ? `<dl class="details">${details}</dl>` : ''}</div>`;
  }

  #pick(tab, focus = false) {
    if (tab !== this.#tab) {
      this.tab = tab;
      this.emit('tab', { tab });
    }
    if (focus) this.query(`#tab-${tab}`).focus();
  }

  // Left and right move through the tabs, Home and End to the first and the
  // last, and the tab focused opens.
  #key(event) {
    const ids = TABS.map(([id]) => id);
    const at = ids.indexOf(this.#tab);
    const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: ids.length - 1 }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    this.#pick(ids[(to + ids.length) % ids.length], true);
  }

  #paintTabs(instant = false) {
    const current = this.#tab;
    for (const tab of this.shadowRoot.querySelectorAll('.tab')) {
      const selected = tab.dataset.tab === current;
      tab.ariaSelected = String(selected);
      tab.tabIndex = selected ? 0 : -1;
    }
    for (const panel of this.shadowRoot.querySelectorAll('.panel')) panel.hidden = panel.id !== `panel-${current}`;
    const tab = this.query(`#tab-${current}`);
    if (tab.offsetParent) moveHighlight(this.query('.pill'), tab, { instant });
  }
}
