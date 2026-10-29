import { escapeHtml, isTyping } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { gripHorizontal, gripVertical } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo } from '../../core/motion.js';
import { DEMO_TOOLS } from './tools.js';
import styles from './toolbar.scss?inline';

// Gap between the dock and the canvas edge, in px.
const EDGE_GAP = 12;
const TIP_DELAY = 400;
// How long the tooltip group stays warm after a tooltip hides.
const TIP_WARM = 300;
const TIP_OFFSET = 8;
const LONG_PRESS = 350;
const PRESS_SLOP = 6;
// iOS scroll deceleration; projects a flick about half a second ahead.
const DECELERATION = 0.998;
const PROJECTION = DECELERATION / (1 - DECELERATION);
const VELOCITY_WINDOW = 100;
const PLATE_SPRING = springFeel(0.25, 0);
// Slightly underdamped: the dock carries its throw into the edge.
const DOCK_SPRING = { stiffness: 380, damping: 32 };

const NEXT_EDGE = { bottom: 'left', left: 'top', top: 'right', right: 'bottom' };
const EDGES = Object.keys(NEXT_EDGE);

const isVertical = (edge) => edge === 'left' || edge === 'right';
const clamp = (value, min, max) => (min > max ? (min + max) / 2 : Math.min(max, Math.max(min, value)));
const svg = (inner, size) => strokeIcon(inner, size, 1.75);
const kbd = (key) => (key ? `<kbd>${escapeHtml(key)}</kbd>` : '');

const edgeTarget = (edge, width, height, w, h) =>
  ({
    top: { x: width / 2, y: EDGE_GAP + h / 2 },
    left: { x: EDGE_GAP + w / 2, y: height / 2 },
    right: { x: width - EDGE_GAP - w / 2, y: height / 2 },
    bottom: { x: width / 2, y: height - EDGE_GAP - h / 2 },
  })[edge];

const nearestEdge = (x, y, width, height) => {
  const distances = { bottom: height - y, top: y, left: x, right: width - x };
  return EDGES.reduce((best, edge) => (distances[edge] < distances[best] ? edge : best));
};

// Where a dock that just turned starts its spring: the side that faces its
// new wall stays put, so it grows away from the wall.
const reflowStart = (edge, x, y, from, to, width, height) => {
  const nx = { left: x - from.w / 2 + to.w / 2, right: x + from.w / 2 - to.w / 2 }[edge] ?? x;
  const ny = { top: y - from.h / 2 + to.h / 2, bottom: y + from.h / 2 - to.h / 2 }[edge] ?? y;
  return { x: clamp(nx, to.w / 2, width - to.w / 2), y: clamp(ny, to.h / 2, height - to.h / 2) };
};

// Tooltip anchor, relative to the dock, on the side facing the canvas.
const tipPosition = (edge, button, dock) => {
  const midX = Math.round(button.left + button.width / 2 - dock.left);
  const midY = Math.round(button.top + button.height / 2 - dock.top);
  return {
    top: { x: midX, y: Math.round(dock.height + TIP_OFFSET) },
    left: { x: Math.round(dock.width + TIP_OFFSET), y: midY },
    right: { x: -TIP_OFFSET, y: midY },
    bottom: { x: midX, y: -TIP_OFFSET },
  }[edge];
};

// Release velocity in px/ms: of the pointer (intent) and of the dock (as drawn).
const releaseVelocity = (samples, now) => {
  const recent = samples.filter((sample) => now - sample.t <= VELOCITY_WINDOW);
  if (recent.length < 2) return { x: 0, y: 0, cx: 0, cy: 0 };
  const first = recent[0];
  const last = recent.at(-1);
  const dt = Math.max(1, last.t - first.t);
  return { x: (last.x - first.x) / dt, y: (last.y - first.y) / dt, cx: (last.cx - first.cx) / dt, cy: (last.cy - first.cy) / dt };
};

const step = (key, i, n, next, previous) => {
  if (key === next) return (i + 1) % n;
  if (key === previous) return (i - 1 + n) % n;
  if (key === 'Home') return 0;
  if (key === 'End') return n - 1;
  return -1;
};

/**
 * An editor tool dock in the style of Figma or tldraw, on a canvas. One plate
 * slides between the tools, tools with sub-tools open a flyout (long press,
 * the corner mark, or the arrow across the dock), and the grip throws the
 * dock to any edge of the canvas, where it turns vertical on the sides.
 * Each tool can have a single-key shortcut, shown in its tooltip.
 *
 * Tools are `{ id, label, icon, shortcut?, cursor?, tools? }`, where `icon`
 * is the inner markup of a 24 × 24 stroked SVG and `cursor` is the canvas
 * cursor while the tool is active.
 *
 * @attr {Array<object>} tools - The tools, in order (JSON)
 * @attr {string} value - The active tool's id
 * @attr {'bottom'|'left'|'top'|'right'} edge - The canvas edge the dock sits on
 * @attr {'scoped'|'global'|'off'} shortcuts - When single-key shortcuts work: `scoped` only while focus or the pointer is in the canvas. Never while typing.
 * @attr {string} label - Accessible name of the toolbar
 * @slot - Canvas content behind the dock; a dot grid when empty
 * @fires lw-change - A tool was picked; `detail: { id }`
 * @fires lw-dock - The dock moved to another edge; `detail: { edge }`
 * @csspart stage
 * @csspart dock
 */
export class LwToolbar extends LwElement {
  static styles = styles;
  static props = {
    tools: { type: Object, default: DEMO_TOOLS },
    value: { default: '' },
    edge: { default: 'bottom', reflect: true },
    shortcuts: { default: 'scoped' },
    label: { default: 'Tools' },
  };

  // The sub-tool last picked in each group, shown on its button.
  #choices = new Map();
  #flyout = null;
  #hovering = false;
  #drag = null;
  #press = null;
  #pos = { x: 0, y: 0 };
  #placed = false;
  #edgeShown = null;
  #stopDock = [];
  #stopPlate = [];
  #plate = null;
  #tip = { timer: 0, open: false, warmUntil: 0 };

  render() {
    return `<div class="stage" part="stage"><slot></slot><div class="dock" part="dock"><div class="toolbar" role="toolbar"><span class="plate" aria-hidden="true"></span></div><div class="tip" aria-hidden="true" hidden><div class="tip-body"></div></div></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const stage = this.query('.stage');
    const toolbar = this.query('.toolbar');
    stage.addEventListener('pointerenter', (event) => (this.#hovering = event.pointerType !== 'touch'), options);
    stage.addEventListener('pointerleave', () => (this.#hovering = false), options);
    toolbar.addEventListener('click', (event) => this.#click(event), options);
    toolbar.addEventListener('keydown', (event) => this.#key(event), options);
    toolbar.addEventListener('focusin', (event) => this.#focusIn(event), options);
    toolbar.addEventListener('focusout', () => this.#hideTip(), options);
    toolbar.addEventListener('pointerover', (event) => this.#over(event, true), options);
    toolbar.addEventListener('pointerout', (event) => this.#over(event, false), options);
    toolbar.addEventListener('pointerdown', (event) => this.#down(event), options);
    toolbar.addEventListener('pointermove', (event) => this.#move(event), options);
    toolbar.addEventListener('pointerup', (event) => this.#up(event), options);
    toolbar.addEventListener('lostpointercapture', (event) => this.#up(event), options);
    toolbar.addEventListener('pointercancel', () => this.#cancelPress(), options);
    toolbar.addEventListener('contextmenu', (event) => event.target.closest('[data-group]') && event.preventDefault(), options);
    window.addEventListener('keydown', (event) => this.#shortcut(event), options);
    document.addEventListener('pointerdown', (event) => this.#outside(event), options);
    const resize = new ResizeObserver(() => !this.#drag && this.#settle(null));
    resize.observe(stage);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      this.#stop(this.#stopDock);
      this.#stop(this.#stopPlate);
      this.#cancelPress();
      clearTimeout(this.#tip.timer);
    });
  }

  updated(changed) {
    if (changed.has('label')) this.query('.toolbar').ariaLabel = this.label ?? '';
    if (changed.has('tools')) this.#build();
    if (!this.#leaves.some(({ id }) => id === this.value)) this.value = this.#leaves[0]?.id ?? '';
    if (this.edge !== this.#edgeShown) this.#turn();
    this.#sync();
  }

  get #leaves() {
    return this.tools.flatMap((tool) => (tool.tools?.length ? tool.tools : [tool]));
  }

  get #items() {
    return [...this.shadowRoot.querySelectorAll('[data-item]')];
  }

  // The tool a group's button stands for: the active sub-tool, else the one
  // last picked, else the first.
  #shown(tool) {
    const subs = tool.tools;
    if (!subs?.length) return tool;
    return subs.find(({ id }) => id === this.value) ?? subs.find(({ id }) => id === this.#choices.get(tool.id)) ?? subs[0];
  }

  #build() {
    const grip = `<button class="grip" type="button" aria-label="Move toolbar" data-item tabindex="0"><span class="grip-h">${svg(gripVertical, 16)}</span><span class="grip-v">${svg(gripHorizontal, 16)}</span></button><span class="divider" aria-hidden="true"></span>`;
    const slots = this.tools
      .map((tool) => {
        const id = escapeHtml(tool.id);
        if (!tool.tools?.length) return `<div class="slot" data-slot="${id}"><button class="tool" type="button" data-item tabindex="-1"></button></div>`;
        const items = tool.tools
          .map(
            (sub) =>
              `<button class="option" type="button" role="menuitemradio" tabindex="-1" data-id="${escapeHtml(sub.id)}" aria-keyshortcuts="${escapeHtml(sub.shortcut ?? '')}">${svg(sub.icon, 16)}<span>${escapeHtml(sub.label)}</span>${kbd(sub.shortcut)}</button>`,
          )
          .join('');
        return `<div class="slot" data-slot="${id}" data-group><button class="tool" type="button" data-item tabindex="-1"></button><button class="more" type="button" tabindex="-1" aria-haspopup="menu" aria-expanded="false" aria-label="More ${escapeHtml(tool.label.toLowerCase())}"><svg viewBox="0 0 5 5" aria-hidden="true"><path d="M5 0V5H0Z"/></svg></button><div class="flyout" role="menu" aria-label="${escapeHtml(tool.label)}">${items}</div></div>`;
      })
      .join('');
    const toolbar = this.query('.toolbar');
    toolbar.replaceChildren(this.query('.plate'));
    toolbar.insertAdjacentHTML('beforeend', grip + slots);
    this.#plate = null;
  }

  // Paints the selection: each button's tool, the plate, the canvas cursor.
  #sync(instant = false) {
    this.tools.forEach((tool, i) => {
      const slot = this.shadowRoot.querySelectorAll('.slot')[i];
      const shown = this.#shown(tool);
      const button = slot.querySelector('.tool');
      if (button.dataset.id !== shown.id) {
        button.dataset.id = shown.id;
        button.innerHTML = svg(shown.icon, 18);
        button.ariaLabel = shown.label;
        if (shown.shortcut) button.setAttribute('aria-keyshortcuts', shown.shortcut);
        else button.removeAttribute('aria-keyshortcuts');
      }
      const selected = shown.id === this.value;
      button.ariaPressed = String(selected);
      slot.classList.toggle('selected', selected);
      for (const option of slot.querySelectorAll('.option')) option.ariaChecked = String(option.dataset.id === this.value);
    });
    const leaf = this.#leaves.find(({ id }) => id === this.value);
    this.query('.stage').style.cursor = this.#drag ? 'grabbing' : (leaf?.cursor ?? '');
    this.query('.stage').dataset.tool = this.value;
    if (!this.#items.some((item) => item.tabIndex === 0)) this.#items[0].tabIndex = 0;
    this.#movePlate(instant);
  }

  #stop(stops) {
    for (const stop of stops.splice(0)) stop();
  }

  // Springs the shared plate under the selected tool.
  #movePlate(instant) {
    const slot = this.query('.slot.selected');
    const plate = this.query('.plate');
    plate.hidden = !slot;
    if (!slot) return;
    const to = { x: slot.offsetLeft, y: slot.offsetTop };
    const draw = () => (plate.style.transform = `translate(${this.#plate.x}px, ${this.#plate.y}px)`);
    this.#stop(this.#stopPlate);
    if (!this.#plate || instant || reducedMotion.matches) {
      this.#plate = to;
      draw();
      return;
    }
    const from = { ...this.#plate };
    this.#stopPlate = ['x', 'y'].map((axis) =>
      springTo(from[axis], to[axis], {
        ...PLATE_SPRING,
        restDelta: 0.1,
        update: (value) => {
          this.#plate[axis] = value;
          draw();
        },
      }),
    );
  }

  #select(id, byKey = false) {
    const group = this.tools.find((tool) => tool.tools?.some((sub) => sub.id === id));
    if (group) this.#choices.set(group.id, id);
    if (id === this.value) {
      this.#sync(byKey);
      return;
    }
    this.value = id;
    // Keyboard actions never animate.
    this.#sync(byKey);
    this.emit('change', { id });
  }

  // ---- Docking ----

  #bounds() {
    const stage = this.query('.stage');
    const dock = this.query('.dock');
    return { W: stage.clientWidth, H: stage.clientHeight, w: dock.offsetWidth, h: dock.offsetHeight };
  }

  // The dock is drawn inside the canvas wherever its spring overshoots to.
  #drawDock() {
    const { W, H, w, h } = this.#bounds();
    const x = clamp(this.#pos.x, w / 2, W - w / 2);
    const y = clamp(this.#pos.y, h / 2, H - h / 2);
    this.query('.dock').style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }

  // Moves the dock to its edge: springing with `velocity` (px/s), or at once.
  #settle(velocity) {
    const { W, H, w, h } = this.#bounds();
    const target = edgeTarget(this.edge, W, H, w, h);
    this.#stop(this.#stopDock);
    if (!velocity || !this.#placed) {
      this.#pos = target;
      this.#placed = W > 0;
      this.#drawDock();
      return;
    }
    const tween = reducedMotion.matches ? { stiffness: 900, damping: 60 } : DOCK_SPRING;
    this.#stopDock = ['x', 'y'].map((axis) =>
      springTo(this.#pos[axis], target[axis], {
        ...tween,
        velocity: velocity[axis],
        restDelta: 0.1,
        update: (value) => {
          this.#pos[axis] = value;
          this.#drawDock();
        },
      }),
    );
  }

  // Lays the dock out for its edge; a dock that turned reflows from the wall.
  #turn(velocity = { x: 0, y: 0 }) {
    const { edge } = this;
    if (!EDGES.includes(edge)) {
      this.edge = 'bottom';
      return;
    }
    const dock = this.query('.dock');
    const from = { w: dock.offsetWidth, h: dock.offsetHeight };
    const turned = this.#edgeShown !== null && isVertical(this.#edgeShown) !== isVertical(edge);
    this.#edgeShown = edge;
    dock.dataset.edge = edge;
    this.query('.toolbar').ariaOrientation = isVertical(edge) ? 'vertical' : 'horizontal';
    this.#hideTip();
    this.#closeFlyout();
    if (turned && this.#placed) {
      const to = { w: dock.offsetWidth, h: dock.offsetHeight };
      const { W, H } = this.#bounds();
      this.#pos = reflowStart(edge, this.#pos.x, this.#pos.y, from, to, W, H);
      this.#drawDock();
      this.#movePlate(true);
    }
    this.#settle(velocity);
  }

  #dockTo(edge, velocity) {
    if (edge === this.edge) {
      this.#settle(velocity);
      return;
    }
    this.edge = edge;
    // Turn now rather than on the next update, so the throw keeps its speed.
    this.#turn(velocity);
    this.emit('dock', { edge });
  }

  #gripDown(event) {
    event.preventDefault();
    event.target.closest('.grip').setPointerCapture(event.pointerId);
    this.#stop(this.#stopDock);
    const stage = this.query('.stage').getBoundingClientRect();
    // Pick the dock up where it is drawn, even mid-bounce against a wall.
    const { W, H, w, h } = this.#bounds();
    const x = clamp(this.#pos.x, w / 2, W - w / 2);
    const y = clamp(this.#pos.y, h / 2, H - h / 2);
    this.#pos = { x, y };
    this.#drag = {
      id: event.pointerId,
      dx: event.clientX - stage.left - x,
      dy: event.clientY - stage.top - y,
      left: stage.left,
      top: stage.top,
      samples: [{ t: event.timeStamp, x, y, cx: x, cy: y }],
    };
    this.#hideTip();
    this.#closeFlyout();
    this.query('.dock').toggleAttribute('data-dragging', true);
    this.#sync();
  }

  #gripMove(event) {
    const drag = this.#drag;
    const { W, H, w, h } = this.#bounds();
    const x = event.clientX - drag.left - drag.dx;
    const y = event.clientY - drag.top - drag.dy;
    this.#pos = { x: clamp(x, w / 2, W - w / 2), y: clamp(y, h / 2, H - h / 2) };
    this.#drawDock();
    drag.samples.push({ t: event.timeStamp, x, y, cx: this.#pos.x, cy: this.#pos.y });
    if (drag.samples.length > 8) drag.samples.shift();
  }

  // Projects where the throw was headed (from the pointer, so a dock pinned
  // against a wall can still be thrown along it) and docks on the nearest edge.
  #gripUp(event) {
    const drag = this.#drag;
    this.#drag = null;
    this.query('.dock').removeAttribute('data-dragging');
    this.#sync();
    const velocity = releaseVelocity(drag.samples, event.timeStamp);
    const { W, H } = this.#bounds();
    const from = drag.samples.at(-1);
    const x = clamp(from.x + velocity.x * PROJECTION, 0, W);
    const y = clamp(from.y + velocity.y * PROJECTION, 0, H);
    this.#dockTo(nearestEdge(x, y, W, H), { x: velocity.cx * 1000, y: velocity.cy * 1000 });
  }

  // ---- Pointer ----

  #down(event) {
    this.#hideTip();
    if (event.button !== 0) return;
    if (event.target.closest('.grip')) {
      this.#gripDown(event);
      return;
    }
    // A long press on a tool with sub-tools opens its flyout.
    const slot = event.target.closest('.tool')?.closest('[data-group]');
    if (!slot) return;
    this.#cancelPress();
    this.#press = {
      x: event.clientX,
      y: event.clientY,
      fired: false,
      timer: setTimeout(() => {
        this.#press.fired = true;
        this.#openFlyout(slot, false);
      }, LONG_PRESS),
    };
  }

  #move(event) {
    if (this.#drag?.id === event.pointerId) {
      this.#gripMove(event);
      return;
    }
    if (this.#press && Math.hypot(event.clientX - this.#press.x, event.clientY - this.#press.y) > PRESS_SLOP) this.#cancelPress();
  }

  #up(event) {
    if (this.#drag?.id === event.pointerId) this.#gripUp(event);
    else clearTimeout(this.#press?.timer);
  }

  #cancelPress() {
    clearTimeout(this.#press?.timer);
    this.#press = null;
  }

  #click(event) {
    const option = event.target.closest('.option');
    if (option) {
      const byKey = this.#flyout?.byKey;
      this.#select(option.dataset.id);
      this.#closeFlyout(byKey);
      return;
    }
    const more = event.target.closest('.more');
    if (more) {
      const slot = more.closest('.slot');
      if (this.#flyout?.slot === slot) this.#closeFlyout();
      else this.#openFlyout(slot, false);
      return;
    }
    const tool = event.target.closest('.tool');
    if (!tool) return;
    // The long press already opened the flyout; this click is its release.
    if (this.#press?.fired) {
      this.#press = null;
      return;
    }
    this.#select(tool.dataset.id);
  }

  // A press outside the open flyout's slot closes it.
  #outside(event) {
    if (this.#flyout && !event.composedPath().includes(this.#flyout.slot)) this.#closeFlyout();
  }

  // ---- Flyouts ----

  #openFlyout(slot, byKey) {
    this.#closeFlyout();
    this.#hideTip();
    this.#flyout = { slot, byKey };
    slot.classList.add('open');
    slot.querySelector('.more').ariaExpanded = 'true';
    if (!byKey) return;
    const options = [...slot.querySelectorAll('.option')];
    (options.find((option) => option.ariaChecked === 'true') ?? options[0]).focus();
  }

  #closeFlyout(returnFocus = false) {
    const slot = this.#flyout?.slot;
    if (!slot) return;
    this.#flyout = null;
    slot.classList.remove('open');
    slot.querySelector('.more').ariaExpanded = 'false';
    if (returnFocus) slot.querySelector('.tool').focus();
  }

  // ---- Keyboard ----

  #key(event) {
    const vertical = isVertical(this.edge);
    const option = event.target.closest('.option');
    if (option) {
      this.#menuKey(event, option);
      return;
    }
    const items = this.#items;
    const index = items.indexOf(event.target);
    if (index < 0) return;
    if (event.target.matches('.grip') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.#dockTo(NEXT_EDGE[this.edge], { x: 0, y: 0 });
      return;
    }
    // The arrow across the dock opens a flyout; arrows along it rove.
    const across = vertical ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    const group = event.target.closest('[data-group]');
    if (group && across.includes(event.key)) {
      event.preventDefault();
      this.#openFlyout(group, true);
      return;
    }
    const to = step(event.key, index, items.length, vertical ? 'ArrowDown' : 'ArrowRight', vertical ? 'ArrowUp' : 'ArrowLeft');
    if (to < 0) return;
    event.preventDefault();
    items[to].focus();
  }

  #menuKey(event, option) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.#closeFlyout(true);
      return;
    }
    if (event.key === 'Tab') {
      this.#closeFlyout();
      return;
    }
    const options = [...option.parentElement.children];
    const to = step(event.key, options.indexOf(option), options.length, 'ArrowDown', 'ArrowUp');
    if (to < 0) return;
    event.preventDefault();
    event.stopPropagation();
    options[to].focus();
  }

  // The focused item is the toolbar's one Tab stop.
  #focusIn(event) {
    const items = this.#items;
    if (!items.includes(event.target)) return;
    for (const item of items) item.tabIndex = item === event.target ? 0 : -1;
    if (event.target.matches(':focus-visible')) this.#showTip(event.target);
  }

  #shortcut(event) {
    if (event.key === 'Escape') {
      this.#closeFlyout();
      return;
    }
    if (this.shortcuts === 'off' || event.metaKey || event.ctrlKey || event.altKey || event.repeat || event.defaultPrevented || event.isComposing || isTyping(event)) return;
    const leaf = this.#leaves.find(({ shortcut }) => shortcut?.toLowerCase() === event.key.toLowerCase());
    if (!leaf) return;
    // Scoped: focus is in the canvas, or the pointer is over it while
    // nothing else on the page holds focus.
    const focused = document.activeElement;
    const idle = !focused || focused === document.body;
    const inside = this.contains(focused) || focused === this || (this.#hovering && idle);
    if (this.shortcuts !== 'global' && !inside) return;
    event.preventDefault();
    this.#select(leaf.id, true);
  }

  // ---- Tooltips ----

  #over(event, entering) {
    const item = event.target.closest('[data-item]');
    if (!item || item.contains(event.relatedTarget)) return;
    if (entering) this.#showTip(item);
    else this.#hideTip();
  }

  #tipFor(item) {
    if (item.matches('.grip')) return { label: item.matches(':focus-visible') ? 'Drag, or Enter to move' : 'Drag to dock' };
    const leaf = this.#leaves.find(({ id }) => id === item.dataset.id);
    return { label: leaf?.label ?? '', shortcut: leaf?.shortcut };
  }

  // A tooltip group: the first tooltip waits, the rest show at once.
  #showTip(item) {
    if (this.#drag || this.#flyout) return;
    const tip = this.#tip;
    clearTimeout(tip.timer);
    const reveal = (animated) => {
      const { label, shortcut } = this.#tipFor(item);
      const box = this.query('.tip');
      const { x, y } = tipPosition(this.edge, item.getBoundingClientRect(), this.query('.dock').getBoundingClientRect());
      box.querySelector('.tip-body').innerHTML = escapeHtml(label) + kbd(shortcut);
      box.style.left = `${x}px`;
      box.style.top = `${y}px`;
      box.classList.toggle('animated', animated);
      box.hidden = false;
      tip.open = true;
    };
    if (tip.open || performance.now() < tip.warmUntil) reveal(false);
    else tip.timer = setTimeout(() => reveal(true), TIP_DELAY);
  }

  #hideTip() {
    const tip = this.#tip;
    clearTimeout(tip.timer);
    if (tip.open) tip.warmUntil = performance.now() + TIP_WARM;
    tip.open = false;
    this.query('.tip').hidden = true;
  }
}
