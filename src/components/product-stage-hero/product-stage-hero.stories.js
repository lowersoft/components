import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Heroes/Product Stage Hero',
  component: 'lw-product-stage-hero',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-product-stage-hero ${attributes(args)}></lw-product-stage-hero>`,
  args: { product: 'lower', cycle: 'Release 0.9' },
};

// Pick an issue, then run a command from the menu (Ctrl or Cmd K); the toast offers Undo.
export const Default = {};
