import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Buttons/Tear',
  component: 'lw-tear-button',
  render: (args) => `<lw-tear-button ${attributes(args)}></lw-tear-button>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'destructive'] },
    'reset-after': { control: { type: 'number', step: 100 } },
  },
  args: {
    variant: 'primary',
    label: 'Delete workspace',
    description: 'Tear off the stub to confirm',
    'stub-label': 'Tear',
    'confirmed-label': 'Workspace deleted',
    'confirmed-description': 'Kept in trash for 30 days',
    'reset-after': 2400,
  },
};

export const Default = {};

export const Variants = {
  render: () => `
    <div style="display: grid; gap: 1rem">
      <lw-tear-button></lw-tear-button>
      <lw-tear-button variant="secondary" label="Archive project" confirmed-label="Project archived" confirmed-description="Restore it any time"></lw-tear-button>
      <lw-tear-button variant="destructive" label="Cancel subscription" confirmed-label="Subscription cancelled" confirmed-description="Active until the period ends"></lw-tear-button>
    </div>`,
};
