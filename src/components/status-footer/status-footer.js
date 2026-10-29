import { escapeHtml } from '../../core/dom.js';
import { brandMarkup, linkColumns } from '../../core/footer.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './status-footer.scss?inline';

const DAY_MS = 86_400_000;

const STATUS = {
  normal: 'All systems normal',
  degraded: 'Some systems degraded',
  outage: 'Major outage',
};

const DEMO_COLUMNS = [
  { title: 'Product', links: [{ label: 'Overview' }, { label: 'Pricing' }, { label: 'Changelog' }, { label: 'Roadmap' }] },
  { title: 'Developers', links: [{ label: 'Documentation' }, { label: 'API reference' }, { label: 'SDKs' }, { label: 'Status' }] },
  { title: 'Company', links: [{ label: 'About' }, { label: 'Careers' }, { label: 'Privacy' }, { label: 'Terms' }] },
];

const DEMO_INCIDENTS = [
  { ago: 61, level: 'minor', label: 'Slow builds on arm64 runners' },
  { ago: 23, level: 'major', label: 'Queue delays in eu-west' },
  { ago: 9, level: 'minor', label: 'Elevated API latency' },
];

const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

/**
 * A footer that reports on the service: the brand and what it does, columns
 * of links, and a status line below with uptime over the last days drawn as
 * a strip, one bar a day. Hover a bar, or focus the strip and use the
 * arrow keys, to read that day.
 *
 * Columns are `[{ title, links: [{ label, href?, badge? }] }]`; incidents
 * are `{ ago, level, label }`, `ago` in days and `level` minor or major.
 *
 * @attr {string} brand
 * @attr {string} href - Where the brand links
 * @attr {string} description
 * @attr {Array<object>} columns (JSON)
 * @attr {'normal'|'degraded'|'outage'} status
 * @attr {string} status-href - The status page
 * @attr {number} uptime - Percent over `days`
 * @attr {number} days
 * @attr {Array<object>} incidents (JSON)
 */
export class LwStatusFooter extends LwElement {
  static styles = styles;
  static props = {
    brand: { default: 'Lower' },
    href: { default: '/' },
    description: { default: 'Low-level tools for teams who would rather ship than babysit a runtime.' },
    columns: { type: Object, default: DEMO_COLUMNS },
    status: { default: 'normal', reflect: true },
    statusHref: { default: '#' },
    uptime: { type: Number, default: 99.93 },
    days: { type: Number, default: 90 },
    incidents: { type: Object, default: DEMO_INCIDENTS },
  };

  // The day the strip's cursor is on, counted back from today; -1 for none.
  #day = -1;
  #incidentsByDay = new Map();

  render() {
    return `<footer class="container"><div class="top"><div class="about"><span class="brand-slot"></span><p class="description"></p></div><div class="columns"></div></div>
<div class="bottom"><a class="status"><span class="dot" aria-hidden="true"></span><span class="status-text"></span>${strokeIcon(arrowRight, 16)}</a>
<div class="uptime"><div class="strip" tabindex="0" role="img"><span class="tip" aria-hidden="true"></span></div><span class="uptime-text"></span><span class="readout visually-hidden" aria-live="polite"></span></div></div></footer>`;
  }

  connected() {
    const options = { signal: this.signal };
    const strip = this.query('.strip');
    strip.addEventListener('pointermove', (event) => {
      const bar = event.target.closest('.bar');
      if (bar) this.#point(Number(bar.dataset.ago));
    }, options);
    strip.addEventListener('pointerleave', () => this.#point(-1), options);
    strip.addEventListener('focus', () => this.#point(0), options);
    strip.addEventListener('blur', () => this.#point(-1), options);
    strip.addEventListener('keydown', (event) => {
      const step = { ArrowLeft: 1, ArrowRight: -1 }[event.key];
      const to = { Home: this.days - 1, End: 0 }[event.key];
      if (step === undefined && to === undefined) return;
      event.preventDefault();
      this.#point(to ?? Math.min(this.days - 1, Math.max(0, this.#day + step)));
    }, options);
  }

  updated(changed) {
    if (changed.has('brand') || changed.has('href')) this.query('.brand-slot').innerHTML = brandMarkup(this.brand, this.href);
    this.query('.description').textContent = this.description ?? '';
    if (changed.has('columns')) this.query('.columns').innerHTML = linkColumns(this.columns);
    const status = this.query('.status');
    status.href = this.statusHref ?? '#';
    this.query('.status-text').textContent = STATUS[this.status] ?? STATUS.normal;
    this.query('.uptime-text').textContent = `${this.uptime}% uptime · ${this.days} days`;
    if (changed.has('days') || changed.has('incidents')) this.#buildStrip();
  }

  // One bar a day, oldest on the left, tinted by that day's worst incident.
  #buildStrip() {
    const byDay = new Map();
    for (const incident of this.incidents ?? []) {
      const day = byDay.get(incident.ago) ?? [];
      byDay.set(incident.ago, [...day, incident]);
    }
    const bars = Array.from({ length: this.days }, (_, i) => {
      const ago = this.days - 1 - i;
      const incidents = byDay.get(ago) ?? [];
      const level = incidents.some((each) => each.level === 'major') ? 'major' : incidents.length ? 'minor' : '';
      return `<span class="bar" data-ago="${ago}"${level ? ` data-level="${level}"` : ''}></span>`;
    });
    const strip = this.query('.strip');
    strip.querySelectorAll('.bar').forEach((bar) => bar.remove());
    strip.insertAdjacentHTML('afterbegin', bars.join(''));
    this.#incidentsByDay = byDay;
    const count = this.incidents?.length ?? 0;
    strip.ariaLabel = `Uptime, last ${this.days} days: ${count ? `${count} ${count === 1 ? 'incident' : 'incidents'}` : 'no incidents'}. Use the arrow keys to read each day.`;
  }

  // Puts the cursor on a day and says what happened then.
  #point(ago) {
    this.#day = ago;
    const tip = this.query('.tip');
    for (const bar of this.shadowRoot.querySelectorAll('.bar')) bar.toggleAttribute('data-active', Number(bar.dataset.ago) === ago);
    if (ago < 0) {
      tip.classList.remove('visible');
      return;
    }
    const bar = this.query(`.bar[data-ago="${ago}"]`);
    const incidents = this.#incidentsByDay.get(ago) ?? [];
    const date = ago === 0 ? 'Today' : dayFormat.format(new Date(Date.now() - ago * DAY_MS));
    tip.innerHTML = `<b>${date}</b> ${incidents.length ? incidents.map((each) => escapeHtml(each.label)).join(', ') : 'No incidents'}`;
    tip.style.left = `${bar.offsetLeft + bar.offsetWidth / 2}px`;
    tip.classList.add('visible');
    // Read out as the cursor moves along the strip by keyboard.
    if (this.shadowRoot.activeElement === this.query('.strip')) this.query('.readout').textContent = tip.textContent;
  }
}
