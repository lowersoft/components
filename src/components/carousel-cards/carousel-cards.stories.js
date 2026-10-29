import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Carousel Cards',
  component: 'lw-carousel-cards',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-carousel-cards ${attributes(args)}></lw-carousel-cards>`,
  args: { heading: 'Workshops this season', eyebrow: 'Hands-on systems programming' },
};

// Flick the rail with the mouse, scroll it, or focus it and use the arrows.
export const Default = {};

export const Saved = {
  args: { favorites: JSON.stringify(['dolomites', 'tokyo']) },
};
