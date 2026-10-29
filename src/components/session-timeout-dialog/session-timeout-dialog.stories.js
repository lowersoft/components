import { modalStory } from '../../../.storybook/modal-story.js';
import './index.js';

export default {
  title: 'Modals/Session Timeout Dialog',
  component: 'lw-session-timeout-dialog',
  render: modalStory('lw-session-timeout-dialog', 'Show warning'),
  args: { open: true, seconds: 60 },
};

// The ring empties with the seconds and turns red for the last ten.
export const Default = {};
