import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { gitBranch, messageCircle, pause, play, userPlus } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { drawFace } from '../../core/testimonial.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './activity-feed.scss?inline';

const ROCKET = '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>';
const CIRCLE_DOT = '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>';

const KINDS = {
  invite: { icon: userPlus, verb: 'invited' },
  deploy: { icon: ROCKET, verb: 'released' },
  reply: { icon: messageCircle, verb: 'replied on' },
  close: { icon: CIRCLE_DOT, verb: 'closed' },
  merge: { icon: gitBranch, verb: 'merged' },
};

// The demo stream, played in a loop.
const DEMO_EVENTS = [
  { who: 'Theo Park', kind: 'merge', ref: '#419', what: 'Lazy-load the symbol table', project: 'runtime', detail: '+64 −210 in 4 files' },
  { who: 'Ana Ruiz', kind: 'close', ref: '#418', what: 'ARM build drops debug info', project: 'toolchain', detail: 'Fixed by #421' },
  { who: 'Jonas Weber', kind: 'reply', ref: '#412', what: 'Flame graph depth limit', project: 'profiler', detail: '“Raise it to 2048, then measure.”' },
  { who: 'Maya Lin', kind: 'deploy', ref: 'v0.9.2', what: 'to the nightly channel', project: 'runtime', detail: 'Built in 41 s · 1.4 MB' },
  { who: 'Priya Nair', kind: 'invite', ref: '', what: 'lena@northwind.dev', project: 'workspace', detail: 'As an editor on profiler' },
  { who: 'Leo Martins', kind: 'merge', ref: '#423', what: 'SIMD path for the JSON scanner', project: 'runtime', detail: '+188 −12 in 3 files' },
  { who: 'Sam Okafor', kind: 'close', ref: '#425', what: 'Cold start regressed on Linux', project: 'runtime', detail: 'Back to 9 ms' },
];

const SHOWN = 5;

const age = (ms) => {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 10) return 'now';
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m`;
};

/**
 * A live activity feed: new events slide in at the top as they happen and
 * the oldest fall off the bottom, each with who, what, where and how long
 * ago. It plays while in view; pause holds it, and reduced motion starts
 * it paused.
 *
 * Events are `{ who, kind, ref, what, project, detail }`, `kind` one of
 * invite, deploy, reply, close or merge. Call `add(event)` to push one.
 *
 * @attr {number} interval - Seconds between demo events
 * @attr {boolean} paused
 * @attr {Array<object>} events - The stream to play (JSON)
 * @fires lw-add - An event came in; `detail: { event }`
 */
export class LwActivityFeed extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    interval: { type: Number, default: 3.5 },
    paused: { type: Boolean, reflect: true },
    events: { type: Object, default: DEMO_EVENTS },
  };

  #next = 0;
  #timer = 0;
  #clock = 0;
  #visible = false;

  render() {
    return `<header class="head"><h2 class="title">Activity <span class="live">Live</span></h2><button class="toggle" type="button"></button></header><ol class="feed" role="log" aria-label="Activity"></ol>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.toggle').addEventListener('click', () => (this.paused = !this.paused), options);
    if (reducedMotion.matches) this.paused = true;
    watchVisibility(this, (visible) => {
      this.#visible = visible;
      this.#schedule();
    }, this.signal);
    this.#clock = setInterval(() => this.#paintAges(), 1000);
    this.signal.addEventListener('abort', () => {
      clearTimeout(this.#timer);
      clearInterval(this.#clock);
    });
  }

  updated(changed) {
    if (changed.has('events') && !this.query('.feed').children.length) {
      // Starts with a few already in, a little apart.
      this.events.slice(0, SHOWN).reverse().forEach((event, i) => this.#prepend(event, Date.now() - (SHOWN - i) * 6000, false));
      this.#next = SHOWN % this.events.length;
    }
    const toggle = this.query('.toggle');
    toggle.innerHTML = strokeIcon(this.paused ? play : pause, 16);
    toggle.ariaLabel = this.paused ? 'Play' : 'Pause';
    this.query('.live').toggleAttribute('data-paused', this.paused);
    this.query('.feed').ariaLive = this.paused ? 'off' : 'polite';
    this.#schedule();
  }

  /** Adds an event at the top. */
  add(event) {
    this.#prepend(event, Date.now(), !reducedMotion.matches);
    this.emit('add', { event });
  }

  #schedule() {
    clearTimeout(this.#timer);
    if (this.paused || !this.#visible || !this.events?.length) return;
    this.#timer = setTimeout(() => {
      this.add(this.events[this.#next]);
      this.#next = (this.#next + 1) % this.events.length;
      this.#schedule();
    }, this.interval * 1000);
  }

  #prepend(event, at, animate) {
    const kind = KINDS[event.kind] ?? KINDS.merge;
    const item = document.createElement('li');
    item.className = 'item';
    item.dataset.at = String(at);
    item.innerHTML = `<span class="avatar"><span class="face"></span><span class="badge" data-kind="${escapeHtml(event.kind)}">${strokeIcon(kind.icon, 11)}</span></span>
<div class="text"><p class="line"><b>${escapeHtml(event.who)}</b> <span class="verb">${kind.verb}</span> ${event.ref ? `<code>${escapeHtml(event.ref)}</code> ` : ''}<span class="what">${escapeHtml(event.what)}</span></p><p class="sub"><span class="project">${escapeHtml(event.project)}</span><span class="detail">${escapeHtml(event.detail)}</span></p></div><time class="age"></time>`;
    drawFace(item.querySelector('.face'), event.who);
    const feed = this.query('.feed');
    feed.prepend(item);
    this.#paintAges();
    if (animate) {
      const height = item.offsetHeight;
      item.animate({ height: ['0px', `${height}px`], opacity: [0, 1], translate: ['0 -0.5rem', '0 0'] }, { duration: 400, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    }
    // The oldest fall off the bottom.
    while (feed.children.length > SHOWN) {
      const last = feed.lastElementChild;
      last.remove();
    }
  }

  #paintAges() {
    for (const item of this.shadowRoot.querySelectorAll('.item')) {
      const time = item.querySelector('.age');
      const text = age(Date.now() - Number(item.dataset.at));
      if (time.textContent !== text) time.textContent = text;
      time.toggleAttribute('data-fresh', text === 'now');
    }
  }
}
