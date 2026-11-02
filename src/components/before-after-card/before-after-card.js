import { LwElement } from '../../core/lw-element.js';
import { reducedMotion, springFeel, springTo } from '../../core/motion.js';
import styles from './before-after-card.scss?inline';

const DEMO_PHOTO = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&h=1067&fit=crop&auto=format&q=80';

// The one-shot scrub on first sight: a pause, out this far, and back.
const DEMO_DELAY = 900;
const DEMO_REACH = 22;
const DEMO_SPRING = springFeel(0.42, 0);
// Past this, the percent sits on the other side of the handle so it stays in frame.
const FLIP_AT = 82;

const clamp = (value) => Math.min(100, Math.max(0, value));

/**
 * Two versions of one picture with a handle between them: drag it, or press
 * anywhere on the picture, and the after image wipes over the before with
 * no lag. The after side is on the start (the top when vertical); the
 * percent beside the handle says how much of it shows. Without a before
 * image the after image stands in for it, desaturated.
 *
 * On first sight it scrubs once on its own to show it can be moved, unless
 * reduced motion is on, `no-demo` is set or someone touched it first. It is
 * a slider to assistive technology: the arrow keys move it by one, with
 * Shift or Page Up and Page Down by ten, and Home and End go to the ends.
 *
 * Both images fill the frame, so give them the same aspect ratio; the frame
 * is 3:2 unless `--lw-before-after-card-ratio` says otherwise.
 *
 * @attr {string} after - The after image
 * @attr {string} before - The before image; the after image, desaturated, when left out
 * @attr {string} after-alt
 * @attr {string} before-alt
 * @attr {string} after-label - Corner label on the after side
 * @attr {string} before-label - Corner label on the before side
 * @attr {string} caption - A line under the frame
 * @attr {string} label - Accessible name of the slider
 * @attr {'horizontal'|'vertical'} orientation
 * @attr {number} position - How much of the after image shows, 0 to 100
 * @attr {boolean} no-percent - Hides the percent beside the handle
 * @attr {boolean} no-demo - Skips the scrub on first sight
 * @fires lw-input - The position moves while dragging; `detail: { position }`
 * @fires lw-change - The position settled: on release, or from a key; `detail: { position }`
 * @csspart frame - The picture, which is the slider
 * @csspart handle - The round handle
 * @cssprop --lw-before-after-card-ratio - The frame's aspect ratio
 */
export class LwBeforeAfterCard extends LwElement {
  static styles = styles;
  static props = {
    after: { default: DEMO_PHOTO },
    before: {},
    afterAlt: { default: 'A valley at sunset, graded' },
    beforeAlt: { default: 'A valley at sunset, as shot' },
    afterLabel: { default: 'After' },
    beforeLabel: { default: 'Before' },
    caption: {},
    label: { default: 'Compare before and after' },
    orientation: { default: 'horizontal', reflect: true },
    position: { type: Number, default: 50, reflect: true },
    noPercent: { type: Boolean },
    noDemo: { type: Boolean },
  };

  #dragging = false;
  #touched = false;
  #demoTimer = 0;
  #stopDemo = null;

  render() {
    return `<figure class="card"><div class="frame" part="frame" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100">
<div class="layer before-layer"><img class="before" draggable="false" decoding="async" alt=""><span class="tint" aria-hidden="true"></span></div>
<div class="layer after-layer"><img class="after" draggable="false" decoding="async" alt=""></div>
<span class="shade" aria-hidden="true"></span><span class="tag after-tag" aria-hidden="true"></span><span class="tag before-tag" aria-hidden="true"></span>
<span class="line" aria-hidden="true"></span><span class="handle" part="handle" aria-hidden="true"><span class="knob"><svg viewBox="0 0 16 12" width="16" height="12" fill="currentColor"><path d="M1.25 6 5.75 1.75v8.5z"/><path d="m14.75 6-4.5-4.25v8.5z"/></svg></span><span class="percent"></span></span>
</div><figcaption class="caption"></figcaption></figure>`;
  }

  connected() {
    const options = { signal: this.signal };
    const frame = this.query('.frame');
    frame.addEventListener('pointerdown', (event) => this.#press(event), options);
    frame.addEventListener('pointermove', (event) => this.#drag(event), options);
    frame.addEventListener('pointerup', (event) => this.#release(event), options);
    frame.addEventListener('pointercancel', (event) => this.#release(event), options);
    frame.addEventListener('keydown', (event) => this.#key(event), options);

    const seen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      seen.disconnect();
      this.#demo();
    }, { threshold: 0.6 });
    seen.observe(frame);
    this.signal.addEventListener('abort', () => {
      seen.disconnect();
      this.#cancelDemo();
    });
  }

  updated(changed) {
    const before = this.query('.before');
    const after = this.query('.after');
    if (changed.has('after') || changed.has('before')) {
      after.src = this.after ?? '';
      before.src = this.before || this.after || '';
      this.toggleAttribute('data-stand-in', !this.before);
    }
    after.alt = this.afterAlt ?? '';
    before.alt = this.before ? (this.beforeAlt ?? '') : '';
    const afterTag = this.query('.after-tag');
    const beforeTag = this.query('.before-tag');
    afterTag.textContent = this.afterLabel ?? '';
    beforeTag.textContent = this.beforeLabel ?? '';
    afterTag.hidden = !this.afterLabel;
    beforeTag.hidden = !this.beforeLabel;
    const caption = this.query('.caption');
    caption.textContent = this.caption ?? '';
    caption.hidden = !this.caption;
    const frame = this.query('.frame');
    frame.ariaLabel = this.label || 'Compare before and after';
    frame.ariaOrientation = this.#vertical ? 'vertical' : 'horizontal';
    this.query('.percent').hidden = this.noPercent;
    this.#paint(this.position);
  }

  get #vertical() {
    return this.orientation === 'vertical';
  }

  // Draws the wipe at `position` without touching the attribute, so a drag
  // or the demo moves at frame rate.
  #paint(position) {
    const at = clamp(position ?? 50);
    this.style.setProperty('--_at', `${at}%`);
    this.toggleAttribute('data-flip', at > FLIP_AT);
    const whole = Math.round(at);
    this.query('.percent').textContent = String(whole);
    const frame = this.query('.frame');
    frame.ariaValueNow = String(whole);
    frame.ariaValueText = `${whole}% ${this.afterLabel || 'after'}`;
  }

  #set(position, event) {
    const at = Math.round(clamp(position) * 10) / 10;
    if (at === this.position) return;
    this.position = at;
    this.#paint(at);
    this.emit(event, { position: at });
  }

  #fromPointer(event) {
    const box = this.query('.frame').getBoundingClientRect();
    return this.#vertical ? ((event.clientY - box.top) / box.height) * 100 : ((event.clientX - box.left) / box.width) * 100;
  }

  #press(event) {
    if (event.button !== 0) return;
    this.#touched = true;
    this.#cancelDemo();
    this.#dragging = true;
    this.toggleAttribute('data-dragging', true);
    const frame = this.query('.frame');
    frame.setPointerCapture(event.pointerId);
    // A press focuses the slider for the keys, without the keyboard ring.
    frame.focus({ preventScroll: true, focusVisible: false });
    this.#set(this.#fromPointer(event), 'input');
  }

  #drag(event) {
    if (this.#dragging) this.#set(this.#fromPointer(event), 'input');
  }

  #release(event) {
    if (!this.#dragging) return;
    this.#dragging = false;
    this.removeAttribute('data-dragging');
    this.query('.frame').releasePointerCapture?.(event.pointerId);
    this.emit('change', { position: this.position });
  }

  #key(event) {
    const big = event.shiftKey ? 10 : 1;
    const steps = { ArrowRight: big, ArrowUp: this.#vertical ? -big : big, ArrowDown: this.#vertical ? big : -big, ArrowLeft: -big, PageUp: 10, PageDown: -10 };
    let next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;
    else if (event.key in steps) next = Math.round(this.position) + steps[event.key];
    else return;
    event.preventDefault();
    this.#touched = true;
    this.#cancelDemo();
    this.#set(next, 'change');
  }

  // Out and back once, as a hint that the handle moves.
  #demo() {
    if (this.noDemo || this.#touched || reducedMotion.matches) return;
    this.#demoTimer = setTimeout(() => {
      const home = clamp(this.position);
      const out = home > 100 - DEMO_REACH - 10 ? home - DEMO_REACH : home + DEMO_REACH;
      const run = (from, to, done) => {
        this.#stopDemo = springTo(from, to, { ...DEMO_SPRING, restDelta: 0.3, restSpeed: 4, update: (value) => this.#paint(value), done });
      };
      run(home, out, () => run(out, home, () => (this.#stopDemo = null)));
    }, DEMO_DELAY);
  }

  #cancelDemo() {
    clearTimeout(this.#demoTimer);
    if (!this.#stopDemo) return;
    this.#stopDemo();
    this.#stopDemo = null;
    this.#paint(this.position);
  }
}
