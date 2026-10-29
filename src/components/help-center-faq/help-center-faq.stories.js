import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'FAQs/Help Center FAQ',
  component: 'lw-help-center-faq',
  render: (args) => `<lw-help-center-faq ${attributes(args)}></lw-help-center-faq>`,
  args: { placeholder: 'Search questions' },
};

// Type to filter (try "theme" or "keyboard"), move with the arrow keys and press Enter to open an answer.
export const Default = {};
