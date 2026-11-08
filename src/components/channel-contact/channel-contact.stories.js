import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '72rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/Contact/Channel Contact',
  component: 'lw-channel-contact',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-channel-contact ${attributes(args)}></lw-channel-contact>`),
  args: {},
};

// Two channels and three cards; the first card leads, turned over.
export const Default = {};

// A colour of its own for the leading card.
export const Accent = {
  render: (args) => frame(`<lw-channel-contact style="--lw-channel-contact-accent: #6a65f0; --lw-channel-contact-on-accent: #fff" ${attributes(args)}></lw-channel-contact>`),
};

// On a phone the channels and the cards stack.
export const Narrow = {
  render: (args) => frame(`<lw-channel-contact ${attributes(args)}></lw-channel-contact>`, '24rem'),
};
