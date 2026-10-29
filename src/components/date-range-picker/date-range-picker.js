import { FormControl, INTERNALS } from '../../core/form.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import styles from './date-range-picker.scss?inline';
import {
  addDays,
  addMonths,
  daysInRange,
  endOfMonth,
  formatDate,
  maxDate,
  minDate,
  parseDate,
  sameMonth,
  shiftMonths,
  startOfMonth,
  today,
  weekday,
} from '../../core/dates.js';

const MONTHS = 2;
const CELLS = 42;
const SHORT = { month: 'short', day: 'numeric', year: 'numeric' };
const FULL = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
const SLIDE = { duration: 380, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };

const chevron = (d) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

/** Quick ranges, relative to today. */
const PRESETS = {
  today: { label: 'Today', range: (t) => [t, t] },
  week: { label: 'Last 7 days', range: (t) => [addDays(t, -6), t] },
  month: { label: 'Last 30 days', range: (t) => [addDays(t, -29), t] },
  thisMonth: { label: 'This month', range: (t) => [startOfMonth(t), t] },
  lastMonth: { label: 'Last month', range: (t) => [addMonths(t, -1), addDays(startOfMonth(t), -1)] },
};

const monthMarkup = (index) => {
  const weekdays = '<span role="columnheader"></span>'.repeat(7);
  const week = `<div class="week" role="row"><span class="band" aria-hidden="true"></span>${'<span role="gridcell"><button class="day" type="button" tabindex="-1"></button></span>'.repeat(7)}</div>`;
  return `<div class="month"><p class="title" id="title-${index}"></p><div class="grid" role="grid" aria-labelledby="title-${index}" aria-describedby="hint"><div class="weekdays" role="row">${weekdays}</div>${week.repeat(CELLS / 7)}</div></div>`;
};

const field = (name, label) => `<div class="field" data-field="${name}"><span class="field-label">${label}</span><span class="field-value"></span></div>`;

/**
 * A two-month range calendar for analytics and reports. Pick a start and an
 * end (the range previews as you point), or a quick range like "Last 7
 * days", then Apply. Arrow keys move between days, Page Up and Page Down
 * change the month, Home and End go to the week's ends, Enter or Space picks
 * a date and Escape cancels back to the applied range. In a narrow space it
 * shows one month and puts the quick ranges on top.
 *
 * Dates are ISO strings, "2026-10-09". With a `name`, the form submits the
 * applied range as an ISO interval, "2026-10-09/2026-10-15".
 *
 * @attr {string} start - The applied start date
 * @attr {string} end - The applied end date
 * @attr {string} min - The earliest date that can be picked
 * @attr {string} max - The latest date that can be picked
 * @attr {string} locale - For month and day names, e.g. "en-GB"
 * @attr {number} week-start - 0 for Sunday, 1 for Monday
 * @attr {string} name - Submits the applied range with the form under this name
 * @fires lw-change - Apply was pressed; `detail: { start, end }`, both null when cleared
 * @fires lw-cancel - Escape dropped the unapplied changes
 * @csspart base
 */
export class LwDateRangePicker extends FormControl(LwElement) {
  static styles = [rollingStyles, styles];
  static props = {
    start: { reflect: true },
    end: { reflect: true },
    min: {},
    max: {},
    locale: { default: 'en-US' },
    weekStart: { type: Number, default: 0 },
    name: {},
  };

  // The range being picked, applied only with Apply.
  #draft = { start: null, end: null };
  // The first month laid out, and the day that holds keyboard focus.
  #view = null;
  #focus = null;
  #hover = null;
  #initial = null;
  #days = [];
  #ghost = null;

  render() {
    const presets = Object.entries(PRESETS)
      .map(([key, { label }]) => `<button class="preset" type="button" data-preset="${key}" aria-pressed="false">${label}</button>`)
      .join('');
    return `<div class="card" part="base"><div class="body"><div class="presets"><p class="presets-title" aria-hidden="true">Quick select</p><div class="preset-list" role="toolbar" aria-label="Quick select"><span class="highlight" aria-hidden="true"></span>${presets}</div></div><div class="calendar"><div class="navs"><button class="nav" type="button" data-step="-1" aria-label="Previous months">${chevron('m15 18-6-6 6-6')}</button><button class="nav" type="button" data-step="1" aria-label="Next months">${chevron('m9 18 6-6-6-6')}</button></div><div class="months">${Array.from({ length: MONTHS }, (_, i) => monthMarkup(i)).join('')}</div><p class="hint" id="hint">Arrow keys move between days, Page Up and Page Down change the month, Enter picks a date, Escape cancels.</p></div></div><div class="footer"><div class="range">${field('start', 'Start')}<span class="dash" aria-hidden="true">–</span>${field('end', 'End')}<span class="count"><span class="rolling"></span> <span class="unit"></span></span></div><div class="actions"><lw-button class="clear" variant="ghost">Clear</lw-button><lw-button class="apply">Apply</lw-button></div></div><p class="announce" aria-live="polite"></p></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.#days = [...this.shadowRoot.querySelectorAll('.day')];
    const calendar = this.query('.calendar');
    calendar.addEventListener('click', (event) => this.#click(event), options);
    calendar.addEventListener('keydown', (event) => this.#key(event), options);
    calendar.addEventListener('focusin', (event) => event.target.dataset.date && (this.#focus = event.target.dataset.date), options);
    calendar.addEventListener('pointerover', (event) => this.#setHover(event.target.closest('.day')?.dataset.date ?? null), options);
    calendar.addEventListener('pointerleave', () => this.#setHover(null), options);
    const presets = this.query('.preset-list');
    const highlight = presets.querySelector('.highlight');
    presets.addEventListener('click', (event) => this.#preset(event.target.closest('.preset')?.dataset.preset), options);
    // One hover box slides between the quick ranges.
    presets.addEventListener('pointerover', (event) => moveHighlight(highlight, event.target.closest('.preset')), options);
    presets.addEventListener('pointerleave', () => hideHighlight(highlight), options);
    presets.addEventListener('focusin', (event) => event.target.matches(':focus-visible') && moveHighlight(highlight, event.target), options);
    presets.addEventListener('focusout', () => hideHighlight(highlight), options);
    const clear = this.query('.clear');
    const apply = this.query('.apply');
    clear.addEventListener('click', () => !clear.disabled && this.#setDraft(null, null), options);
    apply.addEventListener('click', () => !apply.disabled && this.#apply(), options);
    // The number of months on show follows the width; keep the range in them.
    const resize = new ResizeObserver(() => this.#view && this.#renderMonths());
    resize.observe(this.query('.months'));
    this.signal.addEventListener('abort', () => resize.disconnect());
  }

  updated(changed) {
    const start = parseDate(this.start);
    const end = parseDate(this.end);
    this.#initial ??= { start, end };
    if (changed.has('start') || changed.has('end')) {
      this.#draft = start && end ? { start: minDate(start, end), end: maxDate(start, end) } : { start: null, end: null };
      // Turn to an applied range set from outside.
      if (this.#view && this.#draft.end) this.#reveal(this.#draft.end);
    }
    this.#view ??= addMonths(this.#draft.end ?? today(), 1 - MONTHS);
    this.#focus ??= this.#draft.start ?? this.#clamp(today());
    if (changed.has('locale') || changed.has('weekStart')) this.#renderWeekdays();
    this.#renderMonths();
    this[INTERNALS].setFormValue(this.name && start && end ? `${start}/${end}` : null);
  }

  formResetCallback() {
    this.start = this.#initial?.start ?? null;
    this.end = this.#initial?.end ?? null;
  }

  get #committed() {
    return { start: parseDate(this.start), end: parseDate(this.end) };
  }

  #clamp(date) {
    const min = parseDate(this.min);
    const max = parseDate(this.max);
    if (min && date < min) return min;
    if (max && date > max) return max;
    return date;
  }

  // The laid-out months that are on show: both, or only the later one when
  // narrow. As offsets from the first month laid out.
  get #shown() {
    const months = [...this.query('.months').querySelectorAll('.month')];
    const shown = months.map((month, i) => (month.getClientRects().length ? i : -1)).filter((i) => i >= 0);
    return shown.length ? [shown[0], shown.at(-1)] : [0, MONTHS - 1];
  }

  #isVisible(date) {
    const [first, last] = this.#shown;
    return date >= addMonths(this.#view, first) && date <= endOfMonth(addMonths(this.#view, last));
  }

  // Turns the months so `date` is on show.
  #reveal(date) {
    if (this.#isVisible(date)) return;
    const [first, last] = this.#shown;
    this.#turnTo(date < addMonths(this.#view, first) ? addMonths(date, -first) : addMonths(date, -last));
  }

  // Changes the first month laid out. The months on show slide out to one
  // side while the new ones slide in from the other, the way time runs: later
  // months come in from the right.
  #turnTo(view) {
    const before = this.#view;
    this.#view = view;
    if (reducedMotion.matches || !before || view === before) return;
    const months = this.query('.months');
    this.#ghost?.remove();
    months.getAnimations().forEach((animation) => animation.cancel());
    // A still copy of the old months, leaving while the real ones arrive. It
    // goes after them, so `.months` queries keep finding the real ones.
    const ghost = months.cloneNode(true);
    ghost.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    Object.assign(ghost, { inert: true, ariaHidden: 'true' });
    Object.assign(ghost.style, { position: 'absolute', top: `${months.offsetTop}px`, left: `${months.offsetLeft}px`, width: `${months.offsetWidth}px` });
    months.after(ghost);
    this.#ghost = ghost;
    const distance = (view > before ? 1 : -1) * (months.offsetWidth + 32);
    ghost.animate({ translate: ['0 0', `${-distance}px 0`], opacity: [1, 0] }, SLIDE).onfinish = () => {
      ghost.remove();
      if (this.#ghost === ghost) this.#ghost = null;
    };
    months.animate({ translate: [`${distance}px 0`, '0 0'], opacity: [0, 1] }, SLIDE);
  }

  #renderWeekdays() {
    // Any week will do for the names; 2023-01-01 was a Sunday.
    this.query('.months').querySelectorAll('.weekdays').forEach((row) =>
      [...row.children].forEach((cell, i) => {
        const day = addDays('2023-01-01', (i + this.weekStart) % 7);
        cell.textContent = formatDate(day, this.locale, { weekday: 'short' }).slice(0, 2);
        cell.ariaLabel = formatDate(day, this.locale, { weekday: 'long' });
      }),
    );
  }

  // Lays out the days of each month, then marks the range.
  #renderMonths() {
    const min = parseDate(this.min);
    const max = parseDate(this.max);
    this.query('.months').querySelectorAll('.month').forEach((month, m) => {
      const first = addMonths(this.#view, m);
      month.querySelector('.title').textContent = formatDate(first, this.locale, { month: 'long', year: 'numeric' });
      const offset = (weekday(first) - this.weekStart + 7) % 7;
      this.#days.slice(m * CELLS, (m + 1) * CELLS).forEach((button, k) => {
        const date = addDays(first, k - offset);
        const shown = sameMonth(date, first);
        button.hidden = !shown;
        button.dataset.date = shown ? date : '';
        if (!shown) return;
        button.textContent = Number(date.slice(8));
        button.ariaLabel = formatDate(date, this.locale, FULL);
        button.disabled = Boolean((min && date < min) || (max && date > max));
        button.ariaCurrent = date === today() ? 'date' : null;
      });
    });
    const [first, last] = this.#shown;
    this.query('[data-step="-1"]').disabled = Boolean(min && addMonths(this.#view, first) <= min);
    this.query('[data-step="1"]').disabled = Boolean(max && endOfMonth(addMonths(this.#view, last)) >= max);
    this.#paint();
  }

  // Marks the range, the preview while an end is being chosen, and focus.
  #paint() {
    const { start, end } = this.#draft;
    const to = end ?? (start && this.#hover) ?? start;
    const [low, high] = start ? [minDate(start, to), maxDate(start, to)] : [null, null];
    const focusable = this.#isVisible(this.#focus)
      ? this.#focus
      : this.#days.find((day) => day.dataset.date && !day.disabled && this.#isVisible(day.dataset.date))?.dataset.date;
    for (const button of this.#days) {
      const date = button.dataset.date;
      const inRange = Boolean(date && low && date >= low && date <= high);
      button.toggleAttribute('data-start', Boolean(date) && date === low);
      button.toggleAttribute('data-end', Boolean(date) && date === high);
      button.toggleAttribute('data-in-range', inRange);
      button.parentElement.ariaSelected = date ? String(inRange && Boolean(end || date === start)) : null;
      button.tabIndex = date && date === focusable ? 0 : -1;
    }
    // Each week's part of the range is one rounded band behind its days.
    for (const week of this.query('.months').querySelectorAll('.week')) {
      const columns = [...week.querySelectorAll('.day')].map((day, i) => (day.hasAttribute('data-in-range') ? i : -1)).filter((i) => i >= 0);
      const band = week.querySelector('.band');
      band.hidden = columns.length < 2;
      band.toggleAttribute('data-preview', Boolean(start && !end));
      if (columns.length < 2) continue;
      band.style.left = `calc(${columns[0]} * 100% / 7)`;
      band.style.width = `calc(${columns.at(-1) - columns[0] + 1} * 100% / 7)`;
    }
    this.#renderFooter();
  }

  #renderFooter() {
    const { start, end } = this.#draft;
    for (const [name, date] of Object.entries({ start, end })) {
      const box = this.query(`[data-field="${name}"]`);
      box.querySelector('.field-value').textContent = date ? formatDate(date, this.locale, SHORT) : '—';
    }
    // The field the next pick fills.
    this.query('[data-field="start"]').toggleAttribute('data-active', !start || Boolean(end));
    this.query('[data-field="end"]').toggleAttribute('data-active', Boolean(start && !end));
    const count = this.query('.count');
    const days = start && end ? daysInRange(start, end) : 0;
    count.hidden = !days;
    if (days) {
      roll(count.querySelector('.rolling'), String(days));
      count.querySelector('.unit').textContent = days === 1 ? 'day' : 'days';
    }
    const committed = this.#committed;
    const complete = Boolean(start && end) || (!start && !end);
    const changed = start !== committed.start || end !== committed.end;
    this.query('.apply').disabled = !complete || !changed;
    this.query('.clear').disabled = !start;
    const t = this.#clamp(today());
    this.shadowRoot.querySelectorAll('.preset').forEach((button) => {
      const [from, until] = PRESETS[button.dataset.preset].range(t).map((date) => this.#clamp(date));
      button.ariaPressed = String(from === start && until === end);
    });
  }

  #announce(text) {
    this.query('.announce').textContent = text;
  }

  #setDraft(start, end) {
    this.#draft = { start, end };
    this.#hover = null;
    this.#paint();
  }

  #setHover(date) {
    if (date === this.#hover) return;
    this.#hover = date;
    if (this.#draft.start && !this.#draft.end) this.#paint();
  }

  // The first pick starts a range; the second ends it, in either order.
  #pick(date) {
    const { start, end } = this.#draft;
    this.#focus = date;
    if (!start || end) {
      this.#setDraft(date, null);
      this.#announce(`Start ${formatDate(date, this.locale, SHORT)}. Pick an end date.`);
      return;
    }
    const [from, to] = [minDate(start, date), maxDate(start, date)];
    this.#setDraft(from, to);
    const days = daysInRange(from, to);
    this.#announce(`${formatDate(from, this.locale, SHORT)} to ${formatDate(to, this.locale, SHORT)}, ${days} ${days === 1 ? 'day' : 'days'}.`);
  }

  #preset(key) {
    if (!key) return;
    const [start, end] = PRESETS[key].range(this.#clamp(today())).map((date) => this.#clamp(date));
    this.#focus = end;
    this.#setDraft(start, end);
    this.#reveal(end);
    this.#renderMonths();
  }

  #apply() {
    const { start, end } = this.#draft;
    this.start = start;
    this.end = end;
    this.emit('change', { start, end });
  }

  #cancel() {
    const { start, end } = this.#committed;
    if (this.#draft.start === start && this.#draft.end === end) return;
    this.#setDraft(start, end);
    this.emit('cancel');
    this.#announce('Changes cancelled.');
  }

  #click(event) {
    const nav = event.target.closest('.nav');
    if (nav) {
      // A whole page of months at a time: two side by side, one when narrow.
      const [first, last] = this.#shown;
      const step = Number(nav.dataset.step) * (last - first + 1);
      this.#turnTo(addMonths(this.#view, step));
      this.#focus = this.#clamp(shiftMonths(this.#focus, step));
      this.#renderMonths();
      return;
    }
    const date = event.target.closest('.day')?.dataset.date;
    if (date) this.#pick(date);
  }

  // Moves keyboard focus to a day, turning the months to show it.
  #move(date) {
    const target = this.#clamp(date);
    this.#focus = target;
    if (this.#draft.start && !this.#draft.end) this.#hover = target;
    this.#reveal(target);
    this.#renderMonths();
    this.#days.find((day) => day.dataset.date === target)?.focus();
  }

  #key(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#cancel();
      return;
    }
    const date = event.target.closest('.day')?.dataset.date;
    if (!date) return;
    const column = (weekday(date) - this.weekStart + 7) % 7;
    const moves = {
      ArrowLeft: () => addDays(date, -1),
      ArrowRight: () => addDays(date, 1),
      ArrowUp: () => addDays(date, -7),
      ArrowDown: () => addDays(date, 7),
      PageUp: () => shiftMonths(date, -1),
      PageDown: () => shiftMonths(date, 1),
      Home: () => addDays(date, -column),
      End: () => addDays(date, 6 - column),
    };
    // Enter and Space pick through the button's own click.
    if (!(event.key in moves)) return;
    event.preventDefault();
    this.#move(moves[event.key]());
  }
}
