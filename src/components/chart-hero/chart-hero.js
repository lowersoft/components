import { heroActions, paintHeroText } from '../../core/hero.js';
import { moveHighlight } from '../../core/highlight.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import styles from './chart-hero.scss?inline';

const RANGES = [
  { id: '7D', days: 7 },
  { id: '30D', days: 30 },
  { id: '90D', days: 90 },
  { id: '1Y', days: 365 },
];
// Every range is drawn with this many points, so one morphs into another.
const POINTS = 120;
const MORPH_MS = 650;
// Sessions per daily user, for the sessions figure.
const SESSIONS_PER_USER = 2.4;
const DAY_MS = 86_400_000;
const END = Date.UTC(2026, 9, 15);
// The demo's launch: the day, the jump and what the pinned note says.
const LAUNCH_DAYS_AGO = 13;
const LAUNCH = { title: 'Released 0.9', jump: 0.34 };

const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const whole = new Intl.NumberFormat('en-US');
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 });
const ease = (t) => 1 - (1 - t) ** 3;

// A year of daily users: steady growth, a weekly rhythm, some noise, and a
// launch that jumps a third in a day and settles back down. The same every time.
const demoYear = () => {
  let seed = 11;
  const random = () => {
    seed = (seed * 16_807) % 2_147_483_647;
    return seed / 2_147_483_647;
  };
  return Array.from({ length: 365 }, (_, i) => {
    const t = i / 364;
    const trend = 24_000 + 14_000 * t ** 1.6;
    const week = Math.sin((i / 7) * Math.PI * 2) * 1_200;
    const wave = Math.sin(i / 9) * 1_600;
    const daysAfter = i - (364 - LAUNCH_DAYS_AGO);
    const launch = daysAfter >= 0 ? trend * LAUNCH.jump * Math.exp(-daysAfter / 2.2) : 0;
    return Math.round(trend + week + wave + (random() - 0.5) * 1_800 + launch);
  });
};

// Resamples a series to `POINTS` values by straight lines between days.
const resample = (values) =>
  Array.from({ length: POINTS }, (_, i) => {
    const at = (i / (POINTS - 1)) * (values.length - 1);
    const lo = Math.floor(at);
    const hi = Math.min(values.length - 1, lo + 1);
    return values[lo] + (values[hi] - values[lo]) * (at - lo);
  });

// A smooth path through points (Catmull-Rom as cubic Béziers).
const smooth = (points) =>
  points.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x.toFixed(1)} ${y.toFixed(1)}`;
    const [x0, y0] = points[i - 2] ?? points[i - 1];
    const [x1, y1] = points[i - 1];
    const [x3, y3] = points[i + 1] ?? [x, y];
    return `${d} C${(x1 + (x - x0) / 6).toFixed(1)} ${(y1 + (y - y0) / 6).toFixed(1)} ${(x - (x3 - x1) / 6).toFixed(1)} ${(y - (y3 - y1) / 6).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }, '');

// Two round gridline values inside a range.
const gridlines = (lo, hi) => {
  const step = 10 ** Math.floor(Math.log10((hi - lo) / 2));
  const nice = [1, 2, 5, 10].map((m) => m * step).find((s) => (hi - lo) / s <= 4);
  const lines = [];
  for (let v = Math.ceil(lo / nice) * nice; v <= hi; v += nice) lines.push(v);
  return lines.slice(-2);
};

/**
 * An analytics hero where the chart is the hero: a full-bleed line of daily
 * users under the headline. Scrub it with the pointer or the arrow keys to
 * read any day; the range tabs morph the line from one span to the next,
 * and the KPIs follow. A pinned note marks the day a release moved the line.
 *
 * `series` is daily values, oldest first, ending on `end` (an ISO date).
 *
 * @attr {string} brand - The default eyebrow
 * @attr {string} heading
 * @attr {string} description
 * @attr {Array<number>} series - Daily users (JSON)
 * @attr {string} end - The last day, e.g. "2026-10-15"
 * @attr {string} range - `7D`, `30D`, `90D` or `1Y`
 * @attr {object} note - The pinned note: `{ daysAgo, title }` (JSON)
 * @fires lw-change - The range changed; `detail: { range }`
 * @slot eyebrow - A small line above the heading; the brand by default
 * @slot actions - Calls to action under the description; two by default
 */
export class LwChartHero extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    brand: { default: 'lower Insights' },
    heading: { default: 'Watch every release land.' },
    description: { default: 'Installs of lower, day by day. Scrub any day, compare any range, and see exactly which release moved the line.' },
    series: { type: Object, default: demoYear() },
    end: { default: new Date(END).toISOString().slice(0, 10) },
    range: { default: '90D' },
    note: { type: Object, default: { daysAgo: LAUNCH_DAYS_AGO, title: LAUNCH.title } },
  };

  // What is drawn: values and scale, eased towards the range's.
  #shown = null;
  #width = 0;
  #height = 0;
  #morph = 0;
  #scrub = -1;

  render() {
    return `<div class="chart"><svg class="plot" aria-hidden="true"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="area-top"/><stop offset="1" class="area-bottom"/></linearGradient></defs><path class="area"/><path class="line"/><line class="cross"/><circle class="cross-dot" r="4"/><circle class="note-dot" r="4"/></svg>
<div class="ticks" aria-hidden="true"></div><div class="note" aria-hidden="true"><p class="note-title"></p><p class="note-meta"></p></div><div class="tip" aria-hidden="true"></div>
<div class="scrub" tabindex="0" role="slider" aria-label="Daily installs" aria-valuemin="0" aria-valuemax="${POINTS - 1}"></div></div>
<div class="container"><div class="copy"><slot name="eyebrow"><p class="brand"></p></slot><h1 class="title"></h1><p class="description"></p>${heroActions('Install lower', 'Read the changelog')}</div>
<div class="side"><dl class="kpis"><div><dt>Avg. daily installs</dt><dd class="kpi-users rolling"></dd></div><div><dt>Builds</dt><dd class="kpi-sessions rolling"></dd></div><div><dt>Growth</dt><dd class="kpi-growth rolling"></dd></div></dl>
<div class="tabs" role="radiogroup" aria-label="Range"><span class="highlight"></span>${RANGES.map((range) => `<button class="tab" type="button" role="radio" data-range="${range.id}">${range.id}</button>`).join('')}</div></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const resize = new ResizeObserver(() => this.#resize());
    resize.observe(this.query('.chart'));
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      cancelAnimationFrame(this.#morph);
    });
    const tabs = this.query('.tabs');
    tabs.addEventListener('click', (event) => {
      const tab = event.target.closest('.tab');
      if (tab) this.#setRange(tab.dataset.range);
    }, options);
    tabs.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const index = RANGES.findIndex((range) => range.id === this.range);
      const next = RANGES[(index + step + RANGES.length) % RANGES.length].id;
      this.#setRange(next);
      this.query(`.tab[data-range="${next}"]`).focus();
    }, options);
    const scrub = this.query('.scrub');
    scrub.addEventListener('pointermove', (event) => this.#scrubAt(event), options);
    scrub.addEventListener('pointerleave', () => this.#setScrub(-1), options);
    scrub.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1, Home: -POINTS, End: POINTS }[event.key];
      if (step === undefined) return;
      event.preventDefault();
      this.#setScrub(Math.min(POINTS - 1, Math.max(0, (this.#scrub < 0 ? POINTS - 1 : this.#scrub) + step * (event.shiftKey ? 10 : 1))));
    }, options);
    scrub.addEventListener('blur', () => this.#setScrub(-1), options);
  }

  updated(changed) {
    paintHeroText(this);
    this.query('.brand').textContent = this.brand ?? '';
    if (changed.has('range') || changed.has('series') || changed.has('end')) this.#retarget(!changed.has('series') && Boolean(this.#shown));
  }

  get #days() {
    return RANGES.find((range) => range.id === this.range)?.days ?? 90;
  }

  // The days the range covers, oldest first.
  get #slice() {
    return this.series.slice(-this.#days);
  }

  #dayOf(index) {
    const days = this.#slice.length;
    const day = Math.round((index / (POINTS - 1)) * (days - 1));
    return new Date(Date.parse(this.end) - (days - 1 - day) * DAY_MS);
  }

  // Moves what is drawn towards the range, easing unless told not to.
  #retarget(animate) {
    const slice = this.#slice;
    const values = resample(slice);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const pad = (hi - lo) * 0.12 || 1;
    const target = { values, lo: lo - pad, hi: hi + pad };
    this.#paintControls(slice);
    cancelAnimationFrame(this.#morph);
    if (!animate || !this.#shown || reducedMotion.matches) {
      this.#shown = target;
      this.#draw();
      return;
    }
    const from = this.#shown;
    const start = performance.now();
    const step = (now) => {
      const t = ease(Math.min(1, (now - start) / MORPH_MS));
      const mix = (a, b) => a + (b - a) * t;
      this.#shown = { values: from.values.map((v, i) => mix(v, target.values[i])), lo: mix(from.lo, target.lo), hi: mix(from.hi, target.hi) };
      this.#draw();
      if (t < 1) this.#morph = requestAnimationFrame(step);
    };
    this.#morph = requestAnimationFrame(step);
  }

  #paintControls(slice) {
    for (const tab of this.shadowRoot.querySelectorAll('.tab')) {
      const on = tab.dataset.range === this.range;
      tab.ariaChecked = String(on);
      tab.tabIndex = on ? 0 : -1;
    }
    requestAnimationFrame(() => moveHighlight(this.query('.tabs .highlight'), this.query('.tab[aria-checked="true"]')));
    // The KPIs for the range: average users, sessions and growth week on week.
    const average = slice.reduce((sum, v) => sum + v, 0) / slice.length;
    const week = Math.min(7, Math.max(1, Math.floor(slice.length / 4)));
    const mean = (values) => values.reduce((sum, v) => sum + v, 0) / values.length;
    const growth = (mean(slice.slice(-week)) / mean(slice.slice(0, week)) - 1) * 100;
    roll(this.query('.kpi-users'), whole.format(Math.round(average)));
    roll(this.query('.kpi-sessions'), compact.format(average * slice.length * SESSIONS_PER_USER));
    roll(this.query('.kpi-growth'), `${growth >= 0 ? '+' : '−'}${Math.abs(growth).toFixed(1)}%`);
  }

  #resize() {
    const chart = this.query('.chart');
    this.#width = chart.clientWidth;
    this.#height = chart.clientHeight;
    this.query('.plot').setAttribute('viewBox', `0 0 ${this.#width} ${this.#height}`);
    this.#draw();
  }

  #point(index, value) {
    const { lo, hi } = this.#shown;
    // A little room at the top for the note above its peak.
    const top = this.#height * 0.12;
    return [(index / (POINTS - 1)) * this.#width, top + (1 - (value - lo) / (hi - lo)) * (this.#height - top)];
  }

  #draw() {
    if (!this.#shown || !this.#width) return;
    const points = this.#shown.values.map((value, i) => this.#point(i, value));
    const line = smooth(points);
    this.query('.line').setAttribute('d', line);
    this.query('.area').setAttribute('d', `${line} L${this.#width} ${this.#height} L0 ${this.#height} Z`);
    this.query('.ticks').innerHTML = gridlines(this.#shown.lo, this.#shown.hi)
      .map((value) => `<span style="top: ${this.#point(0, value)[1].toFixed(1)}px">${compact.format(value).toLowerCase()}</span>`)
      .join('');
    this.#paintNote();
    this.#setScrub(this.#scrub);
  }

  // The pinned note, at its day's point, when the range holds that day.
  #paintNote() {
    const note = this.query('.note');
    const dot = this.query('.note-dot');
    const days = this.#slice.length;
    const ago = this.note?.daysAgo;
    const shown = ago !== undefined && ago < days - 1;
    note.toggleAttribute('data-shown', shown);
    dot.toggleAttribute('data-shown', shown);
    if (!shown) return;
    const index = ((days - 1 - ago) / (days - 1)) * (POINTS - 1);
    const lo = Math.floor(index);
    const value = this.#shown.values[lo] + (this.#shown.values[Math.min(POINTS - 1, lo + 1)] - this.#shown.values[lo]) * (index - lo);
    const [x, y] = this.#point(index, value);
    dot.setAttribute('cx', x.toFixed(1));
    dot.setAttribute('cy', y.toFixed(1));
    note.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    const slice = this.#slice;
    const day = days - 1 - ago;
    const jump = slice[day - 1] ? (slice[day] / slice[day - 1] - 1) * 100 : 0;
    this.query('.note-title').textContent = this.note.title ?? '';
    this.query('.note-meta').textContent = `${date.format(new Date(Date.parse(this.end) - ago * DAY_MS))} · ${jump >= 0 ? '+' : '−'}${Math.abs(jump).toFixed(1)}% in a day`;
  }

  #scrubAt(event) {
    const box = this.query('.scrub').getBoundingClientRect();
    if (!box.width) return;
    this.#setScrub(Math.min(POINTS - 1, Math.max(0, Math.round(((event.clientX - box.left) / box.width) * (POINTS - 1)))));
  }

  // The crosshair and its reading for one point, or none.
  #setScrub(index) {
    this.#scrub = index;
    const on = index >= 0 && this.#shown;
    this.toggleAttribute('data-scrubbing', Boolean(on));
    const scrub = this.query('.scrub');
    if (!on) {
      scrub.removeAttribute('aria-valuetext');
      return;
    }
    const value = this.#shown.values[index];
    const [x, y] = this.#point(index, value);
    const cross = this.query('.cross');
    cross.setAttribute('x1', x.toFixed(1));
    cross.setAttribute('x2', x.toFixed(1));
    cross.setAttribute('y1', '0');
    cross.setAttribute('y2', String(this.#height));
    const dot = this.query('.cross-dot');
    dot.setAttribute('cx', x.toFixed(1));
    dot.setAttribute('cy', y.toFixed(1));
    const text = `${date.format(this.#dayOf(index))} · ${whole.format(Math.round(value))} installs`;
    const tip = this.query('.tip');
    tip.textContent = text;
    // The reading flips to the left of the line near the right edge.
    tip.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    tip.toggleAttribute('data-left', x > this.#width - 200);
    scrub.ariaValueNow = String(index);
    scrub.ariaValueText = text;
  }

  #setRange(range) {
    if (range === this.range) return;
    this.range = range;
    this.emit('change', { range });
  }
}
