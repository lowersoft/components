import { escapeHtml } from '../../core/dom.js';
import { avatarMarkup, countOf, DEMO_MEMBERS, formatWhole, memberMarkup, memberOf } from '../../core/forum.js';
import { LwElement } from '../../core/lw-element.js';
import '../user-hover-card/index.js';
import styles from './members-online.scss?inline';

// How many faces stand in the head.
const FACES = 4;

// Members of the demo forum, by name and handle: the forum's own, then
// members known only by their profiles.
const DEMO_ONLINE = [
  DEMO_MEMBERS.p0unter,
  DEMO_MEMBERS.maya,
  DEMO_MEMBERS.sam,
  DEMO_MEMBERS.leo,
  DEMO_MEMBERS.priya,
  DEMO_MEMBERS.ana,
  DEMO_MEMBERS.theo,
  ...[
    ['Jun Watanabe', 'jun'],
    ['sqlsorcerer', 'sqlsorcerer'],
    ['Lena Fischer', 'lenaf'],
    ['Omar Haddad', 'omarh'],
    ['offline-first', 'offline-first'],
    ['Sofia Rossi', 'sofia'],
    ['Kai Nakamura', 'kai'],
    ['Elif Yılmaz', 'elif'],
    ['kernelpanic', 'kernelpanic'],
    ['Noah Becker', 'noahb'],
    ['Amara Okoye', 'amara'],
    ['Mateo Silva', 'mateo'],
    ['tokens.and.themes', 'tokens.and.themes'],
    ['Ines Alves', 'ines'],
    ['Jonas Weber', 'jonas'],
    ['Hana Kim', 'hanakim'],
    ['Lucas Moreau', 'lucas'],
    ['devnull', 'devnull'],
    ['Zara Ahmed', 'zara'],
    ['Ravi Patel', 'ravi'],
    ['Mila Novak', 'mila'],
    ['Felix Braun', 'felix'],
    ['Yara Costa', 'yara'],
  ].map(([name, handle]) => ({ name, handle, href: `/u/${handle}`, status: 'online' })),
];

/**
 * Who is on the forum now: the first faces in its head, then the members
 * online by name, each with their card over it and those with a role, such
 * as staff, in bold. The members not named are counted after them, leading
 * to the page of everyone online, and its foot says how many are here in
 * all: members and guests.
 *
 * Members are as `<lw-user-hover-card>` takes them.
 *
 * @attr {Array<object>} members - The members online to name, in order (JSON)
 * @attr {number} member-count - How many members are online in all; as many as are named by default
 * @attr {number} guests - How many guests are online; none shown when not given
 * @attr {string} href - The page of everyone online, where the count of the rest leads
 * @attr {string} heading - The title
 * @attr {number} level - Heading level of the title, 1 to 6
 * @csspart frame - The outer frame
 */
export class LwMembersOnline extends LwElement {
  static styles = styles;
  static props = {
    members: { type: Object, default: DEMO_ONLINE },
    memberCount: { type: Number, default: 106 },
    guests: { type: Number, default: 9211 },
    href: { default: '/online' },
    heading: { default: 'Members online' },
    level: { type: Number, default: 2 },
  };

  render() {
    return '<section class="frame" part="frame" aria-labelledby="title"></section>';
  }

  updated() {
    const members = (Array.isArray(this.members) ? this.members : []).map(memberOf).filter(Boolean);
    const total = Math.max(countOf(this.memberCount) ?? members.length, members.length);
    const guests = countOf(this.guests);
    const level = Math.round(this.level) >= 1 && Math.round(this.level) <= 6 ? Math.round(this.level) : 2;

    const faces = members.slice(0, FACES).map((member) => avatarMarkup(member)).join('');
    const rest = total - members.length;
    const restText = `and ${formatWhole(rest)} more`;
    const restMarkup = rest > 0 ? `<li class="rest">${this.href ? `<a class="rest-link" href="${escapeHtml(this.href)}">${restText}</a>` : restText}</li>` : '';
    const names = members.length
      ? `<ul class="names" role="list">${members.map((member) => `<li>${memberMarkup(member)}</li>`).join('')}${restMarkup}</ul>`
      : '<p class="empty">No members online right now.</p>';
    const totals = [
      `<span class="total"><span class="live" aria-hidden="true"></span><span><b>${formatWhole(total + (guests ?? 0))}</b> online</span></span>`,
      guests !== null ? `<span><b>${formatWhole(total)}</b> ${total === 1 ? 'member' : 'members'}</span><span><b>${formatWhole(guests)}</b> ${guests === 1 ? 'guest' : 'guests'}</span>` : '',
    ].join('');

    this.query('.frame').innerHTML = `<div class="head"><h${level} class="title" id="title">${escapeHtml(this.heading ?? '')}</h${level}>${faces ? `<span class="faces" aria-hidden="true">${faces}</span>` : ''}</div>
<div class="card">${names}<p class="totals">${totals}</p></div>`;
  }
}
