import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '64rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/FAQs/Split Headline FAQ',
  component: 'lw-split-headline-faq',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-split-headline-faq ${attributes(args)}></lw-split-headline-faq>`),
  args: {},
};

// The second answer starts open; a plus turns into a cross as it folds.
export const Default = {};

// Another two-line headline, opening on the first question.
export const SelfHosting = {
  args: { eyebrow: 'Self-hosting', heading: 'Running lower yourself,\nthe common questions', open: 'farm' },
};

export const Narrow = {
  render: (args) => frame(`<lw-split-headline-faq ${attributes(args)}></lw-split-headline-faq>`, '24rem'),
};
