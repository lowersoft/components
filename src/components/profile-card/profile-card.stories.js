import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Profile Card',
  component: 'lw-profile-card',
  render: (args) => `<lw-profile-card ${attributes(args)}></lw-profile-card>`,
  args: { name: 'Maya Chen', followers: 12480 },
};

// Follow morphs into Following while the follower count rolls up.
export const Default = {};
