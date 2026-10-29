import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Forms/Feedback Composer',
  component: 'lw-feedback-composer',
  render: (args) => `<lw-feedback-composer ${attributes(args)}></lw-feedback-composer>`,
  args: {},
};

// Type a request like "profiler trace": similar ones appear with their votes, to upvote instead.
export const Default = {};
