import { CHECK_ICON, iconStyles } from '../../core/icons.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { IS_APPLE } from '../../core/platform.js';
import { heldModifiers, modifierLabels, parseShortcut, shortcutFromEvent } from '../../core/shortcut.js';
import '../button/index.js';
import styles from './shortcut-recorder.scss?inline';

const SAVED_MS = 1600;
// Keys that steer the recorder instead of being recorded.
const CONTROL_KEYS = new Set(['Escape', 'Tab']);

const DEMO_SHORTCUTS = [
  { id: 'search', label: 'Search', keys: 'mod+k' },
  { id: 'palette', label: 'Command palette', keys: 'mod+shift+p' },
  { id: 'new', label: 'New document', keys: 'mod+n' },
  { id: 'save', label: 'Save', keys: 'mod+s' },
  { id: 'sidebar', label: 'Toggle sidebar', keys: 'mod+b' },
];

const caps = (labels, pressed = false) =>
  labels.map((label) => {
    const cap = Object.assign(document.createElement('kbd'), { className: 'key', textContent: label });
    cap.toggleAttribute('data-pressed', pressed);
    return cap;
  });

/**
 * A settings list of keyboard shortcuts. Press a binding, then hold the new
 * keys: the modifiers show as pressed keycaps as they go down, and the first
 * other key completes it. A shortcut already in use offers to replace it;
 * Escape cancels and Backspace on its own clears the binding. The row
 * confirms with "Saved".
 *
 * Set `shortcuts` to `[{ id, label, keys }]`, keys written like `"mod+k"`
 * (`mod` is ⌘ on a Mac and Ctrl elsewhere), as a property or JSON.
 *
 * @attr {object} shortcuts - The actions and their keys
 * @attr {string} label - Accessible name of the list
 * @fires lw-change - A binding changed; `detail: { id, keys, shortcuts }`
 * @csspart list
 */
export class LwShortcutRecorder extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    shortcuts: { type: Object, default: DEMO_SHORTCUTS },
    label: { default: 'Keyboard shortcuts' },
  };

  // The row being recorded, and a clash waiting for an answer.
  #recording = null;
  #clash = null;
  #savedTimers = new Map();

  render() {
    return '<ul class="list" part="list"></ul><p class="announce" aria-live="polite"></p>';
  }

  connected() {
    const options = { signal: this.signal };
    const list = this.query('.list');
    list.addEventListener('click', (event) => this.#click(event), options);
    list.addEventListener('keydown', (event) => this.#keydown(event), options);
    list.addEventListener('keyup', (event) => this.#keyup(event), options);
    list.addEventListener('focusout', (event) => {
      if (this.#recording && !this.query('.list').contains(event.relatedTarget)) this.#stop();
    }, options);
    this.signal.addEventListener('abort', () => this.#savedTimers.forEach((timer) => clearTimeout(timer)));
  }

  updated(changed) {
    if (changed.has('label')) this.query('.list').ariaLabel = this.label ?? '';
    if (changed.has('shortcuts')) this.#renderRows();
  }

  get #rows() {
    return Array.isArray(this.shortcuts) ? this.shortcuts : [];
  }

  #renderRows() {
    this.query('.list').replaceChildren(
      ...this.#rows.map(({ id, label }) => {
        const row = Object.assign(document.createElement('li'), { className: 'row' });
        row.dataset.id = String(id);
        row.innerHTML = `<span class="name"></span><span class="side"><span class="saved" hidden>${CHECK_ICON}Saved</span><button class="binding" type="button"></button></span><div class="clash" role="group" hidden><span class="clash-text"></span><lw-button class="replace" size="sm">Replace</lw-button><lw-button class="keep" size="sm" variant="ghost">Cancel</lw-button></div>`;
        row.querySelector('.name').textContent = label;
        this.#showBinding(row);
        return row;
      }),
    );
  }

  #find(id) {
    return this.#rows.find((shortcut) => String(shortcut.id) === id);
  }

  #row(id) {
    return this.query(`.row[data-id="${CSS.escape(id)}"]`);
  }

  // The binding as keycaps, or a dash when there is none.
  #showBinding(row) {
    const { label, keys } = this.#find(row.dataset.id);
    const button = row.querySelector('.binding');
    button.removeAttribute('data-recording');
    if (keys) {
      const shortcut = parseShortcut(keys);
      button.replaceChildren(...caps(shortcut.labels));
      button.ariaLabel = `${label}: ${shortcut.aria}. Press to change.`;
    } else {
      button.replaceChildren(Object.assign(document.createElement('span'), { className: 'none', textContent: 'Not set' }));
      button.ariaLabel = `${label}: not set. Press to record.`;
    }
  }

  #click(event) {
    const row = event.target.closest('.row');
    if (!row) return;
    if (event.target.closest('.replace')) this.#resolveClash(true);
    else if (event.target.closest('.keep')) this.#resolveClash(false);
    else if (event.target.closest('.binding')) {
      if (this.#recording === row.dataset.id) this.#stop();
      else this.#start(row.dataset.id);
    }
  }

  #start(id) {
    this.#stop();
    this.#recording = id;
    const row = this.#row(id);
    row.toggleAttribute('data-recording', true);
    const button = row.querySelector('.binding');
    button.toggleAttribute('data-recording', true);
    this.#showHeld(button, []);
    button.focus();
    this.query('.announce').textContent = 'Recording. Hold the new keys, or press Escape to cancel.';
  }

  #stop() {
    const id = this.#recording;
    if (!id) return;
    this.#recording = null;
    const row = this.#row(id);
    if (!row) return;
    row.removeAttribute('data-recording');
    this.#showBinding(row);
  }

  // While recording, the held modifiers show as pressed keycaps.
  #showHeld(button, modifiers) {
    if (modifiers.length === 0) {
      button.replaceChildren(Object.assign(document.createElement('span'), { className: 'prompt', textContent: 'Press keys…' }));
      return;
    }
    button.replaceChildren(...caps(modifierLabels(modifiers), true));
  }

  #keydown(event) {
    const id = this.#recording;
    if (!id || !event.target.closest('.binding')) return;
    if (CONTROL_KEYS.has(event.key)) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.#stop();
        this.query('.announce').textContent = 'Cancelled.';
      }
      return;
    }
    event.preventDefault();
    const button = event.target.closest('.binding');
    const keys = shortcutFromEvent(event);
    if (!keys) {
      this.#showHeld(button, heldModifiers(event));
      return;
    }
    // Backspace alone clears the binding.
    if (keys === 'backspace') {
      this.#commit(id, '');
      return;
    }
    // A letter or digit alone would fire while typing: it needs a modifier.
    const { modifiers, key } = parseShortcut(keys);
    if (modifiers.length === 0 && key.length === 1) {
      this.query('.announce').textContent = `Add ${IS_APPLE ? '⌘, ⌥ or ⌃' : 'Ctrl or Alt'} to that key.`;
      this.#shake(button);
      return;
    }
    const taken = this.#rows.find((shortcut) => shortcut.keys === keys && String(shortcut.id) !== id);
    if (taken) this.#offerReplace(id, keys, taken);
    else this.#commit(id, keys);
  }

  #keyup(event) {
    const button = event.target.closest?.('.binding');
    if (!this.#recording || !button?.hasAttribute('data-recording')) return;
    this.#showHeld(button, heldModifiers(event));
  }

  // The keys belong to another action: ask before moving them.
  #offerReplace(id, keys, taken) {
    this.#recording = null;
    const row = this.#row(id);
    row.removeAttribute('data-recording');
    const button = row.querySelector('.binding');
    button.removeAttribute('data-recording');
    button.replaceChildren(...caps(parseShortcut(keys).labels));
    this.#clash = { id, keys, from: String(taken.id) };
    const clash = row.querySelector('.clash');
    clash.querySelector('.clash-text').textContent = `Already used by “${taken.label}”.`;
    clash.hidden = false;
    if (!reducedMotion.matches) clash.animate({ opacity: [0, 1], translate: ['0 -4px', '0 0'] }, { duration: 200, easing: 'ease-out' });
    clash.querySelector('.replace').focus();
    this.query('.announce').textContent = `${parseShortcut(keys).aria} is already used by ${taken.label}. Replace it?`;
  }

  #resolveClash(replace) {
    const clash = this.#clash;
    if (!clash) return;
    this.#clash = null;
    const row = this.#row(clash.id);
    row.querySelector('.clash').hidden = true;
    if (replace) {
      this.#set(clash.from, '');
      this.#showBinding(this.#row(clash.from));
      this.#commit(clash.id, clash.keys);
    } else {
      this.#showBinding(row);
      row.querySelector('.binding').focus();
      this.query('.announce').textContent = 'Kept the old shortcut.';
    }
  }

  #set(id, keys) {
    this.shortcuts = this.#rows.map((shortcut) => (String(shortcut.id) === id ? { ...shortcut, keys } : shortcut));
  }

  // Saves the keys, then the row says so for a moment.
  #commit(id, keys) {
    this.#recording = null;
    this.#set(id, keys);
    // `shortcuts` re-renders on the next update; this row shows it now.
    this.#renderRows();
    const row = this.#row(id);
    row.querySelector('.binding').focus();
    const saved = row.querySelector('.saved');
    saved.hidden = false;
    if (!reducedMotion.matches) saved.animate({ opacity: [0, 1], translate: ['4px 0', '0 0'] }, { duration: 200, easing: 'ease-out' });
    clearTimeout(this.#savedTimers.get(id));
    this.#savedTimers.set(id, setTimeout(() => this.#row(id)?.querySelector('.saved')?.setAttribute('hidden', ''), SAVED_MS));
    const { label } = this.#find(id);
    this.query('.announce').textContent = keys ? `Saved: ${label} is ${parseShortcut(keys).aria}.` : `Cleared the shortcut for ${label}.`;
    this.emit('change', { id, keys, shortcuts: this.#rows });
  }

  #shake(element) {
    if (reducedMotion.matches) return;
    element.animate({ translate: ['0', '-3px', '3px', '-2px', '0'] }, { duration: 240, easing: 'ease-out' });
  }
}
