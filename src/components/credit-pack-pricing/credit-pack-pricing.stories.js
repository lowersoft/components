import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Pricings/Credit Pack Pricing',
  component: 'lw-credit-pack-pricing',
  render: (args) => `<lw-credit-pack-pricing ${attributes(args)}></lw-credit-pack-pricing>`,
  args: { balance: 120, low: 200, value: 2000 },
};

// Pick a pack: the total and the balance after roll, and the bar shows how far it takes you.
export const Default = {};

// With plenty left, the bar is not red.
export const Healthy = { args: { balance: 3400 } };
