import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Action Tool Bar/Action Toolbar',
  component: 'lw-action-toolbar',
  parameters: { layout: 'padded' },
  render: (args) => `<lw-action-toolbar ${attributes(args)}></lw-action-toolbar>`,
  args: {},
};

// Tick rows (Shift-click for a run, or X on a focused row): the toolbar rises with the actions.
export const Default = {};
