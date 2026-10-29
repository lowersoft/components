import { fieldStyles } from '../../core/field.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import { swapStyles, swapText } from '../../core/swap.js';
import styles from './natural-date-input.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';
import { parseDate } from './parse.js';

const icon = (paths) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const CALENDAR_ICON = icon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>');
const CLOSE_ICON = icon('<path d="M18 6 6 18M6 6l12 12"/>');

const pad = (n) => String(n).padStart(2, '0');
const DAY_MS = 86_400_000;

/**
 * A due date typed the way it is said: "next fri 3pm", "in 2 weeks", "eod",
 * "dec 24 at noon". The words it understood are underlined as you type, a
 * preview under the field rolls to the exact date, and Enter turns it into
 * a chip. Press the chip to edit the words again, or its × to clear it.
 *
 * @attr {string} value - The date, "2026-10-23" or "2026-10-23T15:00"
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {string} name - Submits the date with the form
 * @attr {boolean} required
 * @attr {boolean} disabled
 * @fires lw-change - A date was set or cleared; `detail: { value, date, phrase }`
 * @csspart field
 * @csspart chip
 */
export class LwNaturalDateInput extends FormControl(LwElement) {
  static styles = [fieldStyles, swapStyles, styles];
  static shadowOptions = { mode: 'open', delegatesFocus: true };
  static props = {
    value: { default: '' },
    label: { default: 'Due date' },
    placeholder: { default: 'Try “next fri 3pm”, “in 2 weeks” or “eod”' },
    name: {},
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  #parsed = null;
  #phrase = '';
  #formDisabled = false;

  render() {
    return `<label class="label" for="control" part="label"></label><div class="field" part="field">${CALENDAR_ICON}<span class="control-wrap"><span class="mirror" aria-hidden="true"></span><input id="control" class="control" type="text" autocomplete="off" spellcheck="false" aria-describedby="preview"></span><span class="chip" part="chip" hidden><button class="chip-text" type="button"></button><button class="chip-clear" type="button" aria-label="Clear the date">${CLOSE_ICON}</button></span></div><p class="preview swap" id="preview" aria-live="polite"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const input = this.query('.control');
    input.addEventListener('input', () => this.#typed(), options);
    input.addEventListener('scroll', () => this.#alignMirror(), options);
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      this.#confirm();
    }, options);
    this.query('.chip-text').addEventListener('click', () => this.#edit(), options);
    this.query('.chip-clear').addEventListener('click', () => this.#clear(), options);
    this.query('.chip').addEventListener('keydown', (event) => {
      if (event.key !== 'Backspace' && event.key !== 'Delete') return;
      event.preventDefault();
      this.#clear();
    }, options);
  }

  updated(changed) {
    if (changed.has('label')) this.query('.label').textContent = this.label ?? '';
    if (changed.has('placeholder')) this.query('.control').placeholder = this.placeholder ?? '';
    this.#syncDisabled();
    // A date set from outside shows as a chip.
    if (changed.has('value') && this.value && this.value !== this.#valueOf(this.#parsed)) {
      const date = this.#fromValue(this.value);
      if (date) {
        this.#parsed = { date, hasTime: this.value.includes('T'), parts: [] };
        this.#showChip(true);
      }
    }
    this.#sync();
  }

  formResetCallback() {
    this.#clear(false);
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncDisabled();
  }

  #syncDisabled() {
    const disabled = Boolean(this.disabled || this.#formDisabled);
    for (const control of this.shadowRoot.querySelectorAll('input, button')) control.disabled = disabled;
    this.toggleAttribute('data-disabled', disabled);
  }

  #fromValue(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(value);
    if (!match) return null;
    const [, y, m, d, h = '0', min = '0'] = match;
    return new Date(Number(y), Number(m) - 1, Number(d), Number(h), Number(min));
  }

  #valueOf(parsed) {
    if (!parsed?.date) return '';
    const { date, hasTime } = parsed;
    const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return hasTime ? `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}` : day;
  }

  get #locale() {
    return this.closest('[lang]')?.lang || navigator.language || 'en';
  }

  // "Fri, Oct 23 at 3:00 PM", and how far away: "in 6 days".
  #describe({ date, hasTime }) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    if (date.getFullYear() !== new Date().getFullYear()) options.year = 'numeric';
    if (hasTime) Object.assign(options, { hour: 'numeric', minute: '2-digit' });
    return new Intl.DateTimeFormat(this.#locale, options).format(date);
  }

  #distance(date) {
    const days = Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()) - new Date(new Date().toDateString())) / DAY_MS);
    return new Intl.RelativeTimeFormat(this.#locale, { numeric: 'auto' }).format(days, 'day');
  }

  #typed() {
    const input = this.query('.control');
    this.#phrase = input.value;
    this.#parsed = input.value.trim() ? parseDate(input.value) : null;
    this.#drawMirror();
    const preview = this.query('.preview');
    if (!input.value.trim()) swapText(preview, '');
    else if (this.#parsed.date) swapText(preview, `${this.#describe(this.#parsed)} · ${this.#distance(this.#parsed.date)}`);
    else swapText(preview, 'No date yet. Try “tomorrow 9am” or “in 3 days”.');
    preview.toggleAttribute('data-found', Boolean(this.#parsed?.date));
    this.#sync();
  }

  // The words understood, underlined in a layer under the input's own text.
  #drawMirror() {
    const mirror = this.query('.mirror');
    const text = this.query('.control').value;
    const nodes = [];
    let at = 0;
    for (const [start, end] of this.#parsed?.parts ?? []) {
      if (start > at) nodes.push(document.createTextNode(text.slice(at, start)));
      nodes.push(Object.assign(document.createElement('span'), { className: 'understood', textContent: text.slice(start, end) }));
      at = end;
    }
    nodes.push(document.createTextNode(text.slice(at)));
    mirror.replaceChildren(...nodes);
    this.#alignMirror();
  }

  #alignMirror() {
    this.query('.mirror').style.translate = `${-this.query('.control').scrollLeft}px 0`;
  }

  #confirm() {
    if (!this.#parsed?.date) {
      if (!reducedMotion.matches) this.query('.field').animate({ translate: ['0', '-4px', '4px', '-2px', '0'] }, { duration: 260, easing: 'ease-out' });
      return;
    }
    this.#showChip();
    this.emit('change', { value: this.value, date: this.#parsed.date, phrase: this.#phrase });
  }

  // The words give way to a chip with the exact date.
  #showChip(quiet = false) {
    this.value = this.#valueOf(this.#parsed);
    const chip = this.query('.chip');
    this.query('.chip-text').textContent = this.#describe(this.#parsed);
    this.query('.chip-text').ariaLabel = `${this.label}: ${this.#describe(this.#parsed)}. Press to edit.`;
    this.query('.control-wrap').hidden = true;
    chip.hidden = false;
    this.toggleAttribute('data-chip', true);
    swapText(this.query('.preview'), quiet ? '' : `Set for ${this.#distance(this.#parsed.date)}.`);
    if (!quiet) {
      this.query('.chip-text').focus();
      if (!reducedMotion.matches) chip.animate({ scale: [0.9, 1], opacity: [0, 1] }, { duration: 220, easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)' });
    }
    this.#sync();
  }

  // Back to the words, to change them.
  #edit() {
    this.query('.chip').hidden = true;
    this.query('.control-wrap').hidden = false;
    this.removeAttribute('data-chip');
    const input = this.query('.control');
    input.value = this.#phrase;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    this.#typed();
  }

  #clear(announce = true) {
    this.#parsed = null;
    this.#phrase = '';
    this.value = '';
    this.query('.chip').hidden = true;
    this.query('.control-wrap').hidden = false;
    this.removeAttribute('data-chip');
    const input = this.query('.control');
    input.value = '';
    this.#drawMirror();
    swapText(this.query('.preview'), '');
    if (announce) {
      input.focus();
      this.emit('change', { value: '', date: null, phrase: '' });
    }
    this.#sync();
  }

  #sync() {
    const set = this.hasAttribute('data-chip');
    this[INTERNALS].setFormValue(this.name && set ? this.value : null);
    const input = this.query('.control');
    if (this.required && !set) this[INTERNALS].setValidity({ valueMissing: true }, this.#parsed?.date ? 'Press Enter to set the date.' : 'Enter a due date.', input);
    else this[INTERNALS].setValidity({});
  }
}
