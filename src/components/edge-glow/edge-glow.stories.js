import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Effects/Backgrounds/Edge Glow',
  component: 'lw-edge-glow',
  parameters: { layout: 'padded' },
  render: (args) => `<lw-edge-glow ${attributes(args)} style="max-width: 44rem; margin: 2rem auto"></lw-edge-glow>`,
  argTypes: {
    off: { name: 'Off', control: 'boolean' },
    caption: { name: 'Caption', control: 'text' },
    'on-label': { name: 'On label', control: 'text' },
    'off-label': { name: 'Off label', control: 'text' },
    reach: { name: 'Reach', control: { type: 'range', min: 0, max: 140, step: 2 } },
    duration: { name: 'Duration', control: { type: 'range', min: 2, max: 30, step: 1 } },
    'hide-toggle': { name: 'Hide toggle', control: 'boolean' },
  },
  args: { off: false, caption: 'Press to talk', reach: 52, duration: 10, 'hide-toggle': false },
};

// The rim glows and the colors orbit; the pill turns it off and on.
export const Default = {};

// A phone-sized stage around your own content, with a wider mist.
export const Phone = {
  args: { 'hide-toggle': true, caption: '', reach: 80, duration: 7 },
  render: (args) => `<lw-edge-glow ${attributes(args)} style="width: 300px; height: 600px; margin: 1rem auto; --lw-edge-glow-colors: #ff6778, #ffba71, #8d99ff, #bc82f3, #ff6778"><div style="display: grid; gap: 0.5rem; justify-items: center; font-family: var(--lw-font-sans); color: var(--lw-color-foreground)"><span style="font-size: 3.5rem; font-weight: 300; letter-spacing: -0.04em">9:41</span><span style="color: var(--lw-color-muted-foreground)">Listening…</span></div></lw-edge-glow>`,
};

// Starts off: turn it on to see the flare.
export const StartsOff = {
  args: { off: true, caption: '' },
};
