import { attributes } from '../../../.storybook/attributes.js';
import '../button/index.js';
import './index.js';

const REGIONS = [
  { value: 'fra1', label: 'Frankfurt', description: 'FRA1 · ~18 ms' },
  { value: 'iad1', label: 'Washington, D.C.', description: 'IAD1 · ~92 ms' },
  { value: 'sfo1', label: 'San Francisco', description: 'SFO1 · ~148 ms' },
  { value: 'nrt1', label: 'Tokyo', description: 'NRT1 · ~231 ms' },
];

const ROLES = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'admin', label: 'Admin' },
  { value: 'owner', label: 'Owner', disabled: true, hint: 'A workspace has one owner. Transfer ownership in Settings.' },
];

const json = (value) => JSON.stringify(value);

export default {
  title: 'Controls/Choices/Select',
  component: 'lw-select',
  render: (args) => `<lw-select ${attributes(args)}></lw-select>`,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { label: 'Build region', value: 'fra1', options: json(REGIONS), size: 'md', disabled: false, required: false },
};

export const Default = {};

export const Placeholder = {
  args: { label: 'Role', value: '', placeholder: 'Choose a role', options: json(ROLES), hint: 'What they can do in this workspace.' },
};

// An option can be off, with the reason in a tooltip on hover or focus.
export const DisabledOption = {
  args: { label: 'Role', value: 'editor', options: json(ROLES) },
};

export const Disabled = {
  args: { disabled: true },
};

// A message from outside, like the server, marks the field invalid.
export const WithError = {
  args: { error: 'Tokyo is full for this plan. Pick another region.', value: 'nrt1' },
};

export const Sizes = {
  render: () => `
    <div style="display: grid; gap: 1rem">
      <lw-select size="sm" label="Small" value="fra1" options='${json(REGIONS)}'></lw-select>
      <lw-select size="md" label="Medium" value="fra1" options='${json(REGIONS)}'></lw-select>
      <lw-select size="lg" label="Large" value="fra1" options='${json(REGIONS)}'></lw-select>
    </div>`,
};

// In a form: the value is submitted, and `required` holds the submit back
// until an option is picked.
export const InAForm = {
  render: () => {
    const form = document.createElement('form');
    form.style.cssText = 'display: grid; gap: 1rem; justify-items: start';
    form.innerHTML = `<lw-select name="role" label="Role" placeholder="Choose a role" required options='${json(ROLES)}'></lw-select>
<lw-button type="submit">Invite</lw-button>
<output style="font: 0.75rem var(--lw-font-mono); color: var(--lw-color-muted-foreground)"></output>`;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('output').textContent = `Submitted: ${new URLSearchParams(new FormData(form))}`;
    });
    return form;
  },
};
