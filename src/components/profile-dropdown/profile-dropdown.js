import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { check, chevronLeft, chevronRight, chevronsUpDown, creditCard, logOut, monitor, moon, plus, settings, sun, user } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo } from '../../core/motion.js';
import { initialsOf } from '../../core/people.js';
import { setTheme, themeChoice, watchTheme } from '../../core/theme.js';
import styles from './profile-dropdown.scss?inline';

const DEMO_ACCOUNTS = [
  { id: 'personal', name: 'Maya Ortega', email: 'maya@ortega.me', plan: 'Pro' },
  { id: 'lowersoft', name: 'LowerSoft', email: 'team@lowersoft.dev', plan: 'Team' },
  { id: 'side', name: 'Night Shift', email: 'hello@nightshift.dev', plan: 'Free' },
];

const DEMO_ITEMS = [
  { label: 'Profile', icon: user },
  { label: 'Settings', icon: settings, value: '⌘,' },
  { label: 'Billing', icon: creditCard },
];

const STATUSES = [
  { id: 'online', label: 'Online', name: 'Online' },
  { id: 'away', label: 'Away', name: 'Away' },
  { id: 'busy', label: 'DND', name: 'Do not disturb' },
];

const THEMES = [
  { id: 'light', label: 'Light', icon: sun },
  { id: 'dark', label: 'Dark', icon: moon },
  { id: 'system', label: 'System', icon: monitor },
];

const PANEL_W = 288;
const SPRING = springFeel(0.3, 0);
const NAV_KEYS = new Set(['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End']);
const NUDGE_MS = 1400;

// A click fired by Enter or Space carries no pointer detail.
const viaOf = (event) => (event.detail === 0 ? 'keyboard' : 'pointer');

const avatar = (account, tone, size, status, attributes = '') =>
  `<span class="avatar"${attributes} data-tone="${tone % 3}" style="--_size: ${size}px" aria-hidden="true">${escapeHtml(account.initials ?? initialsOf(account.name))}${status ? `<span class="dot" data-status="${status}"></span>` : ''}</span>`;

const identity = (account, tone, status, stacked) =>
  `${avatar(account, tone, stacked ? 40 : 32, status, ' data-piece="avatar"')}<span class="text"><span class="name" data-piece="name">${escapeHtml(account.name)}</span><span class="email" data-piece="email">${escapeHtml(account.email)}</span></span>`;

// Where arrow keys move focus: rows go up and down, radios left and right.
const nextTarget = (items, active, key) => {
  if (key === 'Home') return items[0];
  if (key === 'End') return items.at(-1);
  const current = items.find((item) => item === active);
  if (!current) return key === 'ArrowUp' ? items.at(-1) : items[0];
  if (key === 'ArrowLeft' || key === 'ArrowRight') {
    const row = items.filter((item) => item.dataset.row === current.dataset.row);
    if (row.length < 2) return undefined;
    return row[(row.indexOf(current) + (key === 'ArrowRight' ? 1 : -1) + row.length) % row.length];
  }
  const rows = [...new Set(items.map((item) => item.dataset.row))];
  const step = key === 'ArrowDown' ? 1 : -1;
  const next = rows[(rows.indexOf(current.dataset.row) + step + rows.length) % rows.length];
  const candidates = items.filter((item) => item.dataset.row === next);
  return candidates.find((item) => item.ariaChecked === 'true') ?? candidates[0];
};

/**
 * An account card that morphs into its own menu: the avatar, name and email
 * travel from the card into the menu's header as it grows out of the card.
 * The menu sets a status, the page theme, has links, switches accounts on a
 * second page, and signs out on a long press.
 *
 * Accounts are `{ id, name, email, initials?, plan? }`. Items are
 * `{ label, icon?, value?, href?, external? }`, where `icon` is the inner
 * markup of a 24 × 24 stroked SVG; an item with `href` is a link.
 *
 * @attr {Array<object>} accounts - The accounts (JSON)
 * @attr {string} account - The current account's id; defaults to the first
 * @attr {Array<object>} items - Menu entries between the settings rows and Switch account (JSON)
 * @attr {'online'|'away'|'busy'} status
 * @attr {number} hold-duration - How long Sign out is held, in ms
 * @fires lw-select - An item was chosen; `detail: { item, index }`
 * @fires lw-account - Another account was picked; `detail: { account }`
 * @fires lw-status - `detail: { status }`
 * @fires lw-theme - `detail: { theme }`
 * @fires lw-add-account - Add account was chosen
 * @fires lw-sign-out - Sign out was held to the end
 * @csspart trigger
 * @csspart panel
 */
export class LwProfileDropdown extends LwElement {
  static styles = styles;
  static props = {
    accounts: { type: Object, default: DEMO_ACCOUNTS },
    account: { default: '' },
    items: { type: Object, default: DEMO_ITEMS },
    status: { default: 'online', reflect: true },
    holdDuration: { type: Number, default: 1200 },
  };

  #phase = 'closed';
  #page = 'main';
  // The open spring runs 0 (the card) to 1 (the menu).
  #open = 0;
  #pageH = 0;
  #from = { w: 0, h: 0 };
  #pieces = [];
  #stops = { open: null, height: null };
  #hold = { timer: 0, nudge: 0 };

  render() {
    const statuses = STATUSES.map(
      ({ id, label, name }) =>
        `<button class="status" type="button" role="menuitemradio" tabindex="-1" data-menu-item data-row="status" data-status="${id}" aria-label="${name}"><span class="dot" data-status="${id}"></span>${label}</button>`,
    ).join('');
    const themes = THEMES.map(
      ({ id, label, icon }) =>
        `<button class="theme" type="button" role="menuitemradio" tabindex="-1" data-menu-item data-row="theme" data-theme="${id}" aria-label="${label}">${strokeIcon(icon, 14)}</button>`,
    ).join('');
    const signOut = `${strokeIcon(logOut)}<span class="grow">Sign out</span><span class="hint"></span>`;
    return `<button class="trigger" part="trigger" type="button" aria-haspopup="menu" aria-expanded="false"><span class="identity"></span>${strokeIcon(chevronsUpDown)}</button>
<div class="panel" part="panel" hidden data-page="main">
  <div class="surface" aria-hidden="true"><div class="edge"></div><div class="fill"></div></div>
  <div class="content"><div class="pages">
    <div class="page main">
      <div class="head"><span class="identity stacked"></span><span class="plan body"></span></div>
      <div class="menu body" role="menu" tabindex="-1">
        <div class="field" role="group" aria-label="Status"><span class="caption">Status</span><span class="radios">${statuses}</span></div>
        <div class="field" role="group" aria-label="Theme"><span class="caption">Theme</span><span class="themes"><span class="theme-plate" aria-hidden="true"></span>${themes}</span></div>
        <hr>
        <div class="items"></div>
        <button class="item switch" type="button" role="menuitem" tabindex="-1" data-menu-item data-row="switch" aria-haspopup="menu" aria-expanded="false"><span class="stack"></span><span class="grow">Switch account</span>${strokeIcon(chevronRight)}</button>
        <hr>
        <button class="item sign-out" type="button" role="menuitem" tabindex="-1" data-menu-item data-row="sign-out">${signOut}<span class="visually-hidden">, press and hold to confirm</span><span class="fill-copy" aria-hidden="true">${signOut}</span></button>
      </div>
    </div>
    <div class="page accounts" inert>
      <div class="menu body" role="menu" tabindex="-1" aria-label="Switch account">
        <button class="item back" type="button" role="menuitem" tabindex="-1" data-menu-item data-row="back">${strokeIcon(chevronLeft)}<span class="visually-hidden">Back to </span>Switch account</button>
        <hr>
        <div class="list"></div>
        <hr>
        <button class="item add" type="button" role="menuitem" tabindex="-1" data-menu-item data-row="add"><span class="add-mark">${strokeIcon(plus, 14)}</span>Add account</button>
      </div>
    </div>
  </div></div>
</div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const trigger = this.query('.trigger');
    const panel = this.query('.panel');
    trigger.addEventListener('click', (event) => this.#openMenu(viaOf(event), viaOf(event) === 'keyboard' ? 'first' : 'menu'), options);
    trigger.addEventListener('keydown', (event) => this.#triggerKey(event), options);
    panel.addEventListener('click', (event) => this.#click(event), options);
    panel.addEventListener('keydown', (event) => this.#key(event), options);
    panel.addEventListener('pointermove', (event) => this.#hover(event), options);
    const signOut = this.query('.sign-out');
    signOut.addEventListener('pointerdown', (event) => this.#holdDown(event), options);
    for (const type of ['pointerup', 'pointercancel', 'blur']) signOut.addEventListener(type, () => this.#holdCancel(), options);
    signOut.addEventListener('contextmenu', (event) => event.preventDefault(), options);
    signOut.addEventListener('keyup', (event) => (event.key === 'Enter' || event.key === ' ') && this.#holdCancel(), options);
    // A press anywhere outside closes, with the morph.
    document.addEventListener('pointerdown', (event) => !event.composedPath().includes(this) && this.#closeMenu('pointer', false), { ...options, capture: true });
    watchTheme(() => this.#paintChoices(), this.signal);
    this.signal.addEventListener('abort', () => this.#finishClose());
  }

  updated(changed) {
    if (['accounts', 'account', 'items'].some((name) => changed.has(name))) this.#renderAccount();
    if (changed.has('holdDuration')) this.query('.sign-out').style.setProperty('--_hold', `${this.holdDuration}ms`);
    this.#paintChoices();
  }

  get #current() {
    return this.accounts.find(({ id }) => id === this.account) ?? this.accounts[0] ?? { id: 'guest', name: 'Guest', email: '' };
  }

  // The parts that depend on the account and the items.
  #renderAccount() {
    const account = this.#current;
    const tone = Math.max(0, this.accounts.indexOf(account));
    const others = this.accounts.filter((entry) => entry !== account);
    this.query('.trigger .identity').innerHTML = identity(account, tone, this.status, false);
    this.query('.head .identity').innerHTML = identity(account, tone, this.status, true);
    this.query('.plan').textContent = account.plan ?? '';
    this.query('.items').innerHTML = this.items
      .map((item, i) => {
        const tag = item.href ? 'a' : 'button';
        const link = item.href ? ` href="${escapeHtml(item.href)}"${item.external ? ' target="_blank" rel="noopener noreferrer"' : ''}` : ' type="button"';
        return `<${tag} class="item"${link} role="menuitem" tabindex="-1" data-menu-item data-row="item-${i}" data-index="${i}"><span class="icon">${item.icon ? strokeIcon(item.icon) : ''}</span><span class="grow">${escapeHtml(item.label)}</span>${item.value ? `<span class="value">${escapeHtml(item.value)}</span>` : ''}</${tag}>`;
      })
      .join('');
    const switcher = this.query('.switch');
    switcher.hidden = this.accounts.length < 2;
    switcher.querySelector('.stack').innerHTML = others
      .slice(0, 2)
      .map((entry) => avatar(entry, this.accounts.indexOf(entry), 20))
      .join('');
    this.query('.list').innerHTML = this.accounts
      .map(
        (entry, i) =>
          `<button class="item account" type="button" role="menuitemradio" tabindex="-1" data-menu-item data-row="account-${i}" data-account="${escapeHtml(entry.id)}" aria-checked="${entry === account}">${avatar(entry, i, 28, entry === account ? this.status : null)}<span class="text"><span class="name">${escapeHtml(entry.name)}</span><span class="email">${escapeHtml(entry.email)}</span></span>${entry === account ? strokeIcon(check) : ''}</button>`,
      )
      .join('');
    if (this.#phase === 'open') this.#springHeight(this.#pageEl.offsetHeight, false);
  }

  // Status and theme: the checked radios, the dots and the theme plate.
  #paintChoices() {
    for (const button of this.shadowRoot.querySelectorAll('.status')) button.ariaChecked = String(button.dataset.status === this.status);
    for (const dot of this.shadowRoot.querySelectorAll('.avatar .dot')) dot.dataset.status = this.status;
    const theme = themeChoice();
    const themes = [...this.shadowRoot.querySelectorAll('.theme')];
    themes.forEach((button) => (button.ariaChecked = String(button.dataset.theme === theme)));
    this.query('.themes').style.setProperty('--_i', themes.findIndex((button) => button.dataset.theme === theme));
  }

  get #pageEl() {
    return this.query(`.page.${this.#page}`);
  }

  #items(page = this.#pageEl) {
    return [...page.querySelectorAll('[data-menu-item]')].filter((item) => !item.closest('[hidden]'));
  }

  // ---- The morph ----

  #stopAll() {
    for (const key of Object.keys(this.#stops)) {
      this.#stops[key]?.();
      this.#stops[key] = null;
    }
  }

  // Clips the surface and the content to the growing box, and moves the
  // header's avatar, name and email along from where they sit in the card.
  #frame() {
    const p = this.#open;
    const w = this.#from.w + (PANEL_W - this.#from.w) * p;
    const h = this.#from.h + (this.#pageH - this.#from.h) * p;
    const panel = this.query('.panel');
    panel.style.setProperty('--_w', `${w}px`);
    panel.style.setProperty('--_h', `${h}px`);
    const rest = 1 - p;
    for (const { el, dx, dy, scale } of this.#pieces) {
      el.style.transform = `translate(${dx * rest}px, ${dy * rest}px) scale(${1 + (scale - 1) * rest})`;
    }
  }

  // Offsets that put each header piece over its twin in the card.
  #measurePieces() {
    const trigger = this.query('.trigger');
    this.#from = { w: trigger.offsetWidth, h: trigger.offsetHeight };
    this.#pieces = [...this.query('.head').querySelectorAll('[data-piece]')].map((el) => {
      el.style.transform = '';
      const to = el.getBoundingClientRect();
      const from = trigger.querySelector(`[data-piece="${el.dataset.piece}"]`).getBoundingClientRect();
      return { el, dx: from.left - to.left, dy: from.top - to.top, scale: from.height / to.height || 1 };
    });
  }

  #springOpen(target, done) {
    this.#stops.open?.();
    this.#stops.open = springTo(this.#open, target, {
      ...SPRING,
      restDelta: 0.001,
      update: (value) => {
        this.#open = value;
        this.#frame();
      },
      done: () => {
        this.#stops.open = null;
        done?.();
      },
    });
  }

  #springHeight(target, instant) {
    this.#stops.height?.();
    this.#stops.height = null;
    if (instant || reducedMotion.matches) {
      this.#pageH = target;
      this.#frame();
      return;
    }
    this.#stops.height = springTo(this.#pageH, target, {
      ...SPRING,
      restDelta: 0.1,
      update: (value) => {
        this.#pageH = value;
        this.#frame();
      },
    });
  }

  // Opens with the morph; a keyboard open skips straight to the end.
  #openMenu(via, focus) {
    if (this.#phase === 'open') return;
    const resume = this.#phase === 'closing';
    const instant = via === 'keyboard' || reducedMotion.matches;
    this.#phase = 'open';
    const panel = this.query('.panel');
    panel.hidden = false;
    panel.classList.toggle('instant', instant);
    this.#setPage('main', true);
    this.toggleAttribute('data-open', true);
    this.query('.trigger').ariaExpanded = 'true';
    if (!resume) this.#measurePieces();
    this.#pageH = this.#pageEl.offsetHeight;
    this.#stopAll();
    if (instant) {
      this.#open = 1;
      this.#frame();
    } else {
      if (!resume) this.#open = 0;
      this.#frame();
      this.#springOpen(1);
    }
    panel.dataset.phase = 'open';
    const items = this.#items();
    ({ first: items[0], last: items.at(-1), menu: this.query('.main .menu') })[focus]?.focus({ preventScroll: true });
  }

  #closeMenu(via, returnFocus) {
    if (this.#phase !== 'open') return;
    const trigger = this.query('.trigger');
    if (returnFocus) trigger.focus({ preventScroll: true });
    // A finished sign-out stays filled while the menu folds away.
    if (!this.query('.sign-out').hasAttribute('data-done')) this.#holdCancel(true);
    trigger.ariaExpanded = 'false';
    if (via === 'keyboard' || reducedMotion.matches) {
      this.#finishClose();
      return;
    }
    this.#phase = 'closing';
    const panel = this.query('.panel');
    panel.classList.remove('instant');
    panel.dataset.phase = 'closing';
    this.#stops.height?.();
    // The header may have been redrawn for another account since it opened.
    this.#measurePieces();
    this.#frame();
    this.#springOpen(0, () => this.#finishClose());
  }

  #finishClose() {
    this.#stopAll();
    this.#phase = 'closed';
    this.#open = 0;
    this.#holdCancel(true);
    const panel = this.query('.panel');
    panel.hidden = true;
    delete panel.dataset.phase;
    this.removeAttribute('data-open');
  }

  // Switching pages: push sideways and spring the height to the new page.
  #setPage(page, instant = false) {
    this.#page = page;
    const panel = this.query('.panel');
    panel.dataset.page = page;
    panel.classList.toggle('instant-pages', instant);
    for (const el of this.shadowRoot.querySelectorAll('.page')) el.inert = !el.classList.contains(page);
    this.query('.switch').ariaExpanded = String(page === 'accounts');
    if (!instant) this.#springHeight(this.#pageEl.offsetHeight, false);
  }

  #goTo(page) {
    this.#setPage(page);
    if (page === 'accounts') {
      const items = this.#items();
      (items.find((item) => item.ariaChecked === 'true') ?? items[0]).focus({ preventScroll: true });
    } else {
      this.query('.switch').focus({ preventScroll: true });
    }
  }

  // ---- Choosing ----

  #click(event) {
    const item = event.target.closest('[data-menu-item]');
    if (!item) return;
    const via = viaOf(event);
    const { row } = item.dataset;
    if (row === 'status') {
      this.status = item.dataset.status;
      this.emit('status', { status: this.status });
    } else if (row === 'theme') {
      setTheme(item.dataset.theme);
      this.emit('theme', { theme: item.dataset.theme });
    } else if (row === 'switch') {
      this.#goTo('accounts');
    } else if (row === 'back') {
      this.#goTo('main');
    } else if (item.dataset.account !== undefined) {
      const account = this.accounts.find(({ id }) => id === item.dataset.account);
      if (account && account !== this.#current) {
        this.account = account.id;
        this.#renderAccount();
        this.emit('account', { account });
      }
      this.#goTo('main');
    } else if (row === 'add') {
      this.emit('add-account');
      this.#closeMenu(via, true);
    } else if (item.dataset.index !== undefined) {
      const index = Number(item.dataset.index);
      this.emit('select', { item: this.items[index], index });
      this.#closeMenu(via, true);
    }
  }

  // ---- Keyboard ----

  #triggerKey(event) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    this.#openMenu('keyboard', event.key === 'ArrowDown' ? 'first' : 'last');
  }

  #key(event) {
    if (event.target.matches('.sign-out') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      if (!event.repeat) this.#holdStart('keyboard');
      return;
    }
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      this.#closeMenu('keyboard', true);
      return;
    }
    if (this.#page === 'accounts' && event.key === 'Backspace') {
      event.preventDefault();
      this.#goTo('main');
      return;
    }
    if (!NAV_KEYS.has(event.key)) return;
    event.preventDefault();
    const active = this.shadowRoot.activeElement;
    const target = nextTarget(this.#items(), active, event.key);
    if (target) target.focus({ preventScroll: true });
    else if (this.#page === 'accounts' && event.key === 'ArrowLeft') this.#goTo('main');
    else if (event.key === 'ArrowRight' && active?.matches('.switch')) this.#goTo('accounts');
  }

  // Hovering an item focuses it, so pointer and keyboard share one highlight.
  #hover(event) {
    if (event.pointerType !== 'mouse' || this.#phase !== 'open') return;
    const item = event.target.closest('[data-menu-item]');
    if (item && this.shadowRoot.activeElement !== item) item.focus({ preventScroll: true });
  }

  // ---- Hold to sign out ----

  #holdDown(event) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    this.#holdStart('pointer');
  }

  #holdStart(via) {
    const button = this.query('.sign-out');
    if (this.#hold.timer || button.hasAttribute('data-done')) return;
    clearTimeout(this.#hold.nudge);
    button.removeAttribute('data-nudge');
    button.toggleAttribute('data-holding', true);
    this.#hold.timer = setTimeout(() => {
      this.#hold.timer = 0;
      button.removeAttribute('data-holding');
      button.toggleAttribute('data-done', true);
      this.emit('sign-out');
      this.#closeMenu(via, true);
    }, this.holdDuration);
  }

  // Let go early: the fill drains and the hint asks to keep holding.
  #holdCancel(reset = false) {
    const button = this.query('.sign-out');
    clearTimeout(this.#hold.nudge);
    if (reset) {
      clearTimeout(this.#hold.timer);
      this.#hold.timer = 0;
      for (const name of ['data-holding', 'data-nudge', 'data-done']) button.removeAttribute(name);
      return;
    }
    if (!this.#hold.timer) return;
    clearTimeout(this.#hold.timer);
    this.#hold.timer = 0;
    button.removeAttribute('data-holding');
    button.toggleAttribute('data-nudge', true);
    this.#hold.nudge = setTimeout(() => button.removeAttribute('data-nudge'), NUDGE_MS);
  }
}
