import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Workspace Switcher',
  component: 'lw-workspace-switcher',
  render: (args) => `<lw-workspace-switcher ${attributes(args)}></lw-workspace-switcher>`,
  args: { workspace: 'lowersoft' },
};

// Open it, type to filter, use the arrows and Enter, or press ⌘1–9 / Ctrl+1–9.
export const Default = {};
