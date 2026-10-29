import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { check, fileText, upload } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import '../button/index.js';
import '../text-input/index.js';
import styles from './job-listing-card.scss?inline';

const TRACK = ['Applied', 'In review', 'Interview'];
const UNDO_MS = 8000;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

const thousands = (value, currency) => new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 0 }).format(value);

/**
 * A job post you apply to without leaving the card. The salary band sits on
 * the market range with the median marked; Quick apply folds the card into
 * a short form with a résumé drop, and sending it shows an Applied status
 * track, with Undo for a few seconds.
 *
 * @attr {string} company
 * @attr {string} title
 * @attr {string} location
 * @attr {string} kind - e.g. "Full-time"
 * @attr {string} posted - e.g. "3 days ago"
 * @attr {Array<string>} tags (JSON)
 * @attr {object} salary - `{ min, max }` of the band (JSON)
 * @attr {object} market - `{ min, max, median }` for the role (JSON)
 * @attr {string} currency - ISO 4217 code
 * @fires lw-apply - The application was sent; `detail: { name, email, file }`
 * @fires lw-withdraw - The application was undone
 */
export class LwJobListingCard extends LwElement {
  static styles = styles;
  static props = {
    company: { default: 'LowerSoft' },
    title: { default: 'Senior Systems Engineer' },
    location: { default: 'Remote · Europe' },
    kind: { default: 'Full-time' },
    posted: { default: '3 days ago' },
    tags: { type: Object, default: ['C', 'SIMD', 'Profiling'] },
    salary: { type: Object, default: { min: 110_000, max: 135_000 } },
    market: { type: Object, default: { min: 70_000, max: 165_000, median: 118_000 } },
    currency: { default: 'EUR' },
  };

  #stage = 'listing';
  #file = null;
  #undoTimer = 0;

  render() {
    return `<div class="top"><span class="logo" aria-hidden="true"></span><div class="org"><p class="company"></p><p class="posted"></p></div></div>
<p class="title"></p><p class="meta"></p><ul class="tags"></ul>
<div class="pay"><p class="pay-head"><span class="band-text"></span><span class="median-text"></span></p><div class="range" aria-hidden="true"><span class="band"></span><span class="median"></span></div><p class="ends"><span class="lo"></span><span class="hi"></span></p></div>
<div class="stage listing"><lw-button class="quick">Quick apply</lw-button></div>
<form class="stage apply" hidden novalidate><lw-text-input class="applicant" label="Name" name="name" required autocomplete="name"></lw-text-input><lw-text-input class="email" label="Email" name="email" type="email" required autocomplete="email"></lw-text-input>
<label class="drop"><input type="file" accept=".pdf,.doc,.docx" hidden><span class="drop-icon">${strokeIcon(upload, 18)}</span><span class="drop-text">Drop your résumé, or <u>browse</u></span><span class="drop-note">PDF or Word, up to 10 MB</span></label>
<div class="form-actions"><lw-button class="cancel" variant="ghost" type="button">Cancel</lw-button><lw-button class="send" type="submit">Send application</lw-button></div></form>
<div class="stage applied" hidden><ol class="track">${TRACK.map((step) => `<li><span class="dot">${strokeIcon(check, 12)}</span>${step}</li>`).join('')}</ol><p class="applied-text" aria-live="polite"></p><button class="undo" type="button">Undo</button></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.query('.quick').addEventListener('click', () => this.#go('apply'), options);
    this.query('.cancel').addEventListener('click', () => this.#go('listing'), options);
    this.query('.apply').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#send();
    }, options);
    const drop = this.query('.drop');
    const input = drop.querySelector('input');
    input.addEventListener('change', () => this.#setFile(input.files[0]), options);
    drop.addEventListener('dragover', (event) => {
      event.preventDefault();
      drop.toggleAttribute('data-over', true);
    }, options);
    drop.addEventListener('dragleave', () => drop.removeAttribute('data-over'), options);
    drop.addEventListener('drop', (event) => {
      event.preventDefault();
      drop.removeAttribute('data-over');
      this.#setFile(event.dataTransfer.files[0]);
    }, options);
    this.query('.undo').addEventListener('click', () => this.#undo(), options);
    this.signal.addEventListener('abort', () => clearTimeout(this.#undoTimer));
  }

  updated() {
    const logo = this.query('.logo');
    logo.textContent = (this.company ?? '?').charAt(0);
    this.query('.company').textContent = this.company ?? '';
    this.query('.posted').textContent = this.posted ?? '';
    this.query('.title').textContent = this.title ?? '';
    this.query('.meta').textContent = [this.location, this.kind].filter(Boolean).join(' · ');
    this.query('.tags').innerHTML = (this.tags ?? []).map((tag) => `<li>${escapeHtml(tag)}</li>`).join('');
    // The band and the median on the market's range.
    const { min, max, median } = this.market;
    const at = (value) => `${(((value - min) / (max - min)) * 100).toFixed(2)}%`;
    const range = this.query('.range');
    range.style.setProperty('--_from', at(this.salary.min));
    range.style.setProperty('--_to', at(this.salary.max));
    range.style.setProperty('--_median', at(median));
    this.query('.band-text').textContent = `${thousands(this.salary.min, this.currency)} – ${thousands(this.salary.max, this.currency)}`;
    this.query('.median-text').textContent = `Market median ${thousands(median, this.currency)}`;
    this.query('.lo').textContent = thousands(min, this.currency);
    this.query('.hi').textContent = thousands(max, this.currency);
  }

  // Each stage folds into the next: the card's height eases between them.
  #go(stage) {
    const from = this.query(`.stage.${this.#stage}`);
    const to = this.query(`.stage.${stage}`);
    const before = this.offsetHeight;
    from.hidden = true;
    to.hidden = false;
    this.#stage = stage;
    this.dataset.stage = stage;
    if (!reducedMotion.matches) {
      this.animate([{ height: `${before}px` }, { height: `${this.offsetHeight}px` }], { duration: 300, easing: EASE_OUT });
      to.animate([{ opacity: 0, translate: '0 6px' }, { opacity: 1, translate: '0 0' }], { duration: 260, delay: 60, easing: EASE_OUT, fill: 'backwards' });
    }
    if (stage === 'apply') this.query('.applicant').focus();
    if (stage === 'listing') this.query('.quick').focus();
  }

  #setFile(file) {
    if (!file) return;
    this.#file = file;
    const drop = this.query('.drop');
    drop.toggleAttribute('data-file', true);
    drop.querySelector('.drop-icon').innerHTML = strokeIcon(fileText, 18);
    drop.querySelector('.drop-text').textContent = file.name;
    drop.querySelector('.drop-note').textContent = `${Math.max(1, Math.round(file.size / 1024))} KB · click to replace`;
  }

  #send() {
    const name = this.query('.applicant');
    const email = this.query('.email');
    if (!name.reportValidity() || !email.reportValidity()) return;
    this.#go('applied');
    const first = name.value.trim().split(' ')[0];
    this.query('.applied-text').textContent = `Thanks, ${first}. ${this.company} usually replies within a week.`;
    // The first step lands, then the track waits on review.
    const steps = this.shadowRoot.querySelectorAll('.track li');
    steps.forEach((li, i) => (li.dataset.state = i === 0 ? 'done' : i === 1 ? 'next' : 'pending'));
    const undo = this.query('.undo');
    undo.hidden = false;
    clearTimeout(this.#undoTimer);
    this.#undoTimer = setTimeout(() => (undo.hidden = true), UNDO_MS);
    this.emit('apply', { name: name.value, email: email.value, file: this.#file });
  }

  #undo() {
    clearTimeout(this.#undoTimer);
    this.#go('apply');
    this.emit('withdraw');
  }
}
