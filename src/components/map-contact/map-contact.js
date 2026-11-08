import '../button/index.js';
import '../text-input/index.js';
import '../textarea/index.js';
import { connectContactForm, STATUS_MARKUP } from '../../core/contact.js';
import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './map-contact.scss?inline';

// A made-up neighbourhood in a 520 × 480 box: a river, two parks, a grid of
// streets and the blocks between them. The streets are generic, not real.
const COLUMNS = [138, 252, 374];
const ROWS = [104, 226, 346, 452];
const BLOCKS = [
  [58, 24, 66, 64], [154, 24, 84, 64], [266, 24, 92, 64], [392, 34, 72, 56],
  [70, 132, 60, 78], [164, 140, 74, 70], [268, 132, 90, 82], [392, 140, 92, 70],
  [56, 250, 70, 80], [150, 258, 88, 70], [270, 254, 88, 76], [394, 250, 80, 84],
  [64, 372, 66, 66], [160, 368, 78, 62], [272, 370, 82, 66], [396, 372, 78, 62],
];

const MAP = `<svg class="map-art" viewBox="0 0 520 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<rect class="land" width="520" height="480"/>
<path class="park" d="M0 380c60-18 120 6 170 26s118 22 160 4 130-30 190-8v78H0Z"/><path class="park" d="M380 0h140v40c-40 16-90 10-140-4Z"/>
${BLOCKS.map(([x, y, w, h]) => `<rect class="block" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`).join('')}
<path class="river" d="M190-10c-24 70-58 120-68 190s20 140-6 210-44 90-60 110"/>
${ROWS.map((y) => `<line class="street" x1="0" y1="${y}" x2="520" y2="${y}"/><line class="lane" x1="0" y1="${y}" x2="520" y2="${y}"/>`).join('')}
${COLUMNS.map((x) => `<line class="street" x1="${x}" y1="0" x2="${x}" y2="480"/><line class="lane" x1="${x}" y1="0" x2="${x}" y2="480"/>`).join('')}
</svg>`;

/**
 * A contact section for a place people can visit. On the left, an eyebrow,
 * the headline, the address and the hours with an email link, and a short
 * form; on the right, a map drawn in SVG, with no map service, key or
 * cookies: a river, parks, a grid of streets and a pin with its label,
 * pulsing softly while it is on screen. The map's colours follow the
 * theme. On narrow screens the map moves under the form.
 *
 * The form checks its fields when sent. Set `send` to an async function
 * taking `{ name, email, message }` to deliver it: the button waits while it
 * runs, a rejection shows its message, and once it resolves the form clears,
 * says `sent` and fires `lw-send`. The map's zoom marks are a picture and do
 * nothing.
 *
 * @attr {string} eyebrow - The line above the headline; none when empty
 * @attr {string} heading
 * @attr {string} address - A line break starts a new line
 * @attr {string} hours
 * @attr {string} email - The address shown, linked to write to it
 * @attr {string} pin-label - The label over the pin
 * @attr {string} message-placeholder - What the message field asks
 * @attr {string} submit-label - The button's label
 * @attr {string} sent - What the form says once sent
 * @fires lw-send - The form was sent; `detail` holds `name`, `email` and `message`
 * @csspart map - The map
 * @cssprop --lw-map-contact-pin - The pin's colour; red by default
 */
export class LwMapContact extends LwElement {
  static styles = styles;
  static props = {
    eyebrow: { default: 'Visit' },
    heading: { default: 'Come to build night.' },
    address: { default: 'Atelier 4, 21 Linker Lane\nBerlin 10115' },
    hours: { default: 'First Thursday of the month, 6pm to 10pm' },
    email: { default: 'info@lowersoft.com' },
    pinLabel: { default: 'Build night' },
    messagePlaceholder: { default: 'What are you bringing to build?' },
    submitLabel: { default: 'Save me a seat' },
    sent: { default: 'You’re on the list. We’ll send the details a week before.' },
  };

  render() {
    return `<section class="section" aria-labelledby="heading"><div class="copy"><p class="eyebrow"></p><h2 class="title" id="heading"></h2>
<div class="facts"><p class="address"></p><p class="when"><span class="hours"></span><a class="email"></a></p></div>
<form class="form" novalidate><lw-text-input name="name" label="Name" placeholder="Name" autocomplete="name" required></lw-text-input><lw-text-input name="email" type="email" label="Email" placeholder="Email" autocomplete="email" required></lw-text-input><lw-textarea class="message" name="message" label="Message" rows="4"></lw-textarea>
<lw-button class="submit" type="submit"></lw-button>${STATUS_MARKUP}</form></div>
<div class="map" part="map">${MAP}<span class="pin" aria-hidden="true"><span class="pin-label"></span><svg class="pin-mark" viewBox="0 0 24 32"><path d="M12 31c-1-3-9-11.5-9-18a9 9 0 1 1 18 0c0 6.5-8 15-9 18Z"/><circle cx="12" cy="12.5" r="3.6"/></svg><span class="pulse"></span></span>
<span class="zoom" aria-hidden="true"><span>+</span><span>−</span></span></div></section>`;
  }

  connected() {
    connectContactForm(this, this.query('.form'), this.signal);
    watchVisibility(this.query('.map'), (visible) => this.toggleAttribute('data-paused', !visible), this.signal);
  }

  updated() {
    const text = (selector, value) => {
      const element = this.query(selector);
      element.textContent = value ?? '';
      element.hidden = !value;
    };
    text('.eyebrow', this.eyebrow);
    text('.title', this.heading);
    const address = this.query('.address');
    address.innerHTML = escapeHtml(this.address ?? '').replace(/\n/g, '<br>');
    address.hidden = !this.address;
    text('.hours', this.hours);
    const email = this.query('.email');
    text('.email', this.email);
    if (this.email) email.setAttribute('href', `mailto:${this.email}`);
    else email.removeAttribute('href');
    text('.pin-label', this.pinLabel);
    this.query('.message').placeholder = this.messagePlaceholder ?? '';
    this.query('.submit').textContent = this.submitLabel ?? '';
  }
}
