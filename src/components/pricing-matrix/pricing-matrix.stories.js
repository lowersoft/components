import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const TWO_PLANS = JSON.stringify([
  { id: 'basic', name: 'Basic', tagline: 'Small teams', monthly: 12, annual: 10, action: 'Start trial', wash: 'sky' },
  { id: 'business', name: 'Business', tagline: 'Growing teams', monthly: 24, annual: 20, action: 'Start trial', wash: 'sand', flagged: true },
]);

const TWO_GROUPS = JSON.stringify([
  { id: 'usage', label: 'Usage', rows: [{ id: 'storage', label: 'Storage', values: { basic: '50 GB', business: '1 TB' } }, { id: 'seats', label: 'Seats', values: { basic: '5', business: '50' } }] },
  { id: 'security', label: 'Security', rows: [{ id: 'sso', label: 'Single sign-on', values: { basic: false, business: true } }, { id: '2fa', label: 'Two-factor login', values: { basic: true, business: true } }] },
]);

export default {
  title: 'Sections/Pricing/Tables/Pricing Matrix',
  component: 'lw-pricing-matrix',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-pricing-matrix ${attributes(args)}></lw-pricing-matrix>`,
  argTypes: {
    billing: { name: 'Billing', control: 'inline-radio', options: ['yearly', 'monthly'] },
  },
  args: { billing: 'yearly' },
};

// Three plans on one sheet; switch billing and the prices roll.
export const Default = {};

// Two plans, both washed, the second flagged.
export const TwoPlans = {
  args: { heading: 'Plans for every team', plans: TWO_PLANS, groups: TWO_GROUPS },
};
