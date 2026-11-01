import { providerButtons } from '../../core/login.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import '../password-input/index.js';
import '../text-input/index.js';
import styles from './split-signup-login.scss?inline';

const SIGN_UP_MS = 1100;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Sign-up for a product account: Google or GitHub, or a name, an email and
 * a password with its checklist. Creating the account confirms where the
 * welcome email went.
 *
 * Set `signUp` to `async ({ name, email, password }) => boolean` to wire it
 * to your auth; without it, the card simulates the request.
 *
 * @attr {string} brand - The product's name
 * @attr {string} sign-in-href - The "Sign in" link
 * @fires lw-provider - Google or GitHub was chosen; `detail: { provider }`
 * @fires lw-sign-up - The account was created; `detail: { name, email }`
 */
export class LwSplitSignupLogin extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'LowerSoft' },
    signInHref: { default: '#' },
  };

  render() {
    return `<form class="form" novalidate><span class="logo" aria-hidden="true"></span><div class="intro"><h2 class="title"></h2><p class="lead"></p></div>
${providerButtons()}<p class="divider"><span>or with email</span></p>
<lw-text-input class="name" label="Full name" placeholder="Sam Ortiz" autocomplete="name" required></lw-text-input>
<lw-text-input class="email" label="Email" type="email" placeholder="you@example.com" autocomplete="email" required></lw-text-input>
<lw-password-input class="password" label="Password" required></lw-password-input>
<lw-button class="submit" type="submit">Create account</lw-button><p class="foot">Already have an account? <a class="sign-in">Sign in</a></p></form>
<div class="done" role="status" hidden><h2 class="title done-title"></h2><p class="lead done-text"></p></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#submit();
    }, options);
    for (const button of this.shadowRoot.querySelectorAll('.provider')) {
      button.addEventListener('click', () => this.emit('provider', { provider: button.dataset.provider }), options);
    }
  }

  updated() {
    const brand = this.brand ?? '';
    this.query('.logo').textContent = brand.charAt(0).toUpperCase();
    this.query('.form .title').textContent = `Create your ${brand} account`;
    this.query('.lead').textContent = `One account for everything you get from ${brand}: downloads, licenses and updates in one place.`;
    this.query('.sign-in').href = this.signInHref ?? '#';
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
    const values = { name: name.value.trim(), email: email.value.trim(), password: password.value };
    const submit = this.query('.submit');
    submit.loading = true;
    const ok = this.signUp ? await this.signUp(values) : await new Promise((resolve) => setTimeout(() => resolve(true), SIGN_UP_MS));
    submit.loading = false;
    if (!ok) return;
    this.query('.done-title').textContent = `Welcome to ${this.brand}, ${values.name.split(/\s+/)[0]}`;
    this.query('.done-text').textContent = `Your account is ready. We sent a confirmation link to ${values.email}.`;
    this.query('.form').hidden = true;
    this.query('.done').hidden = false;
    this.emit('sign-up', { name: values.name, email: values.email });
  }
}
