import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Buttons/Push',
  component: 'lw-push-button',
  render: ({ label, ...args }) => `<lw-push-button ${attributes(args)}>${label}</lw-push-button>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: { label: 'Check answer', variant: 'primary', size: 'lg' },
};

export const Default = {};

export const Variants = {
  render: () => `
    <div style="display: flex; gap: 0.75rem; align-items: end">
      <lw-push-button size="lg">Continue</lw-push-button>
      <lw-push-button size="lg" variant="secondary">Skip</lw-push-button>
      <lw-push-button size="lg" variant="outline">Hint</lw-push-button>
      <lw-push-button size="lg" variant="destructive">Give up</lw-push-button>
    </div>`,
};
