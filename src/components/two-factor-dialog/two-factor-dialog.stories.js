import { modalStory } from '../../../.storybook/modal-story.js';
import './index.js';

export default {
  title: 'Modals/Two Factor Dialog',
  component: 'lw-two-factor-dialog',
  render: modalStory('lw-two-factor-dialog', 'Turn on two-factor'),
  args: { open: true, step: 0 },
};

// Scan (the code here is a stand-in; pass qr-src for the real one), enter any six digits, then keep the recovery codes.
export const Default = {};
