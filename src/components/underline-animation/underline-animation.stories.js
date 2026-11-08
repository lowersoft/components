import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const VARIANTS = ['slide', 'center', 'fill', 'wavy', 'gradient'];

export default {
  title: 'Effects/Text/Interactive/Underline Animation',
  component: 'lw-underline-animation',
  parameters: { layout: 'centered' },
  render: ({ label, ...args }) => `<p style="margin: 0; font: 500 1.5rem/1.4 var(--lw-font-sans); color: var(--lw-color-foreground)"><lw-underline-animation ${attributes(args)}>${label}</lw-underline-animation></p>`,
  argTypes: {
    label: { name: 'Label', control: 'text' },
    variant: { name: 'Variant', control: 'inline-radio', options: VARIANTS },
    color: { name: 'Color', control: 'color' },
    from: { name: 'From', control: 'color' },
    to: { name: 'To', control: 'color' },
    thickness: { name: 'Thickness', control: { type: 'range', min: 1, max: 6, step: 0.5 } },
    offset: { name: 'Offset', control: { type: 'range', min: 0, max: 8, step: 0.5 } },
    duration: { name: 'Duration', control: { type: 'range', min: 0, max: 1200, step: 20 } },
    rest: { name: 'Rest', control: 'boolean' },
    active: { name: 'Active', control: 'boolean' },
  },
  args: { label: 'Hover this link', href: '#', variant: 'slide', thickness: 2, offset: 2, duration: 420, rest: false, active: false },
};

// Hover or tab to the link: the line sweeps in from the left.
export const Default = {};

// Every variant side by side.
export const Variants = {
  render: () => `<div style="display: grid; gap: 1.25rem; font: 500 1.375rem/1.4 var(--lw-font-sans); color: var(--lw-color-foreground)">${VARIANTS.map((variant) => `<lw-underline-animation href="#" variant="${variant}">${variant[0].toUpperCase()}${variant.slice(1)} underline</lw-underline-animation>`).join('')}</div>`,
};

// A navigation bar: the current page keeps its line.
export const Navigation = {
  render: () => `<nav style="display: flex; gap: 1.75rem; font: 500 0.9375rem/1 var(--lw-font-sans); color: var(--lw-color-foreground)">${['Product', 'Pricing', 'Docs', 'Blog'].map((label, i) => `<lw-underline-animation href="#" variant="center"${i === 1 ? ' active' : ''}>${label}</lw-underline-animation>`).join('')}</nav>`,
};

// Links in running text keep a faint line until hovered, even across lines.
export const InText = {
  render: () => `<p style="max-width: 30rem; margin: 0; font: 1.0625rem/1.7 var(--lw-font-sans); color: var(--lw-color-foreground)">Components are plain web elements, so they work anywhere. Read the <lw-underline-animation href="#" rest>getting started guide that walks through installing, theming and shipping your first page</lw-underline-animation>, or browse the <lw-underline-animation href="#" rest variant="gradient">component gallery</lw-underline-animation>.</p>`,
};
