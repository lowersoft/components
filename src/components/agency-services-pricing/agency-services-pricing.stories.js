import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Pricings/Agency Services Pricing',
  component: 'lw-agency-services-pricing',
  parameters: { layout: 'padded' },
  argTypes: { value: { control: 'inline-radio', options: ['audit', 'port', 'retainer'] } },
  render: (args) => `<div style="max-width: 72rem; margin: 3rem auto"><lw-agency-services-pricing ${attributes(args)}></lw-agency-services-pricing></div>`,
  args: { value: 'port' },
};

// Pick where to start and add extras: the estimate and the delivery time follow. Rush costs more and takes less.
export const Default = {};
