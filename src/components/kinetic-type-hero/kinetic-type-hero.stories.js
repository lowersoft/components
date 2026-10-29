import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Heroes/Kinetic Type Hero',
  component: 'lw-kinetic-type-hero',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-kinetic-type-hero ${attributes(args)}></lw-kinetic-type-hero>`,
  args: {},
};

// The headline sets itself in; move the cursor across it and the letters lean away.
export const Default = {};
