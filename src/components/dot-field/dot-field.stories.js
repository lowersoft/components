import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Backgrounds/Dot Field',
  component: 'lw-dot-field',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-dot-field ${attributes(args)}></lw-dot-field>`,
  args: { heading: 'Leave a mark', spacing: 16, seed: 7, still: false },
};

// Swipe fast across the field to leave a wake; click to send a shockwave.
export const Default = {};
