import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { externalLink, gitBranch, gitCommit } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import '../button/index.js';
import styles from './deployment-card.scss?inline';

// The build's steps, with how long each takes and the log lines it prints.
const STEPS = [
  { id: 'queued', label: 'Queued', ms: 900, log: ['Waiting for a build machine…', 'Build machine ready: 16 cores, x86_64 and aarch64'] },
  { id: 'building', label: 'Building', ms: 5200, log: ['Cloning github.com/lowersoft/runtime (main)', 'Restored the object cache from the last build', 'Configuring with cmake · 42 targets', 'Compiling 154 objects with clang -O3', 'Linking ./build/lower (1.4 MB)'] },
  { id: 'checks', label: 'Checks', ms: 2400, log: ['Running 128 unit tests under AddressSanitizer', 'All 128 tests passed, sanitizers clean'] },
  { id: 'deploying', label: 'Publishing', ms: 1800, log: ['Signing the release binary', 'Publishing to the nightly channel'] },
  { id: 'ready', label: 'Ready', ms: 0, log: [] },
];
const STATUS = { ready: 'Ready', building: 'Building', error: 'Error' };
// Each new build gives the preview a new accent, so it reads as refreshed.
const ACCENTS = ['#6366f1', '#0ea5e9', '#f97316', '#10b981', '#e11d48'];

const seconds = (ms) => `${(ms / 1000).toFixed(1)}s`;

/**
 * A deployment, with a preview of the site, its domain, branch, commit and
 * status. Rebuild runs a build along a step rail, with a timer ticking and
 * the latest log line swapping in place, until the deployment is ready and
 * the preview refreshes.
 *
 * @attr {string} project
 * @attr {string} domain
 * @attr {string} branch
 * @attr {string} commit - Short hash
 * @attr {string} message - The commit message
 * @attr {string} when - When it was deployed, e.g. "2m ago"
 * @attr {'ready'|'building'|'error'} status
 * @fires lw-redeploy - A build started
 * @fires lw-ready - The build finished; `detail: { ms }`
 */
export class LwDeploymentCard extends LwElement {
  static styles = styles;
  static props = {
    project: { default: 'lowersoft-runtime' },
    domain: { default: 'nightly.lowersoft.dev' },
    branch: { default: 'main' },
    commit: { default: 'a1c9e3f' },
    message: { default: 'Cut cold start below 10 ms' },
    when: { default: '2m ago by Maya' },
    status: { default: 'ready', reflect: true },
  };

  #step = -1;
  #start = 0;
  #frame = 0;
  #timers = [];
  #accent = 0;

  render() {
    const rail = STEPS.map(({ id, label }) => `<li data-step="${id}"><span class="node"></span><span class="step-label">${label}</span></li>`).join('');
    return `<div class="preview" aria-hidden="true"><div class="chrome"><span></span><span></span><span></span><i class="address"></i></div><div class="site"><b class="nav"></b><b class="hero"></b><b class="line"></b><b class="line short"></b><span class="cta"></span><div class="tiles"><b></b><b></b><b></b></div></div><div class="shimmer"></div></div>
<div class="head"><div class="names"><p class="project"></p><a class="domain" target="_blank" rel="noopener noreferrer"></a></div><span class="status"></span></div>
<p class="commit"><span class="branch">${strokeIcon(gitBranch, 14)}<span></span></span><span class="hash">${strokeIcon(gitCommit, 14)}<span></span></span></p>
<p class="message"></p>
<div class="build"><div class="build-inner"><ol class="rail">${rail}</ol><div class="log"><span class="timer"></span><span class="line-box"><span class="log-line" aria-live="polite"></span></span></div></div></div>
<div class="foot"><span class="when"></span><lw-button class="redeploy" variant="secondary" size="sm">Rebuild</lw-button></div>`;
  }

  connected() {
    this.query('.redeploy').addEventListener('click', () => this.redeploy(), { signal: this.signal });
    this.signal.addEventListener('abort', () => this.#stop());
  }

  updated() {
    this.query('.project').textContent = this.project ?? '';
    const domain = this.query('.domain');
    domain.innerHTML = `${escapeHtml(this.domain ?? '')}${strokeIcon(externalLink, 12)}`;
    domain.href = `https://${this.domain}`;
    this.query('.address').textContent = this.domain ?? '';
    this.query('.branch span').textContent = this.branch ?? '';
    this.query('.hash span').textContent = this.commit ?? '';
    this.query('.message').textContent = this.message ?? '';
    if (this.#step < 0) this.query('.when').textContent = this.when ?? '';
    const status = this.query('.status');
    status.textContent = STATUS[this.status] ?? this.status;
    status.dataset.status = this.status;
    this.query('.redeploy').disabled = this.status === 'building';
  }

  /** Runs a build: through each step of the rail, then ready. */
  redeploy() {
    if (this.status === 'building') return;
    this.#stop();
    this.status = 'building';
    this.toggleAttribute('data-building', true);
    this.toggleAttribute('data-built', true);
    this.#start = performance.now();
    this.emit('redeploy');
    const speed = reducedMotion.matches ? 0.25 : 1;
    let at = 0;
    STEPS.forEach((step, index) => {
      this.#later(() => this.#enter(index), at);
      // The log lines are spread across the step.
      step.log.forEach((line, i) => this.#later(() => this.#log(line), at + (step.ms * speed * i) / step.log.length));
      at += step.ms * speed;
    });
    this.#tick();
  }

  #later(fn, ms) {
    this.#timers.push(setTimeout(fn, ms));
  }

  #stop() {
    for (const timer of this.#timers.splice(0)) clearTimeout(timer);
    cancelAnimationFrame(this.#frame);
    this.#frame = 0;
  }

  // The timer ticks while the build runs.
  #tick() {
    this.query('.timer').textContent = seconds(performance.now() - this.#start);
    this.#frame = requestAnimationFrame(() => this.#tick());
  }

  #enter(index) {
    this.#step = index;
    this.query('.rail').querySelectorAll('li').forEach((li, i) => (li.dataset.state = i < index ? 'done' : i === index ? 'active' : 'pending'));
    if (STEPS[index].id === 'ready') this.#finish();
  }

  // The latest log line swaps in place: the old one lifts out, the new one
  // rises in.
  #log(text) {
    const box = this.query('.line-box');
    const old = box.querySelector('.log-line');
    const line = document.createElement('span');
    line.className = 'log-line';
    line.ariaLive = 'polite';
    line.textContent = text;
    box.append(line);
    // Only the line leaving and the one arriving stay, even if an exit
    // animation never gets to finish (a hidden tab).
    while (box.children.length > 2) box.firstElementChild.remove();
    if (reducedMotion.matches || !old?.textContent) {
      old?.remove();
      return;
    }
    old.removeAttribute('aria-live');
    old.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 180, easing: 'ease-in', fill: 'forwards' }).finished.then(() => old.remove(), () => old.remove());
    line.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  }

  #finish() {
    this.#stop();
    const ms = performance.now() - this.#start;
    this.query('.timer').textContent = seconds(ms);
    this.#log(`Published in ${seconds(ms)}`);
    this.status = 'ready';
    this.removeAttribute('data-building');
    this.query('.when').textContent = 'Just now';
    // The preview refreshes with the new build.
    this.#accent = (this.#accent + 1) % ACCENTS.length;
    this.style.setProperty('--_site', ACCENTS[this.#accent]);
    if (!reducedMotion.matches) this.query('.site').animate([{ opacity: 0.2, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0px)' }], { duration: 420, easing: 'ease-out' });
    this.emit('ready', { ms });
  }
}
