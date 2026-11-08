import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Sections/Pricing/Usage & Checkout/Upgrade Summary',
  component: 'lw-upgrade-summary',
  argTypes: {
    billing: { control: 'inline-radio', options: ['monthly', 'yearly'] },
    value: { control: 'inline-radio', options: ['pro', 'team'] },
  },
  render: (args) => {
    const template = document.createElement('template');
    template.innerHTML = `<lw-upgrade-summary ${attributes(args)}></lw-upgrade-summary>`;
    const summary = template.content.firstElementChild;
    // Stands in for the payment request.
    summary.confirm = () => new Promise((resolve) => setTimeout(resolve, 1200));
    return summary;
  },
  args: { current: 'starter', value: 'pro', billing: 'monthly', 'days-left': 12 },
};

// Pick Pro or Team and the billing: the meters show the room each adds and the
// bill is prorated for today. Pay to see it go through.
export const Default = {};
