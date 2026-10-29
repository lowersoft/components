import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Media/Synced Transcript',
  component: 'lw-synced-transcript',
  render: (args) => `<lw-synced-transcript ${attributes(args)}></lw-synced-transcript>`,
  args: { heading: 'Frame Rate · Episode 48' },
};

// Play, click any word to jump there, or scroll away and use Back to now.
export const Default = {};
