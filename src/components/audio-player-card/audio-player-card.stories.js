import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Audio Player Card',
  component: 'lw-audio-player-card',
  render: (args) => `<lw-audio-player-card ${attributes(args)}></lw-audio-player-card>`,
  args: { heading: 'Designing for motion' },
};

// Play, scrub the waveform (its tooltip names the chapter), and tap the speed chip.
export const Default = {};
