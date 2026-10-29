import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronLeft, chevronRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import '../copy-button/index.js';
import styles from './tabbed-faq.scss?inline';

const DEMO_TABS = [
  { id: 'setup', label: 'Setup' },
  { id: 'using', label: 'Using' },
  { id: 'license', label: 'License' },
];

const q = (tab, question, answer, extra = {}) => ({ tab, question, answer, ...extra });

const DEMO_ITEMS = [
  q('setup', 'How do I install a component?', 'Components ship in one package, and each registers its element when you import it, so the ones you never import never ship.', {
    steps: [
      { text: 'Add the package', code: 'npm install @lowersoft/lw' },
      { text: 'Load the theme once', code: "import '@lowersoft/lw/themes.css';" },
      { text: 'Import the components you use', code: "import '@lowersoft/lw/components/button.js';" },
    ],
    related: [1, 4],
  }),
  q('setup', 'Can I load it without a bundler?', 'Yes. Import the modules from a CDN in a script of type module, then use the elements in plain HTML.', { related: [0] }),
  q('setup', 'Does it work with server rendering?', 'The elements render on the client. Server-rendered pages keep the tags in the HTML, and each one upgrades as soon as its module loads.', { related: [3] }),
  q('setup', 'Which browsers are supported?', 'Current Chrome, Edge, Firefox and Safari. The components rely on Shadow DOM, constructable style sheets and container queries.', { related: [2] }),
  q('using', 'How do I listen for events?', 'Every component fires events prefixed with lw-. They bubble and cross the shadow boundary, so you can listen on the element or any ancestor.', {
    steps: [{ text: 'Listen for the event', code: "picker.addEventListener('lw-change', (event) => console.log(event.detail));" }],
    related: [5],
  }),
  q('using', 'Can I restyle a component?', 'Override its --lw-* tokens on the element or any ancestor, or style the parts it exposes with ::part().', { related: [4, 6] }),
  q('using', 'How do they work in forms?', 'Inputs are form-associated: they submit their values with the form, validate with the browser’s constraint API and reset with it.', { related: [5] }),
  q('license', 'Is it free for commercial work?', 'Yes. The library is MIT licensed: use it in client work and products, free of charge, with no seat limits.', { related: [8] }),
  q('license', 'Do I need to credit the library?', 'No. Keep the license file with the package; a link back is welcome but never required.', { related: [7] }),
  q('license', 'Can I fork and modify it?', 'Yes. Change anything, ship your fork, keep it private or publish it; the license only asks that its notice stays in the copies.', { related: [7, 8] }),
];

const pad = (n) => String(n).padStart(2, '0');
/**
 * A compact FAQ that reads like a settings screen. The topic tabs move one
 * clipped highlight; opening a question pushes its answer in from the
 * right, with steps, related questions and the previous and next answers.
 * The arrow keys switch tabs, move between questions or step through
 * answers, and Escape goes back to the list.
 *
 * Tabs are `{ id, label }`; items are `{ tab, question, answer, steps?, related? }`,
 * where steps are `{ text, code? }` and `related` lists item indexes.
 *
 * @attr {string} heading
 * @attr {Array<object>} tabs (JSON)
 * @attr {Array<object>} items (JSON)
 * @attr {string} tab - The open tab's id
 * @fires lw-change - Another tab was chosen; `detail: { tab }`
 * @fires lw-open - An answer opened; `detail: { item }`
 */
export class LwTabbedFaq extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Questions' },
    tabs: { type: Object, default: DEMO_TABS },
    items: { type: Object, default: DEMO_ITEMS },
    tab: { default: 'setup' },
  };

  // The open answer's item index, or -1 for the list.
  #open = -1;

  render() {
    return `<header class="head"><h2 class="title"></h2><span class="count"></span></header>
<div class="tabs"><div class="tablist" role="tablist"></div><div class="clip" aria-hidden="true"></div></div>
<div class="viewport"><div class="pane list" role="tabpanel"></div><div class="pane answer" aria-live="polite"></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const tablist = this.query('.tablist');
    tablist.addEventListener('click', (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab) this.#setTab(tab.dataset.id, false);
    }, options);
    tablist.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const index = this.tabs.findIndex((tab) => tab.id === this.tab);
      this.#setTab(this.tabs[(index + step + this.tabs.length) % this.tabs.length].id, true);
    }, options);
    const list = this.query('.list');
    list.addEventListener('click', (event) => {
      const row = event.target.closest('.row');
      if (row) this.#openAnswer(Number(row.dataset.index));
    }, options);
    list.addEventListener('keydown', (event) => {
      const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const rows = [...list.querySelectorAll('.row')];
      rows[(rows.indexOf(event.target.closest('.row')) + step + rows.length) % rows.length]?.focus();
    }, options);
    const answer = this.query('.answer');
    answer.addEventListener('click', (event) => {
      const target = event.target.closest('[data-go]');
      if (!target) return;
      if (target.dataset.go === 'back') this.#back();
      else this.#openAnswer(Number(target.dataset.go));
    }, options);
    answer.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.#back();
        return;
      }
      if (event.target.closest('lw-copy-button')) return;
      const neighbour = { ArrowLeft: this.#neighbours[0], ArrowRight: this.#neighbours[1] }[event.key];
      if (neighbour === undefined) return;
      event.preventDefault();
      if (neighbour >= 0) this.#openAnswer(neighbour);
    }, options);
    const resize = new ResizeObserver(() => {
      this.#placeClip();
      this.#fitHeight();
    });
    resize.observe(this.query('.tabs'));
    resize.observe(this.query('.answer'));
    resize.observe(list);
    this.signal.addEventListener('abort', () => resize.disconnect());
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.count').textContent = `${this.items.length} answers`;
    if (changed.has('tabs') || changed.has('items')) this.#buildTabs();
    if (changed.has('tab') || changed.has('items')) {
      this.#open = -1;
      this.#buildList();
      this.#paintView(false);
    }
    this.#paintTabs();
  }

  // Each tab twice: the quiet labels, and the same labels in ink inside
  // the clip, which slides to the chosen one.
  #buildTabs() {
    const count = (id) => this.items.filter((each) => each.tab === id).length;
    const label = (tab) => `${escapeHtml(tab.label)}<span class="tab-count">${count(tab.id)}</span>`;
    this.query('.tablist').innerHTML = this.tabs.map((tab) => `<button class="tab" type="button" role="tab" id="tab-${escapeHtml(tab.id)}" data-id="${escapeHtml(tab.id)}">${label(tab)}</button>`).join('');
    this.query('.clip').innerHTML = this.tabs.map((tab) => `<span class="tab">${label(tab)}</span>`).join('');
  }

  #paintTabs() {
    for (const tab of this.shadowRoot.querySelectorAll('[role="tab"]')) {
      const on = tab.dataset.id === this.tab;
      tab.ariaSelected = String(on);
      tab.tabIndex = on ? 0 : -1;
    }
    this.query('.list').setAttribute('aria-labelledby', `tab-${this.tab}`);
    this.#placeClip();
  }

  // The clip shows the ink labels only over the chosen tab.
  #placeClip() {
    const tab = this.query(`[role="tab"][aria-selected="true"]`);
    const clip = this.query('.clip');
    if (!tab) return;
    // The tab's box, measured from the clip's own corner.
    const left = tab.offsetLeft - clip.offsetLeft;
    const top = tab.offsetTop - clip.offsetTop;
    clip.style.clipPath = `inset(${top}px ${clip.clientWidth - left - tab.offsetWidth}px ${clip.clientHeight - top - tab.offsetHeight}px ${left}px round 0.625rem)`;
  }

  #setTab(id, focus) {
    if (id !== this.tab) {
      this.tab = id;
      this.emit('change', { tab: id });
    }
    if (focus) this.query(`[role="tab"][data-id="${CSS.escape(id)}"]`)?.focus();
  }

  get #inTab() {
    return this.items.map((each, index) => ({ each, index })).filter(({ each }) => each.tab === this.tab);
  }

  #buildList() {
    this.query('.list').innerHTML = this.#inTab
      .map(({ each, index }, n) => {
        const meta = each.steps?.length ? `<span class="meta">${each.steps.length} steps</span>` : '';
        return `<button class="row" type="button" data-index="${index}"><span class="number">${pad(n + 1)}</span><span class="text"><span class="question">${escapeHtml(each.question)}</span><span class="preview">${escapeHtml(each.answer)}</span></span>${meta}${strokeIcon(chevronRight, 16)}</button>`;
      })
      .join('');
  }

  // The answers before and after the open one, within its tab.
  get #neighbours() {
    const indexes = this.#inTab.map(({ index }) => index);
    const at = indexes.indexOf(this.#open);
    return [indexes[at - 1] ?? -1, indexes[at + 1] ?? -1];
  }

  #openAnswer(index) {
    const each = this.items[index];
    if (!each) return;
    // A related question in another tab switches to that tab first.
    if (each.tab !== this.tab) {
      this.tab = each.tab;
      this.#buildList();
      this.#paintTabs();
      this.emit('change', { tab: each.tab });
    }
    const label = this.tabs.find((tab) => tab.id === each.tab)?.label ?? '';
    this.#open = index;
    const [previous, next] = this.#neighbours;
    const steps = each.steps?.length
      ? `<ol class="steps">${each.steps.map((step) => `<li><span>${escapeHtml(step.text)}</span>${step.code ? `<lw-copy-button class="code" value="${escapeHtml(step.code)}" label="Copy"></lw-copy-button>` : ''}</li>`).join('')}</ol>`
      : '';
    const related = (each.related ?? []).filter((n) => this.items[n]);
    const nav = (target, direction) => (target >= 0 ? `<button class="step-link ${direction}" type="button" data-go="${target}">${direction === 'previous' ? strokeIcon(chevronLeft, 16) : ''}<span class="step-text"><small>${direction === 'previous' ? 'Previous' : 'Next'}</small><span class="step-question">${escapeHtml(this.items[target].question)}</span></span>${direction === 'next' ? strokeIcon(chevronRight, 16) : ''}</button>` : '<span></span>');
    this.query('.answer').innerHTML = `<button class="back" type="button" data-go="back">${strokeIcon(chevronLeft, 16)}${escapeHtml(label)}</button>
<h3 class="answer-title" tabindex="-1">${escapeHtml(each.question)}</h3><p class="answer-text">${escapeHtml(each.answer)}</p>${steps}
${related.length ? `<div class="related"><p class="related-head">Related</p>${related.map((n) => `<button class="related-link" type="button" data-go="${n}">${escapeHtml(this.items[n].question)}${strokeIcon(chevronRight, 14)}</button>`).join('')}</div>` : ''}
<nav class="pager" aria-label="More answers">${nav(previous, 'previous')}${nav(next, 'next')}</nav>`;
    this.#paintView(true);
    this.query('.answer-title').focus({ preventScroll: true });
    this.emit('open', { item: each });
  }

  #back() {
    const index = this.#open;
    this.#open = -1;
    this.#paintView(true);
    this.query(`.row[data-index="${index}"]`)?.focus({ preventScroll: true });
  }

  // The answer slides in from the right over the list, and back out.
  #paintView(animate) {
    const open = this.#open >= 0;
    this.toggleAttribute('data-open', open);
    this.query('.list').inert = open;
    this.query('.answer').inert = !open;
    this.query('.viewport').toggleAttribute('data-instant', !animate || reducedMotion.matches);
    this.#fitHeight();
  }

  // The viewport takes the height of the pane showing.
  #fitHeight() {
    const pane = this.query(this.#open >= 0 ? '.answer' : '.list');
    this.query('.viewport').style.height = `${pane.scrollHeight}px`;
  }
}
