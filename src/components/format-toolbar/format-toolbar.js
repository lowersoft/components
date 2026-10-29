import { iconStyles, strokeIcon } from '../../core/icons.js';
import { link2 } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { menuStyles } from '../../core/menu.js';
import { createPicker, pickerMarkup } from '../../core/picker.js';
import { swapStyles } from '../../core/swap.js';
import styles from './format-toolbar.scss?inline';

const ICONS = {
  bold: '<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',
  italic: '<path d="M19 4h-9M14 20H5M15 4 9 20"/>',
  underline: '<path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16"/>',
  strikeThrough: '<path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6M4 12h16"/>',
  highlight: '<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>',
  insertUnorderedList: '<path d="M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13"/>',
};

const MARKS = [
  { command: 'bold', label: 'Bold', key: 'B' },
  { command: 'italic', label: 'Italic', key: 'I' },
  { command: 'underline', label: 'Underline', key: 'U' },
  { command: 'strikeThrough', label: 'Strikethrough' },
  { command: 'highlight', label: 'Highlight' },
];

const BLOCKS = [
  { value: 'p', label: 'Text' },
  { value: 'h2', label: 'Heading' },
  { value: 'h3', label: 'Subheading' },
  { value: 'blockquote', label: 'Quote' },
];

const HIGHLIGHT = 'rgb(48 164 108 / 0.3)';
const GAP = 10;

const DEMO_DOC = `<h2>Launch notes</h2><p>Profiler v2 ships on <b>November 4</b>. Sampling moves to <span style="background-color: rgba(128, 128, 128, 0.3)">a timer signal</span> with no instrumentation, and <span style="background-color: ${HIGHLIGHT}">every crash report links to its trace</span>.</p><p>The old profiler stays one release behind a flag, so nobody has to switch on launch day.</p>`;

/**
 * A formatting toolbar that floats over the text you select: the block
 * type, bold, italic, underline, strikethrough, highlight, a link and a
 * list. Each button shows whether the selection already has it. Alt+F10
 * moves into the toolbar and the arrow keys along it; Escape goes back to
 * the text.
 *
 * @attr {string} doc - The editable HTML
 * @fires lw-change - The text or its formatting changed; `detail: { html }`
 */
export class LwFormatToolbar extends LwElement {
  static styles = [iconStyles, menuStyles, swapStyles, styles];
  static props = {
    doc: { default: DEMO_DOC },
  };

  #blockPicker;
  #range = null;

  render() {
    return `<div class="toolbar" role="toolbar" aria-label="Format" hidden><div class="tools"><span class="block">${pickerMarkup('block-menu')}</span><span class="sep"></span>
${MARKS.map((mark) => `<button class="tool" type="button" data-command="${mark.command}" aria-pressed="false" aria-label="${mark.label}" tabindex="-1"${mark.key ? ` title="${mark.label} (Ctrl+${mark.key})"` : ''}>${strokeIcon(ICONS[mark.command], 18)}</button>`).join('')}<span class="sep"></span>
<button class="tool link" type="button" tabindex="-1">${strokeIcon(link2, 18)}<span>Link</span></button><button class="tool" type="button" data-command="insertUnorderedList" aria-pressed="false" aria-label="List" tabindex="-1">${strokeIcon(ICONS.insertUnorderedList, 18)}</button></div>
<form class="link-form" hidden><input class="url" type="url" placeholder="Paste a link and press Enter" aria-label="Link address"></form></div>
<article class="doc" contenteditable="true" aria-label="Notes"></article>`;
  }

  connected() {
    const options = { signal: this.signal };
    document.execCommand('styleWithCSS', false, true);
    this.#blockPicker = createPicker(this.query('.block'), this.signal, (block) => this.#run('formatBlock', `<${block}>`));
    this.query('.block .picker-trigger').tabIndex = 0;
    const doc = this.query('.doc');
    document.addEventListener('selectionchange', () => this.#place(), options);
    doc.addEventListener('input', () => this.emit('change', { html: doc.innerHTML }), options);
    doc.addEventListener('keydown', (event) => {
      if (event.altKey && event.key === 'F10') {
        event.preventDefault();
        this.query('.toolbar:not([hidden]) .picker-trigger')?.focus();
      }
    }, options);
    const toolbar = this.query('.toolbar');
    // The toolbar never takes the selection away from the text.
    toolbar.addEventListener('pointerdown', (event) => event.target.closest('.url') || event.preventDefault(), options);
    toolbar.addEventListener('click', (event) => {
      const tool = event.target.closest('.tool');
      if (!tool) return;
      if (tool.classList.contains('link')) return this.#openLink();
      if (tool.dataset.command === 'highlight') return this.#highlight();
      this.#run(tool.dataset.command);
    }, options);
    toolbar.addEventListener('keydown', (event) => this.#toolbarKey(event), options);
    this.query('.link-form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#applyLink();
    }, options);
  }

  updated(changed) {
    if (changed.has('doc')) this.query('.doc').innerHTML = this.doc ?? '';
  }

  get #selection() {
    return this.shadowRoot.getSelection?.() ?? document.getSelection();
  }

  // Over the selection when there is one in the text; hidden otherwise.
  #place() {
    const toolbar = this.query('.toolbar');
    if (this.shadowRoot.activeElement?.closest?.('.toolbar')) return;
    const selection = this.#selection;
    const doc = this.query('.doc');
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    if (!range || range.collapsed || !doc.contains(range.commonAncestorContainer)) {
      toolbar.hidden = true;
      this.query('.link-form').hidden = true;
      return;
    }
    this.#range = range.cloneRange();
    toolbar.hidden = false;
    const box = range.getBoundingClientRect();
    const host = this.getBoundingClientRect();
    const width = toolbar.offsetWidth;
    const left = Math.min(Math.max(0, box.left + box.width / 2 - host.left - width / 2), host.width - width);
    const above = box.top - host.top - toolbar.offsetHeight - GAP;
    toolbar.style.left = `${left}px`;
    toolbar.style.top = `${above < 0 ? box.bottom - host.top + GAP : above}px`;
    this.#paintState();
  }

  #paintState() {
    for (const tool of this.shadowRoot.querySelectorAll('.tool[data-command]')) {
      const command = tool.dataset.command;
      const on = command === 'highlight' ? this.#isHighlighted() : document.queryCommandState(command);
      tool.ariaPressed = String(on);
    }
    const block = (document.queryCommandValue('formatBlock') || 'p').toLowerCase();
    this.#blockPicker?.set(BLOCKS, BLOCKS.some((each) => each.value === block) ? block : 'p');
  }

  #isHighlighted() {
    const node = this.#selection?.anchorNode;
    const element = node?.nodeType === 1 ? node : node?.parentElement;
    return element?.closest('[style*="background-color"]')?.style.backgroundColor.startsWith('rgba(48, 164, 108') ?? false;
  }

  #restore() {
    const selection = this.#selection;
    if (!this.#range || !selection) return;
    selection.removeAllRanges();
    selection.addRange(this.#range);
  }

  #run(command, value) {
    this.#restore();
    document.execCommand(command, false, value);
    this.#paintState();
    this.emit('change', { html: this.query('.doc').innerHTML });
  }

  #highlight() {
    this.#run('hiliteColor', this.#isHighlighted() ? 'transparent' : HIGHLIGHT);
  }

  #openLink() {
    this.query('.tools').hidden = true;
    const form = this.query('.link-form');
    form.hidden = false;
    form.querySelector('.url').focus();
  }

  #applyLink() {
    const url = this.query('.url').value.trim();
    this.#closeLink();
    if (url) this.#run('createLink', /^[a-z]+:/i.test(url) ? url : `https://${url}`);
  }

  #closeLink() {
    this.query('.url').value = '';
    this.query('.link-form').hidden = true;
    this.query('.tools').hidden = false;
  }

  // The arrow keys walk the toolbar; Escape goes back to the text.
  #toolbarKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#closeLink();
      this.query('.doc').focus();
      this.#restore();
      return;
    }
    if (event.target.closest('.url')) return;
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const tools = [this.query('.block .picker-trigger'), ...this.shadowRoot.querySelectorAll('.tools .tool')];
    const index = tools.indexOf(this.shadowRoot.activeElement);
    tools[(index + step + tools.length) % tools.length].focus();
  }
}
