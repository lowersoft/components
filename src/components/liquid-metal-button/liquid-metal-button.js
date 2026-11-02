import { SPINNER_ICON, iconStyles } from '../../core/icons.js';
import { reducedMotion } from '../../core/motion.js';
import { LwButton } from '../button/button.js';
import buttonStyles from '../button/button.scss?inline';
import styles from './liquid-metal-button.scss?inline';

const RIMS = { sm: 1.75, md: 2, lg: 2.25 };
// Hovered, the metal runs this much faster; a press surges it for a moment.
const HOVER_BOOST = 2.2;
const PRESS_SURGE = 5;

const VERTEX = `attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// Bright and dark bands of chrome flow around the ring, warped by slow
// waves. Each color channel reads the bands a little apart, so where a
// bright band meets a dark one a thin rainbow fringe shows.
const FRAGMENT = `precision mediump float;
uniform vec2 u_size;
uniform float u_time;
uniform float u_iridescence;
uniform vec3 u_tint;
varying vec2 v_uv;

float chrome(float x) {
  float v = 0.5 + 0.36 * sin(x) + 0.2 * sin(x * 2.0 + 1.7) - 0.08 * sin(x * 5.0 + 0.4);
  return clamp(v * v * 1.25, 0.0, 1.0);
}

void main() {
  vec2 p = (v_uv - 0.5) * u_size;
  float angle = atan(p.y, p.x * u_size.y / u_size.x);
  float t = u_time;
  float warp = 0.9 * sin(v_uv.x * 5.0 + t * 0.8) + 0.6 * sin(v_uv.y * 7.0 - t * 1.3 + v_uv.x * 3.0);
  float x = angle * 2.0 + warp + t * 1.2;
  float spread = 0.32 * u_iridescence;
  vec3 fringe = vec3(chrome(x - spread), chrome(x), chrome(x + spread));
  vec3 color = mix(vec3(chrome(x)), fringe, clamp(u_iridescence, 0.0, 1.0));
  // A soft top light, as on polished metal.
  color += 0.12 * smoothstep(0.2, 1.0, v_uv.y);
  gl_FragColor = vec4(color * u_tint, 1.0);
}`;

const parseTint = (hex) => {
  if (!hex || !/^#?[\da-f]{3}([\da-f]{3})?$/i.test(hex)) return [1, 1, 1];
  const value = hex.replace('#', '');
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
  // Lifted towards white, so a tint colors the metal without darkening it.
  return [0, 2, 4].map((i) => 0.45 + 0.55 * (Number.parseInt(full.slice(i, i + 2), 16) / 255));
};

/**
 * A button ringed in flowing liquid metal: bright bands of chrome pour
 * around its edge, with a thin rainbow sheen where they meet, around a face
 * that is light or dark to suit the page. Hovering speeds the flow; a press
 * gives it a short surge.
 *
 * The metal is a small WebGL shader. It pauses off screen and in a hidden
 * tab, holds still for reduced motion, and without WebGL a CSS chrome ring
 * turns in its place. Everything else is `<lw-button>`: `type`,
 * `disabled`, `disabled-reason`, `loading` and `shortcut` work the same.
 * A `circle` holds one icon; give it an `aria-label`.
 *
 * @attr {'sm'|'md'|'lg'} size - 36, 44 or 54 pixels tall
 * @attr {'pill'|'circle'} shape
 * @attr {'auto'|'light'|'dark'} theme - The face; `auto` follows the page
 * @attr {string} tint - A hex color for the metal; silver when left out
 * @attr {number} speed - How fast the metal flows, from 0 (still) to 3
 * @attr {number} iridescence - Strength of the rainbow sheen, from 0 to 1
 * @attr {number} rim - Ring thickness in pixels; by size when left out
 * @csspart face - The surface inside the ring
 */
export class LwLiquidMetalButton extends LwButton {
  static styles = [buttonStyles, iconStyles, styles];
  static props = {
    ...LwButton.props,
    shape: { default: 'pill', reflect: true },
    theme: { default: 'auto' },
    tint: {},
    speed: { type: Number, default: 1 },
    iridescence: { type: Number, default: 0.6 },
    rim: { type: Number },
  };

  #gl = null;
  #uniforms = null;
  #frame = 0;
  #last = 0;
  #time = Math.random() * 20;
  #boost = 1;
  #surge = 0;
  #hovered = false;
  #visible = false;
  #width = 0;
  #height = 0;

  render() {
    return `<button class="button" part="button"><span class="metal" aria-hidden="true"><canvas class="shader"></canvas><span class="ring"></span></span><span class="face" part="face" aria-hidden="true"></span><span class="label"><span class="spin">${SPINNER_ICON}</span><slot name="start"></slot><slot></slot><slot name="end"></slot><span class="keys" aria-hidden="true"></span></span></button><span class="reason" part="reason" id="reason" role="tooltip"></span>`;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    const button = this.query('.button');
    button.addEventListener('pointerenter', () => this.#hover(true), options);
    button.addEventListener('pointerleave', () => this.#hover(false), options);
    button.addEventListener('pointerdown', () => this.#press(), options);
    button.addEventListener('keydown', (event) => (event.key === 'Enter' || event.key === ' ') && this.#press(), options);
    document.addEventListener('visibilitychange', () => this.#run(), options);
    reducedMotion.addEventListener('change', () => this.#run(), options);
    const retheme = () => this.#paintTheme();
    const themed = new MutationObserver(retheme);
    themed.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', retheme, options);
    const seen = new IntersectionObserver(([entry]) => {
      this.#visible = entry.isIntersecting;
      this.#run();
    });
    seen.observe(this);
    const sized = new ResizeObserver(() => this.#resize());
    sized.observe(button);
    if (!this.#gl) this.#setup();
    this.signal.addEventListener('abort', () => {
      themed.disconnect();
      seen.disconnect();
      sized.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
  }

  updated(changed) {
    super.updated(changed);
    const rim = Math.min(6, Math.max(1, this.rim ?? RIMS[this.size] ?? RIMS.md));
    this.style.setProperty('--_rim', `${rim}px`);
    if (changed.has('theme')) this.#paintTheme();
    if (changed.has('tint') && this.tint) this.style.setProperty('--_tint', this.tint);
    else if (changed.has('tint')) this.style.removeProperty('--_tint');
    this.#draw();
  }

  // The face: the theme attribute on <html>, else the system scheme.
  #paintTheme() {
    let dark = this.theme === 'dark';
    if (this.theme !== 'dark' && this.theme !== 'light') {
      const scheme = getComputedStyle(document.documentElement).colorScheme;
      dark = scheme === 'dark' || (scheme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
    }
    this.toggleAttribute('data-dark', dark);
  }

  #setup() {
    const canvas = this.query('.shader');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
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
    const vertex = compile(gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (vertex && fragment) {
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
    }
    if (!vertex || !fragment || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
      this.toggleAttribute('data-fallback', true);
      return;
    }
    gl.useProgram(program);
    // One triangle that covers the whole canvas.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    this.#uniforms = Object.fromEntries(['u_size', 'u_time', 'u_iridescence', 'u_tint'].map((name) => [name, gl.getUniformLocation(program, name)]));
    this.#gl = gl;
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.#gl = null;
      this.toggleAttribute('data-fallback', true);
    }, { signal: this.signal });
  }

  #resize() {
    const button = this.query('.button');
    this.#width = button.offsetWidth;
    this.#height = button.offsetHeight;
    const canvas = this.query('.shader');
    const ratio = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(this.#width * ratio));
    canvas.height = Math.max(1, Math.round(this.#height * ratio));
    this.#gl?.viewport(0, 0, canvas.width, canvas.height);
    this.#draw();
  }

  #hover(on) {
    this.#hovered = on;
    this.#run();
  }

  #press() {
    if (this.disabled || this.loading) return;
    this.#surge = PRESS_SURGE;
    this.#run();
  }

  // Animates only while it can be seen, the tab is open and motion is welcome.
  #run() {
    const live = this.#gl && this.#visible && !document.hidden && !reducedMotion.matches && (this.speed ?? 1) > 0;
    if (live && !this.#frame) {
      this.#last = performance.now();
      this.#frame = requestAnimationFrame((now) => this.#tick(now));
    } else if (!live) {
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
      this.#draw();
    }
  }

  #tick(now) {
    this.#frame = 0;
    const dt = Math.min(0.05, (now - this.#last) / 1000);
    this.#last = now;
    const goal = this.#hovered ? HOVER_BOOST : 1;
    this.#boost += (goal - this.#boost) * (1 - Math.exp(-6 * dt));
    this.#surge *= Math.exp(-4.5 * dt);
    const speed = Math.min(3, Math.max(0, this.speed ?? 1));
    this.#time += dt * speed * (this.#boost + this.#surge);
    this.#draw();
    this.#run();
  }

  #draw() {
    const gl = this.#gl;
    if (!gl || !this.#width) return;
    const u = this.#uniforms;
    gl.uniform2f(u.u_size, this.#width, this.#height);
    gl.uniform1f(u.u_time, this.#time);
    gl.uniform1f(u.u_iridescence, Math.min(1, Math.max(0, this.iridescence ?? 0.6)));
    gl.uniform3f(u.u_tint, ...parseTint(this.tint));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
