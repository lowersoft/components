import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import '../button/index.js';
import styles from './onboarding-checklist.scss?inline';

const DEMO_STEPS = [
  { id: 'profile', title: 'Complete your profile', description: 'Add a photo and a short bio so your team knows who you are.', action: 'Edit profile' },
  { id: 'invite', title: 'Invite your team', description: 'Projects move faster together. Invite up to five teammates for free.', action: 'Invite people' },
  { id: 'project', title: 'Create your first project', description: 'Start from a template or an empty repo, then build it on every push.', action: 'New project' },
  { id: 'integrate', title: 'Connect a repository', description: 'Build every push from GitHub or GitLab, and post the results to Slack.', action: 'Connect a repo' },
  { id: 'notify', title: 'Set up notifications', description: 'Choose what reaches you, and where: email, desktop or mobile.', action: 'Open settings' },
];

const RING = 2 * Math.PI * 18;
const CHECK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" pathLength="1"/></svg>';

/**
 * A get-started checklist. A progress ring counts the steps done; the next
 * step is open with its description and action, and each step folds away
 * as it is checked. When every step is done the card turns into an all-set
 * state, which can be dismissed.
 *
 * Steps are `{ id, title, description?, action? }`; `action` labels the
 * step's button.
 *
 * @attr {string} heading
 * @attr {Array<object>} steps - The steps (JSON)
 * @attr {Array<string>} done - Ids of the steps done (JSON); kept up to date
 * @fires lw-change - A step was checked or unchecked; `detail: { id, done }`
 * @fires lw-action - A step's action was pressed; `detail: { id }`
 * @fires lw-complete - Every step is done
 * @fires lw-dismiss - The all-set state was dismissed
 */
export class LwOnboardingChecklist extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Get started' },
    steps: { type: Object, default: DEMO_STEPS },
    done: { type: Object, default: ['profile'] },
  };

  #wasComplete = null;

  render() {
    return `<div class="head"><div class="ring" aria-hidden="true"><svg viewBox="0 0 44 44"><circle class="track" cx="22" cy="22" r="18"/><circle class="arc" cx="22" cy="22" r="18" stroke-dasharray="${RING}"/></svg><span class="count"></span><span class="tick">${CHECK}</span></div><div class="titles"><p class="heading"></p><p class="left" aria-live="polite"></p></div></div>
<ol class="steps"></ol>
<div class="all-set"><p class="set-title">You're all set</p><p class="set-text">Everything is in place. You can find these steps again in Settings.</p><lw-button class="dismiss" variant="secondary" size="sm">Dismiss</lw-button></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.steps').addEventListener('click', (event) => this.#click(event), options);
    this.query('.dismiss').addEventListener('click', () => {
      this.hidden = true;
      this.emit('dismiss');
    }, options);
  }

  updated(changed) {
    if (changed.has('steps')) this.#build();
    this.query('.heading').textContent = this.heading ?? '';
    this.#paint();
  }

  get #done() {
    return new Set(this.done ?? []);
  }

  #build() {
    this.query('.steps').innerHTML = this.steps
      .map(
        (step) =>
          `<li data-id="${escapeHtml(step.id)}"><div class="row"><button class="check" type="button" role="checkbox">${CHECK}</button><span class="title">${escapeHtml(step.title)}</span></div><div class="fold"><div class="fold-inner">${step.description ? `<p class="description">${escapeHtml(step.description)}</p>` : ''}${step.action ? `<lw-button class="action" size="sm">${escapeHtml(step.action)}</lw-button>` : ''}</div></div></li>`,
      )
      .join('');
  }

  #paint() {
    const done = this.#done;
    const total = this.steps.length;
    const count = this.steps.filter(({ id }) => done.has(id)).length;
    // The next step not done is open.
    const next = this.steps.find(({ id }) => !done.has(id))?.id;
    for (const li of this.shadowRoot.querySelectorAll('.steps li')) {
      const checked = done.has(li.dataset.id);
      li.toggleAttribute('data-done', checked);
      li.toggleAttribute('data-open', li.dataset.id === next);
      const box = li.querySelector('.check');
      box.ariaChecked = String(checked);
      box.ariaLabel = li.querySelector('.title').textContent;
      li.querySelector('.fold').inert = li.dataset.id !== next;
    }
    this.query('.arc').style.strokeDashoffset = String(RING * (1 - (total ? count / total : 0)));
    this.query('.count').textContent = `${count}/${total}`;
    const left = total - count;
    this.query('.left').textContent = left ? `${left} step${left === 1 ? '' : 's'} left` : 'All done';
    const complete = total > 0 && left === 0;
    this.toggleAttribute('data-complete', complete);
    this.query('.steps').inert = complete;
    this.query('.all-set').inert = !complete;
    if (complete && this.#wasComplete === false) {
      this.emit('complete');
      if (!reducedMotion.matches) this.query('.ring').animate([{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], { duration: 420, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
    }
    this.#wasComplete = complete;
  }

  #click(event) {
    const li = event.target.closest('li');
    if (!li) return;
    const { id } = li.dataset;
    if (event.target.closest('.action')) {
      this.emit('action', { id });
      return;
    }
    if (!event.target.closest('.check')) return;
    const done = this.#done;
    const checked = !done.has(id);
    if (checked) done.add(id);
    else done.delete(id);
    this.done = this.steps.map((step) => step.id).filter((stepId) => done.has(stepId));
    this.emit('change', { id, done: checked });
  }
}
