import { CHECK_ICON } from '../../core/icons.js';
import { Menu, MENU_MARKUP, menuStyles } from '../../core/menu.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import { LwButton } from '../button/button.js';
import styles from './follow-button.scss?inline';

const ICON = (name, body) =>
  `<svg class="icon ${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const BELL = '<path d="M10.3 21a2 2 0 0 0 3.4 0M3.3 15.3A1 1 0 0 0 4 17h16a1 1 0 0 0 .7-1.7C19.4 14 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.4 6-2.7 7.3"/>';
const BELL_ICONS = [
  ICON('ring', `${BELL}<path d="M22 8c0-2.3-.8-4.3-2-6M4 2C2.8 3.7 2 5.7 2 8"/>`),
  ICON('plain', BELL),
  ICON('off', `${BELL}<path d="m2 2 20 20"/>`),
].join('');

const numberFormat = new Intl.NumberFormat(undefined, { numberingSystem: 'latn' });

/**
 * Follow with the count beside it. Unfollow shows on hover only once the
 * pointer has left and come back, so the click that followed cannot undo it.
 * Once following, a bell slides out to choose notifications.
 *
 * @attr {boolean} following - Toggled on click
 * @attr {number} count - Followers not counting this one; shows the count when set
 * @attr {'all'|'highlights'|'none'} notifications - Chosen from the bell
 * @attr {string} label
 * @attr {string} following-label
 * @attr {string} unfollow-label
 * @attr {string} count-label - Read after the count by screen readers, e.g. "followers"
 * @attr {string} bell-label - Accessible name of the bell
 * @attr {string} all-label
 * @attr {string} highlights-label
 * @attr {string} none-label
 * @csspart bell - The notifications button
 * @fires lw-change - Before following or unfollowing. `detail.following` is the new state. Cancelable.
 * @fires lw-notifications-change - `detail.notifications` is the new choice. Cancelable.
 */
export class LwFollowButton extends LwButton {
  static styles = [...LwButton.styles, rollingStyles, menuStyles, styles];
  static props = {
    ...LwButton.props,
    following: { type: Boolean, reflect: true },
    count: { type: Number, reflect: true },
    notifications: { default: 'all', reflect: true },
    label: { default: 'Follow' },
    followingLabel: { default: 'Following' },
    unfollowLabel: { default: 'Unfollow' },
    countLabel: { default: 'followers' },
    bellLabel: { default: 'Notifications' },
    allLabel: { default: 'All posts' },
    highlightsLabel: { default: 'Highlights only' },
    noneLabel: { default: 'None' },
  };

  #menu = null;

  render() {
    return `<button class="button main armed" part="button" type="button"><span class="labels" aria-hidden="true"><span class="label follow"></span><span class="label following">${CHECK_ICON}<span class="following-text"></span></span><span class="label unfollow"></span></span><span class="count rolling" aria-hidden="true" hidden></span></button><button class="button bell" part="bell" type="button" aria-haspopup="menu" aria-controls="menu" aria-expanded="false">${BELL_ICONS}</button>${MENU_MARKUP}`;
  }

  connected() {
    super.connected();
    const main = this.query('.main');
    const options = { signal: this.signal };
    // Unfollow is offered once the pointer or focus has left after following.
    const arm = () => main.classList.add('armed');
    main.addEventListener('pointerleave', arm, options);
    main.addEventListener('blur', arm, options);

    this.#menu ??= new Menu({
      trigger: this.query('.bell'),
      menu: this.query('.menu'),
      onPick: (value) => this.#choose(value),
    });
    this.#menu.connect(this.signal);
  }

  updated(changed) {
    super.updated(changed);
    const main = this.query('.main');
    const bell = this.query('.bell');
    const text = { label: '.follow', followingLabel: '.following-text', unfollowLabel: '.unfollow' };
    for (const [prop, selector] of Object.entries(text)) {
      if (changed.has(prop)) this.query(selector).textContent = this[prop];
    }
    if (changed.has('bellLabel')) bell.ariaLabel = this.bellLabel;
    if (['allLabel', 'highlightsLabel', 'noneLabel'].some((prop) => changed.has(prop))) {
      this.#menu.setItems([
        { value: 'all', label: this.allLabel },
        { value: 'highlights', label: this.highlightsLabel },
        { value: 'none', label: this.noneLabel },
      ]);
      this.#menu.setChecked(this.notifications);
    }
    if (changed.has('notifications')) this.#menu.setChecked(this.notifications);
    if (changed.has('following')) {
      main.ariaPressed = String(this.following);
      // Hidden from the keyboard and screen readers while slid away.
      bell.inert = !this.following;
      if (!this.following) this.#menu.close();
    }
    if (['label', 'count', 'countLabel', 'following'].some((prop) => changed.has(prop))) this.#renderCount();
  }

  handleClick(event) {
    super.handleClick(event);
    const main = this.query('.main');
    // A pointer click on an unarmed button is the one that just followed.
    if (this.following && event.detail !== 0 && !main.classList.contains('armed')) return;

    const following = !this.following;
    if (!this.emit('change', { following })) return;
    this.following = following;
    if (following) main.classList.remove('armed');
  }

  #choose(notifications) {
    if (notifications === this.notifications) return;
    if (this.emit('notifications-change', { notifications })) this.notifications = notifications;
  }

  // The name stays the same while `aria-pressed` carries the state; the count is appended.
  #renderCount() {
    const chip = this.query('.count');
    const main = this.query('.main');
    chip.hidden = this.count == null;
    if (chip.hidden) {
      main.ariaLabel = this.label;
      return;
    }
    const text = numberFormat.format(this.count + (this.following ? 1 : 0));
    main.ariaLabel = `${this.label}, ${text} ${this.countLabel}`;
    roll(chip, text);
  }
}
