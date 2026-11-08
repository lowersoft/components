import '../button/index.js';
import '../text-input/index.js';
import '../textarea/index.js';
import { connectContactForm, STATUS_MARKUP } from '../../core/contact.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowUpRight, messageSquareText } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './three-column-contact.scss?inline';

const DEMO_CHANNELS = [
  { heading: 'Talk to sales', body: 'Pricing, seats and a walkthrough of your build.', label: 'info@lowersoft.com', href: 'mailto:info@lowersoft.com?subject=Sales' },
  { heading: 'Open source', body: 'Issues, discussions and the code itself, in public.', label: 'github.com/lowersoft', href: 'https://github.com/lowersoft' },
  { heading: 'Everything else', body: 'The changelog, the docs and the latest release.', label: 'lowersoft.com', href: 'https://lowersoft.com' },
];

/**
 * A contact page in three columns. On the left, an eyebrow, a headline in
 * two lines and a sentence; in the middle, a form card with underlined
 * fields, the library's own, for a name, an email, an industry, a subject
 * and a message; on the right, the other ways to reach the team, each a
 * heading, a line and a link. On narrow screens the columns stack, the
 * channels after the form.
 *
 * The form checks its fields when sent. Set `send` to an async function
 * taking `{ name, email, industry, subject, message }` to deliver it: the
 * button waits while it runs, a rejection shows its message, and once it
 * resolves the form clears, says `sent` and fires `lw-send`.
 *
 * Channels are `{ heading, body, label, href }`; a line break in `body`
 * starts a new line.
 *
 * @attr {string} eyebrow - The line above the headline, with an arrow; none when empty
 * @attr {string} heading - The headline; a line break starts its second line
 * @attr {string} description
 * @attr {string} form-title - The form card's title
 * @attr {string} submit-label - The button's label
 * @attr {string} sent - What the form says once sent
 * @attr {Array<object>} channels (JSON)
 * @fires lw-send - The form was sent; `detail` holds `name`, `email`, `industry`, `subject` and `message`
 * @csspart card - The form card
 */
export class LwThreeColumnContact extends LwElement {
  static styles = styles;
  static props = {
    eyebrow: { default: 'Contact us' },
    heading: { default: 'Your message still\nreaches a person.' },
    description: { default: 'Questions about a build, a quote or something we shipped. Write it here and we reply from a real inbox.' },
    formTitle: { default: 'We’re listening.' },
    submitLabel: { default: 'Send message' },
    sent: { default: 'Thanks. Your message is with the team, and a person will reply.' },
    channels: { type: Object, default: DEMO_CHANNELS },
  };

  render() {
    return `<section class="section" aria-labelledby="heading"><div class="intro"><p class="eyebrow"><span class="eyebrow-text"></span>${strokeIcon(arrowUpRight, 14)}</p><h2 class="title" id="heading"></h2><p class="description"></p></div>
<div class="card" part="card"><p class="card-title">${strokeIcon(messageSquareText, 16)}<span class="card-title-text"></span></p><form class="form" novalidate>
<lw-text-input name="name" label="Name" placeholder="Maya Okafor" autocomplete="name" required></lw-text-input><lw-text-input name="email" type="email" label="Email" placeholder="maya@lowersoft.com" autocomplete="email" required></lw-text-input><lw-text-input name="industry" label="Industry" placeholder="Embedded systems"></lw-text-input><lw-text-input name="subject" label="Subject" placeholder="Moving our builds" required></lw-text-input><lw-textarea name="message" label="Message" placeholder="What should we know?" rows="4" required></lw-textarea>
<lw-button class="submit" type="submit"><span class="submit-label"></span><span slot="end">${strokeIcon(arrowUpRight, 16)}</span></lw-button>${STATUS_MARKUP}</form></div>
<ul class="channels"></ul></section>`;
  }

  connected() {
    connectContactForm(this, this.query('.form'), this.signal);
  }

  updated(changed) {
    const text = (selector, value) => {
      const element = this.query(selector);
      element.textContent = value ?? '';
      element.hidden = !value;
    };
    text('.eyebrow-text', this.eyebrow);
    this.query('.eyebrow').hidden = !this.eyebrow;
    if (changed.has('heading')) {
      this.query('.title').innerHTML = String(this.heading ?? '').split('\n').map((line) => `<span class="line">${escapeHtml(line)}</span>`).join(' ');
    }
    text('.description', this.description);
    text('.card-title-text', this.formTitle);
    this.query('.submit-label').textContent = this.submitLabel ?? '';
    if (changed.has('channels')) {
      const channels = Array.isArray(this.channels) ? this.channels : [];
      this.query('.channels').innerHTML = channels
        .map((channel) => `<li class="channel"><h3 class="channel-heading">${escapeHtml(channel.heading ?? '')}</h3><p class="channel-body">${escapeHtml(channel.body ?? '').replace(/\n/g, '<br>')}</p>${channel.label ? `<a class="channel-link" href="${escapeHtml(channel.href ?? '#')}">${escapeHtml(channel.label)}</a>` : ''}</li>`)
        .join('');
    }
  }
}
