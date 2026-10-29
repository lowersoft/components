import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { check } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './poll-card.scss?inline';

const DEMO_OPTIONS = [
  { id: 'tabs', label: 'Tabs', votes: 412 },
  { id: 'spaces', label: 'Spaces', votes: 538 },
  { id: 'both', label: 'Whatever the formatter says', votes: 291 },
];
// Undo stays this long after voting.
const UNDO_MS = 5000;
const COUNT_MS = 600;

/**
 * A one-question poll where choosing is voting: the bars grow to their
 * share, the percentages count up, and Undo stays for five seconds.
 *
 * Options are `{ id, label, votes }`, not counting this voter.
 *
 * @attr {string} question
 * @attr {Array<object>} options - The answers (JSON)
 * @attr {string} vote - The chosen option's id
 * @attr {string} note - A line under the total, e.g. "2 days left"
 * @fires lw-vote - A vote was cast; `detail: { option }`
 * @fires lw-undo - The vote was taken back
 */
export class LwPollCard extends LwElement {
  static styles = styles;
  static props = {
    question: { default: 'Tabs or spaces?' },
    options: { type: Object, default: DEMO_OPTIONS },
    vote: { default: '' },
    note: { default: '2 days left' },
  };

  #undoTimer = 0;
  // Set while this card changes its own vote, which it paints itself.
  #own = false;
  #frame = 0;

  render() {
    return `<p class="question"></p><ul class="options" role="radiogroup"></ul><div class="foot"><span class="total" aria-live="polite"></span><button class="undo" type="button" hidden><span class="undo-bar" aria-hidden="true"></span><span class="undo-label">Undo</span></button></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.options').addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (button) this.#cast(button.dataset.id);
    }, options);
    this.query('.undo').addEventListener('click', () => this.#undo(), options);
    this.signal.addEventListener('abort', () => {
      clearTimeout(this.#undoTimer);
      cancelAnimationFrame(this.#frame);
    });
  }

  updated(changed) {
    this.query('.question').textContent = this.question ?? '';
    this.query('.options').ariaLabel = this.question ?? '';
    if (changed.has('options')) {
      this.query('.options').innerHTML = this.options
        .map((option) => `<li><button type="button" role="radio" data-id="${escapeHtml(option.id)}"><span class="fill"></span><span class="label">${escapeHtml(option.label)}</span><span class="mark">${strokeIcon(check, 14)}</span><span class="share">0%</span></button></li>`)
        .join('');
    }
    if (!this.#own) this.#paint(false);
    this.#own = false;
  }

  // Counts with this voter's choice added.
  get #counts() {
    return this.options.map((option) => option.votes + (option.id === this.vote ? 1 : 0));
  }

  #paint(animate) {
    const voted = Boolean(this.vote);
    const counts = this.#counts;
    const total = counts.reduce((sum, n) => sum + n, 0);
    this.toggleAttribute('data-voted', voted);
    const shares = counts.map((n) => (total ? (n / total) * 100 : 0));
    this.shadowRoot.querySelectorAll('.options button').forEach((button, i) => {
      const chosen = button.dataset.id === this.vote;
      button.ariaChecked = String(chosen);
      button.toggleAttribute('data-chosen', chosen);
      // The bars grow to their share once voted; the leader takes the ink.
      button.style.setProperty('--_share', voted ? `${shares[i]}%` : '0%');
      button.toggleAttribute('data-leading', voted && counts[i] === Math.max(...counts));
    });
    this.#countUp(voted ? shares : shares.map(() => 0), animate);
    this.query('.total').textContent = `${total.toLocaleString('en-US')} votes${this.note ? ` · ${this.note}` : ''}`;
  }

  // The percentages count up to their share.
  #countUp(shares, animate) {
    cancelAnimationFrame(this.#frame);
    const labels = [...this.shadowRoot.querySelectorAll('.share')];
    const from = labels.map((label) => Number.parseFloat(label.textContent) || 0);
    const write = (t) => labels.forEach((label, i) => (label.textContent = `${Math.round(from[i] + (shares[i] - from[i]) * t)}%`));
    if (!animate || reducedMotion.matches) {
      write(1);
      return;
    }
    const start = performance.now();
    const frame = (now) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      write(1 - (1 - t) ** 3);
      if (t < 1) this.#frame = requestAnimationFrame(frame);
    };
    this.#frame = requestAnimationFrame(frame);
  }

  #cast(id) {
    if (id === this.vote) return;
    this.#own = true;
    this.vote = id;
    this.#paint(true);
    this.emit('vote', { option: this.options.find((option) => option.id === id) });
    // Undo stays for a few seconds, its bar running down.
    const undo = this.query('.undo');
    undo.hidden = false;
    undo.style.setProperty('--_undo', `${UNDO_MS}ms`);
    undo.classList.remove('running');
    undo.getBoundingClientRect();
    undo.classList.add('running');
    clearTimeout(this.#undoTimer);
    this.#undoTimer = setTimeout(() => (undo.hidden = true), UNDO_MS);
  }

  #undo() {
    clearTimeout(this.#undoTimer);
    this.query('.undo').hidden = true;
    this.#own = true;
    this.vote = '';
    this.#paint(true);
    this.query('.options button')?.focus();
    this.emit('undo');
  }
}
