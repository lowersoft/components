import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Headline/Inline Chips Headline',
  component: 'lw-inline-chips-headline',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="margin: 4rem auto"><lw-inline-chips-headline ${attributes(args)}></lw-inline-chips-headline></div>`,
  args: { doc: 'alloc-fix.c' },
};

// The chips pop in when the headline is seen, and the status builds, then lands. Press it to run it again.
export const Default = {};
