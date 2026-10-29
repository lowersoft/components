import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Animated List/Activity Feed',
  component: 'lw-activity-feed',
  render: (args) => `<lw-activity-feed ${attributes(args)}></lw-activity-feed>`,
  args: { interval: 3.5, paused: false },
};

// New events slide in at the top while it is in view; pause holds it.
export const Default = {};
