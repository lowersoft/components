import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '68rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/FAQs/Consult FAQ',
  component: 'lw-consult-faq',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-consult-faq ${attributes(args)}></lw-consult-faq>`),
  args: {},
};

// Three decisive questions beside a walkthrough offer, on a softened photograph.
export const Default = {};

// Opens on the last question.
export const OpenOnTheLast = {
  args: { open: 'onboarding' },
};

// On a phone the questions follow the consultation card.
export const Narrow = {
  render: (args) => frame(`<lw-consult-faq ${attributes(args)}></lw-consult-faq>`, '24rem'),
};
