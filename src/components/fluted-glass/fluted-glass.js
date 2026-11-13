import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './fluted-glass.scss?inline';

const DEMO_SRC = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=1067&fit=crop&auto=format&q=80';
const MAX_RIBS = 64;
// How quickly the picture catches up with the pointer, per second.
const FOLLOW = 5;

const VERTEX = `attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// Each rib is a small glass cylinder. Light through it bends by the slope
// of its surface, so the picture is squeezed in the middle and pulled hard
// at the sides; colors part as it bends; the glass is clear at the crown
// and frosted toward the seams. A soft reflection rides each crown and
// moves with the pointer, the sides fall dark where light leaves at a
// grazing angle, and a hairline catches the light at every join. Poured
// glass is never quite even, so the bend wavers a little down each rib.
const FRAGMENT = `precision highp float;
uniform sampler2D u_image;
uniform vec2 u_canvas;
uniform vec2 u_image_size;
uniform vec2 u_focus;
uniform vec2 u_shift;
uniform float u_light;
uniform float u_edges[${MAX_RIBS + 1}];
uniform int u_count;
uniform float u_diffusion;
uniform float u_refraction;
uniform float u_variation;
uniform float u_aberration;
uniform float u_shade;
uniform float u_glint;
uniform float u_texture_size;
varying vec2 v_uv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

// Canvas to image coordinates: cover the frame, a little zoomed so a
// slide never shows an edge, cropped around the focal point.
vec2 cover(vec2 uv) {
  float canvas = u_canvas.x / u_canvas.y;
  float image = u_image_size.x / u_image_size.y;
  vec2 scale = canvas > image ? vec2(1.0, image / canvas) : vec2(canvas / image, 1.0);
  scale /= 1.16;
  return (1.0 - scale) * u_focus + uv * scale;
}

// Frosted glass. The picture's mipmaps give a smooth blur at any size;
// a ring of taps on a coarser level, stretched along the rib (reeded glass
// smears more along it), rounds it into a soft disc without banding.
vec3 soft(vec2 uv, float radius) {
  float level = log2(max(radius * u_texture_size, 1.0)) - 1.0;
  vec3 sum = texture2D(u_image, cover(uv), level).rgb * 2.0;
  for (int i = 0; i < 6; i++) {
    float a = float(i) * 1.047 + 0.52;
    sum += texture2D(u_image, cover(uv + vec2(cos(a), sin(a) * 2.0) * radius * 0.6), level).rgb;
  }
  return sum / 8.0;
}

void main() {
  float x = v_uv.x;
  float left = 0.0;
  float right = 1.0;
  float index = 0.0;
  for (int i = 0; i < ${MAX_RIBS}; i++) {
    if (i >= u_count) break;
    if (x >= u_edges[i] && x < u_edges[i + 1]) {
      left = u_edges[i];
      right = u_edges[i + 1];
      index = float(i);
    }
  }
  float span = (right - left) * 0.5;
  float center = left + span;
  // Across the rib: -1 at its left seam, 1 at its right.
  float t = clamp((x - center) / span, -1.0, 1.0);
  // The cylinder's height at t, and the slope light bends by.
  float height = sqrt(max(1.0 - t * t * 0.94, 0.06));
  float slope = t / height;
  float waver = (noise(vec2(index * 3.7, v_uv.y * 2.4)) - 0.5) * 0.35 * u_variation;
  float bend = t * (1.0 + u_refraction * 1.5) + (slope - t) * u_refraction * 0.55 + waver * u_refraction;
  vec2 spot = vec2(center + bend * span, v_uv.y) + u_shift;
  // Clear at the crown, frosted toward the seams.
  float radius = (0.0003 + u_diffusion * 0.0072) * (0.6 + 0.9 * t * t);
  // Dispersion grows with the bend.
  float split = u_aberration * 0.0045 * slope;
  vec3 color = vec3(soft(spot + vec2(split, 0.0), radius).r, soft(spot, radius).g, soft(spot - vec2(split, 0.0), radius).b);

  float side = abs(t);
  // Grazing light leaves the sides dark, darkest just inside each seam.
  color *= 1.0 - u_shade * (0.5 * pow(side, 3.0) + 0.28 * smoothstep(0.78, 0.96, side));
  // A soft reflection on the crown, sliding with the pointer.
  float crown = -0.38 + u_light * 0.3;
  color += u_glint * 0.16 * exp(-pow((t - crown) / 0.22, 2.0));
  // A hairline of light on each join, brighter on the lit side.
  color += u_glint * (smoothstep(0.93, 1.0, t) * 0.75 + smoothstep(-0.95, -1.0, t) * 0.3);
  // Glass is never quite colorless: a breath of green, and a lift.
  color = color * vec3(0.97, 1.0, 0.99) * 1.04;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

// A steady random sequence, so the ribs keep their widths between visits.
const seeded = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

/**
 * A picture seen through reeded glass. It is sliced into vertical ribs,
 * each a small cylindrical lens: it shows a wider slice of the picture,
 * darkens toward its sides, splits color at its seams and catches a
 * hairline of light where it meets the next. The ribs vary slightly in
 * width, like poured glass, and the glass softens what is behind it.
 * The picture slides with the pointer and sways slowly while it rests.
 * Content in the element sits on the glass.
 *
 * Drawn by a WebGL shader at up to twice the pixel density. It stops off
 * screen, in a hidden tab, when `paused`, and once nothing moves; with
 * reduced motion it shows one still frame. The image host must allow
 * cross-origin requests. Without WebGL the picture shows softened by CSS.
 *
 * @attr {string} src - The picture behind the glass; bold shapes of color read best
 * @attr {string} alt - What the picture shows; leave empty when it is decoration
 * @attr {number} ribs - Ribs across the width, 6 to 64
 * @attr {number} diffusion - How much the glass softens the picture, 0 (sharp) to 1
 * @attr {number} refraction - How strongly each rib bends, 0 to 1
 * @attr {number} variation - How much rib widths vary, 0 (even) to 1
 * @attr {number} aberration - Color split at the seams, 0 to 1
 * @attr {number} shade - Darkening toward each rib's sides, 0 to 1
 * @attr {number} glint - The line of light where ribs meet, 0 to 1
 * @attr {number} parallax - How far the picture slides with the pointer, 0 to 1
 * @attr {number} speed - Idle sway speed; 0 holds still until the pointer moves
 * @attr {string} focus - The focal point kept in frame when cropped, as "x y" from 0 to 1
 * @attr {number} dpr - Render scale; the device's, up to 2, by default
 * @attr {boolean} paused - Freezes the current frame
 * @slot - Content on the glass
 * @csspart content - The layer the content sits in
 */
export class LwFlutedGlass extends LwElement {
  static styles = styles;
  static props = {
    src: { default: DEMO_SRC },
    alt: { default: '' },
    ribs: { type: Number, default: 20 },
    diffusion: { type: Number, default: 0.7 },
    refraction: { type: Number, default: 0.55 },
    variation: { type: Number, default: 0.55 },
    aberration: { type: Number, default: 0.35 },
    shade: { type: Number, default: 0.7 },
    glint: { type: Number, default: 0.65 },
    parallax: { type: Number, default: 0.6 },
    speed: { type: Number, default: 1 },
    focus: { default: '0.5 0.5' },
    dpr: { type: Number },
    paused: { type: Boolean, reflect: true },
  };

  #gl = null;
  #program = null;
  #uniforms = {};
  #texture = null;
  #imageSize = [1, 1];
  #ready = false;
  #edges = new Float32Array(MAX_RIBS + 1);
  #ribCount = 20;
  #textureSize = 1024;
  #pointer = { x: 0, y: 0 };
  #shift = { x: 0, y: 0 };
  // Where the reflection sits, following the pointer.
  #light = 0;
  #time = 0;
  #frame = 0;
  #last = 0;
  #visible = false;
  #loading = 0;

  render() {
    return '<div class="stage"><canvas class="glass" aria-hidden="true"></canvas><img class="fallback" alt="" aria-hidden="true"><div class="content" part="content"><slot></slot></div></div>';
  }

  connected() {
    const options = { signal: this.signal };
    // The context and its program outlive a reconnect; only a lost one is redone.
    if (!this.#gl) this.#setup();
    this.query('.glass').addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.#gl = null;
      this.toggleAttribute('data-fallback', true);
    }, options);
    const stage = this.query('.stage');
    stage.addEventListener('pointermove', (event) => {
      const box = stage.getBoundingClientRect();
      this.#pointer = { x: ((event.clientX - box.left) / box.width) * 2 - 1, y: ((event.clientY - box.top) / box.height) * 2 - 1 };
      this.#run();
    }, options);
    stage.addEventListener('pointerleave', () => {
      this.#pointer = { x: 0, y: 0 };
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
    const stage = this.query('.stage');
    if (this.alt) {
      stage.setAttribute('role', 'img');
      stage.ariaLabel = this.alt;
    } else {
      stage.removeAttribute('role');
      stage.removeAttribute('aria-label');
    }
    if (changed.has('src')) this.#load();
    if (changed.has('ribs') || changed.has('variation')) this.#layoutRibs();
    if (changed.has('dpr')) this.#resize();
    this.#draw();
    this.#run();
  }

  #setup() {
    const canvas = this.query('.glass');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false });
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
    this.#program = program;
    this.#gl = gl;
  }

  // Rib edges across the width, each rib a little wider or narrower.
  #layoutRibs() {
    const count = Math.max(6, Math.min(MAX_RIBS, Math.round(this.ribs ?? 20)));
    const variation = Math.min(1, Math.max(0, this.variation ?? 0.55));
    const random = seeded(4271 + count);
    const widths = Array.from({ length: count }, () => 1 + (random() - 0.5) * 1.1 * variation);
    const total = widths.reduce((sum, w) => sum + w, 0);
    let at = 0;
    this.#edges.fill(1);
    this.#edges[0] = 0;
    widths.forEach((w, i) => {
      at += w / total;
      this.#edges[i + 1] = i === count - 1 ? 1 : at;
    });
    this.#ribCount = count;
  }

  #load() {
    const ticket = ++this.#loading;
    const src = this.src || DEMO_SRC;
    this.query('.fallback').src = src;
    this.toggleAttribute('data-ready', false);
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => {
      if (ticket !== this.#loading) return;
      this.#imageSize = [image.naturalWidth, image.naturalHeight];
      const gl = this.#gl;
      if (gl) {
        if (this.#texture) gl.deleteTexture(this.#texture);
        this.#texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        try {
          // Mipmaps need power-of-two sides here, so the picture is redrawn
          // to fit; its own aspect still decides how it covers the frame.
          const pot = (n) => 2 ** Math.min(11, Math.max(6, Math.round(Math.log2(n))));
          const square = document.createElement('canvas');
          square.width = pot(image.naturalWidth);
          square.height = pot(image.naturalHeight);
          square.getContext('2d').drawImage(image, 0, 0, square.width, square.height);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, square);
          gl.generateMipmap(gl.TEXTURE_2D);
          this.#textureSize = Math.max(square.width, square.height);
        } catch {
          // The host refused cross-origin use: show the plain picture instead.
          this.toggleAttribute('data-fallback', true);
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      }
      this.#ready = true;
      this.toggleAttribute('data-ready', true);
      this.#draw();
      this.#run();
    };
    image.onerror = () => ticket === this.#loading && this.toggleAttribute('data-fallback', true);
    image.src = src;
  }

  #resize() {
    const canvas = this.query('.glass');
    const box = this.query('.stage').getBoundingClientRect();
    const ratio = Math.min(2, Math.max(0.5, this.dpr ?? devicePixelRatio ?? 1));
    canvas.width = Math.max(1, Math.round(box.width * ratio));
    canvas.height = Math.max(1, Math.round(box.height * ratio));
    this.#gl?.viewport(0, 0, canvas.width, canvas.height);
    this.#draw();
  }

  // Runs while there is something to move, it can be seen and motion is welcome.
  #run() {
    // A picture that finishes loading after the element left does not start it.
    const live = this.isConnected && this.#gl && this.#ready && this.#visible && !document.hidden && !this.paused && !reducedMotion.matches;
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
    const reach = Math.min(1, Math.max(0, this.parallax ?? 0.6)) * 0.055;
    // The pointer pulls the picture the other way; at rest it sways.
    const sway = speed > 0 ? { x: Math.sin(this.#time * 0.42) * 0.022, y: Math.sin(this.#time * 0.31 + 1.3) * 0.01 } : { x: 0, y: 0 };
    const goal = { x: -this.#pointer.x * reach + sway.x, y: this.#pointer.y * reach * 0.5 + sway.y };
    const follow = 1 - Math.exp(-FOLLOW * dt);
    this.#shift.x += (goal.x - this.#shift.x) * follow;
    this.#shift.y += (goal.y - this.#shift.y) * follow;
    this.#light += (this.#pointer.x - this.#light) * follow;
    this.#draw();
    const settled = speed === 0 && Math.abs(goal.x - this.#shift.x) < 0.00005 && Math.abs(goal.y - this.#shift.y) < 0.00005 && Math.abs(this.#pointer.x - this.#light) < 0.001;
    if (!settled) this.#run();
  }

  #draw() {
    const gl = this.#gl;
    if (!gl || !this.#ready || !this.#texture) return;
    const canvas = this.query('.glass');
    const u = this.#uniforms;
    const unit = (value, fallback) => Math.min(1, Math.max(0, value ?? fallback));
    const [fx = 0.5, fy = 0.5] = String(this.focus ?? '0.5 0.5').split(/[\s,]+/).map(Number);
    gl.useProgram(this.#program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.#texture);
    gl.uniform1i(u.u_image, 0);
    gl.uniform2f(u.u_canvas, canvas.width, canvas.height);
    gl.uniform2f(u.u_image_size, ...this.#imageSize);
    // The texture is flipped, so the focal point's y is read from the bottom.
    gl.uniform2f(u.u_focus, unit(fx, 0.5), 1 - unit(fy, 0.5));
    gl.uniform2f(u.u_shift, this.#shift.x, this.#shift.y);
    gl.uniform1f(u.u_light, this.#light);
    gl.uniform1f(u.u_texture_size, this.#textureSize);
    gl.uniform1f(u.u_variation, unit(this.variation, 0.55));
    gl.uniform1fv(u.u_edges, this.#edges);
    gl.uniform1i(u.u_count, this.#ribCount);
    gl.uniform1f(u.u_diffusion, unit(this.diffusion, 0.7));
    gl.uniform1f(u.u_refraction, unit(this.refraction, 0.55));
    gl.uniform1f(u.u_aberration, unit(this.aberration, 0.35));
    gl.uniform1f(u.u_shade, unit(this.shade, 0.7));
    gl.uniform1f(u.u_glint, unit(this.glint, 0.65));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
