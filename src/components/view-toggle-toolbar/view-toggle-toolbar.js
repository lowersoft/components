import { addDays, formatDate, today } from '../../core/dates.js';
import { escapeHtml } from '../../core/dom.js';
import { moveHighlight } from '../../core/highlight.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { arrowDown, arrowUp } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { menuStyles } from '../../core/menu.js';
import { reducedMotion } from '../../core/motion.js';
import { hueOf, initialsOf } from '../../core/people.js';
import { createPicker, pickerMarkup } from '../../core/picker.js';
import { swapStyles } from '../../core/swap.js';
import styles from './view-toggle-toolbar.scss?inline';

const VIEWS = [
  { id: 'board', label: 'Board', icon: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18M15 3v18"/>' },
  { id: 'list', label: 'List', icon: '<path d="M3 6h.01M3 12h.01M3 18h.01M8 6h13M8 12h13M8 18h13"/>' },
  { id: 'table', label: 'Table', icon: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/>' },
];

const STAGES = [
  { id: 'planned', label: 'Planned', color: '#8b8d98' },
  { id: 'active', label: 'Active', color: '#3b82f6' },
  { id: 'shipped', label: 'Shipped', color: '#30a46c' },
];

const SORTS = [
  { value: 'updated', label: 'Last updated' },
  { value: 'due', label: 'Due date' },
  { value: 'progress', label: 'Progress' },
  { value: 'name', label: 'Name' },
];

const SLIDERS = '<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>';

const DEMO_PROJECTS = [
  { name: 'Team seats', color: '#0ea5e9', stage: 'planned', progress: 8, due: 43, owner: 'Leo Martins', updated: 5 },
  { name: 'Onboarding checklist', color: '#60a5fa', stage: 'planned', progress: 0, due: 30, owner: 'Priya Raman', updated: 2 },
  { name: 'Profiler v2', color: '#d946ef', stage: 'active', progress: 64, due: 16, owner: 'Maya Chen', updated: 0 },
  { name: 'Crash grouping', color: '#a78bfa', stage: 'active', progress: 82, due: 9, owner: 'Jonas Weber', updated: 1 },
  { name: 'ARM release builds', color: '#f59e0b', stage: 'active', progress: 37, due: 23, owner: 'Theo Park', updated: 3 },
  { name: 'Symbol server', color: '#10b981', stage: 'shipped', progress: 100, due: -10, owner: 'Priya Raman', updated: 6 },
];

const due = (days) => formatDate(addDays(today(), days), 'en-US', { month: 'short', day: 'numeric' });

/**
 * One set of projects seen three ways: a board by stage, a list, or a
 * table. The view switch slides under the chosen view and the content
 * crossfades; sort by field and flip the order, and the shipped projects
 * can be hidden from the settings button.
 *
 * Projects are `{ name, color, stage, progress, due, owner, updated }`,
 * `due` in days from today and `updated` in days ago.
 *
 * @attr {'board'|'list'|'table'} view
 * @attr {string} sort - updated, due, progress or name
 * @attr {boolean} descending
 * @attr {boolean} hide-shipped
 * @attr {Array<object>} projects (JSON)
 * @fires lw-change - The view, sort or order changed; `detail: { view, sort, descending }`
 */
export class LwViewToggleToolbar extends LwElement {
  static styles = [iconStyles, menuStyles, swapStyles, styles];
  static props = {
    view: { default: 'board', reflect: true },
    sort: { default: 'updated' },
    descending: { type: Boolean, default: true },
    hideShipped: { type: Boolean },
    projects: { type: Object, default: DEMO_PROJECTS },
  };

  #sortPicker;

  render() {
    return `<header class="bar"><h2 class="title">Projects <span class="total"></span></h2><div class="views" role="radiogroup" aria-label="View"><span class="view-pill"></span>${VIEWS.map((view) => `<button class="view" type="button" role="radio" data-view="${view.id}">${strokeIcon(view.icon, 16)}<span>${view.label}</span></button>`).join('')}</div>
<div class="tools">${pickerMarkup('sort-menu', { label: 'Sort' })}<button class="tool order" type="button"></button><button class="tool shipped" type="button" aria-label="Hide shipped projects">${strokeIcon(SLIDERS, 16)}</button></div></header><div class="content"></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.#sortPicker = createPicker(this.query('.picker'), this.signal, (sort) => this.#change({ sort }));
    const views = this.query('.views');
    views.addEventListener('click', (event) => {
      const view = event.target.closest('.view');
      if (view) this.#change({ view: view.dataset.view });
    }, options);
    views.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const index = VIEWS.findIndex((view) => view.id === this.view);
      this.#change({ view: VIEWS[(index + step + VIEWS.length) % VIEWS.length].id });
      views.querySelector(`[data-view="${this.view}"]`).focus();
    }, options);
    this.query('.order').addEventListener('click', () => this.#change({ descending: !this.descending }), options);
    this.query('.shipped').addEventListener('click', () => (this.hideShipped = !this.hideShipped), options);
    const observer = new ResizeObserver(() => this.#paintViews());
    observer.observe(views);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    this.#sortPicker?.set(SORTS, this.sort);
    const order = this.query('.order');
    order.innerHTML = strokeIcon(this.descending ? arrowDown : arrowUp, 16);
    order.ariaLabel = this.descending ? 'Descending; change to ascending' : 'Ascending; change to descending';
    const shipped = this.query('.shipped');
    shipped.ariaPressed = String(Boolean(this.hideShipped));
    this.#paintViews();
    this.#paintContent(changed.has('view') && !changed.has('projects'));
  }

  #change(next) {
    Object.assign(this, next);
    this.emit('change', { view: this.view, sort: this.sort, descending: this.descending });
  }

  #paintViews() {
    let chosen = null;
    for (const view of this.shadowRoot.querySelectorAll('.view')) {
      const checked = view.dataset.view === this.view;
      view.ariaChecked = String(checked);
      view.tabIndex = checked ? 0 : -1;
      if (checked) chosen = view;
    }
    if (chosen?.offsetWidth) moveHighlight(this.query('.view-pill'), chosen);
  }

  get #sorted() {
    const key = {
      updated: (project) => -project.updated,
      due: (project) => project.due,
      progress: (project) => project.progress,
      name: (project) => project.name.toLowerCase(),
    }[this.sort] ?? ((project) => project.updated);
    const projects = this.projects.filter((project) => !(this.hideShipped && project.stage === 'shipped'));
    const sorted = projects.sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));
    return this.descending ? sorted.reverse() : sorted;
  }

  #paintContent(animate) {
    const projects = this.#sorted;
    this.query('.total').textContent = String(projects.length);
    const progress = (project) => `<span class="progress" style="--_color: ${project.color}"><span class="track"><span class="fill" style="width: ${project.progress}%"></span></span><span class="percent">${project.progress}%</span></span>`;
    const owner = (project) => `<span class="owner" style="--_hue: ${hueOf(project.owner)}" title="${escapeHtml(project.owner)}">${escapeHtml(initialsOf(project.owner))}</span>`;
    const name = (project) => `<span class="name"><span class="swatch" style="background: ${project.color}"></span>${escapeHtml(project.name)}</span>`;
    let html;
    if (this.view === 'board') {
      html = `<div class="board">${STAGES.filter((stage) => !(this.hideShipped && stage.id === 'shipped'))
        .map((stage) => {
          const cards = projects.filter((project) => project.stage === stage.id);
          return `<section class="column"><h3 class="column-title"><span class="dot" style="background: ${stage.color}"></span>${stage.label}<span class="column-count">${cards.length}</span></h3>${cards.map((project) => `<article class="card">${name(project)}<div class="meta">${progress(project)}<span class="due">${due(project.due)}</span>${owner(project)}</div></article>`).join('')}</section>`;
        })
        .join('')}</div>`;
    } else if (this.view === 'list') {
      html = `<ul class="list">${projects.map((project) => `<li class="row">${name(project)}${progress(project)}<span class="due">${due(project.due)}</span>${owner(project)}</li>`).join('')}</ul>`;
    } else {
      html = `<table class="table"><thead><tr><th scope="col">Project</th><th scope="col">Stage</th><th scope="col">Progress</th><th scope="col">Due</th><th scope="col">Owner</th></tr></thead><tbody>${projects
        .map((project) => `<tr><th scope="row">${name(project)}</th><td>${STAGES.find((stage) => stage.id === project.stage)?.label}</td><td>${progress(project)}</td><td>${due(project.due)}</td><td>${owner(project)}</td></tr>`)
        .join('')}</tbody></table>`;
    }
    const content = this.query('.content');
    content.innerHTML = html;
    if (animate && !reducedMotion.matches) content.animate({ opacity: [0, 1], translate: ['0 0.375rem', '0 0'] }, { duration: 250, easing: 'ease-out' });
  }
}
