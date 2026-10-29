import { LwElement } from '../../core/lw-element.js';
import { toggleStyles } from '../../core/toggle.js';
import styles from './radio.scss?inline';

/**
 * One option of an `<lw-radio-group>`, with its label as content. The group
 * checks it, moves focus to it and submits its `value`.
 *
 * @attr {string} value
 * @attr {boolean} checked - Set by the group
 * @attr {boolean} disabled
 * @attr {string} description - A line under the label
 * @slot - The label
 * @csspart control - The drawn circle
 * @csspart label
 * @csspart description
 */
export class LwRadio extends LwElement {
  static styles = [toggleStyles, styles];
  static props = {
    value: { default: '' },
    checked: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    description: {},
  };

  #internals = this.attachInternals();

  render() {
    return '<span class="toggle" part="base"><span class="visual" part="control" aria-hidden="true"><span class="dot"></span></span><span class="text"><span class="label" part="label"><slot></slot></span><span class="description" part="description"></span></span></span>';
  }

  connected() {
    this.#internals.role = 'radio';
  }

  updated(changed) {
    if (changed.has('description')) {
      const description = this.query('.description');
      description.textContent = this.description ?? '';
      description.hidden = !this.description;
      this.#internals.ariaDescription = this.description ?? null;
    }
    this.#internals.ariaChecked = String(Boolean(this.checked));
    this.#internals.ariaDisabled = this.disabled ? 'true' : null;
    this.toggleAttribute('data-disabled', Boolean(this.disabled));
  }
}
