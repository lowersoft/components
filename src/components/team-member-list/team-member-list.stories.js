import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Animated List/Team Member List',
  component: 'lw-team-member-list',
  render: (args) => `<lw-team-member-list ${attributes(args)}></lw-team-member-list>`,
  args: {},
};

// Filter by name, email or role; change a role, or remove someone, from their row's menu.
export const Default = {};
