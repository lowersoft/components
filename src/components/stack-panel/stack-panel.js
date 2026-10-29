import { escapeHtml, morphChildren } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { check, chevronLeft, chevronRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo } from '../../core/motion.js';
import styles from './stack-panel.scss?inline';

// iOS pushes with a curve close to this; the page settles without bounce.
const PUSH = springFeel(0.42, 0);
const POP = springFeel(0.34, 0);
const HEIGHT = springFeel(0.38, 0);
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
// The page underneath moves a third as far as the one on top.
const PARALLAX = 0.3;
// Let go past this share of the width, or flick faster (px/s), and the page pops.
const POP_DISTANCE = 0.35;
const POP_VELOCITY = 500;
const AXIS_LOCK = 6;

const isButton = (row) => Boolean(row.to || row.action || row.selected !== undefined || row.checked !== undefined);

const rowMarkup = (row) => {
  const parts = [`<span class="label${row.tone === 'danger' ? ' danger' : ''}">${escapeHtml(row.label)}</span>`];
  if (row.detail) parts.push(`<span class="detail">${escapeHtml(row.detail)}</span>`);
  if (row.checked !== undefined) parts.push(`<span class="toggle${row.checked ? ' on' : ''}" aria-hidden="true"></span>`);
  if (row.selected !== undefined) parts.push(`<span class="check${row.selected ? '' : ' off'}">${strokeIcon(check)}</span>`);
  if (row.to) parts.push(`<span class="chevron">${strokeIcon(chevronRight)}</span>`);
  if (!isButton(row)) return `<div class="row">${parts.join('')}</div>`;
  const role = row.checked !== undefined ? ` role="switch" aria-checked="${row.checked}"` : row.selected !== undefined ? ` aria-pressed="${row.selected}"` : '';
  return `<button class="row" type="button" data-row="${escapeHtml(row.id)}"${role}>${parts.join('')}</button>`;
};

const pageMarkup = (page) =>
  (page?.sections ?? [])
    .map(
      (section) =>
        `<section>${section.title ? `<h3>${escapeHtml(section.title)}</h3>` : ''}<ul>${section.rows.map((row) => `<li>${rowMarkup(row)}</li>`).join('')}</ul>${section.footer ? `<p class="footer">${escapeHtml(section.footer)}</p>` : ''}</section>`,
    )
    .join('');

/**
 * A panel that drills into pages, like settings on a phone. A row opens its
 * page from the right while its label flies up to become the title; swipe
 * the page right, or press Back or Escape, to return.
 *
 * `pages` maps ids to `{ title, sections }`; a section is `{ title?, rows,
 * footer? }` and a row is `{ id, label, detail?, to?, selected?, checked?,
 * tone?, action? }`. A row with `to` opens that page; `selected` shows a
 * check (one choice of a section), `checked` a switch, and `action: true`
 * makes a plain row pressable. Pressing a row fires `lw-select`; update
 * `pages` (a new object) to reflect the choice.
 *
 * @attr {object} pages - The pages by id (JSON)
 * @attr {string} root - The page the panel starts on
 * @fires lw-select - A row was pressed; `detail: { page, row }`
 * @fires lw-navigate - The page on top changed; `detail: { page, depth }`
 * @csspart panel
 */
export class LwStackPanel extends LwElement {
  static styles = styles;
  static props = {
    pages: { type: Object, default: {} },
    root: { default: '' },
  };

  #stack = [];
  // The top page's offset; the page underneath follows it in parallax.
  #x = 0;
  #height = 0;
  #busy = false;
  #drag = null;
  #suppressClick = false;
  #stops = { x: null, height: null };

  render() {
    return `<div class="panel" part="panel">
  <div class="header"><button class="back" type="button" hidden>${strokeIcon(chevronLeft)}<span></span></button><div class="titles"></div></div>
  <div class="body">
    <div class="layer under" inert aria-hidden="true"><div class="page"></div><div class="shade"></div></div>
    <div class="layer top"><div class="page"></div></div>
  </div>
</div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const top = this.query('.top');
    this.query('.back').addEventListener('click', () => this.#pop(), options);
    top.addEventListener('click', (event) => this.#click(event), options);
    top.addEventListener('pointerdown', (event) => this.#down(event), options);
    top.addEventListener('pointermove', (event) => this.#move(event), options);
    top.addEventListener('pointerup', (event) => this.#up(event, false), options);
    top.addEventListener('pointercancel', (event) => this.#up(event, true), options);
    top.addEventListener('click', (event) => this.#swallow(event), { ...options, capture: true });
    this.query('.panel').addEventListener('keydown', (event) => this.#key(event), options);
    const resize = new ResizeObserver(() => !this.#busy && !this.#stops.height && this.#fitHeight(true));
    resize.observe(top);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      for (const stop of Object.values(this.#stops)) stop?.();
    });
  }

  updated(changed) {
    if (changed.has('root') || !this.#stack.length) this.#stack = [this.root || Object.keys(this.pages)[0]].filter(Boolean);
    // Pages that no longer exist leave the stack.
    this.#stack = this.#stack.filter((id) => this.pages[id]);
    if (!this.#stack.length && this.root && this.pages[this.root]) this.#stack = [this.root];
    this.#paint();
    if (!this.query('.titles').childElementCount) this.#title(null, 0);
  }

  get #width() {
    return this.query('.body').clientWidth || 360;
  }

  // Redraws the top page and the one under it in place, so focus and the
  // switches' transitions survive; the height follows at once or springs.
  #paint(instantHeight = true) {
    const [under, top] = [this.#stack.at(-2), this.#stack.at(-1)];
    const fill = (selector, page) => {
      const template = document.createElement('template');
      template.innerHTML = page ? pageMarkup(page) : '';
      morphChildren(this.query(selector), template.content);
    };
    fill('.top .page', this.pages[top]);
    fill('.under .page', under && this.pages[under]);
    this.query('.under').hidden = !under;
    this.query('.top').classList.toggle('lifted', Boolean(under));
    const back = this.query('.back');
    back.hidden = !under;
    back.querySelector('span').textContent = under ? this.pages[under].title : '';
    back.ariaLabel = under ? `Back to ${this.pages[under].title}` : '';
    this.#draw();
    this.#fitHeight(instantHeight);
  }

  #draw() {
    const width = this.#width;
    this.query('.top').style.transform = `translate3d(${this.#x}px, 0, 0)`;
    this.query('.under').style.transform = `translate3d(${-PARALLAX * (width - this.#x)}px, 0, 0)`;
    this.query('.shade').style.opacity = String(0.06 * (1 - this.#x / width));
  }

  // The panel's height follows the page on top.
  #fitHeight(instant) {
    const target = this.query('.top .page').offsetHeight;
    const body = this.query('.body');
    this.#stops.height?.();
    this.#stops.height = null;
    const draw = (height) => {
      this.#height = height;
      body.style.height = `${height}px`;
    };
    if (instant || !this.#height || reducedMotion.matches) draw(target);
    else this.#stops.height = springTo(this.#height, target, { ...HEIGHT, restDelta: 0.5, restSpeed: 2, update: draw, done: () => (this.#stops.height = null) });
  }

  // Springs the top page to `target`. Within a pixel of it the page lands
  // (the spring's tail is invisible) and the promise settles; also if stopped.
  #springX(target, feel, velocity = 0) {
    this.#stops.x?.();
    return new Promise((resolve) => {
      if (reducedMotion.matches) {
        this.#x = target;
        this.#draw();
        resolve();
        return;
      }
      const land = () => {
        stop();
        this.#stops.x = null;
        resolve();
      };
      const stop = springTo(this.#x, target, {
        ...feel,
        velocity,
        update: (x) => {
          this.#x = Math.abs(x - target) < 1 ? target : x;
          this.#draw();
          if (this.#x === target) land();
        },
      });
      this.#stops.x = land;
    });
  }

  // ---- The title ----

  // The header title. Pushed in from a row it flies from that row's label up
  // into the header; otherwise it slides a little and fades.
  #title(origin, direction) {
    const titles = this.query('.titles');
    for (const old of titles.children) {
      old.classList.add('leaving');
      const leave = old.animate([{ opacity: 1 }, { opacity: 0, translate: `${direction * -40}px 0` }], { duration: reducedMotion.matches ? 0 : 180, easing: EASE_OUT, fill: 'forwards' });
      leave.finished.then(() => old.remove());
    }
    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = this.pages[this.#stack.at(-1)]?.title ?? '';
    titles.append(title);
    if (!direction) return;
    if (!origin || reducedMotion.matches) {
      title.animate([{ opacity: 0, translate: `${direction * 24}px 0` }, { opacity: 1, translate: '0 0' }], { duration: reducedMotion.matches ? 0 : 280, easing: EASE_OUT });
      return;
    }
    const to = title.getBoundingClientRect();
    const scale = origin.fontSize / Number.parseFloat(getComputedStyle(title).fontSize);
    const dx = origin.rect.left - to.left;
    const dy = origin.rect.top + origin.rect.height / 2 - (to.top + to.height / 2);
    let progress = 0;
    const draw = () => {
      const rest = 1 - progress;
      title.style.transform = `translate(${dx * rest}px, ${dy * rest}px) scale(${1 + (scale - 1) * rest})`;
    };
    draw();
    springTo(0, 1, {
      ...PUSH,
      restDelta: 0.001,
      update: (value) => {
        progress = value;
        draw();
      },
      done: () => (title.style.transform = ''),
    });
  }

  // ---- Pushing and popping ----

  #click(event) {
    const button = event.target.closest('[data-row]');
    if (!button) return;
    const page = this.#stack.at(-1);
    const row = this.pages[page]?.sections.flatMap(({ rows }) => rows).find(({ id }) => id === button.dataset.row);
    if (!row) return;
    this.emit('select', { page, row });
    if (row.to && this.pages[row.to]) this.#push(row.to, button.querySelector('.label'));
  }

  // A push can be interrupted by another push or a pop; only a pop, which
  // changes the stack as it ends, holds everything else off.
  #push(id, label) {
    if (this.#busy) return;
    // Where the tapped label is, before the pages redraw under it.
    const origin = { rect: label.getBoundingClientRect(), fontSize: Number.parseFloat(getComputedStyle(label).fontSize) };
    this.#stack = [...this.#stack, id];
    this.#x = this.#width;
    this.#paint(false);
    this.#title(origin, 1);
    this.query('.back').focus({ preventScroll: true });
    this.emit('navigate', { page: id, depth: this.#stack.length - 1 });
    this.#springX(0, PUSH);
  }

  async #pop(velocity = 0) {
    if (this.#stack.length < 2 || this.#busy) return;
    this.#busy = true;
    await this.#springX(this.#width, POP, velocity);
    // Both in one frame: the old top goes as the offset resets.
    this.#stack = this.#stack.slice(0, -1);
    this.#x = 0;
    this.#paint(false);
    this.#title(null, -1);
    this.#busy = false;
    if (this.#stack.length > 1) this.query('.back').focus({ preventScroll: true });
    else this.query('.top [data-row]')?.focus({ preventScroll: true });
    this.emit('navigate', { page: this.#stack.at(-1), depth: this.#stack.length - 1 });
  }

  #key(event) {
    if (event.key !== 'Escape' || this.#stack.length < 2) return;
    event.preventDefault();
    this.#pop();
  }

  // ---- Swiping back ----

  #down(event) {
    if (this.#stack.length < 2 || this.#busy || event.button !== 0) return;
    this.#drag = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: null, samples: [{ x: 0, t: event.timeStamp }] };
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    if (!drag.axis) {
      if (Math.max(Math.abs(dx), Math.abs(event.clientY - drag.y)) < AXIS_LOCK) return;
      drag.axis = Math.abs(dx) > Math.abs(event.clientY - drag.y) ? 'x' : 'y';
      if (drag.axis === 'x') {
        this.query('.top').setPointerCapture?.(event.pointerId);
        this.#stops.x?.();
      }
    }
    if (drag.axis !== 'x') return;
    // Only to the right, and only as far as the page is wide.
    this.#x = Math.min(Math.max(dx, 0), this.#width);
    drag.samples.push({ x: this.#x, t: event.timeStamp });
    if (drag.samples.length > 6) drag.samples.shift();
    this.#draw();
  }

  #up(event, cancelled) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    if (drag.axis !== 'x') {
      this.#drag = null;
      return;
    }
    const first = drag.samples[0];
    const last = drag.samples.at(-1);
    const velocity = ((last.x - first.x) / Math.max(last.t - first.t, 1)) * 1000;
    if (!cancelled && (this.#x > this.#width * POP_DISTANCE || velocity > POP_VELOCITY)) {
      this.#pop(velocity).then(() => (this.#drag = null));
    } else {
      this.#drag = null;
      this.#springX(0, PUSH, velocity);
    }
    // The click this release sends is not a press on a row.
    this.#suppressClick = true;
    setTimeout(() => (this.#suppressClick = false));
  }

  #swallow(event) {
    if (!this.#suppressClick) return;
    this.#suppressClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
