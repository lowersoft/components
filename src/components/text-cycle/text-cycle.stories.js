import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const ROLES = JSON.stringify(['engineer', 'developer', 'designer']);
const PLACES = JSON.stringify(['Tokyo', 'Berlin', 'São Paulo', 'Istanbul', 'New York']);
const MOODS = JSON.stringify(['🚀 launch', '🎨 design', '🧪 test', '📦 ship']);

const sentence = (lead, args) =>
  `<p style="margin: 0; font: 600 clamp(1.75rem, 5vw, 3.25rem)/1.15 var(--lw-font-sans); letter-spacing: -0.03em; color: var(--lw-color-foreground)"><span style="color: var(--lw-color-muted-foreground)">${lead}</span> <lw-text-cycle ${attributes(args)}></lw-text-cycle></p>`;

export default {
  title: 'Texts/Text Cycle',
  component: 'lw-text-cycle',
  parameters: { layout: 'centered' },
  render: (args) => sentence('21 · Senior', args),
  argTypes: {
    interval: { name: 'Interval', control: { type: 'range', min: 0.8, max: 6, step: 0.1 } },
    paused: { name: 'Paused', control: 'boolean' },
  },
  args: { words: ROLES, interval: 2.5, paused: false },
};

// The word swaps character by character and the sentence slides along.
export const Default = {};

// Words of very different lengths, mid-sentence.
export const InASentence = {
  args: { words: PLACES, interval: 2 },
  render: (args) => `${sentence('Teams in', args).replace('</p>', ' ship with us.</p>')}`,
};

// Emoji stay whole.
export const Emoji = {
  args: { words: MOODS, interval: 1.8 },
  render: (args) => sentence('Time to', args),
};
