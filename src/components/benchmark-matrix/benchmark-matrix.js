import { comparisonStyles } from '../../core/comparison.js';
import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './benchmark-matrix.scss?inline';

const DEMO_MODELS = [
  { id: 'sable-2', name: 'Sable 2', featured: true },
  { id: 'sable-1', name: 'Sable 1' },
  { id: 'orion', name: 'Orion Large' },
  { id: 'kite', name: 'Kite Pro' },
];

// Made-up models on made-up evaluations: replace them with your own.
const DEMO_ROWS = [
  { id: 'coding', title: 'Coding', source: 'Internal suite · 500 tasks, pass@1', values: {
    'sable-2': [{ value: '71.2%', caption: 'no tools' }, { value: '78.9%', caption: 'with tools' }],
    'sable-1': { value: '62.4%' }, orion: [{ value: '68.0%', caption: 'no tools' }, { value: '74.1%', caption: 'with tools' }], kite: { value: '59.3%' } } },
  { id: 'reasoning', title: 'Graduate-level reasoning', source: 'Held-out set · 448 questions', values: {
    'sable-2': { value: '83.5%' }, 'sable-1': { value: '76.0%' }, orion: { value: '84.1%' }, kite: { value: '72.8%' } } },
  { id: 'math', title: 'Competition math', source: 'Contest problems · 30 per year, 5 years', values: {
    'sable-2': { value: '88.0%' }, 'sable-1': { value: '70.6%' }, orion: { value: '81.3%' }, kite: { value: '64.0%' } } },
  { id: 'context', title: 'Long-context recall', source: 'Needle tasks · up to 1M tokens', values: {
    'sable-2': { value: '97.4%', credit: '1M tokens' }, 'sable-1': { value: '91.2%', credit: '200k tokens' }, orion: { value: '95.0%', credit: '1M tokens' }, kite: { value: '88.5%', credit: '128k tokens' } } },
  { id: 'tools', title: 'Agentic tool use', source: 'Retail and airline tasks · pass@1', values: {
    'sable-2': [{ value: '81.6%', caption: 'retail' }, { value: '62.0%', caption: 'airline' }],
    'sable-1': [{ value: '70.2%', caption: 'retail' }, { value: '49.5%', caption: 'airline' }],
    orion: [{ value: '78.4%', caption: 'retail' }, { value: '64.8%', caption: 'airline' }],
    kite: [{ value: '66.1%', caption: 'retail' }, { value: '45.0%', caption: 'airline' }] } },
  { id: 'multilingual', title: 'Multilingual Q&A', source: '14 languages · averaged', values: {
    'sable-2': { value: '89.9%' }, 'sable-1': { value: '85.1%' }, orion: { value: '88.7%' }, kite: { value: '82.3%' } } },
];

const scores = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const amount = (score) => Number.parseFloat(String(score?.value ?? '').replace(/,/g, ''));

/**
 * A benchmark table for a model launch: models across the top, evaluations
 * down the side with a line on where each comes from, and in every cell
 * one score or a stack of them, each with a caption and a credit. The
 * featured model sits next to the evaluation names inside a rounded accent
 * outline running the full height, and the best score in each row, or in
 * each caption of a stacked row, is filled. Mark wins yourself with `win`
 * to override. On narrow screens the table scrolls sideways.
 *
 * Models are `{ id, name, featured? }`. Rows are `{ id, title, source?,
 * values }`, `values` keyed by model id: a score `{ value, caption?, credit?,
 * win? }` or a list of them.
 *
 * @attr {string} heading - Leave empty to start with the table
 * @attr {string} lede
 * @attr {Array<object>} models (JSON)
 * @attr {Array<object>} rows (JSON)
 * @attr {string} accent - The featured outline and winning fills; blue by default
 * @csspart table
 * @cssprop --lw-benchmark-matrix-accent - Same as `accent`
 */
export class LwBenchmarkMatrix extends LwElement {
  static styles = [comparisonStyles, styles];
  static props = {
    heading: { default: 'Evaluation results' },
    lede: { default: 'Every model run by our team with the same prompts and settings. Higher is better.' },
    models: { type: Object, default: DEMO_MODELS },
    rows: { type: Object, default: DEMO_ROWS },
    accent: {},
  };

  render() {
    return '<section class="section"><h2 class="heading" id="heading"></h2><p class="lede"></p><div class="scroller" tabindex="0" role="region" aria-label="Benchmark results"><div class="table" part="table" role="table"></div></div></section>';
  }

  updated() {
    const heading = this.query('.heading');
    heading.textContent = this.heading ?? '';
    heading.hidden = !this.heading;
    const lede = this.query('.lede');
    lede.textContent = this.lede ?? '';
    lede.hidden = !this.lede;
    if (this.accent) this.style.setProperty('--_accent', this.accent);
    else this.style.removeProperty('--_accent');
    const models = Array.isArray(this.models) ? this.models : [];
    // The featured model goes first, beside the evaluation names.
    const ordered = [...models.filter((model) => model.featured), ...models.filter((model) => !model.featured)];
    const rows = Array.isArray(this.rows) ? this.rows : [];
    const table = this.query('.table');
    table.style.setProperty('--_count', String(ordered.length));
    table.style.gridTemplateRows = `repeat(${rows.length + 1}, auto)`;
    const featured = ordered.findIndex((model) => model.featured);
    // Rows are placed by number, so the frame can lie over them.
    const head = `<div class="row head" role="row" style="grid-row: 1"><div class="cell corner" role="columnheader">Benchmark</div>${ordered
      .map((model) => `<div class="cell model${model.featured ? ' featured' : ''}" role="columnheader">${escapeHtml(model.name)}</div>`)
      .join('')}</div>`;
    const body = rows
      .map((row, r) => {
        const wins = this.#wins(row, ordered);
        return `<div class="row" role="row" style="grid-row: ${r + 2}"><div class="cell benchmark" role="rowheader"><span class="title">${escapeHtml(row.title)}</span>${row.source ? `<span class="source">${escapeHtml(row.source)}</span>` : ''}</div>${ordered
          .map((model) => {
            const list = scores(row.values?.[model.id]);
            const inner = list.length
              ? list.map((score, i) => `<div class="score${wins.has(`${model.id}:${i}`) ? ' win' : ''}"><span class="value">${escapeHtml(score.value)}</span>${score.caption ? `<span class="caption">${escapeHtml(score.caption)}</span>` : ''}${score.credit ? `<span class="credit">${escapeHtml(score.credit)}</span>` : ''}${wins.has(`${model.id}:${i}`) ? '<span class="visually-hidden">(best)</span>' : ''}</div>`).join('')
              : '<span class="none">—<span class="visually-hidden">Not reported</span></span>';
            return `<div class="cell result" role="cell">${inner}</div>`;
          })
          .join('')}</div>`;
      })
      .join('');
    const frame = featured >= 0 ? `<span class="frame" aria-hidden="true" style="grid-column: ${featured + 2}"></span>` : '';
    table.innerHTML = head + body + frame;
  }

  // Wins as `model:index`: marked ones when any score in the row is
  // marked, else the highest score for each caption across the row.
  #wins(row, models) {
    const all = models.flatMap((model) => scores(row.values?.[model.id]).map((score, i) => ({ key: `${model.id}:${i}`, score })));
    if (all.some(({ score }) => 'win' in score)) return new Set(all.filter(({ score }) => score.win).map(({ key }) => key));
    const groups = new Map();
    for (const entry of all) {
      const caption = entry.score.caption ?? '';
      if (!groups.has(caption)) groups.set(caption, []);
      groups.get(caption).push(entry);
    }
    const wins = new Set();
    for (const entries of groups.values()) {
      const valued = entries.filter(({ score }) => Number.isFinite(amount(score)));
      if (valued.length < 2) continue;
      const best = Math.max(...valued.map(({ score }) => amount(score)));
      if (valued.every(({ score }) => amount(score) === best)) continue;
      for (const { key, score } of valued) if (amount(score) === best) wins.add(key);
    }
    return wins;
  }
}
