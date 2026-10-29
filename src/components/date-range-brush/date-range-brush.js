import { addDays, formatDate, today, weekday } from '../../core/dates.js';
import { LwElement } from '../../core/lw-element.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import styles from './date-range-brush.scss?inline';

const HISTORY = 120;
const QUICK = [7, 30, 90];
// The narrowest range the brush closes to, in days.
const MIN_DAYS = 2;

const SHORT = { month: 'short', day: 'numeric' };
const whole = new Intl.NumberFormat('en-US');
const perDay = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

// Made-up daily counts: busier on weekdays, growing over time, with spikes.
const demoCounts = (days) => {
  let seed = 11;
  const next = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296);
  const last = weekday(today());
  return Array.from({ length: days }, (_, i) => {
    const weekend = (((last - (days - 1 - i)) % 7) + 7) % 7 % 6 === 0;
    const base = 1 + (i / days) * 4 + next() * 4;
    const spike = next() > 0.96 ? 6 : 0;
    return Math.round(weekend ? base * 0.3 : base + spike);
  });
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * A range of days picked on the counts themselves: a bar a day, and a
 * brush over them. Drag its edges, drag the brush along, or draw a new one
 * on the chart; 7D, 30D and 90D jump to the last days. The total, the rate
 * and the busiest day follow, and the button hands the range over. The
 * edges are sliders for the arrow keys too, a week at a time with Shift.
 *
 * @attr {string} label
 * @attr {string} scope - After the label
 * @attr {string} noun - What is counted, plural
 * @attr {Array<number>} counts - One a day, oldest first, ending today (JSON)
 * @attr {number} days - The range's length when it first shows
 * @fires lw-change - The range was handed over; `detail: { start, end, total }`
 */
export class LwDateRangeBrush extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    label: { default: 'Builds' },
    scope: { default: 'main' },
    noun: { default: 'builds' },
    counts: { type: Object },
    days: { type: Number, default: 77 },
  };

  // The range as day indexes into the counts, both ends included.
  #from = 0;
  #to = 0;
  #drag = null;
  #demo = null;

  render() {
    return `<header class="head"><p class="title"><b class="label"></b> · <span class="scope"></span></p><div class="quick">${QUICK.map((days) => `<button class="quick-range" type="button" data-days="${days}">${days}D</button>`).join('')}</div></header>
<div class="card"><div class="top"><p class="range" aria-live="polite"></p><p class="total"><b class="rolling total-count" aria-hidden="true"></b><span class="visually-hidden total-text"></span> <span class="noun"></span></p></div><p class="rate"></p>
<div class="chart"><div class="bars" aria-hidden="true"></div><div class="brush"><span class="edge" data-edge="from" role="slider" tabindex="0" aria-label="First day"></span><span class="edge" data-edge="to" role="slider" tabindex="0" aria-label="Last day"></span></div></div><div class="axis" aria-hidden="true"></div>
<footer class="foot"><p class="help">Drag the edges, or draw a new range</p><lw-button class="show"></lw-button></footer></div><p class="busiest"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.quick').addEventListener('click', (event) => {
      const quick = event.target.closest('.quick-range');
      if (quick) this.#set(this.#data.length - Number(quick.dataset.days), this.#data.length - 1);
    }, options);
    this.#wireDrag(options);
    this.query('.brush').addEventListener('keydown', (event) => {
      const edge = event.target.closest('.edge')?.dataset.edge;
      const step = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[event.key];
      if (!edge || !step) return;
      event.preventDefault();
      const by = step * (event.shiftKey ? 7 : 1);
      if (edge === 'from') this.#set(this.#from + by, this.#to);
      else this.#set(this.#from, this.#to + by);
    }, options);
    this.query('.show').addEventListener('click', () => {
      const { start, end, total } = this.#summary;
      this.emit('change', { start, end, total });
    }, options);
  }

  updated(changed) {
    this.query('.label').textContent = this.label ?? '';
    this.query('.scope').textContent = this.scope ?? '';
    this.query('.noun').textContent = this.noun ?? '';
    if (changed.has('counts') || changed.has('days')) {
      this.#build();
      this.#set(this.#data.length - this.days, this.#data.length - 1);
    } else {
      this.#paint();
    }
  }

  get #data() {
    return this.counts?.length ? this.counts : (this.#demo ??= demoCounts(HISTORY));
  }

  #dateOf(index) {
    return addDays(today(), index - (this.#data.length - 1));
  }

  #build() {
    const data = this.#data;
    const max = Math.max(...data, 1);
    this.query('.bars').innerHTML = data.map((count) => `<span class="bar" style="height: ${Math.max(2, (count / max) * 100)}%"></span>`).join('');
    // A tick at each first of the month.
    let ticks = '';
    data.forEach((_, i) => {
      const date = this.#dateOf(i);
      if (date.endsWith('-01')) ticks += `<span style="left: ${(i / data.length) * 100}%">${formatDate(date, 'en-US', { month: 'short' })}</span>`;
    });
    this.query('.axis').innerHTML = ticks;
  }

  #set(from, to) {
    const last = this.#data.length - 1;
    [from, to] = from > to ? [to, from] : [from, to];
    this.#from = clamp(from, 0, last - MIN_DAYS + 1);
    this.#to = clamp(Math.max(to, this.#from + MIN_DAYS - 1), 0, last);
    this.#paint();
  }

  get #summary() {
    const counts = this.#data.slice(this.#from, this.#to + 1);
    const total = counts.reduce((sum, count) => sum + count, 0);
    const busiest = counts.indexOf(Math.max(...counts));
    return { start: this.#dateOf(this.#from), end: this.#dateOf(this.#to), days: counts.length, total, busiest: this.#from + busiest, most: counts[busiest] };
  }

  #paint() {
    const data = this.#data;
    const { start, end, days, total, busiest, most } = this.#summary;
    const share = (index) => `${(index / data.length) * 100}%`;
    const brush = this.query('.brush');
    brush.style.left = share(this.#from);
    brush.style.width = `calc(${share(this.#to + 1)} - ${share(this.#from)})`;
    this.query('.bars').querySelectorAll('.bar').forEach((bar, i) => bar.toggleAttribute('data-in', i >= this.#from && i <= this.#to));
    this.query('.range').textContent = `${formatDate(start, 'en-US', SHORT)} – ${formatDate(end, 'en-US', SHORT)}`;
    roll(this.query('.total-count'), whole.format(total));
    this.query('.total-text').textContent = whole.format(total);
    this.query('.rate').textContent = `${days} days · ${perDay.format(total / days)} a day`;
    this.query('.busiest').innerHTML = `Busiest day <b>${formatDate(this.#dateOf(busiest), 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</b> · ${whole.format(most)} ${this.noun}`;
    this.query('.show').textContent = `Show ${whole.format(total)} ${this.noun}`;
    for (const edge of this.shadowRoot.querySelectorAll('.edge')) {
      const index = edge.dataset.edge === 'from' ? this.#from : this.#to;
      edge.setAttribute('aria-valuemin', '0');
      edge.setAttribute('aria-valuemax', String(data.length - 1));
      edge.setAttribute('aria-valuenow', String(index));
      edge.setAttribute('aria-valuetext', formatDate(this.#dateOf(index), 'en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    }
    for (const quick of this.shadowRoot.querySelectorAll('.quick-range')) quick.ariaPressed = String(this.#to === data.length - 1 && days === Number(quick.dataset.days));
  }

  // Edges resize, the brush moves, and the bare chart draws a new range.
  #wireDrag(options) {
    const chart = this.query('.chart');
    const indexAt = (event) => {
      const rect = chart.getBoundingClientRect();
      return clamp(Math.floor(((event.clientX - rect.left) / rect.width) * this.#data.length), 0, this.#data.length - 1);
    };
    chart.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      chart.setPointerCapture(event.pointerId);
      const at = indexAt(event);
      const edge = event.target.closest('.edge')?.dataset.edge;
      if (edge) this.#drag = { mode: edge };
      else if (event.target.closest('.brush')) this.#drag = { mode: 'move', offset: at - this.#from, length: this.#to - this.#from };
      else {
        this.#drag = { mode: 'draw', anchor: at };
        this.#set(at, at + MIN_DAYS - 1);
      }
      this.toggleAttribute('data-dragging', true);
    }, options);
    chart.addEventListener('pointermove', (event) => {
      const drag = this.#drag;
      if (!drag) return;
      const at = indexAt(event);
      if (drag.mode === 'from') this.#set(Math.min(at, this.#to - MIN_DAYS + 1), this.#to);
      else if (drag.mode === 'to') this.#set(this.#from, Math.max(at, this.#from + MIN_DAYS - 1));
      else if (drag.mode === 'move') {
        const from = clamp(at - drag.offset, 0, this.#data.length - 1 - drag.length);
        this.#set(from, from + drag.length);
      } else this.#set(drag.anchor, at);
    }, options);
    for (const type of ['pointerup', 'pointercancel']) {
      chart.addEventListener(type, () => {
        this.#drag = null;
        this.removeAttribute('data-dragging');
      }, options);
    }
  }
}
