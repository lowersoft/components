import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Heroes/Work Flow Hero',
  component: 'lw-work-flow-hero',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-work-flow-hero ${attributes(args)}></lw-work-flow-hero>`,
  args: { project: 'lower', step: 'gui', paused: false },
};

// The build plays itself; click any step to open it in the inspector, pause or replay it from the top bar.
export const Default = {};
