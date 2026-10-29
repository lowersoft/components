import { closeButton, dismissBanner } from '../../core/banner.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronDown } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './incident-banner.scss?inline';

const STAGES = ['Investigating', 'Identified', 'Monitoring', 'Resolved'];
// The default incident started this long before the banner first shows.
const DEMO_AGO_MS = 14 * 60_000 + 32_000;

const DEMO_UPDATES = [
  { stage: 'Monitoring', at: '14:41', text: 'A fix is out on every region. Error rates are back to normal; we are watching them.' },
  { stage: 'Identified', at: '14:33', text: 'A bad config push to the API gateway is returning 502s for about 4% of requests.' },
  { stage: 'Investigating', at: '14:27', text: 'We are seeing elevated error rates on API requests and are looking into it.' },
];

const pad = (n) => String(n).padStart(2, '0');

// "14:32", or "1:04:32" past the hour.
const elapsed = (ms) => {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(seconds / 3600);
  const clock = `${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
  return hours ? `${hours}:${clock}` : clock;
};

/**
 * An incident across the top of the page: how bad, what is wrong, how far
 * along the fix is as four steps, and how long it has run. "Updates" opens
 * the timeline in place. Resolved, it turns green and stops the clock.
 *
 * Updates are `{ stage, at, text }`, newest first; the newest one's stage
 * is where the incident stands.
 *
 * @attr {'minor'|'major'} severity
 * @attr {string} heading
 * @attr {string} started - When it started, as a date and time
 * @attr {Array<object>} updates (JSON)
 * @attr {boolean} open - The timeline is showing
 * @fires lw-dismiss - The banner was dismissed
 */
export class LwIncidentBanner extends LwElement {
  static styles = styles;
  static props = {
    severity: { default: 'major', reflect: true },
    heading: { default: 'Elevated error rates on API requests' },
    started: {},
    updates: { type: Object, default: DEMO_UPDATES },
    open: { type: Boolean, reflect: true },
  };

  #start = 0;
  #timer = 0;

  render() {
    return `<div class="bar"><span class="state" aria-hidden="true"></span><p class="heading"></p><span class="steps" aria-hidden="true"></span><p class="stage"><span class="stage-name"></span> <span class="clock"></span></p>
<button class="toggle" type="button" aria-controls="timeline"><span>Updates</span><span class="count"></span>${strokeIcon(chevronDown, 16)}</button>${closeButton()}</div>
<div class="timeline" id="timeline" role="region" aria-label="Incident updates"><ol class="updates"></ol></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.toggle').addEventListener('click', () => (this.open = !this.open), options);
    this.query('.close').addEventListener('click', () => dismissBanner(this), options);
    this.#timer = setInterval(() => this.#tick(), 1000);
    this.signal.addEventListener('abort', () => clearInterval(this.#timer));
  }

  updated(changed) {
    if (changed.has('started')) this.#start = this.started ? new Date(this.started).getTime() : Date.now() - DEMO_AGO_MS;
    const updates = this.updates ?? [];
    const stage = Math.max(0, STAGES.indexOf(updates[0]?.stage ?? STAGES[0]));
    const resolved = stage === STAGES.length - 1;
    this.toggleAttribute('data-resolved', resolved);
    this.setAttribute('role', resolved ? 'status' : 'alert');
    this.query('.heading').textContent = this.heading ?? '';
    this.query('.steps').innerHTML = STAGES.map((_, i) => `<span class="step"${i <= stage ? ' data-done' : ''}></span>`).join('');
    this.query('.stage-name').textContent = STAGES[stage];
    this.query('.count').textContent = String(updates.length);
    this.query('.toggle').ariaExpanded = String(this.open);
    this.query('.timeline').inert = !this.open;
    if (changed.has('updates')) {
      this.query('.updates').innerHTML = updates
        .map((update) => `<li class="update"><span class="update-stage">${escapeHtml(update.stage)}</span><span class="update-at">${escapeHtml(update.at ?? '')}</span><p class="update-text">${escapeHtml(update.text)}</p></li>`)
        .join('');
    }
    this.#tick();
  }

  // The clock runs until the incident is resolved.
  #tick() {
    if (this.hasAttribute('data-resolved')) {
      clearInterval(this.#timer);
      this.query('.clock').textContent = '';
      return;
    }
    this.query('.clock').textContent = elapsed(Date.now() - this.#start);
  }
}
