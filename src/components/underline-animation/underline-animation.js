import { LwElement } from '../../core/lw-element.js';
import styles from './underline-animation.scss?inline';

/**
 * A link whose underline draws in on hover and keyboard focus. The line is
 * a background on the text itself, so it follows a link that wraps onto
 * several lines; only `wavy` draws a single line under a one-line link.
 *
 * - `slide` sweeps in from the left and leaves to the right.
 * - `center` grows out from the middle.
 * - `fill` rises from a line into a soft band behind the text.
 * - `wavy` draws a wave in from the left.
 * - `gradient` sweeps in like `slide`, in two colors.
 *
 * With `href` it is a link, with `as="button"` a button, otherwise plain
 * text. `rest` keeps a faint line for links in running text, and `active`
 * keeps the line drawn and marks the current page. With reduced motion the
 * line appears at once.
 *
 * @attr {'slide'|'center'|'fill'|'wavy'|'gradient'} variant
 * @attr {string} href - Makes it a link
 * @attr {string} target
 * @attr {string} rel
 * @attr {'a'|'span'|'button'} as - The element; a link when `href` is set
 * @attr {string} color - The line; the text color by default
 * @attr {string} from - The gradient's first color
 * @attr {string} to - The gradient's last color
 * @attr {number} thickness - In pixels
 * @attr {number} offset - Gap between text and line, in pixels
 * @attr {number} duration - In milliseconds
 * @attr {boolean} rest - Keeps a faint line while idle
 * @attr {boolean} active - Keeps the line drawn and marks the current page
 * @slot - The text
 * @csspart link - The link, button or text
 * @cssprop --lw-underline-color - Same as `color`
 */
export class LwUnderlineAnimation extends LwElement {
  static styles = styles;
  static shadowOptions = { mode: 'open', delegatesFocus: true };
  static props = {
    variant: { default: 'slide', reflect: true },
    href: {},
    target: {},
    rel: {},
    as: {},
    color: {},
    from: {},
    to: {},
    thickness: { type: Number, default: 2 },
    offset: { type: Number, default: 2 },
    duration: { type: Number, default: 420 },
    rest: { type: Boolean, reflect: true },
    active: { type: Boolean, reflect: true },
  };

  #tag = '';

  render() {
    return '<span class="link"><span class="wave" aria-hidden="true"></span><slot></slot></span>';
  }

  updated() {
    // The element follows `href` and `as`: a link, a button or plain text.
    const tag = this.as === 'button' ? 'button' : this.href && this.as !== 'span' ? 'a' : 'span';
    if (tag !== this.#tag) {
      this.#tag = tag;
      const element = document.createElement(tag);
      element.className = 'link';
      element.part = 'link';
      element.innerHTML = '<span class="wave" aria-hidden="true"></span><slot></slot>';
      if (tag === 'button') element.type = 'button';
      this.query('.link').replaceWith(element);
    }
    const link = this.query('.link');
    if (tag === 'a') {
      link.href = this.href;
      for (const name of ['target', 'rel']) {
        if (this[name]) link.setAttribute(name, this[name]);
        else link.removeAttribute(name);
      }
      if (this.active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    } else if (tag === 'button') link.ariaPressed = this.active ? 'true' : null;
    const set = (name, value) => (value ? this.style.setProperty(name, value) : this.style.removeProperty(name));
    set('--_line', this.color);
    set('--_from', this.from);
    set('--_to', this.to);
    set('--_thick', `${Math.max(0.5, this.thickness ?? 2)}px`);
    set('--_offset', `${Math.max(0, this.offset ?? 2)}px`);
    set('--_duration', `${Math.max(0, this.duration ?? 420)}ms`);
  }
}
