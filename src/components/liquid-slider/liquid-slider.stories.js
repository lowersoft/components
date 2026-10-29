import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Liquid Slider',
  component: 'lw-liquid-slider',
  render: (args) => `<lw-liquid-slider ${attributes(args)}></lw-liquid-slider>`,
  args: { label: 'Water today', value: 1250, min: 0, max: 2000, step: 50, unit: 'ml', disabled: false },
};

export const Default = {};

// Any liquid: the color is a custom property.
export const Coffee = {
  args: { label: 'Coffee', value: 180, min: 0, max: 350, step: 10 },
  render: (args) => `<lw-liquid-slider ${attributes(args)} style="--lw-liquid-slider-color: #92400e"></lw-liquid-slider>`,
};
