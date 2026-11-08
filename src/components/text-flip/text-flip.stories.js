import { attributes } from '../../../.storybook/attributes.js';
import '../button/index.js';
import './index.js';

export default {
  title: 'Effects/Text/Cycling/Text Flip',
  component: 'lw-text-flip',
  parameters: { layout: 'centered' },
  render: (args) => `<lw-text-flip ${attributes(args)} style="font-size: clamp(2.25rem, 7vw, 4.5rem); letter-spacing: -0.02em"></lw-text-flip>`,
  argTypes: {
    text: { name: 'Text', control: 'text' },
    direction: { name: 'Direction', control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    trigger: { name: 'Trigger', control: 'inline-radio', options: ['hover', 'click', 'both'] },
    duration: { name: 'Duration', control: { type: 'range', min: 0.15, max: 1.5, step: 0.05 } },
    'stagger-duration': { name: 'Stagger', control: { type: 'range', min: 0, max: 0.2, step: 0.01 } },
    'stagger-from': { name: 'Stagger from', control: 'select', options: ['first', 'last', 'center', 'random', '3'] },
    easing: { name: 'Easing', control: 'text' },
    'front-color': { name: 'Front color', control: 'color' },
    'back-color': { name: 'Back color', control: 'color' },
    disabled: { name: 'Disabled', control: 'boolean' },
  },
  args: { text: 'Hover to flip', direction: 'top', trigger: 'hover', duration: 0.45, 'stagger-duration': 0.05, 'stagger-from': 'first', easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)', disabled: false },
};

// Hover the headline: the characters roll over one after another.
export const Default = {};

// Rolls sideways from the middle out, in brand colors, on click as well.
export const FromCenter = {
  args: { text: 'Roll call', direction: 'right', trigger: 'both', 'stagger-from': 'center', 'back-color': '#2563eb', 'stagger-duration': 0.07 },
};

// Started from code: a button calls `flip()`.
export const Imperative = {
  render: (args) => `<div style="display: grid; justify-items: center; gap: 1.5rem"><lw-text-flip id="flip-demo" ${attributes({ ...args, text: 'Shuffle 🎲', 'stagger-from': 'random', disabled: true })} style="font-size: clamp(2.25rem, 7vw, 4.5rem)"></lw-text-flip><lw-button onclick="document.getElementById('flip-demo').flip()">Flip</lw-button></div>`,
};
