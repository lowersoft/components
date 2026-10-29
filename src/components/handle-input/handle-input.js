import { CHECK_ICON, iconStyles, SPINNER_ICON } from '../../core/icons.js';
import { LwElement } from '../../core/lw-element.js';
import { swapStyles, swapText } from '../../core/swap.js';
import styles from './handle-input.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';
import { candidates, slugify } from './slug.js';

// How long typing pauses before the handle is checked.
const CHECK_DELAY = 450;
// How long a rewritten character shows what it was.
const FLASH_MS = 700;
const SUGGESTIONS = 3;
const TAKEN_ICON =
  '<svg class="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m4.5 4.5 7 7m0-7-7 7"/></svg>';

// Stand-in for a real check: these are taken, everything else is free.
const DEMO_TAKEN = new Set(['lowersoft', 'admin', 'api', 'app', 'blog', 'design', 'docs', 'help', 'hello', 'home', 'mail', 'studio', 'support', 'team', 'www']);
const demoCheck = (handle, { signal }) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(!DEMO_TAKEN.has(handle)), 400 + Math.random() * 400);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });

/**
 * A field for claiming a workspace URL. It rewrites what is typed into a
 * valid handle (lowercase letters, digits and single dashes), showing each
 * rewritten character for a moment; checks availability once typing pauses;
 * and when a handle is taken, suggests three free alternatives.
 *
 * Set `checkAvailability` to `async (handle, { signal }) => boolean`; without
 * it, a stand-in treats a few common names as taken. With a `name`, the form
 * submits the handle, and only once it is known to be free.
 *
 * @attr {string} value
 * @attr {string} prefix - Shown before the handle, e.g. "lowersoft.dev/"
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {number} min-length
 * @attr {number} max-length
 * @attr {string} name - Submits the handle with the form under this name
 * @attr {boolean} required
 * @attr {boolean} disabled
 * @fires lw-change - A check settled or a suggestion was picked; `detail: { value, available }`
 * @csspart field
 * @csspart input
 */
export class LwHandleInput extends FormControl(LwElement) {
  static styles = [iconStyles, swapStyles, styles];
  static shadowOptions = { mode: 'open', delegatesFocus: true };
  static props = {
    value: { default: '' },
    prefix: { default: 'lowersoft.dev/' },
    label: { default: 'Workspace URL' },
    placeholder: { default: 'your-team' },
    minLength: { type: Number, default: 3 },
    maxLength: { type: Number, default: 32 },
    name: {},
    required: { type: Boolean },
    disabled: { type: Boolean, reflect: true },
  };

  // `checkAvailability` is set as a property: checks a handle: `async (handle, { signal }) => boolean`, true when free.
  // Not declared as a field, which would overwrite a value set before upgrade.

  // idle, short, dash, checking, available, taken or error.
  #state = 'idle';
  #timer = 0;
  #check = null;
  #initial = null;
  #formDisabled = false;

  render() {
    return `<label class="label" for="input"></label><div class="field" part="field"><span class="prefix"></span><span class="control"><span class="mirror" aria-hidden="true"></span><input id="input" part="input" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" aria-describedby="status"></span><span class="state" aria-hidden="true"><span class="spinner-wrap">${SPINNER_ICON}</span><span class="ok">${CHECK_ICON}</span><span class="no">${TAKEN_ICON}</span></span></div><p class="status swap" id="status" aria-live="polite"></p><div class="suggestions" role="group" aria-label="Free alternatives" hidden></div>`;
  }

  connected() {
    const options = { signal: this.signal };
    const input = this.query('input');
    input.addEventListener('input', () => this.#typed(), options);
    // A dash at the end is fine while typing, not once the field is left.
    input.addEventListener('change', () => this.value.endsWith('-') && this.#rewrite(this.value.replace(/-+$/, ''), input.value.length), options);
    for (const type of ['scroll', 'keyup', 'select', 'pointerup']) input.addEventListener(type, () => this.#syncScroll(), options);
    this.query('.suggestions').addEventListener('click', (event) => this.#pickSuggestion(event.target.closest('button')?.dataset.handle), options);
    this.signal.addEventListener('abort', () => {
      clearTimeout(this.#timer);
      this.#check?.abort();
      this.#check = null;
    });
  }

  updated(changed) {
    this.#initial ??= this.value;
    const input = this.query('input');
    if (changed.has('label')) this.query('.label').textContent = this.label;
    if (changed.has('prefix')) this.query('.prefix').textContent = this.prefix;
    if (changed.has('placeholder')) input.placeholder = this.placeholder;
    input.maxLength = this.maxLength;
    input.required = this.required;
    if (changed.has('disabled')) this.#syncDisabled();
    // A value set from outside is cleaned up and checked like typing.
    if (changed.has('value') && input.value !== this.value) {
      const { slug } = slugify(this.value, this.maxLength);
      input.value = slug;
      this.value = slug;
      this.#renderMirror();
      this.#schedule(0);
    } else if (changed.has('value') || this.#state === 'idle') {
      this.#render();
    }
  }

  formResetCallback() {
    this.value = this.#initial ?? '';
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncDisabled();
  }

  #syncDisabled() {
    this.query('input').disabled = this.disabled || this.#formDisabled;
  }

  // Typing: rewrite into a handle, keep the caret where it belongs, and
  // check once typing pauses.
  #typed() {
    const input = this.query('input');
    this.#rewrite(input.value, input.selectionStart ?? input.value.length);
  }

  #rewrite(raw, caret) {
    const input = this.query('input');
    const before = this.value;
    const { slug, marks } = slugify(raw, this.maxLength);
    // The caret goes after the slug made from what was before it.
    let rawIndex = 0;
    let caretAt = 0;
    for (const mark of marks) {
      if (rawIndex >= caret) break;
      rawIndex += mark.from.length;
      caretAt = mark.fate === 'dropped' ? mark.at : mark.at + 1;
    }
    if (input.value !== slug) {
      input.value = slug;
      input.setSelectionRange(caretAt, caretAt);
    }
    this.value = slug;
    this.#renderMirror(marks);
    if (slug !== before) this.#schedule(CHECK_DELAY);
  }

  // The text is drawn in a layer under the transparent input, so a rewritten
  // character can show what it was as it turns into what it is, and a dropped
  // one can show itself leaving. `marks` come from `slugify`; without them
  // the handle is drawn as it is.
  #renderMirror(marks = null) {
    const mirror = this.query('.mirror');
    const span = (className, text, from) => {
      const el = Object.assign(document.createElement('span'), { className, textContent: text });
      if (from) el.dataset.from = from;
      return el;
    };
    const spans = marks
      ? marks.flatMap(({ from, at, fate }) => {
          if (fate === 'kept') return [span('', this.value[at])];
          if (fate === 'changed') return [span('flash', this.value[at], from)];
          return from.trim() ? [span('dropped', '', from)] : [];
        })
      : [...this.value].map((char) => span('', char));
    // Characters already drawn stay, so an earlier flash plays out.
    const drawn = [...mirror.children].filter((el) => el.className !== 'dropped');
    let same = 0;
    while (same < drawn.length && same < spans.length && !spans[same].className && drawn[same].textContent === spans[same].textContent) same += 1;
    drawn.slice(same).forEach((el) => el.remove());
    mirror.append(...spans.slice(same));
    if (spans.some((el) => el.className === 'dropped')) setTimeout(() => mirror.querySelectorAll('.dropped').forEach((ghost) => ghost.remove()), FLASH_MS);
    this.#syncScroll();
  }

  #syncScroll() {
    this.query('.mirror').style.translate = `${-this.query('input').scrollLeft}px 0`;
  }

  #schedule(delay) {
    clearTimeout(this.#timer);
    this.#check?.abort();
    this.#check = null;
    const handle = this.value;
    let state = 'checking';
    if (!handle) state = 'idle';
    else if (handle.length < this.minLength) state = 'short';
    else if (handle.endsWith('-')) state = 'dash';
    // While typing, the last verdict clears but the next one waits for a pause.
    this.#setState(state === 'checking' ? 'typing' : state);
    if (state !== 'checking') return;
    this.#timer = setTimeout(() => this.#run(handle), delay);
  }

  async #run(handle) {
    const controller = new AbortController();
    this.#check = controller;
    this.#setState('checking');
    const check = this.checkAvailability ?? demoCheck;
    try {
      const available = await check(handle, { signal: controller.signal });
      if (controller.signal.aborted) return;
      if (available) {
        this.#setState('available');
        this.emit('change', { value: handle, available: true });
        return;
      }
      // Taken: try the alternatives together and offer the first free ones.
      const options = candidates(handle, this.maxLength);
      const free = await Promise.all(options.map((option) => check(option, { signal: controller.signal }).catch(() => false)));
      if (controller.signal.aborted) return;
      this.#setState(
        'taken',
        options.filter((_, i) => free[i]).slice(0, SUGGESTIONS),
      );
      this.emit('change', { value: handle, available: false });
    } catch {
      if (!controller.signal.aborted) this.#setState('error');
    } finally {
      if (this.#check === controller) this.#check = null;
    }
  }

  #pickSuggestion(handle) {
    if (!handle) return;
    clearTimeout(this.#timer);
    this.#check?.abort();
    const input = this.query('input');
    input.value = handle;
    this.value = handle;
    this.#renderMirror();
    input.focus();
    input.setSelectionRange(handle.length, handle.length);
    this.#setState('available');
    this.emit('change', { value: handle, available: true });
  }

  #setState(state, suggestions = []) {
    this.#state = state;
    this.#render(suggestions);
  }

  #render(suggestions = []) {
    const url = `${this.prefix}${this.value}`;
    const messages = {
      idle: 'Letters, numbers and dashes.',
      typing: 'Letters, numbers and dashes.',
      short: `Use at least ${this.minLength} characters.`,
      dash: 'A handle can’t end with a dash.',
      checking: `Checking ${url}…`,
      available: `${url} is available.`,
      taken: suggestions.length ? `${url} is taken. Try one of these:` : `${url} is taken.`,
      error: 'Couldn’t check right now. Try again in a moment.',
    };
    const state = this.#state;
    this.dataset.state = state;
    swapText(this.query('.status'), messages[state]);
    const list = this.query('.suggestions');
    list.hidden = state !== 'taken' || suggestions.length === 0;
    if (state === 'taken') {
      list.replaceChildren(
        ...suggestions.map((handle) =>
          Object.assign(document.createElement('button'), { type: 'button', className: 'suggestion', textContent: handle, ariaLabel: `Use ${this.prefix}${handle}` }),
        ),
      );
      list.querySelectorAll('button').forEach((button, i) => (button.dataset.handle = suggestions[i]));
    }
    this.#syncForm();
  }

  #syncForm() {
    const input = this.query('input');
    const handle = this.value;
    this[INTERNALS].setFormValue(this.name && handle ? handle : null);
    const problems = {
      short: [{ tooShort: true }, `Use at least ${this.minLength} characters.`],
      dash: [{ patternMismatch: true }, 'A handle can’t end with a dash.'],
      taken: [{ customError: true }, 'That handle is taken.'],
      typing: [{ customError: true }, 'Still checking the handle.'],
      checking: [{ customError: true }, 'Still checking the handle.'],
    };
    if (this.required && !handle) this[INTERNALS].setValidity({ valueMissing: true }, 'Choose a handle.', input);
    else if (problems[this.#state]) this[INTERNALS].setValidity(...problems[this.#state], input);
    else this[INTERNALS].setValidity({});
  }
}
