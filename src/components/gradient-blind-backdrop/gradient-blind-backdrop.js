import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './gradient-blind-backdrop.scss?inline';

const SUNRISE = ['#0a0a0b', '#1c1a4a', '#6a2fd6', '#df2453', '#f8913c', '#fbe39a'];
const MAX_COLORS = 6;
const MIN_STRIPE = 26;
const MASKS = { none: 0, bottom: 1, top: 2, radial: 3, edges: 4 };
// How quickly the stripes follow the pointer and its coming and going, per second.
const FOLLOW = 6;

const VERTEX = `attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

// The frame is cut into stripes. Each one shows its own slice of a
// gradient that glows up from the bottom, lifted by a slow travelling wave
// and raised further near the pointer, then shaded round like a slat.
const FRAGMENT = `precision highp float;
uniform vec2 u_size;
uniform float u_time;
uniform float u_stripes;
uniform float u_angle;
uniform float u_wave;
uniform float u_frequency;
uniform float u_depth;
uniform float u_gap;
uniform float u_grain;
uniform float u_pull;
uniform vec2 u_pointer;
uniform float u_presence;
uniform int u_mask;
uniform vec3 u_background;
uniform vec3 u_colors[${MAX_COLORS}];
uniform int u_count;

float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0) * float(u_count - 1);
  vec3 color = u_colors[0];
  for (int i = 1; i < ${MAX_COLORS}; i++) {
    if (i >= u_count) break;
    color = mix(color, u_colors[i], clamp(t - float(i - 1), 0.0, 1.0));
  }
  return color;
}

// Turns a point about the frame's center, so the stripes can lean.
vec2 lean(vec2 p) {
  float a = radians(u_angle);
  vec2 c = p - 0.5 * u_size;
  return vec2(c.x * cos(a) - c.y * sin(a), c.x * sin(a) + c.y * cos(a)) + 0.5 * u_size;
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, u_size.y - gl_FragCoord.y);
  vec2 p = lean(frag);
  // Wide enough that a leaning frame is still covered at its corners.
  float span = u_size.x * (1.0 + abs(sin(radians(u_angle))) * 0.6);
  float u = (p.x - 0.5 * (u_size.x - span)) / span;
  float stripe = floor(u * u_stripes);
  float across = fract(u * u_stripes);
  float center = (stripe + 0.5) / u_stripes;
  float y = p.y / u_size.y;

  // Each stripe also keeps a small offset of its own, so neighbors step.
  float own = (hash(vec2(stripe, 7.31)) - 0.5) * 0.07 * (0.4 + u_wave);
  float wave = u_wave * 0.22 * sin(6.2832 * u_frequency * center - u_time * 0.55)
    + u_wave * 0.06 * sin(6.2832 * u_frequency * 2.3 * center + u_time * 0.37) + own;
  vec2 pointer = lean(u_pointer);
  float pu = (pointer.x - 0.5 * (u_size.x - span)) / span;
  float reach = exp(-pow((center - pu) * 5.5, 2.0));
  float rise = wave + u_pull * 0.32 * reach * u_presence;
  // Top of the frame is the first color; the glow climbs from the bottom.
  float t = (y + rise - 0.18) / 0.9;
  vec3 color = ramp(t);

  // Rounded across each slat: lit a little left of center, falling off
  // into a crisp dark seam. On a light page the fall-off is gentler, or
  // the seams turn the pale colors grey.
  float light = dot(u_background, vec3(0.2126, 0.7152, 0.0722));
  float side = abs(across * 2.0 - 1.0);
  float falloff = 0.32 * pow(side, 3.0) + 0.3 * smoothstep(0.82, 1.0, side);
  color *= 1.0 - u_depth * falloff * mix(1.0, 0.38, light);
  color += u_depth * 0.08 * exp(-pow((across - 0.3) * 5.0, 2.0)) * smoothstep(0.08, 0.6, t);

  float width = span / u_stripes;
  float edge = min(across, 1.0 - across) * width;
  color = mix(u_background, color, smoothstep(u_gap * 0.5 - 0.6, u_gap * 0.5 + 0.6, edge));

  vec2 uv = frag / u_size;
  float fade = 1.0;
  if (u_mask == 1) fade = smoothstep(1.0, 0.55, uv.y);
  else if (u_mask == 2) fade = smoothstep(0.0, 0.45, uv.y);
  else if (u_mask == 3) fade = 1.0 - smoothstep(0.25, 0.75, length((uv - 0.5) * vec2(1.0, 1.15)));
  else if (u_mask == 4) fade = smoothstep(0.0, 0.18, uv.x) * smoothstep(1.0, 0.82, uv.x) * smoothstep(0.0, 0.18, uv.y) * smoothstep(1.0, 0.82, uv.y);
  color = mix(u_background, color, fade);

  color += (hash(frag + fract(u_time * 7.0) * 61.0) - 0.5) * u_grain * 0.12;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

const toRgb = (hex, fallback) => {
  const value = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(hex ?? '')?.[1] ?? fallback.replace('#', '');
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
  return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16) / 255);
};

/**
 * A gradient sliced into glowing stripes, for behind a hero. The colors
 * glow up from the bottom like a horizon; each stripe shows its own slice,
 * lifted by a slow travelling wave and raised toward the pointer, and is
 * shaded round like a slat. Gaps, film grain and a fade at the edges are
 * there for content to sit on.
 *
 * Drawn by a WebGL shader at up to twice the pixel density. It stops off
 * screen, in a hidden tab, when `paused`, and with `speed` at 0 once the
 * pointer settles; with reduced motion it shows one still frame. Stripes
 * are never narrower than 26 pixels, so a narrow frame shows fewer.
 *
 * @attr {Array<string>} colors (JSON) - Two to six hex colors, from the top of the frame to the glowing bottom; start with the page color
 * @attr {string} background - Behind the gaps and fades; a light color makes a light backdrop
 * @attr {number} stripes
 * @attr {number} angle - The stripes' lean, in degrees
 * @attr {number} wave - How far the travelling wave lifts the stripes, 0 to 1
 * @attr {number} frequency - Crests of the wave across the frame
 * @attr {number} speed - 0 holds still until the pointer moves
 * @attr {number} depth - Rounded shading across each stripe; 0 is flat
 * @attr {number} gap - Space between stripes, in CSS pixels
 * @attr {number} grain - Film grain, 0 to 1
 * @attr {'none'|'bottom'|'top'|'radial'|'edges'} mask - Where it fades into the background
 * @attr {number} pull - How far stripes rise toward the pointer; 0 turns it off
 * @attr {number} dpr - Render scale; the device's, up to 2, by default
 * @attr {boolean} paused - Freezes the current frame
 * @slot - Content over the stripes
 * @csspart content - The layer the content sits in
 */
export class LwGradientBlindBackdrop extends LwElement {
  static styles = styles;
  static props = {
    colors: { type: Object, default: SUNRISE },
    background: { default: '#0a0a0b' },
    stripes: { type: Number, default: 18 },
    angle: { type: Number, default: 0 },
    wave: { type: Number, default: 0.35 },
    frequency: { type: Number, default: 1 },
    speed: { type: Number, default: 1 },
    depth: { type: Number, default: 0.55 },
    gap: { type: Number, default: 0 },
    grain: { type: Number, default: 0.35 },
    mask: { default: 'none' },
    pull: { type: Number, default: 0.6 },
    dpr: { type: Number },
    paused: { type: Boolean, reflect: true },
  };

  #gl = null;
  #uniforms = {};
  #ratio = 1;
  #time = 0;
  #frame = 0;
  #last = 0;
  #visible = false;
  // The pointer in CSS pixels, where the pull is, and whether it is over the frame.
  #target = { x: 0, y: 0, on: 0 };
  #pointer = { x: 0, y: 0, on: 0 };

  render() {
    return '<div class="stage"><canvas class="field" aria-hidden="true"></canvas><div class="content" part="content"><slot></slot></div></div>';
  }

  connected() {
    const options = { signal: this.signal };
    this.#setup();
    const stage = this.query('.stage');
    stage.addEventListener('pointermove', (event) => {
      const box = stage.getBoundingClientRect();
      Object.assign(this.#target, { x: event.clientX - box.left, y: event.clientY - box.top, on: 1 });
      if (!this.#pointer.on) Object.assign(this.#pointer, { x: this.#target.x, y: this.#target.y });
      this.#run();
    }, options);
    stage.addEventListener('pointerleave', () => {
      this.#target.on = 0;
      this.#run();
    }, options);
    const sized = new ResizeObserver(() => this.#resize());
    sized.observe(stage);
    const seen = new IntersectionObserver(([entry]) => {
      this.#visible = entry.isIntersecting;
      this.#run();
    });
    seen.observe(this);
    document.addEventListener('visibilitychange', () => this.#run(), options);
    reducedMotion.addEventListener('change', () => this.#run(), options);
    this.signal.addEventListener('abort', () => {
      sized.disconnect();
      seen.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
  }

  updated(changed) {
    this.style.setProperty('--_background', this.background || '#0a0a0b');
    if (changed.has('dpr')) this.#resize();
    this.#draw();
    this.#run();
  }

  #setup() {
    const canvas = this.query('.field');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) {
      this.toggleAttribute('data-fallback', true);
      return;
    }
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (vs && fs) {
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.bindAttribLocation(program, 0, 'a_pos');
      gl.linkProgram(program);
    }
    if (!vs || !fs || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
      this.toggleAttribute('data-fallback', true);
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const { name } = gl.getActiveUniform(program, i);
      this.#uniforms[name.replace('[0]', '')] = gl.getUniformLocation(program, name);
    }
    this.#gl = gl;
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.#gl = null;
      this.toggleAttribute('data-fallback', true);
    }, { signal: this.signal });
  }

  #resize() {
    const canvas = this.query('.field');
    const box = this.query('.stage').getBoundingClientRect();
    this.#ratio = Math.min(2, Math.max(0.5, this.dpr ?? devicePixelRatio ?? 1));
    canvas.width = Math.max(1, Math.round(box.width * this.#ratio));
    canvas.height = Math.max(1, Math.round(box.height * this.#ratio));
    this.#gl?.viewport(0, 0, canvas.width, canvas.height);
    this.#draw();
  }

  #run() {
    const live = this.#gl && this.#visible && !document.hidden && !this.paused && !reducedMotion.matches;
    if (live && !this.#frame) {
      this.#last = performance.now();
      this.#frame = requestAnimationFrame((now) => this.#tick(now));
    } else if (!live && this.#frame) {
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    }
  }

  #tick(now) {
    this.#frame = 0;
    const dt = Math.min(0.05, (now - this.#last) / 1000);
    this.#last = now;
    const speed = Math.max(0, this.speed ?? 1);
    this.#time += dt * speed;
    const follow = 1 - Math.exp(-FOLLOW * dt);
    const p = this.#pointer;
    const t = this.#target;
    p.x += (t.x - p.x) * follow;
    p.y += (t.y - p.y) * follow;
    p.on += (t.on - p.on) * follow;
    this.#draw();
    const settled = Math.abs(t.x - p.x) < 0.2 && Math.abs(t.on - p.on) < 0.002;
    if (speed > 0 || !settled) this.#run();
  }

  #draw() {
    const gl = this.#gl;
    if (!gl) return;
    const canvas = this.query('.field');
    const u = this.#uniforms;
    const ratio = this.#ratio;
    const colors = (Array.isArray(this.colors) && this.colors.length >= 2 ? this.colors : SUNRISE).slice(0, MAX_COLORS);
    const flat = new Float32Array(MAX_COLORS * 3);
    colors.forEach((color, i) => flat.set(toRgb(color, '#000000'), i * 3));
    const unit = (value, fallback) => Math.min(1, Math.max(0, value ?? fallback));
    const most = Math.max(2, Math.floor(canvas.width / ratio / MIN_STRIPE));
    gl.uniform2f(u.u_size, canvas.width, canvas.height);
    gl.uniform1f(u.u_time, this.#time);
    gl.uniform1f(u.u_stripes, Math.min(Math.max(1, Math.round(this.stripes || 18)), most));
    gl.uniform1f(u.u_angle, Math.max(-60, Math.min(60, this.angle ?? 0)));
    gl.uniform1f(u.u_wave, unit(this.wave, 0.35));
    gl.uniform1f(u.u_frequency, Math.max(0, this.frequency ?? 1));
    gl.uniform1f(u.u_depth, unit(this.depth, 0.55));
    gl.uniform1f(u.u_gap, Math.max(0, this.gap ?? 0) * ratio);
    gl.uniform1f(u.u_grain, unit(this.grain, 0.35));
    gl.uniform1f(u.u_pull, unit(this.pull, 0.6));
    gl.uniform2f(u.u_pointer, this.#pointer.x * ratio, this.#pointer.y * ratio);
    gl.uniform1f(u.u_presence, this.#pointer.on);
    gl.uniform1i(u.u_mask, MASKS[this.mask] ?? 0);
    gl.uniform3f(u.u_background, ...toRgb(this.background, '#0a0a0b'));
    gl.uniform3fv(u.u_colors, flat);
    gl.uniform1i(u.u_count, colors.length);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
