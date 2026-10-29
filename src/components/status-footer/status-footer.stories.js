import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Footers/Status Footer',
  component: 'lw-status-footer',
  parameters: { layout: 'fullscreen' },
  argTypes: { status: { control: 'inline-radio', options: ['normal', 'degraded', 'outage'] } },
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-status-footer ${attributes(args)}></lw-status-footer></div>`,
  args: { brand: 'Lower', status: 'normal', uptime: 99.93, days: 90 },
};

// Hover the uptime strip, or focus it and use the arrow keys, to read each day.
export const Default = {};

// A degraded service turns the dot amber.
export const Degraded = { args: { status: 'degraded' } };
