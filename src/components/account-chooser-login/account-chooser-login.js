import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { drawPortrait, GOOGLE } from '../../core/login.js';
import { arrowLeft, chevronRight, fingerprint, keyRound, lock, x } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import '../text-input/index.js';
import styles from './account-chooser-login.scss?inline';

const UNDO_MS = 5000;
const STEP_MS = 1100;

const DEMO_ACCOUNTS = [
  { name: 'Maya Chen', workspace: 'Northwind', email: 'maya@northwind.dev', badge: 3, mark: { glyph: 'triangle', color: '#2f6b55' }, device: 'MacBook Pro', seen: 'Active now' },
  { name: 'Maya Chen', workspace: 'Personal', email: 'maya.chen@gmail.com', method: 'google', mark: { glyph: 'leaf', color: '#8a7350' }, device: 'MacBook Pro', seen: '2 days ago' },
  { name: 'Theo Okafor', workspace: 'Fieldnotes', email: 'theo@fieldnotes.co', method: 'passkey', badge: 12, mark: { glyph: 'lines', color: '#6b6b70' }, device: 'iPhone', seen: 'Yesterday' },
  { name: 'Ines Alves', workspace: 'Harbor Studio', email: 'ines@harbor.studio', method: 'password', mark: { glyph: 'arch', color: '#6d6a8f' }, device: 'MacBook Pro', seen: 'Last week', signedOut: true },
];

const DEMO_SSO = { 'northwind.dev': 'Okta' };

// How each method reads on its chip, and its step's call to action.
const METHODS = {
  sso: { icon: keyRound, label: (account) => account.provider, action: (account) => `Continue with ${account.provider}` },
  google: { icon: null, label: () => 'Google', action: () => 'Continue with Google' },
  passkey: { icon: fingerprint, label: () => 'Passkey', action: () => 'Use your passkey' },
  password: { icon: lock, label: () => 'Password', action: () => 'Sign in' },
};

const chip = (method, account) => `<span class="method">${method === 'google' ? GOOGLE : strokeIcon(METHODS[method].icon, 14)}${escapeHtml(METHODS[method].label(account))}</span>`;

/**
 * For a device that has signed in before: the accounts it remembers, each
 * with a drawn portrait (the same name always draws the same face) and its
 * workspace's mark on the corner. Hovering or focusing a row swaps its email
 * for its session; the arrow keys move between rows. Choosing one opens it
 * in place into its own step: single sign-on, Google, a passkey or a
 * password. Forgetting an account can be undone for a few seconds.
 *
 * Accounts are `{ name, workspace, email, method?, provider?, badge?, mark?, seed?, image?, device?, seen?, signedOut? }`.
 * Without a `method`, an email whose domain is in `sso-domains` signs in with
 * that provider, and any other with a password.
 *
 * Set `signIn` to `async (account, { password }) => boolean` to wire it to
 * your auth; without it, the card simulates the request.
 *
 * @attr {string} brand - The product's name
 * @attr {Array<object>} accounts (JSON)
 * @attr {object} sso-domains - Email domain to provider name (JSON)
 * @fires lw-continue - Signed in; `detail: { account }`
 * @fires lw-use-another - "Use another account" was chosen
 * @fires lw-remove - An account was forgotten, after the undo window; `detail: { account }`
 */
export class LwAccountChooserLogin extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'LowerSoft' },
    accounts: { type: Object, default: DEMO_ACCOUNTS },
    ssoDomains: { type: Object, default: DEMO_SSO },
  };

  #active = 0;
  #removed = null;
  #undoTimer = 0;

  render() {
    return `<header class="head"><span class="logo" aria-hidden="true"></span><span class="count"></span></header>
<div class="intro"><h2 class="title">Choose an account</h2><p class="lead"></p></div>
<div class="list" role="listbox" tabindex="0" aria-label="Accounts"><span class="highlight"></span><div class="rows"></div></div>
<section class="step" hidden aria-live="polite"></section>
<footer class="foot"><lw-button class="another" variant="ghost">Use another account</lw-button><div class="undo-bar" role="status" hidden><span class="undo-text"></span><lw-button class="undo" variant="ghost" size="sm">Undo</lw-button></div></footer>`;
  }

  connected() {
    const options = { signal: this.signal };
    const list = this.query('.list');
    list.addEventListener('click', (event) => {
      const forget = event.target.closest('.forget');
      const row = event.target.closest('.row');
      if (!row) return;
      if (forget) this.#forget(Number(row.dataset.index));
      else this.#openStep(Number(row.dataset.index));
    }, options);
    list.addEventListener('pointermove', (event) => {
      const row = event.target.closest('.row');
      if (row) this.#setActive(Number(row.dataset.index));
    }, options);
    list.addEventListener('pointerleave', () => this.#paintActive(), options);
    list.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.another').addEventListener('click', () => this.emit('use-another'), options);
    this.query('.undo').addEventListener('click', () => this.#undo(), options);
    this.signal.addEventListener('abort', () => clearTimeout(this.#undoTimer));
  }

  updated(changed) {
    this.query('.logo').textContent = (this.brand ?? '').charAt(0).toUpperCase();
    this.query('.lead').textContent = `to continue to ${this.brand}`;
    if (changed.has('accounts') || changed.has('ssoDomains')) this.#build();
  }

  #methodOf(account) {
    if (account.method) return account.method;
    const provider = this.ssoDomains?.[account.email.split('@')[1]];
    return provider ? 'sso' : 'password';
  }

  #withMethod(account) {
    const method = this.#methodOf(account);
    return { ...account, method, provider: account.provider ?? this.ssoDomains?.[account.email.split('@')[1]] ?? 'SSO' };
  }

  #build() {
    const accounts = this.accounts ?? [];
    this.query('.count').textContent = `${accounts.length} on this device`;
    const rows = this.query('.rows');
    rows.innerHTML = accounts
      .map((raw, i) => {
        const account = this.#withMethod(raw);
        const session = `${account.device ?? 'This device'} · ${account.seen ?? ''}`;
        return `<div class="row" role="option" id="account-${i}" data-index="${i}"${account.signedOut ? ' data-signed-out' : ''} aria-selected="false">
<span class="portrait"></span><span class="who"><span class="line"><span class="name">${escapeHtml(account.name)}</span><span class="workspace">${escapeHtml(account.workspace ?? '')}</span>${account.badge ? `<span class="badge" aria-label="${account.badge} unread">${account.badge}</span>` : ''}</span>
<span class="sub"><span class="email">${escapeHtml(account.email)}${account.signedOut ? ' · Signed out' : ''}</span><span class="session">${escapeHtml(session)}</span></span></span>
${chip(account.method, account)}<button class="forget" type="button" aria-label="Forget ${escapeHtml(account.email)}">${strokeIcon(x, 14)}</button>${strokeIcon(chevronRight, 16)}</div>`;
      })
      .join('');
    rows.querySelectorAll('.portrait').forEach((portrait, i) => {
      const account = accounts[i];
      if (account.image) portrait.innerHTML = `<img src="${escapeHtml(account.image)}" alt="">`;
      else drawPortrait(portrait, account.name, { seed: account.seed, mark: account.mark });
    });
    this.#active = Math.min(this.#active, Math.max(0, accounts.length - 1));
    this.#paintActive();
  }

  #setActive(index) {
    this.#active = index;
    this.#paintActive();
  }

  #paintActive() {
    const rows = this.shadowRoot.querySelectorAll('.row');
    rows.forEach((row, i) => (row.ariaSelected = String(i === this.#active)));
    const list = this.query('.list');
    const row = rows[this.#active];
    if (row) list.setAttribute('aria-activedescendant', row.id);
    if (row) moveHighlight(this.query('.highlight'), row);
    else hideHighlight(this.query('.highlight'));
  }

  #key(event) {
    const count = this.accounts.length;
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (step && count) {
      event.preventDefault();
      this.#setActive((this.#active + step + count) % count);
    } else if (event.key === 'Enter' && count) {
      event.preventDefault();
      this.#openStep(this.#active);
    } else if ((event.key === 'Delete' || event.key === 'Backspace') && count) {
      event.preventDefault();
      this.#forget(this.#active);
    }
  }

  // The chosen account opens in place into its own step.
  #openStep(index) {
    const account = this.#withMethod(this.accounts[index]);
    const method = account.method;
    const step = this.query('.step');
    const field = method === 'password' ? '<lw-text-input class="password" type="password" placeholder="Password" autocomplete="current-password" aria-label="Password"></lw-text-input>' : '';
    const note = { sso: `${account.email.split('@')[1]} signs in through ${account.provider}.`, google: 'You will pick this account in Google.', passkey: 'Use Touch ID, Face ID or your security key.', password: '' }[method];
    step.innerHTML = `<button class="back" type="button">${strokeIcon(arrowLeft, 16)}All accounts</button>
<div class="chosen"><span class="portrait"></span><span class="who"><span class="name">${escapeHtml(account.name)}</span><span class="email">${escapeHtml(account.email)}</span></span></div>
<form class="step-form">${field}<lw-button class="go" type="submit">${method === 'google' ? `<span slot="start">${GOOGLE}</span>` : method === 'password' ? '' : `<span slot="start">${strokeIcon(METHODS[method].icon, 16)}</span>`}${escapeHtml(METHODS[method].action(account))}</lw-button>${note ? `<p class="note">${escapeHtml(note)}</p>` : ''}</form>`;
    drawPortrait(step.querySelector('.portrait'), account.name, { seed: account.seed, mark: account.mark });
    step.querySelector('.back').addEventListener('click', () => this.#closeStep());
    step.querySelector('.step-form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#continue(account);
    });
    this.dataset.step = method;
    step.hidden = false;
    this.query('.list').hidden = true;
    this.query('.intro').hidden = true;
    (step.querySelector('.password') ?? step.querySelector('.go')).focus();
  }

  #closeStep() {
    delete this.dataset.step;
    this.query('.step').hidden = true;
    this.query('.list').hidden = false;
    this.query('.intro').hidden = false;
    this.query('.list').focus();
    this.#paintActive();
  }

  async #continue(account) {
    const step = this.query('.step');
    const go = step.querySelector('.go');
    const password = step.querySelector('.password');
    if (password && !password.value) {
      password.error = 'Enter your password.';
      password.focus();
      return;
    }
    go.loading = true;
    const ok = this.signIn ? await this.signIn(account, { password: password?.value }) : await new Promise((resolve) => setTimeout(() => resolve(true), STEP_MS));
    go.loading = false;
    if (!ok) {
      if (password) password.error = 'That password did not match.';
      return;
    }
    step.querySelector('.step-form').innerHTML = `<p class="signed-in">Signed in to ${escapeHtml(account.workspace ?? this.brand)}</p>`;
    this.emit('continue', { account });
  }

  // Forgets an account, with a few seconds to take it back.
  #forget(index) {
    this.#commitRemoval();
    const accounts = [...this.accounts];
    const [account] = accounts.splice(index, 1);
    this.#removed = { account, index };
    this.accounts = accounts;
    this.query('.undo-text').textContent = `Forgot ${account.email}`;
    this.query('.undo-bar').hidden = false;
    this.query('.another').hidden = true;
    this.#undoTimer = setTimeout(() => this.#commitRemoval(), UNDO_MS);
    this.query('.list').focus();
  }

  #undo() {
    clearTimeout(this.#undoTimer);
    const removed = this.#removed;
    if (!removed) return;
    this.#removed = null;
    const accounts = [...this.accounts];
    accounts.splice(removed.index, 0, removed.account);
    this.accounts = accounts;
    this.#hideUndo();
  }

  #commitRemoval() {
    clearTimeout(this.#undoTimer);
    if (!this.#removed) return;
    this.emit('remove', { account: this.#removed.account });
    this.#removed = null;
    this.#hideUndo();
  }

  #hideUndo() {
    this.query('.undo-bar').hidden = true;
    this.query('.another').hidden = false;
  }
}
