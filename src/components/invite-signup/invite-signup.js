import { escapeHtml } from '../../core/dom.js';
import { avatarSeed } from '../../core/face.js';
import { strokeIcon } from '../../core/icons.js';
import { drawPortrait, GOOGLE } from '../../core/login.js';
import { lock } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import '../password-input/index.js';
import '../text-input/index.js';
import styles from './invite-signup.scss?inline';

const ACCEPT_MS = 1100;
const UNDO_MS = 5000;
// Members drawn in the row; the rest are counted.
const SHOWN = 4;

const DEMO_INVITE = {
  workspace: 'Northwind',
  inviter: 'Maya Chen',
  inviterRole: 'Admin',
  email: 'sam@northwind.dev',
  role: 'Editor',
  address: 'northwind.lowersoft.dev',
  members: ['Maya Chen', 'Theo Okafor', 'Ines Alves', 'Leo Park'],
  total: 14,
  note: "The 0.9 release lives in here: the build farm, the profiler runs and the crash reports. Grab a seat and say hi in #core.",
  sent: '2d ago',
  mark: { glyph: 'triangle', color: '#2f6b55' },
};

/**
 * Where an invite link lands. The inviter's portrait carries the
 * workspace's mark, their note sits above the people already there, and
 * the empty seat at the end of the row draws your portrait as you type your
 * name. The email is locked to the invite, so the form only asks for a name
 * and a password. Declining can be undone for a few seconds.
 *
 * The invite is `{ workspace, inviter, inviterRole, email, role, address, members, total, note, sent, mark? }`,
 * where `members` names the first few people there and `total` counts them all.
 * Set `accept` to `async ({ name, email, password }) => boolean` to wire it to
 * your auth; without it, the card simulates the request.
 *
 * @attr {object} invite (JSON)
 * @fires lw-accept - The invite was accepted; `detail: { name, email }`
 * @fires lw-decline - The invite was declined, after the undo window
 * @fires lw-provider - Google was chosen; `detail: { provider }`
 */
export class LwInviteSignup extends LwElement {
  static styles = styles;
  static props = {
    invite: { type: Object, default: DEMO_INVITE },
  };

  #seat = null;
  #undoTimer = 0;

  render() {
    return `<header class="head"><span class="portrait inviter"></span><h2 class="title"></h2><p class="lead"></p></header>
<section class="invite" aria-label="Invite"><blockquote class="note"><p class="quote"></p><footer class="by"></footer></blockquote>
<div class="seats"><span class="faces"></span><span class="more"></span><span class="seat" aria-hidden="true"><span class="portrait yours"></span></span><span class="seat-text"><b class="seat-name">Your seat</b><span class="seat-count"></span></span></div>
<div class="locked">${strokeIcon(lock, 16)}<span class="email"></span><span class="from">from the invite</span><button class="not-you" type="button">Not you?</button></div></section>
<form class="form" novalidate><lw-text-input class="name" label="Full name" placeholder="Sam Ortiz" autocomplete="name" hint="Your portrait is drawn from your name. Add a photo anytime." required></lw-text-input>
<lw-password-input class="password" label="Password" required></lw-password-input><lw-button class="join" type="submit"></lw-button>
<p class="divider"><span>or</span></p><lw-button class="google" variant="outline"><span slot="start">${GOOGLE}</span>Continue with Google</lw-button>
<button class="decline" type="button">Decline invite</button></form>
<div class="state" hidden role="status"><h2 class="title state-title"></h2><p class="lead state-text"></p><lw-button class="undo" variant="outline" size="sm" hidden>Undo</lw-button></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.name').addEventListener('input', () => this.#paintSeat(), options);
    this.query('.form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#accept();
    }, options);
    this.query('.google').addEventListener('click', () => this.emit('provider', { provider: 'google' }), options);
    for (const button of ['.decline', '.not-you']) this.query(button).addEventListener('click', () => this.#decline(), options);
    this.query('.undo').addEventListener('click', () => this.#undo(), options);
    this.signal.addEventListener('abort', () => clearTimeout(this.#undoTimer));
  }

  updated(changed) {
    if (!changed.has('invite')) return;
    const invite = this.invite ?? {};
    const first = (invite.inviter ?? '').split(' ')[0];
    drawPortrait(this.query('.inviter'), invite.inviter, { mark: invite.mark });
    this.query('.head .title').textContent = `${first} invited you to ${invite.workspace}`;
    this.query('.head .lead').textContent = `Join as ${/^[aeiou]/i.test(invite.role ?? '') ? 'an' : 'a'} ${invite.role} on ${invite.address}`;
    this.query('.quote').textContent = `“${invite.note ?? ''}”`;
    this.query('.by').textContent = [invite.inviter, invite.inviterRole, invite.sent].filter(Boolean).join(' · ');
    const members = invite.members ?? [];
    const faces = this.query('.faces');
    faces.replaceChildren();
    for (const name of members.slice(0, SHOWN)) {
      const portrait = document.createElement('span');
      portrait.className = 'portrait';
      portrait.title = name;
      drawPortrait(portrait, name);
      faces.append(portrait);
    }
    const rest = Math.max(0, (invite.total ?? members.length) - Math.min(SHOWN, members.length));
    this.query('.more').textContent = rest ? `+${rest}` : '';
    this.query('.more').hidden = !rest;
    this.query('.email').textContent = invite.email ?? '';
    this.query('.join').textContent = `Join ${invite.workspace}`;
    this.#seat = drawPortrait(this.query('.yours'), ' ');
    this.#paintSeat();
  }

  // The empty seat draws your portrait from the name as it is typed.
  #paintSeat() {
    const name = (this.query('.name').value ?? '').trim();
    const total = this.invite?.total ?? 0;
    this.#seat?.show(avatarSeed(name || ' ', 0));
    this.query('.seat').toggleAttribute('data-taken', Boolean(name));
    this.query('.seat-name').textContent = name || 'Your seat';
    this.query('.seat-count').textContent = name ? `${total + 1} members with you` : `${total} members`;
  }

  async #accept() {
    const name = this.query('.name');
    const password = this.query('.password');
    name.error = name.value?.trim() ? '' : 'Enter your name.';
    password.error = (password.value ?? '').length >= 8 ? '' : 'Use at least 8 characters.';
    const invalid = [name, password].find((field) => field.error);
    if (invalid) {
      invalid.focus();
      return;
    }
    const values = { name: name.value.trim(), email: this.invite.email, password: password.value };
    const join = this.query('.join');
    join.loading = true;
    const ok = this.accept ? await this.accept(values) : await new Promise((resolve) => setTimeout(() => resolve(true), ACCEPT_MS));
    join.loading = false;
    if (!ok) return;
    this.#show(`Welcome to ${this.invite.workspace}`, `You're in as ${values.name}, with ${this.invite.total} others.`, false);
    this.emit('accept', { name: values.name, email: values.email });
  }

  // Declining waits a few seconds, so it can be taken back.
  #decline() {
    this.#show('Invite declined', `You won't join ${this.invite.workspace}. ${this.invite.inviter.split(' ')[0]} won't be told for a few seconds.`, true);
    clearTimeout(this.#undoTimer);
    this.#undoTimer = setTimeout(() => {
      this.query('.undo').hidden = true;
      this.query('.state-text').textContent = 'You can close this tab.';
      this.emit('decline');
    }, UNDO_MS);
  }

  #undo() {
    clearTimeout(this.#undoTimer);
    this.query('.state').hidden = true;
    this.query('.form').hidden = false;
    this.query('.invite').hidden = false;
    this.query('.name').focus();
  }

  #show(title, text, undoable) {
    this.query('.state-title').textContent = title;
    this.query('.state-text').textContent = text;
    this.query('.undo').hidden = !undoable;
    this.query('.state').hidden = false;
    this.query('.form').hidden = true;
    this.query('.invite').hidden = undoable;
    if (undoable) this.query('.undo').focus();
  }
}
