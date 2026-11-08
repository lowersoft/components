import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Feedback/Status & Progress/Water Progress Bar',
  component: 'lw-water-progress-bar',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 35rem; margin: 3rem auto"><lw-water-progress-bar ${attributes(args)}></lw-water-progress-bar></div>`,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    color: { control: 'color' },
    wave: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    speed: { control: { type: 'range', min: 0, max: 3, step: 0.1 } },
  },
  args: { value: 64, caption: 'Uploading launch-film.mp4', size: 'lg', wave: 0.5, speed: 1 },
};

// Drag the value: the water moves on a spring, the edge leans forward and ripples, then settles.
export const Default = {};

// Counts up on its own, the way an upload would.
export const Uploading = {
  render: (args) => {
    const id = `water-${Math.random().toString(36).slice(2)}`;
    queueMicrotask(() => {
      const bar = document.getElementById(id);
      let value = 0;
      const tick = () => {
        if (!bar.isConnected) return;
        value = value >= 100 ? 0 : Math.min(100, value + 4 + Math.random() * 9);
        bar.setAttribute('value', String(Math.round(value)));
        setTimeout(tick, value >= 100 ? 2200 : 700);
      };
      tick();
    });
    return `<div style="max-width: 35rem; margin: 3rem auto"><lw-water-progress-bar id="${id}" ${attributes({ ...args, value: 0 })}></lw-water-progress-bar></div>`;
  },
  args: { caption: 'Syncing 248 photos' },
};

// No value: the water rolls back and forth.
export const Indeterminate = { args: { value: undefined, caption: 'Backing up workspace', size: 'sm', 'no-scale': true } };

// The three thicknesses and other colors.
export const Sizes = {
  render: () => `<div style="display: grid; gap: 2.5rem; max-width: 35rem; margin: 3rem auto">
  <lw-water-progress-bar value="32" caption="Small" size="sm"></lw-water-progress-bar>
  <lw-water-progress-bar value="58" caption="Medium" size="md" color="#65a30d"></lw-water-progress-bar>
  <lw-water-progress-bar value="86" caption="Large" size="lg" color="#f59e0b"></lw-water-progress-bar>
</div>`,
};
