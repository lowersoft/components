import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Media/Clip Trimmer',
  component: 'lw-clip-trimmer',
  render: (args) => `<lw-clip-trimmer ${attributes(args)}></lw-clip-trimmer>`,
  args: { duration: 12, start: 2.4, end: 9, 'min-length': 1 },
};

// Drag a handle (it snaps to whole seconds), slide the kept range, or play the loop.
export const Default = {};
