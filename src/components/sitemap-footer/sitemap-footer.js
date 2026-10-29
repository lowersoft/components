import { brandMarkup, linkColumns } from '../../core/footer.js';
import { isTyping } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './sitemap-footer.scss?inline';

const DEMO_COLUMNS = [
  { title: 'Product', links: [{ label: 'Overview' }, { label: 'Profiler', badge: 'New' }, { label: 'Debugger' }, { label: 'Integrations' }, { label: 'Pricing' }, { label: 'Changelog' }] },
  { title: 'Developers', links: [{ label: 'Documentation' }, { label: 'API reference' }, { label: 'SDKs' }, { label: 'CLI' }, { label: 'Examples' }, { label: 'Status' }] },
  { title: 'Solutions', links: [{ label: 'Embedded' }, { label: 'Game engines' }, { label: 'Databases' }, { label: 'Trading systems' }, { label: 'Agencies' }] },
  { title: 'Resources', links: [{ label: 'Blog' }, { label: 'Guides' }, { label: 'Customers' }, { label: 'Templates' }, { label: 'Events' }] },
  { title: 'Company', links: [{ label: 'About' }, { label: 'Careers', badge: '4 open' }, { label: 'Press kit' }, { label: 'Contact' }, { label: 'Privacy' }, { label: 'Terms' }] },
];

/**
 * A footer that maps the whole site: the brand, a "Jump to" search, and
 * columns of links. Typing in the search, or pressing `/` anywhere first,
 * dims every link that does not match; Enter or the down arrow goes to the
 * first that does, and Escape clears.
 *
 * Columns are `[{ title, links: [{ label, href?, badge? }] }]`.
 *
 * @attr {string} brand
 * @attr {string} href - Where the brand links
 * @attr {Array<object>} columns (JSON)
 * @attr {string} note - The small print under the columns
 */
export class LwSitemapFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lower' },
    href: { default: '/' },
    columns: { type: Object, default: DEMO_COLUMNS },
    note: {},
  };

  render() {
    return `<footer class="container"><div class="top"><span class="brand-slot"></span>
<label class="jump"><span class="visually-hidden">Jump to a page</span><input class="query" type="search" placeholder="Jump to…" autocomplete="off" spellcheck="false" aria-describedby="found"><kbd class="key" aria-hidden="true">/</kbd></label></div>
<p class="found visually-hidden" id="found" aria-live="polite"></p><div class="columns"></div><p class="note"></p></footer>`;
  }

  connected() {
    const options = { signal: this.signal };
    const query = this.query('.query');
    query.addEventListener('input', () => this.#filter(), options);
    query.addEventListener('keydown', (event) => this.#key(event), options);
    // `/` from anywhere on the page, unless typing somewhere already.
    document.addEventListener('keydown', (event) => {
      if (event.key !== '/' || event.defaultPrevented || isTyping(event) || event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      query.focus();
    }, options);
  }

  updated(changed) {
    if (changed.has('brand') || changed.has('href')) this.query('.brand-slot').innerHTML = brandMarkup(this.brand, this.href);
    if (changed.has('columns')) {
      this.query('.columns').innerHTML = linkColumns(this.columns);
      this.#filter();
    }
    this.query('.note').textContent = this.note ?? `© ${new Date().getFullYear()} ${this.brand ?? ''}. All rights reserved.`;
  }

  get #links() {
    return [...this.shadowRoot.querySelectorAll('.columns .link')];
  }

  // Dims what does not match and marks where each match is.
  #filter() {
    const term = this.query('.query').value.trim().toLowerCase();
    this.toggleAttribute('data-filtering', Boolean(term));
    let found = 0;
    for (const link of this.#links) {
      const label = link.querySelector('.link-label');
      const text = label.textContent;
      const at = term ? text.toLowerCase().indexOf(term) : -1;
      link.toggleAttribute('data-match', at >= 0);
      label.replaceChildren(text);
      if (at < 0) continue;
      found++;
      const mark = Object.assign(document.createElement('mark'), { textContent: text.slice(at, at + term.length) });
      label.replaceChildren(text.slice(0, at), mark, text.slice(at + term.length));
    }
    for (const column of this.shadowRoot.querySelectorAll('.column')) column.toggleAttribute('data-match', Boolean(column.querySelector('[data-match]')));
    this.query('.found').textContent = term ? `${found} ${found === 1 ? 'page' : 'pages'} found` : '';
  }

  #key(event) {
    const input = event.target;
    if (event.key === 'Escape' && input.value) {
      event.preventDefault();
      input.value = '';
      this.#filter();
      return;
    }
    const first = this.#links.find((link) => link.hasAttribute('data-match'));
    if (!first) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      first.click();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      first.focus();
    }
  }
}
