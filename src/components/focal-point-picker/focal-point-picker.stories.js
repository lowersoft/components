import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Media/Focal Point Picker',
  component: 'lw-focal-point-picker',
  render: (args) => `<lw-focal-point-picker ${attributes(args)}></lw-focal-point-picker>`,
  args: { x: 0.68, y: 0.38 },
};

// Drag or click to move the point; hover a crop to see its window on the source.
export const Default = {};
