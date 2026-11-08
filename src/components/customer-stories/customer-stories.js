import { escapeHtml } from '../../core/dom.js';
import { moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { companyMarkup, drawFace, quoteMarkup } from '../../core/testimonial.js';
import styles from './customer-stories.scss?inline';

const DEMO_STORIES = [
  {
    id: 'halcyon',
    company: { name: 'Halcyon', color: '#12a594' },
    person: { name: 'Maya Okafor', role: 'Staff Engineer' },
    quote: 'We moved 140 services onto lower in one quarter. The build stopped being what stand-ups were about and became ==the thing nobody mentions any more==.',
    metrics: [{ value: '−72%', label: 'median CI time' }, { value: '140', label: 'services moved in a quarter' }],
    href: '#halcyon',
  },
  {
    id: 'fieldnote',
    company: { name: 'Fieldnote', color: '#8e4ec6' },
    person: { name: 'Priya Raman', role: 'Director of Platform' },
    quote: 'The remote cache paid for itself in the first week. ==A laptop on hotel wifi gets the same hits as the build farm==, so nobody waits for a rebuild after a pull.',
    metrics: [{ value: '91%', label: 'cache hit rate' }, { value: '5×', label: 'faster clean builds' }],
    href: '#fieldnote',
  },
  {
    id: 'lumen',
    company: { name: 'Lumen', color: '#e5484d' },
    person: { name: 'Theo Laurent', role: 'Founder' },
    quote: 'We ship firmware for six boards from one repository. Cross-compiling used to be a person on the team; ==now it is one command==.',
    metrics: [{ value: '6', label: 'targets from one command' }, { value: '0', label: 'toolchains to install' }],
    href: '#lumen',
  },
  {
    id: 'parcel',
    company: { name: 'Parcel', color: '#f76b15' },
    person: { name: 'Sam Whitfield', role: 'Systems Engineer' },
    quote: 'The sanitizer runs on every pull request now. Last year it found forty bugs in production; this year ==it found two, both in review==.',
    metrics: [{ value: '−95%', label: 'memory bugs reaching production' }, { value: '3 min', label: 'sanitizer run per pull request' }],
    href: '#parcel',
  },
];

const ENTER = { duration: 380, easing: 'cubic-bezier(0.22, 0.7, 0.2, 1)' };

/**
 * Customer stories behind a row of company tabs. The chosen tab is outlined,
 * and the outline glides to the next one. Below it, the person's portrait
 * card sits beside their story: the quote large on a panel turned over in
 * the opposite scheme, the numbers that back it, and a link to the case
 * study. A new story slides in from the side of the tab it came from.
 *
 * The tabs follow the WAI-ARIA tabs pattern: one Tab stop, the arrow keys
 * move to and open the next story, wrapping, and Home and End jump to the
 * first and last. On narrow screens the tabs scroll sideways and the
 * portrait sits above the story.
 *
 * Stories are `{ id, company: { name, color }, person: { name, role },
 * quote, metrics?: [{ value, label }], href? }`, `==phrase==` marking a
 * phrase of the quote in the company's colour.
 *
 * @attr {string} eyebrow - The short line above the heading; none when empty
 * @attr {string} heading
 * @attr {string} description - A line under the heading; none when empty
 * @attr {Array<object>} stories (JSON)
 * @attr {string} value - The open story's `id`; the first when empty
 * @attr {string} cta-label - The case study link's label
 * @fires lw-change - The visitor opened another story; `detail: { value }`
 * @csspart tabs - The row of tabs
 * @csspart portrait - The portrait card
 * @csspart story - The story panel
 */
export class LwCustomerStories extends LwElement {
  static styles = styles;
  static props = {
    eyebrow: { default: 'Customer stories' },
    heading: { default: 'How teams build with lower' },
    description: { default: 'Four teams, four codebases, one build that stopped getting in the way.' },
    stories: { type: Object, default: DEMO_STORIES },
    value: { default: '', reflect: true },
    ctaLabel: { default: 'Read the case study' },
  };

  // The story shown last, so the next one knows which side to come from.
  #shown = -1;

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><p class="eyebrow"></p><h2 class="title" id="heading"></h2><p class="description"></p></header>
<div class="tabs" part="tabs" role="tablist" aria-label="Customer stories"><span class="tab-highlight" aria-hidden="true"></span></div>
<div class="panel" id="panel" role="tabpanel" tabindex="0"><figure class="portrait" part="portrait"><span class="portrait-face"></span><figcaption class="who"><span class="person-name"></span><span class="person-role"></span></figcaption></figure>
<div class="story" part="story"><div class="story-top"></div><blockquote class="quote"></blockquote><dl class="metrics"></dl><a class="cta"><span class="cta-label"></span>${strokeIcon(arrowRight, 14)}</a></div></div></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    const tabs = this.query('.tabs');
    tabs.addEventListener('click', (event) => {
      const tab = event.target.closest('.tab');
      if (tab) this.#choose(Number(tab.dataset.index));
    }, options);
    tabs.addEventListener('keydown', (event) => this.#key(event), options);
    // The outline follows its tab as the row wraps or resizes.
    const observer = new ResizeObserver(() => this.#placeHighlight());
    observer.observe(tabs);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    this.query('.eyebrow').textContent = this.eyebrow ?? '';
    this.query('.eyebrow').hidden = !this.eyebrow;
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.description').hidden = !this.description;
    if (changed.has('stories')) this.#buildTabs();
    this.query('.cta-label').textContent = this.ctaLabel ?? '';
    this.#show();
  }

  get #stories() {
    return Array.isArray(this.stories) ? this.stories : [];
  }

  get #index() {
    return Math.max(0, this.#stories.findIndex((story) => story.id === this.value));
  }

  #buildTabs() {
    const tabs = this.query('.tabs');
    tabs.querySelectorAll('.tab').forEach((tab) => tab.remove());
    tabs.insertAdjacentHTML('beforeend', this.#stories.map((story, index) => `<button class="tab" type="button" role="tab" id="tab-${index}" data-index="${index}" aria-controls="panel">${companyMarkup(story.company)}</button>`).join(''));
    this.#shown = -1;
  }

  #choose(index) {
    const story = this.#stories[index];
    if (!story || index === this.#index) return;
    this.value = story.id ?? '';
    this.emit('change', { value: this.value });
  }

  #key(event) {
    const tabs = [...this.shadowRoot.querySelectorAll('.tab')];
    const index = tabs.indexOf(event.target.closest('.tab'));
    if (index < 0) return;
    const moves = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: tabs.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + tabs.length) % tabs.length;
    this.#choose(next);
    tabs[next].focus();
  }

  // Marks the open tab and fills the panel with its story; a new story
  // slides in from the side of the tab it came from.
  #show() {
    const stories = this.#stories;
    const index = this.#index;
    const story = stories[index];
    this.query('.panel').hidden = !story;
    if (!story) return;
    this.shadowRoot.querySelectorAll('.tab').forEach((tab, at) => {
      tab.ariaSelected = String(at === index);
      tab.tabIndex = at === index ? 0 : -1;
    });
    this.#placeHighlight();
    const panel = this.query('.panel');
    panel.setAttribute('aria-labelledby', `tab-${index}`);
    panel.style.setProperty('--_tint', story.company?.color ?? '');
    drawFace(this.query('.portrait-face'), story.person?.name);
    this.query('.person-name').textContent = story.person?.name ?? '';
    this.query('.person-role').textContent = [story.person?.role, story.company?.name].filter(Boolean).join(', ');
    this.query('.story-top').innerHTML = companyMarkup(story.company);
    this.query('.quote').innerHTML = quoteMarkup(story.quote ?? '');
    const metrics = Array.isArray(story.metrics) ? story.metrics : [];
    this.query('.metrics').innerHTML = metrics.map((metric) => `<div class="metric"><dt class="metric-label">${escapeHtml(metric.label ?? '')}</dt><dd class="metric-value">${escapeHtml(metric.value ?? '')}</dd></div>`).join('');
    this.query('.metrics').hidden = !metrics.length;
    const cta = this.query('.cta');
    cta.hidden = !story.href || !this.ctaLabel;
    if (story.href) cta.setAttribute('href', story.href);
    else cta.removeAttribute('href');
    if (this.#shown >= 0 && this.#shown !== index && !reducedMotion.matches) {
      const side = index > this.#shown ? 1 : -1;
      const enter = { opacity: [0, 1], translate: [`${side * 1.25}rem 0`, '0 0'] };
      this.query('.portrait').animate(enter, ENTER);
      this.query('.story').animate(enter, { ...ENTER, delay: 50, fill: 'backwards' });
    }
    this.#shown = index;
  }

  #placeHighlight() {
    moveHighlight(this.query('.tab-highlight'), this.shadowRoot.querySelectorAll('.tab')[this.#index]);
  }
}
