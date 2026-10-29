import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { search } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { menuStyles } from '../../core/menu.js';
import { reducedMotion } from '../../core/motion.js';
import { hueOf, initialsOf } from '../../core/people.js';
import { createPicker, pickerMarkup } from '../../core/picker.js';
import { swapStyles } from '../../core/swap.js';
import styles from './team-member-list.scss?inline';

const ROLES = [
  { value: 'Admin', label: 'Admin', description: 'Billing, members and every project' },
  { value: 'Member', label: 'Member', description: 'Builds and edits projects' },
  { value: 'Viewer', label: 'Viewer', description: 'Reads and comments' },
  { value: 'remove', label: 'Remove from workspace' },
];

const DEMO_MEMBERS = [
  { name: 'Maya Lin', email: 'maya@northwind.dev', role: 'Owner', seen: 'Active now', online: true, you: true },
  { name: 'Theo Park', email: 'theo@northwind.dev', role: 'Admin', seen: 'Active now', online: true },
  { name: 'Ana Ruiz', email: 'ana@northwind.dev', role: 'Member', seen: '2h ago' },
  { name: 'Sam Okafor', email: 'sam@northwind.dev', role: 'Member', seen: 'Yesterday' },
  { name: 'Ines Alves', email: 'ines@northwind.dev', role: 'Viewer', seen: 'Last week' },
];

const FACES = 4;

/**
 * The people in a workspace: who is online, their role and when they were
 * last seen. Filter by name, email or role as you type; change a role, or
 * remove someone, from the menu on their row. The owner's role is fixed,
 * and you are marked.
 *
 * Members are `{ name, email, role, seen, online?, you? }`.
 *
 * @attr {Array<object>} members (JSON)
 * @fires lw-role - A role changed; `detail: { email, role }`
 * @fires lw-remove - Someone was removed; `detail: { email }`
 */
export class LwTeamMemberList extends LwElement {
  static styles = [iconStyles, menuStyles, swapStyles, styles];
  static props = {
    members: { type: Object, default: DEMO_MEMBERS },
  };

  #people = [];
  #rows = null;

  render() {
    return `<header class="head"><h2 class="title">Members</h2><span class="faces" aria-hidden="true"></span><span class="count"></span></header>
<label class="filter">${strokeIcon(search, 18)}<input class="query" type="search" placeholder="Filter by name, email or role" aria-label="Filter members" autocomplete="off"></label><ul class="list"></ul><p class="none" hidden>Nobody matches.</p>`;
  }

  connected() {
    this.query('.query').addEventListener('input', () => this.#filter(), { signal: this.signal });
  }

  updated(changed) {
    if (changed.has('members')) {
      this.#people = this.members.map((member) => ({ ...member }));
      this.#build();
    }
  }

  #build() {
    this.#rows?.abort();
    this.#rows = new AbortController();
    const signal = AbortSignal.any([this.signal, this.#rows.signal]);
    const list = this.query('.list');
    list.innerHTML = this.#people
      .map((member, i) => `<li class="member" data-index="${i}"><span class="avatar" style="--_hue: ${hueOf(member.name)}">${escapeHtml(initialsOf(member.name))}${member.online ? '<span class="online" title="Online"></span>' : ''}</span>
<div class="who"><p class="name">${escapeHtml(member.name)}${member.you ? '<span class="you">You</span>' : ''}</p><p class="email">${escapeHtml(member.email)}</p></div>
<div class="role-cell">${member.role === 'Owner' || member.you ? `<span class="role fixed">${escapeHtml(member.role)}</span>` : pickerMarkup(`role-menu-${i}`)}<p class="seen">${escapeHtml(member.seen)}</p></div></li>`)
      .join('');
    this.#people.forEach((member, i) => {
      const row = list.children[i];
      if (!row.querySelector('.picker')) return;
      const picker = createPicker(row.querySelector('.role-cell'), signal, (role) => (role === 'remove' ? this.#remove(i) : this.#setRole(i, role, picker)));
      picker.set(ROLES, member.role);
      row.querySelector('.picker-trigger').setAttribute('aria-label', `Role of ${member.name}: ${member.role}`);
    });
    this.#paintHead();
    this.#filter();
  }

  #paintHead() {
    this.query('.faces').innerHTML = this.#people.slice(0, FACES).map((member) => `<span class="face" style="--_hue: ${hueOf(member.name)}">${escapeHtml(initialsOf(member.name))}</span>`).join('');
    this.query('.count').textContent = `${this.#people.length} ${this.#people.length === 1 ? 'person' : 'people'}`;
  }

  #filter() {
    const term = this.query('.query').value.trim().toLowerCase();
    let shown = 0;
    for (const row of this.shadowRoot.querySelectorAll('.member')) {
      const member = this.#people[Number(row.dataset.index)];
      const match = !term || [member.name, member.email, member.role].some((text) => text.toLowerCase().includes(term));
      row.hidden = !match;
      if (match) shown++;
    }
    this.query('.none').hidden = shown > 0;
  }

  #setRole(index, role, picker) {
    const member = this.#people[index];
    if (member.role === role) return;
    member.role = role;
    picker.set(ROLES, role);
    this.query(`.member[data-index="${index}"] .picker-trigger`).setAttribute('aria-label', `Role of ${member.name}: ${role}`);
    this.emit('role', { email: member.email, role });
  }

  async #remove(index) {
    const row = this.query(`.member[data-index="${index}"]`);
    const [member] = this.#people.splice(index, 1);
    if (!reducedMotion.matches) await row.animate({ opacity: [1, 0], height: [`${row.offsetHeight}px`, '0px'] }, { duration: 250, easing: 'ease-out' }).finished;
    this.#build();
    this.emit('remove', { email: member.email });
  }
}
