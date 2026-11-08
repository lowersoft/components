import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Data Display/Charts & Metrics/Activity Terrain',
  component: 'lw-activity-terrain',
  parameters: { layout: 'padded' },
  render: (args) => `<lw-activity-terrain ${attributes(args)}></lw-activity-terrain>`,
  args: { heading: 'Activity', 'end-date': '2026-10-11', flat: false },
};

// Drag sideways to turn the terrain; hover, tap or use the arrow keys to read a day.
export const Default = {};

export const Flat = {
  args: { flat: true },
};

// A quiet stretch: a few weeks with little going on.
export const Quiet = {
  args: { heading: 'Releases', data: JSON.stringify([0, 1, 0, 0, 2, 0, 0, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 0, 0, 1, 0, 0, 0]) },
};
