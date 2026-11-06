import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { check, clock, mail, search } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { paintHead, stepsStyles } from '../../core/steps.js';
import styles from './sticky-scroll-steps.scss?inline';

const DEMO_STEPS = [
  { id: 'capture', title: 'Capture anything', body: 'Forward emails and links straight into your list, and they arrive as tasks with the details kept.', mockup: 'inbox' },
  { id: 'plan', title: 'Plan the week', body: 'Drag tasks onto days and see at a glance which day is already full.', mockup: 'planner' },
  { id: 'review', title: 'Finish and review', body: 'A Friday summary shows what moved, what slipped and what to carry over.', mockup: 'review' },
];

// The line, this far down the box, that a picture crosses to make its step
// the current one.
const LINE = 0.35;

const windowMarkup = (title, content) => `<div class="window"><div class="chrome"><span class="dots"><i></i><i></i><i></i></span><span class="window-title">${title}</span></div><div class="window-body">${content}</div></div>`;

// Drawn product screens, for when there are no screenshots to show.
const MOCKUPS = {
  inbox: () =>
    windowMarkup(
      'Inbox',
      `<div class="toolbar"><span class="search">${strokeIcon(search, 12)}Search mail</span><span class="count">2 new tasks</span></div><ul class="mails">${[
        ['Invoice for October', 'Accounts', 'Due on the 30th', true],
        ['Notes from Tuesday’s call', 'Priya', 'Three follow-ups for us', true],
        ['Can we move the review?', 'Jonas', 'Thursday works better', false],
        ['Your trip on the 14th', 'Travel', 'Boarding passes attached', false],
        ['Weekly digest', 'Studio', 'Twelve updates this week', false],
      ]
        .map(([subject, from, preview, task]) => `<li class="mail${task ? ' task' : ''}"><span class="avatar">${from.charAt(0)}</span><span class="mail-text"><b>${subject}</b><span>${from} · ${preview}</span></span>${task ? `<span class="chip">${strokeIcon(check, 12, 2.5)}Task</span>` : `<span class="mail-icon">${strokeIcon(mail, 12)}</span>`}</li>`)
        .join('')}</ul>`,
    ),
  planner: () =>
    windowMarkup(
      'This week',
      `<div class="week">${[
        ['Mon', [['Client call', 2], ['Invoices', 1]]],
        ['Tue', [['Draft the deck', 3], ['Copy review', 1]]],
        ['Wed', [['Workshop', 3], ['Stand-up', 1], ['Hiring', 1], ['Deck fixes', 2]]],
        ['Thu', [['Focus time', 2]]],
        ['Fri', [['Release', 2], ['Retro', 1], ['Week review', 1]]],
      ]
        .map(([day, tasks], i) => `<div class="day${i === 2 ? ' full' : ''}"><span class="day-name">${day}</span>${tasks.map(([task, size]) => `<span class="slot" style="--size: ${size}">${task}</span>`).join('')}</div>`)
        .join('')}</div>`,
    ),
  review: () =>
    windowMarkup(
      'Friday review',
      `<div class="review"><div class="score"><b>18</b><span>tasks done</span></div><div class="meters">${[
        ['Moved', 82],
        ['Slipped', 18],
      ]
        .map(([label, value]) => `<div class="meter"><span>${label}</span><span class="meter-track"><span style="width: ${value}%"></span></span><span>${value}%</span></div>`)
        .join('')}</div><div class="days">${[
        ['M', 3],
        ['T', 5],
        ['W', 2],
        ['T', 4],
        ['F', 4],
      ]
        .map(([day, done]) => `<span class="day-bar" style="--done: ${done}"><i></i>${day}</span>`)
        .join('')}</div><ul class="outcomes"><li>${strokeIcon(check, 12, 2.5)}Ship the onboarding emails</li><li>${strokeIcon(check, 12, 2.5)}Book the venue</li><li class="late">${strokeIcon(clock, 12, 2.5)}Draft the budget</li></ul></div>`,
    ),
};
const KINDS = Object.keys(MOCKUPS);

/**
 * Steps beside the pictures that show them. The pictures scroll in a box of
 * their own; the step whose picture is in view lights up, opens its
 * description and fills its bar as you scroll through it, and choosing a
 * step scrolls straight to its picture. Every description stays in the
 * page, folded, so all of it can be found. With no screenshots, drawn
 * product screens stand in.
 *
 * Steps are `{ id, title, body, image?, alt?, mockup? }`: `image` a
 * screenshot's URL with `alt` describing it, or else `mockup`, one of
 * inbox, planner or review, drawn in its place.
 *
 * @attr {string} heading
 * @attr {string} lede
 * @attr {Array<object>} steps (JSON)
 * @fires lw-change - Another step became the current one; `detail: { index, id }`
 * @csspart steps - The list of steps
 * @csspart shots - The box the pictures scroll in
 * @cssprop --lw-sticky-scroll-steps-height - The box's height; 32.5rem by default
 */
export class LwStickyScrollSteps extends LwElement {
  static styles = [stepsStyles, styles];
  static props = {
    heading: { default: 'Everything scattered, finally in one view' },
    lede: { default: 'Three habits the app builds into your week, one screen at a time.' },
    steps: { type: Object, default: DEMO_STEPS },
  };

  #current = -1;
  #frame = 0;

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><h2 class="heading" id="heading"></h2><p class="lede"></p></header>
<div class="frame"><nav class="steps" part="steps" aria-label="How it works steps"><ol class="list"></ol></nav><div class="shots" part="shots" tabindex="0" role="region" aria-label="Screens"></div></div></section>`;
  }

  connected() {
    const options = { signal: this.signal };
    const shots = this.query('.shots');
    const track = () => {
      cancelAnimationFrame(this.#frame);
      this.#frame = requestAnimationFrame(() => this.#track());
    };
    shots.addEventListener('scroll', track, { ...options, passive: true });
    const observer = new ResizeObserver(track);
    observer.observe(shots);
    this.query('.list').addEventListener('click', (event) => {
      const button = event.target.closest('.step');
      if (button) this.#goTo(Number(button.dataset.index));
    }, options);
    // Beside the pictures, the wheel over the steps scrolls them while they
    // can scroll; above them on a narrow screen, it scrolls the page.
    const steps = this.query('.steps');
    steps.addEventListener('wheel', (event) => {
      const { scrollTop, scrollHeight, clientHeight } = shots;
      const room = event.deltaY > 0 ? scrollHeight - clientHeight - scrollTop : scrollTop;
      const beside = steps.getBoundingClientRect().right <= shots.getBoundingClientRect().left + 1;
      if (!beside || room < 1) return;
      event.preventDefault();
      shots.scrollBy({ top: event.deltaY, behavior: 'instant' });
    }, options);
    this.signal.addEventListener('abort', () => {
      observer.disconnect();
      cancelAnimationFrame(this.#frame);
    });
  }

  updated(changed) {
    paintHead(this);
    if (changed.has('steps')) this.#build();
  }

  get #steps() {
    return Array.isArray(this.steps) ? this.steps : [];
  }

  #build() {
    const steps = this.#steps;
    this.query('.list').innerHTML = steps
      .map((step, i) => {
        const number = String(i + 1).padStart(2, '0');
        return `<li><button class="step" type="button" data-index="${i}"><span class="bar" aria-hidden="true"><span class="fill"></span></span><span class="number">${number}</span><span class="title">${escapeHtml(step.title ?? '')}</span>
<span class="fold"><span class="body">${escapeHtml(step.body ?? '')}</span></span></button></li>`;
      })
      .join('');
    this.query('.shots').innerHTML = steps
      .map((step, i) => {
        const label = escapeHtml(step.alt ?? step.title ?? '');
        const picture = step.image
          ? `<img src="${escapeHtml(step.image)}" alt="${label}"${i ? ' loading="lazy"' : ''}>`
          : `<div class="mockup" role="img" aria-label="${label}">${(MOCKUPS[step.mockup] ?? MOCKUPS[KINDS[i % KINDS.length]])()}</div>`;
        return `<figure class="shot" data-index="${i}">${picture}</figure>`;
      })
      .join('');
    this.#current = -1;
    this.#track();
  }

  // The current step: the last picture whose top has crossed the line, or
  // the last of all once the box is scrolled to its end.
  #track() {
    const shots = this.query('.shots');
    const figures = [...shots.querySelectorAll('.shot')];
    if (!figures.length) return;
    const box = shots.getBoundingClientRect();
    const line = box.top + box.height * LINE;
    let index = 0;
    figures.forEach((figure, i) => {
      if (figure.getBoundingClientRect().top <= line) index = i;
    });
    if (shots.scrollTop + shots.clientHeight >= shots.scrollHeight - 2) index = figures.length - 1;
    // How far through its picture the line has come, for the bar.
    const rect = figures[index].getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
    const end = index === figures.length - 1 && shots.scrollTop + shots.clientHeight >= shots.scrollHeight - 2;
    for (const button of this.shadowRoot.querySelectorAll('.step')) {
      const i = Number(button.dataset.index);
      const active = i === index;
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      button.style.setProperty('--progress', String(i < index ? 1 : active ? (end ? 1 : progress) : 0));
    }
    if (index !== this.#current) {
      const first = this.#current < 0;
      this.#current = index;
      if (!first) this.emit('change', { index, id: this.#steps[index]?.id });
    }
  }

  #goTo(index) {
    const shots = this.query('.shots');
    const figure = shots.querySelector(`.shot[data-index="${index}"]`);
    if (!figure) return;
    const top = figure.getBoundingClientRect().top - shots.getBoundingClientRect().top + shots.scrollTop - 24;
    shots.scrollTo({ top, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
}
