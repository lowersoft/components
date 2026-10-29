import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import styles from './status-island.scss?inline';

const MORPH = springFeel(0.45, 0.18);
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
// Tasks that peek out behind the island when it is closed.
const MAX_PEEK = 2;
const RING = 2 * Math.PI * 6;
const HIDDEN = { opacity: 0, transform: 'translateY(8px)', filter: 'blur(4px)' };
const SHOWN = { opacity: 1, transform: 'none', filter: 'blur(0px)' };

const describe = (task) => [task.label, task.detail].filter(Boolean).join(', ');
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const known = (task) => task.status === 'running' && typeof task.progress === 'number';

const icon = (task) => {
  if (task.status === 'done') {
    return '<svg class="icon done" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.18"/><path d="M4.75 8.25 7 10.5l4.25-4.75" pathLength="1" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  if (task.status === 'error') {
    return '<svg class="icon error" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.18"/><path d="M8 4.5v4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><circle cx="8" cy="11.25" r="1" fill="currentColor"/></svg>';
  }
  return `<svg class="icon ring${known(task) ? '' : ' spinning'}" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-opacity="0.18" stroke-width="2"/><circle class="arc" cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="${RING}" stroke-dashoffset="${RING * 0.75}"/></svg>`;
};

/**
 * A pill that reports background work. It reshapes itself as tasks change,
 * shows the newest task with the ones behind it peeking out, and opens into
 * a list of everything in flight on hover, focus or tap.
 *
 * Tasks are `{ id, label, detail?, status, progress?, action? }`, oldest
 * first: `status` is `running`, `done` or `error`, `progress` runs 0 to 1
 * (leave it out for work of unknown length), and `action` is
 * `{ label, onClick? }`, like Undo or Retry. Set `tasks` to a new array to
 * update it.
 *
 * A finished task leaves after `dismiss-after` ms, never while the island is
 * open; cancel `lw-dismiss` to keep it.
 *
 * @attr {Array<object>} tasks - The tasks, oldest first (JSON)
 * @attr {number} dismiss-after - How long a finished task stays, in ms
 * @fires lw-dismiss - A finished task is leaving; `detail: { id }`. Cancelable.
 * @fires lw-action - A task's action was pressed; `detail: { task }`
 * @csspart island
 */
export class LwStatusIsland extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    tasks: { type: Object, default: [] },
    dismissAfter: { type: Number, default: 4000 },
  };

  #open = false;
  #shown = false;
  #pillKey = '';
  #statuses = new Map();
  #doneAt = new Map();
  #timers = [];
  #stopMorph = [];

  render() {
    return `<output class="announce" aria-live="polite"></output>
<div class="wrap" hidden>
  <div class="peek" aria-hidden="true"></div><div class="peek" aria-hidden="true"></div>
  <div class="island" part="island">
    <button class="pill" type="button" aria-expanded="false"></button>
    <ul class="list" hidden></ul>
  </div>
</div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const island = this.query('.island');
    island.addEventListener('pointerenter', (event) => event.pointerType === 'mouse' && this.#setOpen(true), options);
    island.addEventListener('pointerleave', (event) => event.pointerType === 'mouse' && this.#setOpen(false), options);
    island.addEventListener('focusin', () => this.#setOpen(true), options);
    island.addEventListener('focusout', (event) => !island.contains(event.relatedTarget) && this.#setOpen(false), options);
    island.addEventListener('keydown', (event) => event.key === 'Escape' && this.#setOpen(false), options);
    island.addEventListener('click', (event) => this.#click(event), options);
    // A tap anywhere else closes the list on touch screens.
    document.addEventListener('pointerdown', (event) => !event.composedPath().includes(island) && this.#setOpen(false), options);
    this.signal.addEventListener('abort', () => {
      this.#clearTimers();
      for (const stop of this.#stopMorph) stop();
    });
  }

  updated(changed) {
    if (changed.has('tasks')) {
      this.#announceChanges();
      this.#morph(() => this.#paint());
    }
    this.#schedule();
  }

  get #tasks() {
    return Array.isArray(this.tasks) ? this.tasks : [];
  }

  // ---- Painting ----

  #paint() {
    const tasks = this.#tasks;
    const current = tasks.at(-1);
    this.#showWrap(Boolean(current));
    if (!current) return;
    const expanded = this.#open;
    const pill = this.query('.pill');
    const list = this.query('.list');
    pill.hidden = expanded;
    list.hidden = !expanded;
    this.query('.wrap').toggleAttribute('data-open', expanded);
    // The tasks waiting behind the current one peek out above it.
    const behind = Math.min(tasks.length - 1, MAX_PEEK);
    this.shadowRoot.querySelectorAll('.peek').forEach((peek, i) => peek.toggleAttribute('data-shown', i < behind));
    pill.ariaLabel = `${describe(current)}. ${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}, show all`;
    if (expanded) this.#paintList(tasks);
    else this.#paintPill(current);
  }

  // The closed pill: a new task or status swaps in, progress updates in place.
  #paintPill(task) {
    const pill = this.query('.pill');
    const key = `${task.id}-${task.status}-${known(task)}`;
    if (key !== this.#pillKey || !pill.firstElementChild) {
      this.#pillKey = key;
      pill.innerHTML = '<div class="row"></div>';
      if (!reducedMotion.matches && this.#shown) pill.firstElementChild.animate([{ ...HIDDEN, transform: 'translateY(6px)' }, SHOWN], { duration: 220, easing: EASE_OUT });
    }
    this.#paintRow(pill.firstElementChild, task, false);
  }

  #paintList(tasks) {
    const list = this.query('.list');
    const items = new Map([...list.children].map((li) => [li.dataset.id, li]));
    const fresh = !list.children.length;
    for (const task of tasks) {
      let li = items.get(task.id);
      items.delete(task.id);
      if (!li) {
        li = document.createElement('li');
        li.dataset.id = task.id;
        li.innerHTML = '<div class="row"></div>';
      }
      list.append(li);
      this.#paintRow(li.firstElementChild, task, true);
    }
    for (const li of items.values()) li.remove();
    if (fresh && !reducedMotion.matches) list.animate([{ opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0px)' }], { duration: 220, delay: 50, easing: EASE_OUT, fill: 'backwards' });
  }

  // One task's row. In the list its action is a real button; in the pill,
  // which is a button itself, it is only a label.
  #paintRow(row, task, interactive) {
    const shape = `${task.status}-${known(task)}-${task.action?.label ?? ''}-${interactive}`;
    if (row.dataset.shape !== shape) {
      row.dataset.shape = shape;
      let trailing = '';
      if (task.action) {
        const label = escapeHtml(task.action.label);
        trailing = interactive ? `<button class="action" type="button">${label}</button>` : `<span class="action">${label}</span>`;
      } else if (known(task)) {
        trailing = '<span class="percent"><span class="rolling" aria-hidden="true"></span>%</span>';
      }
      row.innerHTML = `${icon(task)}<span class="text"><span class="label"></span><span class="detail"></span></span>${trailing}`;
    }
    row.querySelector('.label').textContent = task.label;
    row.querySelector('.detail').textContent = task.detail ? ` · ${task.detail}` : '';
    if (known(task)) {
      const progress = clamp01(task.progress);
      row.querySelector('.arc').style.strokeDashoffset = String(RING * (1 - progress));
      const digits = row.querySelector('.rolling');
      if (digits) roll(digits, String(Math.round(progress * 100)));
    }
  }

  // The island fades and lifts in with its first task and out after its last.
  #showWrap(show) {
    const wrap = this.query('.wrap');
    if (show === this.#shown) return;
    this.#shown = show;
    if (show) {
      wrap.hidden = false;
      if (!reducedMotion.matches) wrap.animate([HIDDEN, SHOWN], { duration: 220, easing: EASE_OUT });
      return;
    }
    this.#open = false;
    this.#pillKey = '';
    const hide = () => !this.#shown && (wrap.hidden = true);
    if (reducedMotion.matches) hide();
    else wrap.animate([SHOWN, HIDDEN], { duration: 220, easing: EASE_OUT, fill: 'forwards' }).finished.then((animation) => {
      hide();
      animation.cancel();
    });
  }

  // Runs `change`, then springs the island from its old size to its new one.
  #morph(change) {
    const island = this.query('.island');
    for (const stop of this.#stopMorph.splice(0)) stop();
    const from = island.getBoundingClientRect();
    island.style.width = '';
    island.style.height = '';
    change();
    if (!this.#shown || !from.width || reducedMotion.matches) return;
    const to = island.getBoundingClientRect();
    if (Math.abs(to.width - from.width) < 0.5 && Math.abs(to.height - from.height) < 0.5) return;
    let pending = 2;
    this.#stopMorph = [
      ['width', from.width, to.width],
      ['height', from.height, to.height],
    ].map(([property, start, end]) => {
      island.style[property] = `${start}px`;
      return springTo(start, end, {
        ...MORPH,
        restDelta: 0.5,
        restSpeed: 2,
        update: (value) => (island.style[property] = `${value}px`),
        done: () => {
          pending -= 1;
          if (pending) return;
          island.style.width = '';
          island.style.height = '';
        },
      });
    });
  }

  #setOpen(open) {
    const next = open && this.#tasks.length > 0;
    if (next === this.#open) return;
    this.#open = next;
    this.query('.pill').ariaExpanded = String(next);
    if (!next) this.query('.list').replaceChildren();
    this.#pillKey = '';
    this.#morph(() => this.#paint());
    // Reading restarts the clock, so a task doesn't vanish as the pointer leaves.
    if (next) for (const id of this.#doneAt.keys()) this.#doneAt.set(id, Date.now());
    this.#schedule();
  }

  #click(event) {
    const action = event.target.closest('.action');
    if (action?.matches('button')) {
      event.stopPropagation();
      const task = this.#tasks.find(({ id }) => id === action.closest('li').dataset.id);
      task?.action?.onClick?.();
      if (task) this.emit('action', { task });
      return;
    }
    if (event.target.closest('.pill')) this.#setOpen(true);
  }

  // ---- Announcing and dismissing ----

  // Announce new tasks and status changes, not every progress tick.
  #announceChanges() {
    const ids = new Set();
    for (const task of this.#tasks) {
      ids.add(task.id);
      if (this.#statuses.get(task.id) === task.status) continue;
      this.#statuses.set(task.id, task.status);
      this.query('.announce').textContent = describe(task);
    }
    for (const id of this.#statuses.keys()) {
      if (ids.has(id)) continue;
      this.#statuses.delete(id);
      this.#doneAt.delete(id);
    }
  }

  #clearTimers() {
    for (const timer of this.#timers.splice(0)) clearTimeout(timer);
  }

  // Finished tasks leave on their own, but never while someone is reading.
  #schedule() {
    this.#clearTimers();
    if (this.#open) return;
    const now = Date.now();
    for (const task of this.#tasks) {
      if (task.status !== 'done') continue;
      const since = this.#doneAt.get(task.id) ?? now;
      this.#doneAt.set(task.id, since);
      const left = Math.max(0, this.dismissAfter - (now - since));
      this.#timers.push(setTimeout(() => this.#dismiss(task.id), left));
    }
  }

  #dismiss(id) {
    if (!this.emit('dismiss', { id })) return;
    this.tasks = this.#tasks.filter((task) => task.id !== id);
  }
}
