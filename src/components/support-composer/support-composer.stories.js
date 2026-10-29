import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Forms/Support Composer',
  component: 'lw-support-composer',
  render: (args) => `<lw-support-composer ${attributes(args)}></lw-support-composer>`,
  args: { topic: 'bug' },
};

// Type a subject like "crash report": matching articles rise. Paste or drop a screenshot; Ctrl+Enter sends.
export const Default = {};
