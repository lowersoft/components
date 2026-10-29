import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { check, chevronsUpDown, logOut, plus, search, settings } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { initialsOf } from '../../core/people.js';
import { IS_APPLE } from '../../core/platform.js';
import styles from './workspace-switcher.scss?inline';

const DEMO_WORKSPACES = [
  { id: 'lowersoft', name: 'LowerSoft', plan: 'Pro', members: 24, color: '#6366f1' },
  { id: 'runtime', name: 'lower Runtime', plan: 'Team', members: 8, color: '#f97316' },
  { id: 'night-shift', name: 'Night Shift', plan: 'Free', members: 3, color: '#10b981' },
  { id: 'sideproject', name: 'Side Project', plan: 'Free', members: 1, color: '#e11d48' },
];
const DEMO_ACCOUNT = { name: 'Maya Ortega', email: 'maya@ortega.me' };
const MOD = IS_APPLE ? '⌘' : 'Ctrl+';
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

const logo = (workspace, size) => `<span class="logo" style="--_color: ${escapeHtml(workspace.color ?? '#71717a')}; --_size: ${size}px" aria-hidden="true">${escapeHtml(initialsOf(workspace.name))}</span>`;

/**
 * A workspace switcher for the top of an app sidebar. The trigger row
 * expands into the panel and becomes a search field; the arrow keys move
 * through the workspaces, Enter switches, ⌘1–9 (Ctrl+1–9) jumps straight to
 * one, and a compact account footer closes the panel.
 *
 * Workspaces are `{ id, name, plan?, members?, color? }`; the account is
 * `{ name, email }`.
 *
 * @attr {Array<object>} workspaces - The workspaces (JSON)
 * @attr {string} workspace - The current workspace's id
 * @attr {object} account - Who is signed in (JSON)
 * @fires lw-change - Another workspace was chosen; `detail: { workspace }`
 * @fires lw-create - Create workspace was chosen
 * @fires lw-settings - Account settings was chosen
 * @fires lw-sign-out - Sign out was chosen
 */
export class LwWorkspaceSwitcher extends LwElement {
  static styles = styles;
  static props = {
    workspaces: { type: Object, default: DEMO_WORKSPACES },
    workspace: { default: '' },
    account: { type: Object, default: DEMO_ACCOUNT },
  };

  #open = false;
  #active = 0;
  #query = '';

  render() {
    return `<button class="trigger" type="button" aria-haspopup="listbox" aria-expanded="false"><span class="current"></span>${strokeIcon(chevronsUpDown, 16)}</button>
<div class="panel" hidden>
  <label class="find">${strokeIcon(search, 16)}<input class="search" type="text" role="combobox" aria-expanded="true" aria-controls="list" aria-autocomplete="list" placeholder="Find a workspace…" autocomplete="off" spellcheck="false"></label>
  <div class="list-box"><span class="highlight" aria-hidden="true"></span><div class="list" id="list" role="listbox" aria-label="Workspaces"></div><p class="empty" hidden>No workspace matches.</p></div>
  <button class="create" type="button">${strokeIcon(plus, 16)}Create workspace</button>
  <div class="account"><span class="avatar" aria-hidden="true"></span><span class="who"><span class="account-name"></span><span class="email"></span></span><button class="settings" type="button" aria-label="Account settings">${strokeIcon(settings, 16)}</button><button class="sign-out" type="button" aria-label="Sign out">${strokeIcon(logOut, 16)}</button></div>
</div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.trigger').addEventListener('click', () => this.#setOpen(true), options);
    const input = this.query('.search');
    input.addEventListener('input', () => {
      this.#query = input.value;
      this.#active = 0;
      this.#paintList();
    }, options);
    this.query('.panel').addEventListener('keydown', (event) => this.#key(event), options);
    const list = this.query('.list');
    list.addEventListener('click', (event) => {
      const row = event.target.closest('[role="option"]');
      if (row) this.#choose(row.dataset.id);
    }, options);
    list.addEventListener('pointermove', (event) => {
      const row = event.target.closest('[role="option"]');
      if (row && event.pointerType === 'mouse') this.#setActive(this.#rows.indexOf(row));
    }, options);
    list.addEventListener('pointerdown', (event) => event.preventDefault(), options);
    this.query('.create').addEventListener('click', () => this.#act('create'), options);
    this.query('.settings').addEventListener('click', () => this.#act('settings'), options);
    this.query('.sign-out').addEventListener('click', () => this.#act('sign-out'), options);
    // ⌘1–9 jumps to a workspace while the switcher has focus or is open.
    window.addEventListener('keydown', (event) => this.#jump(event), options);
    document.addEventListener('pointerdown', (event) => this.#open && !event.composedPath().includes(this) && this.#setOpen(false, false), options);
  }

  updated() {
    const current = this.#current;
    this.query('.current').innerHTML = current ? `${logo(current, 28)}<span class="names"><span class="name">${escapeHtml(current.name)}</span><span class="plan">${escapeHtml(current.plan ?? '')}</span></span>` : '';
    this.query('.trigger').ariaLabel = `Workspace: ${current?.name ?? ''}. Switch`;
    const account = this.account ?? {};
    this.query('.avatar').textContent = initialsOf(account.name ?? '');
    this.query('.account-name').textContent = account.name ?? '';
    this.query('.email').textContent = account.email ?? '';
    if (this.#open) this.#paintList();
  }

  get #current() {
    return this.workspaces.find(({ id }) => id === this.workspace) ?? this.workspaces[0];
  }

  get #matches() {
    const query = this.#query.trim().toLowerCase();
    return this.workspaces.map((workspace, index) => ({ workspace, index })).filter(({ workspace }) => workspace.name.toLowerCase().includes(query));
  }

  get #rows() {
    return [...this.query('.list').children];
  }

  #paintList() {
    const current = this.#current;
    const matches = this.#matches;
    this.query('.list').innerHTML = matches
      .map(
        ({ workspace, index }) =>
          `<div class="row" role="option" id="ws-${escapeHtml(workspace.id)}" data-id="${escapeHtml(workspace.id)}" aria-selected="${workspace === current}">${logo(workspace, 24)}<span class="names"><span class="name">${escapeHtml(workspace.name)}</span><span class="plan">${escapeHtml(workspace.plan ?? '')}${workspace.members ? ` · ${workspace.members} member${workspace.members === 1 ? '' : 's'}` : ''}</span></span>${workspace === current ? `<span class="tick">${strokeIcon(check, 16)}</span>` : ''}${index < 9 ? `<kbd>${MOD}${index + 1}</kbd>` : ''}</div>`,
      )
      .join('');
    this.query('.empty').hidden = matches.length > 0;
    this.#setActive(Math.min(this.#active, matches.length - 1));
  }

  #setActive(index) {
    this.#active = index;
    const rows = this.#rows;
    const row = rows[index];
    rows.forEach((r, i) => r.toggleAttribute('data-active', i === index));
    const input = this.query('.search');
    if (row) {
      input.setAttribute('aria-activedescendant', row.id);
      moveHighlight(this.query('.highlight'), row);
      row.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
      hideHighlight(this.query('.highlight'));
    }
  }

  // The trigger row grows into the panel and becomes its search field; it
  // folds back into the row on close.
  #setOpen(open, restoreFocus = true) {
    if (open === this.#open) return;
    this.#open = open;
    const trigger = this.query('.trigger');
    const panel = this.query('.panel');
    trigger.ariaExpanded = String(open);
    this.toggleAttribute('data-open', open);
    if (open) {
      this.#query = '';
      this.query('.search').value = '';
      panel.hidden = false;
      this.#active = Math.max(0, this.workspaces.indexOf(this.#current));
      this.#paintList();
      this.query('.search').focus();
      if (!reducedMotion.matches) {
        panel.animate([{ height: `${trigger.offsetHeight}px`, opacity: 0.6 }, { height: `${panel.offsetHeight}px`, opacity: 1 }], { duration: 280, easing: EASE_OUT });
      }
      return;
    }
    const done = () => {
      panel.hidden = true;
      hideHighlight(this.query('.highlight'));
    };
    if (restoreFocus) trigger.focus();
    if (reducedMotion.matches) done();
    else panel.animate([{ height: `${panel.offsetHeight}px`, opacity: 1 }, { height: `${trigger.offsetHeight}px`, opacity: 0 }], { duration: 200, easing: EASE_OUT }).finished.then(done, done);
  }

  #choose(id) {
    const changed = id !== this.#current?.id;
    this.workspace = id;
    this.#setOpen(false);
    if (changed) this.emit('change', { workspace: this.workspaces.find((workspace) => workspace.id === id) });
  }

  #act(name) {
    this.#setOpen(false);
    this.emit(name);
  }

  #key(event) {
    const count = this.#rows.length;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#setOpen(false);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (count) this.#setActive((this.#active + (event.key === 'ArrowDown' ? 1 : -1) + count) % count);
    } else if (event.key === 'Enter' && event.target.matches('.search')) {
      event.preventDefault();
      const row = this.#rows[this.#active];
      if (row) this.#choose(row.dataset.id);
    } else if (event.key === 'Tab' && !event.shiftKey && event.target.matches('.sign-out')) {
      this.#setOpen(false, false);
    }
  }

  #jump(event) {
    const focused = document.activeElement === this;
    if (!(event.metaKey || event.ctrlKey) || event.altKey || !/^[1-9]$/.test(event.key) || (!this.#open && !focused)) return;
    const workspace = this.workspaces[Number(event.key) - 1];
    if (!workspace) return;
    event.preventDefault();
    this.#choose(workspace.id);
  }
}
