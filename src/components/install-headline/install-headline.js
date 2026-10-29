import { writeClipboard } from '../../core/clipboard.js';
import { escapeHtml } from '../../core/dom.js';
import { moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { check, copy } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { swapStyles, swapText } from '../../core/swap.js';
import styles from './install-headline.scss?inline';

const COPIED_MS = 1600;

const DEMO_METHODS = [
  { id: 'bun', label: 'bun', command: 'bun add @lowersoft/lw', note: 'Adds the package; import only the elements you use.' },
  { id: 'npm', label: 'npm', command: 'npm install @lowersoft/lw', note: 'Adds the package; import only the elements you use.' },
  { id: 'pnpm', label: 'pnpm', command: 'pnpm add @lowersoft/lw', note: 'Adds the package; import only the elements you use.' },
  { id: 'agent', label: 'Agent', command: 'Add @lowersoft/lw and use <lw-button> for every button', prompt: true, note: 'Paste into your coding agent; it installs the package and wires it up.' },
];

/**
 * A centred headline that ends in the install command. The tabs switch
 * between package managers, or a prompt for a coding agent, and the
 * command swaps in place; the button copies it.
 *
 * Methods are `{ id, label, command, note?, prompt? }`; a prompt shows no
 * `$`.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} method - The method shown, by id
 * @attr {Array<object>} methods (JSON)
 * @fires lw-change - Another method was chosen; `detail: { method }`
 */
export class LwInstallHeadline extends LwElement {
  static styles = [swapStyles, styles];
  static props = {
    heading: { default: "A web toolkit your users won't wait for" },
    description: { default: 'Buttons, inputs and whole sections as plain custom elements. No framework, no runtime, nothing to hydrate.' },
    method: { default: 'bun', reflect: true },
    methods: { type: Object, default: DEMO_METHODS },
  };

  #copiedTimer = 0;

  render() {
    return `<header class="intro"><h2 class="title"></h2><p class="description"></p></header>
<div class="install"><div class="tabs" role="tablist" aria-label="Install with"><span class="tab-pill"></span></div>
<div class="command" role="tabpanel"><span class="dollar" aria-hidden="true">$</span><code class="swap text"></code><button class="copy" type="button" aria-label="Copy the command">${strokeIcon(copy, 16)}</button><span class="visually-hidden copied" aria-live="polite"></span></div><p class="swap note"></p></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const tabs = this.query('.tabs');
    tabs.addEventListener('click', (event) => {
      const tab = event.target.closest('.tab');
      if (tab) this.#choose(tab.dataset.id);
    }, options);
    tabs.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const index = this.methods.indexOf(this.#method);
      const next = this.methods[(index + step + this.methods.length) % this.methods.length];
      this.#choose(next.id);
      tabs.querySelector(`[data-id="${CSS.escape(next.id)}"]`).focus();
    }, options);
    this.query('.copy').addEventListener('click', () => this.#copy(), options);
    const observer = new ResizeObserver(() => this.#paintTabs());
    observer.observe(tabs);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    if (changed.has('methods')) {
      const tabs = this.query('.tabs');
      tabs.querySelectorAll('.tab').forEach((each) => each.remove());
      tabs.insertAdjacentHTML('beforeend', this.methods.map((method) => `<button class="tab" type="button" role="tab" data-id="${escapeHtml(method.id)}">${escapeHtml(method.label)}</button>`).join(''));
    }
    const method = this.#method;
    this.#paintTabs();
    this.toggleAttribute('data-prompt', Boolean(method.prompt));
    swapText(this.query('.text'), method.command);
    swapText(this.query('.note'), method.note ?? '');
  }

  get #method() {
    return this.methods.find((method) => method.id === this.method) ?? this.methods[0];
  }

  #paintTabs() {
    let chosen = null;
    for (const tab of this.shadowRoot.querySelectorAll('.tab')) {
      const selected = tab.dataset.id === this.#method.id;
      tab.ariaSelected = String(selected);
      tab.tabIndex = selected ? 0 : -1;
      if (selected) chosen = tab;
    }
    if (chosen?.offsetWidth) moveHighlight(this.query('.tab-pill'), chosen);
  }

  // Copies the command, and shows a check for a moment.
  async #copy() {
    try {
      await writeClipboard(this.#method.command);
    } catch {
      return;
    }
    const button = this.query('.copy');
    button.innerHTML = strokeIcon(check, 16);
    this.query('.copied').textContent = 'Copied';
    clearTimeout(this.#copiedTimer);
    this.#copiedTimer = setTimeout(() => {
      button.innerHTML = strokeIcon(copy, 16);
      this.query('.copied').textContent = '';
    }, COPIED_MS);
  }

  #choose(id) {
    if (id === this.method) return;
    this.method = id;
    this.emit('change', { method: id });
  }
}
