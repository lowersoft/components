import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Media/Photo Straighten',
  component: 'lw-photo-straighten',
  render: (args) => `<lw-photo-straighten ${attributes(args)}></lw-photo-straighten>`,
  args: { tilt: 4.2 },
};

// Drag or throw the ruler, press Auto, or double-click the ruler to reset.
export const Default = {};
