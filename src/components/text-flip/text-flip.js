import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { graphemes, setHeadingLevel, watchContent } from '../../core/text.js';
import styles from './text-flip.scss?inline';

// Each character is a small prism of three faces: the front, a back face
// a quarter turn away, and the front again a half turn away, so a cycle
// rolls over to the back, rests and rolls on home without a jump.
const AXES = {
  top: ['rotateX', 1],
  bottom: ['rotateX', -1],
  right: ['rotateY', 1],
  left: ['rotateY', -1],
};

/**
 * A headline whose characters roll over like the faces of a cube, one
 * after another, to a back face in another color and on round to the
 * front. The wave can start from the first character, the last, the
 * middle, a random one or any index, and each character overshoots and
 * settles as it lands.
 *
 * A cycle starts on hover, on click, or both; `flip()` and a new
 * `replay-key` start one from code, even when `disabled`. Text is split
 * into user-perceived characters, so emoji and accents stay whole. Screen
 * readers hear the whole text once; with reduced motion it stays still.
 *
 * @attr {string} text - The words; when set, the content is ignored
 * @attr {'top'|'right'|'bottom'|'left'} direction - The side the back face rolls in from
 * @attr {'hover'|'click'|'both'} trigger - What starts a cycle
 * @attr {number} duration - Seconds each character takes to roll one face
 * @attr {number} stagger-duration - Seconds between one character and the next
 * @attr {string} stagger-from - Where the wave starts: `first`, `last`, `center`, `random` or an index
 * @attr {string} easing - CSS easing of each roll; the default overshoots like a spring
 * @attr {string} front-color - The front faces; the theme's foreground by default
 * @attr {string} back-color - The back faces; the theme's muted foreground by default
 * @attr {boolean} disabled - Ignores hover and click; `flip()` still works
 * @attr {string} replay-key - Changing it starts a cycle
 * @attr {number} level - Makes it a heading of this level, 1 to 6
 * @csspart char - Each character
 * @csspart back - Each back face
 * @cssprop --lw-text-flip-front - Same as `front-color`
 * @cssprop --lw-text-flip-back - Same as `back-color`
 */
export class LwTextFlip extends LwElement {
  static styles = styles;
  static props = {
    text: {},
    direction: { default: 'top' },
    trigger: { default: 'hover' },
    duration: { type: Number, default: 0.45 },
    staggerDuration: { type: Number, default: 0.05 },
    staggerFrom: { default: 'first' },
    easing: { default: 'cubic-bezier(0.34, 1.4, 0.64, 1)' },
    frontColor: {},
    backColor: {},
    disabled: { type: Boolean, reflect: true },
    replayKey: {},
    level: { type: Number },
  };

  #flips = [];
  #replayKey;

  render() {
    return '<span class="sr"></span><span class="stage" aria-hidden="true"></span>';
  }

  connected() {
    const options = { signal: this.signal };
    const stage = this.query('.stage');
    const triggers = (kind) => !this.disabled && [kind, 'both'].includes(this.trigger ?? 'hover');
    stage.addEventListener('pointerenter', (event) => event.pointerType !== 'touch' && triggers('hover') && this.flip(), options);
    stage.addEventListener('click', () => triggers('click') && this.flip(), options);
    watchContent(this, () => this.#read(), this.signal);
    const resize = new ResizeObserver(() => this.#measure());
    resize.observe(stage);
    document.fonts?.ready.then(() => this.isConnected && this.#measure());
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      this.#cancel();
    });
    this.#read();
  }

  updated(changed) {
    if (changed.has('level')) setHeadingLevel(this, this.level);
    for (const [prop, name] of [['frontColor', '--_front'], ['backColor', '--_back']]) {
      if (this[prop]) this.style.setProperty(name, this[prop]);
      else this.style.removeProperty(name);
    }
    if (changed.has('text')) this.#read();
    if (changed.has('direction')) {
      this.#cancel();
      this.#place();
    }
    if (changed.has('replayKey')) {
      // The first value only records where it starts.
      if (this.#replayKey !== undefined) this.flip();
      this.#replayKey = this.replayKey ?? null;
    }
  }

  /** Runs one cycle, unless one is already rolling. */
  flip() {
    if (this.#flips.length || reducedMotion.matches) return;
    const cubes = [...this.shadowRoot.querySelectorAll('.cube')];
    if (!cubes.length) return;
    const [rotate, sign] = AXES[this.direction] ?? AXES.top;
    const roll = Math.max(0.05, this.duration ?? 0.45) * 1000;
    const hold = roll * 0.5;
    const total = roll * 2 + hold;
    const easing = this.easing || 'cubic-bezier(0.34, 1.4, 0.64, 1)';
    const turn = (quarter) => `translateZ(calc(var(--_depth) * -1)) ${rotate}(${-sign * quarter * 90}deg)`;
    const frames = [
      { transform: turn(0), easing },
      { transform: turn(1), offset: roll / total },
      { transform: turn(1), offset: (roll + hold) / total, easing },
      { transform: turn(2) },
    ];
    const order = this.#order(cubes.length);
    const step = Math.max(0, this.staggerDuration ?? 0.05) * 1000;
    this.#flips = cubes.map((cube, i) => cube.animate(frames, { duration: total, delay: order[i] * step }));
    const flips = this.#flips;
    Promise.all(flips.map((flip) => flip.finished)).then(
      () => this.#flips === flips && (this.#flips = []),
      () => {},
    );
  }

  // How many steps of delay each character waits.
  #order(count) {
    const from = this.staggerFrom ?? 'first';
    if (from === 'random') {
      const order = Array.from({ length: count }, (_, i) => i);
      for (let i = count - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      return order;
    }
    const origin = { first: 0, last: count - 1, center: (count - 1) / 2 }[from] ?? Math.min(Math.max(Number(from) || 0, 0), count - 1);
    return Array.from({ length: count }, (_, i) => Math.abs(i - origin));
  }

  #cancel() {
    for (const flip of this.#flips) flip.cancel();
    this.#flips = [];
  }

  #read() {
    if (!this.isConnected) return;
    this.#cancel();
    const text = this.text ?? this.textContent.trim();
    this.query('.sr').textContent = text;
    const chars = graphemes(text).map((char) => {
      const face = (back) => `<span class="face${back ? ' back' : ''}"${back ? ' part="back"' : ''}>${escapeHtml(char)}</span>`;
      const span = document.createElement('span');
      span.className = char.trim() ? 'char' : 'char space';
      span.part = 'char';
      span.innerHTML = `<span class="cube">${face(false)}${face(true)}${face(false)}</span>`;
      return span;
    });
    this.query('.stage').replaceChildren(...chars);
    this.#place();
  }

  // Faces sit a quarter turn apart around the prism's middle.
  #place() {
    const [rotate, sign] = AXES[this.direction] ?? AXES.top;
    this.toggleAttribute('data-sideways', rotate === 'rotateY');
    for (const cube of this.shadowRoot.querySelectorAll('.cube')) {
      [...cube.children].forEach((face, quarter) => (face.style.transform = `${rotate}(${sign * quarter * 90}deg) translateZ(var(--_depth))`));
    }
    this.#measure();
  }

  // Rolling sideways, each prism is as deep as its character is wide.
  #measure() {
    const sideways = this.hasAttribute('data-sideways');
    for (const char of this.shadowRoot.querySelectorAll('.char')) {
      if (sideways) char.style.setProperty('--_depth', `${char.offsetWidth / 2}px`);
      else char.style.removeProperty('--_depth');
    }
  }
}
