import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springTo } from '../../core/motion.js';
import styles from './smooth-tab.scss?inline';

// Past the first or last tab the panel moves this fraction of the drag.
const RUBBER_BAND = 0.35;
// A release this fast (px per ms) changes tab however short the drag was.
const SWIPE_VELOCITY = 0.11;
// Movement before deciding between a horizontal swipe and a vertical scroll.
const AXIS_LOCK = 6;
// Release velocity is measured over the last stretch of the drag only.
const VELOCITY_WINDOW = 100;
// A panel one full width away sits at this opacity, so the neighbour reads
// as "next" while it slides in.
const NEIGHBOUR_OPACITY = 0.35;
// Just under critical damping: a firm settle, a hint of overshoot only after
// a fast flick.
const SPRING = { stiffness: 420, damping: 38 };

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// The indicator rectangle at a fractional tab position.
const indicatorRect = (rects, progress) => {
  const last = rects.length - 1;
  if (last < 0) return null;
  const p = clamp(progress, 0, last);
  const i = Math.min(Math.floor(p), Math.max(last - 1, 0));
  const a = rects[i];
  const b = rects[Math.min(i + 1, last)];
  let left = lerp(a.left, b.left, p - i);
  let width = lerp(a.width, b.width, p - i);
  // Rubber-banding past an end: the pill presses against the wall and gives
  // on the far side instead of sliding out of the track.
  const over = progress < 0 ? -progress : progress - last;
  if (over > 0) {
    const squash = width * Math.min(over, 0.5) * 0.4;
    width -= squash;
    if (progress > last) left += squash;
  }
  return { left, width, top: a.top, height: a.height };
};

const rubberBand = (raw, last) => {
  if (raw < 0) return raw * RUBBER_BAND;
  if (raw > last) return last + (raw - last) * RUBBER_BAND;
  return raw;
};

/**
 * Tabs whose panels slide side by side: swipe the panels to change tab, with
 * the pill following the finger and the labels on it clipped exactly to it.
 * Each child element is a panel, titled by its `data-label`:
 *
 * ```html
 * <lw-smooth-tab>
 *   <section data-label="Overview">…</section>
 *   <section data-label="Activity">…</section>
 * </lw-smooth-tab>
 * ```
 *
 * @attr {number} selected - Index of the selected tab
 * @attr {string} label - Accessible name of the tab list
 * @slot - The panels, each with a `data-label`
 * @fires lw-change - The user picked another tab; `detail: { index }`
 * @csspart tabs
 * @csspart panels
 * @cssprop --lw-smooth-tab-active - Background of the pill
 * @cssprop --lw-smooth-tab-active-text - Colour of the label on the pill
 */
export class LwSmoothTab extends LwElement {
  static styles = styles;
  static props = {
    selected: { type: Number, default: 0 },
    label: { default: 'Sections' },
  };

  // Fractional tab position: 0 to count - 1, beyond while rubber-banding.
  #progress = 0;
  // The tab the position is heading for.
  #target = 0;
  #rects = [];
  #size = { width: 0, height: 0 };
  #stop = null;
  #drag = null;
  #suppressClick = false;
  #painted = false;

  render() {
    return '<div class="bar"><div class="tablist" role="tablist" part="tabs"></div></div><div class="viewport" part="panels"><div class="track"><slot></slot></div></div>';
  }

  connected() {
    const options = { signal: this.signal };
    const tablist = this.query('.tablist');
    const viewport = this.query('.viewport');
    tablist.addEventListener('click', (event) => this.#tabClick(event), options);
    tablist.addEventListener('keydown', (event) => this.#key(event), options);
    viewport.addEventListener('pointerdown', (event) => this.#down(event), options);
    viewport.addEventListener('pointermove', (event) => this.#move(event), options);
    viewport.addEventListener('pointerup', (event) => this.#end(event, false), options);
    viewport.addEventListener('lostpointercapture', (event) => this.#end(event, false), options);
    viewport.addEventListener('pointercancel', (event) => this.#end(event, true), options);
    viewport.addEventListener('click', (event) => this.#swallowClick(event), { ...options, capture: true });
    this.query('slot').addEventListener('slotchange', () => this.#build(), options);
    const resize = new ResizeObserver(() => this.#measure());
    resize.observe(tablist);
    document.fonts?.ready.then(() => this.isConnected && this.#measure());
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      this.#stop?.();
    });
  }

  updated(changed) {
    if (changed.has('label')) this.query('.tablist').ariaLabel = this.label ?? '';
    if (changed.has('selected') && this.#index !== this.#target) this.#settle(this.#index, { instant: !this.#painted });
  }

  get #panels() {
    return [...this.children];
  }

  get #tabs() {
    return [...this.shadowRoot.querySelectorAll('[role="tab"]')];
  }

  get #index() {
    return clamp(Math.round(this.selected) || 0, 0, Math.max(this.#panels.length - 1, 0));
  }

  // Tabs for the panels, and the same labels again in the pill's colours.
  #build() {
    const panels = this.#panels;
    const label = (panel, i) => escapeHtml(panel.dataset.label ?? `Tab ${i + 1}`);
    const tabs = panels.map((panel, i) => `<button class="tab" type="button" role="tab"><span>${label(panel, i)}</span></button>`).join('');
    const overlay = panels.map((panel, i) => `<span class="tab"><span>${label(panel, i)}</span></span>`).join('');
    this.query('.tablist').innerHTML = `${tabs}<div class="overlay" aria-hidden="true">${overlay}</div>`;
    this.query('.track').style.setProperty('--_count', panels.length);
    panels.forEach((panel, i) => {
      panel.role = 'tabpanel';
      panel.ariaLabel = panel.dataset.label ?? `Tab ${i + 1}`;
    });
    this.#measure();
    this.#settle(this.#index, { instant: true });
  }

  // Sub-pixel rects, so the clip lines up with the labels exactly.
  #measure() {
    const box = this.query('.tablist').getBoundingClientRect();
    this.#size = { width: box.width, height: box.height };
    this.#rects = this.#tabs.map((tab) => {
      const rect = tab.getBoundingClientRect();
      return { left: rect.left - box.left, width: rect.width, top: rect.top - box.top, height: rect.height };
    });
    this.#paint();
  }

  #paint() {
    const p = this.#progress;
    const count = this.#panels.length;
    this.query('.track').style.transform = `translate3d(${(-p * 100) / Math.max(count, 1)}%, 0, 0)`;
    this.#panels.forEach((panel, i) => {
      panel.style.opacity = String(1 - Math.min(Math.abs(p - i), 1) * (1 - NEIGHBOUR_OPACITY));
    });
    const rect = indicatorRect(this.#rects, p);
    const overlay = this.query('.overlay');
    if (!rect || !overlay) return;
    const right = this.#size.width - rect.left - rect.width;
    const bottom = this.#size.height - rect.top - rect.height;
    overlay.style.clipPath = `inset(${rect.top}px ${right}px ${bottom}px ${rect.left}px round ${rect.height / 2}px)`;
    this.#painted = true;
  }

  // Marks the selected tab and panel; the rest leave the Tab order.
  #mark(index) {
    this.#tabs.forEach((tab, i) => {
      tab.ariaSelected = String(i === index);
      tab.tabIndex = i === index ? 0 : -1;
    });
    this.#panels.forEach((panel, i) => {
      panel.inert = i !== index;
      panel.tabIndex = i === index ? 0 : -1;
    });
  }

  // Moves the position to a tab. `velocity` is in tabs per second.
  #settle(index, { instant = false, velocity = 0 } = {}) {
    this.#target = index;
    this.#mark(index);
    this.#stop?.();
    this.#stop = null;
    if (instant || reducedMotion.matches) {
      this.#progress = index;
      this.#paint();
      return;
    }
    this.#stop = springTo(this.#progress, index, {
      ...SPRING,
      velocity,
      restDelta: 0.0005,
      update: (progress) => {
        this.#progress = progress;
        this.#paint();
      },
      done: () => (this.#stop = null),
    });
  }

  #select(index, options) {
    const next = clamp(index, 0, this.#panels.length - 1);
    const changed = next !== this.#index;
    this.selected = next;
    this.#settle(next, options);
    if (changed) this.emit('change', { index: next });
  }

  #tabClick(event) {
    const tab = event.target.closest('[role="tab"]');
    if (tab) this.#select(this.#tabs.indexOf(tab));
  }

  #key(event) {
    const tabs = this.#tabs;
    const i = tabs.indexOf(event.target.closest('[role="tab"]'));
    const count = tabs.length;
    const next = { ArrowRight: (i + 1) % count, ArrowLeft: (i - 1 + count) % count, Home: 0, End: count - 1 }[event.key];
    if (i < 0 || next === undefined) return;
    event.preventDefault();
    tabs[next].focus();
    // A held key repeats faster than any spring settles: jump instead.
    this.#select(next, { instant: event.repeat });
  }

  // ---- Swiping the panels ----

  #down(event) {
    if (this.#panels.length < 2 || (event.pointerType === 'mouse' && event.button !== 0)) return;
    this.#drag = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startProgress: this.#progress,
      axis: null,
      width: event.currentTarget.clientWidth || 1,
      samples: [{ x: event.clientX, t: event.timeStamp }],
    };
  }

  #lockAxis(drag, event) {
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_LOCK) return;
    // Vertical wins ties: the page scroll is what most people are after.
    drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (drag.axis !== 'x') return;
    // Catch the panel mid-flight, and keep the swipe alive when the pointer
    // leaves the panel.
    this.#stop?.();
    this.#stop = null;
    drag.startProgress = this.#progress;
    drag.startX = event.clientX;
    drag.samples = [{ x: event.clientX, t: event.timeStamp }];
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.toggleAttribute('data-dragging', true);
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    if (drag.axis === null) this.#lockAxis(drag, event);
    if (drag.axis !== 'x') return;
    drag.samples.push({ x: event.clientX, t: event.timeStamp });
    while (drag.samples.length > 2 && event.timeStamp - drag.samples[0].t > VELOCITY_WINDOW) drag.samples.shift();
    this.#progress = rubberBand(drag.startProgress - (event.clientX - drag.startX) / drag.width, this.#panels.length - 1);
    this.#paint();
  }

  #end(event, cancelled) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    this.query('.viewport').removeAttribute('data-dragging');
    if (drag.axis !== 'x') return;
    // Swallow the click this release may send. A touch swipe sends none, so
    // the flag clears on the next tick instead of eating a later tap.
    if (!cancelled) {
      this.#suppressClick = true;
      setTimeout(() => (this.#suppressClick = false));
    }
    const first = drag.samples[0];
    // px per ms; negative is a swipe towards the next tab.
    const vx = (event.clientX - first.x) / Math.max(event.timeStamp - first.t, 1);
    const p = this.#progress;
    let next = Math.round(p);
    if (!cancelled && Math.abs(vx) > SWIPE_VELOCITY) next = vx < 0 ? Math.floor(p) + 1 : Math.ceil(p) - 1;
    // The spring starts at the finger's speed, so the hand-off is seamless.
    this.#select(next, { velocity: (-vx * 1000) / drag.width });
  }

  #swallowClick(event) {
    if (!this.#suppressClick) return;
    this.#suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }
}
