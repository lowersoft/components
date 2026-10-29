import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Lightbox Grid',
  component: 'lw-lightbox-grid',
  render: (args) => `<lw-lightbox-grid ${attributes(args)}></lw-lightbox-grid>`,
  args: {  },
};

// Open a photo; swipe or use the arrows for the next, pull it away or press Escape to close.
export const Default = {};
