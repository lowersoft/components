import { escapeHtml } from '../../core/dom.js';
import { LwModal, modalStyles } from '../../core/modal.js';
import '../button/index.js';
import '../text-input/index.js';
import styles from './new-project-dialog.scss?inline';

// Wireframes of what each template starts with, in a 120 × 64 box.
const SKETCHES = {
  cli: '<rect x="10" y="10" width="100" height="44" rx="4" class="soft"/><rect x="18" y="20" width="10" height="4" rx="2"/><rect x="32" y="20" width="40" height="4" rx="2" class="soft"/><rect x="18" y="30" width="56" height="4" rx="2" class="soft"/><rect x="18" y="40" width="30" height="4" rx="2" class="soft"/>',
  daemon: '<rect x="12" y="12" width="20" height="40" rx="3"/><rect x="40" y="12" width="30" height="8" rx="2" class="soft"/><rect x="40" y="26" width="68" height="8" rx="2" class="soft"/><rect x="40" y="40" width="50" height="12" rx="2" class="soft"/>',
  library: '<rect x="12" y="12" width="44" height="40" rx="3" class="soft"/><rect x="64" y="12" width="44" height="40" rx="3" class="soft"/><rect x="20" y="20" width="24" height="4" rx="2"/><rect x="72" y="20" width="24" height="4" rx="2"/>',
  blank: '<rect x="48" y="29" width="24" height="6" rx="3" class="soft"/>',
};

const DEMO_TEMPLATES = [
  { id: 'cli', name: 'CLI tool', detail: 'Args, man page' },
  { id: 'daemon', name: 'Daemon', detail: 'Service, logs' },
  { id: 'library', name: 'Library', detail: 'Headers, tests' },
  { id: 'blank', name: 'Blank', detail: 'One file' },
];

const slugOf = (text) => text.toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);

/**
 * A new project from a starting point: templates drawn as wireframes in
 * corner-marked frames, then a name whose address follows as you type.
 * Picking a template with Enter or a double click goes straight on to the
 * name; Create is ready once there is one.
 *
 * Templates are `{ id, name, detail }`.
 *
 * @attr {string} template
 * @attr {string} workspace - Goes into the address
 * @attr {string} domain
 * @attr {Array<object>} templates (JSON)
 * @fires lw-create - Create was chosen; `detail: { template, name, address }`
 */
export class LwNewProjectDialog extends LwModal {
  static styles = [modalStyles, styles];
  static props = {
    ...LwModal.props,
    template: { default: 'cli', reflect: true },
    workspace: { default: 'northwind' },
    domain: { default: 'lowersoft.dev' },
    templates: { type: Object, default: DEMO_TEMPLATES },
  };

  renderBody() {
    return `<div class="body"><h2 class="title" id="modal-title">New project</h2><p class="lead">Pick a starting point. You can change everything later.</p>
<div class="templates" role="radiogroup" aria-label="Template"></div><lw-text-input class="name" label="Name" placeholder="Billing daemon" autocomplete="off"></lw-text-input><p class="address"></p></div>
<footer class="foot"><lw-button class="cancel" variant="ghost">Cancel</lw-button><lw-button class="create" disabled>Create project</lw-button></footer>`;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    const templates = this.query('.templates');
    templates.addEventListener('click', (event) => {
      const card = event.target.closest('.template');
      if (card) this.template = card.dataset.id;
    }, options);
    templates.addEventListener('dblclick', (event) => event.target.closest('.template') && this.query('.name').focus(), options);
    templates.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.query('.name').focus();
        return;
      }
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const index = this.templates.findIndex((each) => each.id === this.template);
      this.template = this.templates[(index + step + this.templates.length) % this.templates.length].id;
      templates.querySelector(`[data-id="${CSS.escape(this.template)}"]`).focus();
    }, options);
    const name = this.query('.name');
    name.addEventListener('input', () => this.#paintName(), options);
    name.addEventListener('keydown', (event) => event.key === 'Enter' && (event.preventDefault(), this.#create()), options);
    this.query('.cancel').addEventListener('click', () => this.hide('cancel'), options);
    this.query('.create').addEventListener('click', () => this.#create(), options);
  }

  // Opens on the template chosen, ready for the arrow keys.
  opened() {
    requestAnimationFrame(() => this.query('.template[aria-checked="true"]')?.focus());
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('templates')) {
      this.query('.templates').innerHTML = this.templates
        .map((template) => `<button class="template" type="button" role="radio" data-id="${escapeHtml(template.id)}"><span class="frame"><svg viewBox="0 0 120 64" aria-hidden="true">${SKETCHES[template.id] ?? SKETCHES.blank}</svg></span><span class="template-name">${escapeHtml(template.name)}</span><span class="template-detail">${escapeHtml(template.detail)}</span></button>`)
        .join('');
    }
    for (const card of this.shadowRoot.querySelectorAll('.template')) {
      const checked = card.dataset.id === this.template;
      card.ariaChecked = String(checked);
      card.tabIndex = checked ? 0 : -1;
    }
    this.#paintName();
  }

  get #address() {
    return `${slugOf(this.query('.name').value) || 'your-project'}-${slugOf(this.workspace ?? '')}.${this.domain}`;
  }

  #paintName() {
    const named = Boolean(this.query('.name').value.trim());
    const address = this.query('.address');
    address.textContent = this.#address;
    address.toggleAttribute('data-empty', !named);
    this.query('.create').disabled = !named;
  }

  #create() {
    const name = this.query('.name').value.trim();
    if (!name) return;
    this.emit('create', { template: this.template, name, address: this.#address });
    this.hide('create');
  }
}
