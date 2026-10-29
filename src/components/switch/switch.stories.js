import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Switch',
  component: 'lw-switch',
  render: ({ label, ...args }) => `<lw-switch ${attributes(args)}>${label}</lw-switch>`,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { label: 'Airplane mode', checked: false, disabled: false, size: 'md' },
};

export const Default = {};

export const On = {
  args: { checked: true },
};

export const Disabled = {
  render: () => `
    <div style="display: grid; gap: 0.75rem">
      <lw-switch disabled>Disabled</lw-switch>
      <lw-switch disabled checked>Disabled and on</lw-switch>
    </div>`,
};

export const WithDescription = {
  args: { label: 'Push notifications', description: 'Alerts on this device for mentions and replies.', checked: true },
};

export const Sizes = {
  render: () => `
    <div style="display: grid; gap: 0.75rem">
      <lw-switch size="sm" checked>Small</lw-switch>
      <lw-switch size="md" checked>Medium</lw-switch>
    </div>`,
};

// A settings list, each switch taking effect at once.
export const Settings = {
  render: () => `
    <div style="display: grid; gap: 1rem; width: 320px">
      <lw-switch checked description="Show when you are online.">Activity status</lw-switch>
      <lw-switch description="Let people find you by email.">Discoverable</lw-switch>
      <lw-switch checked description="Play a sound for new messages.">Sounds</lw-switch>
    </div>`,
};
