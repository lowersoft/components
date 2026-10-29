import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { chevronRight, fileText, plus, search, sunMoon, user } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf, initialsOf } from '../../core/people.js';
import { IS_APPLE } from '../../core/platform.js';
import { matchesShortcut, parseShortcut } from '../../core/shortcut.js';
import { setTheme } from '../../core/theme.js';
import styles from './command-palette.scss?inline';

const PENCIL = '<path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>';
const MOVE = '<path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>';
const OPEN_SHORTCUT = parseShortcut('mod+k');

const KINDS = [
  { id: '', label: 'All' },
  { id: 'action', label: 'Actions', prefix: '>' },
  { id: 'page', label: 'Pages', prefix: '#' },
  { id: 'person', label: 'People', prefix: '@' },
];

const DEMO_COMMANDS = [
  { id: 'new-issue', kind: 'action', label: 'New issue', icon: plus, keys: 'c' },
  { id: 'rename', kind: 'action', label: 'Rename page', icon: PENCIL, keys: 'f2' },
  { id: 'move', kind: 'action', label: 'Move to', icon: MOVE, children: [{ id: 'runtime', label: 'Runtime', color: '#3b82f6' }, { id: 'profiler', label: 'Profiler', color: '#8e4ec6' }, { id: 'toolchain', label: 'Toolchain', color: '#f59e0b' }] },
  { id: 'theme', kind: 'action', label: 'Change theme', icon: sunMoon, children: [{ id: 'system', label: 'System' }, { id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }] },
  { id: 'invite', kind: 'action', label: 'Invite teammates', icon: user },
  { id: 'copy-link', kind: 'action', label: 'Copy link to page', icon: fileText, keys: 'mod+shift+c' },
  { id: 'p-roadmap', kind: 'page', label: 'Roadmap 2027', icon: fileText },
  { id: 'p-profiler', kind: 'page', label: 'Profiler v2 spec', icon: fileText },
  { id: 'p-release', kind: 'page', label: 'Release checklist', icon: fileText },
  { id: 'p-oncall', kind: 'page', label: 'On-call runbook', icon: fileText },
  { id: 'u-maya', kind: 'person', label: 'Maya Chen' },
  { id: 'u-theo', kind: 'person', label: 'Theo Park' },
  { id: 'u-ana', kind: 'person', label: 'Ana Ruiz' },
  { id: 'u-sam', kind: 'person', label: 'Sam Okafor' },
];

const RECENT_MAX = 3;

/**
 * A command palette: search everything, or narrow to actions, pages or
 * people with the tabs or a prefix (`>`, `#`, `@`). Some commands open a
 * second step, like "Move to › Runtime"; Backspace on an empty search
 * steps back out. The arrow keys move a highlight that slides, Enter runs,
 * and Ctrl+K (⌘K on Apple) focuses it from anywhere. What was run lately
 * waits at the top.
 *
 * Commands are `{ id, kind, label, icon?, keys?, children? }`, `kind` one
 * of action, page or person, `children` `{ id, label, color? }`.
 *
 * @attr {Array<object>} commands (JSON)
 * @fires lw-run - A command ran; `detail: { id, value }`, `value` the second step's id
 */
export class LwCommandPalette extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    commands: { type: Object, default: DEMO_COMMANDS },
  };

  #kind = '';
  #scope = null;
  #active = 0;
  #flat = [];
  #recent = [{ id: 'rename' }, { id: 'move', value: 'profiler' }, { id: 'theme', value: 'dark' }];

  render() {
    const key = IS_APPLE ? '⌘' : 'Ctrl';
    return `<div class="search">${strokeIcon(search, 18)}<span class="scope" hidden></span><input class="query" type="text" role="combobox" aria-controls="results" aria-expanded="true" aria-autocomplete="list" placeholder="Search or type a command…" aria-label="Search or type a command" autocomplete="off" spellcheck="false"><span class="keys" aria-hidden="true"><kbd>${key}</kbd><kbd>K</kbd></span></div>
<div class="tabs" role="tablist" aria-label="Show">${KINDS.map((kind) => `<button class="tab" type="button" role="tab" data-kind="${kind.id}">${kind.label}<span class="tab-count"></span></button>`).join('')}</div>
<div class="results" id="results" role="listbox" aria-label="Results"><span class="highlight"></span><div class="groups"></div><p class="none" hidden>No results. Try another word.</p></div>
<footer class="foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> run</span><span class="scopes">Type <b>&gt;</b> <b>#</b> <b>@</b> to scope</span></footer><p class="live visually-hidden" aria-live="polite"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const query = this.query('.query');
    query.addEventListener('input', () => {
      this.#active = 0;
      this.#paint();
    }, options);
    query.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.tabs').addEventListener('click', (event) => {
      const tab = event.target.closest('.tab');
      if (!tab) return;
      this.#kind = tab.dataset.kind;
      this.#active = 0;
      this.#paint();
      query.focus();
    }, options);
    const results = this.query('.results');
    results.addEventListener('click', (event) => {
      const item = event.target.closest('.item');
      if (item) this.#run(Number(item.dataset.index));
    }, options);
    results.addEventListener('pointermove', (event) => {
      const item = event.target.closest('.item');
      if (!item || Number(item.dataset.index) === this.#active) return;
      this.#active = Number(item.dataset.index);
      this.#paintActive();
    }, options);
    document.addEventListener('keydown', (event) => {
      if (!matchesShortcut(event, OPEN_SHORTCUT)) return;
      event.preventDefault();
      query.focus();
      query.select();
    }, options);
  }

  updated() {
    this.#paint();
  }

  // The search without its prefix, and the kind a prefix asks for.
  get #parsed() {
    const raw = this.query('.query').value;
    const prefixed = KINDS.find((kind) => kind.prefix && raw.startsWith(kind.prefix));
    return { term: (prefixed ? raw.slice(1) : raw).trim().toLowerCase(), kind: prefixed?.id ?? this.#kind };
  }

  // The rows to show, in groups: a second step's choices, or the commands.
  get #entries() {
    const { term, kind } = this.#parsed;
    const match = (label) => !term || label.toLowerCase().includes(term);
    if (this.#scope) {
      return [{ title: this.#scope.label, items: this.#scope.children.filter((child) => match(child.label)).map((child) => ({ command: this.#scope, child })) }];
    }
    const groups = [];
    if (!term && !kind) {
      const recent = this.#recent.map((entry) => {
        const command = this.commands.find((each) => each.id === entry.id);
        return command && { command, child: command.children?.find((child) => child.id === entry.value), recent: true };
      }).filter(Boolean);
      if (recent.length) groups.push({ title: 'Recent', items: recent });
    }
    for (const each of KINDS.slice(1)) {
      if (kind && kind !== each.id) continue;
      const items = this.commands.filter((command) => command.kind === each.id && match(command.label)).map((command) => ({ command }));
      if (items.length) groups.push({ title: each.label, items });
    }
    return groups;
  }

  #paint() {
    const { term } = this.#parsed;
    const scope = this.query('.scope');
    scope.hidden = !this.#scope;
    scope.innerHTML = this.#scope ? `${escapeHtml(this.#scope.label)}${strokeIcon(chevronRight, 14)}` : '';
    this.query('.tabs').hidden = Boolean(this.#scope);
    for (const tab of this.shadowRoot.querySelectorAll('.tab')) {
      const kind = tab.dataset.kind;
      tab.ariaSelected = String(kind === this.#parsed.kind);
      tab.querySelector('.tab-count').textContent = String(this.commands.filter((command) => (!kind || command.kind === kind) && (!term || command.label.toLowerCase().includes(term))).length);
    }
    let index = 0;
    const groups = this.#entries;
    this.#flat = groups.flatMap((group) => group.items);
    this.query('.groups').innerHTML = groups
      .map((group) => `<section class="group" role="group" aria-label="${escapeHtml(group.title)}"><p class="group-title" aria-hidden="true">${escapeHtml(group.title)}</p>${group.items.map((entry) => this.#item(entry, index++)).join('')}</section>`)
      .join('');
    this.query('.none').hidden = this.#flat.length > 0;
    this.#active = Math.min(this.#active, Math.max(0, this.#flat.length - 1));
    this.#paintActive();
  }

  #item({ command, child, recent }, index) {
    const icon = command.kind === 'person'
      ? `<span class="person" style="--_hue: ${hueOf(command.label)}">${escapeHtml(initialsOf(command.label))}</span>`
      : child?.color
        ? `<span class="swatch" style="background: ${escapeHtml(child.color)}"></span>`
        : strokeIcon(command.icon ?? fileText, 16);
    const label = child && (recent || this.#scope)
      ? recent ? `<span class="parent">${escapeHtml(command.label)} ›</span> ${escapeHtml(child.label)}` : escapeHtml(child.label)
      : escapeHtml(command.label);
    const keys = !child && command.keys ? `<span class="item-keys">${parseShortcut(command.keys).labels.map((cap) => `<kbd>${escapeHtml(cap)}</kbd>`).join('')}</span>` : '';
    const more = !child && command.children ? strokeIcon(chevronRight, 15) : '';
    return `<div class="item" role="option" id="option-${index}" data-index="${index}" aria-selected="false">${icon}<span class="label">${label}</span>${keys}${more}</div>`;
  }

  #paintActive() {
    const items = [...this.shadowRoot.querySelectorAll('.item')];
    items.forEach((item, i) => item.ariaSelected = String(i === this.#active));
    const active = items[this.#active];
    const query = this.query('.query');
    const highlight = this.query('.highlight');
    if (active) {
      moveHighlight(highlight, active);
      active.scrollIntoView({ block: 'nearest' });
      query.setAttribute('aria-activedescendant', active.id);
    } else {
      hideHighlight(highlight);
      query.removeAttribute('aria-activedescendant');
    }
  }

  #run(index) {
    const entry = this.#flat[index];
    if (!entry) return;
    const { command, child } = entry;
    // A command with a second step opens it, unless the choice came along.
    if (command.children && !child) {
      this.#scope = command;
      this.query('.query').value = '';
      this.#active = 0;
      this.#paint();
      this.query('.live').textContent = `${command.label}: choose one`;
      return;
    }
    if (command.id === 'theme' && child) setTheme(child.id);
    this.#recent = [{ id: command.id, value: child?.id }, ...this.#recent.filter((each) => each.id !== command.id || each.value !== child?.id)].slice(0, RECENT_MAX);
    this.#scope = null;
    this.query('.query').value = '';
    this.#active = 0;
    this.#paint();
    this.query('.live').textContent = `${command.label}${child ? ` ${child.label}` : ''}: done`;
    this.emit('run', { id: command.id, value: child?.id });
  }

  #key(event) {
    const count = this.#flat.length;
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (step && count) {
      event.preventDefault();
      this.#active = (this.#active + step + count) % count;
      this.#paintActive();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.#run(this.#active);
    } else if ((event.key === 'Backspace' && !event.target.value) || event.key === 'Escape') {
      if (!this.#scope && !(event.key === 'Escape' && event.target.value)) return;
      event.preventDefault();
      if (this.#scope && !event.target.value) this.#scope = null;
      else event.target.value = '';
      this.#active = 0;
      this.#paint();
    }
  }
}
