import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Buttons/Copy',
  component: 'lw-copy-button',
  render: (args) => `<lw-copy-button ${attributes(args)}></lw-copy-button>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    value: 'npm install @lowersoft/lw',
    label: 'Copy install command',
    variant: 'outline',
    size: 'lg',
    secret: false,
  },
};

export const Default = {};

export const Secret = {
  args: { value: 'sk_live_51HxQ2eK9vR7tLmZpA3', label: 'Copy API key', secret: true },
};
