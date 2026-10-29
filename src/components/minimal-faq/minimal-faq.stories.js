import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'FAQs/Minimal FAQ',
  component: 'lw-minimal-faq',
  parameters: { layout: 'padded' },
  render: (args) => `<lw-minimal-faq ${attributes(args)}></lw-minimal-faq>`,
  args: { heading: 'Questions, answered', open: '' },
};

// Open a question: the others step back. Copy an answer's link, or add #faq-<id> to the address.
export const Default = {};

// Opens with one answer showing.
export const Open = { args: { open: 'how-does-seat-billing-work' } };
