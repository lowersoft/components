import { escapeHtml } from '../../core/dom.js';
import { avatarMarkup, DEMO_MEMBERS, formatWhole, memberMarkup, memberOf } from '../../core/forum.js';
import { strokeIcon } from '../../core/icons.js';
import { award, calendarDays, chevronLeft, chevronRight, circleCheck, heart, layers, messageCircle, search, trendingUp, users } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { foldText } from '../../core/text.js';
import '../text-input/index.js';
import '../user-hover-card/index.js';
import styles from './notable-members.scss?inline';

// The icons a list can name, by their Lucide names.
const ICONS = {
  award,
  'calendar-days': calendarDays,
  'circle-check': circleCheck,
  heart,
  layers,
  'message-circle': messageCircle,
  'trending-up': trendingUp,
  users,
};

// How many matches the search shows at most.
const MATCHES = 6;

// Members of the demo forum: the forum's own, then members known only by
// their profiles.
const M = DEMO_MEMBERS;
const profile = (name, handle, extra = {}) => ({ name, handle, href: `/u/${handle}`, ...extra });
const JUN = profile('Jun Watanabe', 'jun', { title: 'Regular' });
const LENA = profile('Lena Fischer', 'lenaf', { title: 'Regular', location: 'Berlin' });
const OMAR = profile('Omar Haddad', 'omarh', { title: 'Regular' });
const SQL = profile('sqlsorcerer', 'sqlsorcerer', { title: 'Query whisperer' });
const KAI = profile('Kai Nakamura', 'kai', { title: 'Member' });
const ELIF = profile('Elif Yılmaz', 'elif', { title: 'Member', location: 'Izmir' });
const INES = profile('Ines Alves', 'ines', { title: 'Member' });
const at = (member, value) => ({ ...member, value });

const DEMO_LISTS = [
  {
    id: 'messages',
    title: 'Most messages',
    icon: 'message-circle',
    members: [at(M.p0unter, 3412), at(M.sam, 2210), at(M.maya, 1208), at(SQL, 1104), at(M.leo, 486), at(JUN, 431), at(M.theo, 318), at(LENA, 297), at(M.priya, 152), at(OMAR, 140)],
  },
  {
    id: 'reactions',
    title: 'Highest reaction score',
    icon: 'heart',
    members: [at(M.p0unter, 21800), at(M.maya, 14200), at(M.sam, 12400), at(M.leo, 6130), at(SQL, 4310), at(M.ana, 2210), at(M.theo, 1460), at(JUN, 1302), at(M.priya, 940), at(LENA, 811)],
  },
  {
    id: 'solutions',
    title: 'Most solutions',
    icon: 'circle-check',
    members: [at(SQL, 512), at(M.p0unter, 412), at(M.sam, 188), at(M.maya, 96), at(M.theo, 41), at(M.leo, 31), at(JUN, 19), at(M.priya, 12), at(OMAR, 9), at(LENA, 7)],
  },
  {
    id: 'points',
    title: 'Most points',
    icon: 'award',
    members: [at(M.p0unter, 9120), at(M.sam, 5340), at(M.maya, 2960), at(SQL, 2410), at(M.leo, 1180), at(M.theo, 760), at(JUN, 702), at(M.priya, 455), at(LENA, 380), at(KAI, 210)],
  },
  {
    id: 'birthdays',
    title: 'Today’s birthdays',
    icon: 'calendar-days',
    ranked: false,
    members: [at(ELIF, 'Turns 29'), at(KAI, 'Turns 34'), at(INES, 'Turns 41')],
  },
  {
    id: 'staff',
    title: 'Staff members',
    icon: 'users',
    ranked: false,
    members: [at(M.p0unter, 'Admin'), at(M.maya, 'Moderator'), at(M.sam, 'Staff')],
  },
];


const valueMarkup = (value) =>
  typeof value === 'number' && Number.isFinite(value) ? `<data class="value" value="${value}">${formatWhole(value)}</data>` : value ? `<span class="value" data-text>${escapeHtml(value)}</span>` : '';

/**
 * A forum's notable members: beside a menu of its lists, an overview of the
 * first few members on each, such as the most messages, the highest
 * reaction score, the most solutions and points, today's birthdays and the
 * staff, each card with See all to its full list. A list shows its members
 * ranked, the first three marked, with their title and their count; every
 * name opens that member's card.
 *
 * Under the menu, Find member looks through everyone on the lists as you
 * type, by name or handle, and offers the matches as links to their
 * profiles; Enter hands the search to the page with `lw-find`. Beside the
 * page there are two columns with room for them; narrower, the menu runs
 * along the top.
 *
 * Lists are `{ id, title, icon?, ranked?, members }`, `ranked: false` for
 * one without an order, such as birthdays, and each member as
 * `<lw-user-hover-card>` takes one with its `value`, a count, or text such
 * as "Turns 29". An `icon` is a Lucide icon's name: award, calendar-days,
 * circle-check, heart, layers, message-circle, trending-up or users.
 *
 * @attr {Array<object>} lists - The lists, in the menu's order (JSON)
 * @attr {string} view - `overview`, or the id of the list shown in full
 * @attr {number} limit - How many members each card of the overview shows
 * @attr {string} heading - The title of the menu
 * @attr {number} level - Heading level of the menu's and the full list's titles, 1 to 5; the overview's cards are a level below
 * @fires lw-view - The menu or See all changed what shows; `detail: { view }`
 * @fires lw-find - Enter was pressed in Find member; `detail: { query }`
 * @csspart menu - The menu's frame
 * @csspart list - A list's frame
 */
export class LwNotableMembers extends LwElement {
  static styles = styles;
  static props = {
    lists: { type: Object, default: DEMO_LISTS },
    view: { default: 'overview', reflect: true },
    limit: { type: Number, default: 5 },
    heading: { default: 'Members' },
    level: { type: Number, default: 2 },
  };

  // What takes the focus once the view changed from See all or Back.
  #focus = '';

  render() {
    return `<div class="root"><div class="layout"><aside class="aside">
<nav class="frame menu" part="menu" aria-labelledby="menu-title"><div class="head"><h2 class="title" id="menu-title"></h2></div><div class="card"><ul class="nav" role="list"></ul></div></nav>
<section class="frame find" aria-labelledby="find-title"><div class="head"><h2 class="title" id="find-title">Find member</h2></div><div class="card find-card"><lw-text-input class="find-input" type="search" label="Find member" placeholder="Name or @handle" autocomplete="off" size="sm"><span class="find-icon" slot="start">${strokeIcon(search, 15)}</span></lw-text-input><p class="find-status" role="status"></p><ul class="matches" role="list" aria-label="Matching members" hidden></ul></div></section>
</aside><div class="content"></div></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.nav').addEventListener('click', (event) => {
      const item = event.target.closest('.nav-item');
      if (item) this.#show(item.dataset.view);
    }, options);
    this.query('.content').addEventListener('click', (event) => {
      const button = event.target.closest('.see, .back');
      if (button) this.#show(button.dataset.view, true);
    }, options);

    const input = this.query('.find-input');
    input.addEventListener('input', () => this.#find(), options);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const query = (input.value ?? '').trim();
        if (query) this.emit('find', { query });
      } else if (event.key === 'Escape' && input.value) {
        event.preventDefault();
        input.value = '';
        this.#find();
      }
    }, options);
  }

  updated(changed) {
    if (changed.has('heading') || changed.has('level')) this.#paintHeadings();
    if (['lists', 'view', 'limit', 'level'].some((name) => changed.has(name))) {
      this.#paintMenu();
      this.#paintContent();
      if (this.#focus) this.query(this.#focus)?.focus();
      this.#focus = '';
    }
    if (changed.has('lists')) this.#find();
  }

  get #lists() {
    return (Array.isArray(this.lists) ? this.lists : [])
      .filter((list) => list && typeof list === 'object' && list.id != null)
      .map((list) => ({ ...list, id: String(list.id), members: (Array.isArray(list.members) ? list.members : []).map((member) => [memberOf(member), member?.value]).filter(([member]) => member) }));
  }

  get #level() {
    const level = Math.round(this.level);
    return level >= 1 && level <= 5 ? level : 2;
  }

  // The list shown in full, or none for the overview.
  get #current() {
    return this.view && this.view !== 'overview' ? (this.#lists.find((list) => list.id === this.view) ?? null) : null;
  }

  // From See all the focus goes to the list's title, and from Back to the
  // list's See all, once they are drawn.
  #show(view, focus = false) {
    const from = this.#current?.id ?? 'overview';
    if (view === from) return;
    if (focus) this.#focus = view === 'overview' ? `.see[data-view="${CSS.escape(from)}"]` : '.full .title';
    this.view = view;
    this.emit('view', { view });
  }

  #paintHeadings() {
    const level = this.#level;
    for (const [selector, text] of [['#menu-title', this.heading ?? ''], ['#find-title', 'Find member']]) {
      const old = this.query(selector);
      const title = document.createElement(`h${level}`);
      title.className = 'title';
      title.id = old.id;
      title.textContent = text;
      old.replaceWith(title);
    }
  }

  #paintMenu() {
    const current = this.#current?.id ?? 'overview';
    const item = (view, label, icon) =>
      `<li><button class="nav-item" type="button" data-view="${escapeHtml(view)}"${view === current ? ' aria-current="true"' : ''}><span class="nav-icon" aria-hidden="true">${strokeIcon(icon, 15)}</span><span class="nav-label">${escapeHtml(label)}</span></button></li>`;
    const nav = this.query('.nav');
    nav.innerHTML = [item('overview', 'Overview', layers), ...this.#lists.map((list) => item(list.id, list.title ?? '', ICONS[list.icon] ?? trendingUp))].join('');
    // Along the top, the menu scrolls to show the list shown.
    const shown = nav.querySelector('[aria-current]');
    if (shown && nav.scrollWidth > nav.clientWidth) {
      const { offsetLeft: left, offsetWidth: width } = shown;
      if (left < nav.scrollLeft || left + width > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = left - (nav.clientWidth - width) / 2;
    }
  }

  #paintContent() {
    const current = this.#current;
    const level = this.#level;
    const content = this.query('.content');
    if (current) {
      content.innerHTML = this.#listMarkup(current, level, true);
      return;
    }
    const lists = this.#lists;
    content.innerHTML = lists.length ? `<div class="overview">${lists.map((list) => this.#listMarkup(list, level + 1, false)).join('')}</div>` : '<p class="none">No lists yet.</p>';
  }

  // A list as a card of the overview, its first members with See all, or in
  // full with the way back to the overview.
  #listMarkup(list, level, full) {
    const limit = Math.max(1, Math.round(this.limit) || 5);
    const members = full ? list.members : list.members.slice(0, limit);
    const ranked = list.ranked !== false;
    const id = `list-${escapeHtml(list.id)}`;
    const rows = members.map(([member, value], index) => {
      const rank = ranked ? `<span class="rank"${index < 3 ? ` data-rank="${index + 1}"` : ''}>${index + 1}</span>` : '';
      const sub = full && (member.title || member.role) ? `<span class="sub">${escapeHtml(member.title || member.role)}</span>` : '';
      return `<li class="row">${rank}${avatarMarkup(member)}<span class="who">${memberMarkup(member)}${sub}</span>${valueMarkup(value)}</li>`;
    });
    const body = rows.length ? `<ol class="rows${ranked ? ' ranked' : ''}" role="list">${rows.join('')}</ol>` : '<p class="empty">No one here yet.</p>';
    const see = !full && list.members.length > members.length ? `<button class="see" type="button" data-view="${escapeHtml(list.id)}">See all<span class="visually-hidden"> ${escapeHtml(list.title ?? '')}</span>${strokeIcon(chevronRight, 14)}</button>` : '';
    const back = full ? `<button class="back" type="button" data-view="overview">${strokeIcon(chevronLeft, 14)}Overview</button>` : '';
    const count = full ? `<span class="count">${formatWhole(list.members.length)} ${list.members.length === 1 ? 'member' : 'members'}</span>` : '';
    return `<section class="frame list${full ? ' full' : ''}" part="list" aria-labelledby="${id}"><div class="head">${back}<h${level} class="title" id="${id}"${full ? ' tabindex="-1"' : ''}>${escapeHtml(list.title ?? '')}</h${level}>${count}${see}</div><div class="card">${body}</div></section>`;
  }

  // Everyone on the lists whose name or handle starts with the query, or a
  // word of it does.
  #find() {
    const input = this.query('.find-input');
    const query = foldText((input.value ?? '').trim().replace(/^@/, ''));
    const matches = this.query('.matches');
    const status = this.query('.find-status');
    if (!query) {
      matches.hidden = true;
      matches.innerHTML = '';
      status.textContent = '';
      return;
    }
    const seen = new Map();
    for (const list of this.#lists) for (const [member] of list.members) seen.set(member.handle ?? member.name, member);
    const found = [...seen.values()].filter((member) => foldText(member.handle).startsWith(query) || foldText(member.name).split(/\s+/).some((word) => word.startsWith(query)) || foldText(member.name).startsWith(query));
    matches.innerHTML = found
      .slice(0, MATCHES)
      .map((member) => `<li><a class="match" href="${escapeHtml(member.href ?? '#')}">${avatarMarkup(member)}<span class="match-text"><span class="match-name">${escapeHtml(member.name)}</span>${member.handle ? `<span class="match-handle">@${escapeHtml(member.handle)}</span>` : ''}</span></a></li>`)
      .join('');
    matches.hidden = !found.length;
    status.textContent = found.length ? `${found.length} ${found.length === 1 ? 'member' : 'members'} found` : `No member matches “${(input.value ?? '').trim()}”`;
  }
}
