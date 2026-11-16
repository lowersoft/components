import { LwModal, modalStyles } from '../../core/modal.js';
import { reducedMotion } from '../../core/motion.js';
import '../magic-link-login/index.js';
import '../split-signup-login/index.js';
import styles from './auth-dialog.scss?inline';

const SLIDE = { duration: 450, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' };

// The links between the cards, which the dialog answers in place.
const LINKS = { '#sign-up': 'sign-up', '#sign-in': 'sign-in' };

/**
 * Signing in and signing up in one dialog. It opens on
 * `<lw-magic-link-login>`'s email and password form, and its "Create an
 * account" slides the form off to the left as `<lw-split-signup-login>`
 * comes in from the right; the sign-up's "Sign in" slides them back. The
 * dialog grows or shrinks to the card it shows, and a round close button
 * stands centred on its top right corner.
 *
 * The cards' events come out of the dialog, and so do their simulated
 * requests until you wire them: set `signIn` on `.login` and `signUp` on
 * `.signup` in its shadow root, as on the cards themselves.
 *
 * @attr {boolean} open
 * @attr {'sign-in'|'sign-up'} view - The card it shows; changed while open, the cards slide
 * @attr {string} brand - The product's name, on both cards
 * @fires lw-open - The dialog opened
 * @fires lw-close - The dialog closed; `detail: { reason }`
 * @fires lw-provider - Google or GitHub was chosen; `detail: { provider }`
 * @fires lw-sign-in - Signed in; `detail: { method, email }`
 * @fires lw-sign-up - The account was created; `detail: { name, email }`
 */
export class LwAuthDialog extends LwModal {
  static styles = [modalStyles, styles];
  static props = {
    ...LwModal.props,
    view: { default: 'sign-in', reflect: true },
    brand: { default: 'LowerSoft' },
  };

  // Ends the slide under way at once, the card it leaves hidden.
  #settle = null;

  renderBody() {
    return `<h2 class="visually-hidden" id="modal-title"></h2><div class="viewport" tabindex="-1">
<lw-magic-link-login class="card login" method="password" signup-href="#sign-up"></lw-magic-link-login>
<lw-split-signup-login class="card signup" sign-in-href="#sign-in" hidden></lw-split-signup-login></div>`;
  }

  connected() {
    super.connected();
    this.query('.viewport').addEventListener('click', (event) => {
      const link = event.composedPath().find((node) => node instanceof HTMLAnchorElement);
      const view = LINKS[link?.getAttribute('href')];
      if (!view) return;
      event.preventDefault();
      this.view = view;
    }, { signal: this.signal });
  }

  updated(changed) {
    // Opened along with the change, it opens on the card, without a slide.
    const open = this.dialog.open;
    super.updated(changed);
    if (changed.has('brand')) for (const card of this.shadowRoot.querySelectorAll('.card')) card.brand = this.brand;
    if (changed.has('view')) this.#paintView(open);
  }

  // Shows the card for `view`, sliding the cards past each other if `slide`.
  #paintView(slide) {
    this.#settle?.();
    const signUp = this.view === 'sign-up';
    const login = this.query('.login');
    const signup = this.query('.signup');
    const [from, to] = signUp ? [login, signup] : [signup, login];
    this.query('#modal-title').textContent = signUp ? 'Create an account' : 'Sign in';
    if (!slide || from.hidden || reducedMotion.matches) {
      from.hidden = true;
      to.hidden = false;
      return;
    }
    // The focus on the card that goes, as after pressing its link, moves to
    // the frame, so Tab goes on into the new card. Not to its first field,
    // which would complain of being empty when left.
    const focused = this.shadowRoot.activeElement === from;
    const viewport = this.query('.viewport');
    const before = viewport.offsetHeight;
    from.hidden = true;
    to.hidden = false;
    const after = viewport.offsetHeight;
    from.hidden = false;
    from.inert = true;
    viewport.scrollTop = 0;
    // On to sign up the cards move left, the way you read; back, right.
    const [out, into] = signUp ? ['-100%', '100%'] : ['100%', '-100%'];
    const animations = [
      from.animate({ translate: ['0 0', `${out} 0`] }, SLIDE),
      to.animate({ translate: [`${into} 0`, '0 0'] }, SLIDE),
      viewport.animate({ height: [`${before}px`, `${after}px`] }, SLIDE),
    ];
    const settle = () => {
      this.#settle = null;
      for (const animation of animations) animation.finish();
      from.hidden = true;
      from.inert = false;
      if (focused) viewport.focus({ preventScroll: true });
    };
    this.#settle = settle;
    animations[0].finished.then(() => this.#settle === settle && settle(), () => {});
  }
}
