import '../button/index.js';
import { accordionItem, connectAccordion, itemId, paintAccordion } from '../../core/accordion.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight, plus } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { drawFace } from '../../core/testimonial.js';
import styles from './pill-faq.scss?inline';

const DEMO_ITEMS = [
  { id: 'limit', question: 'Is there a limit on builds?', answer: 'No. Start as many builds as you like; you pay for the minutes runners spend on them, and steps served from the cache are free.' },
  { id: 'reserve', question: 'Do I need to reserve a runner?', answer: 'No. A job starts on the next free runner in your region, usually within seconds. Reserved runners are there if you want a guaranteed slot.' },
  { id: 'guests', question: 'Can I invite a guest to a workspace?', answer: 'Yes. Guests read builds and logs for free, and need a seat only to start runs of their own.' },
  { id: 'boards', question: 'Do you lend boards for device tests?', answer: 'Yes. Each region keeps a rack of real boards, from Raspberry Pi to STM32 and ESP32, booked by the hour from the dashboard.' },
  { id: 'yearly', question: 'How does the yearly plan work?', answer: 'You pay for the year up front and two months come free. Unused minutes roll over to the next month for as long as the plan runs.' },
];

/**
 * A FAQ as a conversation, in a dashed frame. A large centred headline and
 * a line sit at the top; the questions are pills, and opening one brings
 * its answer in as a reply bubble from the person who answers, their face
 * at the bubble's foot. Closed questions carry a round plus at the far end
 * of their row. Two actions close the frame. Dashed guides run down both
 * sides and across between the parts, like a sheet of squared paper.
 *
 * One answer is open at a time, the first to start with; answers open at
 * once with reduced motion, and the arrow keys move between questions.
 * Set `--lw-color-primary` and `--lw-color-primary-foreground` on it to give
 * the main action a colour of its own.
 *
 * Items are `{ question, answer, id? }`; without an id, one is made from the
 * question.
 *
 * @attr {string} heading
 * @attr {string} description - A line under the headline; none when empty
 * @attr {Array<object>} items (JSON)
 * @attr {string} person - Who answers, named for their face; drawn from the name unless `avatar` is given
 * @attr {string} avatar - Their photo, an image's URL
 * @attr {string} primary - The main action's label
 * @attr {string} secondary - The second action's label; none when empty
 * @attr {string} open - The open answer's id; the first when unset, none when empty
 * @slot actions - Your own actions, such as links, instead of the two buttons
 * @fires lw-toggle - An answer opened or closed; `detail: { id, open }`
 * @fires lw-action - One of the two buttons was pressed; `detail: { action }`, "primary" or "secondary"
 * @csspart frame - The dashed frame
 */
export class LwPillFaq extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'FAQ' },
    description: { default: 'Runners, minutes and the free plan. Write to us if your question is not on the list.' },
    items: { type: Object, default: DEMO_ITEMS },
    person: { default: 'Maya Okafor' },
    avatar: { default: '' },
    primary: { default: 'Write to us' },
    secondary: { default: 'Read the full guide' },
    open: {},
  };

  render() {
    return `<section class="frame" part="frame" aria-labelledby="heading"><header class="head"><h2 class="title" id="heading"></h2><p class="description"></p></header>
<div class="list"></div>
<div class="actions"><slot name="actions"><lw-button class="secondary" data-action="secondary" variant="outline"></lw-button><lw-button class="primary" data-action="primary"><span class="primary-label"></span><span slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button></slot></div></section>`;
  }

  connected() {
    connectAccordion(this, this.query('.list'), () => this.#open, this.signal);
    this.query('.actions').addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (button) this.emit('action', { action: button.dataset.action });
    }, { signal: this.signal });
  }

  updated(changed) {
    const text = (selector, value) => {
      const element = this.query(selector);
      element.textContent = value ?? '';
      element.hidden = !value;
    };
    text('.title', this.heading);
    text('.description', this.description);
    this.query('.primary-label').textContent = this.primary ?? '';
    this.query('.primary').hidden = !this.primary;
    text('.secondary', this.secondary);
    if (changed.has('items') || changed.has('person') || changed.has('avatar')) this.#build();
    paintAccordion(this.query('.list'), this.#open);
  }

  get #items() {
    return Array.isArray(this.items) ? this.items : [];
  }

  // The first answer is open until the visitor or `open` says otherwise.
  get #open() {
    return this.open ?? (this.#items[0] ? itemId(this.#items[0]) : '');
  }

  // Each answer is a reply from the person who answers, their face at its foot.
  #build() {
    const face = this.avatar ? `<img class="face" src="${escapeHtml(this.avatar)}" alt="${escapeHtml(this.person ?? '')}" loading="lazy" decoding="async">` : `<span class="face" role="img" aria-label="${escapeHtml(this.person ?? '')}"></span>`;
    const list = this.query('.list');
    list.innerHTML = this.#items
      .map((item) => accordionItem(item, { icon: `<span class="add" aria-hidden="true">${strokeIcon(plus, 14)}</span>`, body: `<div class="reply">${face}<p class="bubble">${escapeHtml(item.answer ?? '')}</p></div>` }))
      .join('');
    if (!this.avatar) for (const each of list.querySelectorAll('span.face')) drawFace(each, this.person);
  }
}
