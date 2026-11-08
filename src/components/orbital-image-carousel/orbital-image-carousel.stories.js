import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Media/Carousels & Marquees/Orbital Image Carousel',
  component: 'lw-orbital-image-carousel',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<div style="padding: 2rem 0"><lw-orbital-image-carousel ${attributes(args)}></lw-orbital-image-carousel></div>`,
  argTypes: {
    radius: { control: { type: 'range', min: 200, max: 900, step: 10 } },
    perspective: { control: { type: 'range', min: 600, max: 3000, step: 50 } },
    'inactive-opacity': { control: { type: 'range', min: 0, max: 1, step: 0.02 } },
  },
  args: { 'card-width': 320, 'card-height': 392, radius: 470, perspective: 1700, 'inactive-opacity': 0.42, 'no-drag': false, 'no-snap': false },
};

// Drag to spin; a release settles on the nearest card. Focus it and use the arrow keys.
export const Default = {};

// Smaller cards on a wider ring.
export const Wide = { args: { 'card-width': 240, 'card-height': 300, radius: 640 } };
