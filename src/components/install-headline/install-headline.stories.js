import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Headline/Install Headline',
  component: 'lw-install-headline',
  parameters: { layout: 'padded' },
  argTypes: { method: { control: 'inline-radio', options: ['bun', 'npm', 'pnpm', 'agent'] } },
  render: (args) => `<div style="margin: 4rem auto"><lw-install-headline ${attributes(args)}></lw-install-headline></div>`,
  args: { method: 'bun' },
};

// Switch the package manager, or to a prompt for your agent: the command swaps in place. The button copies it.
export const Default = {};
