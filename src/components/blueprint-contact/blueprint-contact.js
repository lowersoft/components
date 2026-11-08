import '../button/index.js';
import '../select/index.js';
import '../text-input/index.js';
import '../textarea/index.js';
import { connectContactForm, STATUS_MARKUP } from '../../core/contact.js';
import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { drawFace } from '../../core/testimonial.js';
import styles from './blueprint-contact.scss?inline';

const DEMO_TOPICS = [
  { value: 'sales', label: 'Pricing and plans' },
  { value: 'support', label: 'Help with a build' },
  { value: 'migration', label: 'Moving to lower' },
  { value: 'partnership', label: 'A partnership' },
];

const DEMO_TEAMS = [
  { value: '1-10', label: '1 to 10 engineers' },
  { value: '11-50', label: '11 to 50 engineers' },
  { value: '51-200', label: '51 to 200 engineers' },
  { value: '200+', label: 'More than 200' },
];

/**
 * A contact form on a blueprint. A dashed frame holds a narrow column, with
 * dashed guides down both sides and dashed rules between its parts: a large
 * centred headline and a line, then the form, then the actions. The form
 * asks for a name and an email, a topic and a team size from the library's
 * select, and a message beside the face of the person who reads it.
 *
 * The labels are kept for screen readers; the placeholders say what each
 * field is. The form checks its fields when sent. Set `send` to an async
 * function taking `{ name, email, topic, team, message }` to deliver it:
 * the button waits while it runs, a rejection shows its message, and once
 * it resolves the form clears, says `sent` and fires `lw-send`. Set
 * `--lw-color-primary` and `--lw-color-primary-foreground` on it to give the
 * send button a colour of its own.
 *
 * Topics and teams are `{ value, label }`.
 *
 * @attr {string} heading
 * @attr {string} description - A line under the headline; none when empty
 * @attr {Array<object>} topics (JSON)
 * @attr {Array<object>} teams (JSON)
 * @attr {string} person - Who reads the messages, named for their face
 * @attr {string} avatar - Their photo, an image's URL; drawn from the name when empty
 * @attr {string} secondary - The second action's label; none when empty
 * @attr {string} submit-label - The send button's label
 * @attr {string} sent - What the form says once sent
 * @fires lw-send - The form was sent; `detail` holds `name`, `email`, `topic`, `team` and `message`
 * @fires lw-action - The second action was pressed; `detail: { action }`, "secondary"
 * @csspart frame - The dashed frame
 */
export class LwBlueprintContact extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Contact' },
    description: { default: 'Sales, support and migrations. Write to us if you already know what you need.' },
    topics: { type: Object, default: DEMO_TOPICS },
    teams: { type: Object, default: DEMO_TEAMS },
    person: { default: 'Maya Okafor' },
    avatar: { default: '' },
    secondary: { default: 'Read the docs' },
    submitLabel: { default: 'Send message' },
    sent: { default: 'Thanks. We read every note and reply within one working day.' },
  };

  render() {
    return `<section class="frame" part="frame" aria-labelledby="heading"><header class="head"><h2 class="title" id="heading"></h2><p class="description"></p></header>
<form class="form" novalidate><div class="fields"><lw-text-input name="name" label="Name" placeholder="Name" autocomplete="name" required></lw-text-input><lw-text-input name="email" type="email" label="Email address" placeholder="Email address" autocomplete="email" required></lw-text-input>
<div class="pair"><lw-select class="topic" name="topic" label="Topic" placeholder="Topic"></lw-select><lw-select class="team" name="team" label="Team" placeholder="Team"></lw-select></div>
<div class="note"><span class="face" role="img"></span><lw-textarea name="message" label="Message" placeholder="Let us know how we can help" rows="4" required></lw-textarea></div>${STATUS_MARKUP}</div>
<div class="actions"><lw-button class="secondary" variant="outline"></lw-button><lw-button class="submit" type="submit"><span class="submit-label"></span><span slot="end">${strokeIcon(arrowRight, 16)}</span></lw-button></div></form></section>`;
  }

  connected() {
    connectContactForm(this, this.query('.form'), this.signal);
    this.query('.secondary').addEventListener('click', () => this.emit('action', { action: 'secondary' }), { signal: this.signal });
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.description').hidden = !this.description;
    this.query('.secondary').textContent = this.secondary ?? '';
    this.query('.secondary').hidden = !this.secondary;
    this.query('.submit-label').textContent = this.submitLabel ?? '';
    if (changed.has('topics')) this.query('.topic').options = Array.isArray(this.topics) ? this.topics : [];
    if (changed.has('teams')) this.query('.team').options = Array.isArray(this.teams) ? this.teams : [];
    if (changed.has('person') || changed.has('avatar')) {
      const face = this.query('.face');
      face.ariaLabel = this.person ?? '';
      if (this.avatar) face.innerHTML = `<img src="${escapeHtml(this.avatar)}" alt="" decoding="async">`;
      else drawFace(face, this.person);
    }
  }
}
