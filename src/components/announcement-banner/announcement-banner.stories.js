import { appFrame } from '../../../.storybook/app-frame.js';
import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Banners/Announcement Banner',
  component: 'lw-announcement-banner',
  parameters: { layout: 'padded' },
  render: (args) => appFrame(`<lw-announcement-banner ${attributes(args)}></lw-announcement-banner>`),
  args: { interval: 6, paused: false },
};

// The segments fill and the next announcement comes; point at the strip to hold it, or pause it.
export const Default = {};
