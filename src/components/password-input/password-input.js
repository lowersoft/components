import { CHECK_ICON, iconStyles } from '../../core/icons.js';
import { fieldStyles, LwField } from '../../core/field.js';
import { reducedMotion } from '../../core/motion.js';
import styles from './password-input.scss?inline';
import { rulesFor, strengthOf } from './strength.js';

// A ripple: each character turns a little after the one before it.
const RIPPLE_MS = 18;
const TURN_MS = 160;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

const icon = (paths) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const EYE_ICON = icon('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>');
const EYE_OFF_ICON = icon('<path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.5 3.3M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="m3 3 18 18"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>');

/**
 * A new-password field for sign-up. Hold the eye to peek: the dots ripple
 * into the characters, and back when let go (a keyboard press toggles it
 * instead). A four-step meter estimates how long the password would take to
 * crack, and the requirements tick off one by one, then fold into a single
 * "Strong password" once they all pass. A password that misses one does not
 * submit.
 *
 * @attr {string} value
 * @attr {string} label
 * @attr {string} hint - Help under the field
 * @attr {string} error - A message that marks the field invalid, e.g. from the server
 * @attr {string} placeholder
 * @attr {string} name
 * @attr {boolean} required
 * @attr {boolean} disabled
 * @attr {number} minlength - The shortest length, 8 by default
 * @attr {string} autocomplete - "new-password" by default
 * @fires input - As the value changes
 * @fires change - When a changed value is committed
 * @csspart field
 * @csspart input - The native input
 * @csspart meter
 * @csspart rules
 */
export class LwPasswordInput extends LwField {
  static styles = [iconStyles, fieldStyles, styles];
  static props = {
    ...LwField.props,
    label: { default: 'Password' },
    minlength: { type: Number, default: 8 },
    autocomplete: { default: 'new-password' },
  };

  #revealed = false;
  #passed = null;

  render() {
    return `${super.render()}<div class="strength" part="meter" hidden><div class="meter" aria-hidden="true"><span></span><span></span><span></span><span></span></div><p class="verdict" aria-live="polite"></p></div><div class="rules-wrap"><ul class="rules" part="rules" aria-label="Password requirements"></ul><p class="strong" hidden>${CHECK_ICON}Strong password</p></div>`;
  }

  renderControl() {
    return `<span class="control-wrap"><input id="control" class="control" type="password" part="input" spellcheck="false" autocapitalize="none"><span class="mirror" aria-hidden="true"></span></span><button class="peek" type="button" aria-label="Show password" aria-pressed="false">${EYE_ICON}${EYE_OFF_ICON}</button>`;
  }

  connected() {
    super.connected();
    const options = { signal: this.signal };
    const peek = this.query('.peek');
    // Held with a pointer, it shows while pressed; from the keyboard, a press toggles.
    peek.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      peek.setPointerCapture(event.pointerId);
      this.#reveal(true);
    }, options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) peek.addEventListener(type, () => this.#reveal(false), options);
    peek.addEventListener('click', (event) => event.detail === 0 && this.#reveal(!this.#revealed), options);
    this.control.addEventListener('blur', () => this.#reveal(false), options);
    // The mirror follows the input's own scroll on a long password.
    this.control.addEventListener('scroll', () => this.#alignMirror(), options);
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has('minlength')) this.#renderRules();
    this.#renderStrength();
  }

  typed() {
    super.typed();
    if (this.#revealed) this.#drawMirror(false);
    this.#renderStrength();
  }

  customValidity() {
    const value = this.value ?? '';
    if (!value) return '';
    const missing = rulesFor(this.minlength || 8).find((rule) => !rule.test(value));
    return missing ? `Add ${missing.label.charAt(0).toLowerCase()}${missing.label.slice(1)}.` : '';
  }

  // Peeking

  #reveal(revealed) {
    if (revealed === this.#revealed) return;
    this.#revealed = revealed;
    const control = this.control;
    const peek = this.query('.peek');
    peek.ariaPressed = String(revealed);
    peek.ariaLabel = revealed ? 'Hide password' : 'Show password';
    this.toggleAttribute('data-revealed', revealed);
    // The real text goes in the input, so the caret sits right; the mirror
    // over it turns each dot into its character.
    if (revealed) {
      const { selectionStart, selectionEnd } = control;
      control.type = 'text';
      if (document.activeElement === this) control.setSelectionRange(selectionStart, selectionEnd);
      this.#drawMirror(true);
    } else {
      // The mirror stays until the characters have turned back into dots.
      this.toggleAttribute('data-hiding', true);
      this.#drawMirror(true, () => {
        if (this.#revealed) return;
        control.type = 'password';
        this.removeAttribute('data-hiding');
      });
    }
  }

  // Each character over a dot; as the field is revealed the dots shrink away
  // and the characters rise in, one after another, and the reverse to hide.
  #drawMirror(animate, done) {
    const mirror = this.query('.mirror');
    const chars = [...(this.value ?? '')];
    if (mirror.childElementCount !== chars.length || !animate) {
      mirror.replaceChildren(
        ...chars.map((char) => {
          const cell = Object.assign(document.createElement('span'), { className: 'cell' });
          cell.append(Object.assign(document.createElement('span'), { className: 'char', textContent: char }), Object.assign(document.createElement('span'), { className: 'dot' }));
          return cell;
        }),
      );
    }
    this.#alignMirror();
    const revealed = this.#revealed;
    const cells = [...mirror.children];
    if (!animate || reducedMotion.matches || cells.length === 0) {
      done?.();
      return;
    }
    let last;
    cells.forEach((cell, i) => {
      const timing = { duration: TURN_MS, delay: i * RIPPLE_MS, easing: EASE_OUT, fill: 'both' };
      const char = cell.querySelector('.char').animate({ opacity: revealed ? [0, 1] : [1, 0], translate: revealed ? ['0 40%', '0 0'] : ['0 0', '0 -40%'] }, timing);
      cell.querySelector('.dot').animate({ opacity: revealed ? [1, 0] : [0, 1], scale: revealed ? [1, 0.2] : [0.2, 1] }, timing);
      last = char;
    });
    if (done) last.finished.then(done, done);
  }

  #alignMirror() {
    this.query('.mirror').style.translate = `${-this.control.scrollLeft}px 0`;
  }

  // Strength and rules

  #renderRules() {
    const rules = rulesFor(this.minlength || 8);
    this.query('.rules').replaceChildren(
      ...rules.map(({ key, label }) => {
        const item = Object.assign(document.createElement('li'), { className: 'rule' });
        item.dataset.rule = key;
        item.insertAdjacentHTML('afterbegin', `<span class="mark" aria-hidden="true">${CHECK_ICON}</span>`);
        item.append(Object.assign(document.createElement('span'), { textContent: label }));
        return item;
      }),
    );
    this.#passed = null;
  }

  #renderStrength() {
    const value = this.value ?? '';
    const rules = rulesFor(this.minlength || 8);
    const { level, label, crack } = strengthOf(value, rules);
    const strength = this.query('.strength');
    strength.hidden = !value;
    strength.dataset.level = String(level);
    let time = `cracked in about ${crack}`;
    if (crack === 'centuries') time = 'would take centuries to crack';
    else if (crack.startsWith('less')) time = `cracked in ${crack}`;
    this.query('.verdict').textContent = value ? `${label} · ${time}` : '';

    let passed = 0;
    for (const rule of rules) {
      const met = rule.test(value);
      if (met) passed += 1;
      const item = this.query(`.rule[data-rule="${rule.key}"]`);
      item?.toggleAttribute('data-met', met);
      if (item) item.ariaLabel = `${rule.label}: ${met ? 'done' : 'not yet'}`;
    }
    this.#fold(passed === rules.length);
  }

  // All rules met: the list folds into one "Strong password" line.
  #fold(allMet) {
    if (allMet === this.#passed) return;
    const first = this.#passed === null;
    this.#passed = allMet;
    const list = this.query('.rules');
    const strong = this.query('.strong');
    const [from, to] = allMet ? [list, strong] : [strong, list];
    if (first || reducedMotion.matches) {
      from.hidden = true;
      to.hidden = false;
      return;
    }
    const height = from.offsetHeight;
    from.hidden = true;
    to.hidden = false;
    const target = to.offsetHeight;
    this.query('.rules-wrap').animate({ height: [`${height}px`, `${target}px`] }, { duration: 260, easing: EASE_OUT });
    to.animate({ opacity: [0, 1], translate: ['0 -4px', '0 0'] }, { duration: 220, easing: EASE_OUT });
  }
}
