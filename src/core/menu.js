import menuStyles from '../styles/menu.scss?inline';
import { hideHighlight, moveHighlight } from './highlight.js';
import { CHECK_ICON } from './icons.js';

/** Styles for `Menu`; add to a component's `static styles` along with `iconStyles`. */
export { menuStyles };

const GAP = 6; // px between the trigger and the menu
let openMenu = null; // only one menu is open at a time
const MARGIN = 8; // px the menu keeps from the viewport edges

/** Markup of a menu container; its trigger refers to it with `aria-controls="<id>"`. */
export const menuMarkup = (id = 'menu') =>
  `<div class="menu" part="menu" id="${id}" role="menu" popover="manual"><span class="highlight" aria-hidden="true"></span></div>`;

/** Markup of the menu container for a component with a single menu. */
export const MENU_MARKUP = menuMarkup();

// For search: lowercase without accents, so "turk" finds "Türkiye".
const fold = (text) => text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();

/**
 * A single-choice menu that follows the WAI-ARIA menu button pattern:
 * `menuitemradio` items, arrow keys that wrap, Home and End, Enter or Space
 * to pick, Escape to close back to the trigger and Tab to leave. Hover moves
 * focus, so pointer and keyboard share one highlight that slides between items.
 *
 * The menu opens as a popover in the top layer, so no ancestor clips it. It
 * is at least as wide as the trigger, aligns to the trigger's end below it,
 * or above when there is no room, and closes when the page scrolls or resizes.
 *
 * Long menus can take a search box fixed at the top, and stay below the
 * trigger, scrolling within the room left above the bottom of the screen.
 * Items can be disabled with a hint, shown in a tooltip on hover or focus.
 */
export class Menu {
  #trigger;
  #menu;
  #list;
  #search = null;
  #empty = null;
  #tooltip = null;
  #onPick;
  #canOpen;
  #flip;

  /**
   * @param {object} options
   * @param {HTMLElement} options.trigger - Button that opens the menu
   * @param {HTMLElement} options.menu - Container rendered from `MENU_MARKUP`
   * @param {(value: string) => void} options.onPick
   * @param {() => boolean} [options.canOpen]
   * @param {string} [options.search] - Placeholder of a search box at the top; no box without it
   * @param {boolean} [options.flip] - Open above the trigger when there is no room below
   */
  constructor({ trigger, menu, onPick, canOpen = () => true, search, flip = !search }) {
    this.#trigger = trigger;
    this.#menu = menu;
    this.#list = menu;
    this.#onPick = onPick;
    this.#canOpen = canOpen;
    this.#flip = flip;
    if (search) this.#addSearch(search);
    this.#tooltip = Object.assign(document.createElement('span'), { className: 'menu-tooltip', role: 'tooltip', hidden: true });
    menu.append(this.#tooltip);
  }

  // A search box fixed above a list that scrolls, with a line for no matches.
  #addSearch(placeholder) {
    const header = Object.assign(document.createElement('div'), { className: 'menu-search' });
    this.#search = Object.assign(document.createElement('input'), { type: 'search', placeholder, autocomplete: 'off', spellcheck: false });
    this.#search.ariaLabel = placeholder;
    header.append(this.#search);
    this.#list = Object.assign(document.createElement('div'), { className: 'menu-list', role: 'none' });
    this.#list.append(this.#menu.querySelector('.highlight'));
    this.#empty = Object.assign(document.createElement('p'), { className: 'menu-empty', textContent: 'No matches', hidden: true });
    this.#menu.append(header, this.#list, this.#empty);
    this.#menu.toggleAttribute('data-search', true);
  }

  /** Bind the listeners until `signal` aborts. */
  connect(signal) {
    const options = { signal };
    this.#trigger.addEventListener('click', () => (this.#isOpen ? this.close() : this.open()), options);
    this.#trigger.addEventListener('keydown', this.#onTriggerKeyDown, options);
    this.#menu.addEventListener('click', (event) => this.#pick(event.target.closest('.item')), options);
    this.#menu.addEventListener('keydown', this.#onMenuKeyDown, options);
    this.#menu.addEventListener('pointermove', (event) => event.target.closest('.item')?.focus({ preventScroll: true }), options);
    this.#menu.addEventListener('focusin', (event) => this.#focused(event.target.closest('.item')), options);
    // New results start from the top of the list.
    this.#search?.addEventListener(
      'input',
      () => {
        this.#filter();
        this.#list.scrollTop = 0;
      },
      options,
    );
    // A press anywhere but the menu and its trigger closes it; the trigger toggles on its own.
    document.addEventListener(
      'pointerdown',
      (event) => {
        const path = event.composedPath();
        if (!path.includes(this.#menu) && !path.includes(this.#trigger)) this.close();
      },
      options,
    );
    // A menu fixed to the viewport would drift from its trigger; it closes
    // instead. Scrolling inside the menu is fine.
    addEventListener('scroll', (event) => event.composedPath().includes(this.#menu) || this.close(), { ...options, capture: true });
    addEventListener('resize', () => this.close(), options);
  }

  /** @param {{ value: string, label: string, description?: string, disabled?: boolean, hint?: string }[]} items */
  setItems(items) {
    const nodes = items.map(({ value, label, description = '', disabled = false, hint = '' }) => {
      const item = Object.assign(document.createElement('div'), { className: 'item', role: 'menuitemradio', tabIndex: -1 });
      item.dataset.value = value;
      item.innerHTML = `${CHECK_ICON}<span class="item-label"></span><span class="item-description"></span>`;
      item.querySelector('.item-label').textContent = label;
      item.querySelector('.item-description').textContent = description;
      item.dataset.search = fold(`${label} ${description} ${value}`);
      if (disabled) {
        item.ariaDisabled = 'true';
        item.dataset.hint = hint;
      }
      return item;
    });
    this.#list.replaceChildren(this.#list.querySelector('.highlight'), ...nodes);
    // Without a search the items sit in the menu itself, next to the tooltip.
    if (!this.#tooltip.isConnected) this.#menu.append(this.#tooltip);
    this.#filter();
  }

  setChecked(value) {
    for (const item of this.#items) item.ariaChecked = String(item.dataset.value === value);
  }

  open(focusLast = false) {
    if (this.#isOpen || !this.#canOpen()) return;
    openMenu?.close();
    openMenu = this;
    if (this.#search) {
      this.#search.value = '';
      this.#filter();
    }
    this.#menu.showPopover();
    this.#place();
    this.#trigger.ariaExpanded = 'true';
    const items = this.#visibleItems;
    const checked = items.find((item) => item.ariaChecked === 'true');
    if (this.#search) {
      // Typing goes to the search; the checked item is in view below it.
      checked?.scrollIntoView({ block: 'nearest' });
      this.#search.focus();
      return;
    }
    (focusLast ? items.at(-1) : (checked ?? items[0]))?.focus();
  }

  close(restoreFocus = false) {
    if (!this.#isOpen) return;
    if (openMenu === this) openMenu = null;
    this.#menu.hidePopover();
    hideHighlight(this.#list.querySelector('.highlight'));
    this.#tooltip.hidden = true;
    this.#trigger.ariaExpanded = 'false';
    if (restoreFocus) this.#trigger.focus();
  }

  get #isOpen() {
    return this.#menu.matches(':popover-open');
  }

  // Below the trigger, aligned to its end; above it when there is no room
  // below, unless it must stay below, where it gets only the room there is
  // and scrolls. Never narrower than the trigger.
  #place() {
    const trigger = this.#trigger.getBoundingClientRect();
    const menu = this.#menu;
    menu.style.minWidth = `${trigger.width}px`;
    menu.style.maxHeight = '';
    // Layout size, unaffected by the opening scale.
    const { offsetWidth: width, offsetHeight: height } = menu;
    const room = innerHeight - MARGIN - (trigger.bottom + GAP);
    const below = !this.#flip || height <= room;
    if (below && height > room) menu.style.maxHeight = `${Math.max(room, 120)}px`;
    const left = Math.min(Math.max(trigger.right - width, MARGIN), innerWidth - width - MARGIN);
    menu.style.left = `${left}px`;
    menu.style.top = `${below ? trigger.bottom + GAP : trigger.top - GAP - height}px`;
    menu.dataset.side = below ? 'bottom' : 'top';
  }

  get #items() {
    return [...this.#list.querySelectorAll('.item')];
  }

  get #visibleItems() {
    return this.#items.filter((item) => !item.hidden);
  }

  // Keeps the items whose label, description or value has the search in it.
  #filter() {
    if (!this.#search) return;
    const query = fold(this.#search.value.trim());
    let shown = 0;
    for (const item of this.#items) {
      item.hidden = Boolean(query) && !item.dataset.search.includes(query);
      if (!item.hidden) shown += 1;
    }
    this.#empty.hidden = shown > 0;
    hideHighlight(this.#list.querySelector('.highlight'));
    this.#tooltip.hidden = true;
  }

  #pick(item) {
    if (!item || item.ariaDisabled === 'true') return;
    this.close(true);
    this.#onPick(item.dataset.value);
  }

  #focused(item) {
    moveHighlight(this.#list.querySelector('.highlight'), item);
    this.#showHint(item);
  }

  // A disabled item says why in a tooltip above it, or below near the top.
  #showHint(item) {
    const tooltip = this.#tooltip;
    const hint = item?.ariaDisabled === 'true' ? item.dataset.hint : '';
    tooltip.hidden = !hint;
    if (!hint) return;
    tooltip.textContent = hint;
    const box = item.getBoundingClientRect();
    const menu = this.#menu.getBoundingClientRect();
    const above = box.top - tooltip.offsetHeight - 4 > menu.top + (this.#search ? this.#search.offsetHeight : 0);
    tooltip.style.left = `${box.left - menu.left + box.width / 2}px`;
    tooltip.style.top = `${above ? box.top - menu.top - tooltip.offsetHeight - 4 : box.bottom - menu.top + 4}px`;
  }

  #onTriggerKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    this.open(event.key === 'ArrowUp');
  };

  #onMenuKeyDown = (event) => {
    const items = this.#visibleItems;
    const inSearch = event.target === this.#search;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close(true);
      return;
    }
    if (event.key === 'Tab') {
      this.close();
      return;
    }
    if (inSearch) {
      // From the search, the arrows go into the list and Enter takes the
      // first item that can be picked.
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        (event.key === 'ArrowDown' ? items[0] : items.at(-1))?.focus();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        this.#pick(items.find((item) => item.ariaDisabled !== 'true'));
      }
      return;
    }

    const index = items.indexOf(event.target.closest('.item'));
    // Above the first item is the search box.
    if (this.#search && ((event.key === 'ArrowUp' && index === 0) || (event.key.length === 1 && event.key !== ' '))) {
      if (event.key === 'ArrowUp') event.preventDefault();
      this.#search.focus();
      return;
    }
    const moves = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 };
    if (event.key in moves) {
      event.preventDefault();
      items.at(moves[event.key] % items.length)?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#pick(items[index]);
    }
  };
}
