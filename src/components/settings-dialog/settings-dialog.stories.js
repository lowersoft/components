import { modalStory } from '../../../.storybook/modal-story.js';
import './index.js';

export default {
  title: 'Modals/Settings Dialog',
  component: 'lw-settings-dialog',
  render: modalStory('lw-settings-dialog', 'Settings'),
  args: { open: true, section: 'general' },
};

// Change something in any section: it is dotted, and a bar offers to save or discard.
export const Default = {};
