import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'File Tree/File Tree',
  component: 'lw-file-tree',
  render: (args) => `<lw-file-tree ${attributes(args)}></lw-file-tree>`,
  args: { selected: 'src/alloc/arena.c' },
};

// Arrow keys walk the tree, a letter jumps to a name; the guides light the path to the selected file.
export const Default = {};
