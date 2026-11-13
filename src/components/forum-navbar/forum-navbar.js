import { strokeIcon } from '../../core/icons.js';
import { search, settings, user, x } from '../../core/lucide.js';
import { matchesShortcut, parseShortcut } from '../../core/shortcut.js';
import { LwFloatingNavbar } from '../floating-navbar/floating-navbar.js';
import '../profile-dropdown/index.js';
import styles from './forum-navbar.scss?inline';
import { DEMO_THREADS, FOOT_MARKUP, guideMarkup, noneMarkup, parseQuery, resultsMarkup, suggestionsMarkup, tokenAt } from './search.js';

// The forum's own sections, on the far side of the bar from the site's menus.
const FORUM_LINKS = [
  { label: 'Latest', href: '/latest', end: true },
  { label: 'Media', href: '/media', end: true },
  { label: 'Members', href: '/members', end: true },
];

// The search field that takes the bar's place, and the panel under it.
const SEARCH_MARKUP = `<div class="search" role="search" inert><span class="search-icon" aria-hidden="true">${strokeIcon(search, 18)}</span><input class="search-input" type="text" role="combobox" aria-label="Search" aria-autocomplete="list" aria-expanded="false" aria-controls="search-list" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"><button class="search-close" type="button" aria-label="Close search">${strokeIcon(x, 16)}</button></div>`;
const PANEL_MARKUP = `<div class="results" inert><div class="results-clip"><div class="results-head" hidden></div><div class="results-body"><div class="search-list" id="search-list" role="listbox" aria-label="Search"></div><div class="none" hidden></div></div><div class="results-foot" aria-hidden="true">${FOOT_MARKUP}</div><p class="search-status visually-hidden" aria-live="polite"></p></div></div>`;

// A member's account menu: their profile and settings, no billing.
const ACCOUNT_ITEMS = [
  { label: 'Profile', icon: user },
  { label: 'Settings', icon: settings },
];

// Keys that move the caret, possibly into or out of an `@` or `#` word.
const CARET_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'Home', 'End']);

/**
 * The floating navbar for a forum: the same menus, pill, keyboard and
 * narrow-screen menu, laid out for a site of its own. At the top of the
 * page the bar spans the full width; once the page scrolls it shrinks into
 * the floating frame, the sign-in button down to its account icon and,
 * while the links show, the brand to its mark. The page under it keeps its
 * place throughout.
 *
 * The site's menus sit beside the brand, and the forum's sections face
 * them from the far side: items marked `end`, which start that group.
 * Items are otherwise those of `<lw-floating-navbar>`.
 *
 * The search button beside the theme switch, or its shortcut, shrinks the
 * bar to a search field across all of it, and the bar grows down to hold a
 * panel under the field. Before anything is typed the panel shows how to
 * search: words match thread
 * titles, `@member` keeps a member's threads and `#category` a category's,
 * and typing either lists the members or categories to finish it with. The
 * threads found list under the filters in use, each removable. The arrow
 * keys move through the panel, Enter or Tab chooses and Escape closes.
 * `openSearch()` and `closeSearch()` do the same from script.
 *
 * Threads are `{ title, href, author, category, replies?, time? }`.
 *
 * Signed in, `user` puts the member's `<lw-profile-dropdown>` where Sign In
 * was: an outlined button with their avatar and name that opens their
 * account menu, their role across from the avatar at its head, and the
 * avatar alone once the bar shrinks. The menu sets the theme, so the theme
 * switch steps aside.
 *
 * @attr {Array<object>} items - The menus and links, in order; `{ label, href, end: true }` for the forum's sections (JSON)
 * @attr {string} action - The sign-in button's label, also its accessible name once only the icon shows; none when empty
 * @attr {object} user - The signed-in member, `{ name, avatar?, role?, email? }` with `avatar` a picture's URL and `role` such as Admin or Moderator; replaces Sign In with their profile menu (JSON)
 * @attr {Array<object>} threads - The threads to search (JSON)
 * @attr {string} search-placeholder - The search field's placeholder
 * @attr {string} search-shortcut - Opens the search from anywhere on the page, as `mod+k`; none when empty
 * @fires lw-search - The query changed; `detail: { query, words, member, category }`, the filters as typed, without `@` and `#`
 */
export class LwForumNavbar extends LwFloatingNavbar {
  static styles = [LwFloatingNavbar.styles, styles];
  static props = {
    ...LwFloatingNavbar.props,
    items: { type: Object, default: [...LwFloatingNavbar.props.items.default, ...FORUM_LINKS] },
    action: { default: 'Sign In' },
    threads: { type: Object, default: DEMO_THREADS },
    searchPlaceholder: { default: 'Search the forum' },
    searchShortcut: { default: 'mod+k' },
    user: { type: Object },
  };

  // Index of the highlighted option in the panel, -1 when none is.
  #active = -1;
  // What the panel last showed, so a caret move that changes nothing keeps it.
  #painted = '';
  #query = '';

  render() {
    const template = document.createElement('template');
    template.innerHTML = super.render();
    const markup = template.content;
    // The account icon leads the sign-in button, and stays when its label goes.
    const cta = markup.querySelector('.end .cta');
    cta.insertAdjacentHTML('afterbegin', `<span class="cta-icon" slot="start">${strokeIcon(user, 16)}</span>`);
    // Signed in, the member's profile menu stands where Sign In was.
    cta.insertAdjacentHTML('afterend', '<lw-profile-dropdown class="profile" hidden></lw-profile-dropdown>');
    markup.querySelector('.end .theme').insertAdjacentHTML('afterend', `<lw-button class="search-button" variant="outline"><span class="search-button-icon" slot="start">${strokeIcon(search, 16)}</span><span class="visually-hidden">Search</span></lw-button>`);
    // The field over the bar's row, and the panel the bar grows down to hold.
    markup.querySelector('.inner .bar').insertAdjacentHTML('afterend', SEARCH_MARKUP + PANEL_MARKUP);
    return template.innerHTML;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    const input = this.query('.search-input');
    const panel = this.query('.results');
    this.query('.search-button').addEventListener('click', () => this.openSearch(), options);
    this.query('.search-close').addEventListener('click', () => this.closeSearch(), options);
    input.addEventListener('input', () => this.#paintSearch(), options);
    input.addEventListener('keydown', (event) => this.#searchKey(event), options);
    input.addEventListener('keyup', (event) => CARET_KEYS.has(event.key) && this.#paintSearch(), options);
    input.addEventListener('click', () => this.#paintSearch(), options);
    // A press in the panel leaves the focus in the field.
    panel.addEventListener('mousedown', (event) => event.preventDefault(), options);
    panel.addEventListener('click', (event) => this.#choose(event.target.closest('.option, .filter'), event), options);
    panel.addEventListener('pointermove', (event) => {
      const option = event.target.closest('.option');
      if (option && event.pointerType !== 'touch') this.#highlight(this.#options.indexOf(option), false);
    }, options);
    // A press or the focus going anywhere else closes the search.
    document.addEventListener('pointerdown', (event) => {
      if (this.#searching && !event.composedPath().includes(this.query('.frame'))) this.closeSearch(false);
    }, options);
    this.query('.frame').addEventListener('focusout', (event) => {
      if (this.#searching && event.relatedTarget && !this.query('.frame').contains(event.relatedTarget)) this.closeSearch(false);
    }, options);
    // The panel is filled and painted once, unseen, while the page is idle,
    // so the first search opens as smoothly as the rest.
    const idle = window.requestIdleCallback ?? ((callback) => setTimeout(callback, 200));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const ahead = idle(() => {
      this.#paintSearch();
      if (this.#searching) return;
      this.toggleAttribute('data-warm', true);
      requestAnimationFrame(() => requestAnimationFrame(() => this.removeAttribute('data-warm')));
    });
    this.signal.addEventListener('abort', () => cancel(ahead));
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('items')) this.#markEnd();
    if (changed.has('user') || changed.has('action')) this.#paintAccount();
    if (changed.has('searchPlaceholder')) this.query('.search-input').placeholder = this.searchPlaceholder ?? '';
    if (changed.has('searchShortcut')) this.query('.search-button').shortcut = this.searchShortcut || '';
    // New threads redraw the open panel, or the next one to open.
    if (changed.has('threads')) {
      this.#painted = '';
      if (this.#searching) this.#paintSearch();
    }
  }

  /** Shrinks the bar to the search field and puts the focus in it. */
  openSearch() {
    const input = this.query('.search-input');
    if (!this.#searching) {
      const burger = this.query('.burger');
      if (burger.open) burger.toggle(false);
      this.removeAttribute('data-warm');
      this.toggleAttribute('data-searching', true);
      this.query('.bar').inert = true;
      this.query('.search').inert = false;
      this.query('.results').inert = false;
      this.#paintSearch();
      input.ariaExpanded = String(!this.query('.search-list').hidden);
    }
    input.focus({ preventScroll: true });
    input.select();
  }

  /** Brings the bar back; the focus returns to the search button unless `restoreFocus` is false. */
  closeSearch(restoreFocus = true) {
    if (!this.#searching) return;
    const input = this.query('.search-input');
    this.toggleAttribute('data-searching', false);
    this.query('.bar').inert = false;
    this.query('.search').inert = true;
    this.query('.results').inert = true;
    input.ariaExpanded = 'false';
    input.removeAttribute('aria-activedescendant');
    if (restoreFocus) this.query('.search-button').focus();
  }

  get #searching() {
    return this.hasAttribute('data-searching');
  }

  get #threads() {
    return Array.isArray(this.threads) ? this.threads : [];
  }

  get #options() {
    return [...this.shadowRoot.querySelectorAll('.search-list .option')];
  }

  // The panel for the field as it stands: the guide when it is empty, the
  // members or categories while the caret is in an `@` or `#` word, else the
  // threads found.
  #paintSearch() {
    const input = this.query('.search-input');
    const value = input.value;
    const token = tokenAt(value, input.selectionStart ?? value.length);
    const signature = token ? `${token.kind}${token.text}` : `=${value.trim()}`;
    if (signature === this.#painted) return;
    this.#painted = signature;

    let list;
    let head = '';
    let none = '';
    let status = '';
    if (token) {
      const found = suggestionsMarkup(this.#threads, token);
      list = found.count ? found.html : '';
      const kind = token.kind === '@' ? 'members' : 'categories';
      if (!found.count) none = noneMarkup(`No ${kind} match`, `Keep typing, or remove the ${token.kind} to search every thread.`);
      status = found.count ? `${found.count} ${kind}` : `No ${kind} match`;
    } else if (!value.trim()) {
      list = guideMarkup(this.#threads);
    } else {
      const found = resultsMarkup(this.#threads, parseQuery(value));
      ({ head } = found);
      list = found.html;
      if (!found.count) none = noneMarkup('No threads match', 'Try fewer words, or remove a filter.');
      status = found.count ? `${found.count} ${found.count === 1 ? 'thread' : 'threads'}` : 'No threads match';
    }

    const listbox = this.query('.search-list');
    listbox.innerHTML = list;
    listbox.hidden = !list;
    this.#options.forEach((option, i) => {
      option.id = `option-${i}`;
      option.ariaSelected = 'false';
    });
    const headElement = this.query('.results-head');
    headElement.innerHTML = head;
    headElement.hidden = !head;
    const noneElement = this.query('.none');
    noneElement.innerHTML = none;
    noneElement.hidden = !none;
    this.query('.search-status').textContent = status;
    this.query('.results-body').scrollTop = 0;
    input.ariaExpanded = String(this.#searching && Boolean(list));
    // Suggestions and threads start on the first, so Enter takes it; the
    // guide waits for the arrow keys.
    this.#highlight(token || value.trim() ? 0 : -1);

    const query = value.trim();
    if (query !== this.#query) {
      this.#query = query;
      this.emit('search', { query, ...parseQuery(query) });
    }
  }

  #highlight(index, scroll = true) {
    const options = this.#options;
    this.#active = index >= 0 && index < options.length ? index : -1;
    options.forEach((option, i) => (option.ariaSelected = String(i === this.#active)));
    const input = this.query('.search-input');
    const active = options[this.#active];
    if (active) {
      input.setAttribute('aria-activedescendant', active.id);
      if (scroll) active.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  #searchKey(event) {
    const options = this.#options;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!options.length) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      const from = this.#active === -1 ? (step === 1 ? -1 : 0) : this.#active;
      this.#highlight((from + step + options.length) % options.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.#choose(options[this.#active], event);
    } else if (event.key === 'Tab' && !event.shiftKey && this.#active !== -1 && options[this.#active].dataset.insert) {
      // Tab finishes the member or category, as in a shell.
      event.preventDefault();
      this.#choose(options[this.#active], event);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeSearch();
    } else if (this.searchShortcut && matchesShortcut(event, parseShortcut(this.searchShortcut))) {
      event.preventDefault();
      event.target.select();
    }
  }

  // Acts on an option or filter: a thread opens, a member, category or tip
  // goes into the field, and a filter comes out of it.
  #choose(option, event) {
    if (!option) return;
    const input = this.query('.search-input');
    if (option.classList.contains('hit')) {
      // A click follows the link itself; Enter follows it here.
      if (event.type === 'keydown') option.click();
      this.closeSearch(false);
      return;
    }
    let value = input.value;
    let caret;
    if (option.dataset.remove) {
      const kind = option.dataset.remove;
      value = value.split(/\s+/).filter((part) => part && !part.startsWith(kind)).join(' ');
      if (value) value += ' ';
      caret = value.length;
    } else {
      const insert = option.dataset.insert ?? '';
      const token = tokenAt(value, input.selectionStart ?? value.length);
      if (token && option.classList.contains('suggestion')) {
        value = value.slice(0, token.start) + insert + value.slice(token.end).trimStart();
        caret = token.start + insert.length;
      } else {
        value = value.trimEnd();
        value = value && insert ? `${value} ${insert}` : value || insert;
        caret = value.length;
      }
    }
    input.value = value;
    input.focus({ preventScroll: true });
    input.setSelectionRange(caret, caret);
    this.#paintSearch();
  }

  // Sign In for a guest; for a member, their profile menu with their picture
  // and name, and no email. Its menu sets the theme, so the theme switch
  // steps aside for it.
  #paintAccount() {
    const member = this.user && typeof this.user === 'object' && this.user.name ? this.user : null;
    const profile = this.query('.profile');
    const cta = this.query('.end .cta');
    profile.hidden = !member;
    cta.hidden = Boolean(member) || !this.action;
    this.query('.end .theme').hidden = Boolean(member);
    profile.items = ACCOUNT_ITEMS;
    // The role stands across from the avatar, where the menu shows a plan.
    if (member) profile.accounts = [{ id: 'member', name: member.name, avatar: member.avatar, email: member.email, plan: member.role }];
  }

  // The first item marked `end` starts the group on the far side, and on a
  // narrow screen a group of its own in the menu.
  #markEnd() {
    const items = Array.isArray(this.items) ? this.items : [];
    const first = items.findIndex((item) => item?.end);
    for (const list of [this.query('.list'), this.query('.m-list')]) {
      [...list.children].forEach((entry, index) => entry.toggleAttribute('data-end', index === first));
    }
  }
}
