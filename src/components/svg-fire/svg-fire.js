import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './svg-fire.scss?inline';

// The demo mark: a plain L, whose top edges both catch.
const DEMO_MARK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120"><path d="M14 6h26v84h46v26H14z"/></svg>';

const DEFAULT_COLORS = ['#d8340f', '#ff7a1c', '#ffe7a8'];
// The simulation grid's width in cells; its height follows the frame.
const GRID = 320;
const STEP = 1 / 60;
// Steps run before showing anything, so the fire is already burning.
const WARM_UP = 150;

const VERTEX = `attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const NOISE = `
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
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return v;
}`;

// One step of the fire. Heat rises, faster where it is hotter, and is
// swirled by curl noise of several scales. It cools through a noise field
// that climbs with the flames, so cold pockets travel up through them and
// pinch them into tongues that break off. Each upward edge of the mark
// feeds it, flickering along its length.
const SIMULATE = `precision highp float;
uniform sampler2D u_heat;
uniform sampler2D u_fuel;
uniform vec2 u_texel;
uniform float u_time;
uniform float u_intensity;
uniform float u_rise;
uniform float u_aspect;
varying vec2 v_uv;
${NOISE}
vec2 curl(vec2 p) {
  float e = 0.08;
  float a = fbm(p + vec2(0.0, e));
  float b = fbm(p - vec2(0.0, e));
  float c = fbm(p + vec2(e, 0.0));
  float d = fbm(p - vec2(e, 0.0));
  return vec2(a - b, -(c - d)) / (2.0 * e);
}
void main() {
  vec2 p = vec2(v_uv.x * u_aspect, v_uv.y);
  float t = u_time;
  float here = texture2D(u_heat, v_uv).r;
  vec2 swirl = curl(p * 3.2 + vec2(0.0, -t * 1.3));
  float lift = 0.0026 + (0.0062 + 0.0075 * here) * u_rise;
  vec2 velocity = vec2(swirl.x * 0.0024, lift + swirl.y * 0.0008);
  vec2 from = v_uv - velocity;
  float h = texture2D(u_heat, from).r * 0.56;
  h += 0.11 * (texture2D(u_heat, from + vec2(u_texel.x, 0.0)).r + texture2D(u_heat, from - vec2(u_texel.x, 0.0)).r);
  h += 0.11 * (texture2D(u_heat, from + vec2(0.0, u_texel.y)).r + texture2D(u_heat, from - vec2(0.0, u_texel.y)).r);
  float climb = t * (0.42 + 0.5 * u_rise);
  float cold = fbm(vec2(p.x * 6.5, (p.y - climb) * 4.2));
  h -= 0.003 + 0.026 * cold * cold;
  float fuel = texture2D(u_fuel, v_uv).r;
  float along = 0.62 * noise(vec2(p.x * 9.0, t * 1.6)) + 0.38 * noise(vec2(p.x * 26.0, t * 3.4));
  h = max(h, fuel * u_intensity * (0.5 + 0.62 * along));
  gl_FragColor = vec4(clamp(h, 0.0, 1.0), 0.0, 0.0, 1.0);
}`;

// The picture. Temperature is colored on a blackbody ramp built from the
// three flame colors: smoky red at the fading tips, through the body, to
// a white-hot core. Bloom gathers around the flames, the mark's burning
// edges glow and char, and the air over the fire shimmers.
const RENDER = `precision highp float;
uniform sampler2D u_heat;
uniform sampler2D u_mark;
uniform vec2 u_texel;
uniform vec3 u_tip;
uniform vec3 u_body;
uniform vec3 u_core;
uniform float u_time;
uniform float u_distortion;
uniform float u_intensity;
uniform float u_dark;
varying vec2 v_uv;
${NOISE}
vec3 ramp(float h) {
  vec3 ember = u_tip * 0.42;
  vec3 c = mix(ember, u_tip, smoothstep(0.04, 0.24, h));
  c = mix(c, u_body, smoothstep(0.22, 0.5, h));
  c = mix(c, u_core, smoothstep(0.48, 0.78, h));
  return mix(c, vec3(1.0, 0.98, 0.93), smoothstep(0.8, 1.0, h));
}
float bloom(vec2 uv, float radius) {
  float sum = 0.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.785 + 0.39;
    sum += texture2D(u_heat, uv + vec2(cos(a), sin(a)) * u_texel * radius).r;
  }
  return sum / 8.0;
}
void main() {
  float near = bloom(v_uv, 3.0);
  float far = bloom(v_uv, 9.0);
  float shimmer = smoothstep(0.03, 0.35, max(near, far)) * u_distortion;
  vec2 wave = vec2(noise(v_uv * 30.0 + vec2(0.0, -u_time * 3.2)), noise(v_uv * 30.0 + vec2(5.2, -u_time * 3.2))) - 0.5;
  vec2 bend = wave * 0.01 * shimmer;
  float h = texture2D(u_heat, v_uv + bend * 0.4).r;
  vec4 mark = texture2D(u_mark, v_uv + bend * 0.6);

  // Flames: opaque where hot, thinning out at the tips.
  float flame = smoothstep(0.03, 0.3, h);
  vec3 fire = ramp(h);
  float halo = (smoothstep(0.02, 0.5, near) * 0.45 + smoothstep(0.02, 0.6, far) * 0.3) * mix(0.18, 1.0, u_dark);
  vec3 glowColor = ramp(max(near, far) * 0.85);

  // The mark: lit hot along its burning edges, charred a little below,
  // with sparks of heat crawling over the glowing part.
  // Embers, not white heat: white over a dark mark would read as grey.
  float burn = smoothstep(0.1, 0.9, h) * u_intensity;
  float crawl = noise(v_uv * vec2(160.0, 60.0) + vec2(0.0, u_time * 1.5));
  vec3 hot = ramp(0.3 + 0.32 * h + crawl * 0.1);
  vec3 char = mix(mark.rgb, mark.rgb * vec3(0.55, 0.45, 0.4), u_dark);
  vec3 lit = mix(mark.rgb, char, smoothstep(0.02, 0.25, near) * 0.35 * u_intensity);
  lit = mix(lit, hot, burn * 0.85);

  // Built premultiplied, then handed over straight: the canvas is not
  // premultiplied, and multiplying twice turns thin flame into grey smoke.
  // The mark goes over the flames the same way, so its soft edge does not
  // mix with the empty black of the canvas.
  vec3 light = fire * flame + glowColor * halo * (1.0 - flame);
  float alpha = flame + halo * (1.0 - flame);
  light = light * (1.0 - mark.a) + lit * mark.a;
  alpha = alpha * (1.0 - mark.a) + mark.a;
  gl_FragColor = vec4(alpha > 0.001 ? light / alpha : vec3(0.0), clamp(alpha, 0.0, 1.0));
}`;

const parseColor = (hex, fallback) => {
  const value = /^#?([\da-f]{3}|[\da-f]{6})$/i.test(hex ?? '') ? hex.replace('#', '') : fallback.replace('#', '');
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
  return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16) / 255);
};

/**
 * Sets an SVG mark alight. The artwork is drawn into a fire simulation on
 * the GPU, where its upward edges are fuel: heat rises, curl noise swirls
 * it, uneven cooling breaks it into tongues, and it is colored on a
 * blackbody ramp from a cool tip to a white core. Embers drift up and the
 * air above the fire shimmers over the mark.
 *
 * The mark comes from `src` (fetched; another origin needs CORS), from
 * `markup`, or from an `<svg>` child, in that order; it is recolored with
 * `tint`, or by the page's scheme, unless `keep-colors` is set. It stops
 * off screen, in a hidden tab and when `paused`; with reduced motion it
 * shows one still frame. Without WebGL the mark shows without fire.
 *
 * @attr {string} src - URL of an SVG
 * @attr {string} markup - SVG markup
 * @attr {number} intensity - How hard it burns, 0 to 1; 0 leaves the mark untouched
 * @attr {number} rise - How tall the flames reach, as a share of the frame
 * @attr {number} distortion - Heat shimmer, 0 to 1
 * @attr {number} speed - Playback rate
 * @attr {string} tint - Color the mark is painted before it burns
 * @attr {boolean} keep-colors - Burns the mark in its own colors
 * @attr {'auto'|'light'|'dark'} theme - The scheme the mark and glow suit when no tint is set
 * @attr {Array<string>} colors (JSON) - Three flame colors, cool tip to hot core
 * @attr {boolean} paused - Freezes the fire on the current frame
 * @attr {string} label - Accessible name
 * @slot - An `<svg>` to burn, when there is no `src` or `markup`
 */
export class LwSvgFire extends LwElement {
  static styles = styles;
  static props = {
    src: {},
    markup: {},
    intensity: { type: Number, default: 0.92 },
    rise: { type: Number, default: 0.5 },
    distortion: { type: Number, default: 0.72 },
    speed: { type: Number, default: 1 },
    tint: {},
    keepColors: { type: Boolean },
    theme: { default: 'auto' },
    colors: { type: Object },
    paused: { type: Boolean, reflect: true },
    label: { default: 'Burning graphic' },
  };

  #gl = null;
  #heatType = 0;
  #programs = null;
  #heat = [];
  #fuel = null;
  #markTexture = null;
  #grid = [0, 0];
  #size = [0, 0];
  #source = '';
  #image = null;
  #embers = [];
  #fuelPoints = [];
  #frame = 0;
  #last = 0;
  #carry = 0;
  #time = 0;
  #visible = false;
  #loading = 0;

  render() {
    return '<div class="frame" role="img"><canvas class="fire"></canvas><canvas class="embers"></canvas></div><slot hidden></slot>';
  }

  connected() {
    const options = { signal: this.signal };
    this.#setup();
    const sized = new ResizeObserver(() => this.#layout());
    sized.observe(this.query('.frame'));
    const seen = new IntersectionObserver(([entry]) => {
      this.#visible = entry.isIntersecting;
      this.#run();
    });
    seen.observe(this);
    document.addEventListener('visibilitychange', () => this.#run(), options);
    reducedMotion.addEventListener('change', () => this.#run(), options);
    const rescheme = () => this.theme === 'auto' && !this.tint && !this.keepColors && this.#layout(true);
    const themed = new MutationObserver(rescheme);
    themed.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', rescheme, options);
    this.query('slot').addEventListener('slotchange', () => this.#load(), options);
    this.signal.addEventListener('abort', () => {
      sized.disconnect();
      seen.disconnect();
      themed.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
  }

  updated(changed) {
    this.query('.frame').ariaLabel = this.label || 'Burning graphic';
    if (changed.has('src') || changed.has('markup')) this.#load();
    else if (['tint', 'keepColors', 'theme', 'rise'].some((prop) => changed.has(prop))) this.#layout(true);
    this.#run();
  }

  get #dark() {
    if (this.theme === 'dark') return true;
    if (this.theme === 'light') return false;
    const scheme = getComputedStyle(document.documentElement).colorScheme;
    if (scheme === 'dark' || scheme === 'light') return scheme === 'dark';
    return matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // The SVG to burn, from the first source that has one.
  async #load() {
    const ticket = ++this.#loading;
    let text;
    if (this.src) {
      try {
        const response = await fetch(this.src);
        text = response.ok ? await response.text() : '';
      } catch {
        text = '';
      }
    } else if (this.markup) {
      text = this.markup;
    } else {
      text = this.querySelector('svg')?.outerHTML ?? '';
    }
    if (ticket !== this.#loading) return;
    this.#source = text.includes('<svg') ? text : DEMO_MARK;
    this.#image = await this.#rasterize(this.#source).catch(() => null);
    if (ticket === this.#loading) this.#layout(true);
  }

  // The SVG as an image, at a size large enough to stay crisp.
  #rasterize(source) {
    const doc = new DOMParser().parseFromString(source, 'image/svg+xml');
    const svg = doc.documentElement;
    if (svg.nodeName.toLowerCase() !== 'svg') return Promise.reject(new Error('Not an SVG'));
    if (!svg.getAttribute('xmlns')) svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const box = (svg.getAttribute('viewBox') ?? '').split(/[\s,]+/).map(Number);
    const ratio = box.length === 4 && box[2] > 0 && box[3] > 0 ? box[2] / box[3] : Number(svg.getAttribute('width')) / Number(svg.getAttribute('height')) || 1;
    svg.setAttribute('width', String(1024 * Math.min(1, ratio)));
    svg.setAttribute('height', String(1024 * Math.min(1, 1 / ratio)));
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }

  #setup() {
    const canvas = this.query('.fire');
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: false });
    if (!gl) return;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const link = (fragment) => {
      const vs = compile(gl.VERTEX_SHADER, VERTEX);
      const fs = compile(gl.FRAGMENT_SHADER, fragment);
      if (!vs || !fs) return null;
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.bindAttribLocation(program, 0, 'a_pos');
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
      const uniforms = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const { name } = gl.getActiveUniform(program, i);
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      return { program, uniforms };
    };
    const simulate = link(SIMULATE);
    const draw = link(RENDER);
    if (!simulate || !draw) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.#programs = { simulate, draw };
    this.#gl = gl;
    // Heat in half floats where the GPU can render to them: in 8 bits the
    // faint end of the cooling rounds away and leaves a haze that never fades.
    const half = gl.getExtension('OES_texture_half_float');
    const linear = gl.getExtension('OES_texture_half_float_linear');
    const target = gl.getExtension('EXT_color_buffer_half_float') ?? gl.getExtension('WEBGL_color_buffer_float');
    this.#heatType = half && linear && target ? half.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.#gl = null;
      this.#layout(true);
    }, { signal: this.signal });
  }

  #texture(width, height, data = null, format, type) {
    const gl = this.#gl;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (data instanceof HTMLCanvasElement) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, format ?? gl.RGBA, width, height, 0, format ?? gl.RGBA, type ?? gl.UNSIGNED_BYTE, data);
    }
    return texture;
  }

  // Where the mark sits: centered, below the room the flames rise into.
  #placement(width, height) {
    const image = this.#image;
    const rise = Math.min(0.85, Math.max(0.1, this.rise ?? 0.5));
    const ratio = image ? image.width / image.height : 1;
    const room = height * (1 - rise);
    let h = Math.min(room * 0.78, (width * 0.5) / ratio);
    let w = h * ratio;
    if (w > width * 0.7) {
      w = width * 0.7;
      h = w / ratio;
    }
    return { x: (width - w) / 2, y: height * rise + (room - h) * 0.55, w, h };
  }

  // The mark painted at `scale` into a canvas the frame's shape.
  #paintMark(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));
    const ctx = canvas.getContext('2d');
    if (!this.#image) return canvas;
    const { x, y, w, h } = this.#placement(width, height);
    ctx.drawImage(this.#image, x, y, w, h);
    if (!this.keepColors) {
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = this.tint || (this.#dark ? '#fdf6ec' : '#151517');
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return canvas;
  }

  // Sizes the canvases, rebuilds the mark and fuel, and warms the fire up.
  #layout(force = false) {
    const frame = this.query('.frame');
    const width = frame.clientWidth;
    const height = frame.clientHeight;
    if (!width || !height || (!force && width === this.#size[0] && height === this.#size[1])) return;
    this.#size = [width, height];
    const ratio = Math.min(2, devicePixelRatio || 1);
    for (const canvas of this.shadowRoot.querySelectorAll('canvas')) {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    }
    if (!this.#image) {
      if (!this.#source) this.#load();
      return;
    }

    const gridW = GRID;
    const gridH = Math.max(16, Math.round((GRID * height) / width));
    this.#grid = [gridW, gridH];
    // Fuel: cells of the mark whose cell above is empty, two cells deep.
    const mask = this.#paintMark(gridW, gridH).getContext('2d').getImageData(0, 0, gridW, gridH).data;
    const alpha = (x, y) => (y < 0 ? 0 : mask[(y * gridW + x) * 4 + 3] / 255);
    const fuel = new Uint8Array(gridW * gridH);
    this.#fuelPoints = [];
    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        const here = alpha(x, y);
        const edge = here > 0.5 && (alpha(x, y - 1) < 0.5 || alpha(x, y - 2) < 0.5);
        // Flipped, so row 0 is the bottom, as WebGL reads it.
        fuel[(gridH - 1 - y) * gridW + x] = edge ? 255 : 0;
        if (edge) this.#fuelPoints.push([(x + 0.5) / gridW, (y + 0.5) / gridH]);
      }
    }

    const gl = this.#gl;
    if (!gl) {
      // No WebGL: the mark alone.
      const ctx = this.query('.embers').getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(this.#paintMark(ctx.canvas.width, ctx.canvas.height), 0, 0);
      return;
    }
    for (const texture of [...this.#heat.map((h) => h.texture), this.#fuel, this.#markTexture]) if (texture) gl.deleteTexture(texture);
    for (const { buffer } of this.#heat) gl.deleteFramebuffer(buffer);
    const heatBuffer = (type) => {
      const texture = this.#texture(gridW, gridH, null, gl.RGBA, type);
      const buffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return { texture, buffer };
    };
    // Some GPUs list half floats yet cannot draw into them: test once.
    if (this.#heatType !== gl.UNSIGNED_BYTE) {
      const probe = heatBuffer(this.#heatType);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.deleteTexture(probe.texture);
      gl.deleteFramebuffer(probe.buffer);
      if (!ok) this.#heatType = gl.UNSIGNED_BYTE;
    }
    this.#heat = [0, 1].map(() => {
      const { texture, buffer } = heatBuffer(this.#heatType);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { texture, buffer };
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    this.#fuel = this.#texture(gridW, gridH, fuel, gl.LUMINANCE);
    this.#markTexture = this.#texture(0, 0, this.#paintMark(this.query('.fire').width, this.query('.fire').height));
    for (let i = 0; i < WARM_UP; i++) this.#simulate();
    this.#embers = [];
    this.#draw();
  }

  // Runs only while it can be seen and is wanted.
  #run() {
    const live = this.#gl && this.#image && this.#visible && !document.hidden && !this.paused && !reducedMotion.matches;
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
    const dt = Math.min(0.1, (now - this.#last) / 1000);
    this.#last = now;
    this.#carry += dt * Math.max(0, this.speed ?? 1);
    let steps = 0;
    while (this.#carry >= STEP && steps < 4) {
      this.#carry -= STEP;
      this.#simulate();
      this.#stepEmbers(STEP);
      steps++;
    }
    if (steps === 4) this.#carry = 0;
    this.#draw();
    this.#run();
  }

  #simulate() {
    const gl = this.#gl;
    const { program, uniforms: u } = this.#programs.simulate;
    const [gridW, gridH] = this.#grid;
    const [read, write] = this.#heat;
    this.#time += STEP;
    gl.useProgram(program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, write.buffer);
    gl.viewport(0, 0, gridW, gridH);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, read.texture);
    gl.uniform1i(u.u_heat, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.#fuel);
    gl.uniform1i(u.u_fuel, 1);
    gl.uniform2f(u.u_texel, 1 / gridW, 1 / gridH);
    gl.uniform1f(u.u_time, this.#time);
    gl.uniform1f(u.u_intensity, Math.min(1, Math.max(0, this.intensity ?? 0.92)));
    gl.uniform1f(u.u_rise, Math.min(1, Math.max(0, this.rise ?? 0.5)));
    gl.uniform1f(u.u_aspect, gridW / gridH);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.#heat = [write, read];
  }

  #draw() {
    const gl = this.#gl;
    if (!gl || !this.#heat.length) return;
    const { program, uniforms: u } = this.#programs.draw;
    const canvas = this.query('.fire');
    const [gridW, gridH] = this.#grid;
    const colors = Array.isArray(this.colors) && this.colors.length === 3 ? this.colors : DEFAULT_COLORS;
    gl.useProgram(program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.#heat[0].texture);
    gl.uniform1i(u.u_heat, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.#markTexture);
    gl.uniform1i(u.u_mark, 1);
    gl.uniform2f(u.u_texel, 1 / gridW, 1 / gridH);
    gl.uniform3f(u.u_tip, ...parseColor(colors[0], DEFAULT_COLORS[0]));
    gl.uniform3f(u.u_body, ...parseColor(colors[1], DEFAULT_COLORS[1]));
    gl.uniform3f(u.u_core, ...parseColor(colors[2], DEFAULT_COLORS[2]));
    gl.uniform1f(u.u_time, this.#time);
    gl.uniform1f(u.u_distortion, Math.min(1, Math.max(0, this.distortion ?? 0.72)));
    gl.uniform1f(u.u_intensity, Math.min(1, Math.max(0, this.intensity ?? 0.92)));
    gl.uniform1f(u.u_dark, this.#dark ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.#drawEmbers();
  }

  // Sparks leave the burning edges hot, ride the updraft, slow, wander on
  // gusts and cool from white through orange to red before going out.
  #stepEmbers(dt) {
    const intensity = Math.min(1, Math.max(0, this.intensity ?? 0.92));
    const rise = Math.min(1, Math.max(0, this.rise ?? 0.5));
    if (this.#fuelPoints.length && Math.random() < 0.7 * intensity && this.#embers.length < 90) {
      const [x, y] = this.#fuelPoints[Math.floor(Math.random() * this.#fuelPoints.length)];
      this.#embers.push({
        x: x + (Math.random() - 0.5) * 0.01,
        y: y - Math.random() * 0.06,
        vx: (Math.random() - 0.5) * 0.06,
        vy: -(0.12 + Math.random() * 0.22) * (0.6 + rise),
        life: 0,
        span: 0.9 + Math.random() * 1.6,
        size: 0.5 + Math.random() ** 2 * 1.6,
        seed: Math.random() * 100,
      });
    }
    const drag = Math.exp(-1.1 * dt);
    this.#embers = this.#embers.filter((ember) => {
      ember.life += dt;
      const gust = Math.sin(this.#time * 1.3 + ember.seed) * 0.05 + Math.sin(this.#time * 3.7 + ember.seed * 2) * 0.025;
      ember.vx = (ember.vx + gust * dt) * drag;
      ember.vy = (ember.vy - 0.02 * dt) * drag;
      ember.x += ember.vx * dt;
      ember.y += ember.vy * dt;
      return ember.life < ember.span && ember.y > -0.05;
    });
  }

  #drawEmbers() {
    const canvas = this.query('.embers');
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const colors = Array.isArray(this.colors) && this.colors.length === 3 ? this.colors : DEFAULT_COLORS;
    const ratio = canvas.width / Math.max(1, this.#size[0]);
    // On a dark page the sparks add light; on a light one they would wash out.
    ctx.globalCompositeOperation = this.#dark ? 'lighter' : 'source-over';
    for (const ember of this.#embers) {
      const t = ember.life / ember.span;
      const flicker = 0.75 + 0.25 * Math.sin(ember.life * 30 + ember.seed);
      const alpha = Math.max(0, (1 - t) ** 1.4 * Math.min(1, ember.life * 6) * flicker);
      const color = t < 0.25 ? colors[2] : t < 0.6 ? colors[1] : colors[0];
      const x = ember.x * canvas.width;
      const y = ember.y * canvas.height;
      const r = ember.size * ratio * (1 - t * 0.45);
      // A short streak along the way it moves, then a soft halo and a hot dot.
      ctx.globalAlpha = alpha * 0.55;
      ctx.strokeStyle = color;
      ctx.lineWidth = r * 1.1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - ember.vx * canvas.width * 0.05, y - ember.vy * canvas.height * 0.05);
      ctx.stroke();
      const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
      halo.addColorStop(0, color);
      halo.addColorStop(1, 'transparent');
      ctx.globalAlpha = alpha * 0.35;
      ctx.fillStyle = halo;
      ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = t < 0.4 ? '#fff6dc' : color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}
