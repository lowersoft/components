import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Buttons/Bell',
  component: 'lw-bell-button',
  render: (args) => `<lw-bell-button ${attributes(args)}></lw-bell-button>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    count: { control: 'number' },
  },
  args: {
    variant: 'outline',
    size: 'lg',
    count: 1284,
    subscribed: false,
    'icon-only': false,
    label: 'Notify me',
    'subscribed-label': 'Subscribed',
    'count-label': 'subscribers',
  },
};

export const Default = {};

export const Layouts = {
  render: () => `
    <div style="display: flex; gap: 0.75rem; align-items: center">
      <lw-bell-button variant="outline" size="lg" count="1284"></lw-bell-button>
      <lw-bell-button variant="outline" size="lg"></lw-bell-button>
      <lw-bell-button variant="outline" size="lg" icon-only></lw-bell-button>
      <lw-bell-button variant="outline" size="lg" count="999" subscribed></lw-bell-button>
    </div>`,
};
