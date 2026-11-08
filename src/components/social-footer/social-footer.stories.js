import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Sections/Footers/Social Footer',
  component: 'lw-social-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-social-footer ${attributes(args)}></lw-social-footer></div>`,
  argTypes: {
    'no-theme-toggle': { name: 'No theme toggle', control: 'boolean' },
  },
  args: { brand: 'Lowersoft', 'no-theme-toggle': false },
};

// The brand beside the links, with social links and a theme switch below.
export const Default = {};

// Another brand, without the theme switch: no logo, so its initial and name.
export const Northline = {
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-social-footer ${attributes(args)} logo=""></lw-social-footer></div>`,
  args: { brand: 'Northline', tagline: 'Route planning for fleets that cannot afford to be late.', 'no-theme-toggle': true },
};
