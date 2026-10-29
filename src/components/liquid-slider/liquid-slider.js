import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, vibrate } from '../../core/motion.js';
import { watchVisibility } from '../../core/visibility.js';
import { CX, EMPTY_Y, FLOOR_Y, FULL_Y, HEIGHT, LEFT, Liquid, levelToY, MAX_BUBBLES, paths, RADIUS, RIGHT, RIM_Y, RY, STEP, WIDTH } from './liquid.js';
import styles from './liquid-slider.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

const GLASS_CLIP = `M${LEFT} ${RIM_Y}L${RIGHT} ${RIM_Y}L${RIGHT} ${FLOOR_Y}A${RADIUS} ${RY} 0 0 1 ${LEFT} ${FLOOR_Y}Z`;
const GLASS_BACK = `M${LEFT} ${RIM_Y}A${RADIUS} ${RY} 0 0 1 ${RIGHT} ${RIM_Y}L${RIGHT} ${FLOOR_Y}A${RADIUS} ${RY} 0 0 1 ${LEFT} ${FLOOR_Y}Z`;
const GLASS_FRONT = `M${LEFT} ${RIM_Y}L${LEFT} ${FLOOR_Y}A${RADIUS} ${RY} 0 0 0 ${RIGHT} ${FLOOR_Y}L${RIGHT} ${RIM_Y}`;
const MARKS = [0, 0.25, 0.5, 0.75, 1];

const SVG = `<svg class="glass" viewBox="0 0 ${WIDTH} ${HEIGHT}" aria-hidden="true">
<defs><clipPath id="glass"><path d="${GLASS_CLIP}"/></clipPath></defs>
<path class="back" d="${GLASS_BACK}"/>
<path class="floor" d="M${LEFT} ${FLOOR_Y}A${RADIUS} ${RY} 0 0 1 ${RIGHT} ${FLOOR_Y}"/>
<g clip-path="url(#glass)"><path class="body"/>${'<circle class="bubble" r="1"/>'.repeat(MAX_BUBBLES)}<path class="surface"/><path class="lip"/></g>
${MARKS.map((t) => {
  const y = Math.round(levelToY(t) + RY * 0.55);
  return `<line class="mark" x1="${RIGHT - 14}" x2="${RIGHT - 4}" y1="${y}" y2="${y}"/><text class="mark-label" x="${RIGHT + 8}" y="${y}" dominant-baseline="middle"></text>`;
}).join('')}
<ellipse class="rim" cx="${CX}" cy="${RIM_Y}" rx="${RADIUS}" ry="${RY}"/>
<path class="wall" d="${GLASS_FRONT}"/>
<line class="shine" x1="${LEFT + 9}" x2="${LEFT + 9}" y1="${RIM_Y + 22}" y2="${FLOOR_Y - 14}"/>
</svg>`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * A slider drawn as a glass of liquid. Drag up and down in the glass to pour
 * and drain it: the level chases the pointer on a spring, the surface sloshes
 * with the pointer's sideways speed, and a fast pour sends bubbles up. Arrow
 * keys, Page Up/Down, Home and End step it with a ripple. It rests while off
 * screen; with reduced motion the liquid moves without waves.
 *
 * @attr {number} value
 * @attr {number} min
 * @attr {number} max
 * @attr {number} step
 * @attr {string} unit - Shown after the number
 * @attr {string} label
 * @attr {string} name - Submits the value with the form under this name
 * @attr {boolean} disabled
 * @fires lw-change - The value changed; `detail: { value }`
 * @cssprop --lw-liquid-slider-color - The liquid
 * @csspart base
 */
export class LwLiquidSlider extends FormControl(LwElement) {
  static styles = styles;
  static props = {
    value: { type: Number, default: 1250 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 2000 },
    step: { type: Number, default: 50 },
    unit: { default: 'ml' },
    label: { default: 'Water today' },
    name: {},
    disabled: { type: Boolean, reflect: true },
  };

  // `formatValue` is set as a property: formats the readout, the graduations and the spoken value.
  // Not declared as a field, which would overwrite a value set before upgrade.

  #liquid = new Liquid();
  #loop = fixedStepLoop(STEP, { step: () => this.#liquid.step(), render: () => this.#frame() });
  #visible = false;
  #initial = null;
  #drawn = false;
  #pointer = null;
  #parts = null;
  #formDisabled = false;

  render() {
    return `<div class="slider" part="base" role="slider" aria-orientation="vertical" aria-labelledby="label"><div class="readout"><p class="label" id="label"></p><p class="value"><span class="number"></span><span class="unit"></span></p></div>${SVG}</div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const svg = this.query('.glass');
    this.#parts ??= {
      body: svg.querySelector('.body'),
      surface: svg.querySelector('.surface'),
      lip: svg.querySelector('.lip'),
      bubbles: [...svg.querySelectorAll('.bubble')],
    };
    svg.addEventListener('pointerdown', (event) => this.#down(event), options);
    svg.addEventListener('pointermove', (event) => this.#pointer && this.#follow(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) svg.addEventListener(type, () => this.#up(), options);
    this.query('.slider').addEventListener('keydown', (event) => this.#key(event), options);
    watchVisibility(
      this,
      (visible) => {
        this.#visible = visible;
        if (visible) this.#wake();
        else this.#loop.stop();
      },
      this.signal,
    );
    this.signal.addEventListener('abort', () => {
      this.#loop.stop();
      this.#pointer = null;
      this.#liquid.held = false;
    });
  }

  updated(changed) {
    this.#initial ??= this.value;
    if (changed.has('label')) this.query('.label').textContent = this.label;
    if (changed.has('disabled')) this.#syncDisabled();
    const value = this.#clamp(this.value);
    const fraction = this.#fraction(value);
    if (changed.has('min') || changed.has('max') || !this.#drawn) {
      this.query('.glass')
        .querySelectorAll('.mark-label')
        .forEach((text, i) => (text.textContent = this.#format(this.min + MARKS[i] * (this.max - this.min))));
    }
    this.#readout(value);
    // The first time, the glass starts full to the value; after that a value
    // set from outside moves the target and the liquid follows on its own.
    const liquid = this.#liquid;
    if (!this.#drawn) {
      liquid.target = fraction;
      liquid.rest();
      this.#draw();
      this.#drawn = true;
    } else if (!liquid.held && Math.abs(liquid.target - fraction) > 1e-6) {
      liquid.target = fraction;
      this.#wake();
    }
  }

  formResetCallback() {
    this.value = this.#clamp(this.#initial);
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncDisabled();
  }

  get #active() {
    return !this.disabled && !this.#formDisabled;
  }

  #syncDisabled() {
    const slider = this.query('.slider');
    slider.tabIndex = this.#active ? 0 : -1;
    slider.ariaDisabled = this.#active ? null : 'true';
  }

  #clamp(value) {
    const snapped = Number((Math.round((value - this.min) / this.step) * this.step + this.min).toFixed(10));
    return clamp(snapped, this.min, this.max);
  }

  #fraction(value) {
    return this.max - this.min > 0 ? (value - this.min) / (this.max - this.min) : 0;
  }

  #format(value) {
    return this.formatValue ? this.formatValue(value) : value.toLocaleString('en-US');
  }

  #readout(value) {
    const text = this.#format(value);
    this.query('.number').textContent = text;
    this.query('.unit').textContent = this.unit ?? '';
    Object.assign(this.query('.slider'), {
      ariaValueNow: String(value),
      ariaValueMin: String(this.min),
      ariaValueMax: String(this.max),
      ariaValueText: `${text} ${this.unit ?? ''}`.trim(),
    });
    this[INTERNALS].setFormValue(this.name ? String(value) : null);
  }

  // A pointer or key sets a new value; a light tick each time the level
  // crosses a quarter.
  #commit(next) {
    const value = this.#clamp(next);
    if (value === this.value) return;
    const quarter = (this.max - this.min) / 4;
    if (Math.floor((value - this.min) / quarter) !== Math.floor((this.value - this.min) / quarter)) vibrate(4);
    this.value = value;
    this.#readout(value);
    this.emit('change', { value });
  }

  #wake() {
    if (reducedMotion.matches) {
      this.#liquid.rest();
      this.#draw();
      return;
    }
    if (this.#visible) this.#loop.wake();
  }

  #frame() {
    const liquid = this.#liquid;
    // The sideways speed fades when the pointer stops moving.
    liquid.pvx *= 0.85;
    if (liquid.settled) {
      liquid.rest();
      this.#draw();
      return false;
    }
    this.#draw();
    return true;
  }

  #draw() {
    const liquid = this.#liquid;
    const { body, surface, lip, bubbles } = this.#parts;
    const d = paths(levelToY(liquid.level), liquid.heights);
    body.setAttribute('d', d.body);
    surface.setAttribute('d', d.surface);
    lip.setAttribute('d', d.lip);
    bubbles.forEach((circle, i) => {
      const bubble = liquid.bubbles[i];
      circle.style.opacity = bubble ? '1' : '0';
      if (!bubble) return;
      circle.setAttribute('cx', (bubble.x + Math.sin(bubble.phase) * 1.6).toFixed(2));
      circle.setAttribute('cy', bubble.y.toFixed(2));
      circle.setAttribute('r', bubble.r.toFixed(2));
    });
  }

  #local(event) {
    const box = this.query('.glass').getBoundingClientRect();
    return { x: ((event.clientX - box.left) / box.width) * WIDTH, y: ((event.clientY - box.top) / box.height) * HEIGHT };
  }

  #down(event) {
    if (!this.#active || this.#pointer || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    // Focus without scrolling, so the keyboard picks up where the hand left.
    this.query('.slider').focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    this.#pointer = { lastX: 0, lastT: 0 };
    Object.assign(this.#liquid, { held: true, pvx: 0 });
    this.toggleAttribute('data-grabbing', true);
    this.#follow(event);
  }

  #follow(event) {
    const liquid = this.#liquid;
    const pointer = this.#pointer;
    const point = this.#local(event);
    const now = event.timeStamp;
    if (pointer.lastT && now > pointer.lastT) {
      const vx = ((point.x - pointer.lastX) / (now - pointer.lastT)) * 1000;
      liquid.pvx = liquid.pvx * 0.6 + clamp(vx, -900, 900) * 0.4;
    }
    pointer.lastX = point.x;
    pointer.lastT = now;
    liquid.px = clamp(point.x, LEFT, RIGHT);
    liquid.py = clamp(point.y, FULL_Y, EMPTY_Y);
    const raw = clamp((EMPTY_Y - point.y) / (EMPTY_Y - FULL_Y), 0, 1);
    liquid.target = raw;
    this.#commit(this.min + raw * (this.max - this.min));
    this.#wake();
  }

  #up() {
    if (!this.#pointer) return;
    this.#pointer = null;
    this.#liquid.held = false;
    this.removeAttribute('data-grabbing');
    // Settle on the step the readout shows.
    this.#liquid.target = this.#fraction(this.value);
    this.#wake();
  }

  #key(event) {
    if (!this.#active) return;
    const { min, max, step, value } = this;
    const big = Math.max(step, (max - min) / 10);
    const moves = { ArrowUp: value + step, ArrowRight: value + step, ArrowDown: value - step, ArrowLeft: value - step, PageUp: value + big, PageDown: value - big, Home: min, End: max };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = moves[event.key];
    this.#commit(next);
    if (!reducedMotion.matches) this.#liquid.drop(next > value);
    this.#liquid.target = this.#fraction(this.value);
    this.#wake();
  }
}
