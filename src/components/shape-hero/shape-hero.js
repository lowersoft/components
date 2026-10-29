import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { watchVisibility } from '../../core/visibility.js';
import '../button/index.js';
import { createBodies, hitTest, place, STEP, step } from './pile.js';
import styles from './shape-hero.scss?inline';

// Under reduced motion the pile settles up front, within this many steps.
const SETTLE_STEPS = 2400;

const pill = (id, label, tone) => ({ id, label, tone });
const dot = (id, size, tone) => ({ id, size, tone });

const DEMO_SHAPES = [
  pill('clip-trimmer', 'Clip Trimmer', 'solid'),
  pill('detent-dial', 'Detent Dial', 'outline'),
  dot('dot-1', 64, 'accent'),
  pill('liquid-gauge', 'Liquid Gauge', 'outline'),
  pill('scss', 'SCSS', 'accent'),
  pill('card-flip', 'Card Flip', 'outline'),
  dot('dot-2', 48, 'solid'),
  pill('notification-stack', 'Notification Stack', 'outline'),
  pill('dot-field', 'Dot Field', 'solid'),
  dot('dot-3', 80, 'outline'),
  pill('synced-transcript', 'Synced Transcript', 'outline'),
  pill('web-components', 'Web Components', 'outline'),
  pill('shadow-dom', 'Shadow DOM', 'solid'),
  dot('dot-4', 56, 'outline'),
  pill('vanilla-js', 'Vanilla JS', 'outline'),
  pill('zero-deps', 'Zero deps', 'outline'),
  pill('photo-straighten', 'Photo Straighten', 'solid'),
  dot('dot-5', 48, 'accent'),
  pill('background-paths', 'Background Paths', 'outline'),
  pill('receipt-printer', 'Receipt Printer', 'outline'),
  dot('dot-6', 64, 'solid'),
  pill('custom-elements', 'Custom Elements', 'outline'),
];

/**
 * A hero whose shapes drop in, pile up at the bottom and can be grabbed and
 * thrown. The pile sleeps once it settles, so a resting hero costs nothing.
 *
 * Shapes are pills with a `label` or round dots with a `size` in px:
 * `{ id, label?, size?, tone }`, where `tone` is `solid`, `outline` or
 * `accent`. Shapes that would cover more than `fill` of the hero are left out.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {Array<object>} shapes - The shapes (JSON)
 * @attr {number} fill - Share of the hero's area the pile may cover
 * @slot eyebrow - A small line above the heading, such as a badge or a link
 * @slot actions - Calls to action under the description; two buttons by default
 */
export class LwShapeHero extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Components with a little gravity' },
    description: { default: 'Animated Web Components built with SCSS and vanilla JavaScript. Grab a shape and throw it.' },
    shapes: { type: Object, default: DEMO_SHAPES },
    fill: { type: Number, default: 0.3 },
  };

  #world = { bodies: [], width: 0, height: 0, drag: null, still: 0 };
  #started = false;
  #visible = false;
  #frame = 0;
  #last = 0;
  #carry = 0;

  render() {
    return `<div class="layer" aria-hidden="true"></div>
<div class="copy"><slot name="eyebrow"></slot><h1 class="title"></h1><p class="description"></p><div class="actions"><slot name="actions"><lw-button>Browse components</lw-button><lw-button variant="outline">Read the docs</lw-button></slot></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const layer = this.query('.layer');
    const resize = new ResizeObserver(() => {
      this.#world.width = layer.clientWidth;
      this.#world.height = layer.clientHeight;
      this.#wake();
    });
    resize.observe(layer);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
    watchVisibility(this, (visible) => {
      this.#visible = visible;
      // Wait for fonts, so each shape is measured at its final width.
      if (visible) document.fonts.ready.then(() => this.#begin());
      this.#wake();
    }, this.signal);
    layer.addEventListener('pointerdown', (event) => this.#down(event), options);
    layer.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel']) layer.addEventListener(type, (event) => this.#up(event), options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    const description = this.query('.description');
    description.textContent = this.description ?? '';
    description.hidden = !this.description;
    if (!changed.has('shapes') && !changed.has('fill')) return;
    this.query('.layer').innerHTML = this.shapes
      .map(({ id, label, size, tone }) => `<div class="shape" data-id="${escapeHtml(id)}" data-tone="${escapeHtml(tone ?? 'outline')}"${size ? ` style="width: ${Number(size)}px; height: ${Number(size)}px"` : ''}>${escapeHtml(label ?? '')}</div>`)
      .join('');
    // A new set of shapes drops in again.
    if (this.#started) {
      this.#started = false;
      this.#begin();
    }
  }

  #begin() {
    if (this.#started || !this.isConnected) return;
    this.#started = true;
    const world = this.#world;
    world.drag = null;
    world.bodies = createBodies([...this.shadowRoot.querySelectorAll('.shape')], world.width, world.height, this.fill);
    if (reducedMotion.matches) {
      for (let i = 0; i < SETTLE_STEPS && !step(world); i++);
    }
    place(world.bodies);
    this.#wake();
  }

  #wake() {
    this.#world.still = 0;
    if (this.#frame || !this.#started || !this.#visible || reducedMotion.matches) return;
    this.#last = performance.now();
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  #tick(now) {
    this.#frame = 0;
    this.#carry += Math.min((now - this.#last) / 1000, 0.05);
    this.#last = now;
    let asleep = false;
    while (this.#carry >= STEP) {
      asleep = step(this.#world);
      this.#carry -= STEP;
    }
    place(this.#world.bodies);
    if (!asleep && this.#visible) this.#frame = requestAnimationFrame((time) => this.#tick(time));
  }

  #local(event) {
    const rect = this.query('.layer').getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  #down(event) {
    const world = this.#world;
    if (!this.#started || world.drag || event.button !== 0) return;
    const [x, y] = this.#local(event);
    const body = hitTest(world.bodies, x, y);
    if (!body) return;
    event.preventDefault();
    // The grab point, in the body's own frame.
    const dx = x - body.x;
    const dy = y - body.y;
    const cos = Math.cos(-body.a);
    const sin = Math.sin(-body.a);
    world.drag = { body, lx: dx * cos - dy * sin, ly: dx * sin + dy * cos, tx: x, ty: y, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
    this.toggleAttribute('data-dragging', true);
    this.#wake();
  }

  #move(event) {
    const drag = this.#world.drag;
    if (drag?.id !== event.pointerId) return;
    [drag.tx, drag.ty] = this.#local(event);
    this.#wake();
  }

  #up(event) {
    if (this.#world.drag?.id !== event.pointerId) return;
    this.#world.drag = null;
    this.toggleAttribute('data-dragging', false);
    this.#wake();
  }
}
