import { isTyping } from '../../core/dom.js';
import { iconStyles, SPINNER_ICON } from '../../core/icons.js';
import { LwElement } from '../../core/lw-element.js';
import { isKey, isModifierDown, matchesShortcut, parseShortcut } from '../../core/shortcut.js';
import styles from './button.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

const setAttribute = (element, name, value) =>
  value == null ? element.removeAttribute(name) : element.setAttribute(name, value);

/**
 * The everyday button. Submits or resets its parent form like a native button.
 *
 * - `loading` turns the start icon into a spinner and holds clicks.
 * - `shortcut` draws keycaps and binds the keys page-wide (e.g. `mod+enter`
 *   for ⌘↵ / Ctrl+↵); each cap sinks while its key is down.
 * - `disabled-reason` keeps a disabled button readable and focusable and
 *   explains why it is disabled in a tooltip, instead of greying it out.
 *
 * @attr {'primary'|'secondary'|'outline'|'ghost'|'destructive'} variant
 * @attr {'sm'|'md'|'lg'} size
 * @attr {'button'|'submit'|'reset'} type
 * @attr {boolean} disabled
 * @attr {string} disabled-reason - Shown on hover and focus while disabled
 * @attr {boolean} loading
 * @attr {string} shortcut - `+`-joined parts: `mod` (⌘ on Apple, Ctrl elsewhere), `ctrl`, `alt`, `shift` and one key
 * @attr {boolean} passive - Shows the shortcut without listening for it
 * @attr {boolean} icon-only - Square button for an icon alone; give it an accessible name
 * @slot - Label
 * @slot start - Leading icon; becomes the spinner while loading
 * @slot end - Trailing icon
 * @csspart button - Native button element
 * @csspart key - Each keycap
 * @csspart reason - The disabled reason tooltip
 */
export class LwButton extends FormControl(LwElement) {
  static styles = [iconStyles, styles];
  static shadowOptions = { mode: 'open', delegatesFocus: true };
  static props = {
    variant: { default: 'primary', reflect: true },
    size: { default: 'md', reflect: true },
    type: { default: 'button' },
    disabled: { type: Boolean, reflect: true },
    disabledReason: { reflect: true },
    loading: { type: Boolean, reflect: true },
    shortcut: {},
    passive: { type: Boolean },
    iconOnly: { type: Boolean, reflect: true },
  };

  #shortcut = null;
  #listening = null;

  render() {
    return `<button class="button" part="button"><span class="spin">${SPINNER_ICON}</span><slot name="start"></slot><slot></slot><slot name="end"></slot><span class="keys" aria-hidden="true"></span></button><span class="reason" part="reason" id="reason" role="tooltip"></span>`;
  }

  connected() {
    this.query('.button').addEventListener('click', (event) => this.#blocked || this.handleClick(event), {
      signal: this.signal,
    });
    // Listeners were removed on disconnect; restore them on reconnect.
    if (this.#shortcut) this.#listen();
  }

  updated(changed) {
    const button = this.query('.button');
    if (changed.has('disabled') || changed.has('disabledReason')) {
      // An explained button stays focusable so its reason can be read.
      const explained = this.disabled && Boolean(this.disabledReason);
      button.disabled = this.disabled && !explained;
      setAttribute(button, 'aria-disabled', explained ? 'true' : null);
      setAttribute(button, 'aria-describedby', explained ? 'reason' : null);
    }
    if (changed.has('disabledReason')) {
      const reason = this.query('.reason');
      if (reason) reason.textContent = this.disabledReason ?? '';
    }
    if (changed.has('loading')) setAttribute(button, 'aria-busy', this.loading ? 'true' : null);
    if (changed.has('shortcut')) this.#renderShortcut();
    if (changed.has('shortcut') || changed.has('passive')) this.#listen();
  }

  /**
   * Click on the inner button. Subclasses override it to change what a click does.
   * @protected
   */
  handleClick() {
    this.formAction();
  }

  /**
   * Submit or reset the parent form according to `type`, like a native button.
   * @protected
   */
  formAction() {
    const { form } = this[INTERNALS];
    if (!form) return;
    if (this.type === 'submit') form.requestSubmit();
    else if (this.type === 'reset') form.reset();
  }

  get #blocked() {
    return this.disabled || this.loading;
  }

  #renderShortcut() {
    this.#shortcut = this.shortcut ? parseShortcut(this.shortcut) : null;
    setAttribute(this.query('.button'), 'aria-keyshortcuts', this.#shortcut?.aria ?? null);

    const caps = (this.#shortcut?.labels ?? []).map((label) =>
      Object.assign(document.createElement('kbd'), { className: 'key', part: 'key', textContent: label }),
    );
    this.query('.keys')?.replaceChildren(...caps);
  }

  #listen() {
    this.#listening?.abort();
    this.#listening = null;
    this.#release();
    if (!this.#shortcut || this.passive || !this.isConnected) return;

    // Combined with the element signal so listeners go away on disconnect too.
    this.#listening = new AbortController();
    const options = { signal: AbortSignal.any([this.signal, this.#listening.signal]) };
    addEventListener('keydown', this.#onKeyDown, options);
    addEventListener('keyup', (event) => this.#sync(event, false), options);
    addEventListener('blur', () => this.#release(), options);
  }

  #onKeyDown = (event) => {
    const shortcut = this.#shortcut;
    if (!shortcut.allowedWhileTyping && isTyping(event)) return;
    this.#sync(event, true);
    if (!event.repeat && !this.#blocked && matchesShortcut(event, shortcut)) {
      event.preventDefault();
      this.query('.button').click();
    }
  };

  // Each cap sinks while its key is down.
  #sync(event, down) {
    const caps = this.shadowRoot.querySelectorAll('.key');
    if (!caps.length) return;
    const { modifiers, key } = this.#shortcut;
    modifiers.forEach((modifier, i) => caps[i].toggleAttribute('data-pressed', isModifierDown(modifier, event)));
    caps[modifiers.length].toggleAttribute('data-pressed', down && isKey(event, key));
  }

  #release() {
    this.shadowRoot.querySelectorAll('[data-pressed]').forEach((cap) => cap.removeAttribute('data-pressed'));
  }
}
