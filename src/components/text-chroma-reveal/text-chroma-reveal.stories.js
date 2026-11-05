import { attributes } from '../../../.storybook/attributes.js';
import '../button/index.js';
import './index.js';

const WORDS = JSON.stringify(['Design', 'Build', 'Launch']);
const SUNSET = JSON.stringify(['#f43f5e', '#fb923c', '#facc15']);
const OCEAN = JSON.stringify(['#22d3ee', '#3b82f6', '#a78bfa']);
const NEON = JSON.stringify(['#a3e635', '#22d3ee', '#e879f9']);

const display = 'font-size: clamp(2.5rem, 8vw, 5.5rem); letter-spacing: -0.04em; line-height: 1.05';

export default {
  title: 'Texts/Text Chroma Reveal',
  component: 'lw-text-chroma-reveal',
  parameters: { layout: 'centered' },
  render: (args) => `<lw-text-chroma-reveal ${attributes(args)} style="${display}"></lw-text-chroma-reveal>`,
  argTypes: {
    text: { name: 'Text', control: 'text' },
    direction: { name: 'Direction', control: 'inline-radio', options: ['ltr', 'rtl'] },
    duration: { name: 'Duration', control: { type: 'range', min: 0.4, max: 4, step: 0.1 } },
    delay: { name: 'Delay', control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    repeat: { name: 'Repeat', control: 'boolean' },
    'hold-duration': { name: 'Hold', control: { type: 'range', min: 0, max: 4, step: 0.1 } },
    'fade-duration': { name: 'Fade', control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    'repeat-delay': { name: 'Repeat delay', control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    'fixed-width': { name: 'Fixed width', control: 'boolean' },
    'text-color': { name: 'Text color', control: 'color' },
    'on-mount': { name: 'On mount', control: 'boolean' },
    'replay-on-view': { name: 'Replay on view', control: 'boolean' },
  },
  args: { text: 'Color the world', direction: 'ltr', duration: 1.5, delay: 0, repeat: false, 'hold-duration': 1, 'fade-duration': 0.6, 'repeat-delay': 0.5, 'fixed-width': false, 'on-mount': false, 'replay-on-view': false },
};

// A ribbon of spectrum colors paints the headline in when it comes into view.
export const Default = {};

// Three words in turn, the box held at the widest so nothing moves.
export const Rotating = {
  args: { texts: WORDS, repeat: true, 'fixed-width': true, 'hold-duration': 1.2 },
};

// Inside a sentence, in warm colors.
export const InASentence = {
  args: { texts: JSON.stringify(['faster', 'calmer', 'together']), colors: SUNSET, repeat: true, 'fixed-width': true, duration: 1.1 },
  render: (args) => `<p style="margin: 0; font: 700 clamp(2rem, 6vw, 4rem)/1.1 var(--lw-font-sans); letter-spacing: -0.04em; color: var(--lw-color-foreground)">Ship <lw-text-chroma-reveal ${attributes(args)}></lw-text-chroma-reveal></p>`,
};

// Right to left, in cool colors, ending in a brand blue.
export const Reverse = {
  args: { text: 'Into the deep', direction: 'rtl', colors: OCEAN, 'text-color': '#2563eb', duration: 2 },
};

// Replayed from code.
export const Replay = {
  args: { text: 'Again and again', colors: NEON, 'on-mount': true },
  render: (args) => `<div style="display: grid; justify-items: center; gap: 1.5rem"><lw-text-chroma-reveal id="chroma-replay" ${attributes(args)} style="${display}"></lw-text-chroma-reveal><lw-button variant="secondary" onclick="document.getElementById('chroma-replay').replay()">Replay</lw-button></div>`,
};
