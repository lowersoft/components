import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Navigation/Toolbars/Editor Toolbar',
  component: 'lw-editor-toolbar',
  parameters: { layout: 'fullscreen' },
  // It fills its container: here, the whole viewport.
  render: (args) => `<lw-editor-toolbar style="height: 100vh" ${attributes(args)}></lw-editor-toolbar>`,
  args: { outline: true, comments: 3 },
};

// Type in the document: it shows saving, then saved. The outline follows the section in view.
export const Default = {};
