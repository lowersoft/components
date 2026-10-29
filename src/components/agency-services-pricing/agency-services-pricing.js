import { escapeHtml } from '../../core/dom.js';
import { moveHighlight } from '../../core/highlight.js';
import { strokeIcon } from '../../core/icons.js';
import { check, minus, plus } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { formatMoney, paintPrice, priceMarkup, pricingStyles } from '../../core/pricing.js';
import { rollingStyles } from '../../core/rolling.js';
import '../button/index.js';
import '../checkbox/index.js';
import styles from './agency-services-pricing.scss?inline';

const DEMO_SERVICES = [
  { id: 'audit', name: 'Performance audit', short: 'Audit', price: 4800, from: true, weeks: [2, 3], blurb: 'Find where the time goes in one hot path, and fix the worst of it.', action: 'Start an audit', features: ['Profiling on your real workload', 'Flame graphs and a written report', 'The top three fixes, merged', 'Benchmarks to keep it fast', 'Handover call and docs'] },
  { id: 'port', name: 'Native port', short: 'Port', price: 12_000, from: true, weeks: [5, 7], blurb: 'Move a slow service or tool to hand-tuned C, with the same behaviour.', action: 'Start a port', featured: true, features: ['Up to 8 modules and a test suite', 'SIMD where it counts', 'Three review rounds', 'Fuzzing and sanitizer pass', '30 days of post-launch fixes'] },
  { id: 'retainer', name: 'Monthly retainer', short: 'Retainer', price: 6500, monthly: true, weeks: [1, 2], start: 'First release in', blurb: 'An embedded systems team on your codebase, one request at a time.', action: 'Book an intro call', features: ['Unlimited requests, one at a time', 'Profiling and fixes in one team', 'Shared Slack channel', 'Weekly check-in call', 'Pause or cancel any month'] },
];

const DEMO_EXTRAS = [
  { id: 'targets', label: 'Extra platform target', price: 2400, weeks: 1, max: 6 },
  { id: 'fuzz', label: 'Continuous fuzzing harness', price: 1800 },
  { id: 'bench', label: 'Benchmark dashboard', price: 1200 },
  { id: 'rush', label: 'Rush delivery', percent: 25, faster: 0.3 },
];

const weeksText = ([low, high]) => (low === high ? `${low} ${low === 1 ? 'week' : 'weeks'}` : `${low}–${high} weeks`);

/**
 * A studio's services side by side, then an estimate built from them. Pick
 * where to start, from a service's button or the switch, add extras, a
 * count for those that come in units, and the total and the delivery time
 * update as you go. Rush delivery adds a share of the price and takes a
 * share off the time.
 *
 * Services are `{ id, name, short, price, blurb, action, features, weeks,
 * from?, monthly?, featured?, start? }`, `weeks` as `[low, high]`; extras
 * are `{ id, label, price?, percent?, weeks?, faster?, max? }`, a `max`
 * making it a count.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} value - The service the estimate starts from
 * @attr {Array<object>} services (JSON)
 * @attr {Array<object>} extras (JSON)
 * @fires lw-choose - A service's action, or the estimate's, was chosen; `detail: { service, extras, total, weeks }`
 */
export class LwAgencyServicesPricing extends LwElement {
  static styles = [rollingStyles, pricingStyles, styles];
  static props = {
    heading: { default: 'Studio pricing' },
    description: { default: 'Fixed-scope work or an ongoing team. Every project starts with a free 30-minute call.' },
    value: { default: 'port', reflect: true },
    services: { type: Object, default: DEMO_SERVICES },
    extras: { type: Object, default: DEMO_EXTRAS },
  };

  // How many of each extra, by id; 0 for off.
  #counts = new Map();

  render() {
    return `<header class="head"><h2 class="title"></h2><p class="description"></p></header>
<div class="frame"><div class="services"></div>
<section class="estimate" aria-labelledby="estimate-title"><div class="build"><h3 class="estimate-title" id="estimate-title">Build an estimate</h3>
<p class="label" id="start-label">Start from</p><div class="starts" role="radiogroup" aria-labelledby="start-label"><span class="start-pill"></span></div><ul class="extras"></ul></div>
<div class="result"><p class="label">Estimated total</p><p class="total">${priceMarkup()}<span class="per"></span></p><p class="delivery"></p><p class="note">A starting point. We confirm scope and price on the intro call.</p><lw-button class="book">Book an intro call</lw-button></div></section></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.services').addEventListener('click', (event) => {
      const action = event.target.closest('.action');
      if (!action) return;
      this.value = action.dataset.id;
      this.emit('choose', this.#detail);
    }, options);
    const starts = this.query('.starts');
    starts.addEventListener('click', (event) => {
      const start = event.target.closest('.start');
      if (start) this.value = start.dataset.id;
    }, options);
    starts.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      const index = this.services.indexOf(this.#service);
      this.value = this.services[(index + step + this.services.length) % this.services.length].id;
      starts.querySelector(`[data-id="${CSS.escape(this.value)}"]`).focus();
    }, options);
    const extras = this.query('.extras');
    extras.addEventListener('change', (event) => {
      const box = event.target.closest('lw-checkbox');
      if (!box) return;
      const extra = this.extras.find((each) => each.id === box.dataset.id);
      this.#counts.set(extra.id, box.checked ? 1 : 0);
      this.#paint();
    }, options);
    extras.addEventListener('click', (event) => {
      const step = event.target.closest('.step');
      if (!step) return;
      const extra = this.extras.find((each) => each.id === step.dataset.id);
      this.#counts.set(extra.id, Math.min(extra.max, Math.max(0, (this.#counts.get(extra.id) ?? 0) + Number(step.dataset.step))));
      this.#paint();
    }, options);
    this.query('.book').addEventListener('click', () => this.emit('choose', this.#detail), options);
    const observer = new ResizeObserver(() => this.#paintStarts());
    observer.observe(starts);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    if (changed.has('services')) this.#buildServices();
    if (changed.has('extras')) this.#buildExtras();
    this.#paint();
  }

  get #service() {
    return this.services.find((service) => service.id === this.value) ?? this.services[0];
  }

  #buildServices() {
    this.query('.services').innerHTML = this.services
      .map((service) => `<article class="service"${service.featured ? ' data-featured' : ''}><h3 class="name">${escapeHtml(service.name)}</h3>
<p class="price">${service.from ? '<span class="from">from</span>' : ''}<span class="figure">${formatMoney(service.price)}</span>${service.monthly ? '<span class="per">/ month</span>' : ''}</p>
<p class="blurb">${escapeHtml(service.blurb)}</p><p class="weeks">${escapeHtml(service.start ? `${service.start} ${weeksText(service.weeks)}` : weeksText(service.weeks))}</p>
<ul class="features">${service.features.map((feature) => `<li>${strokeIcon(check, 16)}<span>${escapeHtml(feature)}</span></li>`).join('')}</ul>
<lw-button class="action" data-id="${escapeHtml(service.id)}" variant="${service.featured ? 'primary' : 'outline'}">${escapeHtml(service.action)}</lw-button></article>`)
      .join('');
    const starts = this.query('.starts');
    starts.querySelectorAll('.start').forEach((each) => each.remove());
    starts.insertAdjacentHTML('beforeend', this.services.map((service) => `<button class="start" type="button" role="radio" data-id="${escapeHtml(service.id)}">${escapeHtml(service.short ?? service.name)}</button>`).join(''));
  }

  #buildExtras() {
    this.query('.extras').innerHTML = (this.extras ?? [])
      .map((extra) => {
        const cost = extra.percent ? `+${extra.percent}%` : `+${formatMoney(extra.price)}${extra.max ? ' each' : ''}`;
        const control = extra.max
          ? `<span class="extra-label">${escapeHtml(extra.label)}</span><span class="counter" role="group" aria-label="${escapeHtml(extra.label)}"><button class="step" type="button" data-id="${escapeHtml(extra.id)}" data-step="-1" aria-label="Fewer">${strokeIcon(minus, 14)}</button><output class="count"></output><button class="step" type="button" data-id="${escapeHtml(extra.id)}" data-step="1" aria-label="More">${strokeIcon(plus, 14)}</button></span>`
          : `<lw-checkbox class="extra-label" data-id="${escapeHtml(extra.id)}">${escapeHtml(extra.label)}</lw-checkbox>`;
        return `<li class="extra" data-id="${escapeHtml(extra.id)}">${control}<span class="cost">${cost}</span></li>`;
      })
      .join('');
  }

  // The service's price and time, with the extras chosen.
  get #estimate() {
    const service = this.#service;
    let total = service.price;
    let [low, high] = service.weeks;
    let share = 0;
    let faster = 0;
    for (const extra of this.extras ?? []) {
      const count = this.#counts.get(extra.id) ?? 0;
      if (!count) continue;
      total += (extra.price ?? 0) * count;
      low += (extra.weeks ?? 0) * count;
      high += (extra.weeks ?? 0) * count;
      share += extra.percent ?? 0;
      faster += extra.faster ?? 0;
    }
    total = Math.round(total * (1 + share / 100));
    const weeks = [Math.max(1, Math.round(low * (1 - faster))), Math.max(1, Math.round(high * (1 - faster)))];
    return { total, weeks };
  }

  get #detail() {
    const { total, weeks } = this.#estimate;
    return { service: this.#service.id, extras: Object.fromEntries([...this.#counts].filter(([, count]) => count)), total, weeks };
  }

  #paintStarts() {
    let chosen = null;
    for (const start of this.shadowRoot.querySelectorAll('.start')) {
      const checked = start.dataset.id === this.#service.id;
      start.ariaChecked = String(checked);
      start.tabIndex = checked ? 0 : -1;
      if (checked) chosen = start;
    }
    if (chosen?.offsetWidth) moveHighlight(this.query('.start-pill'), chosen);
  }

  #paint() {
    const service = this.#service;
    this.#paintStarts();
    for (const extra of this.extras ?? []) {
      const count = this.#counts.get(extra.id) ?? 0;
      const row = this.query(`.extra[data-id="${CSS.escape(extra.id)}"]`);
      row.toggleAttribute('data-on', count > 0);
      if (extra.max) {
        row.querySelector('.count').value = String(count);
        row.querySelector('[data-step="-1"]').disabled = count <= 0;
        row.querySelector('[data-step="1"]').disabled = count >= extra.max;
      } else {
        row.querySelector('lw-checkbox').checked = count > 0;
      }
    }
    const { total, weeks } = this.#estimate;
    paintPrice(this.query('.amount'), total);
    this.query('.result .per').textContent = service.monthly ? '/ month' : '';
    this.query('.delivery').textContent = service.monthly ? `First release in ${weeksText(weeks)}` : `Delivered in ${weeksText(weeks)}`;
  }
}
