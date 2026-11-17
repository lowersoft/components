import { escapeHtml } from '../../core/dom.js';
import { avatarMarkup, DEMO_MEMBERS, memberMarkup, memberOf, minutesAgo, tickTimes, timeMarkup } from '../../core/forum.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import '../textarea/index.js';
import '../user-hover-card/index.js';
import styles from './profile-posts.scss?inline';

// The longest status, in characters.
const MAX_LENGTH = 420;

const DEMO_POSTS = [
  {
    author: DEMO_MEMBERS.maya,
    recipient: DEMO_MEMBERS.leo,
    text: 'Thanks for testing the reconnect fix on a train! The logs you sent pinned it down in an afternoon.',
    time: minutesAgo(25),
    href: '/p/2214',
  },
  {
    author: DEMO_MEMBERS.p0unter,
    text: 'The forum categories page is in: folding groups, sub-forums, and a member card on every name.',
    image: 'https://raw.githubusercontent.com/lowersoft/.github/refs/heads/main/bg_1.jpg',
    alt: 'The Lowersoft banner',
    time: minutesAgo(3 * 60 + 10),
    href: '/p/2213',
  },
  {
    author: DEMO_MEMBERS.ana,
    recipient: DEMO_MEMBERS.p0unter,
    text: 'My kanban board on LowerSync has been stuck on "Reconnecting" since this morning, on both iOS and the web.\n\nNothing changed on my side: same keys, same region. The status page says all clear. Is there anything I can try before I open a ticket, or a log I should send along with it?',
    time: minutesAgo(9 * 60),
    href: '/p/2209',
  },
  {
    author: DEMO_MEMBERS.theo,
    recipient: DEMO_MEMBERS.maya,
    text: 'eu-west is provisioning again. Deploys that were stuck went through on a retry.',
    time: minutesAgo(26 * 60),
    href: '/p/2201',
  },
  {
    author: DEMO_MEMBERS.priya,
    text: 'Slides from the passkeys talk are up on my profile.',
    time: minutesAgo(3 * 24 * 60 + 40),
    href: '/p/2188',
  },
];

/**
 * The latest posts members left on profiles: each with its author's avatar
 * and name, the member it was left for, after an arrow, its text, any
 * picture, and when, leading to the post. Text longer than four lines folds
 * under Show more. Rest the pointer on a name and the member's card opens
 * over it; the times count on as the page stays open.
 *
 * With `user`, the member signed in, a field at the top updates their
 * status: its Post button shows once it is in use, and ⌘ or Ctrl and Enter
 * posts as well. `lw-post` fires first, and unless it is cancelled the post
 * goes to the top of the list at once, so a page cancels it only to put it
 * there itself once its server has it.
 *
 * Posts are `{ author, recipient?, text, image?, alt?, time, href? }`:
 * members as `<lw-user-hover-card>` takes them, or names alone, which stay
 * plain text, `image` a picture's URL with `alt` its description, `time` an
 * ISO date and time, or text to show as it is, and `href` the post.
 *
 * @attr {Array<object>} posts - The posts, latest first (JSON)
 * @attr {object} user - The member signed in, who can post a status; none for a guest (JSON)
 * @attr {string} heading - The title; with none, no head, as when the page around it names the posts
 * @attr {string} placeholder - The status field's placeholder
 * @attr {string} empty - What shows while there are no posts
 * @attr {number} level - Heading level of the title, 1 to 6
 * @fires lw-post - Before a status is posted; `detail: { text }`. Cancelable.
 * @csspart frame - The outer frame
 * @csspart post - A post
 */
export class LwProfilePosts extends LwElement {
  static styles = styles;
  static props = {
    posts: { type: Object, default: DEMO_POSTS },
    user: { type: Object },
    heading: { default: 'Latest profile posts' },
    placeholder: { default: 'Update your status…' },
    empty: { default: 'No profile posts yet.' },
    level: { type: Number, default: 2 },
  };

  render() {
    return `<section class="frame" part="frame" aria-labelledby="title"><div class="head"><h2 class="title" id="title"></h2></div>
<div class="card"><form class="compose" novalidate hidden><span class="compose-avatar"></span><div class="compose-body"><lw-textarea class="status" label="Update your status" rows="1" autosize max-rows="6" resize="none" maxlength="${MAX_LENGTH}"></lw-textarea><div class="compose-fold"><div class="compose-actions"><lw-button class="send" type="submit" size="sm" disabled shortcut="mod+enter" passive>Post</lw-button></div></div></div></form><div class="list"></div></div></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    const form = this.query('.compose');
    const status = this.query('.status');

    // The field sends the form on ⌘ or Ctrl and Enter itself.
    status.addEventListener('input', () => this.#paintCompose(), options);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.#post();
    }, options);

    this.query('.list').addEventListener('click', (event) => {
      const more = event.target.closest('.more');
      if (more) this.#unfold(more);
    }, options);

    // Text that no longer needs folding, or now does, as the width changes.
    const resize = new ResizeObserver(() => this.#paintFolds());
    resize.observe(this.query('.list'));
    this.signal.addEventListener('abort', () => resize.disconnect());

    tickTimes(this.shadowRoot, this.signal);
  }

  updated(changed) {
    if (changed.has('heading') || changed.has('level')) this.#paintHeading();
    if (changed.has('user')) this.#paintUser();
    if (changed.has('placeholder')) this.query('.status').placeholder = this.placeholder ?? '';
    if (changed.has('posts') || changed.has('empty')) this.#build();
  }

  get #user() {
    return memberOf(this.user);
  }

  #paintHeading() {
    const level = Math.round(this.level) >= 1 && Math.round(this.level) <= 6 ? Math.round(this.level) : 2;
    const old = this.query('.title');
    const title = document.createElement(`h${level}`);
    title.className = 'title';
    title.id = 'title';
    title.textContent = this.heading ?? '';
    old.replaceWith(title);
    this.query('.head').hidden = !this.heading;
  }

  #paintUser() {
    const user = this.#user;
    this.query('.compose').hidden = !user;
    this.query('.compose-avatar').innerHTML = user ? avatarMarkup(user) : '';
  }

  // The Post button shows while the field is in use, and works once it holds
  // more than spaces.
  #paintCompose() {
    const text = this.query('.status').value ?? '';
    this.query('.compose').toggleAttribute('data-filled', text.length > 0);
    this.query('.send').disabled = !text.trim();
  }

  #post() {
    const user = this.#user;
    const status = this.query('.status');
    const text = (status.value ?? '').trim();
    if (!user || !text) return;
    if (!this.emit('post', { text })) return;
    status.value = '';
    this.#paintCompose();
    this.posts = [{ author: this.user, text, time: new Date().toISOString() }, ...(Array.isArray(this.posts) ? this.posts : [])];
  }

  #build() {
    const level = Math.round(this.level) >= 1 && Math.round(this.level) <= 5 ? Math.round(this.level) + 1 : 3;
    const posts = (Array.isArray(this.posts) ? this.posts : []).filter((post) => post && typeof post === 'object' && memberOf(post.author));
    this.query('.list').innerHTML = posts.length
      ? `<ol class="posts" role="list">${posts.map((post, index) => this.#postMarkup(post, index, level)).join('')}</ol>`
      : `<p class="empty">${escapeHtml(this.empty ?? '')}</p>`;
    this.#paintFolds();
  }

  #postMarkup(post, index, level) {
    const author = memberOf(post.author);
    const recipient = memberOf(post.recipient);
    const to = recipient ? `<span class="to" aria-hidden="true">${strokeIcon(chevronRight, 12)}</span><span class="visually-hidden"> to </span>${memberMarkup(recipient, post.recipient)}` : '';
    const image = post.image ? `<img class="image" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.alt ?? '')}" decoding="async" loading="lazy">` : '';
    const text = post.text ? `<p class="text" id="text-${index}">${escapeHtml(post.text)}</p><button class="more" type="button" aria-expanded="false" aria-controls="text-${index}" hidden>Show more</button>` : '';
    return `<li class="post" part="post">${avatarMarkup(author)}<article class="body"><h${level} class="who">${memberMarkup(author, post.author)}${to}</h${level}>${text}${image}<p class="meta">${timeMarkup(post.time, post.href)}</p></article></li>`;
  }

  // Shows Show more under text cut off at four lines, and only there.
  #paintFolds() {
    for (const text of this.shadowRoot.querySelectorAll('.text:not([data-open])')) {
      text.nextElementSibling.hidden = text.scrollHeight <= text.clientHeight + 1;
    }
  }

  #unfold(button) {
    const text = this.query(`#${button.getAttribute('aria-controls')}`);
    const open = !text.hasAttribute('data-open');
    text.toggleAttribute('data-open', open);
    button.ariaExpanded = String(open);
    button.textContent = open ? 'Show less' : 'Show more';
  }
}
