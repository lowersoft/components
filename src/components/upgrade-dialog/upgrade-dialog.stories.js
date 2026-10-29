import { modalStory } from '../../../.storybook/modal-story.js';
import './index.js';

export default {
  title: 'Modals/Upgrade Dialog',
  component: 'lw-upgrade-dialog',
  render: modalStory('lw-upgrade-dialog', 'Upgrade'),
  args: { open: true, billing: 'yearly', value: 'pro' },
};

// Pick a plan and the billing: the prices, what changes and today's total follow.
export const Default = {};
