import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const stage = (markup) => `<div style="display: flex; justify-content: center; min-height: 34rem; padding-top: 2.5rem">${markup}</div>`;

export default {
  title: 'Navigation/Search & Commands/Gooey Search',
  component: 'lw-gooey-search',
  parameters: { layout: 'fullscreen' },
  render: (args) => stage(`<lw-gooey-search ${attributes(args)}></lw-gooey-search>`),
  argTypes: {
    placeholder: { name: 'Placeholder' },
    width: { name: 'Width', control: { type: 'range', min: 260, max: 560, step: 10 } },
    gap: { name: 'Gap', control: { type: 'range', min: 0, max: 32, step: 1 } },
    viscosity: { name: 'Viscosity', control: { type: 'range', min: 0, max: 14, step: 1 } },
    open: { name: 'Open', control: 'boolean' },
    'no-shortcut': { name: 'No shortcut', control: 'boolean' },
    fill: { name: 'Fill', control: 'color' },
    ink: { name: 'Ink', control: 'color' },
  },
  args: { placeholder: 'Ask or search anything', width: 400, gap: 14, viscosity: 7, open: false, 'no-shortcut': false },
};

// Press the button or ⌘K / Ctrl+K: the field stretches out and the results pour below. Type to filter.
export const Default = {};

// Opened, in a brand color.
export const Branded = { args: { open: true, fill: '#4f46e5', ink: '#fff' } };
