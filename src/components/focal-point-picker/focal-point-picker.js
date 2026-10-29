import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './focal-point-picker.scss?inline';

const PHOTO = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=1067&fit=crop&auto=format&q=80';

const DEMO_CROPS = [
  { label: 'Avatar', ratio: 1 },
  { label: 'Banner', ratio: 16 / 9 },
  { label: 'Story', ratio: 9 / 16 },
];

// Thin L-shaped crop marks, like a viewfinder.
const CORNERS = '<span class="corners" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
const percent = (value) => `${Math.round(value * 100)}%`;

/**
 * The window a cover-fit crop shows, as fractions of the image, centred on
 * the point as far as the edges allow; and the object-position that shows it.
 */
const cropWindow = (x, y, imageRatio, ratio) => {
  const w = Math.min(1, ratio / imageRatio);
  const h = Math.min(1, imageRatio / ratio);
  const left = clamp(x - w / 2, 0, 1 - w);
  const top = clamp(y - h / 2, 0, 1 - h);
  return { left, top, w, h, position: `${w < 1 ? (left / (1 - w)) * 100 : 50}% ${h < 1 ? (top / (1 - h)) * 100 : 50}%` };
};

/**
 * Picks the point of an image that every crop keeps in view. Drag the
 * crosshair or click to glide it there; the crops your layouts use preview
 * it live, and hovering or focusing one draws its window on the source.
 * Arrows nudge the point 1 %, Shift+arrows 10 %.
 *
 * Crops are `{ label, ratio }`, where `ratio` is width over height.
 *
 * @attr {string} src
 * @attr {string} alt - Describes the image
 * @attr {number} image-ratio - The image's natural width over height
 * @attr {number} x - The point, 0 to 1 from the left
 * @attr {number} y - The point, 0 to 1 from the top
 * @attr {Array<object>} crops - The crops to preview (JSON)
 * @fires lw-change - The point moved; `detail: { x, y }`
 */
export class LwFocalPointPicker extends LwElement {
  static styles = styles;
  static props = {
    src: { default: PHOTO },
    alt: { default: 'Peaks above a sea of clouds' },
    imageRatio: { type: Number, default: 3 / 2 },
    x: { type: Number, default: 0.68 },
    y: { type: Number, default: 0.38 },
    crops: { type: Object, default: DEMO_CROPS },
  };

  // The crop whose window is drawn on the source.
  #shown = -1;
  #dragging = false;

  render() {
    return `<div class="frame"><img class="source" draggable="false"><div class="window" aria-hidden="true">${CORNERS}</div>
<div class="layer"><button class="point" type="button"><span class="cross"></span><span class="dot"></span></button></div></div>
<div class="crops"></div>
<div class="foot"><span class="hint">Drag the point, or hover a crop to see it</span><code class="value"></code></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const frame = this.query('.frame');
    frame.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      frame.setPointerCapture(event.pointerId);
      this.#dragging = true;
      // A click glides the point; a drag follows the finger exactly.
      this.#move(event, !this.query('.point').contains(event.target));
    }, options);
    frame.addEventListener('pointermove', (event) => this.#dragging && this.#move(event, false), options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) frame.addEventListener(type, () => (this.#dragging = false), options);
    this.query('.point').addEventListener('keydown', (event) => this.#key(event), options);
    const crops = this.query('.crops');
    const show = (index) => {
      this.#shown = index;
      this.#paint();
    };
    const indexOf = (event) => Number(event.target.closest('.crop')?.dataset.index ?? -1);
    // Leaving one part of a crop for another runs out, then over, in one task.
    crops.addEventListener('pointerover', (event) => event.pointerType === 'mouse' && show(indexOf(event)), options);
    crops.addEventListener('pointerout', () => show(-1), options);
    crops.addEventListener('focusin', (event) => show(indexOf(event)), options);
    crops.addEventListener('focusout', () => show(-1), options);
  }

  updated(changed) {
    const source = this.query('.source');
    if (changed.has('src')) source.src = this.src;
    source.alt = this.alt ?? '';
    this.query('.frame').style.aspectRatio = String(this.imageRatio);
    if (changed.has('crops') || changed.has('src')) this.#build();
    this.#paint();
  }

  #build() {
    this.query('.crops').innerHTML = this.crops
      .map(({ label, ratio }, i) => `<button class="crop" type="button" data-index="${i}" style="flex: ${ratio} 1 0"><span class="thumb" style="aspect-ratio: ${ratio}"><img alt="" draggable="false" src="${escapeHtml(this.src)}">${CORNERS}</span><span class="label">${escapeHtml(label)}</span></button>`)
      .join('');
    this.#shown = -1;
  }

  #paint() {
    const { x, y, imageRatio } = this;
    this.query('.layer').style.translate = `${x * 100}% ${y * 100}%`;
    this.query('.point').ariaLabel = `Focal point, ${percent(x)} from the left, ${percent(y)} from the top. Move with the arrow keys.`;
    this.query('.value').textContent = `${percent(x)} ${percent(y)}`;
    this.shadowRoot.querySelectorAll('.crop').forEach((crop, i) => {
      crop.querySelector('img').style.objectPosition = cropWindow(x, y, imageRatio, this.crops[i].ratio).position;
      crop.toggleAttribute('data-shown', i === this.#shown);
    });
    // Everything the shown crop cuts is dimmed.
    const crop = this.crops[this.#shown];
    const view = this.query('.window');
    view.toggleAttribute('data-shown', Boolean(crop));
    if (!crop) return;
    const { left, top, w, h } = cropWindow(x, y, imageRatio, crop.ratio);
    Object.assign(view.style, { left: percent(left), top: percent(top), width: percent(w), height: percent(h) });
  }

  #set(x, y, glide) {
    this.toggleAttribute('data-gliding', glide);
    if (x === this.x && y === this.y) return;
    this.x = x;
    this.y = y;
    this.emit('change', { x, y });
  }

  #move(event, glide) {
    const rect = this.query('.frame').getBoundingClientRect();
    this.#set(clamp((event.clientX - rect.left) / rect.width, 0, 1), clamp((event.clientY - rect.top) / rect.height, 0, 1), glide);
  }

  #key(event) {
    const step = event.shiftKey ? 0.1 : 0.01;
    const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
    if (!move) return;
    event.preventDefault();
    const nudge = (value, by) => clamp(Math.round((value + by) * 100) / 100, 0, 1);
    this.#set(nudge(this.x, move[0]), nudge(this.y, move[1]), false);
  }
}
