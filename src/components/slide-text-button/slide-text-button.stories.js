import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const ARROW_ICON =
  '<svg slot="end" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

export default {
  title: 'Buttons/Slide Text',
  component: 'lw-slide-text-button',
  render: ({ label, ...args }) => `<lw-slide-text-button ${attributes(args)}>${label}</lw-slide-text-button>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    label: 'Browse components',
    'hover-text': 'Explore the library',
    href: '#',
    variant: 'primary',
    size: 'lg',
    'animate-in': true,
    disabled: false,
  },
};

export const Default = {};

export const Variants = {
  render: () => `
    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem">
      <lw-slide-text-button href="#" animate-in>Browse components</lw-slide-text-button>
      <lw-slide-text-button href="#" variant="outline" hover-text="Read the docs">Documentation</lw-slide-text-button>
      <lw-slide-text-button variant="secondary" hover-text="Let's go">Get started${ARROW_ICON}</lw-slide-text-button>
    </div>`,
};
