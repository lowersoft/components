import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Heroes/Cloud Hero',
  component: 'lw-cloud-hero',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-cloud-hero ${attributes(args)}></lw-cloud-hero>`,
  argTypes: { speed: { control: { type: 'range', min: 0, max: 3, step: 0.1 } } },
  args: { speed: 1, paused: false },
};

// A neutral sky that follows the theme: silver by day, near black by night.
export const Default = {};

// A palette through the custom properties, one colour for each theme: a
// blue day with white clouds, a navy night with moonlit ones.
export const DaySky = {
  render: (args) => `
    <lw-cloud-hero ${attributes(args)} style="
      --lw-cloud-hero-sky-top: light-dark(#1f8bec, #050a1c);
      --lw-cloud-hero-sky-bottom: light-dark(#62bdfc, #13234b);
      --lw-cloud-hero-cloud: light-dark(#fff, #b9c4e0);
      --lw-cloud-hero-shade: light-dark(#8db4dc, #27375f)"></lw-cloud-hero>`,
  args: {
    heading: 'Static binaries,\nwherever the sky is.',
    description: 'Cross-compile once and lower ships the same binary to every region, with no runtime to install and nothing to warm up. Roll forward, roll back, and keep the storms out of production.',
  },
};

// A calmer drift; the corner button pauses it altogether.
export const Calm = {
  args: { speed: 0.4, heading: 'Fewer moving parts.\nMore quiet nights.', description: 'One binary, no daemons and no garbage collector to tune. lower keeps the runtime out of your way, so the only thing drifting is the weather.' },
};
