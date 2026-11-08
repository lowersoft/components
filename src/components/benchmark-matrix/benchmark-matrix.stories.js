import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const MODELS = JSON.stringify([
  { id: 'sable-2', name: 'Sable 2', featured: true },
  { id: 'sable-1', name: 'Sable 1' },
]);

const ROWS = JSON.stringify([
  { id: 'coding', title: 'Internal coding suite', source: '500 tasks, pass@1, run by our team', values: { 'sable-2': [{ value: '71.2%', caption: 'no tools' }, { value: '78.9%', caption: 'with tools', win: true }], 'sable-1': { value: '62.4%' } } },
  { id: 'support', title: 'Support tickets resolved', source: '1,000 archived tickets, graded blind', values: { 'sable-2': { value: '64%', win: true }, 'sable-1': { value: '51%' } } },
]);

export default {
  title: 'Sections/Comparisons/Benchmark Matrix',
  component: 'lw-benchmark-matrix',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-benchmark-matrix ${attributes(args)}></lw-benchmark-matrix>`,
  argTypes: {
    accent: { name: 'Accent', control: 'color' },
  },
  args: {},
};

// Four models; the featured one is outlined and the best scores are filled.
export const Default = {};

// Two models with wins marked by hand, straight into the table.
export const MarkedWins = {
  render: (args) => `<lw-benchmark-matrix ${attributes(args)} heading="" lede=""></lw-benchmark-matrix>`,
  args: { models: MODELS, rows: ROWS },
};
