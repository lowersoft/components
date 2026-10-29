import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Action Search Bar/Slash Command Menu',
  component: 'lw-slash-command-menu',
  render: (args) => `<lw-slash-command-menu ${attributes(args)}></lw-slash-command-menu>`,
  args: { channel: 'runtime' },
};

// Type / to open the commands; Tab takes one, Enter sends. Try /remind or /shrug.
export const Default = {};
