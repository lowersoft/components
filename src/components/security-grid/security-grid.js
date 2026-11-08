import '../button/index.js';
import '../switch/index.js';
import { escapeHtml } from '../../core/dom.js';
import { CHECK_ICON, iconStyles, strokeIcon } from '../../core/icons.js';
import { arrowRight, lock, plus } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './security-grid.scss?inline';

const DEMO_FEATURES = [
  { art: 'vault', title: 'Region-locked vaults', description: 'Pin each tenant to an EU, US or APAC vault, with a deletion clock your legal team can enforce.' },
  { art: 'seats', title: 'Least-privilege seats', description: 'Every action is bound to a named role, and unused seats expire when the project ends.' },
  { art: 'letters', title: 'Yearly control letters', description: 'Independent examiners attest the controls each year, in a letter you can share and search.' },
  { art: 'masked', title: 'Masked fields, full trail', description: 'Names, emails and tokens are stripped from logs, with a record of who looked and when.' },
  { art: 'review', title: 'Release change reviews', description: 'Every promotion gets an owner, a test gate and a kill switch before it reaches production.' },
  { art: 'boundary', title: 'Customer data boundary', description: 'Regulated records stay in their own envelope under a signed agreement, encrypted in transit.' },
];

// A seal's scalloped rim: 22 bumps round a circle of radius 20 in a 48 box.
const SEAL = (() => {
  const point = (angle, radius) => `${(24 + radius * Math.cos(angle)).toFixed(2)} ${(24 + radius * Math.sin(angle)).toFixed(2)}`;
  const bumps = 22;
  let path = `M${point(0, 19)}`;
  for (let i = 0; i < bumps; i++) {
    const at = (i * 2 * Math.PI) / bumps;
    const next = ((i + 1) * 2 * Math.PI) / bumps;
    path += ` Q${point((at + next) / 2, 23)} ${point(next, 19)}`;
  }
  return `${path}Z`;
})();

const lines = (...widths) => widths.map((width) => `<i style="width: ${width}%"></i>`).join('');

// Small product drawings, one per kind of control. They are pictures: the
// controls in them are the library's own but take no input.
const ART = {
  vault: `<div class="mock vault"><span class="dial"><span class="spokes"><i></i><i></i><i></i></span><span class="hub"></span></span>
<span class="regions"><span class="region on">EU Central<em>30d</em></span><span class="region">US East</span><span class="region">APAC South</span><span class="caption">Purged after 30 days</span></span></div>`,
  seats: `<div class="mock window seats">${[['MO', 'Owner', 72], ['JS', 'Editor', 58], ['AK', 'Viewer', 64]].map(([who, role, width]) => `<span class="seat"><span class="initials">${who}</span><span class="lines">${lines(width, width - 30)}</span><span class="role">${role}</span></span>`).join('')}<span class="seat expiring"><span class="initials dashed"></span><span class="lines">${lines(50, 30)}</span><span class="role">Expires today</span></span></div>`,
  letters: `<div class="mock letters"><span class="sheet back"></span><span class="sheet front"><span class="lines">${lines(34)}</span><span class="lines faint">${lines(80, 92, 70, 86, 60)}</span><svg class="signature" viewBox="0 0 64 20" aria-hidden="true"><path d="M2 14c4-8 7-9 8-4s-1 7 2 3 5-9 7-5-1 8 3 5 4-7 7-4 2 6 5 3 4-6 7-3 3 4 6 2"/></svg></span>
<svg class="seal" viewBox="0 0 48 48" aria-hidden="true"><path d="${SEAL}"/><circle cx="24" cy="24" r="14"/><path class="seal-check" d="m18 24 4 4 8-8"/></svg></div>`,
  masked: `<div class="mock masked"><span class="window fields">${[['name', 62], ['email', 86], ['token', 48]].map(([label, width]) => `<span class="field"><span class="field-label">${label}</span><span class="bar" style="width: ${width}%"></span></span>`).join('')}</span>
<span class="trail"><span class="track"></span>${[['09:14', 'viewed'], ['11:02', 'export'], ['16:40', 'viewed']].map(([time, what]) => `<span class="stop"><i></i>${time} ${what}</span>`).join('')}</span></div>`,
  review: `<div class="mock window review"><span class="step"><span class="tick">${CHECK_ICON}</span>Owner assigned<span class="chip">MO</span></span><span class="step"><span class="tick">${CHECK_ICON}</span>Test gate<span class="meter"><i></i></span></span><span class="step">Kill switch<lw-switch class="kill" size="sm" checked></lw-switch></span><lw-button class="promote" size="sm">Promote to production</lw-button></div>`,
  boundary: `<div class="mock boundary"><svg class="fence" aria-hidden="true"><rect x="1" y="1" rx="18" ry="18"/></svg><span class="lock">${strokeIcon(lock, 14)}</span>
<span class="window record"><span class="record-head"><span class="plus">${strokeIcon(plus, 14)}</span><span class="lines">${lines(70, 40)}</span></span><span class="lines faint">${lines(100, 90, 60)}</span></span><span class="caption">BAA signed · TLS in transit</span></div>`,
};

/**
 * Security controls in a grid of six, each with a small drawing of the
 * product that proves it: a vault pinned to a region with its deletion
 * clock, seats bound to roles, a signed and sealed control letter, masked
 * fields with their audit trail, a release gated by owner, tests and a kill
 * switch, and a record inside its data boundary. Over the grid sit the
 * headline and two actions. Pointing at a card brings its drawing to life:
 * the vault wheel turns, a seat expires, the seal stamps, the masks sweep,
 * the gate fills and the boundary's dashes march. Nothing moves with reduced
 * motion.
 *
 * Three columns on wide screens, two on tablets and one on phones.
 *
 * Features are `{ title, description, art }`, `art` one of vault, seats,
 * letters, masked, review or boundary; another value, or none, draws a lock.
 *
 * @attr {string} heading
 * @attr {string} description - A line under the heading; none when empty
 * @attr {string} primary - The main action's label
 * @attr {string} secondary - The second action's label; none when empty
 * @attr {Array<object>} features (JSON)
 * @slot actions - Your own actions, such as links, instead of the two buttons
 * @fires lw-action - One of the two buttons was pressed; `detail: { action }`, "primary" or "secondary"
 * @csspart card - Each feature
 * @csspart art - Each drawing
 */
export class LwSecurityGrid extends LwElement {
  static styles = [iconStyles, styles];
  static props = {
    heading: { default: 'Controls an auditor can read in the product' },
    description: { default: '' },
    primary: { default: 'Talk to security' },
    secondary: { default: 'See the controls' },
    features: { type: Object, default: DEMO_FEATURES },
  };

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><div class="lead"><h2 class="title" id="heading"></h2><p class="description"></p></div>
<div class="actions"><slot name="actions"><lw-button class="primary" data-action="primary"><span class="primary-label"></span><span slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button><lw-button class="secondary" data-action="secondary" variant="outline"></lw-button></slot></div></header>
<ul class="grid"></ul></section>`;
  }

  connected() {
    this.query('.actions').addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (button) this.emit('action', { action: button.dataset.action });
    }, { signal: this.signal });
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.description').hidden = !this.description;
    this.query('.primary-label').textContent = this.primary ?? '';
    this.query('.primary').hidden = !this.primary;
    this.query('.secondary').textContent = this.secondary ?? '';
    this.query('.secondary').hidden = !this.secondary;
    if (changed.has('features')) this.#build();
  }

  #build() {
    const features = Array.isArray(this.features) ? this.features : [];
    this.query('.grid').innerHTML = features
      .map((feature) => `<li class="card" part="card"><div class="art" part="art" aria-hidden="true" inert>${ART[feature.art] ?? `<div class="mock plain">${strokeIcon(lock, 28, 1.5)}</div>`}</div><h3 class="name">${escapeHtml(feature.title ?? '')}</h3><p class="text">${escapeHtml(feature.description ?? '')}</p></li>`)
      .join('');
  }
}
