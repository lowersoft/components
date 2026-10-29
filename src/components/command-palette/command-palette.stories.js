import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Action Search Bar/Command Palette',
  component: 'lw-command-palette',
  render: (args) => `<lw-command-palette ${attributes(args)}></lw-command-palette>`,
  args: {},
};

// Ctrl+K focuses it. Type > # or @ to scope; "Move to" opens a second step, Backspace steps out.
export const Default = {};
