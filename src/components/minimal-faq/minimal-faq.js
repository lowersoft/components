import { writeClipboard } from '../../core/clipboard.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { check, link2 } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf, initialsOf } from '../../core/people.js';
import '../button/index.js';
import styles from './minimal-faq.scss?inline';

const COPIED_MS = 1600;
const HASH = 'faq-';

const DEMO_ITEMS = [
  { question: 'Can I change plans later?', answer: 'Yes. Move up or down from Settings at any time; upgrades take effect at once and downgrades at the end of the billing cycle.' },
  { question: 'What happens when my trial ends?', answer: 'Your workspace moves to the Free plan. Nothing is deleted: Pro features pause until you upgrade, and everything you made stays where it is.' },
  { question: 'How does seat billing work?', answer: 'You pay for members who can edit. Viewers and guests are free and unlimited. When someone joins mid-month we charge only for the days left in the cycle.' },
  { question: 'Where is my data stored?', answer: 'In the region you pick when you create the workspace: the EU or the US. Backups stay in the same region, encrypted at rest.' },
  { question: 'Do you offer discounts for nonprofits and schools?', answer: 'Yes, half off any paid plan. Write to us from your organisation’s address and we will set it up within a day.' },
  { question: 'Can I cancel anytime?', answer: 'Anytime, from Settings, in two clicks. You keep access until the end of the period you paid for, and can export everything first.' },
];

const DEMO_TEAM = ['Ana Moreno', 'Jules Laurent', 'Sam Okafor'];

// An answer's id, from its question unless it has its own.
const idOf = (item) => item.id ?? item.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * A quiet FAQ: the heading and a way to reach the team on one side,
 * hairline questions on the other. One answer opens at a time while the
 * other questions step back. Every answer has its own link, and
 * `#faq-<id>` in the address opens that answer on load. The arrow keys move
 * between questions.
 *
 * Items are `{ question, answer, id? }`; without an id, one is made from the
 * question.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {Array<string>} team - The people who reply (JSON)
 * @attr {string} reply - How soon they reply
 * @attr {Array<object>} items - The questions (JSON)
 * @attr {string} open - The open answer's id
 * @fires lw-toggle - An answer opened or closed; `detail: { id, open }`
 * @fires lw-ask - "Ask us" was chosen
 */
export class LwMinimalFaq extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Questions, answered' },
    description: { default: 'Plans, billing and your data, in plain words. Anything we missed, write to us and a person replies.' },
    team: { type: Object, default: DEMO_TEAM },
    reply: { default: 'Usually reply within 2 hours' },
    items: { type: Object, default: DEMO_ITEMS },
    open: { default: '', reflect: true },
  };

  render() {
    return `<div class="layout"><div class="side"><h2 class="title"></h2><p class="description"></p>
<div class="team"><span class="faces"></span><span class="reply"></span></div><lw-button class="ask">Ask us</lw-button></div>
<div class="list"></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const list = this.query('.list');
    list.addEventListener('click', (event) => {
      const copy = event.target.closest('.copy');
      if (copy) return this.#copy(copy);
      const trigger = event.target.closest('.trigger');
      if (trigger) this.#toggle(trigger.dataset.id);
    }, options);
    list.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.ask').addEventListener('click', () => this.emit('ask'), options);
    // `#faq-<id>` opens that answer, on load and whenever it changes.
    window.addEventListener('hashchange', () => this.#fromHash(true), options);
    this.#fromHash(false);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.reply').textContent = this.reply ?? '';
    if (changed.has('team')) {
      this.query('.faces').innerHTML = (this.team ?? []).map((name) => `<span class="face" style="--_hue: ${hueOf(name)}" title="${escapeHtml(name)}">${escapeHtml(initialsOf(name))}</span>`).join('');
    }
    if (changed.has('items')) this.#build();
    this.#paint();
  }

  #build() {
    this.query('.list').innerHTML = (this.items ?? [])
      .map((item) => {
        const id = escapeHtml(idOf(item));
        return `<div class="item" id="${HASH}${id}"><h3 class="question"><button class="trigger" type="button" data-id="${id}" aria-expanded="false" aria-controls="answer-${id}"><span>${escapeHtml(item.question)}</span><span class="cross" aria-hidden="true"></span></button></h3>
<div class="panel" id="answer-${id}" role="region" aria-label="${escapeHtml(item.question)}"><div class="clip"><p class="answer">${escapeHtml(item.answer)}</p><button class="copy" type="button" data-id="${id}">${strokeIcon(link2, 14)}<span>Copy link</span></button></div></div></div>`;
      })
      .join('');
  }

  // One answer open; the other questions step back while it is.
  #paint() {
    this.query('.list').toggleAttribute('data-open', Boolean(this.open));
    for (const trigger of this.shadowRoot.querySelectorAll('.trigger')) {
      const open = trigger.dataset.id === this.open;
      trigger.ariaExpanded = String(open);
      trigger.closest('.item').toggleAttribute('data-open', open);
      // A closed answer is out of the tab order and the accessibility tree.
      trigger.closest('.item').querySelector('.panel').inert = !open;
    }
  }

  #toggle(id) {
    const open = this.open === id ? '' : id;
    this.open = open;
    this.emit('toggle', { id, open: Boolean(open) });
  }

  #fromHash(scroll) {
    if (!location.hash.startsWith(`#${HASH}`)) return;
    const id = decodeURIComponent(location.hash.slice(HASH.length + 1));
    if (!(this.items ?? []).some((item) => idOf(item) === id)) return;
    this.open = id;
    if (scroll) requestAnimationFrame(() => this.query(`#${HASH}${CSS.escape(id)}`)?.scrollIntoView({ block: 'center' }));
  }

  // Copies the answer's own link, and says so for a moment.
  async #copy(button) {
    const url = new URL(location.href);
    url.hash = `${HASH}${button.dataset.id}`;
    try {
      await writeClipboard(url.href);
    } catch {
      return;
    }
    const label = button.querySelector('span');
    button.querySelector('svg').outerHTML = strokeIcon(check, 14);
    label.textContent = 'Copied';
    setTimeout(() => {
      button.querySelector('svg').outerHTML = strokeIcon(link2, 14);
      label.textContent = 'Copy link';
    }, COPIED_MS);
  }

  // Up and down move between questions; Home and End go to the ends.
  #key(event) {
    const trigger = event.target.closest('.trigger');
    if (!trigger) return;
    const triggers = [...this.shadowRoot.querySelectorAll('.trigger')];
    const index = triggers.indexOf(trigger);
    const next = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: triggers.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    triggers[(next + triggers.length) % triggers.length].focus();
  }
}
