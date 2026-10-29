import { addDays, addMonths, daysInRange, endOfMonth, formatDate, maxDate, minDate, parseDate, sameMonth, startOfMonth, today, weekday } from '../../core/dates.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight, chevronLeft, chevronRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../switch/index.js';
import styles from './period-picker.scss?inline';

const CELLS = 42;
const SHORT = { month: 'short', day: 'numeric' };

/** Quick periods, ending today. */
const PRESETS = [
  { id: '7', label: '7 days', range: (t) => [addDays(t, -6), t] },
  { id: '30', label: '30 days', range: (t) => [addDays(t, -29), t] },
  { id: '90', label: '90 days', range: (t) => [addDays(t, -89), t] },
  { id: 'month', label: 'This month', range: (t) => [startOfMonth(t), t] },
  { id: 'last', label: 'Last month', range: (t) => [addMonths(t, -1), addDays(startOfMonth(t), -1)] },
];

const span = (start, end) => `${formatDate(start, 'en-US', SHORT)} – ${formatDate(end, 'en-US', SHORT)}`;

/**
 * A reporting period: a preset, or a first and a last day picked on the
 * month, with the days between filling in as you point. Days after today
 * cannot be picked. Compare adds the period just before, as long, and
 * Apply hands it over. The arrow keys move through the days, Page Up and
 * Page Down through the months, and Enter picks.
 *
 * @attr {string} label
 * @attr {string} start - The first day, `YYYY-MM-DD`
 * @attr {string} end - The last day
 * @attr {boolean} compare - Also report the period before
 * @fires lw-change - Applied; `detail: { start, end, days, previous }`, `previous` as `{ start, end }` when comparing
 */
export class LwPeriodPicker extends LwElement {
  static styles = styles;
  static props = {
    label: { default: 'Reporting period' },
    start: { default: '', reflect: true },
    end: { default: '', reflect: true },
    compare: { type: Boolean, reflect: true },
  };

  // The month shown, the day under the pointer or focus, and a half-picked range.
  #month = startOfMonth(today());
  #hover = null;
  #anchor = null;

  render() {
    return `<header class="head"><span class="label"></span><button class="clear" type="button">Clear</button></header>
<div class="card"><div class="top"><p class="summary" aria-live="polite"></p><div class="presets"></div></div>
<div class="month-head"><p class="month" aria-live="polite"></p><button class="nav" type="button" data-step="-1" aria-label="Previous month">${strokeIcon(chevronLeft, 16)}</button><button class="nav" type="button" data-step="1" aria-label="Next month">${strokeIcon(chevronRight, 16)}</button></div>
<div class="grid" role="grid"><div class="weekdays" role="row">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => `<span role="columnheader">${day}</span>`).join('')}</div><div class="days"></div></div>
<footer class="foot"><lw-switch class="compare" size="sm">Compare</lw-switch><button class="apply" type="button" disabled><span>Apply</span>${strokeIcon(arrowRight, 15)}</button></footer></div><p class="hint"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.presets').innerHTML = PRESETS.map((preset) => `<button class="preset" type="button" data-id="${preset.id}">${preset.label}</button>`).join('');
    this.query('.presets').addEventListener('click', (event) => {
      const preset = PRESETS.find((each) => each.id === event.target.closest('.preset')?.dataset.id);
      if (!preset) return;
      const [start, end] = preset.range(today());
      this.#anchor = null;
      this.#month = startOfMonth(end);
      Object.assign(this, { start, end });
    }, options);
    this.query('.clear').addEventListener('click', () => {
      this.#anchor = null;
      Object.assign(this, { start: '', end: '' });
    }, options);
    for (const nav of this.shadowRoot.querySelectorAll('.nav')) nav.addEventListener('click', () => this.#showMonth(addMonths(this.#month, Number(nav.dataset.step))), options);
    const days = this.query('.days');
    days.addEventListener('click', (event) => {
      const day = event.target.closest('.day');
      if (day && !day.disabled) this.#pick(day.dataset.date);
    }, options);
    days.addEventListener('pointerover', (event) => this.#point(event.target.closest('.day')?.dataset.date ?? null), options);
    days.addEventListener('pointerleave', () => this.#point(null), options);
    days.addEventListener('keydown', (event) => this.#key(event), options);
    days.addEventListener('focusin', (event) => this.#point(event.target.closest('.day')?.dataset.date ?? null), options);
    const compare = this.query('.compare');
    compare.addEventListener('change', () => (this.compare = compare.checked), options);
    this.query('.apply').addEventListener('click', () => this.#apply(), options);
  }

  updated(changed) {
    this.query('.label').textContent = this.label ?? '';
    if ((changed.has('end') || changed.has('start')) && parseDate(this.end)) this.#month = startOfMonth(minDate(this.end, today()));
    this.query('.compare').checked = this.compare;
    this.#paint();
  }

  get #range() {
    const start = parseDate(this.start);
    const end = parseDate(this.end);
    return start && end ? [minDate(start, end), maxDate(start, end)] : null;
  }

  // The range to draw: a half-picked one stretches to the day pointed at.
  get #shown() {
    if (this.#anchor) {
      const other = this.#hover ?? this.#anchor;
      return [minDate(this.#anchor, other), maxDate(this.#anchor, other)];
    }
    return this.#range;
  }

  #showMonth(month) {
    this.#month = startOfMonth(minDate(month, today()));
    this.#paint();
  }

  #point(date) {
    if (date === this.#hover) return;
    this.#hover = date;
    if (this.#anchor) this.#paintDays();
  }

  #pick(date) {
    if (!this.#anchor) {
      this.#anchor = date;
      this.#paint();
      return;
    }
    const [start, end] = [minDate(this.#anchor, date), maxDate(this.#anchor, date)];
    this.#anchor = null;
    Object.assign(this, { start, end });
  }

  #paint() {
    const range = this.#range;
    const t = today();
    const preset = range && PRESETS.find((each) => each.range(t).join() === range.join());
    for (const button of this.shadowRoot.querySelectorAll('.preset')) button.ariaPressed = String(button.dataset.id === preset?.id);
    this.query('.summary').innerHTML = range ? `${span(...range)} <span class="count">${daysInRange(...range)} days</span>` : this.#anchor ? `${formatDate(this.#anchor, 'en-US', SHORT)} – …` : 'No dates';
    this.query('.month').textContent = formatDate(this.#month, 'en-US', { month: 'long', year: 'numeric' });
    this.query('.nav[data-step="1"]').disabled = sameMonth(this.#month, t);
    this.query('.apply').disabled = !range;
    this.query('.clear').disabled = !range && !this.#anchor;
    let hint = 'Click a first and a last day';
    if (this.#anchor) hint = 'Now the last day';
    else if (range && this.compare) {
      const days = daysInRange(...range);
      hint = `Compared with ${span(addDays(range[0], -days), addDays(range[0], -1))}`;
    } else if (range) hint = `${daysInRange(...range)} days, through ${formatDate(range[1], 'en-US', SHORT)}`;
    this.query('.hint').textContent = hint;
    this.#paintDays();
  }

  #paintDays() {
    const t = today();
    const first = addDays(this.#month, -weekday(this.#month));
    const shown = this.#shown;
    const focused = this.shadowRoot.activeElement?.dataset?.date;
    const focusable = focused && sameMonth(focused, this.#month) ? focused : shown && sameMonth(shown[1], this.#month) ? shown[1] : minDate(endOfMonth(this.#month), t);
    let rows = '';
    for (let row = 0; row < CELLS / 7; row++) {
      rows += '<div class="week" role="row">';
      for (let col = 0; col < 7; col++) {
        const date = addDays(first, row * 7 + col);
        const outside = !sameMonth(date, this.#month);
        const future = date > t;
        const inRange = shown && date >= shown[0] && date <= shown[1];
        const edge = shown && (date === shown[0] ? 'start' : date === shown[1] ? 'end' : '');
        const day = Number(date.slice(8));
        rows += `<button class="day" type="button" role="gridcell" data-date="${date}" tabindex="${date === focusable ? 0 : -1}"${future ? ' disabled' : ''}${outside ? ' data-outside' : ''}${inRange ? ' data-in' : ''}${edge ? ` data-edge="${edge}"` : ''}${date === t ? ' data-today' : ''} aria-selected="${Boolean(inRange)}" aria-label="${formatDate(date, 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}">${day === 1 ? `<small>${formatDate(date, 'en-US', { month: 'short' })}</small>` : ''}${day}</button>`;
      }
      rows += '</div>';
    }
    const days = this.query('.days');
    days.innerHTML = rows;
    if (focused) days.querySelector(`[data-date="${focusable}"]`)?.focus();
  }

  #key(event) {
    const day = event.target.closest('.day');
    if (!day) return;
    const date = day.dataset.date;
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let next = null;
    if (event.key in steps) next = addDays(date, steps[event.key]);
    else if (event.key === 'PageUp') next = addMonths(date, -1);
    else if (event.key === 'PageDown') next = addMonths(date, 1);
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!day.disabled) this.#pick(date);
      this.query(`[data-date="${date}"]`)?.focus();
      return;
    }
    if (!next) return;
    event.preventDefault();
    next = minDate(next, today());
    if (!sameMonth(next, this.#month)) {
      this.#month = startOfMonth(next);
      this.#paint();
    }
    this.#hover = next;
    this.#paintDays();
    this.query(`[data-date="${next}"]`)?.focus();
  }

  #apply() {
    const range = this.#range;
    if (!range) return;
    const days = daysInRange(...range);
    const previous = this.compare ? { start: addDays(range[0], -days), end: addDays(range[0], -1) } : undefined;
    this.emit('change', { start: range[0], end: range[1], days, previous });
  }
}
