import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Login/Account Chooser Login',
  component: 'lw-account-chooser-login',
  render: (args) => `<lw-account-chooser-login ${attributes(args)}></lw-account-chooser-login>`,
  args: { brand: 'LowerSoft' },
};

// Hover a row for its session, use the arrow keys, and choose one to open its step; forget one and undo it.
export const Default = {};
