import { escapeHtml } from './dom.js';
import { strokeIcon } from './icons.js';
import { chevronDown } from './lucide.js';
import { Menu, menuMarkup } from './menu.js';
import { swapText } from './swap.js';

// A select-like button and its menu, for forms that pick one of a few
// values. Add `menuStyles`, `iconStyles` and `swapStyles` to the component's
// `static styles`.

/** The trigger and its menu; `icon` and `label` sit before the chosen value. */
export const pickerMarkup = (id, { icon = '', label = '' } = {}) =>
  `<span class="picker"><button class="picker-trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="${id}">${icon}${label ? `<span class="picker-label">${escapeHtml(label)}</span>` : ''}<span class="picker-value swap"></span>${strokeIcon(chevronDown, 14)}</button>${menuMarkup(id)}</span>`;

/**
 * Wires the picker in `root` until `signal` aborts. `set(items, value)`
 * fills the menu and shows the chosen label; `onPick(value)` hears choices.
 */
export const createPicker = (root, signal, onPick) => {
  const trigger = root.querySelector('.picker-trigger');
  const menu = new Menu({ trigger, menu: root.querySelector('.menu'), onPick });
  menu.connect(signal);
  return {
    set(items, value) {
      menu.setItems(items);
      menu.setChecked(value);
      swapText(trigger.querySelector('.picker-value'), items.find((item) => item.value === value)?.label ?? '', trigger);
    },
  };
};
