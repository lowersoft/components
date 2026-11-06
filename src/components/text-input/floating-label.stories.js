import { attributes } from '../../../.storybook/attributes.js';
import '../button/index.js';
import '../number-input/index.js';
import '../password-input/index.js';
import '../textarea/index.js';
import './index.js';

const icon = (paths) =>
  `<svg slot="start" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const MAIL_ICON = icon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>');
const AT_ICON = icon('<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>');
const SEARCH_ICON = icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>');

const stack = (content, width = '20rem') => `<div style="display: grid; gap: 1rem; width: ${width}; max-width: 100%">${content}</div>`;

// A form whose submit lists what it sent, so the stories show the values.
const form = (content) => {
  const template = document.createElement('template');
  template.innerHTML = content;
  const element = template.content.firstElementChild;
  element.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!element.reportValidity()) return;
    element.querySelector('output').textContent = new URLSearchParams(new FormData(element)).toString();
  });
  return element;
};

/**
 * Any text field with `floating` keeps its label inside the box: resting
 * over the empty control, rising above the value as soon as the field is
 * focused, typed in, set or autofilled. It works on `lw-text-input`,
 * `lw-password-input`, `lw-number-input` and `lw-textarea`.
 */
export default {
  title: 'Inputs/Input/Floating Label',
  component: 'lw-text-input',
  render: (args) => `<lw-text-input ${attributes(args)}></lw-text-input>`,
  argTypes: {
    floating: { control: 'inline-radio', options: ['auto', 'always'], mapping: { auto: true, always: 'always' } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['text', 'email', 'url', 'search', 'tel', 'password'] },
  },
  args: { floating: 'auto', label: 'Email address', type: 'email', placeholder: 'name@example.com', size: 'md', disabled: false, readonly: false, required: false },
};

// The placeholder shows only once the label has moved out of its way.
export const Default = {};

export const Basic = {
  render: () =>
    stack(`
      <lw-text-input floating type="email" label="Email address" placeholder="name@example.com" autocomplete="email"></lw-text-input>
      <lw-text-input floating type="password" label="Password" placeholder="Password" autocomplete="current-password"></lw-text-input>`),
};

// A value set up front starts with the label raised.
export const WithValue = {
  args: { value: 'ada@example.com' },
};

// The label rests on the first line; text scrolled up passes under a strip,
// not under the raised label.
export const Textarea = {
  render: () =>
    stack(`
      <lw-textarea floating label="Comments" placeholder="Leave a comment here"></lw-textarea>
      <lw-textarea floating label="Release notes" rows="2" autosize max-rows="5" value="Faster cold starts on every region.\nSearch keeps your filters between visits.\nThe export dialog remembers the last format.\nA new keyboard shortcut for the command menu.\nDark mode follows the system by default."></lw-textarea>`),
};

// Centred over the number, between the buttons.
export const NumberInput = {
  render: () =>
    stack(`
      <div style="display: flex; flex-wrap: wrap; gap: 1rem">
        <lw-number-input floating label="Guests" min="1" max="12" value="2"></lw-number-input>
        <lw-number-input floating label="Nights" min="1" max="30"></lw-number-input>
      </div>`, '26rem'),
};

// Icons and text at the ends stay where they are; the label starts where
// the value does.
export const WithIcons = {
  render: () =>
    stack(`
      <lw-text-input floating type="email" label="Work email" placeholder="ada@company.com">${MAIL_ICON}</lw-text-input>
      <lw-text-input floating label="Username" placeholder="ada" hint="Lowercase letters and digits.">${AT_ICON}</lw-text-input>
      <lw-text-input floating type="search" label="Search the docs">${SEARCH_ICON}<kbd slot="end" style="font: 0.75rem ui-monospace, monospace">⌘K</kbd></lw-text-input>
      <lw-text-input floating label="Monthly budget" placeholder="0.00" inputmode="decimal" value="1200.00"><span slot="start">$</span><span slot="end">USD</span></lw-text-input>`),
};

// The label turns red with the box, and the message shows under it.
export const Validation = {
  render: () =>
    stack(`
      <lw-text-input floating type="email" label="Email address" value="ada@example" error="That email has no domain ending, like .com."></lw-text-input>
      <lw-text-input floating label="Username" required hint="Leave it empty and click away to see the error."></lw-text-input>`),
};

export const Disabled = {
  render: () =>
    stack(`
      <lw-text-input floating label="Email address" disabled></lw-text-input>
      <lw-text-input floating label="Email address" value="ada@example.com" disabled></lw-text-input>
      <lw-textarea floating label="Comments" value="Disabled, with text inside." disabled></lw-textarea>`),
};

export const ReadOnly = {
  render: () =>
    stack(`
      <lw-text-input floating label="Workspace ID" value="ws_7f3a91c2" readonly hint="Set when the workspace was created."></lw-text-input>
      <lw-text-input floating label="Invited by" readonly></lw-text-input>`),
};

// The label stays raised and the placeholder shows from the start.
export const AlwaysFloating = {
  render: () =>
    stack(`
      <lw-text-input floating="always" label="Display name" placeholder="How others see you"></lw-text-input>
      <lw-text-input floating="always" type="password" label="Password" placeholder="••••••••"></lw-text-input>`),
};

export const Sizes = {
  render: () =>
    stack(`
      <lw-text-input floating size="sm" label="Small" placeholder="Small"></lw-text-input>
      <lw-text-input floating size="md" label="Medium" placeholder="Medium"></lw-text-input>
      <lw-text-input floating size="lg" label="Large" placeholder="Large"></lw-text-input>`),
};

// A sign-up form: fields side by side wrap onto their own lines on a
// narrow screen, and the errors show once a field is left or submitted.
export const InForm = {
  render: () =>
    form(`
      <form novalidate style="display: grid; gap: 1rem; width: min(28rem, calc(100vw - 2rem)); font: 0.8125rem system-ui">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr)); gap: 1rem">
          <lw-text-input floating name="first" label="First name" autocomplete="given-name" required style="width: auto"></lw-text-input>
          <lw-text-input floating name="last" label="Last name" autocomplete="family-name" required style="width: auto"></lw-text-input>
        </div>
        <lw-text-input floating name="email" type="email" label="Work email" placeholder="ada@company.com" autocomplete="email" required style="width: auto"></lw-text-input>
        <lw-password-input floating name="password" required style="width: auto"></lw-password-input>
        <lw-textarea floating name="about" label="What will you build?" rows="2" autosize maxlength="160" counter style="width: auto"></lw-textarea>
        <div style="display: flex; gap: 0.5rem"><lw-button type="submit">Create account</lw-button><lw-button type="reset" variant="ghost">Reset</lw-button></div>
        <output style="font-family: ui-monospace, monospace; overflow-wrap: anywhere"></output>
      </form>`),
};
