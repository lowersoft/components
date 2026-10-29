import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { hueOf, initialsOf } from '../../core/people.js';
import '../button/index.js';
import { caretAfter, caretAtEnd, caretIn } from './caret.js';
import styles from './mention-input.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

const MAX_RESULTS = 6;
const MAX_STACK = 4;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
// "@" at the start or after a space, then the name typed so far.
const TRIGGER = /(?:^|\s)@([\p{L}\p{N}._-]{0,24})$/u;

const DEMO_PEOPLE = [
  { id: 'ada', name: 'Ada Lovelace', handle: 'ada' },
  { id: 'alan', name: 'Alan Turing', handle: 'alan' },
  { id: 'grace', name: 'Grace Hopper', handle: 'grace' },
  { id: 'katherine', name: 'Katherine Johnson', handle: 'kjohnson' },
  { id: 'linus', name: 'Linus Torvalds', handle: 'linus' },
  { id: 'margaret', name: 'Margaret Hamilton', handle: 'margaret' },
  { id: 'tim', name: 'Tim Berners-Lee', handle: 'timbl' },
];

const fold = (text) => text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();

/** An initials avatar tinted by the name. */
const avatar = ({ name, avatarUrl }) => {
  const el = Object.assign(document.createElement('span'), { className: 'avatar' });
  if (avatarUrl) el.append(Object.assign(document.createElement('img'), { src: avatarUrl, alt: '' }));
  else el.textContent = initialsOf(name);
  el.style.setProperty('--_hue', hueOf(name));
  return el;
};

/**
 * A comment box with @mentions. Typing "@" opens a list of people at the
 * caret, filtered as the name is typed; picking one turns it into a token
 * that is deleted as a whole. A "Will notify" stack under the box shows who
 * will hear about the comment before it is sent. Ctrl+Enter (⌘+Enter on a
 * Mac) or the Send button sends it.
 *
 * The list follows the WAI-ARIA combobox pattern: the arrow keys move
 * through it, Enter or Tab picks, Escape closes. Set `people` to
 * `[{ id, name, handle, avatarUrl? }]`, as a property or JSON.
 *
 * @attr {object} people - Who can be mentioned
 * @attr {string} placeholder
 * @attr {string} label - Accessible name of the box
 * @attr {string} send-label
 * @attr {string} name - Submits the text, mentions as "@handle", with the form
 * @attr {boolean} disabled
 * @fires lw-send - The comment was sent; `detail: { text, mentions }`. Cancel it to keep the text
 * @csspart editor
 * @csspart listbox
 */
export class LwMentionInput extends FormControl(LwElement) {
  static styles = styles;
  static props = {
    people: { type: Object, default: DEMO_PEOPLE },
    placeholder: { default: 'Add a comment… Type @ to mention someone' },
    label: { default: 'Comment' },
    sendLabel: { default: 'Send' },
    name: {},
    disabled: { type: Boolean, reflect: true },
  };

  // The "@name" being typed: its text node and where the "@" is.
  #trigger = null;
  #results = [];
  #active = 0;
  #formDisabled = false;

  render() {
    return '<div class="box"><div class="editor" part="editor" contenteditable="true" role="textbox" aria-multiline="true" aria-autocomplete="list" aria-controls="listbox" aria-expanded="false"></div><ul class="listbox" id="listbox" role="listbox" part="listbox" aria-label="People" hidden><li class="highlight" role="presentation" aria-hidden="true"></li></ul><div class="footer"><div class="notify" aria-live="polite"><span class="notify-label">Will notify</span><span class="stack"></span><span class="names"></span></div><lw-button class="send" size="sm"></lw-button></div></div>';
  }

  connected() {
    const options = { signal: this.signal };
    const editor = this.query('.editor');
    editor.addEventListener('input', () => this.#edited(), options);
    editor.addEventListener('keydown', (event) => this.#key(event), options);
    editor.addEventListener('keyup', (event) => ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) && this.#findTrigger(), options);
    editor.addEventListener('pointerup', () => this.#findTrigger(), options);
    editor.addEventListener('blur', () => setTimeout(() => this.#close(), 120), options);
    // Only plain text comes in, so no one pastes styling or fake mentions.
    editor.addEventListener('paste', (event) => this.#paste(event), options);
    const list = this.query('.listbox');
    list.addEventListener('pointerdown', (event) => event.preventDefault(), options);
    list.addEventListener('click', (event) => this.#pick(Number(event.target.closest('[role="option"]')?.dataset.index)), options);
    list.addEventListener('pointermove', (event) => {
      const option = event.target.closest('[role="option"]');
      if (option) this.#setActive(Number(option.dataset.index), false);
    }, options);
    const send = this.query('.send');
    send.addEventListener('click', () => !send.disabled && this.#send(), options);
  }

  updated(changed) {
    const editor = this.query('.editor');
    if (changed.has('placeholder')) editor.dataset.placeholder = this.placeholder ?? '';
    if (changed.has('label')) editor.ariaLabel = this.label ?? '';
    if (changed.has('sendLabel')) this.query('.send').textContent = this.sendLabel;
    this.#syncDisabled();
  }

  formResetCallback() {
    this.clear();
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncDisabled();
  }

  #syncDisabled() {
    const editor = this.query('.editor');
    const disabled = Boolean(this.disabled || this.#formDisabled);
    editor.contentEditable = disabled ? 'false' : 'true';
    editor.ariaDisabled = disabled ? 'true' : null;
    this.#sync();
  }

  /** The comment as text, mentions written "@handle", and who is mentioned. */
  get value() {
    return { text: this.#text(this.query('.editor')).trim(), mentions: this.#mentioned() };
  }

  /** Empties the box. */
  clear() {
    this.query('.editor').replaceChildren();
    this.#close();
    this.#sync();
  }

  get #people() {
    return Array.isArray(this.people) ? this.people : [];
  }

  // The text, newlines kept and mentions as "@handle".
  #text(node) {
    let text = '';
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) text += child.data.replace(/ /g, ' ');
      else if (child.classList?.contains('mention')) text += `@${child.dataset.handle}`;
      else if (child.nodeName === 'BR') text += '\n';
      else {
        const block = child.nodeName === 'DIV' || child.nodeName === 'P';
        if (block && text && !text.endsWith('\n')) text += '\n';
        text += this.#text(child);
      }
    }
    return text;
  }

  #mentioned() {
    const seen = new Map();
    for (const token of this.query('.editor').querySelectorAll('.mention')) {
      const person = this.#people.find(({ id }) => String(id) === token.dataset.id);
      if (person && !seen.has(person.id)) seen.set(person.id, person);
    }
    return [...seen.values()];
  }

  #edited() {
    const editor = this.query('.editor');
    // Emptied by deleting: a leftover <br> would keep the placeholder away.
    if (!editor.textContent && !editor.querySelector('.mention')) editor.replaceChildren();
    this.#findTrigger();
    this.#sync();
  }

  // Looking for "@name" right before the caret.
  #findTrigger() {
    const range = caretIn(this.shadowRoot);
    const node = range?.startContainer;
    if (!node || node.nodeType !== Node.TEXT_NODE || node.parentElement?.closest('.mention')) {
      this.#close();
      return;
    }
    const before = node.data.slice(0, range.startOffset);
    const match = before.match(TRIGGER);
    if (!match) {
      this.#close();
      return;
    }
    const query = match[1];
    this.#trigger = { node, start: range.startOffset - query.length - 1, end: range.startOffset };
    this.#open(query, range);
  }

  // The people whose name or handle starts with what is typed, at the caret.
  #open(query, range) {
    const term = fold(query);
    const results = this.#people
      .filter(({ name, handle }) => !term || fold(handle ?? '').startsWith(term) || fold(name).split(/\s+/).some((part) => part.startsWith(term)))
      .slice(0, MAX_RESULTS);
    this.#results = results;
    const list = this.query('.listbox');
    const box = list.querySelector('.highlight');
    hideHighlight(box);
    const options = results.map((person, index) => {
      const option = Object.assign(document.createElement('li'), { id: `person-${index}`, role: 'option' });
      option.dataset.index = index;
      const text = Object.assign(document.createElement('span'), { className: 'person-text' });
      text.append(
        Object.assign(document.createElement('span'), { className: 'person-name', textContent: person.name }),
        Object.assign(document.createElement('span'), { className: 'person-handle', textContent: `@${person.handle}` }),
      );
      option.append(avatar(person), text);
      return option;
    });
    if (options.length === 0) options.push(Object.assign(document.createElement('li'), { className: 'empty', textContent: `No one called “${query}”` }));
    list.replaceChildren(box, ...options);
    list.hidden = false;
    this.query('.editor').ariaExpanded = 'true';
    // Under the caret, kept inside the box.
    const caret = range.getBoundingClientRect();
    const host = this.query('.box').getBoundingClientRect();
    const left = Math.min(Math.max(caret.left - host.left - 8, 0), host.width - list.offsetWidth);
    list.style.left = `${left}px`;
    list.style.top = `${caret.bottom - host.top + 6}px`;
    if (results.length) this.#setActive(0);
  }

  #close() {
    this.#trigger = null;
    this.#results = [];
    const list = this.query('.listbox');
    if (list.hidden) return;
    list.hidden = true;
    hideHighlight(list.querySelector('.highlight'));
    const editor = this.query('.editor');
    editor.ariaExpanded = 'false';
    editor.removeAttribute('aria-activedescendant');
  }

  #setActive(index, scroll = true) {
    const options = [...this.shadowRoot.querySelectorAll('[role="option"]')];
    if (options.length === 0) return;
    this.#active = (index + options.length) % options.length;
    options.forEach((option, i) => (option.ariaSelected = String(i === this.#active)));
    const active = options[this.#active];
    moveHighlight(this.query('.listbox .highlight'), active);
    if (scroll) active.scrollIntoView({ block: 'nearest' });
    this.query('.editor').setAttribute('aria-activedescendant', active.id);
  }

  // "@name" becomes a token for the person, and a space after it.
  #pick(index) {
    const person = this.#results[index];
    const trigger = this.#trigger;
    if (!person || !trigger) return;
    const range = document.createRange();
    range.setStart(trigger.node, trigger.start);
    range.setEnd(trigger.node, Math.min(trigger.end, trigger.node.length));
    range.deleteContents();
    const token = Object.assign(document.createElement('span'), { className: 'mention', contentEditable: 'false', textContent: `@${person.name}` });
    token.dataset.id = String(person.id);
    token.dataset.handle = person.handle;
    const space = document.createTextNode(' ');
    range.insertNode(space);
    range.insertNode(token);
    this.#close();
    this.query('.editor').focus();
    caretAfter(this.shadowRoot, space);
    if (!reducedMotion.matches) token.animate({ scale: [0.85, 1], opacity: [0, 1] }, { duration: 220, easing: EASE_OUT });
    this.#sync();
  }

  #key(event) {
    const open = !this.query('.listbox').hidden && this.#results.length > 0;
    if (open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      this.#setActive(this.#active + (event.key === 'ArrowDown' ? 1 : -1));
    } else if (open && (event.key === 'Enter' || event.key === 'Tab')) {
      event.preventDefault();
      this.#pick(this.#active);
    } else if (event.key === 'Escape' && !this.query('.listbox').hidden) {
      event.preventDefault();
      this.#close();
    } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.#send();
    }
  }

  #paste(event) {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    const range = caretIn(this.shadowRoot) ?? (this.shadowRoot.getSelection?.() ?? document.getSelection()).getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    caretAfter(this.shadowRoot, node);
    this.#edited();
  }

  #send() {
    const value = this.value;
    if (!value.text || this.disabled || this.#formDisabled) return;
    if (!this.emit('send', value)) return;
    this.clear();
    caretAtEnd(this.shadowRoot, this.query('.editor'));
  }

  // The send button, the notify stack and the form value.
  #sync() {
    const { text, mentions } = this.value;
    const disabled = Boolean(this.disabled || this.#formDisabled);
    this.query('.send').disabled = disabled || !text;
    this.toggleAttribute('data-empty', !this.query('.editor').textContent && !this.query('.editor').querySelector('.mention'));
    this[INTERNALS].setFormValue(this.name && text ? text : null);
    this.#renderStack(mentions);
  }

  // Who will be notified, as overlapping avatars that pop in and out.
  #renderStack(mentions) {
    const notify = this.query('.notify');
    const stack = this.query('.stack');
    notify.toggleAttribute('data-shown', mentions.length > 0);
    const shown = mentions.slice(0, MAX_STACK);
    const current = new Map([...stack.children].map((el) => [el.dataset.id, el]));
    const wanted = new Set(shown.map(({ id }) => String(id)));
    for (const [id, el] of current) {
      if (wanted.has(id)) continue;
      if (reducedMotion.matches) el.remove();
      else el.animate({ scale: [1, 0.6], opacity: [1, 0] }, { duration: 150, easing: EASE_OUT }).onfinish = () => el.remove();
    }
    shown.forEach((person, i) => {
      let el = current.get(String(person.id));
      if (!el) {
        el = avatar(person);
        el.dataset.id = String(person.id);
        el.title = person.name;
        if (!reducedMotion.matches) el.animate({ scale: [0.6, 1], opacity: [0, 1] }, { duration: 220, easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)' });
      }
      el.style.zIndex = String(MAX_STACK - i);
      stack.append(el);
    });
    const names = mentions.map(({ name }) => name.split(' ')[0]);
    this.query('.names').textContent =
      names.length > 2 ? `${names.slice(0, 2).join(', ')} and ${names.length - 2} more` : names.join(' and ');
  }
}
