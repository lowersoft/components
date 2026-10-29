import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { calendarDays, mail, messageCircle, triangleAlert, x } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion } from '../../core/motion.js';
import styles from './notification-stack.scss?inline';

const DEMO_NOTIFICATIONS = [
  { id: 'n-1', app: 'Messages', title: 'Maya Chen', body: 'Pushed the fix. Can you take a look before standup?', time: 'now', icon: messageCircle, color: '#10b981' },
  { id: 'n-2', app: 'Calendar', title: 'Release review in 10 min', body: 'Room 4B · lower 0.9', time: '9:50', icon: calendarDays, color: '#ef4444' },
  { id: 'n-3', app: 'CI', title: 'Nightly build failed on arm64', body: 'The linker dropped debug info. 5 of 6 targets passed.', time: '9:12', icon: mail, color: '#0ea5e9' },
  { id: 'n-4', app: 'Crash reports', title: '12 new crashes in 0.9.2', body: 'One signature: the symbol cache on a full disk.', time: '8:31', icon: triangleAlert },
];

// Collapsed: how much of each card behind the front one peeks out.
const PEEK = 10;
const VISIBLE_BEHIND = 2;
const GAP = 8;
// A swipe dismisses when it travels this far, or when it is a quick flick
// (px per ms), whichever comes first.
const DISMISS_DISTANCE = 100;
const DISMISS_VELOCITY = 0.11;
// Movement before deciding between a horizontal swipe and a vertical scroll.
const AXIS_LOCK = 6;
// Snap back critically damped: it never wobbles past rest, but still carries
// the release momentum a little further before it turns.
const STIFFNESS = 520;
const DAMPING = 2 * Math.sqrt(STIFFNESS);
// A dismissed card keeps its own speed (px/s), never slower than this, and
// picks up a little speed as it goes.
const FLIGHT_MIN_SPEED = 1400;
const FLIGHT_ACCEL = 4200;
const VELOCITY_WINDOW_MS = 80;
const EXIT_MS = 200;
const STEP = 1 / 240;

const opacityFor = (x) => Math.max(1 - Math.abs(x) / 240, 0.3);

const releaseVelocity = (samples) => {
  const last = samples.at(-1);
  if (!last) return 0;
  // The oldest sample within the window: the last stretch, not the average.
  const first = samples.find((sample) => last.t - sample.t <= VELOCITY_WINDOW_MS);
  const dt = last.t - first.t;
  return dt > 0 ? (last.x - first.x) / dt : 0;
};

// Which way a released card leaves, or 0 to spring back. A flick counts only
// when it moves away from rest.
const dismissDirection = (dx, velocity) => {
  const flick = Math.abs(velocity) > DISMISS_VELOCITY && Math.sign(velocity) === Math.sign(dx);
  if (Math.abs(dx) < DISMISS_DISTANCE && !flick) return 0;
  return (dx === 0 ? velocity : dx) > 0 ? 1 : -1;
};

/**
 * A stack of notifications, like a phone's lock screen: collapsed, the cards
 * behind the newest one peek out; hover, focus or a tap fans them out.
 * Swipe a card sideways (or flick it) to dismiss it, press its close button,
 * or press Delete while it has focus.
 *
 * Notifications are `{ id, app, title, body, time, icon?, color? }`, newest
 * first: `icon` is a 24 × 24 stroked SVG's inner markup, shown on `color`.
 *
 * @attr {Array<object>} notifications - The notifications (JSON); dismissed ones leave it
 * @fires lw-dismiss - A notification was dismissed; `detail: { id }`
 */
export class LwNotificationStack extends LwElement {
  static styles = styles;
  static props = {
    notifications: { type: Object, default: DEMO_NOTIFICATIONS },
  };

  #hovered = false;
  #focused = false;
  #pinned = false;
  #leaving = new Set();
  #swipe = new Map();
  #loops = new Map();
  #lastY = new Map();
  #drag = null;
  #suppressClick = false;

  render() {
    return '<div class="head"><p class="heading">Notifications<span class="count"></span></p><button class="toggle" type="button"></button></div><ol class="list" aria-label="Notifications" tabindex="-1"></ol><p class="empty" hidden>You\'re all caught up.</p>';
  }

  connected() {
    const options = { signal: this.signal };
    this.addEventListener('pointerenter', (event) => event.pointerType === 'mouse' && this.#set('hovered', true), options);
    this.addEventListener('pointerleave', (event) => event.pointerType === 'mouse' && this.#set('hovered', false), options);
    this.addEventListener('focusin', () => this.#set('focused', true), options);
    this.addEventListener('focusout', (event) => !this.shadowRoot.contains(event.relatedTarget) && event.relatedTarget !== this && this.#set('focused', false), options);
    this.query('.toggle').addEventListener('click', () => this.#set('pinned', !this.#pinned), options);
    const list = this.query('.list');
    list.addEventListener('pointerdown', (event) => this.#down(event), options);
    list.addEventListener('pointermove', (event) => this.#move(event), options);
    list.addEventListener('pointerup', (event) => this.#up(event), options);
    list.addEventListener('pointercancel', (event) => this.#up(event), options);
    list.addEventListener('lostpointercapture', (event) => event.target.matches('.swipe') && this.#up(event), options);
    list.addEventListener('click', (event) => this.#click(event), options);
    list.addEventListener('keydown', (event) => this.#key(event), options);
    const resize = new ResizeObserver(() => this.#layout());
    resize.observe(list);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      for (const loop of this.#loops.values()) loop.stop();
      this.#loops.clear();
    });
  }

  updated(changed) {
    if (changed.has('notifications')) this.#build();
    this.#layout();
  }

  #set(key, value) {
    if (key === 'hovered') this.#hovered = value;
    if (key === 'focused') this.#focused = value;
    if (key === 'pinned') this.#pinned = value;
    this.#layout();
  }

  get #laidOut() {
    return this.notifications.filter(({ id }) => !this.#leaving.has(id));
  }

  get #expanded() {
    return (this.#hovered || this.#focused || this.#pinned) && this.#laidOut.length > 1;
  }

  #item(id) {
    return this.query(`.list > li[data-id="${CSS.escape(id)}"]`);
  }

  // Cards are added for new notifications; ones that left are removed.
  #build() {
    const list = this.query('.list');
    const ids = new Set(this.notifications.map(({ id }) => id));
    for (const li of [...list.children]) if (!ids.has(li.dataset.id) && !this.#leaving.has(li.dataset.id)) li.remove();
    this.notifications.forEach((item, i) => {
      if (this.#item(item.id)) return;
      const li = document.createElement('li');
      li.dataset.id = item.id;
      const title = escapeHtml(item.title);
      li.innerHTML = `<div class="swipe"><article tabindex="0" aria-label="${escapeHtml(`${item.app}: ${item.title}. ${item.body}`)}"><div class="content"><span class="app-icon"${item.color ? ` style="background: ${escapeHtml(item.color)}"` : ''}>${item.icon ? strokeIcon(item.icon) : ''}</span><div class="text"><div class="line"><p class="title">${title}</p><span class="time">${escapeHtml(item.time)}</span></div><p class="body">${escapeHtml(item.body)}</p></div></div><button class="dismiss" type="button" aria-label="Dismiss ${title}">${strokeIcon(x, 12)}</button></article></div>`;
      list.insertBefore(li, list.children[i] ?? null);
    });
  }

  // Positions every card: fanned out in a column, or stacked with the ones
  // behind bottom-aligned so a strip of each peeks out below the front one.
  #layout() {
    const laidOut = this.#laidOut;
    const expanded = this.#expanded;
    const heights = new Map(laidOut.map(({ id }) => [id, this.#item(id)?.firstElementChild.offsetHeight || 76]));
    const front = laidOut[0] ? heights.get(laidOut[0].id) : 0;
    let running = 0;
    const offsets = laidOut.map(({ id }) => {
      const at = running;
      running += heights.get(id) + GAP;
      return at;
    });
    const list = this.query('.list');
    list.style.height = `${expanded ? Math.max(running - GAP, 0) : front + Math.max(Math.min(laidOut.length - 1, VISIBLE_BEHIND), 0) * PEEK}px`;
    const count = this.notifications.length;
    for (const li of list.children) {
      const id = li.dataset.id;
      const depth = laidOut.findIndex((item) => item.id === id);
      const leaving = depth < 0;
      const hidden = !(expanded || depth <= VISIBLE_BEHIND) && !leaving;
      const scale = expanded || leaving ? 1 : 1 - depth * 0.05;
      const resting = expanded ? offsets[depth] : front + depth * PEEK - heights.get(id) * scale;
      // A leaving card slides away from where it last sat.
      const y = leaving ? (this.#lastY.get(id) ?? 0) : resting;
      if (!leaving) this.#lastY.set(id, resting);
      li.style.transform = `translateY(${y}px) scale(${scale})`;
      li.style.opacity = hidden ? '0' : '';
      li.style.zIndex = String(count - Math.max(depth, 0));
      li.toggleAttribute('data-hidden', hidden);
      // Cards behind show only their edge, so their content fades out.
      li.toggleAttribute('data-muted', !expanded && depth > 0);
      li.toggleAttribute('data-front', !expanded && depth === 0 && laidOut.length > 1);
      for (const focusable of li.querySelectorAll('article, .dismiss')) focusable.tabIndex = hidden ? -1 : 0;
    }
    this.query('.count').textContent = String(laidOut.length);
    const toggle = this.query('.toggle');
    toggle.hidden = laidOut.length < 2;
    toggle.textContent = expanded ? 'Show less' : 'Show all';
    toggle.ariaExpanded = String(expanded);
    this.query('.empty').hidden = laidOut.length > 0;
  }

  // ---- Per-card motion ----

  #paint(id, x) {
    this.#swipe.set(id, x);
    const node = this.#item(id)?.firstElementChild;
    if (!node) return;
    node.style.transform = x === 0 ? '' : `translateX(${x}px)`;
    node.style.opacity = x === 0 ? '' : String(opacityFor(x));
  }

  #stop(id) {
    this.#loops.get(id)?.stop();
    this.#loops.delete(id);
  }

  // Steps a card's simulation until `advance(dt)` reports it is done.
  #run(id, advance, done) {
    this.#stop(id);
    let finished = false;
    const loop = fixedStepLoop(STEP, {
      step: () => (finished = advance(STEP)),
      render: () => {
        if (!finished) return true;
        this.#loops.delete(id);
        done?.();
        return false;
      },
    });
    this.#loops.set(id, loop);
    loop.wake();
  }

  // Springs back to rest, starting at the speed the finger let go at.
  #snapBack(id, velocity) {
    let x = this.#swipe.get(id) ?? 0;
    let v = velocity * 1000;
    if (reducedMotion.matches) {
      this.#paint(id, 0);
      return;
    }
    this.#run(id, (dt) => {
      v += (-STIFFNESS * x - DAMPING * v) * dt;
      x += v * dt;
      const rest = Math.abs(x) < 0.5 && Math.abs(v) < 10;
      this.#paint(id, rest ? 0 : x);
      return rest;
    });
  }

  #finish(id) {
    this.#leaving.delete(id);
    this.#swipe.delete(id);
    this.#lastY.delete(id);
    this.#item(id)?.remove();
    this.notifications = this.notifications.filter((item) => item.id !== id);
    this.emit('dismiss', { id });
  }

  // Throws the card off the side: a swipe keeps the speed it was released
  // at; a button or key starts from rest at the minimum speed.
  #dismiss(id, direction, velocity = 0) {
    if (this.#leaving.has(id)) return;
    const laidOut = this.#laidOut;
    this.#leaving.add(id);
    const li = this.#item(id);
    const node = li.firstElementChild;
    // Focus stays in the stack: on the next card, the previous one, or the
    // list once it is empty.
    if (li.contains(this.shadowRoot.activeElement)) {
      const at = laidOut.findIndex((item) => item.id === id);
      const next = laidOut[at + 1] ?? laidOut[at - 1];
      (next ? this.#item(next.id).querySelector('article') : this.query('.list')).focus();
    }
    this.#layout();
    if (reducedMotion.matches) {
      this.#stop(id);
      node.style.transition = `opacity ${EXIT_MS}ms ease-out`;
      node.style.opacity = '0';
      setTimeout(() => this.#finish(id), EXIT_MS);
      return;
    }
    const distance = node.offsetWidth * 1.1;
    let x = this.#swipe.get(id) ?? 0;
    let speed = Math.max(Math.abs(velocity) * 1000, FLIGHT_MIN_SPEED);
    this.#run(
      id,
      (dt) => {
        speed += FLIGHT_ACCEL * dt;
        x += direction * speed * dt;
        const done = Math.abs(x) >= distance;
        this.#paint(id, done ? direction * distance : x);
        node.style.opacity = String(Math.max(1 - Math.abs(x) / distance, 0));
        return done;
      },
      () => this.#finish(id),
    );
  }

  // ---- Swiping ----

  #down(event) {
    const li = event.target.closest('li');
    if (!li || this.#drag) return;
    const id = li.dataset.id;
    const depth = this.#laidOut.findIndex((item) => item.id === id);
    // Only the front card swipes while the stack is collapsed.
    if (depth < 0 || (!this.#expanded && depth > 0)) return;
    this.#suppressClick = false;
    if ((event.pointerType === 'mouse' && event.button !== 0) || event.target.closest('button')) return;
    // Catch a card that is still springing back from the last swipe.
    this.#stop(id);
    this.#drag = { id, node: li.firstElementChild, pointerId: event.pointerId, x: event.clientX, y: event.clientY, origin: this.#swipe.get(id) ?? 0, dx: 0, axis: null, samples: [] };
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.axis) {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      // Keep the swipe alive when the pointer leaves the card.
      if (drag.axis === 'x') drag.node.setPointerCapture?.(event.pointerId);
    }
    if (drag.axis !== 'x') return;
    drag.dx = drag.origin + dx;
    drag.samples.push({ t: event.timeStamp, x: drag.dx });
    if (drag.samples.length > 12) drag.samples.shift();
    this.#paint(drag.id, drag.dx);
  }

  #up(event) {
    const drag = this.#drag;
    if (drag?.pointerId !== event.pointerId) return;
    this.#drag = null;
    if (drag.axis !== 'x') {
      // A tap or scroll that caught a card mid spring lets it finish.
      if (this.#swipe.get(drag.id)) this.#snapBack(drag.id, 0);
      return;
    }
    this.#suppressClick = true;
    const velocity = releaseVelocity(drag.samples);
    const direction = dismissDirection(drag.dx, velocity);
    if (direction === 0) this.#snapBack(drag.id, velocity);
    // Never carry speed that points back toward the stack into the flight.
    else this.#dismiss(drag.id, direction, Math.sign(velocity) === direction ? velocity : 0);
  }

  #click(event) {
    const li = event.target.closest('li');
    if (!li) return;
    if (event.target.closest('.dismiss')) {
      event.stopPropagation();
      this.#dismiss(li.dataset.id, 1);
      return;
    }
    if (this.#suppressClick) {
      this.#suppressClick = false;
      return;
    }
    // A tap on the collapsed stack fans it out.
    if (event.target.closest('article') && !this.#expanded) this.#set('pinned', true);
  }

  #key(event) {
    if ((event.key !== 'Delete' && event.key !== 'Backspace') || !event.target.matches('article')) return;
    event.preventDefault();
    // A held key would clear the next card too, now that focus moves to it.
    if (!event.repeat) this.#dismiss(event.target.closest('li').dataset.id, 1);
  }
}
