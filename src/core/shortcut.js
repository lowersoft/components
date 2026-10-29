import { IS_APPLE } from './platform.js';

const MODIFIERS = ['mod', 'ctrl', 'alt', 'shift'];

const MODIFIER_LABELS = IS_APPLE
  ? { mod: '⌘', ctrl: '⌃', alt: '⌥', shift: '⇧' }
  : { mod: 'Ctrl', ctrl: 'Ctrl', alt: 'Alt', shift: 'Shift' };

// Names defined by the `aria-keyshortcuts` specification.
const MODIFIER_ARIA = { mod: IS_APPLE ? 'Meta' : 'Control', ctrl: 'Control', alt: 'Alt', shift: 'Shift' };

const KEY_LABELS = { enter: '↵', space: 'Space', up: '↑', down: '↓', left: '←', right: '→', backspace: '⌫', delete: 'Del', tab: 'Tab', escape: 'Esc' };
const KEY_ARIA = { enter: 'Enter', space: 'Space', up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', backspace: 'Backspace', delete: 'Delete', tab: 'Tab', escape: 'Escape' };

// "k" -> "K", "f5" -> "F5"; named keys from the table.
const keyName = (key, names) => names[key] ?? (key.length === 1 || /^f\d+$/.test(key) ? key.toUpperCase() : key);

/**
 * Parse `"mod+shift+k"`: `mod` is ⌘ on Apple platforms and Ctrl elsewhere.
 * Returns the modifiers, the key, the keycap labels and the `aria-keyshortcuts` value.
 */
export const parseShortcut = (shortcut) => {
  const parts = shortcut.toLowerCase().split('+').map((part) => part.trim()).filter(Boolean);
  const modifiers = MODIFIERS.filter((modifier) => parts.includes(modifier));
  const key = parts.find((part) => !MODIFIERS.includes(part)) ?? '';
  return {
    modifiers,
    key,
    labels: [...modifiers.map((modifier) => MODIFIER_LABELS[modifier]), keyName(key, KEY_LABELS)],
    aria: [...modifiers.map((modifier) => MODIFIER_ARIA[modifier]), keyName(key, KEY_ARIA)].join('+'),
    // Plain keys must not fire while typing; ones with Ctrl, Alt or ⌘ may.
    allowedWhileTyping: modifiers.some((modifier) => modifier !== 'shift'),
  };
};

// Matches the physical key too, since Option on a Mac changes `event.key`.
export const isKey = (event, key) =>
  key === 'space'
    ? event.code === 'Space'
    : event.key.toLowerCase() === key || event.code === `Key${key.toUpperCase()}` || event.code === `Digit${key}`;

export const isModifierDown = (modifier, event) =>
  ({
    mod: IS_APPLE ? event.metaKey : event.ctrlKey,
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
  })[modifier];

/** True when the event is exactly the shortcut, with no extra modifiers. */
export const matchesShortcut = (event, { modifiers, key }) => {
  const has = (modifier) => modifiers.includes(modifier);
  return (
    isKey(event, key) &&
    event.metaKey === (has('mod') && IS_APPLE) &&
    event.ctrlKey === (has('ctrl') || (has('mod') && !IS_APPLE)) &&
    event.altKey === has('alt') &&
    event.shiftKey === has('shift')
  );
};

// Physical keys to shortcut key names; letters and digits come from the code.
const CODE_KEYS = {
  Space: 'space', Enter: 'enter', Backspace: 'backspace', Delete: 'delete', Tab: 'tab', Escape: 'escape',
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  Slash: '/', Backslash: '\\', Comma: ',', Period: '.', Semicolon: ';', Quote: "'",
  BracketLeft: '[', BracketRight: ']', Minus: '-', Equal: '=', Backquote: '`',
};

/** The modifiers held during `event`, in shortcut order. */
export const heldModifiers = (event) => MODIFIERS.filter((modifier) => modifier !== 'ctrl' || IS_APPLE).filter((modifier) => isModifierDown(modifier, event));

/**
 * The shortcut an event makes, like `"mod+shift+k"`, from the physical key so
 * Option on a Mac or another keyboard layout gives the same name. Null while
 * only modifiers are held.
 */
export const shortcutFromEvent = (event) => {
  const { code } = event;
  let key = CODE_KEYS[code];
  if (!key && /^Key[A-Z]$/.test(code)) key = code.slice(3).toLowerCase();
  if (!key && /^Digit\d$/.test(code)) key = code.slice(5);
  if (!key && /^F\d{1,2}$/.test(code)) key = code.toLowerCase();
  if (!key) return null;
  return [...heldModifiers(event), key].join('+');
};

/** Keycap labels for modifiers alone, as they are held. */
export const modifierLabels = (modifiers) => modifiers.map((modifier) => MODIFIER_LABELS[modifier]);
