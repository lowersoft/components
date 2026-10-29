import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Image Generation Card',
  component: 'lw-image-generation-card',
  render: (args) => `<lw-image-generation-card ${attributes(args)}></lw-image-generation-card>`,
  args: { ratio: '4:3' },
};

// Generate resolves the image from coarse blocks to sharp, then four variations land.
export const Default = {};
