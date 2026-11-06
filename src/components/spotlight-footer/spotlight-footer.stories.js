import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Footers/Spotlight Footer',
  component: 'lw-spotlight-footer',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-spotlight-footer ${attributes(args)}></lw-spotlight-footer></div>`,
  args: { 'no-rule': false },
};

// Move the mouse across the name at the foot and a light follows it.
export const Default = {};

// Another accent for the square, and no rule along the top.
export const Signal = {
  render: (args) => `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end"><lw-spotlight-footer ${attributes(args)} style="--lw-spotlight-footer-accent: #ef4444"></lw-spotlight-footer></div>`,
  args: { brand: 'Syscall', email: 'team@syscall.dev', 'no-rule': true, tagline: 'Tracing for the kernel and everything above it, with overhead you will not find in a profile.' },
};
