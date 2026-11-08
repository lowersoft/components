import { attributes } from '../../../.storybook/attributes.js';
import { strokeIcon } from '../../core/icons.js';
import { activity, gitBranch, history, inbox, layers } from '../../core/lucide.js';
import './index.js';

const PALETTES = {
  Ember: ['#ff1100', '#f97316', '#fbbf24', '#fb7185'],
  Orchid: ['#a855f7', '#ec4899', '#f0abfc', '#6366f1'],
  Glacier: ['#0ea5e9', '#22d3ee', '#a5f3fc', '#6366f1'],
  Mint: ['#22c55e', '#a3e635', '#2dd4bf', '#16a34a'],
  Mono: ['#ffffff', '#a1a1aa', '#52525b', '#e4e4e7'],
};

const CARDS = [
  [gitBranch, 'Preview every branch', 'Each pull request gets its own address, built in under a minute, so review happens on the real thing.', 'span 2'],
  [history, 'Roll back in one click', 'Every deploy stays warm, so going back is instant.', 'span 1'],
  [activity, 'Logs you can read', 'Requests grouped by route, errors first.', 'span 1'],
  [layers, 'Cache cleared on deploy', 'No stale pages after a release.', 'span 1'],
  [inbox, 'Alerts where you work', 'Mail, chat or a webhook.', 'span 1'],
];

const card = (args, [icon, title, text, span]) => `<lw-glowing-border ${attributes(args)} style="grid-column: ${span}">
  <div style="display: grid; align-content: space-between; gap: 2rem; min-height: 11rem; padding: 1.25rem; border: 1px solid color-mix(in oklab, currentColor 7%, transparent); border-radius: ${Math.max(0, args.radius - args.padding)}px; background: color-mix(in oklab, currentColor 2%, var(--lw-color-background)); font-family: system-ui, sans-serif">
    <span style="display: grid; width: 2.5rem; height: 2.5rem; place-items: center; border: 1px solid color-mix(in oklab, currentColor 12%, transparent); border-radius: 0.625rem">${strokeIcon(icon, 18, 1.75)}</span>
    <div><h3 style="margin: 0; font-size: 1.125rem; letter-spacing: -0.01em">${title}</h3><p style="margin: 0.375rem 0 0; font-size: 0.875rem; line-height: 1.5; opacity: 0.62">${text}</p></div>
  </div>
</lw-glowing-border>`;

const range = (name, min, max, step = 1) => ({ name, control: { type: 'range', min, max, step } });

export default {
  title: 'Effects/Surfaces/Glowing Border',
  component: 'lw-glowing-border',
  parameters: { layout: 'padded' },
  // Palette and the percent sliders drive the demo; the rest are attributes.
  render: ({ palette, innerGlowPercent, glowPercent, ...rest }) => {
    const args = { ...rest, colors: JSON.stringify(PALETTES[palette] ?? PALETTES.Ember), 'inner-glow': innerGlowPercent / 100, glow: glowPercent / 100 };
    return `<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.875rem; max-width: 48rem; margin: 2rem auto">${CARDS.map((each) => card(args, each)).join('')}</div>`;
  },
  argTypes: {
    palette: { name: 'Colors', control: 'select', options: Object.keys(PALETTES) },
    variant: { name: 'Light', control: 'select', options: ['cursor', 'beam', 'spin', 'pulse'] },
    innerGlowPercent: range('Inner glow', 0, 100),
    thickness: range('Thickness', 1, 4, 0.25),
    range: range('Reach', 40, 400),
    glowPercent: range('Glow', 0, 100),
    'glow-size': range('Glow size', 2, 32),
    radius: { table: { disable: true } },
    padding: { table: { disable: true } },
  },
  args: { palette: 'Ember', variant: 'cursor', innerGlowPercent: 60, thickness: 1.5, range: 160, glowPercent: 0, 'glow-size': 10, radius: 22, padding: 8 },
};

// Move the pointer over the grid: each card lights the edge nearest to it.
export const Default = {};

// A comet laps each edge, with an outer glow.
export const Beam = { args: { variant: 'beam', palette: 'Glacier', glowPercent: 60 } };

// The gradient turns.
export const Spin = { args: { variant: 'spin', palette: 'Orchid', glowPercent: 40, thickness: 2 } };

// The border breathes.
export const Pulse = { args: { variant: 'pulse', palette: 'Mint', glowPercent: 70 } };
