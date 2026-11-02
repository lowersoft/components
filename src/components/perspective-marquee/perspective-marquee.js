import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './perspective-marquee.scss?inline';

const unsplash = (id) => `https://images.unsplash.com/photo-${id}?w=640&h=360&fit=crop&auto=format&q=75`;

const DEMO_ITEMS = [
  '1501785888041-af3ef285b470',
  '1500530855697-b586d89ba3ee',
  '1470071459604-3b5ec3a7fe05',
  '1464822759023-fed622ff2c3b',
  '1469474968028-56623f02e42e',
  '1500534314209-a25ddb2bd429',
  '1506905925346-21bda4d32df4',
  '1472214103451-9374bd1c798e',
  '1441974231531-c6227db76b6e',
  '1433086966358-54859d0ed716',
  '1506744038136-46273834b3fb',
  '1426604966848-d7adac402bff',
  '1447752875215-b2761acb3c5d',
  '1470770841072-f978cf4d019e',
  '1501854140801-50d01698950b',
  '1418065460487-3e41a6c84dc5',
].map((id) => ({ src: unsplash(id) }));

// Each row runs at its own pace around `speed`, so the wall never moves in step.
const PACE = [1, 1.14, 0.92, 1.07, 0.97, 1.1];

/**
 * A wall of photos on a tilted plane, its rows sliding without end in
 * alternating directions. Every card is cropped to the same size, so
 * landscape photos suit it best; dashed rails can run through the gutters,
 * and the edges can fade into the page.
 *
 * The motion is CSS alone, on the compositor: no script runs per frame. It
 * pauses while the wall is off screen, with `pause-on-hover` while hovered,
 * and stops for reduced motion. The wall reads as one image named by
 * `label`; the photos inside it are decoration.
 *
 * Items are `{ src }`, dealt across the rows in order and repeated as
 * needed to fill them.
 *
 * @attr {Array<object>} items (JSON)
 * @attr {number} rows
 * @attr {number} per-row - Photos in a row before it repeats
 * @attr {number} speed - Seconds for a row to go round once; lower is faster
 * @attr {number} gap - Space between cards, in pixels
 * @attr {number} card-width - In pixels
 * @attr {number} card-height - In pixels
 * @attr {number} perspective - The CSS perspective distance, in pixels
 * @attr {number} rotate-x - Tilt back, in degrees
 * @attr {number} rotate-z - Turn, in degrees
 * @attr {boolean} pause-on-hover
 * @attr {boolean} fade-edges - Fades the wall out at the edges
 * @attr {boolean} no-lines - Hides the dashed rails in the gutters
 * @attr {string} label - What the wall shows, for assistive technology
 * @csspart stage - The frame the wall sits in
 * @csspart card - Each photo's card
 */
export class LwPerspectiveMarquee extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_ITEMS },
    rows: { type: Number, default: 4 },
    perRow: { type: Number, default: 6 },
    speed: { type: Number, default: 40 },
    gap: { type: Number, default: 24 },
    cardWidth: { type: Number, default: 280 },
    cardHeight: { type: Number, default: 158 },
    perspective: { type: Number, default: 1000 },
    rotateX: { type: Number, default: 18 },
    rotateZ: { type: Number, default: -22 },
    pauseOnHover: { type: Boolean, reflect: true },
    fadeEdges: { type: Boolean, reflect: true },
    noLines: { type: Boolean, reflect: true },
    label: { default: 'A wall of landscape photographs' },
  };

  render() {
    return '<div class="stage" part="stage" role="img"><div class="plane"></div></div>';
  }

  connected() {
    // Off screen, the rows stop instead of running for nobody.
    const seen = new IntersectionObserver(([entry]) => this.toggleAttribute('data-away', !entry.isIntersecting));
    seen.observe(this);
    this.signal.addEventListener('abort', () => seen.disconnect());
  }

  updated(changed) {
    this.query('.stage').ariaLabel = this.label || 'Photos';
    const vars = {
      '--_gap': `${Math.max(0, this.gap)}px`,
      '--_w': `${Math.max(1, this.cardWidth)}px`,
      '--_h': `${Math.max(1, this.cardHeight)}px`,
      '--_perspective': `${Math.max(1, this.perspective)}px`,
      '--_rx': `${this.rotateX}deg`,
      '--_rz': `${this.rotateZ}deg`,
    };
    for (const [name, value] of Object.entries(vars)) this.style.setProperty(name, value);
    if (['items', 'rows', 'perRow', 'speed'].some((prop) => changed.has(prop))) this.#build();
  }

  #build() {
    const items = (this.items ?? []).filter((item) => item?.src);
    const rows = Math.max(1, Math.round(this.rows));
    const perRow = Math.max(1, Math.round(this.perRow));
    const speed = Math.max(1, this.speed);
    const card = (item) => `<div class="cell"><span class="rail-x" aria-hidden="true"></span><span class="rail-y" aria-hidden="true"></span><div class="card" part="card"><img src="${escapeHtml(item.src)}" alt="" loading="lazy" decoding="async" draggable="false"></div></div>`;
    this.query('.plane').innerHTML = items.length
      ? Array.from({ length: rows }, (_, row) => {
          const set = Array.from({ length: perRow }, (__, i) => items[(row * perRow + i) % items.length]).map(card).join('');
          // Two copies side by side: sliding by one copy's width loops seamlessly.
          return `<div class="row"><div class="track" style="--_duration: ${(speed * PACE[row % PACE.length]).toFixed(2)}s"${row % 2 ? ' data-reverse' : ''}><div class="set">${set}</div><div class="set" aria-hidden="true">${set}</div></div></div>`;
        }).join('')
      : '';
  }
}
