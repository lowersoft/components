import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const FONT = 'font: 700 3.5rem/1.1 system-ui; letter-spacing: -0.02em';

export default {
  title: 'Texts/Glitch Text',
  component: 'lw-glitch-text',
  render: (args) => `<lw-glitch-text ${attributes(args)} style="${FONT}">Signal lost</lw-glitch-text>`,
  argTypes: {
    trigger: { control: 'inline-radio', options: ['idle', 'hover', 'change'] },
    intensity: { control: 'inline-radio', options: ['subtle', 'medium', 'strong'] },
  },
  args: { trigger: 'idle', intensity: 'medium' },
};

export const Idle = {};

export const Hover = {
  args: { trigger: 'hover', intensity: 'strong' },
};

// Only a new text glitches: each one cuts in halfway through the burst.
export const Change = {
  render: () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <div style="display: grid; gap: 1rem; justify-items: center">
        <lw-glitch-text trigger="change" text="Connecting" style="${FONT}"></lw-glitch-text>
        <button type="button">Next status</button>
      </div>`;
    const frame = template.content.firstElementChild;
    const text = frame.querySelector('lw-glitch-text');
    const statuses = ['Connecting', 'Handshake', 'Encrypted', 'Online'];
    let i = 0;
    frame.querySelector('button').addEventListener('click', () => (text.text = statuses[++i % statuses.length]));
    return frame;
  },
};
