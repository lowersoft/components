import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const STUDIO = JSON.stringify([
  { id: 'free', name: 'Personal', blurb: 'For your own projects, on your own time.', monthly: 0, action: 'Get started', features: ['3 projects', 'Community templates', 'Export to PNG'] },
  { id: 'pro', name: 'Studio', blurb: 'For designers who ship work every week.', monthly: 24, action: 'Start free trial', featured: true, features: ['Unlimited projects', 'Brand kits', 'Export to SVG and PDF', 'Version history'] },
  { id: 'team', name: 'Agency', blurb: 'For teams with clients to keep happy.', monthly: 49, action: 'Choose Agency', features: ['Everything in Studio', 'Client review links', 'Shared libraries', 'Admin controls'] },
]);

export default {
  title: 'Pricings/Soft Gradient Pricing',
  component: 'lw-soft-gradient-pricing',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    billing: { control: 'inline-radio', options: ['monthly', 'yearly'] },
    accent: { control: 'color' },
  },
  render: (args) => `<lw-soft-gradient-pricing ${attributes(args)}></lw-soft-gradient-pricing>`,
  args: { billing: 'monthly', discount: 20 },
};

// Flip the switch: 20% comes off and every price rolls.
export const Default = {};

// A free plan, yearly first at 25% off, in pink.
export const Studio = {
  args: { heading: 'Design tools that pay for themselves', description: 'Try Studio free for 14 days. No card needed.', billing: 'yearly', discount: 25, save: 'Three months free', accent: '#db2777', badge: 'Best for most', plans: STUDIO },
};
