import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Range',
  component: 'lw-range',
  render: (args) => `<lw-range ${attributes(args)}></lw-range>`,
  args: { label: 'Volume', value: '60', min: 0, max: 100, unit: '%', disabled: false },
};

export const Default = {};

export const Disabled = {
  args: { disabled: true },
};

export const Stepped = {
  args: { label: 'Rating', value: '3', min: 1, max: 5, step: 1, unit: '', hint: 'From 1 to 5.' },
};

// `formatValue` takes over the shown and spoken value.
export const Formatted = {
  render: () => {
    const range = document.createElement('lw-range');
    Object.assign(range, { label: 'Budget', min: 0, max: 5000, step: 100, value: '1200' });
    range.formatValue = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    return range;
  },
};
