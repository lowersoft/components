import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

// Lowersoft's banner, for the accounts' banners.
const BANNER = 'https://raw.githubusercontent.com/lowersoft/.github/refs/heads/main/bg_1.jpg';

export default {
  title: 'Navigation/Menus/Profile Dropdown',
  component: 'lw-profile-dropdown',
  render: (args) => `<div style="display: flex; justify-content: flex-end; width: min(320px, 100%); height: 460px"><lw-profile-dropdown ${attributes(args)}></lw-profile-dropdown></div>`,
  argTypes: {
    status: { control: 'inline-radio', options: ['online', 'away', 'busy'] },
  },
  args: { status: 'online' },
};

// Open the card, switch accounts on the second page, and hold Sign out.
export const Default = {};

// Each account with a banner across the top of the menu: the avatar sits on
// its lower edge in a ring of the menu's colour, the plan under the name.
export const WithBanner = {
  args: {
    accounts: JSON.stringify([
      { id: 'personal', name: 'Maya Ortega', email: 'maya@ortega.me', plan: 'Pro', banner: BANNER },
      { id: 'lowersoft', name: 'LowerSoft', email: 'team@lowersoft.com', plan: 'Team', banner: BANNER },
      { id: 'side', name: 'Night Shift', email: 'hello@nightshift.dev', plan: 'Free', banner: BANNER },
    ]),
  },
};

export const SingleAccount = {
  args: {
    accounts: JSON.stringify([{ id: 'me', name: 'Ada Lovelace', email: 'ada@analytical.engine', plan: 'Free' }]),
    status: 'away',
  },
};
