import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Navigation/Toolbar',
  component: 'lw-toolbar',
  parameters: { layout: 'padded' },
  render: (args) => `<lw-toolbar ${attributes(args)}></lw-toolbar>`,
  argTypes: {
    edge: { control: 'inline-radio', options: ['bottom', 'left', 'top', 'right'] },
    shortcuts: { control: 'inline-radio', options: ['scoped', 'global', 'off'] },
  },
  args: { edge: 'bottom', shortcuts: 'scoped' },
};

// Hover a tool for its shortcut, long-press Shapes for its flyout, and throw
// the dock by its grip to any edge.
export const Default = {};

export const LeftEdge = {
  args: { edge: 'left', value: 'ellipse' },
};
