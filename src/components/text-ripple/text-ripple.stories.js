import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Texts/Text Ripple',
  component: 'lw-text-ripple',
  parameters: { layout: 'centered' },
  render: (args) => `<lw-text-ripple ${attributes(args)} style="font-size: clamp(2.25rem, 7vw, 4.5rem); letter-spacing: -0.03em"></lw-text-ripple>`,
  argTypes: {
    text: { name: 'Text', control: 'text' },
    duration: { name: 'Duration', control: { type: 'range', min: 0.3, max: 3, step: 0.05 } },
    spread: { name: 'Spread', control: { type: 'range', min: 0.4, max: 3, step: 0.1 } },
    'z-distance': { name: 'Z distance', control: { type: 'range', min: 0, max: 60, step: 1 } },
    'x-distance': { name: 'X distance', control: { type: 'range', min: -10, max: 10, step: 0.5 } },
    'y-distance': { name: 'Y distance', control: { type: 'range', min: -16, max: 16, step: 0.5 } },
    'scale-distance': { name: 'Scale', control: { type: 'range', min: 1, max: 1.6, step: 0.01 } },
    'rotate-y-distance': { name: 'Rotate Y', control: { type: 'range', min: -60, max: 60, step: 1 } },
    'base-color': { name: 'Base color', control: 'color' },
    'ripple-color': { name: 'Ripple color', control: 'color' },
    paused: { name: 'Paused', control: 'boolean' },
  },
  args: { text: 'Make it move', duration: 1, spread: 1, 'z-distance': 10, 'x-distance': 2, 'y-distance': -2, 'scale-distance': 1.1, 'rotate-y-distance': 10, paused: false },
};

// A crest of depth runs through the headline.
export const Default = {};

// A deep, tight crest that sweeps fast and turns hard.
export const Deep = {
  args: { text: 'Ripple through', duration: 0.8, spread: 2, 'z-distance': 40, 'y-distance': -8, 'scale-distance': 1.2, 'rotate-y-distance': 28 },
};

// Brand colors, as a page heading.
export const Colors = {
  args: { text: 'Launch week', level: 1, 'base-color': '#94a3b8', 'ripple-color': '#2563eb', duration: 1.2 },
};
