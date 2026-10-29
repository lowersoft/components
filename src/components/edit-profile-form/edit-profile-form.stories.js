import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Forms/Edit Profile Form',
  component: 'lw-edit-profile-form',
  render: (args) => `<lw-edit-profile-form ${attributes(args)}></lw-edit-profile-form>`,
  args: { 'avatar-style': 'ring' },
};

// Edit any field: the preview above follows as you type. Save lights up once something changed.
export const Default = {};
