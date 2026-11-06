import '../button/index.js';
import { escapeHtml } from '../../core/dom.js';
import { heroPillActions, paintPillActions } from '../../core/hero.js';
import { strokeIcon } from '../../core/icons.js';
import { pause, play } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { watchTheme } from '../../core/theme.js';
import styles from './cloud-hero.scss?inline';

// The clouds are soft, so the canvas draws at this share of its size and
// the browser scales it up, at most this many times a second.
const SCALE = 0.6;
const FRAME_MS = 1000 / 30;
// The sky holds still while the page scrolls, and moves again this long after.
const SETTLE_MS = 160;

const VERTEX = `attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;

// Layered gradient noise, warped into rounded lobes, makes the cloud field.
// Cover is weighted to the bottom corners and the top edges and kept off
// the band behind the copy. Each point is lit from the upper right by
// sampling the field one step towards the sun: where it thins that way the
// cloud's top catches the light, where it thickens it sits in its own
// shade. The sky is the page's CSS gradient behind; only the clouds are
// drawn, with their coverage as alpha.
const FRAGMENT = `precision highp float;
uniform vec2 u_size;
uniform float u_time;
uniform vec3 u_light;
uniform vec3 u_shade;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i) * 6.2831853;
  float b = hash(i + vec2(1.0, 0.0)) * 6.2831853;
  float c = hash(i + vec2(0.0, 1.0)) * 6.2831853;
  float d = hash(i + vec2(1.0, 1.0)) * 6.2831853;
  float va = dot(vec2(cos(a), sin(a)), f);
  float vb = dot(vec2(cos(b), sin(b)), f - vec2(1.0, 0.0));
  float vc = dot(vec2(cos(c), sin(c)), f - vec2(0.0, 1.0));
  float vd = dot(vec2(cos(d), sin(d)), f - vec2(1.0, 1.0));
  return 0.5 + 0.75 * mix(mix(va, vb, u.x), mix(vc, vd, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 turn = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = turn * p * 2.03 + vec2(11.3, 7.7);
    amplitude *= 0.5;
  }
  return value;
}

// Folded noise: each octave bent back on itself, so it piles into puffs
// with creases between them, the lumpy tops of a cumulus.
float billow(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 turn = mat2(0.6, -0.8, 0.8, 0.6);
  for (int i = 0; i < 3; i++) {
    value += amplitude * abs(noise(p) * 2.0 - 1.0);
    p = turn * p * 2.1 + vec2(3.1, 17.9);
    amplitude *= 0.5;
  }
  return value;
}

// Broad shapes drift slowly with the wind; the puffs on them roll a little
// faster, so the edges keep changing.
float field(vec2 p, float t) {
  vec2 q = p + vec2(t * 0.02, 0.0);
  float shape = fbm(q * 1.15);
  float puffs = billow(q * 2.3 + vec2(t * 0.028, -t * 0.008) + shape * 0.8);
  // Puffs only build on a shape, so no stray flecks sit in open sky.
  return shape * 0.8 + puffs * 0.42 * smoothstep(0.32, 0.58, shape);
}

float cover(vec2 uv) {
  float side = abs(uv.x - 0.5) * 2.0;
  float bottom = smoothstep(0.7, 0.0, uv.y) * mix(0.62, 1.0, side);
  float top = smoothstep(0.7, 1.0, uv.y) * mix(0.18, 0.78, side);
  float edges = smoothstep(0.5, 1.0, side) * 0.62;
  float amount = clamp(bottom + top + edges, 0.0, 1.0);
  // Clear sky behind the headline and the buttons.
  vec2 d = (uv - vec2(0.5, 0.56)) * vec2(1.0, 1.5);
  return amount * smoothstep(0.22, 0.5, length(d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_size;
  vec2 p = gl_FragCoord.xy / u_size.y * 1.85;
  float n = field(p, u_time);
  float threshold = 0.98 - cover(uv) * 0.74;
  float alpha = smoothstep(threshold, threshold + 0.16, n);
  if (alpha < 0.002) {
    gl_FragColor = vec4(0.0);
    return;
  }
  vec2 sun = vec2(0.6, 0.8) * 0.09;
  float toward = field(p + sun, u_time);
  float lit = clamp(0.72 + (n - toward) * 3.2, 0.0, 1.0);
  // Deeper in a bank, and lower down, a cloud is a little darker.
  lit *= mix(0.78, 1.0, smoothstep(threshold + 0.4, threshold + 0.05, n));
  lit *= mix(0.86, 1.0, uv.y);
  vec3 color = mix(u_shade, u_light, lit);
  gl_FragColor = vec4(color * alpha, alpha);
}`;

// Any CSS colour as sRGB floats, read back from a painted pixel.
let ink = null;
const toRgb = (css) => {
  ink ??= Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
  ink.clearRect(0, 0, 1, 1);
  ink.fillStyle = '#fff';
  ink.fillStyle = css;
  ink.fillRect(0, 0, 1, 1);
  const [r, g, b] = ink.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
};

/**
 * A centred hero under a sky of slowly drifting clouds. Banks rise from the
 * bottom corners and thin wisps cross the top while the band behind the
 * copy stays clear sky, so the text needs no overlay. The clouds are a
 * small fragment shader in raw WebGL, lit from the upper right so their
 * tops catch the light and their folds sit in shade.
 *
 * The sky is a CSS gradient, there from the first paint and left alone
 * where WebGL is missing; the clouds fade in over it on their first frame.
 * Neutral by default, day and night with the theme; give it a palette with
 * the four custom properties below, `light-dark()` included. It draws at a
 * reduced size and frame rate, rests off screen, in a hidden tab and while
 * the page scrolls, holds a still sky for reduced motion, and the corner
 * button pauses it.
 *
 * @attr {string} heading - The headline; a line break starts a new line
 * @attr {string} description
 * @attr {string} primary - The main action's label
 * @attr {string} secondary - The second action's label; none when empty
 * @attr {number} speed - How fast the clouds drift; 0.5 is half as fast
 * @attr {boolean} paused - Holds the sky still
 * @slot actions - Your own actions, such as links, instead of the two buttons
 * @csspart sky - The sky and its clouds
 * @cssprop --lw-cloud-hero-sky-top - The sky at the top
 * @cssprop --lw-cloud-hero-sky-bottom - The sky at the bottom
 * @cssprop --lw-cloud-hero-cloud - The clouds where the light falls
 * @cssprop --lw-cloud-hero-shade - The clouds in their own shade
 * @cssprop --lw-cloud-hero-min-height - How tall the section is at least; 48rem by default
 */
export class LwCloudHero extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Compile on the ground.\nRun above the clouds.' },
    description: { default: 'lower builds one static binary on your machine and rolls it out to every region in seconds. Preview, verify and promote each release while the weather stays out of production.' },
    primary: { default: 'Start for free' },
    secondary: { default: 'Watch the tour' },
    speed: { type: Number, default: 1 },
    paused: { type: Boolean, reflect: true },
  };

  #gl = null;
  #uniforms = {};
  #time = 0;
  #last = 0;
  #drawn = 0;
  #frame = 0;
  #visible = false;
  #scrolling = 0;

  render() {
    return `<section class="hero" aria-labelledby="heading"><div class="sky" part="sky"><canvas class="clouds" aria-hidden="true"></canvas></div>
<div class="content"><h1 class="title rise" id="heading"></h1><p class="description rise"></p><div class="actions rise">${heroPillActions()}</div></div>
<lw-button class="pause" variant="ghost" icon-only aria-pressed="false"></lw-button><span class="probe" data-tone="light"></span><span class="probe" data-tone="shade"></span></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.#setup();
    this.#readColors();
    const sized = new ResizeObserver(() => this.#resize());
    sized.observe(this.query('.hero'));
    const seen = new IntersectionObserver(([entry]) => {
      this.#visible = entry.isIntersecting;
      // The copy rises in the first time it is seen.
      if (this.#visible) this.toggleAttribute('data-shown', true);
      this.#run();
    });
    seen.observe(this);
    document.addEventListener('visibilitychange', () => this.#run(), options);
    reducedMotion.addEventListener('change', () => this.#run(), options);
    addEventListener('scroll', () => {
      clearTimeout(this.#scrolling);
      this.#scrolling = setTimeout(() => {
        this.#scrolling = 0;
        this.#run();
      }, SETTLE_MS);
      this.#run();
    }, { passive: true, signal: this.signal });
    watchTheme(() => {
      this.#readColors();
      this.#draw();
    }, this.signal);
    this.query('.pause').addEventListener('click', () => (this.paused = !this.paused), options);
    this.signal.addEventListener('abort', () => {
      sized.disconnect();
      seen.disconnect();
      clearTimeout(this.#scrolling);
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
  }

  updated(changed) {
    if (changed.has('heading')) {
      const lines = String(this.heading ?? '').split('\n').filter((line) => line.trim());
      this.query('.title').innerHTML = lines.map((line) => `<span class="line">${escapeHtml(line)}</span>`).join(' ');
    }
    this.query('.description').textContent = this.description ?? '';
    paintPillActions(this);
    if (changed.has('paused')) {
      const button = this.query('.pause');
      button.innerHTML = strokeIcon(this.paused ? play : pause, 16);
      button.ariaLabel = this.paused ? 'Play the clouds' : 'Pause the clouds';
      button.setAttribute('aria-pressed', String(Boolean(this.paused)));
    }
    this.#run();
  }

  #setup() {
    const canvas = this.query('.clouds');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
    const fallback = () => this.toggleAttribute('data-fallback', true);
    if (!gl) return fallback();
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
    if (!vs || !fs || !gl.getProgramParameter(program, gl.LINK_STATUS)) return fallback();
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    for (const name of ['u_size', 'u_time', 'u_light', 'u_shade']) this.#uniforms[name] = gl.getUniformLocation(program, name);
    this.#gl = gl;
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.#gl = null;
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
      fallback();
    }, { signal: this.signal });
  }

  // The palette lives in CSS, `light-dark()` and all; probes resolve it to
  // colours for the shader whenever the theme changes.
  #readColors() {
    const gl = this.#gl;
    if (!gl) return;
    for (const probe of this.shadowRoot.querySelectorAll('.probe')) {
      gl.uniform3f(this.#uniforms[`u_${probe.dataset.tone}`], ...toRgb(getComputedStyle(probe).color));
    }
  }

  #resize() {
    const canvas = this.query('.clouds');
    const box = this.query('.hero').getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(box.width * SCALE));
    canvas.height = Math.max(1, Math.round(box.height * SCALE));
    this.#gl?.viewport(0, 0, canvas.width, canvas.height);
    this.#draw();
  }

  // Drifts only while someone can see it move; otherwise the sky holds
  // its last frame, which a resize or a theme change redraws.
  #run() {
    const live = this.#gl && this.#visible && !document.hidden && !this.paused && !reducedMotion.matches && !this.#scrolling;
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
    if (now - this.#drawn >= FRAME_MS - 2) {
      this.#time += (Math.min(100, now - this.#last) / 1000) * Math.max(0, this.speed ?? 1);
      this.#last = now;
      this.#drawn = now;
      this.#draw();
    }
    this.#run();
  }

  #draw() {
    const gl = this.#gl;
    if (!gl) return;
    const canvas = this.query('.clouds');
    gl.uniform2f(this.#uniforms.u_size, canvas.width, canvas.height);
    gl.uniform1f(this.#uniforms.u_time, this.#time);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.toggleAttribute('data-drawn', true);
  }
}
