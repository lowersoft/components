import { escapeHtml } from '../../core/dom.js';
import { CHECK_ICON, iconStyles, strokeIcon } from '../../core/icons.js';
import { messageSquareText } from '../../core/lucide.js';
import { LwModal, modalStyles } from '../../core/modal.js';
import { reducedMotion } from '../../core/motion.js';
import '../button/index.js';
import '../checkbox/index.js';
import '../textarea/index.js';
import styles from './feedback-dialog.scss?inline';

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const SEND_MS = 700;
const COMMENT_MAX = 500;

// The follow-up depends on the score: what to fix, what is missing, what works.
const FOLLOW_UPS = [
  { max: 6, kind: 'detractor', question: "What's the one thing we should fix first?", chips: ['Performance', 'Documentation', 'Stability', 'Pricing', 'Support'] },
  { max: 8, kind: 'passive', question: 'What would make it a 10?', chips: ['More features', 'Better performance', 'Clearer docs', 'Integrations'] },
  { max: 10, kind: 'promoter', question: 'What do you like most?', chips: ['Ease of use', 'Speed', 'Reliability', 'Support', 'Value for money'] },
];

/**
 * Product feedback in a dialog: how likely you are to recommend the product,
 * from 0 to 10 on one strip, then a follow-up that opens beneath it and
 * depends on the answer, with quick picks, a comment and leave to contact
 * you. The number keys pick a score too. Sending waits on `send` if set,
 * then thanks you.
 *
 * Set `send` to `async (feedback) => void` to deliver it; a rejection keeps
 * the form as it was. Without it, sending is simulated.
 *
 * @attr {string} product
 * @attr {number} score - The score picked; empty until then
 * @fires lw-feedback - Sent; `detail: { score, kind, reasons, comment, contact }`
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
    return `<div class="form-view"><header class="head"><span class="mark" aria-hidden="true">${strokeIcon(messageSquareText, 18)}</span><div><h2 class="title" id="modal-title">Share your feedback</h2><p class="lead">Two quick questions. We read every response.</p></div></header>
<div class="body"><fieldset class="question-block"><legend class="question score-question"></legend><div class="scale" role="radiogroup" aria-label="Score from 0 to 10">${Array.from({ length: 11 }, (_, i) => `<button class="score" type="button" role="radio" data-score="${i}">${i}</button>`).join('')}</div><p class="ends" aria-hidden="true"><span>Not likely</span><span>Extremely likely</span></p></fieldset>
<div class="follow" hidden><div class="question-block"><p class="question" id="follow-question"></p><div class="chips" role="group" aria-labelledby="follow-question"></div></div>
<lw-textarea class="comment" label="Anything else?" placeholder="Tell us more (optional)" rows="3" autosize max-rows="6" maxlength="${COMMENT_MAX}" counter></lw-textarea>
<lw-checkbox class="contact">You can contact me about this feedback</lw-checkbox></div></div>
<footer class="foot"><span class="hint"><kbd>0</kbd>–<kbd>9</kbd> to pick a score</span><lw-button class="cancel" variant="ghost">Cancel</lw-button><lw-button class="send" disabled>Send feedback</lw-button></footer></div>
<div class="thanks" hidden role="status"><span class="thanks-mark">${CHECK_ICON}</span><h2 class="title">Thanks for your feedback</h2><p class="lead">It goes straight to the team building ${'<span class="product-name"></span>'}.</p><lw-button class="done" variant="outline">Close</lw-button></div>`;
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
      if (!/^\d$/.test(event.key) || event.composedPath().some((node) => node.localName === 'lw-textarea' || node.localName === 'textarea')) return;
      if (!this.query('.thanks').hidden) return;
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
    this.query('.cancel').addEventListener('click', () => this.hide('dismiss'), options);
    this.query('.send').addEventListener('click', () => this.#send(), options);
    this.query('.done').addEventListener('click', () => this.hide('sent'), options);
    this.addEventListener('lw-close', () => this.#reset(), options);
  }

  opened() {
    requestAnimationFrame(() => this.query('.score')?.focus());
  }

  updated(changed) {
    super.updated(changed);
    this.query('.score-question').textContent = `How likely are you to recommend ${this.product} to a friend or colleague?`;
    this.query('.product-name').textContent = this.product ?? '';
    const picked = this.score != null && !Number.isNaN(this.score);
    for (const button of this.shadowRoot.querySelectorAll('.score')) {
      const checked = picked && Number(button.dataset.score) === this.score;
      button.ariaChecked = String(checked);
      button.tabIndex = checked || (!picked && button.dataset.score === '0') ? 0 : -1;
    }
    this.query('.send').disabled = !picked;
    if (!changed.has('score')) return;
    this.#showFollowUp(picked);
  }

  get #followUp() {
    return FOLLOW_UPS.find((each) => this.score <= each.max);
  }

  // The follow-up opens under the scale the first time a score is picked,
  // and changes its question when the score moves to another kind.
  #showFollowUp(picked) {
    const follow = this.query('.follow');
    if (!picked) {
      follow.hidden = true;
      return;
    }
    const followUp = this.#followUp;
    if (follow.dataset.kind !== followUp.kind) {
      follow.dataset.kind = followUp.kind;
      this.#reasons.clear();
      this.query('.question:not(.score-question)').textContent = followUp.question;
      this.query('.chips').innerHTML = followUp.chips.map((chip) => `<button class="chip" type="button" aria-pressed="false" data-reason="${escapeHtml(chip)}">${escapeHtml(chip)}</button>`).join('');
    }
    if (!follow.hidden) return;
    const dialog = this.dialog;
    const before = dialog.offsetHeight;
    follow.hidden = false;
    if (reducedMotion.matches || !dialog.open) return;
    dialog.animate({ height: [`${before}px`, `${dialog.offsetHeight}px`] }, { duration: 320, easing: EASE_OUT });
    follow.animate({ opacity: [0, 1], translate: ['0 0.5rem', '0 0'] }, { duration: 280, delay: 60, easing: EASE_OUT, fill: 'backwards' });
  }

  async #send() {
    if (this.score == null) return;
    const detail = { score: this.score, kind: this.#followUp.kind, reasons: [...this.#reasons], comment: (this.query('.comment').value ?? '').trim(), contact: Boolean(this.query('.contact').checked) };
    const send = this.query('.send');
    send.loading = true;
    try {
      await (this.send ? this.send(detail) : new Promise((resolve) => setTimeout(resolve, SEND_MS)));
    } catch {
      return;
    } finally {
      send.loading = false;
    }
    const dialog = this.dialog;
    const before = dialog.offsetHeight;
    this.query('.form-view').hidden = true;
    this.query('.thanks').hidden = false;
    this.emit('feedback', detail);
    if (!reducedMotion.matches) {
      dialog.animate({ height: [`${before}px`, `${dialog.offsetHeight}px`] }, { duration: 320, easing: EASE_OUT });
      this.query('.thanks').animate({ opacity: [0, 1], scale: [0.97, 1] }, { duration: 260, easing: EASE_OUT });
    }
    this.query('.done').focus();
  }

  // Closed, it starts over for the next time.
  #reset() {
    this.score = undefined;
    this.#reasons.clear();
    this.query('.comment').value = '';
    this.query('.contact').checked = false;
    this.query('.form-view').hidden = false;
    this.query('.thanks').hidden = true;
    const follow = this.query('.follow');
    follow.hidden = true;
    delete follow.dataset.kind;
  }
}
