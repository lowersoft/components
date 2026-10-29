import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Currency Transfer',
  component: 'lw-currency-transfer',
  render: (args) => `<lw-currency-transfer ${attributes(args)}></lw-currency-transfer>`,
  argTypes: { status: { control: 'inline-radio', options: [null, 'processing', 'completed', 'failed'] } },
  args: { locale: 'en-US', rate: 0.92 },
};

// No status: the demo runs to completion on its own.
export const Default = {};

// Failed, with Retry starting the run over.
export const Failed = {
  render: () => {
    const transfer = document.createElement('lw-currency-transfer');
    transfer.status = 'failed';
    transfer.retry = true;
    transfer.addEventListener('lw-retry', () => {
      transfer.status = 'processing';
      setTimeout(() => (transfer.status = 'completed'), 4500);
    });
    return transfer;
  },
};

export const Yen = {
  args: {
    from: JSON.stringify({ amount: 1200, currency: 'GBP', bank: 'Monzo', last4: '1180' }),
    to: JSON.stringify({ amount: 228_840, currency: 'JPY', bank: 'MUFG', last4: '0042', name: 'Aiko Tanaka' }),
    rate: 190.7,
    locale: 'en-GB',
  },
};
