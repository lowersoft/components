import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './cursor-trail.scss?inline';

// Head to tail. On a dark page the head is the bright end; on a light page
// the head is the deep end, so it always stands out from the background.
const PALETTES = {
  indigo: { dark: ['#eef0ff', '#a5b4fc', '#6366f1', '#3730a3'], light: ['#1e1b4b', '#4338ca', '#818cf8', '#c7d2fe'] },
  ember: { dark: ['#fff7ed', '#fdba74', '#f97316', '#9a3412'], light: ['#431407', '#c2410c', '#fb923c', '#fed7aa'] },
  lagoon: { dark: ['#ecfeff', '#67e8f9', '#06b6d4', '#155e75'], light: ['#083344', '#0e7490', '#22d3ee', '#a5f3fc'] },
  mono: { dark: ['#ffffff', '#d4d4d8', '#71717a', '#3f3f46'], light: ['#09090b', '#3f3f46', '#a1a1aa', '#e4e4e7'] },
};

// How fast the head closes on the pointer and each point on the one before,
// per second: an exponential ease, so it never overshoots.
const HEAD_RATE = 34;
const CHAIN_RATE = 26;
// The ink nib's angle, and the thinnest share of the width it draws.
const NIB = Math.PI / 4;
const NIB_MIN = 0.22;

const parse = (hex) => {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
  return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16));
};

/**
 * A trail that follows the pointer: a tapered ribbon, a calligraphy ink
 * stroke, lit beads at even spacing, or sparks that curl and burn out. A
 * chain of points eases after the pointer with no overshoot, so the trail
 * stretches while it moves and folds away when it stops; then nothing
 * runs. It is painted on one canvas, from a bright head to a deep tail,
 * tuned for light and dark pages.
 *
 * It follows the pointer over its own content, or across the whole window
 * with `global`. With reduced motion it does not draw.
 *
 * @attr {'ribbon'|'ink'|'beads'|'sparks'} variant
 * @attr {'indigo'|'ember'|'lagoon'|'mono'} palette
 * @attr {Array<string>} colors (JSON) - Hex colors from head to tail; overrides `palette`
 * @attr {number} size - Width at the head, in pixels
 * @attr {number} length - Points in the chain; more make a longer, lazier trail
 * @attr {boolean} global - Follows the pointer across the whole window
 * @attr {'above'|'below'} layer - Over or under the content
 * @attr {'auto'|'light'|'dark'} theme - Which tuning of the palette; `auto` follows the page
 * @slot - Content the trail plays over
 */
export class LwCursorTrail extends LwElement {
  static styles = styles;
  static props = {
    variant: { default: 'ribbon', reflect: true },
    palette: { default: 'indigo' },
    colors: { type: Object },
    size: { type: Number, default: 14 },
    length: { type: Number, default: 32 },
    global: { type: Boolean, reflect: true },
    layer: { default: 'above', reflect: true },
    theme: { default: 'auto' },
  };

  #points = [];
  #sparks = [];
  #pointer = null;
  #frame = 0;
  #last = 0;
  #ratio = 1;
  #width = 0;
  #height = 0;
  #ramp = [];

  render() {
    return '<canvas class="canvas" aria-hidden="true"></canvas><div class="content"><slot></slot></div>';
  }

  connected() {
    const options = { signal: this.signal };
    // Listening on the window covers both modes: outside the host, a local
    // trail just lets go of the pointer.
    window.addEventListener('pointermove', (event) => this.#move(event), { ...options, passive: true });
    // Off the window altogether.
    document.addEventListener('pointerout', (event) => event.relatedTarget || this.#leave(), options);
    window.addEventListener('blur', () => this.#leave(), options);
    window.addEventListener('resize', () => this.#resize(), options);
    const sized = new ResizeObserver(() => this.#resize());
    sized.observe(this);
    // The page switching theme retunes the palette.
    const retune = () => (this.#ramp = []);
    const themed = new MutationObserver(retune);
    themed.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', retune, options);
    this.signal.addEventListener('abort', () => {
      themed.disconnect();
      sized.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
  }

  updated(changed) {
    if (changed.has('global')) this.#resize();
    if (changed.has('length')) this.#points = [];
    this.#ramp = [];
  }

  get #count() {
    return Math.max(4, Math.min(120, Math.round(this.length) || 32));
  }

  // The page's scheme: the theme attribute on <html>, else the system.
  get #dark() {
    if (this.theme === 'dark') return true;
    if (this.theme === 'light') return false;
    const scheme = getComputedStyle(document.documentElement).colorScheme;
    if (scheme === 'dark' || scheme === 'light') return scheme === 'dark';
    return matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // The color at `t`, 0 at the head to 1 at the tail.
  #color(t, alpha = 1) {
    if (!this.#ramp.length) {
      const custom = Array.isArray(this.colors) && this.colors.length ? this.colors : null;
      const set = PALETTES[this.palette] ?? PALETTES.indigo;
      this.#ramp = (custom ?? set[this.#dark ? 'dark' : 'light']).map(parse);
    }
    const ramp = this.#ramp;
    if (ramp.length === 1) return `rgb(${ramp[0].join(' ')} / ${alpha})`;
    const at = Math.min(0.9999, Math.max(0, t)) * (ramp.length - 1);
    const i = Math.floor(at);
    const f = at - i;
    const [a, b] = [ramp[i], ramp[i + 1]];
    return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(' ')} / ${alpha})`;
  }

  #resize() {
    const canvas = this.query('.canvas');
    const box = this.global ? { width: innerWidth, height: innerHeight } : this.getBoundingClientRect();
    this.#ratio = Math.min(2, devicePixelRatio || 1);
    this.#width = box.width;
    this.#height = box.height;
    canvas.width = Math.round(box.width * this.#ratio);
    canvas.height = Math.round(box.height * this.#ratio);
    this.#paint();
  }

  // The pointer in the canvas's coordinates, or null when it is outside.
  #local(event) {
    if (this.global) return { x: event.clientX, y: event.clientY };
    const box = this.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    return x >= 0 && y >= 0 && x <= box.width && y <= box.height ? { x, y } : null;
  }

  #move(event) {
    if (reducedMotion.matches) return;
    const at = this.#local(event);
    if (!at) {
      this.#leave();
      return;
    }
    // Coming back in, the chain starts gathered at the pointer.
    if (!this.#pointer || !this.#points.length) {
      this.#points = Array.from({ length: this.#count }, () => ({ ...at }));
      this.#ramp = [];
    }
    this.#pointer = at;
    this.#wake();
  }

  // The pointer went away: the chain folds into its last point.
  #leave() {
    this.#pointer = null;
    this.#wake();
  }

  #wake() {
    if (this.#frame) return;
    this.#last = performance.now();
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  #tick(now) {
    this.#frame = 0;
    const dt = Math.min(0.05, (now - this.#last) / 1000);
    this.#last = now;
    const points = this.#points;
    const target = this.#pointer ?? points[0];
    let spread = 0;
    if (points.length && target) {
      const head = 1 - Math.exp(-HEAD_RATE * dt);
      const chain = 1 - Math.exp(-CHAIN_RATE * dt);
      const before = { ...points[0] };
      points[0].x += (target.x - points[0].x) * head;
      points[0].y += (target.y - points[0].y) * head;
      for (let i = 1; i < points.length; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * chain;
        points[i].y += (points[i - 1].y - points[i].y) * chain;
        spread = Math.max(spread, Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
      }
      if (this.variant === 'sparks') this.#emit(before, points[0], dt);
    }
    this.#age(dt);
    this.#paint();
    // Running while the chain is stretched or sparks still burn.
    const moving = spread > 0.15 || (this.#pointer && Math.hypot(target.x - points[0].x, target.y - points[0].y) > 0.15);
    if (moving || this.#sparks.length) this.#frame = requestAnimationFrame((t) => this.#tick(t));
  }

  // Sparks thrown off the head, more the faster it goes.
  #emit(from, to, dt) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const speed = Math.hypot(dx, dy) / Math.max(dt, 0.001);
    // A resting head throws nothing, or the sparks would keep the loop alive.
    if (speed < 40) return;
    const count = Math.min(6, Math.floor(speed / 180 + Math.random()));
    const size = Math.max(2, this.size);
    for (let i = 0; i < count; i++) {
      const angle = Math.atan2(dy, dx) + Math.PI + (Math.random() - 0.5) * 1.8;
      const push = 20 + Math.random() * 70;
      const along = Math.random();
      this.#sparks.push({
        x: from.x + dx * along,
        y: from.y + dy * along,
        vx: Math.cos(angle) * push,
        vy: Math.sin(angle) * push,
        curl: (Math.random() - 0.5) * 7,
        r: size * (0.12 + Math.random() * 0.2),
        life: 0,
        span: 0.45 + Math.random() * 0.5,
      });
    }
    if (this.#sparks.length > 400) this.#sparks.splice(0, this.#sparks.length - 400);
  }

  #age(dt) {
    this.#sparks = this.#sparks.filter((spark) => {
      spark.life += dt;
      const turn = spark.curl * dt;
      const [vx, vy] = [spark.vx * Math.cos(turn) - spark.vy * Math.sin(turn), spark.vx * Math.sin(turn) + spark.vy * Math.cos(turn)];
      const drag = Math.exp(-2.4 * dt);
      spark.vx = vx * drag;
      spark.vy = vy * drag;
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;
      return spark.life < spark.span;
    });
  }

  #paint() {
    const canvas = this.query('.canvas');
    const ctx = canvas.getContext('2d');
    ctx.setTransform(this.#ratio, 0, 0, this.#ratio, 0, 0);
    ctx.clearRect(0, 0, this.#width, this.#height);
    if (reducedMotion.matches || !this.#points.length) return;
    const draw = { ink: () => this.#ink(ctx), beads: () => this.#beads(ctx), sparks: () => this.#sparkle(ctx) }[this.variant] ?? (() => this.#ribbon(ctx));
    draw();
  }

  // Width at `t` along the chain: full at the head, a hair at the tail.
  #thickness(t) {
    return Math.max(0.4, this.size * (1 - t) ** 1.15);
  }

  // The chain smoothed with a Catmull-Rom spline, each point carrying `t`
  // from head to tail, so a fast curve does not show its corners.
  #smooth(steps = 4) {
    const points = this.#points;
    const last = points.length - 1;
    const out = [];
    for (let i = 0; i < last; i++) {
      const [p0, p1, p2, p3] = [points[Math.max(0, i - 1)], points[i], points[i + 1], points[Math.min(last, i + 2)]];
      for (let s = 0; s < steps; s++) {
        const u = s / steps;
        const u2 = u * u;
        const u3 = u2 * u;
        const at = (a, b, c, d) => 0.5 * (2 * b + (c - a) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (3 * b - a - 3 * c + d) * u3);
        out.push({ x: at(p0.x, p1.x, p2.x, p3.x), y: at(p0.y, p1.y, p2.y, p3.y), t: (i + u) / last });
      }
    }
    out.push({ ...points[last], t: 1 });
    return out;
  }

  // Short round-capped strokes from tail to head, each with its own width
  // and color; round caps hide the joins.
  #segments(ctx, width, color) {
    const points = this.#smooth();
    ctx.lineCap = 'round';
    for (let i = points.length - 2; i >= 0; i--) {
      const [a, b] = [points[i], points[i + 1]];
      if (Math.hypot(b.x - a.x, b.y - a.y) < 0.02) continue;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(a.x, a.y);
      ctx.lineWidth = width(a.t, a, b);
      ctx.strokeStyle = color(a.t);
      ctx.stroke();
    }
  }

  #ribbon(ctx) {
    this.#segments(ctx, (t) => this.#thickness(t), (t) => this.#color(t));
    // A sheen along one edge gives the ribbon some roundness: one path, so
    // no joins pile up into bright dots.
    const points = this.#smooth().filter((point) => point.t <= 0.7);
    if (points.length < 2) return;
    const edge = points.map((point, i) => {
      const [a, b] = [points[Math.max(0, i - 1)], points[Math.min(points.length - 1, i + 1)]];
      const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const shift = -this.#thickness(point.t) * 0.2;
      return { x: point.x + (-(b.y - a.y) / length) * shift, y: point.y + ((b.x - a.x) / length) * shift };
    });
    const [head, tail] = [edge[0], edge.at(-1)];
    if (Math.hypot(tail.x - head.x, tail.y - head.y) < 1) return;
    const sheen = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
    sheen.addColorStop(0, 'rgb(255 255 255 / 0.34)');
    sheen.addColorStop(1, 'rgb(255 255 255 / 0)');
    ctx.beginPath();
    edge.forEach((point, i) => (i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)));
    ctx.lineWidth = Math.max(1, this.size * 0.22);
    ctx.lineJoin = 'round';
    ctx.strokeStyle = sheen;
    ctx.stroke();
  }

  // A broad nib held at 45°: wide across its edge, thin along it.
  #ink(ctx) {
    this.#segments(
      ctx,
      (t, a, b) => {
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        return Math.max(0.4, this.#thickness(t) * (NIB_MIN + (1 - NIB_MIN) * Math.abs(Math.sin(angle - NIB))));
      },
      (t) => this.#color(t * 0.85),
    );
  }

  // Beads at even spacing along the chain, each lit from above.
  #beads(ctx) {
    const points = this.#points;
    const spacing = Math.max(4, this.size * 1.05);
    const total = points.reduce((sum, p, i) => (i ? sum + Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y) : 0), 0);
    if (total < 0.5) return;
    const beads = [];
    let walked = 0;
    let next = 0;
    for (let i = 1; i < points.length && beads.length < 200; i++) {
      const [a, b] = [points[i - 1], points[i]];
      const length = Math.hypot(b.x - a.x, b.y - a.y);
      while (next <= walked + length) {
        const f = length ? (next - walked) / length : 0;
        beads.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, t: next / Math.max(total, spacing * 8) });
        next += spacing;
      }
      walked += length;
    }
    for (let i = beads.length - 1; i >= 0; i--) {
      const { x, y, t } = beads[i];
      if (t >= 1) continue;
      const r = Math.max(0.6, this.#thickness(t) / 2);
      const light = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
      light.addColorStop(0, `rgb(255 255 255 / ${0.85 * (1 - t)})`);
      light.addColorStop(0.35, this.#color(t));
      light.addColorStop(1, this.#color(Math.min(1, t + 0.25)));
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = light;
      ctx.fill();
    }
  }

  // Embers that start at the head's color and cool to the tail's as they die.
  #sparkle(ctx) {
    for (const spark of this.#sparks) {
      const t = spark.life / spark.span;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, Math.max(0.3, spark.r * (1 - t * 0.7)), 0, Math.PI * 2);
      ctx.fillStyle = this.#color(t, 1 - t ** 2);
      ctx.fill();
    }
    // A small hot core rides the head while it moves.
    const [head, next] = this.#points;
    if (next && Math.hypot(head.x - next.x, head.y - next.y) > 0.3) {
      ctx.beginPath();
      ctx.arc(head.x, head.y, Math.max(1, this.size * 0.22), 0, Math.PI * 2);
      ctx.fillStyle = this.#color(0);
      ctx.fill();
    }
  }
}
