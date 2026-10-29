import { writeClipboard } from '../../core/clipboard.js';
import { escapeHtml } from '../../core/dom.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { heroIntro, paintHeroText } from '../../core/hero.js';
import { strokeIcon } from '../../core/icons.js';
import { inbox, layers, search, squareKanban, timer, triangleAlert } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf, initialsOf } from '../../core/people.js';
import { IS_APPLE } from '../../core/platform.js';
import '../button/index.js';
import styles from './product-stage-hero.scss?inline';

// Statuses in the order the list groups them.
const STATUSES = ['In progress', 'In review', 'Todo', 'Backlog', 'Done'];
const MOD = IS_APPLE ? '⌘' : 'Ctrl';
const PEOPLE = ['Maya Kerr', 'Jon Barros', 'Ada Finch', 'Leo Okafor'];
const ME = PEOPLE[0];

const LABEL_HUES = { Renderer: 250, Memory: 15, Perf: 75, Crash: 0, Platform: 295, Build: 160 };

const DEMO_ISSUES = [
  { id: 'LOW-482', title: 'Segfault resizing the window on Wayland', status: 'In progress', priority: 4, assignee: 'Maya Kerr', labels: ['Crash', 'Platform'], due: 'Oct 17', target: 'linux-x86_64', description: 'The swapchain is recreated while a frame still holds the old surface. Wait on the in-flight fence before tearing it down.' },
  { id: 'LOW-476', title: 'Font atlas leaks on every theme switch', status: 'In progress', priority: 3, assignee: 'Ada Finch', labels: ['Memory'], due: 'Oct 18', target: 'all', description: 'Each switch allocates a new atlas and never frees the old one: 4 MB a time. Reuse the glyph pages and free on swap.' },
  { id: 'LOW-479', title: 'SIMD path for the blur kernel', status: 'In review', priority: 2, assignee: 'Jon Barros', labels: ['Perf', 'Renderer'], due: 'Oct 16', target: 'x86_64, arm64', description: 'The scalar blur takes 6 ms per frame at 4K. AVX2 and NEON paths bring it under 1 ms with the same output.' },
  { id: 'LOW-471', title: 'Cut cold start below 10 ms', status: 'Todo', priority: 2, assignee: 'Leo Okafor', labels: ['Perf'], due: 'Oct 22', target: 'all', description: 'Startup spends 14 ms loading fonts eagerly. Map the font files lazily and build the atlas on first draw.' },
  { id: 'LOW-468', title: 'Reproducible release builds', status: 'Todo', priority: 1, assignee: 'Maya Kerr', labels: ['Build'], due: 'Oct 24', target: 'all', description: 'Two builds of the same commit differ by their timestamps. Pin SOURCE_DATE_EPOCH and sort the archive members.' },
];

const NAV = [
  { label: 'Inbox', icon: inbox, count: 3 },
  { label: 'My issues', icon: layers, count: 7 },
  { label: 'Releases', icon: timer, current: true },
  { label: 'Crashes', icon: triangleAlert, count: 2 },
  { label: 'Board', icon: squareKanban },
];

const next = (list, value) => list[(list.indexOf(value) + 1) % list.length];

// The commands act on the selected issue; each says what the toast reports.
const COMMANDS = [
  { id: 'assign', label: () => `Assign to ${ME}`, keys: ['A'], apply: () => ({ assignee: ME }), says: () => `assigned to ${ME}` },
  { id: 'status', label: (issue) => `Change status to ${next(STATUSES, issue.status)}`, keys: ['S'], apply: (issue) => ({ status: next(STATUSES, issue.status) }), says: (issue) => `moved to ${issue.status}` },
  { id: 'priority', label: () => 'Raise priority', keys: ['P'], apply: (issue) => ({ priority: (issue.priority + 1) % 5 }), says: () => 'priority raised' },
  { id: 'done', label: () => 'Mark as done', keys: [MOD, 'D'], apply: () => ({ status: 'Done' }), says: () => 'marked as done' },
  { id: 'copy', label: () => 'Copy issue link', keys: [MOD, '.'], apply: () => ({}), says: () => 'link copied' },
];

const avatar = (name) => `<span class="avatar" style="--_hue: ${hueOf(name)}" title="${escapeHtml(name)}">${escapeHtml(initialsOf(name))}</span>`;
const statusIcon = (status) => `<span class="status-icon" data-status="${STATUSES.indexOf(status)}" aria-hidden="true"></span>`;
// Priority as four signal bars, as many lit as the level.
const priorityIcon = (level) => `<span class="priority" aria-label="Priority ${level} of 4">${[1, 2, 3, 4].map((bar) => `<i${bar <= level ? ' data-on' : ''}></i>`).join('')}</span>`;
const labelChip = (name) => `<span class="chip" style="--_hue: ${LABEL_HUES[name] ?? 0}">${escapeHtml(name)}</span>`;

/**
 * A product hero: a large headline beside the pitch, over a full-width app
 * window that fades into the page. The issues are grouped by status; pick
 * one (or use the arrow keys) and its detail opens beside the list. The
 * command menu layered over the window acts on it, and a toast reports
 * each change, with Undo. Ctrl or ⌘ K jumps to the menu.
 *
 * Issues are `{ id, title, status, priority (0–4), assignee, labels, due, target, description }`,
 * where `target` names the platforms an issue affects.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} product - The app's name in the window's top bar
 * @attr {string} team
 * @attr {string} cycle - The cycle shown, e.g. "Release 0.9"
 * @attr {string} range - The cycle's dates
 * @attr {number} progress - How far through the cycle, in percent
 * @attr {Array<object>} issues (JSON)
 * @attr {string} issue - The selected issue's id
 * @fires lw-select - An issue was selected; `detail: { issue }`
 * @fires lw-command - A command ran; `detail: { command, issue }`
 * @slot eyebrow - A small line above the heading
 * @slot actions - Calls to action under the description; two by default
 */
export class LwProductStageHero extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Fix it before it ships.' },
    description: { default: 'Triage crashes, plan releases and land patches for lower from one keyboard-first workspace. Targets and stack traces sit beside every issue, and nothing waits on a spinner.' },
    product: { default: 'lower' },
    team: { default: 'Core' },
    cycle: { default: 'Release 0.9' },
    range: { default: 'Oct 13 – Oct 24' },
    progress: { type: Number, default: 64 },
    issues: { type: Object, default: DEMO_ISSUES },
    issue: { default: DEMO_ISSUES[0].id },
  };

  #active = 0;
  #undo = null;

  render() {
    return `<div class="container">
${heroIntro('Start tracking', 'Read the changelog')}
<div class="stage">
<div class="window">
<header class="bar"><span class="logo" aria-hidden="true"></span><nav class="crumbs" aria-label="Location"><span class="product"></span><span class="team"></span><span class="cycle"></span></nav><span class="range"></span>
<button class="search" type="button">${strokeIcon(search, 16)}<span>Search issues</span><kbd>${MOD} K</kbd></button><span class="people" aria-label="Team">${PEOPLE.map(avatar).join('')}</span></header>
<div class="app">
<nav class="sidebar" aria-label="Views">${NAV.map((item) => `<a${item.current ? ' aria-current="page"' : ''}>${strokeIcon(item.icon, 16)}<span>${item.label}</span>${item.count ? `<span class="count">${item.count}</span>` : ''}</a>`).join('')}</nav>
<div class="list" role="listbox" tabindex="0" aria-label="Issues"><span class="highlight"></span><div class="groups"></div></div>
<article class="detail" aria-live="polite"></article></div></div>
<div class="menu" role="dialog" aria-label="Command menu"><div class="menu-search"><span class="target"></span><input class="command-input" placeholder="Type a command…" aria-label="Command" role="combobox" aria-controls="commands" aria-expanded="true" autocomplete="off"></div>
<div class="commands" id="commands" role="listbox"><span class="highlight"></span><div class="command-rows"></div></div></div>
<div class="toast" role="status"><span class="toast-text"></span><button class="undo" type="button">Undo</button></div>
</div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const list = this.query('.list');
    list.addEventListener('click', (event) => {
      const row = event.target.closest('.row');
      if (row) this.#select(row.dataset.id);
    }, options);
    list.addEventListener('keydown', (event) => this.#listKey(event), options);
    const input = this.query('.command-input');
    const openMenu = () => {
      input.focus();
      input.select();
    };
    this.query('.search').addEventListener('click', openMenu, options);
    input.addEventListener('input', () => {
      this.#active = 0;
      this.#paintCommands();
    }, options);
    input.addEventListener('keydown', (event) => this.#menuKey(event), options);
    const rows = this.query('.command-rows');
    rows.addEventListener('click', (event) => {
      const row = event.target.closest('.command');
      if (row) this.#runCommand(row.dataset.id);
    }, options);
    rows.addEventListener('pointermove', (event) => {
      const row = event.target.closest('.command');
      if (!row) return;
      this.#active = [...rows.children].indexOf(row);
      this.#paintActive();
    }, options);
    this.query('.undo').addEventListener('click', () => this.#revert(), options);
    // Ctrl or ⌘ K anywhere in the hero jumps to the command menu.
    this.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() !== 'k' || !(IS_APPLE ? event.metaKey : event.ctrlKey)) return;
      event.preventDefault();
      openMenu();
    }, options);
  }

  updated(changed) {
    paintHeroText(this);
    this.query('.logo').textContent = (this.product ?? '').charAt(0);
    this.query('.product').textContent = this.product ?? '';
    this.query('.team').textContent = this.team ?? '';
    this.query('.cycle').textContent = this.cycle ?? '';
    this.query('.range').textContent = `${this.range} · ${this.progress}%`;
    if (changed.has('issues') || changed.has('issue')) this.#paint();
  }

  get #selected() {
    return this.issues.find((issue) => issue.id === this.issue) ?? this.issues[0];
  }

  // The issues in list order: grouped by status.
  get #ordered() {
    return STATUSES.flatMap((status) => this.issues.filter((issue) => issue.status === status));
  }

  #paint() {
    const selected = this.#selected;
    this.query('.groups').innerHTML = STATUSES.map((status) => {
      const issues = this.issues.filter((issue) => issue.status === status);
      if (!issues.length) return '';
      const rows = issues
        .map((issue) => `<div class="row" role="option" id="issue-${escapeHtml(issue.id)}" data-id="${escapeHtml(issue.id)}" aria-selected="${issue === selected}">${priorityIcon(issue.priority)}<span class="issue-id">${escapeHtml(issue.id)}</span>${statusIcon(issue.status)}<span class="issue-title">${escapeHtml(issue.title)}</span><span class="chips">${(issue.labels ?? []).map(labelChip).join('')}</span><span class="due">${escapeHtml(issue.due ?? '')}</span>${avatar(issue.assignee)}</div>`)
        .join('');
      return `<div class="group" role="group" aria-label="${status}"><p class="group-head">${statusIcon(status)}${status}<span class="count">${issues.length}</span></p>${rows}</div>`;
    }).join('');
    this.query('.list').setAttribute('aria-activedescendant', `issue-${selected?.id ?? ''}`);
    // The highlight needs the rows laid out.
    requestAnimationFrame(() => moveHighlight(this.query('.list .highlight'), this.query('.row[aria-selected="true"]')));
    if (!selected) return;
    const field = (name, value) => `<div><dt>${name}</dt><dd>${value}</dd></div>`;
    this.query('.detail').innerHTML = `<p class="detail-id">${escapeHtml(selected.id)}</p><h2 class="detail-title">${escapeHtml(selected.title)}</h2><p class="detail-text">${escapeHtml(selected.description ?? '')}</p>
<dl class="fields">${field('Status', `${statusIcon(selected.status)}${escapeHtml(selected.status)}`)}${field('Assignee', `${avatar(selected.assignee)}${escapeHtml(initialsOf(selected.assignee))}`)}${field('Priority', priorityIcon(selected.priority))}${field('Labels', (selected.labels ?? []).map(labelChip).join(''))}${field('Target', `<code>${escapeHtml(selected.target ?? '')}</code>`)}${field('Due', escapeHtml(selected.due ?? ''))}</dl>`;
    this.query('.target').textContent = selected.id;
    this.#paintCommands();
  }

  get #matches() {
    const query = this.query('.command-input').value.trim().toLowerCase();
    const issue = this.#selected;
    return COMMANDS.filter((command) => command.label(issue).toLowerCase().includes(query));
  }

  #paintCommands() {
    const issue = this.#selected;
    if (!issue) return;
    const matches = this.#matches;
    this.#active = Math.min(this.#active, Math.max(0, matches.length - 1));
    this.query('.command-rows').innerHTML = matches.length
      ? matches.map((command) => `<div class="command" role="option" id="command-${command.id}" data-id="${command.id}">${escapeHtml(command.label(issue))}<span class="keys">${command.keys.map((key) => `<kbd>${escapeHtml(key)}</kbd>`).join('')}</span></div>`).join('')
      : '<p class="empty">No commands match.</p>';
    this.#paintActive();
  }

  #paintActive() {
    const rows = this.query('.command-rows').querySelectorAll('.command');
    rows.forEach((row, i) => (row.ariaSelected = String(i === this.#active)));
    const active = rows[this.#active];
    const input = this.query('.command-input');
    if (active) input.setAttribute('aria-activedescendant', active.id);
    else input.removeAttribute('aria-activedescendant');
    const highlight = this.query('.commands .highlight');
    if (active) moveHighlight(highlight, active);
    else hideHighlight(highlight);
  }

  #select(id) {
    if (id === this.issue) return;
    this.issue = id;
    this.emit('select', { issue: this.#selected });
  }

  #listKey(event) {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const ordered = this.#ordered;
    const index = ordered.indexOf(this.#selected);
    this.#select(ordered[(index + step + ordered.length) % ordered.length].id);
  }

  #menuKey(event) {
    const count = this.#matches.length;
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (step && count) {
      event.preventDefault();
      this.#active = (this.#active + step + count) % count;
      this.#paintActive();
    } else if (event.key === 'Enter' && count) {
      event.preventDefault();
      this.#runCommand(this.#matches[this.#active].id);
    } else if (event.key === 'Escape') {
      event.target.value = '';
      this.#paintCommands();
      this.query('.list').focus();
    }
  }

  #runCommand(id) {
    const command = COMMANDS.find((each) => each.id === id);
    const before = this.#selected;
    if (!command || !before) return;
    const after = { ...before, ...command.apply(before) };
    this.issues = this.issues.map((issue) => (issue === before ? after : issue));
    if (id === 'copy') writeClipboard(`${location.origin}/issue/${before.id}`).catch(() => {});
    this.#toast(`${before.id} ${command.says(after)}`, id === 'copy' ? null : before);
    this.query('.command-input').value = '';
    this.#active = 0;
    this.emit('command', { command: id, issue: after });
  }

  // Each change is reported with Undo, which puts the issue back.
  #toast(text, previous) {
    this.#undo = previous;
    const toast = this.query('.toast');
    this.query('.toast-text').textContent = text;
    this.query('.undo').hidden = !previous;
    toast.removeAttribute('data-shown');
    // Re-enter, so a new message is noticed.
    toast.getBoundingClientRect();
    toast.toggleAttribute('data-shown', true);
  }

  #revert() {
    const previous = this.#undo;
    if (!previous) return;
    this.issues = this.issues.map((issue) => (issue.id === previous.id ? previous : issue));
    this.#toast(`${previous.id} restored`, null);
  }
}
