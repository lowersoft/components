/** Live media query; read `.matches` at the moment an animation would start. */
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

/** Short haptic pulse where supported. */
export const vibrate = (ms) => navigator.vibrate?.(ms);

/**
 * Frame loop for a fixed-step simulation, so physics behaves the same at any
 * frame rate. Each frame runs the steps owed since the last one: `step()`
 * returning true ends the frame's stepping early. `render(done)` then draws;
 * returning false stops the loop until the next `wake()`.
 */
export const fixedStepLoop = (stepSize, { step, render }) => {
  let frame = 0;
  let last = 0;
  let carry = 0;
  // Cleared by `stop()`, even one called from inside `render`.
  let running = false;

  const tick = (now) => {
    frame = 0;
    carry += last ? Math.min((now - last) / 1000, 0.05) : stepSize;
    last = now;
    let done = false;
    while (carry >= stepSize && !done) {
      carry -= stepSize;
      done = step() === true;
    }
    if (render(done) === false || !running) stop();
    else frame ||= requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
    frame = last = carry = 0;
  };

  return {
    wake: () => {
      running = true;
      frame ||= requestAnimationFrame(tick);
    },
    stop,
  };
};

/** Spring stiffness and damping from a feel: how long it looks and how much it bounces. */
export const springFeel = (visualDuration, bounce) => {
  const root = (2 * Math.PI) / (visualDuration * 1.2);
  return { stiffness: root * root, damping: 2 * Math.min(Math.max(1 - bounce, 0.05), 1) * root };
};

const SPRING_STEP = 1 / 240;

/**
 * Springs a number from `from` to `to`, calling `update(value)` every frame
 * and `done()` once it rests. Returns a function that stops it.
 */
export const springTo = (from, to, { stiffness, damping, velocity = 0, restDelta = 0.001, restSpeed = 0.01, update, done }) => {
  let value = from;
  let speed = velocity;
  const loop = fixedStepLoop(SPRING_STEP, {
    step: () => {
      speed += ((to - value) * stiffness - speed * damping) * SPRING_STEP;
      value += speed * SPRING_STEP;
    },
    render: () => {
      const rest = Math.abs(to - value) < restDelta && Math.abs(speed) < restSpeed;
      update(rest ? to : value);
      if (!rest) return true;
      done?.();
      return false;
    },
  });
  loop.wake();
  return loop.stop;
};
