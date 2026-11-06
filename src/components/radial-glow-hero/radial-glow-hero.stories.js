import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Heroes/Radial Glow Hero',
  component: 'lw-radial-glow-hero',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-radial-glow-hero ${attributes(args)}></lw-radial-glow-hero>`,
  args: {},
};

// Neutral by default, so the glow follows the theme. Point at the strip of
// logos and it coasts to a stop.
export const Default = {};

// A brand colour for the glow and the headline's last line, and white for
// the logo row, which sits on the strongest blue in either theme.
export const BrandGlow = {
  render: (args) =>
    `<lw-radial-glow-hero ${attributes(args)} style="--lw-radial-glow-hero-glow: light-dark(#2563eb, #1d4ed8); --lw-radial-glow-hero-accent: light-dark(#2563eb, #60a5fa); --lw-radial-glow-hero-on-glow: #fff"></lw-radial-glow-hero>`,
  args: {
    heading: 'The compiler built\nfor every target.',
    description: 'Build one codebase for x86, ARM and RISC-V in a single pass, with link-time optimisation on by default and binaries small enough to stay in cache.',
    trusted: 'Shipping firmware and kernels at',
  },
};

// Your own actions in the `actions` slot, such as links.
export const WithLinks = {
  render: (args) => `
    <lw-radial-glow-hero ${attributes(args)}>
      <div slot="actions" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; font: 500 0.875rem system-ui">
        <a href="#start" style="color: inherit">Read the quick start</a>
        <a href="#benchmarks" style="color: inherit">See the benchmarks</a>
      </div>
    </lw-radial-glow-hero>`,
  args: { heading: 'One binary.\nEvery platform.', description: 'Point lower at a repository and it builds, tests and signs a static binary for Linux, macOS and Windows on every push, down to the last symbol.' },
};

// Without customers to show yet, an empty list hides the row.
export const WithoutLogos = {
  args: { logos: '[]' },
};
