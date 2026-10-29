import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Input/Swatch Fan',
  component: 'lw-swatch-fan',
  render: (args) => `<lw-swatch-fan ${attributes(args)}></lw-swatch-fan>`,
  args: { open: false },
};

// Drag the deck sideways to fan it open, pick a shade, copy the hex.
export const Default = {};

export const Open = {
  args: { open: true },
};
