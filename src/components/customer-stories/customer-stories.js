import { escapeHtml } from '../../core/dom.js';
import { moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { messageSquareText } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { drawFace, QUOTE_ICON, quoteMarkup } from '../../core/testimonial.js';
import styles from './customer-stories.scss?inline';

const DEMO_STORIES = [
  {
    id: 'halcyon',
    company: { name: 'Halcyon', color: '#12a594' },
    person: { name: 'Maya Okafor', role: 'Staff Engineer at Halcyon' },
    quote: 'We can see a release coming days ahead now. The build stopped being what stand-ups were about, and Friday deploys finally behave like a plan instead of a gamble.',
    href: '#halcyon',
  },
  {
    id: 'fieldnote',
    company: { name: 'Fieldnote', color: '#8e4ec6' },
    person: { name: 'Priya Raman', role: 'Director of Platform at Fieldnote' },
    quote: 'The remote cache paid for itself in the first week. A laptop on hotel wifi gets the same hits as the build farm, so nobody waits for a rebuild after a pull.',
    href: '#fieldnote',
  },
  {
    id: 'lumen',
    company: { name: 'Lumen', color: '#e5484d' },
    person: { name: 'Theo Laurent', role: 'Founder of Lumen' },
    quote: 'We ship firmware for six boards from one repository. Cross-compiling used to be a person on the team; now it is one command anyone can run.',
    href: '#lumen',
  },
  {
    id: 'parcel',
    company: { name: 'Parcel', color: '#f76b15' },
    person: { name: 'Sam Whitfield', role: 'Systems Engineer at Parcel' },
    quote: 'The sanitizer runs on every pull request now. Last year it found forty bugs in production; this year it found two, and both of them in review.',
    href: '#parcel',
  },
];

const ENTER = { duration: 420, easing: 'cubic-bezier(0.22, 0.7, 0.2, 1)' };

// A company's mark: its initial on a disc in its colour.
const markMarkup = (company) =>
  `<span class="mark" style="--_mark: ${escapeHtml(company?.color ?? '')}" aria-hidden="true">${escapeHtml((company?.name ?? '').charAt(0))}</span>`;

// A person's picture: their photo, or a face drawn from their name.
const avatarMarkup = (person, className) =>
  person?.avatar ? `<img class="${className}" src="${escapeHtml(person.avatar)}" alt="" loading="lazy" decoding="async">` : `<span class="${className} face" data-name="${escapeHtml(person?.name ?? '')}"></span>`;

/**
 * Customer stories behind a row of company tabs. Each tab shows the
 * company's mark beside the person's face and the company's name; the open
 * one is outlined in the company's colour, and the outline glides to the
 * next. Below, the person's portrait sits beside their quote, set large on a
 * panel washed in the company's colour, with a link to the whole story. A
 * new story slides in from the side of the tab it came from.
 *
 * The tabs follow the WAI-ARIA tabs pattern: one Tab stop, the arrow keys
 * move to and open the next story, wrapping, and Home and End jump to the
 * first and last. On narrow screens the tabs scroll sideways and the
 * portrait sits above the quote.
 *
 * Stories are `{ id, company: { name, color }, person: { name, role,
 * avatar? }, portrait?, quote, href? }`: `avatar` a small photo for the tab
 * and `portrait` a large one for the card, each in place of a face drawn
 * from the name; `==phrase==` marks a phrase of the quote. Without a colour
 * the quote panel is turned over in the opposite scheme instead.
 *
 * @attr {string} eyebrow - The badge above the heading; none when empty
 * @attr {string} heading
 * @attr {string} description - A line under the heading; none when empty
 * @attr {Array<object>} stories (JSON)
 * @attr {string} value - The open story's `id`; the first when empty
 * @attr {string} cta-label - The label of the link to the whole story
 * @fires lw-change - The visitor opened another story; `detail: { value }`
 * @csspart tabs - The row of tabs
 * @csspart portrait - The portrait card
 * @csspart story - The quote panel
 */
export class LwCustomerStories extends LwElement {
  static styles = styles;
  static props = {
    eyebrow: { default: 'Testimonials' },
    heading: { default: 'Why teams trust lower' },
    description: { default: '' },
    stories: { type: Object, default: DEMO_STORIES },
    value: { default: '', reflect: true },
    ctaLabel: { default: 'Read more' },
  };

  // The story shown last, so the next one knows which side to come from.
  #shown = -1;

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><p class="badge">${strokeIcon(messageSquareText, 14)}<span class="badge-text"></span></p><h2 class="title" id="heading"></h2><p class="description"></p></header>
<div class="tabs" part="tabs" role="tablist" aria-label="Customer stories"><span class="tab-highlight" aria-hidden="true"></span></div>
<div class="panel" id="panel" role="tabpanel" tabindex="0"><figure class="portrait" part="portrait"><span class="portrait-art"></span><figcaption class="who"><span class="who-mark"></span><span><span class="person-name"></span><span class="person-role"></span></span></figcaption></figure>
<div class="story" part="story">${QUOTE_ICON}<blockquote class="quote"><p class="quote-text"></p></blockquote><a class="cta"></a></div></div></section>`;
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
    this.query('.badge-text').textContent = this.eyebrow ?? '';
    this.query('.badge').hidden = !this.eyebrow;
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.description').hidden = !this.description;
    if (changed.has('stories')) this.#buildTabs();
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
    tabs.insertAdjacentHTML('beforeend', this.#stories.map((story, index) => `<button class="tab" type="button" role="tab" id="tab-${index}" data-index="${index}" aria-controls="panel" style="--_tint: ${escapeHtml(story.company?.color ?? '')}"><span class="tab-marks">${markMarkup(story.company)}${avatarMarkup(story.person, 'tab-face')}</span><span class="tab-name">${escapeHtml(story.company?.name ?? '')}</span></button>`).join(''));
    for (const face of tabs.querySelectorAll('.tab-face.face')) drawFace(face, face.dataset.name);
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
    const index = this.#index;
    const story = this.#stories[index];
    const panel = this.query('.panel');
    panel.hidden = !story;
    if (!story) return;
    this.shadowRoot.querySelectorAll('.tab').forEach((tab, at) => {
      tab.ariaSelected = String(at === index);
      tab.tabIndex = at === index ? 0 : -1;
    });
    const color = story.company?.color ?? '';
    this.query('.tabs').style.setProperty('--_tint', color);
    this.#placeHighlight();
    panel.setAttribute('aria-labelledby', `tab-${index}`);
    panel.style.setProperty('--_tint', color);
    panel.toggleAttribute('data-plain', !color);
    const art = this.query('.portrait-art');
    if (story.portrait) art.innerHTML = `<img class="portrait-image" src="${escapeHtml(story.portrait)}" alt="" decoding="async">`;
    else drawFace(art, story.person?.name);
    this.query('.portrait').toggleAttribute('data-photo', Boolean(story.portrait));
    this.query('.who-mark').innerHTML = markMarkup(story.company);
    this.query('.person-name').textContent = story.person?.name ?? '';
    this.query('.person-role').textContent = story.person?.role ?? '';
    this.query('.quote-text').innerHTML = quoteMarkup(story.quote ?? '');
    const cta = this.query('.cta');
    cta.textContent = this.ctaLabel ?? '';
    cta.hidden = !story.href || !this.ctaLabel;
    if (story.href) cta.setAttribute('href', story.href);
    else cta.removeAttribute('href');
    if (this.#shown >= 0 && this.#shown !== index && !reducedMotion.matches) {
      const side = index > this.#shown ? 1 : -1;
      const enter = { opacity: [0, 1], translate: [`${side * 1.5}rem 0`, '0 0'] };
      this.query('.portrait').animate(enter, ENTER);
      this.query('.story').animate(enter, { ...ENTER, delay: 60, fill: 'backwards' });
    }
    this.#shown = index;
  }

  #placeHighlight() {
    moveHighlight(this.query('.tab-highlight'), this.shadowRoot.querySelectorAll('.tab')[this.#index]);
  }
}
