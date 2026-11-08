import '../button/index.js';
import { LOWERSOFT } from '../../core/brand.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight, chevronDown, mic, plus } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { splitWords } from '../../core/text.js';
import styles from './prompt-stage.scss?inline';

const DEMO_DESKS = [
  {
    id: 'bisect',
    title: 'Pin the slowdown to a commit',
    description: 'It bisects the runs since the last fast build and hands back the commit, with the profile that proves it.',
    chipLabel: 'Bisect desk',
    chipTone: 'rose',
    prompt: 'Bisect last night’s 40% slower release build back to the commit that caused it, and attach the profile from run #412.',
    promptTag: 'Bisect desk',
  },
  {
    id: 'on-call',
    title: 'Hand it to whoever is on call',
    description: 'It opens the incident, pages the owner of the code that broke and puts the core dump in front of them.',
    chipLabel: 'On-call desk',
    chipTone: 'amber',
    prompt: 'Open an incident for the crash in run #412, page whoever owns the linker this week and attach the core dump.',
    promptTag: 'On-call desk',
  },
  {
    id: 'release',
    title: 'Keep the last release in view',
    description: 'The assistant is not a chatbot. It starts from the release you last shipped, with the same build it was signed from.',
    chipLabel: 'Release desk',
    chipTone: 'emerald',
    prompt: 'Compare v3.2.0 with v3.1.4. Keep the same linker flags and drop the note about the second target.',
    promptTag: 'Release desk',
  },
];

// The chips' dots, by tone.
const TONES = { rose: '#e5484d', amber: '#f5a524', emerald: '#30a46c', sky: '#0090ff', violet: '#8e4ec6', slate: '#8b8d98' };

const toneOf = (tone) => TONES[tone] ?? TONES.slate;

/**
 * An assistant feature with its prompt on a softened stage. On the left, a
 * short, heavy headline, a sentence, an action and a link, and an
 * accordion of desks, the things the assistant can be asked to do; on the
 * right, a prompt card over a blurred photograph holding the open desk's
 * request and tag, with the desks again as chips under it. The accordion
 * and the chips open the same desk, so either one changes the card, whose
 * new request comes into focus word by word.
 *
 * The prompt card is a picture: its attach, model and microphone controls
 * take no input. The desks' panels open with a height transition, instant
 * with reduced motion. On narrow screens the stage moves under the copy.
 *
 * Desks are `{ id, title, description, chipLabel, chipTone, prompt,
 * promptTag }`, `chipTone` one of rose, amber, emerald, sky, violet or
 * slate. Without `photo` the stage draws its own softened scene.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} primary - The action's label
 * @attr {string} secondary - The link's label; none when empty
 * @attr {string} secondary-href - Where the link goes
 * @attr {Array<object>} desks (JSON)
 * @attr {string} value - The open desk's `id`; the first when empty
 * @attr {string} model-label - The model's name on the card
 * @attr {string} model-mark - The model's mark, an image's URL; Lowersoft's badge by default, none when empty
 * @attr {string} photo - A photograph behind the card, an image's URL; drawn when empty
 * @attr {string} photo-alt
 * @slot actions - Your own actions instead of the button and the link
 * @fires lw-change - The visitor opened another desk; `detail: { value }`
 * @fires lw-action - The button was pressed; `detail: { action }`, "primary"
 * @csspart stage - The photograph, the card and the chips
 * @csspart card - The prompt card
 */
export class LwPromptStage extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Ask the build where it hurts' },
    description: { default: 'The assistant pins a question to a run, then names the person who has to answer it. The build stays soft in the background, so the question stays first.' },
    primary: { default: 'Open the assistant' },
    secondary: { default: 'Read the docs' },
    secondaryHref: { default: '#' },
    desks: { type: Object, default: DEMO_DESKS },
    value: { default: '', reflect: true },
    modelLabel: { default: 'lower' },
    modelMark: { default: LOWERSOFT.mark },
    photo: { default: '' },
    photoAlt: { default: '' },
  };

  // The desk shown last, so a change can bring the new prompt into focus.
  #shown = -1;

  render() {
    return `<section class="section" aria-labelledby="heading"><div class="split"><div class="copy"><h2 class="title" id="heading"></h2><p class="description"></p>
<div class="actions"><slot name="actions"><lw-button class="primary" data-action="primary"><span class="primary-label"></span><span slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button><a class="link"></a></slot></div>
<div class="desks"></div></div>
<figure class="stage" part="stage"><span class="scene" aria-hidden="true"></span><img class="photo" alt="" decoding="async" hidden>
<div class="card" part="card"><p class="prompt"></p><span class="tag"><i class="dot"></i><span class="tag-label"></span></span>
<div class="toolbar" aria-hidden="true" inert><span class="well">${strokeIcon(plus, 16)}</span><span class="model"><img class="model-mark" alt="" decoding="async"><span class="model-label"></span>${strokeIcon(chevronDown, 14)}</span><span class="well">${strokeIcon(mic, 15)}</span></div></div>
<div class="chips" role="group"></div></figure></div></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.actions').addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (button) this.emit('action', { action: button.dataset.action });
    }, options);
    // The accordion and the chips open the same desks.
    for (const list of [this.query('.desks'), this.query('.chips')]) {
      list.addEventListener('click', (event) => {
        const control = event.target.closest('[data-index]');
        if (control) this.#open(Number(control.dataset.index));
      }, options);
    }
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
    const link = this.query('.link');
    text('.link', this.secondary);
    if (this.secondaryHref) link.setAttribute('href', this.secondaryHref);
    else link.removeAttribute('href');
    const mark = this.query('.model-mark');
    if (this.modelMark) mark.src = this.modelMark;
    mark.hidden = !this.modelMark;
    this.query('.model-label').textContent = this.modelLabel ?? '';
    this.query('.chips').ariaLabel = this.heading ?? '';
    if (changed.has('desks')) this.#build();
    const photo = this.query('.photo');
    if (this.photo) photo.src = this.photo;
    photo.alt = this.photoAlt ?? '';
    photo.hidden = !this.photo;
    this.query('.stage').toggleAttribute('data-photo', Boolean(this.photo));
    this.#show();
  }

  get #desks() {
    return Array.isArray(this.desks) ? this.desks : [];
  }

  get #index() {
    return Math.max(0, this.#desks.findIndex((desk) => desk.id === this.value));
  }

  #build() {
    const desks = this.#desks;
    this.query('.desks').innerHTML = desks
      .map((desk, at) => `<div class="desk"><h3 class="desk-head"><button class="desk-toggle" type="button" id="desk-${at}" data-index="${at}" aria-controls="desk-panel-${at}"><span>${escapeHtml(desk.title ?? '')}</span>${strokeIcon(plus, 16)}</button></h3><div class="desk-panel" id="desk-panel-${at}" role="region" aria-labelledby="desk-${at}"><div class="desk-body"><p>${escapeHtml(desk.description ?? '')}</p></div></div></div>`)
      .join('');
    this.query('.chips').innerHTML = desks
      .map((desk, at) => `<button class="chip" type="button" data-index="${at}" style="--_tone: ${toneOf(desk.chipTone)}"><i class="dot"></i>${escapeHtml(desk.chipLabel ?? desk.title ?? '')}</button>`)
      .join('');
    this.#shown = -1;
  }

  #open(index) {
    const desk = this.#desks[index];
    if (!desk || index === this.#index) return;
    this.value = desk.id ?? '';
    this.emit('change', { value: this.value });
  }

  // Opens the desk in the accordion, presses its chip and puts its request
  // on the card; a new request comes into focus word by word.
  #show() {
    const index = this.#index;
    const desk = this.#desks[index];
    this.query('.card').hidden = !desk;
    if (!desk) return;
    this.shadowRoot.querySelectorAll('.desk-toggle').forEach((toggle, at) => {
      const open = at === index;
      toggle.ariaExpanded = String(open);
      toggle.closest('.desk').toggleAttribute('data-open', open);
      // A closed panel stays in place for the transition, out of reach.
      toggle.closest('.desk').querySelector('.desk-panel').inert = !open;
    });
    this.shadowRoot.querySelectorAll('.chip').forEach((chip, at) => (chip.ariaPressed = String(at === index)));
    if (index === this.#shown) return;
    const prompt = this.query('.prompt');
    prompt.textContent = desk.prompt ?? '';
    this.query('.tag-label').textContent = desk.promptTag ?? '';
    this.query('.tag').hidden = !desk.promptTag;
    this.query('.tag').style.setProperty('--_tone', toneOf(desk.chipTone));
    if (this.#shown >= 0 && !reducedMotion.matches) {
      const words = splitWords(prompt);
      const step = Math.min(22, 480 / Math.max(words.length, 1));
      words.forEach((word, at) => word.animate({ opacity: [0, 1], filter: ['blur(6px)', 'blur(0)'], translate: ['0 0.3em', '0 0'] }, { duration: 480, delay: at * step, easing: 'cubic-bezier(0.22, 0.7, 0.2, 1)', fill: 'backwards' }));
      this.query('.tag').animate({ opacity: [0, 1], scale: [0.94, 1] }, { duration: 360, easing: 'cubic-bezier(0.22, 0.7, 0.2, 1)' });
    }
    this.#shown = index;
  }
}
