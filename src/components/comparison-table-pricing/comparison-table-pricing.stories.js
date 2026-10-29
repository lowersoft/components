import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Pricings/Comparison Table Pricing',
  component: 'lw-comparison-table-pricing',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 72rem; margin: 3rem auto"><lw-comparison-table-pricing ${attributes(args)}></lw-comparison-table-pricing></div>`,
  args: { differences: false },
};

// Hover a column to light it. Dotted terms explain themselves; "Show differences only" hides what every plan shares.
export const Default = {};
