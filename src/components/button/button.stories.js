import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const SAVE_ICON =
  '<svg slot="start" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7M7 3v4a1 1 0 0 0 1 1h7"/></svg>';

export default {
  title: 'Buttons/Base',
  component: 'lw-button',
  render: ({ label, ...args }) => `<lw-button ${attributes(args)}>${SAVE_ICON}${label}</lw-button>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
  args: {
    label: 'Save changes',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    'disabled-reason': '',
    shortcut: 'mod+enter',
  },
};

export const Playground = {};

export const Variants = {
  render: () => `
    <div style="display: flex; gap: 0.75rem">
      <lw-button>Primary</lw-button>
      <lw-button variant="secondary">Secondary</lw-button>
      <lw-button variant="outline">Outline</lw-button>
      <lw-button variant="ghost">Ghost</lw-button>
      <lw-button variant="destructive">Destructive</lw-button>
    </div>`,
};

export const Sizes = {
  render: () => `
    <div style="display: flex; gap: 0.75rem; align-items: center">
      <lw-button size="sm">Small</lw-button>
      <lw-button>Medium</lw-button>
      <lw-button size="lg">Large</lw-button>
    </div>`,
};

// The icon becomes the spinner; clicks are held until loading ends.
export const Loading = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `<lw-button>${SAVE_ICON}Save changes</lw-button>`;
    const button = template.content.firstElementChild;
    button.addEventListener('click', () => {
      button.loading = true;
      setTimeout(() => (button.loading = false), 1500);
    });
    return button;
  },
};

// Press ⌘↵ (Ctrl+↵ elsewhere) anywhere on the page.
export const Shortcut = {
  render: () => `<lw-button variant="outline" shortcut="mod+enter">${SAVE_ICON}Save changes</lw-button>`,
};

// Hover or focus the button to read why it is disabled.
export const DisabledReason = {
  render: () => `
    <div style="padding-top: 3rem">
      <lw-button disabled disabled-reason="Fill in the project name first">${SAVE_ICON}Create project</lw-button>
    </div>`,
};
