import { Menu, MENU_MARKUP, menuStyles } from '../../core/menu.js';
import { swapStyles, swapText } from '../../core/swap.js';
import { LwActionButton } from '../button/action-button.js';
import styles from './split-button.scss?inline';

const CHEVRON_ICON =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

const readStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the choice just isn't remembered.
  }
};

/**
 * One action done a few ways, like merging a pull request. The caret opens
 * the other ways, each with a line on what it does; picking one changes the
 * label without running it. Pressing runs the chosen way with pending and
 * done labels.
 *
 * Declare the ways as `<option>` children:
 * `<option value="squash" data-description="…" data-pending="Squashing" data-done="Squashed">Squash and merge</option>`
 *
 * @attr {string} value - The chosen option's value; the first option by default
 * @attr {string} storage-key - Remembers the choice in localStorage under this key
 * @attr {string} menu-label - Accessible name of the caret
 * @slot start - Icon before the label
 * @fires lw-change - When another option is picked. `detail.value` is the new value.
 * @see LwActionButton for the action flow and events; read `event.target.value` in `lw-action`
 */
export class LwSplitButton extends LwActionButton {
  static styles = [...LwActionButton.styles, menuStyles, swapStyles, styles];
  static props = {
    ...LwActionButton.props,
    value: { reflect: true },
    storageKey: {},
    menuLabel: { default: 'More options' },
  };

  #options = [];
  #menu = null;

  renderIdle() {
    return '<slot name="start"></slot><span class="choice swap"></span>';
  }

  render() {
    return `${super.render()}<button class="button caret" part="caret" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="menu">${CHEVRON_ICON}</button>${MENU_MARKUP}`;
  }

  connected() {
    super.connected();
    this.#menu ??= new Menu({
      trigger: this.query('.caret'),
      menu: this.query('.menu'),
      onPick: (value) => this.#pick(value),
      canOpen: () => this.status !== 'pending',
    });
    this.#menu.connect(this.signal);

    if (this.storageKey && !this.hasAttribute('value')) this.value = readStorage(this.storageKey) ?? undefined;
    this.#readOptions();

    // Options can change after connection; the host's own attributes are not options.
    const observer = new MutationObserver((mutations) => {
      if (mutations.some(({ type, target }) => type !== 'attributes' || target !== this)) this.#readOptions();
    });
    observer.observe(this, { childList: true, subtree: true, attributes: true, characterData: true });
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    if (changed.has('value')) this.#applyChoice();
    if (changed.has('menuLabel')) this.query('.caret').ariaLabel = this.menuLabel;
    if (changed.has('status') || changed.has('disabled')) {
      this.query('.caret').disabled = this.disabled || this.status === 'pending';
    }
    super.updated(changed);
  }

  #readOptions() {
    this.#options = [...this.querySelectorAll(':scope > option')].map((option) => ({
      value: option.value,
      label: option.textContent.trim(),
      description: option.dataset.description ?? '',
      pending: option.dataset.pending,
      done: option.dataset.done,
    }));
    this.#menu.setItems(this.#options);
    this.#applyChoice();
  }

  // Shows the chosen option and takes its pending and done labels.
  #applyChoice() {
    const choice = this.#options.find((option) => option.value === this.value) ?? this.#options[0];
    if (!choice) return;
    // The old label leaves upward as the new one rises from below; the width follows.
    swapText(this.query('.choice'), choice.label, this.query('.button'));
    this.pendingLabel = choice.pending ?? choice.label;
    this.successLabel = choice.done ?? choice.label;
    this.#menu.setChecked(choice.value);
  }

  #pick(value) {
    if (value === (this.value ?? this.#options[0]?.value)) return;
    this.value = value;
    if (this.storageKey) writeStorage(this.storageKey, value);
    this.emit('change', { value });
  }
}
