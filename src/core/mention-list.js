import mentionListStyles from '../styles/mention-list.scss?inline';
import { hideHighlight, moveHighlight } from './highlight.js';
import { hueOf, initialsOf } from './people.js';
import { foldText } from './text.js';

// The list of people a mention offers, opened at the caret: the mention
// input's, shared with the post composer. The field keeps the list's
// `aria-activedescendant` and picks; the list shows who matches, keeps one
// marked with a highlight that slides between them, and stands under the
// caret inside the field's box. Add `mentionListStyles` to the component's
// `static styles`.
export { mentionListStyles };

/** The list's markup; the field names it with `aria-controls`. */
export const mentionListMarkup = (id = 'listbox', label = 'People') =>
  `<ul class="listbox" id="${id}" role="listbox" part="listbox" aria-label="${label}" hidden><li class="highlight" role="presentation" aria-hidden="true"></li></ul>`;

/** The people whose handle, or a word of whose name, starts with `query`. */
export const findPeople = (people, query, max = 6) => {
  const term = foldText(query);
  return people.filter(({ name, handle }) => !term || foldText(handle).startsWith(term) || foldText(name).split(/\s+/).some((part) => part.startsWith(term))).slice(0, max);
};

/** A person's photo, `avatarUrl` or `avatar`, or their initials on their tint. */
const avatarOf = ({ name, avatarUrl, avatar }) => {
  const element = Object.assign(document.createElement('span'), { className: 'avatar' });
  const url = avatarUrl ?? avatar;
  if (url) element.append(Object.assign(document.createElement('img'), { src: url, alt: '' }));
  else element.textContent = initialsOf(String(name ?? ''));
  element.style.setProperty('--_hue', hueOf(String(name ?? '')));
  return element;
};

/**
 * Fills the list with `people` and opens it under `caret`, a rect, kept
 * inside `box`, the list's positioned container; with no one, it says no one
 * is called `query`. The options' ids start with `prefix`.
 */
export const openMentionList = (list, people, query, caret, box, prefix = 'person') => {
  const highlight = list.querySelector('.highlight');
  hideHighlight(highlight);
  const options = people.map((person, index) => {
    const option = Object.assign(document.createElement('li'), { id: `${prefix}-${index}`, role: 'option' });
    option.dataset.index = index;
    const text = Object.assign(document.createElement('span'), { className: 'person-text' });
    text.append(Object.assign(document.createElement('span'), { className: 'person-name', textContent: person.name }));
    if (person.handle) text.append(Object.assign(document.createElement('span'), { className: 'person-handle', textContent: `@${person.handle}` }));
    option.append(avatarOf(person), text);
    return option;
  });
  if (options.length === 0) options.push(Object.assign(document.createElement('li'), { className: 'empty', textContent: `No one called “${query}”` }));
  list.replaceChildren(highlight, ...options);
  list.hidden = false;
  const area = box.getBoundingClientRect();
  const left = Math.min(Math.max(caret.left - area.left - 8, 0), area.width - list.offsetWidth);
  list.style.left = `${Math.max(0, left)}px`;
  list.style.top = `${caret.bottom - area.top + 6}px`;
};

/**
 * Marks option `index`, wrapping round, as the one Enter picks, slides the
 * highlight to it and scrolls it into view. Returns it, or null.
 */
export const setMentionActive = (list, index, scroll = true) => {
  const options = [...list.querySelectorAll('[role="option"]')];
  if (options.length === 0) return null;
  const active = (index + options.length) % options.length;
  options.forEach((option, i) => (option.ariaSelected = String(i === active)));
  moveHighlight(list.querySelector('.highlight'), options[active]);
  if (scroll) options[active].scrollIntoView({ block: 'nearest' });
  return { option: options[active], index: active };
};

/** Closes the list. */
export const closeMentionList = (list) => {
  list.hidden = true;
  hideHighlight(list.querySelector('.highlight'));
};
