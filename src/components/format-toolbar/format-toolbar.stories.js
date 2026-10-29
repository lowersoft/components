import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Toolbars/Format Toolbar',
  component: 'lw-format-toolbar',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="padding-top: 4rem"><lw-format-toolbar ${attributes(args)}></lw-format-toolbar></div>`,
  args: {},
};

// Select some text: the toolbar floats over it, showing what the selection already has.
export const Default = {};
