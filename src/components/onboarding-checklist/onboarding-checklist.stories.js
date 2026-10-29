import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Cards/Onboarding Checklist',
  component: 'lw-onboarding-checklist',
  render: (args) => `<lw-onboarding-checklist ${attributes(args)}></lw-onboarding-checklist>`,
  args: { heading: 'Get started' },
};

// Check the steps off; each folds away, and the ring fills to an all-set state.
export const Default = {};
