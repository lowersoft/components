import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import styles from './metric-card.scss?inline';

// The chart's drawing box; it stretches to the card's width.
const W = 400;
const H = 120;
const PAD_Y = 10;
// Every period is resampled to this many points, so one shape can morph
// into another.
const SAMPLES = 90;
const MORPH_MS = 420;
const DAY = 86_400_000;
// Pinned days pull the cursor in within this many px.
const SNAP_PX = 6;

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
const sum = (values) => values.reduce((total, value) => total + value, 0);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// Seeded, so the demo always draws the same chart.
const demoData = (days, end) => {
  let seed = 42;
  const random = () => {
    seed = (seed * 16_807) % 2_147_483_647;
    return seed / 2_147_483_647;
  };
  const last = Date.parse(`${end}T00:00:00Z`);
  let plans = 820;
  let usage = 380;
  return Array.from({ length: days }, (_, i) => {
    const t = last - (days - 1 - i) * DAY;
    const weekday = new Date(t).getUTCDay();
    const weekend = weekday === 0 || weekday === 6;
    plans += 1.6 + (random() - 0.5) * 9;
    // New pricing lifts plans for good.
    if (i === days - 12) plans *= 1.09;
    usage += 0.9 + (random() - 0.5) * 14;
    const promo = i >= days - 27 && i <= days - 22;
    const services = 150 * (promo ? 2.1 : 1) * (0.7 + random() * 0.6);
    return {
      date: new Date(t).toISOString().slice(0, 10),
      parts: [Math.round(plans * (0.97 + random() * 0.06)), Math.round(usage * (weekend ? 0.72 : 1) * (0.9 + random() * 0.2)), Math.round(services * (weekend ? 0.5 : 1))],
    };
  });
};

const DEMO_DATA = demoData(180, '2026-10-14');
const DEMO_EVENTS = [
  { date: DEMO_DATA[180 - 27].date, label: 'Fall promo' },
  { date: DEMO_DATA[180 - 12].date, label: 'New pricing' },
];

const formatDay = (date) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
const formatShort = (date) => new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

// A linear resample of `values` to `count` evenly spaced points.
const resample = (values, count) =>
  Array.from({ length: count }, (_, i) => {
    const at = (i / (count - 1)) * (values.length - 1);
    const lo = Math.floor(at);
    const hi = Math.min(values.length - 1, lo + 1);
    return values[lo] + (values[hi] - values[lo]) * (at - lo);
  });

const yOf = (height) => PAD_Y + (1 - height) * (H - PAD_Y * 2);

// Heights 0 to 1 as an SVG path, smoothed with a Catmull-Rom spline.
const toPath = (heights) => {
  const pts = heights.map((h, i) => [(i / (heights.length - 1)) * W, yOf(h)]);
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const [p1, p2] = [pts[i], pts[i + 1]];
    const p3 = pts[i + 2] ?? p2;
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(2)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(2)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(2)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
};

// The line closed down to the baseline.
const toArea = (line) => `${line}L${W} ${H}L0 ${H}Z`;

// One period's numbers and shape, for the whole metric or one segment.
const buildPeriod = (data, days, focus) => {
  const current = data.slice(-days);
  const previous = data.slice(-days * 2, -days);
  const pick = (point) => (focus === null ? sum(point.parts) : (point.parts[focus] ?? 0));
  const now = current.map(pick);
  const before = previous.map(pick);
  const all = [...now, ...before];
  const lo = Math.min(...all) * 0.85;
  const hi = Math.max(...all) * 1.04;
  const norm = (value) => (value - lo) / (hi - lo || 1);
  return {
    current,
    previous,
    now,
    before,
    norm,
    // Resampled to a common length for morphing between views.
    shape: { current: resample(now.map(norm), SAMPLES), previous: resample(before.map(norm), SAMPLES) },
    // Drawn through the real days once it lands, so the dots sit on it.
    paths: { current: toPath(now.map(norm)), previous: toPath(before.map(norm)) },
  };
};

const total = (values, span) => sum(span ? values.slice(span.lo, span.hi + 1) : values);

/**
 * A metric with its chart: the total for the period and the change against
 * the previous one, with the previous period dashed behind. Hover or use
 * the arrow keys to read one day against its twin, drag (or hold Shift) to
 * read a range, and pick a part of the breakdown to chart it alone. Days
 * with a note are pinned on the chart.
 *
 * Data is daily `{ date, parts }`, oldest first, with one value per segment
 * and twice the longest period, so each period has one to compare with.
 * Events are `{ date, label }`.
 *
 * @attr {string} label
 * @attr {Array<string>} segments - Names of the parts that add up to the metric (JSON)
 * @attr {Array<object>} data - Daily values (JSON)
 * @attr {Array<object>} events - Days worth a note (JSON)
 * @attr {Array<number>} periods - The periods to choose from, in days (JSON)
 * @attr {number} period - The period shown, in days
 * @attr {'currency'|'number'} format
 * @attr {string} currency - ISO code for `currency` format
 * @fires lw-change - A period or a segment was chosen; `detail: { period, segment }`
 * @cssprop --lw-metric-card-note - Colour of the pinned notes
 */
export class LwMetricCard extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    label: { default: 'Revenue' },
    segments: { type: Object, default: ['Plans', 'Usage', 'Services'] },
    data: { type: Object, default: DEMO_DATA },
    events: { type: Object, default: DEMO_EVENTS },
    periods: { type: Object, default: [7, 30, 90] },
    period: { type: Number, default: 30 },
    format: { default: 'currency' },
    currency: { default: 'USD' },
  };

  #focus = null;
  // The day under the pointer or keyboard cursor, and a pinned range.
  #cursor = null;
  #range = null;
  #drag = null;
  #info = null;
  #shown = null;
  #morph = 0;

  render() {
    return `<div class="top"><p class="label"><span class="name"></span><span class="segment"></span></p><div class="periods"><span class="pill" aria-hidden="true"></span></div></div>
<p class="value"><span class="visually-hidden spoken"></span><span class="rolling" aria-hidden="true"></span></p>
<div class="change"><span class="delta"></span><span class="caption" aria-live="polite"></span><button class="clear" type="button" hidden>Clear</button></div>
<div class="chart" role="slider" tabindex="0" aria-valuemin="1">
  <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id="lit"><rect y="-10" height="${H + 20}"/></clipPath></defs><line class="base" x1="0" x2="${W}" y1="${H - 0.5}" y2="${H - 0.5}" vector-effect="non-scaling-stroke"/><path class="previous" vector-effect="non-scaling-stroke"/><path class="area" clip-path="url(#lit)"/><path class="dim" vector-effect="non-scaling-stroke"/><path class="line" clip-path="url(#lit)" vector-effect="non-scaling-stroke"/></svg>
  <div class="pins"></div><div class="marks"></div><span class="end" aria-hidden="true"></span>
</div>
<div class="axis"><span class="first"></span><span class="legend"><span class="dash"></span>Previous period</span><span class="last"></span></div>
<div class="breakdown"><div class="bar" aria-hidden="true"></div><ul class="parts"></ul></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const chart = this.query('.chart');
    chart.addEventListener('pointerdown', (event) => this.#down(event), options);
    chart.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) chart.addEventListener(type, (event) => this.#release(event), options);
    chart.addEventListener('pointerleave', () => this.#drag === null && !this.#range && this.#read(null, null), options);
    chart.addEventListener('keydown', (event) => this.#key(event), options);
    chart.addEventListener('blur', () => this.#read(this.#range, null), options);
    this.query('.periods').addEventListener('click', (event) => this.#choosePeriod(event), options);
    this.query('.parts').addEventListener('click', (event) => this.#chooseSegment(event), options);
    this.query('.clear').addEventListener('click', () => this.#read(null, null), options);
    this.signal.addEventListener('abort', () => {
      cancelAnimationFrame(this.#morph);
      this.#morph = 0;
    });
  }

  updated(changed) {
    if (changed.has('periods')) {
      const pill = this.query('.pill');
      this.query('.periods').replaceChildren(pill, ...this.periods.map((days) => Object.assign(document.createElement('button'), { type: 'button', textContent: `${days}D`, value: days })));
    }
    if (changed.has('segments')) {
      this.#focus = null;
      this.query('.bar').innerHTML = this.segments.map(() => '<span></span>').join('');
      this.query('.parts').innerHTML = this.segments.map((name, i) => `<li><button type="button" data-index="${i}"><span class="swatch"></span><span class="part-name">${escapeHtml(name)}</span><span class="amount"></span><span class="share"></span></button></li>`).join('');
    }
    if (['data', 'period', 'segments', 'periods'].some((name) => changed.has(name))) {
      this.#cursor = this.#range = null;
      this.#rebuild();
    }
    this.#paint();
  }

  get #money() {
    return new Intl.NumberFormat('en-US', { style: this.format === 'currency' ? 'currency' : 'decimal', currency: this.currency, maximumFractionDigits: 0 });
  }

  get #last() {
    return this.#info.current.length - 1;
  }

  // ---- The lines ----

  // A new period or segment morphs the lines from where they are now.
  #rebuild() {
    this.#info = buildPeriod(this.data, this.period, this.#focus);
    const from = this.#shown;
    const to = this.#info.shape;
    const paths = this.#info.paths;
    cancelAnimationFrame(this.#morph);
    if (!from || reducedMotion.matches) {
      this.#shown = to;
      this.#drawPaths(paths);
      return;
    }
    const start = performance.now();
    const frame = (now) => {
      const t = easeInOut(Math.min(1, (now - start) / MORPH_MS));
      const mix = (a, b) => a.map((v, i) => v + (b[i] - v) * t);
      this.#shown = { current: mix(from.current, to.current), previous: mix(from.previous, to.previous) };
      if (t < 1) {
        this.#drawPaths({ current: toPath(this.#shown.current), previous: toPath(this.#shown.previous) });
        this.#morph = requestAnimationFrame(frame);
      } else {
        this.#morph = 0;
        this.#shown = to;
        this.#drawPaths(paths);
      }
    };
    this.#morph = requestAnimationFrame(frame);
  }

  #drawPaths({ current, previous }) {
    this.query('.line').setAttribute('d', current);
    this.query('.dim').setAttribute('d', current);
    this.query('.area').setAttribute('d', toArea(current));
    this.query('.previous').setAttribute('d', previous);
  }

  // ---- Reading ----

  #read(range, cursor) {
    this.#range = range;
    this.#cursor = cursor;
    this.#paint();
  }

  // A range once the drag covers two days or more, else the cursor's day.
  get #span() {
    const range = this.#range;
    if (range && range.a !== range.b) return { span: { lo: Math.min(range.a, range.b), hi: Math.max(range.a, range.b) }, ranged: true };
    if (this.#cursor !== null && this.#cursor <= this.#last) return { span: { lo: this.#cursor, hi: this.#cursor }, ranged: false };
    return { span: null, ranged: false };
  }

  get #pinned() {
    return this.events.map((event) => ({ ...event, at: this.#info.current.findIndex(({ date }) => date === event.date) })).filter(({ at }) => at >= 0);
  }

  #paint() {
    const info = this.#info;
    if (!info) return;
    const money = this.#money;
    const last = this.#last;
    const { span, ranged } = this.#span;
    const day = span && !ranged ? info.current[span.lo] : undefined;
    const twin = span && !ranged ? info.previous[span.lo] : undefined;
    const value = total(info.now, span);
    const compare = total(info.before, span);
    const delta = compare ? (value - compare) / compare : 0;
    const note = day ? this.events.find(({ date }) => date === day.date) : undefined;
    let caption = `vs previous ${this.period} days`;
    if (ranged) caption = `${formatShort(info.current[span.lo].date)} – ${formatShort(info.current[span.hi].date)} vs prior ${span.hi - span.lo + 1} days`;
    else if (day) caption = `${formatDay(day.date)} vs ${formatShort(twin?.date ?? day.date)}`;
    const formatted = money.format(value);

    this.query('.name').textContent = this.label ?? '';
    this.query('.segment').textContent = this.#focus === null ? '' : ` · ${this.segments[this.#focus]}`;
    // One pill slides between the periods.
    const buttons = [...this.query('.periods').querySelectorAll('button')];
    buttons.forEach((button) => (button.ariaPressed = String(Number(button.value) === this.period)));
    this.query('.pill').style.translate = `${Math.max(0, this.periods.indexOf(this.period)) * 100}% 0`;
    this.query('.spoken').textContent = formatted;
    roll(this.query('.value .rolling'), formatted);
    const deltaEl = this.query('.delta');
    deltaEl.textContent = `${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta * 100).toFixed(1)}%`;
    deltaEl.toggleAttribute('data-down', delta < 0);
    this.query('.caption').innerHTML = `${escapeHtml(caption)}${note ? `<span class="note"> · ${escapeHtml(note.label)}</span>` : ''}`;
    this.query('.clear').hidden = !ranged;

    // The chart: the lit part of the line, pins, marks and the read dots.
    const xOf = (i) => (last ? (i / last) * W : W);
    const pct = (i) => (xOf(i) / W) * 100;
    const top = (v) => `${(yOf(info.norm(v)) / H) * 100}%`;
    const litFrom = ranged ? xOf(span.lo) : 0;
    const litTo = span ? xOf(span.hi) : W;
    const rect = this.query('#lit rect');
    rect.setAttribute('x', litFrom);
    rect.setAttribute('width', Math.max(0, litTo - litFrom));
    this.query('.pins').innerHTML = this.#pinned.map(({ at }) => `<span class="pin" style="left: ${pct(at)}%"></span>`).join('');
    let marks = '';
    if (ranged) marks = [span.lo, span.hi].map((i) => `<span class="edge" style="left: ${pct(i)}%"></span>`).join('');
    else if (day) {
      marks = `<span class="guide" style="left: ${pct(span.lo)}%"></span>${twin ? `<span class="twin" style="left: ${pct(span.lo)}%; top: ${top(info.before[span.lo])}"></span>` : ''}<span class="dot" style="left: ${pct(span.lo)}%; top: ${top(info.now[span.lo])}"></span>`;
    }
    this.query('.marks').innerHTML = marks;
    // Today, at rest; it rides the morph to the new end.
    const end = this.query('.end');
    end.style.top = info.now.length ? top(info.now[last]) : '0';
    end.toggleAttribute('data-hidden', Boolean(span));
    const chart = this.query('.chart');
    let valueText = `${formatted} in total`;
    if (ranged) valueText = `${caption}: ${formatted}`;
    else if (day) valueText = `${formatDay(day.date)}: ${formatted}${note ? `, ${note.label}` : ''}`;
    chart.ariaLabel = `${this.label} over the last ${this.period} days. Arrow keys read each day; hold Shift to select a range.`;
    chart.ariaValueMax = String(info.current.length);
    chart.ariaValueNow = String(span ? span.hi + 1 : info.current.length);
    chart.ariaValueText = valueText;
    this.query('.first').textContent = info.current[0] ? formatShort(info.current[0].date) : '';
    this.query('.last').textContent = info.current.at(-1) ? formatShort(info.current.at(-1).date) : '';
    this.#paintBreakdown(span, money);
  }

  // Each segment's share of what the card reads; the charted one takes the
  // ink, so its swatch matches the line.
  #paintBreakdown(span, money) {
    const parts = new Array(this.segments.length).fill(0);
    const days = span ? this.#info.current.slice(span.lo, span.hi + 1) : this.#info.current;
    for (const point of days) parts.forEach((_, i) => (parts[i] += point.parts[i] ?? 0));
    const partsTotal = sum(parts);
    const tone = (i) => (this.#focus === i ? 0 : i % 4);
    [...this.query('.bar').children].forEach((bar, i) => {
      bar.style.flexGrow = String(parts[i]);
      bar.dataset.tone = tone(i);
      bar.toggleAttribute('data-faded', this.#focus !== null && this.#focus !== i);
    });
    this.shadowRoot.querySelectorAll('.parts button').forEach((button, i) => {
      button.querySelector('.swatch').dataset.tone = tone(i);
      button.querySelector('.amount').textContent = money.format(parts[i]);
      button.querySelector('.share').textContent = `${(partsTotal ? (parts[i] / partsTotal) * 100 : 0).toFixed(0)}%`;
      button.ariaPressed = String(this.#focus === i);
      button.ariaLabel = this.#focus === i ? `Show all of ${this.label}` : `Show only ${this.segments[i]}`;
      button.toggleAttribute('data-faded', this.#focus !== null && this.#focus !== i);
    });
  }

  // ---- Input ----

  #choosePeriod(event) {
    const button = event.target.closest('button');
    if (!button || Number(button.value) === this.period) return;
    this.period = Number(button.value);
    this.emit('change', { period: this.period, segment: this.#focus });
  }

  #chooseSegment(event) {
    const button = event.target.closest('button');
    if (!button) return;
    const index = Number(button.dataset.index);
    this.#focus = this.#focus === index ? null : index;
    this.#rebuild();
    this.#paint();
    this.emit('change', { period: this.period, segment: this.#focus });
  }

  #indexAt(clientX) {
    const rect = this.query('.chart').getBoundingClientRect();
    const last = this.#last;
    const t = clamp((clientX - rect.left) / rect.width, 0, 1);
    // Pinned days pull the cursor in, so their notes are easy to land on.
    const near = this.#pinned.find(({ at }) => Math.abs((at / (last || 1) - t) * rect.width) < SNAP_PX);
    return near ? near.at : Math.round(t * last);
  }

  #down(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const at = this.#indexAt(event.clientX);
    this.#drag = at;
    this.#read(null, at);
  }

  #move(event) {
    const at = this.#indexAt(event.clientX);
    if (this.#drag !== null) {
      // Dragging past the first day turns the read into a range.
      const anchor = this.#drag;
      this.#read(this.#range || at !== anchor ? { a: anchor, b: at } : null, at);
    } else if (event.pointerType === 'mouse' && !this.#range) {
      // A mouse reads on hover; touch only while pressed.
      this.#read(null, at);
    }
  }

  #release(event) {
    if (this.#drag === null) return;
    this.#drag = null;
    if (event.pointerType !== 'mouse') this.#read(this.#range, null);
  }

  // The arrow keys walk the days; with Shift they stretch a range.
  #key(event) {
    if (event.key === 'Escape') {
      this.#read(null, null);
      return;
    }
    const last = this.#last;
    const move = { ArrowLeft: -1, ArrowRight: 1, Home: -last, End: last }[event.key];
    if (move === undefined) return;
    event.preventDefault();
    const from = this.#range ? this.#range.b : (this.#cursor ?? last);
    const to = clamp(from + move, 0, last);
    this.#read(event.shiftKey ? { a: this.#range ? this.#range.a : from, b: to } : null, to);
  }
}
