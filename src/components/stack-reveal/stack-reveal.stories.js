import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Media/Stack Reveal',
  component: 'lw-stack-reveal',
  parameters: { layout: 'padded' },
  render: (args) => `<lw-stack-reveal ${attributes(args)}></lw-stack-reveal>`,
  argTypes: { easing: { control: 'inline-radio', options: ['spring', 'glide'] } },
  args: { width: 520, height: 330, spread: 56, peek: 62, tilt: 6, interval: 5, easing: 'spring', 'no-autoplay': false, 'pause-on-hover': false, 'no-controls': false },
};

// Next drops the top print below the pile; it slips behind and rises into the back. Press quickly and the moves blend.
export const Default = {};

// Steps only when asked, with a gentler glide.
export const Manual = { args: { 'no-autoplay': true, easing: 'glide' } };

// The pile alone, leaning further.
export const PileOnly = { args: { 'no-controls': true, heading: '', description: '', tilt: 9, spread: 72 } };
