import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { check, chevronLeft, chevronRight } from '../../core/lucide.js';
import { reducedMotion } from '../../core/motion.js';

const ROLES = { submenu: 'menuitem', radio: 'menuitemradio', toggle: 'menuitemcheckbox', action: 'menuitem', chapter: 'menuitemradio' };
const SLIDE = 220;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * A menu of pages that opens over the player from one of its buttons: a
 * root page leads to sub pages that slide in from the side, the panel's
 * height easing between them, and a header leads back. One highlight slides
 * between the items under the pointer or the keyboard.
 *
 * Pages come from `pages(id)`, called each time one is shown, as
 * `{ title, items }`. Items are `{ type, label, hint?, icon?, checked?,
 * disabled?, page?, media?, onSelect? }`: a `submenu` opens `page`, a `radio`
 * or `chapter` is picked and goes back a page (or closes the root), a
 * `toggle` flips in place and an `action` closes the menu; with `stay` any
 * of them redraws the page instead. `media` is markup to lead a chapter
 * with, such as its thumbnail, and `progress` (0 to 1) a bar along it.
 *
 * The keyboard follows the WAI-ARIA menu pattern: arrows that wrap, Home and
 * End, Enter or Space to pick, Right into a sub page and Left back out,
 * Escape to close back to the trigger and Tab to leave.
 */
export class MenuPanel {
  #panel;
  #pages;
  #trigger;
  #view;
  #stack = [];
  // The current page's items, and their elements.
  #current = [];
  #items = [];
  #onToggle;

  /**
   * @param {object} options
   * @param {HTMLElement} options.panel - The panel; its pages go in a `.pages` child
   * @param {HTMLElement} options.trigger - The button that opens it
   * @param {(id: string) => { title: string, items: object[] }} options.pages
   * @param {(open: boolean) => void} [options.onToggle]
   */
  constructor({ panel, trigger, pages, onToggle = () => {} }) {
    this.#panel = panel;
    this.#trigger = trigger;
    this.#pages = pages;
    this.#onToggle = onToggle;
    this.#view = panel.querySelector('.pages');
    trigger.setAttribute('aria-controls', panel.id);
    trigger.ariaExpanded = 'false';
  }

  /** Bind the listeners until `signal` aborts. */
  connect(signal) {
    const options = { signal };
    this.#trigger.addEventListener('click', () => (this.isOpen ? this.close() : this.open()), options);
    this.#trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      event.stopPropagation();
      this.open();
    }, options);
    this.#panel.addEventListener('click', (event) => this.#pick(event.target.closest('.item')), options);
    this.#panel.addEventListener('keydown', (event) => this.#key(event), options);
    this.#panel.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'mouse') event.target.closest('.item')?.focus({ preventScroll: true });
    }, options);
    this.#panel.addEventListener('focusin', (event) => this.#focused(event.target.closest('.item')), options);
    // A press anywhere but the panel and its trigger closes it.
    document.addEventListener('pointerdown', (event) => {
      const path = event.composedPath();
      if (this.isOpen && !path.includes(this.#panel) && !path.includes(this.#trigger)) this.close();
    }, options);
  }

  get isOpen() {
    return this.#panel.hasAttribute('data-open');
  }

  /** Open on the root page, the checked item or the first in focus. */
  open() {
    if (this.isOpen) return;
    this.#stack = ['root'];
    this.#show('root', 0);
    this.#panel.toggleAttribute('data-open', true);
    this.#trigger.ariaExpanded = 'true';
    this.#onToggle(true);
    this.#focusStart();
  }

  close({ restoreFocus = false } = {}) {
    if (!this.isOpen) return;
    this.#panel.toggleAttribute('data-open', false);
    this.#trigger.ariaExpanded = 'false';
    this.#onToggle(false);
    if (restoreFocus || this.#panel.contains(this.#panel.getRootNode().activeElement)) this.#trigger.focus({ preventScroll: true });
  }

  /** Redraw the page on show, as its values changed, keeping the focused item. */
  refresh() {
    if (!this.isOpen) return;
    const focused = this.#items.indexOf(this.#panel.getRootNode().activeElement);
    const scroll = this.#view.querySelector('.items')?.scrollTop ?? 0;
    this.#view.replaceChildren(this.#build(this.#stack.at(-1)));
    const items = this.#view.querySelector('.items');
    if (items) items.scrollTop = scroll;
    if (focused >= 0) this.#focus(this.#items[Math.min(focused, this.#items.length - 1)]);
  }

  // ---- Pages ----

  #build(id) {
    const { title = '', items = [] } = this.#pages(id) ?? {};
    const page = Object.assign(document.createElement('div'), { className: 'page' });
    page.dataset.page = id;
    const nested = this.#stack.length > 1;
    const head = nested
      ? `<div class="item back" role="menuitem" tabindex="-1">${strokeIcon(chevronLeft, 16)}<span class="item-label">${escapeHtml(title)}</span></div>`
      : title
        ? `<p class="page-title">${escapeHtml(title)}</p>`
        : '';
    page.innerHTML = `${head}<div class="items" role="none"><span class="highlight" aria-hidden="true"></span>${items.map((item, i) => this.#itemMarkup(item, i)).join('')}</div>`;
    this.#panel.ariaLabel = title;
    this.#current = items;
    this.#items = [...page.querySelectorAll('.item')];
    return page;
  }

  #itemMarkup(item, index) {
    const { type, label, hint = '', icon = '', checked = false, disabled = false, media = '', detail = '', progress } = item;
    const state = type === 'radio' || type === 'chapter' || type === 'toggle' ? ` aria-checked="${checked}"` : '';
    const lead = type === 'radio' ? `<span class="item-icon check">${strokeIcon(check, 16)}</span>` : type === 'chapter' ? media : icon ? `<span class="item-icon">${icon}</span>` : '';
    const end =
      type === 'submenu'
        ? `<span class="item-hint">${escapeHtml(hint)}</span>${strokeIcon(chevronRight, 16)}`
        : type === 'toggle'
          ? '<span class="item-switch" aria-hidden="true"></span>'
          : type === 'chapter'
            ? `<span class="item-hint">${escapeHtml(detail)}</span>`
            : hint
              ? `<span class="item-hint">${escapeHtml(hint)}</span>`
              : '';
    const body =
      type === 'chapter'
        ? `<span class="item-text"><span class="item-label">${escapeHtml(label)}</span><span class="item-time">${escapeHtml(hint)}</span></span>`
        : `<span class="item-label">${escapeHtml(label)}</span>`;
    const bar = progress == null ? '' : `<span class="item-progress" style="--_progress: ${progress}"></span>`;
    return `<div class="item" data-type="${type}" data-index="${index}" role="${ROLES[type]}" tabindex="-1"${state}${type === 'submenu' ? ' aria-haspopup="menu"' : ''}${disabled ? ' aria-disabled="true"' : ''}>${lead}${body}${end}${bar}</div>`;
  }

  // The new page slides in from the side it comes from, the old one out the
  // other, and the panel eases to the new page's height.
  #show(id, direction) {
    const old = this.#view.firstElementChild;
    const from = this.#view.offsetHeight;
    const page = this.#build(id);
    const animate = direction !== 0 && old && !reducedMotion.matches;
    if (!animate) {
      this.#view.replaceChildren(page);
      return;
    }
    old.classList.add('leaving');
    old.inert = true;
    this.#view.append(page);
    const to = page.offsetHeight;
    const shift = `${direction * 28}%`;
    const timing = { duration: SLIDE, easing: EASE };
    this.#view.animate([{ height: `${from}px` }, { height: `${to}px` }], timing);
    page.animate([{ translate: `${shift} 0`, opacity: 0 }, { translate: '0 0', opacity: 1 }], timing);
    old.animate([{ translate: '0 0', opacity: 1 }, { translate: `${direction * -28}% 0`, opacity: 0 }], { ...timing, fill: 'forwards' }).finished.then(
      () => old.remove(),
      () => old.remove(),
    );
  }

  #enter(id) {
    this.#stack.push(id);
    this.#show(id, 1);
    this.#focusStart();
  }

  #back() {
    if (this.#stack.length < 2) return;
    const from = this.#stack.pop();
    this.#show(this.#stack.at(-1), -1);
    // Back on the item that led to the page that closed.
    const index = this.#current.findIndex((item) => item.page === from);
    this.#focus(this.#items.find((item) => Number(item.dataset.index) === index) ?? this.#items[0]);
  }

  #focusStart() {
    this.#focus(this.#items.find((item) => item.ariaChecked === 'true' && item.dataset.type !== 'toggle') ?? this.#items.find((item) => !item.classList.contains('back')) ?? this.#items[0]);
  }

  // Focus without scrolling anything but the list, which brings the item
  // into view itself: the player around it must never scroll.
  #focus(item) {
    if (!item) return;
    item.focus({ preventScroll: true });
    const list = item.closest('.items');
    if (!list) return;
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
  }

  #pick(element) {
    if (!element || element.ariaDisabled === 'true') return;
    if (element.classList.contains('back')) {
      this.#back();
      return;
    }
    const item = this.#current[Number(element.dataset.index)];
    if (!item) return;
    if (item.type === 'submenu') {
      this.#enter(item.page);
      return;
    }
    item.onSelect?.();
    if (item.type === 'toggle' || item.stay) this.refresh();
    else if (item.type !== 'action' && this.#stack.length > 1) this.#back();
    else this.close({ restoreFocus: true });
  }

  #focused(item) {
    const highlight = item?.closest('.items')?.querySelector('.highlight');
    for (const other of this.#view.querySelectorAll('.highlight')) if (other !== highlight) hideHighlight(other);
    if (highlight) moveHighlight(highlight, item);
  }

  #key(event) {
    const index = this.#items.indexOf(event.target.closest('.item'));
    const element = this.#items[index];
    const moves = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: this.#items.length - 1 };
    if (event.key === 'Escape') this.close({ restoreFocus: true });
    else if (event.key === 'Tab') {
      this.close();
      return;
    } else if (event.key in moves) this.#focus(this.#items.at(moves[event.key] % this.#items.length));
    else if (event.key === 'Enter' || event.key === ' ') this.#pick(element);
    else if (event.key === 'ArrowRight' && element?.dataset.type === 'submenu') this.#pick(element);
    else if ((event.key === 'ArrowLeft' || event.key === 'Backspace') && this.#stack.length > 1) this.#back();
    else return;
    // The player's own shortcuts stay out of the menu.
    event.preventDefault();
    event.stopPropagation();
  }
}
