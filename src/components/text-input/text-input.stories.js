import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const icon = (paths, slot) =>
  `<svg slot="${slot}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const SEARCH_ICON = icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 'start');
const MAIL_ICON = icon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', 'start');

export default {
  title: 'Inputs/Input/Text Input',
  component: 'lw-text-input',
  render: (args) => `<lw-text-input ${attributes(args)}></lw-text-input>`,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['text', 'email', 'url', 'search', 'tel', 'password'] },
  },
  args: { label: 'Name', placeholder: 'Ada Lovelace', size: 'md', disabled: false, readonly: false, required: false },
};

export const Default = {};

export const Disabled = {
  args: { label: 'Name', value: 'Ada Lovelace', disabled: true },
};

export const ReadOnly = {
  args: { label: 'Workspace ID', value: 'ws_7f3a91c2', readonly: true, hint: 'Set when the workspace was created.' },
};

export const WithHint = {
  args: { label: 'Display name', placeholder: 'ada', hint: 'This is how others see you in comments.' },
};

// A message from outside, like the server, marks the field invalid.
export const WithError = {
  args: { label: 'Email', type: 'email', value: 'ada@example', error: 'That email has no domain ending, like .com.' },
};

export const WithIcons = {
  render: () => `
    <div style="display: grid; gap: 1rem">
      <lw-text-input type="search" placeholder="Search…" aria-label="Search">${SEARCH_ICON}<kbd slot="end" style="font: 0.75rem ui-monospace, monospace">⌘K</kbd></lw-text-input>
      <lw-text-input type="email" label="Email" placeholder="ada@example.com">${MAIL_ICON}</lw-text-input>
      <lw-text-input label="Price" placeholder="0.00" inputmode="decimal"><span slot="start">$</span><span slot="end">USD</span></lw-text-input>
    </div>`,
};

export const Sizes = {
  render: () => `
    <div style="display: grid; gap: 1rem">
      <lw-text-input size="sm" label="Small" placeholder="Small"></lw-text-input>
      <lw-text-input size="md" label="Medium" placeholder="Medium"></lw-text-input>
      <lw-text-input size="lg" label="Large" placeholder="Large"></lw-text-input>
    </div>`,
};

export const Counter = {
  args: { label: 'Bio', placeholder: 'A line about you', maxlength: 60, counter: true },
};

export const Password = {
  args: { label: 'Password', type: 'password', autocomplete: 'new-password', minlength: 8, hint: 'At least 8 characters.' },
};

// Checked like native inputs: the errors show once a field is left or the
// form is submitted.
export const InForm = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <form novalidate style="display: grid; gap: 1rem; justify-items: start; font: 0.8125rem system-ui">
        <lw-text-input name="name" label="Name" required></lw-text-input>
        <lw-text-input name="email" type="email" label="Email" required></lw-text-input>
        <lw-text-input name="handle" label="Handle" pattern="[a-z0-9]+(-[a-z0-9]+)*" hint="Lowercase letters and digits, with single dashes between."></lw-text-input>
        <div style="display: flex; gap: 0.5rem"><button>Submit</button><button type="reset">Reset</button></div>
        <output style="font-family: ui-monospace, monospace"></output>
      </form>`;
    const form = template.content.firstElementChild;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.querySelector('output').textContent = new URLSearchParams(new FormData(form)).toString();
    });
    return form;
  },
};
