import { reducedMotion, vibrate } from '../../core/motion.js';
import { roll, rollingStyles } from '../../core/rolling.js';
import { LwButton } from '../button/button.js';
import styles from './reaction-button.scss?inline';

const HOLD_DELAY = 350; // ms pressed before the tray opens
const LEAVE_DELAY = 300; // ms after the mouse leaves before the tray closes, to cross over to it
const STACK_SIZE = 3;
const POP = { scale: [0.4, 1.2, 1], opacity: [0, 1, 1] };

const LIKE_ICON =
  '<svg class="icon like-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v12M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 8A2 2 0 0 1 17.4 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9Z"/></svg>';

const DEFAULT_OPTIONS = [
  { emoji: '👍', name: 'Like' },
  { emoji: '❤️', name: 'Love' },
  { emoji: '😂', name: 'Haha' },
  { emoji: '😮', name: 'Wow' },
  { emoji: '😢', name: 'Sad' },
  { emoji: '🙏', name: 'Thanks' },
];

const numberFormat = new Intl.NumberFormat(undefined, { numberingSystem: 'latn' });

const inkOffsets = new Map();
let measure = null;

// Emoji fonts draw their glyphs off the middle of the text box, by an amount
// that differs per platform and per emoji. Measure where the ink sits once
// and shift it to the middle, so every emoji centers like an icon.
const centerEmoji = (node) => {
  const { fontSize, fontFamily } = getComputedStyle(node);
  const font = `${fontSize} ${fontFamily}`;
  const key = font + node.textContent;
  let offset = inkOffsets.get(key);
  if (offset === undefined) {
    measure ??= document.createElement('canvas').getContext('2d');
    measure.font = font;
    const metrics = measure.measureText(node.textContent);
    const inkMiddle = (metrics.actualBoundingBoxDescent - metrics.actualBoundingBoxAscent) / 2;
    const boxMiddle = (metrics.fontBoundingBoxDescent - metrics.fontBoundingBoxAscent) / 2;
    offset = inkMiddle - boxMiddle;
    inkOffsets.set(key, offset);
  }
  node.style.translate = `0 ${-offset.toFixed(2)}px`;
};

/**
 * Tap to like, or press and hold to slide across a tray of reactions and let
 * go on the one you want. On desktop, hovering the button opens the tray. The most used reactions sit beside the count, and yours
 * joins them. From the keyboard, ↑ opens the tray, ← → choose and Enter picks.
 *
 * @attr {string} value - Your reaction, one of the options' emoji
 * @attr {object} reactions - JSON counts by emoji, not counting yours, e.g. `{"👍": 12, "❤️": 4}`
 * @attr {object[]} options - JSON list of `{ emoji, name }`; the first is the one a tap adds
 * @attr {string} label - Shown before you react
 * @attr {string} count-label - Read after the count, e.g. "reactions"
 * @attr {string} tray-label - Accessible name of the tray
 * @csspart tray - The tray of reactions
 * @fires lw-change - Before your reaction changes. `detail.value` is the new one, or null when removed. Cancelable.
 */
export class LwReactionButton extends LwButton {
  static styles = [...LwButton.styles, rollingStyles, styles];
  static props = {
    ...LwButton.props,
    value: { reflect: true },
    reactions: { type: Object, default: {} },
    options: { type: Object, default: DEFAULT_OPTIONS },
    label: { default: 'Like' },
    countLabel: { default: 'reactions' },
    trayLabel: { default: 'Reactions' },
  };

  #mode = null; // how the tray was opened: 'hold', 'hover' or 'keyboard'
  #held = false;
  #holdTimer = 0;
  #leaveTimer = 0;
  #shownStack = [];

  render() {
    return `<button class="button" part="button" type="button" aria-haspopup="menu" aria-controls="tray" aria-expanded="false" aria-keyshortcuts="ArrowUp"><span class="mine" aria-hidden="true">${LIKE_ICON}<span class="chosen"></span></span><span class="reaction-label"></span><span class="summary" aria-hidden="true"><span class="stack"></span><span class="count rolling"></span></span></button><div class="tray" part="tray" id="tray" role="menu" hidden></div><span class="live" aria-live="polite"></span>`;
  }

  connected() {
    super.connected();
    const button = this.query('.button');
    const tray = this.query('.tray');
    const options = { signal: this.signal };

    button.addEventListener('pointerdown', this.#onPointerDown, options);
    button.addEventListener('pointermove', this.#onPointerMove, options);
    button.addEventListener('pointerup', this.#onPointerUp, options);
    button.addEventListener('pointercancel', () => this.#cancelHold(), options);
    button.addEventListener('contextmenu', (event) => event.preventDefault(), options);
    button.addEventListener('keydown', this.#onButtonKeyDown, options);
    tray.addEventListener('click', (event) => this.#pickOption(event.target.closest('.option')), options);
    tray.addEventListener('keydown', this.#onTrayKeyDown, options);
    tray.addEventListener('pointerover', (event) => this.#activate(event.target.closest('.option')), options);
    tray.addEventListener('focusin', (event) => this.#activate(event.target.closest('.option')), options);

    // Hovering opens the tray; leaving the button and tray closes it.
    this.addEventListener('pointerenter', this.#onEnter, options);
    this.addEventListener('pointerleave', this.#onLeave, options);
    document.addEventListener('pointerdown', (event) => event.composedPath().includes(this) || this.#closeTray(), options);
    this.signal.addEventListener('abort', () => {
      [this.#holdTimer, this.#leaveTimer].forEach(clearTimeout);
      this.#closeTray();
    });
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('options')) this.#renderTray();
    if (changed.has('trayLabel')) this.query('.tray').ariaLabel = this.trayLabel;
    if (['value', 'options'].some((prop) => changed.has(prop))) {
      for (const option of this.query('.tray').children) option.ariaChecked = String(option.dataset.emoji === this.value);
    }
    if (['value', 'reactions', 'options', 'label', 'countLabel'].some((prop) => changed.has(prop))) this.#renderSummary();
  }

  // A tap toggles the first reaction; the click that ends a hold does nothing.
  handleClick() {
    if (this.#held) {
      this.#held = false;
      return;
    }
    this.#closeTray();
    this.#choose(this.value ? null : this.options[0]?.emoji);
  }

  #name(emoji) {
    return this.options.find((option) => option.emoji === emoji)?.name ?? emoji;
  }

  #renderTray() {
    const nodes = this.options.map(({ emoji, name }) => {
      const option = Object.assign(document.createElement('button'), {
        className: 'option',
        type: 'button',
        role: 'menuitemradio',
        tabIndex: -1,
        ariaLabel: name,
      });
      option.dataset.emoji = emoji;
      option.append(
        Object.assign(document.createElement('span'), { className: 'tip', textContent: name, ariaHidden: 'true' }),
        Object.assign(document.createElement('span'), { className: 'glyph', textContent: emoji }),
      );
      return option;
    });
    this.query('.tray').replaceChildren(...nodes);
    this.shadowRoot.querySelectorAll('.tray .glyph').forEach(centerEmoji);
  }

  // Your reaction, the most used ones beside the count, and the count itself.
  #renderSummary() {
    const counts = { ...this.reactions };
    if (this.value) counts[this.value] = (counts[this.value] ?? 0) + 1;
    const ranked = Object.entries(counts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([emoji]) => emoji);
    const stack = ranked.slice(0, STACK_SIZE);
    // Yours always joins them.
    if (this.value && !stack.includes(this.value)) stack[Math.min(stack.length, STACK_SIZE - 1)] = this.value;

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const text = numberFormat.format(total);
    const button = this.query('.button');
    const label = this.value ? this.#name(this.value) : this.label;
    const chosen = this.query('.chosen');
    chosen.textContent = this.value ?? '';
    if (this.value) centerEmoji(chosen);
    this.query('.reaction-label').textContent = label;
    button.ariaPressed = String(Boolean(this.value));
    button.ariaLabel = total ? `${label}, ${text} ${this.countLabel}` : label;

    // The glyph moves inside its circle, not the circle with it.
    const nodes = stack.map((emoji) => {
      const node = Object.assign(document.createElement('span'), { className: 'emoji' });
      node.append(Object.assign(document.createElement('span'), { className: 'glyph', textContent: emoji }));
      return node;
    });
    this.query('.stack').replaceChildren(...nodes);
    nodes.forEach((node) => centerEmoji(node.firstChild));
    if (!reducedMotion.matches) {
      nodes.forEach((node, i) => this.#shownStack.includes(stack[i]) || node.animate(POP, { duration: 300, easing: 'ease-out' }));
    }
    this.#shownStack = stack;

    const count = this.query('.count');
    count.hidden = total === 0;
    roll(count, text);
  }

  #choose(value) {
    const next = value ?? null;
    if (next === (this.value ?? null)) return;
    if (!this.emit('change', { value: next })) return;
    this.value = next ?? undefined;
    this.query('.live').textContent = next ? this.#name(next) : '';
  }

  #pickOption(option) {
    if (!option) return;
    const restoreFocus = this.#mode === 'keyboard';
    this.#closeTray(restoreFocus);
    this.#choose(option.dataset.emoji);
  }

  #openTray(mode) {
    clearTimeout(this.#leaveTimer);
    if (this.#mode || this.disabled) return;
    this.#mode = mode;
    this.query('.tray').hidden = false;
    this.query('.button').ariaExpanded = 'true';
    const options = [...this.query('.tray').children];
    const current = options.find((option) => option.dataset.emoji === this.value) ?? options[0];
    if (mode === 'keyboard') current?.focus();
    else this.#activate(null);
  }

  #closeTray(restoreFocus = false) {
    if (!this.#mode) return;
    this.#mode = null;
    this.query('.tray').hidden = true;
    this.query('.button').ariaExpanded = 'false';
    this.#activate(null);
    if (restoreFocus) this.query('.button').focus();
  }

  // The reaction under the finger, pointer or focus grows and names itself.
  #activate(option) {
    for (const node of this.query('.tray').children) node.classList.toggle('active', node === option);
  }

  #optionAt(x, y) {
    return this.shadowRoot.elementFromPoint(x, y)?.closest('.option') ?? null;
  }

  #cancelHold() {
    clearTimeout(this.#holdTimer);
    if (this.#mode === 'hold') this.#closeTray();
  }

  #onPointerDown = (event) => {
    if (event.button !== 0) return;
    this.#held = false;
    clearTimeout(this.#holdTimer);
    // Keep receiving the pointer while it slides over the tray.
    event.currentTarget.setPointerCapture(event.pointerId);
    this.#holdTimer = setTimeout(() => {
      this.#held = true;
      this.#openTray('hold');
      vibrate(8);
    }, HOLD_DELAY);
  };

  #onPointerMove = (event) => {
    if (this.#mode === 'hold') this.#activate(this.#optionAt(event.clientX, event.clientY));
  };

  #onPointerUp = (event) => {
    clearTimeout(this.#holdTimer);
    if (this.#mode !== 'hold') return;
    const option = this.#optionAt(event.clientX, event.clientY);
    this.#closeTray();
    if (option) this.#choose(option.dataset.emoji);
  };

  #onEnter = (event) => {
    clearTimeout(this.#leaveTimer);
    if (event.pointerType === 'mouse') this.#openTray('hover');
  };

  #onLeave = () => {
    if (this.#mode === 'hover') this.#leaveTimer = setTimeout(() => this.#closeTray(), LEAVE_DELAY);
  };

  #onButtonKeyDown = (event) => {
    if (event.key !== 'ArrowUp') return;
    event.preventDefault();
    this.#openTray('keyboard');
  };

  #onTrayKeyDown = (event) => {
    const options = [...this.query('.tray').children];
    const index = options.indexOf(this.shadowRoot.activeElement);
    const moves = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: options.length - 1 };

    if (event.key in moves) {
      event.preventDefault();
      options.at(moves[event.key] % options.length)?.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.#closeTray(true);
    } else if (event.key === 'Tab') {
      this.#closeTray();
    }
  };
}
