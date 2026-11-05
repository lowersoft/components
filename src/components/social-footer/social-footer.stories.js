import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Footers/Social Footer',
  component: 'lw-social-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-social-footer ${attributes(args)}></lw-social-footer></div>`,
  argTypes: {
    'no-theme-toggle': { name: 'No theme toggle', control: 'boolean' },
  },
  args: { brand: 'Lower', 'no-theme-toggle': false },
};

// The brand beside the links, with social links and a theme switch below.
export const Default = {};

// Another brand, without the theme switch.
export const Northline = {
  args: { brand: 'Northline', tagline: 'Route planning for fleets that cannot afford to be late.', 'no-theme-toggle': true },
};
