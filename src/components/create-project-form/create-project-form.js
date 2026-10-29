import { escapeHtml } from '../../core/dom.js';
import { CHECK_ICON, iconStyles, SPINNER_ICON, strokeIcon } from '../../core/icons.js';
import { globe, x } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { menuStyles } from '../../core/menu.js';
import { createPicker, pickerMarkup } from '../../core/picker.js';
import { swapStyles } from '../../core/swap.js';
import '../button/index.js';
import styles from './create-project-form.scss?inline';

// How long typing rests before the name is checked.
const CHECK_DELAY_MS = 350;

// Line drawings of what each template starts with, in a 120 × 64 box.
const SKETCHES = {
  blank: '<rect x="38" y="14" width="44" height="36" rx="3" stroke-dasharray="3 3"/><path d="M60 26v12M54 32h12"/>',
  cli: '<rect x="14" y="10" width="92" height="44" rx="4"/><path d="m24 24 6 5-6 5M36 34h14"/><path d="M24 44h40" opacity=".5"/>',
  library: '<rect x="14" y="10" width="40" height="44" rx="4"/><rect x="66" y="10" width="40" height="44" rx="4"/><path d="M22 22h24M22 30h18M74 22h24M74 30h18"/>',
  firmware: '<rect x="34" y="14" width="52" height="36" rx="3"/><rect x="48" y="24" width="24" height="16" rx="2"/><path d="M42 14V8M54 14V8M66 14V8M78 14V8M42 56v-6M54 56v-6M66 56v-6M78 56v-6"/>',
};

const DEMO_TEMPLATES = [
  { id: 'blank', name: 'Blank', detail: 'Empty repo' },
  { id: 'cli', name: 'CLI tool', detail: 'C and Make' },
  { id: 'library', name: 'Library', detail: 'Static and shared' },
  { id: 'firmware', name: 'Firmware', detail: 'Bare-metal ARM' },
];

const DEMO_REGIONS = [
  { value: 'fra1', label: 'Frankfurt', code: 'FRA1', latency: 18 },
  { value: 'iad1', label: 'Washington, D.C.', code: 'IAD1', latency: 92 },
  { value: 'sfo1', label: 'San Francisco', code: 'SFO1', latency: 148 },
  { value: 'nrt1', label: 'Tokyo', code: 'NRT1', latency: 231 },
];

const DEMO_TAKEN = ['api', 'core', 'web', 'runtime', 'lower'];

const slugOf = (name) => name.toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

/**
 * A new project in one card. The name becomes its address as you type and
 * is checked for availability once you pause; pick a template from line
 * drawings, a region by its latency, and who can see it. Create waits on
 * `create` if set.
 *
 * Templates are `{ id, name, detail }`; regions are `{ value, label, code,
 * latency }`, latency in milliseconds.
 *
 * Set the `check` property to an async function taking a slug and returning
 * whether it is free; without it, the names in `taken` are the taken ones.
 * Set `create` to an async function taking the project; a rejection shows
 * its message.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} domain - The address the slug goes under
 * @attr {string} template
 * @attr {string} region
 * @attr {'private'|'public'} visibility
 * @attr {Array<object>} templates (JSON)
 * @attr {Array<object>} regions (JSON)
 * @attr {Array<string>} taken (JSON)
 * @fires lw-create - The project was created; `detail: { name, slug, template, region, visibility }`
 */
export class LwCreateProjectForm extends LwElement {
  static styles = [iconStyles, menuStyles, swapStyles, styles];
  static props = {
    heading: { default: 'New project' },
    description: { default: 'Builds on every push to main and ships a release binary for each target. You can change any of this later.' },
    domain: { default: 'lowersoft.dev' },
    template: { default: 'cli' },
    region: { default: 'fra1' },
    visibility: { default: 'private' },
    templates: { type: Object, default: DEMO_TEMPLATES },
    regions: { type: Object, default: DEMO_REGIONS },
    taken: { type: Object, default: DEMO_TAKEN },
  };

  #regionPicker;
  #checkTimer = 0;
  // The slug last checked, and whether it was free; null while checking.
  #checked = { slug: '', free: null };

  render() {
    return `<form class="form" novalidate><header><h2 class="title"></h2><p class="description"></p></header>
<section class="field"><label class="label" for="name">Project name</label><div class="name-box"><input class="name" id="name" type="text" autocomplete="off" spellcheck="false" placeholder="Billing daemon" aria-describedby="name-hint availability"><p class="address">${strokeIcon(globe, 16)}<span class="domain"></span><span class="slug"></span><span class="availability" id="availability" aria-live="polite"></span></p></div><p class="hint" id="name-hint">Becomes the project's address. Branches get their own.</p></section>
<section class="field"><p class="label" id="template-label">Template</p><div class="templates" role="radiogroup" aria-labelledby="template-label"></div></section>
<section class="field"><p class="label" id="region-label">Build region</p>${pickerMarkup('region-menu')}</section>
<section class="field"><p class="label" id="visibility-label">Visibility</p><div class="visibility" role="radiogroup" aria-labelledby="visibility-label"><button class="seg" type="button" role="radio" data-value="private">Private</button><button class="seg" type="button" role="radio" data-value="public">Public</button></div></section>
<footer class="foot"><p class="error" role="alert"></p><lw-button class="create" type="submit">Create project</lw-button></footer></form>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.#regionPicker = createPicker(this.query('.picker'), this.signal, (value) => (this.region = value));
    this.query('.picker-trigger').setAttribute('aria-labelledby', 'region-label');
    this.query('.name').addEventListener('input', () => this.#typed(), options);
    this.query('.templates').addEventListener('click', (event) => {
      const card = event.target.closest('.template');
      if (card) this.template = card.dataset.id;
    }, options);
    this.query('.visibility').addEventListener('click', (event) => {
      const seg = event.target.closest('.seg');
      if (seg) this.visibility = seg.dataset.value;
    }, options);
    for (const group of this.shadowRoot.querySelectorAll('[role="radiogroup"]')) group.addEventListener('keydown', (event) => this.#arrows(event, group), options);
    this.query('.form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#create();
    }, options);
    this.signal.addEventListener('abort', () => clearTimeout(this.#checkTimer));
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.domain').textContent = `${this.domain}/`;
    if (changed.has('templates')) {
      this.query('.templates').innerHTML = this.templates
        .map((template) => `<button class="template" type="button" role="radio" data-id="${escapeHtml(template.id)}"><svg class="sketch" viewBox="0 0 120 64" aria-hidden="true">${SKETCHES[template.id] ?? SKETCHES.blank}</svg><span class="template-name">${escapeHtml(template.name)}</span><span class="template-detail">${escapeHtml(template.detail)}</span><span class="tick" aria-hidden="true">${CHECK_ICON}</span></button>`)
        .join('');
    }
    for (const card of this.shadowRoot.querySelectorAll('.template')) this.#check(card, card.dataset.id === this.template);
    for (const seg of this.shadowRoot.querySelectorAll('.seg')) this.#check(seg, seg.dataset.value === this.visibility);
    this.#regionPicker?.set(this.regions.map((region) => ({ value: region.value, label: region.label, description: `${region.code} · ~${region.latency} ms` })), this.region);
    this.#paintName();
  }

  #check(element, checked) {
    element.ariaChecked = String(checked);
    element.tabIndex = checked ? 0 : -1;
  }

  // Arrow keys move along a radio group, choosing as they go.
  #arrows(event, group) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const all = [...group.querySelectorAll('[role="radio"]')];
    const next = all[(all.findIndex((each) => each.ariaChecked === 'true') + step + all.length) % all.length];
    next.click();
    next.focus();
  }

  get #slug() {
    return slugOf(this.query('.name').value);
  }

  // The slug follows the name at once; the check waits for a pause.
  #typed() {
    clearTimeout(this.#checkTimer);
    const slug = this.#slug;
    this.#checked = { slug, free: null };
    this.#paintName();
    if (!slug) return;
    this.#checkTimer = setTimeout(async () => {
      let free;
      try {
        free = this.check ? await this.check(slug) : !this.taken.includes(slug);
      } catch {
        free = null;
      }
      if (this.#slug !== slug) return;
      this.#checked = { slug, free };
      this.#paintName();
    }, CHECK_DELAY_MS);
  }

  #paintName() {
    const slug = this.#slug;
    this.query('.slug').textContent = slug || 'your-project';
    this.query('.slug').toggleAttribute('data-empty', !slug);
    const availability = this.query('.availability');
    const state = !slug ? '' : this.#checked.slug !== slug || this.#checked.free === null ? 'checking' : this.#checked.free ? 'free' : 'taken';
    availability.dataset.state = state;
    availability.innerHTML = { '': '', checking: `${SPINNER_ICON}<span>Checking</span>`, free: `${CHECK_ICON}<span>Available</span>`, taken: `${strokeIcon(x, 16)}<span>Taken</span>` }[state];
    this.query('.create').disabled = state !== 'free';
  }

  async #create() {
    if (this.#checked.free !== true || this.#checked.slug !== this.#slug) return;
    const detail = { name: this.query('.name').value.trim(), slug: this.#slug, template: this.template, region: this.region, visibility: this.visibility };
    const button = this.query('.create');
    const error = this.query('.error');
    error.textContent = '';
    button.loading = true;
    try {
      await this.create?.(detail);
    } catch (reason) {
      error.textContent = reason?.message || 'The project could not be created. Try again.';
      return;
    } finally {
      button.loading = false;
    }
    button.textContent = 'Created';
    button.disabled = true;
    this.emit('create', detail);
  }
}
