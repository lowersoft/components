import { iconStyles, strokeIcon } from '../../core/icons.js';
import { briefcase, clock, eye, link2, mapPin } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { menuStyles } from '../../core/menu.js';
import { initialsOf } from '../../core/people.js';
import { createPicker, pickerMarkup } from '../../core/picker.js';
import { swapStyles } from '../../core/swap.js';
import '../button/index.js';
import '../text-input/index.js';
import '../textarea/index.js';
import styles from './edit-profile-form.scss?inline';

const PRONOUNS = ['they/them', 'she/her', 'he/him', 'any pronouns'].map((value) => ({ value, label: value }));
const STYLES = ['ring', 'light', 'gray', 'outline', 'dots'];
const USERNAME = /^[a-z0-9_]{3,20}$/;
const BIO_MAX = 160;

const DEMO_PROFILE = {
  name: 'Alex Morgan',
  pronouns: 'they/them',
  username: 'alexmorgan',
  website: 'alexmorgan.dev',
  role: 'Systems engineer',
  location: 'Lisbon',
  timeZone: 'Europe/Lisbon',
  bio: 'Writing small, fast C at LowerSoft. Slow mornings, fast binaries.',
};

// The preview's banner: lines on one side, rings on the other.
const BANNER = `<svg class="banner" viewBox="0 0 400 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${Array.from({ length: 22 }, (_, i) => `<path d="M${10 + i * 8} 0V60"/>`).join('')}${Array.from({ length: 8 }, (_, i) => `<circle cx="350" cy="64" r="${8 + i * 9}"/>`).join('')}</svg>`;

/**
 * Edit a profile and see it as others will, above the form, as you type:
 * the avatar in the style picked or the image uploaded, the name, pronouns,
 * handle, role, place and local time, website and bio. The username is
 * checked as it is typed, the bio counts down, and Save lights up only
 * when something changed; Reset puts it back.
 *
 * The profile is `{ name, pronouns, username, website, role, location,
 * timeZone, bio }`, `timeZone` an IANA zone for the local time.
 *
 * @attr {object} profile (JSON)
 * @attr {string} avatar-style - ring, light, gray, outline or dots
 * @fires lw-save - Saved; `detail: { profile, avatar }`, `avatar` the uploaded file if any
 */
export class LwEditProfileForm extends LwElement {
  static styles = [iconStyles, menuStyles, swapStyles, styles];
  static props = {
    profile: { type: Object, default: DEMO_PROFILE },
    avatarStyle: { default: 'ring', reflect: true },
  };

  #draft = {};
  #saved = {};
  #image = null;
  #pronounPicker;
  #clock = 0;

  render() {
    return `<section class="preview" aria-label="Preview"><header class="preview-head"><span>Preview · how others see you</span><span class="scope">${strokeIcon(eye, 15)}Workspace</span></header>
<div class="card">${BANNER}<span class="avatar big" aria-hidden="true"></span><a class="site">${strokeIcon(link2, 15)}<span class="site-text"></span></a><p class="who"><b class="p-name"></b> <span class="p-pronouns"></span></p><p class="p-handle"></p>
<p class="facts"><span class="fact">${strokeIcon(briefcase, 15)}<span class="p-role"></span></span><span class="fact">${strokeIcon(mapPin, 15)}<span class="p-location"></span></span><span class="fact">${strokeIcon(clock, 15)}<span class="p-time"></span></span></p><p class="p-bio"></p></div></section>
<form class="form" novalidate><div class="row avatars"><span class="label" id="avatar-label">Avatar</span><div class="styles" role="radiogroup" aria-labelledby="avatar-label">${STYLES.map((style) => `<button class="style" type="button" role="radio" data-style="${style}" aria-label="${style}"><span class="avatar small" data-style="${style}"></span></button>`).join('')}</div><label class="upload"><input class="file" type="file" accept="image/*">Upload</label></div>
<div class="grid"><lw-text-input class="field" data-key="name" label="Display name" autocomplete="name"></lw-text-input><div class="pronouns"><span class="label">Pronouns</span>${pickerMarkup('pronoun-menu')}</div>
<lw-text-input class="field" data-key="username" label="Username" autocomplete="username" maxlength="20"><span slot="start">@</span></lw-text-input><lw-text-input class="field" data-key="website" label="Website" type="url" inputmode="url"><span slot="start">https://</span></lw-text-input>
<lw-text-input class="field" data-key="role" label="Role"><span slot="start">${strokeIcon(briefcase, 16)}</span></lw-text-input><lw-text-input class="field" data-key="location" label="Location"><span slot="start">${strokeIcon(mapPin, 16)}</span></lw-text-input>
<lw-textarea class="field wide" data-key="bio" label="Bio" rows="3" maxlength="${BIO_MAX}" counter></lw-textarea></div>
<footer class="foot"><p class="state" aria-live="polite"></p><lw-button class="reset" variant="ghost">Reset</lw-button><lw-button class="save" type="submit">Save profile</lw-button></footer></form>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.#pronounPicker = createPicker(this.query('.pronouns'), this.signal, (value) => this.#set('pronouns', value));
    this.query('.pronouns .picker-trigger').setAttribute('aria-label', 'Pronouns');
    this.query('.grid').addEventListener('input', (event) => {
      const field = event.target.closest('.field');
      if (field) this.#set(field.dataset.key, field.value ?? '');
    }, options);
    const styles = this.query('.styles');
    styles.addEventListener('click', (event) => {
      const style = event.target.closest('.style');
      if (!style) return;
      this.#image = null;
      this.avatarStyle = style.dataset.style;
      this.#paint();
    }, options);
    styles.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      this.avatarStyle = STYLES[(STYLES.indexOf(this.avatarStyle) + step + STYLES.length) % STYLES.length];
      this.query(`.style[data-style="${this.avatarStyle}"]`).focus();
    }, options);
    this.query('.file').addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (this.#image) URL.revokeObjectURL(this.#image.url);
      this.#image = { file, url: URL.createObjectURL(file) };
      this.#paint();
    }, options);
    this.query('.form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#save();
    }, options);
    this.query('.reset').addEventListener('click', () => this.#load(this.#saved), options);
    // The local time moves on while the form is open.
    this.#clock = setInterval(() => this.#paintTime(), 30_000);
    this.signal.addEventListener('abort', () => {
      clearInterval(this.#clock);
      if (this.#image) URL.revokeObjectURL(this.#image.url);
    });
  }

  updated(changed) {
    if (changed.has('profile')) {
      this.#saved = { ...DEMO_PROFILE, ...this.profile };
      this.#load(this.#saved);
    } else {
      this.#paint();
    }
  }

  #load(profile) {
    this.#draft = { ...profile };
    for (const field of this.shadowRoot.querySelectorAll('.field')) field.value = profile[field.dataset.key] ?? '';
    this.#paint();
  }

  #set(key, value) {
    this.#draft[key] = value;
    this.#paint();
  }

  get #usernameError() {
    const username = this.#draft.username ?? '';
    return USERNAME.test(username) ? '' : '3 to 20 lowercase letters, numbers or underscores.';
  }

  get #dirty() {
    return Boolean(this.#image && !this.#image.saved) || Object.keys(this.#draft).some((key) => this.#draft[key] !== this.#saved[key]);
  }

  #paint() {
    const draft = this.#draft;
    const initials = initialsOf(draft.name || '?');
    for (const avatar of this.shadowRoot.querySelectorAll('.avatar')) {
      avatar.textContent = initials;
      if (avatar.classList.contains('big')) {
        avatar.dataset.style = this.avatarStyle;
        avatar.style.backgroundImage = this.#image ? `url("${this.#image.url}")` : '';
        avatar.toggleAttribute('data-image', Boolean(this.#image));
      }
    }
    for (const style of this.shadowRoot.querySelectorAll('.style')) {
      const checked = !this.#image && style.dataset.style === this.avatarStyle;
      style.ariaChecked = String(checked);
      style.tabIndex = checked || (this.#image && style.dataset.style === STYLES[0]) ? 0 : -1;
    }
    this.query('.p-name').textContent = draft.name || 'Your name';
    this.query('.p-pronouns').textContent = draft.pronouns ?? '';
    this.query('.p-handle').textContent = `@${draft.username || 'username'}`;
    this.query('.p-role').textContent = draft.role || 'Role';
    this.query('.p-location').textContent = draft.location || 'Location';
    this.query('.p-bio').textContent = draft.bio ?? '';
    const site = this.query('.site');
    site.hidden = !draft.website;
    site.href = draft.website ? `https://${draft.website.replace(/^https?:\/\//, '')}` : '#';
    this.query('.site-text').textContent = (draft.website ?? '').replace(/^https?:\/\//, '');
    this.#paintTime();
    this.#pronounPicker?.set(PRONOUNS, draft.pronouns);
    const username = this.query('.field[data-key="username"]');
    if (username) username.error = draft.username === this.#saved.username ? '' : this.#usernameError;
    const dirty = this.#dirty;
    this.query('.save').disabled = !dirty || Boolean(this.#usernameError);
    this.query('.reset').hidden = !dirty;
    this.query('.state').textContent = dirty ? 'Unsaved changes' : '';
  }

  #paintTime() {
    let time = '';
    try {
      time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: this.#draft.timeZone }).format(new Date());
    } catch {
      time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date());
    }
    this.query('.p-time').textContent = `${time} local`;
  }

  #save() {
    if (!this.#dirty || this.#usernameError) return;
    this.#saved = { ...this.#draft };
    const avatar = this.#image?.file ?? null;
    this.emit('save', { profile: { ...this.#saved }, avatar });
    this.#image = this.#image ? { ...this.#image, saved: true } : null;
    this.#paint();
    this.query('.state').textContent = 'Saved';
  }
}
