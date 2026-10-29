import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const SEARCH_ICON =
  '<svg slot="start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

export default {
  title: 'Buttons/Command',
  component: 'lw-command-button',
  render: ({ label, ...args }) => `<lw-command-button ${attributes(args)}>${SEARCH_ICON}${label}</lw-command-button>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shortcut: { control: 'text' },
  },
  args: {
    label: 'Search',
    variant: 'outline',
    size: 'md',
    shortcut: 'mod+k',
    passive: false,
    disabled: false,
  },
};

export const Default = {};

export const Shortcuts = {
  render: () => `
    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem">
      <lw-command-button variant="outline" shortcut="mod+k">${SEARCH_ICON}Search</lw-command-button>
      <lw-command-button shortcut="mod+shift+p">Command palette</lw-command-button>
      <lw-command-button variant="secondary" shortcut="c">Compose</lw-command-button>
      <lw-command-button variant="ghost" shortcut="mod+enter">Send</lw-command-button>
    </div>`,
};
