import { escapeHtml, isTyping } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { search } from '../../core/lucide.js';
import { LwModal, modalStyles } from '../../core/modal.js';
import { parseShortcut, shortcutFromEvent } from '../../core/shortcut.js';
import styles from './shortcuts-dialog.scss?inline';

// The second key of a sequence must follow the first within this long.
const SEQUENCE_MS = 1000;
const FOUND_MS = 1600;

const DEMO_GROUPS = [
  { title: 'General', items: [{ label: 'Search', keys: 'mod+k' }, { label: 'Command menu', keys: 'mod+shift+p' }, { label: 'Show shortcuts', keys: 'shift+/', caps: ['?'] }, { label: 'Close panel', keys: 'escape' }] },
  { title: 'Navigation', items: [{ label: 'Go to builds', keys: 'g b' }, { label: 'Go to crashes', keys: 'g c' }, { label: 'Next item', keys: 'j' }, { label: 'Previous item', keys: 'k' }] },
  { title: 'Editing', items: [{ label: 'Undo', keys: 'mod+z' }, { label: 'Redo', keys: 'mod+shift+z' }, { label: 'Duplicate', keys: 'mod+d' }, { label: 'Rename', keys: 'f2' }] },
  { title: 'View', items: [{ label: 'Toggle sidebar', keys: 'mod+.' }, { label: 'Full screen', keys: 'mod+shift+f' }, { label: 'Switch theme', keys: 'mod+shift+l' }, { label: 'Zoom to fit', keys: 'shift+1' }] },
];

const keycaps = (labels) => labels.map((label) => `<kbd>${escapeHtml(label)}</kbd>`).join('');

/**
 * Every keyboard shortcut in one dialog, grouped. Search filters by name;
 * pressing a shortcut while it is open finds it, so you can check what a
 * key does. Sequences like G then B are pressed one after the other.
 * Shortcuts read ⌘ on Apple and Ctrl elsewhere.
 *
 * Groups are `{ title, items: [{ label, keys, caps? }] }`, `keys` like
 * `"mod+shift+p"`, a sequence's steps separated by spaces, and `caps`
 * the keycaps to show instead of the parsed ones.
 *
 * @attr {Array<object>} groups (JSON)
 */
export class LwShortcutsDialog extends LwModal {
  static styles = [modalStyles, styles];
  static props = {
    ...LwModal.props,
    groups: { type: Object, default: DEMO_GROUPS },
  };

  #pending = null;
  #pendingTimer = 0;
  #foundTimer = 0;

  renderBody() {
    return `<div class="body head"><h2 class="title" id="modal-title">Keyboard shortcuts</h2><p class="lead">Press any of them to find it here.</p>
<label class="search">${strokeIcon(search, 18)}<input class="query" type="search" placeholder="Search" aria-label="Search shortcuts" autocomplete="off"><span class="count"></span></label></div>
<div class="groups"></div><p class="none" hidden>No shortcuts match.</p><p class="live visually-hidden" aria-live="polite"></p>`;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    this.query('.query').addEventListener('input', () => this.#filter(), options);
    this.dialog.addEventListener('keydown', (event) => this.#press(event), options);
    this.signal.addEventListener('abort', () => {
      clearTimeout(this.#pendingTimer);
      clearTimeout(this.#foundTimer);
    });
  }

  opened() {
    requestAnimationFrame(() => this.query('.query').focus());
  }

  updated(changed) {
    super.updated(changed);
    if (!changed.has('groups')) return;
    this.query('.groups').innerHTML = this.groups
      .map((group) => `<section class="group"><h3 class="group-title">${escapeHtml(group.title)}</h3><ul>${group.items
        .map((item) => {
          const steps = item.keys.split(' ').map(parseShortcut);
          const caps = item.caps ? keycaps(item.caps) : steps.map((step) => keycaps(step.labels)).join('<span class="then">then</span>');
          return `<li class="item" data-keys="${escapeHtml(item.keys)}"><span class="label">${escapeHtml(item.label)}</span><span class="caps" aria-label="${escapeHtml(steps.map((step) => step.aria).join(' then '))}">${caps}</span></li>`;
        })
        .join('')}</ul></section>`)
      .join('');
    this.#filter();
  }

  #filter() {
    const term = this.query('.query').value.trim().toLowerCase();
    let shown = 0;
    for (const item of this.shadowRoot.querySelectorAll('.item')) {
      item.hidden = Boolean(term) && !item.querySelector('.label').textContent.toLowerCase().includes(term);
      if (!item.hidden) shown++;
    }
    for (const group of this.shadowRoot.querySelectorAll('.group')) group.hidden = !group.querySelector('.item:not([hidden])');
    this.query('.count').textContent = String(shown);
    this.query('.none').hidden = shown > 0;
  }

  // A shortcut pressed in the dialog lights its row, a sequence once complete.
  #press(event) {
    const pressed = shortcutFromEvent(event);
    if (!pressed || pressed === 'escape' || pressed === 'tab' || pressed === 'shift+tab') return;
    const plain = !/(mod|ctrl|alt)\+/.test(pressed);
    if (plain && isTyping(event)) return;
    const sequence = this.#pending ? `${this.#pending} ${pressed}` : pressed;
    const items = [...this.shadowRoot.querySelectorAll('.item')];
    const exact = items.find((item) => item.dataset.keys === sequence);
    clearTimeout(this.#pendingTimer);
    this.#pending = null;
    if (exact) {
      event.preventDefault();
      return this.#found(exact);
    }
    // The first key of a sequence waits for the next.
    if (items.some((item) => item.dataset.keys.startsWith(`${pressed} `))) {
      event.preventDefault();
      this.#pending = pressed;
      this.#pendingTimer = setTimeout(() => (this.#pending = null), SEQUENCE_MS);
    }
  }

  #found(item) {
    this.query('.query').value = '';
    this.#filter();
    for (const each of this.shadowRoot.querySelectorAll('.item[data-found]')) each.removeAttribute('data-found');
    item.toggleAttribute('data-found', true);
    item.scrollIntoView({ block: 'nearest' });
    this.query('.live').textContent = item.querySelector('.label').textContent;
    clearTimeout(this.#foundTimer);
    this.#foundTimer = setTimeout(() => item.removeAttribute('data-found'), FOUND_MS);
  }
}
