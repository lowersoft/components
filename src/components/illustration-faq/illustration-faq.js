import { accordionItem, connectAccordion, itemId, paintAccordion } from '../../core/accordion.js';
import { strokeIcon } from '../../core/icons.js';
import { chevronDown } from '../../core/lucide.js';
import { LwElement } from '../../core/lw-element.js';
import { watchVisibility } from '../../core/visibility.js';
import styles from './illustration-faq.scss?inline';

const DEMO_ITEMS = [
  { id: 'build-files', question: 'Do I have to rewrite my build files?', answer: 'No. lower reads CMake, Meson, Cargo and plain Makefiles as they are. Most repositories build on the first try, and the rest need a few lines in lower.toml.' },
  { id: 'cache-region', question: 'Where does the remote cache live?', answer: 'In the region you pick when you create the workspace: the EU, the US or APAC. Artifacts never leave it, and you decide how long they are kept.' },
  { id: 'shared-cache', question: 'Can the whole team share one cache?', answer: 'Yes. Every teammate and every runner reads from and writes to the same cache, so an object built once is never built again.' },
  { id: 'targets', question: 'Which platforms can I cross-compile for?', answer: 'Linux, macOS and Windows on x86-64 and ARM64, plus bare-metal ARM for firmware. One command builds every target you list.' },
  { id: 'reproducible', question: 'What if a build is not reproducible?', answer: 'lower flags the step whose output changed between two runs of the same commit and shows the input that drifted, down to the environment variable.' },
  { id: 'open-source', question: 'Is there a free plan for open source?', answer: 'Yes. Public repositories get the whole product free, with the same cache and runners as paying teams.' },
];

// A question mark drawn as one thick stroke: its curve, and the dot under it.
const CURVE = 'M60 84C60 48 88 30 116 30c30 0 52 20 52 48 0 27-21 38-39 50-14 9-21 20-21 40v16';
const SHEEN = 'M72 78c3-24 22-36 42-36';

let instances = 0;

/**
 * A FAQ beside a big question mark. On the left, the heading, a sentence
 * and the question mark, drawn as a glossy stroke with depth, floating
 * slowly between two outlined ghosts of itself; on the right, square
 * question cards. One answer is open at a time: its card fills, its chevron
 * turns and a dot marks each of its corners. On narrow screens the
 * illustration sits above the questions, smaller.
 *
 * The question mark takes the text colour, or `--lw-illustration-faq-accent`;
 * the floating rests off screen and with reduced motion, and answers open
 * at once with reduced motion. The arrow keys move between questions.
 *
 * Items are `{ question, answer, id? }`; without an id, one is made from the
 * question.
 *
 * @attr {string} heading
 * @attr {string} description
 * @attr {Array<object>} items (JSON)
 * @attr {string} open - The open answer's id; the first when unset, none when empty
 * @fires lw-toggle - An answer opened or closed; `detail: { id, open }`
 * @csspart illustration - The question mark
 * @cssprop --lw-illustration-faq-accent - The question mark's and the corner dots' colour; the text colour by default
 */
export class LwIllustrationFaq extends LwElement {
  static styles = styles;
  static props = {
    heading: { default: 'Frequently asked questions' },
    description: { default: 'What teams ask before they move their builds to lower, from the cache to the free plan.' },
    items: { type: Object, default: DEMO_ITEMS },
    open: {},
  };

  #id = `lw-faq-${++instances}`;

  render() {
    const id = this.#id;
    return `<section class="section" aria-labelledby="heading"><div class="side"><h2 class="title" id="heading"></h2><p class="description"></p>
<svg class="illustration" part="illustration" viewBox="0 0 320 300" aria-hidden="true"><defs><linearGradient id="${id}-body" x1="0" y1="0" x2="1" y2="1"><stop class="stop-light" offset="0"/><stop class="stop-mid" offset="0.55"/><stop class="stop-deep" offset="1"/></linearGradient></defs>
<g class="ghost ghost-left"><path d="${CURVE}"/><circle cx="108" cy="232" r="9"/></g><g class="ghost ghost-right"><path d="${CURVE}"/><circle cx="108" cy="232" r="9"/></g>
<g class="mark"><g class="depth"><path d="${CURVE}"/><circle cx="108" cy="232" r="23"/></g><g class="body" style="--_fill: url(#${id}-body)"><path d="${CURVE}"/><circle cx="108" cy="232" r="23"/></g><path class="sheen" d="${SHEEN}"/><circle class="glint" cx="100" cy="224" r="6"/></g></svg></div>
<div class="list"></div></section>`;
  }

  connected() {
    connectAccordion(this, this.query('.list'), () => this.#open, this.signal);
    watchVisibility(this, (visible) => this.toggleAttribute('data-paused', !visible), this.signal);
  }

  updated(changed) {
    this.query('.title').textContent = this.heading ?? '';
    this.query('.description').textContent = this.description ?? '';
    this.query('.description').hidden = !this.description;
    if (changed.has('items')) {
      this.query('.list').innerHTML = this.#items.map((item) => accordionItem(item, { icon: strokeIcon(chevronDown, 14) })).join('');
    }
    paintAccordion(this.query('.list'), this.#open);
  }

  get #items() {
    return Array.isArray(this.items) ? this.items : [];
  }

  // The first answer is open until the visitor or `open` says otherwise.
  get #open() {
    return this.open ?? (this.#items[0] ? itemId(this.#items[0]) : '');
  }
}
