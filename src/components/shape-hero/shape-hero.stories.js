import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Backgrounds/Shape Hero',
  component: 'lw-shape-hero',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-shape-hero ${attributes(args)}></lw-shape-hero>`,
  args: { heading: 'Components with a little gravity', fill: 0.3 },
};

// Grab a shape and throw it; the pile settles and sleeps.
export const Default = {};
