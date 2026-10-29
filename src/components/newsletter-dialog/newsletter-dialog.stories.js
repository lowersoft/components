import { modalStory } from '../../../.storybook/modal-story.js';
import './index.js';

export default {
  title: 'Modals/Newsletter Dialog',
  component: 'lw-newsletter-dialog',
  render: modalStory('lw-newsletter-dialog', 'Subscribe'),
  args: { open: true, frequency: 'every' },
};

// The latest issue, how often, then your address; subscribing confirms in place.
export const Default = {};
