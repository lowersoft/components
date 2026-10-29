import actionStyles from '../button/action-button.scss?inline';
import { LwStatusButton } from '../button/status-button.js';
import styles from './connect-button.scss?inline';

const ICON = (body) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const APP_MARK = `<span class="mark">${ICON('<rect x="4" y="4" width="16" height="16" rx="4"/>')}</span>`;
const PROVIDER_MARK = `<span class="mark">${ICON('<path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"/>')}</span>`;

const MARKS = `<span class="marks" aria-hidden="true"><slot name="mark">${APP_MARK}</slot><span class="link"><span class="side"></span><span class="pulse"></span><span class="side"></span></span><slot name="provider">${PROVIDER_MARK}</slot></span>`;

/**
 * Connect an integration. Your mark and the provider's sit in the button,
 * joined by a link that pulses while signing in and closes once connected,
 * with the account named. Hover or focus a connected button to disconnect.
 *
 * Call `event.detail.waitUntil(promise)` synchronously inside `lw-connect` to
 * sign in; resolve it with the account name to show it. A rejection shows the
 * error, and pressing again retries.
 *
 * @attr {string} account - Connected account, e.g. "@dana"
 * @attr {string} connecting-label
 * @attr {string} connected-label
 * @attr {string} disconnect-label
 * @attr {string} error-label
 * @attr {'idle'|'connecting'|'connected'|'error'} status - Settable, e.g. to show an existing connection
 * @slot - Idle label, e.g. "Connect GitHub"
 * @slot mark - Your logo
 * @slot provider - The provider's logo
 * @fires lw-connect - On click while not connected. `detail.waitUntil(promise)` signs in. Cancelable.
 * @fires lw-disconnect - On click while connected. Cancelable.
 */
export class LwConnectButton extends LwStatusButton {
  static styles = [...LwStatusButton.styles, actionStyles, styles];
  static statuses = {
    connecting: { label: 'connectingLabel', busy: true, locked: true },
    connected: { label: 'connectedLabel', after: '<span class="account"></span>' },
    error: { label: 'errorLabel' },
  };
  static props = {
    ...LwStatusButton.props,
    account: {},
    connectingLabel: { default: 'Connecting' },
    connectedLabel: { default: 'Connected' },
    disconnectLabel: { default: 'Disconnect' },
    errorLabel: { default: 'Couldn’t connect' },
  };

  #run = 0;

  render() {
    return super.render(MARKS);
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('account')) this.query('.account').textContent = this.account ?? '';
    if (changed.has('disconnectLabel')) {
      this.query('.label[data-status="connected"]').dataset.disconnect = this.disconnectLabel;
    }
    if (['status', 'account', 'connectedLabel', 'disconnectLabel'].some((prop) => changed.has(prop))) {
      // Connected, pressing disconnects, so that is what the button is called.
      const button = this.query('.button');
      if (this.status === 'connected') {
        button.ariaLabel = [this.disconnectLabel, this.connectedLabel, this.account].filter(Boolean).join(', ');
      } else {
        button.removeAttribute('aria-label');
      }
    }
  }

  handleClick() {
    if (this.status === 'connecting') return;
    if (this.status === 'connected') this.#disconnect();
    else this.#connect();
  }

  #connect() {
    let action = null;
    if (!this.emit('connect', { waitUntil: (promise) => (action = promise) })) return;

    const run = ++this.#run;
    this.status = 'connecting';
    Promise.resolve(action).then(
      (account) => {
        if (run !== this.#run) return;
        if (typeof account === 'string') this.account = account;
        this.status = 'connected';
      },
      () => run === this.#run && (this.status = 'error'),
    );
  }

  #disconnect() {
    if (!this.emit('disconnect')) return;
    this.#run++;
    this.status = 'idle';
  }
}
