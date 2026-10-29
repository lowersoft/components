import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Texts/Cradle Text',
  component: 'lw-cradle-text',
  render: (args) =>
    `<lw-cradle-text ${attributes(args)} style="font: 600 4.5rem/1 system-ui; letter-spacing: -0.025em">Momentum</lw-cradle-text>`,
  argTypes: {
    bounce: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
  },
  args: { bounce: 0.97, 'no-intro': false },
};

export const Default = {};

// Soft collisions: a knock dies out within a few letters.
export const Rubber = {
  args: { bounce: 0.4 },
};
