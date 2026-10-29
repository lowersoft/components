import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Order Tracker',
  component: 'lw-order-tracker',
  render: (args) => `<lw-order-tracker ${attributes(args)}></lw-order-tracker>`,
  args: { order: '#4182' },
};

// Details unfolds the full scan history, each stop moving into its row.
export const Default = {};
