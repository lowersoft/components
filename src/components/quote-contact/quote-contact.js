import '../button/index.js';
import '../text-input/index.js';
import '../textarea/index.js';
import { LOWERSOFT } from '../../core/brand.js';
import { connectContactForm, STATUS_MARKUP } from '../../core/contact.js';
import { strokeIcon } from '../../core/icons.js';
import { logoMarkup } from '../../core/logos.js';
import { chevronLeft, chevronRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { quoteMarkup } from '../../core/testimonial.js';
import styles from './quote-contact.scss?inline';

const DEMO_QUOTES = [
  { quote: 'We moved forty services onto lower in one sprint. ==Clean builds dropped from forty minutes to six==, and nobody had to touch a Makefile.', client: { name: 'Halcyon', mark: 'wave' } },
  { quote: 'The remote cache is the first tool ==the whole team stopped arguing about==. A laptop on hotel wifi gets the same hits as the build farm.', client: { name: 'Fieldnote', mark: 'leaf' } },
  { quote: 'Cross-compiling for six boards used to be one person’s job. ==Now it is one command== anyone on the team can run.', client: { name: 'Lumen', mark: 'spark' } },
];

const SWAP = { duration: 320, easing: 'cubic-bezier(0.22, 0.7, 0.2, 1)' };

/**
 * A contact form beside a customer's word. On the left, the headline and a
 * short form: name, email and message, the library's own fields, with the
 * button under them. On the right, a quote card on a soft glow: the
 * product's mark at the top, the quote with its key phrase in bold, the
 * customer's logo at the foot, and arrows to step through the quotes. On
 * narrow screens the card follows the form.
 *
 * The form checks its fields when sent. Set `send` to an async function
 * taking `{ name, email, message }` to deliver it: the button waits while it
 * runs, a rejection shows its message, and once it resolves the form clears,
 * says `sent` and fires `lw-send`.
 *
 * Quotes are `{ quote, client: { name, mark?, src? } }`, `==phrase==` set in
 * bold; the client is a logo as in the logo clouds.
 *
 * @attr {string} heading
 * @attr {string} description - A line under the headline; none when empty
 * @attr {string} submit-label - The button's label
 * @attr {string} sent - What the form says once sent
 * @attr {Array<object>} quotes (JSON)
 * @attr {number} index - The quote shown
 * @attr {string} vendor - The product's name at the top of the card
 * @attr {string} vendor-mark - Its mark, an image's URL; Lowersoft's badge by default, none when empty
 * @fires lw-send - The form was sent; `detail` holds `name`, `email` and `message`
 * @csspart card - The quote card
 * @cssprop --lw-quote-contact-glow - The colour of the glow behind the card
 */
export class LwQuoteContact extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'We’re here to help' },
    description: { default: '' },
    submitLabel: { default: 'Send message' },
    sent: { default: 'Thanks. Someone on the team will reply within one working day.' },
    quotes: { type: Object, default: DEMO_QUOTES },
    index: { type: Number, default: 0 },
    vendor: { default: 'lower' },
    vendorMark: { default: LOWERSOFT.mark },
  };

  // The quote last shown, so a change can fade between them.
  #shown = -1;

  render() {
    return `<section class="section" aria-labelledby="heading"><div class="copy"><h2 class="title" id="heading"></h2><p class="description"></p>
<form class="form" novalidate><lw-text-input name="name" label="Name" placeholder="e.g. Maya Okafor" autocomplete="name" required></lw-text-input><lw-text-input name="email" type="email" label="Email address" placeholder="e.g. maya@lowersoft.com" autocomplete="email" required></lw-text-input><lw-textarea name="message" label="Message" placeholder="Tell us what you build and where the build hurts" rows="5" required></lw-textarea>
<lw-button class="submit" type="submit"></lw-button>${STATUS_MARKUP}</form></div>
<div class="side"><span class="glow" aria-hidden="true"></span><figure class="card" part="card"><div class="card-head"><span class="vendor"><img class="vendor-mark" alt="" decoding="async"><span class="vendor-name"></span></span><span class="arrows"><lw-button class="prev" variant="outline" size="sm" icon-only aria-label="Previous quote">${strokeIcon(chevronLeft, 16)}</lw-button><lw-button class="next" variant="outline" size="sm" icon-only aria-label="Next quote">${strokeIcon(chevronRight, 16)}</lw-button></span></div>
<blockquote class="quote" aria-live="polite"><p class="quote-text"></p></blockquote><figcaption class="client"></figcaption></figure></div></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    connectContactForm(this, this.query('.form'), this.signal);
    this.query('.prev').addEventListener('click', () => this.#step(-1), options);
    this.query('.next').addEventListener('click', () => this.#step(1), options);
  }

  updated() {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.description').hidden = !this.description;
    this.query('.submit').textContent = this.submitLabel ?? '';
    const mark = this.query('.vendor-mark');
    if (this.vendorMark) mark.src = this.vendorMark;
    mark.hidden = !this.vendorMark;
    this.query('.vendor-name').textContent = this.vendor ?? '';
    this.query('.arrows').hidden = this.#quotes.length < 2;
    this.#show();
  }

  get #quotes() {
    return Array.isArray(this.quotes) ? this.quotes : [];
  }

  get #index() {
    const count = this.#quotes.length;
    return count ? (((Math.round(this.index) || 0) % count) + count) % count : 0;
  }

  #step(by) {
    this.index = this.#index + by;
  }

  // Shows the quote; a new one fades in over the last.
  #show() {
    const index = this.#index;
    const item = this.#quotes[index];
    this.query('.card').hidden = !item;
    if (!item || index === this.#shown) return;
    const text = this.query('.quote-text');
    const client = this.query('.client');
    text.innerHTML = quoteMarkup(item.quote ?? '');
    client.innerHTML = item.client ? `<span class="logo">${logoMarkup(item.client)}</span>` : '';
    if (this.#shown >= 0 && !reducedMotion.matches) {
      for (const element of [text, client]) element.animate({ opacity: [0, 1], filter: ['blur(4px)', 'blur(0)'], translate: ['0 0.375rem', '0 0'] }, SWAP);
    }
    this.#shown = index;
  }
}
