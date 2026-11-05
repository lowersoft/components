import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const PLANS = JSON.stringify([
  { id: 'free', name: 'Free', price: '$0', cadence: 'forever', action: 'Start free' },
  { id: 'pro', name: 'Pro', price: '$16', cadence: 'per month', action: 'Go Pro', featured: true },
  { id: 'team', name: 'Team', price: '$40', cadence: 'per month', action: 'Start Team' },
]);

const ROWS = JSON.stringify([
  { id: 'projects', label: 'Projects', values: { free: '3', pro: 'Unlimited', team: 'Unlimited' } },
  { id: 'history', label: 'Version history', values: { free: false, pro: '30 days', team: '1 year' } },
  { id: 'roles', label: 'Admin roles', values: { free: false, pro: false, team: true } },
]);

export default {
  title: 'Comparisons/Compare Plans',
  component: 'lw-compare-plans',
  parameters: { layout: 'fullscreen' },
  render: (args) => `<lw-compare-plans ${attributes(args)}></lw-compare-plans>`,
  argTypes: {
    accent: { name: 'Accent', control: 'color' },
  },
  args: {},
};

// Three plans in a compact sheet; the featured one is in the accent color.
export const Default = {};

// A short sheet with your own plans and a teal accent.
export const Short = {
  render: (args) => `<lw-compare-plans ${attributes(args)} lede=""></lw-compare-plans>`,
  args: { heading: 'Choose your plan', plans: PLANS, rows: ROWS, accent: '#0d9488' },
};
