import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '68rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/FAQs/Support Card FAQ',
  component: 'lw-support-card-faq',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-support-card-faq ${attributes(args)}></lw-support-card-faq>`),
  args: {},
};

// The open question turns over; the support card stays in view as the list scrolls.
export const Default = {};

// A colour of its own for the support card.
export const Accent = {
  render: (args) => frame(`<lw-support-card-faq style="--lw-support-card-faq-accent: #3b6ef5; --lw-support-card-faq-on-accent: #fff" ${attributes(args)}></lw-support-card-faq>`),
};

// On a phone the questions follow the support card.
export const Narrow = {
  render: (args) => frame(`<lw-support-card-faq ${attributes(args)}></lw-support-card-faq>`, '24rem'),
};
