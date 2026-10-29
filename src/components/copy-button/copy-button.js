import { writeClipboard } from '../../core/clipboard.js';
import { CHECK_ICON, iconStyles } from '../../core/icons.js';
import { reducedMotion } from '../../core/motion.js';
import { LwButton } from '../button/button.js';
import buttonStyles from '../button/button.scss?inline';
import styles from './copy-button.scss?inline';

const COPY_ICON =
  '<svg class="icon copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

const VISIBLE_EDGE = 4; // characters left unmasked at each end of a secret
const MASK = '•';
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const DECODE_DURATION = 450;
// Sweeps across in the first part, then fades.
const SWEEP = [
  { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
  { clipPath: 'inset(0 0 0 0)', opacity: 1, offset: 0.4 },
  { clipPath: 'inset(0 0 0 0)', opacity: 0 },
];
const SWEEP_DURATION = 800;

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * A value you copy, shown in full. Copying sweeps a selection tint across
 * the value and the icon turns into a check. With `secret`, the middle is
 * masked and decodes into view on hover or focus. ⌘C / Ctrl+C copies while
 * the button is focused.
 *
 * @attr {string} value - Text to show and copy
 * @attr {boolean} secret - Masks the middle of the value until hovered or focused; screen readers never read it
 * @attr {string} label - Accessible action, e.g. "Copy API key"
 * @attr {string} copied-label - Announced after copying
 * @attr {number} reset-after - Milliseconds the check shows
 * @attr {boolean} copied - Set while the check shows (read only)
 * @fires lw-copy - After copying. `detail.value` holds the text.
 * @fires lw-error - When the clipboard refused. `detail.error` holds the reason.
 */
export class LwCopyButton extends LwButton {
  static styles = [buttonStyles, iconStyles, styles];
  static props = {
    ...LwButton.props,
    value: { default: '' },
    secret: { type: Boolean },
    label: { default: 'Copy' },
    copiedLabel: { default: 'Copied' },
    resetAfter: { type: Number, default: 1600 },
    copied: { type: Boolean, reflect: true },
  };

  #revealed = false;
  #copying = false;
  #frame = 0;
  #timer = 0;

  render() {
    return `<button class="button" part="button" type="button"><span class="value"><span class="sweep"></span><span class="text"></span></span><span class="glyph">${COPY_ICON}${CHECK_ICON}</span></button><span class="live" aria-live="polite"></span>`;
  }

  connected() {
    super.connected();
    const button = this.query('.button');
    const options = { signal: this.signal };
    const reveal = (on) => () => this.#reveal(on);

    button.addEventListener('pointerenter', reveal(true), options);
    button.addEventListener('pointerleave', () => button.matches(':focus-visible') || this.#reveal(false), options);
    button.addEventListener('focus', reveal(true), options);
    // The legacy copy borrows focus for a moment; that is not the user leaving.
    button.addEventListener('blur', () => this.#copying || this.#reveal(false), options);
    button.addEventListener('keydown', this.#onKeyDown, options);
    this.signal.addEventListener('abort', () => {
      cancelAnimationFrame(this.#frame);
      clearTimeout(this.#timer);
    });
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('value') || changed.has('secret')) this.#showText();
    if (['value', 'secret', 'label'].some((prop) => changed.has(prop))) {
      this.query('.button').ariaLabel = this.secret || !this.value ? this.label : `${this.label}: ${this.value}`;
    }
  }

  handleClick() {
    this.#copy();
  }

  #onKeyDown = (event) => {
    const isCopy = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'c';
    // A text selection elsewhere keeps the native copy.
    if (!isCopy || getSelection()?.toString()) return;
    event.preventDefault();
    this.#copy();
  };

  async #copy() {
    this.#copying = true;
    try {
      await writeClipboard(this.value);
    } catch (error) {
      this.emit('error', { error });
      return;
    } finally {
      this.#copying = false;
    }

    this.copied = true;
    this.query('.live').textContent = this.copiedLabel;
    this.emit('copy', { value: this.value });
    this.#sweep();
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => {
      this.copied = false;
      this.query('.live').textContent = '';
    }, this.resetAfter);
  }

  #sweep() {
    if (reducedMotion.matches) return;
    const sweep = this.query('.sweep');
    sweep.getAnimations().forEach((animation) => animation.cancel());
    sweep.animate(SWEEP, { duration: SWEEP_DURATION, easing: 'ease-out' });
    // The check draws itself in again on every copy.
    for (const animation of this.query('.check path').getAnimations()) {
      animation.cancel();
      animation.play();
    }
  }

  // The masked range of a secret: everything but a few characters at each end.
  get #maskedRange() {
    const length = this.value.length;
    return length > VISIBLE_EDGE * 2 + 2 ? [VISIBLE_EDGE, length - VISIBLE_EDGE] : [0, length];
  }

  #showText(text) {
    const [start, end] = this.#maskedRange;
    const masked = this.secret && !this.#revealed;
    this.query('.text').textContent =
      text ?? (masked ? this.value.slice(0, start) + MASK.repeat(end - start) + this.value.slice(end) : this.value);
  }

  // Masked characters scramble, then settle into the real ones left to right.
  #reveal(on) {
    if (!this.secret || on === this.#revealed) return;
    this.#revealed = on;
    cancelAnimationFrame(this.#frame);
    if (!on || reducedMotion.matches) return this.#showText();

    const [start, end] = this.#maskedRange;
    const begin = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - begin) / DECODE_DURATION, 1);
      const settled = start + Math.floor((end - start) * progress);
      const chars = [...this.value].map((char, i) => (i < settled || i >= end ? char : randomGlyph()));
      this.#showText(chars.join(''));
      if (progress < 1) this.#frame = requestAnimationFrame(tick);
    };
    this.#frame = requestAnimationFrame(tick);
  }
}
