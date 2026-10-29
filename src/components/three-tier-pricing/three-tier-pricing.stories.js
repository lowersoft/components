import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Pricings/Three Tier Pricing',
  component: 'lw-three-tier-pricing',
  parameters: { layout: 'padded' },
  argTypes: { billing: { control: 'inline-radio', options: ['monthly', 'yearly'] } },
  render: (args) => `<div style="max-width: 72rem; margin: 3rem auto"><lw-three-tier-pricing ${attributes(args)}></lw-three-tier-pricing></div>`,
  args: { billing: 'monthly' },
};

// Switch to yearly and every price rolls. Add Team seats and its price follows.
export const Default = {};
