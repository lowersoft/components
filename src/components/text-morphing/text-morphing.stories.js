import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const WORDS = JSON.stringify(['LowerSoft', 'components', 'that', 'feel', 'alive']);

export default {
  title: 'Effects/Text/Cycling/Text Morphing',
  component: 'lw-text-morphing',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 56rem; margin: 6rem auto"><lw-text-morphing ${attributes(args)}></lw-text-morphing></div>`,
  argTypes: {
    'morph-duration': { name: 'Morph duration', control: { type: 'range', min: 0.3, max: 4, step: 0.1 } },
    'cooldown-duration': { name: 'Cooldown', control: { type: 'range', min: 0, max: 3, step: 0.1 } },
    paused: { name: 'Paused', control: 'boolean' },
  },
  args: { texts: WORDS, 'morph-duration': 1.5, 'cooldown-duration': 0.5, paused: false },
};

// Each word melts into the next.
export const Default = {};

// Longer phrases, slower, as a page heading.
export const Phrases = {
  args: { texts: JSON.stringify(['Ship faster', 'Design calmer', 'Build together']), 'morph-duration': 2, 'cooldown-duration': 1.2, level: 1 },
};
