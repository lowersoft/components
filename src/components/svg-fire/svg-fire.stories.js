import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Backgrounds/SVG Fire',
  component: 'lw-svg-fire',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-svg-fire ${attributes(args)}></lw-svg-fire>`,
  argTypes: {
    intensity: { control: { type: 'range', min: 0, max: 1, step: 0.02 } },
    rise: { control: { type: 'range', min: 0.1, max: 0.85, step: 0.01 } },
    distortion: { control: { type: 'range', min: 0, max: 1, step: 0.02 } },
    speed: { control: { type: 'range', min: 0, max: 3, step: 0.1 } },
    tint: { control: 'color' },
    theme: { control: 'inline-radio', options: ['auto', 'light', 'dark'] },
  },
  args: { intensity: 0.92, rise: 0.5, distortion: 0.72, speed: 1, theme: 'auto', paused: false, 'keep-colors': false },
};

// The mark's upward edges feed the fire; heat rises, swirls and breaks into flames.
export const Default = {};

// Your own mark as an SVG child, burning blue.
export const InlineMark = {
  render: (args) => `<lw-svg-fire ${attributes({ ...args, colors: '["#1d4ed8","#38bdf8","#e0f2fe"]' })}>
  <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#000" stroke-width="14"/><rect x="30" y="44" width="40" height="12"/></svg>
</lw-svg-fire>`,
};
