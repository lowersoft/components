import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (markup) => `<div style="max-width: 44rem; margin: 2rem auto">${markup}</div>`;

const HILLS = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&h=1067&fit=crop&auto=format&q=80';

export default {
  title: 'Media/Before After Card',
  component: 'lw-before-after-card',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-before-after-card ${attributes(args)}></lw-before-after-card>`),
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    position: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: {
    position: 46,
    'after-label': 'Graded',
    'before-label': 'Raw',
    caption: 'Drag the handle to wipe between the raw shot and the grade.',
    orientation: 'horizontal',
    'no-percent': false,
    'no-demo': false,
  },
};

// One photo: the before side is the same picture, drained. It scrubs once on first sight.
export const Default = {};

// Wipes top to bottom.
export const Vertical = { args: { orientation: 'vertical', position: 50 } };

// Two photos, without the percent or the hint.
export const TwoPhotos = {
  args: {
    before: `${HILLS}&sat=-100`,
    after: HILLS,
    'before-alt': 'Misty hills, flat and grey',
    'after-alt': 'Misty hills, color corrected',
    'before-label': 'Before',
    'after-label': 'After',
    caption: '',
    'no-percent': true,
    'no-demo': true,
  },
};
