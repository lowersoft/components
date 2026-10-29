import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Backgrounds/Background Paths',
  component: 'lw-background-paths',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-background-paths ${attributes(args)}></lw-background-paths>`,
  args: { heading: 'Calm by default', count: 42, spread: 1, angle: -8, speed: 1, still: false },
};

// Move the cursor through the ribbon and the lines part around it.
export const Default = {};
