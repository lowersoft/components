import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Date Range Brush',
  component: 'lw-date-range-brush',
  render: (args) => `<lw-date-range-brush ${attributes(args)}></lw-date-range-brush>`,
  args: { label: 'Builds', scope: 'main', days: 77 },
};

// Drag the edges or the brush, or draw a new range on the chart. 7D, 30D and 90D jump to the last days.
export const Default = {};
