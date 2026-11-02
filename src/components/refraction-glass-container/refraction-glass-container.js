import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './refraction-glass-container.scss?inline';

let uid = 0;

const DEMO_COLORS = ['#ef4444', '#f59e0b', '#0ea5e9'];

// The blobs, as shares of the frame: where each sits and how large it is.
const BLOBS = [
  { x: 0.3, y: 0.62, r: 0.36 },
  { x: 0.62, y: 0.18, r: 0.3 },
  { x: 0.82, y: 0.74, r: 0.38 },
];

const blobMarkup = (width, height, colors) =>
  BLOBS.map(({ x, y, r }, i) => `<circle class="blob blob-${i}" cx="${x * width}" cy="${y * height}" r="${r * Math.max(width, height)}" fill="${colors[i] ?? DEMO_COLORS[i]}"/>`).join('');

/**
 * A glass card that bends what is behind it instead of only blurring it.
 * Behind the glass, colored blobs drift and morph; seen through it, they
 * are warped by turbulence and softened, so the refraction shows as they
 * move. The content sits on the glass.
 *
 * The bending is an SVG filter (turbulence, displacement and blur) drawn
 * over a copy of the blobs that moves in step with them, so it works in
 * every browser rather than only where `backdrop-filter` takes SVG
 * filters. With `no-blobs` the glass blurs whatever is behind the host
 * instead. With reduced motion the blobs and the warp hold still.
 *
 * @attr {string} width - A length, or a number of pixels
 * @attr {number} min-height - In pixels
 * @attr {number} distortion - How far the glass bends, in pixels
 * @attr {number} blur - How soft it is behind the glass, in pixels
 * @attr {string} padding - Space inside the glass: a length, or a number of pixels
 * @attr {boolean} no-blobs - Leaves out the blobs; the glass blurs the page behind instead
 * @attr {Array<string>} blob-colors (JSON) - Three colors for the blobs
 * @attr {string} background - The color behind the blobs
 * @slot - Content on the glass
 * @csspart frame - The box the blobs move in
 * @csspart glass - The glass card
 */
export class LwRefractionGlassContainer extends LwElement {
  static styles = styles;
  static props = {
    width: { default: '380' },
    minHeight: { type: Number, default: 220 },
    distortion: { type: Number, default: 14 },
    blur: { type: Number, default: 14 },
    padding: { default: '24' },
    noBlobs: { type: Boolean, reflect: true },
    blobColors: { type: Object },
    background: {},
  };

  #id = `lw-refraction-${++uid}`;
  #size = [0, 0];

  render() {
    const id = this.#id;
    return `<div class="frame" part="frame"><svg class="blobs back" aria-hidden="true" focusable="false"><defs><filter id="${id}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="26"/></filter>
<filter id="${id}-bend" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="26" result="soft"/><feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="3" result="noise"><animate class="drift" attributeName="baseFrequency" values="0.012 0.018;0.016 0.013;0.012 0.018" dur="14s" repeatCount="indefinite"/></feTurbulence><feGaussianBlur in="noise" stdDeviation="1.2" result="calm"/><feDisplacementMap in="soft" in2="calm" scale="14" xChannelSelector="R" yChannelSelector="G" result="bent"/><feGaussianBlur class="haze" in="bent" stdDeviation="2.5"/></filter></defs><g filter="url(#${id}-soft)"></g></svg>
<div class="glass" part="glass"><svg class="blobs through" aria-hidden="true" focusable="false"><g filter="url(#${id}-bend)"></g></svg><span class="sheen" aria-hidden="true"></span><div class="content"><slot></slot></div></div></div>`;
  }

  connected() {
    const sized = new ResizeObserver(() => this.#layout());
    sized.observe(this.query('.frame'));
    reducedMotion.addEventListener('change', () => this.#motion(), { signal: this.signal });
    this.signal.addEventListener('abort', () => sized.disconnect());
  }

  updated() {
    const length = (value, fallback) => {
      const text = String(value ?? fallback).trim();
      return /^\d+(\.\d+)?$/.test(text) ? `${text}px` : text;
    };
    this.style.setProperty('--_width', length(this.width, 380));
    this.style.setProperty('--_min-height', `${Math.max(0, this.minHeight ?? 220)}px`);
    this.style.setProperty('--_padding', length(this.padding, 24));
    this.style.setProperty('--_blur', `${Math.max(0, this.blur ?? 14)}px`);
    if (this.background) this.style.setProperty('--_background', this.background);
    else this.style.removeProperty('--_background');
    this.query('feDisplacementMap').setAttribute('scale', String(Math.max(0, this.distortion ?? 14)));
    this.query('.haze').setAttribute('stdDeviation', String(Math.max(0, (this.blur ?? 14) * 0.18)));
    this.#layout(true);
    this.#motion();
  }

  // Draws the blobs at the frame's real size, in both layers: behind the
  // glass and, offset to line up, seen through it.
  #layout(force = false) {
    const frame = this.query('.frame');
    const glass = this.query('.glass');
    const width = frame.clientWidth;
    const height = frame.clientHeight;
    if (!width || !height) return;
    if (!force && width === this.#size[0] && height === this.#size[1]) return;
    this.#size = [width, height];
    const colors = Array.isArray(this.blobColors) && this.blobColors.length ? this.blobColors : DEMO_COLORS;
    const markup = blobMarkup(width, height, colors);
    for (const svg of this.shadowRoot.querySelectorAll('.blobs')) {
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
      svg.querySelector('g').innerHTML = markup;
    }
    const through = this.query('.through');
    through.style.left = `${-glass.offsetLeft - glass.clientLeft}px`;
    through.style.top = `${-glass.offsetTop - glass.clientTop}px`;
  }

  // Still for reduced motion: the blobs stop and the turbulence holds.
  #motion() {
    const still = reducedMotion.matches || this.noBlobs;
    const svg = this.query('.back');
    if (still) svg.pauseAnimations?.();
    else svg.unpauseAnimations?.();
  }
}
