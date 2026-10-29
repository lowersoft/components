import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Action Search Bar/Filter Search Bar',
  component: 'lw-filter-search-bar',
  render: (args) => `<lw-filter-search-bar ${attributes(args)}></lw-filter-search-bar>`,
  args: {},
};

// Type "bug" and pick a suggestion, or write -label:docs and press Enter. Backspace twice takes the last token back.
export const Default = {};
