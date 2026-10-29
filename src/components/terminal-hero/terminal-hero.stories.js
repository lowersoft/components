import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Heroes/Terminal Hero',
  component: 'lw-terminal-hero',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-terminal-hero ${attributes(args)}></lw-terminal-hero>`,
  args: { project: 'lower-web', command: 'make release' },
};

// The build streams itself; copy the command from the top bar, or replay it.
export const Default = {};
