import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Sections/Social Proof/Morphing Wordmarks',
  component: 'lw-morphing-wordmarks',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 64rem; margin: 5rem auto"><lw-morphing-wordmarks ${attributes(args)}></lw-morphing-wordmarks></div>`,
  args: {},
};

// Every 2.8 seconds the odd places change, then the even ones: ten names
// through five places.
export const Default = {};

// Just the row, under a short line.
export const Compact = {
  args: { heading: 'In use at', description: '' },
};

// On a phone the row wraps onto more lines.
export const Narrow = {
  render: (args) => `<div style="max-width: 22rem; margin: 3rem auto"><lw-morphing-wordmarks ${attributes(args)}></lw-morphing-wordmarks></div>`,
};
