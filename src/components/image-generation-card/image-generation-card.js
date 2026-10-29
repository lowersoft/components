import { writeClipboard } from '../../core/clipboard.js';
import { strokeIcon } from '../../core/icons.js';
import { check, chevronsUpDown, copy, download } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import '../button/index.js';
import { drawScene } from './scene.js';
import styles from './image-generation-card.scss?inline';

// Output sizes per aspect ratio.
const RATIOS = {
  '4:3': [1152, 864],
  '1:1': [1024, 1024],
  '3:4': [864, 1152],
  '16:9': [1344, 768],
};
const MODELS = ['Path tracer', 'Rasterizer', 'Ray marcher'];
const VARIATIONS = 4;
// Generation resolves over this many steps, from coarse blocks to sharp.
const STEPS = 24;
const STEP_MS = 90;
// The preview is drawn at this width; the export at full size.
const PREVIEW = 640;
const COPIED_MS = 1500;

/**
 * An image render panel. Generate resolves the image from coarse pixel blocks to
 * sharp while a step counter runs, then four variations land below it. Pick
 * one to show it, change the aspect ratio or the model, edit the prompt,
 * and copy or download the image.
 *
 * The images are drawn by the demo; set the `generate` property to
 * `async ({ prompt, seed, model, ratio }) => [url, url, url, url]` to show
 * real ones.
 *
 * @attr {string} prompt
 * @attr {number} seed
 * @attr {'4:3'|'1:1'|'3:4'|'16:9'} ratio
 * @attr {string} model
 * @fires lw-generate - A generation finished; `detail: { prompt, seed, model, ratio }`
 * @fires lw-select - A variation was picked; `detail: { index }`
 */
export class LwImageGenerationCard extends LwElement {
  static styles = styles;
  static props = {
    prompt: { default: 'A quiet valley at dusk, layered hills, low sun, muted film tones' },
    seed: { type: Number, default: 89_702 },
    ratio: { default: '4:3' },
    model: { default: MODELS[0] },
  };

  // `generate`: `async ({ prompt, seed, model, ratio }) => urls`, set as a property.

  #picked = 0;
  #urls = null;
  #busy = false;
  #copiedTimer = 0;
  #run = 0;

  render() {
    return `<div class="preview"><canvas class="main"></canvas><p class="steps" aria-live="polite"></p></div>
<div class="meta"><span class="size"></span><span class="actions"><button class="copy" type="button" aria-label="Copy image">${strokeIcon(copy)}${strokeIcon(check)}</button><button class="download" type="button" aria-label="Download image">${strokeIcon(download)}</button></span></div>
<ul class="variations" aria-label="Variations"></ul>
<div class="composer"><textarea class="prompt" rows="2" aria-label="Scene"></textarea><div class="controls"><button class="model" type="button"></button><button class="ratio" type="button"><span class="frame"></span><span class="ratio-text"></span></button><lw-button class="generate">Render</lw-button></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.generate').addEventListener('click', () => this.#generate(), options);
    this.query('.variations').addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (button) this.#pick(Number(button.dataset.index));
    }, options);
    this.query('.ratio').addEventListener('click', () => this.#cycle('ratio', Object.keys(RATIOS)), options);
    this.query('.model').addEventListener('click', () => this.#cycle('model', MODELS), options);
    this.query('.prompt').addEventListener('input', (event) => (this.prompt = event.target.value), options);
    this.query('.prompt').addEventListener('keydown', (event) => {
      // ⌘ or Ctrl and Enter generates from the prompt.
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        this.#generate();
      }
    }, options);
    this.query('.copy').addEventListener('click', () => this.#copy(), options);
    this.query('.download').addEventListener('click', () => this.#download(), options);
    this.signal.addEventListener('abort', () => {
      this.#run++;
      clearTimeout(this.#copiedTimer);
    });
  }

  updated(changed) {
    const prompt = this.query('.prompt');
    if (prompt.value !== this.prompt) prompt.value = this.prompt ?? '';
    const [w, h] = this.#size;
    this.query('.size').textContent = `${w} × ${h} · Seed ${this.seed}`;
    this.query('.model').innerHTML = `${this.model}${strokeIcon(chevronsUpDown, 14)}`;
    this.query('.model').ariaLabel = `Renderer: ${this.model}`;
    this.query('.ratio-text').textContent = this.ratio;
    this.query('.ratio').ariaLabel = `Aspect ratio ${this.ratio}. Change`;
    this.style.setProperty('--_ratio', `${w} / ${h}`);
    if ((changed.has('ratio') || changed.has('seed')) && !this.#busy) this.#drawAll();
  }

  get #size() {
    return RATIOS[this.ratio] ?? RATIOS['4:3'];
  }

  // A canvas sized for the ratio, `width` px wide.
  #canvas(canvas, width) {
    const [w, h] = this.#size;
    canvas.width = width;
    canvas.height = Math.round((width * h) / w);
    return canvas.getContext('2d');
  }

  async #paint(canvas, width, index) {
    const ctx = this.#canvas(canvas, width);
    const url = this.#urls?.[index];
    if (!url) {
      drawScene(ctx, this.seed + index, index);
      return;
    }
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = url;
    await image.decode().catch(() => undefined);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  #drawAll() {
    this.#paint(this.query('.main'), PREVIEW, this.#picked);
    this.query('.variations').innerHTML = Array.from({ length: VARIATIONS }, (_, i) => `<li><button type="button" data-index="${i}" aria-label="Variation ${i + 1}" aria-pressed="${i === this.#picked}"><canvas></canvas></button></li>`).join('');
    this.shadowRoot.querySelectorAll('.variations canvas').forEach((canvas, i) => this.#paint(canvas, 160, i));
    this.#label();
  }

  #label() {
    this.query('.preview').ariaLabel = `Variation ${this.#picked + 1} of ${VARIATIONS}: ${this.prompt}`;
    this.query('.preview').role = 'img';
  }

  #pick(index) {
    if (this.#busy || index === this.#picked) return;
    this.#picked = index;
    for (const button of this.shadowRoot.querySelectorAll('.variations button')) button.ariaPressed = String(Number(button.dataset.index) === index);
    const main = this.query('.main');
    this.#paint(main, PREVIEW, index);
    if (!reducedMotion.matches) main.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
    this.#label();
    this.emit('select', { index });
  }

  #cycle(prop, list) {
    if (this.#busy) return;
    this[prop] = list[(list.indexOf(this[prop]) + 1) % list.length];
  }

  // ---- Generating ----

  // The image resolves from coarse blocks to sharp, a step at a time: the
  // full image is drawn small and scaled back up without smoothing.
  async #resolve(source) {
    const main = this.query('.main');
    const ctx = main.getContext('2d');
    const counter = this.query('.steps');
    const run = this.#run;
    const small = document.createElement('canvas');
    for (let step = 1; step <= STEPS; step++) {
      if (run !== this.#run) return false;
      const progress = step / STEPS;
      const block = Math.max(1, Math.round((main.width / 6) * (1 - progress) ** 2.2));
      small.width = Math.max(1, Math.round(main.width / block));
      small.height = Math.max(1, Math.round(main.height / block));
      small.getContext('2d').drawImage(source, 0, 0, small.width, small.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, main.width, main.height);
      counter.textContent = `Step ${step} / ${STEPS}`;
      if (!reducedMotion.matches) await new Promise((resolve) => setTimeout(resolve, STEP_MS));
    }
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(source, 0, 0, main.width, main.height);
    return true;
  }

  async #generate() {
    if (this.#busy) return;
    this.#busy = true;
    const run = ++this.#run;
    const button = this.query('.generate');
    button.loading = true;
    this.toggleAttribute('data-busy', true);
    this.#picked = 0;
    this.seed = Math.floor(10_000 + Math.random() * 89_999);
    const details = { prompt: this.prompt, seed: this.seed, model: this.model, ratio: this.ratio };
    this.#urls = this.generate ? await this.generate(details).catch(() => null) : null;
    if (run !== this.#run) return;
    // The finished image, drawn off screen, then resolved into view.
    const source = document.createElement('canvas');
    await this.#paint(source, PREVIEW, 0);
    this.query('.variations').innerHTML = '';
    const done = await this.#resolve(source);
    this.query('.steps').textContent = '';
    this.#busy = false;
    button.loading = false;
    this.removeAttribute('data-busy');
    if (!done) return;
    // The variations land one after another.
    this.#drawAll();
    if (!reducedMotion.matches) {
      this.shadowRoot.querySelectorAll('.variations li').forEach((li, i) => li.animate([{ opacity: 0, transform: 'translateY(8px) scale(0.92)' }, { opacity: 1, transform: 'none' }], { duration: 320, delay: i * 70, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' }));
    }
    this.emit('generate', details);
  }

  // ---- Copy and download ----

  #blob() {
    const canvas = document.createElement('canvas');
    return this.#paint(canvas, this.#size[0], this.#picked).then(() => new Promise((resolve) => canvas.toBlob(resolve, 'image/png')));
  }

  async #copy() {
    const button = this.query('.copy');
    try {
      const blob = await this.#blob();
      if (window.ClipboardItem && navigator.clipboard?.write) await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      else await writeClipboard(this.prompt);
    } catch {
      return;
    }
    button.toggleAttribute('data-copied', true);
    button.ariaLabel = 'Copied';
    clearTimeout(this.#copiedTimer);
    this.#copiedTimer = setTimeout(() => {
      button.removeAttribute('data-copied');
      button.ariaLabel = 'Copy image';
    }, COPIED_MS);
  }

  async #download() {
    const blob = await this.#blob();
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement('a'), { href: url, download: `generation-${this.seed}-${this.#picked + 1}.png` });
    link.click();
    setTimeout(() => URL.revokeObjectURL(url));
  }
}
