import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const range = (name, min, max, step = 1) => ({ name, control: { type: 'range', min, max, step } });

export default {
  title: 'Texts/Text Path',
  component: 'lw-text-path',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 48rem; margin: 4rem auto"><lw-text-path ${attributes(args)}></lw-text-path></div>`,
  argTypes: {
    text: { name: 'Text' },
    curve: { name: 'Curve', control: 'inline-radio', options: ['arc', 'wave', 'circle'] },
    direction: { name: 'Direction', control: 'inline-radio', options: ['forward', 'reverse'] },
    duration: range('Duration', 4, 30),
    repeats: range('Repeats', 1, 6),
    'font-size': range('Size', 14, 48),
    'letter-spacing': range('Tracking', 0, 0.2, 0.01),
    fill: { name: 'Color', control: 'color' },
    'show-path': { name: 'Show path', control: 'boolean' },
  },
  args: { text: 'Every component ships with its own motion', curve: 'arc', direction: 'forward', duration: 14, repeats: 3, 'font-size': 28, 'letter-spacing': 0.05, 'show-path': false },
};

// The text slides along the arc on a seamless loop.
export const Arc = {};

// A wave, with its path drawn.
export const Wave = { args: { curve: 'wave', 'show-path': true, duration: 18 } };

// Round a ring sized to fit the copies; it spins.
export const Circle = { args: { curve: 'circle', text: 'LowerSoft components', repeats: 3, 'font-size': 22, 'letter-spacing': 0.18, duration: 20 } };
