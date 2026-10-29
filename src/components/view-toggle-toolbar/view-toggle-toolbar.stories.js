import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Toolbars/View Toggle Toolbar',
  component: 'lw-view-toggle-toolbar',
  parameters: { layout: 'padded' },
  argTypes: { view: { control: 'inline-radio', options: ['board', 'list', 'table'] } },
  render: (args) => `<lw-view-toggle-toolbar ${attributes(args)}></lw-view-toggle-toolbar>`,
  args: { view: 'board' },
};

// Switch between board, list and table; sort, flip the order, or hide what has shipped.
export const Default = {};
