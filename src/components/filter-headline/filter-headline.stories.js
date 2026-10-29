import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Headline/Filter Headline',
  component: 'lw-filter-headline',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 72rem; margin: 4rem auto"><lw-filter-headline ${attributes(args)}></lw-filter-headline></div>`,
  args: { filter: '' },
};

// Choose a filter: the count by the title rolls to it.
export const Default = {};
