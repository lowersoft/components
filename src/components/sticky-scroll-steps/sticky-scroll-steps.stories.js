import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const FOUR = JSON.stringify([
  { id: 'forward', title: 'Forward the request', body: 'Clients email the shared address, and every request lands as a task with its files attached.', points: ['One address for every client'], mockup: 'inbox' },
  { id: 'schedule', title: 'Fit it into the week', body: 'Drop it on a day, and the planner warns you before a day overflows.', points: ['Warnings, not surprises'], mockup: 'planner' },
  { id: 'deliver', title: 'Deliver and close', body: 'Mark it done, and the client gets the files and a short note in one email.', mockup: 'inbox' },
  { id: 'look-back', title: 'Look back on Friday', body: 'See the week’s throughput, what slipped and why, before you plan the next one.', points: ['Trends across the quarter'], mockup: 'review' },
]);

export default {
  title: 'How It Works/Sticky Scroll Steps',
  component: 'lw-sticky-scroll-steps',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="margin: 3rem auto 50vh"><lw-sticky-scroll-steps ${attributes(args)}></lw-sticky-scroll-steps></div>`,
  args: {},
};

// Scroll the page: the screen stays beside the steps and changes to the one crossing the middle.
export const Default = {};

// Four steps for a studio inbox, with its own address in the screen's bar.
export const StudioInbox = {
  args: { heading: 'Requests in, work out, every week', lede: 'How a small studio runs its client work from one inbox.', address: 'studio.lowersoft.com', steps: FOUR },
};
