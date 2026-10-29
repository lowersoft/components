import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Login/Invite Signup',
  component: 'lw-invite-signup',
  render: (args) => `<lw-invite-signup ${attributes(args)}></lw-invite-signup>`,
  args: {},
};

// Type your name and watch the empty seat draw you; decline it and undo within a few seconds.
export const Default = {};
