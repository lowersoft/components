import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Bento Grid',
  component: 'lw-bento-grid',
  parameters: { layout: 'padded' },
  render: (args) => `<lw-bento-grid ${attributes(args)}></lw-bento-grid>`,
  args: { 'row-height': 176 },
};

// Press and hold a widget (or drag its grip) to move it; drag a corner to resize.
export const Default = {};
