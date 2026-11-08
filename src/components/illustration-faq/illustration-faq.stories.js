import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '68rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/FAQs/Illustration FAQ',
  component: 'lw-illustration-faq',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-illustration-faq ${attributes(args)}></lw-illustration-faq>`),
  args: {},
};

// One answer open at a time; the question mark floats beside them.
export const Default = {};

// A colour for the question mark and the corner dots.
export const Accent = {
  render: (args) => frame(`<lw-illustration-faq style="--lw-illustration-faq-accent: #3b6ef5" ${attributes(args)}></lw-illustration-faq>`),
};

// On a phone the question mark sits above the questions.
export const Narrow = {
  render: (args) => frame(`<lw-illustration-faq ${attributes(args)}></lw-illustration-faq>`, '24rem'),
};
