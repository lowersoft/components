import '../button/index.js';
import { accordionItem, connectAccordion, itemId, paintAccordion } from '../../core/accordion.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { drawFace } from '../../core/testimonial.js';
import styles from './support-card-faq.scss?inline';

const DEMO_ITEMS = [
  { id: 'minutes', question: 'How are build minutes counted?', answer: 'From the moment a runner starts your job to the moment it uploads the last artifact, rounded up to the second. Steps served from the cache cost nothing.' },
  { id: 'one-invoice', question: 'Can seats and minutes sit on the same invoice?', answer: 'Yes. Seats are billed at the start of the period and minutes at its end, on one invoice with a line for each workspace.' },
  { id: 'period', question: 'When does a billing period close?', answer: 'On the same calendar day each month, at 00:00 UTC. Minutes used after that land on the next invoice.' },
  { id: 'raw-usage', question: 'Who can see raw usage, not just totals?', answer: 'Owners and billing admins. Usage is broken down by repository, branch and runner, and exports to CSV.' },
  { id: 'wrong-minutes', question: 'What if a runner bills the wrong minutes?', answer: 'Flag the job from its page and we credit the difference on the next invoice, usually within a working day.' },
  { id: 'annual', question: 'Do you take annual commitments?', answer: 'Yes, from 50 seats up. An annual plan holds the price for the year and adds a pool of minutes at a lower rate.' },
  { id: 'payment', question: 'How do I add a payment method?', answer: 'From Settings, under Billing. Cards and SEPA debit work everywhere, and invoices can be paid by bank transfer.' },
];

const DEMO_SUPPORT = {
  title: 'Need a hand with billing?',
  body: 'Write in and a named person on billing will walk through the invoice with you.',
  action: 'Talk to billing',
  you: '+ You',
};

const DEMO_TEAM = ['Maya Okafor', 'Theo Laurent', 'Iris Novak'];

/**
 * A numbered FAQ beside a support card. On the left, the heading, a line
 * and a card that hands the reader to a person: the faces of the team
 * that replies, ending in a place for the reader, a title, a sentence and a
 * button. On wide screens that column stays in view while the questions
 * scroll. On the right, numbered questions; the open one turns over in the
 * opposite scheme and its plus becomes a minus. One answer is open at a
 * time, the first to start with.
 *
 * Answers open at once with reduced motion, and the arrow keys move between
 * questions. The card is turned over in the opposite scheme, or takes a
 * colour of its own from `--lw-support-card-faq-accent` and
 * `--lw-support-card-faq-on-accent`.
 *
 * Items are `{ question, answer, id?, number? }`, numbered in order when
 * `number` is left out; the support card is `{ title, body, action, you }`.
 *
 * @attr {string} heading
 * @attr {string} description - A line under the heading; none when empty
 * @attr {Array<object>} items (JSON)
 * @attr {object} support - The support card (JSON)
 * @attr {Array<string>} team (JSON) - The names whose faces show on the card, up to three
 * @attr {string} open - The open answer's id; the first when unset, none when empty
 * @fires lw-toggle - An answer opened or closed; `detail: { id, open }`
 * @fires lw-action - The card's button was pressed; `detail: { action }`, "support"
 * @csspart support - The support card
 * @cssprop --lw-support-card-faq-accent - The support card's colour; the text colour by default
 * @cssprop --lw-support-card-faq-on-accent - The text on the support card; the page's background by default
 */
export class LwSupportCardFaq extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Frequently asked questions' },
    description: { default: 'Straight answers on minutes, invoices and who can see the usage.' },
    items: { type: Object, default: DEMO_ITEMS },
    support: { type: Object, default: DEMO_SUPPORT },
    team: { type: Object, default: DEMO_TEAM },
    open: {},
  };

  render() {
    return `<section class="section" aria-labelledby="heading"><div class="side"><h2 class="title" id="heading"></h2><p class="description"></p>
<div class="support" part="support"><div class="people"><span class="faces"></span><span class="you"></span></div><h3 class="support-title"></h3><p class="support-body"></p>
<lw-button class="talk"><span class="talk-label"></span><span class="talk-arrow" slot="end">${strokeIcon(arrowRight, 14)}</span></lw-button></div></div>
<div class="list"></div></section>`;
  }

  connected() {
    connectAccordion(this, this.query('.list'), () => this.#open, this.signal);
    this.query('.talk').addEventListener('click', () => this.emit('action', { action: 'support' }), { signal: this.signal });
  }

  updated(changed) {
    const text = (selector, value) => {
      const element = this.query(selector);
      element.textContent = value ?? '';
      element.hidden = !value;
    };
    text('.title', this.heading);
    text('.description', this.description);
    const support = this.support ?? {};
    text('.support-title', support.title);
    text('.support-body', support.body);
    text('.you', support.you);
    this.query('.talk-label').textContent = support.action ?? '';
    this.query('.talk').hidden = !support.action;
    if (changed.has('team')) {
      const faces = this.query('.faces');
      faces.replaceChildren();
      for (const name of (Array.isArray(this.team) ? this.team : []).slice(0, 3)) {
        const face = Object.assign(document.createElement('span'), { className: 'face' });
        faces.append(face);
        drawFace(face, name);
      }
    }
    if (changed.has('items')) {
      this.query('.list').innerHTML = this.#items
        .map((item, at) => accordionItem(item, { lead: `<span class="number">${escapeHtml(String(item.number ?? at + 1))}.</span>`, icon: '<span class="sign" aria-hidden="true"></span>' }))
        .join('');
    }
    paintAccordion(this.query('.list'), this.#open);
  }

  get #items() {
    return Array.isArray(this.items) ? this.items : [];
  }

  // The first answer is open until the visitor or `open` says otherwise.
  get #open() {
    return this.open ?? (this.#items[0] ? itemId(this.#items[0]) : '');
  }
}
