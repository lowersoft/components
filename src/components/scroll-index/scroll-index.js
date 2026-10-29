import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './scroll-index.scss?inline';

// Headings land this far below the top edge when jumped to.
const OFFSET = 16;
// Ticks swell near the pointer like a dock: peak width and reach, in px.
const SWELL = 1.6;
const REACH = 26;
// A drag let go this close to a tick (after its momentum) settles on it.
const SNAP = 18;
// How long the flashed section name stays up after scrolling into it.
const FLASH = 900;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeInOut = (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

/**
 * A rail of ticks beside long content, one per heading, placed where that
 * heading sits in the scroll. The ticks swell near the pointer, the section
 * being read is marked, and dragging the rail scrubs through the content;
 * a flick settles on the tick it was heading for. Each tick is a button,
 * and the arrow keys move between them.
 *
 * @attr {string} selector - Which headings in the content get a tick
 * @attr {'self'|'window'} scroller - `self`: the component scrolls its own box. `window`: the page scrolls and the rail sticks beside the content.
 * @slot - The content to index
 * @csspart rail
 */
export class LwScrollIndex extends LwElement {
  static styles = styles;
  static props = {
    selector: { default: 'h2, h3' },
    scroller: { default: 'self', reflect: true },
  };

  #sections = [];
  #start = 0;
  #end = 1;
  #height = 280;
  #active = -1;
  #hover = null;
  #drag = null;
  #swell = [];
  #frame = 0;
  #tween = 0;
  #flash = 0;
  #painted = false;
  #listening = null;

  render() {
    return '<div class="box"><div class="content"><slot></slot></div></div><nav aria-label="Sections"><div class="rail" part="rail"><div class="ticks"></div><span class="head" aria-hidden="true"></span><span class="label" aria-hidden="true"></span></div></nav>';
  }

  connected() {
    const options = { signal: this.signal };
    const rail = this.query('.rail');
    rail.addEventListener('pointerdown', (event) => this.#down(event), options);
    rail.addEventListener('pointermove', (event) => this.#move(event), options);
    rail.addEventListener('pointerup', (event) => this.#up(event), options);
    rail.addEventListener('pointercancel', (event) => this.#up(event), options);
    rail.addEventListener('pointerleave', () => this.#leave(), options);
    const ticks = this.query('.ticks');
    ticks.addEventListener('click', (event) => this.#tickClick(event), options);
    ticks.addEventListener('keydown', (event) => this.#tickKey(event), options);
    ticks.addEventListener('focusin', (event) => this.#show(this.#indexOf(event.target)), options);
    ticks.addEventListener('focusout', () => (this.query('.label').style.opacity = '0'), options);
    this.query('slot').addEventListener('slotchange', () => this.#remeasure(), options);
    this.#listen();
    const resize = new ResizeObserver(() => this.#remeasure());
    resize.observe(this.query('.content'));
    resize.observe(this.query('.box'));
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
      this.#stopTween();
      clearTimeout(this.#flash);
      this.#listening?.abort();
    });
  }

  updated(changed) {
    if (changed.has('scroller')) this.#listen();
    this.#remeasure();
  }

  get #window() {
    return this.scroller === 'window';
  }

  get #scroll() {
    return this.#window ? window.scrollY : this.query('.box').scrollTop;
  }

  set #scroll(value) {
    if (this.#window) window.scrollTo(0, value);
    else this.query('.box').scrollTop = value;
  }

  // Scroll and the reader's own scroll input, on whichever box scrolls.
  #listen() {
    this.#listening?.abort();
    this.#listening = new AbortController();
    const options = { signal: this.#listening.signal, passive: true };
    const target = this.#window ? window : this.query('.box');
    target.addEventListener('scroll', () => this.#schedule(), options);
    // Any scroll input of the reader's own cancels a jump in progress.
    for (const type of ['wheel', 'touchstart']) target.addEventListener(type, () => this.#stopTween(), options);
  }

  #remeasure() {
    if (!this.isConnected) return;
    this.#measure();
    this.#schedule();
  }

  // Where each heading sits in the scroll, and its tick on the rail.
  #measure() {
    const scroll = this.#scroll;
    const box = this.query('.box');
    const content = this.query('.content');
    if (this.#window) {
      const top = content.getBoundingClientRect().top + scroll;
      this.#start = Math.max(top - OFFSET, 0);
      this.#end = Math.max(top + content.offsetHeight - window.innerHeight, this.#start + 1);
    } else {
      this.#start = 0;
      this.#end = Math.max(box.scrollHeight - box.clientHeight, 1);
    }
    const origin = this.#window ? 0 : box.getBoundingClientRect().top - scroll;
    const span = this.#end - this.#start;
    this.#sections = [...this.querySelectorAll(this.selector)].map((el) => {
      const at = clamp(el.getBoundingClientRect().top + scroll - origin - OFFSET, this.#start, this.#end);
      return { el, text: el.textContent.trim(), level: Number(el.tagName.slice(1)) || 2, at, pos: (at - this.#start) / span };
    });
    this.#height = this.query('.rail').clientHeight || 280;
    const ticks = this.query('.ticks');
    const markup = this.#sections
      .map(({ text, level, pos }) => `<button class="tick" type="button" aria-label="${escapeHtml(text)}" data-level="${level <= 2 ? 1 : 2}" data-state="ahead" style="top: ${(pos * 100).toFixed(3)}%"><span></span></button>`)
      .join('');
    if (ticks.dataset.markup !== markup) {
      ticks.innerHTML = markup;
      ticks.dataset.markup = markup;
      this.#active = -1;
    }
  }

  get #fraction() {
    return clamp((this.#scroll - this.#start) / (this.#end - this.#start), 0, 1);
  }

  #nearest(y) {
    let index = -1;
    let distance = Number.POSITIVE_INFINITY;
    this.#sections.forEach(({ pos }, i) => {
      const d = Math.abs(pos * this.#height - y);
      if (d < distance) {
        distance = d;
        index = i;
      }
    });
    return { index, distance };
  }

  // The section the reader is in: the last heading at or above the top.
  get #current() {
    const scroll = this.#scroll + 1;
    let index = -1;
    this.#sections.forEach(({ at }, i) => {
      if (at <= scroll) index = i;
    });
    return index;
  }

  #placeLabel(index, visible) {
    const label = this.query('.label');
    const section = this.#sections[index];
    if (!section) {
      label.style.opacity = '0';
      return;
    }
    if (label.textContent !== section.text) label.textContent = section.text;
    label.style.transform = `translate3d(0, ${(section.pos * this.#height).toFixed(1)}px, 0) translateY(-50%)`;
    label.style.opacity = visible ? '1' : '0';
  }

  #schedule() {
    this.#frame ||= requestAnimationFrame(() => this.#paint());
  }

  #paint() {
    this.#frame = 0;
    this.query('.head').style.transform = `translate3d(0, ${(this.#fraction * this.#height).toFixed(1)}px, 0)`;
    const ticks = [...this.shadowRoot.querySelectorAll('.tick')];
    const now = this.#current;
    if (now !== this.#active) {
      this.#active = now;
      // The section being read is marked apart from the ones passed.
      ticks.forEach((tick, i) => (tick.dataset.state = i === now ? 'current' : i < now ? 'passed' : 'ahead'));
      // Scrolling into a new section names it briefly.
      if (this.#painted && this.#hover === null && !this.#drag && now >= 0) {
        this.#placeLabel(now, true);
        clearTimeout(this.#flash);
        this.#flash = setTimeout(() => {
          if (this.#hover === null && !this.#drag) this.query('.label').style.opacity = '0';
        }, FLASH);
      }
    }
    // Ticks ease toward their swell, so the magnification follows the
    // pointer smoothly instead of jumping.
    let moving = false;
    ticks.forEach((tick, i) => {
      const y = (this.#sections[i]?.pos ?? 0) * this.#height;
      const target = this.#hover === null || reducedMotion.matches ? 1 : 1 + SWELL * Math.exp(-((this.#hover - y) ** 2) / (2 * REACH * REACH));
      const from = this.#swell[i] ?? 1;
      const value = from + (target - from) * 0.35;
      this.#swell[i] = Math.abs(value - target) < 0.005 ? target : value;
      moving ||= this.#swell[i] !== target;
      tick.style.setProperty('--_swell', this.#swell[i].toFixed(3));
    });
    this.#painted = true;
    if (moving) this.#schedule();
  }

  #stopTween() {
    cancelAnimationFrame(this.#tween);
    this.#tween = 0;
  }

  #scrollTo(target) {
    this.#stopTween();
    const from = this.#scroll;
    const to = clamp(target, 0, this.#window ? 1e9 : this.#end);
    if (reducedMotion.matches || Math.abs(to - from) < 2) {
      this.#scroll = to;
      return;
    }
    const duration = clamp(260 + Math.abs(to - from) * 0.12, 300, 650);
    const begin = performance.now();
    const step = (now) => {
      const t = Math.min((now - begin) / duration, 1);
      this.#scroll = from + (to - from) * easeInOut(t);
      this.#tween = t < 1 ? requestAnimationFrame(step) : 0;
    };
    this.#tween = requestAnimationFrame(step);
  }

  #jump(index) {
    const section = this.#sections[index];
    if (section) this.#scrollTo(section.at);
  }

  #show(index) {
    if (index < 0) return;
    this.#hover = (this.#sections[index]?.pos ?? 0) * this.#height;
    this.#placeLabel(index, true);
    this.#schedule();
  }

  #indexOf(target) {
    return [...this.shadowRoot.querySelectorAll('.tick')].indexOf(target.closest?.('.tick'));
  }

  // ---- The rail ----

  #railY(event) {
    return clamp(event.clientY - this.query('.rail').getBoundingClientRect().top, 0, this.#height);
  }

  #down(event) {
    if (this.#drag || event.button !== 0) return;
    event.preventDefault();
    const rail = this.query('.rail');
    rail.setPointerCapture?.(event.pointerId);
    this.#stopTween();
    const y = this.#railY(event);
    this.#drag = { id: event.pointerId, moved: false, y, t: event.timeStamp, v: 0 };
    this.#hover = y;
    rail.toggleAttribute('data-dragging', true);
    this.#placeLabel(this.#nearest(y).index, true);
    this.#schedule();
  }

  #move(event) {
    const y = this.#railY(event);
    const drag = this.#drag;
    if (drag?.id === event.pointerId) {
      const dt = Math.max(event.timeStamp - drag.t, 1);
      drag.v = drag.v * 0.4 + ((y - drag.y) / dt) * 0.6;
      drag.moved ||= Math.abs(y - drag.y) > 3;
      drag.y = y;
      drag.t = event.timeStamp;
      // Dragging the rail scrubs the content under it.
      if (drag.moved) this.#scroll = this.#start + (y / this.#height) * (this.#end - this.#start);
    } else if (event.pointerType !== 'mouse') {
      return;
    }
    this.#hover = y;
    this.#placeLabel(this.#nearest(y).index, true);
    this.#schedule();
  }

  #up(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    this.query('.rail').removeAttribute('data-dragging');
    if (event.pointerType !== 'mouse') {
      this.#hover = null;
      this.#placeLabel(-1, false);
    }
    // Where the flick was heading, then the tick nearest that.
    const hit = this.#nearest(drag.moved ? drag.y + drag.v * 120 : drag.y);
    if (hit.index >= 0 && (!drag.moved || hit.distance < SNAP)) this.#jump(hit.index);
    this.#schedule();
  }

  #leave() {
    if (this.#drag) return;
    this.#hover = null;
    this.#placeLabel(-1, false);
    this.#schedule();
  }

  // Pointer clicks are handled by the rail; this is the keyboard.
  #tickClick(event) {
    if (event.detail === 0) this.#jump(this.#indexOf(event.target));
  }

  #tickKey(event) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const ticks = [...this.shadowRoot.querySelectorAll('.tick')];
    const next = clamp(this.#indexOf(event.target) + (event.key === 'ArrowDown' ? 1 : -1), 0, ticks.length - 1);
    ticks[next]?.focus();
  }
}
