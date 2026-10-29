import { LwElement } from '../../core/lw-element.js';
import { ITEM_HEIGHT, VIEW_HEIGHT, Wheel } from './wheel.js';
import styles from './wheel-picker.scss?inline';

/**
 * An iOS-style drum picker. Each `<select>` inside becomes a wheel: drag or
 * flick it, scroll it, tap a row, or use the arrow keys, Page Up/Down, Home
 * and End. The selects stay the source of truth, so a form submits them as
 * usual and the markup still works before the script loads. Give each one
 * an `aria-label`, `data-loop` to wrap from the last option to the first,
 * and `data-width` (any CSS length) when its labels need more than 4rem.
 *
 * ```html
 * <lw-wheel-picker label="Time">
 *   <select name="hour" aria-label="Hours" data-loop>…</select>
 * </lw-wheel-picker>
 * ```
 *
 * @attr {string} label - Accessible name for the whole picker
 * @fires lw-change - A wheel came to rest on a new option; `detail: { value }`, keyed by select name
 * @csspart column - Each wheel
 */
export class LwWheelPicker extends LwElement {
  static styles = styles;
  static props = {
    label: { default: 'Picker' },
  };

  #internals = this.attachInternals();
  #wheels = [];
  #selects = [];

  render() {
    return `<div class="picker" style="--_item: ${ITEM_HEIGHT}px; --_view: ${VIEW_HEIGHT}px"><span class="band" aria-hidden="true"></span><span class="tick" aria-hidden="true"></span><span class="tick end" aria-hidden="true"></span><div class="columns"></div></div>`;
  }

  connected() {
    this.#internals.role = 'group';
    const content = new MutationObserver(() => this.#build());
    content.observe(this, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['label', 'value', 'aria-label', 'data-loop', 'data-width'] });
    // A form reset puts the selects back; follow them once it has.
    this.addEventListener('change', (event) => event.target !== this && this.#follow(), { signal: this.signal });
    document.addEventListener('reset', (event) => event.target.contains?.(this) && setTimeout(() => this.#follow()), { signal: this.signal });
    this.signal.addEventListener('abort', () => content.disconnect());
    this.#build();
  }

  updated(changed) {
    if (changed.has('label')) this.#internals.ariaLabel = this.label;
  }

  /** The selection, keyed by each select's name (or its position). */
  get value() {
    return Object.fromEntries(this.#selects.map((select, i) => [select.name || String(i), select.value]));
  }

  set value(value) {
    this.#selects.forEach((select, i) => {
      const next = value?.[select.name || String(i)];
      if (next !== undefined) select.value = next;
    });
    this.#follow();
  }

  // One wheel per select, rebuilt when the selects or their options change.
  #build() {
    this.#selects = [...this.querySelectorAll(':scope > select')];
    const columns = this.query('.columns');
    while (this.#wheels.length < this.#selects.length) {
      const index = this.#wheels.length;
      const wheel = new Wheel((option) => this.#settled(index, option), this.signal);
      this.#wheels.push(wheel);
      columns.append(wheel.element);
    }
    while (this.#wheels.length > this.#selects.length) this.#wheels.pop().element.remove();
    this.#selects.forEach((select, i) => {
      this.#wheels[i].configure({
        options: [...select.options].map((option) => ({ value: option.value, label: option.label })),
        label: select.getAttribute('aria-label') ?? select.name,
        loop: select.hasAttribute('data-loop'),
        width: select.dataset.width,
      });
    });
    this.#follow();
  }

  #follow() {
    this.#selects.forEach((select, i) => this.#wheels[i]?.show(select.selectedIndex));
  }

  #settled(index, option) {
    const select = this.#selects[index];
    if (!select || option < 0 || select.selectedIndex === option) return;
    select.selectedIndex = option;
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    this.emit('change', { value: this.value });
  }
}
