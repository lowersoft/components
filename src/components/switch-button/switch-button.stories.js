import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Buttons/Switch',
  component: 'lw-switch-button',
  render: (args) => `<lw-switch-button ${attributes(args)}></lw-switch-button>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    variant: 'outline',
    size: 'md',
    'icon-only': false,
    'no-reveal': false,
    'light-label': 'Light',
    'dark-label': 'Dark',
    disabled: false,
  },
};

export const Default = {};

export const IconOnly = { args: { 'icon-only': true } };

export const Sizes = {
  render: () => `
    <div style="display: flex; gap: 0.75rem; align-items: center">
      <lw-switch-button variant="outline" size="sm"></lw-switch-button>
      <lw-switch-button variant="outline"></lw-switch-button>
      <lw-switch-button variant="outline" size="lg"></lw-switch-button>
      <lw-switch-button variant="outline" size="sm" icon-only></lw-switch-button>
      <lw-switch-button variant="outline" icon-only></lw-switch-button>
      <lw-switch-button variant="outline" size="lg" icon-only></lw-switch-button>
    </div>`,
};
