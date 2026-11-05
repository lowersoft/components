import hintStyles from '../styles/hint.scss?inline';
import { escapeHtml } from './dom.js';
import { reducedMotion } from './motion.js';

// Terms that explain themselves: a dotted underline, and on hover or focus
// a hint in the top layer, so pinned columns and scrollers never cover or
// clip it. Add `hintStyles` to the component's `static styles`.
export { hintStyles };

// Gap between a term and its hint, and the least room kept to the screen edge.
const GAP = 8;
const MARGIN = 8;

/** `label`, explained by `hint` when there is one; `id` must be unique in the shadow root. */
export const termMarkup = (label, hint, id) =>
  hint
    ? `<span class="term" tabindex="0" aria-describedby="${id}">${escapeHtml(label)}</span><span class="tooltip" role="tooltip" id="${id}" popover="manual">${escapeHtml(hint)}</span>`
    : escapeHtml(label);

/**
 * Opens the hint of any term inside `container` on hover or keyboard focus,
 * below the term, or above when there is no room below, kept on screen.
 * Escape, scrolling and resizing close it.
 */
export const wireHints = (host, container) => {
  const options = { signal: host.signal };
  let open = null;
  const hide = () => {
    if (open?.isConnected && open.matches(':popover-open')) open.hidePopover();
    open = null;
  };
  const show = (term) => {
    const tip = term.nextElementSibling;
    if (tip === open) return;
    hide();
    open = tip;
    tip.showPopover();
    const anchor = term.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = tip;
    const below = anchor.bottom + GAP + height <= innerHeight - MARGIN;
    tip.style.left = `${Math.min(Math.max(anchor.left, MARGIN), innerWidth - width - MARGIN)}px`;
    tip.style.top = `${below ? anchor.bottom + GAP : anchor.top - GAP - height}px`;
    tip.dataset.side = below ? 'bottom' : 'top';
    if (!reducedMotion.matches) tip.animate({ opacity: [0, 1], translate: [below ? '0 -0.25rem' : '0 0.25rem', '0 0'] }, { duration: 150, easing: 'ease-out' });
  };
  container.addEventListener('pointerover', (event) => {
    const term = event.target.closest('.term');
    if (term) show(term);
  }, options);
  container.addEventListener('pointerout', (event) => {
    const term = event.target.closest('.term');
    if (term && !term.contains(event.relatedTarget) && !term.matches(':focus-visible')) hide();
  }, options);
  container.addEventListener('focusin', (event) => event.target.matches('.term:focus-visible') && show(event.target), options);
  container.addEventListener('focusout', (event) => event.target.matches('.term') && hide(), options);
  document.addEventListener('keydown', (event) => event.key === 'Escape' && hide(), options);
  addEventListener('scroll', hide, { ...options, capture: true, passive: true });
  addEventListener('resize', hide, options);
  host.signal.addEventListener('abort', hide);
};
