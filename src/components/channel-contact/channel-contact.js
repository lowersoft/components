import '../button/index.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { GITHUB } from '../../core/login.js';
import { arrowRight, bookOpen, history, mail, messageCircle } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './channel-contact.scss?inline';

const DEMO_CHANNELS = [
  { id: 'call', heading: 'Book a call', body: 'Pick a 20 minute slot. We will walk through your build graph, your seats and whether lower is the right fit.', action: 'Book a call', href: '#book' },
  { id: 'message', heading: 'Send us a message', body: 'Write a short brief. We read every note and reply from info@lowersoft.com within one working day.', action: 'Write to us', href: 'mailto:info@lowersoft.com' },
];

const DEMO_CARDS = [
  { id: 'github', icon: 'github', heading: 'Join the discussions', body: 'Ask in public, share a build and see what other teams shipped this week.', label: 'Open GitHub', href: 'https://github.com/lowersoft', accent: true },
  { id: 'docs', icon: 'docs', heading: 'Read the docs', body: 'Install, configuration and the build file reference in one place, without waiting on a reply.', label: 'Open the docs', href: 'https://lowersoft.com' },
  { id: 'changelog', icon: 'changelog', heading: 'Follow the changelog', body: 'Release notes, benchmarks and the odd post-mortem when something breaks.', label: 'Read the changelog', href: 'https://lowersoft.com' },
];

const ICONS = { github: GITHUB, docs: strokeIcon(bookOpen, 20), changelog: strokeIcon(history, 20), chat: strokeIcon(messageCircle, 20), mail: strokeIcon(mail, 20) };

/**
 * A contact section that sends people to the right place instead of asking
 * them to write. Two channels sit side by side, booking a call and sending a
 * message, each with a heading, a sentence and the library's button; under
 * them, three cards point to where answers already are, such as the code,
 * the docs and the changelog, each with the library's button too. One card
 * can be turned over in the opposite scheme to lead. On narrow screens the
 * channels and cards stack.
 *
 * Every button fires `lw-action` with its channel's or card's id; unless it
 * is cancelled, the page then goes to its `href`.
 *
 * Channels are `{ id, heading, body, action, href }`; cards are `{ id,
 * icon, heading, body, label, href, accent? }`, `icon` one of github, docs,
 * changelog, chat or mail.
 *
 * @attr {Array<object>} channels (JSON)
 * @attr {Array<object>} cards (JSON)
 * @fires lw-action - A channel's or a card's button was pressed; `detail: { action, href }`, `action` its id. Unless cancelled, the page then goes to `href`
 * @csspart card - Each card
 * @cssprop --lw-channel-contact-accent - The leading card's colour; it is turned over in the opposite scheme by default
 * @cssprop --lw-channel-contact-on-accent - The text on the leading card
 */
export class LwChannelContact extends LwElement {
  static styles = styles;
  static props = {
    channels: { type: Object, default: DEMO_CHANNELS },
    cards: { type: Object, default: DEMO_CARDS },
  };

  render() {
    return '<section class="section" aria-label="Contact"><div class="channels"></div><ul class="cards"></ul></section>';
  }

  connected() {
    // A channel's or a card's button says which, then goes where it points.
    this.query('.section').addEventListener('click', (event) => {
      const button = event.target.closest('[data-kind]');
      if (!button) return;
      const target = (button.dataset.kind === 'card' ? this.#cards : this.#channels)[Number(button.dataset.index)];
      if (!target) return;
      if (this.emit('action', { action: target.id ?? '', href: target.href ?? '' }) && target.href) location.assign(target.href);
    }, { signal: this.signal });
  }

  updated(changed) {
    if (changed.has('channels')) {
      this.query('.channels').innerHTML = this.#channels
        .map((channel, at) => `<div class="channel"><h2 class="channel-heading">${escapeHtml(channel.heading ?? '')}</h2><p class="channel-body">${escapeHtml(channel.body ?? '')}</p>${channel.action ? `<lw-button class="channel-action" data-kind="channel" data-index="${at}"><span>${escapeHtml(channel.action)}</span><span slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button>` : ''}</div>`)
        .join('');
    }
    if (changed.has('cards')) {
      this.query('.cards').innerHTML = this.#cards
        .map((card, at) => `<li class="card${card.accent ? ' accent' : ''}" part="card"><span class="card-icon" aria-hidden="true">${ICONS[card.icon] ?? ''}</span><h3 class="card-heading">${escapeHtml(card.heading ?? '')}</h3><p class="card-body">${escapeHtml(card.body ?? '')}</p>${card.label ? `<lw-button class="card-action" data-kind="card" data-index="${at}" size="sm"${card.accent ? '' : ' variant="outline"'}><span>${escapeHtml(card.label)}</span><span slot="end">${strokeIcon(arrowRight, 14)}</span></lw-button>` : ''}</li>`)
        .join('');
    }
  }

  get #channels() {
    return Array.isArray(this.channels) ? this.channels : [];
  }

  get #cards() {
    return Array.isArray(this.cards) ? this.cards : [];
  }
}
