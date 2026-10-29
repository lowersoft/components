import { modalStory } from '../../../.storybook/modal-story.js';
import './index.js';

export default {
  title: 'Modals/Shortcuts Dialog',
  component: 'lw-shortcuts-dialog',
  render: modalStory('lw-shortcuts-dialog', 'Keyboard shortcuts'),
  args: { open: true },
};

// Search by name, or press a shortcut (try Ctrl+K, or G then B) to find it.
export const Default = {};
