import { escapeHtml } from '../../core/dom.js';
import { heroIntro, paintHeroText } from '../../core/hero.js';
import { CHECK_ICON, iconStyles, strokeIcon } from '../../core/icons.js';
import { box, circleCheck, gitBranch, pause, play, rotateCcw, settings, squareTerminal } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { watchVisibility } from '../../core/visibility.js';
import '../button/index.js';
import styles from './work-flow-hero.scss?inline';

// A finished build waits this long before it plays again (ms).
const REPLAY_MS = 4000;
// A pulse takes this long to cross an edge (ms).
const PULSE_MS = 700;

// The demo build. Each step starts once the steps it waits on are done, and
// takes `ms`; `col` and `row` place it on the graph. `objects` counts what a
// compile produced; `size` is what the output step wrote.
const DEMO_STEPS = [
  { id: 'push', kind: 'Trigger', title: 'Push to main', icon: 'push', col: 0, row: 1, ms: 300, result: 'a1c9e3f · git', input: 'git push origin main', output: '3 files changed, 41 insertions' },
  { id: 'configure', kind: 'Configure', title: 'Configure build', icon: 'configure', col: 1, row: 1, ms: 1100, after: ['push'], result: 'cmake · 42 targets', input: 'cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release', output: '42 targets, release flags -O3 -flto' },
  { id: 'core', kind: 'Compile', title: 'Compile core', icon: 'compile', col: 2, row: 0, ms: 1300, after: ['configure'], result: '86 objects · 1.3s', input: 'clang -O3 -c src/core/*.c', output: '86 objects, 0 warnings', objects: 86 },
  { id: 'gui', kind: 'Compile', title: 'Compile GUI', icon: 'compile', col: 2, row: 1, ms: 1600, after: ['configure'], result: '68 objects · 1.6s', input: 'clang -O3 -c src/gui/*.c', output: '68 objects, 0 warnings', objects: 68 },
  { id: 'tests', kind: 'Test', title: 'Run unit tests', icon: 'test', col: 2, row: 2, ms: 900, after: ['configure'], result: '128 passed · 0.9s', input: 'ctest --test-dir build -j 8', output: '128 passed, 0 failed, ASan clean' },
  { id: 'link', kind: 'Output', title: 'Link binary', icon: 'link', col: 3, row: 1, ms: 800, after: ['core', 'gui', 'tests'], result: './build/lower · 1.4 MB', input: 'ld.lld build/**/*.o -o build/lower', output: 'Static ELF, stripped, 1.4 MB', size: '1.4 MB' },
];

const ICONS = { push: gitBranch, configure: settings, compile: squareTerminal, test: circleCheck, link: box };

const seconds = (ms) => `${(ms / 1000).toFixed(2)}s`;

/**
 * A work flow hero for a program built close to the metal: the live graph
 * of a build, from the push through configure, the compiles and tests that
 * run side by side, to the linked binary. Steps light up as they run and
 * tick their results, pulses travel the edges into whatever runs next, and
 * a trace lines the steps up in time. Open any step in the inspector to see
 * its exact command and what it produced. Pause holds the build; Replay
 * starts it over.
 *
 * Steps are `{ id, kind, title, icon, col, row, ms, after?, result, input, output, objects?, size? }`,
 * where `after` lists the steps one waits on and `icon` is `push`,
 * `configure`, `compile`, `test` or `link`.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} project - The program's name in the window's top bar
 * @attr {string} run - The build's label, e.g. "Build #4821"
 * @attr {Array<object>} steps (JSON)
 * @attr {string} step - The step open in the inspector
 * @attr {boolean} paused - Hold the run
 * @fires lw-select - A step was opened; `detail: { step }`
 * @fires lw-complete - The build finished; `detail: { ms }`
 * @slot eyebrow - A small line above the heading
 * @slot actions - Calls to action under the description; two by default
 */
export class LwWorkFlowHero extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    heading: { default: 'Builds that show their work.' },
    description: { default: 'Every stage of a native build, traced live: configure, compile, test and link. Open any step to see the exact command and what it produced, and nothing ships without the receipts.' },
    project: { default: 'lower' },
    run: { default: 'Build #4821' },
    steps: { type: Object, default: DEMO_STEPS },
    step: { default: 'gui' },
    paused: { type: Boolean, reflect: true },
  };

  // Each step's start and end in the run (ms), from its dependencies.
  #plan = new Map();
  #total = 0;
  #time = 0;
  #last = 0;
  #frame = 0;
  #visible = false;
  #replay = 0;

  render() {
    return `<div class="container">${heroIntro('Start building', 'Read the docs')}
<div class="stage"><div class="window">
<header class="bar"><span class="logo" aria-hidden="true"></span><nav class="crumbs" aria-label="Location"><span class="project"></span><span class="run"></span></nav>
<span class="status" role="status"><span class="dot"></span><span class="state"></span><span class="elapsed"></span></span>
<lw-button class="pause" variant="outline" size="sm"></lw-button><lw-button class="replay" variant="outline" size="sm"><span slot="start">${strokeIcon(rotateCcw, 14)}</span>Replay</lw-button></header>
<div class="canvas"><div class="graph"><svg class="edges" aria-hidden="true"></svg><div class="nodes"></div></div></div>
<div class="panels"><section class="inspector" aria-label="Step" aria-live="polite"></section><section class="trace" aria-label="Trace"><header class="trace-head"><span>Trace</span><span class="totals"></span></header><div class="lanes"></div></section></div>
</div></div></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const resize = new ResizeObserver(() => this.#drawEdges());
    resize.observe(this.query('.graph'));
    this.signal.addEventListener('abort', () => {
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
      this.#frame = 0;
      clearTimeout(this.#replay);
    });
    watchVisibility(this, (visible) => {
      this.#visible = visible;
      this.#start();
    }, this.signal);
    this.query('.nodes').addEventListener('click', (event) => {
      const node = event.target.closest('.node');
      if (node) this.#open(node.dataset.id);
    }, options);
    this.query('.pause').addEventListener('click', () => (this.paused = !this.paused), options);
    this.query('.replay').addEventListener('click', () => this.#restart(), options);
  }

  updated(changed) {
    paintHeroText(this);
    this.query('.logo').textContent = (this.project ?? '').charAt(0).toUpperCase();
    this.query('.project').textContent = this.project ?? '';
    this.query('.run').textContent = this.run ?? '';
    if (changed.has('steps')) this.#build();
    if (changed.has('paused')) {
      this.query('.pause').innerHTML = `<span slot="start">${strokeIcon(this.paused ? play : pause, 14)}</span>${this.paused ? 'Resume' : 'Pause'}`;
      this.#start();
    }
    this.#paint();
  }

  // Lays out the run: when each step starts and ends, and the graph's nodes.
  #build() {
    this.#plan.clear();
    for (const step of this.steps) {
      const start = Math.max(0, ...(step.after ?? []).map((id) => this.#plan.get(id)?.end ?? 0));
      this.#plan.set(step.id, { start, end: start + step.ms });
    }
    this.#total = Math.max(0, ...[...this.#plan.values()].map((span) => span.end));
    // Under reduced motion the run shows finished.
    this.#time = reducedMotion.matches ? this.#total : 0;
    const graph = this.query('.graph');
    graph.style.setProperty('--_cols', String(Math.max(...this.steps.map((step) => step.col)) + 1));
    graph.style.setProperty('--_rows', String(Math.max(...this.steps.map((step) => step.row)) + 1));
    this.query('.nodes').innerHTML = this.steps
      .map((step) => `<button class="node" type="button" data-id="${escapeHtml(step.id)}" style="grid-area: ${step.row + 1} / ${step.col + 1}"><span class="node-icon">${strokeIcon(ICONS[step.icon] ?? asterisk, 18)}</span><span class="node-kind">${escapeHtml(step.kind)}</span><span class="node-title">${escapeHtml(step.title)}</span><span class="node-meta"></span><span class="node-state" aria-hidden="true">${CHECK_ICON}</span></button>`)
      .join('');
    this.query('.lanes').innerHTML = this.steps
      .map((step) => {
        const { start } = this.#plan.get(step.id);
        return `<div class="lane"><span class="lane-name">${escapeHtml(step.title)}</span><span class="lane-track"><span class="lane-bar" style="left: ${(start / this.#total) * 100}%; width: ${(step.ms / this.#total) * 100}%"><span class="lane-fill"></span></span></span></div>`;
      })
      .join('');
    requestAnimationFrame(() => this.#drawEdges());
  }

  #stateOf(step) {
    const { start, end } = this.#plan.get(step.id);
    return this.#time >= end ? 'done' : this.#time >= start ? 'running' : 'queued';
  }

  // Edges run from the right of a step to the left of each that waits on it.
  #drawEdges() {
    const graph = this.query('.graph');
    const svg = this.query('.edges');
    const origin = graph.getBoundingClientRect();
    if (!origin.width) return;
    svg.setAttribute('viewBox', `0 0 ${origin.width} ${origin.height}`);
    const box = (id) => this.query(`.node[data-id="${id}"]`)?.getBoundingClientRect();
    svg.innerHTML = this.steps
      .flatMap((step) =>
        (step.after ?? []).map((from) => {
          const a = box(from);
          const b = box(step.id);
          if (!a || !b) return '';
          const x1 = a.right - origin.left;
          const y1 = a.top + a.height / 2 - origin.top;
          const x2 = b.left - origin.left;
          const y2 = b.top + b.height / 2 - origin.top;
          const mid = (x1 + x2) / 2;
          return `<path class="edge" data-to="${escapeHtml(step.id)}" d="M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}"/><circle class="pulse" data-to="${escapeHtml(step.id)}" r="3"/>`;
        }),
      )
      .join('');
    this.#paint();
  }

  #paint() {
    if (!this.#plan.size) return;
    const time = this.#time;
    const done = time >= this.#total;
    for (const step of this.steps) {
      const node = this.query(`.node[data-id="${step.id}"]`);
      if (!node) continue;
      const state = this.#stateOf(step);
      node.dataset.state = state;
      node.ariaPressed = String(step.id === this.step);
      node.querySelector('.node-meta').textContent = state === 'done' ? step.result : state === 'running' ? 'Running…' : 'Queued';
    }
    // A pulse loops along each edge into a running step.
    for (const pulse of this.shadowRoot.querySelectorAll('.pulse')) {
      const target = this.steps.find((step) => step.id === pulse.dataset.to);
      const path = pulse.previousElementSibling;
      const running = target && this.#stateOf(target) === 'running';
      pulse.toggleAttribute('data-on', running);
      path.toggleAttribute('data-on', running || (target && this.#stateOf(target) === 'done'));
      if (!running) continue;
      const point = path.getPointAtLength(((time % PULSE_MS) / PULSE_MS) * path.getTotalLength());
      pulse.setAttribute('cx', point.x.toFixed(1));
      pulse.setAttribute('cy', point.y.toFixed(1));
    }
    this.query('.state').textContent = done ? 'Done' : this.paused ? 'Paused' : 'Running';
    this.query('.status').dataset.state = done ? 'done' : this.paused ? 'paused' : 'running';
    this.query('.elapsed').textContent = seconds(Math.min(time, this.#total));
    // The trace fills each step's bar as it runs.
    this.shadowRoot.querySelectorAll('.lane-fill').forEach((fill, i) => {
      const { start } = this.#plan.get(this.steps[i].id);
      fill.style.scale = `${Math.min(1, Math.max(0, (time - start) / this.steps[i].ms))} 1`;
    });
    // What the build has produced so far: compiled objects, then the binary.
    const finished = this.steps.filter((step) => this.#stateOf(step) === 'done');
    const objects = finished.reduce((sum, step) => sum + (step.objects ?? 0), 0);
    const size = finished.find((step) => step.size)?.size;
    this.query('.totals').textContent = `Objects ${objects || '—'} · Binary ${size ?? '—'}`;
    this.#paintInspector();
  }

  #paintInspector() {
    const index = this.steps.findIndex((step) => step.id === this.step);
    const step = this.steps[index];
    const inspector = this.query('.inspector');
    if (!step) {
      inspector.innerHTML = '';
      return;
    }
    const state = this.#stateOf(step);
    const label = { done: 'Done', running: 'Running', queued: 'Queued' }[state];
    const key = `${step.id}:${state}`;
    // Rebuilt only when the step or its state changes, not every frame.
    if (inspector.dataset.key === key) return;
    inspector.dataset.key = key;
    inspector.innerHTML = `<header class="inspector-head"><span class="node-icon">${strokeIcon(ICONS[step.icon] ?? asterisk, 18)}</span><div><p class="inspector-title">${escapeHtml(step.title)}</p><p class="inspector-step">${escapeHtml(step.kind)} · step ${index + 1} of ${this.steps.length}</p></div><span class="pill" data-state="${state}">${label}</span></header>
<dl class="io"><div><dt>Input</dt><dd>${escapeHtml(step.input ?? '')}</dd></div><div><dt>Output</dt><dd>${state === 'done' ? escapeHtml(step.output ?? '') : '—'}</dd></div></dl>`;
  }

  #open(id) {
    if (id === this.step) return;
    this.step = id;
    this.emit('select', { step: this.steps.find((step) => step.id === id) });
  }

  // ---- The run ----

  #restart() {
    clearTimeout(this.#replay);
    this.#time = reducedMotion.matches ? this.#total : 0;
    this.paused = false;
    this.#paint();
    this.#start();
  }

  #start() {
    if (this.#frame || !this.#visible || this.paused || reducedMotion.matches || this.#time >= this.#total) return;
    this.#last = performance.now();
    this.#frame = requestAnimationFrame((now) => this.#tick(now));
  }

  #tick(now) {
    this.#frame = 0;
    if (!this.#visible || this.paused) return;
    this.#time = Math.min(this.#total, this.#time + Math.min(now - this.#last, 100));
    this.#last = now;
    this.#paint();
    if (this.#time < this.#total) {
      this.#frame = requestAnimationFrame((time) => this.#tick(time));
      return;
    }
    this.emit('complete', { ms: this.#total });
    // A finished run plays again after a pause, so the graph stays alive.
    this.#replay = setTimeout(() => this.#restart(), REPLAY_MS);
  }
}
