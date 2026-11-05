import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { setHeadingLevel } from '../../core/text.js';
import styles from './text-morphing.scss?inline';

let uid = 0;

/**
 * A headline that melts from one phrase into the next. The outgoing phrase
 * blurs away as the incoming one sharpens, and a threshold filter over
 * both cuts the blur back to hard edges, so the letters seem to flow into
 * each other like liquid. Each phrase holds for a moment before the next.
 *
 * Screen readers hear every phrase once, as a list. The loop pauses off
 * screen, in a hidden tab and when `paused`; with reduced motion the first
 * phrase shows as plain text. Size it with `font-size` on the element;
 * the box is one line tall.
 *
 * @attr {Array<string>} texts (JSON) - The phrases, two or more
 * @attr {number} morph-duration - Seconds each morph takes
 * @attr {number} cooldown-duration - Seconds each phrase holds before the next morph
 * @attr {boolean} paused - Stops the loop
 * @attr {number} level - Makes it a heading of this level, 1 to 6
 * @csspart text - Each phrase
 */
export class LwTextMorphing extends LwElement {
  static styles = styles;
  static props = {
    texts: { type: Object, default: ['LowerSoft', 'components', 'that', 'feel', 'alive'] },
    morphDuration: { type: Number, default: 1.5 },
    cooldownDuration: { type: Number, default: 0.5 },
    paused: { type: Boolean, reflect: true },
    level: { type: Number },
  };

  #id = `lw-text-morphing-${++uid}`;
  #index = 0;
  // Seconds into the current morph; negative while a phrase holds.
  #morph = 0;
  #cooldown = 0;
  #frame = 0;
  #last = 0;
  #visible = false;

  render() {
    const id = this.#id;
    return `<span class="sr"></span><span class="stage" aria-hidden="true" style="--_melt: url(#${id}) blur(0.6px)"><span class="text a" part="text"></span><span class="text b" part="text"></span></span><svg class="defs" aria-hidden="true" focusable="false"><defs><filter id="${id}"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"/></filter></defs></svg>`;
  }

  connected() {
    const options = { signal: this.signal };
    const seen = new IntersectionObserver(([entry]) => {
      this.#visible = entry.isIntersecting;
      this.#run();
    });
    seen.observe(this);
    document.addEventListener('visibilitychange', () => this.#run(), options);
    reducedMotion.addEventListener('change', () => this.#run(), options);
    this.signal.addEventListener('abort', () => {
      seen.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
    });
  }

  updated(changed) {
    const texts = this.#texts;
    this.query('.sr').textContent = texts.join(', ');
    if (changed.has('level')) setHeadingLevel(this, this.level);
    if (changed.has('texts')) {
      this.#index = 0;
      this.#morph = 0;
      this.#cooldown = this.#hold;
      this.#paint(0);
    }
    this.#run();
  }

  get #texts() {
    return (Array.isArray(this.texts) ? this.texts : []).map(String).filter(Boolean);
  }

  get #hold() {
    return Math.max(0, this.cooldownDuration ?? 0.5);
  }

  get #length() {
    return Math.max(0.1, this.morphDuration ?? 1.5);
  }

  #run() {
    const still = reducedMotion.matches;
    this.toggleAttribute('data-still', still);
    if (still) {
      this.#index = 0;
      this.#cooldown = this.#hold;
      this.#paint(0);
    }
    const live = !still && !this.paused && this.#visible && !document.hidden && this.#texts.length > 1;
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
    if (this.#cooldown > 0) {
      this.#cooldown -= dt;
      if (this.#cooldown <= 0) this.#morph = 0;
      this.#paint(0);
    } else {
      this.#morph += dt;
      const f = Math.min(1, this.#morph / this.#length);
      if (f >= 1) {
        this.#index = (this.#index + 1) % this.#texts.length;
        this.#cooldown = this.#hold;
        this.#paint(0);
      } else this.#paint(f);
    }
    this.#run();
  }

  // Draws the morph at `f`, 0 to 1: the outgoing phrase in `a`, the
  // incoming in `b`. At rest only the current phrase shows, sharp.
  #paint(f) {
    const texts = this.#texts;
    const a = this.query('.a');
    const b = this.query('.b');
    if (!texts.length) {
      a.textContent = b.textContent = '';
      return;
    }
    const current = texts[this.#index % texts.length];
    const next = texts[(this.#index + 1) % texts.length];
    // The threshold only runs mid-morph; at rest the text keeps its smooth edges.
    this.toggleAttribute('data-morphing', f > 0);
    if (f <= 0) {
      a.textContent = current;
      a.style.filter = '';
      a.style.opacity = '1';
      b.textContent = '';
      b.style.opacity = '0';
      return;
    }
    // Blur falls off steeply as each phrase arrives, so it snaps into focus.
    const show = (element, text, t) => {
      element.textContent = text;
      element.style.filter = `blur(${Math.min(8 / Math.max(t, 0.0001) - 8, 100)}px)`;
      element.style.opacity = String(t ** 0.4);
    };
    show(b, next, f);
    show(a, current, 1 - f);
  }
}
