import { escapeHtml } from '../../core/dom.js';
import { avatarMarkup, countMarkup, countOf, DEMO_MEDIA, memberMarkup, memberOf, pagerMarkup, tickTimes, timeMarkup } from '../../core/forum.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowUpRight, checkCheck, chevronDown, chevronLeft, chevronRight, eye, globe, image, imageOff, imagePlus, messageCircle, music, play, slidersHorizontal, thumbsUp, x } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { foldText } from '../../core/text.js';
import '../audio-player-card/index.js';
import '../button/index.js';
import '../select/index.js';
import '../text-input/index.js';
import '../user-hover-card/index.js';
import '../video-player/index.js';
import styles from './media-gallery.scss?inline';

// What an item can be, and how it is marked on its thumbnail.
const TYPES = {
  image: { label: 'Image', plural: 'Images', icon: image },
  video: { label: 'Video', plural: 'Videos', icon: play },
  audio: { label: 'Audio', plural: 'Audio', icon: music },
  embed: { label: 'Embed', plural: 'Embeds', icon: globe },
};

const SORTS = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  reactions: 'Most reactions',
  comments: 'Most comments',
  views: 'Most viewed',
};

const DEFAULTS = { type: 'all', sort: 'newest', member: '' };

// A length as a player shows it, "10:29" or "1:02:03", whole seconds
// rounded down, and as it is read.
const clock = (seconds) => {
  const total = Math.max(0, Math.floor(seconds));
  const [hours, minutes, rest] = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];
  const pad = (n) => String(n).padStart(2, '0');
  return hours ? `${hours}:${pad(minutes)}:${pad(rest)}` : `${minutes}:${pad(rest)}`;
};
const spoken = (seconds) => {
  const total = Math.max(0, Math.floor(seconds));
  const parts = [[Math.floor(total / 3600), 'hour'], [Math.floor((total % 3600) / 60), 'minute'], [total % 60, 'second']];
  return parts.filter(([n]) => n).map(([n, unit]) => `${n} ${unit}${n === 1 ? '' : 's'}`).join(' ') || '0 seconds';
};

const hostOf = (href) => {
  try {
    return new URL(href, location.href).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

const timeOf = (item) => {
  const time = new Date(item.time).getTime();
  return Number.isNaN(time) ? null : time;
};

/**
 * A forum's media: square thumbnails in a grid, pages of them above and
 * below, and filters that fold open under the grid's head. Resting the
 * pointer on a thumbnail, or focusing it, brings up its title, who added it
 * and when, and its reactions and comments; on a touch screen they always
 * show. Videos and audio carry their length, embeds a globe, and media the
 * member has not seen yet a New mark. A thumbnail that fails to load shows
 * a placeholder instead.
 *
 * A thumbnail opens the viewer over the page: the image at full size, the
 * video in `<lw-video-player>`, the audio in `<lw-audio-player-card>`, or
 * a link to the site an embed plays on, with its title, who added it, when
 * and where, its counts and a link to its own page. The arrow keys, the
 * buttons at its sides or a swipe go through the media shown, and Escape, a
 * press beside it or its close button closes it, the focus going back to
 * the thumbnail of what it last showed. With a modifier key or the middle
 * button a thumbnail opens the media's page as a link does.
 *
 * The filters keep one type of media, sort by date, reactions, comments or
 * views, and keep one member's media; those in use stand across the head,
 * each removable. They apply to the items given unless `lw-filter` is
 * canceled, for a server that sends the filtered page instead.
 *
 * Signed in (`user`), Mark viewed clears the New marks and Add media asks to
 * add more.
 *
 * Items are `{ title, href, src, type?, author?, time?, reactions?,
 * comments?, views?, new?, album?, category?, description?, alt? }` with
 * `src` the thumbnail, `type` one of image (by default), video, audio or
 * embed, `album` or `category` as `{ title, href }`, and `time` an ISO date
 * and time, or text to show as it is. An image may add `full`, its full
 * size, and `width` and `height`; a video `video` or `sources` and
 * `duration` in seconds; audio `audio` and `duration`; an embed `embed`,
 * the address it plays at.
 *
 * @attr {Array<object>} items - The media on this page (JSON)
 * @attr {number} page - The page you are on
 * @attr {number} pages - How many pages there are
 * @attr {string} page-href - A page's address, with `{page}` for its number
 * @attr {object} filters - The filters in use, `{ type, sort, member }`: type all, image, video, audio or embed; sort newest, oldest, reactions, comments or views; member a name or handle (JSON)
 * @attr {object} user - The member signed in, as `<lw-user-hover-card>` takes one; shows Mark viewed, Add media and the New marks (JSON)
 * @attr {string} label - Accessible name of the grid
 * @fires lw-open - A thumbnail was chosen; cancel it to show the media yourself. `detail: { item, index }`. Cancelable.
 * @fires lw-view - The viewer showed an item, which no longer counts as new; `detail: { item, index }`
 * @fires lw-filter - Before the filters change; cancel it to load the filtered page yourself. `detail: { type, sort, member }`. Cancelable.
 * @fires lw-page - A page was picked; cancel it to load the page in place. `detail: { page }`. Cancelable.
 * @fires lw-mark-viewed - Before the New marks clear. Cancelable.
 * @fires lw-add - Add media was pressed
 * @csspart frame - The grid's frame, with its head and filters
 * @csspart tile - A thumbnail
 * @cssprop --lw-media-gallery-scroll-margin - Room kept above the gallery when a page picked at its foot brings it back into view, as under a navbar; 5rem by default
 */
export class LwMediaGallery extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_MEDIA },
    page: { type: Number, default: 1 },
    pages: { type: Number, default: 1 },
    pageHref: { default: '' },
    filters: { type: Object },
    user: { type: Object },
    label: { default: 'Media' },
  };

  // The items seen in the viewer, or all of them once marked viewed.
  #viewed = new Set();
  #allViewed = false;
  // The indexes of the items shown, in their order.
  #order = [];
  // Where the viewer is in `#order`, or -1 while it is shut.
  #at = -1;
  #open = false;
  #scroll = null;
  #swipe = null;

  render() {
    const field = (name, label) => `<lw-select class="${name}" label="${label}" size="sm"></lw-select>`;
    return `<div class="root">
<div class="bar"><div class="pager pager-top"></div><div class="actions"><lw-button class="mark" variant="outline" size="sm" disabled-reason="Everything here is viewed" hidden><span class="button-icon" slot="start">${strokeIcon(checkCheck, 15)}</span>Mark viewed</lw-button><lw-button class="add" size="sm" hidden><span class="button-icon" slot="start">${strokeIcon(imagePlus, 15)}</span>Add media</lw-button></div></div>
<section class="frame" part="frame">
<div class="head"><div class="summary"></div><button class="filters-toggle" type="button" aria-expanded="false" aria-controls="filters">${strokeIcon(slidersHorizontal, 15)}<span>Filters</span><span class="filters-count" hidden></span><span class="chevron" aria-hidden="true">${strokeIcon(chevronDown, 14)}</span></button></div>
<div class="fold" id="filters" inert><div class="fold-clip"><form class="filters" aria-label="Filters" novalidate>${field('filter-type', 'Type')}${field('filter-sort', 'Sort by')}<lw-text-input class="filter-member" label="Added by" placeholder="Any member" size="sm"></lw-text-input><div class="filter-actions"><lw-button class="filter-reset" variant="ghost" size="sm" type="button">Reset</lw-button><lw-button class="filter-apply" size="sm" type="submit">Apply filters</lw-button></div></form></div></div>
<div class="card"><ul class="grid" role="list"></ul><div class="empty" hidden></div></div>
</section>
<div class="pager pager-bottom"></div>
<p class="visually-hidden announce" role="status"></p>
</div>
<dialog class="viewer" aria-labelledby="viewer-title">
<div class="viewer-backdrop"></div>
<div class="viewer-top"><span class="viewer-count"></span><div class="viewer-tools"><a class="viewer-page"><span>Open media page</span>${strokeIcon(arrowUpRight, 15)}</a><button class="viewer-close" type="button" aria-label="Close">${strokeIcon(x, 20)}</button></div></div>
<div class="viewer-stage"><button class="viewer-step viewer-prev" type="button" aria-label="Previous">${strokeIcon(chevronLeft, 22)}</button><div class="viewer-media"></div><button class="viewer-step viewer-next" type="button" aria-label="Next">${strokeIcon(chevronRight, 22)}</button></div>
<div class="viewer-info"><div class="viewer-text"><h2 class="viewer-title" id="viewer-title"></h2><p class="viewer-meta"></p><p class="viewer-description"></p></div><p class="viewer-stats"></p></div>
<p class="visually-hidden viewer-status" aria-live="polite"></p>
</dialog>`;
  }

  connected() {
    const options = { signal: this.signal };
    tickTimes(this.shadowRoot, this.signal);

    this.query('.filter-type').options = [{ value: 'all', label: 'All media' }, ...Object.entries(TYPES).map(([value, { plural }]) => ({ value, label: plural }))];
    this.query('.filter-sort').options = Object.entries(SORTS).map(([value, label]) => ({ value, label }));

    const root = this.query('.root');
    root.addEventListener('click', (event) => this.#click(event), options);
    // A thumbnail that will not load shows a placeholder.
    this.query('.grid').addEventListener('error', (event) => {
      if (event.target.classList?.contains('thumb')) event.target.closest('.tile').toggleAttribute('data-broken', true);
    }, { capture: true, signal: this.signal });

    const form = this.query('.filters');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.#apply({ type: this.query('.filter-type').value || 'all', sort: this.query('.filter-sort').value || 'newest', member: String(this.query('.filter-member').value ?? '').trim() }, true);
    }, options);
    // Enter in the member's name applies the filters, as in a native form.
    this.query('.filter-member').addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.isComposing) {
        event.preventDefault();
        form.requestSubmit();
      }
    }, options);
    this.query('.filter-reset').addEventListener('click', () => this.#apply({ ...DEFAULTS }, true), options);

    this.query('.mark').addEventListener('click', () => this.#markViewed(), options);
    this.query('.add').addEventListener('click', () => this.emit('add'), options);

    this.#wireViewer(options);
    this.signal.addEventListener('abort', () => this.#shut());
  }

  updated(changed) {
    if (changed.has('items')) {
      this.#viewed.clear();
      this.#allViewed = false;
      this.#shut();
    }
    if (['items', 'filters', 'user'].some((name) => changed.has(name))) this.#paint();
    if (['page', 'pages', 'pageHref'].some((name) => changed.has(name))) this.#paintPager();
    if (changed.has('label')) this.query('.grid').ariaLabel = this.label || 'Media';
  }

  get #items() {
    return (Array.isArray(this.items) ? this.items : []).map((item) => (item && typeof item === 'object' ? item : null));
  }

  get #filters() {
    const given = this.filters && typeof this.filters === 'object' ? this.filters : {};
    return {
      type: given.type in TYPES ? given.type : 'all',
      sort: given.sort in SORTS ? given.sort : 'newest',
      member: String(given.member ?? '').trim().replace(/^@/, ''),
    };
  }

  #typeOf(item) {
    return item.type in TYPES ? item.type : 'image';
  }

  get #signedIn() {
    return Boolean(this.user && typeof this.user === 'object');
  }

  // What is new is only known for the member signed in.
  #isNew(index) {
    return this.#signedIn && Boolean(this.#items[index]?.new) && !this.#allViewed && !this.#viewed.has(index);
  }

  // The items the filters keep, in the order they ask for; with no member
  // or type filter and the newest first, the order given.
  #ordered() {
    const { type, sort, member } = this.#filters;
    const term = foldText(member);
    const kept = this.#items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item && (item.src || item.title))
      .filter(({ item }) => type === 'all' || this.#typeOf(item) === type)
      .filter(({ item }) => {
        if (!term) return true;
        const author = memberOf(item.author);
        return Boolean(author) && [author.name, author.handle].some((name) => foldText(name).includes(term));
      });
    const by = {
      newest: (a, b) => (timeOf(b.item) ?? 0) - (timeOf(a.item) ?? 0),
      oldest: (a, b) => (timeOf(a.item) ?? 0) - (timeOf(b.item) ?? 0),
      reactions: (a, b) => (countOf(b.item.reactions) ?? 0) - (countOf(a.item.reactions) ?? 0),
      comments: (a, b) => (countOf(b.item.comments) ?? 0) - (countOf(a.item.comments) ?? 0),
      views: (a, b) => (countOf(b.item.views) ?? 0) - (countOf(a.item.views) ?? 0),
    }[sort];
    // Dates the items lack keep them where they were given.
    if (sort === 'newest' && kept.some(({ item }) => timeOf(item) === null)) return kept.map(({ index }) => index);
    return kept.sort(by).map(({ index }) => index);
  }

  #paint() {
    this.#order = this.#ordered();
    const items = this.#items;
    const grid = this.query('.grid');
    grid.innerHTML = this.#order.map((index) => this.#tileMarkup(items[index], index)).join('');
    grid.hidden = this.#order.length === 0;
    this.#paintHead();
    this.#paintEmpty();
    this.#paintActions();
  }

  #tileMarkup(item, index) {
    const type = this.#typeOf(item);
    const author = memberOf(item.author);
    const reactions = countOf(item.reactions);
    const comments = countOf(item.comments);
    const fresh = this.#isNew(index);
    const timed = (type === 'video' || type === 'audio') && countOf(item.duration) !== null;
    const badge = type === 'image' ? '' : `<span class="type" aria-hidden="true">${strokeIcon(TYPES[type].icon, 12)}${timed ? `<span class="duration">${clock(item.duration)}</span>` : ''}</span>`;
    const said = [type === 'image' ? '' : TYPES[type].label.toLowerCase(), timed ? spoken(item.duration) : '', fresh ? 'new' : ''].filter(Boolean).join(', ');
    const by = [author ? memberMarkup(author, item.author) : '', timeMarkup(item.time)].filter(Boolean).join('<span class="sep" aria-hidden="true">·</span>');
    const stat = (icon, value, unit) => `<span class="stat"${value === 0 ? ' data-none' : ''}>${strokeIcon(icon, 13)}${countMarkup(value)}<span class="visually-hidden"> ${unit}${value === 1 ? '' : 's'}</span></span>`;
    const stats = [reactions !== null ? stat(thumbsUp, reactions, 'reaction') : '', comments !== null ? stat(messageCircle, comments, 'comment') : ''].join('');
    return `<li class="tile" part="tile" data-index="${index}" data-type="${type}"${fresh ? ' data-new' : ''}${item.src ? '' : ' data-broken'}>
<span class="thumb-box">${item.src ? `<img class="thumb" src="${escapeHtml(item.src)}" alt="" loading="lazy" decoding="async">` : ''}<span class="broken" aria-hidden="true">${strokeIcon(imageOff, 22)}</span></span>${fresh ? '<span class="new" aria-hidden="true">New</span>' : ''}${badge}
<div class="overlay"><a class="tile-link" href="${escapeHtml(item.href || '#')}">${escapeHtml(item.title ?? '')}${said ? `<span class="visually-hidden">, ${said}</span>` : ''}</a>${by ? `<p class="tile-by">${by}</p>` : ''}${stats ? `<p class="tile-stats">${stats}</p>` : ''}</div></li>`;
  }

  // Across the head: the filters in use, each removable, or All media; and
  // how many items show.
  #paintHead() {
    const filters = this.#filters;
    const shown = this.#order.length;
    const total = this.#items.filter((item) => item && (item.src || item.title)).length;
    const chips = [
      filters.type !== 'all' ? ['type', TYPES[filters.type].plural] : null,
      filters.sort !== 'newest' ? ['sort', SORTS[filters.sort]] : null,
      filters.member ? ['member', `By ${filters.member}`] : null,
    ].filter(Boolean);
    const count = chips.length ? `${shown} of ${total}` : total ? `${total} ${total === 1 ? 'item' : 'items'}` : '';
    this.query('.summary').innerHTML = chips.length
      ? `<ul class="chips" role="list" aria-label="Filters in use">${chips.map(([key, label]) => `<li><button class="chip" type="button" data-clear="${key}" aria-label="Remove filter: ${escapeHtml(label)}">${escapeHtml(label)}${strokeIcon(x, 12)}</button></li>`).join('')}</ul><span class="summary-count">${count}</span>`
      : `<span class="summary-all">All media</span>${count ? `<span class="summary-count">${count}</span>` : ''}`;
    // With nothing at all to filter, there are no filters to offer.
    const toggle = this.query('.filters-toggle');
    toggle.hidden = total === 0 && chips.length === 0;
    if (toggle.hidden && toggle.ariaExpanded === 'true') this.#fold(false);
    const badge = this.query('.filters-count');
    badge.textContent = String(chips.length);
    badge.hidden = chips.length === 0;
    this.query('.filters-toggle').ariaLabel = chips.length ? `Filters, ${chips.length} in use` : null;
  }

  #paintEmpty() {
    const empty = this.query('.empty');
    // With items, the filters keep none of them; without, there are none yet.
    const hasItems = this.#items.some((item) => item && (item.src || item.title));
    empty.hidden = this.#order.length > 0;
    if (!empty.hidden) {
      empty.innerHTML = hasItems
        ? `<span class="empty-icon" aria-hidden="true">${strokeIcon(slidersHorizontal, 20)}</span><p class="empty-title">No media matches these filters</p><p class="empty-text">Try another type, or anyone’s media.</p><lw-button class="empty-reset" variant="outline" size="sm">Reset filters</lw-button>`
        : `<span class="empty-icon" aria-hidden="true">${strokeIcon(image, 20)}</span><p class="empty-title">No media yet</p><p class="empty-text">What members add shows here.</p>`;
    }
  }

  #paintPager() {
    const pages = Math.max(1, Math.round(countOf(this.pages) ?? 1));
    const page = Math.min(pages, Math.max(1, Math.round(countOf(this.page) ?? 1)));
    const markup = pages > 1 ? pagerMarkup(page, pages, { href: this.pageHref, label: 'Pages of media' }) : '';
    for (const pager of this.shadowRoot.querySelectorAll('.pager')) pager.innerHTML = markup;
    this.query('.bar').toggleAttribute('data-pages', pages > 1);
  }

  #paintActions() {
    const signedIn = this.#signedIn;
    const mark = this.query('.mark');
    const add = this.query('.add');
    mark.hidden = !signedIn;
    add.hidden = !signedIn;
    mark.disabled = !this.#items.some((_, index) => this.#isNew(index));
    this.query('.bar').toggleAttribute('data-actions', signedIn);
  }

  #announce(text) {
    const status = this.query('.announce');
    status.textContent = '';
    requestAnimationFrame(() => (status.textContent = text));
  }

  // ---- The grid's controls ----

  #click(event) {
    const target = event.target;
    const link = target.closest('.tile-link');
    if (link) {
      // A modifier key or another button opens the page, as a link does.
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const index = Number(link.closest('.tile').dataset.index);
      if (this.emit('open', { item: this.#items[index], index })) this.#openViewer(this.#order.indexOf(index));
      return;
    }
    const page = target.closest('[data-page]');
    if (page) {
      if (!this.emit('page', { page: Number(page.dataset.page) })) {
        event.preventDefault();
        return;
      }
      if (page.localName !== 'button') return;
      const fromFoot = Boolean(page.closest('.pager-bottom'));
      this.page = Number(page.dataset.page);
      // Picked at the foot, the next page starts in view.
      if (fromFoot) this.query('.root').scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      requestAnimationFrame(() => this.query(`.${fromFoot ? 'pager-bottom' : 'pager-top'} [aria-current]`)?.focus({ preventScroll: true }));
      return;
    }
    if (target.closest('.filters-toggle')) {
      this.#fold(this.query('.filters-toggle').ariaExpanded !== 'true');
      return;
    }
    const chip = target.closest('.chip');
    if (chip) {
      const next = { ...this.#filters, [chip.dataset.clear]: DEFAULTS[chip.dataset.clear] };
      const chips = [...this.shadowRoot.querySelectorAll('.chip')];
      const at = chips.indexOf(chip);
      if (this.#apply(next, false)) {
        // Once the head is painted again, the focus moves to the next filter
        // in use, or the Filters button.
        queueMicrotask(() => {
          const left = [...this.shadowRoot.querySelectorAll('.chip')];
          (left[Math.min(at, left.length - 1)] ?? this.query('.filters-toggle')).focus();
        });
      }
      return;
    }
    if (target.closest('.empty-reset')) this.#apply({ ...DEFAULTS }, false);
  }

  #fold(open) {
    const toggle = this.query('.filters-toggle');
    const fold = this.query('.fold');
    toggle.ariaExpanded = String(open);
    fold.toggleAttribute('data-open', open);
    fold.inert = !open;
    if (!open) return;
    // The fields start from the filters in use.
    const filters = this.#filters;
    this.query('.filter-type').value = filters.type;
    this.query('.filter-sort').value = filters.sort;
    this.query('.filter-member').value = filters.member;
  }

  // Puts `next` in use unless `lw-filter` is canceled; from the fold, it
  // folds away. Returns whether they changed.
  #apply(next, fromFold) {
    const filters = { type: next.type in TYPES ? next.type : 'all', sort: next.sort in SORTS ? next.sort : 'newest', member: String(next.member ?? '').trim().replace(/^@/, '') };
    if (!this.emit('filter', filters)) return false;
    this.filters = filters;
    if (fromFold) {
      this.#fold(false);
      this.query('.filters-toggle').focus();
    }
    const shown = this.#ordered().length;
    this.#announce(shown ? `${shown} ${shown === 1 ? 'item' : 'items'} shown` : 'No media matches these filters');
    return true;
  }

  #markViewed() {
    if (!this.emit('mark-viewed')) return;
    this.#allViewed = true;
    for (const tile of this.shadowRoot.querySelectorAll('.tile[data-new]')) this.#clearNew(tile);
    this.#paintActions();
    this.#announce('Everything here is marked viewed');
  }

  // A thumbnail no longer marked new, nor read as new.
  #clearNew(tile) {
    if (!tile) return;
    tile.removeAttribute('data-new');
    tile.querySelector('.new')?.remove();
    const said = tile.querySelector('.tile-link .visually-hidden');
    if (!said) return;
    const rest = said.textContent.replace(/(, )?new$/, '');
    if (rest === ',' || rest === '') said.remove();
    else said.textContent = rest;
  }

  // ---- The viewer ----

  #wireViewer(options) {
    const viewer = this.query('.viewer');
    viewer.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.#closeViewer();
    }, options);
    viewer.addEventListener('close', () => this.#open && this.#closeViewer(), options);
    this.query('.viewer-close').addEventListener('click', () => this.#closeViewer(), options);
    this.query('.viewer-prev').addEventListener('click', () => this.#step(-1), options);
    this.query('.viewer-next').addEventListener('click', () => this.#step(1), options);
    // A press beside the media closes it.
    viewer.addEventListener('click', (event) => {
      if (event.target === viewer || event.target.matches('.viewer-backdrop, .viewer-stage, .viewer-media, .viewer-top')) this.#closeViewer();
    }, options);
    viewer.addEventListener('keydown', (event) => {
      // The players keep their own keys.
      if (event.composedPath().some((node) => /^lw-(video-player|audio-player-card)$/.test(node.localName ?? ''))) return;
      const moves = { ArrowLeft: -1, ArrowRight: 1, Home: -Infinity, End: Infinity };
      if (!(event.key in moves) || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      this.#step(moves[event.key]);
    }, options);
    // A swipe across an image or an embed steps through them.
    const stage = this.query('.viewer-stage');
    stage.addEventListener('pointerdown', (event) => {
      this.#swipe = event.pointerType === 'mouse' || event.target.closest('lw-video-player, lw-audio-player-card, a, button') ? null : { x: event.clientX, y: event.clientY, id: event.pointerId };
    }, options);
    stage.addEventListener('pointerup', (event) => {
      const swipe = this.#swipe;
      this.#swipe = null;
      if (!swipe || swipe.id !== event.pointerId) return;
      const dx = event.clientX - swipe.x;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(event.clientY - swipe.y) * 1.5) this.#step(dx < 0 ? 1 : -1);
    }, options);
    stage.addEventListener('pointercancel', () => (this.#swipe = null), options);
  }

  // Opens the viewer on the `at`th item shown. The page under it stays put,
  // its scrollbar's room kept, and it fades in once painted where it starts.
  #openViewer(at) {
    if (at < 0 || at >= this.#order.length) return;
    const viewer = this.query('.viewer');
    if (!viewer.open) {
      const html = document.documentElement;
      this.#scroll = { overflow: html.style.overflow, gutter: html.style.scrollbarGutter };
      html.style.scrollbarGutter = 'stable';
      html.style.overflow = 'hidden';
      viewer.showModal();
      this.query('.viewer-close').focus({ preventScroll: true });
      requestAnimationFrame(() => requestAnimationFrame(() => this.#open && viewer.toggleAttribute('data-open', true)));
    }
    this.#open = true;
    this.#show(at, 0);
  }

  #step(by) {
    if (!this.#open) return;
    const at = Math.max(0, Math.min(this.#order.length - 1, this.#at + by));
    if (at !== this.#at) this.#show(at, Math.sign(by));
  }

  // Shows the `at`th item shown, sliding in from the side it was stepped
  // toward; the next and previous images load ahead.
  #show(at, direction) {
    const index = this.#order[at];
    const item = this.#items[index];
    if (!item) return;
    this.#at = at;
    const type = this.#typeOf(item);
    const total = this.#order.length;
    const author = memberOf(item.author);

    this.query('.viewer-count').textContent = `${at + 1} of ${total}`;
    this.query('.viewer-prev').disabled = at === 0;
    this.query('.viewer-next').disabled = at === total - 1;
    const page = this.query('.viewer-page');
    page.hidden = !item.href;
    if (item.href) page.href = item.href;

    const media = this.query('.viewer-media');
    media.replaceChildren(this.#mediaFor(item, type, author));
    media.dataset.type = type;
    if (direction && !reducedMotion.matches) media.firstElementChild?.animate([{ opacity: 0, translate: `${direction * 2.5}rem 0` }, { opacity: 1, translate: '0 0' }], { duration: 260, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });

    this.query('.viewer-title').textContent = item.title ?? '';
    const where = item.album ?? item.category;
    const meta = [
      author ? `<span class="viewer-by">${avatarMarkup(author)}${memberMarkup(author, item.author)}</span>` : '',
      timeMarkup(item.time),
      where?.title ? `<span class="viewer-where">in ${where.href ? `<a href="${escapeHtml(where.href)}">${escapeHtml(where.title)}</a>` : escapeHtml(where.title)}</span>` : '',
    ].filter(Boolean).join('<span class="sep" aria-hidden="true">·</span>');
    this.query('.viewer-meta').innerHTML = meta;
    const description = this.query('.viewer-description');
    description.textContent = item.description ?? '';
    description.hidden = !item.description;
    const stat = (icon, value, unit) => (value === null ? '' : `<span class="stat">${strokeIcon(icon, 15)}${countMarkup(value)}<span class="visually-hidden"> ${unit}${value === 1 ? '' : 's'}</span></span>`);
    this.query('.viewer-stats').innerHTML = [stat(thumbsUp, countOf(item.reactions), 'reaction'), stat(messageCircle, countOf(item.comments), 'comment'), stat(eye, countOf(item.views), 'view')].join('');
    this.query('.viewer-status').textContent = `${TYPES[type].label} ${at + 1} of ${total}: ${item.title ?? ''}`;

    // Seen now, it is no longer new.
    if (this.#isNew(index)) {
      this.#viewed.add(index);
      this.#clearNew(this.query(`.tile[data-index="${index}"]`));
      this.#paintActions();
    }
    this.emit('view', { item, index });

    for (const near of [this.#order[at - 1], this.#order[at + 1]]) {
      const ahead = this.#items[near];
      if (ahead && this.#typeOf(ahead) === 'image' && (ahead.full || ahead.src)) new Image().src = ahead.full || ahead.src;
    }
  }

  #mediaFor(item, type, author) {
    const make = (name, attributes = {}) => {
      const element = document.createElement(name);
      for (const [key, value] of Object.entries(attributes)) if (value != null && value !== false) element.setAttribute(key, value === true ? '' : String(value));
      return element;
    };
    if (type === 'video') {
      return make('lw-video-player', {
        src: Array.isArray(item.sources) ? null : item.video,
        sources: Array.isArray(item.sources) ? JSON.stringify(item.sources) : null,
        poster: item.src,
        heading: item.title,
        byline: author?.name,
        autoplay: true,
      });
    }
    if (type === 'audio') return make('lw-audio-player-card', { heading: item.title, show: author?.name, src: item.audio, duration: item.audio ? null : countOf(item.duration) });
    if (type === 'embed') {
      const host = hostOf(item.embed);
      const card = make('div', { class: 'viewer-embed' });
      card.innerHTML = `${item.src ? `<img class="viewer-embed-poster" src="${escapeHtml(item.src)}" alt="">` : ''}<div class="viewer-embed-text"><span class="viewer-embed-icon" aria-hidden="true">${strokeIcon(globe, 18)}</span><p>Plays on ${escapeHtml(host || 'another site')}</p>${item.embed ? `<a class="viewer-embed-link" href="${escapeHtml(item.embed)}" target="_blank" rel="noopener noreferrer">Open on ${escapeHtml(host || 'its site')}${strokeIcon(arrowUpRight, 15)}<span class="visually-hidden"> (opens in a new tab)</span></a>` : ''}</div>`;
      return card;
    }
    // An image shows its thumbnail, softened, until its full size arrives.
    const frame = make('div', { class: 'viewer-image' });
    const full = item.full || item.src;
    // With its size known, it keeps its place from the start.
    if (countOf(item.width) > 0 && countOf(item.height) > 0) {
      frame.style.setProperty('--_ratio', String(item.width / item.height));
      frame.toggleAttribute('data-sized', true);
    }
    frame.innerHTML = `${item.src && full !== item.src ? `<img class="viewer-placeholder" src="${escapeHtml(item.src)}" alt="" aria-hidden="true">` : ''}<img class="viewer-full" alt="${escapeHtml(item.alt ?? item.title ?? '')}" decoding="async">`;
    const img = frame.querySelector('.viewer-full');
    img.addEventListener('load', () => frame.toggleAttribute('data-loaded', true), { once: true });
    img.addEventListener('error', () => frame.toggleAttribute('data-broken', true), { once: true });
    if (full) img.src = full;
    else frame.toggleAttribute('data-broken', true);
    return frame;
  }

  // Fades the viewer out, then closes it, the focus going back to the
  // thumbnail of what it showed last.
  #closeViewer() {
    if (!this.#open) return;
    this.#open = false;
    const viewer = this.query('.viewer');
    viewer.removeAttribute('data-open');
    const index = this.#order[this.#at];
    const done = () => {
      if (this.#open) return;
      this.#shut();
      this.query(`.tile[data-index="${index}"] .tile-link`)?.focus();
    };
    const fading = viewer.getAnimations({ subtree: true }).filter((animation) => animation instanceof CSSTransition);
    if (fading.length) Promise.all(fading.map((animation) => animation.finished)).then(done, done);
    else done();
  }

  // Closes the viewer at once and gives the page its scroll back.
  #shut() {
    this.#open = false;
    this.#at = -1;
    const viewer = this.query('.viewer');
    if (!viewer) return;
    viewer.removeAttribute('data-open');
    if (viewer.open) viewer.close();
    this.query('.viewer-media').replaceChildren();
    if (this.#scroll) {
      const html = document.documentElement;
      html.style.overflow = this.#scroll.overflow;
      html.style.scrollbarGutter = this.#scroll.gutter;
      this.#scroll = null;
    }
  }
}
