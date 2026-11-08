import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const FONTS = JSON.stringify([
  { id: 'trial', name: 'Trial', subtitle: 'Personal use only', price: 0, action: 'Download trial', features: ['Two weights', 'Desktop use'] },
  { id: 'desktop', name: 'Desktop', subtitle: 'One time, one person', price: 80, period: 'once', action: 'Buy desktop', features: ['All 12 weights', 'Print and web images'], extras: [{ id: 'italics', label: 'Italics', price: 40 }] },
  { id: 'complete', name: 'Complete', subtitle: 'One time, every format', price: 240, period: 'once', action: 'Buy complete', popular: true, inverted: true, features: ['All 24 styles', 'Desktop, web and app', 'Variable font'], extras: [{ id: 'updates', label: 'Free updates for life' }, { id: 'seats', label: '5 extra seats', price: 120 }] },
]);

export default {
  title: 'Sections/Pricing/Plans/Lifetime Pricing',
  component: 'lw-lifetime-pricing',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 76rem; margin: 3rem auto"><lw-lifetime-pricing ${attributes(args)}></lw-lifetime-pricing></div>`,
  args: {},
};

// Tick an add-on under the plus and the plan's price rolls to include it.
export const Default = {};

// Three font licences, in euros, with a violet accent.
export const Licences = {
  args: { heading: 'License the typeface', description: 'Every licence is perpetual. Upgrade any time and pay only the difference.', currency: '€', badge: 'Most chosen', question: 'Need a custom licence?', plans: FONTS },
  render: (args) => `<div style="max-width: 76rem; margin: 3rem auto; --lw-lifetime-pricing-accent: #7c3aed"><lw-lifetime-pricing ${attributes(args)}></lw-lifetime-pricing></div>`,
};
