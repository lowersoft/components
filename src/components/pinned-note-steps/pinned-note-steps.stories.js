import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const HIRING = JSON.stringify([
  { id: 'apply', title: 'Apply', body: 'Send a CV and two lines on why this role.', tone: 'blue', rotate: 2 },
  { id: 'call', title: 'Intro call', body: 'Thirty minutes with the hiring manager.', tone: 'yellow', rotate: -3 },
  { id: 'task', title: 'Paid task', body: 'A small, paid piece of real work.', tone: 'green', rotate: 2 },
  { id: 'offer', title: 'Offer', body: 'A written offer within three working days.', tone: 'red', rotate: -2 },
]);

export default {
  title: 'Sections/How It Works/Pinned Note Steps',
  component: 'lw-pinned-note-steps',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="margin: 3rem auto"><lw-pinned-note-steps ${attributes(args)}></lw-pinned-note-steps></div>`,
  args: {},
};

// Six notes down a ruled page, the path winding between them; point at one and it swings on its pin.
export const Default = {};

// Four notes: the path is worked out from where they sit, so any number fits.
export const Hiring = {
  args: { heading: 'From application to first day', lede: 'Four steps, and you hear back within a week at every one.', notes: HIRING },
};
