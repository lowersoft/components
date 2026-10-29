import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Continue Learning Card',
  component: 'lw-continue-learning-card',
  render: (args) => `<lw-continue-learning-card ${attributes(args)}></lw-continue-learning-card>`,
  args: { course: 'Motion for interfaces' },
};

// Scrub the thumbnail like a storyboard, click to resume there, or pick a next lesson.
export const Default = {};
