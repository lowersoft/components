import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Card Stack',
  component: 'lw-card-stack',
  render: (args) => `<lw-card-stack ${attributes(args)}></lw-card-stack>`,
  argTypes: { accent: { control: 'color' } },
  args: { accent: '#f97316', 'action-label': 'Add to cart' },
};

// Drag or flick the top print away, tap it for details, or use the arrows.
export const Default = {};
