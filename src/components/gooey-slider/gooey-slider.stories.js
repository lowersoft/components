import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Gooey Slider',
  component: 'lw-gooey-slider',
  parameters: { layout: 'centered' },
  render: (args) => `<lw-gooey-slider ${attributes(args)}></lw-gooey-slider>`,
  argTypes: {
    value: { name: 'Value', control: { type: 'number' } },
    min: { name: 'Min', control: { type: 'number' } },
    max: { name: 'Max', control: { type: 'number' } },
    step: { name: 'Step', control: { type: 'number', min: 1 } },
    width: { name: 'Width', control: { type: 'range', min: 160, max: 560, step: 10 } },
    viscosity: { name: 'Viscosity', control: { type: 'range', min: 0, max: 14, step: 0.5 } },
    fill: { name: 'Fill', control: 'color' },
    ink: { name: 'Ink', control: 'color' },
    label: { name: 'Label', control: 'text' },
    disabled: { name: 'Disabled', control: 'boolean' },
  },
  args: { value: 64, min: 0, max: 100, step: 1, width: 300, viscosity: 7, label: 'Value', disabled: false },
};

// Drag fast to pull a tail behind the thumb.
export const Default = {};

// Any color, and a thicker blend.
export const Colors = {
  args: { value: 30, fill: '#2563eb', ink: '#ffffff', viscosity: 10, label: 'Volume' },
};

// Coarse steps on a wide track.
export const Stepped = {
  args: { value: 40, min: 0, max: 200, step: 20, width: 440, label: 'Budget' },
};

// Hard edges: no blend at all.
export const HardEdges = {
  args: { viscosity: 0 },
};
