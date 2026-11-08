import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowUpRight, messageSquareText } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import { companyMarkup, drawFace, QUOTE_ICON, quoteMarkup } from '../../core/testimonial.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './metric-testimonials.scss?inline';

const DEMO_QUOTES = [
  {
    metric: '5×',
    metricLabel: 'Faster clean builds across 140 services',
    quote: 'The build used to stall every morning before anyone could merge. After the move, clean builds finished before review started, and we could finally point to a number instead of a feeling.',
    person: { name: 'Priya Raman', role: 'Director of Platform, Fieldnote' },
    company: { name: 'Fieldnote', color: '#8e4ec6' },
  },
  {
    metric: '3×',
    metricLabel: 'More releases from the same team',
    quote: 'Same headcount, three times the releases that actually ship. Build and test finally share one cache, so the queue fills with work that is ready instead of work that is waiting.',
    person: { name: 'Maya Okafor', role: 'Staff Engineer, Halcyon' },
    company: { name: 'Halcyon', color: '#12a594' },
  },
  {
    quote: 'The sanitizer runs on every pull request now. People fix the bug in review instead of meeting it in production.',
    person: { name: 'Sam Whitfield', role: 'Systems Engineer, Parcel' },
    company: { name: 'Parcel', color: '#f76b15' },
  },
  {
    quote: 'We shipped firmware for six boards in one sprint. Cross-compiling stopped being a person and became a command.',
    person: { name: 'Theo Laurent', role: 'Founder, Lumen' },
    company: { name: 'Lumen', color: '#e5484d' },
    inverted: true,
  },
];

const DEMO_RATING = { score: 4.8, reviews: 980 };

// The cards by their place in `quotes`.
const SLOTS = ['featured', 'wide', 'compact', 'compact'];

const whole = new Intl.NumberFormat('en-US');

/**
 * Named customer proof in a bento grid, led by a number. Over it, an eyebrow
 * framed in corner marks and a headline in two tones. A tall card on the left
 * opens on the headline metric, whose digits roll up the first time it comes
 * into view; a wide card beside it leads with a metric of its own, and two
 * compact cards sit under that, one turned over in the opposite scheme. Each
 * quote opens on a pair of quote marks and closes on the person, with the
 * company's mark at the end. A rating row with a link to every review
 * closes the section.
 *
 * Quotes are `{ quote, person: { name, role, avatar? }, company: { name,
 * color }, metric?, metricLabel?, inverted? }`, `avatar` a picture's URL in
 * place of the drawn face and `==phrase==` marking a phrase; the first four
 * are used, the first being the tall card and the second the wide one. A
 * metric's digits roll, so "5×", "−38%" or "3 days" all work.
 *
 * @attr {string} eyebrow - The short line above the heading, framed in corner marks
 * @attr {string} heading - The headline's first line
 * @attr {string} subheading - Its second line, in a quieter tone; none when empty
 * @attr {string} description
 * @attr {Array<object>} quotes (JSON)
 * @attr {string} clients - The line at the start of the rating row
 * @attr {object} rating - `{ score, reviews }`: the score out of five and how many reviews (JSON)
 * @attr {string} reviews-label - The link to every review; none when empty
 * @attr {string} reviews-href
 * @csspart card - Each card
 * @cssprop --lw-metric-testimonials-accent - The colour of the quote marks and the eyebrow's corners; the text colour by default
 */
export class LwMetricTestimonials extends LwElement {
  static styles = [rollingStyles, styles];
  static props = {
    eyebrow: { default: 'Customer proof' },
    heading: { default: 'Results you can stand by' },
    subheading: { default: 'Read the named proof' },
    description: { default: 'Hear it from the people who already shipped with lower.' },
    quotes: { type: Object, default: DEMO_QUOTES },
    clients: { default: '1,200 engineering teams moved their builds to lower last year' },
    rating: { type: Object, default: DEMO_RATING },
    reviewsLabel: { default: 'Read the full set' },
    reviewsHref: { default: '#' },
  };

  // Whether the metrics have rolled up yet.
  #rolled = false;

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><p class="eyebrow"><span class="eyebrow-text"></span></p><h2 class="title" id="heading"><span class="title-main"></span><span class="title-sub"></span></h2><p class="description"></p></header>
<div class="grid"></div>
<footer class="foot"><p class="clients"></p><p class="rating"><span class="rating-icon">${strokeIcon(messageSquareText, 16)}</span><span class="stars" aria-hidden="true">★★★★★</span><span class="score"></span><span class="reviews"></span></p><a class="all"><span class="all-label"></span><span class="all-icon">${strokeIcon(arrowUpRight, 14)}</span></a></footer></section>`;
  }

  connected() {
    watchVisibility(this.query('.grid'), (visible) => visible && this.#rollUp(), this.signal);
  }

  updated(changed) {
    this.query('.eyebrow-text').textContent = this.eyebrow ?? '';
    this.query('.eyebrow').hidden = !this.eyebrow;
    this.query('.title-main').textContent = this.heading ?? '';
    this.query('.title-sub').textContent = this.subheading ?? '';
    this.query('.title-sub').hidden = !this.subheading;
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
      const slot = SLOTS[index];
      const metric = escapeHtml(item.metric ?? '');
      const label = escapeHtml(item.metricLabel ?? '');
      // The tall card sets its metric large over the label; the others lead with both on one line.
      let lead = '';
      if (metric && slot === 'featured') lead = `<p class="metric"><span class="rolling" aria-hidden="true"></span><span class="metric-value">${metric}</span></p><p class="metric-label">${label}</p>`;
      else if (metric || label) lead = `<p class="headline">${metric ? `<span class="headline-metric">${metric}</span> ` : ''}${label}</p>`;
      const avatar = item.person?.avatar ? `<img class="avatar" src="${escapeHtml(item.person.avatar)}" alt="" loading="lazy" decoding="async">` : '<span class="face"></span>';
      return `<figure class="card ${slot}${item.inverted ? ' inverted' : ''}" part="card" style="--_tint: ${escapeHtml(item.company?.color ?? '')}">${lead}${QUOTE_ICON}<blockquote class="quote"><p>${quoteMarkup(item.quote ?? '')}</p></blockquote><figcaption class="person">${avatar}<span class="who"><span class="person-name">${escapeHtml(item.person?.name ?? '')}</span><span class="person-role">${escapeHtml(item.person?.role ?? '')}</span></span>${item.company?.name ? companyMarkup(item.company) : ''}</figcaption></figure>`;
    }).join('');
    grid.querySelectorAll('.card').forEach((card, index) => {
      const face = card.querySelector('.face');
      if (face) drawFace(face, quotes[index].person?.name);
    });
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
    this.query('.clients').textContent = this.clients ?? '';
    this.query('.clients').hidden = !this.clients;
    const score = Number(rating.score);
    this.query('.score').textContent = Number.isFinite(score) && rating.score != null ? score.toFixed(1) : '';
    this.query('.reviews').textContent = rating.reviews ? `From ${whole.format(rating.reviews)} verified reviews` : '';
    this.query('.rating').hidden = !this.query('.score').textContent;
  }
}
