import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Liquid Gauge',
  component: 'lw-liquid-gauge',
  render: (args) => `<lw-liquid-gauge ${attributes(args)}></lw-liquid-gauge>`,
  args: { value: 72, label: 'Storage', total: 128, unit: 'GB', 'warn-at': 90, readonly: false },
};

// Drag up or down to pour, push sideways to slosh, hover through it to stir.
export const Default = {};

export const AlmostFull = {
  args: { value: 94 },
};

export const ReadOnly = {
  args: { value: 38, label: 'Battery', total: 100, unit: '%', readonly: true },
};
