import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Backgrounds/Flow Field',
  component: 'lw-flow-field',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-flow-field ${attributes(args)}></lw-flow-field>`,
  args: { heading: 'Go with the flow', density: 1, speed: 1, still: false },
};

// Move the cursor through the wind, fast to shed vortices; click to send a gust.
export const Default = {};
