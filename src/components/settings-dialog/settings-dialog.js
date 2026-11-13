import { escapeHtml } from '../../core/dom.js';
import { avatarSeed } from '../../core/face.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { drawPortrait } from '../../core/login.js';
import { lock, monitor, settings, sunMoon, user } from '../../core/lucide.js';
import { LwModal, modalStyles } from '../../core/modal.js';
import { setTheme, themeChoice } from '../../core/theme.js';
import '../button/index.js';
import '../confirm-delete-button/index.js';
import '../switch/index.js';
import '../text-input/index.js';
import '../theme-toggle-button/index.js';
import styles from './settings-dialog.scss?inline';

const BELL = '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>';
const PHONE = '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>';

// The sections, in their groups down the side.
const GROUPS = [
  {
    label: 'Account',
    sections: [
      { id: 'account', label: 'Account', icon: user, lead: 'How you appear to others on LowerSoft.' },
      { id: 'notifications', label: 'Notifications', icon: BELL, lead: 'Choose what we email you about.' },
      { id: 'appearance', label: 'Appearance', icon: sunMoon, lead: 'Make LowerSoft look the way you like.' },
      { id: 'security', label: 'Security', icon: lock, lead: 'Keep your account safe.' },
    ],
  },
  {
    label: 'Workspace',
    sections: [{ id: 'general', label: 'General', icon: settings, lead: 'The name and address your team shares.' }],
  },
];
const SECTIONS = GROUPS.flatMap((group) => group.sections);

const DEMO_SETTINGS = {
  workspace: 'LowerSoft',
  slug: 'lowersoft',
  name: 'Maya Chen',
  email: 'maya@lowersoft.com',
  releases: true,
  security: true,
  mentions: true,
  digest: false,
  density: 'comfortable',
  twoFactor: true,
};

const DEMO_SESSIONS = [
  { device: 'MacBook Pro · Firefox', where: 'Lisbon', when: 'This device', kind: 'desktop' },
  { device: 'iPhone 15 · Safari', where: 'Lisbon', when: '3 hours ago', kind: 'phone' },
  { device: 'ThinkPad · Chrome', where: 'Berlin', when: '2 days ago', kind: 'desktop' },
];

const switchRow = (key, label, hint) => `<div class="row"><div class="row-text"><p class="row-label">${label}</p><p class="row-hint">${hint}</p></div><lw-switch class="setting" data-key="${key}" size="sm">${label}</lw-switch></div>`;

const segmented = (key, label, options) => `<div class="segmented" role="radiogroup" aria-label="${label}" data-key="${key}"><span class="segment-pill" aria-hidden="true"></span>${options.map(([value, text]) => `<button class="segment" type="button" role="radio" data-key="${key}" data-value="${value}">${text}</button>`).join('')}</div>`;

const PANELS = {
  account: `<div class="profile"><span class="portrait"></span><div><p class="profile-name"></p><p class="profile-email"></p></div></div>
<div class="group fields"><lw-text-input class="setting" data-key="name" label="Full name" autocomplete="name"></lw-text-input><lw-text-input class="setting" data-key="email" type="email" label="Email" autocomplete="email" hint="We send receipts and sign-in links here."></lw-text-input></div>
<div class="group danger"><div class="row"><div class="row-text"><p class="row-label">Delete account</p><p class="row-hint">Removes your account and your licenses. This cannot be undone.</p></div><lw-confirm-delete-button class="delete" label="Delete account" heading="Delete your account?" delete-label="Delete account" done-label="Account deleted" align="end">Your licenses, downloads and settings go with it.</lw-confirm-delete-button></div></div>`,
  notifications: `<div class="group">${switchRow('releases', 'Product updates', 'New releases of the software you own')}${switchRow('security', 'Security notices', 'Sign-ins from a new device, and changes to your password')}${switchRow('mentions', 'Mentions', 'When someone mentions you in a comment')}${switchRow('digest', 'Weekly digest', 'A summary of your workspace, every Monday')}</div>`,
  appearance: `<div class="group"><div class="row"><div class="row-text"><p class="row-label">Theme</p><p class="row-hint">System follows your device.</p></div><lw-theme-toggle-button class="theme" size="sm"></lw-theme-toggle-button></div>
<div class="row"><div class="row-text"><p class="row-label">Density</p><p class="row-hint">How much fits on a screen.</p></div>${segmented('density', 'Density', [['comfortable', 'Comfortable'], ['compact', 'Compact']])}</div></div>`,
  security: `<div class="group">${switchRow('twoFactor', 'Two-factor authentication', 'A code from your authenticator at every sign-in')}</div>
<div class="group sessions-group"><div class="group-head"><p class="row-label">Signed-in devices</p><p class="row-hint">Sign out of any device you don't recognize.</p></div><ul class="sessions"></ul></div>`,
  general: `<div class="group fields"><lw-text-input class="setting" data-key="workspace" label="Workspace name"></lw-text-input><lw-text-input class="setting" data-key="slug" label="Address" hint="Changing it breaks old links to the workspace."><span slot="start">app.lowersoft.com/</span></lw-text-input></div>`,
};

/**
 * Settings in one dialog: sections grouped down the side, each a panel of
 * fields, switches and choices built from the library's own components.
 * Changes are held as a draft across sections: the sections with changes
 * are dotted, and a bar at the foot saves or discards them. The theme
 * previews live and goes back on discard. The arrow keys move between
 * sections.
 *
 * @attr {string} section - The section shown
 * @attr {object} settings - The saved values (JSON); `theme` is `light`, `dark` or `system`, the page's by default
 * @fires lw-save - Saved; `detail: { settings, changed }`
 * @fires lw-sign-out-device - A device was signed out; `detail: { device }`
 * @fires lw-delete-account - Deleting the account was confirmed
 */
export class LwSettingsDialog extends LwModal {
  static styles = [modalStyles, iconStyles, styles];
  static props = {
    ...LwModal.props,
    section: { default: 'account', reflect: true },
    settings: { type: Object, default: DEMO_SETTINGS },
  };

  #saved = {};
  #draft = {};
  #sessions = [...DEMO_SESSIONS];
  #face = null;

  renderBody() {
    const nav = GROUPS.map((group) => `<p class="nav-group">${group.label}</p>${group.sections.map((section) => `<button class="section" type="button" role="tab" id="tab-${section.id}" aria-controls="panel-${section.id}" data-id="${section.id}">${strokeIcon(section.icon, 16)}<span>${section.label}</span><span class="changed" aria-hidden="true"></span></button>`).join('')}`).join('');
    const panels = SECTIONS.map((section) => `<section class="panel" role="tabpanel" id="panel-${section.id}" aria-labelledby="tab-${section.id}" data-id="${section.id}" hidden><header class="panel-head"><h3 class="panel-title">${section.label}</h3><p class="panel-lead">${section.lead}</p></header>${PANELS[section.id]}</section>`).join('');
    return `<div class="layout"><nav class="nav"><h2 class="title" id="modal-title">Settings</h2><div class="sections" role="tablist" aria-orientation="vertical"><span class="nav-pill" aria-hidden="true"></span>${nav}</div></nav>
<div class="panels">${panels}<footer class="savebar" role="status"><span class="changes"></span><lw-button class="discard" variant="ghost" size="sm">Discard</lw-button><lw-button class="save" size="sm">Save changes</lw-button></footer></div></div>`;
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
      const segment = event.target.closest('.segment');
      if (segment) this.#set(segment.dataset.key, segment.dataset.value);
      const signOut = event.target.closest('.sign-out');
      if (signOut) {
        const [session] = this.#sessions.splice(Number(signOut.dataset.index), 1);
        this.#paintSessions();
        this.emit('sign-out-device', { device: session.device });
      }
    }, options);
    // The theme previews as it is picked; it is saved or put back with the rest.
    this.query('.theme').addEventListener('lw-change', (event) => this.#set('theme', event.detail.value), options);
    this.query('.delete').addEventListener('lw-confirm', () => this.emit('delete-account'), options);
    this.query('.discard').addEventListener('click', () => this.#load(), options);
    this.query('.save').addEventListener('click', () => this.#save(), options);
    // The highlights follow their items once laid out, and as they reflow.
    const observer = new ResizeObserver(() => this.#paintPills());
    observer.observe(this.query('.layout'));
    // The portrait stops morphing too, so nothing draws once the dialog is gone.
    this.signal.addEventListener('abort', () => {
      observer.disconnect();
      this.#face?.stop();
    });
    this.#face = drawPortrait(this.query('.portrait'), this.#draft.name ?? ' ');
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('settings')) {
      // Without a saved theme, the one the page shows now counts as saved.
      this.#saved = { ...DEMO_SETTINGS, theme: themeChoice(), ...this.settings };
      this.#load();
    }
    for (const button of this.shadowRoot.querySelectorAll('.section')) {
      const selected = button.dataset.id === this.section;
      button.ariaSelected = String(selected);
      button.tabIndex = selected ? 0 : -1;
    }
    for (const panel of this.shadowRoot.querySelectorAll('.panel')) panel.hidden = panel.dataset.id !== this.section;
    this.#paintSessions();
    this.#paintPills();
  }

  opened() {
    requestAnimationFrame(() => this.#paintPills());
  }

  #load() {
    this.#draft = { ...this.#saved };
    for (const field of this.shadowRoot.querySelectorAll('lw-text-input.setting')) field.value = this.#draft[field.dataset.key] ?? '';
    for (const toggle of this.shadowRoot.querySelectorAll('lw-switch.setting')) toggle.checked = Boolean(this.#draft[toggle.dataset.key]);
    // The theme previewed goes back to the saved one; the toggle follows the page.
    if (this.#draft.theme && themeChoice() !== this.#draft.theme) setTheme(this.#draft.theme);
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
    for (const segment of this.shadowRoot.querySelectorAll('.segment')) {
      const checked = this.#draft[segment.dataset.key] === segment.dataset.value;
      segment.ariaChecked = String(checked);
      segment.tabIndex = checked ? 0 : -1;
    }
    const changed = this.#changed;
    // A dot on each section holding a change.
    for (const button of this.shadowRoot.querySelectorAll('.section')) {
      const panel = this.query(`.panel[data-id="${button.dataset.id}"]`);
      button.toggleAttribute('data-changed', changed.some((key) => panel.querySelector(`[data-key="${key}"]`) || (key === 'theme' && panel.querySelector('.theme'))));
    }
    // The profile header follows the name and email as they are typed.
    const name = (this.#draft.name ?? '').trim();
    this.query('.profile-name').textContent = name || 'Your name';
    this.query('.profile-email').textContent = this.#draft.email ?? '';
    this.#face?.show(avatarSeed(name || ' ', 0));
    this.query('.savebar').toggleAttribute('data-show', changed.length > 0);
    this.query('.changes').textContent = changed.length ? `${changed.length} unsaved ${changed.length === 1 ? 'change' : 'changes'}` : '';
    this.#paintPills();
  }

  // The nav pill under the section shown, the segment pills under their choice.
  #paintPills() {
    const current = this.query(`.section[data-id="${this.section}"]`);
    if (current?.offsetWidth) moveHighlight(this.query('.nav-pill'), current);
    for (const group of this.shadowRoot.querySelectorAll('.segmented')) {
      const checked = group.querySelector('[aria-checked="true"]');
      if (checked?.offsetWidth) moveHighlight(group.querySelector('.segment-pill'), checked);
      else hideHighlight(group.querySelector('.segment-pill'));
    }
  }

  #paintSessions() {
    this.query('.sessions').innerHTML = this.#sessions
      .map((session, i) => {
        const here = session.when === 'This device';
        return `<li class="session"><span class="device" aria-hidden="true">${strokeIcon(session.kind === 'phone' ? PHONE : monitor, 16)}</span><div class="row-text"><p class="row-label">${escapeHtml(session.device)}${here ? '<span class="here">This device</span>' : ''}</p><p class="row-hint">${escapeHtml(session.where)}${here ? '' : ` · ${escapeHtml(session.when)}`}</p></div>${here ? '' : `<lw-button class="sign-out" variant="outline" size="sm" data-index="${i}">Sign out</lw-button>`}</li>`;
      })
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
