import { comparisonStyles, markMarkup } from '../../core/comparison.js';
import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './leader-graph.scss?inline';

const DEMO_PRODUCTS = [
  { id: 'arcadia', name: 'Arcadia', score: 64, caption: 'Strong on price' },
  { id: 'halcyon', name: 'Halcyon', score: 71, caption: 'Best mobile apps' },
  { id: 'vertex', name: 'Vertex', score: 58, caption: 'Slow support' },
  { id: 'lumen', name: 'Lumen', score: 89, caption: 'Leads on reliability', winner: true },
];

const TICKS = [0, 25, 50, 75, 100];

/**
 * A ranking drawn as bars: one per product on a 0 to 100 scale, its score
 * above it and its mark, name and a short caption below. The leader's bar
 * is wider and filled with the accent gradient while the rest stay quiet.
 * The bars rise and the scores count up the first time the chart comes into
 * view; with reduced motion they stand at their height from the start.
 *
 * The chart is drawn from plain elements, so names and scores are real
 * text, and a hidden list reads the ranking to screen readers in order of
 * score. Three to five products read best. On narrow screens the chart
 * scrolls sideways.
 *
 * Products are `{ id, name, score, caption?, winner?, mark? }`, `mark` one of
 * the built-in demo marks or `<svg>` markup; `id` picks the demo mark when
 * there is none.
 *
 * @attr {string} heading
 * @attr {string} lede - A line under the heading; name your source
 * @attr {string} axis-label - What the bars measure
 * @attr {Array<object>} products (JSON)
 * @attr {string} accent - The leader's color; blue by default
 * @csspart chart
 * @cssprop --lw-leader-graph-accent - Same as `accent`
 */
export class LwLeaderGraph extends LwElement {
  static styles = [comparisonStyles, styles];
  static props = {
    heading: { default: 'Four products, one lead' },
    lede: { default: 'Overall score from our 2026 survey of 1,200 teams, weighing reliability, speed, support and price.' },
    axisLabel: { default: 'Overall score' },
    products: { type: Object, default: DEMO_PRODUCTS },
    accent: {},
  };

  #shown = false;
  #frame = 0;

  render() {
    return `<section class="section" aria-labelledby="heading"><h2 class="heading" id="heading"></h2><p class="lede"></p>
<ol class="visually-hidden summary"></ol>
<div class="scroller" tabindex="0" role="region" aria-labelledby="heading"><div class="chart" part="chart" aria-hidden="true"><p class="axis-label"></p><div class="ticks"></div><div class="plot"></div></div></div></section>`;
  }

  connected() {
    const seen = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      seen.disconnect();
      this.#reveal();
    }, { threshold: 0.35 });
    seen.observe(this.query('.chart'));
    this.signal.addEventListener('abort', () => {
      seen.disconnect();
      cancelAnimationFrame(this.#frame);
    });
  }

  updated() {
    this.query('.heading').textContent = this.heading ?? '';
    const lede = this.query('.lede');
    lede.textContent = this.lede ?? '';
    lede.hidden = !this.lede;
    this.query('.axis-label').textContent = this.axisLabel ?? '';
    if (this.accent) this.style.setProperty('--_accent', this.accent);
    else this.style.removeProperty('--_accent');
    const products = Array.isArray(this.products) ? this.products : [];
    const score = (product) => Math.min(100, Math.max(0, Number(product.score) || 0));
    this.query('.ticks').innerHTML = TICKS.map((tick) => `<span class="tick" style="--_at: ${tick}%">${tick}</span>`).join('');
    this.query('.plot').innerHTML = `<div class="grid">${TICKS.map((tick) => `<span class="grid-line" style="--_at: ${tick}%"></span>`).join('')}</div>${products
      .map(
        (product, i) => `<div class="column${product.winner ? ' winner' : ''}" style="--_score: ${score(product)}; --_i: ${i}"><div class="bar-track"><span class="score" data-score="${score(product)}">${this.#shown || reducedMotion.matches ? score(product) : 0}</span><span class="bar"></span></div><div class="name">${markMarkup(product.mark ?? product.id, 18)}<span>${escapeHtml(product.name)}</span></div>${product.caption ? `<p class="caption">${escapeHtml(product.caption)}</p>` : ''}</div>`,
      )
      .join('')}`;
    this.query('.plot').style.setProperty('--_count', String(products.length));
    this.query('.summary').innerHTML = [...products]
      .sort((a, b) => score(b) - score(a))
      .map((product) => `<li>${escapeHtml(product.name)}: ${score(product)} of 100${product.winner ? ', the leader' : ''}${product.caption ? `. ${escapeHtml(product.caption)}` : ''}</li>`)
      .join('');
    if (this.#shown || reducedMotion.matches) this.setAttribute('data-shown', '');
  }

  // Bars rise and the scores count up together.
  #reveal() {
    this.#shown = true;
    this.setAttribute('data-shown', '');
    if (reducedMotion.matches) return;
    const scores = [...this.shadowRoot.querySelectorAll('.score')];
    const start = performance.now();
    const length = 1100;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / length);
      const eased = 1 - (1 - t) ** 3;
      for (const element of scores) element.textContent = String(Math.round(Number(element.dataset.score) * eased));
      if (t < 1) this.#frame = requestAnimationFrame(tick);
    };
    this.#frame = requestAnimationFrame(tick);
  }
}
