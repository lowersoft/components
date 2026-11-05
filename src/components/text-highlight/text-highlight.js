import { LwElement } from '../../core/lw-element.js';
import styles from './text-highlight.scss?inline';

/**
 * Words marked as if by a highlighter: a band sweeps in behind them from
 * the left. It is a background on the words themselves, so a highlight
 * that wraps carries on along the next line, and the sweep runs through
 * the lines in reading order. The text stays plain inline text.
 *
 * It draws once when it scrolls into view, as soon as it is on the page
 * with `trigger="mount"`, on hover (and back off after) with
 * `trigger="hover"`, or under your control with `trigger="manual"` and
 * `drawn`. With reduced motion the band appears at once.
 *
 * @attr {string} color - The marker; a highlighter yellow by default
 * @attr {number} opacity - The band's opacity, 0 to 1
 * @attr {number} duration - Seconds the sweep takes
 * @attr {number} delay - Seconds before it sweeps
 * @attr {'view'|'hover'|'mount'|'manual'} trigger - When the band draws
 * @attr {boolean} drawn - Whether the band is drawn, with `trigger="manual"`
 * @attr {number} padding - Room around the words the band covers, in pixels
 * @slot - The words
 * @cssprop --lw-text-highlight-color - Same as `color`
 */
export class LwTextHighlight extends LwElement {
  static styles = styles;
  static props = {
    color: {},
    opacity: { type: Number, default: 0.4 },
    duration: { type: Number, default: 0.9 },
    delay: { type: Number, default: 0 },
    trigger: { default: 'view' },
    drawn: { type: Boolean, reflect: true },
    padding: { type: Number, default: 2 },
  };

  #seen = false;
  #hovered = false;

  render() {
    return '<slot></slot>';
  }

  connected() {
    const options = { signal: this.signal };
    const seen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      this.#seen = true;
      seen.disconnect();
      this.#paint();
    }, { threshold: 0.6 });
    seen.observe(this);
    this.addEventListener('pointerenter', () => this.#hover(true), options);
    this.addEventListener('pointerleave', () => this.#hover(false), options);
    this.signal.addEventListener('abort', () => seen.disconnect());
  }

  updated() {
    const set = (name, value) => (value ? this.style.setProperty(name, value) : this.style.removeProperty(name));
    set('--_marker', this.color);
    this.style.setProperty('--_alpha', `${Math.round(Math.min(Math.max(this.opacity ?? 0.4, 0), 1) * 100)}%`);
    this.style.setProperty('--_duration', `${Math.max(0, this.duration ?? 0.9)}s`);
    this.style.setProperty('--_delay', `${Math.max(0, this.delay ?? 0)}s`);
    this.style.setProperty('--_pad', `${Math.max(0, this.padding ?? 2)}px`);
    this.#paint();
  }

  #hover(hovered) {
    this.#hovered = hovered;
    this.#paint();
  }

  #paint() {
    const trigger = this.trigger ?? 'view';
    const on = { mount: true, view: this.#seen, hover: this.#hovered, manual: this.drawn }[trigger] ?? this.#seen;
    this.toggleAttribute('data-drawn', Boolean(on));
    // Hovering off pulls the band back without waiting.
    this.toggleAttribute('data-instant-out', trigger === 'hover');
  }
}
