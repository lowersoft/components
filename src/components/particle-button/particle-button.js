import { LwActionButton } from '../button/action-button.js';
import styles from './particle-button.scss?inline';

const PARTICLE_COUNT = 18;
const GRAVITY = 0.0016; // px per ms squared
const DRAG = 0.0022; // share of velocity lost per ms
const LIFETIME = 650; // ms
const BLEED = 64; // px the canvas extends past the button on every side

// Chips spread from the middle of the top edge, flying out to both sides.
const createParticles = (width) =>
  Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const x = Math.min(Math.max(width / 2 + (Math.random() - 0.5) * Math.min(width, 120), 4), width - 4);
    const side = x < width / 2 ? -1 : 1;
    const speed = 0.18 + Math.random() * 0.22;
    const direction = -Math.PI / 2 + side * Math.random() * 0.9;
    const isChip = i % 3 === 0;
    return {
      x,
      y: 0,
      vx: Math.cos(direction) * speed,
      vy: Math.sin(direction) * speed,
      angle: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.02,
      w: isChip ? 5 : 3,
      h: isChip ? 2 : 3,
    };
  });

/**
 * Async action button that bursts into particles on success. The label
 * crossfades to a spinner while pending, then to a drawn check with a burst
 * of chips in the button's color, or to an error with a shake.
 *
 * @attr {boolean} no-particles - Disables the success burst
 * @see LwActionButton for the action flow, labels and events
 */
export class LwParticleButton extends LwActionButton {
  static styles = [...LwActionButton.styles, styles];
  static props = {
    ...LwActionButton.props,
    noParticles: { type: Boolean },
  };

  statusChanged(status, animate) {
    super.statusChanged(status, animate);
    if (status === 'success' && animate && !this.noParticles) this.#burst();
  }

  // Chips of the button's own color fly off its top edge with gravity, drag and spin.
  #burst() {
    const button = this.query('button');
    const { offsetWidth: width, offsetHeight: height } = button;
    const style = getComputedStyle(button);
    const color = style.backgroundColor === 'rgba(0, 0, 0, 0)' ? style.color : style.backgroundColor;
    const dpr = devicePixelRatio || 1;

    const canvas = document.createElement('canvas');
    canvas.className = 'burst';
    canvas.setAttribute('aria-hidden', 'true');
    // Drawn at the screen's pixel density, laid out at the button's own size
    // plus the bleed; without a CSS size it would show at `dpr` times that.
    canvas.width = (width + BLEED * 2) * dpr;
    canvas.height = (height + BLEED * 2) * dpr;
    // Placed from the button's padding edge, so its border is stepped over too.
    Object.assign(canvas.style, {
      left: `${-BLEED - button.clientLeft}px`,
      top: `${-BLEED - button.clientTop}px`,
      width: `${width + BLEED * 2}px`,
      height: `${height + BLEED * 2}px`,
    });
    button.append(canvas);

    const context = canvas.getContext('2d');
    context.fillStyle = color;

    const particles = createParticles(width);
    const start = performance.now();
    let last = start;
    let frame = 0;

    const tick = (now) => {
      const progress = (now - start) / LIFETIME;
      if (progress >= 1) return canvas.remove();

      const dt = Math.min(now - last, 32);
      last = now;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = 1 - progress * progress;
      for (const p of particles) {
        p.vx *= 1 - DRAG * dt;
        p.vy = p.vy * (1 - DRAG * dt) + GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.angle += p.spin * dt;
        context.setTransform(dpr, 0, 0, dpr, (p.x + BLEED) * dpr, (p.y + BLEED) * dpr);
        context.rotate(p.angle);
        context.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    this.signal.addEventListener(
      'abort',
      () => {
        cancelAnimationFrame(frame);
        canvas.remove();
      },
      { once: true },
    );
  }
}
