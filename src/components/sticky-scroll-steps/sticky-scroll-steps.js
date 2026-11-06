import { escapeHtml } from '../../core/dom.js';
import { strokeIcon } from '../../core/icons.js';
import { check, clock, lock, mail, search } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { paintHead, stepsStyles } from '../../core/steps.js';
import styles from './sticky-scroll-steps.scss?inline';

const DEMO_STEPS = [
  {
    id: 'capture',
    title: 'Capture anything',
    body: 'Forward an email or paste a link, and it lands in your list as a task with every detail kept.',
    points: ['A private address for forwarding', 'Attachments come along'],
    mockup: 'inbox',
  },
  {
    id: 'plan',
    title: 'Plan the week',
    body: 'Drag tasks onto days and see at a glance which day is already full before you promise more.',
    points: ['A warning before a day overflows', 'Meetings pulled from your calendar'],
    mockup: 'planner',
  },
  {
    id: 'review',
    title: 'Finish and review',
    body: 'A Friday summary shows what moved, what slipped and what to carry into next week.',
    points: ['One tap to carry tasks over', 'A week-by-week history'],
    mockup: 'review',
  },
];

const tick = strokeIcon(check, 12, 2.5);

// Drawn product screens, for steps without a screenshot: each fills the
// window it is shown in and scales with it.
const MOCKUPS = {
  inbox: {
    path: 'inbox',
    html: () =>
      `<div class="toolbar"><span class="search">${strokeIcon(search, 12)}Search mail</span><span class="count">2 new tasks</span></div><ul class="mails">${[
        ['Invoice for October', 'Accounts', 'Due on the 30th', true],
        ['Notes from Tuesday’s call', 'Priya', 'Three follow-ups for us', true],
        ['Can we move the review?', 'Jonas', 'Thursday works better', false],
        ['Your trip on the 14th', 'Travel', 'Boarding passes attached', false],
        ['Weekly digest', 'Studio', 'Twelve updates this week', false],
      ]
        .map(([subject, from, preview, task]) => `<li class="mail${task ? ' task' : ''}"><span class="avatar">${from.charAt(0)}</span><span class="mail-text"><b>${subject}</b><span>${from} · ${preview}</span></span>${task ? `<span class="chip">${tick}Task</span>` : `<span class="mail-icon">${strokeIcon(mail, 12)}</span>`}</li>`)
        .join('')}</ul>`,
  },
  planner: {
    path: 'week',
    html: () =>
      `<div class="week">${[
        ['Mon', [['Client call', 2], ['Invoices', 1]]],
        ['Tue', [['Draft the deck', 3], ['Copy review', 1]]],
        ['Wed', [['Workshop', 3], ['Stand-up', 1], ['Hiring', 1], ['Deck fixes', 2]]],
        ['Thu', [['Focus time', 2]]],
        ['Fri', [['Release', 2], ['Retro', 1], ['Week review', 1]]],
      ]
        .map(([day, tasks], i) => `<div class="day${i === 2 ? ' full' : ''}"><span class="day-name">${day}</span>${tasks.map(([task, size]) => `<span class="slot${size > 1 ? ' tall' : ''}" style="--size: ${size}">${task}</span>`).join('')}</div>`)
        .join('')}</div>`,
  },
  review: {
    path: 'review',
    html: () =>
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
        .join('')}</div><ul class="outcomes"><li>${tick}Ship the onboarding emails</li><li>${tick}Book the venue</li><li class="late">${strokeIcon(clock, 12, 2.5)}Draft the budget</li></ul></div>`,
  },
};
const KINDS = Object.keys(MOCKUPS);

/**
 * Steps told as the page scrolls. The steps run down the left, each its
 * own stretch of the page, while a product screen stays in view beside
 * them and changes, with a soft cross-fade, to the step crossing the
 * middle of the window; a rail beside the steps fills as you go. On a
 * narrow screen each step shows its screen under it instead. There is no
 * scroll box to get stuck in: the page itself scrolls.
 *
 * Steps are `{ id, title, body, points?, image?, alt?, mockup? }`: `points`
 * a short list under the body, `image` a screenshot's URL with `alt`
 * describing it, or else `mockup`, one of inbox, planner or review, drawn
 * in its place.
 *
 * @attr {string} heading
 * @attr {string} lede
 * @attr {string} address - The address shown in the screen's bar
 * @attr {Array<object>} steps (JSON)
 * @fires lw-change - Another step became the current one; `detail: { index, id }`
 * @csspart step - Each step's text
 * @csspart screen - Each step's screen
 * @cssprop --lw-sticky-scroll-steps-height - The screen's height beside the steps; up to 34rem by default
 */
export class LwStickyScrollSteps extends LwElement {
  static styles = [stepsStyles, styles];
  static props = {
    heading: { default: 'Everything scattered, finally in one view' },
    lede: { default: 'Three habits the app builds into your week, one screen at a time.' },
    address: { default: 'app.lowersoft.com' },
    steps: { type: Object, default: DEMO_STEPS },
  };

  #current = -1;
  #frame = 0;
  #observer = null;

  render() {
    return `<section class="section" aria-labelledby="heading"><header class="head"><h2 class="heading" id="heading"></h2><p class="lede"></p></header>
<div class="story"><div class="rail" aria-hidden="true"><span class="rail-fill"></span></div><div class="list"></div></div></section>`;
  }

  connected() {
    // The step whose text crosses the middle of the window is the current one.
    this.#observer = new IntersectionObserver((entries) => {
      const crossing = entries.filter((entry) => entry.isIntersecting).map((entry) => Number(entry.target.dataset.index));
      if (crossing.length) this.#activate(Math.max(...crossing));
    }, { rootMargin: '-50% 0px -50% 0px' });
    this.#watch();
    const update = () => {
      cancelAnimationFrame(this.#frame);
      this.#frame = requestAnimationFrame(() => this.#fillRail());
    };
    addEventListener('scroll', update, { passive: true, signal: this.signal });
    const resize = new ResizeObserver(update);
    resize.observe(this.query('.list'));
    this.signal.addEventListener('abort', () => {
      this.#observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(this.#frame);
    });
  }

  updated(changed) {
    paintHead(this);
    if (changed.has('steps') || changed.has('address')) this.#build();
  }

  get #steps() {
    return Array.isArray(this.steps) ? this.steps : [];
  }

  // Each step's text, then its screen, so a narrow screen reads them in turn.
  #build() {
    const steps = this.#steps;
    const address = escapeHtml(this.address ?? '');
    const list = this.query('.list');
    list.style.setProperty('--_count', String(steps.length || 1));
    list.innerHTML = steps
      .map((step, i) => {
        const number = String(i + 1).padStart(2, '0');
        const points = (step.points ?? []).length ? `<ul class="points">${step.points.map((point) => `<li>${tick}${escapeHtml(point)}</li>`).join('')}</ul>` : '';
        const kind = MOCKUPS[step.mockup] ? step.mockup : KINDS[i % KINDS.length];
        const label = escapeHtml(step.alt ?? step.title ?? '');
        const screen = step.image ? `<img class="shot" src="${escapeHtml(step.image)}" alt="${label}"${i ? ' loading="lazy"' : ''}>` : `<div class="mockup" role="img" aria-label="${label}">${MOCKUPS[kind].html()}</div>`;
        const path = step.image ? '' : `/${MOCKUPS[kind].path}`;
        return `<article class="step" part="step" data-index="${i}" style="--row: ${i + 1}" aria-labelledby="step-${i}"><span class="node" aria-hidden="true"></span><span class="number" aria-hidden="true">${number}</span><h3 class="title" id="step-${i}">${escapeHtml(step.title ?? '')}</h3><p class="body">${escapeHtml(step.body ?? '')}</p>${points}</article>
<figure class="stage" part="screen" data-index="${i}"><div class="window"><div class="chrome" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span><span class="address">${strokeIcon(lock, 10, 2.5)}${address}${path}</span></div><div class="pane">${screen}</div></div></figure>`;
      })
      .join('');
    this.#current = -1;
    this.#activate(0, true);
    this.#watch();
    this.#fillRail();
  }

  #watch() {
    if (!this.#observer) return;
    this.#observer.disconnect();
    for (const step of this.shadowRoot.querySelectorAll('.step')) this.#observer.observe(step);
  }

  #activate(index, quiet = false) {
    if (index === this.#current) return;
    this.#current = index;
    for (const element of this.shadowRoot.querySelectorAll('.step, .stage')) {
      const i = Number(element.dataset.index);
      element.toggleAttribute('data-active', i === index);
      element.toggleAttribute('data-past', i < index);
    }
    if (!quiet) this.emit('change', { index, id: this.#steps[index]?.id });
  }

  // The rail fills from the first step's node to the last as the middle of
  // the window passes them.
  #fillRail() {
    const nodes = [...this.shadowRoot.querySelectorAll('.node')];
    if (!nodes.length) return;
    const first = nodes[0].getBoundingClientRect().top;
    const span = nodes.at(-1).getBoundingClientRect().top - first;
    const progress = span > 0 ? (innerHeight / 2 - first) / span : 0;
    const rail = this.query('.rail');
    // Laid along the nodes, centre to centre.
    const offset = first + nodes[0].offsetHeight / 2 - this.query('.story').getBoundingClientRect().top;
    rail.style.setProperty('--_top', `${offset}px`);
    rail.style.setProperty('--_span', `${Math.max(0, span)}px`);
    rail.style.setProperty('--progress', String(Math.min(1, Math.max(0, progress))));
  }
}
