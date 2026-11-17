import { escapeHtml } from '../../core/dom.js';
import { avatarMarkup, countMarkup, countOf, DEMO_MEMBERS, memberMarkup, memberOf, minutesAgo, tickTimes, timeMarkup } from '../../core/forum.js';
import { strokeIcon } from '../../core/icons.js';
import { messageCircle } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../user-hover-card/index.js';
import styles from './trending-threads.scss?inline';

// The forum navbar's demo threads drawing the most replies this week.
const DEMO_THREADS = [
  { title: 'Show us what you built with the video player', href: '/t/video-player-showcase', author: DEMO_MEMBERS.ana, time: minutesAgo(60 * 24 * 2 + 140), replies: 21400 },
  { title: 'Migrating from Postgres to LowerDB: a write-up', href: '/t/postgres-to-lowerdb', author: DEMO_MEMBERS.sam, time: minutesAgo(60 * 26), replies: 1320 },
  { title: 'Sync conflicts: last write wins, or merge?', href: '/t/sync-conflicts', author: DEMO_MEMBERS.priya, time: minutesAgo(60 * 24 * 5 + 30), replies: 284 },
  { title: 'LowerSync drops changes made offline on iOS 18', href: '/t/lowersync-offline-ios', author: DEMO_MEMBERS.maya, time: minutesAgo(130), replies: 96 },
  { title: 'lw 0.3.0 is out: the forum navbar and steadier reconnects', href: '/t/lw-0-3-0', author: DEMO_MEMBERS.p0unter, time: minutesAgo(60 * 24 * 6 + 300), replies: 0 },
];

/**
 * The threads drawing the most replies: for each its author's avatar, its
 * title over two lines at most, who started it and when, and how many
 * replies it has. The whole row leads to the thread; rest the pointer on
 * the author's name and their card opens over it. The times count on as
 * the page stays open.
 *
 * Threads are `{ title, href, author, time?, replies? }`: `time` an ISO date
 * and time, or text to show as it is, and `author` a member as
 * `<lw-user-hover-card>` takes one, or a name alone, which stays plain text.
 *
 * @attr {Array<object>} threads - The threads, most talked about first (JSON)
 * @attr {string} heading - The title
 * @attr {string} period - The time the threads trend over, across from the title; none when empty
 * @attr {number} level - Heading level of the title, 1 to 6
 * @csspart frame - The outer frame
 * @csspart row - A thread's row
 */
export class LwTrendingThreads extends LwElement {
  static styles = styles;
  static props = {
    threads: { type: Object, default: DEMO_THREADS },
    heading: { default: 'Trending' },
    period: { default: 'This week' },
    level: { type: Number, default: 2 },
  };

  render() {
    return '<section class="frame" part="frame" aria-labelledby="title"></section>';
  }

  connected() {
    tickTimes(this.shadowRoot, this.signal);
  }

  updated() {
    const threads = (Array.isArray(this.threads) ? this.threads : []).filter((thread) => thread && typeof thread === 'object' && thread.title);
    const level = Math.round(this.level) >= 1 && Math.round(this.level) <= 6 ? Math.round(this.level) : 2;
    const rows = threads.length
      ? `<ol class="rows" role="list">${threads.map((thread) => this.#rowMarkup(thread, level + 1)).join('')}</ol>`
      : '<p class="empty">Nothing is trending yet.</p>';
    this.query('.frame').innerHTML = `<div class="head"><h${level} class="title" id="title">${escapeHtml(this.heading ?? '')}</h${level}>${this.period ? `<span class="period">${escapeHtml(this.period)}</span>` : ''}</div>
<div class="card">${rows}</div>`;
  }

  #rowMarkup(thread, level) {
    const author = memberOf(thread.author);
    const replies = countOf(thread.replies);
    const by = [author ? memberMarkup(author, thread.author) : '', timeMarkup(thread.time)].filter(Boolean).join('<span class="sep" aria-hidden="true">·</span>');
    const count = replies !== null ? `<span class="replies"${replies === 0 ? ' data-none' : ''}>${strokeIcon(messageCircle, 13)}${countMarkup(replies)}<span class="visually-hidden"> ${replies === 1 ? 'reply' : 'replies'}</span></span>` : '';
    return `<li class="row" part="row">${author ? avatarMarkup(author) : ''}
<div class="text"><h${level} class="name"><a class="link" href="${escapeHtml(thread.href ?? '#')}">${escapeHtml(thread.title)}</a></h${level}><p class="meta"><span class="by">${by}</span>${count}</p></div></li>`;
  }
}
