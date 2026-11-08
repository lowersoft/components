import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const HOSTING = JSON.stringify([
  { id: 'bandwidth', label: 'Bandwidth', min: 100, max: 5000, step: 100, value: 1200, unit: ' GB', rate: 0.08, per: 1, included: 500, note: '$0.08 per GB, first 500 GB included' },
  { id: 'builds', label: 'Build minutes', min: 1000, max: 50000, step: 1000, value: 9000, rate: 2, per: 1000, included: 6000, note: '$2 per 1K minutes, first 6K included' },
  { id: 'functions', label: 'Function calls', min: 1000000, max: 50000000, step: 1000000, value: 8000000, rate: 0.6, per: 1000000, included: 1000000, note: '$0.60 per million, first million included' },
]);

export default {
  title: 'Sections/Pricing/Usage & Checkout/Usage Receipt Pricing',
  component: 'lw-usage-receipt-pricing',
  parameters: { layout: 'padded' },
  argTypes: { billing: { control: 'inline-radio', options: ['monthly', 'yearly'] } },
  render: (args) => `<div style="max-width: 72rem; margin: 3rem auto"><lw-usage-receipt-pricing ${attributes(args)}></lw-usage-receipt-pricing></div>`,
  args: { billing: 'monthly', base: 29, discount: 20 },
};

// Drag a meter: its cost, its line on the receipt and the total update; Reset puts every meter back.
export const Default = {};

// Three meters for hosting, annual billing at 15% off, no second button.
export const Hosting = {
  args: { heading: 'Pay for the traffic you serve', description: 'Every project starts on the $20 base plan.', billing: 'yearly', base: 20, discount: 15, action: 'Deploy with this plan', meters: HOSTING },
  render: (args) => `<div style="max-width: 72rem; margin: 3rem auto"><lw-usage-receipt-pricing ${attributes(args)} secondary=""></lw-usage-receipt-pricing></div>`,
};
