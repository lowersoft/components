import { dismissBanner } from '../../core/banner.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronDown, cookie, lock } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import '../button/index.js';
import '../switch/index.js';
import styles from './cookie-consent-banner.scss?inline';

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

const DEMO_CATEGORIES = [
  { id: 'necessary', name: 'Necessary', count: '3 cookies', description: 'Sign-in, security and your settings. The site does not work without them.', required: true },
  { id: 'analytics', name: 'Analytics', count: '4 cookies', description: 'Which pages you visit and how fast they load, so we can improve them.' },
  { id: 'marketing', name: 'Marketing', count: '7 vendors', description: 'Measures our ads on other sites and keeps them relevant to you.' },
];

/**
 * Cookie consent in two steps. First a short notice: reject all and accept
 * all side by side, with equal weight, and Customize. Customize opens the
 * categories, each saying what it is for and how many cookies it sets; the
 * necessary ones are locked on and the rest are off until switched on, and
 * the choice is saved as switched. The banner then folds away. With
 * `storage-key`, the answer is kept in this browser and the banner stays
 * away once given.
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
    heading: { default: 'We value your privacy' },
    description: { default: 'We use a few cookies to keep you signed in and the site secure. Others help us improve it, and only run if you agree.' },
    policyHref: { default: '#' },
    storageKey: {},
    categories: { type: Object, default: DEMO_CATEGORIES },
  };

  #open = false;

  render() {
    return `<section class="card" aria-labelledby="cookies-title" aria-describedby="cookies-text"><div class="intro"><span class="badge" aria-hidden="true">${strokeIcon(cookie, 18)}</span><div><h2 class="title" id="cookies-title"></h2><p class="description" id="cookies-text"><span class="description-text"></span> <a class="policy">Cookie policy</a></p></div></div>
<div class="details" id="cookie-details" hidden><ul class="categories"></ul></div>
<div class="actions"><button class="customize" type="button" aria-expanded="false" aria-controls="cookie-details"><span class="customize-text">Customize</span>${strokeIcon(chevronDown, 16)}</button><span class="answers"><lw-button class="reject" variant="outline">Reject all</lw-button><lw-button class="save" variant="outline" hidden>Save choices</lw-button><lw-button class="accept">Accept all</lw-button></span></div></section>`;
  }

  connected() {
    if (this.#stored) {
      this.hidden = true;
      return;
    }
    const options = { signal: this.signal };
    this.query('.customize').addEventListener('click', () => this.#toggle(), options);
    this.query('.reject').addEventListener('click', () => this.#answer(false), options);
    this.query('.accept').addEventListener('click', () => this.#answer(true), options);
    this.query('.save').addEventListener('click', () => this.#answer(null), options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description-text').textContent = this.description ?? '';
    this.query('.policy').href = this.policyHref ?? '#';
    if (changed.has('categories')) {
      this.query('.categories').innerHTML = (this.categories ?? [])
        .map((category) => {
          const id = escapeHtml(category.id);
          const control = category.required
            ? `<span class="always">${strokeIcon(lock, 14)}Always on</span>`
            : `<lw-switch class="choice" data-id="${id}" size="sm">${escapeHtml(category.name)}</lw-switch>`;
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

  // Opens or closes the categories; the card eases to its new height, and
  // the answers follow: switching asks to save, closed it is all or nothing.
  #toggle() {
    const open = !this.#open;
    this.#open = open;
    const card = this.query('.card');
    const details = this.query('.details');
    const before = card.offsetHeight;
    details.hidden = !open;
    this.toggleAttribute('data-open', open);
    const customize = this.query('.customize');
    customize.ariaExpanded = String(open);
    this.query('.customize-text').textContent = open ? 'Hide choices' : 'Customize';
    this.query('.reject').hidden = open;
    this.query('.save').hidden = !open;
    if (reducedMotion.matches) return;
    card.animate({ height: [`${before}px`, `${card.offsetHeight}px`] }, { duration: 320, easing: EASE_OUT });
    if (open) {
      details.querySelectorAll('.category').forEach((category, i) => {
        category.animate({ opacity: [0, 1], translate: ['0 0.375rem', '0 0'] }, { duration: 260, delay: 60 + i * 50, easing: EASE_OUT, fill: 'backwards' });
      });
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
