import { closeButton, dismissBanner } from '../../core/banner.js';
import { addDays, daysInRange, formatDate, parseDate, today } from '../../core/dates.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import styles from './trial-status-banner.scss?inline';

// Days left at which the banner turns urgent, then critical.
const URGENT_DAYS = 3;
const CRITICAL_DAYS = 1;

/**
 * How much of a trial is left, as a strip of one tick a day: spent days
 * dim, the rest bright. The days left and the end date sit beside it, and
 * it grows more insistent near the end. Upgrade and dismiss on the right.
 *
 * @attr {string} plan
 * @attr {string} ends - When the trial ends, as `YYYY-MM-DD`; four days from today by default
 * @attr {number} length - Days in the trial
 * @attr {string} action
 * @fires lw-upgrade - The action was chosen
 * @fires lw-dismiss - The banner was dismissed
 */
export class LwTrialStatusBanner extends LwElement {
  static styles = styles;
  static props = {
    plan: { default: 'Pro' },
    ends: {},
    length: { type: Number, default: 14 },
    action: { default: 'Upgrade' },
  };

  render() {
    return `<div class="bar" role="status"><span class="ticks" aria-hidden="true"></span><p class="text"><b class="left"></b> <span class="what"></span><span class="date"></span></p><lw-button class="upgrade" size="sm"></lw-button>${closeButton()}</div>`;
  }

  connected() {
    this.query('.upgrade').addEventListener('click', () => this.emit('upgrade'), { signal: this.signal });
    this.query('.close').addEventListener('click', () => dismissBanner(this), { signal: this.signal });
  }

  updated() {
    const ends = parseDate(this.ends) ?? addDays(today(), 4);
    const left = Math.max(0, daysInRange(today(), ends) - 1);
    const spent = Math.max(0, this.length - left);
    this.dataset.level = left <= CRITICAL_DAYS ? 'critical' : left <= URGENT_DAYS ? 'urgent' : 'calm';
    this.query('.ticks').innerHTML = Array.from({ length: this.length }, (_, i) => `<span class="tick"${i < spent ? ' data-spent' : ''}></span>`).join('');
    const plan = this.plan ?? '';
    if (left === 0) {
      this.query('.left').textContent = `Your ${plan} trial has ended`;
      this.query('.what').textContent = '';
    } else {
      this.query('.left').textContent = `${left} ${left === 1 ? 'day' : 'days'} left`;
      this.query('.what').textContent = `in your ${plan} trial`;
    }
    this.query('.date').textContent = ` · ${left ? 'Ends' : 'Ended'} ${formatDate(ends, 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
    this.query('.upgrade').textContent = this.action ?? '';
  }
}
