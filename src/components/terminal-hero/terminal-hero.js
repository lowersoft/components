import { escapeHtml } from '../../core/dom.js';
import { heroIntro, paintHeroText } from '../../core/hero.js';
import { CHECK_ICON, iconStyles, strokeIcon } from '../../core/icons.js';
import { rotateCcw, squareTerminal } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { watchVisibility } from '../../core/visibility.js';
import '../button/index.js';
import '../copy-button/index.js';
import styles from './terminal-hero.scss?inline';

const TYPE_MS = 45;
const LINE_MS = 260;
// A finished build waits this long before it plays again (ms).
const REPLAY_MS = 6000;

// The build's steps: each spins for `ms`, then ticks with its detail.
const DEMO_STEPS = [
  { label: 'Configuring', ms: 600, detail: 'cmake · 42 targets' },
  { label: 'Compiling', ms: 3200, detail: '154 objects' },
  { label: 'Linking', ms: 900, detail: '1.4 MB' },
  { label: 'Running tests', ms: 1600, detail: '128 passed' },
];

const DEMO_CHECKS = ['Release build · -O3', 'Tests · 128 passed', 'AddressSanitizer · clean', 'Static binary · 1.4 MB'];

const seconds = (ms) => `${(ms / 1000).toFixed(1)}s`;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Heights of the preview's CPU history, as shares of its chart.
const HISTORY = [0.32, 0.45, 0.38, 0.6, 0.52, 0.7, 0.44, 0.36, 0.58, 0.81, 0.62, 0.48, 0.55, 0.4];

/**
 * A developer hero for a program written close to the metal: a big
 * terminal that streams its build. The command types itself, each stage
 * spins and ticks, and once the binary is linked a preview of the
 * program's own window and its build checks slide over the terminal's
 * edge. Copy the command from the top bar; Replay builds it again.
 *
 * Steps are `{ label, ms, detail }`.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {string} project - The repository, shown in the prompt and the path
 * @attr {string} command - The command typed and offered to copy
 * @attr {string} binary - The built program's path
 * @attr {string} toolchain - The compiler and target line
 * @attr {Array<object>} steps (JSON)
 * @attr {Array<string>} checks - The passing checks (JSON)
 * @fires lw-complete - The build finished; `detail: { ms }`
 * @slot eyebrow - A small line above the heading
 * @slot actions - Calls to action under the description; two by default
 */
export class LwTerminalHero extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    heading: { default: 'Build it with one command.' },
    description: { default: 'Run it from your terminal or push to main. lower configures, compiles, tests and links one native binary in seconds, with no runtime to install and nothing between your code and the machine.' },
    project: { default: 'lower-web' },
    command: { default: 'make release' },
    binary: { default: './build/lower' },
    toolchain: { default: 'clang 18.1 · x86_64-linux · release (-O3)' },
    steps: { type: Object, default: DEMO_STEPS },
    checks: { type: Object, default: DEMO_CHECKS },
  };

  // Each play has an id; a newer one makes an older one stop.
  #play = 0;
  #visible = false;
  #started = false;
  #replay = 0;

  render() {
    const history = HISTORY.map((share) => `<i style="height: ${share * 100}%"></i>`).join('');
    return `<div class="container">${heroIntro('Start building', 'Read the build docs')}
<div class="stage"><div class="window">
<header class="bar"><span class="tab">${strokeIcon(squareTerminal, 16)}<span class="path"></span><span class="shell">zsh</span></span>
<lw-copy-button class="copy" label="Copy the command"></lw-copy-button><lw-button class="replay" variant="outline" size="sm"><span slot="start">${strokeIcon(rotateCcw, 14)}</span>Replay</lw-button></header>
<div class="screen" role="log" aria-live="polite" aria-label="Build output"></div></div>
<aside class="layers" aria-label="Result"><div class="preview" role="img" aria-label="The running program's window">
<div class="preview-bar"><span class="lights" aria-hidden="true"><i></i><i></i><i></i></span><span class="preview-title"></span><span class="ready">Running</span></div>
<div class="gui" aria-hidden="true"><nav class="gui-side"><span data-on>CPU</span><span>Memory</span><span>Disk</span><span>Network</span></nav>
<div class="gui-main"><div class="gui-tiles"><span><b>23%</b>CPU</span><span><b>4.1 GB</b>Memory</span></div><div class="gui-chart">${history}</div>
<ul class="gui-list"><li><span>compositor</span><span>8.2%</span></li><li><span>lower</span><span>1.1%</span></li><li><span>audio</span><span>0.6%</span></li></ul></div></div></div>
<ul class="checks"></ul></aside></div></div>`;
  }

  connected() {
    this.signal.addEventListener('abort', () => {
      this.#play++;
      clearTimeout(this.#replay);
    });
    watchVisibility(this, (visible) => {
      this.#visible = visible;
      if (visible && !this.#started) {
        this.#started = true;
        this.#run();
      }
    }, this.signal);
    this.query('.replay').addEventListener('click', () => this.#run(), { signal: this.signal });
  }

  updated() {
    paintHeroText(this);
    this.query('.path').textContent = `~/code/${this.project}`;
    this.query('.copy').value = this.command ?? '';
    this.query('.preview-title').textContent = (this.binary ?? '').split('/').pop();
    this.query('.checks').innerHTML = (this.checks ?? []).map((check) => `<li><span class="tick">${CHECK_ICON}</span>${escapeHtml(check)}</li>`).join('');
  }

  #line(html, className = '') {
    const line = document.createElement('p');
    line.className = `line ${className}`.trim();
    line.innerHTML = html;
    this.query('.screen').append(line);
    return line;
  }

  // Plays the build from the top; under reduced motion it shows finished.
  async #run() {
    const play = ++this.#play;
    const live = () => play === this.#play;
    const still = reducedMotion.matches;
    const pause = async (ms) => {
      if (!still) await wait(ms);
      return live();
    };
    clearTimeout(this.#replay);
    this.query('.screen').innerHTML = '';
    this.toggleAttribute('data-live', false);
    const prompt = this.#line(`<span class="ink">${escapeHtml(this.project ?? '')}</span> <span class="dim">git:(main)</span> <span class="caret">›</span> <span class="typed"></span><span class="cursor"></span>`);
    const typed = prompt.querySelector('.typed');
    const command = this.command ?? '';
    for (let i = 1; i <= command.length; i++) {
      if (!(await pause(TYPE_MS))) return;
      typed.textContent = command.slice(0, i);
    }
    typed.textContent = command;
    prompt.querySelector('.cursor').remove();
    if (!(await pause(LINE_MS))) return;
    this.#line(escapeHtml(this.toolchain ?? ''), 'dim');
    if (!(await pause(LINE_MS))) return;
    this.#line(`<span class="dim">›</span> Target <span class="ink">${escapeHtml(this.binary ?? '')}</span>`);
    this.#line('', 'gap');
    let total = 0;
    for (const step of this.steps) {
      const line = this.#line(`<span class="mark" data-state="running">${CHECK_ICON}</span><span class="ink">${escapeHtml(step.label)}…</span><span class="when"></span>`);
      if (!(await pause(step.ms))) return;
      total += step.ms;
      line.querySelector('.mark').dataset.state = 'done';
      line.querySelector('.ink').textContent = step.label;
      line.querySelector('.when').textContent = `${step.detail ?? ''} · ${seconds(step.ms)}`;
    }
    this.#line('', 'gap');
    this.#line(`<span class="ok">✓</span> <span class="ink">Built in ${seconds(total)}</span>`);
    this.#line(`<span class="dim">Run</span>  <span class="link">${escapeHtml(this.binary ?? '')}</span>`);
    // Once built, the program's window and the checks slide over the terminal's edge.
    this.toggleAttribute('data-live', true);
    this.emit('complete', { ms: total });
    if (!still) this.#replay = setTimeout(() => this.#visible && this.#run(), REPLAY_MS);
  }
}
