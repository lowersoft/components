import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './infinite-marquee.scss?inline';

// Marks the copies the marquee makes of its own items.
const COPY = 'data-lw-marquee-copy';
// How long the strip takes to coast to a stop under the pointer, and back.
const COAST = 520;
// A ceiling on copies, should the strip ever be given no size of its own.
const MAX_SETS = 40;

/**
 * A strip of items that slides without end: logos, names, cards, photos,
 * anything set as its content. The items are repeated as many times as it
 * takes to overfill the strip, and it slides exactly one set's length per
 * cycle, so the loop never stutters or snaps. The motion runs on the
 * compositor through the Web Animations API, and soft fades blend both ends
 * into the page.
 *
 * It slides left, right, up or down; vertical strips take their height
 * from the element. With `pause-on-hover` it coasts to a stop under the
 * pointer and picks up again after, and it stops the same way while
 * something inside has keyboard focus. It rests off screen and in a hidden
 * tab. The copies are hidden from assistive technology and cannot take
 * focus, so screen readers meet each item once; with reduced motion the
 * strip stands still and scrolls by hand instead.
 *
 * Copies are clones of the content, kept in the page so the page's styles
 * reach them; style items by class rather than by id.
 *
 * @attr {number} speed - Seconds for one set of items to go by; lower is faster
 * @attr {'left'|'right'|'up'|'down'} direction - Which way the items travel
 * @attr {boolean} pause-on-hover - Coasts to a stop under the pointer
 * @attr {string} gap - Space between items, any CSS length
 * @attr {boolean} no-fade - Hard ends instead of soft fades
 * @attr {string} fade-size - How far the fades reach in from each end, any CSS length
 * @attr {string} label - Names the strip for assistive technology
 * @slot - The items, one element each
 * @csspart viewport - The visible window onto the strip
 * @csspart track - The sliding row or column
 * @cssprop --lw-infinite-marquee-gap - Same as `gap`
 * @cssprop --lw-infinite-marquee-fade - Same as `fade-size`
 */
export class LwInfiniteMarquee extends LwElement {
  static styles = styles;
  static props = {
    speed: { type: Number, default: 30 },
    direction: { default: 'left' },
    pauseOnHover: { type: Boolean, reflect: true },
    gap: {},
    noFade: { type: Boolean, reflect: true },
    fadeSize: {},
    label: {},
  };

  #slide = null;
  #period = 0;
  #visible = false;
  #hovered = false;
  #focused = false;
  #coast = 0;
  #content = null;
  #sized = null;

  render() {
    return '<div class="viewport" part="viewport"><div class="track" part="track"><slot></slot></div></div>';
  }

  connected() {
    const options = { signal: this.signal };
    // Rebuild when the items change, but not for the copies made here.
    this.#content = new MutationObserver((records) => {
      const copy = (node) => node.nodeType === 1 && node.hasAttribute(COPY);
      const inCopy = (node) => (node.nodeType === 1 ? node : node.parentElement)?.closest(`[${COPY}]`);
      const theirs = records.some((record) =>
        record.target === this
          ? record.type === 'childList' && [...record.addedNodes, ...record.removedNodes].some((node) => node.nodeType === 1 && !copy(node))
          : !inCopy(record.target),
      );
      if (theirs) this.#build();
    });
    this.#content.observe(this, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'src'] });
    this.#sized = new ResizeObserver(() => this.#fill());
    watchVisibility(
      this,
      (visible) => {
        this.#visible = visible;
        this.#run();
      },
      this.signal,
    );
    this.addEventListener('pointerenter', (event) => event.pointerType !== 'touch' && this.#hold('hovered', true), options);
    this.addEventListener('pointerleave', () => this.#hold('hovered', false), options);
    this.addEventListener('focusin', (event) => this.#hold('focused', event.target.matches(':focus-visible')), options);
    this.addEventListener('focusout', () => this.#hold('focused', false), options);
    reducedMotion.addEventListener('change', () => this.#build(), options);
    this.signal.addEventListener('abort', () => {
      this.#content.disconnect();
      this.#sized.disconnect();
      cancelAnimationFrame(this.#coast);
      this.#slide?.cancel();
      this.#slide = null;
      this.#period = 0;
      this.#copies().forEach((copy) => copy.remove());
      this.#content.takeRecords();
    });
    this.#build();
  }

  updated(changed) {
    const vertical = this.#vertical;
    this.toggleAttribute('data-vertical', vertical);
    for (const [prop, name] of [['gap', '--_gap'], ['fadeSize', '--_fade']]) {
      if (this[prop]) this.style.setProperty(name, this[prop]);
      else this.style.removeProperty(name);
    }
    const viewport = this.query('.viewport');
    if (this.label) {
      viewport.setAttribute('role', 'group');
      viewport.ariaLabel = this.label;
    } else {
      viewport.removeAttribute('role');
      viewport.ariaLabel = null;
    }
    if (!this.isConnected || !this.#sized) return;
    if (changed.has('gap') || changed.has('direction')) this.#build();
    else if (changed.has('speed')) this.#animate();
    if (changed.has('pauseOnHover')) this.#coastTo(this.#rate, true);
  }

  get #vertical() {
    return this.direction === 'up' || this.direction === 'down';
  }

  get #originals() {
    return [...this.children].filter((child) => !child.hasAttribute(COPY));
  }

  #copies() {
    return [...this.children].filter((child) => child.hasAttribute(COPY));
  }

  // Starts over from the items as they are now.
  #build() {
    if (!this.isConnected || !this.#sized) return;
    this.#copies().forEach((copy) => copy.remove());
    this.#period = 0;
    this.#sized.disconnect();
    const still = reducedMotion.matches;
    this.toggleAttribute('data-still', still);
    const originals = this.#originals;
    if (!still) {
      this.#sized.observe(this.query('.viewport'));
      originals.forEach((item) => this.#sized.observe(item));
    }
    this.#content.takeRecords();
    if (still || !originals.length) {
      this.#slide?.cancel();
      this.#slide = null;
      return;
    }
    this.#fill();
  }

  // Adds copies until the strip overfills its window by one set, and
  // measures how far one set reaches, gap included.
  #fill() {
    const originals = this.#originals;
    if (!originals.length || reducedMotion.matches) return;
    if (!this.#copies().length) this.#copy(originals);
    const [first] = this.#copies();
    const edge = this.#vertical ? 'top' : 'left';
    const period = first.getBoundingClientRect()[edge] - originals[0].getBoundingClientRect()[edge];
    if (period <= 0) return;
    const viewport = this.query('.viewport');
    const span = this.#vertical ? viewport.clientHeight : viewport.clientWidth;
    const sets = Math.min(MAX_SETS, Math.max(1, Math.ceil(span / period)));
    let copies = this.#copies().length / originals.length;
    while (copies < sets) {
      this.#copy(originals);
      copies += 1;
    }
    while (copies > sets) {
      this.#copies()
        .slice(-originals.length)
        .forEach((copy) => copy.remove());
      copies -= 1;
    }
    this.#content.takeRecords();
    if (Math.abs(period - this.#period) > 0.5) {
      this.#period = period;
      this.#animate();
    }
  }

  #copy(originals) {
    this.append(
      ...originals.map((item) => {
        const copy = item.cloneNode(true);
        copy.removeAttribute('id');
        copy.querySelectorAll('[id]').forEach((each) => each.removeAttribute('id'));
        copy.setAttribute(COPY, '');
        copy.setAttribute('aria-hidden', 'true');
        copy.inert = true;
        return copy;
      }),
    );
  }

  // One cycle slides the track one set along, then starts again from where
  // the next set now stands, so the seam never shows. A restart keeps the
  // phase it had.
  #animate() {
    const period = this.#period;
    if (!period) return;
    const duration = Math.max(1, this.speed ?? 30) * 1000;
    const old = this.#slide;
    const phase = old ? (Number(old.currentTime) % Number(old.effect.getTiming().duration)) / Number(old.effect.getTiming().duration) : 0;
    old?.cancel();
    const axis = this.#vertical ? 'Y' : 'X';
    const back = this.direction === 'right' || this.direction === 'down';
    const at = (offset) => ({ transform: `translate${axis}(${-offset}px)` });
    this.#slide = this.query('.track').animate(back ? [at(period), at(0)] : [at(0), at(period)], { duration, iterations: Infinity });
    this.#slide.currentTime = (phase || 0) * duration;
    this.#slide.playbackRate = old ? old.playbackRate : this.#rate;
    this.#run();
  }

  #run() {
    const slide = this.#slide;
    if (!slide) return;
    if (this.#visible && slide.playState !== 'running') slide.play();
    else if (!this.#visible && slide.playState === 'running') slide.pause();
  }

  get #rate() {
    return (this.pauseOnHover && this.#hovered) || this.#focused ? 0 : 1;
  }

  #hold(reason, on) {
    if (reason === 'hovered') this.#hovered = on;
    else this.#focused = on;
    this.#coastTo(this.#rate);
  }

  // Eases the speed toward `rate` instead of stopping dead.
  #coastTo(rate, instant = false) {
    cancelAnimationFrame(this.#coast);
    const slide = this.#slide;
    if (!slide) return;
    const from = slide.playbackRate;
    if (from === rate) return;
    if (instant) {
      slide.playbackRate = rate;
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COAST);
      slide.playbackRate = from + (rate - from) * (1 - (1 - t) ** 3);
      if (t < 1) this.#coast = requestAnimationFrame(tick);
    };
    this.#coast = requestAnimationFrame(tick);
  }
}
