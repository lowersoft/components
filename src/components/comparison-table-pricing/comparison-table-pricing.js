import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { check } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import '../button/index.js';
import '../switch/index.js';
import styles from './comparison-table-pricing.scss?inline';

const DEMO_PLANS = [
  { id: 'hobby', name: 'Hobby', price: '$0', per: 'free forever', blurb: 'For side projects and trying things out.', action: 'Start for free' },
  { id: 'pro', name: 'Pro', price: '$20', per: 'per month', blurb: 'For individuals shipping real work.', action: 'Upgrade to Pro', featured: true },
  { id: 'team', name: 'Team', price: '$48', per: 'per user / month', blurb: 'For teams that build together.', action: 'Start trial' },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', per: 'billed annually', blurb: 'For organizations with advanced needs.', action: 'Contact sales' },
];

const DEMO_SECTIONS = [
  { title: 'Usage', rows: [
    { label: 'Projects', values: ['3', 'Unlimited', 'Unlimited', 'Unlimited'] },
    { label: 'Storage', values: ['1 GB', '10 GB', '100 GB', 'Custom'] },
    { label: 'Bandwidth', hint: 'Data served to your visitors each month. Going over never cuts you off; we write first.', values: ['10 GB', '100 GB', '1 TB', 'Custom'] },
    { label: 'API requests', hint: 'Calls to the public API each month, across every key in the workspace.', values: ['10k', '1M', '10M', 'Unlimited'] },
    { label: 'Custom domains', values: [false, true, true, true] },
  ] },
  { title: 'Collaboration', rows: [
    { label: 'Team members', values: ['1', '1', 'Up to 25', 'Unlimited'] },
    { label: 'Comments and mentions', values: [true, true, true, true] },
    { label: 'Roles and permissions', hint: 'Owner, admin, editor and viewer, set per project.', values: [false, false, true, true] },
    { label: 'Shared workspaces', values: [false, false, '3', 'Unlimited'] },
  ] },
  { title: 'Security', rows: [
    { label: 'Two-factor authentication', values: [true, true, true, true] },
    { label: 'SAML SSO', hint: 'Sign in through your identity provider, such as Okta or Entra ID.', values: [false, false, false, true] },
    { label: 'Audit log', values: [false, false, true, true] },
  ] },
];

// A row is a difference unless every plan has the same value.
const differs = (row) => row.values.some((value) => value !== row.values[0]);

/**
 * Every plan side by side, feature by feature, in sections. The featured
 * plan's column is framed; hovering a column lights it from top to bottom.
 * "Show differences only" hides the rows every plan shares. Terms with a
 * dotted underline explain themselves on hover or focus. On narrow screens
 * the table scrolls sideways with the features pinned.
 *
 * Plans are `{ id, name, price, per, blurb, action, featured? }`; sections
 * are `{ title, rows: [{ label, hint?, values }] }`, a value being text,
 * `true` for included or `false` for not.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {boolean} differences - Show only the rows that differ
 * @attr {Array<object>} plans (JSON)
 * @attr {Array<object>} sections (JSON)
 * @fires lw-choose - A plan's action was chosen; `detail: { plan }`
 */
export class LwComparisonTablePricing extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Compare plans' },
    description: { default: 'Everything included in each plan, side by side.' },
    differences: { type: Boolean, reflect: true },
    plans: { type: Object, default: DEMO_PLANS },
    sections: { type: Object, default: DEMO_SECTIONS },
  };

  render() {
    return `<header class="head"><div><h2 class="title"></h2><p class="description"></p></div><lw-switch class="only" size="sm">Show differences only</lw-switch></header>
<div class="scroller"><table class="table"><thead></thead></table></div><p class="shared" aria-live="polite"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const only = this.query('.only');
    only.addEventListener('change', () => {
      this.differences = only.checked;
    }, options);
    const table = this.query('.table');
    table.addEventListener('click', (event) => {
      const action = event.target.closest('.action');
      if (action) this.emit('choose', { plan: action.dataset.id });
    }, options);
    // The column under the pointer lights from top to bottom.
    table.addEventListener('pointerover', (event) => this.#light(event.target.closest('[data-col]')?.dataset.col), options);
    table.addEventListener('pointerleave', () => this.#light(), options);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.only').checked = this.differences;
    if (changed.has('plans') || changed.has('sections')) this.#build();
    this.#paintDifferences();
  }

  #build() {
    const plans = this.plans ?? [];
    const cell = (i, inner, tag = 'td', extra = '') => `<${tag} data-col="${i}"${plans[i]?.featured ? ' data-featured' : ''}${extra}>${inner}</${tag}>`;
    const head = plans
      .map((plan, i) => cell(i, `<div class="plan"><span class="plan-name">${escapeHtml(plan.name)}</span><span class="price">${escapeHtml(plan.price)}</span><span class="per">${escapeHtml(plan.per)}</span><span class="blurb">${escapeHtml(plan.blurb)}</span><lw-button class="action" data-id="${escapeHtml(plan.id)}" variant="${plan.featured ? 'primary' : 'outline'}">${escapeHtml(plan.action)}</lw-button></div>`, 'th', ' scope="col"'))
      .join('');
    const value = (v, i) => {
      if (v === true) return cell(i, `${strokeIcon(check, 16)}<span class="visually-hidden">Included</span>`, 'td', ' class="yes"');
      if (v === false || v == null || v === '') return cell(i, '<span class="no" aria-hidden="true"></span><span class="visually-hidden">Not included</span>');
      return cell(i, escapeHtml(v));
    };
    let hint = 0;
    const bodies = (this.sections ?? [])
      .map((section) => `<tbody class="section"><tr class="section-row"><th colspan="${plans.length + 1}" scope="colgroup">${escapeHtml(section.title)}</th></tr>${section.rows
        .map((row) => {
          const label = row.hint
            ? `<span class="term" tabindex="0" aria-describedby="hint-${hint}">${escapeHtml(row.label)}</span><span class="tooltip" role="tooltip" id="hint-${hint++}">${escapeHtml(row.hint)}</span>`
            : escapeHtml(row.label);
          return `<tr class="row"${differs(row) ? '' : ' data-same'}><th scope="row" class="feature">${label}</th>${row.values.map(value).join('')}</tr>`;
        })
        .join('')}</tbody>`)
      .join('');
    const table = this.query('.table');
    table.querySelectorAll('tbody').forEach((body) => body.remove());
    table.querySelector('thead').innerHTML = `<tr><td class="corner"></td>${head}</tr>`;
    table.insertAdjacentHTML('beforeend', bodies);
  }

  // Hides the rows every plan shares, and any section left empty.
  #paintDifferences() {
    let hidden = 0;
    for (const row of this.shadowRoot.querySelectorAll('.row')) {
      row.hidden = this.differences && row.hasAttribute('data-same');
      if (row.hidden) hidden++;
    }
    for (const section of this.shadowRoot.querySelectorAll('.section')) section.hidden = !section.querySelector('.row:not([hidden])');
    this.query('.shared').textContent = hidden ? `${hidden} ${hidden === 1 ? 'feature' : 'features'} every plan shares ${hidden === 1 ? 'is' : 'are'} hidden.` : '';
  }

  #light(col) {
    for (const cell of this.shadowRoot.querySelectorAll('[data-col]')) cell.toggleAttribute('data-lit', cell.dataset.col === col);
  }
}
