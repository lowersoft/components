import { escapeHtml } from '../../core/dom.js';
import { CHECK_ICON, SPINNER_ICON, iconStyles, strokeIcon } from '../../core/icons.js';
import { fileText } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { hueOf, initialsOf } from '../../core/people.js';
import { swapStyles, swapText } from '../../core/swap.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './inline-chips-headline.scss?inline';

// How long the status chip works before it lands.
const WORKING_MS = 1800;

/**
 * A headline with live chips set into the sentence: a document, the people
 * on it, and a status that works for a moment and then lands. The chips pop
 * in one after another when the headline comes into view; press the status
 * to run it again.
 *
 * The heading places the chips with `{doc}`, `{team}` and `{status}`.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} doc - The document chip's label
 * @attr {Array<string>} team - The people (JSON)
 * @attr {string} working - The status while it runs
 * @attr {string} done - The status once it lands
 * @fires lw-done - The status landed
 */
export class LwInlineChipsHeadline extends LwElement {
  static styles = [iconStyles, swapStyles, styles];
  static props = {
    heading: { default: 'Write the patch {doc}, review it with {team} your team, and ship it {status} before lunch.' },
    description: { default: 'One workspace for the diff, the review and the release, so the work never waits on a handoff.' },
    doc: { default: 'alloc-fix.c' },
    team: { type: Object, default: ['Ana Moreno', 'Jules Laurent', 'Sam Okafor'] },
    working: { default: 'Building' },
    done: { default: 'Deployed' },
  };

  #timer = 0;
  #shown = false;

  render() {
    return '<h2 class="title"></h2><p class="description"></p>';
  }

  connected() {
    this.shadowRoot.addEventListener('click', (event) => event.target.closest('.status') && this.#run(), { signal: this.signal });
    watchVisibility(this, (visible) => visible && this.#show(), this.signal);
    this.signal.addEventListener('abort', () => clearTimeout(this.#timer));
  }

  updated() {
    const chips = {
      doc: `<span class="chip doc"><span class="doc-icon">${strokeIcon(fileText, 18)}</span>${escapeHtml(this.doc ?? '')}</span>`,
      team: `<span class="chip team" role="img" aria-label="${escapeHtml((this.team ?? []).join(', '))}">${(this.team ?? []).map((name) => `<span class="avatar" style="--_hue: ${hueOf(name)}">${escapeHtml(initialsOf(name))}</span>`).join('')}</span>`,
      status: '<button class="chip status" type="button" aria-label="Run again"><span class="status-icon"></span><span class="swap status-text" aria-live="polite"></span></button>',
    };
    const parts = escapeHtml(this.heading ?? '').split(/(\{doc\}|\{team\}|\{status\})/);
    this.query('.title').innerHTML = parts.map((part) => chips[part.slice(1, -1)] ?? part).join('');
    this.query('.description').textContent = this.description ?? '';
    this.shadowRoot.querySelectorAll('.chip').forEach((chip, i) => chip.style.setProperty('--_order', i));
    this.toggleAttribute('data-shown', this.#shown || reducedMotion.matches);
    this.#land();
  }

  // Pops the chips in, then runs the status, the first time it is seen.
  #show() {
    if (this.#shown) return;
    this.#shown = true;
    this.setAttribute('data-shown', '');
    this.#run();
  }

  #run() {
    clearTimeout(this.#timer);
    const status = this.query('.status');
    if (!status) return;
    status.dataset.state = 'working';
    status.querySelector('.status-icon').innerHTML = SPINNER_ICON;
    swapText(status.querySelector('.status-text'), this.working ?? '');
    this.#timer = setTimeout(() => {
      this.#land();
      this.emit('done');
    }, reducedMotion.matches ? 0 : WORKING_MS);
  }

  #land() {
    const status = this.query('.status');
    if (!status) return;
    status.dataset.state = 'done';
    status.querySelector('.status-icon').innerHTML = CHECK_ICON;
    swapText(status.querySelector('.status-text'), this.done ?? '');
  }
}
