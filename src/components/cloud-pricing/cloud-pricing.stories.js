import { attributes } from '../../../.storybook/attributes.js';
import './index.js';

const FOUR = JSON.stringify([
  { id: 'starter', name: 'Starter', tagline: 'For a first trip.', monthly: 0, yearly: 0, action: 'Start free', features: ['3 saved trips', 'Offline maps', 'Weather alerts'] },
  { id: 'explorer', name: 'Explorer', tagline: 'For weekends away.', monthly: 8, yearly: 6, action: 'Get Explorer', features: ['Unlimited trips', 'Route planning', 'Live sharing'] },
  { id: 'voyager', name: 'Voyager', tagline: 'For a life on the road.', monthly: 16, yearly: 12, action: 'Get Voyager', featured: true, badge: 'Best value', features: ['Everything in Explorer', 'Satellite layers', 'Trip journal', 'Priority support'] },
]);

export default {
  title: 'Sections/Pricing/Plans/Cloud Pricing',
  component: 'lw-cloud-pricing',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    billing: { control: 'inline-radio', options: ['monthly', 'yearly'] },
    speed: { control: { type: 'range', min: 0, max: 4, step: 0.25 } },
  },
  render: (args) => `<lw-cloud-pricing ${attributes(args)}></lw-cloud-pricing>`,
  args: { billing: 'monthly', speed: 1 },
};

// Switch to yearly and every price rolls, the monthly one struck beside it; the clouds drift behind the glass.
export const Default = {};

// Yearly first, the featured plan last, the sky drifting at half speed.
export const SlowDrift = {
  args: { heading: 'Plan the trip, not the budget', description: 'Every plan works offline, anywhere you go.', note: 'Prices in USD. Change or cancel your plan from the app at any time.', billing: 'yearly', speed: 0.5, plans: FOUR },
};
