import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Activity Terrain',
  component: 'lw-activity-terrain',
  parameters: { layout: 'padded' },
  render: (args) => `<lw-activity-terrain ${attributes(args)}></lw-activity-terrain>`,
  args: { heading: 'Activity', 'end-date': '2026-10-11', flat: false },
};

// Drag to turn and tilt the terrain; hover or use the arrow keys to read a day.
export const Default = {};

export const Flat = {
  args: { flat: true },
};
