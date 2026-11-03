import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const PALETTES = {
  Sunrise: { colors: ['#0a0a0b', '#1c1a4a', '#6a2fd6', '#df2453', '#f8913c', '#fbe39a'], background: '#0a0a0b' },
  Lagoon: { colors: ['#06090d', '#0c2a3a', '#0e7490', '#22d3ee', '#a7f3d0'], background: '#06090d' },
  Ember: { colors: ['#0b0807', '#3b0d0c', '#b91c1c', '#f97316', '#fde68a'], background: '#0b0807' },
  Dawn: { colors: ['#fafafa', '#e9e5ff', '#c4b5fd', '#f9a8d4', '#fdba74'], background: '#fafafa' },
};

const hero = (light) => `<div style="display: grid; place-content: start center; justify-items: center; gap: 1rem; padding: 4.5rem 1.5rem; text-align: center; font-family: system-ui, sans-serif; color: ${light ? '#18181b' : '#fff'}">
  <span style="padding: 0.25rem 0.75rem; border: 1px solid ${light ? 'rgb(0 0 0 / 0.12)' : 'rgb(255 255 255 / 0.18)'}; border-radius: 999px; background: ${light ? 'rgb(255 255 255 / 0.5)' : 'rgb(255 255 255 / 0.06)'}; font-size: 0.8125rem; backdrop-filter: blur(8px)">Now in every brand color</span>
  <h1 style="margin: 0; font-size: clamp(2.25rem, 6vw, 3.75rem); line-height: 1.02; letter-spacing: -0.04em">Light, cut into stripes.</h1>
  <p style="margin: 0; max-width: 34rem; font-size: 1.0625rem; line-height: 1.5; opacity: 0.72">A living gradient for the top of a page. Move across it and the stripes rise to meet you.</p>
</div>`;

const range = (name, min, max, step = 0.01) => ({ name, control: { type: 'range', min, max, step } });

export default {
  title: 'Backgrounds/Gradient Blind Backdrop',
  component: 'lw-gradient-blind-backdrop',
  parameters: { layout: 'fullscreen' },
  // `palette` and `copy` drive the demo; everything else is an attribute.
  render: ({ palette, copy, ...args }) => {
    const { colors, background } = PALETTES[palette] ?? PALETTES.Sunrise;
    return `<lw-gradient-blind-backdrop ${attributes({ ...args, colors: JSON.stringify(colors), background })}>${copy ? hero(palette === 'Dawn') : ''}</lw-gradient-blind-backdrop>`;
  },
  argTypes: {
    palette: { name: 'Palette', control: 'select', options: Object.keys(PALETTES) },
    mask: { name: 'Fade', control: 'select', options: ['none', 'bottom', 'top', 'radial', 'edges'] },
    copy: { name: 'Hero copy', control: 'boolean' },
    stripes: range('Stripes', 4, 60, 1),
    angle: range('Angle', -45, 45, 1),
    wave: range('Wave', 0, 1),
    frequency: range('Frequency', 0.25, 3),
    speed: range('Speed', 0, 3, 0.1),
    depth: range('Depth', 0, 1),
    gap: range('Gap', 0, 12, 1),
    grain: range('Grain', 0, 1),
    pull: range('Pull', 0, 1),
  },
  args: { palette: 'Sunrise', mask: 'none', copy: true, stripes: 18, angle: 0, wave: 0.35, frequency: 1, speed: 1, depth: 0.55, gap: 0, grain: 0.35, pull: 0.6 },
};

// Move the pointer across it: the stripes rise toward it.
export const Default = {};

// A light backdrop, leaning, with gaps and a fade at the edges.
export const Light = { args: { palette: 'Dawn', angle: -12, gap: 4, mask: 'edges' } };
