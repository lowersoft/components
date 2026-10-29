import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { fixedStepLoop, reducedMotion, vibrate } from '../../core/motion.js';
import '../button/index.js';
import styles from './receipt-printer.scss?inline';

// Where the paper comes out, from the top of the card.
const SLOT_Y = 64;
// The printer feeds a line at a time, with a short stop between lines.
const LINE = 15;
const FEED_RATE = 34;
const LINE_PAUSE = 0.055;
const LINE_JITTER = 0.05;
const STEP = 1 / 120;
const GRAVITY = 2600;
const DAMPING = 0.996;
// While hanging from the slot, a pull stretches only this far, with growing
// resistance, and tears past this much drag.
const MAX_PULL = 18;
const TEAR_DRAG = 72;
// A sharp downward yank tears it too, in px per second.
const TEAR_SPEED = 900;
// A tilted sheet glides sideways as it falls.
const GLIDE = 0.35;
const REST_EPSILON = 0.02;
const STATUS = { printing: 'Printing…', hanging: 'Pull down to tear' };

const DEMO_ITEMS = [
  { name: 'lower tee', quantity: 2, price: 24 },
  { name: 'LowerSoft mug', quantity: 1, price: 14 },
  { name: 'Sticker pack', quantity: 2, price: 4 },
  { name: 'Esc keycap', quantity: 1, price: 6 },
];

// Barcode bar widths, fixed.
const BARS = [2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 1, 3, 1, 1, 2, 2, 1, 1, 3, 1, 2];

const damp = (distance, max) => max * (1 - Math.exp(-distance / max));
// A point on a sheet turned by `angle`, relative to its corner.
const turn = (px, py, angle) => [px * Math.cos(angle) - py * Math.sin(angle), px * Math.sin(angle) + py * Math.cos(angle)];
const money = (n) => n.toFixed(2);

/**
 * A receipt printer: the receipt feeds out of the slot a line at a time,
 * with the housing buzzing, and hangs there. Pull it sideways and it swings;
 * pull it down far enough, or yank it, and it tears off along the
 * perforation, to swing from your hand, be thrown, or fall away.
 *
 * Items are `{ name, quantity, price }`.
 *
 * @attr {string} merchant
 * @attr {string} order
 * @attr {string} date
 * @attr {Array<object>} items - The lines (JSON)
 * @attr {number} tax - Tax rate, 0.08 for 8%
 * @attr {string} currency - Symbol before the total
 * @attr {boolean} manual - Wait for the Print button instead of printing once on screen
 * @fires lw-print - Printing started
 * @fires lw-tear - The receipt was torn off
 */
export class LwReceiptPrinter extends LwElement {
  static styles = styles;
  static props = {
    merchant: { default: 'LowerSoft Store' },
    order: { default: '#4182' },
    date: { default: '14 Oct 2026 · 08:42' },
    items: { type: Object, default: DEMO_ITEMS },
    tax: { type: Number, default: 0.08 },
    currency: { default: '$' },
    manual: { type: Boolean },
  };

  #phase = 'idle';
  #torn = false;
  #printed = false;
  #onScreen = false;
  #busy = 0;
  // The sheet: size, centre of mass now and a step ago (Verlet), its angle
  // and spin, and the hinge it hangs from (a world point, and where on the
  // sheet it is).
  #s = { width: 0, height: 0, slotX: 0, cx: 0, cy: 0, pcx: 0, pcy: 0, angle: 0, spin: 0, hx: 0, hy: 0, hingeX: 0, hingeY: 0, hidden: 0, feedTarget: 0, pause: 0 };
  #drag = null;
  #loop = fixedStepLoop(STEP, {
    step: () => this.#step(),
    render: () => this.#frame(),
  });

  render() {
    return `<div class="sheet-box"><div class="paper" role="document"><span class="perforation" aria-hidden="true"></span><div class="receipt"></div></div></div>
<div class="printer"><div class="bar"><span class="merchant"></span><span class="status" aria-live="polite">Ready</span></div><div class="slot"></div></div>
<button class="tear" type="button">Tear off receipt</button>
<div class="actions"><lw-button class="print">Print receipt</lw-button></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const paper = this.query('.paper');
    paper.addEventListener('pointerdown', (event) => this.#down(event), options);
    paper.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) paper.addEventListener(type, (event) => this.#up(event), options);
    this.query('.print').addEventListener('click', () => this.#phase === 'idle' && this.print(), options);
    this.query('.tear').addEventListener('click', () => this.#tearKey(), options);
    // Prints once it scrolls into view; the loop waits while offscreen.
    const visible = new IntersectionObserver(
      ([entry]) => {
        this.#onScreen = entry.isIntersecting;
        this.#visibility();
      },
      { threshold: 0.4 },
    );
    visible.observe(this);
    document.addEventListener('visibilitychange', () => this.#visibility(), options);
    this.signal.addEventListener('abort', () => {
      visible.disconnect();
      this.#loop.stop();
    });
  }

  updated() {
    this.#renderReceipt();
    this.query('.merchant').textContent = this.merchant ?? '';
    this.query('.paper').ariaLabel = `Receipt from ${this.merchant}, order ${this.order}`;
    this.#measure();
    if (this.#phase === 'idle' && !this.#torn) this.#placeAtSlot(-this.#s.height);
    this.#draw();
    this.#paintPhase();
  }

  /** Prints a fresh receipt. */
  print() {
    const s = this.#s;
    this.#measure();
    this.#torn = false;
    this.emit('print');
    if (reducedMotion.matches) {
      this.#placeAtSlot(0);
      this.#setPhase('hanging');
      this.#draw();
      return;
    }
    s.hidden = s.feedTarget = s.height;
    s.pause = 0.25;
    this.#placeAtSlot(-s.hidden);
    this.#setPhase('printing');
    this.#draw();
    this.#wake();
  }

  #renderReceipt() {
    const items = this.items ?? [];
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const tax = subtotal * this.tax;
    const rule = `<p class="rule" aria-hidden="true">${'- '.repeat(40)}</p>`;
    const row = (label, value, cls = '') => `<p class="row ${cls}"><span>${label}</span><span class="num">${value}</span></p>`;
    this.query('.receipt').innerHTML = `<p class="name">${escapeHtml((this.merchant ?? '').toUpperCase())}</p><p class="center muted">${escapeHtml(this.date ?? '')}</p><p class="center muted">Order ${escapeHtml(this.order ?? '')}</p>${rule}${items.map((item) => row(`<span class="item">${item.quantity} × ${escapeHtml(item.name)}</span>`, money(item.quantity * item.price))).join('')}${rule}${row('Subtotal', money(subtotal), 'muted')}${row(`Tax ${Math.round(this.tax * 100)}%`, money(tax), 'muted')}${row('Total', `${escapeHtml(this.currency ?? '')}${money(subtotal + tax)}`, 'total')}<div class="barcode" aria-hidden="true">${BARS.map((width, i) => `<span${i % 2 ? '' : ' class="ink"'} style="width: ${width}px"></span>`).join('')}</div><p class="center muted thanks">Thank you, come again</p>`;
  }

  #setPhase(phase) {
    this.#phase = phase;
    this.#paintPhase();
  }

  #paintPhase() {
    const phase = this.#phase;
    this.dataset.phase = phase;
    this.toggleAttribute('data-torn', this.#torn);
    this.query('.status').textContent = STATUS[phase] ?? 'Ready';
    const print = this.query('.print');
    print.textContent = this.#torn ? 'Print another' : 'Print receipt';
    print.disabled = phase !== 'idle';
    this.query('.tear').hidden = phase !== 'hanging';
  }

  #visibility() {
    if (!this.#onScreen || document.hidden) {
      this.#loop.stop();
      return;
    }
    if (!this.manual && !this.#printed) {
      this.#printed = true;
      this.print();
    }
    this.#wake();
  }

  #wake() {
    if (this.#onScreen && !document.hidden) this.#loop.wake();
  }

  #measure() {
    const paper = this.query('.paper');
    Object.assign(this.#s, { width: paper.offsetWidth, height: paper.offsetHeight, slotX: this.clientWidth / 2 });
  }

  // Places the sheet so its centre of mass lands on (cx, cy), turned about
  // its top-left corner.
  #draw() {
    const s = this.#s;
    const [ox, oy] = turn(s.width / 2, s.height / 2, s.angle);
    const tx = s.cx - ox - (s.slotX - s.width / 2);
    const ty = s.cy - oy - SLOT_Y;
    this.query('.paper').style.transform = `translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0) rotate(${s.angle.toFixed(4)}rad)`;
  }

  // The centre of mass of a sheet hanging from the hinge at `angle`.
  #hangAt(angle) {
    const s = this.#s;
    const [dx, dy] = turn(s.width / 2 - s.hingeX, s.height / 2 - s.hingeY, angle);
    return [s.hx + dx, s.hy + dy];
  }

  #placeAtSlot(pull) {
    const s = this.#s;
    Object.assign(s, { hingeX: s.width / 2, hingeY: 0, hx: s.slotX, hy: SLOT_Y + pull });
    const [cx, cy] = this.#hangAt(0);
    Object.assign(s, { cx, cy, pcx: cx, pcy: cy, angle: 0 });
  }

  // ---- Simulation ----

  #step() {
    if (this.#phase === 'printing') this.#busy = this.#stepPrinting();
    else if (this.#phase === 'falling') this.#busy = this.#stepFalling();
    else if (this.#phase === 'hanging' || this.#phase === 'held') this.#busy = this.#stepPendulum();
    else this.#busy = 0;
  }

  // A thermal printer moves in short bursts: feed a line, stop, feed.
  #stepPrinting() {
    const s = this.#s;
    if (s.pause > 0) s.pause -= STEP;
    else if (s.feedTarget > 0) {
      s.feedTarget = Math.max(0, s.feedTarget - LINE);
      s.pause = LINE_PAUSE + Math.random() * LINE_JITTER;
    }
    s.hidden += (s.feedTarget - s.hidden) * Math.min(1, FEED_RATE * STEP);
    if (Math.abs(s.hidden - s.feedTarget) < 0.05) s.hidden = s.feedTarget;
    this.#placeAtSlot(-s.hidden);
    // The housing buzzes while the motor runs.
    const buzz = s.pause > 0 ? 0 : Math.sin(performance.now() / 9) * 0.4;
    this.query('.printer').style.transform = buzz ? `translate3d(${buzz.toFixed(2)}px,0,0)` : '';
    if (s.hidden === 0 && s.feedTarget === 0) {
      this.query('.printer').style.transform = '';
      this.#setPhase('hanging');
      return 0;
    }
    return 1;
  }

  // Hanging from a hinge: the centre of mass swings on a fixed-length rod,
  // and the sheet turns with it.
  #stepPendulum() {
    const s = this.#s;
    const vx = (s.cx - s.pcx) * DAMPING;
    const vy = (s.cy - s.pcy) * DAMPING;
    s.pcx = s.cx;
    s.pcy = s.cy;
    s.cx += vx;
    s.cy += vy + GRAVITY * STEP * STEP;
    const rod = Math.hypot(s.width / 2 - s.hingeX, s.height / 2 - s.hingeY);
    const dx = s.cx - s.hx;
    const dy = s.cy - s.hy;
    const dist = Math.hypot(dx, dy) || 1;
    s.cx = s.hx + (dx / dist) * rod;
    s.cy = s.hy + (dy / dist) * rod;
    s.angle = Math.atan2(s.cy - s.hy, s.cx - s.hx) - Math.atan2(s.height / 2 - s.hingeY, s.width / 2 - s.hingeX);
    return Math.abs(vx) + Math.abs(vy);
  }

  // Free fall: gravity, a little air, and a tilted sheet drifts sideways.
  #stepFalling() {
    const s = this.#s;
    let vx = (s.cx - s.pcx) * DAMPING;
    const vy = (s.cy - s.pcy) * DAMPING;
    vx += Math.sin(s.angle) * Math.max(vy, 0) * GLIDE * STEP * 10;
    s.pcx = s.cx;
    s.pcy = s.cy;
    s.cx += vx;
    s.cy += vy + GRAVITY * STEP * STEP;
    s.angle += s.spin * STEP;
    s.spin *= 0.995;
    // Off the bottom of the card: done.
    return s.cy > this.clientHeight + Math.hypot(s.width, s.height) / 2 ? 0 : 1;
  }

  #frame() {
    this.#draw();
    if (this.#phase === 'falling' && this.#busy === 0) {
      this.#setPhase('idle');
      return false;
    }
    return this.#phase === 'printing' || this.#phase === 'falling' || Boolean(this.#drag) || this.#busy > REST_EPSILON;
  }

  #tear(held) {
    this.#torn = true;
    vibrate(14);
    this.emit('tear');
    if (!reducedMotion.matches) this.query('.printer').animate([{ transform: 'translate3d(0,1.5px,0)' }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    this.#setPhase(reducedMotion.matches ? 'idle' : held ? 'held' : 'falling');
    this.#wake();
  }

  #tearKey() {
    if (this.#phase !== 'hanging') return;
    this.#s.spin = 1.2;
    this.#s.pcy = this.#s.cy - 3;
    this.#tear(false);
    this.query('.print').focus();
  }

  // ---- Pulling ----

  #local(event) {
    const rect = this.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  #down(event) {
    if (this.#phase !== 'hanging' || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const s = this.#s;
    const { x, y } = this.#local(event);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    // Where on the sheet it was grabbed.
    const [ox, oy] = turn(s.width / 2, s.height / 2, s.angle);
    const [grabX, grabY] = turn(x - (s.cx - ox), y - (s.cy - oy), -s.angle);
    this.#drag = { id: event.pointerId, startX: x, startY: y, grabX, grabY, samples: [{ t: event.timeStamp, x, y }] };
    this.#wake();
  }

  #move(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    const s = this.#s;
    const { x, y } = this.#local(event);
    drag.samples.push({ t: event.timeStamp, x, y });
    if (drag.samples.length > 5) drag.samples.shift();
    if (this.#phase === 'hanging') {
      if (y - drag.startY > TEAR_DRAG) {
        // It rips at the slot and stays in the hand, swinging from where it
        // was grabbed.
        Object.assign(s, { hingeX: drag.grabX, hingeY: drag.grabY, hx: x, hy: y });
        this.#tear(true);
      } else {
        // Still attached: the sheet turns about the slot so the grabbed
        // point follows the hand sideways, and stretches a little downward.
        Object.assign(s, { hingeX: s.width / 2, hingeY: 0, hx: s.slotX, hy: SLOT_Y + damp(Math.max(0, y - drag.startY), MAX_PULL) });
        const angle = -Math.atan2(x - s.slotX - (drag.grabX - s.width / 2), Math.max(drag.grabY, 24)) * 0.7;
        const [cx, cy] = this.#hangAt(angle);
        Object.assign(s, { pcx: s.cx, pcy: s.cy, cx, cy, angle });
      }
    } else if (this.#phase === 'held') {
      s.hx = x;
      s.hy = y;
    }
    this.#wake();
  }

  #up(event) {
    const drag = this.#drag;
    if (drag?.id !== event.pointerId) return;
    this.#drag = null;
    const s = this.#s;
    const first = drag.samples[0];
    const last = drag.samples.at(-1);
    const dt = Math.max((last.t - first.t) / 1000, 0.016);
    const vx = (last.x - first.x) / dt;
    const vy = (last.y - first.y) / dt;
    if (this.#phase === 'held') {
      // Thrown: it keeps the hand's speed, and spins from the swing.
      const before = s.angle;
      this.#stepPendulum();
      s.spin = (s.angle - before) / STEP + vx * 0.002;
      s.pcx = s.cx - vx * STEP * 0.6;
      s.pcy = s.cy - vy * STEP * 0.6;
      this.#setPhase('falling');
    } else if (this.#phase === 'hanging' && vy > TEAR_SPEED) {
      // A sharp yank tears it straight off.
      s.pcx = s.cx - vx * STEP * 0.5;
      s.pcy = s.cy - vy * STEP * 0.5;
      s.spin = vx * 0.004;
      this.#tear(false);
    } else if (this.#phase === 'hanging') {
      // Let go: it springs back up to the slot and the swing plays out.
      s.hy = SLOT_Y;
      s.pcx = s.cx;
      s.pcy = s.cy;
    }
    this.#wake();
  }
}
