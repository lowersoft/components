import { fieldStyles } from '../../core/field.js';
import { hideHighlight, moveHighlight } from '../../core/highlight.js';
import { LwElement } from '../../core/lw-element.js';
import { reducedMotion } from '../../core/motion.js';
import '../text-input/index.js';
import { highlight, PARTS, placeOf, searchAddresses } from './addresses.js';
import styles from './address-input.scss?inline';
import { FormControl, INTERNALS } from '../../core/form.js';

// The search waits for a pause in typing and a few letters, which keeps it
// within the fair use of the free service behind it.
const SEARCH_DELAY = 300;
const MIN_QUERY = 3;
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

// The lines an address unfolds into: label, autocomplete token and width.
const LINES = {
  street: { label: 'Street address', autocomplete: 'address-line1', wide: true },
  apt: { label: 'Apt, suite, floor', autocomplete: 'address-line2', wide: true, optional: true },
  city: { label: 'City', autocomplete: 'address-level2' },
  region: { label: 'State / region', autocomplete: 'address-level1', optional: true },
  postal: { label: 'Postal code', autocomplete: 'postal-code' },
  country: { label: 'Country', autocomplete: 'country-name' },
};

const SEARCH_ICON =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
const PIN_ICON =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';

/**
 * A shipping address that starts as one search box. Typing lists matching
 * addresses with the matched words highlighted; picking one unfolds it into
 * street, apartment, city, region, postal code and country, and puts the
 * cursor on the apartment line, the one people forget. "Enter it manually"
 * unfolds empty lines, and "Search again" folds them back.
 *
 * The suggestions follow the WAI-ARIA combobox pattern: the arrow keys move
 * through them, Enter picks, Escape closes.
 *
 * It searches houses and streets anywhere in the world with Photon, a free
 * OpenStreetMap geocoder (photon.komoot.io), so what is typed there goes to
 * that service. Street names stay local, as a letter is addressed, and the
 * country is named in the page's language. To use your own provider, set
 * `search` to `async (query, { signal, lang }) => addresses`.
 *
 * With a `name`, the form submits `name-street`, `name-apt`,
 * `name-city`, `name-region`, `name-postal` and `name-country`.
 *
 * @attr {string} label
 * @attr {string} placeholder
 * @attr {string} name - Prefix for the submitted fields
 * @attr {boolean} required - Street, city, postal code and country must be filled
 * @attr {boolean} disabled
 * @fires lw-change - An address was picked or a line edited; `detail: { address }`
 * @csspart field - The search box
 * @csspart listbox - The suggestions
 */
export class LwAddressInput extends FormControl(LwElement) {
  static styles = [fieldStyles, styles];
  static props = {
    label: { default: 'Shipping address' },
    placeholder: { default: 'Start typing your address' },
    name: {},
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  // `search` is set as a property: finds addresses: `async (query, { signal }) => [{ street, apt, city, region, postal, country }]`.
  // Not declared as a field, which would overwrite a value set before upgrade.

  #results = [];
  #active = -1;
  #timer = 0;
  #request = null;
  #unfolded = false;
  #formDisabled = false;
  // An address set before the lines exist, applied once they do.
  #pending = null;

  render() {
    const lines = PARTS.map((part) => {
      const { label, autocomplete, wide, optional } = LINES[part];
      return `<lw-text-input class="line${wide ? ' wide' : ''}" data-part="${part}" label="${label}${optional ? ' (optional)' : ''}" autocomplete="shipping ${autocomplete}"></lw-text-input>`;
    }).join('');
    return `<label class="label" for="search" part="label"></label><div class="finder"><div class="field" part="field">${SEARCH_ICON}<input id="search" class="control" type="text" role="combobox" autocomplete="off" aria-autocomplete="list" aria-expanded="false" aria-controls="listbox"></div><ul class="listbox" id="listbox" role="listbox" part="listbox" hidden><li class="highlight" role="presentation" aria-hidden="true"></li></ul><button class="manual link" type="button">Enter it manually</button></div><div class="lines" hidden><div class="lines-head"><span class="lines-title"></span><button class="again link" type="button">Search again</button></div><div class="grid">${lines}</div></div><p class="announce" aria-live="polite"></p>`;
  }

  connected() {
    const options = { signal: this.signal };
    const search = this.query('#search');
    search.addEventListener('input', () => this.#typed(), options);
    search.addEventListener('keydown', (event) => this.#key(event), options);
    search.addEventListener('blur', () => setTimeout(() => this.#close(), 120), options);
    // A press on the list keeps focus in the search box until the pick.
    this.query('.listbox').addEventListener('pointerdown', (event) => event.preventDefault(), options);
    this.query('.listbox').addEventListener('click', (event) => this.#pick(Number(event.target.closest('[role="option"]')?.dataset.index)), options);
    // Pointing at a result makes it the active one: one box slides to it.
    this.query('.listbox').addEventListener(
      'pointermove',
      (event) => {
        const option = event.target.closest('[role="option"]');
        if (option && Number(option.dataset.index) !== this.#active) this.#setActive(Number(option.dataset.index), false);
      },
      options,
    );
    this.query('.manual').addEventListener('click', () => this.#unfold(null), options);
    this.query('.again').addEventListener('click', () => this.#fold(), options);
    this.query('.grid').addEventListener('input', () => this.#changed(), options);
    this.signal.addEventListener('abort', () => {
      clearTimeout(this.#timer);
      this.#request?.abort();
    });
  }

  updated(changed) {
    if (changed.has('label')) {
      this.query('.label').textContent = this.label ?? '';
      this.query('.lines-title').textContent = this.label ?? '';
    }
    if (changed.has('placeholder')) this.query('#search').placeholder = this.placeholder ?? '';
    if (this.#pending) {
      const address = this.#pending;
      this.#pending = null;
      this.value = address;
    }
    this.#syncControls();
    this.#sync();
  }

  formResetCallback() {
    this.#fold(false);
    this.query('#search').value = '';
    for (const line of this.#lines) line.value = '';
    this.#sync();
  }

  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncControls();
  }

  /** The address as entered: `{ street, apt, city, region, postal, country }`. */
  get value() {
    return Object.fromEntries(this.#lines.map((line) => [line.dataset.part, (line.value ?? '').trim()]));
  }

  set value(address) {
    if (this.#lines.length === 0) {
      this.#pending = address;
      return;
    }
    for (const line of this.#lines) line.value = address?.[line.dataset.part] ?? '';
    if (address) this.#unfold(address, false);
    this.#sync();
  }

  #syncControls() {
    const disabled = Boolean(this.disabled || this.#formDisabled);
    this.query('#search').disabled = disabled;
    for (const button of this.shadowRoot.querySelectorAll('.link')) button.disabled = disabled;
    for (const line of this.#lines) {
      line.disabled = disabled;
      line.required = Boolean(this.required) && !LINES[line.dataset.part].optional;
    }
  }

  get #lines() {
    return [...this.shadowRoot.querySelectorAll('.line')];
  }

  // Searching

  #typed() {
    clearTimeout(this.#timer);
    this.#request?.abort();
    const query = this.query('#search').value.trim();
    if (query.length < MIN_QUERY) {
      this.#show([]);
      return;
    }
    this.#timer = setTimeout(() => this.#run(query), SEARCH_DELAY);
  }

  async #run(query) {
    const request = new AbortController();
    this.#request = request;
    try {
      const lang = this.closest('[lang]')?.lang || navigator.language || 'en';
      const results = await (this.search ?? searchAddresses)(query, { signal: request.signal, lang });
      if (!request.signal.aborted) this.#show(results, query);
    } catch {
      if (!request.signal.aborted) this.#show([], query, true);
    }
  }

  // Lists the results, the matched words highlighted, or says there are
  // none, or that the search failed.
  #show(results, query = '', failed = false) {
    this.#results = results;
    this.#active = -1;
    const list = this.query('.listbox');
    const search = this.query('#search');
    const options = results.map((address, index) => {
      const option = Object.assign(document.createElement('li'), { id: `option-${index}`, role: 'option' });
      option.dataset.index = index;
      option.ariaSelected = 'false';
      const text = Object.assign(document.createElement('span'), { className: 'option-text' });
      const street = Object.assign(document.createElement('span'), { className: 'option-street' });
      const place = Object.assign(document.createElement('span'), { className: 'option-place' });
      street.append(...highlight(address.street, query));
      place.append(...highlight(placeOf(address), query));
      text.append(street, place);
      option.insertAdjacentHTML('afterbegin', PIN_ICON);
      option.append(text);
      return option;
    });
    if (query && results.length === 0) {
      const text = failed ? 'Couldn’t search right now. Enter it manually below.' : 'No matches. Enter it manually below.';
      options.push(Object.assign(document.createElement('li'), { className: 'empty', textContent: text }));
    }
    // The map data is credited under the results it gave.
    if (results.length && !this.search) {
      const credit = Object.assign(document.createElement('li'), { className: 'credit', role: 'presentation', textContent: 'Search by Photon · © OpenStreetMap contributors' });
      options.push(credit);
    }
    const box = list.querySelector('.highlight');
    hideHighlight(box);
    list.replaceChildren(box, ...options);
    const open = options.length > 0;
    list.hidden = !open;
    search.ariaExpanded = String(open);
    search.removeAttribute('aria-activedescendant');
    if (query) this.query('.announce').textContent = results.length ? `${results.length} ${results.length === 1 ? 'address' : 'addresses'} found.` : 'No addresses found.';
  }

  #close() {
    this.query('.listbox').hidden = true;
    this.query('#search').ariaExpanded = 'false';
    this.query('#search').removeAttribute('aria-activedescendant');
    hideHighlight(this.query('.listbox .highlight'));
    this.#active = -1;
  }

  // The keyboard and the pointer share one active result and one highlight
  // that slides to it. Only the keyboard scrolls it into view.
  #setActive(index, scroll = true) {
    const options = [...this.shadowRoot.querySelectorAll('[role="option"]')];
    if (options.length === 0) return;
    this.#active = (index + options.length) % options.length;
    options.forEach((option, i) => (option.ariaSelected = String(i === this.#active)));
    const active = options[this.#active];
    moveHighlight(this.query('.listbox .highlight'), active);
    if (scroll) active.scrollIntoView({ block: 'nearest' });
    this.query('#search').setAttribute('aria-activedescendant', active.id);
  }

  #key(event) {
    const open = !this.query('.listbox').hidden;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!open || this.#results.length === 0) return;
      event.preventDefault();
      this.#setActive(this.#active + (event.key === 'ArrowDown' ? 1 : -1));
    } else if (event.key === 'Enter' && open && this.#active >= 0) {
      event.preventDefault();
      this.#pick(this.#active);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      this.#close();
    }
  }

  #pick(index) {
    const address = this.#results[index];
    if (!address) return;
    this.#close();
    this.#unfold(address);
    this.#changed();
  }

  // Unfolding

  // The search box gives way to the lines, which come in one after another.
  // The cursor lands on the apartment line, or the street when typing it in.
  #unfold(address, focus = true) {
    if (address) for (const line of this.#lines) line.value = address[line.dataset.part] ?? '';
    const finder = this.query('.finder');
    const lines = this.query('.lines');
    finder.hidden = true;
    lines.hidden = false;
    this.#unfolded = true;
    this.toggleAttribute('data-unfolded', true);
    if (!reducedMotion.matches) {
      lines.animate({ opacity: [0, 1] }, { duration: 200, easing: EASE_OUT });
      this.#lines.forEach((line, i) =>
        line.animate({ opacity: [0, 1], translate: ['0 -6px', '0 0'] }, { duration: 260, delay: i * 40, easing: EASE_OUT, fill: 'backwards' }),
      );
    }
    if (focus) {
      const target = this.shadowRoot.querySelector(`.line[data-part="${address ? 'apt' : 'street'}"]`);
      target.focus();
      this.query('.announce').textContent = address ? `Address filled in. Add an apartment or suite if there is one.` : 'Enter the address line by line.';
    }
  }

  #fold(focus = true) {
    this.query('.finder').hidden = false;
    this.query('.lines').hidden = true;
    this.#unfolded = false;
    this.removeAttribute('data-unfolded');
    if (focus) this.query('#search').focus();
  }

  #changed() {
    this.#sync();
    this.emit('change', { address: this.value });
  }

  // The form value and validity: the required lines must be filled.
  #sync() {
    const address = this.value;
    const filled = PARTS.some((part) => address[part]);
    if (this.name && filled) {
      const data = new FormData();
      for (const part of PARTS) data.append(`${this.name}-${part}`, address[part]);
      this[INTERNALS].setFormValue(data);
    } else {
      this[INTERNALS].setFormValue(null);
    }
    const missing = this.required && PARTS.find((part) => !LINES[part].optional && !address[part]);
    if (!missing) {
      this[INTERNALS].setValidity({});
      return;
    }
    const anchor = this.#unfolded ? this.shadowRoot.querySelector(`.line[data-part="${missing}"]`) : this.query('#search');
    this[INTERNALS].setValidity({ valueMissing: true }, this.#unfolded ? `Enter the ${LINES[missing].label.toLowerCase()}.` : 'Find your address or enter it manually.', anchor);
  }
}
