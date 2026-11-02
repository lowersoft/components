import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Media/Perspective Marquee',
  component: 'lw-perspective-marquee',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-perspective-marquee ${attributes(args)}></lw-perspective-marquee>`,
  argTypes: {
    rows: { control: { type: 'range', min: 1, max: 6, step: 1 } },
    speed: { control: { type: 'range', min: 8, max: 90, step: 1 } },
    gap: { control: { type: 'range', min: 0, max: 64, step: 2 } },
    'rotate-x': { control: { type: 'range', min: -40, max: 40, step: 1 } },
    'rotate-z': { control: { type: 'range', min: -45, max: 45, step: 1 } },
  },
  args: { rows: 4, speed: 40, gap: 24, 'rotate-x': 18, 'rotate-z': -22, 'pause-on-hover': false, 'fade-edges': false, 'no-lines': false },
};

// Rows slide without end, each the other way from the one above.
export const Default = {};

// Fades into the page at the edges and stops under the cursor.
export const Faded = { args: { 'fade-edges': true, 'pause-on-hover': true } };

// Flatter and quicker, without rails.
export const Flat = { args: { 'rotate-x': 8, 'rotate-z': -10, speed: 24, 'no-lines': true, rows: 3 } };
