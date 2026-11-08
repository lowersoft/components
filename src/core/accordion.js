import { escapeHtml } from './dom.js';

// The FAQ accordions: `.item`s, each a `.trigger` button over a `.panel`
// that holds the answer. One answer is open at a time. Style the panels
// with the `accordion` mixin.

/** An item's id: its own, or one made from its question. */
export const itemId = (item) => item.id ?? String(item.question ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * An item's markup: the question as a button, `lead` before its words and
 * `icon` after them, over a panel holding the answer, or `body` instead.
 */
export const accordionItem = (item, { lead = '', icon = '', body } = {}) => {
  const id = escapeHtml(itemId(item));
  return `<div class="item"><h3 class="question"><button class="trigger" type="button" id="q-${id}" data-id="${id}" aria-expanded="false" aria-controls="a-${id}">${lead}<span class="label">${escapeHtml(item.question ?? '')}</span>${icon}</button></h3><div class="panel" id="a-${id}" role="region" aria-labelledby="q-${id}"><div class="clip">${body ?? `<p class="answer">${escapeHtml(item.answer ?? '')}</p>`}</div></div></div>`;
};

/**
 * Opens the item in `root` whose trigger's id is `open` and closes the rest.
 * A closed answer is out of the tab order and the accessibility tree.
 */
export const paintAccordion = (root, open) => {
  for (const trigger of root.querySelectorAll('.trigger')) {
    const isOpen = trigger.dataset.id === open;
    const item = trigger.closest('.item');
    trigger.ariaExpanded = String(isOpen);
    item.toggleAttribute('data-open', isOpen);
    const panel = item.querySelector('.panel');
    if (panel) panel.inert = !isOpen;
  }
};

/** Up and down move between the triggers in `root`; Home and End go to the ends. */
export const accordionKeys = (event, root) => {
  const trigger = event.target.closest('.trigger');
  if (!trigger) return;
  const triggers = [...root.querySelectorAll('.trigger')];
  const index = triggers.indexOf(trigger);
  const next = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: triggers.length - 1 }[event.key];
  if (next === undefined) return;
  event.preventDefault();
  triggers[(next + triggers.length) % triggers.length].focus();
};

/**
 * Wires the triggers in `list` to `host.open` until `signal` aborts: a
 * question opens its answer and closes the one that was open, or closes its
 * own, and `lw-toggle` says which (`detail: { id, open }`). `current()`
 * gives the open id; the arrow keys move between questions.
 */
export const connectAccordion = (host, list, current, signal) => {
  list.addEventListener('click', (event) => {
    const trigger = event.target.closest('.trigger');
    if (!trigger) return;
    const id = trigger.dataset.id;
    const open = current() === id ? '' : id;
    host.open = open;
    host.emit('toggle', { id, open: Boolean(open) });
  }, { signal });
  list.addEventListener('keydown', (event) => accordionKeys(event, list), { signal });
};
