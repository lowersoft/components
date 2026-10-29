import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Footers/Newsletter Footer',
  component: 'lw-newsletter-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-newsletter-footer ${attributes(args)}></lw-newsletter-footer></div>`,
  args: { brand: 'Lower', name: 'The Lower Dispatch', readers: 4182 },
};

// Subscribe with an address: the reader count rolls up by one. The next issue's date follows from the latest.
export const Default = {};
