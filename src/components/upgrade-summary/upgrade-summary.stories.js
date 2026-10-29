import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Pricings/Upgrade Summary',
  component: 'lw-upgrade-summary',
  argTypes: {
    billing: { control: 'inline-radio', options: ['monthly', 'yearly'] },
    value: { control: 'inline-radio', options: ['pro', 'team'] },
  },
  render: (args) => `<lw-upgrade-summary ${attributes(args)}></lw-upgrade-summary>`,
  args: { current: 'starter', value: 'pro', billing: 'monthly', 'days-left': 12 },
};

// Pick Pro or Team and the billing: the meters rescale to the new limits and the bill is prorated for today.
export const Default = {};
