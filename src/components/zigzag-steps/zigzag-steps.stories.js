import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const ONBOARDING = JSON.stringify([
  { id: 'audit', duration: '1 week', title: 'Audit', description: 'Recorded twenty first sessions and marked every place people dropped off.', icon: 'research', tone: 'ink' },
  { id: 'flows', duration: '3 weeks', title: 'New flows', description: 'Cut sign-up from nine screens to four and moved payroll import to day two.', icon: 'design', tone: 'accent' },
  { id: 'testing', duration: '2 weeks', title: 'Testing', description: 'Put the flow in front of new customers using their own payroll data.', icon: 'prototype', tone: 'ink' },
  { id: 'launch', duration: '1 week', title: 'Launch', description: 'Released to every account behind a staged rollout over five days.', icon: 'delivery', tone: 'accent' },
]);

export default {
  title: 'Sections/How It Works/Zigzag Steps',
  component: 'lw-zigzag-steps',
  parameters: { layout: 'padded' },
  render: (args) => `<div style="margin: 3rem auto"><lw-zigzag-steps ${attributes(args)}></lw-zigzag-steps></div>`,
  args: {},
};

// Four phases zigzag down the page, each card's duration printed down its tab.
export const Default = {};

// A case study told by quarter, the phases toned the other way round.
export const CaseStudy = {
  args: { eyebrow: 'Case study', heading: 'Rebuilding onboarding for a payroll app', lede: 'Seven weeks from the first recorded session to every account on the new flow.', start: 'Q1 2026', end: 'Q2 2026', steps: ONBOARDING },
};
