// The string is a sum of its standing waves (modes), each a damped oscillator
// solved exactly, so it cannot blow up at any frame rate.

const MAX_MODES = 24;
// No mode vibrates faster than this many times a second; above it, a 60 Hz
// screen would alias it into jitter.
const MAX_MODE_HZ = 22;
// Wave speed along the string in px per second at tension 1. As on a real
// string, a longer one rings lower.
const WAVE_SPEED = 1500;
// Every mode loses energy, high ones much faster, so a pluck starts sharp
// and rounds off into a slow sway.
const DAMP_BASE = 0.9;
const DAMP_HIGH = 0.012;

/** Modes for a string `length` px long, keeping the motion of `previous`. */
export const createModes = (length, tension, previous = []) => {
  const f0 = (WAVE_SPEED * tension) / (2 * length);
  const count = Math.max(4, Math.min(MAX_MODES, Math.floor(MAX_MODE_HZ / f0)));
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    const omega = 2 * Math.PI * f0 * n;
    const gamma = (DAMP_BASE + DAMP_HIGH * n * n) * Math.sqrt(tension);
    return {
      q: previous[index]?.q ?? 0,
      v: previous[index]?.v ?? 0,
      omega,
      gamma,
      damped: Math.sqrt(Math.max(omega * omega - gamma * gamma, 1)),
    };
  });
};

/** Advances one damped oscillator by `dt` seconds, exactly. */
export const stepMode = (mode, dt) => {
  const { q, v, omega, gamma, damped } = mode;
  const decay = Math.exp(-gamma * dt);
  const cos = Math.cos(damped * dt);
  const sin = Math.sin(damped * dt);
  mode.q = decay * (q * cos + ((v + gamma * q) / damped) * sin);
  mode.v = decay * (v * cos - ((omega * omega * q + gamma * v) / damped) * sin);
};

/**
 * Pulls the string into a V with its apex at `apex` and height `height`,
 * written as standing waves. Cutting the series short rounds the corner.
 */
export const pullModes = (modes, length, apex, height) => {
  const d = Math.min(Math.max(apex, 1), length - 1);
  modes.forEach((mode, index) => {
    const n = index + 1;
    mode.q = ((2 * height * length * length) / (n * n * Math.PI * Math.PI * d * (length - d))) * Math.sin((n * Math.PI * d) / length);
    mode.v = 0;
  });
};

/** Each mode's shape at `x`: the basis a displacement is summed over. */
export const modeBasis = (modes, length, x) => Float64Array.from(modes, (_, index) => Math.sin(((index + 1) * Math.PI * x) / length));

/** The slope of each mode's shape at `x`. */
export const slopeBasis = (modes, length, x) =>
  Float64Array.from(modes, (_, index) => {
    const k = ((index + 1) * Math.PI) / length;
    return k * Math.cos(k * x);
  });

/** Displacement where `basis` was sampled. */
export const displacement = (modes, basis) => {
  let y = 0;
  for (let i = 0; i < modes.length; i++) y += modes[i].q * basis[i];
  return y;
};

export const energy = (modes) => modes.reduce((sum, { q, v, omega }) => sum + v * v + omega * omega * q * q, 0);

/** Rubber band: grows like `x` near zero and never past `max`. */
export const soften = (x, max) => max * Math.tanh(x / max);
