import { LwModal, modalStyles } from '../../core/modal.js';
import '../button/index.js';
import styles from './session-timeout-dialog.scss?inline';

// The last stretch, in seconds, when the ring turns urgent.
const URGENT = 10;

/**
 * The warning before an idle session ends: a ring that empties as the
 * seconds run out, and the time left in words. Stay signed in keeps the
 * session; Sign out, or the time running out, ends it. The countdown
 * starts each time it opens and follows the clock, so a sleeping tab
 * still ends on time.
 *
 * @attr {number} seconds - How long it counts down
 * @fires lw-extend - Stay signed in was chosen
 * @fires lw-sign-out - Signed out, by choice or because time ran out; `detail: { expired }`
 */
export class LwSessionTimeoutDialog extends LwModal {
  static styles = [modalStyles, styles];
  static props = {
    ...LwModal.props,
    seconds: { type: Number, default: 60 },
  };

  #end = 0;
  #timer = 0;

  renderBody() {
    return `<div class="body content"><span class="ring" aria-hidden="true"><svg viewBox="0 0 44 44"><circle class="track" cx="22" cy="22" r="20"/><circle class="left" cx="22" cy="22" r="20" pathLength="1"/></svg><span class="count"></span></span>
<div><h2 class="title" id="modal-title">Still there?</h2><p class="lead">For your security you'll be signed out in <b class="clock"></b>. Anything you're typing stays put.</p></div></div>
<footer class="foot"><lw-button class="out" variant="outline">Sign out</lw-button><lw-button class="stay">Stay signed in</lw-button></footer><p class="announce visually-hidden" aria-live="assertive"></p>`;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    this.query('.stay').addEventListener('click', () => {
      this.emit('extend');
      this.hide('extend');
    }, options);
    this.query('.out').addEventListener('click', () => this.#signOut(false), options);
    this.addEventListener('lw-close', () => clearInterval(this.#timer), options);
    this.signal.addEventListener('abort', () => clearInterval(this.#timer));
  }

  opened() {
    this.#end = Date.now() + this.seconds * 1000;
    clearInterval(this.#timer);
    this.#timer = setInterval(() => this.#tick(), 250);
    this.#tick();
    requestAnimationFrame(() => this.query('.stay').focus());
  }

  #tick() {
    const left = Math.max(0, Math.ceil((this.#end - Date.now()) / 1000));
    this.query('.count').textContent = String(left);
    this.query('.clock').textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    this.query('.left').style.strokeDashoffset = String(1 - left / this.seconds);
    this.toggleAttribute('data-urgent', left <= URGENT);
    // Said out loud at the start of the last stretch, not every second.
    if (left === URGENT) this.query('.announce').textContent = `${URGENT} seconds left before you're signed out.`;
    if (left === 0) this.#signOut(true);
  }

  #signOut(expired) {
    clearInterval(this.#timer);
    this.emit('sign-out', { expired });
    this.hide(expired ? 'expired' : 'sign-out');
  }
}
