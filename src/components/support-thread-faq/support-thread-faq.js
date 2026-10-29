import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowUp, rotateCcw } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { hueOf, initialsOf } from '../../core/people.js';
import styles from './support-thread-faq.scss?inline';

// The pace of a reply: seen, then typing for a time that grows with the
// answer, within bounds.
const SEEN_MS = 500;
const TYPING_DELAY_MS = 350;
const TYPING_MS_PER_CHAR = 12;
const TYPING_MIN_MS = 700;
const TYPING_MAX_MS = 1800;
// Words a question shares with an answered one before that answer fits.
const MATCH_WORDS = 2;
const STOP_WORDS = new Set('a an and are can do does for how i in is it me my of on or the there to what when where which who why will with you your'.split(' '));

const DEMO_ITEMS = [
  { question: 'Can I use it in client projects?', answer: "Yes, the license covers commercial work, including sites and apps you build for clients. You just can't resell the components as a kit." },
  { question: 'Is there a free trial?', answer: 'There is no trial, but every component has a live preview, and if it is not right for you, we refund within 14 days, no questions asked.' },
  { question: 'Do I get future updates?', answer: 'Yes. Every component we add or improve is yours, for as long as the library exists. No renewals.' },
  { question: 'How do team seats work?', answer: 'A team license covers up to ten people. Invite them from your account; anyone can be swapped out at any time.' },
  { question: 'Which frameworks are supported?', answer: 'Any. The components are standard custom elements, so they work in plain HTML, React, Vue, Svelte and the rest.' },
];

const wordsOf = (text) => new Set(text.toLowerCase().match(/[a-z0-9]+/g)?.filter((word) => !STOP_WORDS.has(word)) ?? []);

/**
 * A FAQ as a support chat. The agent greets you with the questions asked
 * most; tap one and it is sent as yours, marked seen, and answered after a
 * moment of typing. Ask your own and the closest answer comes back, or a
 * promise to reply by email when none fits. The reset button starts over.
 *
 * Items are `{ question, answer }`.
 *
 * @attr {string} agent - Who answers
 * @attr {string} company
 * @attr {string} reply - How soon they reply
 * @attr {string} greeting - The first message; by default, from the agent and company
 * @attr {string} fallback - The reply when no answer fits
 * @attr {Array<object>} items (JSON)
 * @fires lw-ask - A question was sent; `detail: { question, item }`, `item` null without an answer
 * @fires lw-reset - The thread started over
 */
export class LwSupportThreadFaq extends LwElement {
  static styles = styles;
  static props = {
    agent: { default: 'Mia Kowalski' },
    company: { default: 'Northwind' },
    reply: { default: 'Typically replies in 2 min' },
    greeting: {},
    fallback: { default: "Good question, and not one I can answer from here. I'll write back by email within the hour." },
    items: { type: Object, default: DEMO_ITEMS },
  };

  #asked = new Set();
  #timers = new Set();
  #busy = false;

  render() {
    return `<header class="head"><span class="avatar large"><span class="initials"></span><span class="online" title="Online"></span></span>
<div class="who"><p class="name"></p><p class="reply"></p></div><button class="reset" type="button" aria-label="Start over">${strokeIcon(rotateCcw, 18)}</button></header>
<div class="thread"><div class="log" role="log" aria-live="polite"></div><div class="suggestions" role="group" aria-label="Common questions"></div></div>
<form class="composer"><input class="input" type="text" placeholder="Ask your own question" aria-label="Your question" autocomplete="off"><button class="send" type="submit" aria-label="Send" disabled>${strokeIcon(arrowUp, 16)}</button></form>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.suggestions').addEventListener('click', (event) => {
      const chip = event.target.closest('.chip');
      if (chip) this.#ask(this.items[Number(chip.dataset.index)].question);
    }, options);
    const input = this.query('.input');
    input.addEventListener('input', () => this.#paintComposer(), options);
    this.query('.composer').addEventListener('submit', (event) => {
      event.preventDefault();
      const question = input.value.trim();
      if (!question || this.#busy) return;
      input.value = '';
      this.#ask(question);
    }, options);
    this.query('.reset').addEventListener('click', () => {
      this.#start();
      this.emit('reset');
    }, options);
    this.signal.addEventListener('abort', () => this.#clearTimers());
  }

  updated(changed) {
    this.query('.name').textContent = this.company ? `${this.#firstName} from ${this.company}` : (this.agent ?? '');
    this.query('.reply').textContent = this.reply ?? '';
    this.query('.initials').textContent = initialsOf(this.agent ?? '');
    this.style.setProperty('--_hue', hueOf(this.agent ?? ''));
    if (['items', 'agent', 'company', 'greeting'].some((name) => changed.has(name))) this.#start();
  }

  get #firstName() {
    return (this.agent ?? '').split(/\s+/)[0];
  }

  get #greeting() {
    return this.greeting ?? `Hi, I'm ${this.#firstName}${this.company ? ` from ${this.company}` : ''}. These come up the most. Tap one, or ask your own.`;
  }

  // Back to the greeting, every question on offer again.
  #start() {
    this.#clearTimers();
    this.#asked.clear();
    this.#busy = false;
    this.query('.log').replaceChildren();
    this.#say('agent', this.#greeting);
    this.#paintSuggestions();
    this.#paintComposer();
  }

  #paintSuggestions() {
    this.query('.suggestions').innerHTML = (this.items ?? [])
      .map((item, i) => (this.#asked.has(i) ? '' : `<button class="chip" type="button" data-index="${i}"${this.#busy ? ' disabled' : ''}>${escapeHtml(item.question)}</button>`))
      .join('');
  }

  #paintComposer() {
    this.query('.send').disabled = this.#busy || !this.query('.input').value.trim();
  }

  // Adds a message to the thread; a run of the agent's shares one avatar.
  #say(from, text) {
    const log = this.query('.log');
    let group = log.lastElementChild;
    if (group?.dataset.from !== from) {
      group = Object.assign(document.createElement('div'), { className: `group ${from}` });
      group.dataset.from = from;
      group.innerHTML = from === 'agent' ? `<span class="avatar small" aria-hidden="true">${escapeHtml(initialsOf(this.agent ?? ''))}</span><div class="bubbles"></div>` : '<div class="bubbles"></div>';
      log.append(group);
    }
    const bubble = Object.assign(document.createElement('p'), { className: 'bubble', textContent: text });
    group.querySelector('.bubbles').append(bubble);
    this.#scroll();
    return bubble;
  }

  // Sends `question` as yours, then answers it: seen, typing, the answer.
  #ask(question) {
    const index = this.items.findIndex((item) => item.question === question);
    const item = index >= 0 ? this.items[index] : this.#match(question);
    if (index >= 0) this.#asked.add(index);
    this.#busy = true;
    this.shadowRoot.querySelector('.seen')?.remove();
    const bubble = this.#say('you', question);
    this.#paintSuggestions();
    this.#paintComposer();
    this.emit('ask', { question, item: item ?? null });

    const answer = item?.answer ?? this.fallback ?? '';
    const pace = reducedMotion.matches ? 0 : 1;
    const typingMs = Math.min(TYPING_MAX_MS, Math.max(TYPING_MIN_MS, answer.length * TYPING_MS_PER_CHAR));
    this.#after(SEEN_MS * pace, () => {
      bubble.insertAdjacentHTML('afterend', '<span class="seen">Seen</span>');
      this.#scroll();
    });
    this.#after((SEEN_MS + TYPING_DELAY_MS) * pace, () => {
      const reply = this.#say('agent', '');
      reply.classList.add('typing');
      reply.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="visually-hidden">${escapeHtml(this.#firstName)} is typing</span>`;
      this.#after(typingMs * pace, () => {
        reply.classList.remove('typing');
        reply.textContent = answer;
        this.#busy = false;
        this.#paintSuggestions();
        this.#paintComposer();
        this.#scroll();
      });
    });
  }

  // The item sharing the most words with `question`, if it shares enough.
  #match(question) {
    const words = wordsOf(question);
    let best = null;
    let most = MATCH_WORDS - 1;
    for (const item of this.items ?? []) {
      const shared = [...wordsOf(`${item.question} ${item.answer}`)].filter((word) => words.has(word)).length;
      if (shared > most) [best, most] = [item, shared];
    }
    return best;
  }

  #scroll() {
    const thread = this.query('.thread');
    thread.scrollTo({ top: thread.scrollHeight, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }

  #after(ms, callback) {
    const timer = setTimeout(() => {
      this.#timers.delete(timer);
      callback();
    }, ms);
    this.#timers.add(timer);
  }

  #clearTimers() {
    for (const timer of this.#timers) clearTimeout(timer);
    this.#timers.clear();
  }
}
