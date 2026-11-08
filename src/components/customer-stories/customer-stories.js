import '../button/index.js';
import { escapeHtml } from '../../core/dom.js';
import { moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { messageSquareText } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { swapStyles, swapText } from '../../core/swap.js';
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

// The panel's colour, registered so it can ease from one company's to the
// next instead of jumping.
const TINT = '--_lw-customer-stories-tint';
let registered = false;
const register = () => {
  if (registered || !globalThis.CSS?.registerProperty) return;
  registered = true;
  try {
    CSS.registerProperty({ name: TINT, syntax: '<color>', inherits: true, initialValue: '#a1a1aa' });
  } catch {
    // Already registered by another copy of the library.
  }
};

const EASE_OUT = 'cubic-bezier(0.22, 0.7, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
// The story leaving fades and blurs away quickly; the next one settles in
// more slowly, its words a moment apart, spread over at most SPREAD ms.
const LEAVE = { duration: 260, easing: EASE_IN, fill: 'forwards' };
const SPREAD = 520;

// Wraps each word of `root`'s text in a span, marks and all, so the words
// can come in one after another.
const splitWords = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  for (const text of texts) {
    const words = document.createDocumentFragment();
    for (const part of text.data.split(/(\s+)/)) {
      if (!part) continue;
      words.append(/^\s+$/.test(part) ? part : Object.assign(document.createElement('span'), { className: 'word', textContent: part }));
    }
    text.replaceWith(words);
  }
  return [...root.querySelectorAll('.word')];
};

// A still copy of `element` laid exactly over it, to fade out as the real one changes.
const ghostOf = (element) => {
  const ghost = element.cloneNode(true);
  ghost.classList.add('ghost');
  ghost.removeAttribute('id');
  Object.assign(ghost.style, { position: 'absolute', margin: '0', left: `${element.offsetLeft}px`, top: `${element.offsetTop}px`, width: `${element.offsetWidth}px`, height: `${element.offsetHeight}px` });
  element.after(ghost);
  return ghost;
};

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
 * panel washed in the company's colour, with a button to the whole story.
 * Changing story, the panel's colour eases into the next company's; the
 * portrait and the quote blur away as the next ones come into focus, the
 * words a moment apart, and the name on the chip rolls over.
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
 * @attr {string} cta-label - The label of the button to the whole story
 * @fires lw-change - The visitor opened another story; `detail: { value }`
 * @fires lw-read - The button was pressed; `detail: { value, href }`. Unless cancelled, the page then goes to `href`
 * @csspart tabs - The row of tabs
 * @csspart portrait - The portrait card
 * @csspart story - The quote panel
 */
export class LwCustomerStories extends LwElement {
  static styles = [swapStyles, styles];
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
<div class="panel" id="panel" role="tabpanel" tabindex="0"><figure class="portrait" part="portrait"><span class="portrait-art"></span><figcaption class="who"><span class="who-mark"></span><span class="who-text"><span class="person-name swap"></span><span class="person-role swap"></span></span></figcaption></figure>
<div class="story" part="story">${QUOTE_ICON}<blockquote class="quote"><p class="quote-text"></p></blockquote><lw-button class="cta"></lw-button></div></div></section>`;
  }

  connected() {
    register();
    const options = { signal: this.signal };
    this.query('.cta').addEventListener('click', () => {
      const story = this.#stories[this.#index];
      if (this.emit('read', { value: story?.id ?? '', href: story?.href ?? '' }) && story?.href) location.assign(story.href);
    }, options);
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

  // Marks the open tab and fills the panel with its story. Changing story,
  // the old portrait and quote fade out over the new ones as those come in.
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
    const moving = this.#shown >= 0 && this.#shown !== index && !reducedMotion.matches;
    // The first story takes its colour at once; later ones ease into theirs.
    if (!moving) panel.style.transition = 'none';
    if (color) panel.style.setProperty(TINT, color);
    else panel.style.removeProperty(TINT);
    panel.toggleAttribute('data-plain', !color);
    if (!moving) {
      getComputedStyle(panel).getPropertyValue(TINT);
      panel.style.transition = '';
    }
    if (moving) this.#leave();
    this.#fill(story, moving);
    this.#shown = index;
  }

  // The portrait and the quote as they are now fade and blur away.
  #leave() {
    for (const ghost of this.shadowRoot.querySelectorAll('.ghost')) ghost.remove();
    for (const element of [this.query('.portrait-art'), this.query('.quote')]) {
      const ghost = ghostOf(element);
      const lift = element.classList.contains('quote') ? '0 -0.5rem' : '0 0';
      ghost.animate({ opacity: [1, 0], filter: ['blur(0)', 'blur(8px)'], translate: ['0 0', lift] }, LEAVE).finished.then(() => ghost.remove(), () => ghost.remove());
    }
  }

  #fill(story, moving) {
    const art = this.query('.portrait-art');
    if (story.portrait) art.innerHTML = `<img class="portrait-image" src="${escapeHtml(story.portrait)}" alt="" decoding="async">`;
    else drawFace(art, story.person?.name);
    this.query('.portrait').toggleAttribute('data-photo', Boolean(story.portrait));
    this.query('.who-mark').innerHTML = markMarkup(story.company);
    // The name and role roll over, and the chip eases to its new width.
    const who = this.query('.who');
    const from = who.offsetWidth;
    swapText(this.query('.person-name'), story.person?.name ?? '');
    swapText(this.query('.person-role'), story.person?.role ?? '');
    const to = who.offsetWidth;
    if (moving && from !== to) who.animate({ width: [`${from}px`, `${to}px`] }, { duration: 300, easing: EASE_OUT });
    const text = this.query('.quote-text');
    text.innerHTML = quoteMarkup(story.quote ?? '');
    const cta = this.query('.cta');
    cta.textContent = this.ctaLabel ?? '';
    cta.hidden = !this.ctaLabel;
    if (!moving) return;
    // The portrait comes into focus as it settles from a little larger.
    art.animate({ opacity: [0, 1], scale: [1.06, 1], filter: ['blur(10px)', 'blur(0)'] }, { duration: 720, delay: 60, easing: EASE_OUT, fill: 'backwards' });
    // The quote's words come into focus one after another.
    const words = splitWords(text);
    const step = Math.min(18, SPREAD / Math.max(words.length, 1));
    words.forEach((word, at) => word.animate({ opacity: [0, 1], translate: ['0 0.35em', '0 0'], filter: ['blur(6px)', 'blur(0)'] }, { duration: 560, delay: 120 + at * step, easing: EASE_OUT, fill: 'backwards' }));
  }

  #placeHighlight() {
    moveHighlight(this.query('.tab-highlight'), this.shadowRoot.querySelectorAll('.tab')[this.#index]);
  }
}
