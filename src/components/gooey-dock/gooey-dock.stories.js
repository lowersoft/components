import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Navigation/Gooey Dock',
  component: 'lw-gooey-dock',
  render: (args) => `<lw-gooey-dock ${attributes(args)}></lw-gooey-dock>`,
  argTypes: {
    value: { name: 'Value', control: 'select', options: ['home', 'search', 'inbox', 'library', 'profile'] },
    viscosity: { name: 'Viscosity', control: { type: 'range', min: 0, max: 16, step: 1 } },
    fill: { name: 'Fill', control: 'color' },
    ink: { name: 'Ink', control: 'color' },
  },
  args: { value: 'home', viscosity: 8 },
};

// Pick an item: the capsule stretches toward it like liquid. Arrow keys work too.
export const Default = {};

// In a brand color.
export const Branded = { args: { value: 'library', fill: '#18181b', ink: '#facc15' } };
