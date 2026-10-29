import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Receipt Printer',
  component: 'lw-receipt-printer',
  render: (args) => `<lw-receipt-printer ${attributes(args)}></lw-receipt-printer>`,
  args: { merchant: 'LowerSoft Store', order: '#4182', tax: 0.08, currency: '$', manual: false },
};

// It prints once on screen; pull the receipt down to tear it off.
export const Default = {};

export const Manual = {
  args: { manual: true, merchant: 'Corner Books', order: '#0917', currency: '€', items: JSON.stringify([{ name: 'Paperback', quantity: 2, price: 12 }, { name: 'Tote bag', quantity: 1, price: 8 }]) },
};
