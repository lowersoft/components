import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Login/Magic Link Login',
  component: 'lw-magic-link-login',
  render: (args) => `<lw-magic-link-login ${attributes(args)}></lw-magic-link-login>`,
  argTypes: {
    method: { control: 'inline-radio', options: ['magic', 'password'] },
    'last-used': { control: 'inline-radio', options: ['google', 'github', 'email'] },
  },
  args: { brand: 'LowerSoft', method: 'magic', 'last-used': 'google' },
};

// Type an address (Tab completes the domain) and send: the draft becomes the delivered link, with its code.
export const Default = {};

// The classic email and password form.
export const Password = { args: { method: 'password', 'last-used': 'email' } };
