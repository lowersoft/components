// Every letter hangs from the rail on a thread, a pendulum of the same length,
// so the row swings like the balls of a Newton's cradle: letters that touch
// pass a knock along, and the one at the far end flies out.

const SUBSTEPS = 8;
const ITERATIONS = 3;
// One full swing takes this long whatever the font size: a desk toy with
// strings about 12 cm long.
const PERIOD = 0.72;
// Air drag per second. Most energy is lost in the clacks; the last small sway
// is damped harder so the cradle rests within seconds.
const DRAG = 0.3;
const SETTLE_DRAG = 1.6;
const SETTLE_BELOW = 0.02;

/** Natural angular frequency of every pendulum. */
export const W0 = (2 * Math.PI) / PERIOD;

export const clamp = (x, min, max) => Math.min(Math.max(x, min), max);

/**
 * The pendulums. Each bob is `{ left, right, center, top, bottom, gap, phi,
 * omega, held }`: ink edges at rest, the space to the next bob, its angle,
 * its angular speed, and whether a hand holds it.
 */
export class Cradle {
  bobs = [];
  radius = 1;
  restitution = 0.97;

  /** Swing energy, in roughly radians squared. */
  energy() {
    return this.bobs.reduce((sum, { omega, phi }) => sum + (omega / W0) ** 2 + 2 * (1 - Math.cos(phi)), 0);
  }

  /** Horizontal offset of a bob from where it hangs at rest. */
  shift(bob) {
    return this.radius * Math.sin(bob.phi);
  }

  rest() {
    this.bobs.forEach((bob) => {
      bob.phi = 0;
      bob.omega = 0;
    });
  }

  step(dt) {
    const h = dt / SUBSTEPS;
    const drag = this.energy() < SETTLE_BELOW ? SETTLE_DRAG : DRAG;
    const { bobs } = this;
    for (let s = 0; s < SUBSTEPS; s++) {
      for (const bob of bobs) {
        if (bob.held) continue;
        bob.omega -= W0 * W0 * Math.sin(bob.phi) * h;
        bob.omega *= 1 - drag * h;
        bob.phi += bob.omega * h;
      }
      // Sweep both ways so a knock travels the whole row in one step, as it
      // does through a real cradle.
      for (let it = 0; it < ITERATIONS; it++) {
        for (let i = 0; i + 1 < bobs.length; i++) this.#collide(bobs[i], bobs[i + 1]);
        for (let i = bobs.length - 2; i >= 0; i--) this.#collide(bobs[i], bobs[i + 1]);
      }
    }
  }

  // Separates two overlapping letters and bounces them apart if closing.
  // A held letter weighs nothing here: it keeps the hand's speed.
  #collide(a, b) {
    const { radius } = this;
    const xa = this.shift(a);
    const xb = this.shift(b);
    const depth = xa - xb - a.gap;
    const wa = a.held ? 0 : 1;
    const wb = b.held ? 0 : 1;
    if (depth <= 0 || wa + wb === 0) return;
    const share = depth / (wa + wb);
    a.phi = Math.asin(clamp((xa - wa * share) / radius, -1, 1));
    b.phi = Math.asin(clamp((xb + wb * share) / radius, -1, 1));

    const ca = Math.max(Math.cos(a.phi), 0.2);
    const cb = Math.max(Math.cos(b.phi), 0.2);
    const va = a.omega * radius * ca;
    const vb = b.omega * radius * cb;
    const closing = va - vb;
    if (closing <= 0) return;
    const impulse = ((1 + this.restitution) * closing) / (wa + wb);
    a.omega = (va - wa * impulse) / (radius * ca);
    b.omega = (vb + wb * impulse) / (radius * cb);
  }
}
