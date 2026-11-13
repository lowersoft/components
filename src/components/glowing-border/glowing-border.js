import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './glowing-border.scss?inline';

const EMBER = ['#ff1100', '#f97316', '#fbbf24', '#fb7185'];
const VARIANTS = ['cursor', 'beam', 'spin', 'pulse'];

// Registered once for the page: shadow roots cannot declare @property, and
// these must be typed to animate and ease.
const PROPERTIES = [
  ['--lw-glowing-border-angle', '<angle>', '0deg'],
  ['--lw-glowing-border-x', '<length>', '0px'],
  ['--lw-glowing-border-y', '<length>', '0px'],
  ['--lw-glowing-border-i', '<number>', '0'],
];
let registered = false;
const register = () => {
  if (registered || !globalThis.CSS?.registerProperty) return;
  registered = true;
  for (const [name, syntax, initialValue] of PROPERTIES) {
    try {
      CSS.registerProperty({ name, syntax, inherits: true, initialValue });
    } catch {
      // Already registered by another copy of the library.
    }
  }
};

/**
 * A border that glows. In `cursor` mode light pools on the edge nearest
 * the pointer, brightens as it comes closer and shifts hue along the edge,
 * so every card in a grid answers the same pointer. `beam` sends a comet
 * round the edge, `spin` turns the whole gradient and `pulse` breathes.
 * An outer glow can spread past the border, and an inner glow can light a
 * frame of padding between the border and the content.
 *
 * The loops run in CSS on a registered angle. With reduced motion the
 * loops stop and the cursor light moves without easing.
 *
 * @attr {'cursor'|'beam'|'spin'|'pulse'} variant - How the light moves
 * @attr {Array<string>} colors (JSON) - Spread round the edge in cursor mode; the loops use the first three
 * @attr {number} range - Cursor only: how far from the edge, in pixels, the light starts
 * @attr {number} spot - Cursor only: the light pool's diameter, in pixels
 * @attr {number} thickness - Border width, in pixels
 * @attr {number} radius - Corner radius, in pixels
 * @attr {number} padding - Space between the border and the content, in pixels; makes a double frame
 * @attr {number} duration - Seconds per lap (beam, spin) or breath (pulse)
 * @attr {number} glow - Outer glow, 0 to 1
 * @attr {number} glow-size - How far the outer glow spreads, in pixels
 * @attr {number} inner-glow - Light falling inward from the lit edge, 0 to 1; shows where the content is see-through
 * @slot - The content inside the border
 * @csspart content - The box around the content
 */
export class LwGlowingBorder extends LwElement {
  static styles = styles;
  static props = {
    variant: { default: 'cursor', reflect: true },
    colors: { type: Object, default: EMBER },
    range: { type: Number, default: 160 },
    spot: { type: Number, default: 340 },
    thickness: { type: Number, default: 1.5 },
    radius: { type: Number, default: 16 },
    padding: { type: Number, default: 0 },
    duration: { type: Number, default: 4 },
    glow: { type: Number, default: 0 },
    glowSize: { type: Number, default: 10 },
    innerGlow: { type: Number, default: 0 },
  };

  #frame = 0;
  #pointer = null;

  render() {
    return '<span class="glow" aria-hidden="true"></span><span class="inner" aria-hidden="true"></span><div class="content" part="content"><slot></slot></div><span class="base" aria-hidden="true"></span><span class="ring" aria-hidden="true"></span>';
  }

  connected() {
    register();
    const options = { signal: this.signal, passive: true };
    addEventListener('pointermove', (event) => {
      this.#pointer = { x: event.clientX, y: event.clientY };
      this.#frame ||= requestAnimationFrame(() => this.#light());
    }, options);
    // Off the window, the light fades.
    document.documentElement.addEventListener('pointerleave', () => {
      this.#pointer = null;
      this.#light();
    }, { signal: this.signal });
    addEventListener('scroll', () => this.#pointer && (this.#frame ||= requestAnimationFrame(() => this.#light())), { ...options, capture: true });
    // Cleared too, so the light can follow again on reconnecting.
    this.signal.addEventListener('abort', () => {
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
  }

  updated() {
    const colors = (Array.isArray(this.colors) && this.colors.length ? this.colors : EMBER).slice(0, 6);
    const [c1, c2 = c1, c3 = c2] = colors;
    const radius = Math.max(0, this.radius ?? 16);
    const vars = {
      '--_c1': c1,
      '--_c2': c2,
      '--_c3': c3,
      '--_w': `${Math.max(0.5, this.thickness ?? 1.5)}px`,
      '--_r': `${radius}px`,
      '--_pad': `${Math.max(0, this.padding ?? 0)}px`,
      '--_d': `${Math.max(0.5, this.duration ?? 4)}s`,
      '--_glow': String(Math.min(1, Math.max(0, this.glow ?? 0))),
      '--_gs': `${Math.max(0, this.glowSize ?? 10)}px`,
      '--_ig': String(Math.min(1, Math.max(0, this.innerGlow ?? 0))),
      '--_spot': `${Math.max(20, this.spot ?? 340)}px`,
      // The glow is kept outside the border by a mask with this shape cut out.
      '--_hole': `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><rect width='100%' height='100%' rx='${radius}' ry='${radius}'/></svg>`)}")`,
    };
    for (const [name, value] of Object.entries(vars)) this.style.setProperty(name, value);
    if (!VARIANTS.includes(this.variant)) this.setAttribute('variant', 'cursor');
    this.#light();
  }

  // The light pool: the point on the edge nearest the pointer, how bright,
  // and the color for that spot along the edge.
  #light() {
    this.#frame = 0;
    if (this.variant !== 'cursor') return;
    const box = this.getBoundingClientRect();
    if (!this.#pointer || !box.width) {
      this.style.setProperty('--lw-glowing-border-i', '0');
      return;
    }
    const px = this.#pointer.x - box.left;
    const py = this.#pointer.y - box.top;
    const inside = px >= 0 && py >= 0 && px <= box.width && py <= box.height;
    let x = Math.min(box.width, Math.max(0, px));
    let y = Math.min(box.height, Math.max(0, py));
    let distance = Math.hypot(px - x, py - y);
    if (inside) {
      // Snap to the nearest side.
      const sides = [py, box.height - py, px, box.width - px];
      const nearest = sides.indexOf(Math.min(...sides));
      distance = sides[nearest];
      if (nearest === 0) y = 0;
      else if (nearest === 1) y = box.height;
      else if (nearest === 2) x = 0;
      else x = box.width;
    }
    const reach = Math.max(1, this.range ?? 160);
    const intensity = Math.max(0, 1 - distance / reach);
    const colors = (Array.isArray(this.colors) && this.colors.length ? this.colors : EMBER).slice(0, 6);
    const around = (Math.atan2(y - box.height / 2, x - box.width / 2) / (2 * Math.PI) + 1) % 1;
    const at = around * colors.length;
    const from = colors[Math.floor(at) % colors.length];
    const to = colors[(Math.floor(at) + 1) % colors.length];
    this.style.setProperty('--lw-glowing-border-x', `${x.toFixed(1)}px`);
    this.style.setProperty('--lw-glowing-border-y', `${y.toFixed(1)}px`);
    this.style.setProperty('--lw-glowing-border-i', intensity.toFixed(3));
    this.style.setProperty('--_hue', `color-mix(in oklch, ${from}, ${to} ${Math.round((at % 1) * 100)}%)`);
    this.toggleAttribute('data-still', reducedMotion.matches);
  }
}
