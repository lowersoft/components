import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'FAQs/Tabbed FAQ',
  component: 'lw-tabbed-faq',
  render: (args) => `<lw-tabbed-faq ${attributes(args)}></lw-tabbed-faq>`,
  argTypes: { tab: { control: 'inline-radio', options: ['setup', 'using', 'license'] } },
  args: { heading: 'Questions', tab: 'setup' },
};

// Switch tabs with the arrow keys, open a question, then step through answers with left and right; Escape goes back.
export const Default = {};
