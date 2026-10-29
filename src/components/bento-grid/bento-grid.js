import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { gripVertical } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, vibrate } from '../../core/motion.js';
import styles from './bento-grid.scss?inline';
import { DEMO_WIDGETS } from './widgets.js';

const COLUMNS = 6;
const NARROW_COLUMNS = 2;
const MIN_SPAN = 2;
const GAP = 12;
// Below this width the grid has two columns.
const NARROW_BELOW = 576;
const LONG_PRESS_MS = 350;
const PRESS_SLOP = 8;
const LIFT_Z = 18;
const MAX_TILT = 7;
const STEP = 1 / 120;
const SIZE_LABEL = { s: 'small', m: 'medium', l: 'large' };
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

const spring = (k, zeta) => ({ k, c: 2 * Math.sqrt(k) * zeta });
const MOVE_SPRING = spring(420, 0.76);
const LIFT_SPRING = spring(520, 0.82);
const TILT_SPRING = spring(260, 0.6);

/** The layout a widget shows for a column span: small, medium or large. */
export const sizeForSpan = (span, narrow = false) => {
  if (narrow) return span <= MIN_SPAN ? 's' : 'm';
  if (span <= 2) return 's';
  return span <= 4 ? 'm' : 'l';
};

const clampSpan = (span) => Math.min(COLUMNS, Math.max(MIN_SPAN, Math.round(span)));
// In the two-column layout, small widgets take one column, the rest both.
const narrowSpan = (span) => (span <= MIN_SPAN ? 1 : 2);
const moveItem = (list, from, to) => {
  const next = list.slice();
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
};
const contains = (rect, x, y) => x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
const r2 = (n) => Math.round(n * 100) / 100;
const r3 = (n) => Math.round(n * 1000) / 1000;
const clampTilt = (v) => Math.max(-MAX_TILT, Math.min(MAX_TILT, v));

const createBody = () => ({ ox: 0, oy: 0, vx: 0, vy: 0, sx: 1, sy: 1, vsx: 0, vsy: 0, lift: 0, vlift: 0, liftTarget: 0, rx: 0, ry: 0, vrx: 0, vry: 0, pvx: 0, pvy: 0, hold: 0, pinned: false });

const integrate = (b, key, speed, target, cfg) => {
  b[speed] += (-cfg.k * (b[key] - target) - cfg.c * b[speed]) * STEP;
  b[key] += b[speed] * STEP;
};

const stepBody = (b) => {
  // Lean toward the drag direction: the right edge dips when moving right.
  integrate(b, 'ry', 'vry', b.pinned ? clampTilt(b.pvx * 9) : 0, TILT_SPRING);
  integrate(b, 'rx', 'vrx', b.pinned ? clampTilt(-b.pvy * 9) : 0, TILT_SPRING);
  integrate(b, 'lift', 'vlift', b.liftTarget, LIFT_SPRING);
  // Pointer velocity decays when the pointer rests, so the tilt settles.
  b.pvx *= Math.exp(-STEP * 10);
  b.pvy *= Math.exp(-STEP * 10);
  if (b.hold > 0) {
    b.hold -= STEP;
    return;
  }
  if (!b.pinned) {
    integrate(b, 'ox', 'vx', 0, MOVE_SPRING);
    integrate(b, 'oy', 'vy', 0, MOVE_SPRING);
  }
  integrate(b, 'sx', 'vsx', 1, MOVE_SPRING);
  integrate(b, 'sy', 'vsy', 1, MOVE_SPRING);
};

const near = (x, v, target, eps) => Math.abs(x - target) < eps && Math.abs(v) < eps * 10;
const isSettled = (b) =>
  !b.pinned &&
  b.hold <= 0 &&
  near(b.ox, b.vx, 0, 0.2) &&
  near(b.oy, b.vy, 0, 0.2) &&
  near(b.sx, b.vsx, 1, 0.001) &&
  near(b.sy, b.vsy, 1, 0.001) &&
  near(b.lift, b.vlift, b.liftTarget, 0.002) &&
  near(b.rx, b.vrx, 0, 0.02) &&
  near(b.ry, b.vry, 0, 0.02);

const snapBody = (b) => {
  if (!b.pinned) Object.assign(b, { ox: 0, oy: 0 });
  Object.assign(b, { vx: 0, vy: 0, sx: 1, sy: 1, vsx: 0, vsy: 0, lift: b.liftTarget, vlift: 0, rx: 0, ry: 0, vrx: 0, vry: 0, hold: 0 });
};

const RESIZE_MARK = '<svg viewBox="0 0 10 10" aria-hidden="true"><circle cx="8.5" cy="3.5" r="1.1"/><circle cx="6" cy="6" r="1.1"/><circle cx="3.5" cy="8.5" r="1.1"/></svg>';

/**
 * A dashboard of widgets to arrange: press and hold a widget (or drag its
 * grip) to lift it and move it, with its neighbours springing aside in a
 * ripple; drag the corner to resize it, and the widget switches between its
 * small, medium and large layouts. With the keyboard, Space lifts a widget,
 * the arrow keys move it, Space drops it and Escape cancels.
 *
 * Items are `{ id, title, icon?, span?, render(size) }`: `span` is the width
 * in columns of the 6-column grid (2 to 6), `render` returns the body's
 * markup for `s`, `m` or `l`, and `icon` is a 24 × 24 stroked SVG's inner
 * markup. Set them as a property.
 *
 * @attr {Array<{id: string, span: number}>} layout - Order and spans (JSON); kept up to date as widgets move
 * @attr {number} row-height - Height of one row, in px
 * @fires lw-change - The layout changed, also while dragging; `detail: { layout }`
 * @cssprop --lw-bento-grid-accent - The one accent colour
 */
export class LwBentoGrid extends LwElement {
  static styles = styles;
  static props = {
    items: { type: Object, default: DEMO_WIDGETS },
    layout: { type: Object, default: null },
    rowHeight: { type: Number, default: 176 },
  };

  #layout = [];
  #cells = new Map();
  #bodies = new Map();
  #rects = new Map();
  #narrow = false;
  #drag = null;
  #press = null;
  #resize = null;
  #pointed = null;
  #moving = false;
  #loop = fixedStepLoop(STEP, {
    step: () => this.#bodies.forEach((body) => stepBody(body)),
    render: () => this.#frame(),
  });

  render() {
    return '<div class="wrap"><div class="grid"><svg class="slots" aria-hidden="true"></svg></div><p class="visually-hidden" id="instructions">Press Space to pick up. Use the arrow keys to move, Space to drop and Escape to cancel. With a pointer, press and hold a widget, then drag it.</p><p class="visually-hidden" aria-live="assertive"></p></div>';
  }

  connected() {
    const options = { signal: this.signal };
    const grid = this.query('.grid');
    grid.addEventListener('pointerdown', (event) => this.#pointerDown(event), options);
    grid.addEventListener('keydown', (event) => this.#keyDown(event), options);
    grid.addEventListener('focusin', (event) => event.target.matches(':focus-visible') && this.#point(event.target.closest('.cell')?.dataset.id), options);
    grid.addEventListener('focusout', (event) => this.#focusOut(event), options);
    grid.addEventListener('pointerover', (event) => event.pointerType === 'mouse' && this.#point(event.target.closest('.cell')?.dataset.id), options);
    grid.addEventListener('pointerleave', () => this.#point(null), options);
    grid.addEventListener('contextmenu', (event) => (this.#drag || event.pointerType === 'touch') && event.preventDefault(), options);
    // Stops the page scrolling while a cell is held; until the long press
    // fires, touch scrolling is left alone.
    grid.addEventListener('touchmove', (event) => (this.#drag?.mode === 'pointer' || this.#resize) && event.preventDefault(), { ...options, passive: false });
    const resize = new ResizeObserver(() => this.#relayout());
    resize.observe(this.query('.wrap'));
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      this.#loop.stop();
      this.#cancelPress();
      this.#endDrag(false);
      this.#endResize();
    });
  }

  updated(changed) {
    if (changed.has('rowHeight')) this.query('.grid').style.gridAutoRows = `${this.rowHeight}px`;
    if (changed.has('items')) this.#build();
    if (changed.has('items') || (changed.has('layout') && this.layout !== this.#layout)) this.#setLayout(this.#normalize(this.layout ?? []), null);
  }

  get #items() {
    return new Map(this.items.map((item) => [item.id, item]));
  }

  #normalize(layout) {
    const items = this.#items;
    const seen = new Set();
    const out = [];
    for (const { id, span } of layout) {
      if (!items.has(id) || seen.has(id)) continue;
      seen.add(id);
      out.push({ id, span: clampSpan(span) });
    }
    for (const item of this.items) if (!seen.has(item.id)) out.push({ id: item.id, span: clampSpan(item.span ?? MIN_SPAN) });
    return out;
  }

  #build() {
    for (const cell of this.#cells.values()) cell.remove();
    this.#cells.clear();
    this.#bodies.clear();
    for (const item of this.items) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.id = item.id;
      cell.innerHTML = `<div class="surface"><div class="shadow"></div></div><div class="inner"><div class="head"><span class="icon" aria-hidden="true">${item.icon ? strokeIcon(item.icon, 14) : ''}</span><span class="name">${escapeHtml(item.title)}</span><button class="grip" type="button" aria-describedby="instructions" aria-pressed="false">${strokeIcon(gripVertical)}</button></div><div class="body"></div></div><button class="resize" type="button">${RESIZE_MARK}</button>`;
      this.#cells.set(item.id, cell);
      this.#bodies.set(item.id, createBody());
    }
  }

  #title(id) {
    return this.#items.get(id)?.title ?? id;
  }

  #position(id) {
    return `position ${this.#layout.findIndex((entry) => entry.id === id) + 1} of ${this.#layout.length}`;
  }

  #announce(text) {
    const live = this.query('[aria-live]');
    // A trailing space makes a repeated message read again.
    live.textContent = live.textContent === text ? `${text} ` : text;
  }

  // ---- Layout ----

  // Applies a layout: cells in order with their spans and size layouts, then
  // every moved cell springs from where it was drawn (FLIP).
  #setLayout(next, movedId) {
    const before = new Map(this.#rects);
    const focused = this.shadowRoot.activeElement;
    this.#layout = next;
    this.layout = next;
    this.#narrow = this.query('.wrap').clientWidth < NARROW_BELOW && this.query('.wrap').clientWidth > 0;
    this.toggleAttribute('data-narrow', this.#narrow);
    const grid = this.query('.grid');
    next.forEach(({ id, span }, i) => {
      const cell = this.#cells.get(id);
      // Only cells out of place move, so the rest keep focus and hover.
      const at = grid.children[i + 1];
      if (at !== cell) grid.insertBefore(cell, at ?? null);
      cell.style.setProperty('--_span', span);
      cell.style.setProperty('--_span-n', narrowSpan(span));
      this.#paintCell(id, span);
    });
    // Moving a node drops its focus; put it back.
    if (focused && this.shadowRoot.activeElement !== focused) focused.focus({ preventScroll: true });
    this.#measure();
    if (movedId) this.#flip(before, movedId);
    this.#placeDragged();
    this.#paintSlots();
  }

  #commit(next, movedId) {
    this.#setLayout(next, movedId);
    this.emit('change', { layout: next });
  }

  #relayout() {
    if (!this.#layout.length) return;
    const narrow = this.query('.wrap').clientWidth < NARROW_BELOW;
    if (narrow !== this.#narrow) this.#setLayout(this.#layout, null);
    else {
      this.#measure();
      this.#placeDragged();
    }
  }

  // Labels, and the body for the cell's size; a new size crossfades in.
  #paintCell(id, span) {
    const cell = this.#cells.get(id);
    const item = this.#items.get(id);
    const size = sizeForSpan(span, this.#narrow);
    const columns = this.#narrow ? NARROW_COLUMNS : COLUMNS;
    const lifted = this.#drag?.id === id;
    cell.querySelector('.grip').ariaLabel = `Move ${item.title} (${SIZE_LABEL[size]})`;
    cell.querySelector('.grip').ariaPressed = String(lifted);
    cell.querySelector('.resize').ariaLabel = `Resize ${item.title}, ${this.#narrow ? narrowSpan(span) : span} of ${columns} columns`;
    cell.toggleAttribute('data-lifted', lifted);
    const body = cell.querySelector('.body');
    if (body.dataset.size === size) return;
    const first = !body.dataset.size;
    body.dataset.size = size;
    const view = document.createElement('div');
    view.className = 'view';
    view.innerHTML = item.render?.(size) ?? '';
    for (const old of body.querySelectorAll('.view')) {
      if (first || reducedMotion.matches) old.remove();
      else old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: EASE_OUT }).finished.then(() => old.remove(), () => old.remove());
    }
    body.append(view);
    if (!first && !reducedMotion.matches) view.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: EASE_OUT });
  }

  // offset* ignore transforms, so these are the cells' resting slots.
  #measure() {
    this.#rects = new Map([...this.#cells].map(([id, el]) => [id, { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }]));
  }

  // Every moved cell starts where it was drawn and springs home; nearer
  // neighbours leave first, so the shuffle ripples outward.
  #flip(before, movedId) {
    const origin = this.#rects.get(movedId);
    const cx = origin ? origin.x + origin.w / 2 : 0;
    const cy = origin ? origin.y + origin.h / 2 : 0;
    const pinned = this.#drag?.mode === 'pointer' ? this.#drag.id : null;
    for (const [id, next] of this.#rects) {
      const prev = before.get(id);
      if (!prev || id === pinned || !next.w) continue;
      const body = this.#bodies.get(id);
      const moved = Math.abs(prev.x - next.x) > 0.5 || Math.abs(prev.y - next.y) > 0.5 || prev.w !== next.w;
      body.ox += prev.x - next.x;
      body.oy += prev.y - next.y;
      body.sx = (prev.w * body.sx) / next.w;
      body.sy = (prev.h * body.sy) / next.h;
      if (moved && id !== movedId) body.hold = Math.min(0.1, Math.hypot(next.x + next.w / 2 - cx, next.y + next.h / 2 - cy) * 0.000_16);
      this.#write(id);
    }
    this.#loop.wake();
  }

  #write(id) {
    const cell = this.#cells.get(id);
    const b = this.#bodies.get(id);
    const atRest = !b.ox && !b.oy && !b.lift && !b.rx && !b.ry;
    cell.style.transform = atRest ? '' : `translate3d(${r2(b.ox)}px, ${r2(b.oy)}px, ${r2(b.lift * LIFT_Z)}px) rotateX(${r2(b.rx)}deg) rotateY(${r2(b.ry)}deg)`;
    const surface = cell.firstElementChild;
    surface.style.transform = b.sx === 1 && b.sy === 1 ? '' : `scale(${r3(b.sx)}, ${r3(b.sy)})`;
    surface.firstElementChild.style.opacity = String(r2(Math.max(0, Math.min(1, b.lift))));
  }

  #frame() {
    let active = false;
    for (const [id, body] of this.#bodies) {
      if (reducedMotion.matches || isSettled(body)) snapBody(body);
      else active = true;
      this.#write(id);
    }
    return active;
  }

  #toGrid(clientX, clientY) {
    const box = this.query('.grid').getBoundingClientRect();
    return { x: clientX - box.left, y: clientY - box.top };
  }

  // Keeps a pointer-held cell under the pointer, even after its slot moved.
  #placeDragged() {
    const drag = this.#drag;
    const rect = drag && this.#rects.get(drag.id);
    if (!rect || drag.mode !== 'pointer') return;
    const p = this.#toGrid(drag.lastX, drag.lastY);
    const body = this.#bodies.get(drag.id);
    body.ox = p.x - drag.grabX - rect.x;
    body.oy = p.y - drag.grabY - rect.y;
    this.#write(drag.id);
    this.#loop.wake();
  }

  // While a cell is held or resized, a dot sits at every gutter crossing, so
  // the slots it can land in read like a cutting mat.
  #paintSlots() {
    const svg = this.query('.slots');
    const show = Boolean(this.#drag || this.#resize);
    svg.hidden = !show;
    if (!show) return;
    const grid = this.query('.grid');
    const columns = this.#narrow ? NARROW_COLUMNS : COLUMNS;
    const rows = Math.max(1, Math.round((grid.offsetHeight + GAP) / (this.rowHeight + GAP)));
    let dots = '';
    for (let col = 0; col <= columns; col++) for (let row = 0; row <= rows; row++) dots += `<circle cx="${(col / columns) * 100}%" cy="${(row / rows) * 100}%" r="1.5"/>`;
    svg.innerHTML = dots;
  }

  // The cell last hovered or focused stays lit while the others dim.
  #point(id) {
    this.#pointed = id ?? null;
    this.#paintDim();
  }

  #focusOut(event) {
    const cell = event.target.closest('.cell');
    if (cell && !cell.contains(event.relatedTarget) && this.#pointed === cell.dataset.id) this.#point(null);
    // Leaving a lifted grip by Tab drops it where it is.
    if (this.#drag?.mode === 'keyboard' && event.target.matches('.grip') && !this.#moving) this.#endDrag(false);
  }

  #paintDim() {
    const active = this.#drag?.id ?? this.#resize?.id ?? this.#pointed;
    for (const [id, cell] of this.#cells) cell.toggleAttribute('data-dimmed', active !== null && active !== id);
  }

  // ---- Pointer: long press, grip and resize ----

  #pointerDown(event) {
    if (event.button !== 0) return;
    const cell = event.target.closest('.cell');
    if (!cell || this.#drag || this.#resize) return;
    const id = cell.dataset.id;
    if (event.target.closest('.resize')) {
      event.preventDefault();
      this.#startResize(event, id);
    } else if (event.target.closest('.grip')) {
      event.preventDefault();
      this.#cancelPress();
      this.#liftPointer(id, event);
    } else {
      this.#startPress(event, id);
    }
  }

  #startPress(event, id) {
    this.#cancelPress();
    const listening = new AbortController();
    const press = { id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, listening };
    press.timer = setTimeout(() => {
      this.#cancelPress();
      this.#liftPointer(id, { pointerId: press.pointerId, clientX: press.x, clientY: press.y });
    }, LONG_PRESS_MS);
    this.#press = press;
    const options = { signal: listening.signal };
    window.addEventListener(
      'pointermove',
      (move) => {
        if (move.pointerId !== press.pointerId) return;
        press.x = move.clientX;
        press.y = move.clientY;
        // Moving first means scrolling (touch) or selecting (mouse), not lifting.
        if (Math.hypot(move.clientX - press.startX, move.clientY - press.startY) > PRESS_SLOP) this.#cancelPress();
      },
      options,
    );
    for (const type of ['pointerup', 'pointercancel']) window.addEventListener(type, () => this.#cancelPress(), options);
  }

  #cancelPress() {
    if (!this.#press) return;
    clearTimeout(this.#press.timer);
    this.#press.listening.abort();
    this.#press = null;
  }

  #lift(id, drag) {
    this.#drag = { id, skipId: null, snapshot: this.#layout, listening: new AbortController(), ...drag };
    const body = this.#bodies.get(id);
    body.liftTarget = 1;
    this.#loop.wake();
    this.#paintCell(id, this.#layout.find((entry) => entry.id === id).span);
    this.#paintDim();
    this.#paintSlots();
  }

  #liftPointer(id, { pointerId, clientX, clientY }) {
    const rect = this.#rects.get(id);
    if (!rect || this.#drag) return;
    const body = this.#bodies.get(id);
    const p = this.#toGrid(clientX, clientY);
    Object.assign(body, { pinned: true, hold: 0, vx: 0, vy: 0, pvx: 0, pvy: 0 });
    this.#lift(id, { mode: 'pointer', pointerId, grabX: p.x - (rect.x + body.ox), grabY: p.y - (rect.y + body.oy), lastX: clientX, lastY: clientY, lastT: performance.now() });
    this.#announce(`${this.#title(id)} lifted, ${this.#position(id)}.`);
    vibrate(8);
    const options = { signal: this.#drag.listening.signal };
    window.addEventListener('pointermove', (event) => this.#dragMove(event), options);
    for (const type of ['pointerup', 'pointercancel']) window.addEventListener(type, (event) => event.pointerId === this.#drag?.pointerId && this.#endDrag(false), options);
    window.addEventListener('keydown', (event) => event.key === 'Escape' && (event.preventDefault(), this.#endDrag(true)), options);
  }

  #dragMove(event) {
    const drag = this.#drag;
    if (drag?.mode !== 'pointer' || event.pointerId !== drag.pointerId) return;
    const now = performance.now();
    const dt = Math.max(1, now - drag.lastT);
    const body = this.#bodies.get(drag.id);
    body.pvx += ((event.clientX - drag.lastX) / dt - body.pvx) * 0.35;
    body.pvy += ((event.clientY - drag.lastY) / dt - body.pvy) * 0.35;
    Object.assign(drag, { lastX: event.clientX, lastY: event.clientY, lastT: now });
    this.#placeDragged();
    const p = this.#toGrid(event.clientX, event.clientY);
    this.#hitTest(p.x, p.y);
  }

  #hitTest(x, y) {
    const drag = this.#drag;
    // Ignore the cell just swapped with until the pointer leaves it, so cells
    // of different widths don't flip back and forth.
    if (drag.skipId) {
      const skip = this.#rects.get(drag.skipId);
      if (skip && contains(skip, x, y)) return;
      drag.skipId = null;
    }
    const list = this.#layout;
    const from = list.findIndex((entry) => entry.id === drag.id);
    const to = list.findIndex((entry) => entry.id !== drag.id && contains(this.#rects.get(entry.id), x, y));
    if (to < 0) return;
    drag.skipId = list[to].id;
    this.#commit(moveItem(list, from, to), drag.id);
    this.#announce(`${this.#title(drag.id)} moved to position ${to + 1} of ${list.length}.`);
  }

  #endDrag(cancel) {
    const drag = this.#drag;
    if (!drag) return;
    drag.listening.abort();
    const body = this.#bodies.get(drag.id);
    // Carry some of the throw into the settle spring.
    if (drag.mode === 'pointer') Object.assign(body, { vx: body.pvx * 400, vy: body.pvy * 400 });
    body.pinned = false;
    body.liftTarget = 0;
    this.#drag = null;
    if (cancel) this.#commit(drag.snapshot, drag.id);
    this.#loop.wake();
    this.#paintCell(drag.id, this.#layout.find((entry) => entry.id === drag.id).span);
    this.#paintDim();
    this.#paintSlots();
    const title = this.#title(drag.id);
    if (cancel) this.#announce(`Move cancelled. ${title} returned to position ${drag.snapshot.findIndex((entry) => entry.id === drag.id) + 1} of ${drag.snapshot.length}.`);
    else this.#announce(`${title} dropped at ${this.#position(drag.id)}.`);
  }

  #spanText(span) {
    const shown = this.#narrow ? narrowSpan(span) : span;
    return `${shown} of ${this.#narrow ? NARROW_COLUMNS : COLUMNS} columns, ${SIZE_LABEL[sizeForSpan(span, this.#narrow)]}`;
  }

  #applySpan(id, span) {
    const entry = this.#layout.find((item) => item.id === id);
    if (!entry || entry.span === span) return;
    this.#commit(
      this.#layout.map((item) => (item.id === id ? { ...item, span } : item)),
      id,
    );
    this.#announce(`${this.#title(id)} resized to ${this.#spanText(span)}.`);
  }

  // A whole-column span from how far the handle moved since the press, so it
  // stays stable when the cell wraps rows. Narrow grids only toggle between
  // half and full width.
  #spanFromPointer(clientX) {
    const start = this.#resize;
    const columns = this.#narrow ? NARROW_COLUMNS : COLUMNS;
    const steps = Math.round((clientX - start.x) / ((this.query('.grid').clientWidth + GAP) / columns));
    if (!this.#narrow) return clampSpan(start.span + steps);
    return Math.max(1, Math.min(2, narrowSpan(start.span) + steps)) === 1 ? MIN_SPAN : Math.max(3, start.span);
  }

  #startResize(event, id) {
    this.#cancelPress();
    this.#resize = { id, x: event.clientX, span: this.#layout.find((entry) => entry.id === id).span, listening: new AbortController() };
    const options = { signal: this.#resize.listening.signal };
    window.addEventListener('pointermove', (move) => this.#applySpan(id, this.#spanFromPointer(move.clientX)), options);
    for (const type of ['pointerup', 'pointercancel']) window.addEventListener(type, () => this.#endResize(), options);
    this.#paintDim();
    this.#paintSlots();
  }

  #endResize() {
    if (!this.#resize) return;
    this.#resize.listening.abort();
    this.#resize = null;
    this.#paintDim();
    this.#paintSlots();
  }

  // ---- Keyboard ----

  // Index of the closest cell in the row above or below.
  #verticalNeighbour(id, up) {
    const current = this.#rects.get(id);
    let best = -1;
    let bestDy = Number.POSITIVE_INFINITY;
    let bestDx = Number.POSITIVE_INFINITY;
    const cx = current.x + current.w / 2;
    this.#layout.forEach((entry, i) => {
      const rect = this.#rects.get(entry.id);
      const inRow = up ? rect.y + rect.h <= current.y + 1 : rect.y >= current.y + current.h - 1;
      if (!inRow) return;
      const dy = Math.abs(rect.y - current.y);
      const dx = Math.abs(rect.x + rect.w / 2 - cx);
      if (dy < bestDy - 1 || (Math.abs(dy - bestDy) <= 1 && dx < bestDx)) [best, bestDy, bestDx] = [i, dy, dx];
    });
    return best;
  }

  #neighbour(id, key) {
    const index = this.#layout.findIndex((entry) => entry.id === id);
    if (key === 'ArrowLeft') return Math.max(0, index - 1);
    if (key === 'ArrowRight') return Math.min(this.#layout.length - 1, index + 1);
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      const found = this.#verticalNeighbour(id, key === 'ArrowUp');
      return found < 0 ? index : found;
    }
    return null;
  }

  #keyDown(event) {
    const cell = event.target.closest('.cell');
    if (!cell) return;
    const id = cell.dataset.id;
    if (event.target.matches('.resize')) {
      this.#resizeKey(event, id);
      return;
    }
    if (!event.target.matches('.grip')) return;
    const drag = this.#drag;
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (drag?.id === id) this.#endDrag(false);
      else if (!drag) {
        this.#lift(id, { mode: 'keyboard' });
        this.#announce(`${this.#title(id)} lifted, ${this.#position(id)}. Arrow keys move it, Space drops it, Escape cancels.`);
      }
      return;
    }
    if (drag?.id !== id || drag.mode !== 'keyboard') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#moving = true;
      this.#endDrag(true);
      this.#moving = false;
      return;
    }
    const to = this.#neighbour(id, event.key);
    if (to === null) return;
    event.preventDefault();
    const from = this.#layout.findIndex((entry) => entry.id === id);
    if (to === from) {
      this.#announce(`${this.#title(id)} is at ${this.#position(id)}.`);
      return;
    }
    this.#moving = true;
    this.#commit(moveItem(this.#layout, from, to), id);
    this.#moving = false;
    this.#announce(`${this.#title(id)} moved to position ${to + 1} of ${this.#layout.length}.`);
  }

  #resizeKey(event, id) {
    const entry = this.#layout.find((item) => item.id === id);
    const delta = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    let span = clampSpan(entry.span + delta);
    if (this.#narrow) span = delta > 0 ? Math.max(3, entry.span) : MIN_SPAN;
    this.#applySpan(id, span);
  }
}
