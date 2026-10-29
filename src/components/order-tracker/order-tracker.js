import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './order-tracker.scss?inline';

const MILESTONES = ['Ordered', 'Shipped', 'Out for delivery', 'Delivered'];
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

// Newest first; `milestone` ties a scan to a stop on the rail.
const DEMO_SCANS = [
  { time: 'Oct 15 · 07:42', place: 'Lisbon, PT', label: 'Out for delivery', milestone: 2 },
  { time: 'Oct 15 · 04:10', place: 'Lisbon, PT', label: 'Arrived at the local depot' },
  { time: 'Oct 14 · 21:35', place: 'Madrid, ES', label: 'Departed the sorting hub' },
  { time: 'Oct 14 · 09:18', place: 'Madrid, ES', label: 'Processed at the sorting hub' },
  { time: 'Oct 13 · 18:02', place: 'Berlin, DE', label: 'Picked up by the carrier', milestone: 1 },
  { time: 'Oct 13 · 10:27', place: 'Online', label: 'Order placed', milestone: 0 },
];

/**
 * A delivery card with a milestone rail: ordered, shipped, out for delivery,
 * delivered. Details unfolds it into the full scan history, each stop on
 * the rail moving into its row; folding it back sends them home.
 *
 * Scans are `{ time, place, label, milestone? }`, newest first; a scan with
 * a `milestone` index marks when that stop was reached.
 *
 * @attr {string} order
 * @attr {string} carrier
 * @attr {string} tracking
 * @attr {string} eta - e.g. "Today by 2 pm"
 * @attr {Array<object>} scans - The scan history (JSON)
 * @fires lw-toggle - The details opened or closed; `detail: { open }`
 */
export class LwOrderTracker extends LwElement {
  static styles = styles;
  static props = {
    order: { default: '#4182' },
    carrier: { default: 'DHL Express' },
    tracking: { default: 'JD014600006218' },
    eta: { default: 'Today by 2 pm' },
    scans: { type: Object, default: DEMO_SCANS },
  };

  #open = false;

  render() {
    return `<div class="head"><div><p class="order"></p><p class="eta"></p></div><span class="carrier"></span></div>
<ol class="rail">${MILESTONES.map((label, i) => `<li data-index="${i}"><span class="stop"></span><span class="stop-label">${label}</span></li>`).join('')}</ol>
<p class="latest"></p>
<ol class="history" hidden></ol>
<button class="details" type="button" aria-expanded="false"><span class="details-label">Details</span>${strokeIcon(chevronRight, 16)}</button>`;
  }

  connected() {
    this.query('.details').addEventListener('click', () => this.#toggle(), { signal: this.signal });
  }

  updated() {
    const reached = this.#reached;
    this.query('.order').textContent = `Order ${this.order}`;
    this.query('.eta').textContent = reached === MILESTONES.length - 1 ? 'Delivered' : this.eta ?? '';
    this.query('.carrier').textContent = `${this.carrier} · ${this.tracking}`;
    this.query('.rail').style.setProperty('--_progress', String(reached / (MILESTONES.length - 1)));
    this.shadowRoot.querySelectorAll('.rail li').forEach((li, i) => (li.dataset.state = i < reached ? 'done' : i === reached ? 'current' : 'pending'));
    const latest = this.scans[0];
    this.query('.latest').innerHTML = latest ? `<b>${escapeHtml(latest.label)}</b> · ${escapeHtml(latest.place)} · ${escapeHtml(latest.time)}` : '';
    this.query('.history').innerHTML = this.scans
      .map((scan, i) => `<li${scan.milestone === undefined ? '' : ` data-milestone="${scan.milestone}"`}${i === 0 ? ' data-latest' : ''}><span class="dot"></span><div><p class="scan-label">${escapeHtml(scan.label)}</p><p class="scan-meta">${escapeHtml(scan.place)} · ${escapeHtml(scan.time)}</p></div></li>`)
      .join('');
  }

  // The furthest stop reached.
  get #reached() {
    return Math.max(0, ...this.scans.map((scan) => scan.milestone ?? 0));
  }

  // Unfolds into the history: each reached stop on the rail flies into its
  // row while the other rows fade in; folding reverses it.
  #toggle() {
    const open = !this.#open;
    this.#open = open;
    const details = this.query('.details');
    details.ariaExpanded = String(open);
    details.querySelector('.details-label').textContent = open ? 'Hide details' : 'Details';
    this.toggleAttribute('data-open', open);
    const rail = this.query('.rail');
    const history = this.query('.history');
    const stops = [...rail.querySelectorAll('.stop')];
    const from = stops.map((stop) => stop.getBoundingClientRect());
    const before = this.offsetHeight;
    rail.hidden = open;
    this.query('.latest').hidden = open;
    history.hidden = !open;
    this.emit('toggle', { open });
    if (reducedMotion.matches) return;
    this.animate([{ height: `${before}px` }, { height: `${this.offsetHeight}px` }], { duration: 360, easing: EASE_OUT });
    if (!open) {
      rail.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: EASE_OUT });
      return;
    }
    history.querySelectorAll('li').forEach((li, i) => {
      const dot = li.querySelector('.dot');
      const milestone = li.dataset.milestone;
      if (milestone === undefined) {
        li.animate([{ opacity: 0, translate: '0 -6px' }, { opacity: 1, translate: '0 0' }], { duration: 280, delay: 80 + i * 40, easing: EASE_OUT, fill: 'backwards' });
        return;
      }
      // The stop moves from its place on the rail into this row.
      const start = from[Number(milestone)];
      const end = dot.getBoundingClientRect();
      dot.animate([{ transform: `translate(${start.left + start.width / 2 - (end.left + end.width / 2)}px, ${start.top + start.height / 2 - (end.top + end.height / 2)}px)` }, { transform: 'none' }], { duration: 480, easing: EASE_OUT });
      li.querySelector('div').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 160, easing: EASE_OUT, fill: 'backwards' });
    });
  }
}
