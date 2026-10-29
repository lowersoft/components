import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Backgrounds/Topo Background',
  component: 'lw-topo-background',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-topo-background ${attributes(args)}></lw-topo-background>`,
  args: { heading: 'Find your footing', interval: 0.07, speed: 1, seed: 26, plain: false, still: false },
};

// Move the cursor to raise a hill; click to send a ripple across the map.
export const Default = {};
