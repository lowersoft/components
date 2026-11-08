import '../button/index.js';
import { accordionItem, connectAccordion, itemId, paintAccordion } from '../../core/accordion.js';
import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './consult-faq.scss?inline';

const DEMO_ITEMS = [
  { id: 'how-long', question: 'How long does a move to lower take?', answer: 'Most teams build their main branch on lower the same afternoon. Moving every pipeline takes one to two weeks, with both systems running side by side until you switch.' },
  { id: 'keep-ci', question: 'Can we keep our current CI while we try it?', answer: 'Yes. lower runs next to the CI you have, from the same repository, so you can compare build times before anything changes for the team.' },
  { id: 'onboarding', question: 'What is included in onboarding?', answer: 'A named engineer, a migration plan for your repository and a review of your cache hit rate after the first week. If a target will not build, we fix it with you.' },
];

const DEMO_CONSULT = {
  title: 'Want a walkthrough of your build?',
  body: 'We will go through your build graph, your slowest targets and what moving to lower would change, on a call with one of our engineers.',
  action: 'Book a walkthrough',
};

/**
 * A short FAQ on a softened photograph, with a way to talk to someone.
 * Over it, a badge, a centred headline and a line; on the photograph, a
 * consultation card offering a walkthrough on one side and numbered
 * question cards on the other, each with a plus in a round well that turns
 * into a cross when its answer opens. One answer is open at a time, the
 * first to start with. On narrow screens the questions follow the card.
 *
 * Answers open at once with reduced motion, and the arrow keys move between
 * questions. It suits three to five decisive questions.
 *
 * Items are `{ question, answer, id?, number? }`, numbered in order when
 * `number` is left out; the consultation is `{ title, body, action }`.
 * Without `photo` the panel draws its own softened scene.
 *
 * @attr {string} badge - The small label above the headline; none when empty
 * @attr {string} heading
 * @attr {string} description - A line under the headline; none when empty
 * @attr {Array<object>} items (JSON)
 * @attr {object} consult - The consultation card (JSON)
 * @attr {string} open - The open answer's id; the first when unset, none when empty
 * @attr {string} photo - A photograph behind the cards, an image's URL; drawn when empty
 * @attr {string} photo-alt - Leave empty when the photograph is decoration
 * @fires lw-toggle - An answer opened or closed; `detail: { id, open }`
 * @fires lw-action - The consultation's button was pressed; `detail: { action }`, "consult"
 * @csspart panel - The photograph and the cards on it
 * @csspart consult - The consultation card
 */
export class LwConsultFaq extends LwElement {
  static styles = styles;
  static props = {
    badge: { default: 'Migration' },
    heading: { default: 'What teams ask before they move' },
    description: { default: 'Caches, CI and the cut-over. These are the three we hear most.' },
    items: { type: Object, default: DEMO_ITEMS },
    consult: { type: Object, default: DEMO_CONSULT },
    open: {},
    photo: { default: '' },
    photoAlt: { default: '' },
  };

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><p class="badge"></p><h2 class="title" id="heading"></h2><p class="description"></p></header>
<div class="panel-stage" part="panel"><span class="scene" aria-hidden="true"></span><img class="photo" alt="" decoding="async" hidden>
<div class="consult" part="consult"><h3 class="consult-title"></h3><p class="consult-body"></p><lw-button class="book"></lw-button></div><div class="list"></div></div></section>`;
  }

  connected() {
    connectAccordion(this, this.query('.list'), () => this.#open, this.signal);
    this.query('.book').addEventListener('click', () => this.emit('action', { action: 'consult' }), { signal: this.signal });
  }

  updated(changed) {
    const text = (selector, value) => {
      const element = this.query(selector);
      element.textContent = value ?? '';
      element.hidden = !value;
    };
    text('.badge', this.badge);
    text('.title', this.heading);
    text('.description', this.description);
    const consult = this.consult ?? {};
    text('.consult-title', consult.title);
    text('.consult-body', consult.body);
    text('.book', consult.action);
    this.query('.consult').hidden = !consult.title && !consult.body && !consult.action;
    if (changed.has('items')) {
      this.query('.list').innerHTML = this.#items
        .map((item, at) => accordionItem(item, { lead: `<span class="number">${escapeHtml(String(item.number ?? at + 1))}.</span>`, icon: '<span class="well" aria-hidden="true"><span class="cross"></span></span>' }))
        .join('');
    }
    paintAccordion(this.query('.list'), this.#open);
    const photo = this.query('.photo');
    if (this.photo) photo.src = this.photo;
    photo.alt = this.photoAlt ?? '';
    photo.hidden = !this.photo;
    this.query('.panel-stage').toggleAttribute('data-photo', Boolean(this.photo));
  }

  get #items() {
    return Array.isArray(this.items) ? this.items : [];
  }

  // The first answer is open until the visitor or `open` says otherwise.
  get #open() {
    return this.open ?? (this.#items[0] ? itemId(this.#items[0]) : '');
  }
}
