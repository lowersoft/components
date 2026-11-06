import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { paintHead, stepsStyles } from '../../core/steps.js';
import styles from './taped-note-steps.scss?inline';

const TONES = ['rose', 'mint', 'gold', 'cyan'];

const DEMO_NOTES = [
  { id: 'listen', body: 'Tell us about the brand on a short kickoff call.', tone: 'rose', rotate: -3, tapeRotate: -2 },
  { id: 'explore', body: 'We sketch three directions and show them on Friday.', tone: 'mint', rotate: 4, tapeRotate: 1.5 },
  { id: 'refine', body: 'You pick one, and we grow it into a full system.', tone: 'gold', rotate: -2, tapeRotate: -1 },
  { id: 'handover', body: 'Files, guidelines and a recorded walkthrough arrive.', tone: 'cyan', rotate: 3, tapeRotate: 2 },
];

/**
 * The process on sticky notes: square notes, each tilted its own way and
 * held up by a strip of torn tape, a big serif number at the top and one
 * sentence at the bottom. The notes stay paper-light on a dark page too.
 *
 * Notes are `{ id, body, number?, tone?, rotate?, tapeRotate? }`: `tone`
 * one of rose, mint, gold or cyan, `rotate` and `tapeRotate` in degrees,
 * `number` counted from one by default. Four or eight fill the rows evenly.
 *
 * @attr {string} heading
 * @attr {string} lede
 * @attr {Array<object>} notes (JSON)
 * @csspart note - Each note
 */
export class LwTapedNoteSteps extends LwElement {
  static styles = [stepsStyles, styles];
  static props = {
    heading: { default: 'The process, step by step' },
    lede: { default: 'Four weeks from the first call to the final files, with a check-in at every step.' },
    notes: { type: Object, default: DEMO_NOTES },
  };

  render() {
    return '<section class="section" aria-labelledby="heading"><header class="head"><h2 class="heading" id="heading"></h2><p class="lede"></p></header><ol class="notes"></ol></section>';
  }

  updated(changed) {
    paintHead(this);
    if (changed.has('notes')) this.#build();
  }

  #build() {
    const notes = Array.isArray(this.notes) ? this.notes : [];
    this.query('.notes').innerHTML = notes
      .map((note, i) => {
        const tone = TONES.includes(note.tone) ? note.tone : TONES[i % TONES.length];
        // Tilted the other way from the note before, unless told.
        const rotate = Number(note.rotate ?? (i % 2 ? 3 : -3));
        const tape = Number(note.tapeRotate ?? (i % 2 ? -1.5 : 1.5));
        return `<li class="note" data-tone="${tone}" style="--rotate: ${rotate}deg; --tape: ${tape}deg"><span class="tape" aria-hidden="true"></span>
<div class="paper" part="note"><span class="number" aria-hidden="true">${escapeHtml(note.number ?? String(i + 1).padStart(2, '0'))}</span><p class="body">${escapeHtml(note.body ?? '')}</p></div></li>`;
      })
      .join('');
  }
}
