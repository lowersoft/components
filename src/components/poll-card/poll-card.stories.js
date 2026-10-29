import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Poll Card',
  component: 'lw-poll-card',
  render: (args) => `<lw-poll-card ${attributes(args)}></lw-poll-card>`,
  args: { question: 'Tabs or spaces?' },
};

// Choosing votes: the bars grow, the percentages count up, and Undo stays for five seconds.
export const Default = {};
