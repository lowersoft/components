import { escapeHtml } from '../../core/dom.js';
import { avatarMarkup, memberOf } from '../../core/forum.js';
import { hintStyles, wireHints } from '../../core/hint.js';
import { strokeIcon } from '../../core/icons.js';
import { atSign, bold, code, file, heading, italic, link, listChecks, listOrdered, list, paperclip, squareCode, strikethrough, textQuote, x } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { renderMarkdown } from '../../core/markdown.js';
import { closeMentionList, findPeople, mentionListMarkup, mentionListStyles, openMentionList, setMentionActive } from '../../core/mention-list.js';
import { matchesShortcut, parseShortcut } from '../../core/shortcut.js';
import { caretRectIn } from '../../core/text.js';
import '../button/index.js';
import styles from './post-composer.scss?inline';

// The tools along the top, in groups, each with its shortcut.
const TOOLS = [
  [
    { id: 'bold', label: 'Bold', icon: bold, shortcut: 'mod+b' },
    { id: 'italic', label: 'Italic', icon: italic, shortcut: 'mod+i' },
    { id: 'strike', label: 'Strikethrough', icon: strikethrough, shortcut: 'mod+shift+x' },
    { id: 'heading', label: 'Heading', icon: heading },
  ],
  [
    { id: 'link', label: 'Link', icon: link, shortcut: 'mod+k' },
    { id: 'quote', label: 'Quote', icon: textQuote, shortcut: 'mod+shift+9' },
    { id: 'code', label: 'Code', icon: code, shortcut: 'mod+e' },
    { id: 'codeblock', label: 'Code block', icon: squareCode, shortcut: 'mod+shift+e' },
  ],
  [
    { id: 'bullets', label: 'Bulleted list', icon: list, shortcut: 'mod+shift+8' },
    { id: 'numbers', label: 'Numbered list', icon: listOrdered, shortcut: 'mod+shift+7' },
    { id: 'tasks', label: 'Task list', icon: listChecks },
  ],
  [
    { id: 'mention', label: 'Mention a member', icon: atSign },
    { id: 'attach', label: 'Attach files', icon: paperclip },
  ],
].map((group) => group.map((tool) => ({ ...tool, keys: tool.shortcut ? parseShortcut(tool.shortcut) : null })));

const ALL_TOOLS = TOOLS.flat();
const SUBMIT = parseShortcut('mod+enter');

// How many members a mention offers at most.
const SUGGESTIONS = 6;

// A list item's start: its indent, its marker and any task box.
const ITEM = /^(\s*)([-*+]|\d{1,9}[.)])\s+(\[[ xX]\]\s+)?/;

const bytes = (size) => {
  if (size < 1024) return `${size} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = size / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 ? Math.round(value) : Math.round(value * 10) / 10} ${units[unit]}`;
};

// Whether a file is one `accept` lets in: by extension, by type, or by a
// family of types such as image/*.
const accepts = (accept, file) => {
  const rules = String(accept ?? '').split(',').map((rule) => rule.trim().toLowerCase()).filter(Boolean);
  if (!rules.length) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || '').toLowerCase();
  return rules.some((rule) => (rule.startsWith('.') ? name.endsWith(rule) : rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule));
};

let ids = 0;

/**
 * A field to write a post in markdown, as forums take one. The tools along
 * its top bold, italicise, strike, head, link, quote, set code and blocks
 * of code, make bulleted, numbered and task lists, mention a member and
 * attach files, each from its shortcut too, and toggle off what they set.
 * Enter carries a list or a quote on to the next line, and on an empty item
 * ends it. Typing @ offers the members whose name or handle starts with what
 * follows, chosen with the arrow keys and Enter or Tab. Preview shows the
 * post as it will read.
 *
 * Files come from the paperclip, a drop anywhere on the field or a paste,
 * each checked against `accept`, `max-size` and `max-files`, and show under
 * the text with a picture of each image, its size and a button to take it
 * off. With `draft-key` what is written is kept in this browser until it is
 * posted. The count shows as the text nears `max-length`.
 *
 * Post, or ⌘ or Ctrl and Enter, fires `lw-submit` with the markdown and the
 * files, `{ file, name, size, type, url }`, `url` an object URL for an image
 * the page may show and should revoke once done with it; unless it is
 * cancelled the field empties. `focus()`, `insert(text)`, `mention(member)`
 * and `quote(name, text)` let the page write into it.
 *
 * @attr {string} value - The markdown written
 * @attr {string} placeholder
 * @attr {string} label - Accessible name of the field
 * @attr {string} submit-label - The label of the button that posts
 * @attr {object} user - The member writing, whose avatar stands beside the field (JSON)
 * @attr {Array<object>} members - Who can be mentioned, as `<lw-user-hover-card>` takes them (JSON)
 * @attr {number} max-length - The longest post, in characters
 * @attr {number} max-files - How many files a post takes
 * @attr {number} max-size - The largest file, in bytes
 * @attr {string} accept - The files it takes, as a file input's `accept`
 * @attr {string} draft-key - Keeps the draft in this browser under this name
 * @attr {boolean} disabled
 * @fires lw-submit - Post was pressed; `detail: { text, attachments }`. Cancel it to keep what was written.
 * @csspart box - The field's frame, around the tools, the text and the files
 * @csspart field - The native textarea
 */
export class LwPostComposer extends LwElement {
  static styles = [hintStyles, mentionListStyles, styles];
  static props = {
    value: { default: '' },
    placeholder: { default: 'Write your reply…' },
    label: { default: 'Write your reply' },
    submitLabel: { default: 'Post reply' },
    user: { type: Object },
    members: { type: Object, default: [] },
    maxLength: { type: Number, default: 10000 },
    maxFiles: { type: Number, default: 6 },
    maxSize: { type: Number, default: 10 * 1024 * 1024 },
    accept: { default: 'image/*,.pdf,.txt,.log,.json,.zip' },
    draftKey: { default: '' },
    disabled: { type: Boolean, reflect: true },
  };

  #files = [];
  #mode = 'write';
  #suggestions = [];
  #active = 0;
  // The @ being typed: where it starts, and what follows it.
  #mention = null;
  // The mention list was closed with Escape for this @.
  #dismissed = -1;
  #saving = 0;
  #problemTimer = 0;
  #drags = 0;

  render() {
    const tool = (item) =>
      `<button class="tool term" type="button" data-tool="${item.id}" data-hint-align="center" tabindex="-1" aria-label="${item.label}"${item.keys ? ` aria-keyshortcuts="${item.keys.aria}"` : ''}>${strokeIcon(item.icon, 16)}</button><span class="tooltip" popover="manual" aria-hidden="true">${item.label}${item.keys ? `<span class="tip-keys">${item.keys.labels.map((label) => `<kbd>${escapeHtml(label)}</kbd>`).join('')}</span>` : ''}</span>`;
    return `<form class="composer" novalidate><span class="author"></span><div class="box" part="box">
<div class="bar"><div class="modes" role="tablist" aria-label="Write or preview"><button class="mode" type="button" role="tab" id="tab-write" aria-controls="write" aria-selected="true" data-mode="write">Write</button><button class="mode" type="button" role="tab" id="tab-preview" aria-controls="preview" aria-selected="false" tabindex="-1" data-mode="preview">Preview</button></div>
<div class="tools" role="toolbar" aria-label="Formatting" aria-controls="field">${TOOLS.map((group) => `<span class="group">${group.map(tool).join('')}</span>`).join('<span class="divider" aria-hidden="true"></span>')}</div></div>
<div class="write" id="write" role="tabpanel" aria-labelledby="tab-write"><textarea class="field" id="field" part="field" rows="4" spellcheck="true" autocomplete="off" aria-autocomplete="list" aria-controls="listbox" aria-describedby="hint"></textarea></div>${mentionListMarkup('listbox', 'Members to mention')}
<div class="preview" id="preview" role="tabpanel" aria-labelledby="tab-preview" tabindex="0" hidden></div>
<ul class="files" role="list" aria-label="Attachments" hidden></ul>
<p class="problem" role="alert"></p>
<div class="foot"><p class="hint" id="hint"><span class="md" aria-hidden="true">M↓</span>Markdown, and files by drop, paste or the paperclip</p><span class="count" aria-live="polite"></span><lw-button class="send" type="submit" shortcut="mod+enter" passive disabled></lw-button></div>
<div class="drop" aria-hidden="true"><span class="drop-icon">${strokeIcon(paperclip, 18)}</span>Drop to attach</div>
<input class="picker" type="file" multiple hidden tabindex="-1"></div></form>`;
  }

  connected() {
    const options = { signal: this.signal };
    const field = this.#field;
    const box = this.query('.box');

    field.addEventListener('input', () => this.#changed(), options);
    field.addEventListener('keydown', (event) => this.#key(event), options);
    field.addEventListener('click', () => this.#findMention(), options);
    field.addEventListener('blur', () => this.#closeMentions(), options);
    field.addEventListener('paste', (event) => {
      const pasted = [...(event.clipboardData?.files ?? [])];
      if (!pasted.length) return;
      event.preventDefault();
      this.#addFiles(pasted);
    }, options);

    this.query('.tools').addEventListener('click', (event) => {
      const button = event.target.closest('.tool');
      if (button) this.#run(button.dataset.tool);
    }, options);
    this.query('.tools').addEventListener('keydown', (event) => this.#moveIn(event, '.tool'), options);
    this.query('.modes').addEventListener('click', (event) => {
      const button = event.target.closest('.mode');
      if (button) this.#setMode(button.dataset.mode);
    }, options);
    this.query('.modes').addEventListener('keydown', (event) => {
      if (this.#moveIn(event, '.mode')) this.#setMode(this.shadowRoot.activeElement.dataset.mode);
    }, options);

    wireHints(this, this.query('.tools'));

    // The mention input's list of people, at the caret; a press on one keeps
    // the focus in the field.
    const mentions = this.query('.listbox');
    mentions.addEventListener('pointerdown', (event) => event.preventDefault(), options);
    mentions.addEventListener('click', (event) => {
      const option = event.target.closest('[role="option"]');
      if (option) this.#pickMention(Number(option.dataset.index));
    }, options);
    mentions.addEventListener('pointermove', (event) => {
      const option = event.target.closest('[role="option"]');
      if (option) this.#setActive(Number(option.dataset.index), false);
    }, options);

    const picker = this.query('.picker');
    picker.addEventListener('change', () => {
      this.#addFiles([...picker.files]);
      picker.value = '';
    }, options);
    this.query('.files').addEventListener('click', (event) => {
      const remove = event.target.closest('.remove');
      if (remove) this.#removeFile(remove.dataset.id);
    }, options);

    // Files dragged over the field: it says it takes them, and takes them.
    const carriesFiles = (event) => [...(event.dataTransfer?.types ?? [])].includes('Files');
    box.addEventListener('dragenter', (event) => {
      if (!carriesFiles(event) || this.disabled) return;
      event.preventDefault();
      this.#drags += 1;
      box.toggleAttribute('data-dragging', true);
    }, options);
    box.addEventListener('dragover', (event) => {
      if (!carriesFiles(event) || this.disabled) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }, options);
    box.addEventListener('dragleave', () => {
      this.#drags = Math.max(0, this.#drags - 1);
      if (!this.#drags) box.removeAttribute('data-dragging');
    }, options);
    box.addEventListener('drop', (event) => {
      if (!carriesFiles(event) || this.disabled) return;
      event.preventDefault();
      this.#drags = 0;
      box.removeAttribute('data-dragging');
      this.#addFiles([...event.dataTransfer.files]);
    }, options);

    this.query('.composer').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#submit();
    }, options);

    // The draft written before, unless the page gave a text of its own.
    if (this.draftKey && !this.value) {
      const draft = this.#readDraft();
      if (draft) {
        field.value = draft;
        this.#changed(false);
      }
    }

    // A field drawn while hidden takes its height once it shows.
    const resize = new ResizeObserver(() => this.#fit());
    resize.observe(field);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      clearTimeout(this.#saving);
      clearTimeout(this.#problemTimer);
    });
  }

  updated(changed) {
    const field = this.#field;
    if (changed.has('value') && field.value !== (this.value ?? '')) {
      field.value = this.value ?? '';
      this.#changed(false);
    }
    if (changed.has('placeholder')) field.placeholder = this.placeholder ?? '';
    if (changed.has('label')) field.ariaLabel = this.label ?? '';
    if (changed.has('submitLabel')) this.query('.send').textContent = this.submitLabel ?? '';
    if (changed.has('user')) {
      const user = memberOf(this.user);
      this.query('.author').innerHTML = user ? avatarMarkup(user) : '';
    }
    if (changed.has('accept')) this.query('.picker').accept = this.accept ?? '';
    if (changed.has('disabled')) {
      field.disabled = Boolean(this.disabled);
      for (const button of this.shadowRoot.querySelectorAll('.tool, .mode')) button.disabled = Boolean(this.disabled);
    }
    if (['maxLength', 'disabled'].some((name) => changed.has(name))) this.#paintState();
    // One tab stop for the tools: the first, until another was used.
    if (!this.query('.tool[tabindex="0"]')) this.query('.tool').tabIndex = 0;
  }

  /** Puts the focus in the field, at the end of what is written. */
  focus(options) {
    const field = this.#field;
    if (this.#mode !== 'write') this.#setMode('write');
    field.focus(options);
    if (document.activeElement === this || this.shadowRoot.activeElement === field) {
      const end = field.value.length;
      if (field.selectionStart === field.selectionEnd && field.selectionStart === 0 && end) field.setSelectionRange(end, end);
    }
  }

  /** Writes `text` where the caret is. */
  insert(text) {
    const field = this.#field;
    if (this.#mode !== 'write') this.#setMode('write');
    field.focus();
    const { selectionStart: start, selectionEnd: end } = field;
    this.#edit(start, end, text, start + text.length, start + text.length);
  }

  /** Mentions a member at the start of the post, unless it already does. */
  mention(member) {
    const handle = memberOf(member)?.handle ?? memberOf(member)?.name;
    const field = this.#field;
    if (this.#mode !== 'write') this.#setMode('write');
    field.focus();
    if (!handle) return;
    const tag = `@${handle}`;
    if (!new RegExp(`(^|\\s)${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(field.value)) this.#edit(0, 0, `${tag} `, tag.length + 1, tag.length + 1);
    else field.setSelectionRange(field.value.length, field.value.length);
  }

  /** Quotes what `name` wrote, on lines of its own, and goes on under it. */
  quote(name, text) {
    const field = this.#field;
    if (this.#mode !== 'write') this.#setMode('write');
    field.focus();
    const lines = String(text ?? '').trim().split('\n').map((line) => `> ${line}`);
    const block = `${name ? `> **${name}** wrote:\n>\n` : ''}${lines.join('\n')}\n\n`;
    const at = field.value.length;
    const before = at && !field.value.endsWith('\n\n') ? (field.value.endsWith('\n') ? '\n' : '\n\n') : '';
    this.#edit(at, at, `${before}${block}`, at + before.length + block.length, at + before.length + block.length);
  }

  get #field() {
    return this.query('.field');
  }

  // After the text changes: its height, the counts, the mentions, the draft.
  #changed(save = true) {
    const field = this.#field;
    this.value = field.value;
    this.#fit();
    this.#paintState();
    this.#findMention();
    if (save && this.draftKey) {
      clearTimeout(this.#saving);
      this.#saving = setTimeout(() => this.#writeDraft(field.value), 400);
    }
  }

  // As tall as the text, from four lines up to the stylesheet's limit.
  #fit() {
    const field = this.#field;
    if (!field.offsetParent) return;
    field.style.height = 'auto';
    field.style.height = `${field.scrollHeight + (field.offsetHeight - field.clientHeight)}px`;
  }

  #paintState() {
    const length = this.#field.value.length;
    const max = Math.max(0, Math.round(this.maxLength) || 0);
    const over = max > 0 && length > max;
    const count = this.query('.count');
    count.textContent = max && length > max * 0.8 ? `${(max - length).toLocaleString('en-US')} left` : '';
    count.toggleAttribute('data-over', over);
    this.query('.box').toggleAttribute('data-over', over);
    const empty = !this.#field.value.trim() && !this.#files.length;
    this.query('.send').disabled = Boolean(this.disabled) || empty || over;
  }

  // Replaces a stretch of the text the way typing would, so Undo takes it
  // back, then selects what it should.
  #edit(start, end, text, selectStart, selectEnd) {
    const field = this.#field;
    field.focus();
    field.setSelectionRange(start, end);
    let typed;
    try {
      typed = document.execCommand('insertText', false, text);
    } catch {
      typed = false;
    }
    if (!typed || field.value.slice(start, start + text.length) !== text) {
      field.setRangeText(text, start, end, 'end');
      this.#changed();
    }
    field.setSelectionRange(selectStart, selectEnd);
    this.#findMention();
  }

  #run(id) {
    if (this.disabled) return;
    if (id === 'attach') {
      this.query('.picker').click();
      return;
    }
    if (this.#mode !== 'write') this.#setMode('write');
    const field = this.#field;
    const { selectionStart: start, selectionEnd: end, value } = field;
    const selected = value.slice(start, end);
    switch (id) {
      case 'bold':
        return this.#wrap('**', 'bold text');
      case 'italic':
        return this.#wrap('_', 'italic text');
      case 'strike':
        return this.#wrap('~~', 'struck text');
      case 'code':
        return selected.includes('\n') ? this.#fence() : this.#wrap('`', 'code');
      case 'codeblock':
        return this.#fence();
      case 'heading':
        return this.#lines(/^#{1,3}\s+/, () => '### ');
      case 'quote':
        return this.#lines(/^>\s?/, () => '> ');
      case 'bullets':
        return this.#lines(/^\s*[-*+]\s+(?!\[[ xX]\])/, () => '- ');
      case 'numbers':
        return this.#lines(/^\s*\d{1,9}[.)]\s+/, (index) => `${index + 1}. `);
      case 'tasks':
        return this.#lines(/^\s*[-*+]\s+\[[ xX]\]\s+/, () => '- [ ] ');
      case 'link': {
        const url = /^https?:\/\/\S+$/.test(selected);
        const label = url ? 'link text' : selected || 'link text';
        const target = url ? selected : 'https://';
        const text = `[${label}](${target})`;
        // A link's text stays chosen when it came from an address, else the address does.
        return url ? this.#edit(start, end, text, start + 1, start + 1 + label.length) : this.#edit(start, end, text, start + label.length + 3, start + label.length + 3 + target.length);
      }
      case 'mention': {
        const before = start > 0 && !/\s/.test(value[start - 1]) ? ' ' : '';
        return this.#edit(start, end, `${before}@`, start + before.length + 1, start + before.length + 1);
      }
      default:
    }
  }

  // Wraps the selection in a mark, or takes the mark off when it has it.
  #wrap(mark, placeholder) {
    const field = this.#field;
    const { selectionStart: start, selectionEnd: end, value } = field;
    const selected = value.slice(start, end);
    const size = mark.length;
    if (value.slice(start - size, start) === mark && value.slice(end, end + size) === mark) {
      this.#edit(start - size, end + size, selected, start - size, end - size);
      return;
    }
    if (selected.length > size * 2 && selected.startsWith(mark) && selected.endsWith(mark)) {
      const inner = selected.slice(size, -size);
      this.#edit(start, end, inner, start, start + inner.length);
      return;
    }
    const inner = selected || placeholder;
    this.#edit(start, end, `${mark}${inner}${mark}`, start + size, start + size + inner.length);
  }

  // A block of code round the lines chosen, or an empty one.
  #fence() {
    const field = this.#field;
    const { selectionStart: start, selectionEnd: end, value } = field;
    const selected = value.slice(start, end);
    const before = start && value[start - 1] !== '\n' ? '\n' : '';
    const after = end < value.length && value[end] !== '\n' ? '\n' : '';
    const text = `${before}\`\`\`\n${selected}\n\`\`\`${after}`;
    const caret = start + before.length + 4;
    this.#edit(start, end, text, caret, caret + selected.length);
  }

  // Starts each line chosen with a mark, or takes it off when they all have it.
  #lines(pattern, markFor) {
    const field = this.#field;
    const { selectionStart: start, selectionEnd: end, value } = field;
    const from = value.lastIndexOf('\n', start - 1) + 1;
    let to = value.indexOf('\n', end > start && value[end - 1] === '\n' ? end - 1 : end);
    if (to < 0) to = value.length;
    const lines = value.slice(from, to).split('\n');
    const all = lines.every((line) => pattern.test(line));
    const next = lines.map((line, index) => (all ? line.replace(pattern, '') : `${markFor(index)}${line.replace(/^(\s*)(?:[-*+]\s+(?:\[[ xX]\]\s+)?|\d{1,9}[.)]\s+|>\s?|#{1,3}\s+)/, '$1')}`)).join('\n');
    if (lines.length === 1) {
      const caret = from + next.length;
      this.#edit(from, to, next, caret, caret);
    } else {
      this.#edit(from, to, next, from, from + next.length);
    }
  }

  #key(event) {
    const field = this.#field;

    // The members a mention offers.
    if (this.#mention) {
      const moves = { ArrowDown: 1, ArrowUp: -1 };
      if (this.#suggestions.length && event.key in moves) {
        event.preventDefault();
        this.#setActive(this.#active + moves[event.key]);
        return;
      }
      if (this.#suggestions.length && ((event.key === 'Enter' && !event.shiftKey && !event.metaKey && !event.ctrlKey) || event.key === 'Tab')) {
        event.preventDefault();
        this.#pickMention(this.#active);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        this.#dismissed = this.#mention.start;
        this.#closeMentions();
        return;
      }
    }

    if (matchesShortcut(event, SUBMIT)) {
      event.preventDefault();
      this.query('.composer').requestSubmit();
      return;
    }
    const tool = ALL_TOOLS.find((item) => item.keys && matchesShortcut(event, item.keys));
    if (tool) {
      event.preventDefault();
      this.#run(tool.id);
      return;
    }

    // Enter carries a list or a quote on, and on an empty item ends it.
    if (event.key === 'Enter' && !event.shiftKey && !event.altKey && !event.metaKey && !event.ctrlKey && !event.isComposing) {
      const { selectionStart: start, selectionEnd: end, value } = field;
      if (start !== end) return;
      const from = value.lastIndexOf('\n', start - 1) + 1;
      const line = value.slice(from, start);
      const item = line.match(ITEM);
      const quote = line.match(/^(\s*>\s?)/);
      const lead = item?.[0] ?? quote?.[0];
      if (!lead) return;
      event.preventDefault();
      if (!line.slice(lead.length).trim()) {
        this.#edit(from, start, '', from, from);
        return;
      }
      let next = lead;
      if (item) {
        const marker = /\d/.test(item[2]) ? `${Number.parseInt(item[2], 10) + 1}${item[2].slice(-1)}` : item[2];
        next = `${item[1]}${marker} ${item[3] ? '[ ] ' : ''}`;
      }
      this.#edit(start, end, `\n${next}`, start + next.length + 1, start + next.length + 1);
    }
  }

  // Arrow keys along a row of buttons, one of them in the tab order.
  #moveIn(event, selector) {
    const buttons = [...this.shadowRoot.querySelectorAll(selector)].filter((button) => !button.disabled);
    const at = buttons.indexOf(event.target.closest(selector));
    const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: buttons.length - 1 }[event.key];
    if (at < 0 || to === undefined) return false;
    event.preventDefault();
    const next = buttons[(to + buttons.length) % buttons.length];
    for (const button of buttons) button.tabIndex = button === next ? 0 : -1;
    next.focus();
    return true;
  }

  #setMode(mode) {
    if (mode === this.#mode) return;
    this.#mode = mode;
    const write = this.query('.write');
    const preview = this.query('.preview');
    for (const button of this.shadowRoot.querySelectorAll('.mode')) {
      const selected = button.dataset.mode === mode;
      button.ariaSelected = String(selected);
      button.tabIndex = selected ? 0 : -1;
    }
    if (mode === 'preview') {
      preview.style.minHeight = `${write.offsetHeight}px`;
      const members = (Array.isArray(this.members) ? this.members : []).map(memberOf).filter((member) => member?.handle && member.href);
      const html = renderMarkdown(this.#field.value, { mentions: new Map(members.map((member) => [member.handle.toLowerCase(), member.href])) });
      preview.innerHTML = html || '<p class="nothing">Nothing to preview yet.</p>';
      this.#closeMentions();
    }
    write.hidden = mode !== 'write';
    preview.hidden = mode !== 'preview';
    this.query('.tools').toggleAttribute('data-idle', mode !== 'write');
    if (mode === 'write') this.#fit();
  }

  // The @ the caret stands after, and the members it could be, in the
  // mention input's list under it.
  #findMention() {
    const field = this.#field;
    const caret = field.selectionStart;
    const match = field.selectionStart === field.selectionEnd && field.value.slice(0, caret).match(/(?:^|\s)@([\p{L}\p{N}._-]{0,30})$/u);
    const members = (Array.isArray(this.members) ? this.members : []).map(memberOf).filter(Boolean);
    if (!match || !members.length || this.shadowRoot.activeElement !== field) {
      this.#closeMentions();
      return;
    }
    const start = caret - match[1].length - 1;
    if (start === this.#dismissed) return;
    this.#dismissed = -1;
    this.#mention = { start, end: caret };
    this.#suggestions = findPeople(members, match[1], SUGGESTIONS);
    openMentionList(this.query('.listbox'), this.#suggestions, match[1], caretRectIn(field, start), this.query('.box'), 'mention');
    if (this.#suggestions.length) this.#setActive(0, false);
    else field.removeAttribute('aria-activedescendant');
  }

  #setActive(index, scroll = true) {
    const active = setMentionActive(this.query('.listbox'), index, scroll);
    if (!active) return;
    this.#active = active.index;
    this.#field.setAttribute('aria-activedescendant', active.option.id);
  }

  #closeMentions() {
    this.#suggestions = [];
    this.#mention = null;
    const list = this.query('.listbox');
    if (!list.hidden) closeMentionList(list);
    this.#field.removeAttribute('aria-activedescendant');
  }

  #pickMention(index) {
    const member = this.#suggestions[index];
    const mention = this.#mention;
    if (!member || !mention) return;
    const tag = `@${member.handle ?? member.name} `;
    this.#closeMentions();
    this.#edit(mention.start, mention.end, tag, mention.start + tag.length, mention.start + tag.length);
    this.#closeMentions();
  }

  #addFiles(list) {
    if (this.disabled) return;
    const problems = [];
    const maxFiles = Math.max(1, Math.round(this.maxFiles) || 1);
    const maxSize = Math.max(0, this.maxSize || 0);
    for (const item of list) {
      if (this.#files.length >= maxFiles) {
        problems.push(`A post takes ${maxFiles} ${maxFiles === 1 ? 'file' : 'files'} at most.`);
        break;
      }
      if (!accepts(this.accept, item)) problems.push(`${item.name} is not a kind of file this forum takes.`);
      else if (maxSize && item.size > maxSize) problems.push(`${item.name} is larger than ${bytes(maxSize)}.`);
      else {
        const image = (item.type || '').startsWith('image/');
        this.#files.push({ id: `file-${(ids += 1)}`, file: item, name: item.name || 'Pasted image', size: item.size, type: item.type, url: image ? URL.createObjectURL(item) : '' });
      }
    }
    this.#paintFiles();
    this.#problem(problems.join(' '));
  }

  #removeFile(id) {
    const index = this.#files.findIndex((item) => item.id === id);
    if (index < 0) return;
    const [removed] = this.#files.splice(index, 1);
    if (removed.url) URL.revokeObjectURL(removed.url);
    this.#paintFiles();
    // The focus goes to the next file's button, or back to the text.
    const buttons = this.shadowRoot.querySelectorAll('.remove');
    (buttons[Math.min(index, buttons.length - 1)] ?? this.#field).focus();
  }

  #paintFiles() {
    const list = this.query('.files');
    list.innerHTML = this.#files
      .map((item) => `<li class="file"><span class="thumb" aria-hidden="true">${item.url ? `<img src="${escapeHtml(item.url)}" alt="">` : strokeIcon(file, 16)}</span><span class="file-text"><span class="file-name">${escapeHtml(item.name)}</span><span class="file-size">${bytes(item.size)}</span></span><button class="remove" type="button" data-id="${item.id}" aria-label="Remove ${escapeHtml(item.name)}">${strokeIcon(x, 14)}</button></li>`)
      .join('');
    list.hidden = !this.#files.length;
    this.#paintState();
  }

  // Says what went wrong, for a while.
  #problem(text) {
    const problem = this.query('.problem');
    problem.textContent = text;
    clearTimeout(this.#problemTimer);
    if (text) this.#problemTimer = setTimeout(() => (problem.textContent = ''), 6000);
  }

  #submit() {
    const field = this.#field;
    const text = field.value.trim();
    const max = Math.round(this.maxLength) || 0;
    if (this.disabled || (!text && !this.#files.length) || (max && field.value.length > max)) return;
    const attachments = this.#files.map(({ file: original, name, size, type, url }) => ({ file: original, name, size, type, url }));
    if (!this.emit('submit', { text, attachments })) return;
    // The page keeps the files' addresses now: they are its to revoke.
    this.#files = [];
    this.#paintFiles();
    this.#closeMentions();
    field.value = '';
    this.#setMode('write');
    this.#changed(false);
    clearTimeout(this.#saving);
    this.#writeDraft('');
    this.#problem('');
  }

  get #draftName() {
    return `lw-post-composer:${this.draftKey}`;
  }

  #readDraft() {
    try {
      return localStorage.getItem(this.#draftName) ?? '';
    } catch {
      return '';
    }
  }

  #writeDraft(text) {
    if (!this.draftKey) return;
    try {
      if (text.trim()) localStorage.setItem(this.#draftName, text);
      else localStorage.removeItem(this.#draftName);
    } catch {
      // Storage refused: the draft lives as long as the page.
    }
  }
}
