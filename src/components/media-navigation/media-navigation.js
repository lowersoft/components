import { escapeHtml } from '../../core/dom.js';
import { countMarkup, countOf } from '../../core/forum.js';
import { strokeIcon } from '../../core/icons.js';
import { folder, image, imagePlus, images, layers, user } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf } from '../../core/people.js';
import { inSection, pathOf } from '../../core/route.js';
import styles from './media-navigation.scss?inline';

// The icons a link can name, by their Lucide names.
const ICONS = { folder, image, 'image-plus': imagePlus, images, layers, user };

const DEMO_CATEGORIES = [
  { label: 'All media', href: '/media', count: 504, icon: 'layers' },
  { label: 'Made with lw', href: '/media/categories/made-with-lw', count: 126 },
  { label: 'Wallpapers', href: '/media/categories/wallpapers', count: 212 },
  { label: 'Desk setups', href: '/media/categories/desk-setups', count: 84 },
  { label: 'Screenshots', href: '/media/categories/screenshots', count: 61 },
];

const DEMO_LINKS = [
  { label: 'Browse albums', href: '/media/albums', icon: 'images' },
  { label: 'Your media', href: '/media/users/p0unter', icon: 'image' },
  { label: 'Your albums', href: '/media/albums/users/p0unter', icon: 'folder' },
];

/**
 * The way around a forum's media: its categories, each with a square in
 * its own colour and how much media it holds, then links to its albums and
 * a member's own media and albums. The page you are on keeps a background,
 * as does the category or album it sits under.
 *
 * Categories are `{ label, href, count?, color?, icon? }` and links
 * `{ label, href, icon? }`. An `icon` is a Lucide icon's name: folder,
 * image, image-plus, images, layers or user; a category without one gets a
 * square in its own colour, `color` or one picked from its name.
 *
 * @attr {Array<object>} categories - The media's categories, in order (JSON)
 * @attr {Array<object>} links - The links under them, such as the albums (JSON)
 * @attr {string} current - Path of the page you are on; the address bar's by default
 * @attr {string} heading - The title, also the navigation's accessible name
 * @attr {number} level - Heading level of the title, 1 to 6
 * @csspart frame - The outer frame
 */
export class LwMediaNavigation extends LwElement {
  static styles = styles;
  static props = {
    categories: { type: Object, default: DEMO_CATEGORIES },
    links: { type: Object, default: DEMO_LINKS },
    current: { default: '' },
    heading: { default: 'Media' },
    level: { type: Number, default: 2 },
  };

  render() {
    return '<nav class="frame" part="frame" aria-labelledby="title"></nav>';
  }

  connected() {
    addEventListener('popstate', () => this.#paintCurrent(), { signal: this.signal });
  }

  updated() {
    const level = Math.round(this.level) >= 1 && Math.round(this.level) <= 6 ? Math.round(this.level) : 2;
    const list = (entries) => (Array.isArray(entries) ? entries : []).filter((entry) => entry && typeof entry === 'object' && entry.label);
    const categories = list(this.categories);
    const links = list(this.links);
    const lists = [
      categories.length ? `<ul class="list" role="list">${categories.map((entry) => this.#itemMarkup(entry, true)).join('')}</ul>` : '',
      links.length ? `<ul class="list" role="list">${links.map((entry) => this.#itemMarkup(entry, false)).join('')}</ul>` : '',
    ].filter(Boolean);
    this.query('.frame').innerHTML = `<div class="head"><h${level} class="title" id="title">${escapeHtml(this.heading ?? '')}</h${level}></div>
<div class="card">${lists.join('') || '<p class="empty">Nothing here yet.</p>'}</div>`;
    this.#paintCurrent();
  }

  #itemMarkup(entry, swatch) {
    const icon = ICONS[entry.icon];
    const tint = entry.color ? `background: ${entry.color}` : `--_hue: ${hueOf(String(entry.label))}`;
    const lead = icon ? `<span class="icon" aria-hidden="true">${strokeIcon(icon, 16)}</span>` : swatch ? `<span class="icon" aria-hidden="true"><span class="swatch" style="${escapeHtml(tint)}"></span></span>` : '<span class="icon" aria-hidden="true"></span>';
    const count = countOf(entry.count);
    return `<li><a class="item" href="${escapeHtml(entry.href ?? '#')}">${lead}<span class="label">${escapeHtml(entry.label)}</span>${count !== null ? `<span class="count">${countMarkup(count)}<span class="visually-hidden"> ${count === 1 ? 'item' : 'items'}</span></span>` : ''}</a></li>`;
  }

  // Marks the link to the page you are on, and the one of the section it
  // is in.
  #paintCurrent() {
    const current = pathOf(this.current || location.pathname) ?? '';
    let section = null;
    let length = -1;
    for (const link of this.shadowRoot.querySelectorAll('a.item')) {
      const path = pathOf(link.getAttribute('href'));
      if (path !== null && path === current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
      link.removeAttribute('data-current');
      if (inSection(path, current) && path.length > length) [section, length] = [link, path.length];
    }
    section?.toggleAttribute('data-current', true);
  }
}
