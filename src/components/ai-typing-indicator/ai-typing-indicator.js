import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './ai-typing-indicator.scss?inline';

// Small animated glyphs, one per kind of work. Each moves in CSS.
const ICONS = {
  think: '<g class="orbit"><circle class="star s1" cx="12" cy="5.5" r="1.9"/><circle class="star s2" cx="18" cy="15.5" r="1.6"/><circle class="star s3" cx="6" cy="15.5" r="1.4"/></g><circle cx="12" cy="12" r="1.1" opacity="0.5"/>',
  search: '<g class="lens"><circle cx="10" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m14 14 4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g><path class="spark" d="M19 3.5v3M17.5 5h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  read: '<rect x="5" y="3.5" width="14" height="17" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.45"/><rect class="scan" x="7" y="6.6" width="10" height="2.8" rx="1.2" opacity="0.35"/>',
  write: '<path class="stroke" d="M4 19.5c2.5-1.5 4-1.5 5.5 0s3 1.5 5.5 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" pathLength="1"/><g class="pen"><path d="m14.5 4.5 3 3-7 7H7.5v-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></g>',
  code: '<path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect class="caret" x="11" y="8" width="2" height="8" rx="1"/>',
};

// A plain phrase takes its glyph from its words.
const iconFor = (text) => {
  const words = String(text).toLowerCase();
  if (/search|look|find|brows|fetch/.test(words)) return 'search';
  if (/read|review|scan|analy|check/.test(words)) return 'read';
  if (/writ|draft|compos|repl|summar/.test(words)) return 'write';
  if (/code|run|build|compil|test|debug/.test(words)) return 'code';
  return 'think';
};

const glyph = (name) => `<svg class="icon icon-${name}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS[name] ?? ICONS.think}</svg>`;

/**
 * Shows that an assistant is working. `shimmer` runs light across a label
 * beside a small animated glyph; `wave` lifts the letters one after
 * another; `dots` bounces three dots in a reply bubble; `matrix` ripples a
 * grid of points out from its center.
 *
 * Given phrases, it steps through them, each blurring in over the last
 * with its own glyph (taken from its words unless set), and can count the
 * seconds of the current run, starting over when the phrases loop. Screen
 * readers hear the label once, not every phrase. With reduced motion the
 * glyphs and dots hold still and phrases swap without the blur.
 *
 * Phrases are strings or `{ label, icon }`; icons are `think`, `search`,
 * `read`, `write` and `code`.
 *
 * @attr {'shimmer'|'wave'|'dots'|'matrix'} variant
 * @attr {string} label - What assistive technology hears, for every variant
 * @attr {Array<string|object>} phrases (JSON) - Shown in turn instead of the label
 * @attr {'think'|'search'|'read'|'write'|'code'} icon - The glyph without phrases; from the label by default
 * @attr {number} interval - Milliseconds each phrase stays
 * @attr {boolean} show-elapsed - Counts the seconds of the current run (shimmer and wave)
 * @attr {boolean} no-bubble - Dots without the reply bubble
 * @attr {'sm'|'md'|'lg'} size - The text size every part scales from
 */
export class LwAiTypingIndicator extends LwElement {
  static styles = styles;
  static props = {
    variant: { default: 'shimmer', reflect: true },
    label: { default: 'Thinking' },
    phrases: { type: Object },
    icon: {},
    interval: { type: Number, default: 2400 },
    showElapsed: { type: Boolean, reflect: true },
    noBubble: { type: Boolean, reflect: true },
    size: { default: 'md', reflect: true },
  };

  #index = 0;
  #started = 0;
  #timer = 0;
  #clock = 0;

  render() {
    return '<span class="status" role="status"></span><span class="visual" aria-hidden="true"></span>';
  }

  connected() {
    this.#started = performance.now();
    this.#schedule();
    this.signal.addEventListener('abort', () => {
      clearTimeout(this.#timer);
      clearInterval(this.#clock);
    });
  }

  updated(changed) {
    // Said once: changing phrases never reaches the live region.
    this.query('.status').textContent = this.label || 'Thinking';
    if (['variant', 'phrases', 'label', 'icon'].some((prop) => changed.has(prop))) {
      this.#index = 0;
      this.#started = performance.now();
      this.#build();
    }
    if (changed.has('interval') || changed.has('phrases')) this.#schedule();
    this.#tickElapsed();
  }

  get #list() {
    const phrases = Array.isArray(this.phrases) ? this.phrases.filter(Boolean) : [];
    if (!phrases.length) return [{ label: this.label || 'Thinking', icon: this.icon || iconFor(this.label) }];
    return phrases.map((each) => (typeof each === 'string' ? { label: each, icon: iconFor(each) } : { label: each.label ?? '', icon: each.icon || iconFor(each.label) }));
  }

  #build() {
    const visual = this.query('.visual');
    const variant = this.variant;
    if (variant === 'dots') {
      visual.innerHTML = '<span class="bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';
    } else if (variant === 'matrix') {
      // Each point waits by its distance from the center, so rings ripple out.
      visual.innerHTML = `<span class="matrix">${Array.from({ length: 9 }, (_, i) => `<span class="cell" style="--_ring: ${Math.hypot((i % 3) - 1, Math.floor(i / 3) - 1).toFixed(2)}"></span>`).join('')}</span>`;
    } else {
      visual.innerHTML = '<span class="line"><span class="slot"></span><span class="elapsed"></span></span>';
      this.query('.slot').append(this.#phrase(this.#list[0]));
    }
  }

  #phrase({ label, icon }) {
    const element = document.createElement('span');
    element.className = 'phrase';
    const text = this.variant === 'wave'
      ? `<span class="text wave">${[...label].map((char, i) => `<span class="letter" style="--_i: ${i}">${char === ' ' ? '&nbsp;' : escapeHtml(char)}</span>`).join('')}</span>`
      : `<span class="text shimmer">${escapeHtml(label)}</span>`;
    element.innerHTML = `${this.variant === 'shimmer' ? glyph(icon) : ''}${text}`;
    return element;
  }

  #schedule() {
    clearTimeout(this.#timer);
    clearInterval(this.#clock);
    if (!this.isConnected) return;
    this.#clock = setInterval(() => this.#tickElapsed(), 250);
    if (this.#list.length < 2 || !['shimmer', 'wave'].includes(this.variant)) return;
    this.#timer = setTimeout(() => {
      this.#next();
      this.#schedule();
    }, Math.max(400, this.interval || 2400));
  }

  // The next phrase blurs in over the last; the count restarts on a loop.
  #next() {
    const list = this.#list;
    this.#index = (this.#index + 1) % list.length;
    if (this.#index === 0) this.#started = performance.now();
    const slot = this.query('.slot');
    if (!slot) return;
    const old = slot.querySelector('.phrase:last-child');
    const fresh = this.#phrase(list[this.#index]);
    slot.append(fresh);
    if (reducedMotion.matches) {
      old?.remove();
      return;
    }
    const ease = 'cubic-bezier(0.23, 1, 0.32, 1)';
    fresh.animate({ opacity: [0, 1], filter: ['blur(6px)', 'blur(0)'], transform: ['translateY(0.35em)', 'none'] }, { duration: 520, easing: ease });
    old?.animate({ opacity: [1, 0], filter: ['blur(0)', 'blur(6px)'], transform: ['none', 'translateY(-0.35em)'] }, { duration: 360, easing: ease, fill: 'forwards' }).finished.then(() => old.remove(), () => old.remove());
  }

  #tickElapsed() {
    const elapsed = this.query('.elapsed');
    if (!elapsed) return;
    elapsed.hidden = !this.showElapsed;
    elapsed.textContent = `${Math.floor((performance.now() - this.#started) / 1000)}s`;
  }
}
