import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronRight, search, thumbsUp } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import '../copy-button/index.js';
import styles from './help-center-faq.scss?inline';

const item = (group, question, answer, useful, command) => ({ group, question, answer, useful, command });

const DEMO_ITEMS = [
  item('Setup', 'How do I add a component?', 'Install the package once, then import the components you use. Each one registers its own element, so the ones you never import never ship.', 214, 'npm install @lowersoft/lw'),
  item('Setup', 'Does it work outside a framework?', 'Yes. They are standard custom elements, so they work in plain HTML, React, Vue, Svelte or anything else that renders the DOM.', 132),
  item('Setup', 'Can I change the theme?', 'Every design token is a --lw-* custom property. Load the default theme, then override the tokens on :root or on one element and the components follow, light and dark.', 98, "import '@lowersoft/lw/themes.css';"),
  item('Licensing', 'Is it free for commercial work?', 'Yes. The library is MIT licensed: use it in client work and products, free of charge, with no seat limits.', 176),
  item('Licensing', 'Do I need to credit the library?', 'No. Keep the license file with the package; a link back is always welcome but never required.', 41),
  item('Accessibility', 'Do the components work with a keyboard?', 'Every control is reachable with Tab, and lists, menus and sliders follow the arrow keys. Focus is always visible and never trapped.', 87),
  item('Accessibility', 'Do animations respect reduced motion?', 'Yes. With reduced motion on, components skip their animations and show the end state, and endless effects stay still.', 64),
];

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Escapes `text` and marks every match of `pattern` in it.
const marked = (text, pattern) => {
  if (!pattern) return escapeHtml(text);
  let html = '';
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    html += `${escapeHtml(text.slice(last, match.index))}<mark>${escapeHtml(match[0])}</mark>`;
    last = match.index + match[0].length;
  }
  return html + escapeHtml(text.slice(last));
};

// The sentence of an answer that holds the first match.
const snippetOf = (answer, pattern) => {
  pattern.lastIndex = 0;
  return answer.split(/(?<=[.!?])\s+/).find((sentence) => sentence.match(pattern)) ?? '';
};

/**
 * The FAQ as a command palette. Typing filters the questions and marks
 * every match; a question that matched only in its answer shows the line
 * that did. The arrow keys move the highlight and Enter opens an answer in
 * place, with a command to copy where it has one and a "useful" count.
 * With no match, Enter asks the team. Escape clears the search.
 *
 * Items are `{ group, question, answer, useful?, command? }`.
 *
 * @attr {Array<object>} items (JSON)
 * @attr {string} placeholder
 * @fires lw-open - An answer opened; `detail: { item }`
 * @fires lw-useful - An answer was marked useful or unmarked; `detail: { item, useful }`
 * @fires lw-ask - The team was asked; `detail: { question }`
 */
export class LwHelpCenterFaq extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    placeholder: { default: 'Search questions' },
  };

  // The row under the highlight, the open answer and those marked useful, by index.
  #active = 0;
  #open = -1;
  #useful = new Set();

  render() {
    return `<label class="search">${strokeIcon(search, 18)}<input class="query" type="search" autocomplete="off" spellcheck="false" role="combobox" aria-controls="results" aria-expanded="true" aria-autocomplete="list"><span class="count" aria-live="polite"></span></label>
<div class="results" id="results" role="listbox" aria-label="Questions"><span class="highlight"></span><div class="groups"></div>
<div class="none" hidden><p class="none-text"></p><lw-button class="ask" size="sm">Ask the team</lw-button></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const query = this.query('.query');
    query.addEventListener('input', () => {
      this.#active = 0;
      this.#open = -1;
      this.query('.ask').hidden = false;
      this.#filter();
    }, options);
    query.addEventListener('keydown', (event) => this.#key(event), options);
    const groups = this.query('.groups');
    groups.addEventListener('click', (event) => {
      const useful = event.target.closest('.useful');
      if (useful) return this.#markUseful(Number(useful.closest('.row').dataset.index));
      const head = event.target.closest('.row-head');
      if (head) this.#toggle(Number(head.closest('.row').dataset.index));
    }, options);
    groups.addEventListener('pointermove', (event) => {
      const row = event.target.closest('.row');
      if (!row || Number(row.dataset.index) === this.#active) return;
      this.#active = Number(row.dataset.index);
      this.#paintActive();
    }, options);
    this.query('.ask').addEventListener('click', () => this.#ask(), options);
  }

  updated(changed) {
    this.query('.query').placeholder = this.placeholder ?? '';
    if (changed.has('items')) this.#build();
  }

  #build() {
    const groups = [...new Set(this.items.map((each) => each.group))];
    this.query('.groups').innerHTML = groups
      .map((group) => `<section class="group" data-group="${escapeHtml(group)}"><header class="group-head"><span>${escapeHtml(group)}</span><span class="group-count"></span></header>${this.items
        .map((each, i) => (each.group === group ? this.#row(each, i) : ''))
        .join('')}</section>`)
      .join('');
    this.#useful.clear();
    this.#filter();
  }

  #row(each, i) {
    const command = each.command ? `<lw-copy-button class="command" value="${escapeHtml(each.command)}" label="Copy the command"></lw-copy-button>` : '';
    return `<div class="row" role="option" id="faq-row-${i}" data-index="${i}" aria-selected="false">
<button class="row-head" type="button" tabindex="-1" aria-expanded="false" aria-controls="faq-answer-${i}">${strokeIcon(chevronRight, 16)}<span class="question"></span></button><p class="snippet"></p>
<div class="answer" id="faq-answer-${i}" hidden><p class="answer-text">${escapeHtml(each.answer)}</p>${command}<div class="answer-foot"><button class="useful" type="button" aria-pressed="false">${strokeIcon(thumbsUp, 16)}<span>Mark useful</span></button><span class="useful-count"></span></div></div></div>`;
  }

  get #pattern() {
    const terms = (this.query('.query').value ?? '').trim().split(/\s+/).filter(Boolean).map(escapeRegExp);
    return terms.length ? new RegExp(terms.join('|'), 'gi') : null;
  }

  // The rows the search leaves, in order.
  get #visible() {
    return [...this.shadowRoot.querySelectorAll('.row:not([hidden])')];
  }

  #filter() {
    const pattern = this.#pattern;
    let shown = 0;
    this.shadowRoot.querySelectorAll('.row').forEach((row) => {
      const each = this.items[Number(row.dataset.index)];
      const inQuestion = !pattern || each.question.search(pattern) >= 0;
      const inAnswer = pattern && !inQuestion && each.answer.search(pattern) >= 0;
      row.hidden = !(inQuestion || inAnswer);
      row.querySelector('.question').innerHTML = marked(each.question, pattern);
      const snippet = row.querySelector('.snippet');
      snippet.innerHTML = inAnswer ? marked(snippetOf(each.answer, pattern), pattern) : '';
      snippet.hidden = !inAnswer;
      if (!row.hidden) shown++;
    });
    for (const group of this.shadowRoot.querySelectorAll('.group')) {
      const count = group.querySelectorAll('.row:not([hidden])').length;
      group.hidden = !count;
      group.querySelector('.group-count').textContent = String(count);
    }
    const total = this.items.length;
    this.query('.count').textContent = pattern ? `${shown} of ${total}` : `${total} answers`;
    const none = this.query('.none');
    none.hidden = shown > 0;
    this.query('.none-text').innerHTML = `No answers for “${escapeHtml(this.query('.query').value.trim())}”. Press <kbd>Enter</kbd> to ask the team.`;
    this.#paintOpen();
    this.#paintActive();
  }

  #paintActive() {
    const visible = this.#visible;
    const row = visible.find((each) => Number(each.dataset.index) === this.#active) ?? visible[0];
    this.#active = row ? Number(row.dataset.index) : -1;
    for (const each of this.shadowRoot.querySelectorAll('.row')) each.ariaSelected = String(each === row);
    const input = this.query('.query');
    if (row) input.setAttribute('aria-activedescendant', row.id);
    else input.removeAttribute('aria-activedescendant');
    // An open row wears its own background; the highlight marks the others.
    const highlight = this.query('.highlight');
    if (row && !row.hasAttribute('data-open')) moveHighlight(highlight, row);
    else hideHighlight(highlight);
    row?.scrollIntoView({ block: 'nearest' });
  }

  #paintOpen() {
    for (const row of this.shadowRoot.querySelectorAll('.row')) {
      const index = Number(row.dataset.index);
      const open = index === this.#open;
      row.toggleAttribute('data-open', open);
      row.querySelector('.row-head').ariaExpanded = String(open);
      row.querySelector('.answer').hidden = !open;
      const useful = this.#useful.has(index);
      const button = row.querySelector('.useful');
      button.ariaPressed = String(useful);
      button.querySelector('span').textContent = useful ? 'Marked useful' : 'Mark useful';
      row.querySelector('.useful-count').textContent = `${(this.items[index].useful ?? 0) + (useful ? 1 : 0)} found this useful`;
    }
  }

  // Opens an answer in place, or closes it.
  #toggle(index) {
    this.#active = index;
    this.#open = this.#open === index ? -1 : index;
    this.#paintOpen();
    this.#paintActive();
    if (this.#open >= 0) this.emit('open', { item: this.items[index] });
  }

  #markUseful(index) {
    const useful = !this.#useful.has(index);
    if (useful) this.#useful.add(index);
    else this.#useful.delete(index);
    this.#paintOpen();
    this.emit('useful', { item: this.items[index], useful });
  }

  #ask() {
    const question = this.query('.query').value.trim();
    if (!question) return;
    this.query('.none-text').textContent = `Sent. The team will answer “${question}” by email.`;
    this.query('.ask').hidden = true;
    this.emit('ask', { question });
  }

  #key(event) {
    const visible = this.#visible;
    const index = visible.findIndex((row) => Number(row.dataset.index) === this.#active);
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (step && visible.length) {
      event.preventDefault();
      this.#active = Number(visible[(index + step + visible.length) % visible.length].dataset.index);
      this.#paintActive();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (visible.length) this.#toggle(this.#active);
      else this.#ask();
    } else if (event.key === 'Escape' && event.target.value) {
      event.preventDefault();
      event.target.value = '';
      this.query('.ask').hidden = false;
      this.#filter();
    }
  }
}
