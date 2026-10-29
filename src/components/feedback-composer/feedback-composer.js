import { escapeHtml } from '../../core/dom.js';
import { iconStyles, strokeIcon } from '../../core/icons.js';
import { arrowUp, chevronUp, tag } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { menuStyles } from '../../core/menu.js';
import { hueOf, initialsOf } from '../../core/people.js';
import { createPicker, pickerMarkup } from '../../core/picker.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import { swapStyles } from '../../core/swap.js';
import styles from './feedback-composer.scss?inline';

const DEMO_AREAS = [
  { value: 'runtime', label: 'Runtime' },
  { value: 'toolchain', label: 'Toolchain' },
  { value: 'profiler', label: 'Profiler' },
  { value: 'docs', label: 'Docs' },
];

const DEMO_REQUESTS = [
  { id: 1, title: 'Export profiler traces to Perfetto', area: 'profiler', votes: 214 },
  { id: 2, title: 'RISC-V target for the release builds', area: 'toolchain', votes: 187 },
  { id: 3, title: 'Arena allocator in the standard runtime', area: 'runtime', votes: 152 },
  { id: 4, title: 'Flame graph diff between two traces', area: 'profiler', votes: 131 },
  { id: 5, title: 'Reproducible builds by default', area: 'toolchain', votes: 118 },
  { id: 6, title: 'Man pages for every CLI command', area: 'docs', votes: 77 },
  { id: 7, title: 'Hot reload for long-running daemons', area: 'runtime', votes: 64 },
  { id: 8, title: 'Cross-compile from Windows without WSL', area: 'toolchain', votes: 47 },
];

const DEMO_TEAM = ['Ana Moreno', 'Jules Laurent', 'Sam Okafor', 'Priya Shah'];
const SIMILAR = 3;
const STOP_WORDS = new Set('the and for with from that this into add support'.split(' '));

const whole = new Intl.NumberFormat('en-US');
const wordsOf = (text) => (text.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []).filter((word) => !STOP_WORDS.has(word));

/**
 * A feature request box for a public roadmap. As the title is typed, the
 * open requests most like it appear underneath with their votes, so a
 * duplicate becomes an upvote instead; the area is picked from a menu.
 * Posting adds the request to the roadmap with your vote on it.
 *
 * Requests are `{ id, title, area, votes }`.
 *
 * @attr {string} roadmap - The roadmap's name
 * @attr {string} area - The area the request is for
 * @attr {Array<object>} areas - `{ value, label }` (JSON)
 * @attr {Array<object>} requests (JSON)
 * @attr {Array<string>} team (JSON)
 * @fires lw-request - A request was posted; `detail: { title, details, area }`
 * @fires lw-vote - A request was upvoted or the vote taken back; `detail: { id, voted }`
 */
export class LwFeedbackComposer extends LwElement {
  static styles = [iconStyles, menuStyles, rollingStyles, swapStyles, styles];
  static props = {
    roadmap: { default: 'LowerSoft roadmap' },
    area: { default: '' },
    areas: { type: Object, default: DEMO_AREAS },
    requests: { type: Object, default: DEMO_REQUESTS },
    team: { type: Object, default: DEMO_TEAM },
  };

  #voted = new Set();
  #added = [];
  #areaPicker;

  render() {
    return `<header class="head"><span class="faces"></span><p class="summary"><b class="roadmap-name"></b> · <span class="open"></span> · <span class="votes"><span class="visually-hidden"></span><span class="rolling" aria-hidden="true"></span></span></p></header>
<form class="box" novalidate><input class="title" type="text" placeholder="Request a feature" aria-label="Feature" autocomplete="off"><textarea class="details" rows="2" placeholder="What are you trying to do, and what gets in the way?" aria-label="Details"></textarea>
<div class="tools">${pickerMarkup('area-menu', { icon: strokeIcon(tag, 15) })}<button class="post" type="submit" aria-label="Post the request" disabled>${strokeIcon(arrowUp, 18)}</button></div></form>
<section class="similar" aria-labelledby="similar-title" hidden><h3 class="similar-title" id="similar-title">Already asked? Vote instead</h3><ul class="list"></ul></section><p class="posted" role="status"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    this.#areaPicker = createPicker(this.query('.picker'), this.signal, (value) => (this.area = value));
    this.query('.picker-trigger').setAttribute('aria-label', 'Area');
    const box = this.query('.box');
    box.addEventListener('input', () => this.#paint(), options);
    box.addEventListener('submit', (event) => {
      event.preventDefault();
      this.#post();
    }, options);
    this.query('.list').addEventListener('click', (event) => {
      const vote = event.target.closest('.vote');
      if (vote) this.#vote(Number(vote.dataset.id));
    }, options);
  }

  updated(changed) {
    if (changed.has('team')) this.query('.faces').innerHTML = (this.team ?? []).map((name) => `<span class="face" style="--_hue: ${hueOf(name)}">${escapeHtml(initialsOf(name))}</span>`).join('');
    this.query('.roadmap-name').textContent = this.roadmap ?? '';
    this.#areaPicker?.set([{ value: '', label: 'Area' }, ...this.areas], this.area ?? '');
    this.#paint();
  }

  get #all() {
    return [...this.#added, ...(this.requests ?? [])];
  }

  #votesOf(request) {
    return request.votes + (this.#voted.has(request.id) ? 1 : 0);
  }

  // The totals, the post button, and the open requests most like the title.
  #paint() {
    const all = this.#all;
    this.query('.open').textContent = `${all.length} open`;
    const votes = `${whole.format(all.reduce((sum, each) => sum + this.#votesOf(each), 0))} votes`;
    this.query('.votes .visually-hidden').textContent = votes;
    roll(this.query('.votes .rolling'), votes);
    const title = this.query('.title').value.trim();
    this.query('.post').disabled = title.length < 4;
    const words = wordsOf(title);
    const similar = words.length
      ? all
          .map((request) => ({ request, score: wordsOf(request.title).filter((word) => words.some((typed) => word.startsWith(typed) || typed.startsWith(word))).length }))
          .filter((each) => each.score && !this.#added.includes(each.request))
          .sort((a, b) => b.score - a.score || b.request.votes - a.request.votes)
          .slice(0, SIMILAR)
          .map((each) => each.request)
      : [];
    this.query('.similar').hidden = !similar.length;
    this.#paintList(similar);
  }

  #paintList(requests) {
    const areas = new Map(this.areas.map((area) => [area.value, area.label]));
    this.query('.list').innerHTML = requests
      .map((request) => {
        const voted = this.#voted.has(request.id);
        return `<li class="request"><button class="vote" type="button" data-id="${request.id}" aria-pressed="${voted}" aria-label="${voted ? 'Take back your vote for' : 'Vote for'} ${escapeHtml(request.title)}">${strokeIcon(chevronUp, 15)}<span class="vote-count">${whole.format(this.#votesOf(request))}</span></button><span class="request-title">${escapeHtml(request.title)}</span><span class="request-area">${escapeHtml(areas.get(request.area) ?? '')}</span></li>`;
      })
      .join('');
  }

  #vote(id) {
    const voted = !this.#voted.has(id);
    if (voted) this.#voted.add(id);
    else this.#voted.delete(id);
    this.#paint();
    this.query(`.vote[data-id="${id}"]`)?.focus();
    this.emit('vote', { id, voted });
  }

  #post() {
    const title = this.query('.title').value.trim();
    if (title.length < 4) return;
    const details = this.query('.details').value.trim();
    const request = { id: -(this.#added.length + 1), title, area: this.area, votes: 0 };
    this.#added.unshift(request);
    this.#voted.add(request.id);
    this.query('.box').reset();
    this.query('.posted').textContent = `Posted “${title}” with your vote on it.`;
    this.#paint();
    this.emit('request', { title, details, area: this.area });
  }
}
