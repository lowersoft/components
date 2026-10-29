import { writeClipboard } from '../../core/clipboard.js';
import { iconStyles } from '../../core/icons.js';
import { LwElement } from '../../core/lw-element.js';
import { Menu, menuMarkup, menuStyles } from '../../core/menu.js';
import { morph, morphStyles } from '../../core/morph.js';
import { swapStyles, swapText } from '../../core/swap.js';
import '../button/index.js';
import styles from './share-button.scss?inline';

const FADE_DURATION = 200;
const PANEL_ENTER = { opacity: [0, 1], translate: ['0 4px', '0 0'], filter: ['blur(4px)', 'blur(0)'] };
const COPIED_FOR = 1600;
const STACK_SIZE = 3; // avatars on the button before a "+N"
const REMOVE = 'remove';

const ICON = (name, body) =>
  `<svg class="icon ${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const LOCK_ICON = ICON('lock', '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>');
const GLOBE_ICON = ICON('globe', '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18"/>');
const LINK_ICON = ICON('link', '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>');
const CHEVRON_ICON = ICON('chevron', '<path d="m6 9 6 6 6-6"/>');

// A button that opens a single-choice menu, like the follow button's bell.
const pickerMarkup = (className, id, attributes = '') =>
  `<span class="picker ${className}"><button class="select" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="${id}" ${attributes}><span class="select-text swap"></span>${CHEVRON_ICON}</button>${menuMarkup(id)}</span>`;

const initials = ({ name, email }) =>
  (name || email)
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

// A stable hue per person, so they keep their color everywhere.
const hue = (text) => [...text].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 360, 7);

const avatar = (person) => {
  const node = Object.assign(document.createElement('span'), { className: 'avatar' });
  node.style.setProperty('--_hue', hue(person.email));
  if (person.avatar) node.append(Object.assign(document.createElement('img'), { src: person.avatar, alt: '' }));
  else node.textContent = initials(person);
  return node;
};

/**
 * Sharing that shows who has access before it opens. The button grows into a
 * panel that invites by email, changes roles, switches between invited people
 * only and anyone with the link, and copies the link.
 *
 * Every change is announced by a cancelable event before it is applied, so it
 * can be saved or refused.
 *
 * @attr {object[]} people - JSON list of `{ name, email, role, avatar }`; `role` is `owner`, `editor` or `viewer`
 * @attr {'restricted'|'link'} access - Who can open the link
 * @attr {string} link - URL copied by the link button
 * @attr {string} label - Button label
 * @attr {string} heading - Panel title
 * @attr {string} invite-placeholder
 * @attr {string} invite-label
 * @attr {string} viewer-label
 * @attr {string} editor-label
 * @attr {string} owner-label
 * @attr {string} remove-label
 * @attr {string} access-label
 * @attr {string} restricted-label
 * @attr {string} link-label
 * @attr {string} copy-label
 * @attr {string} copied-label
 * @attr {number} width - Panel width in px
 * @attr {'start'|'end'} align - Edge the panel grows from
 * @attr {'idle'|'open'} status - Settable to open or close
 * @fires lw-invite - `detail.email`, `detail.role`. Cancelable.
 * @fires lw-role-change - `detail.email`, `detail.role`. Cancelable.
 * @fires lw-remove - `detail.email`. Cancelable.
 * @fires lw-access-change - `detail.access`. Cancelable.
 * @fires lw-copy - `detail.link`
 */
export class LwShareButton extends LwElement {
  static styles = [iconStyles, morphStyles, menuStyles, swapStyles, styles];
  static props = {
    status: { default: 'idle', reflect: true },
    people: { type: Object, default: [] },
    access: { default: 'restricted', reflect: true },
    link: { default: '' },
    label: { default: 'Share' },
    heading: { default: 'Share' },
    invitePlaceholder: { default: 'Add people by email' },
    inviteLabel: { default: 'Invite' },
    viewerLabel: { default: 'Can view' },
    editorLabel: { default: 'Can edit' },
    ownerLabel: { default: 'Owner' },
    removeLabel: { default: 'Remove access' },
    accessLabel: { default: 'General access' },
    restrictedLabel: { default: 'Only people invited' },
    linkLabel: { default: 'Anyone with the link' },
    copyLabel: { default: 'Copy link' },
    copiedLabel: { default: 'Copied' },
    width: { type: Number, default: 380 },
    align: { default: 'start', reflect: true },
  };

  #parts = null;
  #pickers = null;
  #rows = new Map(); // email -> its row, kept across renders so its menu and text can animate
  #rowIds = 0;
  #inviteRole = 'viewer';
  #shown = null;
  #restoreFocus = false;
  #timer = 0;

  render() {
    return `<div class="shell" part="shell"><button class="trigger" type="button" aria-haspopup="dialog" aria-controls="panel" aria-expanded="false"><span class="avatars" aria-hidden="true"></span><span class="label"></span></button><div class="panel" id="panel" role="dialog" aria-labelledby="heading" hidden><p class="heading" id="heading"></p><form class="invite"><input class="email" type="email" required autocomplete="off">${pickerMarkup('invite-role', 'invite-menu')}<lw-button class="invite-button" type="submit" size="sm" disabled></lw-button></form><ul class="people"></ul><div class="access"><span class="access-label" id="access-label"></span><div class="access-row"><span class="access-icon">${LOCK_ICON}${GLOBE_ICON}</span>${pickerMarkup('access-picker', 'access-menu', 'aria-labelledby="access-label access-text"')}</div></div><div class="footer"><lw-button class="copy" variant="outline" size="sm"><span slot="start">${LINK_ICON}</span><span class="copy-text"></span></lw-button></div></div></div><span class="live" aria-live="polite"></span>`;
  }

  connected() {
    this.#parts ??= {
      shell: this.query('.shell'),
      trigger: this.query('.trigger'),
      panel: this.query('.panel'),
      email: this.query('.email'),
      inviteButton: this.query('.invite-button'),
      copy: this.query('.copy'),
    };
    const { trigger, panel, email, copy } = this.#parts;
    const options = { signal: this.signal };
    this.query('.access-picker .select-text').id = 'access-text';
    this.#pickers = {
      invite: this.#picker(this.query('.invite-role'), this.signal, (role) => {
        this.#inviteRole = role;
        this.#syncPickers();
      }),
      access: this.#picker(this.query('.access-picker'), this.signal, (access) => this.#changeAccess(access)),
    };

    trigger.addEventListener('click', () => (this.status = 'open'), options);
    // Escape inside a menu closes only the menu.
    panel.addEventListener('keydown', (event) => event.key === 'Escape' && !event.defaultPrevented && (this.status = 'idle'), options);
    this.query('.invite').addEventListener('submit', this.#invite, options);
    email.addEventListener('input', () => (this.#parts.inviteButton.disabled = !email.value || !email.checkValidity()), options);
    copy.addEventListener('click', () => this.#copy(), options);
    document.addEventListener('pointerdown', (event) => event.composedPath().includes(this) || (this.status = 'idle'), options);
    this.signal.addEventListener('abort', () => clearTimeout(this.#timer));

    // Reconnected: the rows' menus lost their listeners with the old signal.
    if (this.#rows.size) {
      for (const row of this.#rows.values()) row.node.remove();
      this.#rows.clear();
      this.#renderPeople();
    }
  }

  updated(changed) {
    const { panel, email, inviteButton } = this.#parts;
    const text = { label: '.label', heading: '.heading', accessLabel: '.access-label', copyLabel: '.copy-text' };
    for (const [prop, selector] of Object.entries(text)) {
      if (changed.has(prop)) this.query(selector).textContent = this[prop];
    }
    if (changed.has('invitePlaceholder')) {
      email.placeholder = this.invitePlaceholder;
      email.ariaLabel = this.invitePlaceholder;
    }
    if (changed.has('inviteLabel')) inviteButton.textContent = this.inviteLabel;
    if (changed.has('width')) panel.style.width = `${this.width - 2}px`;
    if (['access', 'viewerLabel', 'editorLabel', 'restrictedLabel', 'linkLabel'].some((prop) => changed.has(prop))) {
      this.#syncPickers();
    }
    if (['people', 'viewerLabel', 'editorLabel', 'ownerLabel', 'removeLabel'].some((prop) => changed.has(prop))) {
      this.#renderPeople();
    }
    if (changed.has('status')) this.#show();
  }

  // A trigger and its menu; `set` fills the menu and swaps in the chosen label,
  // the old one leaving upward as the new one rises, like the split button.
  #picker(root, signal, onPick) {
    const trigger = root.querySelector('.select');
    const menu = new Menu({ trigger, menu: root.querySelector('.menu'), onPick });
    menu.connect(signal);
    return {
      set(items, value) {
        menu.setItems(items);
        menu.setChecked(value);
        swapText(trigger.querySelector('.select-text'), items.find((item) => item.value === value)?.label ?? '', trigger);
      },
    };
  }

  get #roles() {
    return [
      { value: 'viewer', label: this.viewerLabel },
      { value: 'editor', label: this.editorLabel },
    ];
  }

  #syncPickers() {
    this.#pickers.invite.set(this.#roles, this.#inviteRole);
    this.#pickers.access.set(
      [
        { value: 'restricted', label: this.restrictedLabel },
        { value: 'link', label: this.linkLabel },
      ],
      this.access,
    );
  }

  #renderPeople() {
    const people = this.people ?? [];
    const stack = people.slice(0, STACK_SIZE).map(avatar);
    if (people.length > STACK_SIZE) {
      stack.push(Object.assign(document.createElement('span'), { className: 'avatar more', textContent: `+${people.length - STACK_SIZE}` }));
    }
    this.query('.avatars').replaceChildren(...stack);

    // Rows are kept by email and updated in place, so a changed role animates.
    const roles = [...this.#roles, { value: REMOVE, label: this.removeLabel }];
    const list = this.query('.people');
    const emails = new Set(people.map((person) => person.email));
    for (const [email, row] of this.#rows) {
      if (emails.has(email)) continue;
      row.controller.abort();
      row.node.remove();
      this.#rows.delete(email);
    }

    people.forEach((person, index) => {
      let row = this.#rows.get(person.email);
      if (!row) {
        row = this.#createRow(person);
        this.#rows.set(person.email, row);
      }
      row.update(person, roles);
      // Move only rows that are out of place; detaching would stop their animations.
      if (list.children[index] !== row.node) list.insertBefore(row.node, list.children[index] ?? null);
    });
  }

  #createRow(person) {
    const node = Object.assign(document.createElement('li'), { className: 'person' });
    const name = Object.assign(document.createElement('span'), { className: 'name' });
    const address = Object.assign(document.createElement('span'), { className: 'address' });
    const who = Object.assign(document.createElement('span'), { className: 'who' });
    who.append(name, address);
    const controller = new AbortController();

    let role;
    let picker = null;
    if (person.role === 'owner') {
      role = Object.assign(document.createElement('span'), { className: 'owner' });
    } else {
      const template = document.createElement('template');
      template.innerHTML = pickerMarkup('role', `role-menu-${++this.#rowIds}`);
      role = template.content.firstElementChild;
      const signal = AbortSignal.any([this.signal, controller.signal]);
      picker = this.#picker(role, signal, (value) => this.#changeRole(person.email, value));
    }
    node.append(avatar(person), who, role);

    return {
      node,
      controller,
      update: (current, roles) => {
        name.textContent = current.name || current.email;
        address.textContent = current.name ? current.email : '';
        if (!picker) {
          role.textContent = this.ownerLabel;
          return;
        }
        picker.set(roles, current.role);
        const label = roles.find((entry) => entry.value === current.role)?.label ?? '';
        role.querySelector('.select').ariaLabel = `${current.name || current.email}: ${label}`;
      },
    };
  }

  #invite = (event) => {
    event.preventDefault();
    const { email, inviteButton } = this.#parts;
    const address = email.value.trim().toLowerCase();
    const role = this.#inviteRole;
    if (!address || !email.checkValidity() || this.people.some((person) => person.email === address)) return;
    if (!this.emit('invite', { email: address, role })) return;

    this.people = [...this.people, { email: address, role }];
    email.value = '';
    inviteButton.disabled = true;
    email.focus();
  };

  // A refused change puts the row's menu back.
  #changeRole(email, value) {
    const person = this.people.find((entry) => entry.email === email);
    if (!person || value === person.role) return;
    const restore = () => this.#rows.get(email)?.update(person, [...this.#roles, { value: REMOVE, label: this.removeLabel }]);

    if (value === REMOVE) {
      if (this.emit('remove', { email })) this.people = this.people.filter((entry) => entry !== person);
      else restore();
      return;
    }
    if (this.emit('role-change', { email, role: value })) {
      this.people = this.people.map((entry) => (entry === person ? { ...entry, role: value } : entry));
    } else {
      restore();
    }
  }

  #changeAccess(access) {
    if (access === this.access) return;
    if (this.emit('access-change', { access })) this.access = access;
    else this.#syncPickers();
  }

  async #copy() {
    try {
      await writeClipboard(this.link);
    } catch {
      return;
    }
    this.emit('copy', { link: this.link });
    this.query('.copy-text').textContent = this.copiedLabel;
    this.query('.live').textContent = this.copiedLabel;
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => {
      this.query('.copy-text').textContent = this.copyLabel;
      this.query('.live').textContent = '';
    }, COPIED_FOR);
  }

  // Swaps the button and the panel and morphs the shell between them.
  #show() {
    const status = this.status === 'open' ? 'open' : 'idle';
    const previous = this.#shown;
    if (status === previous) return;
    this.#shown = status;

    const { shell, trigger, panel, email } = this.#parts;
    morph({
      host: this,
      shell,
      parts: { trigger, panel },
      visible: [status === 'open' ? 'panel' : 'trigger'],
      opening: previous === 'idle',
      closing: status === 'idle' && previous !== null,
      animate: previous !== null,
      isClosed: () => this.#shown === 'idle',
      enter: (part) => [
        part === panel ? PANEL_ENTER : { opacity: [0, 1] },
        { duration: FADE_DURATION, delay: part === panel ? 80 : 100, easing: 'ease-out', fill: 'backwards' },
      ],
    });
    trigger.ariaExpanded = String(status === 'open');

    // Focus follows the shape: into the invite field on open, back to the button after.
    if (status === 'open') {
      email.focus({ preventScroll: true });
      this.#restoreFocus = true;
    } else if (this.#restoreFocus) {
      this.#restoreFocus = false;
      if (this.matches(':focus-within') || document.activeElement === document.body) trigger.focus({ preventScroll: true });
    }
  }
}
