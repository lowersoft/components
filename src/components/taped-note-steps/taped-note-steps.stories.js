import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const HIRING = JSON.stringify([
  { id: 'apply', body: 'Send a CV and two lines on why this role.', tone: 'mint', rotate: 3, tapeRotate: -1 },
  { id: 'call', body: 'Thirty minutes with the hiring manager.', tone: 'cyan', rotate: -4, tapeRotate: 1.5 },
  { id: 'task', body: 'A small piece of real work, paid for.', tone: 'gold', rotate: 2, tapeRotate: -2 },
  { id: 'team', body: 'An easy hour with your future teammates.', tone: 'rose', rotate: -3, tapeRotate: 1 },
  { id: 'offer', body: 'A written offer within three working days.', tone: 'mint', rotate: -2, tapeRotate: 2 },
  { id: 'laptop', body: 'Your laptop ships the week you sign.', tone: 'cyan', rotate: 4, tapeRotate: -1.5 },
  { id: 'buddy', body: 'A buddy to show you round in week one.', tone: 'gold', rotate: -3, tapeRotate: 1 },
  { id: 'review', body: 'A first review together at thirty days.', tone: 'rose', rotate: 2, tapeRotate: -2 },
]);

export default {
  title: 'Sections/How It Works/Taped Note Steps',
  component: 'lw-taped-note-steps',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="margin: 3rem auto"><lw-taped-note-steps ${attributes(args)}></lw-taped-note-steps></div>`,
  args: {},
};

// Four notes, each tilted its own way and held up by torn tape.
export const Default = {};

// Eight notes, two full rows, on a tinted page so the white frames stand out.
export const Hiring = {
  args: { heading: 'From application to first month', lede: 'Every step, and what happens at it, before you even apply.', notes: HIRING },
  render: (args) => `<div style="margin: 0 -1rem; padding: 4rem 1rem; background: color-mix(in oklab, var(--lw-color-foreground) 4%, var(--lw-color-background))"><lw-taped-note-steps ${attributes(args)}></lw-taped-note-steps></div>`,
};
