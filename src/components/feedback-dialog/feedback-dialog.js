import { escapeHtml } from '../../core/dom.js';
import { CHECK_ICON, iconStyles } from '../../core/icons.js';
import { LwModal, modalStyles } from '../../core/modal.js';
import '../button/index.js';
import styles from './feedback-dialog.scss?inline';

// The follow-up depends on the score: what to fix, what is missing, what works.
const FOLLOW_UPS = [
  { max: 6, kind: 'detractor', question: "What's the one thing we should fix first?", chips: ['Build times', 'Docs', 'Crash reports', 'Pricing'] },
  { max: 8, kind: 'passive', question: 'What would make it a 10?', chips: ['More targets', 'Faster profiler', 'Better docs', 'Integrations'] },
  { max: 10, kind: 'promoter', question: 'What do you like most?', chips: ['Binary size', 'Speed', 'The profiler', 'Support'] },
];

/**
 * A two-question survey: how likely you are to recommend the product, from
 * 0 to 10, then one follow-up that depends on the answer, with quick
 * picks and room to say more. The number keys pick a score too. Sending
 * thanks you and closes.
 *
 * @attr {string} product
 * @attr {number} score - The score picked; empty until then
 * @fires lw-feedback - Sent; `detail: { score, kind, reasons, comment }`
 */
export class LwFeedbackDialog extends LwModal {
  static styles = [modalStyles, iconStyles, styles];
  static props = {
    ...LwModal.props,
    product: { default: 'LowerSoft' },
    score: { type: Number },
  };

  #reasons = new Set();
  #lastDigitAt = 0;

  renderBody() {
    return `<div class="body"><h2 class="title" id="modal-title"></h2><p class="lead">Two questions, about 20 seconds.</p>
<div class="scale" role="radiogroup" aria-labelledby="modal-title">${Array.from({ length: 11 }, (_, i) => `<button class="score" type="button" role="radio" data-score="${i}">${i}</button>`).join('')}</div><p class="ends"><span>Not likely</span><span>Very likely</span></p>
<div class="follow"><p class="waiting">Pick a score and we'll ask one more thing</p><div class="asked" hidden><p class="question" id="follow-question"></p><div class="chips" role="group" aria-labelledby="follow-question"></div><textarea class="comment" rows="3" placeholder="Anything else? (optional)" aria-label="Comment"></textarea><div class="send-row"><lw-button class="send">Send</lw-button></div></div>
<div class="thanks" hidden><span class="thanks-mark">${CHECK_ICON}</span><p>Thank you. We read every one.</p></div></div></div>`;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    const scale = this.query('.scale');
    scale.addEventListener('click', (event) => {
      const score = event.target.closest('.score');
      if (score) this.score = Number(score.dataset.score);
    }, options);
    scale.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      this.score = Math.min(10, Math.max(0, (this.score ?? 5) + (this.score == null ? 0 : step)));
      scale.querySelector(`[data-score="${this.score}"]`).focus();
    }, options);
    // A number key picks that score, 0 for zero; "1" then "0" quickly makes ten.
    this.dialog.addEventListener('keydown', (event) => {
      if (!/^\d$/.test(event.key) || event.target.closest?.('textarea')) return;
      const digit = Number(event.key);
      this.score = this.score === 1 && digit === 0 && this.#lastDigitAt > Date.now() - 600 ? 10 : digit;
      this.#lastDigitAt = Date.now();
      this.query(`.score[data-score="${this.score}"]`).focus();
    }, options);
    this.query('.chips').addEventListener('click', (event) => {
      const chip = event.target.closest('.chip');
      if (!chip) return;
      const reason = chip.dataset.reason;
      if (this.#reasons.has(reason)) this.#reasons.delete(reason);
      else this.#reasons.add(reason);
      chip.ariaPressed = String(this.#reasons.has(reason));
    }, options);
    this.query('.send').addEventListener('click', () => this.#send(), options);
  }

  opened() {
    requestAnimationFrame(() => this.query('.score')?.focus());
  }

  updated(changed) {
    super.updated(changed);
    this.query('#modal-title').textContent = `How likely are you to recommend ${this.product} to a colleague?`;
    const picked = this.score != null && !Number.isNaN(this.score);
    for (const button of this.shadowRoot.querySelectorAll('.score')) {
      const checked = picked && Number(button.dataset.score) === this.score;
      button.ariaChecked = String(checked);
      button.tabIndex = checked || (!picked && button.dataset.score === '0') ? 0 : -1;
    }
    this.query('.follow').toggleAttribute('data-picked', picked);
    this.query('.waiting').hidden = picked;
    this.query('.asked').hidden = !picked;
    if (!picked || !changed.has('score')) return;
    const followUp = this.#followUp;
    if (this.query('.asked').dataset.kind !== followUp.kind) {
      this.query('.asked').dataset.kind = followUp.kind;
      this.#reasons.clear();
      this.query('.question').textContent = followUp.question;
      this.query('.chips').innerHTML = followUp.chips.map((chip) => `<button class="chip" type="button" aria-pressed="false" data-reason="${escapeHtml(chip)}">${escapeHtml(chip)}</button>`).join('');
    }
  }

  get #followUp() {
    return FOLLOW_UPS.find((each) => this.score <= each.max);
  }

  #send() {
    const detail = { score: this.score, kind: this.#followUp.kind, reasons: [...this.#reasons], comment: this.query('.comment').value.trim() };
    this.query('.asked').hidden = true;
    this.query('.thanks').hidden = false;
    this.emit('feedback', detail);
    setTimeout(() => this.hide('sent'), 1200);
  }
}
