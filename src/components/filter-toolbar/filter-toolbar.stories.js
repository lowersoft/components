import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Toolbars/Filter Toolbar',
  component: 'lw-filter-toolbar',
  render: (args) => `<lw-filter-toolbar ${attributes(args)}></lw-filter-toolbar>`,
  args: {},
};

// Press / to search. Flip "is" to "is not", pick another value, or add a filter.
export const Default = {};
