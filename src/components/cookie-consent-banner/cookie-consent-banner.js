import { dismissBanner } from '../../core/banner.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { lock } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import '../switch/index.js';
import styles from './cookie-consent-banner.scss?inline';

const DEMO_CATEGORIES = [
  { id: 'necessary', name: 'Necessary', count: '3 cookies', description: 'Sign-in, security and your settings', required: true },
  { id: 'analytics', name: 'Analytics', count: '4 cookies', description: 'Which pages you visit and how fast they load' },
  { id: 'marketing', name: 'Marketing', count: '7 vendors', description: 'Ads for us on other sites you visit' },
];

/**
 * Cookie consent with the choice in plain view: each category says what it
 * is for and how many cookies it sets, the necessary ones are locked on,
 * and the rest are off until switched on. Reject all, save the choices, or
 * accept all; the banner then folds away. With `storage-key`, the answer is
 * kept in this browser and the banner stays away once given.
 *
 * Categories are `{ id, name, description, count?, required? }`.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} policy-href
 * @attr {string} storage-key - Where to keep the answer in local storage
 * @attr {Array<object>} categories (JSON)
 * @fires lw-consent - An answer was given; `detail: { choices }`, by category id
 * @fires lw-dismiss - The banner folded away
 */
export class LwCookieConsentBanner extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Cookies on this site' },
    description: { default: 'We need a few to keep you signed in. The rest only run if you say so.' },
    policyHref: { default: '#' },
    storageKey: {},
    categories: { type: Object, default: DEMO_CATEGORIES },
  };

  render() {
    return `<section class="card" aria-labelledby="cookies-title"><header class="head"><h2 class="title" id="cookies-title"></h2><a class="policy">Cookie policy</a></header><p class="description"></p>
<ul class="categories"></ul><div class="actions"><lw-button class="reject" variant="ghost">Reject all</lw-button><lw-button class="save" variant="outline">Save choices</lw-button><lw-button class="accept">Accept all</lw-button></div></section>`;
  }

  connected() {
    if (this.#stored) {
      this.hidden = true;
      return;
    }
    const options = { signal: this.signal };
    this.query('.reject').addEventListener('click', () => this.#answer(false), options);
    this.query('.accept').addEventListener('click', () => this.#answer(true), options);
    this.query('.save').addEventListener('click', () => this.#answer(null), options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.policy').href = this.policyHref ?? '#';
    if (changed.has('categories')) {
      this.query('.categories').innerHTML = (this.categories ?? [])
        .map((category) => {
          const control = category.required
            ? `<span class="always">${strokeIcon(lock, 15)}Always on</span>`
            : `<lw-switch class="choice" data-id="${escapeHtml(category.id)}">${escapeHtml(category.name)}</lw-switch>`;
          return `<li class="category"><div class="about"><p class="name">${escapeHtml(category.name)}${category.count ? `<span class="count">${escapeHtml(category.count)}</span>` : ''}</p><p class="what">${escapeHtml(category.description)}</p></div>${control}</li>`;
        })
        .join('');
    }
  }

  // An answer given before, if it was kept.
  get #stored() {
    if (!this.storageKey) return null;
    try {
      return JSON.parse(localStorage.getItem(this.storageKey));
    } catch {
      return null;
    }
  }

  // All on, all off, or as switched (`all` null); keeps it if asked, then folds away.
  #answer(all) {
    const choices = {};
    for (const category of this.categories ?? []) {
      const choice = this.query(`.choice[data-id="${CSS.escape(category.id)}"]`);
      choices[category.id] = category.required || (all ?? Boolean(choice?.checked));
    }
    if (this.storageKey) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(choices));
      } catch {
        // Private windows may refuse; the answer still counts for this visit.
      }
    }
    this.emit('consent', { choices });
    dismissBanner(this);
  }
}
