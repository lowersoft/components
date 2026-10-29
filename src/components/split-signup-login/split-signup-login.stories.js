import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Login/Split Signup Login',
  component: 'lw-split-signup-login',
  render: (args) => `<lw-split-signup-login ${attributes(args)}></lw-split-signup-login>`,
  args: { brand: 'LowerSoft', 'app-domain': 'lowersoft.dev' },
};

// Type a name and a work email: try sam@northwind.dev for a known team, a gmail address, or any other domain.
export const Default = {};
