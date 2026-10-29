import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Kanban Board/Kanban Board',
  component: 'lw-kanban-board',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="max-width: 64rem; margin: 2rem auto"><lw-kanban-board ${attributes(args)}></lw-kanban-board></div>`,
  args: {},
};

// Drag cards between columns; a gap opens where they will land. Or focus one and press Space, then the arrows.
export const Default = {};
