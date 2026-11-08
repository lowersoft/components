import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Sections/Heroes/Eclipse Hero',
  component: 'lw-eclipse-hero',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-eclipse-hero ${attributes(args)}></lw-eclipse-hero>`,
  args: {},
};

// Dark in either theme, the eclipse in silver. Point at a logo and it
// comes up to full strength.
export const Default = {};

// A colour for the light around the planet; the rim stays white.
export const Violet = {
  render: (args) => `<lw-eclipse-hero ${attributes(args)} style="--lw-eclipse-hero-glow: #a855f7"></lw-eclipse-hero>`,
  args: {
    tag: 'Beta',
    announcement: 'Profile-guided optimisation, on by default',
    heading: 'Faster binaries\nwithout the flags.',
    description: 'lower profiles your code as it runs your tests, then builds the release with the hot paths inlined and the cold ones moved out of the way. Nothing to configure and nothing to tune.',
  },
};

// Without a brand, an announcement or customer logos: just the eclipse and the copy.
export const Minimal = {
  render: () => {
    const hero = document.createElement('lw-eclipse-hero');
    Object.assign(hero, {
      brand: '',
      logo: '',
      announcement: '',
      logos: [],
      heading: 'Close to the metal.\nFar from the pain.',
      description: 'Write C, C++ or Rust and let lower handle the toolchains, the caches and the cross-compiling.',
    });
    return hero;
  },
};
