import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowLeft, arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { initialsOf } from '../../core/people.js';
import { companyMarkup, drawFace, quoteMarkup } from '../../core/testimonial.js';
import styles from './testimonial-spotlight.scss?inline';

const DEMO_ITEMS = [
  { company: { name: 'Northwind', color: '#3b6ef5' }, quote: 'We replaced three internal libraries with one runtime. Code review stopped being about allocations and ==started being about the product.==', person: { name: 'Maya Okafor', role: 'Staff Engineer, Northwind' } },
  { company: { name: 'Halcyon', color: '#12a594' }, quote: 'Cold starts went from seconds to milliseconds, and ==nobody on the team had to become a compiler expert.==', person: { name: 'Daniel Reyes', role: 'CTO, Halcyon' } },
  { company: { name: 'Parcel', color: '#f76b15' }, quote: 'We ship one 1.4 MB binary to every edge node now. ==The deploy is a file copy.==', person: { name: 'Priya Nair', role: 'Platform Lead, Parcel' } },
  { company: { name: 'Mosaic', color: '#d6409f' }, quote: 'Every hot path has a benchmark next to it, so ==regressions show up in review, not in production.==', person: { name: 'Tomás Alvarez', role: 'Performance Engineer, Mosaic' } },
  { company: { name: 'Tandem', color: '#0090ff' }, quote: 'Half the machines, the same traffic. ==The bill paid for the migration in a month.==', person: { name: 'Sofia Lindgren', role: 'VP Engineering, Tandem' } },
];

const pad = (n) => String(n).padStart(2, '0');

/**
 * One quote at a time, large, its last words brought forward. The ring
 * around the speaker's face fills while the quote is up, then the next one
 * comes; pointing at it or focusing in it holds the quote, and with reduced
 * motion it waits for you. The others wait as initials beside the speaker;
 * the arrow buttons and keys step through them.
 *
 * Items are `{ company: { name, color }, quote, person: { name, role } }`,
 * with `==words==` brought forward.
 *
 * @attr {number} index - The quote shown
 * @attr {number} interval - Seconds each quote stays up
 * @attr {Array<object>} items (JSON)
 * @fires lw-change - Another quote came up; `detail: { index }`
 */
export class LwTestimonialSpotlight extends LwElement {
  static styles = styles;
  static props = {
    index: { type: Number, default: 0, reflect: true },
    interval: { type: Number, default: 7 },
    items: { type: Object, default: DEMO_ITEMS },
  };

  render() {
    return `<section class="stage" aria-roledescription="carousel" aria-label="Customer stories"><div class="slide" aria-live="off"><p class="company-line"></p><blockquote class="text"></blockquote></div>
<footer class="bar"><div class="speaker"><span class="ring"><svg viewBox="0 0 44 44" aria-hidden="true"><circle class="track" cx="22" cy="22" r="21"/><circle class="progress" cx="22" cy="22" r="21" pathLength="1"/></svg><span class="face"></span></span><span><span class="person-name"></span><span class="person-role"></span></span></div>
<div class="others" role="tablist" aria-label="Stories"></div><div class="nav"><span class="counter" aria-hidden="true"></span><button class="step" type="button" data-step="-1" aria-label="Previous story">${strokeIcon(arrowLeft, 16)}</button><button class="step" type="button" data-step="1" aria-label="Next story">${strokeIcon(arrowRight, 16)}</button></div></footer></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.nav').addEventListener('click', (event) => {
      const step = event.target.closest('.step');
      if (step) this.#go(this.index + Number(step.dataset.step), true);
    }, options);
    this.query('.others').addEventListener('click', (event) => {
      const other = event.target.closest('.other');
      if (other) this.#go(Number(other.dataset.index), true);
    }, options);
    // The arrow keys move along the speakers, as in any tab list.
    this.query('.others').addEventListener('keydown', (event) => {
      const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
      if (!step) return;
      event.preventDefault();
      this.#go(this.index + step, true);
      this.query(`.other[data-index="${this.index}"]`)?.focus();
    }, options);
    // The ring filling up is the timer: when it is full, the next quote comes.
    this.query('.progress').addEventListener('animationend', () => this.#go(this.index + 1, false), options);
  }

  updated(changed) {
    this.style.setProperty('--_interval', `${this.interval}s`);
    if (changed.has('items')) {
      this.query('.others').innerHTML = this.items
        .map((item, i) => `<button class="other" type="button" role="tab" data-index="${i}" aria-label="${escapeHtml(item.person.name)}, ${escapeHtml(item.company.name)}">${escapeHtml(initialsOf(item.person.name))}</button>`)
        .join('');
    }
    this.#paint(!changed.has('items'));
  }

  #paint(animate) {
    const items = this.items ?? [];
    const index = ((this.index % items.length) + items.length) % items.length;
    const item = items[index];
    if (!item) return;
    const slide = this.query('.slide');
    this.query('.company-line').innerHTML = companyMarkup(item.company);
    this.query('.text').innerHTML = quoteMarkup(item.quote);
    drawFace(this.query('.face'), item.person.name);
    this.query('.person-name').textContent = item.person.name;
    this.query('.person-role').textContent = item.person.role;
    this.query('.counter').textContent = `${pad(index + 1)} / ${pad(items.length)}`;
    this.shadowRoot.querySelectorAll('.other').forEach((other, i) => {
      other.ariaSelected = String(i === index);
      other.tabIndex = i === index ? 0 : -1;
    });
    // Restarts the ring for this quote.
    const progress = this.query('.progress');
    progress.classList.remove('running');
    progress.getBoundingClientRect();
    progress.classList.add('running');
    if (animate && !reducedMotion.matches) {
      slide.animate({ opacity: [0, 1], filter: ['blur(4px)', 'blur(0)'], translate: ['0 0.5rem', '0 0'] }, { duration: 500, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    }
  }

  // Shows another quote; one chosen by hand is read out.
  #go(index, byHand) {
    const count = this.items.length;
    this.query('.slide').ariaLive = byHand ? 'polite' : 'off';
    this.index = ((index % count) + count) % count;
    this.emit('change', { index: this.index });
  }
}
