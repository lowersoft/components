import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { fileSearch, frame, penTool, send } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { paintHead, stepsStyles } from '../../core/steps.js';
import styles from './zigzag-steps.scss?inline';

// The icons a step can name.
const ICONS = { research: fileSearch, design: penTool, prototype: frame, delivery: send };

const DEMO_STEPS = [
  { id: 'discovery', duration: '2 weeks', title: 'Discovery', description: 'Sat in on support calls and mapped every place a shopper gave up.', icon: 'research', tone: 'accent' },
  { id: 'interface', duration: '6 weeks', title: 'Interface', description: 'Took the checkout from five screens to two, with saved cards up front.', icon: 'design', tone: 'ink' },
  { id: 'testing', duration: '3 weeks', title: 'Testing', description: 'Ran the new flow with real orders behind a switch for one store in ten.', icon: 'prototype', tone: 'ink' },
  { id: 'rollout', duration: '2 weeks', title: 'Rollout', description: 'Moved every store across in stages, watching conversion day by day.', icon: 'delivery', tone: 'accent' },
];

/**
 * A project told in phases: step cards alternate left and right down the
 * page, joined by dashed elbows, each with its duration printed down a tab
 * at its side, an icon and a number. The project's dates sit in the corner.
 * Phones stack the cards in one column, joined by a dashed thread. Static:
 * no script beyond printing the steps.
 *
 * Steps are `{ id, duration, title, description, icon, tone }`: `icon` one
 * of research, design, prototype or delivery, `tone` `accent` or `ink` for
 * the tab.
 *
 * @attr {string} eyebrow - The tag over the heading
 * @attr {string} heading
 * @attr {string} lede
 * @attr {string} start - When the project began
 * @attr {string} end - When it ended
 * @attr {Array<object>} steps (JSON)
 * @csspart step - Each step's card
 */
export class LwZigzagSteps extends LwElement {
  static styles = [stepsStyles, styles];
  static props = {
    eyebrow: { default: 'Project details' },
    heading: { default: 'Rebuilding checkout in four phases' },
    lede: { default: 'From the first support call to the last store moved across, the project ran just over three months.' },
    start: { default: 'Feb 2026' },
    end: { default: 'May 2026' },
    steps: { type: Object, default: DEMO_STEPS },
  };

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><div class="intro"><p class="eyebrow"></p><h2 class="heading" id="heading"></h2><p class="lede"></p></div>
<p class="dates"><span class="visually-hidden">From </span><span class="start"></span><span class="dash" aria-hidden="true"></span><span class="visually-hidden"> to </span><span class="end"></span></p></header><ol class="steps"></ol></section>`;
  }

  updated(changed) {
    paintHead(this);
    const eyebrow = this.query('.eyebrow');
    eyebrow.textContent = this.eyebrow ?? '';
    eyebrow.hidden = !this.eyebrow;
    this.query('.start').textContent = this.start ?? '';
    this.query('.end').textContent = this.end ?? '';
    this.query('.dates').hidden = !this.start && !this.end;
    if (changed.has('steps')) this.#build();
  }

  #build() {
    const steps = Array.isArray(this.steps) ? this.steps : [];
    this.query('.steps').innerHTML = steps
      .map((step, i) => {
        const id = escapeHtml(step.id ?? String(i));
        return `<li class="step" data-tone="${step.tone === 'ink' ? 'ink' : 'accent'}"><article class="card" part="step" aria-labelledby="step-${id}">
<p class="tab">${escapeHtml(step.duration ?? '')}</p><div class="body"><div class="top"><span class="icon">${strokeIcon(ICONS[step.icon] ?? ICONS.research, 18)}</span><span class="number" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span></div>
<h3 class="title" id="step-${id}">${escapeHtml(step.title ?? '')}</h3><p class="description">${escapeHtml(step.description ?? '')}</p></div></article></li>`;
      })
      .join('');
  }
}
