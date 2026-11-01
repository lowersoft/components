import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Login/Split Signup Login',
  component: 'lw-split-signup-login',
  render: (args) => `<lw-split-signup-login ${attributes(args)}></lw-split-signup-login>`,
  args: { brand: 'LowerSoft' },
};

// Fill in a name, an email and a password, then create the account.
export const Default = {};
