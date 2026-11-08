import { attributes } from '../../../.storybook/attributes.js';
import '../button/index.js';
import './index.js';

export default {
  title: 'Effects/Text/Interactive/Canvas Text',
  component: 'lw-canvas-text',
  parameters: { layout: 'padded' },
  render: (args) => `<lw-canvas-text ${attributes(args)} style="max-width: 48rem; margin: 4rem auto"></lw-canvas-text>`,
  argTypes: {
    text: { name: 'Text', control: 'text' },
    color: { name: 'Color', control: 'color' },
    'font-size': { name: 'Font size', control: { type: 'range', min: 24, max: 160, step: 1 } },
    'particle-size': { name: 'Particle size', control: { type: 'range', min: 0.6, max: 5, step: 0.1 } },
    density: { name: 'Density', control: { type: 'range', min: 1, max: 6, step: 0.5 } },
    drift: { name: 'Drift', control: { type: 'range', min: 0, max: 4, step: 0.1 } },
    scatter: { name: 'Scatter', control: { type: 'range', min: 0, max: 160, step: 1 } },
    'load-duration': { name: 'Load duration', control: { type: 'range', min: 0, max: 4, step: 0.1 } },
    'morph-duration': { name: 'Morph duration', control: { type: 'range', min: 0.2, max: 4, step: 0.1 } },
    magnetic: { name: 'Magnetic', control: { type: 'range', min: 0, max: 1.5, step: 0.05 } },
    'magnetic-radius': { name: 'Magnetic radius', control: { type: 'range', min: 20, max: 300, step: 5 } },
    paused: { name: 'Paused', control: 'boolean' },
  },
  args: { text: 'LowerSoft', 'font-size': 72, 'particle-size': 1.6, density: 2, drift: 0, scatter: 64, 'load-duration': 1, 'morph-duration': 1.4, magnetic: 0.45, 'magnetic-radius': 100, paused: false },
};

// Dots spin on a loading ring, then settle into the word; move the pointer
// over it to pull them.
export const Default = {};

// Bigger, softer dots that keep drifting, in a brand color.
export const Drifting = {
  args: { text: 'Hello', 'font-size': 140, 'particle-size': 3.2, density: 3.5, drift: 1.4, scatter: 110, color: '#7c3aed', magnetic: 0.8, 'magnetic-radius': 140 },
  render: (args) => `<lw-canvas-text ${attributes(args)} style="max-width: 48rem; height: 260px; margin: 3rem auto"></lw-canvas-text>`,
};

// A fine lattice as a page heading, replayed from a button.
export const Replay = {
  args: { text: 'Particles', 'font-size': 96, 'particle-size': 1.2, density: 1.5, level: 1 },
  render: (args) => `<div style="display: grid; justify-items: center; gap: 1rem; max-width: 48rem; margin: 3rem auto"><lw-canvas-text id="canvas-replay" ${attributes(args)} style="width: 100%"></lw-canvas-text><lw-button variant="secondary" onclick="document.getElementById('canvas-replay').replay()">Replay</lw-button></div>`,
};
