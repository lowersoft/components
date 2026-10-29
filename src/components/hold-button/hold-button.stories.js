import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const TRASH_ICON =
  '<svg slot="start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>';

export default {
  title: 'Buttons/Hold',
  component: 'lw-hold-button',
  render: ({ label, ...args }) => `<lw-hold-button ${attributes(args)}>${TRASH_ICON}${label}</lw-hold-button>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    duration: { control: { type: 'number', step: 100 } },
    'reset-after': { control: { type: 'number', step: 100 } },
  },
  args: {
    label: 'Hold to delete',
    variant: 'outline',
    size: 'md',
    duration: 1200,
    'holding-label': 'Keep holding',
    'complete-label': 'Deleted',
    'reset-after': 1800,
    disabled: false,
  },
};

export const Default = {};

export const Destructive = { args: { variant: 'destructive' } };

export const Variants = {
  render: () => `
    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem">
      <lw-hold-button>Hold to send</lw-hold-button>
      <lw-hold-button variant="secondary" complete-label="Archived">Hold to archive</lw-hold-button>
      <lw-hold-button variant="outline" complete-label="Signed out">Hold to sign out</lw-hold-button>
      <lw-hold-button variant="destructive" complete-label="Deleted">${TRASH_ICON}Hold to delete</lw-hold-button>
    </div>`,
};
