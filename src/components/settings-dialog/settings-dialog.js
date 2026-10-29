import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { lock, monitor, settings, sunMoon, user } from '../../core/lucide.js';
import { LwModal, modalStyles } from '../../core/modal.js';
import '../button/index.js';
import '../switch/index.js';
import '../text-input/index.js';
import styles from './settings-dialog.scss?inline';

const BELL = '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>';

const SECTIONS = [
  { id: 'general', label: 'General', icon: settings },
  { id: 'account', label: 'Account', icon: user },
  { id: 'notifications', label: 'Notifications', icon: BELL },
  { id: 'appearance', label: 'Appearance', icon: sunMoon },
  { id: 'security', label: 'Security', icon: lock },
];

const DEMO_SETTINGS = {
  workspace: 'Northwind',
  slug: 'northwind',
  name: 'Maya Chen',
  email: 'maya@northwind.dev',
  buildFailed: true,
  crashReports: true,
  weeklyDigest: false,
  mentions: true,
  theme: 'system',
  density: 'comfortable',
  twoFactor: true,
};

const DEMO_SESSIONS = [
  { device: 'MacBook Pro · Firefox', where: 'Lisbon', when: 'This device' },
  { device: 'ThinkPad · Chrome', where: 'Berlin', when: '2 days ago' },
];

const switchRow = (key, label, hint) => `<div class="row"><div><p class="row-label">${label}</p><p class="row-hint">${hint}</p></div><lw-switch class="setting" data-key="${key}" size="sm">${label}</lw-switch></div>`;
const choice = (key, value, label) => `<button class="choice" type="button" role="radio" data-key="${key}" data-value="${value}">${label}</button>`;

const PANELS = {
  general: `<lw-text-input class="setting" data-key="workspace" label="Workspace name"></lw-text-input><lw-text-input class="setting" data-key="slug" label="Address" hint="Changing it breaks old links to builds."><span slot="start">lowersoft.dev/</span></lw-text-input>`,
  account: `<lw-text-input class="setting" data-key="name" label="Full name" autocomplete="name"></lw-text-input><lw-text-input class="setting" data-key="email" type="email" label="Email" autocomplete="email"></lw-text-input>`,
  notifications: `${switchRow('buildFailed', 'Failed builds', 'When a build on main breaks')}${switchRow('crashReports', 'New crash reports', 'Grouped, once per signature')}${switchRow('mentions', 'Mentions', 'When someone mentions you in a review')}${switchRow('weeklyDigest', 'Weekly digest', 'Benchmarks and builds, every Monday')}`,
  appearance: `<div class="group"><p class="row-label" id="theme-label">Theme</p><div class="choices" role="radiogroup" aria-labelledby="theme-label">${choice('theme', 'system', `${strokeIcon(monitor, 15)}System`)}${choice('theme', 'light', 'Light')}${choice('theme', 'dark', 'Dark')}</div></div>
<div class="group"><p class="row-label" id="density-label">Density</p><div class="choices" role="radiogroup" aria-labelledby="density-label">${choice('density', 'comfortable', 'Comfortable')}${choice('density', 'compact', 'Compact')}</div></div>`,
  security: `${switchRow('twoFactor', 'Two-factor authentication', 'A code from your app at every sign-in')}<div class="group"><p class="row-label">Signed-in devices</p><ul class="sessions"></ul></div>`,
};

/**
 * Settings in one dialog: sections down the side, each a panel of fields,
 * switches and choices. Changes are held as a draft across sections; a bar
 * appears at the foot to save or discard them, and the sections with
 * changes are dotted. The arrow keys move between sections.
 *
 * @attr {string} section - The section shown
 * @attr {object} settings - The saved values (JSON)
 * @fires lw-save - Saved; `detail: { settings, changed }`
 * @fires lw-sign-out-device - A device was signed out; `detail: { device }`
 */
export class LwSettingsDialog extends LwModal {
  static styles = [modalStyles, iconStyles, styles];
  static props = {
    ...LwModal.props,
    section: { default: 'general', reflect: true },
    settings: { type: Object, default: DEMO_SETTINGS },
  };

  #saved = {};
  #draft = {};
  #sessions = [...DEMO_SESSIONS];

  renderBody() {
    return `<div class="layout"><nav class="nav"><h2 class="title" id="modal-title">Settings</h2><div class="sections" role="tablist" aria-orientation="vertical">${SECTIONS.map((section) => `<button class="section" type="button" role="tab" id="tab-${section.id}" data-id="${section.id}" aria-controls="panel-${section.id}">${strokeIcon(section.icon, 16)}<span>${section.label}</span><span class="dot" aria-hidden="true"></span></button>`).join('')}</div></nav>
<div class="panels">${SECTIONS.map((section) => `<section class="panel" role="tabpanel" id="panel-${section.id}" aria-labelledby="tab-${section.id}" data-id="${section.id}"><h3 class="panel-title">${section.label}</h3><div class="fields">${PANELS[section.id]}</div></section>`).join('')}
<footer class="savebar" role="status"><span class="changes"></span><lw-button class="discard" variant="ghost" size="sm">Discard</lw-button><lw-button class="save" size="sm">Save changes</lw-button></footer></div></div>`;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    const sections = this.query('.sections');
    sections.addEventListener('click', (event) => {
      const section = event.target.closest('.section');
      if (section) this.section = section.dataset.id;
    }, options);
    sections.addEventListener('keydown', (event) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const index = SECTIONS.findIndex((section) => section.id === this.section);
      this.section = SECTIONS[(index + step + SECTIONS.length) % SECTIONS.length].id;
      sections.querySelector(`[data-id="${this.section}"]`).focus();
    }, options);
    const panels = this.query('.panels');
    panels.addEventListener('input', (event) => {
      const field = event.target.closest('lw-text-input.setting');
      if (field) this.#set(field.dataset.key, field.value);
    }, options);
    panels.addEventListener('change', (event) => {
      const toggle = event.target.closest('lw-switch.setting');
      if (toggle) this.#set(toggle.dataset.key, toggle.checked);
    }, options);
    panels.addEventListener('click', (event) => {
      const choice = event.target.closest('.choice');
      if (choice) this.#set(choice.dataset.key, choice.dataset.value);
      const signOut = event.target.closest('.sign-out');
      if (signOut) {
        const [session] = this.#sessions.splice(Number(signOut.dataset.index), 1);
        this.#paintSessions();
        this.emit('sign-out-device', { device: session.device });
      }
    }, options);
    this.query('.discard').addEventListener('click', () => this.#load(), options);
    this.query('.save').addEventListener('click', () => this.#save(), options);
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('settings')) {
      this.#saved = { ...DEMO_SETTINGS, ...this.settings };
      this.#load();
    }
    for (const button of this.shadowRoot.querySelectorAll('.section')) {
      const selected = button.dataset.id === this.section;
      button.ariaSelected = String(selected);
      button.tabIndex = selected ? 0 : -1;
    }
    for (const panel of this.shadowRoot.querySelectorAll('.panel')) panel.hidden = panel.dataset.id !== this.section;
    this.#paintSessions();
  }

  #load() {
    this.#draft = { ...this.#saved };
    for (const field of this.shadowRoot.querySelectorAll('lw-text-input.setting')) field.value = this.#draft[field.dataset.key] ?? '';
    for (const toggle of this.shadowRoot.querySelectorAll('lw-switch.setting')) toggle.checked = Boolean(this.#draft[toggle.dataset.key]);
    this.#paint();
  }

  #set(key, value) {
    this.#draft[key] = value;
    this.#paint();
  }

  get #changed() {
    return Object.keys(this.#draft).filter((key) => this.#draft[key] !== this.#saved[key]);
  }

  #paint() {
    for (const choice of this.shadowRoot.querySelectorAll('.choice')) {
      const checked = this.#draft[choice.dataset.key] === choice.dataset.value;
      choice.ariaChecked = String(checked);
      choice.tabIndex = checked ? 0 : -1;
    }
    const changed = this.#changed;
    // A dot on each section holding a change.
    for (const button of this.shadowRoot.querySelectorAll('.section')) {
      const panel = this.query(`.panel[data-id="${button.dataset.id}"]`);
      button.toggleAttribute('data-changed', changed.some((key) => panel.querySelector(`[data-key="${key}"]`)));
    }
    this.query('.savebar').toggleAttribute('data-show', changed.length > 0);
    this.query('.changes').textContent = changed.length ? `${changed.length} unsaved ${changed.length === 1 ? 'change' : 'changes'}` : '';
  }

  #paintSessions() {
    this.query('.sessions').innerHTML = this.#sessions
      .map((session, i) => `<li class="session"><div><p class="row-label">${escapeHtml(session.device)}</p><p class="row-hint">${escapeHtml(session.where)} · ${escapeHtml(session.when)}</p></div>${session.when === 'This device' ? '' : `<button class="sign-out" type="button" data-index="${i}">Sign out</button>`}</li>`)
      .join('');
  }

  #save() {
    const changed = this.#changed;
    if (!changed.length) return;
    this.#saved = { ...this.#draft };
    this.#paint();
    this.emit('save', { settings: { ...this.#saved }, changed });
  }
}
