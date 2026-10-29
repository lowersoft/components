import { appFrame } from '../../../.storybook/app-frame.js';
import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

export default {
  title: 'Banners/Incident Banner',
  component: 'lw-incident-banner',
  parameters: { layout: 'padded' },
  argTypes: { severity: { control: 'inline-radio', options: ['minor', 'major'] } },
  render: (args) => appFrame(`<lw-incident-banner ${attributes(args)}></lw-incident-banner>`),
  args: { severity: 'major', open: false },
};

// The clock runs from when it started; Updates opens the timeline in place.
export const Default = {};

// Once resolved, the square turns green and the clock stops.
export const Resolved = {
  args: {
    severity: 'minor',
    updates: JSON.stringify([
      { stage: 'Resolved', at: '15:02', text: 'Error rates have stayed normal for 20 minutes. This incident is resolved.' },
      { stage: 'Monitoring', at: '14:41', text: 'A fix is out on every region. We are watching error rates.' },
    ]),
  },
};
