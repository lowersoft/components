import { modalStory } from '../../../.storybook/modal-story.js';
import './index.js';

export default {
  title: 'Flows/Auth/Auth Dialog',
  component: 'lw-auth-dialog',
  render: modalStory('lw-auth-dialog', 'Sign in'),
  argTypes: {
    view: { control: 'inline-radio', options: ['sign-in', 'sign-up'] },
  },
  args: { open: true, view: 'sign-in', brand: 'LowerSoft' },
};

// Sign in with an email and password, or press Create an account and the
// sign-up slides in from the right; its Sign in slides back.
export const Default = {};

// Open on the sign-up, as a page's Get started would.
export const SignUp = { args: { view: 'sign-up' } };
