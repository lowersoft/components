import { addDays, formatDate, today, weekday } from '../../core/dates.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronLeft, chevronRight, globe } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { hueOf, initialsOf } from '../../core/people.js';
import '../button/index.js';
import styles from './booking-picker.scss?inline';

// The working day, in minutes from midnight, and the grid times snap to.
const DAY_START = 8 * 60;
const DAY_END = 18 * 60;
const STEP = 15;
const DAYS_SHOWN = 5;

const DEMO_ZONES = [
  { label: 'GMT+2', shift: 0 },
  { label: 'GMT', shift: -120 },
  { label: 'GMT−5', shift: -420 },
];

const MEET = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#00832d" d="M13.5 12 15.8 14.6l3.1 2V7.4l-3.1 2z"/><path fill="#0066da" d="M2 15.7v2.6c0 .6.5 1.2 1.2 1.2h2.6l.5-1.9-.5-1.9-1.8-.5z"/><path fill="#e94235" d="M5.8 4.5 2 8.3l1.9.5 1.9-.5.6-1.9z"/><path fill="#2684fc" d="M5.8 8.3H2v7.4h3.8z"/><path fill="#00ac47" d="M17.4 6.2 15.8 7.5v4.5l3.1-2.6V5.7c0-.5-.6-.8-1-.5zM13.5 12v3.9H5.8v3.8h10c.6 0 1.2-.5 1.2-1.2v-2.4z"/><path fill="#ffba00" d="M15.8 4.5H5.8v3.8h7.7v3.7l3.5-3V5.7c0-.7-.5-1.2-1.2-1.2"/></svg>';

// A day's meetings, made up from its date so every day differs but stays put.
const demoBusy = (iso) => {
  let seed = [...iso].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
  const next = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296);
  const blocks = [];
  let at = DAY_START + 60 + Math.floor(next() * 4) * 30;
  while (at < DAY_END - 60) {
    const length = (2 + Math.floor(next() * 4)) * 30;
    blocks.push([at, Math.min(DAY_END, at + length)]);
    at += length + (2 + Math.floor(next() * 4)) * 30;
  }
  return blocks;
};

const clockOf = (minutes) => {
  const hours = Math.floor(minutes / 60) % 24;
  return { time: `${hours % 12 || 12}:${String(minutes % 60).padStart(2, '0')}`, half: hours < 12 ? 'AM' : 'PM' };
};
const label = (minutes) => {
  const { time, half } = clockOf(minutes);
  return `${time} ${half}`;
};

/**
 * Pick a time for a call on a day's timeline. Past time and meetings are
 * hatched; the slot is a handle to drag along the free stretches, snapping
 * to the quarter hour, or a slider for the arrow keys. The first time of
 * each free stretch waits below as a chip. Step between the next few days,
 * whose dots show which have room, and switch the time zone to read the
 * times in yours.
 *
 * Busy times are `{ "YYYY-MM-DD": [[start, end], …] }` in minutes from
 * midnight, in the host's zone; without them the demo makes some up.
 *
 * @attr {string} host-name - Who the call is with
 * @attr {number} duration - Minutes
 * @attr {string} where - Where the call happens
 * @attr {object} busy (JSON)
 * @fires lw-book - A time was booked; `detail: { date, start, end, zone }`
 */
export class LwBookingPicker extends LwElement {
  static styles = styles;
  static props = {
    hostName: { default: 'Maya Lindqvist' },
    duration: { type: Number, default: 30 },
    where: { default: 'Google Meet' },
    busy: { type: Object },
  };

  #days = [];
  #day = 0;
  #start = null;
  #zone = 0;
  #now = 0;

  render() {
    return `<header class="head"><span class="avatar"><span class="initials"></span><span class="online"></span></span><div class="title-block"><h2 class="title"></h2><p class="meta"><span class="duration"></span> · ${MEET}<span class="where"></span></p></div>
<button class="zone" type="button">${strokeIcon(globe, 16)}<span class="zone-label"></span></button></header>
<div class="body"><div class="day-nav"><button class="nav prev" type="button" aria-label="Previous day">${strokeIcon(chevronLeft, 18)}</button><p class="day" aria-live="polite"></p><button class="nav next" type="button" aria-label="Next day">${strokeIcon(chevronRight, 18)}</button><button class="today" type="button">Today</button><span class="dots" aria-hidden="true"></span><span class="open"></span></div>
<div class="hours" aria-hidden="true"></div><div class="track"><div class="blocks"></div><span class="now" aria-hidden="true"></span><span class="handle" role="slider" tabindex="0" aria-label="Start time"></span></div>
<div class="slots" role="radiogroup" aria-label="Open times"></div><div class="confirm"><p class="picked"></p><lw-button class="book"></lw-button></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.#now = new Date().getHours() * 60 + new Date().getMinutes();
    const start = today();
    // The next working days, starting today.
    for (let iso = start; this.#days.length < DAYS_SHOWN; iso = addDays(iso, 1)) if (weekday(iso) % 6) this.#days.push(iso);
    this.query('.prev').addEventListener('click', () => this.#goDay(this.#day - 1), options);
    this.query('.next').addEventListener('click', () => this.#goDay(this.#day + 1), options);
    this.query('.today').addEventListener('click', () => this.#goDay(0), options);
    this.query('.zone').addEventListener('click', () => {
      this.#zone = (this.#zone + 1) % DEMO_ZONES.length;
      this.#paint();
    }, options);
    this.query('.slots').addEventListener('click', (event) => {
      const slot = event.target.closest('.slot');
      if (slot) this.#pick(Number(slot.dataset.start));
    }, options);
    this.#wireHandle(options);
    this.query('.book').addEventListener('click', () => this.#book(), options);
    // Opens on the first day with room.
    this.#day = Math.max(0, this.#days.findIndex((day) => this.#openings(day).length));
  }

  updated() {
    this.query('.title').textContent = `Intro call with ${this.hostName}`;
    this.query('.initials').textContent = initialsOf(this.hostName ?? '');
    this.style.setProperty('--_hue', hueOf(this.hostName ?? ''));
    this.query('.duration').textContent = `${this.duration} min`;
    this.query('.where').textContent = this.where ?? '';
    if (this.#days.length) this.#goDay(this.#day);
  }

  get #iso() {
    return this.#days[this.#day];
  }

  // Meetings, and on today the time already gone, as [start, end] blocks.
  #blocked(iso) {
    const meetings = this.busy?.[iso] ?? demoBusy(iso);
    if (iso !== this.#days[0] || this.#now <= DAY_START) return meetings;
    // Today, what is gone is one block, and meetings show from there on.
    const gone = Math.min(DAY_END, Math.ceil(this.#now / STEP) * STEP);
    return [[DAY_START, gone], ...meetings.filter(([, b]) => b > gone).map(([a, b]) => [Math.max(a, gone), b])];
  }

  #fits(iso, start) {
    const end = start + this.duration;
    return start >= DAY_START && end <= DAY_END && this.#blocked(iso).every(([a, b]) => end <= a || start >= b);
  }

  // The first start of each free stretch long enough for the call.
  #openings(iso) {
    const openings = [];
    for (let start = DAY_START; start + this.duration <= DAY_END; start += STEP) {
      if (this.#fits(iso, start) && !this.#fits(iso, start - STEP)) openings.push(start);
    }
    return openings;
  }

  #goDay(index) {
    this.#day = Math.min(this.#days.length - 1, Math.max(0, index));
    this.#start = this.#openings(this.#iso)[0] ?? null;
    this.#paint();
  }

  #pick(start) {
    if (!this.#fits(this.#iso, start)) return;
    this.#start = start;
    this.#paint();
  }

  // The nearest start that fits, looking `direction` from `start`, or both ways.
  #nearest(start, direction = 0) {
    const snapped = Math.round(start / STEP) * STEP;
    for (let offset = 0; offset <= DAY_END - DAY_START; offset += STEP) {
      for (const sign of direction ? [direction] : [-1, 1]) {
        const candidate = snapped + sign * offset;
        if (this.#fits(this.#iso, candidate)) return candidate;
      }
    }
    return this.#start;
  }

  #wireHandle(options) {
    const track = this.query('.track');
    const handle = this.query('.handle');
    const toMinutes = (event) => {
      const rect = track.getBoundingClientRect();
      const share = (event.clientX - rect.left) / rect.width;
      return DAY_START + share * (DAY_END - DAY_START) - this.duration / 2;
    };
    track.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      handle.focus();
      track.setPointerCapture(event.pointerId);
      this.toggleAttribute('data-dragging', true);
      this.#start = this.#nearest(toMinutes(event));
      this.#paint();
    }, options);
    track.addEventListener('pointermove', (event) => {
      if (!this.hasAttribute('data-dragging')) return;
      const next = this.#nearest(toMinutes(event));
      if (next !== this.#start) {
        this.#start = next;
        this.#paint();
      }
    }, options);
    for (const type of ['pointerup', 'pointercancel']) track.addEventListener(type, () => this.removeAttribute('data-dragging'), options);
    handle.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key];
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        const openings = this.#openings(this.#iso);
        this.#start = event.key === 'Home' ? openings[0] : this.#nearest(DAY_END - this.duration, -1);
        this.#paint();
        return;
      }
      if (!step || this.#start == null) return;
      event.preventDefault();
      this.#start = this.#nearest(this.#start + step * STEP, step);
      this.#paint();
    }, options);
  }

  // A time of day read in the chosen zone, wrapped into the day.
  #shift(minutes) {
    return (((minutes + DEMO_ZONES[this.#zone].shift) % 1440) + 1440) % 1440;
  }

  #at(minutes) {
    return `${((minutes - DAY_START) / (DAY_END - DAY_START)) * 100}%`;
  }

  #paint() {
    const iso = this.#iso;
    const zone = DEMO_ZONES[this.#zone];
    this.query('.zone-label').textContent = zone.label;
    this.query('.zone').ariaLabel = `Time zone ${zone.label}; change`;
    this.query('.day').textContent = formatDate(iso, 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    this.query('.prev').disabled = this.#day === 0;
    this.query('.next').disabled = this.#day === this.#days.length - 1;
    this.query('.today').disabled = this.#day === 0;
    this.query('.dots').innerHTML = this.#days.map((day, i) => `<span class="dot"${i === this.#day ? ' data-current' : ''}${this.#openings(day).length ? '' : ' data-full'}></span>`).join('');
    const openings = this.#openings(iso);
    this.query('.open').textContent = `${openings.length} open`;

    // Hour marks along the top, read in the chosen zone.
    let hours = '';
    for (let minutes = DAY_START; minutes <= DAY_END; minutes += 60) {
      const shifted = this.#shift(minutes);
      const { time, half } = clockOf(shifted);
      const first = minutes === DAY_START || shifted % 720 === 0;
      hours += `<span style="left: ${this.#at(minutes)}">${time.replace(':00', '')}${first ? ` ${half}` : ''}</span>`;
    }
    this.query('.hours').innerHTML = hours;

    const past = iso === this.#days[0] && this.#now > DAY_START;
    this.query('.blocks').innerHTML = this.#blocked(iso)
      .map(([a, b], i) => `<span class="block" style="left: ${this.#at(a)}; width: calc(${this.#at(b)} - ${this.#at(a)})"><span>${past && i === 0 ? 'Past' : b - a >= 60 ? 'Busy' : ''}</span></span>`)
      .join('');
    const now = this.query('.now');
    now.hidden = !(iso === this.#days[0] && this.#now > DAY_START && this.#now < DAY_END);
    now.style.left = this.#at(this.#now);

    const handle = this.query('.handle');
    handle.hidden = this.#start == null;
    this.query('.slots').innerHTML = openings
      .map((start) => {
        const { time, half } = clockOf(this.#shift(start));
        return `<button class="slot" type="button" role="radio" aria-checked="${start === this.#start}" data-start="${start}">${time}<small>${half}</small></button>`;
      })
      .join('');
    const book = this.query('.book');
    if (this.#start == null) {
      this.query('.picked').textContent = 'No time left this day';
      book.disabled = true;
      book.textContent = 'Book';
      return;
    }
    handle.style.left = this.#at(this.#start);
    handle.style.width = `calc(${this.#at(this.#start + this.duration)} - ${this.#at(this.#start)})`;
    const range = `${label(this.#shift(this.#start))} – ${label(this.#shift(this.#start + this.duration))}`;
    handle.setAttribute('aria-valuetext', range);
    this.query('.picked').textContent = range;
    book.disabled = false;
    book.textContent = `Book ${label(this.#shift(this.#start))}`;
  }

  #book() {
    if (this.#start == null) return;
    const zone = DEMO_ZONES[this.#zone].label;
    this.emit('book', { date: this.#iso, start: this.#start, end: this.#start + this.duration, zone });
    this.query('.picked').textContent = 'Booked. The invite is on its way.';
    this.query('.book').disabled = true;
  }
}
