import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Animated List/Swipe Actions List',
  component: 'lw-swipe-actions-list',
  render: (args) => `<lw-swipe-actions-list ${attributes(args)}></lw-swipe-actions-list>`,
  args: {},
};

// Swipe a row right to flip read, left to archive (with undo). Or focus a row and press U or E.
export const Default = {};
