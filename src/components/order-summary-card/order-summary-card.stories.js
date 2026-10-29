import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Order Summary Card',
  component: 'lw-order-summary-card',
  render: (args) => `<lw-order-summary-card ${attributes(args)}></lw-order-summary-card>`,
  args: { currency: 'USD' },
};

// Change quantities, switch on Express, try the code WELCOME10, then Pay.
export const Default = {};
