import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Job Listing Card',
  component: 'lw-job-listing-card',
  render: (args) => `<lw-job-listing-card ${attributes(args)}></lw-job-listing-card>`,
  args: { title: 'Senior Systems Engineer' },
};

// Quick apply folds the card into a short form; sending it shows the Applied track with Undo.
export const Default = {};
