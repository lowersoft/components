import { escapeHtml } from '../../core/dom.js';
import { avatarMarkup, countOf, formatWhole, memberMarkup, memberOf } from '../../core/forum.js';
import { strokeIcon } from '../../core/icons.js';
import { messageCircle, messagesSquare, userPlus, users } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../user-hover-card/index.js';
import styles from './forum-stats.scss?inline';

const DEMO_LATEST = { name: 'Yara Costa', handle: 'yara', href: '/u/yara', status: 'online', bio: 'Just found the forum. Building a small offline-first notes app on LowerSync.', posts: 1, joined: '2026-11-17', location: 'Lisbon' };

/**
 * How big the forum is: its threads, messages and members, each counted in
 * full, and the member who joined last, with their card over their name.
 *
 * @attr {number} threads - The threads on the forum; the row is left out when not given
 * @attr {number} messages - The messages on the forum; the row is left out when not given
 * @attr {number} members - The members of the forum; the row is left out when not given
 * @attr {object} latest-member - The member who joined last, as `<lw-user-hover-card>` takes one, or a name alone (JSON)
 * @attr {string} heading - The title
 * @attr {number} level - Heading level of the title, 1 to 6
 * @csspart frame - The outer frame
 */
export class LwForumStats extends LwElement {
  static styles = styles;
  static props = {
    threads: { type: Number, default: 186548 },
    messages: { type: Number, default: 339436 },
    members: { type: Number, default: 347035 },
    latestMember: { type: Object, default: DEMO_LATEST },
    heading: { default: 'Forum statistics' },
    level: { type: Number, default: 2 },
  };

  render() {
    return '<section class="frame" part="frame" aria-labelledby="title"></section>';
  }

  updated() {
    const level = Math.round(this.level) >= 1 && Math.round(this.level) <= 6 ? Math.round(this.level) : 2;
    const latest = memberOf(this.latestMember);
    const row = (icon, label, value) => `<div class="row"><dt>${strokeIcon(icon, 14)}${label}</dt><dd>${value}</dd></div>`;
    const counts = [
      [messagesSquare, 'Threads', countOf(this.threads)],
      [messageCircle, 'Messages', countOf(this.messages)],
      [users, 'Members', countOf(this.members)],
    ]
      .filter(([, , value]) => value !== null)
      .map(([icon, label, value]) => row(icon, label, `<data value="${value}">${formatWhole(value)}</data>`));
    if (latest) counts.push(row(userPlus, 'Latest member', `<span class="latest">${avatarMarkup(latest)}${memberMarkup(latest, this.latestMember)}</span>`));
    this.query('.frame').innerHTML = `<div class="head"><h${level} class="title" id="title">${escapeHtml(this.heading ?? '')}</h${level}></div>
<div class="card"><dl class="rows">${counts.join('')}</dl></div>`;
  }
}
