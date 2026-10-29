import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Pricings/Single Plan Pricing',
  component: 'lw-single-plan-pricing',
  argTypes: { billing: { control: 'inline-radio', options: ['monthly', 'yearly', 'lifetime'] } },
  render: (args) => `<lw-single-plan-pricing ${attributes(args)}></lw-single-plan-pricing>`,
  args: { product: 'Lower Pro', billing: 'yearly' },
};

// Switch between monthly, yearly and lifetime: the price rolls and the billing line follows.
export const Default = {};
