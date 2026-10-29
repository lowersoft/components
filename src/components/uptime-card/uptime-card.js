import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { circleCheck, triangleAlert, x } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './uptime-card.scss?inline';

// How much wider the bar under the pointer gets, and how far the swell
// spreads, in bars.
const MAGNIFY = 5;
const SPREAD = 2.4;
// Bars ease toward their width at this rate, per second.
const EASE = 18;
const DAY = 86_400_000;
const STATUS_TEXT = { up: 'Operational', degraded: 'Degraded', down: 'Outage', none: 'No data' };

const DEMO_SERVICES = [
  {
    name: 'API',
    incidents: {
      19: {
        title: 'Elevated error rates on writes',
        status: 'degraded',
        minutes: 18,
        updates: [
          { time: '14:02', label: 'Investigating', note: '5xx on POST rose to 2%.' },
          { time: '14:11', label: 'Identified', note: 'A bad config push to one region.' },
          { time: '14:20', label: 'Resolved', note: 'Rolled back; error rates normal.' },
        ],
      },
      84: {
        title: 'Slow responses in eu-west',
        status: 'degraded',
        minutes: 23,
        updates: [
          { time: '09:41', label: 'Investigating', note: 'p95 latency up 3x in eu-west.' },
          { time: '09:52', label: 'Monitoring', note: 'Added capacity to the pool.' },
          { time: '10:04', label: 'Resolved' },
        ],
      },
    },
  },
  {
    name: 'Dashboard',
    incidents: {
      43: {
        title: 'Charts failed to load',
        status: 'degraded',
        minutes: 12,
        updates: [
          { time: '18:30', label: 'Investigating' },
          { time: '18:42', label: 'Resolved', note: 'A CDN cache rule was reverted.' },
        ],
      },
    },
  },
  {
    name: 'Webhooks',
    incidents: {
      69: {
        title: 'Deliveries delayed',
        status: 'down',
        minutes: 48,
        updates: [
          { time: '02:15', label: 'Investigating', note: 'The delivery queue stopped draining.' },
          { time: '02:38', label: 'Identified', note: 'A worker deploy failed health checks.' },
          { time: '03:03', label: 'Resolved', note: 'Backlog delivered in order.' },
        ],
      },
    },
  },
  {
    name: 'Database',
    missing: 6,
    incidents: {
      27: {
        title: 'Failover to replica',
        status: 'down',
        minutes: 9,
        updates: [
          { time: '22:07', label: 'Investigating', note: 'Primary stopped accepting writes.' },
          { time: '22:16', label: 'Resolved', note: 'Promoted the replica; no data lost.' },
        ],
      },
    },
  },
];

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
const formatDay = (ms) => new Date(ms).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
const statusOf = (service, day) => (day < (service.missing ?? 0) ? 'none' : (service.incidents?.[day]?.status ?? 'up'));

// Downtime counts in full, degraded time at half.
const uptimeOf = (service, days) => {
  const lost = Object.values(service.incidents ?? {}).reduce((sum, { minutes, status }) => sum + minutes * (status === 'down' ? 1 : 0.5), 0);
  return 100 * (1 - lost / ((days - (service.missing ?? 0)) * 1440));
};

// Target widths: a swell around the focus, flat without one.
const swell = (count, focus, out) => {
  for (let i = 0; i < count; i++) out[i] = focus === null ? 1 : 1 + MAGNIFY * Math.exp(-(((i - focus) / SPREAD) ** 2));
  return out;
};

// The bar under x (0 to 1) when the bars have these widths.
const barAt = (weights, x) => {
  let at = x * weights.reduce((sum, w) => sum + w, 0);
  for (let i = 0; i < weights.length; i++) {
    at -= weights[i];
    if (at <= 0) return i;
  }
  return weights.length - 1;
};

/**
 * Status history for a few services, a bar per day. The bars swell like a
 * dock under the pointer, the line above names what happened that day, and
 * a click (or Enter) opens the day's incident log. The arrow keys walk the
 * days.
 *
 * Services are `{ name, incidents?, missing? }`, where `incidents` maps a
 * day index (0 is the oldest day) to `{ title, status, minutes, updates }`,
 * `status` is `degraded` or `down`, and `missing` counts days with no data
 * from the start.
 *
 * @attr {string} heading
 * @attr {Array<object>} services - The services (JSON)
 * @attr {number} days - How many days are shown
 * @attr {string} end-date - The last day shown, as YYYY-MM-DD
 */
export class LwUptimeCard extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'System status' },
    services: { type: Object, default: DEMO_SERVICES },
    days: { type: Number, default: 90 },
    endDate: { default: '2026-10-14' },
  };

  #active = null;
  #pinned = null;
  #weights = new Float64Array(0);
  #target = new Float64Array(0);
  #frame = 0;
  #last = 0;

  render() {
    return `<div class="top"><p class="heading"></p><p class="overall"></p></div>
<p class="summary" aria-live="polite"></p>
<div class="bars" role="slider" tabindex="0" aria-valuemin="1"><div class="rows"></div><div class="ends"><span class="ago"></span><span>Today</span></div></div>
<div class="log"><div class="log-inner"><div class="day"><div class="day-top"><p class="day-name"></p><button class="close" type="button" aria-label="Close day">${strokeIcon(x, 14)}</button></div><div class="incidents"></div></div></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const bars = this.query('.bars');
    bars.addEventListener('pointerdown', (event) => this.#down(event), options);
    bars.addEventListener('pointermove', (event) => this.#move(event), options);
    bars.addEventListener('lostpointercapture', () => this.#leave(), options);
    bars.addEventListener('pointerleave', (event) => event.pointerType === 'mouse' && this.#leave(), options);
    bars.addEventListener('click', () => this.#active !== null && this.#pin(this.#pinned === this.#active ? null : this.#active), options);
    bars.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.close').addEventListener('click', () => this.#pin(null), options);
    this.signal.addEventListener('abort', () => {
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
  }

  updated(changed) {
    if (changed.has('days') || changed.has('services')) {
      this.#weights = new Float64Array(this.days).fill(1);
      this.#target = new Float64Array(this.days).fill(1);
      this.#active = this.#pinned = null;
      this.#build();
    }
    this.#paint();
  }

  #dateOf(day) {
    return Date.parse(`${this.endDate}T00:00:00Z`) - (this.days - 1 - day) * DAY;
  }

  #build() {
    const days = this.days;
    this.query('.rows').innerHTML = this.services
      .map((service) => {
        const bars = Array.from({ length: days }, (_, day) => `<span data-status="${statusOf(service, day)}"></span>`).join('');
        return `<div class="service"><div class="service-top"><span class="name">${escapeHtml(service.name)}</span><span class="uptime">${uptimeOf(service, days).toFixed(2)}%</span></div><div class="row">${bars}</div></div>`;
      })
      .join('');
    this.query('.ago').textContent = `${days} days ago`;
    this.#paintWidths();
  }

  #incidentsOn(day) {
    return day === null ? [] : this.services.flatMap((service) => (service.incidents?.[day] ? [{ service: service.name, incident: service.incidents[day] }] : []));
  }

  #paint() {
    const days = this.days;
    const open = this.services.filter((service) => !['up', 'none'].includes(statusOf(service, days - 1)));
    this.query('.heading').textContent = this.heading ?? '';
    const overall = this.query('.overall');
    overall.toggleAttribute('data-issues', open.length > 0);
    overall.innerHTML = open.length ? `${strokeIcon(triangleAlert)}${open.length} service${open.length > 1 ? 's' : ''} affected` : `${strokeIcon(circleCheck)}All systems operational`;

    const shown = this.#active ?? this.#pinned;
    let summary = 'Hover a day to see what happened';
    if (shown !== null) {
      const list = this.#incidentsOn(shown);
      const first = list[0];
      const what = first ? `${first.service} ${first.incident.status === 'down' ? 'down' : 'degraded'} for ${first.incident.minutes} min${list.length > 1 ? `, +${list.length - 1} more` : ''}` : 'No incidents';
      summary = `${formatDay(this.#dateOf(shown))} · ${what}`;
    }
    this.query('.summary').textContent = summary;
    const bars = this.query('.bars');
    bars.ariaLabel = `Daily status for the last ${days} days. Use the arrow keys to move between days and Enter to open one.`;
    bars.ariaValueMax = String(days);
    bars.ariaValueNow = String((shown ?? days - 1) + 1);
    bars.ariaValueText = summary;
    bars.toggleAttribute('data-reading', shown !== null);
    for (const row of this.shadowRoot.querySelectorAll('.row')) [...row.children].forEach((bar, i) => bar.toggleAttribute('data-lit', i === shown));
    this.#paintLog();
  }

  // A pinned day opens its incident log.
  #paintLog() {
    const pinned = this.#pinned;
    this.query('.log').toggleAttribute('data-open', pinned !== null);
    if (pinned === null) return;
    this.query('.day-name').textContent = formatDay(this.#dateOf(pinned));
    const list = this.#incidentsOn(pinned);
    this.query('.incidents').innerHTML = list.length
      ? list
          .map(
            ({ service, incident }) =>
              `<div class="incident"><p class="what"><span class="badge" data-status="${incident.status}">${STATUS_TEXT[incident.status]}</span><span class="service-name">${escapeHtml(service)}</span><span class="muted">${escapeHtml(incident.title)} · ${incident.minutes} min</span></p><ol>${incident.updates.map(({ time, label, note }) => `<li><span class="muted time">${escapeHtml(time)}</span> <b>${escapeHtml(label)}</b>${note ? ` <span class="muted">${escapeHtml(note)}</span>` : ''}</li>`).join('')}</ol></div>`,
          )
          .join('')
      : '<p class="muted none">No incidents recorded. Every service was operational.</p>';
  }

  // ---- The swell ----

  #paintWidths() {
    for (const row of this.shadowRoot.querySelectorAll('.row')) [...row.children].forEach((bar, i) => (bar.style.flexGrow = this.#weights[i].toFixed(3)));
  }

  #focusOn(focus) {
    swell(this.days, focus, this.#target);
    if (reducedMotion.matches) {
      this.#weights.set(this.#target);
      this.#paintWidths();
      return;
    }
    this.#frame ||= requestAnimationFrame((now) => this.#tick(now));
  }

  #tick(now) {
    this.#frame = 0;
    const dt = this.#last ? Math.min((now - this.#last) / 1000, 1 / 30) : 1 / 60;
    this.#last = now;
    const k = 1 - Math.exp(-EASE * dt);
    let moving = false;
    for (let i = 0; i < this.#weights.length; i++) {
      const gap = this.#target[i] - this.#weights[i];
      if (Math.abs(gap) > 0.002) {
        this.#weights[i] += gap * k;
        moving = true;
      } else {
        this.#weights[i] = this.#target[i];
      }
    }
    this.#paintWidths();
    if (moving) this.#frame = requestAnimationFrame((next) => this.#tick(next));
    else this.#last = 0;
  }

  // The day under the pointer, found against the swollen layout: the swell
  // is centred on the bar that ends up under the pointer.
  #dayAt(clientX) {
    const rect = this.query('.rows').getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    const probe = new Float64Array(this.days);
    let day = Math.round(x * (this.days - 1));
    for (let pass = 0; pass < 3; pass++) day = barAt(swell(this.days, day, probe), x);
    return day;
  }

  #set(active) {
    this.#active = active;
    this.#focusOn(active ?? this.#pinned);
    this.#paint();
  }

  #pin(day) {
    this.#pinned = day;
    if (day === null) this.#focusOn(this.#active);
    this.#paint();
  }

  #down(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.pointerType !== 'mouse') event.currentTarget.setPointerCapture?.(event.pointerId);
    this.#set(this.#dayAt(event.clientX));
  }

  #move(event) {
    if (event.pointerType !== 'mouse' && !event.currentTarget.hasPointerCapture?.(event.pointerId)) return;
    this.#set(this.#dayAt(event.clientX));
  }

  #leave() {
    this.#set(null);
  }

  #key(event) {
    const days = this.days;
    const from = this.#active ?? this.#pinned ?? days - 1;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#pin(this.#pinned === from ? null : from);
      return;
    }
    if (event.key === 'Escape') {
      this.#pinned = null;
      this.#leave();
      return;
    }
    const move = { ArrowLeft: -1, ArrowRight: 1, Home: -days, End: days }[event.key];
    if (move === undefined) return;
    event.preventDefault();
    this.#set(clamp(from + move, 0, days - 1));
  }
}
