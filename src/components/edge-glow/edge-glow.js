import { strokeIcon } from '../../core/icons.js';
import { wandSparkles } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { watchVisibility } from '../../core/visibility.js';
import '../button/index.js';
import styles from './edge-glow.scss?inline';

let registered = false;
const register = () => {
  if (registered || !globalThis.CSS?.registerProperty) return;
  registered = true;
  try {
    CSS.registerProperty({ name: '--lw-edge-glow-angle', syntax: '<angle>', inherits: true, initialValue: '0deg' });
  } catch {
    // Already registered by another copy of the library.
  }
};

/**
 * A stage whose edges glow, like the light a voice assistant pours round a
 * phone screen. An iridescent ribbon runs the whole rim and orbits it,
 * blooming inward into a soft mist that fades toward the middle. It turns
 * on with a brief flare and fades out when turned off.
 *
 * A pill button in the middle switches it, with an optional caption above;
 * put your own content in instead and hide the pill with `hide-toggle`.
 * The orbit rests off screen and in a hidden tab, and stands still for
 * reduced motion while the glow stays. Give the element a height.
 *
 * @attr {boolean} off - The glow is off
 * @attr {string} on-label - The pill while the glow is off
 * @attr {string} off-label - The pill while the glow is on
 * @attr {string} caption - A small line above the pill; empty hides it
 * @attr {boolean} hide-toggle - Leaves out the pill
 * @attr {number} reach - How far the mist reaches in from the edge, in pixels
 * @attr {number} duration - Seconds for one orbit of the colors
 * @attr {string} label - Accessible name of the stage
 * @fires lw-change - The glow is about to turn on or off; `detail: { active }`. Cancelable.
 * @slot - Content in the middle; the pill by default
 * @csspart stage
 * @csspart toggle - The pill
 * @cssprop --lw-edge-glow-colors - The ribbon's colors, as a comma-separated list
 */
export class LwEdgeGlow extends LwElement {
  static styles = styles;
  static props = {
    off: { type: Boolean, reflect: true },
    onLabel: { default: 'Turn on assistant' },
    offLabel: { default: 'Turn off assistant' },
    caption: { default: '' },
    hideToggle: { type: Boolean, reflect: true },
    reach: { type: Number, default: 52 },
    duration: { type: Number, default: 10 },
    label: { default: 'Assistant glow' },
  };

  constructor() {
    super();
    register();
  }

  render() {
    return `<div class="stage" part="stage" role="group">
<div class="glow" aria-hidden="true"><span class="soft mist"><span class="layer"></span></span><span class="soft bloom"><span class="layer"></span></span><span class="layer rim"></span></div>
<div class="content"><p class="caption"></p><slot><lw-button class="toggle" part="toggle" variant="secondary"><span slot="start">${strokeIcon(wandSparkles, 16)}</span><span class="toggle-label"></span></lw-button></slot></div>
</div>`;
  }

  connected() {
    this.query('.toggle').addEventListener('click', () => this.toggle(), { signal: this.signal });
    watchVisibility(this, (visible) => this.toggleAttribute('data-resting', !visible), this.signal);
  }

  updated(changed) {
    const stage = this.query('.stage');
    stage.ariaLabel = this.label || 'Assistant glow';
    const caption = this.query('.caption');
    caption.textContent = this.caption ?? '';
    caption.hidden = !this.caption;
    this.query('.toggle-label').textContent = this.off ? this.onLabel : this.offLabel;
    this.query('.toggle').ariaPressed = String(!this.off);
    this.style.setProperty('--_reach', `${Math.max(0, this.reach ?? 52)}px`);
    this.style.setProperty('--_duration', `${Math.max(1, this.duration ?? 10)}s`);
    // A flare each time it turns on, not on the first paint.
    if (changed.has('off') && !this.off && this.hasAttribute('data-ready')) {
      this.removeAttribute('data-flare');
      void this.offsetWidth;
      this.setAttribute('data-flare', '');
    }
    this.setAttribute('data-ready', '');
  }

  /** Turns the glow on or off, unless an `lw-change` listener cancels it. */
  toggle(active = this.off) {
    if (active === !this.off) return;
    if (!this.emit('change', { active })) return;
    this.off = !active;
  }
}
