import { closeButton, dismissBanner } from '../../core/banner.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight, chevronLeft, chevronRight, pause, play } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { swapStyles, swapText } from '../../core/swap.js';
import styles from './announcement-banner.scss?inline';

const DEMO_ITEMS = [
  { badge: 'New', text: 'The profiler now opens straight from a crash report', link: 'Read the post', href: '#' },
  { badge: 'Beta', text: 'Cross-compile to RISC-V from any machine', link: 'Try it', href: '#' },
  { badge: 'Event', text: 'Systems Night, Berlin, November 12', link: 'Save a seat', href: '#' },
];

/**
 * A strip of announcements that take turns. The segments on the left fill
 * while each is up, like stories; pointing at the strip holds it, and the
 * pause button stops it for good. The arrows step through, and the strip
 * can be dismissed. With reduced motion it starts paused.
 *
 * Items are `{ badge, text, link?, href? }`.
 *
 * @attr {number} index - The announcement shown
 * @attr {number} interval - Seconds each one stays up
 * @attr {boolean} paused
 * @attr {Array<object>} items (JSON)
 * @fires lw-change - Another announcement came up; `detail: { index }`
 * @fires lw-dismiss - The banner was dismissed
 */
export class LwAnnouncementBanner extends LwElement {
  static styles = [swapStyles, styles];
  static props = {
    index: { type: Number, default: 0, reflect: true },
    interval: { type: Number, default: 6 },
    paused: { type: Boolean, reflect: true },
    items: { type: Object, default: DEMO_ITEMS },
  };

  render() {
    return `<div class="bar" role="region" aria-roledescription="carousel" aria-label="Announcements"><span class="segments" aria-hidden="true"></span>
<p class="message" aria-live="polite"><span class="badge"><span class="dot"></span><span class="swap badge-text"></span></span><span class="swap text"></span><a class="link"><span class="swap link-text"></span>${strokeIcon(arrowRight, 16)}</a></p>
<div class="controls"><button class="icon-button" type="button" data-step="-1" aria-label="Previous">${strokeIcon(chevronLeft, 18)}</button><button class="icon-button" type="button" data-step="1" aria-label="Next">${strokeIcon(chevronRight, 18)}</button><button class="icon-button toggle" type="button"></button>${closeButton()}</div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.controls').addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.step) this.#go(this.index + Number(button.dataset.step));
      else if (button.classList.contains('toggle')) this.paused = !this.paused;
      else if (button.classList.contains('close')) dismissBanner(this);
    }, options);
    // The running segment is the timer: when it is full, the next one comes.
    this.query('.segments').addEventListener('animationend', () => this.#go(this.index + 1), options);
    if (reducedMotion.matches) this.paused = true;
  }

  updated(changed) {
    this.style.setProperty('--_interval', `${this.interval}s`);
    const items = this.items ?? [];
    const index = ((this.index % items.length) + items.length) % items.length;
    const item = items[index];
    if (!item) return;
    if (changed.has('items') || changed.has('index')) {
      // Rebuilt each time, so the running segment starts from empty.
      this.query('.segments').innerHTML = items.map((_, i) => `<span class="segment" data-state="${i < index ? 'done' : i === index ? 'running' : 'next'}"><span class="segment-fill"></span></span>`).join('');
    }
    swapText(this.query('.badge-text'), item.badge ?? '');
    swapText(this.query('.text'), item.text);
    const link = this.query('.link');
    link.hidden = !item.link;
    link.href = item.href ?? '#';
    swapText(this.query('.link-text'), item.link ?? '');
    const toggle = this.query('.toggle');
    toggle.innerHTML = strokeIcon(this.paused ? play : pause, 18);
    toggle.ariaLabel = this.paused ? 'Play' : 'Pause';
  }

  #go(index) {
    const count = this.items.length;
    this.index = ((index % count) + count) % count;
    this.emit('change', { index: this.index });
  }
}
