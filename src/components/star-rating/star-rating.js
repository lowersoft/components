import { FormControl, INTERNALS } from '../../core/form.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './star-rating.scss?inline';

// A five-pointed star in a 24-unit box: ten corners, outer and inner.
const CENTER = [12, 12.7];
const CORNERS = Array.from({ length: 10 }, (_, i) => {
  const angle = -Math.PI / 2 + (i * Math.PI) / 5;
  const radius = i % 2 ? 4.7 : 11.2;
  return [CENTER[0] + Math.cos(angle) * radius, CENTER[1] + Math.sin(angle) * radius];
});
const round = (n) => Math.round(n * 100) / 100;
const OUTLINE = `M${CORNERS.map(([x, y]) => `${round(x)} ${round(y)}`).join('L')}Z`;
// Ten facets, each a sliver from the center to two neighbouring corners,
// facing the way its middle points.
const FACETS = CORNERS.map((corner, i) => {
  const next = CORNERS[(i + 1) % 10];
  return {
    d: `M${CENTER.join(' ')}L${round(corner[0])} ${round(corner[1])}L${round(next[0])} ${round(next[1])}Z`,
    angle: -Math.PI / 2 + ((i + 0.5) * Math.PI) / 5,
  };
});
// The light falls from the top left until the pointer moves it.
const DEFAULT_LIGHT = Math.atan2(-1, -1);

const starMarkup = (variant) =>
  variant === 'classic'
    ? `<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path class="shape" d="${OUTLINE}"/></svg>`
    : `<svg class="star" viewBox="0 0 24 24" aria-hidden="true">${FACETS.map((facet, i) => `<path class="facet" style="fill: var(--_f${i})" d="${facet.d}"/>`).join('')}</svg>`;

/**
 * A star rating. In the `cut` style each star is cut into ten facets that
 * catch a light following the pointer; `classic` stars are soft and round.
 * Hovering previews the rating a click would give, tinting the stars that
 * would be added or dropped, and choosing glides one fill along the row to
 * the new value. Choosing the current rating again clears it, unless
 * `no-clear`.
 *
 * It is a slider and a form control: the arrow keys step it, Home and End
 * go to the ends, and number keys pick a rating. `precision="0.5"` allows
 * half stars, and `readonly` shows any value, fractions included.
 *
 * @attr {number} value
 * @attr {number} max - How many stars
 * @attr {0.5|1} precision - Whole or half stars
 * @attr {number} size - Each star, in pixels
 * @attr {'cut'|'classic'} variant
 * @attr {'gold'|'silver'|'ember'|'rose'|'violet'} tone - The lit stars' material
 * @attr {boolean} readonly - Shows the value without taking input
 * @attr {boolean} no-clear - Choosing the current rating keeps it instead of clearing it
 * @attr {string} name - Submits the value with the form under this name
 * @attr {string} label - Accessible name
 * @attr {boolean} disabled
 * @fires lw-change - A rating was chosen; `detail: { value }`
 * @fires lw-hover - The previewed rating; `detail: { value }`, null when the pointer leaves
 * @csspart stars - The row
 * @cssprop --lw-star-rating-color - Replaces the tone's color
 */
export class LwStarRating extends FormControl(LwElement) {
  static styles = styles;
  static props = {
    value: { type: Number, default: 0 },
    max: { type: Number, default: 5 },
    precision: { type: Number, default: 1 },
    size: { type: Number, default: 28 },
    variant: { default: 'cut', reflect: true },
    tone: { default: 'gold', reflect: true },
    readonly: { type: Boolean, reflect: true },
    noClear: { type: Boolean },
    name: {},
    label: { default: 'Rating' },
    disabled: { type: Boolean, reflect: true },
  };

  #hover = null;
  #initial = null;
  #formDisabled = false;
  #built = '';
  #light = null;

  render() {
    return '<div class="stars" part="stars" role="slider" tabindex="0"><div class="row base"></div><div class="row ghost"></div><div class="row lit"></div></div>';
  }

  connected() {
    const options = { signal: this.signal };
    const stars = this.query('.stars');
    stars.addEventListener('pointermove', (event) => this.#move(event), options);
    stars.addEventListener('pointerleave', () => this.#leave(), options);
    stars.addEventListener('click', (event) => this.#click(event), options);
    stars.addEventListener('keydown', (event) => this.#key(event), options);
  }

  updated(changed) {
    this.#initial ??= this.value;
    const count = this.#count;
    const key = `${count}:${this.variant}`;
    if (key !== this.#built) {
      this.#built = key;
      const markup = starMarkup(this.variant).repeat(count);
      for (const row of this.shadowRoot.querySelectorAll('.row')) row.innerHTML = markup;
      this.#shade();
    }
    this.style.setProperty('--_size', `${this.#size}px`);
    this.style.setProperty('--_gap', `${this.#gap}px`);
    this.query('.stars').ariaLabel = this.label || 'Rating';
    if (changed.has('readonly') || changed.has('disabled')) this.#hover = null;
    this.#paint();
  }

  formResetCallback() {
    this.value = this.#initial ?? 0;
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#hover = null;
    this.#paint();
  }

  get #count() {
    return Math.max(1, Math.min(20, Math.round(this.max ?? 5)));
  }

  get #step() {
    return this.precision === 0.5 ? 0.5 : 1;
  }

  get #size() {
    return Math.max(12, this.size ?? 28);
  }

  get #gap() {
    return Math.round(this.#size * 0.18);
  }

  get #interactive() {
    return !this.readonly && !this.disabled && !this.#formDisabled;
  }

  get #value() {
    return Math.min(Math.max(Number(this.value) || 0, 0), this.#count);
  }

  // Pixels from the row's start to where `value` ends.
  #offset(value) {
    const whole = Math.floor(value);
    return whole * (this.#size + this.#gap) + (value - whole) * this.#size;
  }

  #paint() {
    const value = this.#value;
    const hover = this.#hover;
    const lit = hover === null ? value : Math.min(hover, value);
    const ghost = hover === null ? value : Math.max(hover, value);
    this.toggleAttribute('data-dropping', hover !== null && hover < value);
    const width = this.#count * this.#size + (this.#count - 1) * this.#gap;
    this.query('.lit').style.clipPath = `inset(0 ${(width - this.#offset(lit)).toFixed(2)}px 0 0)`;
    this.query('.ghost').style.clipPath = `inset(0 ${(width - this.#offset(ghost)).toFixed(2)}px 0 0)`;
    const stars = this.query('.stars');
    stars.tabIndex = this.#interactive || this.readonly ? 0 : -1;
    stars.ariaReadOnly = this.readonly ? 'true' : null;
    stars.ariaDisabled = this.#interactive || this.readonly ? null : 'true';
    const shown = Number.isInteger(value * 2) ? value : Math.round(value * 10) / 10;
    Object.assign(stars, {
      ariaValueNow: String(shown),
      ariaValueMin: '0',
      ariaValueMax: String(this.#count),
      ariaValueText: `${shown} of ${this.#count} stars`,
    });
    this[INTERNALS].setFormValue(this.name ? String(value) : null);
  }

  // The rating under the pointer.
  #at(event) {
    const box = this.query('.stars').getBoundingClientRect();
    const x = event.clientX - box.left;
    const pitch = this.#size + this.#gap;
    const index = Math.min(this.#count - 1, Math.max(0, Math.floor(x / pitch)));
    const within = Math.min(1, Math.max(0, (x - index * pitch) / this.#size));
    const value = this.#step === 0.5 && within < 0.5 ? index + 0.5 : index + 1;
    return Math.min(this.#count, Math.max(this.#step, value));
  }

  #move(event) {
    if (this.variant !== 'classic') {
      this.#light = { x: event.clientX, y: event.clientY };
      this.#shade();
    }
    if (!this.#interactive) return;
    const value = this.#at(event);
    if (value === this.#hover) return;
    this.#hover = value;
    this.#paint();
    this.emit('hover', { value });
  }

  #leave() {
    this.#light = null;
    this.#shade();
    if (this.#hover === null) return;
    this.#hover = null;
    this.#paint();
    this.emit('hover', { value: null });
  }

  #click(event) {
    if (!this.#interactive) return;
    const picked = this.#at(event);
    this.#choose(picked === this.#value && !this.noClear ? 0 : picked);
  }

  #choose(next) {
    const value = Math.min(Math.max(next, 0), this.#count);
    if (value === this.#value) return;
    this.value = value;
    this.emit('change', { value });
  }

  #key(event) {
    if (!this.#interactive) return;
    const step = this.#step;
    const value = this.#value;
    const least = this.noClear ? step : 0;
    let next;
    if (['ArrowRight', 'ArrowUp'].includes(event.key)) next = value + step;
    else if (['ArrowLeft', 'ArrowDown'].includes(event.key)) next = value - step;
    else if (event.key === 'Home') next = least;
    else if (event.key === 'End') next = this.#count;
    else if (/^[0-9]$/.test(event.key)) next = Number(event.key);
    if (next === undefined) return;
    event.preventDefault();
    this.#choose(Math.min(Math.max(Math.round(next / step) * step, least), this.#count));
  }

  // Lights each facet by how squarely it faces the light: toward the
  // pointer when it is over the row, from the top left otherwise.
  #shade() {
    if (this.variant === 'classic') return;
    const rows = [...this.shadowRoot.querySelectorAll('.row')];
    const count = this.#count;
    for (let i = 0; i < count; i++) {
      const stars = rows.map((row) => row.children[i]).filter(Boolean);
      if (!stars.length) continue;
      let light = DEFAULT_LIGHT;
      if (this.#light) {
        const box = stars[0].getBoundingClientRect();
        light = Math.atan2(this.#light.y - (box.top + (box.height * CENTER[1]) / 24), this.#light.x - (box.left + box.width / 2));
      }
      for (const [j, facet] of FACETS.entries()) {
        const facing = Math.cos(facet.angle - light);
        const fill = facing >= 0
          ? `color-mix(in oklab, var(--_tone), white ${Math.round(facing * 48)}%)`
          : `color-mix(in oklab, var(--_tone), black ${Math.round(-facing * 30)}%)`;
        for (const star of stars) star.style.setProperty(`--_f${j}`, fill);
      }
    }
  }
}
