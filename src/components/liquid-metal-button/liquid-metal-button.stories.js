import { attributes } from '../../../.storybook/attributes.js';
import { strokeIcon } from '../../core/icons.js';
import { wandSparkles } from '../../core/lucide.js';
import './index.js';

const row = (markup) => `<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem">${markup}</div>`;

export default {
  title: 'Controls/Buttons/Styled/Liquid Metal',
  component: 'lw-liquid-metal-button',
  render: (args) => row(`<lw-liquid-metal-button ${attributes(args)}>Get started</lw-liquid-metal-button><lw-liquid-metal-button ${attributes({ ...args, shape: 'circle' })} aria-label="Ask the assistant">${strokeIcon(wandSparkles, 20, 1.75)}</lw-liquid-metal-button>`),
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    theme: { control: 'inline-radio', options: ['auto', 'light', 'dark'] },
    tint: { control: 'color' },
    speed: { control: { type: 'range', min: 0, max: 3, step: 0.1 } },
    iridescence: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    rim: { control: { type: 'range', min: 1, max: 6, step: 0.25 } },
  },
  args: { size: 'lg', theme: 'auto', speed: 1, iridescence: 0.6 },
};

// The metal flows around the ring; hover to speed it up, press for a surge.
export const Default = {};

// The three heights.
export const Sizes = {
  render: () => row(['sm', 'md', 'lg'].map((size) => `<lw-liquid-metal-button size="${size}">Continue</lw-liquid-metal-button>`).join('')),
};

// Tinted gold and rose.
export const Tinted = {
  render: () => row('<lw-liquid-metal-button size="lg" tint="#e8c26b">Upgrade to Gold</lw-liquid-metal-button><lw-liquid-metal-button size="lg" tint="#f2a7b8">Send gift</lw-liquid-metal-button>'),
};
