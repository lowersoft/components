import { modalStory } from '../../../.storybook/modal-story.js';
import './index.js';

export default {
  title: 'Modals/Feedback Dialog',
  component: 'lw-feedback-dialog',
  render: modalStory('lw-feedback-dialog', 'Give feedback'),
  args: { open: true, product: 'LowerSoft' },
};

// Pick a score, with the mouse or the number keys: the follow-up depends on it.
export const Default = {};
