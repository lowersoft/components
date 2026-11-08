import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Sections/Heroes/Eclipse Hero',
  component: 'lw-eclipse-hero',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-eclipse-hero ${attributes(args)}></lw-eclipse-hero>`,
  args: { 'announcement-href': '#changelog' },
};

// Switch the theme in the toolbar: white light in a starry sky on a dark
// page, ink on paper on a light one. Move the pointer over the hero and the
// light follows it round the rim.
export const Default = {};

// A colour for the corona; the sun and the bead keep the theme's light.
export const Violet = {
  render: (args) => `<lw-eclipse-hero ${attributes(args)} style="--lw-eclipse-hero-glow: #a78bfa"></lw-eclipse-hero>`,
  args: {
    tag: 'Beta',
    announcement: 'Profile-guided optimisation, on by default',
    heading: 'Faster binaries\nwithout the flags.',
    description: 'lower profiles your code as it runs your tests, then builds the release with the hot paths inlined and the cold ones moved out of the way.',
    note: 'Ships in lower 3.2 · Opt out per target',
  },
};

// Without the announcement, the tour or the note: the eclipse and the copy.
export const Minimal = {
  args: {
    'announcement-href': '',
    announcement: '',
    secondary: '',
    note: '',
    heading: 'Close to the metal.\nFar from the pain.',
    description: 'Write C, C++ or Rust and let lower handle the toolchains, the caches and the cross-compiling.',
  },
};

// On a narrow screen the eclipse rises above the copy.
export const Narrow = {
  render: (args) => `<div style="width: 24rem; max-width: 100%; margin-inline: auto"><lw-eclipse-hero ${attributes(args)}></lw-eclipse-hero></div>`,
};
