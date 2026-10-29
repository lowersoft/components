import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const ARCHIVE_ICON =
  '<svg slot="start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/></svg>';

export default {
  title: 'Buttons/Undo',
  component: 'lw-undo-button',
  render: ({ label, ...args }) => `<lw-undo-button ${attributes(args)}>${ARCHIVE_ICON}${label}</lw-undo-button>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    duration: { control: { type: 'number', step: 500 } },
    'reset-after': { control: { type: 'number', step: 100 } },
  },
  args: {
    label: 'Archive',
    'done-label': 'Archived',
    'undo-label': 'Undo',
    variant: 'outline',
    size: 'lg',
    duration: 5000,
    'reset-after': 2400,
  },
};

export const Default = {};
