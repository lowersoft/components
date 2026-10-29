import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Deployment Card',
  component: 'lw-deployment-card',
  render: (args) => `<lw-deployment-card ${attributes(args)}></lw-deployment-card>`,
  args: { project: 'lowersoft-runtime', status: 'ready' },
};

// Rebuild runs a build along the step rail, with a ticking timer and the latest log line.
export const Default = {};
