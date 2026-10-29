import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { keyRound, messageSquareText, search, squareTerminal, timer } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { IS_APPLE } from '../../core/platform.js';
import styles from './docs-search.scss?inline';

const HASH = '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>';

const GROUP_ICONS = { Authentication: keyRound, Builds: squareTerminal, Profiler: timer };

const DEMO_SECTIONS = [
  { group: 'Authentication', title: 'Rotate a key', text: 'Rotate a key from its menu. The old key keeps working for 24 hours so running builds finish, then it stops.', href: '#rotate' },
  { group: 'Authentication', title: 'Create an API key', text: 'Create keys from Settings, API keys. Each key belongs to one workspace and can be limited to read or write.', href: '#create-key' },
  { group: 'Authentication', title: 'Revoke a leaked key', text: 'If a key leaks, revoke it right away from its menu. Revoking is immediate and cannot be undone.', href: '#revoke' },
  { group: 'Builds', title: 'Cache a build between runs', text: 'Builds keep their object cache for seven days. Set LOWER_CACHE to share it between machines.', href: '#cache' },
  { group: 'Builds', title: 'Cross-compile for ARM', text: 'Pass --target aarch64-linux to any build. The toolchain is fetched once and kept with the cache.', href: '#cross' },
  { group: 'Builds', title: 'Sign a release binary', text: 'Release builds are signed with the workspace key; rotate it like an API key when someone leaves.', href: '#sign' },
  { group: 'Profiler', title: 'Record a trace', text: 'Run lower trace with your program after it. Sampling starts at once and costs under 2% of a core.', href: '#trace' },
  { group: 'Profiler', title: 'Read a flame graph', text: 'Wide frames are where the time goes. Click one to zoom in; press the key F to fit it again.', href: '#flame' },
  { group: 'Profiler', title: 'Share a trace link', text: 'Traces can be shared with a link that expires after a day, a week or never.', href: '#share' },
];

const wordsOf = (text) => text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
const STOP = new Set(['a', 'an', 'the', 'to', 'of', 'for', 'and', 'in', 'on', 'how', 'do', 'i']);

// Escapes `text` and marks each word that starts with one of `terms`.
const marked = (text, terms) => escapeHtml(text).replace(/[A-Za-z0-9]+/g, (word) => (terms.some((term) => word.toLowerCase().startsWith(term)) ? `<mark>${word}</mark>` : word));

/**
 * Search the documentation as you type: sections grouped by topic, the
 * words that matched underlined in titles and text, and the best match
 * first. The first row hands the whole question to an assistant instead,
 * with Ctrl+Enter (⌘+Enter on Apple) from anywhere in the search. The arrow
 * keys move a sliding highlight and Enter opens.
 *
 * Sections are `{ group, title, text, href }`.
 *
 * @attr {string} value - The search
 * @attr {Array<object>} sections (JSON)
 * @fires lw-open - A section was opened; `detail: { section }`
 * @fires lw-ask - The question went to the assistant; `detail: { question }`
 */
export class LwDocsSearch extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    value: { default: 'rotate api key' },
    sections: { type: Object, default: DEMO_SECTIONS },
  };

  #active = 0;
  #rows = [];

  render() {
    const key = IS_APPLE ? '⌘' : 'Ctrl';
    return `<label class="search">${strokeIcon(search, 20)}<input class="input" type="search" role="combobox" aria-controls="results" aria-expanded="true" aria-autocomplete="list" aria-label="Search the docs" placeholder="Search the docs" autocomplete="off" spellcheck="false"><span class="count" aria-live="polite"></span></label>
<div class="results" id="results" role="listbox" aria-label="Results"><span class="highlight"></span><div class="rows"></div></div><template class="keys"><kbd>${key}</kbd><kbd>↵</kbd></template>`;
  }

  connected() {
    const options = { signal: this.signal };
    const input = this.query('.input');
    input.addEventListener('input', () => {
      this.#active = 0;
      this.#paint();
    }, options);
    input.addEventListener('keydown', (event) => this.#key(event), options);
    const results = this.query('.results');
    results.addEventListener('click', (event) => {
      const row = event.target.closest('[data-row]');
      if (row) this.#open(Number(row.dataset.row));
    }, options);
    results.addEventListener('pointermove', (event) => {
      const row = event.target.closest('[data-row]');
      if (!row || Number(row.dataset.row) === this.#active) return;
      this.#active = Number(row.dataset.row);
      this.#paintActive();
    }, options);
  }

  updated(changed) {
    if (changed.has('value')) this.query('.input').value = this.value ?? '';
    this.#paint();
  }

  get #terms() {
    return wordsOf(this.query('.input').value).filter((word) => !STOP.has(word));
  }

  // Each section scored by the terms it has, titles counting double.
  get #matches() {
    const terms = this.#terms;
    if (!terms.length) return [];
    return this.sections
      .map((section) => {
        const title = wordsOf(section.title);
        const text = wordsOf(section.text);
        const has = (words, term) => words.some((word) => word.startsWith(term));
        const score = terms.reduce((sum, term) => sum + (has(title, term) ? 2 : 0) + (has(text, term) ? 1 : 0), 0);
        return { section, score };
      })
      .filter((each) => each.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  #paint() {
    const question = this.query('.input').value.trim();
    const terms = this.#terms;
    const matches = this.#matches;
    this.query('.count').textContent = question ? `${matches.length} ${matches.length === 1 ? 'section' : 'sections'}` : '';
    // Groups in the order of their best match.
    const groups = [];
    for (const { section } of matches) {
      let group = groups.find((each) => each.name === section.group);
      if (!group) groups.push((group = { name: section.group, sections: [] }));
      group.sections.push(section);
    }
    this.#rows = [];
    let html = '';
    if (question) {
      this.#rows.push({ ask: question });
      html += `<div class="ask" role="option" id="row-0" data-row="0">${strokeIcon(messageSquareText, 20)}<span class="ask-text">Ask the docs <q>${escapeHtml(question)}</q></span><span class="keys">${this.query('.keys').innerHTML}</span></div>`;
    }
    for (const group of groups) {
      html += `<div class="group" role="group" aria-label="${escapeHtml(group.name)}"><p class="group-head" aria-hidden="true">${strokeIcon(GROUP_ICONS[group.name] ?? HASH, 15)}<span>${escapeHtml(group.name)}</span><span class="group-count">${group.sections.length}</span></p>`;
      for (const section of group.sections) {
        const index = this.#rows.push({ section }) - 1;
        html += `<div class="result" role="option" id="row-${index}" data-row="${index}"><span class="hash" aria-hidden="true">${strokeIcon(HASH, 16)}</span><div><p class="title">${marked(section.title, terms)}</p><p class="snippet">${marked(section.text, terms)}</p></div></div>`;
      }
      html += '</div>';
    }
    if (question && !matches.length) html += '<p class="none">No sections match. Ask the docs instead.</p>';
    this.query('.rows').innerHTML = html;
    this.#paintActive();
  }

  #paintActive() {
    const rows = [...this.shadowRoot.querySelectorAll('[data-row]')];
    this.#active = Math.min(this.#active, Math.max(0, rows.length - 1));
    rows.forEach((row, i) => row.ariaSelected = String(i === this.#active));
    const active = rows[this.#active];
    const input = this.query('.input');
    if (active) {
      moveHighlight(this.query('.highlight'), active);
      active.scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', active.id);
    } else {
      hideHighlight(this.query('.highlight'));
      input.removeAttribute('aria-activedescendant');
    }
  }

  #open(index) {
    const row = this.#rows[index];
    if (!row) return;
    if (row.ask) this.emit('ask', { question: row.ask });
    else this.emit('open', { section: row.section });
  }

  #key(event) {
    const count = this.#rows.length;
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (step && count) {
      event.preventDefault();
      this.#active = (this.#active + step + count) % count;
      this.#paintActive();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      // With the modifier, the question goes to the assistant whatever is lit.
      if ((IS_APPLE ? event.metaKey : event.ctrlKey) && this.#rows[0]?.ask) this.#open(0);
      else this.#open(this.#active);
    }
  }
}
