import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const THREE = JSON.stringify([
  { id: 'reader', name: 'Reader', description: 'Every issue, every essay.', monthly: 8, action: 'Subscribe', highlights: [{ icon: 'page', label: 'The full archive' }, { icon: 'voice', label: 'Audio editions' }, { icon: 'globe', label: 'Read anywhere' }], includes: 'What you get', extras: ['Weekly letter', 'Reading lists'] },
  { id: 'patron', name: 'Patron', description: 'Support the work, join the room.', monthly: 20, action: 'Become a patron', emphasized: true, highlights: [{ icon: 'chat', label: 'Members’ forum' }, { icon: 'video', label: 'Monthly live talks' }, { icon: 'magic', label: 'Early access' }], includes: 'Everything in Reader, plus', extras: ['Your name in print', 'Annual printed edition'], more: { label: 'See past talks', href: '#' } },
  { id: 'founder', name: 'Founder', description: 'For those who want to keep it going.', monthly: 'custom', action: 'Write to us', highlights: [{ icon: 'users', label: 'Gift subscriptions' }, { icon: 'layers', label: 'Commission an essay' }, { icon: 'unlimited', label: 'Lifetime access' }], includes: 'Everything in Patron, plus', extras: ['Dinner with the editors'] },
]);

export default {
  title: 'Sections/Pricing/Plans/Nested Feature Pricing',
  component: 'lw-nested-feature-pricing',
  parameters: { layout: 'fullscreen' },
  argTypes: { billing: { control: 'inline-radio', options: ['monthly', 'yearly'] } },
  render: (args) => `<lw-nested-feature-pricing ${attributes(args)}></lw-nested-feature-pricing>`,
  args: { billing: 'monthly', discount: 20 },
};

// Switch to Annual and every price rolls; each card names only what it adds.
export const Default = {};

// Three memberships for a magazine, annual first.
export const Membership = {
  args: { heading: 'Read the magazine,', 'accent-heading': 'or help write its future.', description: 'Cancel anytime. Annual members get two issues free.', billing: 'yearly', discount: 15, save: 'Two issues free', plans: THREE },
};
