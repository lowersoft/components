import { escapeHtml } from '../../core/dom.js';
import { providerButtons } from '../../core/login.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import '../button/index.js';
import '../text-input/index.js';
import '../verification-code/index.js';
import styles from './magic-link-login.scss?inline';

const SEND_MS = 900;
const EXPIRES_S = 600;
const RESEND_S = 30;
const CODE_LENGTH = 6;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Where "Open mail" goes for the common providers.
const MAIL_APPS = {
  'gmail.com': ['Gmail', 'https://mail.google.com/'],
  'outlook.com': ['Outlook', 'https://outlook.live.com/mail/'],
  'hotmail.com': ['Outlook', 'https://outlook.live.com/mail/'],
  'icloud.com': ['iCloud Mail', 'https://www.icloud.com/mail'],
  'proton.me': ['Proton Mail', 'https://mail.proton.me/'],
};

const DEMO_DOMAINS = ['gmail.com', 'outlook.com', 'icloud.com', 'proton.me', 'company.com'];

const DEMO_INBOX = [
  { from: 'Jonas Weber', subject: 'Release 0.9: profiler numbers, round two', time: '9:41 AM' },
  { from: 'LowerSoft CI', subject: 'Nightly build passed on all 6 targets', time: '8:02 AM' },
];

const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
const randomCode = () => String(Math.floor(Math.random() * 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, '0');

/**
 * Passwordless sign-in. The email it will send is drawn above the form, in
 * the inbox it will land in, and fills in as you type; the domain completes
 * with Tab. Sending turns the draft into the delivered message, with an
 * expiry bar, a button that opens the mail app and a six-digit code, and the
 * form asks for that code. With `method="password"` it is a classic email
 * and password form instead.
 *
 * Without callbacks the card simulates the requests and accepts the code it
 * shows. Set these properties to wire it to your auth:
 * `send` — `async (email) => void`, sends the link;
 * `verify` — `async (code) => boolean`, checks the code;
 * `signIn` — `async ({ email, password }) => boolean`, for the password form.
 *
 * @attr {string} brand - The product's name
 * @attr {'magic'|'password'} method
 * @attr {'google'|'github'|'email'} last-used - Tags the method this device used before
 * @attr {Array<string>} domains - Domains offered for completion (JSON)
 * @attr {string} signup-href - The "Create an account" link
 * @attr {string} terms-href - The "Terms" link
 * @fires lw-provider - Google or GitHub was chosen; `detail: { provider }`
 * @fires lw-send - The link was sent; `detail: { email }`
 * @fires lw-sign-in - Signed in; `detail: { method, email }`
 */
export class LwMagicLinkLogin extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'LowerSoft' },
    method: { default: 'magic', reflect: true },
    lastUsed: { default: 'google' },
    domains: { type: Object, default: DEMO_DOMAINS },
    signupHref: { default: '#' },
    termsHref: { default: '#' },
  };

  #stage = 'form';
  #email = '';
  #code = '';
  #timer = 0;
  #expiresAt = 0;
  #resendAt = 0;

  render() {
    return `<section class="inbox" aria-label="Inbox preview"><header class="inbox-head"><span>Inbox</span><span class="to"></span></header>
<div class="slot"><div class="draft"><span class="dot" aria-hidden="true"></span><span class="draft-text"></span></div>
<article class="message" aria-live="polite"><header class="message-head"><span class="sender"></span><span class="now">now</span></header><p class="message-subject"></p>
<div class="expiry"><span class="bar" aria-hidden="true"><i></i></span><span class="expires"></span></div>
<div class="message-actions"><a class="open-mail" target="_blank" rel="noopener"></a><span class="code-label">Code <b class="code"></b></span></div></article></div>
<ul class="mails">${DEMO_INBOX.map((mail) => `<li><span class="from">${escapeHtml(mail.from)}</span><span class="subject">${escapeHtml(mail.subject)}</span><span class="time">${mail.time}</span></li>`).join('')}</ul></section>
<div class="body">
<form class="form" novalidate><h2 class="title"></h2><p class="lead"></p>
${providerButtons()}
<p class="divider"><span>or with email</span></p>
<lw-text-input class="email" type="email" name="email" placeholder="you@company.com" autocomplete="email" required aria-label="Email"><span slot="end" class="complete" hidden><kbd>Tab</kbd><span class="suggest"></span></span></lw-text-input>
<lw-text-input class="password" type="password" name="password" placeholder="Password" autocomplete="current-password" aria-label="Password"></lw-text-input>
<lw-button class="submit" type="submit"></lw-button></form>
<div class="check" hidden><h2 class="title">Check your inbox</h2><p class="lead sent-to"></p><lw-verification-code class="otp" length="${CODE_LENGTH}" label="Code from the email"></lw-verification-code>
<div class="check-actions"><lw-button class="back" variant="ghost" size="sm">Use a different email</lw-button><lw-button class="resend" variant="ghost" size="sm"></lw-button></div></div>
<div class="done" hidden><h2 class="title">You're signed in</h2><p class="lead done-text"></p></div></div>
<footer class="foot"><span>New to <span class="brand-name"></span>? <a class="signup">Create an account</a></span><a class="terms">Terms</a></footer>`;
  }

  connected() {
    const options = { signal: this.signal };
    const email = this.query('.email');
    email.addEventListener('input', () => this.#typed(), options);
    email.addEventListener('keydown', (event) => this.#complete(event), options);
    this.query('.form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#submit();
    }, options);
    for (const button of this.shadowRoot.querySelectorAll('.provider')) {
      button.addEventListener('click', () => this.emit('provider', { provider: button.dataset.provider }), options);
    }
    this.query('.back').addEventListener('click', () => this.#show('form'), options);
    this.query('.resend').addEventListener('click', () => this.#send(), options);
    const otp = this.query('.otp');
    // Checks the code: the caller's, or the one the demo showed.
    otp.verify = async (code) => (this.verify ? this.verify(code) : code === this.#code);
    otp.addEventListener('lw-verified', () => this.#signedIn('magic'), options);
    this.signal.addEventListener('abort', () => clearInterval(this.#timer));
  }

  updated() {
    const brand = this.brand ?? '';
    const password = this.method === 'password';
    this.query('.form .title').textContent = `Sign in to ${brand}`;
    this.query('.lead').textContent = password ? 'Welcome back. Sign in with your email and password.' : "No password needed. We'll email you a link.";
    this.query('.submit').textContent = password ? 'Sign in' : 'Email me a sign-in link';
    this.query('.password').hidden = !password;
    this.query('.password').required = password;
    this.query('.inbox').hidden = password;
    this.query('.brand-name').textContent = brand;
    this.query('.signup').href = this.signupHref ?? '#';
    this.query('.terms').href = this.termsHref ?? '#';
    for (const button of this.shadowRoot.querySelectorAll('.provider')) button.toggleAttribute('data-last', button.dataset.provider === this.lastUsed);
    this.query('.email').toggleAttribute('data-last', this.lastUsed === 'email');
    this.#typed();
  }

  // The domain the typed address is heading for, from the list.
  get #suggestion() {
    const value = this.query('.email').value ?? '';
    const at = value.indexOf('@');
    if (at < 1) return '';
    const typed = value.slice(at + 1).toLowerCase();
    const domain = (this.domains ?? []).find((each) => each.startsWith(typed) && each !== typed);
    return domain ? domain.slice(typed.length) : '';
  }

  // The draft in the inbox follows the address as it is typed.
  #typed() {
    if (this.#stage !== 'form') return;
    const value = (this.query('.email').value ?? '').trim();
    const suggestion = this.#suggestion;
    this.query('.to').textContent = value ? `${value}${suggestion}` : 'you@company.com';
    this.query('.draft-text').textContent = value ? `Draft: sign-in link for ${value}${suggestion}` : `Your link from ${this.brand} lands here`;
    this.query('.slot').toggleAttribute('data-typing', Boolean(value));
    const complete = this.query('.complete');
    complete.hidden = !suggestion;
    this.query('.suggest').textContent = suggestion;
    this.query('.email').error = '';
  }

  // Tab takes the suggested domain.
  #complete(event) {
    const suggestion = this.#suggestion;
    if (event.key !== 'Tab' || event.shiftKey || !suggestion) return;
    event.preventDefault();
    const email = this.query('.email');
    email.value = `${email.value}${suggestion}`;
    this.#typed();
  }

  async #submit() {
    const email = this.query('.email');
    const value = (email.value ?? '').trim();
    if (!EMAIL.test(value)) {
      email.error = 'Enter a valid email address.';
      email.focus();
      return;
    }
    this.#email = value;
    if (this.method !== 'password') {
      await this.#send();
      return;
    }
    const password = this.query('.password');
    if (!password.value) {
      password.error = 'Enter your password.';
      password.focus();
      return;
    }
    const submit = this.query('.submit');
    submit.loading = true;
    const ok = this.signIn ? await this.signIn({ email: value, password: password.value }) : await new Promise((resolve) => setTimeout(() => resolve(true), SEND_MS));
    submit.loading = false;
    if (ok) this.#signedIn('password');
    else password.error = 'That email and password did not match.';
  }

  // Sends the link (or a new one) and turns the draft into the delivered message.
  async #send() {
    const submit = this.query('.submit');
    submit.loading = true;
    if (this.send) await this.send(this.#email);
    else await new Promise((resolve) => setTimeout(resolve, SEND_MS));
    submit.loading = false;
    this.#code = randomCode();
    this.#expiresAt = Date.now() + EXPIRES_S * 1000;
    this.#resendAt = Date.now() + RESEND_S * 1000;
    const domain = this.#email.split('@')[1]?.toLowerCase() ?? '';
    const [app, url] = MAIL_APPS[domain] ?? ['mail', `mailto:${this.#email}`];
    const open = this.query('.open-mail');
    open.textContent = `Open ${app}`;
    open.href = url;
    this.query('.to').textContent = this.#email;
    this.query('.sender').textContent = this.brand ?? '';
    this.query('.message-subject').textContent = `Sign in to ${this.brand}`;
    this.query('.code').textContent = `${this.#code.slice(0, 3)} ${this.#code.slice(3)}`;
    this.query('.sent-to').textContent = `We sent a link to ${this.#email}. Open it, or enter the code from it.`;
    const bar = this.query('.bar i');
    bar.getAnimations().forEach((animation) => animation.cancel());
    if (!reducedMotion.matches) bar.animate([{ scale: '1 1' }, { scale: '0 1' }], { duration: EXPIRES_S * 1000, easing: 'linear', fill: 'forwards' });
    this.query('.otp').value = '';
    this.#show('check');
    this.emit('send', { email: this.#email });
    clearInterval(this.#timer);
    this.#tick();
    this.#timer = setInterval(() => this.#tick(), 1000);
  }

  // The expiry and the resend countdowns.
  #tick() {
    const left = Math.max(0, Math.round((this.#expiresAt - Date.now()) / 1000));
    this.query('.expires').textContent = left ? `Expires in ${clock(left)}` : 'Expired';
    const wait = Math.max(0, Math.round((this.#resendAt - Date.now()) / 1000));
    const resend = this.query('.resend');
    resend.textContent = wait ? `Resend in ${wait}s` : 'Resend link';
    resend.disabled = wait > 0;
    if (!left) clearInterval(this.#timer);
  }

  #signedIn(method) {
    clearInterval(this.#timer);
    this.query('.done-text').textContent = `Signed in as ${this.#email}.`;
    this.#show('done');
    this.emit('sign-in', { method, email: this.#email });
  }

  #show(stage) {
    this.#stage = stage;
    this.dataset.stage = stage;
    this.query('.form').hidden = stage !== 'form';
    this.query('.check').hidden = stage !== 'check';
    this.query('.done').hidden = stage !== 'done';
    if (stage === 'form') {
      clearInterval(this.#timer);
      this.#typed();
      this.query('.email').focus();
    }
    if (stage === 'check') this.query('.otp').focus();
  }
}
