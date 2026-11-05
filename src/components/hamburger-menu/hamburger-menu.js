import { LwElement } from '../../core/lw-element.js';
import styles from './hamburger-menu.scss?inline';

const VARIANTS = ['squeeze', 'pivot', 'arrow', 'stagger', 'duo', 'split', 'wipe', 'loop'];

/**
 * A menu button: three bars that turn into a close mark, or a back arrow,
 * and back. Eight ways to get there:
 *
 * - `squeeze` closes the bars together, then crosses them.
 * - `pivot` crosses them as the whole icon turns over.
 * - `arrow` folds them into a back arrow.
 * - `stagger` evens out bars of three lengths, then crosses them.
 * - `duo` crosses two bars.
 * - `split` parts the middle bar while the others cross.
 * - `wipe` wipes the bars away and draws the cross in.
 * - `loop` spins round once on its way to the cross.
 *
 * Hovering a closed icon hints at what comes next. It is the menu's button
 * itself: put `aria-controls` on it to point at the menu, and listen for
 * `lw-change` to open and close that menu. Only CSS transitions move the
 * bars, and with reduced motion they change at once.
 *
 * @attr {boolean} open
 * @attr {'squeeze'|'pivot'|'arrow'|'stagger'|'duo'|'split'|'wipe'|'loop'} variant
 * @attr {number} size - The icon, in pixels; the button adds 8 pixels of hit area round it
 * @attr {number} thickness - Bar thickness in a 24-unit box, so it scales with `size`
 * @attr {number} duration - Milliseconds for one change
 * @attr {boolean} square - Square bar ends instead of round
 * @attr {string} label - Accessible name; "Menu" by default
 * @fires lw-change - About to open or close; `detail: { open }`. Cancelable.
 * @cssprop --lw-hamburger-color - The bars; the text color by default
 */
export class LwHamburgerMenu extends LwElement {
  static styles = styles;
  static props = {
    open: { type: Boolean, reflect: true },
    variant: { default: 'squeeze', reflect: true },
    size: { type: Number, default: 24 },
    thickness: { type: Number, default: 2 },
    duration: { type: Number, default: 420 },
    square: { type: Boolean, reflect: true },
    label: { default: 'Menu' },
  };

  render() {
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
<path class="bar top" d="M4 6h16" pathLength="1"/>
<path class="bar middle" d="M4 12h16" pathLength="1"/>
<path class="bar half left" d="M4 12h8" pathLength="1"/>
<path class="bar half right" d="M12 12h8" pathLength="1"/>
<path class="bar bottom" d="M4 18h16" pathLength="1"/>
<path class="cross one" d="M6 6l12 12" pathLength="1"/>
<path class="cross two" d="M18 6L6 18" pathLength="1"/>
</svg>`;
  }

  connected() {
    const options = { signal: this.signal };
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    if (!this.hasAttribute('tabindex')) this.tabIndex = 0;
    this.addEventListener('click', () => this.toggle(), options);
    this.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      this.toggle();
    }, options);
  }

  updated() {
    this.setAttribute('aria-expanded', String(this.open));
    this.setAttribute('aria-label', this.label || 'Menu');
    if (!VARIANTS.includes(this.variant)) this.setAttribute('variant', 'squeeze');
    this.style.setProperty('--_size', `${Math.max(12, this.size ?? 24)}px`);
    this.style.setProperty('--_thick', String(Math.max(0.5, this.thickness ?? 2)));
    this.style.setProperty('--_duration', `${Math.max(0, this.duration ?? 420)}ms`);
  }

  /** Opens or closes, unless an `lw-change` listener cancels it. */
  toggle(open = !this.open) {
    if (open === this.open) return;
    if (!this.emit('change', { open })) return;
    this.open = open;
  }
}
