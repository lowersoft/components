import { parseDate } from '../../core/dates.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { calendarDays, mapPin, messageCircle } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { hueOf, initialsOf } from '../../core/people.js';
import '../button/index.js';
import '../follow-button/index.js';
import styles from './user-hover-card.scss?inline';

// How long the pointer rests on a name before its card opens, and how long
// an open card waits for the pointer to come back once it leaves (ms).
const OPEN_MS = 450;
const CLOSE_MS = 250;
// A name pointed at within this long of a card closing opens its own card
// at once, as when running down the names of a thread (ms).
const WARM_MS = 500;
// The card's distance from the name, and the least room it keeps to the
// window's edges (px).
const GAP = 8;
const EDGE = 8;
const ENTER = { duration: 180, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };
const LEAVE = { duration: 120, easing: 'cubic-bezier(0.4, 0, 1, 1)' };

const STATUSES = { online: 'Online', away: 'Away', busy: 'Do not disturb' };
const STATS = [
  ['posts', 'Posts'],
  ['reactions', 'Reactions'],
  ['solutions', 'Solutions'],
];
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

const DEMO_USER = {
  name: 'Maya Chen',
  handle: 'mayachen',
  href: '/u/mayachen',
  role: 'Moderator',
  status: 'online',
  bio: 'Keeps LowerSync honest offline. Ask me about conflict resolution, CRDTs and the iOS background task budget.',
  posts: 1208,
  reactions: 8420,
  solutions: 96,
  joined: '2022-03-14',
  location: 'Lisbon',
};

// The card open on the page, which another card opening closes, and when
// the last one closed.
let current = null;
let closedAt = -Infinity;

const tag = (name, attributes, content) => `<${name}${attributes}>${content}</${name}>`;

/**
 * A member's card over their name in a forum. Rest the pointer on the name
 * and the card opens over the line you point at, or under it with no room
 * above, kept inside the window: their banner and avatar, name, role and
 * whether they are around, their bio, their posts, reactions and accepted
 * solutions, when they joined and where they are, and Follow and Message.
 * The pointer can cross to the card and use it; leaving both closes it.
 * Moving straight on to another name opens its card at once.
 *
 * Put the name inside, as a link to their profile: keyboard focus on it
 * opens the card too, Tab goes on into it, and Escape closes it. On a touch
 * screen the first tap on the name opens the card and the next follows the
 * link. With nothing inside, it shows the name, linked to `href`.
 *
 * The user is `{ name, handle?, href?, avatar?, banner?, role?, status?,
 * seen?, bio?, posts?, reactions?, solutions?, joined?, location? }`:
 * `avatar` and `banner` pictures' URLs (initials on a tint, and a gradient
 * in their colour, without them), `status` online, away or busy, else
 * `seen` such as "3h ago", and `joined` an ISO date. `lw-open` fires as a
 * card opens, so a page can fill in the rest of `user` only for the cards
 * people open.
 *
 * @attr {object} user - The member (JSON)
 * @attr {boolean} followed - This viewer follows them
 * @attr {boolean} open - The card is open; set it to open or close the card
 * @slot - The name, as a link to their profile
 * @csspart trigger - The name's box
 * @csspart card - The card
 * @fires lw-open - The card opened
 * @fires lw-close - The card closed
 * @fires lw-change - Before following or unfollowing; `detail: { followed }` is the new state. Cancelable.
 * @fires lw-message - Message was pressed
 */
export class LwUserHoverCard extends LwElement {
  static styles = styles;
  static props = {
    user: { type: Object, default: DEMO_USER },
    followed: { type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true },
  };

  #timer = 0;
  #frame = 0;
  #built = false;
  // The pointer is over the name or the card.
  #hovered = false;
  // Keyboard focus is on the name or in the card, which keeps it open.
  #focused = false;
  // Focus put back on the name by Escape, which must not open it again.
  #quiet = false;
  // The last press on the name was a touch.
  #touch = false;
  // Where the pointer was over the name, and the line of it the card stands over.
  #point = null;
  #line = 0;
  // The fade while the card closes.
  #leaving = null;
  // Ends the page's listeners the open card needs.
  #watching = null;

  render() {
    return `<span class="trigger" part="trigger"><slot><a class="fallback"></a></slot></span><div class="card" part="card" popover="manual" role="dialog" aria-labelledby="name"></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const trigger = this.query('.trigger');
    const card = this.query('.card');

    // The host holds the name and the card, and the card the gap to the
    // name, so the pointer can go from one to the other.
    this.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return;
      this.#hovered = true;
      this.#point = this.open ? this.#point : { x: event.clientX, y: event.clientY };
      // The pictures start loading while the pointer rests.
      this.#build();
      this.#schedule(true);
    }, options);
    trigger.addEventListener('pointermove', (event) => {
      if (!this.open) this.#point = { x: event.clientX, y: event.clientY };
    }, options);
    this.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'touch') return;
      this.#hovered = false;
      if (!this.#focused) this.#schedule(false);
    }, options);

    // A tap opens the card first, and only a second one follows the link.
    trigger.addEventListener('pointerdown', (event) => (this.#touch = event.pointerType === 'touch'), options);
    trigger.addEventListener('click', (event) => {
      if (!this.#touch || this.open) return;
      event.preventDefault();
      this.#point = { x: event.clientX, y: event.clientY };
      this.#build();
      this.open = true;
    }, options);

    this.addEventListener('focusin', (event) => {
      const target = event.composedPath()[0];
      if (this.#quiet || !target.matches(':focus-visible')) return;
      this.#focused = true;
      if (this.open || card.contains(target)) return;
      clearTimeout(this.#timer);
      this.#point = null;
      this.#build();
      this.open = true;
    }, options);
    this.addEventListener('focusout', (event) => {
      // Focus moving within the name or the card, retargeted to the host.
      const next = event.relatedTarget;
      if (next && (next === this || this.contains(next))) return;
      this.#focused = false;
      if (!this.#hovered) this.open = false;
    }, options);

    card.addEventListener('lw-change', (event) => {
      if (!event.composedPath()[0].matches?.('.follow')) return;
      // The card's own event stands for the button's.
      event.stopPropagation();
      if (!this.emit('change', { followed: event.detail.following })) event.preventDefault();
      else this.followed = event.detail.following;
    }, options);
    card.addEventListener('click', (event) => event.target.closest?.('.message') && this.emit('message'), options);

    this.signal.addEventListener('abort', () => {
      clearTimeout(this.#timer);
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
      this.#leaving?.cancel();
      this.#leaving = null;
      this.#watching?.abort();
      this.#watching = null;
      if (card.matches(':popover-open')) card.hidePopover();
      if (current === this) current = null;
      this.#hovered = false;
      this.#focused = false;
      this.open = false;
    });
  }

  updated(changed) {
    if (changed.has('user')) {
      const user = this.#user;
      const fallback = this.query('.fallback');
      fallback.textContent = user.name;
      if (user.href) fallback.href = user.href;
      else fallback.removeAttribute('href');
      if (this.#built) {
        this.#built = false;
        this.#build();
        if (this.open) this.#place();
      }
    }
    if (changed.has('followed') && this.#built) this.query('.follow').following = Boolean(this.followed);
    if (changed.has('open')) {
      if (this.open) this.#reveal();
      else this.#conceal();
    }
  }

  get #user() {
    const user = this.user && typeof this.user === 'object' ? this.user : {};
    return { ...user, name: String(user.name ?? '') };
  }

  // Opens or closes the card after the pointer has rested, at once when
  // another card is open or has just closed.
  #schedule(open) {
    clearTimeout(this.#timer);
    if (open === Boolean(this.open)) return;
    const warm = open && (current !== null || performance.now() - closedAt < WARM_MS);
    if (warm) {
      this.open = true;
      return;
    }
    this.#timer = setTimeout(() => (this.open = open), open ? OPEN_MS : CLOSE_MS);
  }

  // Writes the card's content, once and again when `user` changes.
  #build() {
    if (this.#built) return;
    this.#built = true;
    const user = this.#user;
    const name = escapeHtml(user.name);
    const hue = hueOf(user.name);
    const status = STATUSES[user.status] ? user.status : '';
    const handle = user.handle ? `<span class="handle">@${escapeHtml(String(user.handle).replace(/^@/, ''))}</span>` : '';
    const seen = status ? STATUSES[status] : user.seen ? `Active ${escapeHtml(user.seen)}` : '';
    const meta = handle || seen ? `<p class="meta">${handle}${seen ? `<span class="seen" data-status="${status || 'offline'}">${seen}</span>` : ''}</p>` : '';
    const photo = user.avatar ? `<img class="photo" src="${escapeHtml(user.avatar)}" alt="" decoding="async">` : escapeHtml(initialsOf(user.name));
    const stats = STATS.filter(([key]) => Number.isFinite(user[key]));
    const joined = parseDate(user.joined);
    const facts = [
      joined && `<span class="fact">${strokeIcon(calendarDays, 14)}Joined ${monthYear.format(new Date(`${joined}T00:00:00Z`))}</span>`,
      user.location && `<span class="fact">${strokeIcon(mapPin, 14)}${escapeHtml(user.location)}</span>`,
    ].filter(Boolean);
    this.query('.card').innerHTML = `<div class="banner" style="--_hue: ${hue}" aria-hidden="true">${user.banner ? `<img class="banner-photo" src="${escapeHtml(user.banner)}" alt="" decoding="async">` : ''}</div>
<div class="body"><div class="top"><span class="avatar" style="--_hue: ${hue}" aria-hidden="true">${photo}${status ? `<span class="dot" data-status="${status}"></span>` : ''}</span>
<div class="actions"><lw-follow-button class="follow" size="sm"${this.followed ? ' following' : ''}></lw-follow-button><lw-button class="message" variant="outline" size="sm" icon-only><span class="icon" slot="start">${strokeIcon(messageCircle, 16)}</span><span class="visually-hidden">Message ${name}</span></lw-button></div></div>
<div class="who"><p class="name-row">${tag(user.href ? 'a' : 'span', ` class="name" id="name"${user.href ? ` href="${escapeHtml(user.href)}"` : ''}`, name)}${user.role ? `<span class="role">${escapeHtml(user.role)}</span>` : ''}</p>${meta}</div>
${user.bio ? `<p class="bio">${escapeHtml(user.bio)}</p>` : ''}
${stats.length ? `<dl class="stats">${stats.map(([key, label]) => `<div class="stat"><dt>${label}</dt><dd title="${user[key].toLocaleString('en-US')}">${compact.format(user[key])}</dd></div>`).join('')}</dl>` : ''}
${facts.length ? `<p class="facts">${facts.join('')}</p>` : ''}</div>`;
  }

  #reveal() {
    const card = this.query('.card');
    this.#build();
    if (current && current !== this) current.open = false;
    current = this;
    // Pointed at again while fading out, it comes back.
    if (this.#leaving) {
      this.#leaving.cancel();
      this.#leaving = null;
    }
    if (card.matches(':popover-open')) {
      this.#place();
      return;
    }
    card.showPopover();
    this.#watch();
    const side = this.#place();
    if (!side) return;
    if (!reducedMotion.matches) card.animate({ opacity: [0, 1], scale: [0.96, 1], translate: [`0 ${side === 'top' ? 6 : -6}px`, '0 0'] }, ENTER);
    this.emit('open');
  }

  #conceal() {
    clearTimeout(this.#timer);
    this.#focused = false;
    if (current === this) {
      current = null;
      closedAt = performance.now();
    }
    const card = this.query('.card');
    if (!card.matches(':popover-open') || this.#leaving) return;
    const close = () => {
      this.#watching?.abort();
      this.#watching = null;
      card.hidePopover();
      this.emit('close');
    };
    if (reducedMotion.matches) {
      close();
      return;
    }
    const leaving = card.animate({ opacity: [1, 0], scale: [1, 0.98] }, LEAVE);
    this.#leaving = leaving;
    leaving.finished.then(() => {
      if (this.#leaving !== leaving) return;
      this.#leaving = null;
      close();
    }, () => {});
  }

  // While the card is open, a press elsewhere or Escape closes it, and it
  // follows its name as the page scrolls or the window resizes.
  #watch() {
    this.#watching?.abort();
    this.#watching = new AbortController();
    const options = { signal: this.#watching.signal };
    const card = this.query('.card');
    document.addEventListener('pointerdown', (event) => {
      if (this.open && !event.composedPath().includes(this)) this.open = false;
    }, options);
    // Escape, unless a menu inside closed on it first, puts focus that was
    // in the card back on the name.
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !this.open || event.defaultPrevented) return;
      const inside = card.contains(this.shadowRoot.activeElement);
      this.open = false;
      if (!inside) return;
      this.#quiet = true;
      (this.querySelector('a[href], button, [tabindex]') ?? this.query('.fallback[href]'))?.focus();
      this.#quiet = false;
    }, options);
    const follow = () => {
      if (!this.open || this.#frame) return;
      this.#frame = requestAnimationFrame(() => {
        this.#frame = 0;
        if (this.open) this.#place();
      });
    };
    addEventListener('scroll', follow, { ...options, capture: true, passive: true });
    addEventListener('resize', follow, options);
  }

  // Stands the card over the line of the name pointed at, centred on it,
  // or under it when there is no room above; inside the window either way.
  // Returns the side, or nothing when the name has left the window.
  #place() {
    const card = this.query('.card');
    const lines = [...this.query('.trigger').getClientRects()].filter((rect) => rect.width || rect.height);
    if (this.#point && lines.length) {
      const { y } = this.#point;
      const distance = (rect) => (y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0);
      this.#line = lines.reduce((best, rect, index) => (distance(rect) < distance(lines[best]) ? index : best), 0);
      this.#point = null;
    }
    const line = lines[Math.min(this.#line, lines.length - 1)];
    const { clientWidth: width, clientHeight: height } = document.documentElement;
    if (!line || line.bottom < 0 || line.top > height) {
      this.open = false;
      return '';
    }
    const { offsetWidth: cardWidth, offsetHeight: cardHeight } = card;
    const centre = line.left + line.width / 2;
    const left = Math.max(EDGE, Math.min(centre - cardWidth / 2, width - cardWidth - EDGE));
    const above = line.top - GAP - cardHeight >= EDGE || line.top >= height - line.bottom;
    card.style.left = `${left}px`;
    // Above, its lower edge is set, so the gap holds whatever its height.
    card.style.top = above ? 'auto' : `${line.bottom + GAP}px`;
    card.style.bottom = above ? `${height - line.top + GAP}px` : 'auto';
    card.style.transformOrigin = `${Math.max(0, Math.min(centre - left, cardWidth))}px ${above ? '100%' : '0'}`;
    card.dataset.side = above ? 'top' : 'bottom';
    return card.dataset.side;
  }
}
