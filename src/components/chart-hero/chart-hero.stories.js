import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Heroes/Chart Hero',
  component: 'lw-chart-hero',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-chart-hero ${attributes(args)}></lw-chart-hero>`,
  args: { heading: 'Watch every release land.', range: '90D' },
};

// Scrub the line to read any day; switch the range and the line morphs.
export const Default = {};
