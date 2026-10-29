import { FormControl, INTERNALS } from '../../core/form.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, vibrate } from '../../core/motion.js';
import styles from './liquid-gauge.scss?inline';

// The surface is a row of columns joined by springs. Each column bobs around
// the fill line and pulls on its neighbours, so a push travels.
const COLUMNS = 28;
const STEP = 1 / 120;
const SPREAD = 2600;
const RESTORE = 18;
const SURFACE_DAMPING = 2.2;
// The fill line follows the value on an underdamped spring, so a big change
// overshoots a little and settles, like a poured glass.
const LEVEL_STIFFNESS = 90;
const LEVEL_DAMPING = 11;
// How hard a sideways drag rocks the liquid, and how hard the pointer stirs
// it when moving through it.
const SLOSH = 4.5;
const STIR = 20;
const MAX_WAVE = 26;
// The meniscus: a lighter band riding just above the surface.
const RIM = 3;
// Bubbles rise while the level is climbing.
const BUBBLES = 10;
const BUBBLE_RATE = 0.06;
const REST_EPSILON = 0.02;
const TICKS = [10, 20, 30, 40, 50, 60, 70, 80, 90];
const KEY_STEPS = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const flatPolygon = (value, lift = 0) => `polygon(0% calc(${100 - value}% - ${lift}px),100% calc(${100 - value}% - ${lift}px),100% 100%,0% 100%)`;

const text = '<div class="readout"><p class="label"></p><p class="percent"><span class="number"></span><span class="sign">%</span></p><p class="used"><span class="amount"></span><span class="of"></span></p></div><p class="status"></p>';

/**
 * A storage gauge filled with liquid: drag up or down to set it and the
 * surface sloshes, push sideways to rock it, and hover through it to stir.
 * The level pours in with a little overshoot, bubbles rise while it climbs,
 * and past `warn-at` it turns red. It is a slider for the keyboard (arrows,
 * Page Up and Down, Home and End) and takes part in forms.
 *
 * @attr {number} value - The fill, 0 to 100
 * @attr {boolean} readonly - A display only
 * @attr {string} label
 * @attr {number} total - Capacity, in `unit`
 * @attr {string} unit
 * @attr {number} warn-at - From this fill on, the liquid turns red
 * @attr {string} name - Submits the fill with the form
 * @fires input - While the fill is being dragged
 * @fires lw-change - The fill was set; `detail: { value }`
 */
export class LwLiquidGauge extends FormControl(LwElement) {
  static styles = styles;
  static props = {
    value: { type: Number, default: 72 },
    readonly: { type: Boolean, reflect: true },
    label: { default: 'Storage' },
    total: { type: Number, default: 128 },
    unit: { default: 'GB' },
    warnAt: { type: Number, default: 90 },
    name: {},
  };

  #heights = new Float64Array(COLUMNS);
  #speeds = new Float64Array(COLUMNS);
  #level = null;
  #levelSpeed = 0;
  #energy = 0;
  #bubbles = Array.from({ length: BUBBLES }, () => ({ x: 0, y: 0, r: 0, speed: 0, phase: 0, alive: false }));
  #spawn = 0;
  #time = 0;
  #size = { width: 0, height: 0 };
  #pointerId = -1;
  #pointerX = -1;
  #onScreen = true;
  #initial = null;
  #shown = null;
  #loop = fixedStepLoop(STEP, {
    step: () => this.#step(),
    render: () => this.#frame(),
  });

  render() {
    const ticks = TICKS.map((tick) => `<span class="${tick === 50 ? 'half' : ''}" style="top: ${100 - tick}%"></span>`).join('');
    const bubbles = '<span class="bubble"></span>'.repeat(BUBBLES);
    return `<div class="dry">${text}<div class="ticks">${ticks}</div></div><div class="rim" aria-hidden="true"></div><div class="liquid" aria-hidden="true">${text}<div class="ticks">${ticks}</div>${bubbles}</div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this[INTERNALS].role = 'slider';
    this[INTERNALS].ariaValueMin = '0';
    this[INTERNALS].ariaValueMax = '100';
    this.addEventListener('pointerdown', (event) => this.#down(event), options);
    this.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) this.addEventListener(type, (event) => this.#up(event), options);
    this.addEventListener('pointerleave', () => this.#pointerId < 0 && (this.#pointerX = -1), options);
    this.addEventListener('keydown', (event) => this.#key(event), options);
    const resize = new ResizeObserver(() => this.#measure());
    resize.observe(this);
    // Offscreen or in a background tab, the loop waits.
    const visible = new IntersectionObserver(([entry]) => {
      this.#onScreen = entry.isIntersecting;
      this.#wake();
    });
    visible.observe(this);
    document.addEventListener('visibilitychange', () => this.#wake(), options);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      visible.disconnect();
      this.#loop.stop();
    });
  }

  updated(changed) {
    this.#initial ??= this.value;
    const value = clamp(Number(this.value) || 0, 0, 100);
    if (this.#level === null || reducedMotion.matches) {
      this.#level = value;
      this.#levelSpeed = 0;
    }
    this.tabIndex = this.readonly ? -1 : 0;
    this[INTERNALS].ariaReadOnly = this.readonly ? 'true' : null;
    this[INTERNALS].ariaLabel = this.label ?? null;
    this.toggleAttribute('data-warn', value >= this.warnAt);
    const used = this.#used(Math.round(value));
    this[INTERNALS].ariaValueNow = String(Math.round(value));
    this[INTERNALS].ariaValueText = `${Math.round(value)}%, ${used} of ${this.total} ${this.unit} used`;
    this[INTERNALS].setFormValue(this.name ? String(Math.round(value)) : null);
    for (const el of this.shadowRoot.querySelectorAll('.label')) el.textContent = this.label ?? '';
    for (const el of this.shadowRoot.querySelectorAll('.of')) el.textContent = ` of ${this.total} ${this.unit} used`;
    for (const el of this.shadowRoot.querySelectorAll('.status')) el.textContent = value >= this.warnAt ? 'Almost full' : `${100 - Math.round(value)}% free`;
    if (changed.has('value') || changed.has('total')) this.#shown = null;
    this.#measure();
    this.#wake();
  }

  formResetCallback() {
    this.value = this.#initial ?? 72;
  }

  #used(percent) {
    return ((percent / 100) * this.total).toFixed(1);
  }

  get #target() {
    return clamp(Number(this.value) || 0, 0, 100);
  }

  #measure() {
    this.#size = { width: this.clientWidth, height: this.clientHeight };
    this.#draw();
  }

  #wake() {
    if (this.#onScreen && !document.hidden) this.#loop.wake();
    else this.#loop.stop();
  }

  // ---- Simulation ----

  #step() {
    const heights = this.#heights;
    const speeds = this.#speeds;
    const target = this.#target;
    this.#levelSpeed += ((target - this.#level) * LEVEL_STIFFNESS - this.#levelSpeed * LEVEL_DAMPING) * STEP;
    this.#level += this.#levelSpeed * STEP;
    // Surface springs, with walls that reflect.
    let energy = Math.abs(target - this.#level) + Math.abs(this.#levelSpeed) * 0.1;
    for (let i = 0; i < COLUMNS; i++) {
      const left = heights[i > 0 ? i - 1 : i];
      const right = heights[i < COLUMNS - 1 ? i + 1 : i];
      speeds[i] += ((left + right - 2 * heights[i]) * SPREAD - heights[i] * RESTORE - speeds[i] * SURFACE_DAMPING) * STEP;
    }
    for (let i = 0; i < COLUMNS; i++) {
      heights[i] = clamp(heights[i] + speeds[i] * STEP, -MAX_WAVE, MAX_WAVE);
      energy = Math.max(energy, Math.abs(heights[i]), Math.abs(speeds[i]) * 0.1);
    }
    this.#energy = Math.max(this.#energy, energy);
    this.#time += STEP;
    this.#stepBubbles();
  }

  // Only a climbing level makes bubbles, more the faster it climbs; at the
  // surface each pops and leaves a tiny dimple.
  #stepBubbles() {
    const { width, height } = this.#size;
    this.#spawn += Math.max(0, this.#levelSpeed) * BUBBLE_RATE * STEP;
    while (this.#spawn >= 1) {
      this.#spawn -= 1;
      const free = this.#bubbles.find((bubble) => !bubble.alive);
      if (!free) {
        this.#spawn = 0;
        break;
      }
      Object.assign(free, { alive: true, x: width * (0.12 + Math.random() * 0.76), y: height - 6, r: 1.5 + Math.random() * 2.5, speed: 70 + Math.random() * 80, phase: Math.random() * Math.PI * 2 });
    }
    const levelY = height * (1 - this.#level / 100);
    for (const bubble of this.#bubbles) {
      if (!bubble.alive) continue;
      bubble.y -= bubble.speed * STEP;
      const i = clamp(Math.round((bubble.x / width) * (COLUMNS - 1)), 0, COLUMNS - 1);
      if (bubble.y - bubble.r <= levelY + this.#heights[i]) {
        bubble.alive = false;
        this.#speeds[i] += bubble.r * 6;
      }
    }
  }

  #frame() {
    const busy = this.#pointerId >= 0 || this.#bubbles.some((bubble) => bubble.alive) || this.#energy > REST_EPSILON;
    this.#energy = 0;
    if (!busy) {
      // Settle exactly, so the resting surface is flat.
      this.#level = this.#target;
      this.#levelSpeed = 0;
      this.#heights.fill(0);
      this.#speeds.fill(0);
    }
    this.#draw();
    return busy;
  }

  #surface(levelY, lift) {
    const { width, height } = this.#size;
    let points = '';
    for (let i = 0; i < COLUMNS; i++) points += `${((i / (COLUMNS - 1)) * width).toFixed(1)}px ${clamp(levelY + this.#heights[i] - lift, -40, height + 40).toFixed(1)}px,`;
    return `polygon(${points}${width}px ${height + 40}px,0px ${height + 40}px)`;
  }

  #draw() {
    const { width, height } = this.#size;
    const liquid = this.query('.liquid');
    const rim = this.query('.rim');
    if (!width || !height) {
      liquid.style.clipPath = flatPolygon(this.#target);
      rim.style.clipPath = flatPolygon(this.#target, RIM);
      return;
    }
    const levelY = height * (1 - this.#level / 100);
    liquid.style.clipPath = this.#surface(levelY, 0);
    rim.style.clipPath = this.#surface(levelY, RIM);
    this.shadowRoot.querySelectorAll('.bubble').forEach((node, i) => {
      const bubble = this.#bubbles[i];
      node.style.opacity = bubble.alive ? '1' : '0';
      if (!bubble.alive) return;
      const sway = Math.sin(this.#time * 7 + bubble.phase) * 2.5;
      node.style.transform = `translate3d(${(bubble.x + sway - bubble.r).toFixed(1)}px,${(bubble.y - bubble.r).toFixed(1)}px,0) scale(${(bubble.r / 4).toFixed(3)})`;
    });
    // The readout counts with the level as it pours.
    const shown = Math.round(clamp(this.#level, 0, 100));
    if (shown === this.#shown) return;
    this.#shown = shown;
    for (const el of this.shadowRoot.querySelectorAll('.number')) el.textContent = String(shown);
    for (const el of this.shadowRoot.querySelectorAll('.amount')) el.textContent = this.#used(shown);
  }

  // Pushes the columns around x by `amount`, fading out over a few columns.
  #disturb(clientX, amount, reach = 3) {
    if (reducedMotion.matches) return;
    const rect = this.getBoundingClientRect();
    const center = ((clientX - rect.left) / rect.width) * (COLUMNS - 1);
    for (let i = 0; i < COLUMNS; i++) {
      const falloff = 1 - Math.abs(i - center) / reach;
      if (falloff > 0) this.#speeds[i] += amount * falloff;
    }
  }

  #set(next, live) {
    const value = Math.round(clamp(next, 0, 100));
    if (value === this.value) return;
    this.value = value;
    if (live) this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    else this.emit('change', { value });
  }

  #valueAt(clientY) {
    const rect = this.getBoundingClientRect();
    return (1 - (clientY - rect.top) / rect.height) * 100;
  }

  // ---- Pointer and keys ----

  #down(event) {
    if (this.readonly || (event.pointerType === 'mouse' && event.button !== 0)) return;
    this.setPointerCapture?.(event.pointerId);
    this.#pointerId = event.pointerId;
    this.#pointerX = event.clientX;
    this.toggleAttribute('data-dragging', true);
    // The press itself lands like a drop.
    this.#disturb(event.clientX, 260, 2.5);
    this.#set(this.#valueAt(event.clientY), true);
    this.#wake();
  }

  #move(event) {
    const dx = this.#pointerX < 0 ? 0 : event.clientX - this.#pointerX;
    this.#pointerX = event.clientX;
    if (this.#pointerId === event.pointerId) {
      // A sideways drag rocks the whole body: one side rises, the other falls.
      if (!reducedMotion.matches) for (let i = 0; i < COLUMNS; i++) this.#speeds[i] += ((i / (COLUMNS - 1)) * 2 - 1) * dx * SLOSH;
      this.#set(this.#valueAt(event.clientY), true);
      this.#wake();
      return;
    }
    // Hovering through the liquid stirs it, behind the cursor.
    if (event.pointerType !== 'mouse' || dx === 0 || reducedMotion.matches) return;
    const rect = this.getBoundingClientRect();
    if (event.clientY - rect.top > rect.height * (1 - this.#level / 100) + 8) {
      this.#disturb(event.clientX, Math.abs(dx) * STIR, 2);
      this.#wake();
    }
  }

  #up(event) {
    if (this.#pointerId !== event.pointerId) return;
    this.#pointerId = -1;
    this.removeAttribute('data-dragging');
    vibrate(6);
    this.emit('change', { value: this.value });
    this.#wake();
  }

  #key(event) {
    if (this.readonly) return;
    let next;
    if (event.key in KEY_STEPS) next = this.value + KEY_STEPS[event.key] * (event.shiftKey ? 10 : 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;
    if (next === undefined) return;
    event.preventDefault();
    // A keyed change still lands with a small ripple.
    const rect = this.getBoundingClientRect();
    this.#disturb(rect.left + rect.width / 2, next > this.value ? 120 : -120, 4);
    this.#set(next, false);
    this.#wake();
  }
}
