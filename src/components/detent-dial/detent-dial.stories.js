import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Inputs/Detent Dial',
  component: 'lw-detent-dial',
  render: (args) => `<div style="padding: 1.5rem"><lw-detent-dial ${attributes(args)}></lw-detent-dial></div>`,
  argTypes: {
    size: { control: { type: 'range', min: 160, max: 320, step: 8 } },
  },
  args: { label: 'Temperature', min: 16, max: 30, step: 0.5, value: 21, size: 240, disabled: false },
};

export const Default = {};

export const Volume = {
  args: { label: 'Volume', min: 0, max: 100, step: 1, value: 40, suffix: '%' },
};

// `formatValue` takes over the readout, the end labels and the spoken value.
export const CustomFormat = {
  render: () => {
    const dial = document.createElement('lw-detent-dial');
    Object.assign(dial, { label: 'Timer', min: 0, max: 60, step: 5, value: 25 });
    dial.formatValue = (minutes) => `${minutes}m`;
    return dial;
  },
};
