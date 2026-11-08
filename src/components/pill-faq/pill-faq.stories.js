import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '64rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/FAQs/Pill FAQ',
  component: 'lw-pill-faq',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-pill-faq ${attributes(args)}></lw-pill-faq>`),
  args: {},
};

// Open a question and its answer comes in as a reply.
export const Default = {};

// The main action in a colour of its own, through the library's primary tokens.
export const Accent = {
  render: (args) => frame(`<lw-pill-faq style="--lw-color-primary: #fcc659; --lw-color-primary-foreground: #18181b" ${attributes(args)}></lw-pill-faq>`),
};

// On a phone the guides draw in and the actions wrap.
export const Narrow = {
  render: (args) => frame(`<lw-pill-faq ${attributes(args)}></lw-pill-faq>`, '24rem'),
};
