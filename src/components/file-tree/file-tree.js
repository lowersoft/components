import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { chevronRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './file-tree.scss?inline';

const ICONS = {
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  open: '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m10 13-2 2 2 2M14 17l2-2-2-2"/>',
  text: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/>',
  newFile: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6M12 18v-6"/>',
  newFolder: '<path d="M12 10v6M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  collapse: '<path d="m7 20 5-5 5 5M7 4l5 5 5-5"/>',
};

const DEMO_TREE = [
  { name: 'src', children: [
    { name: 'alloc', children: [{ name: 'arena.c' }, { name: 'arena.h' }, { name: 'pool.c' }] },
    { name: 'trace', children: [{ name: 'sampler.c' }, { name: 'sampler.h' }, { name: 'symbols.c' }] },
    { name: 'main.c' },
    { name: 'lower.h' },
  ] },
  { name: 'tests', children: [{ name: 'alloc_test.c' }, { name: 'trace_test.c' }] },
  { name: 'Makefile' },
  { name: 'README.md' },
  { name: 'LICENSE' },
];

const CODE = /\.(c|h|cc|cpp|rs|zig|s|asm|js|ts)$/i;

/**
 * A project's files as a tree: folders open and close, the guide lines
 * show the path to the selected file, and new files and folders are named
 * in place. It is a full tree for the keyboard: up and down to move, right
 * to open or step in, left to close or step out, Home and End, Enter to
 * open a file, and a letter to jump to the next name starting with it.
 *
 * The tree is `[{ name, children? }]`; an entry with children is a folder.
 *
 * @attr {string} project
 * @attr {Array<object>} tree (JSON)
 * @attr {string} selected - The selected path, like `src/alloc/arena.c`
 * @fires lw-open - A file was opened; `detail: { path }`
 * @fires lw-create - A file or folder was made; `detail: { path, folder }`
 */
export class LwFileTree extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    project: { default: 'lowersoft-runtime' },
    tree: { type: Object, default: DEMO_TREE },
    selected: { default: 'src/alloc/arena.c', reflect: true },
  };

  #root = [];
  #open = new Set(['src', 'src/alloc']);
  #creating = null;

  render() {
    return `<header class="head"><h2 class="title"><span class="label">Explorer</span> <span class="project"></span></h2>
<button class="tool" type="button" data-action="file" aria-label="New file">${strokeIcon(ICONS.newFile, 17)}</button><button class="tool" type="button" data-action="folder" aria-label="New folder">${strokeIcon(ICONS.newFolder, 17)}</button><button class="tool" type="button" data-action="collapse" aria-label="Collapse all">${strokeIcon(ICONS.collapse, 17)}</button></header>
<ul class="tree" role="tree" aria-label="Files"></ul>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.head').addEventListener('click', (event) => {
      const action = event.target.closest('.tool')?.dataset.action;
      if (action === 'collapse') {
        this.#open.clear();
        this.#paint(true);
      } else if (action) this.#startCreating(action === 'folder');
    }, options);
    const tree = this.query('.tree');
    tree.addEventListener('click', (event) => {
      const item = event.target.closest('.item');
      if (!item || event.target.closest('.new-name')) return;
      this.#select(item.dataset.path, true);
    }, options);
    tree.addEventListener('keydown', (event) => this.#key(event), options);
  }

  updated(changed) {
    this.query('.project').textContent = this.project ?? '';
    if (changed.has('tree')) this.#root = structuredClone(this.tree ?? []);
    this.#paint();
  }

  // Every entry shown, in order, with its path and depth.
  #visible() {
    const rows = [];
    const walk = (entries, parent, level) => {
      const sorted = [...entries].sort((a, b) => Boolean(b.children) - Boolean(a.children) || a.name.localeCompare(b.name));
      for (const entry of sorted) {
        const path = parent ? `${parent}/${entry.name}` : entry.name;
        rows.push({ entry, path, level, parent });
        if (entry.children && this.#open.has(path)) walk(entry.children, path, level + 1);
        if (this.#creating && this.#creating.parent === path && this.#open.has(path) && entry.children) rows.push({ creating: true, level: level + 1, parent: path });
      }
    };
    walk(this.#root, '', 1);
    if (this.#creating && this.#creating.parent === '') rows.push({ creating: true, level: 1, parent: '' });
    return rows;
  }

  #paint(keepFocus) {
    const focused = keepFocus && this.shadowRoot.activeElement?.dataset?.path;
    const selected = this.selected ?? '';
    const rows = this.#visible();
    this.query('.tree').innerHTML = rows
      .map((row) => {
        // A guide per level; the ones on the selected path are lit.
        const guides = Array.from({ length: row.level - 1 }, (_, i) => {
          const ancestor = (row.parent ?? '').split('/').slice(0, i + 1).join('/');
          return `<span class="guide"${selected.startsWith(`${ancestor}/`) ? ' data-lit' : ''}></span>`;
        }).join('');
        if (row.creating) {
          return `<li class="item creating" role="none">${guides}<span class="twisty"></span>${strokeIcon(this.#creating.folder ? ICONS.folder : ICONS.file, 16)}<input class="new-name" type="text" aria-label="${this.#creating.folder ? 'New folder name' : 'New file name'}" spellcheck="false"><span class="new-error" role="alert"></span></li>`;
        }
        const folder = Boolean(row.entry.children);
        const open = folder && this.#open.has(row.path);
        const icon = folder ? (open ? ICONS.open : ICONS.folder) : CODE.test(row.entry.name) ? ICONS.file : ICONS.text;
        return `<li class="item" role="treeitem" data-path="${escapeHtml(row.path)}" aria-level="${row.level}" aria-selected="${row.path === selected}"${folder ? ` aria-expanded="${open}"` : ''} tabindex="-1">${guides}<span class="twisty">${folder ? strokeIcon(chevronRight, 14) : ''}</span>${strokeIcon(icon, 16)}<span class="name">${escapeHtml(row.entry.name)}</span></li>`;
      })
      .join('');
    // One item in the tab order: the selected one, or the first.
    const items = [...this.shadowRoot.querySelectorAll('.item[data-path]')];
    const current = items.find((item) => item.dataset.path === (focused || selected)) ?? items[0];
    if (current) current.tabIndex = 0;
    if (focused) current?.focus();
    const input = this.query('.new-name');
    if (input) {
      input.focus();
      input.addEventListener('keydown', (event) => this.#nameKey(event), { signal: this.signal });
      input.addEventListener('blur', () => this.#creating && setTimeout(() => this.#cancelCreating(), 0), { signal: this.signal });
    }
  }

  #entryAt(path) {
    let entries = this.#root;
    let entry = null;
    for (const part of path.split('/')) {
      entry = entries.find((each) => each.name === part);
      entries = entry?.children ?? [];
    }
    return entry;
  }

  #select(path, toggle) {
    const entry = this.#entryAt(path);
    if (!entry) return;
    if (entry.children) {
      if (toggle) this.#open.has(path) ? this.#open.delete(path) : this.#open.add(path);
      this.selected = path;
      this.#paint(true);
      this.query(`.item[data-path="${CSS.escape(path)}"]`)?.focus();
      return;
    }
    this.selected = path;
    this.#paint();
    this.query(`.item[data-path="${CSS.escape(path)}"]`)?.focus();
    this.emit('open', { path });
  }

  #focus(item) {
    if (!item) return;
    for (const each of this.shadowRoot.querySelectorAll('.item[data-path]')) each.tabIndex = -1;
    item.tabIndex = 0;
    item.focus();
  }

  #key(event) {
    const item = event.target.closest('.item[data-path]');
    if (!item) return;
    const items = [...this.shadowRoot.querySelectorAll('.item[data-path]')];
    const index = items.indexOf(item);
    const path = item.dataset.path;
    const folder = item.hasAttribute('aria-expanded');
    const open = item.ariaExpanded === 'true';
    const handled = {
      ArrowDown: () => this.#focus(items[index + 1]),
      ArrowUp: () => this.#focus(items[index - 1]),
      Home: () => this.#focus(items[0]),
      End: () => this.#focus(items.at(-1)),
      ArrowRight: () => {
        if (folder && !open) {
          this.#open.add(path);
          this.#paint(true);
        } else if (folder) this.#focus(items[index + 1]);
      },
      ArrowLeft: () => {
        if (folder && open) {
          this.#open.delete(path);
          this.#paint(true);
        } else this.#focus(this.query(`.item[data-path="${CSS.escape(path.split('/').slice(0, -1).join('/'))}"]`));
      },
      Enter: () => this.#select(path, true),
    }[event.key];
    if (handled) {
      event.preventDefault();
      handled();
      return;
    }
    // A letter jumps to the next name starting with it.
    if (event.key.length === 1 && /\S/.test(event.key) && !event.ctrlKey && !event.metaKey) {
      const key = event.key.toLowerCase();
      const next = [...items.slice(index + 1), ...items.slice(0, index)].find((each) => each.querySelector('.name').textContent.toLowerCase().startsWith(key));
      this.#focus(next);
    }
  }

  // A new entry goes in the selected folder, or beside the selected file.
  #startCreating(folder) {
    const selected = this.selected ?? '';
    const entry = this.#entryAt(selected);
    const parent = entry?.children ? selected : selected.split('/').slice(0, -1).join('/');
    if (parent) this.#open.add(parent);
    this.#creating = { folder, parent };
    this.#paint();
  }

  #cancelCreating() {
    if (!this.#creating) return;
    this.#creating = null;
    this.#paint();
    this.query('.item[tabindex="0"]')?.focus();
  }

  #nameKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#cancelCreating();
      return;
    }
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const name = event.target.value.trim();
    const { folder, parent } = this.#creating;
    const siblings = parent ? this.#entryAt(parent).children : this.#root;
    const error = !name ? 'Give it a name.' : /[\\/]/.test(name) ? 'Names cannot contain slashes.' : siblings.some((each) => each.name === name) ? `${name} already exists here.` : '';
    if (error) {
      this.query('.new-error').textContent = error;
      return;
    }
    siblings.push(folder ? { name, children: [] } : { name });
    const path = parent ? `${parent}/${name}` : name;
    this.#creating = null;
    if (folder) this.#open.add(path);
    this.selected = path;
    this.#paint();
    this.query(`.item[data-path="${CSS.escape(path)}"]`)?.focus();
    this.emit('create', { path, folder });
  }
}
