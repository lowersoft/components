import modalStyles from '../styles/modal.scss?inline';
import { strokeIcon } from './icons.js';
import { x } from './lucide.js';
import { LwElement } from './lw-element.js';
import { reducedMotion } from './motion.js';

/** Styles for `LwModal`; put them before the component's own in `static styles`. */
export { modalStyles };

const MOTION = { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };

/**
 * Base for the modal components: a native `<dialog>` opened with the
 * `open` attribute, which traps focus, closes on Escape, a press on the
 * backdrop or its close button, and eases in and out. A subclass returns
 * its content from `renderBody()`, with an element `id="modal-title"` that
 * names the dialog, and calls `super` from `connected()` and `updated()`.
 *
 * @attr {boolean} open
 * @fires lw-open - The dialog opened
 * @fires lw-close - The dialog closed; `detail: { reason }`
 */
export class LwModal extends LwElement {
  static props = {
    open: { type: Boolean, reflect: true },
  };

  #reason = 'dismiss';

  render() {
    return `<dialog class="modal" part="dialog" aria-labelledby="modal-title"><button class="close" type="button" aria-label="Close">${strokeIcon(x, 18)}</button>${this.renderBody()}</dialog>`;
  }

  /** The dialog's content. */
  renderBody() {
    return '';
  }

  /** The `<dialog>` element. */
  get dialog() {
    return this.query('.modal');
  }

  connected() {
    const options = { signal: this.signal };
    const dialog = this.dialog;
    this.query('.close').addEventListener('click', () => this.hide('dismiss'), options);
    // Escape: animate out instead of the native jump.
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.hide('dismiss');
    }, options);
    // A press that starts and ends on the backdrop closes it.
    let fromBackdrop = false;
    dialog.addEventListener('pointerdown', (event) => (fromBackdrop = event.target === dialog), options);
    dialog.addEventListener('click', (event) => fromBackdrop && event.target === dialog && this.hide('dismiss'), options);
  }

  updated(changed) {
    if (!changed.has('open')) return;
    const dialog = this.dialog;
    if (this.open && !dialog.open) {
      dialog.showModal();
      if (!reducedMotion.matches) dialog.animate({ opacity: [0, 1], scale: [0.96, 1], translate: ['0 0.5rem', '0 0'] }, MOTION);
      this.opened?.();
      this.emit('open');
    } else if (!this.open && dialog.open) {
      this.#closeDialog();
    }
  }

  /** Closes the dialog, telling listeners why. */
  hide(reason = 'dismiss') {
    this.#reason = reason;
    this.open = false;
  }

  async #closeDialog() {
    const dialog = this.dialog;
    if (!reducedMotion.matches) await dialog.animate({ opacity: [1, 0], scale: [1, 0.97] }, { ...MOTION, duration: 160 }).finished.catch(() => {});
    dialog.close();
    this.emit('close', { reason: this.#reason });
    this.#reason = 'dismiss';
  }
}
