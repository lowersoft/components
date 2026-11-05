import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Texts/Text Shimmer',
  component: 'lw-text-shimmer',
  parameters: { layout: 'centered' },
  render: (args) => `<lw-text-shimmer ${attributes(args)} style="font-size: clamp(2rem, 6vw, 4rem); letter-spacing: -0.03em"></lw-text-shimmer>`,
  argTypes: {
    text: { name: 'Text', control: 'text' },
    duration: { name: 'Duration', control: { type: 'range', min: 0.5, max: 6, step: 0.1 } },
    delay: { name: 'Delay', control: { type: 'range', min: 0, max: 3, step: 0.1 } },
    direction: { name: 'Direction', control: 'inline-radio', options: ['left', 'right'] },
    yoyo: { name: 'Yoyo', control: 'boolean' },
    'pause-on-hover': { name: 'Pause on hover', control: 'boolean' },
    spread: { name: 'Spread', control: { type: 'range', min: 8, max: 60, step: 1 } },
    angle: { name: 'Angle', control: { type: 'range', min: 0, max: 180, step: 1 } },
    'base-color': { name: 'Base color', control: 'color' },
    'shimmer-color': { name: 'Shimmer color', control: 'color' },
    paused: { name: 'Paused', control: 'boolean' },
  },
  args: { text: 'Thinking it through', duration: 2, delay: 0, direction: 'right', yoyo: false, 'pause-on-hover': false, spread: 22, angle: 90, paused: false },
};

// A band of light sweeps across the line.
export const Default = {};

// A slanted, wider band that rests between sweeps and comes back.
export const Slanted = {
  args: { text: 'Generating your report', angle: 115, spread: 34, delay: 0.8, yoyo: true },
};

// Any colors, set as attributes.
export const Colors = {
  args: { text: 'Limited time offer', 'base-color': '#7c3aed', 'shimmer-color': '#f5d0fe', duration: 2.6 },
};

// Inline, as a status line in running text.
export const Inline = {
  render: () => `<p style="font: 500 1rem/1.5 system-ui; margin: 0">Assistant is <lw-text-shimmer duration="1.6" style="font-weight: 500; vertical-align: baseline">searching the docs</lw-text-shimmer>…</p>`,
};
