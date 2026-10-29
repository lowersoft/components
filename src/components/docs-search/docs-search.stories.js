import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Action Search Bar/Docs Search',
  component: 'lw-docs-search',
  render: (args) => `<lw-docs-search ${attributes(args)}></lw-docs-search>`,
  args: { value: 'rotate api key' },
};

// Matching words are underlined, best match first; Ctrl+Enter asks the docs instead.
export const Default = {};
