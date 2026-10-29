import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Headline/Stats Headline',
  component: 'lw-stats-headline',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="margin: 4rem auto"><lw-stats-headline ${attributes(args)}></lw-stats-headline></div>`,
  args: {},
};

// The figures count up the first time they come into view.
export const Default = {};
