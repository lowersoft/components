import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const STUDIO = JSON.stringify([
  { id: 'signup', title: 'Sign up in a minute', description: 'An email and a password, and the studio is yours.', illustration: 'account' },
  { id: 'upload', title: 'Drop in your files', description: 'Drag a folder of renders and we sort them by shot.', illustration: 'laptop' },
  { id: 'review', title: 'Review on the go', description: 'Approve frames from your phone between meetings.', illustration: 'ready' },
]);

export default {
  title: 'Sections/How It Works/Curve Steps',
  component: 'lw-curve-steps',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="margin: 3rem auto"><lw-curve-steps ${attributes(args)}></lw-curve-steps></div>`,
  args: {},
};

// Scroll it into view and the curve draws itself, then the arrow and the check.
export const Default = {};

// A review tool's setup, with the pictures in the library's accent green.
export const Studio = {
  args: { heading: 'From render to sign-off', lede: 'Three steps your whole team learns in an afternoon.', steps: STUDIO },
  render: (args) => `<div style="margin: 3rem auto; --lw-curve-steps-accent: var(--lw-color-accent); --lw-curve-steps-on-accent: var(--lw-color-background)"><lw-curve-steps ${attributes(args)}></lw-curve-steps></div>`,
};
