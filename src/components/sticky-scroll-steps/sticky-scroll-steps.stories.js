import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const FOUR = JSON.stringify([
  { id: 'forward', title: 'Forward the request', body: 'Clients email the shared address; every request lands as a task with its files attached.', mockup: 'inbox' },
  { id: 'schedule', title: 'Fit it into the week', body: 'Drop it on a day, and the planner warns you before a day overflows.', mockup: 'planner' },
  { id: 'deliver', title: 'Deliver and close', body: 'Mark it done and the client gets the files and a note in one email.', mockup: 'inbox' },
  { id: 'look-back', title: 'Look back on Friday', body: 'See the week’s throughput, what slipped and why, before you plan the next.', mockup: 'review' },
]);

export default {
  title: 'How It Works/Sticky Scroll Steps',
  component: 'lw-sticky-scroll-steps',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="margin: 3rem auto"><lw-sticky-scroll-steps ${attributes(args)}></lw-sticky-scroll-steps></div>`,
  args: {},
};

// Scroll the screens: each step lights up and fills its bar; choose a step to jump to its screen.
export const Default = {};

// Four steps for a studio inbox, in a shorter box.
export const StudioInbox = {
  args: { heading: 'Requests in, work out, every week', lede: 'How a small studio runs its client work from one inbox.', steps: FOUR },
  render: (args) => `<div style="margin: 3rem auto; --lw-sticky-scroll-steps-height: 28rem"><lw-sticky-scroll-steps ${attributes(args)}></lw-sticky-scroll-steps></div>`,
};
