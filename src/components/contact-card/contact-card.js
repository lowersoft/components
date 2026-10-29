import { writeClipboard } from '../../core/clipboard.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { check, copy, mail, mapPin, phone } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf, initialsOf } from '../../core/people.js';
import '../button/index.js';
import styles from './contact-card.scss?inline';

const HOURS = 24;
const COPIED_MS = 1500;

// A zone's offset from UTC right now, in minutes.
const offsetOf = (zone) => {
  const now = new Date();
  const local = new Date(now.toLocaleString('en-US', { timeZone: zone }));
  const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  return Math.round((local - utc) / 60_000);
};

const hhmm = (minutes) => {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

const working = (hour, { start, end }) => (start <= end ? hour >= start && hour < end : hour >= start || hour < end);
const vcard = (text) => String(text ?? '').replace(/[\\,;]/g, (ch) => `\\${ch}`);

/**
 * A teammate card built around when you can reach them: a 24-hour strip of
 * both working days, yours and theirs, with the overlap in ink. Scrub it (or
 * use the arrow keys) to read any time on both clocks. Each contact row
 * copies on click, and Save contact downloads a vCard.
 *
 * @attr {string} name
 * @attr {string} role
 * @attr {string} email
 * @attr {string} phone
 * @attr {string} location
 * @attr {string} zone - Their IANA time zone
 * @attr {object} hours - Their working hours, `{ start, end }` in 24 h (JSON)
 * @attr {string} your-zone - Yours; the device's by default
 * @attr {object} your-hours - Yours (JSON)
 * @fires lw-copy - A row was copied; `detail: { field, value }`
 */
export class LwContactCard extends LwElement {
  static styles = styles;
  static props = {
    name: { default: 'Lena Fischer' },
    role: { default: 'Staff engineer · Platform' },
    email: { default: 'lena@lowersoft.dev' },
    phone: { default: '+49 30 901820' },
    location: { default: 'Berlin, Germany' },
    zone: { default: 'Europe/Berlin' },
    hours: { type: Object, default: { start: 9, end: 18 } },
    yourZone: { default: Intl.DateTimeFormat().resolvedOptions().timeZone },
    yourHours: { type: Object, default: { start: 9, end: 17 } },
  };

  #scrub = null;
  #clockTimer = 0;
  #copiedTimer = 0;

  render() {
    const cells = Array.from({ length: HOURS }, () => '<span></span>').join('');
    return `<div class="head"><span class="avatar" aria-hidden="true"></span><div class="who"><p class="name"></p><p class="role"></p></div><span class="now"></span></div>
<div class="day"><p class="read" aria-live="polite"></p>
<div class="strip" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="23"><div class="track"><span class="label">You</span><div class="cells you">${cells}</div></div><div class="track"><span class="label them-label"></span><div class="cells them">${cells}</div></div><span class="cursor" aria-hidden="true"></span></div>
<div class="ticks" aria-hidden="true"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div></div>
<ul class="rows"></ul>
<lw-button class="save" variant="secondary">Save contact</lw-button>`;
  }

  connected() {
    const options = { signal: this.signal };
    const strip = this.query('.strip');
    strip.addEventListener('pointerdown', (event) => {
      event.currentTarget.setPointerCapture?.(event.pointerId);
      this.#scrubAt(event.clientX);
    }, options);
    strip.addEventListener('pointermove', (event) => (event.pointerType === 'mouse' || event.currentTarget.hasPointerCapture?.(event.pointerId)) && this.#scrubAt(event.clientX), options);
    strip.addEventListener('pointerleave', () => this.#setScrub(null), options);
    strip.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.rows').addEventListener('click', (event) => {
      const row = event.target.closest('button');
      if (row) this.#copy(row);
    }, options);
    this.query('.save').addEventListener('click', () => this.#save(), options);
    // The clocks keep time.
    this.#clockTimer = setInterval(() => this.#paint(), 30_000);
    this.signal.addEventListener('abort', () => {
      clearInterval(this.#clockTimer);
      clearTimeout(this.#copiedTimer);
    });
  }

  updated() {
    const avatar = this.query('.avatar');
    avatar.textContent = initialsOf(this.name ?? '');
    avatar.style.setProperty('--_hue', hueOf(this.name ?? ''));
    this.query('.name').textContent = this.name ?? '';
    this.query('.role').textContent = this.role ?? '';
    this.query('.them-label').textContent = (this.name ?? '').split(' ')[0];
    const rows = [
      ['email', mail, this.email],
      ['phone', phone, this.phone],
      ['location', mapPin, this.location],
    ].filter(([, , value]) => value);
    this.query('.rows').innerHTML = rows
      .map(([field, icon, value]) => `<li><button type="button" data-field="${field}" data-value="${escapeHtml(value)}" aria-label="Copy ${field}: ${escapeHtml(value)}">${strokeIcon(icon)}<span class="value">${escapeHtml(value)}</span><span class="hint">${strokeIcon(copy, 14)}${strokeIcon(check, 14)}</span></button></li>`)
      .join('');
    this.#paint();
  }

  // Their offset from yours, in minutes.
  get #shift() {
    return offsetOf(this.zone) - offsetOf(this.yourZone);
  }

  #paint() {
    const shift = this.#shift;
    const theirHour = (hour) => (((hour + shift / 60) % HOURS) + HOURS) % HOURS;
    const you = [...this.query('.cells.you').children];
    const them = [...this.query('.cells.them').children];
    for (let hour = 0; hour < HOURS; hour++) {
      const mine = working(hour, this.yourHours);
      const theirs = working(Math.floor(theirHour(hour)), this.hours);
      you[hour].toggleAttribute('data-on', mine);
      them[hour].toggleAttribute('data-on', theirs);
      // Where both days overlap, the strip is in ink.
      you[hour].toggleAttribute('data-both', mine && theirs);
      them[hour].toggleAttribute('data-both', mine && theirs);
    }
    // Where both of you are in your day right now.
    const now = new Date();
    const yourNow = now.getUTCHours() * 60 + now.getUTCMinutes() + offsetOf(this.yourZone);
    const theirNow = yourNow + shift;
    const hereNow = ((yourNow % 1440) + 1440) % 1440;
    this.style.setProperty('--_now', String(hereNow / 1440));
    const atWork = working(Math.floor((((theirNow % 1440) + 1440) % 1440) / 60), this.hours);
    const nowEl = this.query('.now');
    nowEl.textContent = `${hhmm(theirNow)} ${atWork ? '· working' : '· off'}`;
    nowEl.toggleAttribute('data-working', atWork);
    const first = (this.name ?? '').split(' ')[0];
    const at = this.#scrub ?? hereNow;
    this.query('.read').textContent = this.#scrub === null ? `${hhmm(theirNow)} for ${first} now · ${this.#overlapText()}` : `${hhmm(at)} for you · ${hhmm(at + shift)} for ${first}`;
    this.style.setProperty('--_at', String(at / 1440));
    this.toggleAttribute('data-scrubbing', this.#scrub !== null);
    const strip = this.query('.strip');
    strip.ariaLabel = `Working hours, yours and ${first}'s. Use the arrow keys to read a time.`;
    strip.ariaValueNow = String(Math.floor(at / 60));
    strip.ariaValueText = `${hhmm(at)} for you, ${hhmm(at + shift)} for ${first}`;
  }

  #overlapText() {
    const both = [...this.query('.cells.you').children].map((cell) => cell.hasAttribute('data-both'));
    const count = both.filter(Boolean).length;
    if (!count) return 'no overlap';
    const start = both.findIndex(Boolean);
    return `${count} h overlap from ${hhmm(start * 60)}`;
  }

  #setScrub(minutes) {
    this.#scrub = minutes;
    this.#paint();
  }

  #scrubAt(clientX) {
    const rect = this.query('.cells.you').getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    // Snaps to the quarter hour.
    this.#setScrub(Math.min(1439, Math.round((t * 1440) / 15) * 15));
  }

  #key(event) {
    const step = { ArrowRight: 60, ArrowLeft: -60, ArrowUp: 15, ArrowDown: -15 }[event.key];
    if (event.key === 'Escape') {
      this.#setScrub(null);
      return;
    }
    if (!step) return;
    event.preventDefault();
    const now = Number.parseFloat(this.style.getPropertyValue('--_now')) * 1440;
    this.#setScrub((((this.#scrub ?? Math.round(now / 15) * 15) + step) % 1440 + 1440) % 1440);
  }

  // A row copies its value, confirming in place.
  async #copy(row) {
    try {
      await writeClipboard(row.dataset.value);
    } catch {
      return;
    }
    for (const other of this.shadowRoot.querySelectorAll('[data-copied]')) other.removeAttribute('data-copied');
    row.toggleAttribute('data-copied', true);
    clearTimeout(this.#copiedTimer);
    this.#copiedTimer = setTimeout(() => row.removeAttribute('data-copied'), COPIED_MS);
    this.emit('copy', { field: row.dataset.field, value: row.dataset.value });
  }

  // A real vCard, downloaded.
  #save() {
    const [given = '', ...rest] = (this.name ?? '').split(' ');
    const card = ['BEGIN:VCARD', 'VERSION:3.0', `N:${vcard(rest.join(' '))};${vcard(given)};;;`, `FN:${vcard(this.name)}`, this.role && `TITLE:${vcard(this.role)}`, this.email && `EMAIL;TYPE=INTERNET:${vcard(this.email)}`, this.phone && `TEL;TYPE=CELL:${vcard(this.phone)}`, this.location && `ADR;TYPE=WORK:;;${vcard(this.location)};;;;`, `TZ:${vcard(this.zone)}`, 'END:VCARD'].filter(Boolean).join('\r\n');
    const url = URL.createObjectURL(new Blob([card], { type: 'text/vcard' }));
    Object.assign(document.createElement('a'), { href: url, download: `${(this.name ?? 'contact').replace(/\s+/g, '-').toLowerCase()}.vcf` }).click();
    setTimeout(() => URL.revokeObjectURL(url));
  }
}
