import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { check, chevronRight, messageSquareText } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { initialsOf } from '../../core/people.js';
import '../button/index.js';
import styles from './editor-toolbar.scss?inline';

const PANEL = '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>';
const DOTS = '<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>';
// How long typing rests before the document counts as saved.
const SAVE_DELAY_MS = 900;
const SHOWN_PEOPLE = 3;

const DEMO_PEOPLE = [
  { name: 'Maya Chen', color: '#8e4ec6' },
  { name: 'Jonas Weber', color: '#0090ff' },
  { name: 'Priya Raman', color: '#e5484d' },
  { name: 'Theo Park', color: '#30a46c' },
  { name: 'Ana Ruiz', color: '#f76b15' },
];

const DEMO_DOC = `<h1 id="s-profiler">Profiler v2</h1><p>Profiler v2 samples every thread at 10 kHz with no instrumentation, and opens straight from a crash report at the frame that failed.</p>
<h2 id="s-sampling">Sampling</h2><p>Sampling runs off a timer signal, so the program under test pays under 2% of a core. Stacks are walked with frame pointers where they exist and DWARF where they don't.</p>
<h2 id="s-symbols">Symbols</h2><p>Symbols come from the remote symbol server and are cached on disk; a cold lookup takes a few milliseconds, a warm one none.</p>
<h2 id="s-rollout">Rollout</h2><p>Teams on Pro get it on November 4. The old profiler stays one release behind a flag, then goes.</p>`;

const ago = (ms) => {
  const minutes = Math.round(ms / 60_000);
  return minutes < 1 ? 'just now' : `${minutes} min ago`;
};

/**
 * The bar above a shared document: the outline toggle, where the document
 * lives, whether it is saved, who else is in it, comments and Share. Typing
 * in the document shows it saving, then saved; the outline beside it
 * follows the section in view and jumps to the one picked.
 *
 * People are `{ name, color }`; the document is HTML with `h1`/`h2`
 * headings carrying ids.
 *
 * @attr {Array<string>} path - Where the document lives, last one the document (JSON)
 * @attr {Array<object>} people (JSON)
 * @attr {number} comments
 * @attr {boolean} outline - The outline is showing
 * @attr {string} doc - The document's HTML
 * @fires lw-share - Share was chosen
 * @fires lw-comments - The comments button was chosen
 * @fires lw-save - The document settled after an edit; `detail: { html }`
 */
export class LwEditorToolbar extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    path: { type: Object, default: ['LowerSoft', 'Specs', 'Profiler v2'] },
    people: { type: Object, default: DEMO_PEOPLE },
    comments: { type: Number, default: 3 },
    outline: { type: Boolean, default: true, reflect: true },
    doc: { default: DEMO_DOC },
  };

  #savedAt = Date.now() - 2 * 60_000;
  #saving = false;
  #saveTimer = 0;
  #clock = 0;

  render() {
    return `<header class="bar"><button class="tool toggle" type="button" aria-label="Outline" aria-controls="outline">${strokeIcon(PANEL, 18)}</button><nav class="crumbs" aria-label="Breadcrumb"></nav>
<p class="saved" aria-live="polite"><span class="saved-icon">${strokeIcon(check, 16)}</span><span class="saved-text"></span></p><span class="people"></span><span class="divider"></span>
<button class="tool comments" type="button">${strokeIcon(messageSquareText, 18)}<span class="comment-count"></span></button><lw-button class="share" size="sm">Share</lw-button><button class="tool more" type="button" aria-label="More">${strokeIcon(DOTS, 18)}</button></header>
<div class="body"><nav class="outline" id="outline" aria-label="Outline"><p class="outline-title">Outline</p><ul class="headings"></ul></nav><div class="page"><article class="doc" contenteditable="true" spellcheck="false" aria-label="Document"></article></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.toggle').addEventListener('click', () => (this.outline = !this.outline), options);
    this.query('.share').addEventListener('click', () => this.emit('share'), options);
    this.query('.comments').addEventListener('click', () => this.emit('comments'), options);
    const doc = this.query('.doc');
    doc.addEventListener('input', () => this.#edited(), options);
    this.query('.headings').addEventListener('click', (event) => {
      const link = event.target.closest('.heading');
      if (!link) return;
      event.preventDefault();
      this.query(`#${CSS.escape(link.dataset.id)}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, options);
    // The outline lights the section in view.
    this.query('.page').addEventListener('scroll', () => this.#paintCurrent(), { ...options, passive: true });
    this.#clock = setInterval(() => this.#paintSaved(), 30_000);
    this.signal.addEventListener('abort', () => {
      clearInterval(this.#clock);
      clearTimeout(this.#saveTimer);
    });
  }

  updated(changed) {
    if (changed.has('path')) {
      const path = this.path ?? [];
      this.query('.crumbs').innerHTML = path
        .map((part, i) => `${i ? strokeIcon(chevronRight, 14) : ''}<span class="crumb"${i === path.length - 1 ? ' aria-current="page"' : ''}>${i === 0 ? `<span class="mark" aria-hidden="true">${escapeHtml(part.charAt(0))}</span>` : ''}${escapeHtml(part)}</span>`)
        .join('');
    }
    if (changed.has('people')) {
      const people = this.people ?? [];
      const extra = people.length - SHOWN_PEOPLE;
      this.query('.people').innerHTML = `${people
        .slice(0, SHOWN_PEOPLE)
        .map((person) => `<span class="person" style="--_ring: ${escapeHtml(person.color)}" title="${escapeHtml(person.name)}">${escapeHtml(initialsOf(person.name))}</span>`)
        .join('')}${extra > 0 ? `<span class="person more-people" title="${escapeHtml(people.slice(SHOWN_PEOPLE).map((person) => person.name).join(', '))}">+${extra}</span>` : ''}`;
      this.query('.people').ariaLabel = `In this document: ${people.map((person) => person.name).join(', ')}`;
    }
    this.query('.comment-count').textContent = String(this.comments ?? 0);
    this.query('.comments').ariaLabel = `${this.comments} comments`;
    if (changed.has('doc')) {
      this.query('.doc').innerHTML = this.doc ?? '';
      this.#buildOutline();
    }
    const toggle = this.query('.toggle');
    toggle.ariaExpanded = String(this.outline);
    this.query('.outline').inert = !this.outline;
    this.#paintSaved();
  }

  #buildOutline() {
    this.query('.headings').innerHTML = [...this.query('.doc').querySelectorAll('h1[id], h2[id]')]
      .map((heading) => `<li><a class="heading" href="#${escapeHtml(heading.id)}" data-id="${escapeHtml(heading.id)}" data-level="${heading.tagName.slice(1)}">${escapeHtml(heading.textContent)}</a></li>`)
      .join('');
    this.#paintCurrent();
  }

  #paintCurrent() {
    const page = this.query('.page');
    const top = page.getBoundingClientRect().top;
    const headings = [...this.query('.doc').querySelectorAll('h1[id], h2[id]')];
    const current = headings.filter((heading) => heading.getBoundingClientRect().top - top < 40).at(-1) ?? headings[0];
    for (const link of this.shadowRoot.querySelectorAll('.heading')) link.toggleAttribute('data-current', link.dataset.id === current?.id);
  }

  #edited() {
    this.#saving = true;
    this.#paintSaved();
    clearTimeout(this.#saveTimer);
    this.#saveTimer = setTimeout(() => {
      this.#saving = false;
      this.#savedAt = Date.now();
      this.#buildOutline();
      this.#paintSaved();
      this.emit('save', { html: this.query('.doc').innerHTML });
    }, SAVE_DELAY_MS);
  }

  #paintSaved() {
    const saved = this.query('.saved');
    saved.toggleAttribute('data-saving', this.#saving);
    this.query('.saved-text').textContent = this.#saving ? 'Saving…' : `Saved ${ago(Date.now() - this.#savedAt)}`;
  }
}
