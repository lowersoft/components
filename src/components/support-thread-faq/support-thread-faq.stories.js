import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'FAQs/Support Thread FAQ',
  component: 'lw-support-thread-faq',
  render: (args) => `<lw-support-thread-faq ${attributes(args)}></lw-support-thread-faq>`,
  args: { agent: 'Mia Kowalski', company: 'Northwind' },
};

// Tap a question, or ask your own: it is seen, typed and answered. The arrow at the top starts over.
export const Default = {};
