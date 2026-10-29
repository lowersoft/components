import { LwButton } from '../button/button.js';
import buttonStyles from '../button/button.scss?inline';
import styles from './slide-text-button.scss?inline';

const setAttribute = (element, name, value) =>
  value == null ? element.removeAttribute(name) : element.setAttribute(name, value);

/**
 * Button whose label slides up on hover and focus to reveal a second label.
 * With `href` it renders a link instead of a button; set it before the
 * element connects, since the inner element is created once.
 *
 * @attr {string} hover-text - Label revealed on hover; defaults to the slotted text
 * @attr {string} href - Renders a link to this URL
 * @attr {string} target - Link target, e.g. `_blank`
 * @attr {boolean} animate-in - Fades and slides the button in when it first renders
 * @slot - Label
 * @slot start - Leading icon, stays in place
 * @slot end - Trailing icon, stays in place
 * @csspart button - Native button or link element
 */
export class LwSlideTextButton extends LwButton {
  static styles = [buttonStyles, styles];
  static props = {
    ...LwButton.props,
    hoverText: {},
    href: {},
    target: {},
    animateIn: { type: Boolean, reflect: true },
  };

  render() {
    const tag = this.href == null ? 'button' : 'a';
    return `<${tag} class="button" part="button"><slot name="start"></slot><span class="track"><span class="text"><slot></slot></span><span class="text hover" aria-hidden="true"></span></span><slot name="end"></slot></${tag}>`;
  }

  connected() {
    super.connected();
    this.query('slot:not([name])').addEventListener('slotchange', () => this.#syncHoverText(), { signal: this.signal });
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('hoverText')) this.#syncHoverText();

    const link = this.query('a');
    if (!link) return;
    if (changed.has('href')) setAttribute(link, 'href', this.href);
    if (changed.has('target')) setAttribute(link, 'target', this.target);
    if (changed.has('disabled')) {
      // Links cannot be disabled natively: remove from the tab order and announce it.
      setAttribute(link, 'aria-disabled', this.disabled ? 'true' : null);
      setAttribute(link, 'tabindex', this.disabled ? '-1' : null);
    }
  }

  #syncHoverText() {
    const label = this.query('slot:not([name])').assignedNodes().map((node) => node.textContent).join('');
    this.query('.hover').textContent = this.hoverText ?? label.trim();
  }
}
