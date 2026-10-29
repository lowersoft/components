import { modalStory } from '../../../.storybook/modal-story.js';
import './index.js';

export default {
  title: 'Modals/New Project Dialog',
  component: 'lw-new-project-dialog',
  render: modalStory('lw-new-project-dialog', 'New project'),
  args: { open: true, template: 'cli' },
};

// Arrow keys move between templates and Enter goes on to the name; the address follows it.
export const Default = {};
