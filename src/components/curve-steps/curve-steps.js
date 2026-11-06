import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { lock } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { paintHead, stepsStyles } from '../../core/steps.js';
import styles from './curve-steps.scss?inline';

const DEMO_STEPS = [
  { id: 'vault', title: 'Create your vault', description: 'Pick a passphrase only you know. We never see it.', illustration: 'account' },
  { id: 'folders', title: 'Choose your folders', description: 'Select what to keep safe, and it syncs from then on.', illustration: 'laptop' },
  { id: 'anywhere', title: 'Open it anywhere', description: 'Restore any version from your phone or a new machine.', illustration: 'ready' },
];

// One S through the three pictures, in a 300 by 100 box: down between the
// first two, up between the last two.
const CURVE = 'M50 42C88 104 112 104 150 54S212 -6 250 46';

const PLACEHOLDER = '<span class="bar"></span><span class="bar short"></span><span class="bar shorter"></span>';

// The three pictures, drawn in the theme's colours and the accent.
const ART = {
  account: `<div class="account"><div class="sheet back">${PLACEHOLDER}</div><div class="sheet front"><svg class="cloud" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg><span class="padlock">${strokeIcon(lock, 14, 2.25)}</span></div></div>`,
  laptop: `<svg class="laptop" viewBox="0 0 160 112" aria-hidden="true"><rect class="lid" x="22" y="8" width="116" height="78" rx="7"/><rect class="screen" x="30" y="16" width="100" height="62" rx="3"/><path class="base" d="M8 92h144l-6 10a6 6 0 0 1-5 3H19a6 6 0 0 1-5-3z"/><path class="notch" d="M68 92h24l-2 4H70z"/><circle class="disc" cx="80" cy="47" r="17"/><path class="draw arrow" pathLength="1" d="M80 56V38M72 45l8-8 8 8"/></svg>`,
  ready: `<div class="phone"><span class="badge"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="draw tick" pathLength="1" d="M6 12.5l4 4 8-9"/></svg></span>${PLACEHOLDER}<span class="pill"></span></div>`,
};

/**
 * Setup in three moves, each with a small picture: an account card with a
 * locked cloud, a laptop sending a file up, a phone with a check. One dashed
 * curve runs behind the pictures, and the first time the section comes
 * into view it draws itself along with the laptop's arrow and the phone's
 * check. Reduced motion shows them drawn. Phones stack the steps.
 *
 * Steps are `{ id, title, description, illustration }`, `illustration` one
 * of `account`, `laptop` or `ready`; past the third they are left out.
 *
 * @attr {string} heading
 * @attr {string} lede
 * @attr {Array<object>} steps (JSON)
 * @csspart step - Each step
 * @cssprop --lw-curve-steps-accent - The cards, badges and buttons in the pictures; the primary colour by default
 * @cssprop --lw-curve-steps-on-accent - What is drawn on the accent
 */
export class LwCurveSteps extends LwElement {
  static styles = [stepsStyles, styles];
  static props = {
    heading: { default: 'Up and running in three steps' },
    lede: { default: 'Install once, and every project folder is protected from then on.' },
    steps: { type: Object, default: DEMO_STEPS },
  };

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><h2 class="heading" id="heading"></h2><p class="lede"></p></header>
<div class="row"><svg class="curve" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true"><defs><mask id="reveal" maskUnits="userSpaceOnUse" x="0" y="-20" width="300" height="140"><path class="reveal" pathLength="1" d="${CURVE}"/></mask></defs><path class="dashes" d="${CURVE}" mask="url(#reveal)"/></svg><ol class="steps"></ol></div></section>`;
  }

  connected() {
    const row = this.query('.row');
    // Drawn once, the first time most of it is in view; at once without motion.
    if (reducedMotion.matches) {
      row.setAttribute('data-drawn', '');
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      row.setAttribute('data-drawn', '');
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(row);
    this.signal.addEventListener('abort', () => observer.disconnect());
  }

  updated(changed) {
    paintHead(this);
    if (changed.has('steps')) this.#build();
  }

  #build() {
    const steps = (Array.isArray(this.steps) ? this.steps : []).slice(0, 3);
    this.query('.steps').innerHTML = steps
      .map((step, i) => {
        return `<li class="step" part="step"><div class="art">${ART[step.illustration] ?? ART.account}</div>
<span class="number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3 class="title">${escapeHtml(step.title ?? '')}</h3><p class="description">${escapeHtml(step.description ?? '')}</p></li>`;
      })
      .join('');
  }
}
