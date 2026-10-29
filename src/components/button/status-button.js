import { iconStyles } from '../../core/icons.js';
import { reducedMotion } from '../../core/motion.js';
import { LwButton } from './button.js';
import buttonStyles from './button.scss?inline';
import styles from './status-button.scss?inline';

const LABEL_ENTER = { opacity: [0, 1], translate: ['0 8px', '0 0'], filter: ['blur(2px)', 'blur(0)'] };
const LABEL_EXIT = { opacity: [1, 0], translate: ['0 0', '0 -8px'], filter: ['blur(0)', 'blur(2px)'] };
const LABEL_DURATION = 200;
const WIDTH_DURATION = 350;

/**
 * Abstract button that swaps its label per `status`. The idle label is the
 * slotted content; other labels are an icon plus text from a prop. Labels
 * crossfade and the width animates to fit the new one.
 *
 * Subclasses declare `static statuses`:
 * `{ [status]: { icon, label, after?, busy?, locked?, silent? } }` where
 * `icon` and `after` are markup around the text, `label` is the prop holding
 * the text, `busy` sets `aria-busy`, `locked` sets `aria-disabled` and
 * `silent` skips the live region announcement.
 * Override `statusChanged(status, animate)` for extra effects.
 */
export class LwStatusButton extends LwButton {
  static styles = [buttonStyles, iconStyles, styles];
  static statuses = {};
  static props = {
    ...LwButton.props,
    status: { default: 'idle', reflect: true },
  };

  #labels = null;
  #shown = null;

  /** @param {string} [extra] Markup placed inside the button, behind the labels. */
  render(extra = '') {
    const labels = Object.entries(this.constructor.statuses)
      .map(
        ([status, { icon = '', after = '' }]) =>
          `<span class="label" data-status="${status}" hidden>${icon}<span class="text"></span>${after}</span>`,
      )
      .join('');

    return `<button class="button" part="button">${extra}<span class="content"><span class="label" data-status="idle">${this.renderIdle()}</span>${labels}</span><span class="live" aria-live="polite"></span></button>`;
  }

  /**
   * Markup of the idle label; the slotted content by default.
   * @protected
   */
  renderIdle() {
    return '<slot name="start"></slot><slot></slot><slot name="end"></slot>';
  }

  connected() {
    super.connected();
    this.#labels ??= Object.fromEntries(
      [...this.shadowRoot.querySelectorAll('.label')].map((label) => [label.dataset.status, label]),
    );
  }

  updated(changed) {
    super.updated(changed);
    for (const [status, { label }] of Object.entries(this.constructor.statuses)) {
      if (changed.has(label)) this.#labels[status].querySelector('.text').textContent = this[label];
    }
    if (changed.has('status')) this.#showStatus();
  }

  /**
   * Called after the label for a new status is shown.
   * @protected
   */
  statusChanged(status, animate) {}

  #showStatus() {
    const status = this.#labels[this.status] ? this.status : 'idle';
    const previous = this.#shown;
    if (status === previous) return;
    this.#shown = status;

    const config = this.constructor.statuses[status] ?? {};
    const button = this.query('button');
    button.setAttribute('aria-busy', String(Boolean(config.busy)));
    button.setAttribute('aria-disabled', String(Boolean(config.locked)));
    this.query('.live').textContent = config.label && !config.silent ? this[config.label] : '';

    const next = this.#labels[status];
    const animate = previous !== null && !reducedMotion.matches;
    const fromWidth = button.offsetWidth;

    // The entering label may still be leaving after a quick back-and-forth.
    next.getAnimations().forEach((animation) => animation.cancel());
    next.classList.remove('leaving');
    next.hidden = false;
    if (previous !== null) this.#hideLabel(this.#labels[previous], animate);
    // First render: an element can start in any status, so every other label hides.
    else for (const label of Object.values(this.#labels)) label.hidden = label !== next;

    if (animate) {
      const easing = getComputedStyle(this).getPropertyValue('--lw-ease-out').trim() || 'ease-out';
      next.animate(LABEL_ENTER, { duration: LABEL_DURATION, easing });
      const toWidth = button.offsetWidth;
      if (toWidth !== fromWidth) {
        button.animate({ width: [`${fromWidth}px`, `${toWidth}px`] }, { duration: WIDTH_DURATION, easing });
      }
    }

    this.statusChanged(status, animate);
  }

  #hideLabel(label, animate) {
    if (!animate) {
      label.hidden = true;
      return;
    }
    label.classList.add('leaving');
    label.animate(LABEL_EXIT, { duration: LABEL_DURATION, easing: 'ease-out' }).finished.then(
      () => {
        label.classList.remove('leaving');
        label.hidden = true;
      },
      () => {},
    );
  }
}
