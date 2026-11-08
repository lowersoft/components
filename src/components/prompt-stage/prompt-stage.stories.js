import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '68rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/Features/Prompt Stage',
  component: 'lw-prompt-stage',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-prompt-stage ${attributes(args)}></lw-prompt-stage>`),
  args: { value: '' },
};

// Open a desk in the accordion or press its chip: both change the card, and
// the new request comes into focus word by word.
export const Default = {};

// Opens on the last desk.
export const OpenOnADesk = {
  args: { value: 'release' },
};

// On a phone the stage moves under the copy.
export const Narrow = {
  render: (args) => frame(`<lw-prompt-stage ${attributes(args)}></lw-prompt-stage>`, '24rem'),
};
