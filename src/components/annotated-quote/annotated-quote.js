import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { arrowUpRight } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { companyMarkup, drawFace, quoteMarkup } from '../../core/testimonial.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './annotated-quote.scss?inline';

const DEMO_STORY = {
  company: { name: 'Northwind', color: '#3b6ef5' },
  chips: ['Developer tools', '42 engineers', 'Switched in March 2026'],
  quote: 'We moved the whole product onto one runtime in a quarter. ==1:Builds got faster==, ==2:on-call stopped being about memory==, and for the first time ==3:every service passed our sanitizer run== before launch, not after.',
  notes: [
    { color: '#3b6ef5', figure: '−41%', label: 'median build time, CI to preview', before: { value: 11.2, text: '11.2 min' }, after: { value: 6.6, text: '6.6 min' } },
    { color: '#d6409f', figure: '−60%', label: 'memory pages per on-call week', before: { value: 85, text: '85' }, after: { value: 34, text: '34' } },
    { color: '#12a594', figure: '2', label: 'sanitizer findings at launch', before: { value: 40, text: '40' }, after: { value: 2, text: '2' } },
  ],
  person: { name: 'Maya Okafor', role: 'Staff Engineer, Northwind' },
  link: { label: 'Read the Northwind case study', href: '#' },
};

/**
 * A quote whose claims carry their proof. Each marked phrase is numbered
 * and tinted, and the panel beside it shows the number behind it, before
 * and after. Pointing at or focusing a phrase lights its proof, and the
 * other way round; the bars grow when the quote comes into view.
 *
 * The story is `{ company: { name, color }, chips, quote, notes, person:
 * { name, role }, link?: { label, href } }`; the quote marks phrases as
 * `==1:words==`, and notes are `{ color, figure, label, before, after }`,
 * `before` and `after` as `{ value, text }`.
 *
 * @attr {object} story (JSON)
 * @attr {number} active - The note lit, from 1; 0 for none
 */
export class LwAnnotatedQuote extends LwElement {
  static styles = styles;
  static props = {
    story: { type: Object, default: DEMO_STORY },
    active: { type: Number, default: 0, reflect: true },
  };

  render() {
    return `<div class="layout"><div class="main"><header class="head"><span class="company-slot"></span><ul class="chips"></ul></header><blockquote class="text"></blockquote>
<footer class="foot"><div class="person"><span class="face"></span><span><span class="person-name"></span><span class="person-role"></span></span></div><a class="link"><span class="link-text"></span>${strokeIcon(arrowUpRight, 14)}</a></footer></div>
<aside class="notes" aria-label="The numbers"></aside></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const light = (event) => {
      const target = event.target.closest('[data-note]');
      this.active = target ? Number(target.dataset.note) : 0;
    };
    for (const type of ['pointerover', 'focusin']) this.shadowRoot.addEventListener(type, light, options);
    for (const type of ['pointerleave', 'focusout']) this.query('.layout').addEventListener(type, () => (this.active = 0), options);
    // The bars grow once the quote is in view.
    watchVisibility(this, (visible) => visible && this.setAttribute('data-shown', ''), this.signal);
  }

  updated(changed) {
    const story = this.story ?? {};
    if (changed.has('story')) {
      this.query('.company-slot').innerHTML = companyMarkup(story.company);
      this.query('.chips').innerHTML = (story.chips ?? []).map((chip) => `<li>${escapeHtml(chip)}</li>`).join('');
      this.query('.text').innerHTML = quoteMarkup(story.quote ?? '');
      drawFace(this.query('.face'), story.person?.name);
      this.query('.person-name').textContent = story.person?.name ?? '';
      this.query('.person-role').textContent = story.person?.role ?? '';
      const link = this.query('.link');
      link.hidden = !story.link;
      link.href = story.link?.href ?? '#';
      this.query('.link-text').textContent = story.link?.label ?? '';
      this.#buildNotes();
    }
    for (const element of this.shadowRoot.querySelectorAll('[data-note]')) element.toggleAttribute('data-active', Number(element.dataset.note) === this.active);
    this.query('.layout').toggleAttribute('data-lit', this.active > 0);
  }

  #buildNotes() {
    const notes = this.story.notes ?? [];
    this.query('.notes').innerHTML = notes
      .map((note, i) => {
        const n = i + 1;
        const max = Math.max(note.before.value, note.after.value) || 1;
        return `<section class="note-card" id="note-${n}" data-note="${n}" tabindex="0" style="--_tint: ${escapeHtml(note.color)}"><span class="number" aria-hidden="true">${n}</span><p class="figure">${escapeHtml(note.figure)}</p><p class="label">${escapeHtml(note.label)}</p>
<div class="compare"><span class="track"><span class="fill before" style="--_share: ${note.before.value / max}"></span></span><span class="value"><span class="visually-hidden">Before: </span>${escapeHtml(note.before.text)}</span>
<span class="track"><span class="fill after" style="--_share: ${note.after.value / max}"></span></span><span class="value"><span class="visually-hidden">After: </span>${escapeHtml(note.after.text)}</span></div></section>`;
      })
      .join('');
    // Each phrase takes its note's colour and points at it.
    for (const mark of this.shadowRoot.querySelectorAll('mark[data-note]')) {
      const note = notes[Number(mark.dataset.note) - 1];
      if (!note) continue;
      mark.style.setProperty('--_tint', note.color);
      mark.tabIndex = 0;
      mark.setAttribute('aria-describedby', `note-${mark.dataset.note}`);
    }
  }
}
