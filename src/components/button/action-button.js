import { CHECK_ICON, SPINNER_ICON } from '../../core/icons.js';
import { LwStatusButton } from './status-button.js';
import styles from './action-button.scss?inline';

const ALERT_ICON =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';

const SHAKE = { translate: ['0', '-5px', '5px', '-3px', '3px', '0'] };
const SHAKE_DURATION = 320;

/**
 * Abstract button for async actions: pending with a spinner, then success
 * with a drawn check or error with a shake, then back to idle.
 *
 * Call `event.detail.waitUntil(promise)` synchronously inside an `lw-action`
 * listener to show the pending state until the promise settles. Without it,
 * a click goes straight to success. Cancel the event to keep the button idle.
 *
 * @attr {'idle'|'pending'|'success'|'error'} status - Current status, settable for controlled use
 * @attr {string} pending-label
 * @attr {string} success-label
 * @attr {string} error-label
 * @attr {number} success-duration - Milliseconds before returning to idle after success
 * @attr {number} error-duration - Milliseconds before returning to idle after an error
 * @fires lw-action - On click. `detail.waitUntil(promise)` makes the button wait for it.
 * @fires lw-success - When the action succeeds
 * @fires lw-error - When the action fails. `detail.error` holds the reason.
 */
export class LwActionButton extends LwStatusButton {
  static styles = [...LwStatusButton.styles, styles];
  static statuses = {
    pending: { icon: SPINNER_ICON, label: 'pendingLabel', busy: true, locked: true },
    success: { icon: CHECK_ICON, label: 'successLabel' },
    error: { icon: ALERT_ICON, label: 'errorLabel' },
  };
  static props = {
    ...LwStatusButton.props,
    pendingLabel: { default: 'Saving' },
    successLabel: { default: 'Saved' },
    errorLabel: { default: 'Try again' },
    successDuration: { type: Number, default: 1600 },
    errorDuration: { type: Number, default: 3200 },
  };

  #timer = 0;
  #run = 0;

  connected() {
    super.connected();
    this.signal.addEventListener('abort', () => clearTimeout(this.#timer));
  }

  handleClick(event) {
    if (this.status === 'pending') return;
    super.handleClick(event);
    clearTimeout(this.#timer);

    let action = null;
    if (!this.emit('action', { waitUntil: (promise) => (action = promise) })) return;
    if (!action) return this.#settle('success');

    const run = ++this.#run;
    this.status = 'pending';
    Promise.resolve(action).then(
      () => run === this.#run && this.#settle('success'),
      (error) => run === this.#run && this.#settle('error', error),
    );
  }

  statusChanged(status, animate) {
    if (status === 'error' && animate) {
      this.query('.content').animate(SHAKE, { duration: SHAKE_DURATION, easing: 'ease-out' });
    }
  }

  #settle(status, error) {
    this.status = status;
    this.emit(status, status === 'error' ? { error } : undefined);
    this.#timer = setTimeout(
      () => (this.status = 'idle'),
      status === 'success' ? this.successDuration : this.errorDuration,
    );
  }
}
