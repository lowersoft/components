import '../button/index.js';
import { LOWERSOFT } from '../../core/brand.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { activity, arrowRight, chevronDown, circleCheck, fileText, gitBranch, mic, plus, squareTerminal } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { graphemes } from '../../core/text.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './workspace-composer.scss?inline';

const DEMO_POINTS = [
  'Find the commit that slowed the build without leaving the prompt',
  'Attach the profile lower already recorded for the run',
  'Open the fix as a pull request in the same sentence',
];

const DEMO_CHIPS = [
  { label: 'CI runs', icon: 'runs' },
  { label: 'Profiler', icon: 'profiler' },
  { label: 'Repository', icon: 'repository' },
];

const DEMO_CLAIMS = [
  { index: '01', title: 'Reads what lower already records', body: 'CI runs, profiles and crash dumps sit on the card. Nobody pastes in a log the build already has.' },
  { index: '02', title: 'Asks before it merges', body: 'It drafts the branch and the pull request, then waits for a person on the team to approve the merge.' },
  { index: '03', title: 'Every step on the record', body: 'Each command it runs lands in the audit log, and any change it makes can be reverted for a day.' },
];

const CHIP_ICONS = { runs: squareTerminal, profiler: activity, repository: gitBranch, logs: fileText, tests: circleCheck };

// How fast the prompt types itself in, in characters a second.
const TYPE_SPEED = 55;

/**
 * An assistant feature beside its composer. On the left, an eyebrow, the
 * headline, a sentence, a few points and two actions; on the right, a
 * composer card over a softened landscape, holding one long, specific
 * request, the model it goes to and the tools it can reach, as chips under
 * the card. Three numbered claims run along the bottom, parted by rules.
 *
 * The composer is a picture of the product: its buttons sit in soft wells
 * like keys pressed into the surface, and take no input. The first time it
 * comes into view the request types itself in, and the send key lights up
 * once it is written; with reduced motion it is simply there. On narrow
 * screens the composer moves under the copy and the claims stack.
 *
 * Chips are `{ label, icon }`, `icon` one of runs, profiler, repository,
 * logs or tests; claims are `{ index, title, body }`. Without `photo` the
 * stage draws its own softened mountains.
 *
 * @attr {string} eyebrow - The short line above the heading; none when empty
 * @attr {string} heading
 * @attr {string} description
 * @attr {Array<string>} points (JSON) - The points under the description
 * @attr {string} primary - The main action's label
 * @attr {string} secondary - The second action's label; none when empty
 * @attr {string} prompt - The request in the composer
 * @attr {string} model-label - The model's name on the pill
 * @attr {string} model-mark - The model's mark on the pill, an image's URL; Lowersoft's badge by default, none when empty
 * @attr {Array<object>} chips (JSON)
 * @attr {Array<object>} claims (JSON)
 * @attr {string} photo - A landscape behind the composer, an image's URL; drawn when empty
 * @attr {string} photo-alt
 * @slot actions - Your own actions, such as links, instead of the two buttons
 * @fires lw-action - One of the two buttons was pressed; `detail: { action }`, "primary" or "secondary"
 * @csspart stage - The landscape and the composer on it
 * @csspart composer - The composer card
 */
export class LwWorkspaceComposer extends LwElement {
  static styles = styles;
  static props = {
    eyebrow: { default: 'Build assistant' },
    heading: { default: 'Ask the build, not another dashboard' },
    description: { default: 'One composer that reads your CI runs, opens the profiler and walks the commit history. Built into lower for teams that have to ship a fix, not a longer thread.' },
    points: { type: Object, default: DEMO_POINTS },
    primary: { default: 'Try the assistant' },
    secondary: { default: 'See a live prompt' },
    prompt: { default: 'Find out why last night’s release build got 40% slower. Attach the profile from run #412, bisect the commits since v3.1 and open a pull request with the fix.' },
    modelLabel: { default: 'lower' },
    modelMark: { default: LOWERSOFT.mark },
    chips: { type: Object, default: DEMO_CHIPS },
    claims: { type: Object, default: DEMO_CLAIMS },
    photo: { default: '' },
    photoAlt: { default: '' },
  };

  // Whether the prompt has typed itself in yet.
  #typed = false;
  #frame = 0;

  render() {
    return `<section class="section" aria-labelledby="heading"><div class="split"><div class="copy"><p class="eyebrow"></p><h2 class="title" id="heading"></h2><p class="description"></p><ul class="points"></ul>
<div class="actions"><slot name="actions"><lw-button class="primary" data-action="primary"><span class="primary-label"></span><span slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button><lw-button class="secondary" data-action="secondary" variant="outline"></lw-button></slot></div></div>
<figure class="stage" part="stage"><span class="scene" aria-hidden="true"></span><img class="photo" alt="" decoding="async" hidden>
<div class="composer" part="composer"><p class="prompt"><span class="prompt-text"></span><span class="prompt-typing" aria-hidden="true"><span class="typed"></span><span class="caret"></span></span></p>
<div class="toolbar" aria-hidden="true" inert><span class="well round">${strokeIcon(plus, 16)}</span><span class="well model"><img class="model-mark" alt="" decoding="async"><span class="model-label"></span>${strokeIcon(chevronDown, 14)}</span><span class="well round push">${strokeIcon(mic, 15)}</span><span class="send">${strokeIcon(arrowRight, 16)}</span></div></div>
<ul class="chips"></ul></figure></div><ol class="claims"></ol></section>`;
  }

  connected() {
    this.query('.actions').addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (button) this.emit('action', { action: button.dataset.action });
    }, { signal: this.signal });
    watchVisibility(this.query('.composer'), (visible) => visible && this.#type(), this.signal);
    this.signal.addEventListener('abort', () => cancelAnimationFrame(this.#frame));
  }

  updated(changed) {
    const text = (selector, value) => {
      const element = this.query(selector);
      element.textContent = value ?? '';
      element.hidden = !value;
    };
    text('.eyebrow', this.eyebrow);
    text('.title', this.heading);
    text('.description', this.description);
    this.query('.primary-label').textContent = this.primary ?? '';
    this.query('.primary').hidden = !this.primary;
    text('.secondary', this.secondary);
    if (changed.has('points')) {
      const points = Array.isArray(this.points) ? this.points : [];
      this.query('.points').innerHTML = points.map((point) => `<li>${escapeHtml(point)}</li>`).join('');
      this.query('.points').hidden = !points.length;
    }
    if (changed.has('prompt')) {
      this.query('.prompt-text').textContent = this.prompt ?? '';
      // A prompt that changes after typing shows at once.
      this.query('.typed').textContent = this.#typed ? this.prompt ?? '' : '';
    }
    const mark = this.query('.model-mark');
    if (this.modelMark) mark.src = this.modelMark;
    mark.hidden = !this.modelMark;
    this.query('.model-label').textContent = this.modelLabel ?? '';
    if (changed.has('chips')) {
      const chips = Array.isArray(this.chips) ? this.chips : [];
      this.query('.chips').innerHTML = chips.map((chip) => `<li class="chip">${CHIP_ICONS[chip.icon] ? strokeIcon(CHIP_ICONS[chip.icon], 14) : ''}<span>${escapeHtml(chip.label ?? '')}</span></li>`).join('');
      this.query('.chips').hidden = !chips.length;
    }
    if (changed.has('claims')) {
      const claims = Array.isArray(this.claims) ? this.claims : [];
      this.query('.claims').innerHTML = claims.map((claim) => `<li class="claim"><span class="index" aria-hidden="true">${escapeHtml(claim.index ?? '')}</span><h3 class="claim-title">${escapeHtml(claim.title ?? '')}</h3><p class="claim-body">${escapeHtml(claim.body ?? '')}</p></li>`).join('');
      this.query('.claims').hidden = !claims.length;
    }
    const photo = this.query('.photo');
    if (this.photo) photo.src = this.photo;
    photo.alt = this.photoAlt ?? '';
    photo.hidden = !this.photo;
    this.query('.stage').toggleAttribute('data-photo', Boolean(this.photo));
  }

  // The first time the composer is seen, the prompt types itself in over its
  // own room, already held by the full text, so nothing around it moves.
  #type() {
    if (this.#typed) return;
    this.#typed = true;
    const typed = this.query('.typed');
    const chars = graphemes(this.prompt ?? '');
    const done = () => {
      typed.textContent = this.prompt ?? '';
      this.toggleAttribute('data-typing', false);
      this.toggleAttribute('data-ready', true);
    };
    if (reducedMotion.matches || !chars.length) {
      done();
      return;
    }
    this.toggleAttribute('data-typing', true);
    const start = performance.now();
    const step = (now) => {
      const count = Math.min(chars.length, Math.floor(((now - start) / 1000) * TYPE_SPEED));
      typed.textContent = chars.slice(0, count).join('');
      if (count < chars.length) this.#frame = requestAnimationFrame(step);
      else done();
    };
    this.#frame = requestAnimationFrame(step);
  }
}
