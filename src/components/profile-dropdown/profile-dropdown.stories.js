import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Navigation/Profile Dropdown',
  component: 'lw-profile-dropdown',
  render: (args) => `<div style="display: flex; justify-content: flex-end; width: 320px; height: 460px"><lw-profile-dropdown ${attributes(args)}></lw-profile-dropdown></div>`,
  argTypes: {
    status: { control: 'inline-radio', options: ['online', 'away', 'busy'] },
  },
  args: { status: 'online' },
};

// Open the card, switch accounts on the second page, and hold Sign out.
export const Default = {};

export const SingleAccount = {
  args: {
    accounts: JSON.stringify([{ id: 'me', name: 'Ada Lovelace', email: 'ada@analytical.engine', plan: 'Free' }]),
    status: 'away',
  },
};
