import { iconStyles } from '../../core/icons.js';
import { LwElement } from '../../core/lw-element.js';
import { darkScheme, setTheme, themeChoice, watchTheme } from '../../core/theme.js';
import styles from './theme-toggle-button.scss?inline';

const ICON = (body) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const OPTIONS = [
  {
    value: 'light',
    label: 'lightLabel',
    icon: ICON('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  },
  {
    value: 'system',
    label: 'systemLabel',
    icon: ICON('<rect class="screen" x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>'),
  },
  {
    value: 'dark',
    label: 'darkLabel',
    icon: ICON('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
  },
];

/**
 * Light, System and Dark with a sliding thumb. The System glyph is drawn in
 * the theme the device uses right now. Arrow keys move the choice.
 *
 * The choice sets `data-theme` on <html>, which the lw theme reads; System
 * removes it so the theme follows the device. It stays in sync when the theme
 * changes elsewhere.
 *
 * @attr {'light'|'system'|'dark'} value - The chosen theme
 * @attr {'sm'|'md'|'lg'} size
 * @attr {string} label - Accessible name of the group
 * @attr {string} light-label
 * @attr {string} system-label
 * @attr {string} dark-label
 * @attr {'light'|'dark'} system - The device's theme (read only)
 * @csspart track
 * @fires lw-change - Before the theme changes. `detail.value` is the new choice. Cancelable.
 */
export class LwThemeToggleButton extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    value: { default: 'system', reflect: true },
    size: { default: 'md', reflect: true },
    label: { default: 'Theme' },
    lightLabel: { default: 'Light' },
    systemLabel: { default: 'System' },
    darkLabel: { default: 'Dark' },
  };

  render() {
    const options = OPTIONS.map(
      ({ value, icon }) => `<button class="option" type="button" role="radio" data-value="${value}">${icon}</button>`,
    ).join('');
    return `<div class="track" part="track" role="radiogroup"><span class="thumb" aria-hidden="true"></span>${options}</div>`;
  }

  connected() {
    const track = this.query('.track');
    const options = { signal: this.signal };
    track.addEventListener('click', (event) => this.#choose(event.target.closest('.option')?.dataset.value), options);
    track.addEventListener('keydown', this.#onKeyDown, options);

    // Follows the page theme and the device, wherever they change.
    const sync = () => {
      this.value = themeChoice();
      this.setAttribute('system', darkScheme.matches ? 'dark' : 'light');
    };
    sync();
    watchTheme(sync, this.signal);
  }

  updated(changed) {
    const buttons = this.#buttons;
    if (changed.has('label')) this.query('.track').ariaLabel = this.label;
    for (const [i, { value, label }] of OPTIONS.entries()) {
      const button = buttons[i];
      if (changed.has(label)) {
        button.ariaLabel = this[label];
        button.title = this[label];
      }
      if (changed.has('value')) {
        const checked = value === this.value;
        button.ariaChecked = String(checked);
        // One tab stop: the checked option.
        button.tabIndex = checked ? 0 : -1;
      }
    }
  }

  get #buttons() {
    return [...this.shadowRoot.querySelectorAll('.option')];
  }

  #choose(value, focus = false) {
    if (!value) return;
    if (value !== this.value && this.emit('change', { value })) {
      this.value = value;
      setTheme(value);
    }
    // Focus stays on the checked option, also when the change was refused.
    if (focus) this.#buttons.find((button) => button.dataset.value === this.value)?.focus();
  }

  // Radio group keys: arrows move and choose, wrapping around; Home and End jump.
  #onKeyDown = (event) => {
    const index = OPTIONS.findIndex((option) => option.value === this.value);
    const last = OPTIONS.length - 1;
    const moves = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: last };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + OPTIONS.length) % OPTIONS.length;
    this.#choose(OPTIONS[next].value, true);
  };
}
