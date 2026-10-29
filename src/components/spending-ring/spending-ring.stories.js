import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Spending Ring',
  component: 'lw-spending-ring',
  render: (args) => `<lw-spending-ring ${attributes(args)}></lw-spending-ring>`,
  args: { heading: 'October infrastructure', currency: 'USD' },
};

// Drag the ring round, tap a slice, or use the arrow keys.
export const Default = {};
