import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Buttons/Theme Toggle',
  component: 'lw-theme-toggle-button',
  render: (args) => `<lw-theme-toggle-button ${attributes(args)}></lw-theme-toggle-button>`,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { size: 'md' },
};

export const Default = {};

export const Sizes = {
  render: () => `
    <div style="display: flex; gap: 1rem; align-items: center">
      <lw-theme-toggle-button size="sm"></lw-theme-toggle-button>
      <lw-theme-toggle-button></lw-theme-toggle-button>
      <lw-theme-toggle-button size="lg"></lw-theme-toggle-button>
    </div>`,
};
