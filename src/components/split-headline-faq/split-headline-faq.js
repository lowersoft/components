import { accordionItem, connectAccordion, itemId, paintAccordion } from '../../core/accordion.js';
import { escapeHtml } from '../../core/dom.js';
import { LwElement } from '../../core/lw-element.js';
import styles from './split-headline-faq.scss?inline';

const DEMO_ITEMS = [
  { id: 'farm', question: 'Do I need to run my own build farm?', answer: 'No. Hosted runners come with every plan. Bring your own only when the code cannot leave your network.' },
  { id: 'toolchains', question: 'Which toolchains come preinstalled?', answer: 'GCC, Clang, MSVC and rustc, each in its last three releases, with the sysroots for every target lower ships. Pin a version in lower.toml and every runner uses it.' },
  { id: 'warm', question: 'Does a runner keep its cache between jobs?', answer: 'Each runner starts warm from the shared remote cache, so a fresh machine is as fast as one that ran the job before.' },
  { id: 'arm', question: 'Do you offer ARM and GPU runners?', answer: 'ARM64 runners in every region, and GPU runners in the EU and the US for teams that build and test CUDA code.' },
  { id: 'logs', question: 'How long are build logs kept?', answer: 'Ninety days on every plan, and as long as you like on Enterprise. Logs stay in the region the build ran in.' },
  { id: 'agent', question: 'How do I put a runner on our own network?', answer: 'Install the lower agent on a machine you own and register it with a token from Settings. It dials out, so no inbound ports need opening, and it picks up jobs like any hosted runner.' },
];

/**
 * A quiet FAQ under a headline in two lines. A muted eyebrow sits over the
 * headline, its lines broken where you break them, and the questions follow
 * in one column on hairline rows, with nothing else around them. One
 * answer is open at a time; its plus turns into a cross as the answer folds
 * open and its words ease in. The second answer is open to start with, so
 * the list reads as one that opens.
 *
 * Answers open at once with reduced motion, and the arrow keys move between
 * questions.
 *
 * Items are `{ question, answer, id? }`; without an id, one is made from the
 * question.
 *
 * @attr {string} eyebrow - The muted line above the headline; none when empty
 * @attr {string} heading - The headline; a line break starts its second line
 * @attr {Array<object>} items (JSON)
 * @attr {string} open - The open answer's id; the second when unset, none when empty
 * @fires lw-toggle - An answer opened or closed; `detail: { id, open }`
 */
export class LwSplitHeadlineFaq extends LwElement {
  static styles = styles;
  static props = {
    eyebrow: { default: 'The build farm' },
    heading: { default: 'Runners, caches,\nand the toolchain' },
    items: { type: Object, default: DEMO_ITEMS },
    open: {},
  };

  render() {
    return '<section class="section" aria-labelledby="heading"><p class="eyebrow"></p><h2 class="title" id="heading"></h2><div class="list"></div></section>';
  }

  connected() {
    connectAccordion(this, this.query('.list'), () => this.#open, this.signal);
  }

  updated(changed) {
    this.query('.eyebrow').textContent = this.eyebrow ?? '';
    this.query('.eyebrow').hidden = !this.eyebrow;
    if (changed.has('heading')) {
      this.query('.title').innerHTML = String(this.heading ?? '').split('\n').map((line) => `<span class="line">${escapeHtml(line)}</span>`).join(' ');
    }
    if (changed.has('items')) {
      this.query('.list').innerHTML = this.#items.map((item) => accordionItem(item, { icon: '<span class="cross" aria-hidden="true"></span>' })).join('');
    }
    paintAccordion(this.query('.list'), this.#open);
  }

  get #items() {
    return Array.isArray(this.items) ? this.items : [];
  }

  // The second answer is open until the visitor or `open` says otherwise.
  get #open() {
    const first = this.#items[1] ?? this.#items[0];
    return this.open ?? (first ? itemId(first) : '');
  }
}
