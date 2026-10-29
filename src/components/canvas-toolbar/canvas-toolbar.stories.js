import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Toolbars/Canvas Toolbar',
  component: 'lw-canvas-toolbar',
  parameters: { layout: 'padded' },
  render: (args) => `<lw-canvas-toolbar ${attributes(args)}></lw-canvas-toolbar>`,
  args: { zoom: 0.86 },
};

// Drag a note (or focus it and use the arrow keys): the arrows follow. Undo, redo and zoom from the toolbar.
export const Default = {};
