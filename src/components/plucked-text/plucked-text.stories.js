import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Texts/Plucked Text',
  component: 'lw-plucked-text',
  render: (args) =>
    `<lw-plucked-text ${attributes(args)} style="font: 600 4.5rem/1 system-ui; letter-spacing: -0.025em">Good vibrations</lw-plucked-text>`,
  argTypes: {
    tension: { control: { type: 'range', min: 0.4, max: 2.5, step: 0.1 } },
  },
  args: { tension: 1, 'no-strum': false },
};

export const Default = {};

// A slack string rings low and long; a taut one snaps back fast.
export const Tension = {
  render: () => `
    <div style="display: grid; gap: 1rem; justify-items: center; font: 600 3rem/1 system-ui">
      <lw-plucked-text tension="0.5">Slack</lw-plucked-text>
      <lw-plucked-text tension="2.2">Taut</lw-plucked-text>
    </div>`,
};
