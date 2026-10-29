import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Pricings/Ticket Pricing',
  component: 'lw-ticket-pricing',
  parameters: { layout: 'padded' },
  argTypes: { billing: { control: 'inline-radio', options: ['monthly', 'yearly'] } },
  render: (args) => `<div style="max-width: 68rem; margin: 3rem auto"><lw-ticket-pricing ${attributes(args)}></lw-ticket-pricing></div>`,
  args: { billing: 'monthly', value: 'pro' },
};

// Pick a pass to hold it; the arrow keys move between them. Yearly rolls the prices and reprints the barcodes.
export const Default = {};
