import { fitCanvas } from '../../core/canvas.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight, pause, play } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import { watchTheme } from '../../core/theme.js';
import { watchVisibility } from '../../core/visibility.js';
import '../button/index.js';
import { drawEarth, drawRegions, drawRoutes, project, regionAt, routeArc, toRadians } from './globe.js';
import { landDots } from './land.js';
import styles from './globe-hero.scss?inline';

// Degrees between land dots, along rows of latitude and across them.
const DOT_STEP = 1.25;
// Where the globe sits: wide heroes put it right of the copy, at the
// container's edge; narrow ones raise it from the bottom, under the copy. Matches
// the breakpoint in the styles.
const WIDE = 896;
// Idle spin (radians per second), and how long a hand keeps it waiting (ms).
const AUTO_SPIN = 0.06;
const IDLE_MS = 2500;
// Thrown spin slows by this rate (per second).
const SPIN_DECAY = 2.8;
const MAX_TILT = 1.05;
const KEY_TURN = 0.2;
const CLICK_PX = 4;
const HIT_PX = 14;
// Pulses per second along each route.
const PULSE_PACE = 0.22;
const JITTER_MS = 2;
const TICK_MS = 1400;
const FOCUS = springFeel(0.7, 0.05);
// Labels show only on the near side, clear of the limb.
const LABEL_DEPTH = 0.12;
// The room a label takes, in px, so labels never overlap; fixed, so
// placing them reads no layout.
const LABEL_ROOM = { w: 96, h: 26 };

// Each region's `ms` is the round trip from users near it.
const DEMO_REGIONS = [
  { id: 'sfo1', name: 'San Francisco', lat: 37.7, lon: -122.4, ms: 12 },
  { id: 'iad1', name: 'Washington', lat: 38.9, lon: -77.4, ms: 10 },
  { id: 'gru1', name: 'São Paulo', lat: -23.5, lon: -46.6, ms: 20 },
  { id: 'lhr1', name: 'London', lat: 51.5, lon: -0.1, ms: 8 },
  { id: 'fra1', name: 'Frankfurt', lat: 50.1, lon: 8.7, ms: 6 },
  { id: 'cpt1', name: 'Cape Town', lat: -33.9, lon: 18.4, ms: 18 },
  { id: 'bom1', name: 'Mumbai', lat: 19.1, lon: 72.9, ms: 14 },
  { id: 'sin1', name: 'Singapore', lat: 1.35, lon: 103.8, ms: 9 },
  { id: 'hnd1', name: 'Tokyo', lat: 35.6, lon: 139.8, ms: 7 },
  { id: 'syd1', name: 'Sydney', lat: -33.9, lon: 151.2, ms: 11 },
];

const DEMO_ROUTES = [
  ['iad1', 'gru1'],
  ['iad1', 'lhr1'],
  ['sfo1', 'iad1'],
  ['lhr1', 'fra1'],
  ['fra1', 'cpt1'],
  ['fra1', 'bom1'],
  ['bom1', 'sin1'],
  ['sin1', 'hnd1'],
  ['sin1', 'syd1'],
  ['sfo1', 'hnd1'],
];

// The shorter way round from one longitude to another.
const wrapAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));

/**
 * A hero for infrastructure: a large dotted globe off the right edge that
 * you can drag to spin, routes between regions with a pulse running along
 * each, and live latency labels on every region. Click a region to turn it
 * to the front and light its routes; the arrow keys turn the globe, Escape
 * clears the selection, and the corner button pauses the motion.
 *
 * Regions are `{ id, name, lat, lon, ms }` in degrees, where `ms` is the
 * latency shown; routes are pairs of region ids.
 *
 * @attr {string} brand - The default eyebrow
 * @attr {string} heading
 * @attr {string} description
 * @attr {Array<object>} regions (JSON)
 * @attr {Array<Array<string>>} routes (JSON)
 * @attr {string} region - The selected region's id
 * @attr {boolean} paused - Hold the globe and its pulses still
 * @fires lw-select - A region was selected or cleared; `detail: { region }`
 * @slot eyebrow - A small line above the heading; the brand by default
 * @slot actions - Calls to action under the description; two by default
 */
export class LwGlobeHero extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    brand: { default: 'lower Build Farm' },
    heading: { default: 'Every build runs next door.' },
    description: { default: 'Push once and the build runs in the closest of 38 regions. The object cache follows you, so no link step waits on an ocean.' },
    regions: { type: Object, default: DEMO_REGIONS },
    routes: { type: Object, default: DEMO_ROUTES },
    region: { default: '' },
    paused: { type: Boolean, reflect: true },
  };

  #context = null;
  #dots = landDots(DOT_STEP);
  #view = { cx: 0, cy: 0, r: 0, lon: toRadians(-58), lat: toRadians(6) };
  #places = [];
  #lines = [];
  #ink = '';
  #spin = 0;
  #idleUntil = 0;
  #drag = null;
  #stopFocus = null;
  #frame = 0;
  #last = 0;
  #time = 0;
  #visible = false;
  #ticker = 0;

  render() {
    return `<canvas tabindex="0" role="img"></canvas><div class="shade" aria-hidden="true"></div><div class="labels" aria-hidden="true"></div><span class="probe"></span>
<div class="container"><div class="copy"><slot name="eyebrow"><p class="brand"></p></slot><h1 class="title"></h1><p class="description"></p>
<div class="actions"><slot name="actions"><lw-button class="deploy">Start building<span slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button><lw-button class="network" variant="ghost">See the regions</lw-button></slot></div></div>
</div><lw-button class="pause" variant="ghost" icon-only aria-pressed="false"></lw-button>`;
  }

  connected() {
    const options = { signal: this.signal };
    const canvas = this.query('canvas');
    this.#context = canvas.getContext('2d');
    const resize = new ResizeObserver(() => this.#resize());
    resize.observe(this);
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
      clearInterval(this.#ticker);
      this.#stopFocus?.();
    });
    watchVisibility(this, (visible) => {
      this.#visible = visible;
      this.#start();
    }, this.signal);
    // The globe is drawn in the text colour, which changes with the theme.
    watchTheme(() => {
      this.#ink = getComputedStyle(this.query('.probe')).color;
      this.#paint();
    }, this.signal);
    canvas.addEventListener('pointerdown', (event) => this.#down(event), options);
    canvas.addEventListener('pointermove', (event) => this.#move(event), options);
    for (const type of ['pointerup', 'pointercancel']) canvas.addEventListener(type, (event) => this.#up(event), options);
    canvas.addEventListener('keydown', (event) => this.#key(event), options);
    this.query('.pause').addEventListener('click', () => (this.paused = !this.paused), options);
    // Latencies move a little every tick, like a live dashboard.
    this.#ticker = setInterval(() => this.#jitter(), TICK_MS);
  }

  updated(changed) {
    this.query('.brand').textContent = this.brand ?? '';
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    if (changed.has('regions') || changed.has('routes')) this.#build();
    if (changed.has('region') || changed.has('regions') || changed.has('routes')) this.#select(this.region);
    if (changed.has('paused')) {
      const button = this.query('.pause');
      button.innerHTML = strokeIcon(this.paused ? play : pause, 16);
      button.ariaLabel = this.paused ? 'Play the globe' : 'Pause the globe';
      button.setAttribute('aria-pressed', String(Boolean(this.paused)));
      this.#start();
    }
    this.#paint();
  }

  #build() {
    this.#places = this.regions.map((region) => ({ ...region, lat: toRadians(region.lat), lon: toRadians(region.lon), base: region.ms ?? 10, selected: false }));
    const byId = new Map(this.#places.map((place) => [place.id, place]));
    this.#lines = this.routes
      .map(([from, to], i) => ({ from: byId.get(from), to: byId.get(to), phase: (i * 0.37) % 1, dim: false }))
      .filter(({ from, to }) => from && to)
      .map((line) => ({ ...line, points: routeArc(line.from, line.to) }));
    this.query('.labels').innerHTML = this.#places.map((place) => `<span class="label"><span class="code">${escapeHtml(place.id)}</span><span class="ms rolling"></span><span class="unit">ms</span></span>`).join('');
    this.#paintLatency();
    this.query('canvas').ariaLabel = `Globe of ${this.#places.length} regions: ${this.#places.map((place) => place.name).join(', ')}. Drag or use the arrow keys to turn it.`;
  }

  #select(id) {
    const selected = this.#places.find((place) => place.id === id);
    for (const place of this.#places) place.selected = place === selected;
    for (const line of this.#lines) line.dim = Boolean(selected) && line.from !== selected && line.to !== selected;
    if (selected) this.#focus(selected);
  }

  #resize() {
    const canvas = this.query('canvas');
    const { width, height } = fitCanvas(canvas, this.#context);
    if (width >= WIDE) {
      // The globe's right edge lines up with the container's.
      const box = this.query('.container').getBoundingClientRect();
      const left = box.left - canvas.getBoundingClientRect().left;
      const r = Math.min(height * 0.46, box.width * 0.34);
      Object.assign(this.#view, { cx: left + box.width - r, cy: height * 0.54, r });
    } else {
      const r = width * 0.62;
      Object.assign(this.#view, { cx: width * 0.55, cy: height - r * 0.4, r });
    }
    this.#ink = getComputedStyle(this.query('.probe')).color;
    this.#paint();
  }

  get #moving() {
    return !this.paused && !reducedMotion.matches;
  }

  #paint() {
    const context = this.#context;
    const view = this.#view;
    if (!context || !view.r) return;
    const canvas = this.query('canvas');
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawEarth(context, view, this.#dots, this.#ink);
    drawRoutes(context, view, this.#lines, this.#ink, this.#time, reducedMotion.matches ? 0 : PULSE_PACE);
    drawRegions(context, view, this.#places, this.#ink);
    this.#placeLabels();
  }

  // Each region's latency sits in a box beside its marker.
  #placeLabels() {
    const labels = this.query('.labels').children;
    const point = { x: 0, y: 0, z: 0, visible: false };
    // Nearer labels win a spot; one that would overlap a nearer one hides.
    const taken = [];
    const order = this.#places.map((place, i) => ({ place, i, z: project(this.#view, place.lat, place.lon, 0, point).z })).sort((a, b) => b.z - a.z);
    for (const { place, i } of order) {
      project(this.#view, place.lat, place.lon, 0, point);
      const label = labels[i];
      const box = { x: point.x, y: point.y };
      const clear = !taken.some((other) => Math.abs(other.x - box.x) < LABEL_ROOM.w && Math.abs(other.y - box.y) < LABEL_ROOM.h);
      const shown = point.z > LABEL_DEPTH && (clear || place.selected);
      label.toggleAttribute('data-shown', shown);
      label.toggleAttribute('data-selected', place.selected);
      if (!shown) continue;
      taken.push(box);
      label.style.translate = `${point.x.toFixed(1)}px ${point.y.toFixed(1)}px`;
      // Labels fade as they near the limb.
      label.style.opacity = String(Math.min(1, (point.z - LABEL_DEPTH) * 4));
    }
  }

  #paintLatency() {
    const labels = this.query('.labels').children;
    this.#places.forEach((place, i) => roll(labels[i].querySelector('.ms'), String(place.ms ?? place.base)));
  }

  #jitter() {
    if (!this.#visible || !this.#moving) return;
    for (const place of this.#places) place.ms = Math.max(1, place.base + Math.round((Math.random() * 2 - 1) * JITTER_MS));
    this.#paintLatency();
  }

  // ---- Motion ----

  #start() {
    if (this.#frame || !this.#visible || !this.#moving) return;
    this.#last = performance.now();
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  #tick(now) {
    this.#frame = 0;
    if (!this.#visible) return;
    const dt = Math.min((now - this.#last) / 1000, 0.05);
    this.#last = now;
    const view = this.#view;
    if (this.#moving) {
      this.#time += dt;
      if (!this.#drag && !this.#stopFocus) {
        // A throw coasts to a stop, then the idle spin takes over again.
        this.#spin *= Math.exp(-SPIN_DECAY * dt);
        view.lon += this.#spin * dt;
        if (now > this.#idleUntil && !this.region) view.lon += AUTO_SPIN * dt;
      }
    }
    this.#paint();
    if (this.#moving) this.#frame = requestAnimationFrame((time) => this.#tick(time));
  }

  #hold() {
    this.#idleUntil = performance.now() + IDLE_MS;
  }

  // Turns the globe so a region faces the viewer.
  #focus(place) {
    this.#stopFocus?.();
    const view = this.#view;
    const from = { lon: view.lon, lat: view.lat };
    const turn = wrapAngle(place.lon - from.lon);
    const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, place.lat)) - from.lat;
    this.#spin = 0;
    const done = () => {
      this.#stopFocus = null;
      this.#hold();
      this.#paint();
    };
    if (reducedMotion.matches) {
      Object.assign(view, { lon: from.lon + turn, lat: from.lat + tilt });
      done();
      return;
    }
    this.#stopFocus = springTo(0, 1, {
      ...FOCUS,
      update: (t) => {
        view.lon = from.lon + turn * t;
        view.lat = from.lat + tilt * t;
        if (!this.#frame) this.#paint();
      },
      done,
    });
  }

  #setRegion(id) {
    if (id === this.region) return;
    this.region = id;
    this.emit('select', { region: this.regions.find((region) => region.id === id) ?? null });
  }

  #onGlobe(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const view = this.#view;
    return Math.hypot(event.clientX - rect.left - view.cx, event.clientY - rect.top - view.cy) <= view.r * 1.04;
  }

  #down(event) {
    // Nothing to turn until the globe has a size, and only the globe turns it.
    if (!event.isPrimary || event.button !== 0 || !this.#view.r || !this.#onGlobe(event)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    this.#stopFocus?.();
    this.#stopFocus = null;
    const view = this.#view;
    this.#drag = { x: event.clientX, y: event.clientY, lon: view.lon, lat: view.lat, moved: false, lastX: event.clientX, lastT: event.timeStamp };
    this.#spin = 0;
    this.toggleAttribute('data-dragging', true);
  }

  #move(event) {
    const drag = this.#drag;
    if (!drag) return;
    const view = this.#view;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > CLICK_PX) drag.moved = true;
    // A point under the finger stays under it, near the centre.
    view.lon = drag.lon - dx / view.r;
    view.lat = Math.max(-MAX_TILT, Math.min(MAX_TILT, drag.lat + dy / view.r));
    const dt = (event.timeStamp - drag.lastT) / 1000;
    if (dt > 0) this.#spin = -(event.clientX - drag.lastX) / view.r / dt;
    drag.lastX = event.clientX;
    drag.lastT = event.timeStamp;
    this.#hold();
    if (!this.#frame) this.#paint();
  }

  #up(event) {
    const drag = this.#drag;
    if (!drag) return;
    this.#drag = null;
    this.toggleAttribute('data-dragging', false);
    this.#hold();
    // A spin isn't thrown by a hand that stopped before letting go.
    if (event.timeStamp - drag.lastT > 80) this.#spin = 0;
    if (drag.moved) return;
    this.#spin = 0;
    const rect = event.currentTarget.getBoundingClientRect();
    const place = regionAt(this.#view, this.#places, event.clientX - rect.left, event.clientY - rect.top, HIT_PX);
    this.#setRegion(place?.id ?? '');
  }

  #key(event) {
    const view = this.#view;
    const turn = { ArrowLeft: [KEY_TURN, 0], ArrowRight: [-KEY_TURN, 0], ArrowUp: [0, -KEY_TURN], ArrowDown: [0, KEY_TURN] }[event.key];
    if (event.key === 'Escape') this.#setRegion('');
    if (!turn) return;
    event.preventDefault();
    this.#stopFocus?.();
    this.#stopFocus = null;
    view.lon += turn[0];
    view.lat = Math.max(-MAX_TILT, Math.min(MAX_TILT, view.lat + turn[1]));
    this.#hold();
    this.#paint();
  }
}
