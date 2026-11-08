import '../button/index.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { activity, arrowRight, fileText, plus, timer } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './upload-stage.scss?inline';

const DEMO_CHIPS = [
  { label: 'Logs', icon: 'log' },
  { label: 'Profiles', icon: 'profile' },
  { label: 'Traces', icon: 'trace' },
];

const DEMO_FEATURES = [
  { kind: 'log', title: 'Reads the log first', body: 'Errors and warnings come off the build log before you open it, each one linked to the line that raised it.' },
  { kind: 'profile', title: 'Keeps the profile as a flame graph', body: 'A profile stays a flame graph the team can zoom into, not a file buried in an archive.' },
  { kind: 'trace', title: 'Indexes the trace', body: 'A trace gets its duration and its slowest span on arrival, so anyone can find it again later.' },
];

const ICONS = { log: fileText, profile: activity, trace: timer };

// A flame graph's frames as [depth, start, width], in percent of the run.
const FLAME = [
  [0, 0, 100],
  [1, 0, 58], [1, 60, 38],
  [2, 2, 30], [2, 34, 22], [2, 62, 20], [2, 84, 12],
  [3, 4, 16], [3, 36, 14], [3, 64, 10],
];
// The hot path, drawn solid: the frames the slowest call runs through.
const HOT = new Set([0, 1, 4, 8]);

const lines = (...widths) => widths.map((width) => `<i style="width: ${width}%"></i>`).join('');

// Small drawings of what the desk makes of each kind of file. They are
// pictures and take no input.
const MOCKS = {
  log: `<div class="mock window log"><span class="mock-head"><span class="file">build-412.log</span><span class="badge">Parsed</span></span><span class="lines">${lines(92, 74, 56)}</span><span class="mock-foot">2 errors · 14 warnings</span></div>`,
  profile: `<div class="mock window profile"><span class="flame">${FLAME.map(([depth, start, width], at) => `<i${HOT.has(at) ? ' class="hot"' : ''} style="--depth: ${depth}; left: ${start}%; width: ${width}%"></i>`).join('')}<span class="tag">Profile</span></span><span class="mock-foot">release-412.prof · 38 s sampled</span></div>`,
  trace: `<div class="mock window trace"><span class="mock-head"><span class="file">trace-412.json</span><span class="time">1.84 s</span></span><span class="scrub"><span class="track"><span class="done"></span><span class="knob"></span></span></span><span class="spans"><i></i><i class="slow"></i><i></i><i></i></span></div>`,
};

/**
 * An ingest feature around a working drop zone. A centred header holds an
 * eyebrow, the headline, a sentence and two actions; under it, a drop zone
 * card floats on a softened forest, with three file cards fanned over its
 * button, a hint and chips for the kinds it takes. Three cards close the
 * section, each with a small drawing of what the desk makes of a kind of
 * file: a build log with its errors read off, a profile kept as a flame
 * graph and a trace indexed by its slowest span.
 *
 * The drop zone works: its button opens the file picker and files dropped
 * on it are taken too, and either way `lw-files` brings them. While files
 * are dragged over it the zone lights up and the cards fan out. On narrow
 * screens the three cards stack.
 *
 * Chips are `{ label, icon }` and features `{ title, body, kind }`, `icon`
 * and `kind` each one of log, profile or trace. Without `photo` the stage
 * draws its own softened forest.
 *
 * @attr {string} eyebrow - The short line above the heading; none when empty
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} primary - The main action's label
 * @attr {string} secondary - The second action's label; none when empty
 * @attr {string} button-label - The drop zone's button
 * @attr {string} hint - The line under the button
 * @attr {string} accept - The kinds of file the picker offers, as on a file input
 * @attr {Array<object>} chips (JSON)
 * @attr {Array<object>} features (JSON)
 * @attr {string} photo - A picture behind the drop zone, an image's URL; drawn when empty
 * @attr {string} photo-alt
 * @slot actions - Your own actions, such as links, instead of the two buttons
 * @fires lw-files - Files were chosen or dropped; `detail: { files }`, an array of `File`
 * @fires lw-action - One of the two buttons was pressed; `detail: { action }`, "primary" or "secondary"
 * @csspart stage - The picture and the drop zone on it
 * @csspart dropzone - The drop zone card
 * @csspart card - Each feature
 */
export class LwUploadStage extends LwElement {
  static styles = styles;
  static props = {
    eyebrow: { default: 'Artifact inbox' },
    heading: { default: 'Drop logs, profiles and traces in one tray' },
    description: { default: 'lower reads the build log, the profile and the trace from the same drop, and files each one under its run.' },
    primary: { default: 'Open the inbox' },
    secondary: { default: 'See a tray' },
    buttonLabel: { default: 'Choose files' },
    hint: { default: 'or drop files here' },
    accept: { default: '' },
    chips: { type: Object, default: DEMO_CHIPS },
    features: { type: Object, default: DEMO_FEATURES },
    photo: { default: '' },
    photoAlt: { default: '' },
  };

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><p class="eyebrow"></p><h2 class="title" id="heading"></h2><p class="description"></p>
<div class="actions"><slot name="actions"><lw-button class="primary" data-action="primary"><span class="primary-label"></span><span slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button><lw-button class="secondary" data-action="secondary" variant="outline"></lw-button></slot></div></header>
<div class="stage" part="stage"><span class="scene" aria-hidden="true"></span><img class="photo" alt="" decoding="async" hidden>
<div class="card" part="dropzone"><div class="zone"><span class="fan" aria-hidden="true"><span class="sheet">${strokeIcon(fileText, 18)}</span><span class="sheet">${strokeIcon(activity, 18)}</span><span class="sheet">${strokeIcon(timer, 18)}</span></span>
<lw-button class="choose" size="sm"><span slot="start">${strokeIcon(plus, 16)}</span><span class="choose-label"></span></lw-button><p class="hint"></p><input class="picker" type="file" multiple hidden></div><ul class="chips"></ul></div></div>
<ul class="features"></ul></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.actions').addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (button) this.emit('action', { action: button.dataset.action });
    }, options);
    const picker = this.query('.picker');
    this.query('.choose').addEventListener('click', () => picker.click(), options);
    picker.addEventListener('change', () => {
      this.#take(picker.files);
      picker.value = '';
    }, options);
    // Only a drag that carries files lights the zone and is taken.
    const card = this.query('.card');
    const carriesFiles = (event) => [...(event.dataTransfer?.types ?? [])].includes('Files');
    card.addEventListener('dragover', (event) => {
      if (!carriesFiles(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      this.toggleAttribute('data-dragging', true);
    }, options);
    card.addEventListener('dragleave', (event) => {
      if (!card.contains(event.relatedTarget)) this.removeAttribute('data-dragging');
    }, options);
    card.addEventListener('drop', (event) => {
      if (!carriesFiles(event)) return;
      event.preventDefault();
      this.removeAttribute('data-dragging');
      this.#take(event.dataTransfer.files);
    }, options);
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
    this.query('.choose-label').textContent = this.buttonLabel ?? '';
    text('.hint', this.hint);
    const picker = this.query('.picker');
    if (this.accept) picker.accept = this.accept;
    else picker.removeAttribute('accept');
    if (changed.has('chips')) {
      const chips = Array.isArray(this.chips) ? this.chips : [];
      this.query('.chips').innerHTML = chips.map((chip) => `<li class="chip">${ICONS[chip.icon] ? strokeIcon(ICONS[chip.icon], 13) : ''}<span>${escapeHtml(chip.label ?? '')}</span></li>`).join('');
      this.query('.chips').hidden = !chips.length;
    }
    if (changed.has('features')) {
      const features = Array.isArray(this.features) ? this.features : [];
      this.query('.features').innerHTML = features
        .map((feature) => `<li class="feature" part="card"><div class="art" aria-hidden="true" inert>${MOCKS[feature.kind] ?? MOCKS.log}</div><h3 class="name">${escapeHtml(feature.title ?? '')}</h3><p class="text">${escapeHtml(feature.body ?? '')}</p></li>`)
        .join('');
    }
    const photo = this.query('.photo');
    if (this.photo) photo.src = this.photo;
    photo.alt = this.photoAlt ?? '';
    photo.hidden = !this.photo;
    this.query('.stage').toggleAttribute('data-photo', Boolean(this.photo));
  }

  #take(list) {
    const files = [...(list ?? [])];
    if (files.length) this.emit('files', { files });
  }
}
