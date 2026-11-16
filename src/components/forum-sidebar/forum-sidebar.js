import '../button/index.js';
import { PREFIX } from '../../core/config.js';
import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import {
  arrowUpRight,
  award,
  bookmark,
  bookOpen,
  chevronDown,
  circleHelp,
  ellipsisVertical,
  fileText,
  globe,
  history,
  house,
  inbox,
  layers,
  list,
  mail,
  messageCircle,
  panelLeftClose,
  panelLeftOpen,
  settings,
  squareKanban,
  tag,
  trendingUp,
  user,
  users,
} from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf } from '../../core/people.js';
import { inSection, pathOf } from '../../core/route.js';
import styles from './forum-sidebar.scss?inline';

// The icons an item can name, by their Lucide names.
const ICONS = {
  award,
  bookmark,
  'book-open': bookOpen,
  'circle-help': circleHelp,
  'ellipsis-vertical': ellipsisVertical,
  'file-text': fileText,
  globe,
  history,
  house,
  inbox,
  layers,
  list,
  mail,
  'message-circle': messageCircle,
  settings,
  'square-kanban': squareKanban,
  tag,
  'trending-up': trendingUp,
  user,
  users,
};

// The forum's own pages, then a list that folds open for the rest. Every
// link is a route of its own.
const DEMO_ITEMS = [
  { label: 'Home', href: '/', icon: 'house' },
  { label: 'Topics', href: '/topics', icon: 'layers' },
  { label: 'Members', href: '/members', icon: 'users' },
  { label: 'Badges', href: '/badges', icon: 'award' },
  { label: 'Roadmap', href: '/roadmap', icon: 'square-kanban' },
  { label: 'About', href: '/about', icon: 'circle-help' },
  {
    label: 'More',
    icon: 'ellipsis-vertical',
    links: [
      { label: 'Docs', href: '/docs', icon: 'book-open' },
      { label: 'Changelog', href: '/changelog', icon: 'history' },
      { label: 'Guidelines', href: '/guidelines', icon: 'file-text' },
    ],
  },
];

// Categories in the colours the forum search gives them, and tags from the
// forum navbar's demo threads.
const DEMO_SECTIONS = [
  {
    label: 'Categories',
    links: [
      { label: 'Announcements', href: '/c/announcements' },
      { label: 'LowerCloud', href: '/c/lowercloud' },
      { label: 'LowerDB', href: '/c/lowerdb' },
      { label: 'LowerSync', href: '/c/lowersync' },
      { label: 'Feedback', href: '/c/feedback' },
      { label: 'All categories', href: '/categories', icon: 'list' },
    ],
  },
  {
    label: 'Tags',
    links: [
      { label: 'offline', href: '/tag/offline', icon: 'tag' },
      { label: 'passkeys', href: '/tag/passkeys', icon: 'tag' },
      { label: 'design-tokens', href: '/tag/design-tokens', icon: 'tag' },
      { label: 'migrations', href: '/tag/migrations', icon: 'tag' },
      { label: 'deploys', href: '/tag/deploys', icon: 'tag' },
      { label: 'All tags', href: '/tags', icon: 'list' },
    ],
  },
];

// The window width from which the sidebar is a column beside the page:
// `$wide` in `_layout.scss`.
const WIDE = '(width >= 64rem)';

const CHEVRON = `<span class="chevron" aria-hidden="true">${strokeIcon(chevronDown, 14)}</span>`;
const EXTERNAL = `<span class="external" aria-hidden="true">${strokeIcon(arrowUpRight, 12)}</span><span class="visually-hidden">(opens in a new tab)</span>`;

// An item's icon, by name; without one, a square in its own colour: `color`,
// or the one the forum search gives a category of that name.
const iconMarkup = (item) => {
  const icon = ICONS[item.icon];
  if (icon) return `<span class="icon" aria-hidden="true">${strokeIcon(icon, 16)}</span>`;
  const tint = item.color ? `background: ${item.color}` : `--_hue: ${hueOf(String(item.label ?? ''))}`;
  return `<span class="icon" aria-hidden="true"><span class="swatch" style="${escapeHtml(tint)}"></span></span>`;
};

const linkMarkup = (link) =>
  `<li><a class="link" href="${escapeHtml(link.href ?? '#')}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${iconMarkup(link)}<span class="label">${escapeHtml(link.label ?? '')}</span>${link.external ? EXTERNAL : ''}</a></li>`;

// Links that fold open and shut under the button that controls them.
const foldMarkup = (id, links, open, attributes = '') =>
  `<div class="fold" id="${id}"${open ? ' data-open' : ' inert'}${attributes}><div class="fold-clip"><ul class="list">${links.map(linkMarkup).join('')}</ul></div></div>`;

const itemMarkup = (item, index) => {
  if (!item.links?.length) return linkMarkup(item);
  const id = `more-${index}`;
  return `<li><button class="link more" type="button" aria-expanded="false" aria-controls="${id}">${iconMarkup(item)}<span class="label">${escapeHtml(item.label ?? '')}</span>${CHEVRON}</button>${foldMarkup(id, item.links, false)}</li>`;
};

const sectionMarkup = (section, index) => {
  const id = `section-${index}`;
  return `<div class="section"><button class="section-toggle" type="button" id="${id}" aria-expanded="true" aria-controls="${id}-links"><span class="icon">${CHEVRON}</span><span class="label">${escapeHtml(section.label ?? '')}</span></button>${foldMarkup(`${id}-links`, section.links ?? [], true, ` role="group" aria-labelledby="${id}"`)}</div>`;
};

/**
 * A forum's sidebar: its pages, then its categories and tags, each list
 * under a heading that folds it away. The page you are on keeps a
 * background of its own, a lighter pill slides between the links under the
 * pointer, and the arrow keys move through the links. Until the page
 * scrolls the sidebar is bare beside it;
 * once it scrolls it takes the floating navbar's double frame of frosted
 * glass, clear of the window's edges, and stays the window's height with
 * its links scrolling inside.
 *
 * At its foot the forum software's version and the copyright face a button
 * that closes the sidebar: it slides out to the left and the page takes its
 * column, and a button left in the window's lower left corner brings it
 * back. The focus moves to whichever button undoes it.
 *
 * Put it first in a grid of two columns, `auto` and the page, that stacks
 * below 64rem (1024px). There an outlined button at the top of the page,
 * bare until the page scrolls, opens it as a drawer from the window's left
 * edge, over the dimmed page; Escape, a press on the page, a link or the
 * button at its foot slides it away again.
 *
 * Items are `{ label, href, icon?, external? }`, or `{ label, icon?, links }`
 * for links that fold open under it, such as More. Sections are
 * `{ label, links }`. An `icon` is a Lucide icon's name: award, bookmark,
 * book-open, circle-help, ellipsis-vertical, file-text, globe, history,
 * house, inbox, layers, list, mail, message-circle, settings,
 * square-kanban, tag, trending-up, user or users. A link without one gets a
 * square in its own colour: `color`, or the one the forum search gives a
 * category of that name.
 *
 * With `navbar` it stands under `<lw-forum-navbar sidebar>`: at the top of
 * the page the bar spans the window and the sidebar sits at its left, under
 * it. As the bar shrinks it runs from the sidebar to the window's right
 * edge, and the sidebar rises into the room it leaves; the two take their
 * frames together. Closed, the sidebar gives the bar that room back.
 * Narrower than 64rem it keeps no row of its own: the outlined button at
 * the start of the bar opens the drawer instead, and the focus goes back to
 * the bar as it closes.
 *
 * @attr {Array<object>} items - The forum's pages, in order (JSON)
 * @attr {Array<object>} sections - The lists under them, such as categories and tags (JSON)
 * @attr {string} current - Path of the page you are on; the address bar's by default
 * @attr {boolean} closed - Slid out of the page, leaving the button that brings it back; a window narrower than 64rem keeps the button that opens it
 * @attr {string} version - The forum software's name and version, at the foot; none when empty
 * @attr {string} company - The owner in the copyright line at the foot, after the year; none when empty
 * @attr {boolean} navbar - Stands under `<lw-forum-navbar sidebar>`, the first before it in the page, and rises as the bar shrinks
 * @attr {string} label - Accessible name of the navigation
 * @fires lw-toggle - Its buttons closed or opened the sidebar; `detail: { open }`
 * @csspart frame - The sidebar's outer frame
 */
export class LwForumSidebar extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    sections: { type: Object, default: DEMO_SECTIONS },
    current: { default: '' },
    closed: { type: Boolean, reflect: true },
    version: { default: 'LowerForum 1.4.2' },
    company: { default: 'Lowersoft Inc.' },
    navbar: { type: Boolean, reflect: true },
    label: { default: 'Forum' },
  };

  #hovered = null;
  #wide = null;
  // Aborts what keeps the sidebar's shape: the page's scroll, or the navbar's.
  #shape = null;
  // The navbar the sidebar stands under, with `navbar`.
  #bar = null;
  // The drawer is open, or opening.
  #open = false;

  render() {
    return `<div class="panel"><div class="frame" part="frame"><div class="inner">
<nav class="scroller"><div class="content"><span class="pill" aria-hidden="true"></span><ul class="list items"></ul><div class="sections"></div></div></nav>
<div class="foot"><p class="credits"><span class="version"></span><span class="copyright"></span></p><lw-button class="close" variant="outline" size="sm" icon-only><span class="button-icon" slot="start">${strokeIcon(panelLeftClose, 16)}</span><span class="visually-hidden">Close sidebar</span></lw-button></div>
</div></div></div>
<div class="opener" inert><lw-button class="open" variant="outline" icon-only><span class="button-icon" slot="start">${strokeIcon(panelLeftOpen, 16)}</span><span class="visually-hidden">Open sidebar</span></lw-button></div>
<dialog class="drawer"><div class="scrim"></div></dialog>`;
  }

  connected() {
    const options = { signal: this.signal };
    const content = this.query('.content');

    content.addEventListener('pointerover', (event) => {
      const link = event.pointerType !== 'touch' && event.target.closest('.link');
      if (link) this.#paintPill(link);
    }, options);
    content.addEventListener('pointerleave', () => this.#paintPill(null), options);
    content.addEventListener('click', (event) => {
      const button = event.target.closest('.more, .section-toggle');
      if (button) this.#fold(button);
      // Following a link closes the drawer.
      else if (event.target.closest('a')) this.#setOpen(false);
    }, options);
    content.addEventListener('keydown', (event) => this.#key(event), options);

    this.query('.close').addEventListener('click', () => (this.#drawn ? this.#setOpen(false) : this.#setClosed(true)), options);
    this.query('.open').addEventListener('click', () => (this.#drawn ? this.#setOpen(true) : this.#setClosed(false)), options);

    // The links fade out at an edge there are more past.
    const scroller = this.query('.scroller');
    const edges = () => {
      scroller.toggleAttribute('data-more-above', scroller.scrollTop > 0);
      scroller.toggleAttribute('data-more-below', scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 1);
    };
    scroller.addEventListener('scroll', edges, { passive: true, signal: this.signal });

    // The drawer slides away before it closes, on Escape or a press on the
    // dimmed page as on its button, and the page under it stays put: only
    // the links scroll. Closed at once all the same, it takes its links back.
    const drawer = this.query('.drawer');
    drawer.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.#setOpen(false);
    }, options);
    drawer.addEventListener('close', () => drawer.open || this.#setOpen(false), options);
    this.query('.scrim').addEventListener('click', () => this.#setOpen(false), options);
    const hold = (event) => event.composedPath().includes(scroller) || event.preventDefault();
    drawer.addEventListener('wheel', hold, { passive: false, signal: this.signal });
    drawer.addEventListener('touchmove', hold, { passive: false, signal: this.signal });
    // Taken off the page, the sidebar takes its links back at once.
    this.signal.addEventListener('abort', () => this.#shut());

    // Lists folding, the frame settling and the window resizing all move the
    // links; the pill moves with them, not after.
    const resize = new ResizeObserver(() => {
      this.#paintPill(this.#hovered, true);
      edges();
    });
    resize.observe(content);
    resize.observe(scroller);
    this.signal.addEventListener('abort', () => resize.disconnect());

    // Crossing into the wide layout puts the links back beside the page at
    // once.
    this.#wide = matchMedia(WIDE);
    const layout = () => {
      if (this.#wide.matches) this.#shut();
      this.#paintLayout();
    };
    this.#wide.addEventListener('change', layout, options);
    layout();

    addEventListener('popstate', () => this.#paintCurrent(), options);
    this.#keepShape();

    // Bound for the drawer, the links are painted once, unseen, while the
    // page is idle, so its first opening has no new text to draw.
    const idle = window.requestIdleCallback ?? ((callback) => setTimeout(callback, 200));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const ahead = idle(() => {
      if (!this.#drawn || drawer.open) return;
      this.toggleAttribute('data-warm', true);
      requestAnimationFrame(() => requestAnimationFrame(() => this.removeAttribute('data-warm')));
    });
    this.signal.addEventListener('abort', () => cancel(ahead));
  }

  updated(changed) {
    if (changed.has('items') || changed.has('sections')) this.#build();
    if (['items', 'sections', 'current'].some((name) => changed.has(name))) this.#paintCurrent();
    if (changed.has('label')) this.query('.scroller').ariaLabel = this.query('.drawer').ariaLabel = this.label;
    if (changed.has('navbar')) this.#keepShape();
    if (changed.has('closed')) this.#paintLayout();
    if (changed.has('version') || changed.has('company')) this.#paintCredits();
  }

  get #items() {
    return Array.isArray(this.items) ? this.items : [];
  }

  get #sections() {
    return Array.isArray(this.sections) ? this.sections : [];
  }

  #build() {
    this.#hovered = null;
    this.query('.items').innerHTML = this.#items.map(itemMarkup).join('');
    this.query('.sections').innerHTML = this.#sections.map(sectionMarkup).join('');
  }

  // Alone, the sidebar takes its frame once the page scrolls. Under the
  // navbar it takes it with the bar's: as the page scrolls, or as the bar
  // shrinks for its search.
  #keepShape() {
    this.#shape?.abort();
    const controller = new AbortController();
    this.#shape = controller;
    this.signal.addEventListener('abort', () => controller.abort(), { once: true });

    const navbar = this.navbar ? this.#navbar() : null;
    if (this.#bar && this.#bar !== navbar) this.#bar.sidebar = false;
    this.#bar = navbar;
    this.#paintLayout();
    if (navbar) {
      navbar.addEventListener(`${PREFIX}-sidebar`, () => this.#setOpen(true), { signal: controller.signal });
      const follow = () => this.toggleAttribute('data-scrolled', navbar.matches('[data-scrolled], [data-searching]'));
      const observer = new MutationObserver(follow);
      observer.observe(navbar, { attributes: true, attributeFilter: ['data-scrolled', 'data-searching'] });
      controller.signal.addEventListener('abort', () => observer.disconnect());
      follow();
      return;
    }
    const scrolled = () => this.toggleAttribute('data-scrolled', scrollY > 0);
    addEventListener('scroll', scrolled, { passive: true, signal: controller.signal });
    scrolled();
  }

  // The navbar nearest the sidebar: in the smallest part of the page that
  // holds one.
  #navbar() {
    for (let node = this.parentNode; node; node = node.parentNode) {
      const navbar = node.querySelector?.(`${PREFIX}-forum-navbar`);
      if (navbar) return navbar;
    }
    return null;
  }

  // Marks the link to the page you are on, and the one of the section it is
  // in, whose list opens to show it.
  #paintCurrent() {
    const current = pathOf(this.current || location.pathname) ?? '';
    let section = null;
    let length = -1;
    for (const link of this.shadowRoot.querySelectorAll('a.link')) {
      const path = pathOf(link.getAttribute('href'));
      if (path !== null && path === current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
      link.removeAttribute('data-current');
      if (inSection(path, current) && path.length > length) [section, length] = [link, path.length];
    }
    section?.toggleAttribute('data-current', true);
    const fold = section?.closest('.fold:not([data-open])');
    if (fold) this.#fold(this.query(`[aria-controls="${fold.id}"]`), true);
    this.#paintPill();
  }

  // The pill follows the pointer from link to link, and fades once it
  // leaves them; the page you are on keeps a background of its own.
  #paintPill(hovered = this.#hovered, instant = false) {
    this.#hovered = hovered;
    const pill = this.query('.pill');
    if (hovered?.isConnected && hovered.offsetParent && !hovered.closest('.fold:not([data-open])')) moveHighlight(pill, hovered, { instant });
    else hideHighlight(pill);
  }

  #fold(button, open = button.ariaExpanded !== 'true') {
    button.ariaExpanded = String(open);
    const fold = this.query(`#${button.getAttribute('aria-controls')}`);
    fold.toggleAttribute('data-open', open);
    fold.inert = !open;
    this.#paintPill();
  }

  // Up and down move through the links and headings that show.
  #key(event) {
    const move = event.target.closest('.link, .section-toggle');
    if (!move) return;
    const items = [...this.query('.content').querySelectorAll('.link, .section-toggle')].filter((item) => !item.closest('[inert]'));
    const at = items.indexOf(move);
    const to = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: items.length - 1 }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    items[Math.max(0, Math.min(to, items.length - 1))].focus();
  }

  // Narrower than the column beside the page, the links open in a drawer
  // from the window's left edge.
  get #drawn() {
    return !this.#wide?.matches;
  }

  // The drawer is a modal dialog the panel moves into while it is open: it
  // slides in over the dimming page, and out again before the dialog closes
  // and the panel goes back. Opened again on its way out, it turns back.
  #setOpen(open) {
    if ((open && !this.#drawn) || this.#open === open) return;
    this.#open = open;
    this.#paintLayout();
    const drawer = this.query('.drawer');
    if (open) {
      // Unless it was closed again first, it slides in, and the focus goes
      // to the page you are on, or else the first link.
      const show = () => {
        if (!drawer.open || !this.#open) return;
        drawer.toggleAttribute('data-open', true);
        (this.query('a.link[aria-current], a.link[data-current]') ?? this.query('a.link'))?.focus();
      };
      if (drawer.open) {
        show();
        return;
      }
      drawer.append(this.query('.panel'));
      drawer.showModal();
      // Painted once where it starts, off the window, so the slide starts
      // from its first frame instead of after a costly one.
      requestAnimationFrame(() => requestAnimationFrame(show));
      return;
    }
    drawer.removeAttribute('data-open');
    const done = () => !this.#open && this.#shut();
    const sliding = drawer.getAnimations({ subtree: true }).filter((animation) => animation instanceof CSSTransition);
    if (sliding.length) Promise.all(sliding.map((animation) => animation.finished)).then(done, done);
    else done();
  }

  // Closes the drawer at once, the focus going back to where it was, and
  // puts the panel back in its place.
  #shut() {
    this.#open = false;
    const drawer = this.query('.drawer');
    drawer.removeAttribute('data-open');
    if (drawer.open) drawer.close();
    const panel = this.query('.panel');
    if (panel.parentNode === drawer) this.query('.opener').before(panel);
  }

  // Closes or opens the sidebar from its buttons, and moves the focus to the
  // one that undoes it.
  #setClosed(closed) {
    if (Boolean(this.closed) === closed) return;
    this.closed = closed;
    this.#paintLayout();
    this.query(closed ? '.open' : '.close').focus();
    this.emit('toggle', { open: !closed });
  }

  // Beside the page the links are there unless the sidebar is closed, and
  // the button that brings it back only while it is. Narrow, the links are
  // there only in the open drawer, and the button that opens it stands at
  // the top of the page, unless the navbar has its own. A closed sidebar
  // gives the navbar its room back; narrow, the navbar keeps its button.
  #paintLayout() {
    const wide = !this.#drawn;
    this.toggleAttribute('data-bar', Boolean(this.#bar));
    this.query('.panel').inert = wide ? Boolean(this.closed) : !this.#open;
    this.query('.opener').inert = wide ? !this.closed : Boolean(this.#bar);
    if (this.#bar) this.#bar.sidebar = !wide || !this.closed;
  }

  #paintCredits() {
    const version = this.query('.version');
    version.textContent = this.version ?? '';
    version.hidden = !this.version;
    const copyright = this.query('.copyright');
    copyright.textContent = this.company ? `© ${new Date().getFullYear()} ${this.company}` : '';
    copyright.hidden = !this.company;
  }
}
