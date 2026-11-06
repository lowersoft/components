import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import { paintHead, stepsStyles } from '../../core/steps.js';
import styles from './pinned-note-steps.scss?inline';

const TONES = ['red', 'green', 'yellow', 'blue'];

const DEMO_NOTES = [
  { id: 'idea', title: 'Idea', body: 'Write the one sentence the piece has to earn.', tone: 'red', rotate: 2 },
  { id: 'outline', title: 'Outline', body: 'Put the points in order before writing any of them.', tone: 'green', rotate: -3 },
  { id: 'draft', title: 'Draft', body: 'Write it straight through, fast, without looking back.', tone: 'yellow', rotate: 2 },
  { id: 'edit', title: 'Edit', body: 'Cut a third, then read the rest out loud.', tone: 'blue', rotate: 3 },
  { id: 'review', title: 'Review', body: 'Hand it to someone who will tell you the truth.', tone: 'red', rotate: -2 },
  { id: 'publish', title: 'Publish', body: 'Ship it, then start a list for the next one.', tone: 'green', rotate: 2.5 },
];

/**
 * Steps pinned to a page of ruled paper: notes alternate left and right,
 * each tilted a little and held by a glossy push pin, with a big serif
 * number, a short title and a sentence. A dashed path snakes across the
 * gap from each note to the next, worked out from where the notes sit, so
 * any number of them fits. Point at a note and it swings on its pin. Phones show the
 * notes in one column. The notes stay paper-light on a dark page too.
 *
 * Notes are `{ id, title, body, number?, tone?, rotate? }`: `tone` one of
 * red, green, yellow or blue, `rotate` in degrees, `number` counted from
 * one by default.
 *
 * @attr {string} heading
 * @attr {string} lede
 * @attr {Array<object>} notes (JSON)
 * @csspart page - The ruled page
 * @csspart note - Each note
 */
export class LwPinnedNoteSteps extends LwElement {
  static styles = [stepsStyles, styles];
  static props = {
    heading: { default: 'One page at a time' },
    lede: { default: 'Six steps from a blank page to something worth reading, the same every time.' },
    notes: { type: Object, default: DEMO_NOTES },
  };

  render() {
    return `<section class="page" part="page" aria-labelledby="heading"><header class="head"><h2 class="heading" id="heading"></h2><p class="lede"></p></header>
<div class="board"><svg class="path" aria-hidden="true"><path/></svg><ol class="notes"></ol></div></section>`;
  }

  connected() {
    const observer = new ResizeObserver(() => this.#trace());
    observer.observe(this.query('.notes'));
    this.signal.addEventListener('abort', () => observer.disconnect());
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
        const rotate = Number(note.rotate ?? (i % 2 ? -2.5 : 2.5));
        return `<li class="note" data-tone="${tone}" style="--rotate: ${rotate}deg; --start: ${i * 2 + 1}"><div class="card" part="note"><span class="pin" aria-hidden="true"></span>
<span class="number" aria-hidden="true">${escapeHtml(note.number ?? String(i + 1).padStart(2, '0'))}</span><h3 class="title">${escapeHtml(note.title ?? '')}</h3><p class="body">${escapeHtml(note.body ?? '')}</p></div></li>`;
      })
      .join('');
    this.#trace();
  }

  // The dashed path: from each note's inner edge, a little below its middle,
  // an S across the gap to the next note's inner edge, a little above its
  // middle, so the line snakes down between the columns.
  #trace() {
    const list = this.query('.notes');
    const svg = this.query('.path');
    const notes = [...list.children];
    const edge = (note, toward, at) => ({
      x: toward > note.offsetLeft ? note.offsetLeft + note.offsetWidth : note.offsetLeft,
      y: note.offsetTop + note.offsetHeight * at,
    });
    const links = notes.slice(1).map((note, i) => {
      const last = notes[i];
      const from = edge(last, note.offsetLeft, 0.62);
      const to = edge(note, last.offsetLeft, 0.38);
      const middle = (from.x + to.x) / 2;
      return `M${from.x} ${from.y}C${middle} ${from.y} ${middle} ${to.y} ${to.x} ${to.y}`;
    });
    svg.setAttribute('viewBox', `0 0 ${list.offsetWidth} ${list.offsetHeight}`);
    svg.querySelector('path').setAttribute('d', links.join(''));
    svg.toggleAttribute('data-empty', !links.length);
  }
}
