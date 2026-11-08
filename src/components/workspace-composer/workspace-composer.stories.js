import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const frame = (inner, width = '68rem') => `<div style="max-width: ${width}; margin: 3rem auto">${inner}</div>`;

export default {
  title: 'Sections/Features/Workspace Composer',
  component: 'lw-workspace-composer',
  parameters: { layout: 'padded' },
  render: (args) => frame(`<lw-workspace-composer ${attributes(args)}></lw-workspace-composer>`),
  args: {},
};

// The request types itself in the first time the composer comes into view,
// and the send key lights up once it is written.
export const Default = {};

// Another request to the same assistant, with other tools.
export const Release = {
  args: {
    eyebrow: 'Release assistant',
    heading: 'Ship the release from the prompt',
    description: 'Tag, sign and roll out a release in one request, with the checks lower already runs standing guard.',
    prompt: 'Tag v3.2.0 from main, sign the Linux, macOS and Windows binaries, run the sanitizer suite and roll it out to the EU region first.',
    points: JSON.stringify(['Signs every binary before it leaves the build', 'Stops the rollout when a check goes red', 'Writes the changelog from the merged pull requests']),
    chips: JSON.stringify([{ label: 'Tests', icon: 'tests' }, { label: 'Build logs', icon: 'logs' }, { label: 'Repository', icon: 'repository' }]),
  },
};

// On a phone the composer moves under the copy and the claims stack.
export const Narrow = {
  render: (args) => frame(`<lw-workspace-composer ${attributes(args)}></lw-workspace-composer>`, '24rem'),
};
