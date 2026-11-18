import { escapeHtml } from '../../core/dom.js';
import { countMarkup, countOf, DEMO_MEDIA, memberMarkup, memberOf, tickTimes, timeMarkup } from '../../core/forum.js';
import { strokeIcon } from '../../core/icons.js';
import { globe, imageOff, messageCircle, music, play } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../user-hover-card/index.js';
import styles from './trending-media.scss?inline';

// The forum's demo media drawing the most reactions this week.
const DEMO_ITEMS = [7, 2, 6, 1, 10].map((index) => DEMO_MEDIA[index]);

// The mark a thumbnail carries for what is not a picture.
const MARKS = { video: play, audio: music, embed: globe };

/**
 * The media drawing the most attention: for each its thumbnail, marked when
 * it is a video, audio or an embed, its title over two lines at most, the
 * album or category it is in, who added it and when, and how many comments
 * it has. The whole row leads to the media; the album and the member's name
 * lead to theirs, the member's card opening over the name. The times count
 * on as the page stays open.
 *
 * Items are `{ title, href, src, type?, album?, category?, author?, time?,
 * comments? }` as `<lw-media-gallery>` takes them: `src` the thumbnail,
 * `album` or `category` as `{ title, href }`, `time` an ISO date and time,
 * or text to show as it is, and `author` a member as `<lw-user-hover-card>`
 * takes one, or a name alone, which stays plain text.
 *
 * @attr {Array<object>} items - The media, most talked about first (JSON)
 * @attr {string} heading - The title
 * @attr {string} period - The time the media trends over, across from the title; none when empty
 * @attr {number} level - Heading level of the title, 1 to 6
 * @csspart frame - The outer frame
 * @csspart row - A media's row
 */
export class LwTrendingMedia extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    heading: { default: 'Trending media' },
    period: { default: 'This week' },
    level: { type: Number, default: 2 },
  };

  render() {
    return '<section class="frame" part="frame" aria-labelledby="title"></section>';
  }

  connected() {
    tickTimes(this.shadowRoot, this.signal);
    // A thumbnail that will not load shows a placeholder.
    this.query('.frame').addEventListener('error', (event) => {
      if (event.target.classList?.contains('photo')) event.target.closest('.thumb').toggleAttribute('data-broken', true);
    }, { capture: true, signal: this.signal });
  }

  updated() {
    const items = (Array.isArray(this.items) ? this.items : []).filter((item) => item && typeof item === 'object' && item.title);
    const level = Math.round(this.level) >= 1 && Math.round(this.level) <= 6 ? Math.round(this.level) : 2;
    const rows = items.length
      ? `<ol class="rows" role="list">${items.map((item) => this.#rowMarkup(item, Math.min(level + 1, 6))).join('')}</ol>`
      : '<p class="empty">Nothing is trending yet.</p>';
    this.query('.frame').innerHTML = `<div class="head"><h${level} class="title" id="title">${escapeHtml(this.heading ?? '')}</h${level}>${this.period ? `<span class="period">${escapeHtml(this.period)}</span>` : ''}</div>
<div class="card">${rows}</div>`;
  }

  #rowMarkup(item, level) {
    const author = memberOf(item.author);
    const comments = countOf(item.comments);
    const mark = MARKS[item.type];
    const where = item.album ?? item.category;
    const whereMarkup = where?.title ? `<p class="where">in ${where.href ? `<a class="where-link" href="${escapeHtml(where.href)}">${escapeHtml(where.title)}</a>` : escapeHtml(where.title)}</p>` : '';
    const by = [author ? memberMarkup(author, item.author) : '', timeMarkup(item.time)].filter(Boolean).join('<span class="sep" aria-hidden="true">·</span>');
    const count = comments !== null ? `<span class="comments"${comments === 0 ? ' data-none' : ''}>${strokeIcon(messageCircle, 13)}${countMarkup(comments)}<span class="visually-hidden"> ${comments === 1 ? 'comment' : 'comments'}</span></span>` : '';
    const kind = mark ? `<span class="visually-hidden">, ${item.type === 'embed' ? 'embed' : item.type}</span>` : '';
    return `<li class="row" part="row"><span class="thumb"${item.src ? '' : ' data-broken'}>${item.src ? `<img class="photo" src="${escapeHtml(item.src)}" alt="" loading="lazy" decoding="async">` : ''}<span class="broken" aria-hidden="true">${strokeIcon(imageOff, 16)}</span>${mark ? `<span class="mark" aria-hidden="true">${strokeIcon(mark, 11)}</span>` : ''}</span>
<div class="text"><h${level} class="name"><a class="link" href="${escapeHtml(item.href ?? '#')}">${escapeHtml(item.title)}${kind}</a></h${level}>${whereMarkup}<p class="meta"><span class="by">${by}</span>${count}</p></div></li>`;
  }
}
