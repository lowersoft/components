import { writeClipboard } from '../../core/clipboard.js';
import { escapeHtml } from '../../core/dom.js';
import { avatarMarkup, countOf, DEMO_MEMBERS, formatWhole, memberMarkup, memberOf, minutesAgo, pagerMarkup, tickTimes, timeMarkup } from '../../core/forum.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowUpRight, bell, check, chevronRight, circleCheck, copy, download, eye, file, link2, messageCircle, reply } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { renderMarkdown } from '../../core/markdown.js';
import { reducedMotion } from '../../core/motion.js';
import { hueOf } from '../../core/people.js';
import '../button/index.js';
import '../post-composer/index.js';
import '../reaction-button/index.js';
import '../user-hover-card/index.js';
import styles from './forum-thread.scss?inline';

const STATUSES = { online: 'Online', away: 'Away', busy: 'Do not disturb' };

// How long a copied link says so (ms).
const COPIED_MS = 1600;

const REACTIONS = [
  { emoji: '👍', name: 'Like' },
  { emoji: '❤️', name: 'Love' },
  { emoji: '😂', name: 'Haha' },
  { emoji: '😮', name: 'Wow' },
  { emoji: '🎉', name: 'Hooray' },
];

const M = DEMO_MEMBERS;
const P0UNTER = { ...M.p0unter, title: 'Founder', badges: ['Core team'] };
const MAYA = { ...M.maya, title: 'Sync whisperer', badges: ['Licensed customer'] };
const SAM = { ...M.sam, title: 'Release captain' };
const LEO = { ...M.leo, title: 'Well-known member', badges: ['Licensed customer'] };

const DEMO_THREAD = {
  title: 'LowerSync Recovery Kit',
  label: 'Beta 4',
  href: '/r/lowersync-recovery-kit',
  breadcrumbs: [
    { label: 'Home', href: '/' },
    { label: 'Forums', href: '/forums' },
    { label: 'LowerSync', href: '/c/lowersync' },
    { label: 'Resources', href: '/c/lowersync/resources' },
  ],
  author: P0UNTER,
  time: minutesAgo(5 * 60 + 12),
  replies: 3,
  views: 1284,
  action: { label: 'Download', icon: 'download', href: '/r/lowersync-recovery-kit/download' },
};

const DEMO_TABS = [
  { id: 'overview', label: 'Overview', href: '/r/lowersync-recovery-kit' },
  { id: 'faq', label: 'FAQ', href: '/r/lowersync-recovery-kit/faq' },
  { id: 'updates', label: 'Updates', count: 1, href: '/r/lowersync-recovery-kit/updates' },
  { id: 'history', label: 'History', href: '/r/lowersync-recovery-kit/history' },
  { id: 'discussion', label: 'Discussion', href: '/r/lowersync-recovery-kit/discussion' },
];

const DEMO_POSTS = [
  {
    id: 'post-1',
    author: P0UNTER,
    time: minutesAgo(5 * 60 + 12),
    href: '/r/lowersync-recovery-kit/discussion#post-1',
    body: [
      'p0unter submitted a new resource:',
      { type: 'link', title: 'LowerSync Recovery Kit', href: '/r/lowersync-recovery-kit', text: 'Replay changes stranded in an offline queue after a crash, a reinstall or a schema migration.' },
      {
        type: 'quote',
        text: 'This brought back a week of edits on two of our own apps. After running it and reopening the app, every change made offline was where it should be.\n\nBack up the queue first.\n\nSometimes a change shows up on the device that made it and nowhere else: the queue still holds it, but its upload was cut off mid-batch. If the queue file is still on the device, the kit can read it, rebuild the batches and send them again, without anyone redoing their work.\n\nIt runs in three steps: scan, review, replay. The scan only reads; nothing is sent until you approve the replay.',
      },
    ],
    more: { label: 'Read more about this resource', href: '/r/lowersync-recovery-kit' },
    reactions: { '👍': 24, '❤️': 9, '🎉': 6 },
  },
  {
    id: 'post-2',
    author: MAYA,
    time: minutesAgo(2 * 60 + 40),
    href: '/r/lowersync-recovery-kit/discussion#post-2',
    body: [
      'The scan only handles 25 items and then stops. I have to press "Replay next batch" each time to go on.\n\nIs this how it is supposed to work?',
      { type: 'image', src: 'https://raw.githubusercontent.com/lowersoft/.github/refs/heads/main/bg_1.jpg', alt: 'The recovery kit after a scan, waiting on the next batch', caption: 'Run #1, after the scan' },
      { type: 'code', language: 'shell', text: 'lowersync recover scan --queue ./offline.db\n✓ 25 of 312 changes checked\n→ replay next batch to continue' },
    ],
    reactions: { '👍': 3 },
  },
  {
    id: 'post-3',
    author: SAM,
    time: minutesAgo(48),
    href: '/r/lowersync-recovery-kit/discussion#post-3',
    solution: true,
    body: [
      { type: 'quote', author: 'Maya Chen', href: '#post-2', text: 'The scan only handles 25 items and then stops. I have to press "Replay next batch" each time to go on.' },
      'That is on purpose: a batch of 25 keeps each replay inside the background task budget on iOS. Pass --batch to raise it where you have the time:',
      { type: 'code', language: 'shell', text: 'lowersync recover scan --queue ./offline.db --batch 200' },
      'Beta 5 will remember the size you choose.',
    ],
    reactions: { '👍': 11, '❤️': 2 },
    reaction: '👍',
  },
  {
    id: 'post-4',
    author: LEO,
    time: minutesAgo(12),
    edited: minutesAgo(9),
    href: '/r/lowersync-recovery-kit/discussion#post-4',
    body: ['Worked here with --batch 150 on an iPhone 12. 312 changes replayed in under a minute.'],
  },
];

// A post's body as blocks, from text or a list of them.
const blocksOf = (body) => (Array.isArray(body) ? body : body == null ? [] : [body]).map((block) => (typeof block === 'string' ? { type: 'text', text: block } : block)).filter((block) => block && typeof block === 'object');

// Text as paragraphs, a blank line between them, its own line breaks kept.
const textMarkup = (text) =>
  String(text ?? '')
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.trim())
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
    .join('');

const fileSize = (size) => (size < 1024 ? `${size} B` : size < 1024 ** 2 ? `${Math.round(size / 1024)} KB` : `${Math.round((size / 1024 ** 2) * 10) / 10} MB`);

const blockMarkup = (block, id, mentions) => {
  switch (block.type) {
    case 'markdown':
      return `<div class="markdown">${renderMarkdown(block.text, { mentions })}</div>`;
    case 'attachments':
      return `<ul class="attachments" role="list" aria-label="Attachments">${(Array.isArray(block.files) ? block.files : [])
        .map((item) => {
          const label = `<span class="attachment-icon" aria-hidden="true">${strokeIcon(file, 15)}</span><span class="attachment-text"><span class="attachment-name">${escapeHtml(item.name ?? 'File')}</span>${Number.isFinite(item.size) ? `<span class="attachment-size">${fileSize(item.size)}</span>` : ''}</span>`;
          return `<li>${item.href ? `<a class="attachment" href="${escapeHtml(item.href)}" download="${escapeHtml(item.name ?? '')}">${label}</a>` : `<span class="attachment">${label}</span>`}</li>`;
        })
        .join('')}</ul>`;
    case 'quote': {
      const by = block.author ? `<p class="quote-by">${escapeHtml(block.author)} said:${block.href ? `<a class="quote-jump" href="${escapeHtml(block.href)}" aria-label="Go to the post quoted">${strokeIcon(arrowUpRight, 12)}</a>` : ''}</p>` : '';
      return `<blockquote class="quote">${by}<div class="quote-text" id="${id}">${textMarkup(block.text)}</div><button class="expand" type="button" aria-expanded="false" aria-controls="${id}" hidden>Show the whole quote</button></blockquote>`;
    }
    case 'image':
      return block.src ? `<figure class="figure"><a class="image-link" href="${escapeHtml(block.src)}" target="_blank" rel="noopener noreferrer"><img class="image" src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt ?? '')}" loading="lazy" decoding="async"><span class="visually-hidden"> (opens in a new tab)</span></a>${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}</figure>` : '';
    case 'code':
      return `<div class="code"><div class="code-head"><span class="code-language">${escapeHtml(block.language ?? 'code')}</span><button class="copy" type="button" data-copy="${escapeHtml(block.text ?? '')}">${strokeIcon(copy, 13)}<span class="copy-label">Copy</span></button></div><pre><code>${escapeHtml(block.text ?? '')}</code></pre></div>`;
    case 'link':
      return `<a class="link-card" href="${escapeHtml(block.href ?? '#')}"><span class="link-icon" aria-hidden="true">${strokeIcon(link2, 16)}</span><span class="link-text"><span class="link-title">${escapeHtml(block.title ?? block.href ?? '')}</span>${block.text ? `<span class="link-summary">${escapeHtml(block.text)}</span>` : ''}</span></a>`;
    default:
      return textMarkup(block.text);
  }
};

// The pages to offer: the first, the last, and those around the current one,
// with a gap where some are left out.
/**
 * A thread on a forum. Its head holds the way to it, its title with a label
 * such as a version, who started it and when, its replies and views, Watch,
 * and its main action, such as Download, kept readable with the reason when
 * it is not allowed; tabs under it lead to the thread's other pages.
 *
 * Each post carries its author beside it, their avatar with whether they
 * are around, their name, title, role and badges. The body takes
 * paragraphs, markdown, quotes that fold past a few lines, pictures, code
 * with a button to copy it, links to a resource and files. At its lower
 * left the foot holds Reply, with reactions on the posts of the member who
 * started the thread, or on every post with `react-on="all"`; at its lower
 * right when it was posted and edited, and, while the post is pointed at or
 * holds the focus, a button that copies its link and its number. The
 * thread's author is marked on their later posts, and the post that solved
 * it stands out. Pages of posts, when there are more, are offered above
 * and below.
 *
 * With `user` signed in, `<lw-post-composer>` at the end writes a reply in
 * markdown with files, the thread's members to mention: `lw-post` fires
 * first, and unless it is cancelled the reply goes up at once. Reply across
 * from the tabs, or at the top right without them, takes you to it; a
 * post's Reply mentions its author there. A guest sees neither.
 *
 * Every name opens the member's card, and the times count on as the page
 * stays open. Beside a post its author keeps in view as the page scrolls
 * past it; narrower than 44rem the author stands over the post instead.
 * With `headless` the thread leaves its head out, and only its title, who
 * started it and when stand over the posts, across from Reply.
 *
 * The thread is `{ title, label?, href?, breadcrumbs?, author, time,
 * replies?, views?, action? }`, `action` as `{ label, icon?, href?,
 * disabled?, reason? }` with `icon` download or none. Tabs are `{ id, label,
 * href, count? }`. Posts are `{ id?, author, time, edited?, href?, body,
 * reactions?, reaction?, solution?, more? }`: `body` text, or a list of
 * text and blocks, `{ type: 'markdown', text }`, `{ type: 'quote', text,
 * author?, href? }`, `{ type: 'image', src, alt, caption? }`, `{ type:
 * 'code', text, language? }`, `{ type: 'link', title, href, text? }` and
 * `{ type: 'attachments', files }`, files as `{ name, size?, href? }`;
 * `reactions` counts by emoji, and
 * `more` a link at the foot, `{ label, href }`. Members are as
 * `<lw-user-hover-card>` takes them, with `badges`, a list of labels.
 *
 * @attr {object} thread - The thread (JSON)
 * @attr {Array<object>} tabs - The thread's pages, as tabs under its head (JSON)
 * @attr {string} tab - The id of the tab you are on
 * @attr {Array<object>} posts - The posts on this page, in order (JSON)
 * @attr {number} page - The page of posts you are on
 * @attr {number} pages - How many pages of posts there are
 * @attr {string} page-href - A page's address, with `{page}` for its number
 * @attr {object} user - The member signed in, who can reply (JSON)
 * @attr {boolean} watching - The member signed in watches the thread
 * @attr {'starter'|'all'} react-on - Whose posts take reactions: the member who started the thread's, or everyone's
 * @attr {boolean} headless - Leaves the thread's head out, its way to it, actions and tabs, for a row with its title, who started it and when
 * @attr {number} level - Heading level of the title, 1 to 6
 * @fires lw-action - The main action was pressed; cancel it to keep its `href` from opening. `detail: { action }`. Cancelable.
 * @fires lw-watch - Before watching or unwatching; `detail: { watching }` is the new state. Cancelable.
 * @fires lw-page - A page of posts was picked; cancel it to load the page in place. `detail: { page }`. Cancelable.
 * @fires lw-react - Before a reaction to a post changes; `detail: { post, value }`, `post` its id or number. Cancelable.
 * @fires lw-reply - Reply was pressed, on a post or for the thread; `detail: { post }`, null for the thread
 * @fires lw-share - A post's link was copied; `detail: { post, url }`
 * @fires lw-post - Before a reply goes up; `detail: { text, attachments }`, as `<lw-post-composer>` gives them. Cancelable.
 * @csspart header - The thread's head
 * @csspart post - A post
 * @cssprop --lw-forum-thread-sticky-top - How far below the window's top the authors beside their posts stop, as under a navbar; 1rem by default
 */
export class LwForumThread extends LwElement {
  static styles = styles;
  static props = {
    thread: { type: Object, default: DEMO_THREAD },
    tabs: { type: Object, default: DEMO_TABS },
    tab: { default: 'discussion' },
    posts: { type: Object, default: DEMO_POSTS },
    page: { type: Number, default: 1 },
    pages: { type: Number, default: 1 },
    pageHref: { default: '' },
    user: { type: Object },
    watching: { type: Boolean, reflect: true },
    reactOn: { default: 'starter' },
    headless: { type: Boolean, reflect: true },
    level: { type: Number, default: 1 },
  };

  #copied = new Map();
  // Handles of the members in the thread, to their profiles, for mentions.
  #mentions = new Map();

  render() {
    return `<div class="root"><header class="header" part="header"></header><div class="lead"><div class="lead-title"></div><span class="lead-reply"></span></div><div class="pager pager-top"></div><ol class="posts" role="list"></ol><div class="pager pager-bottom"></div><p class="announce" role="status"></p>
<lw-post-composer class="composer" hidden></lw-post-composer></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const root = this.query('.root');

    root.addEventListener('click', (event) => this.#click(event), options);

    // A reaction, as the thread's, with the post it was on.
    this.query('.posts').addEventListener('lw-change', (event) => {
      const button = event.target.closest?.('lw-reaction-button');
      if (!button) return;
      event.stopPropagation();
      if (!this.emit('react', { post: this.#postKey(button.closest('.post')), value: event.detail?.value ?? null })) event.preventDefault();
    }, options);

    // The composer's post, as the thread's reply.
    this.query('.composer').addEventListener('lw-submit', (event) => {
      event.stopPropagation();
      if (!this.#postReply(event.detail ?? {})) event.preventDefault();
    }, options);

    // Quotes that no longer need folding, or now do, as the width changes.
    const resize = new ResizeObserver(() => this.#paintQuotes());
    resize.observe(this.query('.posts'));
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      for (const timer of this.#copied.values()) clearTimeout(timer);
    });

    tickTimes(this.shadowRoot, this.signal);
  }

  updated(changed) {
    if (['thread', 'tabs', 'tab', 'watching', 'level', 'user', 'headless'].some((name) => changed.has(name))) this.#paintHeader();
    if (changed.has('headless')) this.query('.header').hidden = Boolean(this.headless);
    if (['thread', 'posts', 'page', 'level', 'reactOn', 'user'].some((name) => changed.has(name))) this.#paintPosts();
    if (['page', 'pages', 'pageHref'].some((name) => changed.has(name))) this.#paintPager();
    if (['user', 'thread', 'posts'].some((name) => changed.has(name))) this.#paintUser();
  }

  get #thread() {
    const thread = this.thread && typeof this.thread === 'object' ? this.thread : {};
    return { ...thread, title: String(thread.title ?? '') };
  }

  get #posts() {
    return (Array.isArray(this.posts) ? this.posts : []).filter((post) => post && typeof post === 'object' && memberOf(post.author));
  }

  get #user() {
    return memberOf(this.user);
  }

  get #pages() {
    const pages = Math.max(1, Math.round(countOf(this.pages) ?? 1));
    return { pages, page: Math.min(pages, Math.max(1, Math.round(countOf(this.page) ?? 1))) };
  }

  #postKey(post) {
    const index = Number(post?.dataset.index);
    const data = this.#posts[index];
    return data?.id ?? data?.number ?? index + 1;
  }

  #click(event) {
    const target = event.target;
    const action = target.closest('.action');
    if (action) {
      const data = this.#thread.action ?? {};
      if (!data.disabled && this.emit('action', { action: data }) && data.href) location.assign(data.href);
      return;
    }
    if (target.closest('.watch')) {
      const watching = !this.watching;
      if (this.emit('watch', { watching })) this.watching = watching;
      return;
    }
    const page = target.closest('[data-page]');
    if (page) {
      if (!this.emit('page', { page: Number(page.dataset.page) })) event.preventDefault();
      else if (page.localName === 'button') this.page = Number(page.dataset.page);
      return;
    }
    const expand = target.closest('.expand');
    if (expand) {
      this.#unfold(expand);
      return;
    }
    const copy = target.closest('.copy');
    if (copy) {
      this.#copy(copy, copy.dataset.copy);
      return;
    }
    const share = target.closest('.share');
    if (share) {
      const post = share.closest('.post');
      const href = share.dataset.href;
      const url = new URL(href || `#${post.id}`, location.href).href;
      this.#copy(share, url, () => this.emit('share', { post: this.#postKey(post), url }));
      return;
    }
    if (target.closest('.reply-thread')) {
      this.emit('reply', { post: null });
      this.#answer(null);
      return;
    }
    const replyButton = target.closest('.reply-to');
    if (replyButton) {
      const post = replyButton.closest('.post');
      const author = memberOf(this.#posts[Number(post.dataset.index)]?.author);
      this.emit('reply', { post: this.#postKey(post) });
      this.#answer(author);
    }
  }

  #paintHeader() {
    const thread = this.#thread;
    const level = Math.round(this.level) >= 1 && Math.round(this.level) <= 6 ? Math.round(this.level) : 1;
    const author = memberOf(thread.author);
    const crumbs = (Array.isArray(thread.breadcrumbs) ? thread.breadcrumbs : []).filter((crumb) => crumb?.label);
    const crumbsMarkup = crumbs.length
      ? `<nav class="crumbs" aria-label="Breadcrumb"><ol role="list">${crumbs.map((crumb) => `<li>${crumb.href ? `<a class="crumb" href="${escapeHtml(crumb.href)}">${escapeHtml(crumb.label)}</a>` : `<span class="crumb">${escapeHtml(crumb.label)}</span>`}</li>`).join('')}</ol></nav>`
      : '';
    const replies = countOf(thread.replies);
    const views = countOf(thread.views);
    const meta = [
      author ? `<span class="starter">${avatarMarkup(author)}${memberMarkup(author, thread.author)}</span>` : '',
      thread.time ? `<span>${timeMarkup(thread.time)}</span>` : '',
      replies !== null ? `<span class="stat">${strokeIcon(messageCircle, 13)}<data value="${replies}">${formatWhole(replies)}</data> ${replies === 1 ? 'reply' : 'replies'}</span>` : '',
      views !== null ? `<span class="stat">${strokeIcon(eye, 13)}<data value="${views}">${formatWhole(views)}</data> ${views === 1 ? 'view' : 'views'}</span>` : '',
    ].filter(Boolean).join('');

    const action = thread.action?.label ? thread.action : null;
    const actionMarkup = action
      ? `<lw-button class="action"${action.disabled ? ` disabled${action.reason ? ` disabled-reason="${escapeHtml(action.reason)}"` : ''}` : ''}>${action.icon === 'download' ? `<span class="button-icon" slot="start">${strokeIcon(download, 15)}</span>` : ''}${escapeHtml(action.label)}</lw-button>`
      : '';
    const watch = `<lw-button class="watch" variant="secondary"><span class="button-icon" slot="start">${strokeIcon(this.watching ? check : bell, 15)}</span>${this.watching ? 'Watching' : 'Watch'}</lw-button>`;

    const tabs = (Array.isArray(this.tabs) ? this.tabs : []).filter((tab) => tab?.label);
    const tabsMarkup = tabs.length
      ? `<nav class="tabs" aria-label="${escapeHtml(thread.title || 'Thread')}"><ul class="tablist" role="list">${tabs.map((tab) => {
        const count = countOf(tab.count);
        const current = tab.id === this.tab;
        return `<li><a class="tab" href="${escapeHtml(tab.href ?? '#')}"${current ? ' aria-current="page"' : ''}>${escapeHtml(tab.label)}${count ? `<span class="tab-count">${formatWhole(count)}</span>` : ''}</a></li>`;
      }).join('')}</ul></nav>`
      : '';

    const replyButton = this.#user ? `<lw-button class="reply-thread"><span class="button-icon" slot="start">${strokeIcon(reply, 15)}</span>Reply</lw-button>` : '';
    const inTabs = Boolean(tabsMarkup) && !this.headless;
    // Headless, the row over the posts names the thread, who started it and
    // when, across from Reply.
    const leadMeta = [author ? `<span class="starter">${avatarMarkup(author)}${memberMarkup(author, thread.author)}</span>` : '', thread.time ? `<span>${timeMarkup(thread.time)}</span>` : ''].filter(Boolean).join('<span class="sep" aria-hidden="true">·</span>');
    this.query('.lead-title').innerHTML = this.headless && thread.title ? `<h${level} class="lead-heading">${escapeHtml(thread.title)}</h${level}>${leadMeta ? `<p class="lead-meta">${leadMeta}</p>` : ''}` : '';
    this.query('.lead-reply').innerHTML = inTabs ? '' : replyButton;
    this.query('.lead').toggleAttribute('data-shown', Boolean((this.headless && thread.title) || (!inTabs && replyButton)));
    const header = this.query('.header');
    header.innerHTML = `${crumbsMarkup}<div class="title-row"><div class="title-block"><h${level} class="title">${escapeHtml(thread.title)}${thread.label ? ` <span class="label">${escapeHtml(thread.label)}</span>` : ''}</h${level}>${meta ? `<p class="thread-meta">${meta}</p>` : ''}</div><div class="thread-actions">${watch}${actionMarkup}</div></div>${tabsMarkup ? `<div class="tabs-row">${tabsMarkup}${inTabs ? replyButton : ''}</div>` : ''}`;
    // On a phone the tabs scroll to show the one you are on.
    const scroller = header.querySelector('.tabs');
    const current = scroller?.querySelector('[aria-current]');
    if (current && scroller.scrollWidth > scroller.clientWidth) scroller.scrollLeft = current.offsetLeft - (scroller.clientWidth - current.offsetWidth) / 2;
  }

  #paintPosts() {
    const thread = this.#thread;
    const starter = memberOf(thread.author);
    const sameAs = (a, b) => Boolean(a && b && (a.handle && b.handle ? a.handle === b.handle : a.name === b.name));
    const posts = this.#posts;
    this.#mentions = new Map(this.#participants.filter((member) => member.handle && member.href).map((member) => [member.handle.toLowerCase(), member.href]));
    this.query('.posts').innerHTML = posts.length
      ? posts.map((post, index) => {
        const byStarter = sameAs(memberOf(post.author), starter);
        return this.#postMarkup(post, index, { byStarter: index > 0 && byStarter, reactable: this.reactOn === 'all' || byStarter });
      }).join('')
      : '<li class="empty">No posts yet.</li>';
    this.#paintQuotes();
  }

  #postMarkup(post, index, { byStarter, reactable }) {
    const author = memberOf(post.author);
    const status = STATUSES[author.status] ? author.status : '';
    const number = post.number ?? index + 1;
    const id = escapeHtml(post.id ?? `post-${number}`);
    const badges = [author.role ? `<span class="role">${escapeHtml(author.role)}</span>` : '', ...(Array.isArray(author.badges) ? author.badges : []).map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`)].join('');
    const flags = [byStarter ? '<span class="flag">Author</span>' : '', post.solution ? `<span class="flag solution">${strokeIcon(circleCheck, 12)}Solution</span>` : ''].join('');
    const body = blocksOf(post.body).map((block, at) => blockMarkup(block, `${id}-block-${at}`, this.#mentions)).join('');
    const reactions = post.reactions && typeof post.reactions === 'object' ? post.reactions : {};
    const reaction = !reactable ? '' : `<lw-reaction-button variant="outline" size="sm" reactions="${escapeHtml(JSON.stringify(reactions))}" options="${escapeHtml(JSON.stringify(REACTIONS))}"${post.reaction ? ` value="${escapeHtml(post.reaction)}"` : ''} count-label="reactions"></lw-reaction-button>`;
    const more = post.more?.href ? `<a class="more" href="${escapeHtml(post.more.href)}">${escapeHtml(post.more.label ?? 'Read more')}${strokeIcon(chevronRight, 14)}</a>` : '';
    const edited = post.edited ? `<span class="edited">Edited ${timeMarkup(post.edited)}</span>` : '';
    const replyTo = this.#user ? `<button class="reply-to" type="button">${strokeIcon(reply, 14)}Reply<span class="visually-hidden"> to ${escapeHtml(author.name)}</span></button>` : '';
    return `<li class="post" part="post" id="${id}" data-index="${index}"${post.solution ? ' data-solution' : ''}>
<div class="author"><div class="author-inner"><span class="portrait" style="--_hue: ${hueOf(author.name)}">${avatarMarkup(author)}${status ? `<span class="dot" data-status="${status}"><span class="visually-hidden">${STATUSES[status]}</span></span>` : ''}</span><div class="author-text">${memberMarkup(author, post.author)}${author.title ? `<span class="author-title">${escapeHtml(author.title)}</span>` : ''}${badges ? `<span class="badges">${badges}</span>` : ''}</div></div></div>
<article class="main" aria-labelledby="${id}-by"><span class="visually-hidden" id="${id}-by">Post ${number} by ${escapeHtml(author.name)}</span>${flags ? `<div class="post-head">${flags}</div>` : ''}
<div class="body">${body}</div>${more ? `<p class="more-row">${more}</p>` : ''}
<div class="post-foot"><div class="foot-start">${reaction}${replyTo}</div><div class="foot-end"><span class="tools"><button class="share" type="button" data-href="${escapeHtml(post.href ?? '')}" aria-label="Copy the link to post ${number}">${strokeIcon(link2, 14)}<span class="copied" aria-hidden="true">Copied</span></button><a class="number" href="${escapeHtml(post.href ?? `#${id}`)}">#${number}</a></span><span class="when">${timeMarkup(post.time, post.href)}${edited}</span></div></div></article></li>`;
  }

  #paintPager() {
    const { page, pages } = this.#pages;
    const markup = pages > 1 ? pagerMarkup(page, pages, { href: this.pageHref, label: 'Pages of posts' }) : '';
    for (const pager of this.shadowRoot.querySelectorAll('.pager')) pager.innerHTML = markup;
  }

  // Everyone in the thread, whom a reply can mention.
  get #participants() {
    const seen = new Map();
    for (const member of [memberOf(this.#thread.author), ...this.#posts.map((post) => memberOf(post.author))]) {
      if (member && typeof member === 'object') seen.set(member.handle ?? member.name, member);
    }
    return [...seen.values()];
  }

  #paintUser() {
    const user = this.#user;
    const composer = this.query('.composer');
    composer.hidden = !user;
    composer.user = user;
    composer.members = this.#participants.filter((member) => member.handle);
  }

  // Reply takes you to the composer, mentioning the member answered.
  #answer(author) {
    const composer = this.query('.composer');
    if (!this.#user) return;
    composer.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    if (author) composer.mention(author);
    else composer.focus();
  }

  // A reply from the composer goes up at once unless the page cancels it.
  #postReply({ text = '', attachments = [] }) {
    if (!this.#user) return false;
    if (!this.emit('post', { text, attachments })) return false;
    const files = Array.isArray(attachments) ? attachments : [];
    const shown = (item) => Boolean(item.url) && String(item.type ?? '').startsWith('image/');
    const others = files.filter((item) => !shown(item));
    const body = [
      ...(text ? [{ type: 'markdown', text }] : []),
      ...files.filter(shown).map((item) => ({ type: 'image', src: item.url, alt: item.name ?? '' })),
      ...(others.length ? [{ type: 'attachments', files: others.map((item) => ({ name: item.name, size: item.size })) }] : []),
    ];
    const posts = Array.isArray(this.posts) ? this.posts : [];
    this.posts = [...posts, { id: `post-new-${Date.now()}`, author: this.user, time: new Date().toISOString(), body }];
    return true;
  }

  // Quotes past their height fold under a button that shows the rest.
  #paintQuotes() {
    for (const text of this.shadowRoot.querySelectorAll('.quote-text:not([data-open])')) {
      text.parentElement.querySelector('.expand').hidden = text.scrollHeight <= text.clientHeight + 1;
      text.toggleAttribute('data-folded', text.scrollHeight > text.clientHeight + 1);
    }
  }

  #unfold(button) {
    const text = this.query(`#${CSS.escape(button.getAttribute('aria-controls'))}`);
    const open = !text.hasAttribute('data-open');
    text.toggleAttribute('data-open', open);
    text.toggleAttribute('data-folded', !open);
    button.ariaExpanded = String(open);
    button.textContent = open ? 'Show less' : 'Show the whole quote';
  }

  // Copies, and says so on the button for a moment.
  async #copy(button, text, done) {
    try {
      await writeClipboard(text);
    } catch {
      return;
    }
    button.toggleAttribute('data-copied', true);
    this.query('.announce').textContent = button.matches('.share') ? 'Link copied' : 'Code copied';
    const label = button.querySelector('.copy-label');
    if (label) label.textContent = 'Copied';
    clearTimeout(this.#copied.get(button));
    this.#copied.set(button, setTimeout(() => {
      button.removeAttribute('data-copied');
      this.query('.announce').textContent = '';
      if (label) label.textContent = 'Copy';
      this.#copied.delete(button);
    }, COPIED_MS));
    done?.();
  }
}
