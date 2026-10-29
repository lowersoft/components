import { writeClipboard } from '../../core/clipboard.js';
import { FormControl, INTERNALS } from '../../core/form.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo } from '../../core/motion.js';
import '../button/index.js';
import { inkOn, PALETTE } from './palette.js';
import styles from './swatch-fan.scss?inline';

// The fan opens over this many degrees, from the left blade to the right.
const SPREAD = 150;
const DRAG_PX = 200;
const TAP_SLOP = 4;
const SETTLE = springFeel(0.45, 0.25);
const COPIED_MS = 1500;

/**
 * A colour picker shaped like a paint fan deck. Drag the deck sideways to
 * fan the blades open (or press it), pick a hue's blade and one of its
 * shades, and copy the hex. With the keyboard the arrows move between hues
 * and shades, Enter copies and Escape closes the fan.
 *
 * @attr {string} value - The picked colour, "#rrggbb"
 * @attr {boolean} open - The fan is open
 * @attr {string} name - Submits the hex with the form
 * @attr {string} label - Accessible name of the deck
 * @fires lw-change - A colour was picked; `detail: { hex, name, step }`
 * @fires lw-copy - The hex was copied; `detail: { hex }`
 * @csspart deck
 */
export class LwSwatchFan extends FormControl(LwElement) {
  static styles = styles;
  static props = {
    value: { default: '' },
    open: { type: Boolean, reflect: true },
    name: {},
    label: { default: 'Colours' },
  };

  // How far open the fan is, 0 to 1, and where the keyboard is.
  #spread = 0;
  #stop = null;
  #drag = null;
  #hue = 8;
  #shade = 2;
  #copiedTimer = 0;
  // The first layout lands without moving.
  #ready = false;

  render() {
    const blades = PALETTE.map(({ name, shades }, h) => {
      const swatches = shades
        .map(({ step, hex }, s) => `<span class="swatch" id="swatch-${h}-${s}" role="option" aria-selected="false" aria-label="${name} ${step}, ${hex}" data-hue="${h}" data-shade="${s}" style="background: ${hex}"></span>`)
        .join('');
      return `<div class="blade" data-hue="${h}">${swatches}<span class="blade-name">${name}</span></div>`;
    }).join('');
    return `<div class="deck" part="deck" role="listbox" tabindex="0">${blades}<span class="rivet" aria-hidden="true"></span><span class="hint" aria-hidden="true">Drag to open</span></div><div class="picked"><span class="chip" aria-hidden="true"></span><span class="picked-text"><span class="picked-name"></span><span class="picked-hex"></span></span><lw-button class="copy" size="sm" variant="secondary">Copy hex</lw-button></div><p class="announce" aria-live="polite"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const deck = this.query('.deck');
    deck.addEventListener('pointerdown', (event) => this.#down(event), options);
    deck.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel']) deck.addEventListener(type, (event) => this.#up(event), options);
    deck.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.copy').addEventListener('click', () => this.#copy(), options);
    this.signal.addEventListener('abort', () => {
      this.#stop?.();
      clearTimeout(this.#copiedTimer);
    });
  }

  updated(changed) {
    if (changed.has('label')) this.query('.deck').ariaLabel = this.label ?? '';
    if (changed.has('value') && this.value) this.#find(this.value);
    if (changed.has('open') && !this.#drag) this.#animateTo(this.open ? 1 : 0, this.#ready);
    this.#ready = true;
    this.#render();
  }

  // Puts the keyboard on the swatch with this hex, if the deck has it.
  #find(hex) {
    PALETTE.forEach(({ shades }, h) =>
      shades.forEach((shade, s) => {
        if (shade.hex !== hex.toLowerCase()) return;
        this.#hue = h;
        this.#shade = s;
      }),
    );
  }

  get #picked() {
    const blade = PALETTE[this.#hue];
    return { ...blade.shades[this.#shade], name: blade.name };
  }

  // Each blade turns about the rivet: stacked when closed, spread when open.
  // The picked blade stands a little out of the deck.
  #layout() {
    const count = PALETTE.length;
    const step = SPREAD / (count - 1);
    this.shadowRoot.querySelectorAll('.blade').forEach((blade, i) => {
      const closed = (i - this.#hue) * 0.8;
      const open = -SPREAD / 2 + i * step;
      const angle = closed + (open - closed) * this.#spread;
      const lifted = i === this.#hue ? -14 * this.#spread : 0;
      blade.style.transform = `rotate(${angle.toFixed(2)}deg) translateY(${lifted.toFixed(1)}px)`;
      blade.style.zIndex = String(i === this.#hue ? count + 1 : i);
    });
    this.query('.deck').style.setProperty('--_spread', this.#spread.toFixed(3));
  }

  #render() {
    this.#layout();
    const { hex, name, step } = this.#picked;
    this.shadowRoot.querySelectorAll('.swatch').forEach((swatch) => {
      const selected = Number(swatch.dataset.hue) === this.#hue && Number(swatch.dataset.shade) === this.#shade;
      swatch.ariaSelected = String(selected);
    });
    this.query('.deck').setAttribute('aria-activedescendant', `swatch-${this.#hue}-${this.#shade}`);
    const chip = this.query('.chip');
    chip.style.background = hex;
    chip.style.color = inkOn(hex);
    this.query('.picked-name').textContent = `${name} ${step}`;
    this.query('.picked-hex').textContent = hex;
    this[INTERNALS].setFormValue(this.name ? hex : null);
  }

  #animateTo(target, animate = true) {
    this.#stop?.();
    this.#stop = null;
    if (!animate || reducedMotion.matches) {
      this.#spread = target;
      this.#layout();
      return;
    }
    this.#stop = springTo(this.#spread, target, {
      ...SETTLE,
      restDelta: 0.001,
      update: (spread) => {
        this.#spread = spread;
        this.#layout();
      },
      done: () => (this.#stop = null),
    });
  }

  #setOpen(open) {
    if (open !== Boolean(this.open)) this.open = open;
    else this.#animateTo(open ? 1 : 0);
  }

  #pick(hue, shade, announce = true) {
    const changed = hue !== this.#hue || shade !== this.#shade;
    this.#hue = hue;
    this.#shade = shade;
    const { hex, name, step } = this.#picked;
    this.value = hex;
    this.#render();
    if (!changed) return;
    if (announce) this.query('.announce').textContent = `${name} ${step}, ${hex}`;
    this.emit('change', { hex, name, step });
  }

  // A drag sideways fans the deck; a press without one picks a swatch, or
  // opens a closed deck.
  #down(event) {
    if (event.button !== 0) return;
    this.#stop?.();
    this.#drag = { x: event.clientX, start: this.#spread, moved: false, id: event.pointerId };
    this.query('.deck').setPointerCapture(event.pointerId);
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < TAP_SLOP) return;
    drag.moved = true;
    this.#spread = Math.min(Math.max(drag.start + dx / DRAG_PX, 0), 1);
    this.#layout();
  }

  #up(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    if (drag.moved) {
      // Let go, it settles open or shut, whichever is nearer.
      const open = this.#spread > 0.35;
      this.open = open;
      this.#animateTo(open ? 1 : 0);
      return;
    }
    const swatch = this.shadowRoot.elementFromPoint?.(event.clientX, event.clientY)?.closest('.swatch') ?? event.target.closest?.('.swatch');
    if (this.#spread < 0.5) this.#setOpen(true);
    if (swatch) this.#pick(Number(swatch.dataset.hue), Number(swatch.dataset.shade));
  }

  #key(event) {
    const hues = PALETTE.length;
    const shades = PALETTE[0].shades.length;
    const moves = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (event.key in moves) {
      event.preventDefault();
      const [dh, ds] = moves[event.key];
      if (!this.open) this.#setOpen(true);
      this.#pick((this.#hue + dh + hues) % hues, Math.min(Math.max(this.#shade + ds, 0), shades - 1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#copy();
    } else if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.#setOpen(false);
    }
  }

  async #copy() {
    const { hex } = this.#picked;
    const copy = this.query('.copy');
    try {
      await writeClipboard(hex);
    } catch {
      this.query('.announce').textContent = 'Couldn’t copy. Select the hex and copy it yourself.';
      return;
    }
    copy.textContent = 'Copied';
    this.query('.announce').textContent = `Copied ${hex}`;
    this.emit('copy', { hex });
    clearTimeout(this.#copiedTimer);
    this.#copiedTimer = setTimeout(() => (copy.textContent = 'Copy hex'), COPIED_MS);
  }
}
