import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Data Display/Lists & Boards/Sortable List',
  component: 'lw-sortable-list',
  render: (args) => `<lw-sortable-list ${attributes(args)}></lw-sortable-list>`,
  args: {},
};

// Drag a handle; the others make room. Or focus one, Space to pick up, arrows to move, Space to drop.
export const Default = {};
