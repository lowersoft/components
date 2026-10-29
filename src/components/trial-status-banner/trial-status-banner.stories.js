import { appFrame } from '../../../.storybook/app-frame.js';
import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const inDays = (days) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

export default {
  title: 'Banners/Trial Status Banner',
  component: 'lw-trial-status-banner',
  parameters: { layout: 'padded' },
  render: (args) => appFrame(`<lw-trial-status-banner ${attributes(args)}></lw-trial-status-banner>`),
  args: { plan: 'Pro', ends: inDays(4), length: 14 },
};

// One tick a day of the trial; spent days dim.
export const Default = {};

// The last day: the banner turns red.
export const LastDay = { args: { ends: inDays(1) } };
