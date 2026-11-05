import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const PLANS = JSON.stringify([
  { id: 'solo', name: 'Solo', eyebrow: 'Just you', monthly: 11, save: 20 },
  { id: 'team', name: 'Team', eyebrow: 'Up to 25 people', monthly: 29, save: 20, popular: true },
  { id: 'business', name: 'Business', eyebrow: 'Whole company', monthly: 69, save: 15 },
]);

const FEATURES = JSON.stringify([
  { id: 'calendars', label: 'Connected calendars', values: { solo: '2', team: '6', business: 'Unlimited' } },
  { id: 'pages', label: 'Booking pages', values: { solo: '1', team: 'Unlimited', business: 'Unlimited' } },
  { id: 'routing', label: 'Round-robin routing', hint: 'Spread bookings evenly across the people on a page.', values: { solo: false, team: true, business: true } },
  { id: 'payments', label: 'Take payments', values: { solo: true, team: true, business: true } },
  { id: 'sso', label: 'Single sign-on', hint: 'SAML sign-in through your identity provider.', values: { solo: false, team: false, business: true } },
]);

export default {
  title: 'Pricings/Plan Table Pricing',
  component: 'lw-plan-table-pricing',
  parameters: { layout: 'padded' },
  argTypes: { billing: { control: 'inline-radio', options: ['yearly', 'monthly'] } },
  render: (args) => `<div style="margin: 3rem auto"><lw-plan-table-pricing ${attributes(args)}></lw-plan-table-pricing></div>`,
  args: { billing: 'yearly' },
};

// Pay monthly and every price rolls up; hover the dotted features for more.
export const Default = {};

// Three plans for a scheduling app, monthly first, in emerald.
export const ThreePlans = {
  args: { heading: 'Booking that scales with you', description: 'Start with Solo and add people when you need them.', billing: 'monthly', action: 'Try it free', group: 'Features', plans: PLANS, features: FEATURES },
  render: (args) => `<div style="margin: 3rem auto; --lw-plan-table-pricing-accent: #059669"><lw-plan-table-pricing ${attributes(args)}></lw-plan-table-pricing></div>`,
};
