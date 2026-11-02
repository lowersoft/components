import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const stage = `<div style="display: grid; min-height: 30rem; place-items: center; align-content: center; gap: 0.75rem; padding: 2rem; text-align: center; font-family: system-ui, sans-serif">
  <h1 style="margin: 0; font-size: clamp(2.5rem, 7vw, 4.5rem); font-weight: 700; line-height: 1; letter-spacing: -0.04em">Every move<br>leaves a mark</h1>
  <p style="margin: 0; opacity: 0.6">Move your pointer across the stage.</p>
</div>`;

export default {
  title: 'Backgrounds/Cursor Trail',
  component: 'lw-cursor-trail',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-cursor-trail ${attributes(args)}>${stage}</lw-cursor-trail>`,
  argTypes: {
    variant: { control: 'inline-radio', options: ['ribbon', 'ink', 'beads', 'sparks'] },
    palette: { control: 'inline-radio', options: ['indigo', 'ember', 'lagoon', 'mono'] },
    layer: { control: 'inline-radio', options: ['above', 'below'] },
    theme: { control: 'inline-radio', options: ['auto', 'light', 'dark'] },
    size: { control: { type: 'range', min: 4, max: 40, step: 1 } },
    length: { control: { type: 'range', min: 8, max: 80, step: 1 } },
  },
  args: { variant: 'ribbon', palette: 'indigo', size: 14, length: 32, layer: 'above', theme: 'auto', global: false },
};

// A tapered ribbon that stretches behind the pointer and folds away when it stops.
export const Ribbon = {};

// A broad nib: thick across its edge, thin along it.
export const Ink = { args: { variant: 'ink', palette: 'mono', size: 18 } };

// Lit beads at even spacing.
export const Beads = { args: { variant: 'beads', palette: 'lagoon' } };

// Sparks that curl away and burn out.
export const Sparks = { args: { variant: 'sparks', palette: 'ember' } };
