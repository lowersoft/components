import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Metric Card',
  component: 'lw-metric-card',
  render: (args) => `<lw-metric-card ${attributes(args)}></lw-metric-card>`,
  argTypes: { format: { control: 'inline-radio', options: ['currency', 'number'] } },
  args: { label: 'Revenue', period: 30, format: 'currency', currency: 'USD' },
};

// Hover the chart to read a day, drag to read a range, pick a part to chart it alone.
export const Default = {};

export const Quarter = {
  args: { period: 90, currency: 'EUR' },
};
