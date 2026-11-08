import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import { companyMarkup, drawFace, quoteMarkup } from '../../core/testimonial.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './metric-testimonials.scss?inline';

const DEMO_QUOTES = [
  {
    metric: '5×',
    metricLabel: 'faster clean builds across 140 services',
    quote: 'We stopped planning the day around the build. A clean build of the monorepo used to be ==a forty-minute coffee run==; now it is done before review starts.',
    person: { name: 'Priya Raman', role: 'Director of Platform, Fieldnote' },
    company: { name: 'Fieldnote', color: '#8e4ec6' },
  },
  {
    quote: 'lower replaced three caching layers, a homegrown test sharder and a weekly meeting about flaky tests. What is left is ==one config file and builds that are boring in the best way==. New hires ship on their second day.',
    person: { name: 'Maya Okafor', role: 'Staff Engineer, Halcyon' },
    company: { name: 'Halcyon', color: '#12a594' },
  },
  {
    quote: 'Our CI bill fell by ==61% in the first month==, and nobody had to change a line of code.',
    person: { name: 'Jonas Berg', role: 'CTO, Arcadia' },
    company: { name: 'Arcadia', color: '#30a46c' },
  },
  {
    quote: 'Cross-compiling for six targets is ==one command== now, not one person.',
    person: { name: 'Theo Laurent', role: 'Founder, Lumen' },
    company: { name: 'Lumen', color: '#e5484d' },
    inverted: true,
  },
];

const DEMO_RATING = { score: 4.8, reviews: 980, faces: ['Priya Raman', 'Maya Okafor', 'Jonas Berg', 'Theo Laurent'] };

// The cards by their place in `quotes`.
const SLOTS = ['featured', 'wide', 'compact', 'compact'];

const whole = new Intl.NumberFormat('en-US');

/**
 * Customer quotes in a bento grid, led by a number. A tall card on the left
 * carries the headline metric, which rolls up to its value the first time it
 * comes into view; a wide card holds a longer quote, and two compact cards
 * sit under it, one of them turned over in the opposite scheme for weight.
 * The phrase that matters in each quote is marked in the company's colour.
 * Under the grid sit the clients, the rating and a link to every review.
 *
 * Quotes are `{ quote, person: { name, role }, company: { name, color },
 * metric?, metricLabel?, inverted? }`, `==phrase==` marking a phrase; the
 * first four are used, the first being the tall card and the second the wide
 * one. A metric's digits roll, so "5×", "−38%" or "3 days" all work.
 *
 * @attr {string} eyebrow - The short line above the heading, set in brackets
 * @attr {string} heading
 * @attr {string} description
 * @attr {Array<object>} quotes (JSON)
 * @attr {string} clients - The line beside the clients' faces
 * @attr {object} rating - `{ score, reviews, faces }`: the score out of five, how many reviews and the names whose faces show (JSON)
 * @attr {string} reviews-label - The link to every review; none when empty
 * @attr {string} reviews-href
 * @csspart card - Each card
 */
export class LwMetricTestimonials extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    eyebrow: { default: 'Customer stories' },
    heading: { default: 'What changed for the teams that switched' },
    description: { default: 'The numbers from their first quarter on lower, in the words of the people who ran it.' },
    quotes: { type: Object, default: DEMO_QUOTES },
    clients: { default: 'Used by 2,400 engineering teams' },
    rating: { type: Object, default: DEMO_RATING },
    reviewsLabel: { default: 'Read all reviews' },
    reviewsHref: { default: '#' },
  };

  // Whether the metrics have rolled up yet.
  #rolled = false;

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><div class="lead"><p class="eyebrow"></p><h2 class="title" id="heading"></h2></div><p class="description"></p></header>
<div class="grid"></div>
<footer class="foot"><p class="clients"><span class="faces"></span><span class="clients-label"></span></p><p class="rating"><span class="stars" aria-hidden="true">★★★★★</span><span class="score"></span><span class="reviews"></span></p><a class="all"><span class="all-label"></span>${strokeIcon(arrowRight, 14)}</a></footer></section>`;
  }

  connected() {
    watchVisibility(this.query('.grid'), (visible) => visible && this.#rollUp(), this.signal);
  }

  updated(changed) {
    this.query('.eyebrow').textContent = this.eyebrow ?? '';
    this.query('.eyebrow').hidden = !this.eyebrow;
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.description').hidden = !this.description;
    if (changed.has('quotes')) this.#build();
    if (changed.has('rating') || changed.has('clients')) this.#paintFoot();
    const all = this.query('.all');
    this.query('.all-label').textContent = this.reviewsLabel ?? '';
    all.hidden = !this.reviewsLabel;
    if (this.reviewsHref) all.setAttribute('href', this.reviewsHref);
    else all.removeAttribute('href');
  }

  #build() {
    const quotes = (Array.isArray(this.quotes) ? this.quotes : []).slice(0, SLOTS.length);
    const grid = this.query('.grid');
    grid.innerHTML = quotes.map((item, index) => {
      const metric = item.metric ? `<p class="metric"><span class="rolling" aria-hidden="true"></span><span class="metric-value">${escapeHtml(item.metric)}</span></p><p class="metric-label">${escapeHtml(item.metricLabel ?? '')}</p>` : '';
      return `<figure class="card ${SLOTS[index]}${item.inverted ? ' inverted' : ''}" part="card" style="--_tint: ${escapeHtml(item.company?.color ?? '')}"><div class="card-top">${item.company?.name ? companyMarkup(item.company) : ''}</div>${metric}<blockquote class="quote">${quoteMarkup(item.quote ?? '')}</blockquote><figcaption class="person"><span class="face"></span><span><span class="person-name">${escapeHtml(item.person?.name ?? '')}</span><span class="person-role">${escapeHtml(item.person?.role ?? '')}</span></span></figcaption></figure>`;
    }).join('');
    grid.querySelectorAll('.card').forEach((card, index) => drawFace(card.querySelector('.face'), quotes[index].person?.name));
    // A metric starts at its zeros and rolls up once seen, unless it already has.
    grid.querySelectorAll('.metric').forEach((metric) => {
      const value = metric.querySelector('.metric-value').textContent;
      roll(metric.querySelector('.rolling'), this.#rolled ? value : value.replace(/\d/g, '0'));
    });
  }

  #rollUp() {
    if (this.#rolled) return;
    this.#rolled = true;
    for (const metric of this.shadowRoot.querySelectorAll('.metric')) roll(metric.querySelector('.rolling'), metric.querySelector('.metric-value').textContent);
  }

  #paintFoot() {
    const rating = this.rating ?? {};
    const faces = this.query('.faces');
    faces.replaceChildren();
    for (const name of (rating.faces ?? []).slice(0, 5)) {
      const face = Object.assign(document.createElement('span'), { className: 'face' });
      faces.append(face);
      drawFace(face, name);
    }
    this.query('.clients-label').textContent = this.clients ?? '';
    this.query('.clients').hidden = !this.clients && !faces.children.length;
    const score = Number(rating.score);
    this.query('.score').textContent = Number.isFinite(score) ? score.toFixed(1) : '';
    this.query('.reviews').textContent = rating.reviews ? `from ${whole.format(rating.reviews)} verified reviews` : '';
    this.query('.rating').hidden = !Number.isFinite(score);
  }
}
