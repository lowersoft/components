import { reducedMotion, springFeel, springTo } from './motion.js';

// Every avatar is a pure function of a seed string. The seed is hashed into a
// generator that picks continuous feature values (head proportions, hair,
// eyes, brows, mouth) and a few colors from small muted palettes. Because the
// features are numbers rather than parts from a list, two faces can be
// blended, which is what makes the live morph possible.

const BACKGROUNDS = [
  { name: 'gray', rgb: [228, 228, 231] },
  { name: 'sand', rgb: [233, 226, 214] },
  { name: 'sage', rgb: [217, 225, 213] },
  { name: 'slate', rgb: [218, 225, 233] },
  { name: 'clay', rgb: [235, 221, 214] },
  { name: 'mist', rgb: [226, 223, 233] },
];
const SKINS = [
  [246, 233, 222],
  [236, 210, 187],
  [214, 176, 142],
  [176, 128, 96],
  [128, 88, 66],
];
const HAIRS = [
  [39, 39, 42],
  [63, 45, 36],
  [113, 84, 62],
  [161, 161, 170],
  [82, 82, 91],
];
const SHIRTS = [
  [39, 39, 42],
  [82, 82, 91],
  [113, 113, 122],
  [244, 244, 245],
];
const INK = '#18181b';
const MORPH = springFeel(0.42, 0.22);

/** FNV-1a hash of a string. */
const hashString = (input) => {
  let h = 2_166_136_261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16_777_619);
  }
  return h >>> 0;
};

/** Mulberry32: a small seeded generator, 0 to 1. */
const mulberry32 = (seed) => {
  let a = seed;
  return () => {
    a = (a + 0x6d_2b_79_f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
};

const round2 = (value) => Math.round(value * 100) / 100;
const pick = (list, r) => list[Math.min(list.length - 1, Math.floor(r * list.length))];

const describe = (shape, background) => {
  let hair = 'short hair';
  if (shape.hairLength > 0.62) hair = 'long hair';
  else if (shape.hairVolume < 0.22) hair = 'cropped hair';
  let mouth = 'a slight smile';
  if (shape.mouthOpen > 0.5) mouth = 'an open smile';
  else if (shape.mouthCurve > 3.2) mouth = 'a wide smile';
  else if (shape.mouthCurve < 1) mouth = 'a calm expression';
  const face = shape.headSquare > 0.55 ? 'Square face' : 'Round face';
  return `${face}, ${hair}${shape.glasses > 0.5 ? ', glasses' : ''}, ${mouth}, on ${background}`;
};

/** The seed for a name and variant; feed it to `createFace`. */
export const avatarSeed = (displayName, variant) => `${displayName.trim().toLowerCase()}:${variant}`;

/** The face for a seed: the same seed always gives the same face. */
export const createFace = (seed) => {
  const r = mulberry32(hashString(seed));
  const background = pick(BACKGROUNDS, r());
  const shape = {
    headW: 18 + r() * 5,
    headH: 22 + r() * 4,
    headSquare: r(),
    chin: 0.75 + r() * 0.25,
    hairVolume: r(),
    hairFringe: r(),
    hairPart: r() * 2 - 1,
    hairLength: r() ** 1.6,
    eyeGap: 7.5 + r() * 3,
    eyeY: -2 + r() * 4,
    eyeRx: 1.7 + r() * 0.9,
    eyeRy: 1.9 + r() * 1.4,
    browTilt: -2 + r() * 4,
    browLift: 4.2 + r() * 2,
    browWeight: r() < 0.65 ? 1.3 + r() * 0.8 : 0,
    mouthW: 3.5 + r() * 3,
    mouthCurve: r() * 4.5,
    mouthOpen: r() < 0.3 ? 0.6 + r() * 0.4 : 0,
    nose: r(),
    glasses: r() < 0.25 ? 1 : 0,
    cheeks: r(),
    shoulders: r(),
  };
  for (const key of Object.keys(shape)) shape[key] = round2(shape[key]);
  return {
    shape,
    bg: background.rgb,
    skin: pick(SKINS, r()),
    hair: pick(HAIRS, r()),
    shirt: pick(SHIRTS, r()),
    description: describe(shape, background.name),
  };
};

const lerp = (a, b, t) => a + (b - a) * t;
const lerpRgb = (a, b, t) => a.map((channel, i) => Math.max(0, Math.min(255, Math.round(lerp(channel, b[i], t)))));

const lerpFace = (a, b, t) => {
  const shape = {};
  for (const key of Object.keys(b.shape)) shape[key] = lerp(a.shape[key], b.shape[key], t);
  // Colors stop at the target; only shapes may overshoot with the spring.
  const ct = Math.min(1, t);
  return {
    shape,
    bg: lerpRgb(a.bg, b.bg, ct),
    skin: lerpRgb(a.skin, b.skin, ct),
    hair: lerpRgb(a.hair, b.hair, ct),
    shirt: lerpRgb(a.shirt, b.shirt, ct),
    description: b.description,
  };
};

const rgb = (c, k = 1) => `rgb(${Math.round(c[0] * k)} ${Math.round(c[1] * k)} ${Math.round(c[2] * k)})`;
const n = round2;

/** A rounded blob: `square` blends between an ellipse and a squircle. */
const blobPath = (cx, cy, w, top, bottom, square, chin = 1) => {
  const k = 0.552 + square * 0.28;
  const kb = k * chin;
  return (
    `M${n(cx)} ${n(cy - top)}` +
    `C${n(cx + k * w)} ${n(cy - top)} ${n(cx + w)} ${n(cy - k * top)} ${n(cx + w)} ${n(cy)}` +
    `C${n(cx + w)} ${n(cy + kb * bottom)} ${n(cx + kb * w)} ${n(cy + bottom)} ${n(cx)} ${n(cy + bottom)}` +
    `C${n(cx - kb * w)} ${n(cy + bottom)} ${n(cx - w)} ${n(cy + kb * bottom)} ${n(cx - w)} ${n(cy)}` +
    `C${n(cx - w)} ${n(cy - k * top)} ${n(cx - k * w)} ${n(cy - top)} ${n(cx)} ${n(cy - top)}Z`
  );
};

const hairFrontPath = (s, cx, cy) => {
  const w = s.headW;
  const h = s.headH;
  const v = s.hairVolume;
  const temple = cy - h * 0.12;
  const crown = cy - h - 1.5 - v * 4;
  const side = w + 1.5 + v * 2.5;
  const k = 0.552 + s.headSquare * 0.28;
  const fringeY = cy - h * (0.66 - s.hairFringe * 0.36);
  const partX = cx + s.hairPart * w * 0.55;
  return (
    `M${n(cx - side)} ${n(temple)}` +
    `C${n(cx - side)} ${n(cy - h * k - v * 3)} ${n(cx - k * side)} ${n(crown)} ${n(cx)} ${n(crown)}` +
    `C${n(cx + k * side)} ${n(crown)} ${n(cx + side)} ${n(cy - h * k - v * 3)} ${n(cx + side)} ${n(temple)}` +
    `L${n(cx + w - 1)} ${n(temple)}` +
    `Q${n(cx + w * 0.75)} ${n(fringeY + 1 - s.hairPart * 5)} ${n(partX)} ${n(fringeY - 2.5)}` +
    `Q${n(cx - w * 0.75)} ${n(fringeY + 1 + s.hairPart * 5)} ${n(cx - w + 1)} ${n(temple)}Z`
  );
};

const mouthPath = (s, cx, y) => {
  const curve = s.mouthCurve * 2;
  const open = s.mouthOpen * 5;
  return `M${n(cx - s.mouthW)} ${n(y)}Q${n(cx)} ${n(y + curve)} ${n(cx + s.mouthW)} ${n(y)}Q${n(cx)} ${n(y + curve + open)} ${n(cx - s.mouthW)} ${n(y)}Z`;
};

const FACE = document.createElement('template');
FACE.innerHTML = `<svg class="face" viewBox="12 14 76 76" aria-hidden="true"><rect data-part="bg" width="100" height="100"/><path data-part="backHair"/><path data-part="shirt"/><rect data-part="neck" rx="3" width="12" x="44"/><ellipse data-part="earL" rx="3" ry="4.5"/><ellipse data-part="earR" rx="3" ry="4.5"/><path data-part="head"/><path data-part="hair"/><g data-part="cheeks" fill="${INK}"><circle data-part="cheekL" r="3.4"/><circle data-part="cheekR" r="3.4"/></g><g data-part="brows" stroke="${INK}" stroke-linecap="round" stroke-opacity="0.85"><path data-part="browL"/><path data-part="browR"/></g><g class="look"><g class="blink"><ellipse data-part="eyeL" fill="${INK}"/><ellipse data-part="eyeR" fill="${INK}"/></g></g><path data-part="nose" fill="none" stroke="${INK}" stroke-linecap="round" stroke-opacity="0.35" stroke-width="1.2"/><path data-part="mouth" fill="${INK}" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/><g data-part="glasses" fill="none" stroke="${INK}" stroke-width="1.2"><circle data-part="glassL"/><circle data-part="glassR"/><path data-part="bridge"/></g></svg>`;

const set = (element, attributes) => {
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
};

/**
 * One face drawn as SVG, 100 × 100 units. When the seed changes it eases
 * every feature from where it is to the new values instead of crossfading.
 */
export class FaceView {
  svg = FACE.content.firstElementChild.cloneNode(true);
  parts = Object.fromEntries([...this.svg.querySelectorAll('[data-part]')].map((el) => [el.dataset.part, el]));
  #shown = null;
  #target = null;
  #seed = null;
  #stop = null;

  /** The face being shown or morphed to. */
  get face() {
    return this.#target;
  }

  show(seed, { morph = true } = {}) {
    if (seed === this.#seed) return;
    const target = createFace(seed);
    this.#stop?.();
    this.#seed = seed;
    this.#target = target;
    if (!morph || !this.#shown || reducedMotion.matches) {
      this.#draw(target);
      return;
    }
    const from = this.#shown;
    this.#stop = springTo(0, 1, { ...MORPH, update: (t) => this.#draw(lerpFace(from, target, t)), done: () => (this.#stop = null) });
  }

  stop() {
    this.#stop?.();
    this.#stop = null;
  }

  #draw(face) {
    this.#shown = face;
    const s = face.shape;
    const p = this.parts;
    const cx = 50;
    const cy = 50;
    const eyeY = cy + s.eyeY;
    const glassR = Math.max(s.eyeRx, s.eyeRy) + 3.2;
    const neckTop = cy + s.headH - 6;
    const shoulderTop = cy + s.headH + 3;
    const sw = 30 + s.shoulders * 8;
    set(p.bg, { fill: rgb(face.bg) });
    // Long hair sits behind the head.
    set(p.backHair, {
      fill: rgb(face.hair, 0.9),
      d: blobPath(cx, cy - s.headH * 0.15, s.headW + 1 + s.hairVolume * 2.5, s.headH * 0.85 + s.hairVolume * 4, s.headH * 0.15 + s.hairLength * (s.headH + 14), s.headSquare * 0.6),
    });
    set(p.shirt, {
      fill: rgb(face.shirt),
      d: `M${n(cx - sw)} 100C${n(cx - sw)} ${n(shoulderTop + 6)} ${n(cx - sw * 0.55)} ${n(shoulderTop)} ${cx} ${n(shoulderTop)}C${n(cx + sw * 0.55)} ${n(shoulderTop)} ${n(cx + sw)} ${n(shoulderTop + 6)} ${n(cx + sw)} 100Z`,
    });
    set(p.neck, { fill: rgb(face.skin, 0.9), y: n(neckTop), height: n(shoulderTop - neckTop + 3) });
    set(p.earL, { fill: rgb(face.skin, 0.95), cx: n(cx - s.headW), cy: n(cy + 2) });
    set(p.earR, { fill: rgb(face.skin, 0.95), cx: n(cx + s.headW), cy: n(cy + 2) });
    set(p.head, { fill: rgb(face.skin), d: blobPath(cx, cy, s.headW, s.headH, s.headH, s.headSquare, s.chin) });
    set(p.hair, { fill: rgb(face.hair), d: hairFrontPath(s, cx, cy) });
    set(p.cheeks, { opacity: n(0.045 * s.cheeks) });
    set(p.cheekL, { cx: n(cx - s.eyeGap - 3), cy: n(eyeY + 7) });
    set(p.cheekR, { cx: n(cx + s.eyeGap + 3), cy: n(eyeY + 7) });
    set(p.brows, { 'stroke-width': n(Math.max(0, s.browWeight)) });
    const browY = eyeY - s.browLift;
    set(p.browL, { d: `M${n(cx - s.eyeGap - 3.2)} ${n(browY + s.browTilt)}L${n(cx - s.eyeGap + 3.2)} ${n(browY - s.browTilt)}` });
    set(p.browR, { d: `M${n(cx + s.eyeGap - 3.2)} ${n(browY - s.browTilt)}L${n(cx + s.eyeGap + 3.2)} ${n(browY + s.browTilt)}` });
    for (const [eye, x] of [
      [p.eyeL, cx - s.eyeGap],
      [p.eyeR, cx + s.eyeGap],
    ]) {
      set(eye, { cx: n(x), cy: n(eyeY), rx: n(s.eyeRx), ry: n(s.eyeRy) });
    }
    const noseY = eyeY + 8 + s.nose * 1.5;
    set(p.nose, { d: `M${n(cx - 1.5 - s.nose)} ${n(noseY)}Q${cx} ${n(noseY + 1.5)} ${n(cx + 1.5 + s.nose)} ${n(noseY)}` });
    set(p.mouth, { d: mouthPath(s, cx, cy + s.headH * 0.5) });
    set(p.glasses, { opacity: n(Math.max(0, Math.min(1, s.glasses))) });
    set(p.glassL, { cx: n(cx - s.eyeGap), cy: n(eyeY), r: n(glassR) });
    set(p.glassR, { cx: n(cx + s.eyeGap), cy: n(eyeY), r: n(glassR) });
    set(p.bridge, { d: `M${n(cx - s.eyeGap + glassR)} ${n(eyeY)}Q${cx} ${n(eyeY - 2)} ${n(cx + s.eyeGap - glassR)} ${n(eyeY)}` });
  }
}
