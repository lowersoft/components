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

// A brand colour for the glow and the headline's last line.
export const BrandGlow = {
  render: (args) =>
    `<lw-radial-glow-hero ${attributes(args)} style="--lw-radial-glow-hero-glow: light-dark(#2563eb, #1d4ed8); --lw-radial-glow-hero-accent: light-dark(#2563eb, #60a5fa)"></lw-radial-glow-hero>`,
  args: {
    heading: 'The cloud built\nfor every agent.',
    description: 'Chain multi-step agents, bring any model and deploy pipelines that run end to end, with the reliability of a build system and none of the servers.',
    trusted: 'Trusted by AI teams at',
  },
};

// Your own actions in the `actions` slot, such as links.
export const WithLinks = {
  render: (args) => `
    <lw-radial-glow-hero ${attributes(args)}>
      <div slot="actions" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; font: 500 0.875rem system-ui">
        <a href="#start" style="color: inherit">Read the quick start</a>
        <a href="#pricing" style="color: inherit">See pricing</a>
      </div>
    </lw-radial-glow-hero>`,
  args: { heading: 'One command\nfrom laptop to edge.', description: 'Point lower at a repository and it builds, tests and ships every agent on each push, with a preview link for every branch.' },
};

// Without customers to show yet, an empty list hides the row.
export const WithoutLogos = {
  args: { logos: '[]' },
};
