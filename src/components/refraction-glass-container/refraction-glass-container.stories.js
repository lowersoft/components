import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const content = `<p style="margin: 0; font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; opacity: 0.72">Refraction · Live</p>
<h3 style="margin: 0.625rem 0 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em">Bent light, not just blur.</h3>
<p style="margin: 0.5rem 0 0; font-size: 0.875rem; line-height: 1.5; opacity: 0.86">An SVG displacement map warps the color behind this card, so the glass reads as glass while the blobs move.</p>`;

export default {
  title: 'Effects/Surfaces/Refraction Glass Container',
  component: 'lw-refraction-glass-container',
  render: (args) => `<lw-refraction-glass-container ${attributes(args)}>${content}</lw-refraction-glass-container>`,
  argTypes: {
    distortion: { control: { type: 'range', min: 0, max: 60, step: 1 } },
    blur: { control: { type: 'range', min: 0, max: 40, step: 1 } },
    background: { control: 'color' },
  },
  args: { width: '420', 'min-height': 260, distortion: 14, blur: 14, padding: '24', 'no-blobs': false },
};

// The blobs drift behind the glass; seen through it they bend.
export const Default = {};

// Cooler blobs, bent harder.
export const Lagoon = { args: { 'blob-colors': '["#22d3ee", "#6366f1", "#10b981"]', distortion: 32, background: '#06121a' } };

// No blobs: the glass blurs the page behind it.
export const OverContent = {
  render: (args) => `<div style="position: relative; display: grid; place-items: center; width: 34rem; max-width: 100%; height: 20rem; border-radius: 1.5rem; overflow: hidden; background: url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=720&fit=crop&auto=format&q=75) center / cover">
  <lw-refraction-glass-container ${attributes({ ...args, 'no-blobs': true, width: '360', 'min-height': 180 })}>${content}</lw-refraction-glass-container>
</div>`,
};
