import { escapeHtml } from '../../core/dom.js';
import { avatarSeed } from '../../core/face.js';
import { drawPortrait, markTile, providerButtons } from '../../core/login.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import '../password-input/index.js';
import '../text-input/index.js';
import styles from './split-signup-login.scss?inline';

const SIGN_UP_MS = 1100;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PERSONAL = ['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'yahoo.com', 'proton.me'];
const NAV = ['Home', 'Projects', 'Inbox', 'Docs', 'Members', 'Settings'];
const TILES = ['New project', 'Invite team', 'Import data', 'Pick a theme'];
const DEMO_TEAMS = { 'northwind.dev': { name: 'Northwind', members: 14, mark: { glyph: 'triangle', color: '#2f6b55' } } };

const slug = (text) => text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const titleCase = (text) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Sign-up beside a live preview of the account it creates. As the form
 * fills, the preview draws your portrait, names the workspace and its
 * address. A known company domain shows that team, with a choice to join it
 * or start fresh; a personal address drafts a personal workspace, and any
 * other domain a new one named after it.
 *
 * Teams are keyed by email domain: `{ name, members, mark? }`. Set `signUp`
 * to `async ({ name, email, password, workspace }) => boolean` to wire it to
 * your auth; without it, the card simulates the request.
 *
 * @attr {string} brand - The product's name
 * @attr {object} teams - Teams already on the product, by email domain (JSON)
 * @attr {string} app-domain - Workspaces live at `<name>.<app-domain>`
 * @attr {string} sign-in-href - The "Sign in" link
 * @fires lw-provider - Google or GitHub was chosen; `detail: { provider }`
 * @fires lw-sign-up - The account was created; `detail: { name, email, workspace }`
 */
export class LwSplitSignupLogin extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'LowerSoft' },
    teams: { type: Object, default: DEMO_TEAMS },
    appDomain: { default: 'lowersoft.dev' },
    signInHref: { default: '#' },
  };

  // Joining the found team, or starting fresh beside it.
  #join = true;
  #face = null;

  render() {
    return `<div class="split"><form class="form" novalidate><span class="logo" aria-hidden="true"></span><div class="intro"><h2 class="title"></h2><p class="lead">Build, profile and ship native code together. Free for teams up to 10.</p></div>
${providerButtons()}<p class="divider"><span>or with email</span></p>
<lw-text-input class="name" label="Full name" placeholder="Sam Ortiz" autocomplete="name" required></lw-text-input>
<lw-text-input class="email" label="Work email" type="email" placeholder="sam@company.com" autocomplete="email" required></lw-text-input>
<lw-password-input class="password" label="Password" required></lw-password-input>
<lw-button class="submit" type="submit">Create account</lw-button><p class="foot">Already have an account? <a class="sign-in">Sign in</a></p></form>
<aside class="preview" aria-label="Your account" aria-live="polite"><header class="preview-head"><span>Your account</span><span>Preview</span></header>
<div class="app" aria-hidden="true"><nav class="side"><span class="ws"><span class="ws-logo"></span><span class="ws-name"></span></span>${NAV.map((item, i) => `<span${i ? '' : ' data-on'}>${item}</span>`).join('')}</nav>
<div class="main"><span class="greeting"></span><p class="empty">Nothing here yet</p><div class="tiles">${TILES.map((tile) => `<span>+ ${tile}</span>`).join('')}</div></div></div>
<div class="found"><p class="hint"></p><div class="choice" role="radiogroup" aria-label="Workspace" hidden><button class="option" type="button" role="radio" data-join="true"><span class="option-mark"></span><span class="option-text"></span></button><button class="option" type="button" role="radio" data-join="false"><span class="option-mark new">+</span><span>Start a new workspace</span></button></div></div>
<dl class="facts"><div><dt>You</dt><dd class="you"><span class="portrait"></span><span class="you-name"></span></dd></div><div><dt>Address</dt><dd class="address"></dd></div><div><dt>Role</dt><dd class="role"></dd></div><div><dt>Plan</dt><dd>Free · 14-day Pro trial</dd></div></dl></aside>
<div class="done" hidden><h2 class="title done-title"></h2><p class="lead done-text"></p></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    for (const field of ['.name', '.email']) this.query(field).addEventListener('input', () => this.#paint(), options);
    this.query('.choice').addEventListener('click', (event) => {
      const option = event.target.closest('.option');
      if (!option) return;
      this.#join = option.dataset.join === 'true';
      this.#paint();
    }, options);
    this.query('.form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#submit();
    }, options);
    for (const button of this.shadowRoot.querySelectorAll('.provider')) {
      button.addEventListener('click', () => this.emit('provider', { provider: button.dataset.provider }), options);
    }
    this.#face = drawPortrait(this.query('.portrait'), ' ');
  }

  updated() {
    this.query('.logo').textContent = (this.brand ?? '').charAt(0).toUpperCase();
    this.query('.form .title').textContent = `Create your ${this.brand} account`;
    this.query('.sign-in').href = this.signInHref ?? '#';
    this.#paint();
  }

  // What the form will create: joining a known team, or a new or personal workspace.
  get #workspace() {
    const name = (this.query('.name').value ?? '').trim();
    const email = (this.query('.email').value ?? '').trim().toLowerCase();
    const domain = EMAIL.test(email) ? email.split('@')[1] : '';
    const first = name.split(/\s+/)[0] ?? '';
    const team = domain ? this.teams?.[domain] : null;
    if (team && this.#join) return { mode: 'join', name: team.name, address: `${slug(team.name)}.${this.appDomain}`, role: 'Member', team };
    if (domain && !team && !PERSONAL.includes(domain)) {
      const company = titleCase(domain.split('.')[0]);
      return { mode: 'new', name: company, address: `${slug(company)}.${this.appDomain}`, role: 'Owner' };
    }
    if (domain || first) {
      const owner = first || 'Your';
      return { mode: team ? 'new' : 'personal', name: `${owner}'s workspace`, address: `${slug(first || 'you')}.${this.appDomain}`, role: 'Owner', team };
    }
    return null;
  }

  #paint() {
    const name = (this.query('.name').value ?? '').trim();
    const workspace = this.#workspace;
    const team = workspace?.team;
    // The sidebar names the workspace, with its mark once it has one.
    this.query('.ws-logo').innerHTML = workspace ? (team && workspace.mode === 'join' ? markTile(team.mark) : `<span class="initial">${escapeHtml(workspace.name.charAt(0))}</span>`) : '';
    this.query('.ws').toggleAttribute('data-empty', !workspace);
    this.query('.ws-name').textContent = workspace?.name ?? '';
    this.query('.greeting').textContent = name ? `Welcome, ${name.split(/\s+/)[0]}` : '';
    this.query('.greeting').toggleAttribute('data-empty', !name);
    // The hint, or the found team with the choice to join it or start fresh.
    const choice = this.query('.choice');
    choice.hidden = !team;
    if (team) {
      this.query('.hint').textContent = `${team.name} is already on ${this.brand} · ${team.members} members`;
      this.query('.option-mark').innerHTML = markTile(team.mark);
      this.query('.option-text').textContent = `Join ${team.name}`;
      for (const option of choice.querySelectorAll('.option')) option.ariaChecked = String((option.dataset.join === 'true') === this.#join);
    } else {
      this.query('.hint').textContent = workspace?.mode === 'personal' ? 'A personal workspace, just for you. Use your work email to find your team.' : workspace ? `A new workspace for ${workspace.name}.` : "Use your work email and we'll find your team.";
    }
    // The portrait draws itself from the name, and morphs as it changes.
    this.#face?.show(avatarSeed(name || ' ', 0));
    this.query('.you').toggleAttribute('data-empty', !name);
    this.query('.you-name').textContent = name;
    this.query('.address').textContent = workspace?.address ?? '';
    this.query('.address').toggleAttribute('data-empty', !workspace);
    this.query('.role').textContent = workspace?.role ?? '';
    this.query('.role').toggleAttribute('data-empty', !workspace);
    this.query('.submit').textContent = workspace?.mode === 'join' ? `Join ${workspace.name}` : 'Create account';
  }

  async #submit() {
    const fields = ['.name', '.email', '.password'].map((selector) => this.query(selector));
    const [name, email, password] = fields;
    name.error = name.value?.trim() ? '' : 'Enter your name.';
    email.error = EMAIL.test(email.value?.trim() ?? '') ? '' : 'Enter a valid email address.';
    password.error = (password.value ?? '').length >= 8 ? '' : 'Use at least 8 characters.';
    const invalid = fields.find((field) => field.error);
    if (invalid) {
      invalid.focus();
      return;
    }
    const workspace = this.#workspace;
    const values = { name: name.value.trim(), email: email.value.trim(), password: password.value, workspace: { mode: workspace.mode, name: workspace.name, address: workspace.address } };
    const submit = this.query('.submit');
    submit.loading = true;
    const ok = this.signUp ? await this.signUp(values) : await new Promise((resolve) => setTimeout(() => resolve(true), SIGN_UP_MS));
    submit.loading = false;
    if (!ok) return;
    this.query('.done-title').textContent = workspace.mode === 'join' ? `Welcome to ${workspace.name}` : `${workspace.name} is ready`;
    this.query('.done-text').textContent = `We sent a confirmation to ${values.email}. Your workspace lives at ${workspace.address}.`;
    this.query('.form').hidden = true;
    this.query('.done').hidden = false;
    this.emit('sign-up', { name: values.name, email: values.email, workspace: values.workspace });
  }
}
