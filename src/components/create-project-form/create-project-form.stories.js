import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Forms/Create Project Form',
  component: 'lw-create-project-form',
  render: (args) => `<lw-create-project-form ${attributes(args)}></lw-create-project-form>`,
  args: { template: 'cli', region: 'fra1', visibility: 'private' },
};

// Type a name: the address follows, and is checked once you pause ("core" is taken).
export const Default = {};
